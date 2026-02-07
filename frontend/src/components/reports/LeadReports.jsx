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
  Table,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import Select from "react-select";
import Pageheader from "../../layouts/Pageheader";
import DownloadIcon from "@mui/icons-material/Download";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { toast } from "react-toastify";
import {
  exportDataLeadReports,
  getAllLeadReport,
  getAllSourceOfReference,
} from "../../redux/actions/Report/LeadReports.action";
import { getAllLeadStatus } from "../../redux/actions/Master/LeadStatuses/LeadStatus.action";
import { BASEURL } from "../../baseUrl";
import "react-calendar/dist/Calendar.css";
import { MdCalendarToday } from "react-icons/md";
import { getAllBranch } from "../../redux/actions/Branch.action";
import { decryptData } from "../../utils/encryptionUtils";
import Calendar from "react-calendar";
import { getAllRoleList } from "../../redux/actions/Master/Role.action";
import { adminGetAll } from "../../redux/actions/Admin.action";
import SearchWithDropdown from "../commonComponents/SearchWithDropdown";
import { getOneLeadSubStatus } from "../../redux/actions/Master/LeadStatuses/LeadSubStatus.action";
import { getLeadCountry, getLeadFrom } from "../../redux/actions/Lead.action";
import { getAllFollowUpType } from "../../redux/actions/Lead/FollowUpType.action";

const searchOption = [
  { label: "Everything", value: "" },
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
  { label: "Alternate Contact", value: "alternate_contact" },
  { label: "Address", value: "address" },
  { label: "Country Interested", value: "country_interested" },
  { label: "Course", value: "course" },
  { label: "Level", value: "level" },
  { label: "Budget", value: "budget" },
  { label: "English Proficiency", value: "english_proficiency" },
  { label: "Passport", value: "passport" },
];

