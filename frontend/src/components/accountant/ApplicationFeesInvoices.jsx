import { useState, useEffect, useRef } from "react";
import { Button, Card, Col, Form, Row, Modal } from "react-bootstrap";
import Pageheader from "../../layouts/Pageheader";
import usePermissions from "../commonComponents/usePermissions";
import InvoicePDFGenerator from "./InvoicePDFGenerator";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getAllB2BAdmin } from "../../redux/actions/B2BAdmin.action";
import {
  studentByB2B,
  studentInvoiceCreate,
  studentInvoiceDelete,
  studentInvoiceGetAll,
  studentInvoiceUpdate,
} from "../../redux/actions/Accountant/UniversityCom.action";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { AiOutlineClose } from "react-icons/ai";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAllSetting } from "../../redux/actions/Setting.action";
import ALLImages from "../../common/Imagedata";
import { currencyCode } from "../../redux/actions/CourseFinder.action";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import getSymbolFromCurrency from "currency-symbol-map";
import Paginations from "../elements/Paginations";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import { MdCalendarToday } from "react-icons/md";
import { getAllBankingDetails } from "../../redux/actions/Master/Banking.action";
import { getAllConfigurations } from "../../redux/actions/Configuration.action";
import { BASEURL } from "../../baseUrl";
import { decryptData } from "../../utils/encryptionUtils";

