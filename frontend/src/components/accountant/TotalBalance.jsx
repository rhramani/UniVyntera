import { Card, Col, Row, Form, Button, Modal } from "react-bootstrap";
import usePermissions from "../commonComponents/usePermissions";
import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  createTransfer,
  getAllTotalBankCash,
  getFundTransferHistory,
} from "../../redux/actions/Accountant/GenerateInvoice.action";
import Pageheader from "../../layouts/Pageheader";
import Calendar from "react-calendar";
import Select from "react-select";
import { MdCalendarToday } from "react-icons/md";
import { decryptData } from "../../utils/encryptionUtils";
import getSymbolFromCurrency from "currency-symbol-map";
import DataTable from "../commonComponents/DataTable";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import Paginations from "../elements/Paginations";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { AiOutlineClose } from "react-icons/ai";

const formatDate = (date) => {
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const parseDate = (dateStr) => {
  if (!dateStr) return null;
  if (dateStr.includes("/")) {
    const [day, month, year] = dateStr.split("/");
    return new Date(`${year}-${month}-${day}`);
  }
  if (dateStr.includes("-")) {
    return new Date(dateStr);
  }
  return null;
};

const toISODate = (date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const TotalBalance = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [totalDueAmount, setTotalDueAmount] = useState(0);
  const [bankwiseTotals, setBankwiseTotals] = useState([]);
  const { canRead } = usePermissions("Total Balance");

  // Filters for balance summary
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });
  const [startDateValue, setStartDateValue] = useState(null);
  const [endDateValue, setEndDateValue] = useState(null);
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [showTransactionDateCalendar, setShowTransactionDateCalendar] =
    useState(false);
  const [transactionDateValue, setTransactionDateValue] = useState(null);

  const startDateInputRef = useRef(null);
  const endDateInputRef = useRef(null);
  const startDateCalenderRef = useRef(null);
  const endDateCalenderRef = useRef(null);
  const transactionDateInputRef = useRef(null);
  const transactionDateCalenderRef = useRef(null);
  const storedEncryptedCurrency = decryptData(
    localStorage.getItem("crmCurrency"),
  );

  // Modal states
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [fundTransferHistory, setFundTransferHistory] = useState([]);
  const [historyStartDateValue, setHistoryStartDateValue] = useState(null);
  const [historyEndDateValue, setHistoryEndDateValue] = useState(null);
  const [showHistoryStartDateCalendar, setShowHistoryStartDateCalendar] =
    useState(false);
  const [showHistoryEndDateCalendar, setShowHistoryEndDateCalendar] =
    useState(false);
  const historyStartDateInputRef = useRef(null);
  const historyEndDateInputRef = useRef(null);
  const historyStartDateCalenderRef = useRef(null);
  const historyEndDateCalenderRef = useRef(null);
  const [historyFilters, setHistoryFilters] = useState({
    startDate: "",
    endDate: "",
  });

  const bankOptions = bankwiseTotals.map((bank) => ({
    value: bank.bankId,
    label: bank.bankName || "Unknown Bank",
  }));

  const transactionTypeOptions = [
    { value: "BankToCash", label: "Bank to Cash" },
    { value: "CashToBank", label: "Cash to Bank" },
  ];

  const fetchTotalBankCash = useCallback(
    async (startDate = filters.startDate, endDate = filters.endDate) => {
      try {
        if (canRead) {
          const res = await dispatch(getAllTotalBankCash(startDate, endDate));
          setTotalPaidAmount(res?.data?.data?.bankBalance || 0);
          setTotalDueAmount(res?.data?.data?.cashBalance || 0);
          setBankwiseTotals(res?.data?.data?.bankwiseTotals || []);
        }
      } catch (error) {
        console.error("Error fetching total bank cash:", error);
        toast.error("Failed to fetch balance data");
      }
    },
    [canRead, dispatch, filters.startDate, filters.endDate],
  );

  const formik = useFormik({
    initialValues: {
      fromType: "",
      date: "",
      bank: "",
      amount: "",
      fundTransfer: "",
    },
    validationSchema: Yup.object({
      fromType: Yup.string().required("Transaction Type is required"),
      date: Yup.string().required("Date is required"),
      bank: Yup.string().required("Bank selection is required"),
      amount: Yup.number()
        .required("Amount is required")
        .positive("Amount must be positive"),
      fundTransfer: Yup.mixed().nullable(),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        toast.dismiss();

        const formData = new FormData();
        formData.append("fromType", values.fromType);
        formData.append("date", values.date);
        formData.append("bank", values.bank);
        formData.append("amount", values.amount);
        if (values.fundTransfer) {
          formData.append("fundTransfer", values.fundTransfer);
        }
        await dispatch(createTransfer(formData));

        resetForm();
        setTransactionDateValue(null);
        setShowTransactionDateCalendar(false);
        setShow(false);
        fetchTotalBankCash(filters.startDate, filters.endDate);
        toast.success("Fund transfer successfully");
      } catch (error) {
        console.error("Error submitting transaction:", error);
        toast.error(
          error?.response?.data?.message || "Failed to submit transaction",
        );
      }
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue("fundTransfer", file);
  };

  useEffect(() => {
    fetchTotalBankCash();
  }, [fetchTotalBankCash]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const fetchFundTransferHistory = useCallback(
    async (
      page = 1,
      limit = itemsPerPage,
      startDate = historyFilters.startDate,
      endDate = historyFilters.endDate,
    ) => {
      try {
        const res = await dispatch(
          getFundTransferHistory(page, limit, startDate, endDate),
        );
        setFundTransferHistory(res?.data?.data?.data || []);
        setTotalPages(res?.data?.data?.totalPages || 0);
      } catch (error) {
        console.error("Error fetching fund transfer history:", error);
        toast.error("Failed to fetch fund transfer history");
      }
    },
    [dispatch, itemsPerPage, historyFilters.startDate, historyFilters.endDate],
  );

  // Fetch history when history modal opens or filters/page change
  useEffect(() => {
    if (showHistoryModal) {
      fetchFundTransferHistory(currentPage);
    }
  }, [currentPage, showHistoryModal, fetchFundTransferHistory]);

  const columns = [
    {
      key: "fromType",
      label: "Transaction Type",
    },
    {
      key: "date",
      label: "Date",
      render: (item) => formatDate(parseDate(item.date)) || "-",
    },
    {
      key: "bank",
      label: "Bank",
      render: (item) =>
        bankwiseTotals.find((b) => b.bankId === item.bank)?.bankName ||
        "Unknown Bank",
    },
    {
      key: "amount",
      label: "Amount",
      render: (item) =>
        `${
          storedEncryptedCurrency
            ? getSymbolFromCurrency(storedEncryptedCurrency)
            : "₹"
        } ${new Intl.NumberFormat().format(item.amount || 0)}`,
    },
    {
      label: "Proof",
      render: (item) =>
        item?.proof ? (
          <button
            className="btn btn-sm btn-primary fw-normal d-flex align-items-center justify-content-center rounded-4"
            style={{
              cursor: "pointer",
              height: "32px",
              color: "#6259CA",
              width: "70px",
              fontSize: "14px",
            }}
            onClick={() => {
              window.open(item.proof, "_blank", "noopener,noreferrer");
            }}
          >
            <VisibilityIcon className="me-1" style={{ fontSize: "16px" }} />
            View
          </button>
        ) : (
          "-"
        ),
    },
    {
      key: "createdByName",
      label: "Created By",
      render: (item) => item.createdByName || "-",
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (item) => formatDate(parseDate(item.createdAt)) || "-",
    },
  ];

  // Click outside handlers (unchanged)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        startDateInputRef.current &&
        !startDateInputRef.current.contains(event.target) &&
        startDateCalenderRef.current &&
        !startDateCalenderRef.current.contains(event.target)
      ) {
        setShowStartDateCalendar(false);
      }
      if (
        endDateInputRef.current &&
        !endDateInputRef.current.contains(event.target) &&
        endDateCalenderRef.current &&
        !endDateCalenderRef.current.contains(event.target)
      ) {
        setShowEndDateCalendar(false);
      }
      if (
        transactionDateInputRef.current &&
        !transactionDateInputRef.current.contains(event.target) &&
        transactionDateCalenderRef.current &&
        !transactionDateCalenderRef.current.contains(event.target)
      ) {
        setShowTransactionDateCalendar(false);
      }
      if (
        historyStartDateInputRef.current &&
        !historyStartDateInputRef.current.contains(event.target) &&
        historyStartDateCalenderRef.current &&
        !historyStartDateCalenderRef.current.contains(event.target)
      ) {
        setShowHistoryStartDateCalendar(false);
      }
      if (
        historyEndDateInputRef.current &&
        !historyEndDateInputRef.current.contains(event.target) &&
        historyEndDateCalenderRef.current &&
        !historyEndDateCalenderRef.current.contains(event.target)
      ) {
        setShowHistoryEndDateCalendar(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [
    startDateInputRef,
    endDateInputRef,
    transactionDateInputRef,
    historyStartDateInputRef,
    historyEndDateInputRef,
  ]);

  const handleShow = () => {
    setShow(true);
    formik.resetForm();
  };
  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      <style>
        {`
          .total-balance-container {
            padding: 16px 20px;
            background-color: #f8fafc;
          }
          .custom-card-main {
            border: none;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            background-color: #ffffff;
            margin-bottom: 20px;
          }
          .balance-widget {
            border-radius: 12px;
            padding: 1.25rem;
            transition: all 0.2s ease;
            border: 1px solid #e2e8f0;
            height: 100%;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .balance-widget:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          }
          .widget-bank { border-top: 4px solid #6366f1; }
          .widget-cash { border-top: 4px solid #f59e0b; }
          .widget-bank-item {  padding: 1rem; flex-direction: row; text-align: left; align-items: center; }
          
          .widget-icon-bg {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
            font-size: 24px;
          }
          .bg-bank-icon { background: #eef2ff; color: #4f46e5; }
          .bg-cash-icon { background: #fffbeb; color: #d97706; }
          .bg-bank-item-icon { background: #f0fdf4; color: #16a34a; }

          .widget-label { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: #33363a9c; margin-bottom: 0.5rem; }
          .widget-amount { font-size: 1.75rem; font-weight: 800; color: #232b38e3; margin-bottom: 0; }
          
          .action-btn-hub {
            padding: 0.6rem 1.5rem;
            border-radius: 10px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s;
            font-size: 0.9rem;
          }
          .btn-record { background-color: #6366f1; border: none; color: white; }
          .btn-record:hover { background-color: #4f46e5; transform: translateY(-1px); }
          .btn-history { background-color: white; border: 1px solid #e2e8f0; color: #475569; }
          .btn-history:hover { background-color: #f8fafc; border-color: #cbd5e1; color: #1e293b; }

          .form-label-custom { font-weight: 600; color: #475569; margin-bottom: 0.5rem; font-size: 0.85rem; }
          .custom-input { border-radius: 8px; border: 1px solid #e2e8f0; padding: 0.6rem 1rem; height: 42px; font-size: 0.9rem; }
          
          .bank-grid-title {
            padding-bottom: 15px;
            margin-bottom: 20px;
            font-weight: 700;
            font-size: 1.1rem;
            color: #21252ccc;
            text-align: center;
            position: relative;
           }

           .bank-grid-title::after {
            content: "";
            position: absolute;
            bottom: 0;         
            left: 50%;         
            transform: translateX(-50%);
            width: 80px;       
            height: 3px;     
            background-color: #5d54be;
            border-radius: 2px; 
           }
          .calendar-popup {
            position: absolute; top: 100%; left: 0; z-index: 9999; background: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-radius: 12px; margin-top: 8px; width: 300px; overflow: hidden; border: 1px solid #edf2f7;
          }
          
          .modal-tab-btn:hover:not(.active) {
            background: #e2e8f0;
            color: #1e293b;
          }
        `}
      </style>
      <Pageheader
        mainheading="Total Balance"
        parentfolder="Accountant"
        activepage="Total Balance"
      />

      <div className="total-balance-container">
        <Row className="mb-4">
          <Col md={12}>
            <Card className="custom-card-main">
              <Card.Header className="bg-white border-0 d-flex flex-wrap justify-content-end align-items-center py-3 px-4">
                {/* <h5 className="fw-bold m-0 text-dark">total balance history</h5> */}
                <div className="d-flex flex-wrap gap-3 align-items-end">
                  {/* Start Date */}
                  <div className="filter-item">
                    <Form.Label className="form-label-custom mb-1">
                      Start Date
                    </Form.Label>
                    <div style={{ position: "relative", width: "160px" }}>
                      <Form.Control
                        type="text"
                        className="custom-input bg-white"
                        placeholder="dd/mm/yyyy"
                        value={
                          filters.startDate
                            ? formatDate(parseDate(filters.startDate))
                            : ""
                        }
                        readOnly
                        ref={startDateInputRef}
                        onClick={() => {
                          if (filters.startDate)
                            setStartDateValue(parseDate(filters.startDate));
                          setShowStartDateCalendar((show) => !show);
                        }}
                        style={{ cursor: "pointer" }}
                      />
                      <MdCalendarToday
                        className="text-muted"
                        style={{
                          position: "absolute",
                          right: 12,
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                        }}
                      />
                      {showStartDateCalendar && (
                        <div
                          className="calendar-popup"
                          ref={startDateCalenderRef}
                        >
                          <Calendar
                            className="border-0 w-100"
                            onChange={(selectedDate) => {
                              setStartDateValue(selectedDate);
                              setFilters({
                                ...filters,
                                startDate: toISODate(selectedDate),
                              });
                              setShowStartDateCalendar(false);
                            }}
                            value={startDateValue}
                            locale="en-GB"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  {/* End Date */}
                  <div className="filter-item">
                    <Form.Label className="form-label-custom mb-1">
                      End Date
                    </Form.Label>
                    <div style={{ position: "relative", width: "160px" }}>
                      <Form.Control
                        type="text"
                        className="custom-input bg-white"
                        placeholder="dd/mm/yyyy"
                        value={
                          filters.endDate
                            ? formatDate(parseDate(filters.endDate))
                            : ""
                        }
                        readOnly
                        ref={endDateInputRef}
                        onClick={() => {
                          if (filters.endDate)
                            setEndDateValue(parseDate(filters.endDate));
                          setShowEndDateCalendar((show) => !show);
                        }}
                        style={{ cursor: "pointer" }}
                      />
                      <MdCalendarToday
                        className="text-muted"
                        style={{
                          position: "absolute",
                          right: 12,
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                        }}
                      />
                      {showEndDateCalendar && (
                        <div
                          className="calendar-popup"
                          style={{ right: 0, left: "auto" }}
                          ref={endDateCalenderRef}
                        >
                          <Calendar
                            className="border-0 w-100"
                            onChange={(selectedDate) => {
                              setEndDateValue(selectedDate);
                              setFilters({
                                ...filters,
                                endDate: toISODate(selectedDate),
                              });
                              setShowEndDateCalendar(false);
                            }}
                            value={endDateValue}
                            locale="en-GB"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Dashboard Actions */}
                  <div className="d-flex justify-content-end gap-3">
                    <Button
                      className="action-btn-hub btn-record"
                      onClick={handleShow}
                    >
                      Add Record Transaction
                    </Button>
                    <Button
                      className="action-btn-hub btn-history"
                      onClick={() => {
                        setShowHistoryModal(true);
                        setCurrentPage(1);
                        setHistoryFilters({ startDate: "", endDate: "" });
                      }}
                    >
                      <i className="bi bi-clock-history"></i>
                      Transfer History
                    </Button>
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="p-4 pt-0" style={{background:"transparent", border: "none", boxShadow:"none"}}>
                {canRead && (
                  <>
                    <Row className="g-4 mb-5 mt-3">
                      <Col md={6}>
                        <div
                          className="balance-widget widget-bank"
                          style={{ backgroundColor: "#5d54be7a" }}
                        >
                          <div className="widget-icon-bg bg-bank-icon">
                           <i className="bi bi-bank"></i> 
                          </div>
                          <div className="widget-label">
                            Virtual Bank Balance
                          </div>
                          <h2 className="widget-amount">
                            {storedEncryptedCurrency
                              ? getSymbolFromCurrency(storedEncryptedCurrency)
                              : "₹"}{" "}
                            {new Intl.NumberFormat().format(totalPaidAmount)}
                          </h2>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div
                          className="balance-widget widget-cash"
                          style={{ backgroundColor: "#f59f0b8a" }}
                        >
                          <div className="widget-icon-bg bg-cash-icon">
                            <i className="bi bi-wallet2"></i>
                          </div>
                          <div className="widget-label">
                            Physical Cash Balance
                          </div>
                          <h2 className="widget-amount">
                            {storedEncryptedCurrency
                              ? getSymbolFromCurrency(storedEncryptedCurrency)
                              : "₹"}{" "}
                            {new Intl.NumberFormat().format(totalDueAmount)}
                          </h2>
                        </div>
                      </Col>
                    </Row>

                    <div className="mt-2">
                      <h5 className="bank-grid-title">
                        Bank-Wise Liquidity Breakdown
                      </h5>
                      <Row className="g-3 d-flex flex-wrap justify-content-center align-items-center ">
                        {bankwiseTotals.map((bank, index) => (
                          <Col key={index} sm={6} md={4} lg={3}>
                            <div className="balance-widget widget-bank-item bg-success">
                              <div
                                className="widget-icon-bg bg-bank-item-icon mb-0 me-3"
                                style={{ width: 40, height: 40, fontSize: 18 }}
                              >
                                <i className="bi bi-bank"></i>
                              </div>
                              <div className="overflow-hidden">
                                <div className="text small fw-bold text-uppercase text-truncate">
                                  {bank.bankName || "Unknown Bank"}
                                </div>
                                <h5
                                  className="fw-bold mb-0 "
                                  style={{ fontSize: "1.2rem" }}
                                >
                                  {storedEncryptedCurrency
                                    ? getSymbolFromCurrency(
                                        storedEncryptedCurrency,
                                      )
                                    : "₹"}{" "}
                                  {new Intl.NumberFormat().format(
                                    bank.totalAmount || 0,
                                  )}
                                </h5>
                              </div>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Add Record Transaction Modal */}
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header className="form-main-heading">
          <Modal.Title>Add Record Transaction</Modal.Title>
          <AiOutlineClose onClick={handleClose} style={{ cursor: "pointer" }} />
        </Modal.Header>
        <Modal.Body className="p-4">
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <Form onSubmit={formik.handleSubmit}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="form-label-custom">
                      Transaction Type
                    </Form.Label>
                    <Select
                      options={transactionTypeOptions}
                      value={
                        transactionTypeOptions.find(
                          (opt) => opt.value === formik.values.fromType,
                        ) || null
                      }
                      onChange={(opt) =>
                        formik.setFieldValue("fromType", opt ? opt.value : "")
                      }
                      placeholder="Select Type"
                      classNamePrefix="custom-select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: "10px",
                          border: "1px solid #e2e8f0",
                          minHeight: "45px",
                        }),
                      }}
                    />
                    {formik.touched.fromType && formik.errors.fromType && (
                      <div className="text-danger small mt-1">
                        {formik.errors.fromType}
                      </div>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="form-label-custom">
                      Transaction Date
                    </Form.Label>
                    <div style={{ position: "relative" }}>
                      <Form.Control
                        type="text"
                        className="custom-input"
                        style={{ height: "45px", borderRadius: "10px" }}
                        placeholder="dd/mm/yyyy"
                        value={
                          formik.values.date
                            ? formatDate(parseDate(formik.values.date))
                            : ""
                        }
                        readOnly
                        ref={transactionDateInputRef}
                        onClick={() => {
                          if (formik.values.date)
                            setTransactionDateValue(
                              parseDate(formik.values.date),
                            );
                          setShowTransactionDateCalendar(
                            !showTransactionDateCalendar,
                          );
                        }}
                      />
                      <MdCalendarToday
                        className="text-muted"
                        style={{
                          position: "absolute",
                          right: 12,
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                        }}
                      />
                      {showTransactionDateCalendar && (
                        <div
                          className="calendar-popup"
                          ref={transactionDateCalenderRef}
                        >
                          <Calendar
                            className="border-0 w-100"
                            onChange={(date) => {
                              setTransactionDateValue(date);
                              formik.setFieldValue("date", toISODate(date));
                              setShowTransactionDateCalendar(false);
                            }}
                            value={transactionDateValue}
                            locale="en-GB"
                          />
                        </div>
                      )}
                    </div>
                    {formik.touched.date && formik.errors.date && (
                      <div className="text-danger small mt-1">
                        {formik.errors.date}
                      </div>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="form-label-custom">
                      Select Bank
                    </Form.Label>
                    <Select
                      options={bankOptions}
                      value={
                        bankOptions.find(
                          (opt) => opt.value === formik.values.bank,
                        ) || null
                      }
                      onChange={(opt) =>
                        formik.setFieldValue("bank", opt ? opt.value : "")
                      }
                      placeholder="Select Bank"
                      classNamePrefix="custom-select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: "10px",
                          border: "1px solid #e2e8f0",
                          minHeight: "45px",
                        }),
                      }}
                    />
                    {formik.touched.bank && formik.errors.bank && (
                      <div className="text-danger small mt-1">
                        {formik.errors.bank}
                      </div>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="form-label-custom">
                      Amount
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="amount"
                      value={formik.values.amount}
                      onChange={formik.handleChange}
                      className="custom-input"
                      style={{ height: "45px", borderRadius: "10px" }}
                      placeholder="Enter amount"
                    />
                    {formik.touched.amount && formik.errors.amount && (
                      <div className="text-danger small mt-1">
                        {formik.errors.amount}
                      </div>
                    )}
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="form-label-custom">
                      Upload Proof
                    </Form.Label>
                    <Form.Control
                      type="file"
                      className="custom-input"
                      style={{ height: "45px", borderRadius: "10px" }}
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </Form.Group>
                </Col>

                <Col md={12} className="text-end mt-4">
                  <Button
                    variant="light"
                    className="me-2 fw-semibold px-4"
                    onClick={handleClose}
                    style={{ borderRadius: "10px", height: "45px" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="btn-record px-5 fw-semibold"
                    style={{ borderRadius: "10px", height: "45px" }}
                    disabled={formik.isSubmitting}
                  >
                    {formik.isSubmitting
                      ? "Processing..."
                      : "Submit Transaction"}
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </Modal.Body>
      </Modal>

      {/* Fund Transfer History Modal */}
      <Modal
        show={showHistoryModal}
        onHide={() => setShowHistoryModal(false)}
        size="xl"
        centered
        backdrop="static"
      >
        <Modal.Header className="form-main-heading">
          <Modal.Title>Fund Transfer History</Modal.Title>
          <AiOutlineClose
            onClick={() => setShowHistoryModal(false)}
            style={{ cursor: "pointer" }}
          />
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="fade-in">
            <Row className="mb-4 g-3 align-items-end px-2">
              <Col md={3}>
                <Form.Label className="form-label-custom">
                  Start Date
                </Form.Label>
                <div style={{ position: "relative" }}>
                  <Form.Control
                    type="text"
                    className="custom-input bg-white"
                    placeholder="dd/mm/yyyy"
                    value={
                      historyFilters.startDate
                        ? formatDate(parseDate(historyFilters.startDate))
                        : ""
                    }
                    readOnly
                    ref={historyStartDateInputRef}
                    onClick={() => {
                      if (historyFilters.startDate)
                        setHistoryStartDateValue(
                          parseDate(historyFilters.startDate),
                        );
                      setShowHistoryStartDateCalendar(
                        !showHistoryStartDateCalendar,
                      );
                    }}
                    style={{ cursor: "pointer" }}
                  />
                  <MdCalendarToday
                    className="text-muted"
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  />
                  {showHistoryStartDateCalendar && (
                    <div
                      className="calendar-popup"
                      ref={historyStartDateCalenderRef}
                    >
                      <Calendar
                        className="border-0 w-100"
                        onChange={(date) => {
                          setHistoryStartDateValue(date);
                          setHistoryFilters({
                            ...historyFilters,
                            startDate: toISODate(date),
                          });
                          setShowHistoryStartDateCalendar(false);
                        }}
                        value={historyStartDateValue}
                        locale="en-GB"
                      />
                    </div>
                  )}
                </div>
              </Col>
              <Col md={3}>
                <Form.Label className="form-label-custom">End Date</Form.Label>
                <div style={{ position: "relative" }}>
                  <Form.Control
                    type="text"
                    className="custom-input bg-white"
                    placeholder="dd/mm/yyyy"
                    value={
                      historyFilters.endDate
                        ? formatDate(parseDate(historyFilters.endDate))
                        : ""
                    }
                    readOnly
                    ref={historyEndDateInputRef}
                    onClick={() => {
                      if (historyFilters.endDate)
                        setHistoryEndDateValue(
                          parseDate(historyFilters.endDate),
                        );
                      setShowHistoryEndDateCalendar(
                        !showHistoryEndDateCalendar,
                      );
                    }}
                    style={{ cursor: "pointer" }}
                  />
                  <MdCalendarToday
                    className="text-muted"
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  />
                  {showHistoryEndDateCalendar && (
                    <div
                      className="calendar-popup"
                      ref={historyEndDateCalenderRef}
                    >
                      <Calendar
                        className="border-0 w-100"
                        onChange={(date) => {
                          setHistoryEndDateValue(date);
                          setHistoryFilters({
                            ...historyFilters,
                            endDate: toISODate(date),
                          });
                          setShowHistoryEndDateCalendar(false);
                        }}
                        value={historyEndDateValue}
                        locale="en-GB"
                      />
                    </div>
                  )}
                </div>
              </Col>
              <Col md={3}>
                <Form.Label className="form-label-custom">
                  Rows Per Page
                </Form.Label>
                <ItemsPerPageSelect
                  itemsPerPage={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                />
              </Col>
            </Row>

            <div className="table-responsive rounded-3 border">
              <DataTable
                columns={columns}
                data={fundTransferHistory}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                actionView={false}
              />
            </div>

            {totalPages > 1 && fundTransferHistory?.length > 0 && (
              <div className="d-flex justify-content-end align-items-center mt-3">
                <Paginations
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            className="custom-select-height"
            onClick={() => setShowHistoryModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* {add fund modal} */}
    </>
  );
};

export default TotalBalance;
