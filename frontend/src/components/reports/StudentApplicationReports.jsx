import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import usePermissions from "../commonComponents/usePermissions";
import Paginations from "../elements/Paginations";
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import Select from "react-select";
import Pageheader from "../../layouts/Pageheader";
import { toast } from "react-toastify";
import { MdCalendarToday } from "react-icons/md";
import { BASEURL } from "../../baseUrl";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";

import { getAllBranch } from "../../redux/actions/Branch.action";
import { decryptData } from "../../utils/encryptionUtils";
import { getAllStudentStatus } from "../../redux/actions/Student/StudentStatus.action";
import LoadMoreButton from "../commonComponents/LoadMoreButton";
import {
  exportStudentApplicationReports,
  getAllIntake,
  getAllStudentReport,
  getInstitute,
  getUniquePreferredCountries,
} from "../../redux/actions/Report/StudentApplicationReport.action";
import { exportDataLeadReports } from "../../redux/actions/Report/LeadReports.action";
import { countryDropDownCourse } from "../../redux/actions/CourseFinder.action";
import { getAllB2BAdmin } from "../../redux/actions/B2BAdmin.action";
import { getAllRoleList } from "../../redux/actions/Master/Role.action";
import { adminGetAll } from "../../redux/actions/Admin.action";

const StudentApplicationReports = () => {
  const dispatch = useDispatch();
  const [totalRecords, setTotalRecords] = useState(0);
  const [uniqueRecoreds, setUniqueRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [studentReports, setStudentReports] = useState([]);
  const [studentStatuses, setStudentStatuses] = useState([]);
  const [intakeMonthData, setIntakeMonthData] = useState({
    intakeMonths: [],
    intakeYears: [],
  });
  const [instituteData, setInstituteData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const { canRead, canDownload } = usePermissions("Student Application");
  const [isLoading, setIsLoading] = useState(false);
  const [filterRoleOptions, setFilterRoleOptions] = useState([]);
  const [filterUserOptions, setFilterUserOptions] = useState([]);
  const branchId = decryptData(localStorage.getItem("userId"));
  const branchUserId = decryptData(localStorage.getItem("branchId"));
  const userRole = decryptData(localStorage.getItem("role"));
  const userRoleId = decryptData(localStorage.getItem("roleId"));
  const userType = decryptData(localStorage.getItem("userType"));

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    mainStatus: "",
    branchId:
      userRole === "Branch"
        ? branchId
        : userType === "Branch User"
        ? branchUserId
        : "",
    // role: "",
    user: "",
    showAll: true,
    intakeMonth: "",
    intakeYear: "",
    institute: "",
    applicationType: "",
    country: "",
    type: "",
    b2bId: "",
  });

  const [preferredCountries, setPreferredCountries] = useState([]);
  const [b2BList, setB2BList] = useState([]);
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const startDateInputRef = useRef(null);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [endDateValue, setEndDateValue] = useState(null);
  const endDateInputRef = useRef(null);

  const applicationStatusOptions = studentStatuses?.map((mainStatus) => ({
    value: mainStatus._id,
    label: mainStatus.name,
  }));

  const intakeMonthOptions = (intakeMonthData?.intakeMonths || [])
    .filter((month) => month && month.trim() !== "")
    .map((month) => ({
      value: month,
      label: month,
    }));

  const intakeYearOptions = (intakeMonthData?.intakeYears || [])
    .filter((year) => year && year.trim() !== "")
    .map((year) => ({
      value: year,
      label: year,
    }));

  const instituteOptions = instituteData?.map((institute) => ({
    value: institute.instituteId,
    label: institute.instituteName,
  }));

  const tailormadeOptions = [{ value: "Tailormade", label: "Tailormade" }];

  const countryOptions = preferredCountries?.map((country) => ({
    value: country,
    label: country,
  }));

  const b2bPartnerOptions = [
    { value: "b2b", label: "B2B Partner" },
    { value: "branch", label: "Branch" },
  ];

  const b2bListOptions = b2BList?.map((b2b) => ({
    value: b2b._id,
    label: b2b.companyName,
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
      render: (item) =>
        item?.b2bCompany
          ? item.b2bCompany
          : item?.branch
          ? item.branch
          : item?.createdByName || "",
    },
    {
      label: "Status",
      render: (item) => {
        return (
          <span
            style={{
              backgroundColor: item?.mainStatus?.color,
              color: item?.mainStatus ? "#ffffff" : "#000000",
              padding: "1px 8px",
              borderRadius: "30px",
              display: "inline-block",
            }}
          >
            {item?.mainStatus ? item.mainStatus?.name : "-"}
          </span>
        );
      },
    },
    {
      label: "Preferred Country",
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
      key: "programName",
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
    startDate = filters.startDate,
    endDate = filters.endDate,
    mainStatus = filters.mainStatus,
    branchId = filters.branchId,
    // role = filters.role,
    user = filters.user,
    showAll = filters.showAll,
    intakeMonth = filters.intakeMonth,
    intakeYear = filters.intakeYear,
    institute = filters.institute,
    applicationType = filters.applicationType || "",
    country = filters.country?.value || "",
    type = filters.type?.value || "",
    b2bId = filters.b2bId?.value || ""
  ) => {
    try {
      const res = await dispatch(
        getAllStudentReport(
          page,
          limit,
          search,
          startDate,
          endDate,
          mainStatus,
          branchId,
          // role,
          user,
          showAll,
          intakeMonth,
          intakeYear,
          institute,
          applicationType,
          country,
          type,
          b2bId
        )
      );
      setStudentReports(res?.data?.data?.data || []);
      setTotalRecords(res?.data?.data?.totalRecords || 0);
      setTotalPages(res?.data?.data?.totalPages || 0);
      setUniqueRecords(res?.data?.data?.totalUniqueRecords || 0);
    } catch (error) {
      console.error("Error fetching lead reports:", error);
      setStudentReports([]);
    }
  };

  const handleDownloadSingle = async (id) => {
    try {
      const response = await dispatch(exportDataLeadReports([id]));
      if (response?.status === 200 && response?.data?.fileUrl) {
        const fileUrl = `${BASEURL}${response.data.fileUrl}`;
        const link = document.createElement("a");
        link.href = fileUrl;
        link.setAttribute("download", "Student_Application_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Student Application report downloaded successfully!");
        setSelectedIds([]);
      }
    } catch (error) {
      console.error("Error exporting single report:", error);
    }
  };

  // const handleExport = async () => {
  //   try {
  //     let idsToExport = selectedIds;
  //     if (selectedIds.length === 0) {
  //       const res = await dispatch(
  //         getAllStudentReport(
  //           1,
  //           10000,
  //           search,
  //           filters.startDate,
  //           filters.endDate,
  //           filters.mainStatus,
  //           filters.branchId,
  //           filters.showAll,
  //           filters.intakeMonth,
  //           filters.intakeYear,
  //           filters.institute,
  //           filters.applicationType?.value || "",
  //           filters.country?.value || "",
  //           filters.type?.value || "",
  //           filters.b2bId?.value || ""
  //         )
  //       );
  //       idsToExport = res?.data?.data?.data?.map((item) => item._id) || [];
  //     }
  //     const response = await dispatch(
  //       exportStudentApplicationReports(idsToExport)
  //     );
  //     if (response?.status === 200 && response?.data?.fileUrl) {
  //       const fileUrl = `${BASEURL}${response.data.fileUrl}`;
  //       const link = document.createElement("a");
  //       link.href = fileUrl;
  //       link.setAttribute("download", "student_application_report.csv");
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //       toast.success("Student Application report downloaded successfully!");
  //       setSelectedIds([]);
  //     }
  //   } catch (error) {
  //     console.error("Error exporting reports:", error);
  //   }
  // };

  const handleExport = async () => {
    try {
      let dataToExport = [];
      // if (selectedIds.length > 0) {
      const res = await dispatch(
        getAllStudentReport(
          1,
          10000,
          search,
          filters.startDate,
          filters.endDate,
          filters.mainStatus,
          filters.branchId,
          // filters.role,
          filters.user,
          filters.showAll,
          filters.intakeMonth,
          filters.intakeYear,
          filters.institute,
          filters.applicationType?.value || "",
          filters.country?.value || "",
          filters.type?.value || "",
          filters.b2bId?.value || ""
        )
      );
      dataToExport = res?.data?.data?.data || [];
      // } else {
      //   dataToExport = studentReports;
      // }

      if (!dataToExport || dataToExport.length === 0) {
        toast.error("No data available to export.");
        return;
      }

      const headers = columns.map((col) => col.label);

      const rows = dataToExport.map((item) => {
        return columns.map((col) => {
          let value = col.render ? col.render(item) : item[col.key] || "-";
          // Handle Institute Name
          if (col.key === "instituteName") {
            const displayValues = item?.interestedCourseDetails?.length
              ? item?.interestedCourseDetails
                  ?.filter(
                    (detail) =>
                      detail?.instituteFeePayment?.feeStatus === "paid"
                  )
                  ?.map((detail) => {
                    const instituteName =
                      detail?.institute?.instituteName || "-";
                    const campusName = detail?.campus?.campus;
                    return campusName
                      ? `${instituteName} - ${campusName}`
                      : instituteName;
                  })
                  .join(", ")
              : "-";
            value = displayValues;
          }
          // Handle Course Name
          if (col.key === "programName") {
            const displayValues = item?.interestedCourseDetails?.length
              ? item?.interestedCourseDetails
                  ?.filter(
                    (detail) =>
                      detail?.instituteFeePayment?.feeStatus === "paid"
                  )
                  ?.map((detail) => detail?.course?.programName || "-")
                  .join(", ")
              : "-";
            value = displayValues;
          }
          // Handle React elements for other columns
          if (
            React.isValidElement(value) &&
            col.key !== "instituteName" &&
            col.key !== "programName"
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
      link.setAttribute("download", "student_application_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Student Application report downloaded successfully!");
      setSelectedIds([]);
    } catch (error) {
      console.error("Error exporting reports:", error);
      toast.error("Something went wrong while exporting the report.");
    }
  };

  const fetchStudentStatuses = async () => {
    try {
      const res = await dispatch(getAllStudentStatus());
      if (res?.status === 200) {
        setStudentStatuses(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching student statuses:", error);
    }
  };

  const fetchAllIntake = async () => {
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

  const fetchAllInstitute = async () => {
    try {
      const res = await dispatch(getInstitute());
      if (res?.status === 200) {
        setInstituteData(res?.data?.data);
      }
    } catch (error) {
      console.log("error fetching in fetchAllIntake", error);
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

  const fetchFilterRolesByBranch = async (branchId, showAll = false) => {
    try {
      let branchIdToUse = branchId;
      let showAllToUse = showAll;

      if (branchId === null) {
        branchIdToUse = ""; // Head Office should send empty string
        showAllToUse = false;
      }

      if (branchId && branchId !== null) {
        showAllToUse = false;
      }

      if (branchId === "" || branchId === undefined) {
        showAllToUse = true;
      }
      const res = await dispatch(getAllRoleList(branchIdToUse, showAllToUse));

      const roles = res?.data?.data || [];

      if (roles.length === 0) {
        setFilterRoleOptions([]);
        return;
      }

      const mappedRoles = roles.map((role) => ({
        value: role._id,
        label: role.name,
      }));

      setFilterRoleOptions(mappedRoles);
    } catch (error) {
      console.error("Error fetching roles (filters):", error);
      toast.warn("Failed to load roles");
      setFilterRoleOptions([]);
    }
  };

  const fetchUsersByRoleAndBranch = async (
    roleId,
    roleName,
    branchId,
    showAll = false,
    isForFilter = false
  ) => {
    if (!roleId) {
      if (isForFilter) {
        setFilterUserOptions([]);
      } else {
        setUserOptions([]);
      }
      return;
    }

    try {
      const branchIdToUse = branchId === null ? undefined : branchId;
      const res = await dispatch(
        adminGetAll(1, 1000, "", roleName, branchIdToUse, showAll)
      );
      const users = res?.data?.data?.data || [];

      if (users.length === 0) {
        if (isForFilter) {
          setFilterUserOptions([]);
        } else {
          setUserOptions([]);
        }
        toast.info("No users found for this role/branch");
        return;
      }

      const mappedUsers = users.map((user) => ({
        value: user._id,
        label: user.name || user.email || "Unnamed User",
      }));

      if (isForFilter) {
        setFilterUserOptions(mappedUsers);
      } else {
        setUserOptions(mappedUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      if (isForFilter) {
        setFilterUserOptions([]);
      } else {
        setUserOptions([]);
      }
    }
  };
  useEffect(() => {
    if (filters.branchId !== "") {
      const branchToUse = filters.branchId === null ? null : filters.branchId;
      const showAllToUse = filters.showAll;

      fetchFilterRolesByBranch(branchToUse, showAllToUse);
    } else {
      // If "All Branches", load all roles for filters
      dispatch(getAllRoleList("", true)).then((res) => {
        const roles = res?.data?.data || [];
        setFilterRoleOptions(
          roles.map((r) => ({ value: r._id, label: r.name }))
        );
      });
    }
  }, [filters.branchId]);

  const fetchPreferredCountries = async () => {
    try {
      const res = await dispatch(getUniquePreferredCountries());
      setPreferredCountries(res?.data?.data || []);
    } catch (error) {
      console.log("Error fetching preferred countries:", error);
      setPreferredCountries([]);
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

  useEffect(() => {
    if (canRead) {
      fetchLeadReport(
        currentPage,
        itemsPerPage,
        search,
        filters.startDate,
        filters.endDate,
        filters.mainStatus,
        filters.branchId,
        // filters.role,
        filters.user,
        filters.showAll,
        filters.intakeMonth,
        filters.intakeYear,
        filters.institute,
        filters.applicationType?.value,
        filters.country?.value,
        filters.type?.value,
        filters.b2bId?.value
      );
    }
  }, [currentPage, itemsPerPage, search, filters]);

  useEffect(() => {
    fetchStudentStatuses();
    fetchAllIntake();
    fetchAllInstitute();
    fetchAllBranches();
    fetchPreferredCountries();
    fetchAllB2B();
  }, []);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };
  const selectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "12px",
      color: "black",
    }),
    placeholder: (base) => ({
      ...base,
      color: "black",
      fontSize: "13px",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <>
      <Pageheader
        mainheading="Student Application"
        parentfolder="Reports"
        activepage="Student Application"
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
              <div className="w-100 d-flex flex-wrap justify-content-end">
                {/* <div className="card-title">Student Application report</div> */}
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
                  {studentReports?.length > 0 && canDownload && (
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
                  <Form.Label>Application Status</Form.Label>
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
                        (option) => option.value === filters.mainStatus
                      ) || null
                    }
                    onChange={(selectedOption) => {
                      setFilters({
                        ...filters,
                        mainStatus: selectedOption ? selectedOption.value : "",
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
                    noOptionsMessage={() => "No months available"}
                  />
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
                  <Form.Label>University</Form.Label>
                  <Select
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: "13px",
                        minHeight: "38px",
                      }),
                    }}
                    options={instituteOptions}
                    value={
                      instituteOptions.find(
                        (option) => option.value === filters.institute
                      ) || null
                    }
                    onChange={(selectedOption) => {
                      setFilters({
                        ...filters,
                        institute: selectedOption ? selectedOption.value : "",
                      });
                      setCurrentPage(1);
                    }}
                    classNamePrefix="custom-select"
                    className="filter-height"
                    placeholder="Select University"
                    isClearable
                  />
                </div>

                <div className="filter-item">
                  <Form.Label>Application Type</Form.Label>
                  <Select
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: "13px",
                        minHeight: "38px",
                      }),
                    }}
                    options={tailormadeOptions}
                    value={
                      tailormadeOptions.find(
                        (option) => option.value === filters.applicationType
                      ) || null
                    }
                    onChange={(selectedOption) => {
                      setFilters({
                        ...filters,
                        applicationType: selectedOption
                          ? selectedOption.value
                          : "",
                      });
                      setCurrentPage(1);
                    }}
                    placeholder="Select Type"
                    isClearable
                    isSearchable
                    className="filter-height"
                    classNamePrefix="custom-select"
                    noOptionsMessage={() => "No options available"}
                  />
                </div>

                <div className="filter-item">
                  <Form.Label>Country</Form.Label>
                  <Select
                    options={countryOptions}
                    value={filters.country}
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
                {userRole !== "Branch" && userType !=="Branch User" && (
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
                      isClearable
                      isSearchable
                      classNamePrefix="custom-select"
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
                        fetchFilterRolesByBranch(branchId, showAll);
                      }}
                    />
                  </div>
                )}

                <div className="filter-item">
                  <Form.Label>Role</Form.Label>
                  <Select
                    options={filterRoleOptions}
                    value={
                      filterRoleOptions.find(
                        (opt) => opt.value === filters.role
                      ) || null
                    }
                    onChange={(selected) => {
                      const roleId = selected ? selected.value : "";
                      const roleName = selected ? selected.label : "";

                      setFilters({
                        ...filters,
                        role: roleId,
                        user: "",
                      });
                      setFilterUserOptions([]);
                      setCurrentPage(1);

                      if (roleId && roleName) {
                        const branchIdToUse =
                          filters.branchId === "" ? null : filters.branchId;
                        const showAllToUse = filters.showAll;

                        fetchUsersByRoleAndBranch(
                          roleId,
                          roleName,
                          branchIdToUse,
                          showAllToUse,
                          true
                        );
                      } else {
                        setFilterUserOptions([]);
                      }
                    }}
                    placeholder="Select Role"
                    isClearable
                    isSearchable
                    styles={selectStyles}
                  />
                </div>

                <div className="filter-item">
                  <Form.Label>User</Form.Label>
                  <Select
                    options={filterUserOptions}
                    value={
                      filterUserOptions.find(
                        (opt) => opt.value === filters.user
                      ) || null
                    }
                    onChange={(selected) => {
                      setFilters({
                        ...filters,
                        user: selected ? selected.value : "",
                      });
                      setCurrentPage(1);
                    }}
                    placeholder="Select User"
                    isClearable
                    isSearchable
                    styles={selectStyles}
                    noOptionsMessage={() =>
                      filters.role ? "No users found" : "Select role first"
                    }
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

                <div className="filter-item">
                  <div className="filter-height d-flex align-items-center">
                    <span>
                      Unique Records: <strong>{uniqueRecoreds}</strong>
                    </span>
                  </div>
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
                      Total Records: <strong>{totalRecords}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="table-responsive modern-table-wrapper"
                style={{
                  borderRadius: "12px",
                  border: "1px solid #dee2e6",
                }}>
                <table
                  className="table table-hover modern-table table-nowrap"
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
                    {studentReports?.length > 0 ? (
                      studentReports.filter(Boolean).map((item, index) => (
                        <tr
                          key={index}
                          className={`${
                            index % 2 === 0 ? "table-row-even" : "table-row-odd"
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

              {totalPages > 1 && studentReports.length > 0 && (
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

export default StudentApplicationReports;
