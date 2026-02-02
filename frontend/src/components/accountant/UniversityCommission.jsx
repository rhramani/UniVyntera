import { Button, Card, Col, Dropdown, Form, Modal, Row } from "react-bootstrap";
import Pageheader from "../../layouts/Pageheader";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch } from "react-redux";
import { decryptData } from "../../utils/encryptionUtils";
import usePermissions from "../commonComponents/usePermissions";
import { BASEURL, REACT_APP_API_URL } from "../../baseUrl";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import {
  getAllUniversityCommission,
  getTotalCommissionCountry,
  getTotalCommissionUniversity,
} from "../../redux/actions/Accountant/UniversityCom.action";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getOneStudentApplication,
  updateStudentApplication,
} from "../../redux/actions/Student/StudentApplication.action";
import { getAllAccountantStatus } from "../../redux/actions/Master/AccountantStatus.action";
import Paginations from "../elements/Paginations";
import getSymbolFromCurrency from "currency-symbol-map";
import InvoiceTemplate from "./InvoiceTemplate";
import ALLImages from "../../common/Imagedata";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdCalendarToday } from "react-icons/md";
import { getAllBankingDetails } from "../../redux/actions/Master/Banking.action";
import { getAllConfigurations } from "../../redux/actions/Configuration.action";

