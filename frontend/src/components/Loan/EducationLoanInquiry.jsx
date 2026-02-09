import { useEffect, useRef, useState } from "react";
import { Button, Form, Row, Col, Card, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import DataTable from "../commonComponents/DataTable";
import Select from "react-select";
import { AiOutlineClose } from "react-icons/ai";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import usePermissions from "../commonComponents/usePermissions";
import Paginations from "../elements/Paginations";
import {
  createLoan,
  deleteLoan,
  getAllLoan,
  updateLoan,
} from "../../redux/actions/LoanInquiry.action";
import { countryDropdown } from "../../redux/actions/Master/Institute.action";
import Pageheader from "../../layouts/Pageheader";
import { getAllLoanStatus } from "../../redux/actions/Master/EducationLoanStatus.action";
import { MdCalendarToday } from "react-icons/md";
import Calendar from "react-calendar";
import LoadMoreButton from "../commonComponents/LoadMoreButton";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { countryCodeISO } from "../../utils/countryISOCode";

const EducationLoanInquiry = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [allLoans, setAllLoans] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loanStatuses, setLoanStatuses] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [show, setShow] = useState(false);
  // Filter date state
  const [showFilterStartDateCalendar, setShowFilterStartDateCalendar] =
    useState(false);
  const [showFilterEndDateCalendar, setShowFilterEndDateCalendar] =
    useState(false);
  const [filterStartDateValue, setFilterStartDateValue] = useState(null);
  const [filterEndDateValue, setFilterEndDateValue] = useState(null);
  const filterStartDateInputRef = useRef(null);
  const filterEndDateInputRef = useRef(null);

  // Loan modal date state
  const [showLoanStartDateCalendar, setShowLoanStartDateCalendar] =
    useState(false);
  const [showLoanEndDateCalendar, setShowLoanEndDateCalendar] = useState(false);
  const [loanStartDateValue, setLoanStartDateValue] = useState(null);
  const [loanEndDateValue, setLoanEndDateValue] = useState(null);
  const loanStartDateInputRef = useRef(null);
  const loanEndDateInputRef = useRef(null);
  const loanStartDateCalendarRef = useRef(null);
  const loanEndDateCalendarRef = useRef(null);
  const [showFollowUpCalendar, setShowFollowUpCalendar] = useState(false);
  const [followUpDateValue, setFollowUpDateValue] = useState(null);
  const followUpDateInputRef = useRef(null);
  const [showFollowUpStartCalendar, setShowFollowUpStartCalendar] =
    useState(false);
  const [showFollowUpEndCalendar, setShowFollowUpEndCalendar] = useState(false);
  const [followUpStartValue, setFollowUpStartValue] = useState(null);
  const [followUpEndValue, setFollowUpEndValue] = useState(null);
  const followUpStartRef = useRef(null);
  const followUpEndRef = useRef(null);

  const { canCreate, canRead, canUpdate, canDelete } = usePermissions(
    "Education Loan Inquiry",
  );

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    followUpStartDate: "",
    followUpEndDate: "",
  });

  const formatDate = (date) => {
    if (!date) return "";
    if (typeof date === "string") {
      const d = new Date(date);
      if (!isNaN(d)) date = d;
      else return "";
    }
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    let d = new Date(dateStr);
    if (!isNaN(d)) return d;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split("/");
      d = new Date(`${year}-${month}-${day}`);
      if (!isNaN(d)) return d;
    }
    return null;
  };

  const toISODate = (date) => {
    if (!date) return "";
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
    setShowLoanStartDateCalendar(false);
    setShowLoanEndDateCalendar(false);
  };

  const fetchCountries = async () => {
    const res = await dispatch(countryDropdown());
    setCountries(res?.data?.data || []);
  };

  const fetchLoans = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    startDate = filters.startDate,
    endDate = filters.endDate,
    followUpStartDate = filters.followUpStartDate,
    followUpEndDate = filters.followUpEndDate,
  ) => {
    try {
      const res = await dispatch(
        getAllLoan(
          page,
          limit,
          search,
          startDate,
          endDate,
          followUpStartDate,
          followUpEndDate,
        ),
      );
      const responseData = res?.data?.data;
      setAllLoans(responseData?.data || []);
      setTotalPages(responseData?.totalPages || 0);
      setTotalRecords(responseData?.totalRecords || 0);
    } catch (error) {
      console.error("Error fetching loans:", error);
      setAllLoans([]);
      setTotalPages(0);
      setTotalRecords(0);
    }
  };

  const fetchLoanStatuses = async () => {
    try {
      const res = await dispatch(getAllLoanStatus());
      if (res?.status === 200) {
        setLoanStatuses(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching loan statuses:", error);
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchLoanStatuses();
  }, []);

  useEffect(() => {
    if (canRead) {
      fetchLoans(
        currentPage,
        itemsPerPage,
        search,
        filters.startDate,
        filters.endDate,
        filters.followUpStartDate,
        filters.followUpEndDate,
      );
    }
  }, [
    currentPage,
    search,
    filters.startDate,
    filters.endDate,
    filters.followUpStartDate,
    filters.followUpEndDate,
  ]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      fetchLoans(
        1,
        newItemsPerPage,
        search,
        filters.startDate,
        filters.endDate,
        filters.followUpStartDate,
        filters.followUpEndDate,
      );
    }
  };

  const formik = useFormik({
    initialValues: {
      studentName: "",
      course: "",
      country: "",
      requiredLoan: "",
      contact: "",
      email: "",
      parentName: "",
      parentContact: "",
      occupation: "",
      income: "",
      approvedBank: "",
      approvedAmount: "",
      interestAmount: "",
      loanType: "",
      remarks: "",
      loanStartDate: "",
      loanEndDate: "",
      status: "",
      id: "",
      followup: "",
    },
    validationSchema: Yup.object({
      studentName: Yup.string().required("Student Name is required"),
      course: Yup.string().required("Course is required"),
      country: Yup.string().required("Country is required"),
      requiredLoan: Yup.number()
        .required("Required Loan is required")
        .positive("Loan amount must be positive"),
      contact: Yup.string().required("Contact Number is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      parentName: Yup.string().required("Parents Name is required"),
      parentContact: Yup.string().required("Parent Contact Number is required"),
      occupation: Yup.string().required("Occupation is required"),
      income: Yup.number()
        .required("Income is required")
        .positive("Income must be positive"),
      approvedBank: Yup.string().required("Approved Bank is required"),
      approvedAmount: Yup.number()
        .required("Approved Amount is required")
        .positive("Approved amount must be positive"),
      interestAmount: Yup.number()
        .required("Interest Amount is required")
        .positive("Interest amount must be positive"),
      loanType: Yup.string().required("Loan Type is required"),
      remarks: Yup.string().required("Remarks are required"),
      loanStartDate: Yup.date().required("Loan Start Date is required"),
      loanEndDate: Yup.date()
        .required("Loan End Date is required")
        .min(
          Yup.ref("loanStartDate"),
          "Loan End Date must be after Loan Start Date",
        ),
      followup: Yup.date(),
      status: Yup.string().required("Status is required"),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);

      try {
        toast.dismiss();

        const payload = {
          studentName: values.studentName,
          course: values.course,
          country: values.country,
          requiredLoan: parseFloat(values.requiredLoan),
          contact: values.contact,
          email: values.email,
          parentName: values.parentName,
          parentContact: values.parentContact,
          occupation: values.occupation,
          income: parseFloat(values.income),
          approvedBank: values.approvedBank,
          approvedAmount: parseFloat(values.approvedAmount),
          interestAmount: parseFloat(values.interestAmount),
          loanType: values.loanType,
          remarks: values.remarks,
          loanStartDate: values.loanStartDate,
          loanEndDate: values.loanEndDate,
          status: values.status,
          followup: values.followup || null,
        };

        if (values.id && canUpdate) {
          const res = await dispatch(updateLoan(payload, values.id));
          if (res?.data?.code === 200) {
            toast.success("Education Loan inquiry updated successfully");
          }
        } else if (canCreate) {
          const res = await dispatch(createLoan(payload));
          if (res?.data?.code === 201) {
            toast.success("Education Loan inquiry added successfully");
          }
        }
        resetForm();
        if (canRead) {
          fetchLoans(
            currentPage,
            itemsPerPage,
            search,
            filters.startDate,
            filters.endDate,
            filters.followUpStartDate,
            filters.followUpEndDate,
          );
        }
        handleClose();
      } catch (error) {
        toast.dismiss();
        console.error("Error submitting form:", error);
        toast.error(
          error?.response?.data?.message ||
            "Failed to submit Education loan inquiry.",
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleEdit = (loan) => {
    if (canUpdate) {
      formik.setValues({
        studentName: loan.studentName || "",
        course: loan.course || "",
        country: loan.country || "",
        requiredLoan: loan.requiredLoan || "",
        contact: loan.contact || "",
        email: loan.email || "",
        parentName: loan.parentName || "",
        parentContact: loan.parentContact || "",
        occupation: loan.occupation || "",
        income: loan.income || "",
        approvedBank: loan.approvedBank || "",
        approvedAmount: loan.approvedAmount || "",
        interestAmount: loan.interestAmount || "",
        loanType: loan.loanType || "",
        remarks: loan.remarks || "",
        loanStartDate: loan.loanStartDate || "",
        loanEndDate: loan.loanEndDate || "",
        status: loan.status || "",
        id: loan._id || "",
        followup: loan.followup || null,
      });
      setFollowUpDateValue(parseDate(loan.followup) || null);
      setLoanStartDateValue(parseDate(loan.loanStartDate) || new Date());
      setLoanEndDateValue(parseDate(loan.loanEndDate) || new Date());
      setShow(true);
    }
  };

  const handleDelete = async (loan) => {
    try {
      setIsLoading(true);
      toast.dismiss();
      const res = await dispatch(deleteLoan(loan._id));
      if (res?.data?.code === 200) {
        toast.success("Education Loan inquiry deleted successfully");
      }
      const updatedPage =
        allLoans.length === 1 && currentPage > 1
          ? currentPage - 1
          : currentPage;
      setCurrentPage(updatedPage);
      if (canRead) {
        fetchLoans(
          updatedPage,
          itemsPerPage,
          search,
          filters.startDate,
          filters.endDate,
          filters.followUpStartDate,
          filters.followUpEndDate,
        );
      }
    } catch (error) {
      console.error("Error deleting loan:", error);
      toast.error("Failed to delete the Education loan inquiry.");
    } finally {
      setIsLoading(false);
    }
  };

  const courseOptions = [
    { value: "Bachelor", label: "Bachelor" },
    { value: "Master", label: "Master" },
    { value: "Diploma", label: "Diploma" },
    { value: "Vocational", label: "Vocational" },
    { value: "PG", label: "PG" },
  ];

  const occupationOptions = [
    { value: "Business", label: "Business" },
    { value: "Service", label: "Service" },
  ];

  const countryOptions = countries.map((country) => ({
    value: country.name,
    label: country.name,
  }));

  const statusOptions = loanStatuses.map((status) => ({
    value: status._id,
    label: status.name,
  }));

  const columns = [
    {
      label: "Student Name",
      key: "studentName",
    },
    {
      label: "Course",
      key: "course",
    },
    {
      label: "Country",
      key: "country",
    },
    {
      label: "Required Loan",
      key: "requiredLoan",
    },
    {
      label: "Contact",
      key: "contact",
    },
    {
      label: "Follow-up Date",
      key: "followup",
      render: (item) =>
        item?.followup ? formatDate(parseDate(item.followup)) : "-",
    },
    {
      label: "Email",
      key: "email",
    },
    {
      label: "Approved Bank",
      key: "approvedBank",
    },
    {
      label: "Approved Amount",
      key: "approvedAmount",
    },
    {
      label: "Interest Amount",
      key: "interestAmount",
    },
    {
      label: "Loan Type",
      key: "loanType",
    },
    {
      label: "Status",
      key: "status",
      render: (item) => {
        const status = loanStatuses.find((status) => {
          return status._id === item.status;
        });
        return status ? status.name : "";
      },
    },
    {
      label: "Loan Start Date",
      key: "loanStartDate",
      render: (item) =>
        item?.loanStartDate ? formatDate(parseDate(item.loanStartDate)) : "-",
    },
    {
      label: "Loan End Date",
      key: "loanEndDate",
      render: (item) =>
        item?.loanEndDate ? formatDate(parseDate(item.loanEndDate)) : "-",
    },
    {
      label: "Created By",
      key: "createdByName",
    },
    {
      label: "Updated By",
      key: "updatedByName",
    },
  ];

  const handleDownload = (loan) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Education Loan Inquiry", 14, 20);

    const statusName = loanStatuses.find((s) => s._id === loan.status)?.name;

    autoTable(doc, {
      startY: 30,
      head: [["Field", "Details"]],
      body: [
        ["Student Name", loan.studentName || "-"],
        ["Course", loan.course || "-"],
        ["Country", loan.country || "-"],
        ["Required Loan", loan.requiredLoan || "-"],
        ["Contact", loan.contact || "-"],
        ["Email", loan.email || "-"],
        ["Parent Name", loan.parentName || "-"],
        ["Parent Contact", loan.parentContact || "-"],
        ["Occupation", loan.occupation || "-"],
        ["Income", loan.income || "-"],
        ["Approved Bank", loan.approvedBank || "-"],
        ["Approved Amount", loan.approvedAmount || "-"],
        ["Interest Amount", loan.interestAmount || "-"],
        ["Loan Type", loan.loanType || "-"],
        ["Remarks", loan.remarks || "-"],
        ["Loan Start Date", formatDate(loan.loanStartDate) || "-"],
        ["Loan End Date", formatDate(loan.loanEndDate) || "-"],
        ["Follow-up Date", formatDate(loan.followup) || "-"],
        ["Status", statusName || "-"],
      ],
      theme: "grid",
      styles: { fontSize: 11, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save(`${loan.studentName || "loan"}_loan.pdf`);
  };

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <LoadMoreButton isLoading={isLoading} />
        </div>
      )}
      <Pageheader
        mainheading="Education Loan Inquiry"
        parentfolder="Home"
        activepage="Education Loan Inquiry"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div className="d-flex align-items-center justify-content-end w-100">
                {/* <div className="card-title">Education Loan Inquiry</div> */}

                {canCreate && (
                  <Button
                    variant="primary"
                    className="custom-select-height"
                    onClick={handleShow}
                  >
                    {formik.values.id
                      ? "Update Education Loan Inquiry"
                      : "Add Education Loan Inquiry"}
                  </Button>
                )}
              </div>
            </Card.Header>
            <Card.Body>
              <form onSubmit={formik.handleSubmit}>
                <Row className="mb-3">
                  <Col md={4} className="d-flex align-items-end gap-3">
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
                          ref={filterStartDateInputRef}
                          onClick={() => {
                            if (filters.startDate) {
                              setFilterStartDateValue(
                                parseDate(filters.startDate),
                              );
                            }
                            setShowFilterStartDateCalendar((show) => !show);
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
                        {showFilterStartDateCalendar && (
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
                                setFilterStartDateValue(selectedDate);
                                setFilters({
                                  ...filters,
                                  startDate: toISODate(selectedDate),
                                });
                                setShowFilterStartDateCalendar(false);
                                setCurrentPage(1);
                              }}
                              value={filterStartDateValue}
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
                          ref={filterEndDateInputRef}
                          onClick={() => {
                            if (filters.endDate) {
                              setFilterEndDateValue(parseDate(filters.endDate));
                            }
                            setShowFilterEndDateCalendar((show) => !show);
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
                        {showFilterEndDateCalendar && (
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
                                setFilterEndDateValue(selectedDate);
                                setFilters({
                                  ...filters,
                                  endDate: toISODate(selectedDate),
                                });
                                setShowFilterEndDateCalendar(false);
                                setCurrentPage(1);
                              }}
                              value={filterEndDateValue}
                              locale="en-GB"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col className="d-flex flex-wrap align-items-end justify-content-end gap-2">
                    <div className="ms-auto">
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

                    <ItemsPerPageSelect
                      itemsPerPage={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                    />
                    <div className="custom-select-height border px-3 mt-2 mt-md-0 d-flex align-items-center h-6">
                      <span>
                        Total Records: <strong>{totalRecords}</strong>
                      </span>
                    </div>
                  </Col>
                </Row>
              </form>

              <Modal show={show} onHide={handleClose} size="xl" centered>
                <Modal.Header className="form-main-heading">
                  <Modal.Title>
                    {formik.values.id
                      ? "Update Education Loan Inquiry"
                      : "Add Education Loan Inquiry"}
                  </Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={handleClose}
                  />
                </Modal.Header>
                <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
                  <Form onSubmit={formik.handleSubmit}>
                    <Row className="mb-3 mt-0">
                      <Col md={6} lg={4} className="mb-3">
                        <Form.Group controlId="studentName">
                          <Form.Label>Student Name</Form.Label>
                          <Form.Control
                            type="text"
                            className="custom-select-height"
                            placeholder="Enter student name"
                            {...formik.getFieldProps("studentName")}
                          />
                          {formik.touched.studentName &&
                            formik.errors.studentName && (
                              <div className="text-danger">
                                {formik.errors.studentName}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6} lg={4} className="mb-3">
                        <Form.Group controlId="course">
                          <Form.Label>Course</Form.Label>
                          <Select
                            options={courseOptions}
                            value={
                              courseOptions.find(
                                (option) =>
                                  option.value === formik.values.course,
                              ) || null
                            }
                            onChange={(selectedOption) =>
                              formik.setFieldValue(
                                "course",
                                selectedOption?.value || "",
                              )
                            }
                            placeholder="Select course"
                            classNamePrefix="custom-select"
                            isClearable
                            isSearchable
                          />
                          {formik.touched.course && formik.errors.course && (
                            <div className="text-danger">
                              {formik.errors.course}
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={6} lg={4} className="mb-3">
                        <Form.Group controlId="country">
                          <Form.Label>Country</Form.Label>
                          <Select
                            options={countryOptions}
                            value={
                              countryOptions.find(
                                (option) =>
                                  option.value === formik.values.country,
                              ) || null
                            }
                            onChange={(selectedOption) =>
                              formik.setFieldValue(
                                "country",
                                selectedOption?.value || "",
                              )
                            }
                            placeholder="Select country"
                            classNamePrefix="custom-select"
                            isClearable
                            isSearchable
                          />
                          {formik.touched.country && formik.errors.country && (
                            <div className="text-danger">
                              {formik.errors.country}
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={6} lg={4} className="mb-3">
                        <Form.Group controlId="requiredLoan">
                          <Form.Label>Required Loan</Form.Label>
                          <Form.Control
                            type="number"
                            className="custom-select-height"
                            placeholder="Enter loan amount"
                            {...formik.getFieldProps("requiredLoan")}
                          />
                          {formik.touched.requiredLoan &&
                            formik.errors.requiredLoan && (
                              <div className="text-danger">
                                {formik.errors.requiredLoan}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6} lg={4} className="mb-3">
                        <Form.Group controlId="contact">
                          <Form.Label>Contact No</Form.Label>
                          <PhoneInput
                            country={countryCodeISO()}
                            value={formik.values.contact || ""}
                            onChange={(phone, data) => {
                              if (!phone || phone === data.dialCode) {
                                formik.setFieldValue("contact", "");
                              } else {
                                const dialCode = data.dialCode
                                  ? `+${data.dialCode}`
                                  : "";
                                const formattedPhone =
                                  `${dialCode} ${phone.replace(
                                    data.dialCode,
                                    "",
                                  )}`.trim();
                                formik.setFieldValue("contact", formattedPhone);
                              }
                            }}
                            inputProps={{
                              name: "contact",
                              required: true,
                              className: "form-control custom-select-height",
                            }}
                            inputStyle={{
                              width: "100%",
                              paddingLeft: "65px",
                              borderRadius: "4px",
                            }}
                            buttonStyle={{
                              marginRight: "10px",
                            }}
                          />
                          {formik.touched.contact && formik.errors.contact && (
                            <div className="text-danger">
                              {formik.errors.contact}
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={6} lg={4} className="mb-3">
                        <Form.Group controlId="email">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            className="custom-select-height"
                            placeholder="Enter email address"
                            {...formik.getFieldProps("email")}
                          />
                          {formik.touched.email && formik.errors.email && (
                            <div className="text-danger">
                              {formik.errors.email}
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={6} lg={4} className="mb-3">
                        <Form.Group controlId="parentName">
                          <Form.Label>Parents Name</Form.Label>
                          <Form.Control
                            type="text"
                            className="custom-select-height"
                            placeholder="Enter parents name"
                            {...formik.getFieldProps("parentName")}
                          />
                          {formik.touched.parentName &&
                            formik.errors.parentName && (
                              <div className="text-danger">
                                {formik.errors.parentName}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6} lg={4} className="mb-3">
                        <Form.Group controlId="parentContact">
                          <Form.Label>Parents Contact No</Form.Label>
                          <Form.Control
                            type="tel"
                            className="custom-select-height"
                            placeholder="Enter parents contact no"
                            {...formik.getFieldProps("parentContact")}
                          />
                          {formik.touched.parentContact &&
                            formik.errors.parentContact && (
                              <div className="text-danger">
                                {formik.errors.parentContact}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6} lg={4} className="mb-3">
                        <Form.Group controlId="occupation">
                          <Form.Label>Father's Occupation</Form.Label>
                          <Select
                            options={occupationOptions}
                            value={
                              occupationOptions.find(
                                (option) =>
                                  option.value === formik.values.occupation,
                              ) || null
                            }
                            onChange={(selectedOption) =>
                              formik.setFieldValue(
                                "occupation",
                                selectedOption?.value || "",
                              )
                            }
                            placeholder="Select occupation"
                            classNamePrefix="custom-select"
                            isClearable
                            isSearchable
                          />
                          {formik.touched.occupation &&
                            formik.errors.occupation && (
                              <div className="text-danger">
                                {formik.errors.occupation}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6} lg={4} className="mb-3">
                        <Form.Group controlId="income">
                          <Form.Label>Income</Form.Label>
                          <Form.Control
                            type="number"
                            className="custom-select-height"
                            placeholder="Enter income"
                            {...formik.getFieldProps("income")}
                          />
                          {formik.touched.income && formik.errors.income && (
                            <div className="text-danger">
                              {formik.errors.income}
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={6} lg={4} className="mb-3">
                        <Form.Group controlId="approvedBank">
                          <Form.Label>Approved Bank</Form.Label>
                          <Form.Control
                            type="text"
                            className="custom-select-height"
                            placeholder="Enter approved bank"
                            {...formik.getFieldProps("approvedBank")}
                          />
                          {formik.touched.approvedBank &&
                            formik.errors.approvedBank && (
                              <div className="text-danger">
                                {formik.errors.approvedBank}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6} lg={4} className="mb-3">
                        <Form.Group controlId="approvedAmount">
                          <Form.Label>Approved Amount</Form.Label>
                          <Form.Control
                            type="number"
                            className="custom-select-height"
                            placeholder="Enter approved amount"
                            {...formik.getFieldProps("approvedAmount")}
                          />
                          {formik.touched.approvedAmount &&
                            formik.errors.approvedAmount && (
                              <div className="text-danger">
                                {formik.errors.approvedAmount}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6} lg={4} className="mb-3">
                        <Form.Group controlId="interestAmount">
                          <Form.Label>Interest Amount</Form.Label>
                          <Form.Control
                            type="number"
                            className="custom-select-height"
                            placeholder="Enter interest amount"
                            {...formik.getFieldProps("interestAmount")}
                          />
                          {formik.touched.interestAmount &&
                            formik.errors.interestAmount && (
                              <div className="text-danger">
                                {formik.errors.interestAmount}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6} lg={4} className="mb-3">
                        <Form.Group controlId="loanType">
                          <Form.Label>Loan Type</Form.Label>
                          <Form.Control
                            type="text"
                            className="custom-select-height"
                            placeholder="Enter loan type"
                            {...formik.getFieldProps("loanType")}
                          />
                          {formik.touched.loanType &&
                            formik.errors.loanType && (
                              <div className="text-danger">
                                {formik.errors.loanType}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6} lg={4} className="mb-3">
                        <Form.Group controlId="remarks">
                          <Form.Label>Remarks</Form.Label>
                          <Form.Control
                            as="textarea"
                            className="custom-select-height"
                            placeholder="Enter remarks"
                            {...formik.getFieldProps("remarks")}
                          />
                          {formik.touched.remarks && formik.errors.remarks && (
                            <div className="text-danger">
                              {formik.errors.remarks}
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={6} lg={4} className="mb-3">
                        <Form.Group controlId="loanStartDate">
                          <Form.Label>Loan Start Date</Form.Label>
                          <div style={{ position: "relative" }}>
                            <Form.Control
                              type="text"
                              name="loanStartDate"
                              className="custom-select-height"
                              placeholder="dd/mm/yyyy"
                              value={
                                formik.values.loanStartDate
                                  ? formatDate(
                                      parseDate(formik.values.loanStartDate),
                                    )
                                  : ""
                              }
                              readOnly
                              ref={loanStartDateInputRef}
                              onClick={() => {
                                setLoanStartDateValue(
                                  parseDate(formik.values.loanStartDate) ||
                                    new Date(),
                                );
                                setShowLoanStartDateCalendar((show) => !show);
                              }}
                              style={{
                                cursor: "pointer",
                                backgroundColor: "#fff",
                              }}
                            />
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
                            {showLoanStartDateCalendar && (
                              <div
                                ref={loanStartDateCalendarRef}
                                style={{
                                  position: "absolute",
                                  top: "100%",
                                  left: "0",
                                  zIndex: 9999,
                                  background: "#fff",
                                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                                  borderRadius: "8px",
                                  marginTop: "4px",
                                  width: loanStartDateInputRef.current
                                    ? loanStartDateInputRef.current.offsetWidth
                                    : "auto",
                                  minWidth: 180,
                                }}
                              >
                                <Calendar
                                  className="form-control m-0 p-0 border-0"
                                  onChange={(selectedDate) => {
                                    setLoanStartDateValue(selectedDate);
                                    const yyyy = selectedDate.getFullYear();
                                    const mm = String(
                                      selectedDate.getMonth() + 1,
                                    ).padStart(2, "0");
                                    const dd = String(
                                      selectedDate.getDate(),
                                    ).padStart(2, "0");
                                    const dateString = `${yyyy}-${mm}-${dd}`;
                                    formik.setFieldValue(
                                      "loanStartDate",
                                      dateString,
                                    );
                                    setShowLoanStartDateCalendar(false);
                                  }}
                                  value={loanStartDateValue || new Date()}
                                  locale="en-GB"
                                />
                              </div>
                            )}
                          </div>
                          {formik.touched.loanStartDate &&
                            formik.errors.loanStartDate && (
                              <div className="text-danger">
                                {formik.errors.loanStartDate}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6} lg={4} className="mb-3">
                        <Form.Group controlId="loanEndDate">
                          <Form.Label>Loan End Date</Form.Label>
                          <div style={{ position: "relative" }}>
                            <Form.Control
                              type="text"
                              name="loanEndDate"
                              className="custom-select-height"
                              placeholder="dd/mm/yyyy"
                              value={
                                formik.values.loanEndDate
                                  ? formatDate(
                                      parseDate(formik.values.loanEndDate),
                                    )
                                  : ""
                              }
                              readOnly
                              ref={loanEndDateInputRef}
                              onClick={() => {
                                setLoanEndDateValue(
                                  parseDate(formik.values.loanEndDate) ||
                                    new Date(),
                                );
                                setShowLoanEndDateCalendar((show) => !show);
                              }}
                              style={{
                                cursor: "pointer",
                                backgroundColor: "#fff",
                              }}
                            />
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
                            {showLoanEndDateCalendar && (
                              <div
                                ref={loanEndDateCalendarRef}
                                style={{
                                  position: "absolute",
                                  top: "100%",
                                  left: "0",
                                  zIndex: 9999,
                                  background: "#fff",
                                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                                  borderRadius: "8px",
                                  marginTop: "4px",
                                  width: loanEndDateInputRef.current
                                    ? loanEndDateInputRef.current.offsetWidth
                                    : "auto",
                                  minWidth: 180,
                                }}
                              >
                                <Calendar
                                  className="form-control m-0 p-0 border-0"
                                  onChange={(selectedDate) => {
                                    setLoanEndDateValue(selectedDate);
                                    const yyyy = selectedDate.getFullYear();
                                    const mm = String(
                                      selectedDate.getMonth() + 1,
                                    ).padStart(2, "0");
                                    const dd = String(
                                      selectedDate.getDate(),
                                    ).padStart(2, "0");
                                    const dateString = `${yyyy}-${mm}-${dd}`;
                                    formik.setFieldValue(
                                      "loanEndDate",
                                      dateString,
                                    );
                                    setShowLoanEndDateCalendar(false);
                                  }}
                                  value={loanEndDateValue || new Date()}
                                  locale="en-GB"
                                />
                              </div>
                            )}
                          </div>
                          {formik.touched.loanEndDate &&
                            formik.errors.loanEndDate && (
                              <div className="text-danger">
                                {formik.errors.loanEndDate}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6} lg={4} className="mb-3">
                        <Form.Group controlId="status">
                          <Form.Label>Status</Form.Label>
                          <Select
                            options={statusOptions}
                            value={
                              statusOptions.find(
                                (option) =>
                                  option.value === formik.values.status,
                              ) || null
                            }
                            onChange={(selectedOption) =>
                              formik.setFieldValue(
                                "status",
                                selectedOption?.value || "",
                              )
                            }
                            placeholder="Select status"
                            classNamePrefix="custom-select"
                            isClearable
                            isSearchable
                          />
                          {formik.touched.status && formik.errors.status && (
                            <div className="text-danger">
                              {formik.errors.status}
                            </div>
                          )}
                        </Form.Group>
                      </Col>

                      <Col md={6} lg={4} className="mb-3">
                        <Form.Group controlId="followUpDate">
                          <Form.Label>Follow-up Date</Form.Label>

                          <div style={{ position: "relative" }}>
                            <Form.Control
                              type="text"
                              className="custom-select-height"
                              placeholder="dd/mm/yyyy"
                              value={
                                formik.values.followup
                                  ? formatDate(
                                      parseDate(formik.values.followup),
                                    )
                                  : ""
                              }
                              readOnly
                              ref={followUpDateInputRef}
                              onClick={() => {
                                setFollowUpDateValue(
                                  parseDate(formik.values.followup) ||
                                    new Date(),
                                );
                                setShowFollowUpCalendar((show) => !show);
                              }}
                              style={{
                                cursor: "pointer",
                                backgroundColor: "#fff",
                              }}
                            />

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

                            {showFollowUpCalendar && (
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
                                  width: followUpDateInputRef.current
                                    ? followUpDateInputRef.current.offsetWidth
                                    : "auto",
                                  minWidth: 180,
                                }}
                              >
                                <Calendar
                                  className="form-control m-0 p-0 border-0"
                                  onChange={(selectedDate) => {
                                    setFollowUpDateValue(selectedDate);
                                    const yyyy = selectedDate.getFullYear();
                                    const mm = String(
                                      selectedDate.getMonth() + 1,
                                    ).padStart(2, "0");
                                    const dd = String(
                                      selectedDate.getDate(),
                                    ).padStart(2, "0");
                                    const dateString = `${yyyy}-${mm}-${dd}`;
                                    formik.setFieldValue(
                                      "followup",
                                      dateString,
                                    );
                                    setShowFollowUpCalendar(false);
                                  }}
                                  value={followUpDateValue || new Date()}
                                  locale="en-GB"
                                />
                              </div>
                            )}
                          </div>

                          {formik.touched.followup &&
                            formik.errors.followup && (
                              <div className="text-danger">
                                {formik.errors.followup}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="text-end">
                      <Button
                        variant="primary"
                        className="custom-select-height"
                        type="submit"
                      >
                        {formik.values.id ? "Update" : "Add"}
                      </Button>
                    </div>
                  </Form>
                </Modal.Body>
              </Modal>

              <DataTable
                columns={columns}
                data={allLoans}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showDownloadButton={true}
                onDownload={handleDownload}
                canEdit={canUpdate}
                canDelete={canDelete}
                canRead={canRead}
              />

              {totalPages > 1 && allLoans.length > 0 && (
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
    </>
  );
};

export default EducationLoanInquiry;