const LeadReports = () => {
  const dispatch = useDispatch();
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(searchOption[0]);
  const [leadReports, setLeadReports] = useState([]);
  const [sourseOfReference, setSourseOfReference] = useState([]);
  const [leadStatus, setLeadStatus] = useState([]);
  const [leadSubStatus, setLeadSubStatus] = useState([]);
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [roleList, setRoleList] = useState(null);
  const [assignUserList, setAssignUserList] = useState([]);
  const { canRead, canCreate, canUpdate, canDownload } = usePermissions("Lead");

  const userRole = decryptData(localStorage.getItem("role"));
  const branchId = decryptData(localStorage.getItem("userId"));
  const branchUserId = decryptData(localStorage.getItem("branchId"));
  const userType = decryptData(localStorage.getItem("userType"));

  const [leadCountries, setLeadCountries] = useState([]);
  const [allFollowUpTypes, setAllFollowUpTypes] = useState([]);
  const [leadFrom, setLeadFrom] = useState([]);

  const derivedBranchValue =
    userRole === "Branch"
      ? branchId
      : userType === "Branch User"
      ? branchUserId
      : "";

  const [filters, setFilters] = useState({
    source: "",
    status: "",
    subStatus: "",
    assignRole: "",
    assignId: "",
    branchId: derivedBranchValue,
    showAll: userRole === "Branch" || userType === "Branch User" ? false : true,
    startDate: "",
    endDate: "",
    leadActivity: "",
    country: "",
    followUpType: "",
    lead_from: "",
  });

  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const startDateInputRef = useRef(null);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [endDateValue, setEndDateValue] = useState(null);
  const endDateInputRef = useRef(null);

  const leadSourceOptions = sourseOfReference.map((source) => ({
    value: source,
    label: source.charAt(0).toUpperCase() + source.slice(1),
  }));

  const leadStageOptions = leadStatus.map((status) => ({
    value: status.name,
    label: status.name,
  }));

  const leadSubStatusOptions =
    leadSubStatus?.map((item) => ({
      value: item.name,
      label: item.name,
    })) || [];
  const followUpTypeOptions =
    allFollowUpTypes?.map((item) => ({
      value: item._id,
      label: item.name,
    })) || [];

  const leadActivityOptions = [
    { value: "Active ", label: "Active " },
    { value: "Inactive", label: "Inactive" },
  ];

  const selectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "12px",
      fontSize: "13px",
      minHeight: "38px",
    }),
    placeholder: (base) => ({
      ...base,
      fontSize: "13px",
      color: "#6c757d",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  const assignRoleOptions =
    roleList?.data
      ?.filter((role) => role?.name !== "Super Admin")
      ?.map((role) => ({
        value: role._id,
        label: role.name,
      })) || [];

  const leadAssignOptions =
    assignUserList?.map((user) => {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
      return {
        value: user._id,
        label: fullName || user.name,
      };
    }) || [];

  const allBranchOptions =
    branchList
      ?.filter((branch) => branch?.name?.trim())
      ?.sort((a, b) => a.name.localeCompare(b.name))
      ?.map((branch) => ({
        value: branch._id,
        label: branch.name,
      })) || [];

  const branchSelectOptions = [
    { value: "All", label: "All" },
    { value: "", label: "Head Office" },
    ...allBranchOptions,
  ];

  const branchTargetValue = filters.showAll
    ? "All"
    : filters.branchId === null
    ? ""
    : filters.branchId || "All";

  const branchSelectValue =
    branchSelectOptions.find((option) => option.value === branchTargetValue) ||
    null;

  const loadRoles = async (branchValue, showAllValue) => {
    try {
      const res = await dispatch(
        getAllRoleList(branchValue ?? "", showAllValue ?? false)
      );
      setRoleList(res?.data);
    } catch (error) {
      console.error("Error fetching roles list:", error);
      setRoleList(null);
    }
  };

  const loadUsersForRole = async (
    roleName,
    branchValue = "",
    showAllValue = false
  ) => {
    try {
      const effectiveBranchId =
        branchValue === null
          ? ""
          : branchValue === undefined
          ? ""
          : branchValue;
      const res = await dispatch(
        adminGetAll(1, 100, "", roleName, effectiveBranchId, showAllValue)
      );
      const responseData = res?.data?.data;
      setAssignUserList(responseData?.data || []);
    } catch (error) {
      console.error("Error fetching assign users:", error);
      setAssignUserList([]);
    }
  };

  const handleBranchFilterChange = async (selectedOption) => {
    let branchValue = "";
    let showAllValue = false;

    if (!selectedOption || selectedOption.value === "All") {
      if (userRole === "Branch" || userType === "Branch User") {
        branchValue = derivedBranchValue;
        showAllValue = false;
      } else {
        branchValue = "";
        showAllValue = true;
      }
    } else if (selectedOption.value === "") {
      branchValue = null;
      showAllValue = false;
    } else {
      branchValue = selectedOption.value;
      showAllValue = false;
    }

    setFilters((prev) => ({
      ...prev,
      branchId: branchValue,
      showAll: showAllValue,
      assignRole: "",
      assignId: "",
    }));
    setAssignUserList([]);
    await loadRoles(branchValue, showAllValue);
  };

  const resolveBranchForUsers = () => {
    if (filters.showAll) return "";
    if (filters.branchId === null) return null;
    if (filters.branchId) return filters.branchId;
    if (userRole === "Branch") return branchId;
    if (userType === "Branch User") return branchUserId;
    return "";
  };

  const handleAssignRoleFilterChange = async (selectedOption) => {
    const selectedRoleId = selectedOption ? selectedOption.value : "";
    const selectedRoleName = selectedOption ? selectedOption.label : "";

    setFilters((prev) => ({
      ...prev,
      assignRole: selectedRoleId,
      assignId: "",
    }));

    if (selectedRoleId && selectedRoleName) {
      const branchValue = resolveBranchForUsers();
      await loadUsersForRole(selectedRoleName, branchValue, filters.showAll);
    } else {
      setAssignUserList([]);
    }
  };

  useEffect(() => {
    const initialBranchValue = derivedBranchValue ?? "";
    loadRoles(
      initialBranchValue,
      userRole === "Branch" || userType === "Branch User" ? false : true
    );
  }, [dispatch, derivedBranchValue]);

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = leadReports.map((item) => item._id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const columns = [
    {
      label: (
        <Form.Check
          type="checkbox"
          className="custom-checkbox"
          onChange={handleSelectAll}
          checked={
            selectedIds.length === leadReports.length && leadReports.length > 0
          }
        />
      ),
      key: "checkbox",
      render: (item) => (
        <Form.Check
          type="checkbox"
          className="custom-checkbox"
          checked={selectedIds.includes(item._id)}
          onChange={() => handleCheckboxChange(item._id)}
        />
      ),
    },
    {
      label: "Date",
      key: "date",
      render: (item) =>
        new Date(item.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          timeZone: "UTC",
        }),
    },
    {
      label: "Name",
      key: "name",
    },
    {
      label: "Phone",
      key: "phone",
      render: (item) => (item?.phone ? item?.phone : "-"),
    },
    {
      label: "Lead Status",
      render: (item) => {
        return (
          <span
            style={{
              backgroundColor: item?.leadStatusColor || "#999999",
              color: "#ffffff", // Always white text
              padding: "1px 8px",
              borderRadius: "30px",
              display: "inline-block",
            }}
          >
            {item?.lead_status ? item.lead_status : "-"}
          </span>
        );
      },
    },
    // {
    //   label: "Lead Status",
    //   render: (item) => {
    //     const getTextColor = (bgColor) => {
    //       if (!bgColor) return "#000000";
    //       // Convert hex to RGB
    //       const hex = bgColor.replace("#", "");
    //       const r = parseInt(
    //         hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2),
    //         16
    //       );
    //       const g = parseInt(
    //         hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4),
    //         16
    //       );
    //       const b = parseInt(
    //         hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6),
    //         16
    //       );
    //       // Calculate luminance
    //       const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    //       return luminance > 0.5 ? "#000000" : "#ffffff"; // Dark text for light backgrounds, white for dark
    //     };
    //     return (
    //       <span
    //         style={{
    //           backgroundColor: item?.leadStatusColor || "#f0f0f0",
    //           color: getTextColor(item?.leadStatusColor),
    //           padding: "4px 8px",
    //           borderRadius: "4px",
    //           display: "inline-block",
    //         }}
    //       >
    //         {item?.lead_status ? item.lead_status : "-"}
    //       </span>
    //     );
    //   },
    // },
    {
      label: "Lead Assign",
      render: (item) => (item?.lead_assign ? item?.lead_assign?.name : "-"),
    },
    {
      label: "Lead Form",
      render: (item) => (item?.lead_form ? item?.lead_form : "-"),
    },
    {
      label: "Lead Form",
      render: (item) =>
        item?.source_of_reference ? item?.source_of_reference : "-",
    },
    {
      label: "City",
      key: "city",
      render: (item) => (item?.city ? item?.city : "-"),
    },
    {
      label: "Remark",
      key: "remarks",
      render: (item) => {
        const remark = item?.remarks?.trim() || "-";

        return (
          <OverlayTrigger placement="top" overlay={<Tooltip>{remark}</Tooltip>}>
            <span style={{ cursor: "pointer" }}>{remark}</span>
          </OverlayTrigger>
        );
      },
    },
    {
      label: "Created By",
      render: (item) => (item?.createdByName ? item?.createdByName : "-"),
    },
    {
      label: "Updated By",
      render: (item) => (item?.updatedByName ? item?.updatedByName : "-"),
    },
  ];

  // const renderActions = (item, index) => (
  //   <div className="d-flex">
  //     <IconButton
  //       aria-label="more"
  //       aria-controls={`menu-${index}`}
  //       aria-haspopup="true"
  //       onClick={(e) => {
  //         setOpenDropdown(openDropdown === index ? null : index);
  //         setAnchorEl(e.currentTarget);
  //       }}
  //     >
  //       <MoreVertIcon className="three-dots-icon" />
  //     </IconButton>
  //     <Menu
  //       id={`menu-${index}`}
  //       anchorEl={anchorEl}
  //       open={openDropdown === index}
  //       onClose={() => setOpenDropdown(null)}
  //       MenuListProps={{
  //         "aria-labelledby": `menu-${index}`,
  //       }}
  //       sx={{
  //         "& .MuiPaper-root": {
  //           minWidth: "150px",
  //           boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  //         },
  //       }}
  //     >
  //       <MenuItem
  //         key="download"
  //         onClick={() => {
  //           handleDownloadSingle(item._id);
  //           setOpenDropdown(null);
  //         }}
  //       >
  //         <DownloadIcon
  //           fontSize="small"
  //           sx={{ mr: 1 }}
  //           className="download-icon"
  //         />
  //         <span className="download-action-text">Export Report</span>
  //       </MenuItem>
  //     </Menu>
  //   </div>
  // );

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

  const fetchLeadReport = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    searchOnField,
    source = filters.source,
    status = filters.status,
    subStatus = filters.subStatus,
    assignRole = filters.assignRole,
    assignId = filters.assignId,
    branchId = filters.branchId,
    showAll = filters.showAll,
    startDate = filters.startDate,
    endDate = filters.endDate,
    leadActivity = filters.leadActivity,
    country = filters.country,
    followUpType = filters.followUpType,
    lead_from = filters.lead_from
  ) => {
    try {
      const res = await dispatch(
        getAllLeadReport(
          page,
          limit,
          search,
          searchOnField,
          source,
          status,
          subStatus,
          assignRole,
          assignId,
          branchId,
          showAll,
          startDate,
          endDate,
          leadActivity,
          country,
          followUpType,
          lead_from
        )
      );
      setLeadReports(res?.data?.data?.data || []);
      setTotalRecords(res?.data?.data?.totalRecords || 0);
      setTotalPages(res?.data?.data?.totalPages || 0);
    } catch (error) {
      console.error("Error fetching lead reports:", error);
      setLeadReports([]);
    }
  };

  const fetchSourseOfReference = async () => {
    try {
      const res = await dispatch(getAllSourceOfReference());
      setSourseOfReference(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching Source Of Reference:", error);
      setSourseOfReference([]);
    }
  };

  const handleDownloadSingle = async (id) => {
    try {
      const response = await dispatch(exportDataLeadReports([id]));
      if (response?.status === 200 && response?.data?.fileUrl) {
        const fileUrl = `${BASEURL}${response.data.fileUrl}`;
        const link = document.createElement("a");
        link.href = fileUrl;
        link.setAttribute("download", "lead_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Lead Reports downloaded successfully!");
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
  //         getAllLeadReport(
  //           1,
  //           10000,
  //           search,
  //           filters.source,
  //           filters.status,
  //           filters.assignId,
  //           filters.branchId,
  //           filters.showAll,
  //           filters.startDate,
  //           filters.endDate
  //         )
  //       );

  //       // Extract all record IDs from the response
  //       idsToExport = res?.data?.data?.data?.map((item) => item._id) || [];

  //       // Check if no data is available
  //       if (!idsToExport || idsToExport.length === 0) {
  //         toast.error("No data available to export.");
  //         return;
  //       }
  //     }
  //     const response = await dispatch(exportDataLeadReports(idsToExport));
  //     if (response?.status === 200 && response?.data?.fileUrl) {
  //       const fileUrl = `${BASEURL}${response.data.fileUrl}`;
  //       const link = document.createElement("a");
  //       link.href = fileUrl;
  //       link.setAttribute("download", "lead_report.csv");
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //       toast.success("Lead Reports downloaded successfully!");
  //       setSelectedIds([]);
  //     }
  //   } catch (error) {
  //     console.error("Error exporting reports:", error);
  //   }
  // };

  const handleExport = async (
    page = 1,
    limit = 10000,
    search = "",
    searchOnField,
    source = filters.source,
    status = filters.status,
    subStatus = filters.subStatus,
    assignRole = filters.assignRole,
    assignId = filters.assignId,
    branchId = filters.branchId,
    showAll = filters.showAll,
    startDate = filters.startDate,
    endDate = filters.endDate,
    leadActivity = filters.leadActivity,
    country = filters.country,
    followUpType = filters.followUpType,
    lead_from = filters.lead_from
  ) => {
    try {
      let dataToExport = [];
      if (selectedIds.length > 0) {
        dataToExport =
          leadReports.filter((item) => selectedIds.includes(item._id)) || [];
      } else {
        const res = await dispatch(
          getAllLeadReport(
            page,
            limit,
            search,
            searchOnField,
            source,
            status,
            subStatus,
            assignRole,
            assignId,
            branchId,
            showAll,
            startDate,
            endDate,
            leadActivity,
            country,
            followUpType,
            lead_from
          )
        );
        dataToExport = res?.data?.data?.data || [];
      }

      if (!dataToExport || dataToExport.length === 0) {
        toast.error("No data available to export.");
        return;
      }

      const headers = columns
        .map((col) => col.label)
        .filter((label) => label !== columns[0].label);

      const rows = dataToExport.map((item) => {
        return columns
          .filter((col) => col.key !== "checkbox")
          .map((col) => {
            let value = col.render ? col.render(item) : item[col.key] || "-";
            // Explicitly handle Remark column to get plain text
            if (col.key === "remarks") {
              value = item.remarks || "-";
            } else if (React.isValidElement(value)) {
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
      link.setAttribute("download", "lead_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Lead Reports downloaded successfully!");
      setSelectedIds([]);
    } catch (error) {
      console.error("Error exporting reports:", error);
      toast.error("Something went wrong while exporting the report.");
    }
  };

  const fetchLeadStatus = async () => {
    try {
      const res = await dispatch(getAllLeadStatus());
      if (res?.status === 200) {
        setLeadStatus(res?.data?.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const fetchLeadSubStatus = async (mainTab) => {
    try {
      const res = await dispatch(getOneLeadSubStatus(mainTab));

      if (res?.status === 200) {
        setLeadSubStatus(res?.data?.data);
      }
    } catch (error) {
      console.log("error", error);
      setLeadSubStatus([]);
    }
  };

  const fetchAllBranches = async () => {
    try {
      const res = await dispatch(getAllBranch(1, 1000, ""));
      const responseData = res?.data?.data;
      setBranchList(responseData?.data || []);
    } catch (error) {
      console.log("Error fetching branches:", error);
      setBranchList([]);
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchLeadReport(
        currentPage,
        itemsPerPage,
        searchTerm,
        selectedFilter.value,
        filters.source,
        filters.status,
        filters.subStatus,
        filters.assignRole,
        filters.assignId,
        filters.branchId,
        filters.showAll,
        filters.startDate,
        filters.endDate,
        filters.leadActivity,
        filters.country,
        filters.followUpType,
        filters.lead_from
      );
    }
  }, [currentPage, itemsPerPage, search, selectedFilter , filters]);
  const fetchLeadCountries = async () => {
    try {
      const res = await dispatch(getLeadCountry({ fromB2B: false }));
      if (res?.status === 200) {
        setLeadCountries(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching lead countries:", error);
      setLeadCountries([]);
    }
  };

  const fetchFollowUpTypes = async () => {
    try {
      const res = await dispatch(getAllFollowUpType(1, 100, ""));
      const responseData = res?.data?.data;
      setAllFollowUpTypes(responseData?.data || []);
    } catch (error) {
      console.error("Error fetching Follow Up Types:", error);
    }
  };

  const fetchLeadFrom = async () => {
    try {
      const res = await dispatch(getLeadFrom());
      if (res?.status === 200) {
        setLeadFrom(res?.data?.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    fetchSourseOfReference();
    fetchLeadStatus();
    fetchAllBranches();
    fetchLeadCountries();
    fetchFollowUpTypes();
    fetchLeadFrom();
  }, []);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <>
      <Pageheader mainheading="Lead" parentfolder="Reports" activepage="Lead" />

      <Row className="mt-2">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div className="w-100 d-flex flex-wrap justify-content-end">
                {/* <div className="card-title">Lead Report</div> */}
                <div className="d-flex flex-wrap gap-2">
                <SearchWithDropdown
                  searchOption={searchOption}
                  selectedFilter={selectedFilter}
                  setSelectedFilter={setSelectedFilter}
                  search={searchTerm}
                  setSearch={setSearchTerm}
                  setCurrentPage={setCurrentPage}
                />
                  {/* <div className="contact-search3">
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
                  </div> */}
                  {canDownload && leadReports?.length > 0 && (
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
                  <Form.Label>Lead Source</Form.Label>
                  <Select
                    className="filter-height"
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: "13px",
                        minHeight: "38px",
                      }),
                    }}
                    options={leadSourceOptions}
                    value={
                      leadSourceOptions.find(
                        (option) => option.value === filters.source
                      ) || null
                    }
                    onChange={(selectedOption) => {
                      setFilters({
                        ...filters,
                        source: selectedOption ? selectedOption.value : "",
                      });
                      setCurrentPage(1);
                    }}
                    placeholder="Select Source"
                    isClearable
                    isSearchable
                    classNamePrefix="custom-select"
                    noOptionsMessage={() => "No sources available"}
                  />
                </div>

                <div className="filter-item">
                  <Form.Label>Lead Stage</Form.Label>
                  <Select
                    className="filter-height"
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: "13px",
                        minHeight: "38px",
                      }),
                    }}
                    options={leadStageOptions}
                    value={
                      leadStageOptions.find(
                        (option) => option.value === filters.status
                      ) || null
                    }
                    onChange={(option) => {
                      const statusValue = option ? option.value : "";

                      setFilters({
                        ...filters,
                        status: statusValue,
                        subStatus: "",
                      });
                      setCurrentPage(1);

                      if (statusValue) {
                        fetchLeadSubStatus(statusValue);
                      } else {
                        setLeadSubStatus([]);
                      }
                    }}
                    placeholder="Select Stage"
                    isClearable
                    isSearchable
                    classNamePrefix="custom-select"
                    noOptionsMessage={() => "No stages available"}
                  />
                </div>
                <div className="filter-item">
                  <Form.Label>Sub status</Form.Label>
                  <Select
                    styles={selectStyles}
                    classNamePrefix="select"
                    value={
                      filters.subStatus
                        ? {
                            value: filters.subStatus,
                            label: filters.subStatus,
                          }
                        : null
                    }
                    onChange={(option) => {
                      setFilters({
                        ...filters,
                        subStatus: option ? option.value : "",
                      });
                      setCurrentPage(1);
                    }}
                    options={leadSubStatusOptions}
                    placeholder="Select Sub Status"
                    isClearable
                    isDisabled={!filters.status || leadSubStatus?.length === 0}
                  />
                </div>
                <div className="filter-item">
                  <Form.Label>Country</Form.Label>
                  <Select
                    className="filter-height"
                    styles={selectStyles}
                    classNamePrefix="select"
                    value={
                      filters.country
                        ? {
                            value: filters.country,
                            label:
                              leadCountries.find(
                                (c) => c === filters.country
                              ) || filters.country,
                          }
                        : null
                    }
                    onChange={(selected) => {
                      setFilters({
                        ...filters,
                        country: selected ? selected.value : "",
                      });
                      setCurrentPage(1);
                    }}
                    options={leadCountries.map((country) => ({
                      value: country,
                      label: country,
                    }))}
                    placeholder="Select Country"
                    isClearable
                    isSearchable
                    noOptionsMessage={() => "No countries available"}
                  />
                </div>
                <div className="filter-item">
                  <Form.Label>Follow Up Type</Form.Label>
                  <Select
                    className="filter-height"
                    styles={selectStyles}
                    classNamePrefix="select"
                    value={
                      filters.followUpType
                        ? followUpTypeOptions.find(
                            (option) => option.value === filters.followUpType
                          )
                        : null
                    }
                    onChange={(selected) => {
                      setFilters({
                        ...filters,
                        followUpType: selected ? selected.value : "",
                      });
                      setCurrentPage(1);
                    }}
                    options={followUpTypeOptions}
                    placeholder="Select Type"
                    isClearable
                    isSearchable
                    noOptionsMessage={() => "No countries available"}
                  />
                </div>

                <div className="filter-item">
                  <Form.Label>Lead From</Form.Label>
                  <Select
                    className="filter-height"
                    value={
                      leadFrom?.includes(filters.lead_from)
                        ? {
                            value: filters.lead_from,
                            label: filters.lead_from,
                          }
                        : null
                    }
                    onChange={(selected) => {
                      setFilters({
                        ...filters,
                        lead_from: selected ? selected.value : "",
                      });
                      setCurrentPage(1);
                    }}
                    options={
                      leadFrom?.length > 0
                        ? leadFrom?.map((item) => ({
                            value: item,
                            label: item,
                          }))
                        : []
                    }
                    placeholder="Select From"
                    classNamePrefix="custom-select"
                    isClearable
                    styles={selectStyles}
                    noOptionsMessage={() => "No lead sources available"}
                  />
                </div>
                <div className="filter-item">
                  <Form.Label>Activity</Form.Label>
                  <Select
                    className="filter-height"
                    styles={selectStyles}
                    classNamePrefix="select"
                    value={
                      filters.leadActivity
                        ? {
                            value: filters.leadActivity,
                            label: filters.leadActivity,
                          }
                        : null
                    }
                    onChange={(option) => {
                      // setLeadActivityFilter(option ? option.value : "");

                      setFilters({
                        ...filters,
                        leadActivity: option ? option.value : "",
                      });
                      setCurrentPage(1);
                    }}
                    options={leadActivityOptions?.map((item) => ({
                      value: item.value,
                      label: item.label,
                    }))}
                    placeholder="Select Activity"
                    isClearable
                  />
                </div>

                <div className="filter-item">
                  <Form.Label>Branch</Form.Label>
                  <Select
                    className="filter-height"
                    styles={selectStyles}
                    classNamePrefix="custom-select"
                    options={branchSelectOptions}
                    value={branchSelectValue}
                    onChange={(option) => {
                      handleBranchFilterChange(option);
                      setCurrentPage(1);
                    }}
                    placeholder="Select Branch"
                    isClearable
                    isSearchable
                  />
                </div>
                <div className="filter-item">
                  <Form.Label>Assign Role</Form.Label>
                  <Select
                    className="filter-height"
                    styles={selectStyles}
                    classNamePrefix="custom-select"
                    options={assignRoleOptions}
                    value={
                      assignRoleOptions.find(
                        (option) => option.value === filters.assignRole
                      ) || null
                    }
                    onChange={(option) => {
                      handleAssignRoleFilterChange(option);
                      setCurrentPage(1);
                    }}
                    placeholder="Select Assign Role"
                    isClearable
                    isSearchable
                    noOptionsMessage={() => "No roles available"}
                  />
                </div>

                <div className="filter-item">
                  <Form.Label>Lead Assign</Form.Label>
                  <Select
                    styles={selectStyles}
                    options={leadAssignOptions}
                    value={
                      leadAssignOptions.find(
                        (option) => option.value === filters.assignId
                      ) || null
                    }
                    onChange={(selectedOption) => {
                      setFilters({
                        ...filters,
                        assignId: selectedOption ? selectedOption.value : "",
                      });
                      setCurrentPage(1);
                    }}
                    classNamePrefix="custom-select"
                    placeholder="Select Assign"
                    isClearable
                    isSearchable
                    isDisabled={!filters.assignRole}
                    noOptionsMessage={() => "No users available"}
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
                    {leadReports?.length > 0 ? (
                      leadReports.filter(Boolean).map((item, index) => (
                        <tr
                          key={item._id || index}
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
                                ? col.render(item)
                                : item[col.key] || "-"}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr className="no-data-row">
                        <td colSpan={columns.length + 2}>
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

              {totalPages > 1 && leadReports.length > 0 && (
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

export default LeadReports;
