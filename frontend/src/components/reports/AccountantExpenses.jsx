import { Button, Card, Col, Form, Row } from "react-bootstrap";
import Pageheader from "../../layouts/Pageheader";
import usePermissions from "../commonComponents/usePermissions";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import DataTable from "../commonComponents/DataTable";
import {
  getAllExpenses,
  createExpenses,
  deleteExpenses,
  updateExpenses,
} from "../../redux/actions/Report/Expenses.action";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "react-bootstrap/Modal";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import { toast } from "react-toastify";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getAllBranch, getOneBranch } from "../../redux/actions/Branch.action";
import { getAllExpenseType } from "../../redux/actions/Master/ExpenseType.action";
import Paginations from "../elements/Paginations";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import { MdCalendarToday } from "react-icons/md";
import { getAllBankingDetails } from "../../redux/actions/Master/Banking.action";
import { decryptData } from "../../utils/encryptionUtils";
import getSymbolFromCurrency from "currency-symbol-map";
import { BASEURL } from "../../baseUrl";

const AccountantExpenses = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [allExpenses, setAllExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [showDateCalendar, setShowDateCalendar] = useState(false);
  const [dateValue, setDateValue] = useState(null);
  const dateInputRef = useRef(null);
  const [branchList, setBranchList] = useState([]);
  const [expenseType, setExpenseType] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [bankingDetails, setBankingDetails] = useState([]);
  const [oneBranchName, setOneBranchName] = useState();

  const role = decryptData(localStorage.getItem("role"));
  const userId = decryptData(localStorage.getItem("userId"));

  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Expenses");

  const [totalAmount, setTotalAmount] = useState(0);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    center: { value: "All", label: "All" },
  });

  const storedEncryptedCurrency = decryptData(
    localStorage.getItem("crmCurrency"),
  );

  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const startDateInputRef = useRef(null);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [endDateValue, setEndDateValue] = useState(null);
  const endDateInputRef = useRef(null);

  const paymentModeOptions = [
    { label: "GPay", value: "GPay" },
    { label: "Bank", value: "Bank" },
    { label: "Cash", value: "Cash" },
    { label: "UPI", value: "UPI" },
  ];

  const fetchBankingDetails = async () => {
    try {
      const res = await dispatch(getAllBankingDetails(1, 1000, ""));
      const responseData = res?.data?.data?.data || [];
      setBankingDetails(responseData);
    } catch (error) {
      console.error("Error fetching banking details:", error);
      setBankingDetails([]);
    }
  };

  const fetchOneBranch = async () => {
    try {
      const res = await dispatch(getOneBranch(userId));
      setOneBranchName(res?.data?.data?.name);
    } catch (error) {
      console.error("Error fetching get one branch :", error);
    }
  };

  useEffect(() => {
    fetchBankingDetails();
    fetchOneBranch();
  }, [dispatch]);

  const bankOptions = bankingDetails.map((bank) => ({
    label: bank.bankName,
    value: bank._id,
  }));

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

  const fetchAllBranches = async () => {
    try {
      const res = await dispatch(getAllBranch(1, 1000, ""));
      const responseData = res?.data?.data;
      setBranchList(responseData?.data || []);
    } catch (error) {
      console.log("Error fetching branches:", error);
    }
  };
  const fetchAllExpenseType = async () => {
    try {
      const res = await dispatch(getAllExpenseType(1, 1000, ""));
      const responseData = res?.data?.data;
      setExpenseType(responseData?.data || []);
    } catch (error) {
      console.log("Error fetching branches:", error);
    }
  };

  const expenseTypeOptions = expenseType
    ?.sort((a, b) => a.name.localeCompare(b.name))
    ?.map((expense) => ({
      value: expense._id,
      label: expense.name,
    }));

  useEffect(() => {
    fetchAllBranches();
    fetchAllExpenseType();
    if (canRead) {
      fetchExpenses(
        currentPage,
        itemsPerPage,
        search,
        filters.startDate,
        filters.endDate,
      );
    }
  }, [currentPage, itemsPerPage, search, filters]);

  const fetchExpenses = async (
    page = 1,
    limit = 10,
    search = "",
    startDate = filters.startDate,
    endDate = filters.endDate,
    center = filters.center?.value || "",
  ) => {
    setLoading(true);
    try {
      const res = await dispatch(
        getAllExpenses(page, limit, search, startDate, endDate, center, ""),
      );
      const responseData = res?.data?.data;
      setAllExpenses(responseData?.data || []);
      setTotalPages(responseData?.totalPages || 0);
      setTotalRecords(responseData?.totalRecords || 0);
      // Calculate total amount
      const total = responseData?.data?.reduce((sum, item) => {
        const amount = item?.amount ? parseFloat(item.amount) : 0;
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
      setTotalAmount(total);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setTotalPages(0);
      setTotalRecords(0);
      setTotalAmount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);

    if (canRead) {
      fetchExpenses(
        1,
        newItemsPerPage,
        search,
        filters.startDate,
        filters.endDate,
      );
    }
  };

  const formik = useFormik({
    initialValues: {
      center:
        role === "Super Admin"
          ? ""
          : { value: oneBranchName, lable: oneBranchName },
      type: null,
      mode: "",
      bank: null,
      amount: "",
      date: "",
      remarks: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      center: Yup.object(),
      type: Yup.object().required("Expense type is required"),
      mode: Yup.string().required("Mode is required"),
      // bank: Yup.string().required("Bank is required"),
      bank: Yup.string()
        .nullable()
        .when("mode", {
          is: (mode) => mode && mode !== "Cash",
          then: (schema) => schema.required("Bank is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
      amount: Yup.number()
        .required("Amount is required")
        .min(1, "Amount must be positive"),
      date: Yup.string().required("Date is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (isEditMode && editingExpense) {
          const updatePayload = new FormData();
          updatePayload.append("center", values.center.value);
          updatePayload.append("type", values.type.value);
          updatePayload.append("mode", values.mode);
          updatePayload.append("bank", values.bank);
          updatePayload.append("amount", values.amount);
          updatePayload.append("date", toISODate(parseDate(values.date)));
          updatePayload.append("remarks", values.remarks);
          if (file) updatePayload.append("expenseProof", file);
          await dispatch(updateExpenses(updatePayload, editingExpense._id));
          toast.success("Expense updated successfully");
        } else {
          const payload = new FormData();
          payload.append("center", values.center.value);
          payload.append("type", values.type.value);
          payload.append("mode", values.mode);
          payload.append("bank", values.bank);
          payload.append("amount", values.amount);
          payload.append("date", toISODate(parseDate(values.date)));
          payload.append("remarks", values.remarks);
          if (file) payload.append("expenseProof", file);
          await dispatch(createExpenses(payload));
          toast.success("Expense added successfully");
        }
        setShowModal(false);
        resetForm();
        setFile(null);
        setIsEditMode(false);
        setEditingExpense(null);

        if (canRead) {
          fetchExpenses(
            currentPage,
            itemsPerPage,
            search,
            filters.startDate,
            filters.endDate,
          );
        }
      } catch (error) {
        toast.error(
          isEditMode
            ? "Failed to update expense"
            : error.response.data.message || "Failed to add expense",
        );
      }
    },
  });

  const columns = [
    {
      label: "DATE",
      render: (item) => formatDate(parseDate(item.date)),
    },
    { label: "CENTER", key: "center" },
    { label: "EXPENSES", render: (item) => item?.type?.name || "-" },
    { label: "MODE", key: "mode" },
    { label: "AMOUNT", key: "amount" },
    { label: "REMARKS", key: "remarks" },
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
              window.open(
                `${BASEURL}/${item.proof}`,
                "_blank",
                "noopener,noreferrer",
              );
            }}
          >
            <VisibilityIcon className="me-1" style={{ fontSize: "16px" }} />
            View
          </button>
        ) : (
          "-"
        ),
    },
    { label: "Created by", render: (item) => item?.createdByName || "-" },
    { label: "Updated by", render: (item) => item?.updatedByName || "-" },
  ];

  const handleDelete = async (item) => {
    try {
      await dispatch(deleteExpenses(item._id));
      toast.success("Expense deleted successfully");

      if (canRead) {
        fetchExpenses(
          currentPage,
          itemsPerPage,
          search,
          filters.startDate,
          filters.endDate,
        );
      }
    } catch (error) {
      toast.error("Failed to delete expense");
    }
  };

  const handleEdit = (expense) => {
    setIsEditMode(true);
    setEditingExpense(expense);
    formik.setValues({
      center: { value: expense.center, label: expense.center },
      type: expenseTypeOptions.find(
        (opt) => opt.value === (expense.type?._id || expense.type),
      ),
      mode: expense.mode,
      bank: expense.bank,
      amount: expense.amount,
      date: expense.date,
      remarks: expense.remarks,
    });
    setShowModal(true);
    setFile(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setEditingExpense(null);
    formik.resetForm();
    setFile(null);
  };

  return (
    <>
      <Pageheader
        mainheading="Expenses"
        parentfolder="Accountant"
        activepage="Expenses"
      />

      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div className="w-100 d-flex flex-wrap justify-content-between">
                <div className="card-title">Expenses</div>
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <div className="filter-item">
                    <div className="contact-search3">
                      <button type="button" className="btn border-0">
                        <i
                          className="fe fe-search fw-semibold text-muted"
                          aria-hidden="true"
                        ></i>
                      </button>
                      <Form.Control
                        type="text"
                        className="filter-height border-0"
                        id="typehead1"
                        placeholder="Search here..."
                        autoComplete="off"
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                  </div>
                  {(canCreate || canUpdate) && (
                    <div className="col-auto">
                      <Button
                        variant="primary"
                        className="custom-select-height px-3"
                        onClick={() => setShowModal(true)}
                      >
                        Add Expense
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              {canRead && (
                <>
                  <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
                    <div className="filter-item">
                      <Form.Label>Start Date</Form.Label>
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
                          style={{
                            cursor: "pointer",
                            backgroundColor: "#fff",
                            width: "100%",
                          }}
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
                              minWidth: 300,
                              maxWidth: 300,
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
                                setCurrentPage(1);
                              }}
                              value={startDateValue}
                              locale="en-GB"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="filter-item">
                      <Form.Label>End Date</Form.Label>
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
                          style={{
                            cursor: "pointer",
                            backgroundColor: "#fff",
                            width: "100%",
                          }}
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
                              minWidth: 300,
                              maxWidth: 300,
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
                                setCurrentPage(1);
                              }}
                              value={endDateValue}
                              locale="en-GB"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="filter-item">
                      <Form.Label>Center</Form.Label>
                      <Select
                        options={[
                          { value: "All", label: "All" },
                          { value: "Head Office", label: "Head Office" },
                          ...(Array.isArray(branchList)
                            ? branchList
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map((branch) => ({
                                value: branch.name,
                                label: branch.name,
                              }))
                            : []),
                        ]}
                        value={filters.center}
                        onChange={(selectedOption) => {
                          setFilters({
                            ...filters,
                            center: selectedOption,
                          });
                          setCurrentPage(1);
                        }}
                        placeholder="Select Center"
                        classNamePrefix="custom-select"
                        isClearable
                        styles={{
                          control: (base) => ({
                            ...base,
                            fontSize: "13px",
                            minHeight: "38px",
                          }),
                        }}
                      />
                    </div>

                    <div className="flex-grow-1"></div>
                    <div className="custom-select-height px-3 mt-2 mt-md-0 d-flex align-items-center bg-success bg-opacity-10 border border-success rounded">
                      <span className="text-success fw-semibold">
                        <i className="bi bi-check-circle me-2"></i>
                        Total Amount:{" "}
                        <strong>
                          {storedEncryptedCurrency
                            ? getSymbolFromCurrency(storedEncryptedCurrency)
                            : "₹"}{" "}
                          {allExpenses?.length > 0
                            ? totalAmount?.toLocaleString("en-IN", {
                              maximumFractionDigits: 2,
                            })
                            : "0"}
                        </strong>
                      </span>
                    </div>
                    <div className="filter-item-rows">
                      <ItemsPerPageSelect
                        itemsPerPage={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                      />
                    </div>

                    <div className="d-flex align-items-center">
                      <div className="filter-item filter-height total-records px-3 d-flex align-items-center">
                        <span>
                          Total Records :<strong> {totalRecords}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <DataTable
                columns={columns}
                data={allExpenses}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onDelete={handleDelete}
                canEdit={canUpdate}
                canDelete={canDelete}
                canRead={canRead}
                onPageChange={setCurrentPage}
                onEdit={handleEdit}
              />
              {totalPages > 1 && allExpenses.length > 0 && (
                <div className="mt-4 d-flex justify-content-end align-items-end">
                  <Paginations
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header className="form-main-heading">
          <Modal.Title>
            {isEditMode ? "Edit Expense" : "Add Expense"}
          </Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={handleCloseModal}
          />
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              {role === "Super Admin" && (
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Select Center</Form.Label>
                    <Select
                      options={[
                        { value: "Head Office", label: "Head Office" },
                        ...(Array.isArray(branchList)
                          ? branchList
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((branch) => ({
                              value: branch.name,
                              label: branch.name,
                            }))
                          : []),
                      ]}
                      value={formik.values.center}
                      onChange={(option) =>
                        formik.setFieldValue("center", option)
                      }
                      placeholder="Select Center"
                      classNamePrefix="custom-select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          fontSize: "13px",
                        }),
                      }}
                    />
                    {formik.touched.center && formik.errors.center && (
                      <div className="text-danger">{formik.errors.center}</div>
                    )}
                  </Form.Group>
                </Col>
              )}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Type</Form.Label>
                  <Select
                    options={expenseTypeOptions}
                    value={formik.values.type}
                    onChange={(option) => formik.setFieldValue("type", option)}
                    placeholder="Select Expenses"
                    classNamePrefix="custom-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: "13px",
                      }),
                    }}
                  />
                  {formik.touched.type && formik.errors.type && (
                    <div className="text-danger">{formik.errors.type}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6} className="mb-2">
                <Form.Group className="mb-3">
                  <Form.Label>Payment Mode</Form.Label>
                  <Select
                    options={paymentModeOptions}
                    value={
                      paymentModeOptions.find(
                        (option) => option.value === formik.values.mode,
                      ) || null
                    }
                    onChange={(option) =>
                      formik.setFieldValue("mode", option ? option.value : "")
                    }
                    classNamePrefix="custom-select"
                    placeholder="Select payment mode"
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: "13px",
                      }),
                    }}
                  />
                  {formik.touched.mode && formik.errors.mode && (
                    <div className="text-danger mt-1">{formik.errors.mode}</div>
                  )}
                </Form.Group>
              </Col>
              {["GPay", "Bank", "UPI"].includes(formik.values.mode) && (
                <>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Bank</Form.Label>
                      <Select
                        className=""
                        options={bankOptions}
                        value={
                          bankOptions.find(
                            (option) => option.value === formik.values.bank,
                          ) || null
                        }
                        onChange={(option) =>
                          formik.setFieldValue(
                            "bank",
                            option ? option.value : "",
                          )
                        }
                        classNamePrefix="custom-select"
                        placeholder="Select bank"
                        styles={{
                          control: (base) => ({
                            ...base,
                            fontSize: "13px",
                          }),
                        }}
                      />
                      {formik.touched.bank && formik.errors.bank && (
                        <div className="text-danger mt-1">
                          {formik.errors.bank}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </>
              )}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Amount Rs.</Form.Label>
                  <Form.Control
                    type="text"
                    name="amount"
                    placeholder="0/-"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    className="custom-select-height"
                  />
                  {formik.touched.amount && formik.errors.amount && (
                    <div className="text-danger">{formik.errors.amount}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      name="date"
                      value={
                        formik.values.date
                          ? formatDate(parseDate(formik.values.date))
                          : ""
                      }
                      readOnly
                      ref={dateInputRef}
                      onClick={() => {
                        if (formik.values.date) {
                          setDateValue(parseDate(formik.values.date));
                        }
                        setShowDateCalendar((show) => !show);
                      }}
                      placeholder="dd/mm/yyyy"
                      className="custom-select-height"
                      style={{ cursor: "pointer", backgroundColor: "#fff" }}
                    />
                    {formik.values.date ? (
                      <button
                        type="button"
                        onClick={() => {
                          formik.setFieldValue("date", "");
                          setDateValue(null);
                          setShowDateCalendar(false);
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
                    {showDateCalendar && (
                      <div
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
                          minWidth: 300,
                          maxWidth: 300,
                        }}
                      >
                        <Calendar
                          className="form-control m-0 p-0 border-0"
                          onChange={(selectedDate) => {
                            setDateValue(selectedDate);
                            const formatted = formatDate(selectedDate);
                            formik.setFieldValue("date", formatted);
                            setShowDateCalendar(false);
                          }}
                          value={dateValue}
                          locale="en-GB"
                        />
                      </div>
                    )}
                  </div>
                  {formik.touched.date && formik.errors.date && (
                    <div className="text-danger">{formik.errors.date}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Upload Image</Form.Label>
                  {isEditMode && editingExpense && editingExpense.proof && (
                    <div className="mb-2">
                      <span style={{ color: "#198754", fontWeight: 500 }}>
                        <span style={{ color: "#888", fontSize: 13 }}>
                          (Upload a new file to replace the existing proof)
                        </span>
                      </span>
                    </div>
                  )}
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="custom-select-height"
                  />
                </Form.Group>
              </Col>
              <Form.Group className="mb-3">
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="remarks"
                  value={formik.values.remarks}
                  onChange={formik.handleChange}
                  className="rounded-4"
                />
              </Form.Group>
            </Row>
            <Modal.Footer>
              <Button
                variant="primary"
                type="submit"
                className="custom-select-height"
              >
                {isEditMode ? "Update" : "Save"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AccountantExpenses;
