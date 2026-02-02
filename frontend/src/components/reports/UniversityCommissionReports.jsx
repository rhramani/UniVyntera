import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import usePermissions from "../commonComponents/usePermissions";
import { decryptData } from "../../utils/encryptionUtils";
import Pageheader from "../../layouts/Pageheader";
import LoadMoreButton from "../commonComponents/LoadMoreButton";
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { MdCalendarToday } from "react-icons/md";
import Select from "react-select";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import {
  exportStudentApplicationReports,
  getAllIntake,
  universityCommissionReportsGetAll,
} from "../../redux/actions/Report/StudentApplicationReport.action";
import { getAllAccountantStatus } from "../../redux/actions/Master/AccountantStatus.action";
import { getAllBranch } from "../../redux/actions/Branch.action";
import { getAllB2BAdmin } from "../../redux/actions/B2BAdmin.action";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Paginations from "../elements/Paginations";
import { BASEURL } from "../../baseUrl";
import { toast } from "react-toastify";

const UniversityCommissionReports = () => {
  const dispatch = useDispatch();
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [universityCommissionData, setUniversityCommissionData] = useState([]);
  const [universityCommiStatuses, setUniversityCommiStatuses] = useState([]);
  const [search, setSearch] = useState("");
  const [branchList, setBranchList] = useState([]);
  const { canRead, canDownload } = usePermissions("University Commission");
  const [isLoading, setIsLoading] = useState(false);

  const userRole = decryptData(localStorage.getItem("role"));
  const branchUserId = decryptData(localStorage.getItem("branchId"));
  const userType = decryptData(localStorage.getItem("userType"));
  const branchId = decryptData(localStorage.getItem("userId"));

  const [filters, setFilters] = useState({
    type: "",
    status: "",
    startDate: "",
    endDate: "",
    b2bId: "",
    branchId:
      userRole === "Branch"
        ? branchId
        : userType === "Branch User"
        ? branchUserId
        : "",
    reportType: "",
    intakeYear: "",
    intakeMonth: "",
    showAll: userRole === "Branch" || userType === "Branch User" ? false : true,
  });

  const [b2BList, setB2BList] = useState([]);
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const startDateInputRef = useRef(null);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [endDateValue, setEndDateValue] = useState(null);
  const endDateInputRef = useRef(null);
  const [intakeMonthData, setIntakeMonthData] = useState({
    intakeMonths: [],
    intakeYears: [],
  });

  const applicationStatusOptions = universityCommiStatuses?.map((status) => ({
    value: status.name,
    label: status.name,
  }));

  const b2bPartnerOptions = [
    { value: "b2b", label: "B2B Partner" },
    { value: "branch", label: "Branch" },
  ];

  const b2bListOptions = b2BList?.map((b2b) => ({
    value: b2b._id,
    label: b2b.companyName,
  }));

  const branchListOptions = branchList?.map((branch) => ({
    value: branch._id,
    label: branch.name,
  }));

  const reportTypeOptions = [
    { value: "pendingInvoice", label: "Pending/Overdue University Invoices" },
    { value: "paidCommission", label: "Paid Commission Tracking" },
  ];

  const intakeYearOptions = (intakeMonthData?.intakeYears || [])
    .filter((year) => year && year.trim() !== "")
    .map((year) => ({
      value: year,
      label: year,
    }));

  const intakeMonthList = [
    { value: "Jan", label: "January" },
    { value: "Feb", label: "February" },
    { value: "Mar", label: "March" },
    { value: "Apr", label: "April" },
    { value: "May", label: "May" },
    { value: "Jun", label: "June" },
    { value: "Jul", label: "July" },
    { value: "Aug", label: "August" },
    { value: "Sep", label: "September" },
    { value: "Oct", label: "October" },
    { value: "Nov", label: "November" },
    { value: "Dec", label: "December" },
  ];

  const intakeMonthOptions = intakeMonthList?.map((month) => ({
    value: month?.value,
    label: month?.label,
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

  const columns = [
    {
      label: "Student Id",
      key: "studentId",
    },
    {
      label: "Date",
      render: (item) =>
        new Date(item.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          timeZone: "UTC",
        }),
    },
    {
      label: "Student Name",
      key: "name",
    },
    {
      label: "Type",
      key: "created_by_type",
      render: (item) => {
        const type = item?.created_by_type;

        if (type === "B2B Admin" || type === "B2B Member") {
          return "B2B";
        } else if (type === "Branch" || type === "Branch User") {
          return "Branch";
        } else if (type === "user") {
          return "Head Office";
        } else {
          return "-";
        }
      },
    },
    {
      label: "Created By",
      key: "createdByName",
      render: (item) =>
        item?.b2bCompany
          ? item.b2bCompany
          : item?.branch
          ? item.branch
          : item?.createdByName || "",
    },
    {
      label: "Status",
      key: "status",
      render: (item) => {
        const matchedStatus = universityCommiStatuses.find(
          (status) => status.name === item?.accountantStatus
        );
        const bgColor = matchedStatus?.color || "#0b3c8c";
        const textColor = ["#e9e216", "#1fff44"].includes(bgColor)
          ? "#000000"
          : "#ffffff";
        const displayStatus =
          item?.accountantStatus === "false" ||
          item?.accountantStatus === false ||
          item?.accountantStatus === ""
            ? "New"
            : item?.accountantStatus || "New";
        return (
          <span
            style={{
              backgroundColor: bgColor,
              color: textColor,
              padding: "1px 8px",
              borderRadius: "30px",
              display: "inline-block",
            }}
          >
            {displayStatus}
          </span>
        );
      },
    },
    {
      label: "Preferred Country",
      key: "preferredCountry",
      render: (item) =>
        item?.purposeDetails?.preferredCountry.join(", ") || "-",
    },
    {
      label: "Institute Name",
      key: "instituteName",
      render: (item) => {
        const displayValues = item?.interestedCourseDetails?.length
          ? item?.interestedCourseDetails
              ?.filter(
                (detail) => detail?.instituteFeePayment?.feeStatus === "paid"
              )
              ?.map((detail) => {
                const instituteName = detail?.institute?.instituteName || "-";
                const campusName = detail?.campus?.campus;
                return campusName
                  ? `${instituteName} - ${campusName}`
                  : instituteName;
              })
              .join(", ")
          : "-";

        return (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{displayValues}</Tooltip>}
          >
            <span style={{ cursor: "pointer" }}>{displayValues || "-"}</span>
          </OverlayTrigger>
        );
      },
    },
    {
      label: "Course Name",
      key: "courseName",
      render: (item) => {
        const displayValues = item?.interestedCourseDetails?.length
          ? item?.interestedCourseDetails
              ?.filter(
                (detail) => detail?.instituteFeePayment?.feeStatus === "paid"
              )
              ?.map((detail) => detail?.course?.programName || "-")
              .join(", ")
          : "-";

        return (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{displayValues}</Tooltip>}
          >
            <span style={{ cursor: "pointer" }}>{displayValues || "-"}</span>
          </OverlayTrigger>
        );
      },
    },
    {
      label: "Intake Year",
      key: "intakeYear",
      render: (item) => {
        const displayValues = item?.interestedCourseDetails?.length
          ? item?.interestedCourseDetails
              ?.filter(
                (detail) => detail?.instituteFeePayment?.feeStatus === "paid"
              )
              ?.map((detail) => detail?.intakeYear || "-")
              .join(", ")
          : "-";

        return <span>{displayValues || "-"}</span>;
      },
    },
    {
      label: "Intake Month",
      key: "intakeMonth",
      render: (item) => {
        const displayValues = item?.interestedCourseDetails?.length
          ? item?.interestedCourseDetails
              ?.filter(
                (detail) => detail?.instituteFeePayment?.feeStatus === "paid"
              )
              ?.map((detail) => detail?.intakeMonth || "-")
              .join(", ")
          : "-";

        return <span>{displayValues || "-"}</span>;
      },
    },
    {
      label: "Email Id",
      key: "email",
    },
    {
      label: "Phone Number",
      key: "contact",
    },
  ];

  const fetchLeadReport = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    type = filters.type?.value || "",
    status = filters.status,
    startDate = filters.startDate,
    endDate = filters.endDate,
    b2bId = filters.b2bId?.value || "",
    branchId = filters.branchId || "",
    reportType = filters.reportType?.value || "",
    intakeYear = filters.intakeYear || "",
    intakeMonth = filters.intakeMonth || "",
    showAll = filters.showAll
  ) => {
    try {
      const res = await dispatch(
        universityCommissionReportsGetAll(
          page,
          limit,
          search,
          type,
          status,
          startDate,
          endDate,
          b2bId,
          branchId,
          reportType,
          intakeYear,
          intakeMonth,
          showAll
        )
      );
      setUniversityCommissionData(res?.data?.data?.data || []);
      setTotalRecords(res?.data?.data?.totalRecords || 0);
      setTotalPages(res?.data?.data?.totalPages || 0);
    } catch (error) {
      console.error("Error fetching lead reports:", error);
      setUniversityCommissionData([]);
    }
  };

  // const handleExport = async () => {
  //   try {
  //     const res = await dispatch(
  //       universityCommissionReportsGetAll(
  //         1,
  //         10000,
  //         search,
  //         filters.type?.value || "",
  //         filters.status,
  //         filters.startDate,
  //         filters.endDate,
  //         filters.b2bId?.value || "",
  //         filters.branchId || "",
  //         filters.reportType?.value || "",
  //         filters.intakeYear,
  //         filters.intakeMonth,
  //         filters.showAll || ""
  //       )
  //     );
  //     const idsToExport = res?.data?.data?.data?.map((item) => item._id) || [];

  //     const response = await dispatch(
  //       exportStudentApplicationReports(idsToExport)
  //     );
  //     console.log("response", response);
  //     if (response?.status === 200 && response?.data?.fileUrl) {
  //       const fileUrl = `${BASEURL}${response.data.fileUrl}`;
  //       const link = document.createElement("a");
  //       link.href = fileUrl;
  //       link.setAttribute("download", "university_commission.csv");
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //       toast.success("university Commission report downloaded successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Error exporting reports:", error);
  //   }
  // };

  const handleExport = async () => {
    try {
      setIsLoading(true);

      const res = await dispatch(
        universityCommissionReportsGetAll(
          1,
          Number.MAX_SAFE_INTEGER,
          search,
          filters.type?.value || "",
          filters.status,
          filters.startDate,
          filters.endDate,
          filters.b2bId?.value || "",
          filters.branchId,
          filters.reportType?.value || "",
          filters.intakeYear,
          filters.intakeMonth,
          filters.showAll
        )
      );

      const allUniversityCommissionData = res?.data?.data?.data || [];

      if (
        !allUniversityCommissionData ||
        allUniversityCommissionData.length === 0
      ) {
        toast.error("No data available to export.");
        setIsLoading(false);
        return;
      }

      const headers = columns.map((col) => col.label);

      const rows = allUniversityCommissionData.map((item) => {
        return columns.map((col) => {
          let value = col.render ? col.render(item) : item[col.key] || "-";
          if (
            (col.key === "instituteName" || col.key === "courseName") &&
            React.isValidElement(value)
          ) {
            value = value.props.children.props.children || "-";
          }
          if (col.key === "status" && React.isValidElement(value)) {
            value = value.props.children || "-";
          }
          if (
            (col.key === "intakeYear" || col.key === "intakeMonth") &&
            React.isValidElement(value)
          ) {
            value = value.props.children || "-";
          }
          return String(value).replace(/"/g, '""');
        });
      });

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", "university_commission_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("University Commission report downloaded successfully!");
    } catch (error) {
      console.error("Error exporting reports:", error);
      toast.error("Something went wrong while exporting the report.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUniversityCommiStatuses = async () => {
    try {
      const res = await dispatch(getAllAccountantStatus());
      if (res?.status === 200) {
        setUniversityCommiStatuses(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching university commission statuses:", error);
    }
  };

  const fetchAllBranches = async () => {
    try {
      const res = await dispatch(getAllBranch(1, 1000, ""));
      const apiBranches = res?.data?.data?.data || res?.data?.data || [];

      const dynamicBranches = apiBranches.map((branch) => ({
        value: branch._id,
        label: branch.name || "Unnamed Branch",
      }));
      setBranchList(dynamicBranches || []);
    } catch (error) {
      console.log("Error fetching branches:", error);
      setBranchList([]);
    }
  };

  const fetchAllB2B = async () => {
    try {
      const res = await dispatch(getAllB2BAdmin(1, 1000, ""));
      const responseData = res?.data?.data;
      setB2BList(responseData?.data || []);
    } catch (error) {
      console.log("Error fetching branches:", error);
      setB2BList([]);
    }
  };

  const fetchAllIntakeYear = async () => {
    try {
      const res = await dispatch(getAllIntake());
      if (res?.status === 200) {
        setIntakeMonthData(
          res?.data?.data || { intakeMonths: [], intakeYears: [] }
        );
      } else {
        console.warn("fetchAllIntake: Non-200 status", res);
        setIntakeMonthData({ intakeMonths: [], intakeYears: [] });
      }
    } catch (error) {
      console.log("error fetching in fetchAllIntake", error);
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchLeadReport(
        currentPage,
        itemsPerPage,
        search,
        filters.type?.value,
        filters.status,
        filters.startDate,
        filters.endDate,
        filters.b2bId?.value,
        filters.branchId,
        filters.reportType?.value,
        filters.intakeYear,
        filters.intakeMonth,
        filters.showAll
      );
    }
  }, [currentPage, itemsPerPage, search, filters]);

  useEffect(() => {
    fetchUniversityCommiStatuses();
    fetchAllBranches();
    fetchAllB2B();
    fetchAllIntakeYear();
  }, []);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <>
      <Pageheader
        mainheading="University Commission"
        parentfolder="Reports"
        activepage="University Commission"
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

      <Row className="mt-2">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div className="w-100 d-flex flex-wrap justify-content-between">
                <div className="card-title">University Commission report</div>
                <div className="d-flex flex-wrap gap-2">
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
                  {universityCommissionData?.length > 0 && canDownload && (
                    <Button
                      variant="primary"
                      className="custom-select-height px-3"
                      onClick={() => handleExport()}
                    >
                      Export Report
                    </Button>
                  )}
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap align-items-end gap-2 mb-3">
                <div className="filter-item">
                  <Form.Label>Report Type</Form.Label>
                  <Select
                    options={reportTypeOptions}
                    value={filters.reportType}
                    onChange={(selectedOption) => {
                      setFilters({
                        ...filters,
                        reportType: selectedOption,
                      });
                      setCurrentPage(1);
                    }}
                    placeholder="Select Report Type"
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
                  <Form.Label>Intake Year</Form.Label>
                  <Select
                    className="filter-height"
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: "13px",
                        minHeight: "38px",
                      }),
                    }}
                    options={intakeYearOptions}
                    value={
                      intakeYearOptions.find(
                        (option) => option.value === filters.intakeYear
                      ) || null
                    }
                    onChange={(selectedOption) => {
                      setFilters({
                        ...filters,
                        intakeYear: selectedOption ? selectedOption.value : "",
                      });
                      setCurrentPage(1);
                    }}
                    placeholder="Select Year"
                    isClearable
                    isSearchable
                    classNamePrefix="custom-select"
                    noOptionsMessage={() => "No years available"}
                  />
                </div>

                <div className="filter-item">
                  <Form.Label>Intake Month</Form.Label>
                  <Select
                    className="filter-height"
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: "13px",
                        minHeight: "38px",
                      }),
                    }}
                    options={intakeMonthOptions}
                    value={
                      intakeMonthOptions.find(
                        (option) => option.value === filters.intakeMonth
                      ) || null
                    }
                    onChange={(selectedOption) => {
                      setFilters({
                        ...filters,
                        intakeMonth: selectedOption ? selectedOption.value : "",
                      });
                      setCurrentPage(1);
                    }}
                    placeholder="Select Month"
                    isClearable
                    isSearchable
                    classNamePrefix="custom-select"
                    noOptionsMessage={() => "No years available"}
                  />
                </div>

                <div className="filter-item">
                  <Form.Label>Status</Form.Label>
                  <Select
                    className="filter-height"
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: "13px",
                        minHeight: "38px",
                      }),
                    }}
                    options={applicationStatusOptions}
                    value={
                      applicationStatusOptions.find(
                        (option) => option.value === filters.status
                      ) || null
                    }
                    onChange={(selectedOption) => {
                      setFilters({
                        ...filters,
                        status: selectedOption ? selectedOption.value : "",
                      });
                      setCurrentPage(1);
                    }}
                    placeholder="Select Status"
                    isClearable
                    isSearchable
                    classNamePrefix="custom-select"
                    noOptionsMessage={() => "No statuses available"}
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
                  <Form.Label>Branch</Form.Label>
                  <Select
                    className="filter-height"
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: "13px",
                        minHeight: "38px",
                      }),
                    }}
                    placeholder="Select Branch"
                    classNamePrefix="custom-select"
                    isClearable
                    isSearchable
                    options={[
                      { value: "All", label: "All" },
                      { value: "head_office", label: "Head Office" },
                      ...branchList,
                    ]}
                    value={
                      [
                        { value: "All", label: "All" },
                        { value: "head_office", label: "Head Office" },
                        ...branchList,
                      ].find(
                        (option) =>
                          option.value ===
                          (filters.branchId === ""
                            ? "All"
                            : filters.branchId === null
                            ? "head_office"
                            : filters.branchId)
                      ) || null
                    }
                    onChange={async (selectedOption) => {
                      const value = selectedOption
                        ? selectedOption.value
                        : null;

                      let branchId = null;
                      let showAll = false;

                      if (!value || value === "All") {
                        branchId = "";
                        showAll = true;
                      } else if (selectedOption.value === "head_office") {
                        branchId = null;
                        showAll = false;
                      } else {
                        branchId = value;
                        showAll = false;
                      }

                      setFilters({
                        ...filters,
                        branchId,
                        showAll,
                      });
                      setCurrentPage(1);
                    }}
                  />
                </div>

                <div className="filter-item">
                  <Form.Label>B2B</Form.Label>
                  <Select
                    options={b2bListOptions}
                    value={filters.b2bId}
                    onChange={(option) => {
                      setFilters({ ...filters, b2bId: option });
                      setCurrentPage(1);
                    }}
                    placeholder="Select B2B"
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
                      Total Records: <strong>{totalRecords}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table
                  className="text-nowrap border"
                  style={{ tableLayout: "auto" }}
                >
                  <thead className="text-uppercase">
                    <tr>
                      {columns?.map((col, index) => (
                        <th
                          key={index}
                          scope="col"
                          className={`dynamic-width ${
                            col.label === "Age" ? "center-align" : ""
                          }`}
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {universityCommissionData?.length > 0 ? (
                      universityCommissionData
                        .filter(Boolean)
                        .map((item, index) => (
                          <tr
                            key={index}
                            className={`${
                              index % 2 === 0
                                ? "table-row-even"
                                : "table-row-odd"
                            }`}
                          >
                            {columns?.map((col, colIndex) => (
                              <td
                                key={colIndex}
                                className={`dynamic-width-data ${
                                  col.isLongText ? "long-text" : ""
                                } ${col.label === "Age" ? "center-align" : ""}`}
                              >
                                {col.render
                                  ? col.render(item, index)
                                  : item[col.key] || "-"}
                              </td>
                            ))}
                          </tr>
                        ))
                    ) : (
                      <tr className="no-data-row">
                        <td colSpan={columns.length}>
                          <div className="no-data-text">
                            {!canRead
                              ? "You do not have permission to view this Data"
                              : "No data available"}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && universityCommissionData.length > 0 && (
                <div className="mt-4 d-flex">
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

export default UniversityCommissionReports;
