import { Card, Col, Row, Form, Button, Modal } from "react-bootstrap";
import usePermissions from "../commonComponents/usePermissions";
import { useEffect, useState, useRef } from "react";
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
    localStorage.getItem("crmCurrency")
  );

  // History modal and data
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

  const fetchTotalBankCash = async (
    startDate = filters.startDate,
    endDate = filters.endDate
  ) => {
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
  };

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
        fetchTotalBankCash(filters.startDate, filters.endDate);
        toast.success("Fund transfer successfully");
      } catch (error) {
        console.error("Error submitting transaction:", error);
        toast.error(
          error?.response?.data?.message || "Failed to submit transaction"
        );
      }
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue("fundTransfer", file);
  };

  useEffect(() => {
    fetchTotalBankCash(filters.startDate, filters.endDate);
  }, [filters]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const fetchFundTransferHistory = async (
    page = 1,
    limit = itemsPerPage,
    startDate = historyFilters.startDate,
    endDate = historyFilters.endDate
  ) => {
    try {
      const res = await dispatch(
        getFundTransferHistory(page, limit, startDate, endDate)
      );
      setFundTransferHistory(res?.data?.data?.data || []);
      setTotalPages(res?.data?.data?.totalPages || 0);
    } catch (error) {
      console.error("Error fetching fund transfer history:", error);
      toast.error("Failed to fetch fund transfer history");
    }
  };

  // Fetch history when modal opens or filters/page change
  useEffect(() => {
    if (showHistoryModal) {
      fetchFundTransferHistory(
        currentPage,
        itemsPerPage,
        historyFilters.startDate,
        historyFilters.endDate
      );
    }
  }, [currentPage, itemsPerPage, historyFilters, showHistoryModal]);

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

  return (
    <>
      <Pageheader
        mainheading="Total Balance"
        parentfolder="Accountant"
        activepage="Total Balance"
      />

      <Row className="mt-3">
        <Col md={12}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white border-0 d-flex flex-wrap justify-content-between align-items-center">
              <h4 className="fw-bold m-0">Total Balance Summary</h4>
              <div className="d-flex flex-wrap gap-3">
                <div className="filter-item">
                  <Form.Label className="me-2">Start Date</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      className="filter-height"
                      placeholder="dd/mm/yyyy"
                      value={
                        filters.startDate
                          ? formatDate(parseDate(filters.startDate))
                          : ""
                      }
                      readOnly
                      ref={startDateInputRef}
                      onClick={() => {
                        if (filters.startDate) {
                          setStartDateValue(parseDate(filters.startDate));
                        }
                        setShowStartDateCalendar((show) => !show);
                      }}
                      style={{ cursor: "pointer", backgroundColor: "#fff" }}
                    />
                    {filters.startDate ? (
                      <button
                        type="button"
                        onClick={() => {
                          setFilters({ ...filters, startDate: "" });
                          setStartDateValue(null);
                          setShowStartDateCalendar(false);
                        }}
                        style={{
                          position: "absolute",
                          right: 8,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 16,
                          color: "#888",
                          padding: 0,
                          zIndex: 10000,
                        }}
                        aria-label="Clear date"
                      >
                        ×
                      </button>
                    ) : (
                      <MdCalendarToday
                        style={{
                          position: "absolute",
                          right: 10,
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#888",
                          pointerEvents: "none",
                        }}
                        size={20}
                      />
                    )}
                    {showStartDateCalendar && (
                      <div
                        ref={startDateCalenderRef}
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "0",
                          zIndex: 9999,
                          background: "#fff",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                          borderRadius: "8px",
                          marginTop: "4px",
                          width: 300,
                        }}
                      >
                        <Calendar
                          className="form-control m-0 p-0 border-0"
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
                <div className="filter-item">
                  <Form.Label className="me-2">End Date</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      className="filter-height"
                      placeholder="dd/mm/yyyy"
                      value={
                        filters.endDate
                          ? formatDate(parseDate(filters.endDate))
                          : ""
                      }
                      readOnly
                      ref={endDateInputRef}
                      onClick={() => {
                        if (filters.endDate) {
                          setEndDateValue(parseDate(filters.endDate));
                        }
                        setShowEndDateCalendar((show) => !show);
                      }}
                      style={{ cursor: "pointer", backgroundColor: "#fff" }}
                    />
                    {filters.endDate ? (
                      <button
                        type="button"
                        onClick={() => {
                          setFilters({ ...filters, endDate: "" });
                          setEndDateValue(null);
                          setShowEndDateCalendar(false);
                        }}
                        style={{
                          position: "absolute",
                          right: 8,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 16,
                          color: "#888",
                          padding: 0,
                          zIndex: 10000,
                        }}
                        aria-label="Clear date"
                      >
                        ×
                      </button>
                    ) : (
                      <MdCalendarToday
                        style={{
                          position: "absolute",
                          right: 10,
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#888",
                          pointerEvents: "none",
                        }}
                        size={20}
                      />
                    )}
                    {showEndDateCalendar && (
                      <div
                        ref={endDateCalenderRef}
                        style={{
                          position: "absolute",
                          top: "100%",
                          right: "0",
                          zIndex: 9999,
                          background: "#fff",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                          borderRadius: "8px",
                          marginTop: "4px",
                          width: 300,
                        }}
                      >
                        <Calendar
                          className="form-control m-0 p-0 border-0"
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
              </div>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={12}>
                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white border-1 text-center">
                      <h5 className="fw-bold">Record Transaction</h5>
                    </Card.Header>
                    <Card.Body>
                      <Form onSubmit={formik.handleSubmit}>
                        <Row>
                          <Col sm={6} md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label>Transaction Type</Form.Label>
                              <Select
                                options={transactionTypeOptions}
                                value={
                                  transactionTypeOptions.find(
                                    (option) =>
                                      option.value === formik.values.fromType
                                  ) || null
                                }
                                onChange={(option) =>
                                  formik.setFieldValue(
                                    "fromType",
                                    option ? option.value : ""
                                  )
                                }
                                placeholder="Select Transaction Type"
                                classNamePrefix="custom-select"
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    minHeight: "38px",
                                    fontSize: "13px",
                                  }),
                                }}
                                isSearchable
                                isClearable
                              />
                              {formik.touched.fromType &&
                                formik.errors.fromType && (
                                  <div className="text-danger mt-1">
                                    {formik.errors.fromType}
                                  </div>
                                )}
                            </Form.Group>
                          </Col>
                          <Col sm={6} md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label>Date</Form.Label>
                              <div style={{ position: "relative" }}>
                                <Form.Control
                                  type="text"
                                  name="date"
                                  value={
                                    formik.values.date
                                      ? formatDate(
                                          parseDate(formik.values.date)
                                        )
                                      : ""
                                  }
                                  readOnly
                                  ref={transactionDateInputRef}
                                  onClick={() => {
                                    if (formik.values.date) {
                                      setTransactionDateValue(
                                        parseDate(formik.values.date)
                                      );
                                    }
                                    setShowTransactionDateCalendar(
                                      (show) => !show
                                    );
                                  }}
                                  className="custom-select-height"
                                  placeholder="dd/mm/yyyy"
                                  style={{
                                    cursor: "pointer",
                                    backgroundColor: "#fff",
                                  }}
                                />
                                {formik.values.date ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      formik.setFieldValue("date", "");
                                      setTransactionDateValue(null);
                                      setShowTransactionDateCalendar(false);
                                    }}
                                    style={{
                                      position: "absolute",
                                      right: 8,
                                      top: "50%",
                                      transform: "translateY(-50%)",
                                      background: "transparent",
                                      border: "none",
                                      cursor: "pointer",
                                      fontSize: 16,
                                      color: "#888",
                                      padding: 0,
                                      zIndex: 10000,
                                    }}
                                    aria-label="Clear date"
                                  >
                                    ×
                                  </button>
                                ) : (
                                  <MdCalendarToday
                                    style={{
                                      position: "absolute",
                                      right: 10,
                                      top: "50%",
                                      transform: "translateY(-50%)",
                                      color: "#888",
                                      pointerEvents: "none",
                                    }}
                                    size={20}
                                  />
                                )}
                                {showTransactionDateCalendar && (
                                  <div
                                    ref={transactionDateCalenderRef}
                                    style={{
                                      position: "absolute",
                                      top: "100%",
                                      left: "0",
                                      zIndex: 9999,
                                      background: "#fff",
                                      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                                      borderRadius: "8px",
                                      marginTop: "4px",
                                      width: 300,
                                    }}
                                  >
                                    <Calendar
                                      className="form-control m-0 p-0 border-0"
                                      onChange={(selectedDate) => {
                                        setTransactionDateValue(selectedDate);
                                        formik.setFieldValue(
                                          "date",
                                          toISODate(selectedDate)
                                        );
                                        setShowTransactionDateCalendar(false);
                                      }}
                                      value={transactionDateValue}
                                      locale="en-GB"
                                    />
                                  </div>
                                )}
                              </div>
                              {formik.touched.date && formik.errors.date && (
                                <div className="text-danger mt-1">
                                  {formik.errors.date}
                                </div>
                              )}
                            </Form.Group>
                          </Col>
                          <Col sm={6} md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label>Select Bank</Form.Label>
                              <Select
                                options={bankOptions}
                                value={
                                  bankOptions.find(
                                    (option) =>
                                      option.value === formik.values.bank
                                  ) || null
                                }
                                onChange={(option) => {
                                  formik.setFieldValue(
                                    "bank",
                                    option ? option.value : ""
                                  );
                                }}
                                placeholder="Select Bank"
                                classNamePrefix="custom-select"
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    minHeight: "38px",
                                    fontSize: "13px",
                                  }),
                                }}
                                isSearchable
                                isClearable
                              />
                              {formik.touched.bank && formik.errors.bank && (
                                <div className="text-danger mt-1">
                                  {formik.errors.bank}
                                </div>
                              )}
                            </Form.Group>
                          </Col>
                          <Col sm={6} md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label>Amount</Form.Label>
                              <Form.Control
                                type="number"
                                name="amount"
                                value={formik.values.amount}
                                onChange={formik.handleChange}
                                className="custom-select-height"
                                placeholder="Enter amount"
                                min="0"
                                step="0.01"
                              />
                              {formik.touched.amount &&
                                formik.errors.amount && (
                                  <div className="text-danger mt-1">
                                    {formik.errors.amount}
                                  </div>
                                )}
                            </Form.Group>
                          </Col>
                          <Col sm={6} md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label>Upload Proof</Form.Label>
                              <Form.Control
                                type="file"
                                name="fundTransfer"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange}
                                className="custom-select-height"
                              />
                              {formik.touched.fundTransfer &&
                                formik.errors.fundTransfer && (
                                  <div className="text-danger mt-1">
                                    {formik.errors.fundTransfer}
                                  </div>
                                )}
                            </Form.Group>
                          </Col>
                          <Col md={12} className="text-end">
                            <Button
                              type="submit"
                              variant="primary"
                              className="custom-select-height"
                            >
                              Submit Transaction
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {canRead && (
                <Row className="g-4 justify-content-center text-center">
                  <Col md={12} className="text-center mt-4">
                    <Button
                      variant="primary"
                      className="custom-select-height"
                      size="lg"
                      onClick={() => {
                        setShowHistoryModal(true);
                        // Reset pagination and filters on open if needed
                        setCurrentPage(1);
                        setHistoryFilters({ startDate: "", endDate: "" });
                      }}
                    >
                      View Fund Transfer History
                    </Button>
                  </Col>
                  <Col md={5} lg={4}>
                    <Card className="h-100 border-0 shadow-sm balance-card hover-scale">
                      <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                        <div className="mb-3 display-4 text-primary">
                          <i className="bi bi-bank"></i>
                        </div>
                        <h5 className="fw-semibold text-primary">
                          Bank Balance
                        </h5>
                        <h3 className="mt-2">
                          {storedEncryptedCurrency
                            ? getSymbolFromCurrency(storedEncryptedCurrency)
                            : "₹"}{" "}
                          {new Intl.NumberFormat().format(totalPaidAmount)}
                        </h3>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={5} lg={4}>
                    <Card className="h-100 border-0 shadow-sm balance-card hover-scale">
                      <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                        <div className="mb-3 display-4 text-warning">
                          <i className="bi bi-cash-stack"></i>
                        </div>
                        <h5 className="fw-semibold text-warning">
                          Cash Balance
                        </h5>
                        <h3 className="mt-2">
                          {storedEncryptedCurrency
                            ? getSymbolFromCurrency(storedEncryptedCurrency)
                            : "₹"}{" "}
                          {new Intl.NumberFormat().format(totalDueAmount)}
                        </h3>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={12}>
                    <Card className="border-0 mt-4">
                      <Card.Header className="bg-white border-0 text-center">
                        <h5 className="fw-bold">Bank Wise Total Amount</h5>
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-3 justify-content-center">
                          {bankwiseTotals.map((bank, index) => (
                            <Col key={index} md={4}>
                              <Card className="h-100 border-0 shadow-sm balance-card hover-scale">
                                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                                  <div className="mb-3 display-4 text-info">
                                    <i className="bi bi-bank"></i>
                                  </div>
                                  <h6 className="fw-semibold text-info">
                                    {bank.bankName || "Unknown Bank"}
                                  </h6>
                                  <h5 className="mt-2">
                                    {storedEncryptedCurrency
                                      ? getSymbolFromCurrency(
                                          storedEncryptedCurrency
                                        )
                                      : "₹"}{" "}
                                    {new Intl.NumberFormat().format(
                                      bank.totalAmount || 0
                                    )}
                                  </h5>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={showHistoryModal}
        onHide={() => setShowHistoryModal(false)}
        size="xl"
        centered
      >
        <Modal.Header className="form-main-heading">
          <Modal.Title className="fw-bold">Fund Transfer History</Modal.Title>
          <AiOutlineClose
            onClick={() => setShowHistoryModal(false)}
            style={{ cursor: "pointer" }}
          />
        </Modal.Header>
        <Modal.Body>
          <Card className="border-0">
            <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center flex-wrap">
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <div className="filter-item">
                  <Form.Label className="mb-1">Start Date</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      className="filter-height"
                      placeholder="dd/mm/yyyy"
                      value={
                        historyFilters.startDate
                          ? formatDate(parseDate(historyFilters.startDate))
                          : ""
                      }
                      readOnly
                      ref={historyStartDateInputRef}
                      onClick={() => {
                        if (historyFilters.startDate) {
                          setHistoryStartDateValue(
                            parseDate(historyFilters.startDate)
                          );
                        }
                        setShowHistoryStartDateCalendar((show) => !show);
                      }}
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#fff",
                      }}
                    />
                    {historyFilters.startDate ? (
                      <button
                        type="button"
                        onClick={() => {
                          setHistoryFilters({
                            ...historyFilters,
                            startDate: "",
                          });
                          setHistoryStartDateValue(null);
                          setShowHistoryStartDateCalendar(false);
                        }}
                        style={{
                          position: "absolute",
                          right: 8,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 16,
                          color: "#888",
                          padding: 0,
                          zIndex: 10000,
                        }}
                        aria-label="Clear date"
                      >
                        ×
                      </button>
                    ) : (
                      <MdCalendarToday
                        style={{
                          position: "absolute",
                          right: 10,
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#888",
                          pointerEvents: "none",
                        }}
                        size={20}
                      />
                    )}
                    {showHistoryStartDateCalendar && (
                      <div
                        ref={historyStartDateCalenderRef}
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "0",
                          zIndex: 9999,
                          background: "#fff",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                          borderRadius: "8px",
                          marginTop: "4px",
                          width: 300,
                        }}
                      >
                        <Calendar
                          className="form-control m-0 p-0 border-0"
                          onChange={(selectedDate) => {
                            setHistoryStartDateValue(selectedDate);
                            setHistoryFilters({
                              ...historyFilters,
                              startDate: toISODate(selectedDate),
                            });
                            setShowHistoryStartDateCalendar(false);
                          }}
                          value={historyStartDateValue}
                          locale="en-GB"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="filter-item">
                  <Form.Label className="mb-1">End Date</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      className="filter-height"
                      placeholder="dd/mm/yyyy"
                      value={
                        historyFilters.endDate
                          ? formatDate(parseDate(historyFilters.endDate))
                          : ""
                      }
                      readOnly
                      ref={historyEndDateInputRef}
                      onClick={() => {
                        if (historyFilters.endDate) {
                          setHistoryEndDateValue(
                            parseDate(historyFilters.endDate)
                          );
                        }
                        setShowHistoryEndDateCalendar((show) => !show);
                      }}
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#fff",
                      }}
                    />
                    {historyFilters.endDate ? (
                      <button
                        type="button"
                        onClick={() => {
                          setHistoryFilters({
                            ...historyFilters,
                            endDate: "",
                          });
                          setHistoryEndDateValue(null);
                          setShowHistoryEndDateCalendar(false);
                        }}
                        style={{
                          position: "absolute",
                          right: 8,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 16,
                          color: "#888",
                          padding: 0,
                          zIndex: 10000,
                        }}
                        aria-label="Clear date"
                      >
                        ×
                      </button>
                    ) : (
                      <MdCalendarToday
                        style={{
                          position: "absolute",
                          right: 10,
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#888",
                          pointerEvents: "none",
                        }}
                        size={20}
                      />
                    )}
                    {showHistoryEndDateCalendar && (
                      <div
                        ref={historyEndDateCalenderRef}
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "0",
                          zIndex: 9999,
                          background: "#fff",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                          borderRadius: "8px",
                          marginTop: "4px",
                          width: 300,
                        }}
                      >
                        <Calendar
                          className="form-control m-0 p-0 border-0"
                          onChange={(selectedDate) => {
                            setHistoryEndDateValue(selectedDate);
                            setHistoryFilters({
                              ...historyFilters,
                              endDate: toISODate(selectedDate),
                            });
                            setShowHistoryEndDateCalendar(false);
                          }}
                          value={historyEndDateValue}
                          locale="en-GB"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="d-flex align-items-end mt-4">
                  <ItemsPerPageSelect
                    itemsPerPage={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                  />
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
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
            </Card.Body>
          </Card>
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
    </>
  );
};

export default TotalBalance;
