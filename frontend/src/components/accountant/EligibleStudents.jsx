import { Button, Card, Col, Dropdown, Form, Modal, Row } from "react-bootstrap";
import Pageheader from "../../layouts/Pageheader";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import Paginations from "../elements/Paginations";
import Select from "react-select";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  exportAccountantData,
  getAllAccountantCountry,
  getAllAccountantInstitute,
  getAllTotalAdmission,
} from "../../redux/actions/Accountant/EligibleStudents.action";
import { useDispatch } from "react-redux";
import usePermissions from "../commonComponents/usePermissions";
import { BASEURL } from "../../baseUrl";
import { AiOutlineClose } from "react-icons/ai";
import getSymbolFromCurrency from "currency-symbol-map";
import { useFormik } from "formik";
import {
  getOneStudentApplication,
  updateStudentApplication,
} from "../../redux/actions/Student/StudentApplication.action";
import { getAllAccountantStatus } from "../../redux/actions/Master/AccountantStatus.action";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdCalendarToday } from "react-icons/md";
import LoadMoreButton from "../commonComponents/LoadMoreButton";

const formatDateForInput = (isoDate) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  return date.toISOString().split("T")[0];
};

const EligibleStudents = () => {
  const dispatch = useDispatch();

  const [AdmissionsData, setAdmissionsData] = useState([]);
  const [instituteData, setInstituteData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [eligibleAccountantStatus, setEligibleAccountantStatus] = useState([]);
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const startDateInputRef = useRef(null);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [endDateValue, setEndDateValue] = useState(null);
  const endDateInputRef = useRef(null);
  const [showVerificationDateCalendar, setShowVerificationDateCalendar] =
    useState(false);
  const [verificationDateValue, setVerificationDateValue] = useState(null);
  const verificationDateInputRef = useRef(null);

  const { canRead, canDownload } = usePermissions("Eligible Students");

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    institute: null,
    type: null,
    country: null,
    branch: null,
    verificationSent: true,
    sideConfirmation: true,
  });

  const [selectedItems, setSelectedItems] = useState({});

  const instituteOptions = instituteData?.map((institute) => ({
    value: institute._id,
    label: institute.instituteName,
  }));

  const countryOptions = countryData?.map((country) => ({
    value: country,
    label: country,
  }));

  const b2bPartnerOptions = [
    { value: "b2b", label: "B2B Partner" },
    { value: "branch", label: "Branch" },
  ];

  const statusOptions = eligibleAccountantStatus?.map((status) => ({
    value: status?.name,
    label: status?.name,
  }));

  const verificationStatusOptions = [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
  ];

  const sideConfirmationOptions = [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
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

  const fetchStudentData = async (studentId) => {
    try {
      const response = await dispatch(getOneStudentApplication(studentId));
      const data = response?.data?.data;
      return data || {};
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      universityVerification: false,
      universityVerificationDate: "",
      universitySideConfirmation: {
        status: false,
        commissionType: "",
        commissionPercentage: "",
        commissionAmount: "",
      },
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const payload = {
          universityVerificationSent: values.universityVerification,
          ...(values.universityVerification && values.universityVerificationDate
            ? { universityVerificationDate: values.universityVerificationDate }
            : { universityVerificationDate: null }),
          universitySideConfirmation: {
            status: values.universitySideConfirmation.status,
            ...(values.universitySideConfirmation.status
              ? {
                commissionType:
                  values.universitySideConfirmation.commissionType || null,
                ...(values.universitySideConfirmation.commissionType ===
                  "Percentage"
                  ? {
                    commissionPercentage: values.universitySideConfirmation
                      .commissionPercentage
                      ? parseFloat(
                        values.universitySideConfirmation
                          .commissionPercentage
                      )
                      : null,
                  }
                  : { commissionPercentage: null }),
                ...(values.universitySideConfirmation.commissionType ===
                  "Amount"
                  ? {
                    commissionAmount: values.universitySideConfirmation
                      .commissionAmount
                      ? String(
                        values.universitySideConfirmation.commissionAmount
                      )
                      : null,
                  }
                  : { commissionAmount: null }),
              }
              : {
                commissionType: null,
                commissionPercentage: null,
                commissionAmount: null,
              }),
          },
        };
        await dispatch(updateStudentApplication(payload, selectedStudentId));
        toast.success("Verification and confirmation updated successfully!");
        if (canRead) {
          fetchAllTotalAdmission(
            currentPage,
            itemsPerPage,
            search,
            filters.startDate,
            filters.endDate,
            filters.institute?.value,
            filters.type?.value,
            filters.country?.value,
            filters.branch?.value,
            filters.verificationSent?.value || "",
            filters.sideConfirmation?.value || ""
          );
        }
        handleCloseModal();
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Failed to update verification and confirmation");
      }
    },
  });

  useEffect(() => {
    if (showModal && selectedStudentId) {
      fetchStudentData(selectedStudentId).then((data) => {
        formik.setValues({
          universityVerification: data?.universityVerificationSent || false,
          universityVerificationDate:
            formatDateForInput(data?.universityVerificationDate) || "",
          universitySideConfirmation: {
            status: data?.universitySideConfirmation?.status || false,
            commissionType:
              data?.universitySideConfirmation?.commissionPercentage != null
                ? "Percentage"
                : data?.universitySideConfirmation?.commissionAmount != null
                  ? "Amount"
                  : "",
            commissionPercentage:
              data?.universitySideConfirmation?.commissionPercentage || "",
            commissionAmount:
              data?.universitySideConfirmation?.commissionAmount || "",
          },
        });
      });
    }
  }, [showModal, selectedStudentId]);

  const fetchAllTotalAdmission = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    startDate = filters.startDate,
    endDate = filters.endDate,
    institute = filters.institute?.value || "",
    type = filters.type?.value || "",
    country = filters.country?.value || "",
    branch = filters.branch?.value || "",
    verificationSent = filters.verificationSent?.value || "",
    sideConfirmation = filters.sideConfirmation?.value || ""
  ) => {
    try {
      setIsLoading(true);
      const res = await dispatch(
        getAllTotalAdmission(
          page,
          limit,
          search,
          startDate,
          endDate,
          institute,
          type,
          country,
          branch,
          verificationSent,
          sideConfirmation
        )
      );
      const responseData = res?.data?.data;
      setAdmissionsData(responseData?.data || []);
      setTotalPages(responseData?.totalPages || 0);
      setTotalRecords(responseData?.totalRecords || 0);
    } catch (error) {
      console.log("Error fetching eligible students:", error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch admissions data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEligibleStudentStatus = async () => {
    try {
      const res = await dispatch(getAllAccountantStatus());
      if (res?.status === 200) {
        setEligibleAccountantStatus(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching student statuses:", error);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const payload = { accountantStatus: newStatus };
      const res = await dispatch(
        updateStudentApplication(payload, applicationId)
      );
      if (res?.status === 200) {
        toast.success("Status updated successfully");
        fetchAllTotalAdmission(
          currentPage,
          itemsPerPage,
          search,
          filters.startDate,
          filters.endDate,
          filters.institute?.value,
          filters.type?.value,
          filters.country?.value,
          filters.branch?.value,
          filters.verificationSent?.value || "",
          filters.sideConfirmation?.value || ""
        );
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating student status:", error);
    }
  };

  const handleExport = async () => {
    try {
      const selectedIds = Object.keys(selectedItems).filter(
        (id) => selectedItems[id]
      );

      const ids =
        selectedIds.length > 0
          ? selectedIds
          : AdmissionsData?.map((lead) => lead?._id) || [];

      if (!ids || ids.length === 0) {
        toast.error("No data available to export.");
        return;
      }
      const response = await dispatch(exportAccountantData(ids));

      if (response?.status === 200 && response?.data?.fileUrl) {
        const fileUrl = `${BASEURL}${response.data.fileUrl}`;
        const link = document.createElement("a");
        link.href = fileUrl;
        link.setAttribute("download", "eligible_students.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Eligible downloaded successfully!");
      }
      setSelectedItems({});
      setSelectAll(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Something went wrong while downloading eligible."
      );
      console.error("Error downloading eligible:", error);
    }
  };

  const fetchAllInstitute = async () => {
    try {
      const res = await dispatch(getAllAccountantInstitute());
      setInstituteData(res?.data?.data);
    } catch (error) {
      console.log("Error fetching in getAll Institute");
    }
  };

  const fetchAllCountry = async () => {
    try {
      const res = await dispatch(getAllAccountantCountry());
      setCountryData(res?.data?.data);
    } catch (error) {
      console.log("Error fetching in getAll country");
    }
  };

  useEffect(() => {
    fetchEligibleStudentStatus();
    fetchAllInstitute();
    fetchAllCountry();
  }, []);

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
    AdmissionsData.forEach((item) => {
      newSelectedItems[item._id] = checked;
    });
    setSelectedItems(newSelectedItems);
  };

  useEffect(() => {
    if (canRead) {
      fetchAllTotalAdmission(
        currentPage,
        itemsPerPage,
        search,
        filters.startDate,
        filters.endDate,
        filters.institute?.value,
        filters.type?.value,
        filters.country?.value,
        filters.branch?.value,
        filters.verificationSent?.value || "",
        filters.sideConfirmation?.value || ""
      );
    }
  }, [currentPage, itemsPerPage, search, filters]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      fetchAllTotalAdmission(
        1,
        newItemsPerPage,
        search,
        filters.startDate,
        filters.endDate,
        filters.institute?.value,
        filters.type?.value,
        filters.country?.value,
        filters.branch?.value,
        filters.verificationSent?.value || "",
        filters.sideConfirmation?.value || ""
      );
    }
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

  const handleOpenModal = (studentId) => {
    setSelectedStudentId(studentId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    formik.resetForm();
  };

  return (
    <>
      <Pageheader
        mainheading="Eligible Student"
        parentfolder="Accountant"
        activepage="Eligible Student"
      />

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

      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div className="w-100 d-flex flex-wrap justify-content-between">
                <div className="card-title">Eligible Students</div>
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
                          Export
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
                      <Form.Label>Type</Form.Label>
                      <Select
                        options={b2bPartnerOptions}
                        value={filters.type}
                        onChange={(option) => {
                          setFilters({ ...filters, type: option });
                          setCurrentPage(1);
                        }}
                        placeholder="Select Type"
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
                      <Form.Label>Verification Sent</Form.Label>
                      <Select
                        options={verificationStatusOptions}
                        value={
                          verificationStatusOptions.find(
                            (option) =>
                              option.value === filters.verificationSent?.value
                          ) || null
                        }
                        onChange={(option) => {
                          setFilters({ ...filters, verificationSent: option });
                          setCurrentPage(1);
                        }}
                        placeholder="Select Verification Status"
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
                      <Form.Label>Side Confirmation</Form.Label>
                      <Select
                        options={sideConfirmationOptions}
                        value={
                          sideConfirmationOptions.find(
                            (option) =>
                              option.value === filters.sideConfirmation?.value
                          ) || null
                        }
                        onChange={(option) => {
                          setFilters({ ...filters, sideConfirmation: option });
                          setCurrentPage(1);
                        }}
                        placeholder="Select Confirmation Status"
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
                      <th scope="col" style={{ minWidth: "100px" }}>
                        Initiate University Verification
                      </th>
                      <th scope="col" style={{ minWidth: "100px" }}>
                        University Verification
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
                    {AdmissionsData?.length > 0 ? (
                      AdmissionsData.map((item, index) => {
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
                              {(() => {
                                const v = item?.visaApplicationDetails;

                                const date =
                                  v?.visaOutcomeDate ||
                                  v?.visaDecision?.decisionDate ||
                                  v?.visaoutcome?.grantDate ||
                                  v?.visaDecision?.receivedDate ||
                                  v?.visaDecision?.grantDate ||
                                  v?.visaDecision?.issueDate ||
                                  v?.visaDecision?.validity?.from;

                                const isValid =
                                  date && !isNaN(new Date(date).getTime());

                                return isValid
                                  ? new Date(date).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    timeZone: "UTC",
                                  })
                                  : "–";
                              })()}
                            </td>

                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "120px",
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
                                    eligibleAccountantStatus?.find(
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
                                            boxShadow: none !important;
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
                                minWidth: "150px",
                              }}
                            >
                              <span
                                className="px-3 py-1 rounded-pill"
                                style={{
                                  backgroundColor: colors.bg,
                                  color: colors.text,
                                  display: "inline-block",
                                  maxWidth: "100%",
                                }}
                              >
                                {item?.name || "-"}
                              </span>
                            </td>
                            <td
                            // title={instituteNames}
                            >
                              {instituteNames}
                            </td>
                            <td
                            // title={programNames}
                            >
                              {programNames}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "120px",
                              }}
                            >
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
                              {item?.universityVerificationSent ? (
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
                              {item?.universityVerificationSent &&
                                item?.universitySideConfirmation?.status ? (
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
                                ? item.interestedCourseDetails
                                  .map((course) => {
                                    const feeAmount =
                                      course.instituteFeePayment?.feeAmount ||
                                      "-";
                                    const currencyCode =
                                      course.instituteFeePayment
                                        ?.currencyCode;
                                    return currencyCode
                                      ? `${getSymbolFromCurrency(
                                        currencyCode
                                      ) || currencyCode
                                      } ${feeAmount}`
                                      : `${feeAmount}`;
                                  })
                                  .join(", ")
                                : "-"}
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
                                    minWidth: "150px",
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
                                    University Verification
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
              {totalPages > 1 && AdmissionsData.length > 0 && (
                <div className="mt-4 d-flex justify-content-end align-items-end">
                  <Paginations
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              )}

              <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header className="form-main-heading">
                  <Modal.Title>Update University Verification</Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={handleCloseModal}
                  />
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={formik.handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Initiate University Verification</Form.Label>
                      <div>
                        <Form.Check
                          inline
                          type="radio"
                          label="Yes"
                          name="universityVerification"
                          id="universityVerificationYes"
                          checked={
                            formik.values.universityVerification === true
                          }
                          onChange={() =>
                            formik.setFieldValue("universityVerification", true)
                          }
                          className="custom-radio-border"
                        />
                        <Form.Check
                          inline
                          type="radio"
                          label="No"
                          name="universityVerification"
                          id="universityVerificationNo"
                          checked={
                            formik.values.universityVerification === false
                          }
                          onChange={() => {
                            formik.setFieldValue(
                              "universityVerification",
                              false
                            );
                            formik.setFieldValue(
                              "universityVerificationDate",
                              ""
                            );
                            formik.setFieldValue("universitySideConfirmation", {
                              status: false,
                              commissionType: "",
                              commissionPercentage: "",
                              commissionAmount: "",
                            });
                          }}
                          className="custom-radio-border"
                        />
                      </div>
                    </Form.Group>
                    {formik.values.universityVerification && (
                      <>
                        <Form.Group className="mb-3">
                          <Form.Label>Verification Date</Form.Label>
                          <div style={{ position: "relative" }}>
                            <Form.Control
                              type="text"
                              name="universityVerificationDate"
                              className="custom-select-height"
                              placeholder="dd/mm/yyyy"
                              value={
                                formik.values.universityVerificationDate
                                  ? formatDate(
                                    parseDate(
                                      formik.values.universityVerificationDate
                                    )
                                  )
                                  : ""
                              }
                              readOnly
                              ref={verificationDateInputRef}
                              onClick={() => {
                                if (formik.values.universityVerificationDate) {
                                  setVerificationDateValue(
                                    parseDate(
                                      formik.values.universityVerificationDate
                                    )
                                  );
                                }
                                setShowVerificationDateCalendar(
                                  (show) => !show
                                );
                              }}
                              style={{
                                cursor: "pointer",
                                backgroundColor: "#fff",
                              }}
                            />
                            {formik.values.universityVerificationDate ? (
                              <button
                                type="button"
                                onClick={() => {
                                  formik.setFieldValue(
                                    "universityVerificationDate",
                                    ""
                                  );
                                  setVerificationDateValue(null);
                                  setShowVerificationDateCalendar(false);
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
                            {showVerificationDateCalendar && (
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
                                    setVerificationDateValue(selectedDate);
                                    formik.setFieldValue(
                                      "universityVerificationDate",
                                      toISODate(selectedDate)
                                    );
                                    setShowVerificationDateCalendar(false);
                                  }}
                                  value={verificationDateValue}
                                  locale="en-GB"
                                />
                              </div>
                            )}
                          </div>
                        </Form.Group>
                        <div className="border-top my-4"></div>
                        <Form.Group className="mb-3">
                          <Form.Label>University Side Confirmation</Form.Label>
                          <div>
                            <Form.Check
                              inline
                              type="radio"
                              label="Yes"
                              name="universitySideConfirmation.status"
                              id="universitySideConfirmationYes"
                              checked={
                                formik.values.universitySideConfirmation
                                  .status === true
                              }
                              onChange={() =>
                                formik.setFieldValue(
                                  "universitySideConfirmation.status",
                                  true
                                )
                              }
                              className="custom-radio-border"
                            />
                            <Form.Check
                              inline
                              type="radio"
                              label="No"
                              name="universitySideConfirmation.status"
                              id="universitySideConfirmationNo"
                              checked={
                                formik.values.universitySideConfirmation
                                  .status === false
                              }
                              onChange={() =>
                                formik.setFieldValue(
                                  "universitySideConfirmation",
                                  {
                                    status: false,
                                    commissionType: "",
                                    commissionPercentage: "",
                                    commissionAmount: "",
                                  }
                                )
                              }
                              className="custom-radio-border"
                            />
                          </div>
                        </Form.Group>
                        {formik.values.universitySideConfirmation.status && (
                          <Form.Group className="mb-3">
                            <Form.Label>Commission Type</Form.Label>
                            <div className="d-flex align-items-center">
                              <div>
                                <Form.Check
                                  inline
                                  type="radio"
                                  label="Percentage"
                                  name="universitySideConfirmation.commissionType"
                                  value="Percentage"
                                  id="commissionTypePercentage"
                                  checked={
                                    formik.values.universitySideConfirmation
                                      .commissionType === "Percentage"
                                  }
                                  onChange={formik.handleChange}
                                  className="custom-radio-border me-3"
                                />
                                <Form.Check
                                  inline
                                  type="radio"
                                  label="Amount"
                                  name="universitySideConfirmation.commissionType"
                                  value="Amount"
                                  id="commissionTypeAmount"
                                  checked={
                                    formik.values.universitySideConfirmation
                                      .commissionType === "Amount"
                                  }
                                  onChange={formik.handleChange}
                                  className="custom-radio-border me-3"
                                />
                              </div>
                              {formik.values.universitySideConfirmation
                                .commissionType === "Percentage" && (
                                  <Form.Group
                                    className="ms-3"
                                    style={{ width: "200px" }}
                                  >
                                    <Form.Control
                                      type="text"
                                      name="universitySideConfirmation.commissionPercentage"
                                      className="custom-select-height"
                                      value={
                                        formik.values.universitySideConfirmation
                                          .commissionPercentage || ""
                                      }
                                      onChange={formik.handleChange}
                                      placeholder="Enter percentage"
                                      min="0"
                                      step="0.01"
                                    />
                                  </Form.Group>
                                )}
                              {formik.values.universitySideConfirmation
                                .commissionType === "Amount" && (
                                  <Form.Group
                                    className="ms-3"
                                    style={{ width: "200px" }}
                                  >
                                    <Form.Control
                                      type="text"
                                      name="universitySideConfirmation.commissionAmount"
                                      className="custom-select-height"
                                      value={
                                        formik.values.universitySideConfirmation
                                          .commissionAmount || ""
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default EligibleStudents;