const ApplicationFeesInvoices = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [b2bList, setB2bList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [selectedB2B, setSelectedB2B] = useState(null);
  const [showInvoiceDateCalendar, setShowInvoiceDateCalendar] = useState(false);
  const [invoiceDateValue, setInvoiceDateValue] = useState(null);
  const invoiceDateInputRef = useRef(null);
  const [dashboardLogo, setDashboardLogo] = useState(ALLImages("logo1"));
  const dispatch = useDispatch();

  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currencyCodeData, setCurrencyCodeData] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterB2B, setFilterB2B] = useState(null);
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const startDateInputRef = useRef(null);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [endDateValue, setEndDateValue] = useState(null);
  const endDateInputRef = useRef(null);
  const [totalPayable, setTotalPayable] = useState(0);
  const [bankingDetails, setBankingDetails] = useState([]);
  const [configData, setConfigData] = useState(null);

  const { canCreate, canRead, canUpdate, canDelete, canDownload } =
    usePermissions("Application Fees Invoice");

  const storedEncryptedCurrency = decryptData(
    localStorage.getItem("crmCurrency")
  );

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
  });

  const ddPaidStatusOptions = [
    { label: "Paid", value: "Paid" },
    { label: "Unpaid", value: "Unpaid" },
  ];
  const paymentStatusOptions = [
    { label: "Paid", value: "paid" },
    { label: "Unpaid", value: "unpaid" },
  ];

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

  const formatDateForInput = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toISOString().split("T")[0];
  };
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

  const fetchConfigData = async () => {
    try {
      const res = await dispatch(getAllConfigurations());
      const responseData = res?.data;
      const config = responseData?.message?.[0]?.applicationFeeInvoice || null;
      if (config) {
        setConfigData(config);
      }
    } catch (error) {
      console.error("Error fetching configuration:", error);
    }
  };

  useEffect(() => {
    fetchBankingDetails();
    fetchConfigData();
  }, [dispatch]);

  const bankOptions = bankingDetails.map((bank) => ({
    label: bank.bankName,
    value: bank._id,
  }));

  const formik = useFormik({
    initialValues: {
      id: "",
      invoiceNo: "",
      invoiceDate: "",
      students: [
        {
          student: null,
          currencyCode: null,
          amount: "",
          rate: "",
          payable: "",
          paymentMode: "",
          bank: null,
          status: "Unpaid",
        },
      ],
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      if (
        !values.invoiceNo ||
        !values.invoiceDate ||
        !values.students.length ||
        values.students.some(
          (student) =>
            !student.student ||
            !student.currencyCode ||
            !student.amount ||
            !student.rate ||
            !student.payable ||
            !student.paymentMode ||
            !student.status ||
            ""
        )
      ) {
        toast.error("All fields are required");
        setSubmitting(false);
        return;
      }
      try {
        let payload;
        if (values.id) {
          const student = values.students[0];
          payload = {
            invoiceNo: values.invoiceNo,
            invoiceDate: values.invoiceDate,
            b2b: selectedB2B?.value || "",
            student: student.student?.value || "",
            currencyCode: student.currencyCode?.value || "",
            status: student.status,
            amount: student.amount,
            rate: student.rate,
            payable: student.payable,
            paymentMode: student.paymentMode,
            bank: student.bank || null,
          };
        } else {
          payload = {
            invoiceNo: values.invoiceNo,
            invoiceDate: values.invoiceDate,
            b2b: selectedB2B?.value || "",
            studentDetails: values.students.map((student) => ({
              student: student.student.value,
              currencyCode: student.currencyCode
                ? student.currencyCode.value
                : "",
              status: student.status,
              amount: student.amount,
              rate: student.rate,
              payable: student.payable,
              paymentMode: student.paymentMode,
              bank: student.bank || null,
            })),
          };
        }

        let res;
        if (values.id) {
          res = await dispatch(studentInvoiceUpdate(values.id, payload));
        } else {
          res = await dispatch(studentInvoiceCreate(payload));
        }

        if (res?.status === 200 || res?.status === 201) {
          toast.success(
            values.id
              ? "Invoice updated successfully!"
              : "Invoice created successfully!"
          );
          handleCloseModal();
          if (canRead) {
            fetchAllInvoices(
              currentPage,
              itemsPerPage,
              search,
              filterB2B?.value || "",
              filters.startDate,
              filters.endDate,
              filters.status?.value || ""
            );
          }
          resetForm();
        } else {
          toast.error(
            values.id ? "Failed to update invoice" : "Failed to create invoice"
          );
        }
      } catch (error) {
        console.error("Error creating/updating invoice:", error);
        toast.error(
          error?.response?.data?.message ||
          (values.id
            ? "Failed to update invoice"
            : "Failed to create invoice")
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleEdit = async (item) => {
    try {
      const students = [
        {
          student: item.student
            ? { value: item.student._id, label: item.student.name }
            : null,
          currencyCode: item.currencyCode
            ? { value: item.currencyCode, label: item.currencyCode }
            : null,
          status: item.status || "Unpaid",
          amount: item.amount || "",
          rate: item.rate || "",
          payable: item.payable || "",
          paymentMode: item.paymentMode || "",
          bank: item.bank || null,
        },
      ];

      formik.setValues({
        id: item._id,
        invoiceNo: item.invoiceNo || "",
        invoiceDate: item.invoiceDate,
        students,
        b2b: item.b2b._id || "",
      });

      if (item.b2b && item.b2b._id && item.b2b.companyName) {
        setSelectedB2B({
          value: item.b2b._id,
          label: item.b2b.companyName,
        });
        await fetchStudentsByB2B(item.b2b._id);
      } else {
        setSelectedB2B(null);
        setStudentList([]);
      }

      isEditingRef.current = true;
      setShowModal(true);
    } catch (error) {
      console.error("Error editing invoice:", error);
    }
  };

  const handleDelete = async (item) => {
    try {
      const res = await dispatch(studentInvoiceDelete(item._id));
      if (res?.status === 200) {
        toast.success("Invoice deleted successfully");
        const updatedPage =
          invoiceData?.length === 1 && currentPage > 1
            ? currentPage - 1
            : currentPage;
        setCurrentPage(updatedPage);
        if (canRead) {
          fetchAllInvoices(
            currentPage,
            itemsPerPage,
            search,
            filterB2B?.value || "",
            filters.startDate,
            filters.endDate,
            filters.status?.value || ""
          );
        }
      } else {
        toast.error("Failed to delete invoice");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice");
    }
  };

  const fetchAllInvoices = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    b2bId = filterB2B?.value || "",
    startDate = filters.startDate,
    endDate = filters.endDate,
    status = filters.status
  ) => {
    try {
      const res = await dispatch(
        studentInvoiceGetAll(
          page,
          limit,
          search,
          b2bId,
          startDate,
          endDate,
          status
        )
      );
      if (res?.status === 200) {
        const responseData = res?.data?.message || {};
        setInvoiceData(responseData?.data || []);
        setTotalRecords(responseData?.totalRecords || 0);
        setTotalPages(responseData?.totalPages || 0);

        const total = responseData?.data?.reduce((sum, item) => {
          const payable = item?.payable ? parseFloat(item.payable) : 0;
          return sum + (isNaN(payable) ? 0 : payable);
        }, 0);
        setTotalPayable(total);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to fetch invoices");
    } finally {
    }
  };

  const fetchB2BAdmins = async () => {
    try {
      const res = await dispatch(getAllB2BAdmin(1, 1000, "", "", ""));
      const responseData = res?.data?.data;
      setB2bList(responseData?.data || []);
    } catch (error) {
      console.error("Error fetching B2B Admins:", error);
      toast.error("Failed to fetch B2B Admins");
    }
  };

  const fetchStudentsByB2B = async (b2bId) => {
    try {
      const res = await dispatch(studentByB2B(b2bId));
      const responseData = res?.data?.data;
      setStudentList(responseData || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch students");
      setStudentList([]);
    }
  };

  const handleB2BChange = (selectedOption) => {
    setSelectedB2B(selectedOption);
    formik.setFieldValue("students", [
      {
        student: null,
        currencyCode: null,
        amount: "",
        rate: "",
        payable: "",
        status: "",
        paymentMode: "",
        bank: null,
      },
    ]);

    if (selectedOption) {
      fetchStudentsByB2B(selectedOption.value);
    } else {
      setStudentList([]);
    }
  };

  const addStudentEntry = () => {
    const currentStudents = formik.values.students;
    formik.setFieldValue("students", [
      ...currentStudents,
      {
        student: null,
        currencyCode: null,
        amount: "",
        rate: "",
        payable: "",
        status: "Unpaid",
        paymentMode: "",
        bank: null,
      },
    ]);
  };

  const removeStudentEntry = (index) => {
    const currentStudents = formik.values.students;
    if (currentStudents.length > 1) {
      const updatedStudents = currentStudents.filter((_, i) => i !== index);
      formik.setFieldValue("students", updatedStudents);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedB2B(null);
    setStudentList([]);
    formik.resetForm();
    setInvoiceDateValue(null);
    setShowInvoiceDateCalendar(false);
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedInvoices(invoiceData.map((item) => item._id));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleSelectInvoice = (invoiceId, checked) => {
    if (checked) {
      setSelectedInvoices([...selectedInvoices, invoiceId]);
    } else {
      setSelectedInvoices(selectedInvoices.filter((id) => id !== invoiceId));
    }
  };

  const handleExport = async (singleInvoice = null) => {
    let invoicesToExport = [];
    if (singleInvoice) {
      invoicesToExport = [singleInvoice];
    } else {
      if (selectedInvoices.length > 0) {
        invoicesToExport = invoiceData.filter((item) =>
          selectedInvoices.includes(item._id)
        );
      } else {
        invoicesToExport = invoiceData;
      }
      if (invoicesToExport.length === 0) {
        toast.warning("No invoices to generate PDF");
        return;
      }
    }

    try {
      setIsGenerating(true);

      if (singleInvoice) {
        const b2bCompany = b2bList.find(
          (b2b) => b2b._id === singleInvoice.b2b._id
        );
        const customerName = b2bCompany ? b2bCompany.companyName : "";

        const pdfData = {
          customerName: customerName,
          invoiceNumber: singleInvoice.invoiceNo,
          invoiceDate: singleInvoice.invoiceDate
            ? formatDate(new Date(singleInvoice.invoiceDate))
            : "",
          students: [
            {
              name: singleInvoice.student?.name || "",
              amount: singleInvoice.amount || "",
              rate: singleInvoice.rate || "",
              amountPayable: singleInvoice.payable || "",
              currencyCode: singleInvoice.currencyCode || "",
              status: singleInvoice.status || "",
            },
          ],
        };
        const pdfGenerator = InvoicePDFGenerator({
          invoiceData: pdfData,
          dashboardLogo,
          applicationFeeInvoice: configData || {},
        });
        await pdfGenerator.handleDownload();
      } else {
        const allB2Bs = invoicesToExport.map((inv) => inv?.b2b?._id);
        const uniqueB2Bs = [...new Set(allB2Bs)];
        let customerName = "Bulk Download";
        if (uniqueB2Bs.length === 1) {
          const b2bCompany = b2bList.find((b2b) => b2b?._id === uniqueB2Bs[0]);
          customerName = b2bCompany ? b2bCompany.companyName : "Bulk Download";
        }

        const pdfData = {
          customerName: customerName,
          invoiceNumber: "Bulk Download",
          invoiceDate: formatDate(new Date()),
          students: invoicesToExport.map((invoice) => ({
            name: invoice.student?.name || "",
            amount: invoice.amount || "",
            rate: invoice.rate || "",
            amountPayable: invoice.payable || "",
            currencyCode: invoice.currencyCode || "",
            status: invoicesToExport[0]?.status || "",
          })),
          currencyCode: invoicesToExport[0]?.currencyCode || "",
        };
        const pdfGenerator = InvoicePDFGenerator({
          invoiceData: pdfData,
          dashboardLogo,
          applicationFeeInvoice: configData || {},
        });
        await pdfGenerator.handleDownload();
      }

      toast.success("PDF generated successfully!");
      if (!singleInvoice) setSelectedInvoices([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error(`Error generating invoice: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const b2bOptions = b2bList.map((b2b) => ({
    value: b2b._id,
    label: b2b.companyName,
  }));

  const studentOptions = studentList.map((student) => ({
    value: student._id,
    label: student.name,
  }));

  const fetchDashboardLogo = async () => {
    try {
      const storedLogo = localStorage.getItem("companyLogo");

      if (storedLogo) {
        setDashboardLogo(storedLogo);
      } else {
        // const res = await dispatch(getAllSetting());
        const res = await dispatch(getAllConfigurations());
        if (res?.status === 200 && res.data.message[0].invoiceLogo) {
          setDashboardLogo(`${BASEURL}/${res.data.message[0].invoiceLogo}` || ALLImages("logo1"));
        }
      }
    } catch (error) {
      console.error("Fetch settings error:", error);
    }
  };

  const fetchAllCurrencyCode = async () => {
    try {
      const response = await dispatch(currencyCode());
      const responseData = response?.data?.data;
      setCurrencyCodeData(responseData || []);
    } catch (error) {
      console.error("Error fetching currencyCode codes:", error);
      setCurrencyCodeData([]);
    }
  };

  useEffect(() => {
    fetchB2BAdmins();
    fetchDashboardLogo();
    fetchAllCurrencyCode();
  }, []);

  useEffect(() => {
    if (canRead) {
      fetchAllInvoices(
        currentPage,
        itemsPerPage,
        search,
        filterB2B?.value || "",
        filters.startDate,
        filters.endDate,
        filters.status?.value || ""
      );
    }
  }, [canRead, currentPage, itemsPerPage, search, filterB2B, filters]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      fetchAllInvoices(
        1,
        newItemsPerPage,
        search,
        filterB2B?.value || "",
        filters.startDate,
        filters.endDate,
        filters.status?.value || ""
      );
    }
  };

  const isEditingRef = useRef(false);

  useEffect(() => {
    if (formik.values.id && b2bList.length > 0 && formik.values.b2bId) {
      const found = b2bList.find((b2b) => b2b._id === formik.values.b2bId);
      if (found) {
        setSelectedB2B({ value: found._id, label: found.companyName });
      }
    }
  }, [b2bList, formik.values.id, formik.values.b2bId]);

  return (
    <>
      <Pageheader
        mainheading="Application Fees Invoices"
        parentfolder="Accountant"
        activepage="Application Fees Invoices"
      />

      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div className="w-100 d-flex flex-wrap justify-content-end">
                {/* <div className="card-title">Application Fees Invoices</div> */}
                {canRead && (
                  <>
                    <div className="d-flex flex-wrap gap-2">
                      {(canCreate || canUpdate) && (
                        <Button
                          variant="primary"
                          className="custom-select-height px-3"
                          onClick={() => setShowModal(true)}
                        >
                          Add Invoice
                        </Button>
                      )}
                      {canDownload && (
                        <Button
                          variant="primary"
                          className="custom-select-height px-3"
                          onClick={() => handleExport()}
                          disabled={isGenerating}
                        >
                          {isGenerating ? "Generating..." : "Generate Invoice"}
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </Card.Header>
            <Card.Body>
              {canRead ? (
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
                      <Form.Label>B2B</Form.Label>
                      <Select
                        options={b2bOptions}
                        value={filterB2B}
                        onChange={(option) => {
                          setFilterB2B(option);
                          setCurrentPage(1);
                        }}
                        placeholder="Select B2B"
                        isSearchable
                        isClearable
                        className="filter-height"
                        classNamePrefix="custom-select"
                        styles={{
                          control: (base) => ({
                            ...base,
                            fontSize: "13px",
                            minHeight: "38px",
                          }),
                        }}
                      />
                    </div>
                    <div>
                      <Form.Label>Payment Status</Form.Label>
                      <Select
                        options={paymentStatusOptions}
                        value={paymentStatusOptions.find(
                          (option) => option.value === filters.status?.value
                        )}
                        onChange={(option) => {
                          setFilters({ ...filters, status: option });
                          setCurrentPage(1);
                        }}
                        placeholder="Select Payment"
                        isSearchable
                        isClearable
                        className="filter-height"
                        classNamePrefix="custom-select"
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
                        Total Payable:{" "}
                        <strong>
                          {storedEncryptedCurrency
                            ? getSymbolFromCurrency(storedEncryptedCurrency)
                            : "₹"}{" "}
                          {invoiceData?.length > 0
                            ? totalPayable?.toLocaleString("en-IN", {
                              maximumFractionDigits: 2,
                            })
                            : "0"}
                        </strong>
                      </span>
                    </div>
                    {/* <div className="filter-item">
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
                    </div> */}
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
                  <div
                    className="table-responsive modern-table-wrapper"
                    style={{
                      borderRadius: "12px",
                      border: "1px solid #dee2e6",
                    }}
                  >

                    <table
                      className="table table-hover modern-table table-nowrap"
                    style={{ width: "100%", overflowX: "auto" }}
                    >
                      <thead className="bg-light sticky-header">
                        <tr>
                          <th scope="col" style={{ minWidth: "50px" }}>
                            <Form.Check
                              type="checkbox"
                              checked={selectAll}
                              onChange={(e) =>
                                handleSelectAll(e.target.checked)
                              }
                              disabled={loading || invoiceData.length === 0}
                              className="custom-checkbox"
                            />
                          </th>
                          <th scope="col" style={{ minWidth: "120px" }}>
                            Invoice Date
                          </th>
                          <th scope="col" style={{ minWidth: "150px" }}>
                            B2B Name
                          </th>
                          <th scope="col" style={{ minWidth: "120px" }}>
                            Invoice Number
                          </th>
                          <th scope="col" style={{ minWidth: "100px" }}>
                            Student ID
                          </th>
                          <th scope="col" style={{ minWidth: "150px" }}>
                            Student Name
                          </th>
                          <th scope="col" style={{ minWidth: "180px" }}>
                            Student Email
                          </th>
                          <th scope="col" style={{ minWidth: "100px" }}>
                            Amount
                          </th>
                          <th scope="col" style={{ minWidth: "100px" }}>
                            Rate
                          </th>
                          <th scope="col" style={{ minWidth: "120px" }}>
                            Payable
                          </th>
                          <th scope="col" style={{ minWidth: "100px" }}>
                            Status
                          </th>
                          <th scope="col" style={{ minWidth: "150px" }}>
                            Created By
                          </th>
                          {/* <th scope="col" style={{ minWidth: "150px" }}>
                            Updated By
                          </th> */}
                          {(canCreate || canUpdate) && (
                            <th
                              scope="col"
                              className="sticky-col-right-last dynamic-width"
                              style={{ minWidth: "100px" }}
                            >
                              Actions
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {invoiceData?.length > 0 ? (
                          invoiceData.map((item, index) => {
                            return (
                              <tr key={item._id}>
                                <td
                                  style={{
                                    whiteSpace: "nowrap",
                                    minWidth: "50px",
                                  }}
                                >
                                  <Form.Check
                                    type="checkbox"
                                    checked={selectedInvoices.includes(
                                      item._id
                                    )}
                                    onChange={(e) =>
                                      handleSelectInvoice(
                                        item._id,
                                        e.target.checked
                                      )
                                    }
                                    className="custom-checkbox"
                                  />
                                </td>
                                <td
                                  style={{
                                    whiteSpace: "nowrap",
                                    minWidth: "120px",
                                  }}
                                >
                                  {item.invoiceDate
                                    ? formatDate(new Date(item.invoiceDate))
                                    : "-"}
                                </td>
                                <td
                                  style={{
                                    whiteSpace: "nowrap",
                                    minWidth: "150px",
                                  }}
                                >
                                  {item?.b2b ? item?.b2b?.companyName : "-"}
                                </td>
                                <td
                                  style={{
                                    whiteSpace: "nowrap",
                                    minWidth: "120px",
                                  }}
                                >
                                  {item.invoiceNo || "-"}
                                </td>
                                <td
                                  style={{
                                    whiteSpace: "nowrap",
                                    minWidth: "100px",
                                  }}
                                >
                                  {item.student?.studentId || "-"}
                                </td>
                                <td
                                  style={{
                                    whiteSpace: "nowrap",
                                    minWidth: "150px",
                                  }}
                                >
                                  {item.student?.name || "-"}
                                </td>
                                <td
                                  style={{
                                    whiteSpace: "nowrap",
                                    minWidth: "180px",
                                  }}
                                >
                                  {item.student?.email || "-"}
                                </td>
                                <td
                                  style={{
                                    whiteSpace: "nowrap",
                                    minWidth: "100px",
                                  }}
                                >
                                  {item.amount && item.currencyCode ? (
                                    <>
                                      {getSymbolFromCurrency(
                                        item.currencyCode
                                      ) || item.currencyCode}
                                      &nbsp;
                                      {new Intl.NumberFormat().format(
                                        Number(
                                          String(item.amount).replace(/,/g, "")
                                        )
                                      )}
                                    </>
                                  ) : item.amount ? (
                                    new Intl.NumberFormat().format(
                                      Number(
                                        String(item.amount).replace(/,/g, "")
                                      )
                                    )
                                  ) : (
                                    "-"
                                  )}
                                </td>
                                <td
                                  style={{
                                    whiteSpace: "nowrap",
                                    minWidth: "100px",
                                  }}
                                >
                                  {item.rate || "-"}
                                </td>
                                <td
                                  style={{
                                    whiteSpace: "nowrap",
                                    minWidth: "120px",
                                  }}
                                >
                                  {item.payable}
                                </td>
                                <td
                                  style={{
                                    whiteSpace: "nowrap",
                                    minWidth: "100px",
                                  }}
                                >
                                  {item?.status || "-"}
                                </td>
                                <td
                                  style={{
                                    whiteSpace: "nowrap",
                                    minWidth: "150px",
                                  }}
                                >
                                  {item.createdByName || "-"}
                                </td>
                                {/* <td
                                  style={{
                                    whiteSpace: "nowrap",
                                    minWidth: "150px",
                                  }}
                                >
                                  {item?.updatedByName || "-"}
                                </td> */}
                                {(canUpdate || canCreate) && (
                                  <td
                                    className="sticky-col-right-last dynamic-width-data"
                                    style={{ minWidth: "100px" }}
                                  >
                                    <IconButton
                                      aria-label="more"
                                      aria-controls={`menu-${index}`}
                                      aria-haspopup="true"
                                      onClick={(e) => {
                                        setOpenDropdown(
                                          openDropdown === index ? null : index
                                        );
                                        setAnchorEl(e.currentTarget);
                                      }}
                                    >
                                      <MoreVertIcon className="text-muted" />
                                    </IconButton>
                                    <Menu
                                      id={`menu-${index}`}
                                      anchorEl={anchorEl}
                                      open={openDropdown === index}
                                      onClose={() => setOpenDropdown(null)}
                                      MenuListProps={{
                                        "aria-labelledby": `menu-${index}`,
                                      }}
                                      sx={{
                                        "& .MuiPaper-root": {
                                          minWidth: "110px",
                                          boxShadow:
                                            "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                        },
                                      }}
                                    >
                                      {canUpdate && (
                                        <MenuItem
                                          key="edit"
                                          onClick={() => {
                                            handleEdit(item);
                                            setOpenDropdown(null);
                                          }}
                                        >
                                          <EditIcon
                                            fontSize="small"
                                            sx={{ mr: 1 }}
                                            className="edit-icon"
                                          />
                                          <span className="edit-action-text">
                                            Edit
                                          </span>
                                        </MenuItem>
                                      )}
                                      {canDelete && (
                                        <MenuItem
                                          key="delete"
                                          onClick={() => {
                                            setSelectedItem(item);
                                            setShowDeleteModal(true);
                                            setOpenDropdown(null);
                                          }}
                                        >
                                          <DeleteIcon
                                            fontSize="small"
                                            sx={{ mr: 1 }}
                                            className="delete-icon"
                                          />
                                          <span className="delete-action-text">
                                            Delete
                                          </span>
                                        </MenuItem>
                                      )}
                                      <MenuItem
                                        key="download"
                                        onClick={() => {
                                          handleExport(item);
                                          setOpenDropdown(null);
                                        }}
                                      >
                                        <DownloadIcon
                                          fontSize="small"
                                          sx={{ mr: 1 }}
                                          className="download-icon"
                                        />
                                        <span className="download-action-text">
                                          Download
                                        </span>
                                      </MenuItem>
                                    </Menu>
                                  </td>
                                )}
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="10" className="text-center py-4">
                              <div className="text-muted">
                                <i className="fe fe-inbox fs-3 d-block mb-2"></i>
                                No invoices found
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {totalPages > 1 && invoiceData.length > 0 && (
                    <div className="mt-4 d-flex justify-content-end align-items-end">
                      <Paginations
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                      /></div>

                  )}
                </>
              ) : (
                <div className="text-center py-5">
                  <h5 className="text-muted">Invoice Management</h5>
                  <p className="text-muted">
                    You don't have permission to view invoices.
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header className="form-main-heading">
          <Modal.Title className="fw-semibold">Confirm Deletion</Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={() => setShowDeleteModal(false)}
          />
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <div className="text-danger text-primary fs-1 mb-3">
            <i className="bi bi-exclamation-triangle-fill"></i>{" "}
          </div>
          <p className="mb-1 fw-semibold">
            Are you sure you want to delete this item?
          </p>
          <small className="text-muted">This action cannot be undone.</small>
        </Modal.Body>

        <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
          <Button
            variant="light"
            className="btn-cancel-delete px-4"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button
            className="btn-delete-confirm"
            onClick={() => {
              handleDelete(selectedItem);
              setShowDeleteModal(false);
            }}
          >
            <i className="bi bi-trash-fill me-2"></i>Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header className="form-main-heading">
          <Modal.Title>
            {formik.values.id ? "Edit Invoice" : "Add Invoice"}
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
              <Col md={6} className="mb-3">
                <Form.Label>Invoice Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Invoice Number"
                  {...formik.getFieldProps("invoiceNo")}
                  className="custom-select-height"
                />
                {formik.touched.invoiceNo && formik.errors.invoiceNo && (
                  <div className="invalid-feedback">
                    {formik.errors.invoiceNo}
                  </div>
                )}
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>Invoice Date</Form.Label>
                <div style={{ position: "relative" }}>
                  <Form.Control
                    type="text"
                    className="custom-select-height"
                    placeholder="dd/mm/yyyy"
                    value={
                      formik.values.invoiceDate
                        ? formatDate(parseDate(formik.values.invoiceDate))
                        : ""
                    }
                    readOnly
                    ref={invoiceDateInputRef}
                    onClick={() => {
                      if (formik.values.invoiceDate) {
                        setInvoiceDateValue(
                          parseDate(formik.values.invoiceDate)
                        );
                      }
                      setShowInvoiceDateCalendar((show) => !show);
                    }}
                    style={{ cursor: "pointer", backgroundColor: "#fff" }}
                  />
                  {formik.values.invoiceDate ? (
                    <button
                      type="button"
                      onClick={() => {
                        formik.setFieldValue("invoiceDate", "");
                        setInvoiceDateValue(null);
                        setShowInvoiceDateCalendar(false);
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
                  {showInvoiceDateCalendar && (
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
                        onChange={(date) => {
                          setInvoiceDateValue(date);
                          formik.setFieldValue("invoiceDate", toISODate(date));
                          setShowInvoiceDateCalendar(false);
                        }}
                        value={invoiceDateValue}
                        locale="en-GB"
                      />
                    </div>
                  )}
                  {formik.touched.invoiceDate && formik.errors.invoiceDate && (
                    <div className="invalid-feedback">
                      {formik.errors.invoiceDate}
                    </div>
                  )}
                </div>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>B2B Admin</Form.Label>
                <Select
                  options={b2bOptions}
                  value={selectedB2B}
                  onChange={handleB2BChange}
                  placeholder="Select B2B Admin"
                  className="filter-height"
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
              </Col>
            </Row>

            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="mb-0"></Form.Label>
                <Button
                  type="button"
                  variant="outline-primary"
                  size="sm"
                  onClick={addStudentEntry}
                  className="d-flex custom-select-height align-items-center gap-1"
                >
                  <FaPlus size={12} />
                  Add Student
                </Button>
              </div>

              {formik.values.students?.map((student, index) => (
                <div key={index} className="border rounded p-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    {formik.values.students.length > 1 && (
                      <Button
                        type="button"
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeStudentEntry(index)}
                        className="d-flex custom-select-height align-items-center gap-1"
                      >
                        <FaMinus size={12} />
                        Remove
                      </Button>
                    )}
                  </div>

                  <Row>
                    <Col md={6} className="mb-2">
                      <Form.Label>Student</Form.Label>
                      <Select
                        options={studentOptions}
                        value={student.student}
                        onChange={(option) =>
                          formik.setFieldValue(
                            `students.${index}.student`,
                            option
                          )
                        }
                        placeholder="Select Student"
                        className="filter-height"
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
                      {formik.touched.students?.[index]?.student &&
                        formik.errors.students?.[index]?.student && (
                          <div className="text-danger small mt-1">
                            {formik.errors.students[index].student}
                          </div>
                        )}
                    </Col>
                    <Col md={6} className="mb-2">
                      <Form.Label>Currency Code</Form.Label>
                      <Select
                        options={currencyCodeData?.map((code) => ({
                          value: code.code,
                          label: code.code,
                        }))}
                        value={student.currencyCode}
                        onChange={(option) =>
                          formik.setFieldValue(
                            `students.${index}.currencyCode`,
                            option
                          )
                        }
                        placeholder="Select Currency Code"
                        isClearable
                        className="filter-height"
                        classNamePrefix="custom-select"
                        styles={{
                          control: (base) => ({
                            ...base,
                            fontSize: "13px",
                            minHeight: "38px",
                          }),
                          placeholder: (base) => ({
                            ...base,
                            color: "black",
                            fontSize: "13px",
                          }),
                        }}
                      />
                      {formik.touched.students?.[index]?.currencyCode &&
                        formik.errors.students?.[index]?.currencyCode && (
                          <div className="text-danger small mt-1">
                            {formik.errors.students[index].currencyCode}
                          </div>
                        )}
                    </Col>
                    <Col md={6} className="mb-2">
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Amount"
                        value={student.amount}
                        onChange={(e) => {
                          const value = e.target.value;
                          formik.setFieldValue(
                            `students.${index}.amount`,
                            value
                          );

                          const rate = formik.values.students[index].rate || "";
                          const payable =
                            value && rate && !isNaN(value) && !isNaN(rate)
                              ? (parseFloat(value) * parseFloat(rate)).toFixed(
                                0
                              )
                              : "";
                          formik.setFieldValue(
                            `students.${index}.payable`,
                            payable
                          );
                        }}
                        className={`custom-select-height ${formik.touched.students?.[index]?.amount &&
                            formik.errors.students?.[index]?.amount
                            ? "is-invalid"
                            : ""
                          }`}
                      />
                      {formik.touched.students?.[index]?.amount &&
                        formik.errors.students?.[index]?.amount && (
                          <div className="invalid-feedback">
                            {formik.errors.students[index].amount}
                          </div>
                        )}
                    </Col>
                    <Col md={6} className="mb-2">
                      <Form.Label>Rate</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Rate"
                        value={student.rate}
                        onChange={(e) => {
                          const value = e.target.value;
                          formik.setFieldValue(`students.${index}.rate`, value);

                          const amount =
                            formik.values.students[index].amount || "";
                          const payable =
                            amount && value && !isNaN(amount) && !isNaN(value)
                              ? (
                                parseFloat(amount) * parseFloat(value)
                              ).toFixed(0)
                              : "";
                          formik.setFieldValue(
                            `students.${index}.payable`,
                            payable
                          );
                        }}
                        className={`custom-select-height ${formik.touched.students?.[index]?.rate &&
                            formik.errors.students?.[index]?.rate
                            ? "is-invalid"
                            : ""
                          }`}
                      />
                      {formik.touched.students?.[index]?.rate &&
                        formik.errors.students?.[index]?.rate && (
                          <div className="invalid-feedback">
                            {formik.errors.students[index].rate}
                          </div>
                        )}
                    </Col>
                    <Col md={6} className="mb-2">
                      <Form.Label>Payable</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Payable Amount"
                        value={student.payable}
                        disabled
                        className={`custom-select-height ${formik.touched.students?.[index]?.payable &&
                            formik.errors.students?.[index]?.payable
                            ? "is-invalid"
                            : ""
                          }`}
                      />
                      {formik.touched.students?.[index]?.payable &&
                        formik.errors.students?.[index]?.payable && (
                          <div className="invalid-feedback">
                            {formik.errors.students[index].payable}
                          </div>
                        )}
                    </Col>
                    <Col md={6} className="mb-2">
                      <Form.Label>Payment Mode</Form.Label>
                      <Select
                        options={paymentModeOptions}
                        value={
                          paymentModeOptions.find(
                            (option) => option.value === student.paymentMode
                          ) || null
                        }
                        onChange={(option) =>
                          formik.setFieldValue(
                            `students[${index}].paymentMode`,
                            option ? option.value : ""
                          )
                        }
                        classNamePrefix="custom-select"
                        placeholder="Select payment mode"
                        styles={{
                          control: (base) => ({
                            ...base,
                            fontSize: "13px",
                          }),
                        }}
                        isClearable
                      />
                      {formik.touched.students?.[index]?.paymentMode &&
                        formik.errors.students?.[index]?.paymentMode && (
                          <div className="text-danger mt-1">
                            {formik.errors.students[index]?.paymentMode}
                          </div>
                        )}
                    </Col>
                    <Col md={6} className="mb-2">
                      <Form.Label>Fees</Form.Label>
                      <Select
                        options={ddPaidStatusOptions}
                        value={
                          ddPaidStatusOptions.find(
                            (option) => option.value === student.status
                          ) || { value: "Unpaid", label: "Unpaid" }
                        }
                        onChange={(option) =>
                          formik.setFieldValue(
                            `students[${index}].status`,
                            option ? option.value : "Unpaid"
                          )
                        }
                        placeholder="Select Fees"
                        className="filter-height"
                        classNamePrefix="custom-select"
                        isSearchable
                        styles={{
                          control: (base) => ({
                            ...base,
                            fontSize: "13px",
                            minHeight: "38px",
                          }),
                        }}
                      />
                      {formik.touched.students?.[index]?.status &&
                        formik.errors.students?.[index]?.status && (
                          <div className="text-danger small mt-1">
                            {formik.errors.students[index].status}
                          </div>
                        )}
                    </Col>
                    <Col md={6} className="mb-2">
                      {["GPay", "Bank", "UPI"].includes(
                        student.paymentMode
                      ) && (
                          <Form.Group>
                            <Form.Label>Bank</Form.Label>
                            <Select
                              className=""
                              options={bankOptions}
                              value={
                                bankOptions.find(
                                  (option) => option.value === student.bank
                                ) || null
                              }
                              onChange={(option) =>
                                formik.setFieldValue(
                                  `students[${index}].bank`,
                                  option ? option.value : null
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
                            {formik.touched.students?.[index]?.bank &&
                              formik.errors.students?.[index]?.bank && (
                                <div className="text-danger mt-1">
                                  {formik.errors.students[index]?.bank}
                                </div>
                              )}
                          </Form.Group>
                        )}
                    </Col>
                  </Row>
                </div>
              ))}

              {formik.touched.students &&
                formik.errors.students &&
                typeof formik.errors.students === "string" && (
                  <div className="text-danger small">
                    {formik.errors.students}
                  </div>
                )}
            </div>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="primary"
                className="custom-select-height"
                type="submit"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting
                  ? formik.values.id
                    ? "Updating..."
                    : "Adding..."
                  : formik.values.id
                    ? "Update Invoice"
                    : "Add Invoice"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ApplicationFeesInvoices;