const UniversityCommission = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [commissionData, setCommissionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState("");
  const [instituteData, setInstituteData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [universityCommissionStatus, setUniversityCommissionStatus] = useState(
    []
  );
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [dashboardLogo, setDashboardLogo] = useState(ALLImages("logo1"));
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const startDateInputRef = useRef(null);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [endDateValue, setEndDateValue] = useState(null);
  const endDateInputRef = useRef(null);
  const [showInvoiceDateCalendar, setShowInvoiceDateCalendar] = useState(false);
  const [invoiceDateValue, setInvoiceDateValue] = useState(null);
  const invoiceDateInputRef = useRef(null);
  const [totalCommission, setTotalCommission] = useState(0);
  const [bankingDetails, setBankingDetails] = useState([]);
  const [configData, setConfigData] = useState(null);

  const userRole = decryptData(localStorage.getItem("role"));
  const { canCreate, canRead, canUpdate, canDelete, canDownload } =
    usePermissions("University Commissions");
  const storedEncryptedCurrency = decryptData(
    localStorage.getItem("crmCurrency")
  );

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    institute: null,
    country: null,
    invoiceGenerate: true,
    paymentReceived: true,
  });

  const instituteOptions = instituteData?.map((institute) => ({
    value: institute._id,
    label: institute.instituteName,
  }));

  const countryOptions = countryData?.map((country) => ({
    value: country,
    label: country,
  }));

  const paymentModeOptions = [
    { label: "GPay", value: "GPay" },
    { label: "Bank", value: "Bank" },
    { label: "Cash", value: "Cash" },
    { label: "UPI", value: "UPI" },
  ];

  const generatedStatusOptions = [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
  ];

  const paymentReceivedOptions = [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
  ];

  const formatDateForInput = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toISOString().split("T")[0];
  };

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

  const calculateTotalCommission = (data, selectedInstituteId) => {
    if (!data || !selectedInstituteId) return 0;

    let total = 0;

    data.forEach((item) => {
      const relevantCourses = item?.interestedCourseDetails?.filter(
        (course) => course?.institute?._id === selectedInstituteId
      );

      if (relevantCourses?.length > 0) {
        const percentage =
          item?.universitySideConfirmation?.commissionPercentage;
        const commissionType = item?.universitySideConfirmation?.commissionType;

        relevantCourses.forEach((course) => {
          let feeAmount = course?.instituteFeePayment?.feeAmount;
          const currencyCode = course?.instituteFeePayment?.currencyCode;
          if (feeAmount && typeof feeAmount === "string") {
            feeAmount = feeAmount.replace(/,/g, "");
          }

          if (
            commissionType === "Percentage" &&
            feeAmount &&
            !isNaN(feeAmount) &&
            percentage
          ) {
            const commissionValue =
              (parseFloat(feeAmount) * parseFloat(percentage)) / 100;
            total += commissionValue;
          } else if (
            commissionType === "Amount" &&
            item?.universitySideConfirmation?.commissionAmount
          ) {
            total += parseFloat(
              item.universitySideConfirmation.commissionAmount
            );
          }
        });
      }
    });

    return total.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

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
      const config = responseData?.message?.[0] || null;
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
      universitytInvoiceGenerated: {
        status: false,
        date: "",
      },
      universityPaymentReceived: {
        status: false,
        amount: "",
        paymentMode: "",
        bank: "",
        b2bCommission: {
          commissionType: "",
          commissionPercentage: "",
          commissionAmount: "",
        },
      },
    },
    onSubmit: async (values) => {
      try {
        const payload = {
          universitytInvoiceGenerated: {
            status: values.universitytInvoiceGenerated.status,
            ...(values.universitytInvoiceGenerated.status &&
            values.universitytInvoiceGenerated.date
              ? { date: values.universitytInvoiceGenerated.date }
              : { date: null }),
          },
          universityPaymentReceived: {
            status: values.universityPaymentReceived.status,
            amount: values.universityPaymentReceived.amount,
            paymentMode: values.universityPaymentReceived.paymentMode || null,
            bank: values.universityPaymentReceived.bank || null,
            ...(values.universityPaymentReceived.status
              ? {
                  b2bCommission: {
                    commissionType:
                      values.universityPaymentReceived.b2bCommission
                        .commissionType || null,
                    ...(values.universityPaymentReceived.b2bCommission
                      .commissionType === "Percentage"
                      ? {
                          commissionPercentage: values.universityPaymentReceived
                            .b2bCommission.commissionPercentage
                            ? parseFloat(
                                values.universityPaymentReceived.b2bCommission
                                  .commissionPercentage
                              )
                            : null,
                        }
                      : { commissionPercentage: null }),
                    ...(values.universityPaymentReceived.b2bCommission
                      .commissionType === "Amount"
                      ? {
                          commissionAmount: values.universityPaymentReceived
                            .b2bCommission.commissionAmount
                            ? String(
                                values.universityPaymentReceived.b2bCommission
                                  .commissionAmount
                              )
                            : null,
                        }
                      : { commissionAmount: null }),
                  },
                }
              : {
                  b2bCommission: {
                    commissionType: null,
                    commissionPercentage: null,
                    commissionAmount: null,
                  },
                }),
          },
        };

        const response = await dispatch(
          updateStudentApplication(payload, selectedStudentId)
        );

        if (response.status === 200) {
          toast.success("Student application updated successfully!");
          handleCloseModal();
          fetchAllUniversityCommissions(
            currentPage,
            itemsPerPage,
            search,
            filters.startDate,
            filters.endDate,
            filters.institute?.value,
            filters.country?.value,
            filters.invoiceGenerate?.value,
            filters.paymentReceived?.value
          );
        }
      } catch (error) {
        console.error("Error in onSubmit:", error);
        toast.error(
          error?.response?.data?.message ||
            "Failed to update student application"
        );
      }
    },
  });

  const fetchStudentData = async (studentId) => {
    try {
      const response = await dispatch(getOneStudentApplication(studentId));
      const data = response?.data?.data;
      return data || {};
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const fetchAllUniversityCommissions = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    startDate = filters.startDate,
    endDate = filters.endDate,
    institute = filters.institute?.value || "",
    country = filters.country?.value || "",
    invoiceGenerate = filters.invoiceGenerate?.value || "",
    paymentReceived = filters.paymentReceived?.value || ""
  ) => {
    try {
      setLoading(true);
      const res = await dispatch(
        getAllUniversityCommission(
          page,
          limit,
          search,
          startDate,
          endDate,
          institute,
          country,
          invoiceGenerate,
          paymentReceived
        )
      );
      const responseData = res?.data?.data || [];
      setCommissionData(responseData?.data || []);
      setTotalPages(responseData?.totalPages || 0);
      setTotalRecords(responseData?.totalRecords || 0);
      // Calculate total commission
      const total = calculateTotalCommission(responseData?.data, institute);
      setTotalCommission(total);
    } catch (error) {
      console.log("Error fetching university commissions:", error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch commission data"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardLogo = async () => {
    try {
      const storedLogo = localStorage.getItem("companyLogo");
      if (storedLogo) {
        setDashboardLogo(storedLogo);
      } else {
        const res = await dispatch(getAllConfigurations());
        if (res?.status === 200 && res.data.message[0].invoiceLogo) {
          setDashboardLogo(`${BASEURL}/${res.data.message[0].invoiceLogo}` || ALLImages("logo1"));
        }
      }
    } catch (error) {
      console.error("Fetch settings error:", error);
    }
  };

  useEffect(() => {
    fetchDashboardLogo();
  }, []);

  const handleExport = () => {
    try {
      const selectedIds = Object.keys(selectedItems).filter(
        (id) => selectedItems[id]
      );
      let dataToExport =
        selectedIds.length > 0
          ? commissionData.filter((item) => selectedIds.includes(item._id))
          : commissionData;

      if (!dataToExport || dataToExport.length === 0) {
        toast.error("No data available to export.");
        return;
      }

      // Calculate commission amount for percentage type
      dataToExport = dataToExport.map((item) => {
        let commissionAmount =
          item?.universitySideConfirmation?.commissionAmount || null;
        if (item?.universitySideConfirmation?.commissionType === "Percentage") {
          // Calculate based on first interested course (or sum all if needed)
          const percentage = parseFloat(
            item?.universitySideConfirmation?.commissionPercentage
          );
          const course = item?.interestedCourseDetails?.[0];
          let feeAmount = course?.instituteFeePayment?.feeAmount;
          if (feeAmount && typeof feeAmount === "string") {
            feeAmount = feeAmount.replace(/,/g, "");
          }
          if (feeAmount && !isNaN(feeAmount) && percentage) {
            commissionAmount = (
              (parseFloat(feeAmount) * percentage) /
              100
            ).toFixed(2);
          } else {
            commissionAmount = null;
          }
        }
        return {
          ...item,
          commissionAmount, // always set commissionAmount for InvoiceTemplate
        };
      });

      const invoiceDate = new Date().toLocaleDateString("en-GB");
      const invoiceNumber = Math.floor(Math.random() * 1000) + 100;

      const { handleDownload } = InvoiceTemplate({
        dashboardLogo,
        dataToExport,
        invoiceDate,
        invoiceNumber,
        uniCommissionInvoice: configData?.uniCommissionInvoice || {},
      });

      handleDownload();
      setSelectedItems({});
      setSelectAll(false);
    } catch (error) {
      toast.error("Something went wrong while generating the invoice.");
      console.error("Error generating invoice:", error);
    }
  };
  const handleOpenModal = (studentId) => {
    setSelectedStudentId(studentId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    formik.resetForm();
  };

  const fetchAllInstitute = async () => {
    try {
      const res = await dispatch(getTotalCommissionUniversity());
      setInstituteData(res?.data?.data);
    } catch (error) {
      console.log("Error fetching in getAll Institute");
    }
  };

  const fetchAllCountry = async () => {
    try {
      const res = await dispatch(getTotalCommissionCountry());
      setCountryData(res?.data?.data);
    } catch (error) {
      console.log("Error fetching in getAll country");
    }
  };

  const fetchEligibleStudentStatus = async () => {
    try {
      const res = await dispatch(getAllAccountantStatus());
      if (res?.status === 200) {
        setUniversityCommissionStatus(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching student statuses:", error);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const payload = {
        accountantStatus: newStatus,
        sendUniversityCommissionEmail: true,
      };
      const res = await dispatch(
        updateStudentApplication(payload, applicationId)
      );
      if (res?.status === 200) {
        toast.success("Status updated successfully");
        fetchAllUniversityCommissions(
          currentPage,
          itemsPerPage,
          search,
          filters.startDate,
          filters.endDate,
          filters.institute?.value,
          filters.country?.value,
          filters.invoiceGenerate?.value,
          filters.paymentReceived?.value
        );
        setEditingStatusId(null);
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating student status:", error);
    }
  };

  useEffect(() => {
    fetchEligibleStudentStatus();
    fetchAllInstitute();
    fetchAllCountry();
  }, []);

  useEffect(() => {
    if (canRead) {
      fetchAllUniversityCommissions(
        currentPage,
        itemsPerPage,
        search,
        filters.startDate,
        filters.endDate,
        filters.institute?.value,
        filters.country?.value,
        filters.invoiceGenerate?.value,
        filters.paymentReceived?.value
      );
    }
  }, [currentPage, itemsPerPage, search, filters]);

  useEffect(() => {
    if (showModal && selectedStudentId) {
      fetchStudentData(selectedStudentId).then((data) => {
        formik.setValues({
          universitytInvoiceGenerated: {
            status: data?.universitytInvoiceGenerated?.status || false,
            date:
              formatDateForInput(data?.universitytInvoiceGenerated?.date) || "",
          },
          universityPaymentReceived: {
            status: data?.universityPaymentReceived?.status || false,
            amount: data?.universityPaymentReceived?.amount || "",
            b2bCommission: {
              commissionType:
                data?.universityPaymentReceived?.b2bCommission
                  ?.commissionPercentage != null
                  ? "Percentage"
                  : data?.universityPaymentReceived?.b2bCommission
                      ?.commissionAmount != null
                  ? "Amount"
                  : "",
              commissionPercentage:
                data?.universityPaymentReceived?.b2bCommission
                  ?.commissionPercentage || "",
              commissionAmount:
                data?.universityPaymentReceived?.b2bCommission
                  ?.commissionAmount || "",
            },
          },
        });
      });
    }
  }, [showModal, selectedStudentId]);

  const handleCheckboxChange = (e, id) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: e.target.checked,
    }));
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    const newSelectedItems = {};
    commissionData.forEach((item) => {
      newSelectedItems[item._id] = checked;
    });
    setSelectedItems(newSelectedItems);
  };

  const tagColors = [
    { bg: "#D1FAE5", text: "#047857" }, // green
    { bg: "#DBEAFE", text: "#1D4ED8" }, // blue
    { bg: "#EDE9FE", text: "#6D28D9" }, // purple
    { bg: "#FEF3C7", text: "#B45309" }, // yellow
    { bg: "#F5D0FE", text: "#A21CAF" }, // pink
    { bg: "#C7D2FE", text: "#3730A3" }, // indigo
  ];

  const getColors = (name) => {
    const index =
      [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      tagColors.length;
    return tagColors[index];
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      fetchAllUniversityCommissions(
        1,
        newItemsPerPage,
        search,
        filters.startDate,
        filters.endDate,
        filters.institute?.value,
        filters.country?.value,
        filters.invoiceGenerate?.value,
        filters.paymentReceived?.value
      );
    }
  };

  const selectedStudent = commissionData.find(
    (item) => item._id === selectedStudentId
  );

  const isB2BOrBranch =
    selectedStudent?.created_by_type === "B2B Admin" ||
    selectedStudent?.created_by_type === "B2B Member" ||
    selectedStudent?.created_by_type === "Branch Member" ||
    selectedStudent?.created_by_type === "Branch User" ||
    selectedStudent?.created_by_type === "Branch";

  const statusOptions = universityCommissionStatus?.map((status) => ({
    value: status?.name,
    label: status?.name,
  }));
  return (
    <>
      <Pageheader
        mainheading="University Commission"
        parentfolder="Accountant"
        activepage="University Commission"
      />

      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div className="w-100 d-flex flex-wrap justify-content-between">
                <div className="card-title">University Commissions</div>
                {canRead && (
                  <>
                    <div className="d-flex flex-wrap gap-2">
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
                      {canDownload && (
                        <Button
                          variant="primary"
                          className="custom-select-height px-3"
                          onClick={() => handleExport()}
                        >
                          Generate Invoice
                        </Button>
                      )}
                    </div>
                  </>
                )}
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
                      <Form.Label>Institute</Form.Label>
                      <Select
                        options={instituteOptions}
                        value={
                          instituteOptions.find(
                            (option) =>
                              option.value === filters.institute?.value
                          ) || null
                        }
                        onChange={(option) => {
                          setFilters({ ...filters, institute: option });
                          setCurrentPage(1);
                        }}
                        placeholder="Select Institute"
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
                    </div>

                    <div className="filter-item">
                      <Form.Label>Country</Form.Label>
                      <Select
                        options={countryOptions}
                        value={
                          countryOptions.find(
                            (option) => option.value === filters.country?.value
                          ) || null
                        }
                        onChange={(option) => {
                          setFilters({ ...filters, country: option });
                          setCurrentPage(1);
                        }}
                        placeholder="Select Country"
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
                    </div>

                    <div className="filter-item">
                      <Form.Label>invoice Generate</Form.Label>
                      <Select
                        options={generatedStatusOptions}
                        value={
                          generatedStatusOptions.find(
                            (option) =>
                              option.value === filters.invoiceGenerate?.value
                          ) || null
                        }
                        onChange={(option) => {
                          setFilters({ ...filters, invoiceGenerate: option });
                          setCurrentPage(1);
                        }}
                        placeholder="Select invoice Generate"
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
                    </div>

                    <div className="filter-item">
                      <Form.Label>Payment Received</Form.Label>
                      <Select
                        options={paymentReceivedOptions}
                        value={
                          paymentReceivedOptions.find(
                            (option) =>
                              option.value === filters.paymentReceived?.value
                          ) || null
                        }
                        onChange={(option) => {
                          setFilters({ ...filters, paymentReceived: option });
                          setCurrentPage(1);
                        }}
                        placeholder="Select Payment Received"
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
                    </div>

                    <div className="flex-grow-1"></div>
                    <div>
                      {filters.institute?.value &&
                        totalCommission !== "0.00" && (
                          <div className="custom-select-height px-3 mt-2 mt-md-0 d-flex align-items-center bg-success bg-opacity-10 border border-success rounded">
                            <span className="text-success fw-semibold">
                              <i className="bi bi-check-circle me-2"></i>
                              Total Commission:{" "}
                              <strong>
                                {storedEncryptedCurrency
                                  ? getSymbolFromCurrency(
                                      storedEncryptedCurrency
                                    )
                                  : "₹"}{" "}
                                {totalCommission}
                              </strong>
                            </span>
                          </div>
                        )}
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
                          Total Records: <strong> {totalRecords}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="table-responsive modern-table-wrapper">
                <table
                  className="table table-hover modern-table border table-nowrap"
                  style={{ width: "100%", overflowX: "auto" }}
                >
                  <thead className="bg-light sticky-header">
                    <tr>
                      <th
                        scope="col"
                        className="No-column-2 text-center"
                        style={{ minWidth: "50px", textAlign: "center" }}
                      >
                        <Form.Check
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="custom-checkbox"
                        />
                      </th>
                      <th scope="col" style={{ minWidth: "100px" }}>
                        Date
                      </th>
                      <th scope="col" style={{ minWidth: "120px" }}>
                        Student ID
                      </th>
                      <th scope="col" style={{ minWidth: "120px" }}>
                        Status
                      </th>
                      <th scope="col" style={{ minWidth: "150px" }}>
                        Student Name
                      </th>
                      <th scope="col" style={{ minWidth: "150px" }}>
                        Email
                      </th>
                      <th scope="col" style={{ minWidth: "150px" }}>
                        Contact
                      </th>
                      <th scope="col" style={{ minWidth: "200px" }}>
                        Institute Name
                      </th>
                      <th scope="col" style={{ minWidth: "200px" }}>
                        Program Name
                      </th>
                      <th scope="col" style={{ minWidth: "120px" }}>
                        Type
                      </th>
                      <th scope="col" style={{ minWidth: "120px" }}>
                        Preferred Country
                      </th>
                      <th scope="col" style={{ minWidth: "200px" }}>
                        Invoice Generated
                      </th>
                      <th scope="col" style={{ minWidth: "200px" }}>
                        University Payment Received
                      </th>
                      <th scope="col" style={{ minWidth: "150px" }}>
                        University Payment
                      </th>
                      <th scope="col" style={{ minWidth: "120px" }}>
                        Intake Year
                      </th>
                      <th scope="col" style={{ minWidth: "120px" }}>
                        Intake Month
                      </th>
                      <th scope="col" style={{ minWidth: "150px" }}>
                        Tuition Fee
                      </th>
                      <th scope="col" style={{ minWidth: "150px" }}>
                        Commission Type
                      </th>
                      <th scope="col" style={{ minWidth: "150px" }}>
                        Commission Value
                      </th>
                      <th scope="col" style={{ minWidth: "150px" }}>
                        Created By
                      </th>
                      <th scope="col" style={{ minWidth: "150px" }}>
                        Updated By
                      </th>
                      <th
                        scope="col"
                        className="sticky-col-right-last dynamic-width"
                        style={{ minWidth: "100px" }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {commissionData?.length > 0 ? (
                      commissionData.map((item, index) => {
                        const colors = getColors(item?.name || "Unknown");
                        const instituteNames =
                          item?.interestedCourseDetails?.length > 0
                            ? item.interestedCourseDetails
                                .map(
                                  (course) =>
                                    course?.institute?.instituteName || "N/A"
                                )
                                .join(", ")
                            : "-";
                        const programNames =
                          item?.interestedCourseDetails?.length > 0
                            ? item.interestedCourseDetails
                                .map(
                                  (course) =>
                                    course?.course?.programName || "N/A"
                                )
                                .join(", ")
                            : "-";
                        const currentStatus =
                          statusOptions.find(
                            (option) => option.value === item?.accountantStatus
                          )?.label ||
                          item?.accountantStatus ||
                          "-";
                        return (
                          <tr
                            key={item._id}
                            className={
                              selectedItems[item._id] ? "selected-row" : ""
                            }
                          >
                            <td
                              className="No-column-2 text-center"
                              style={{ minWidth: "50px", textAlign: "center" }}
                            >
                              <Form.Check
                                type="checkbox"
                                checked={selectedItems[item._id] || false}
                                onChange={(e) =>
                                  handleCheckboxChange(e, item._id)
                                }
                                className="custom-checkbox"
                              />
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "100px",
                              }}
                            >
                              {new Date(
                                item?.verificationDate || item?.createdAt
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                timeZone: "UTC",
                              })}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "100px",
                              }}
                            >
                              {item?.studentId || "-"}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "120px",
                              }}
                            >
                              <Dropdown>
                                {(() => {
                                  const matchedStatus =
                                    universityCommissionStatus?.find(
                                      (status) =>
                                        status.name === item?.accountantStatus
                                    );
                                  const bgColor =
                                    matchedStatus?.color || "#0b3c8c";
                                  const textColor = [
                                    "#e9e216",
                                    "#1fff44",
                                  ].includes(bgColor)
                                    ? "#000000"
                                    : "#ffffff";
                                  const displayStatus =
                                    item?.accountantStatus === "false" ||
                                    item?.accountantStatus === false ||
                                    item?.accountantStatus === ""
                                      ? "New"
                                      : item?.accountantStatus || "New";
                                  return (
                                    <>
                                      <style>
                                        {`
                                          .pill-dropdown-${item._id} {
                                            background-color: ${bgColor} !important;
                                            border: 1px solid ${bgColor} !important;
                                            color: ${textColor} !important;
                                            font-size: 13px !important;
                                            padding: 4px 12px !important;
                                            border-radius: 9999px !important;
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            gap: 6px;
                                          }

                                          .pill-dropdown-${item._id}:hover,
                                          .pill-dropdown-${item._id}:focus,
                                          .pill-dropdown-${item._id}:active,
                                          .pill-dropdown-${item._id}.show {
                                            background-color: ${bgColor} !important;
                                            border-color: ${bgColor} !important;
                                            color: ${textColor} !important;
                                            box-shadow: none !important;
                                          }
                                        `}
                                      </style>

                                      <Dropdown.Toggle
                                        className={`pill-dropdown-${item._id}`}
                                      >
                                        {displayStatus}
                                      </Dropdown.Toggle>

                                      <Dropdown.Menu
                                        style={{
                                          minWidth: "150px",
                                          boxShadow:
                                            "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                          borderRadius: "6px",
                                        }}
                                      >
                                        {statusOptions.map((option) => (
                                          <Dropdown.Item
                                            key={option.value}
                                            onClick={() =>
                                              handleStatusChange(
                                                item._id,
                                                option.value
                                              )
                                            }
                                            style={{ fontSize: "13px" }}
                                          >
                                            {option.label}
                                          </Dropdown.Item>
                                        ))}
                                      </Dropdown.Menu>
                                    </>
                                  );
                                })()}
                              </Dropdown>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "120px",
                              }}
                            >
                              <span
                                className="px-3 py-1 rounded-pill"
                                style={{
                                  backgroundColor: colors.bg,
                                  color: colors.text,
                                }}
                              >
                                {item?.name || "-"}
                              </span>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "120px",
                              }}
                            >
                              {item?.email || "-"}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "150px",
                              }}
                            >
                              {item?.contact || "-"}
                            </td>
                            <td>{instituteNames}</td>
                            <td>{programNames}</td>
                            <td>
                              {item?.created_by_type === "user"
                                ? "Head Office"
                                : item?.created_by_type === "B2B Admin" ||
                                  item?.created_by_type === "B2B Member"
                                ? "B2B"
                                : item?.created_by_type === "Branch Member" ||
                                  item?.created_by_type === "Branch member" ||
                                  item?.created_by_type === "Branch User" ||
                                  item?.created_by_type === "Branch"
                                ? "Branch"
                                : "-"}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "120px",
                              }}
                            >
                              {item?.purposeDetails?.preferredCountry?.length >
                              0
                                ? item.purposeDetails.preferredCountry.join(
                                    ", "
                                  )
                                : "-"}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "150px",
                              }}
                            >
                              {item?.universitytInvoiceGenerated?.status ? (
                                <CheckCircleIcon
                                  style={{ color: "#28a745" }}
                                  fontSize="small"
                                />
                              ) : (
                                "-"
                              )}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "150px",
                              }}
                            >
                              {item?.universityPaymentReceived?.status ? (
                                <CheckCircleIcon
                                  style={{ color: "#28a745" }}
                                  fontSize="small"
                                />
                              ) : (
                                "-"
                              )}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "150px",
                              }}
                            >
                              {item?.universityPaymentReceived?.amount || "-"}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "120px",
                              }}
                            >
                              {item?.purposeDetails?.intakeYear?.length > 0
                                ? item.purposeDetails.intakeYear.join(", ")
                                : "-"}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "120px",
                              }}
                            >
                              {item?.purposeDetails?.intakeMonth?.length > 0
                                ? item.purposeDetails.intakeMonth.join(", ")
                                : "-"}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "150px",
                              }}
                            >
                              {item?.interestedCourseDetails?.length > 0
                                ? (() => {
                                    const validFees =
                                      item.interestedCourseDetails
                                        .map((course) => {
                                          const feeAmount =
                                            course.instituteFeePayment
                                              ?.feeAmount;
                                          const currencyCode =
                                            course.instituteFeePayment
                                              ?.currencyCode;
                                          if (feeAmount) {
                                            const currencySymbol =
                                              getSymbolFromCurrency(
                                                currencyCode
                                              ) ||
                                              currencyCode ||
                                              "";
                                            return `${currencySymbol} ${feeAmount}`;
                                          }
                                          return null;
                                        })
                                        .filter((val) => val);
                                    return validFees.length > 0
                                      ? validFees.join(", ")
                                      : "-";
                                  })()
                                : "-"}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "100px",
                              }}
                            >
                              {item?.universitySideConfirmation
                                ?.commissionType || "-"}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "100px",
                              }}
                            >
                              {item?.universitySideConfirmation
                                ?.commissionType === "Percentage"
                                ? (() => {
                                    const percentage =
                                      item?.universitySideConfirmation
                                        ?.commissionPercentage;
                                    const commissionValues =
                                      item?.interestedCourseDetails
                                        ?.map((course) => {
                                          let feeAmount =
                                            course.instituteFeePayment
                                              ?.feeAmount;
                                          const currencyCode =
                                            course.instituteFeePayment
                                              ?.currencyCode;
                                          if (
                                            feeAmount &&
                                            typeof feeAmount === "string"
                                          ) {
                                            feeAmount = feeAmount.replace(
                                              /,/g,
                                              ""
                                            );
                                          }
                                          if (
                                            feeAmount &&
                                            !isNaN(feeAmount) &&
                                            percentage
                                          ) {
                                            const currencySymbol =
                                              getSymbolFromCurrency(
                                                currencyCode
                                              ) ||
                                              currencyCode ||
                                              "";
                                            const commissionValue =
                                              (parseFloat(feeAmount) *
                                                parseFloat(percentage)) /
                                              100;
                                            return `${percentage}% (${currencySymbol} ${commissionValue.toLocaleString(
                                              undefined,
                                              { maximumFractionDigits: 2 }
                                            )})`;
                                          }
                                          return null;
                                        })
                                        .filter((val) => val);
                                    return commissionValues &&
                                      commissionValues.length > 0
                                      ? commissionValues.join(", ")
                                      : "-";
                                  })()
                                : item?.universitySideConfirmation
                                    ?.commissionAmount || "-"}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "150px",
                              }}
                            >
                              {item?.createdByName || "-"}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "150px",
                              }}
                            >
                              {item?.updatedByName || "-"}
                            </td>
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
                                <MenuItem
                                  onClick={() => {
                                    handleOpenModal(item._id);
                                    setOpenDropdown(null);
                                  }}
                                >
                                  <EditIcon
                                    fontSize="small"
                                    sx={{ mr: 1 }}
                                    className="edit-icon"
                                  />
                                  <span className="edit-action-text">
                                    Invoice
                                  </span>
                                </MenuItem>
                              </Menu>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="12" className="text-center py-4">
                          {!canRead
                            ? "You do not have permission to view this Data"
                            : "No data available"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && commissionData?.length > 0 && (
                <div className="mt-4 d-flex">
                  <Paginations
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              )}
            </Card.Body>

            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header className="form-main-heading">
                <Modal.Title>Invoice Generate</Modal.Title>
                <AiOutlineClose
                  size={20}
                  style={{ cursor: "pointer", color: "white" }}
                  onClick={handleCloseModal}
                />
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={formik.handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Invoice Generated</Form.Label>
                    <div>
                      <Form.Check
                        inline
                        type="radio"
                        label="Yes"
                        name="universitytInvoiceGenerated.status"
                        id="universityInvoiceYes"
                        checked={
                          formik.values.universitytInvoiceGenerated.status ===
                          true
                        }
                        onChange={() =>
                          formik.setFieldValue(
                            "universitytInvoiceGenerated.status",
                            true
                          )
                        }
                        className="custom-radio-border"
                      />
                      <Form.Check
                        inline
                        type="radio"
                        label="No"
                        name="universitytInvoiceGenerated.status"
                        id="universityInvoiceNo"
                        checked={
                          formik.values.universitytInvoiceGenerated.status ===
                          false
                        }
                        onChange={() => {
                          formik.setValues({
                            universitytInvoiceGenerated: {
                              status: false,
                              date: "",
                            },
                            universityPaymentReceived: {
                              status: false,
                              amount: "",
                              b2bCommission: {
                                commissionType: "",
                                commissionPercentage: "",
                                commissionAmount: "",
                              },
                            },
                          });
                        }}
                        className="custom-radio-border"
                      />
                    </div>
                  </Form.Group>

                  {formik.values.universitytInvoiceGenerated.status && (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label>Invoice Generation Date</Form.Label>
                        <div style={{ position: "relative" }}>
                          <Form.Control
                            type="text"
                            name="universitytInvoiceGenerated.date"
                            className="custom-select-height"
                            placeholder="dd/mm/yyyy"
                            value={
                              formik.values.universitytInvoiceGenerated.date
                                ? formatDate(
                                    parseDate(
                                      formik.values.universitytInvoiceGenerated
                                        .date
                                    )
                                  )
                                : ""
                            }
                            readOnly
                            ref={invoiceDateInputRef}
                            onClick={() => {
                              if (
                                formik.values.universitytInvoiceGenerated.date
                              ) {
                                setInvoiceDateValue(
                                  parseDate(
                                    formik.values.universitytInvoiceGenerated
                                      .date
                                  )
                                );
                              }
                              setShowInvoiceDateCalendar((show) => !show);
                            }}
                            style={{
                              cursor: "pointer",
                              backgroundColor: "#fff",
                            }}
                          />
                          {formik.values.universitytInvoiceGenerated.date ? (
                            <button
                              type="button"
                              onClick={() => {
                                formik.setFieldValue(
                                  "universitytInvoiceGenerated.date",
                                  ""
                                );
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
                                onChange={(selectedDate) => {
                                  setInvoiceDateValue(selectedDate);
                                  formik.setFieldValue(
                                    "universitytInvoiceGenerated.date",
                                    toISODate(selectedDate)
                                  );
                                  setShowInvoiceDateCalendar(false);
                                }}
                                value={invoiceDateValue}
                                locale="en-GB"
                              />
                            </div>
                          )}
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>University Payment Received</Form.Label>
                        <div>
                          <Form.Check
                            inline
                            type="radio"
                            label="Yes"
                            name="universityPaymentReceived.status"
                            id="universityPaymentYes"
                            checked={
                              formik.values.universityPaymentReceived.status ===
                              true
                            }
                            onChange={() =>
                              formik.setFieldValue(
                                "universityPaymentReceived.status",
                                true
                              )
                            }
                            className="custom-radio-border"
                          />
                          <Form.Check
                            inline
                            type="radio"
                            label="No"
                            name="universityPaymentReceived.status"
                            id="universityPaymentNo"
                            checked={
                              formik.values.universityPaymentReceived.status ===
                              false
                            }
                            onChange={() =>
                              formik.setFieldValue(
                                "universityPaymentReceived",
                                {
                                  status: false,
                                  b2bCommission: {
                                    commissionType: "",
                                    commissionPercentage: "",
                                    commissionAmount: "",
                                  },
                                }
                              )
                            }
                            className="custom-radio-border"
                          />
                        </div>
                      </Form.Group>

                      {formik.values.universityPaymentReceived.status && (
                        <Form.Group className="mb-3">
                          <Form.Label>University Payment</Form.Label>
                          <Form.Control
                            type="text"
                            name="universityPaymentReceived.amount"
                            className="custom-select-height"
                            placeholder="Enter payment"
                            value={
                              formik.values.universityPaymentReceived.amount ||
                              ""
                            }
                            onChange={formik.handleChange}
                          />
                        </Form.Group>
                      )}

                      <Form.Group className="mb-3">
                        <Form.Label>Payment Mode</Form.Label>
                        <Select
                          options={paymentModeOptions}
                          value={
                            paymentModeOptions.find(
                              (option) =>
                                option.value ===
                                formik.values.universityPaymentReceived
                                  .paymentMode
                            ) || null
                          }
                          onChange={(option) =>
                            formik.setFieldValue(
                              "universityPaymentReceived.paymentMode",
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
                        />
                        {formik.touched.universityPaymentReceived
                          ?.paymentMode &&
                          formik.errors.universityPaymentReceived
                            ?.paymentMode && (
                            <div className="text-danger mt-1">
                              {
                                formik.errors.universityPaymentReceived
                                  ?.paymentMode
                              }
                            </div>
                          )}
                        {["GPay", "Bank", "UPI"].includes(
                          formik.values.universityPaymentReceived.paymentMode
                        ) && (
                          <>
                            <Select
                              className="mt-3"
                              options={bankOptions}
                              value={
                                bankOptions.find(
                                  (option) =>
                                    option.value ===
                                    formik.values.universityPaymentReceived.bank
                                ) || null
                              }
                              onChange={(option) =>
                                formik.setFieldValue(
                                  "universityPaymentReceived.bank",
                                  option ? option.value : ""
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
                            {formik.touched.universityPaymentReceived?.bank
                              ?.bank &&
                              formik.errors.universityPaymentReceived?.bank && (
                                <div className="text-danger mt-1">
                                  {
                                    formik.errors.universityPaymentReceived
                                      ?.bank
                                  }
                                </div>
                              )}
                          </>
                        )}
                      </Form.Group>

                      {formik.values.universityPaymentReceived.status &&
                        isB2BOrBranch && (
                          <Form.Group className="mb-3">
                            <Form.Label>B2B/Branch Commission Type</Form.Label>
                            <div className="d-flex align-items-center">
                              <div>
                                <Form.Check
                                  inline
                                  type="radio"
                                  label="Percentage"
                                  name="universityPaymentReceived.b2bCommission.commissionType"
                                  value="Percentage"
                                  id="commissionTypePercentage"
                                  checked={
                                    formik.values.universityPaymentReceived
                                      .b2bCommission.commissionType ===
                                    "Percentage"
                                  }
                                  onChange={formik.handleChange}
                                  className="custom-radio-border me-3"
                                />
                                <Form.Check
                                  inline
                                  type="radio"
                                  label="Amount"
                                  name="universityPaymentReceived.b2bCommission.commissionType"
                                  value="Amount"
                                  id="commissionTypeAmount"
                                  checked={
                                    formik.values.universityPaymentReceived
                                      .b2bCommission.commissionType === "Amount"
                                  }
                                  onChange={formik.handleChange}
                                  className="custom-radio-border me-3"
                                />
                              </div>

                              {formik.values.universityPaymentReceived
                                .b2bCommission.commissionType ===
                                "Percentage" && (
                                <Form.Group
                                  className="ms-3"
                                  style={{ width: "200px" }}
                                >
                                  <Form.Control
                                    type="text"
                                    name="universityPaymentReceived.b2bCommission.commissionPercentage"
                                    className="custom-select-height"
                                    value={
                                      formik.values.universityPaymentReceived
                                        .b2bCommission.commissionPercentage ||
                                      ""
                                    }
                                    onChange={formik.handleChange}
                                    placeholder="Enter percentage"
                                  />
                                </Form.Group>
                              )}

                              {formik.values.universityPaymentReceived
                                .b2bCommission.commissionType === "Amount" && (
                                <Form.Group
                                  className="ms-3"
                                  style={{ width: "200px" }}
                                >
                                  <Form.Control
                                    type="text"
                                    name="universityPaymentReceived.b2bCommission.commissionAmount"
                                    className="custom-select-height"
                                    value={
                                      formik.values.universityPaymentReceived
                                        .b2bCommission.commissionAmount || ""
                                    }
                                    onChange={formik.handleChange}
                                    placeholder="Enter amount"
                                  />
                                </Form.Group>
                              )}
                            </div>
                          </Form.Group>
                        )}
                    </>
                  )}

                  <Modal.Footer>
                    <Button
                      variant="primary"
                      type="submit"
                      className="custom-select-height"
                    >
                      Save
                    </Button>
                  </Modal.Footer>
                </Form>
              </Modal.Body>
            </Modal>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default UniversityCommission;
