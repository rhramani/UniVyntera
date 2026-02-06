import { useEffect, useState, useRef } from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { MdMessage } from "react-icons/md";
import { FaAppStore, FaBullseye, FaWhatsapp } from "react-icons/fa";
import {
  MdAccessTime,
  MdCall,
  MdChatBubble,
  MdDescription,
  MdEditNote,
  MdLocationOn,
  MdOutlineCalendarToday,
  MdPerson,
  MdPersonOutline,
  MdVerifiedUser,
} from "react-icons/md";
import PersonIcon from "@mui/icons-material/Person";
import CreateIcon from "@mui/icons-material/Create";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import Pageheader from "../../layouts/Pageheader";
import Paginations from "../elements/Paginations";
import { toast } from "react-toastify";
import {
  getLeadById,
  getTodaysBirthdayLeads,
  sendWPMessage,
} from "../../redux/actions/Lead.action";
import { useDispatch } from "react-redux";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import "react-phone-input-2/lib/bootstrap.css";
import usePermissions from "../commonComponents/usePermissions";
import ViewModal from "../commonComponents/ViewModal";
import WhatsappMessageModal from "./commonLeadForm/WhatsAppModal";
import { IconButton, Menu, MenuItem } from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import WaDaddyWhatsAppModal from "./commonLeadForm/WaDaddyWhatsAppModal";
import ConvertToApplicationModal from "./allLeadsComponents/ConvertToApplicationModal";
import { countryDropdown } from "../../redux/actions/Master/Institute.action";
import { getAllLeadStatus } from "../../redux/actions/Master/LeadStatuses/LeadStatus.action";
import { getAllBranch } from "../../redux/actions/Branch.action";
import { getAllRoleList } from "../../redux/actions/Master/Role.action";
import { adminGetAll } from "../../redux/actions/Admin.action";
import { useLocation, useNavigate } from "react-router-dom";

const badgeThemes = [
  {
    bg: "#c7d2fe", // indigo-200
    border: "#a5b4fc", // indigo-300
    role: "#4f46e5", // indigo-600
    user: "#1e1b4b", // indigo-950
  },
  {
    bg: "#a5f3fc", // cyan-200
    border: "#67e8f9", // cyan-300
    role: "#0891b2", // cyan-600
    user: "#083344",
  },
  {
    bg: "#bbf7d0", // green-200
    border: "#86efac", // green-300
    role: "#16a34a", // green-600
    user: "#052e16",
  },
];

const TodaysBirthdayLeads = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [getLeadDataById, setGetLeadDataById] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showDateCalendar, setShowDateCalendar] = useState(false);
  const [dateValue, setDateValue] = useState(null);
  const dateInputRef = useRef(null);
  const dateCalenderRef = useRef(null);
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);
  const [selectedLeadName, setSelectedLeadName] = useState("");
  const [selectedMobileNumber, setSelectedMobileNumber] = useState("");

  const [totalPages, setTotalPages] = useState(0);
  const [showViewModal, setShowViewModal] = useState(false);
  const [allBranchs, setAllBranchs] = useState([]);
  const [allAdmins, setAllAdmins] = useState([]);

  const [filters, setFilters] = useState({
    date: "",
  });

  // wa daddy
  const [isWaDaddyWhatsappModalOpen, setIsWaDaddyWhatsappModalOpen] =
    useState(false);
  const [selectedWaDaddyWhatsappData, setSelecteWaDaddyWhatsappdData] =
    useState(null);

  const [selectedLead, setSelectedLead] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [countries, setCountries] = useState([]);

  // Date utility functions
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
    if (dateStr.includes("-")) return new Date(dateStr);
    return null;
  };

  const toISODate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Today's Birthday");

  const handleSendMessage = async (payload) => {
    try {
      const apiPayload = {
        phoneNumber: payload.mobileNumber,
        categoryId: payload.categoryId,
        customMessage: payload.customMessage,
      };
      const response = await dispatch(sendWPMessage(apiPayload));
      const whatsappUrl = response.data;
      window.open(whatsappUrl?.data, "_blank");
    } catch (error) {
      console.error("Failed to send WhatsApp message:", error);
      alert(error.message || "Failed to send WhatsApp message");
    }
  };

  useEffect(() => {
    if (showViewModal || isWhatsappModalOpen || openModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showViewModal, isWhatsappModalOpen, openModal]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showDateCalendar &&
        dateInputRef.current &&
        !dateInputRef.current.contains(event.target) &&
        dateCalenderRef.current &&
        !dateCalenderRef.current.contains(event.target)
      ) {
        setShowDateCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDateCalendar]);

  const handleView = (id) => {
    dispatch(getLeadById(id))
      .then((response) => {
        if (response?.data) {
          setGetLeadDataById(response.data);
          setShowViewModal(true);
          setOpenDropdown(null);
        } else {
          toast.error("Failed to fetch lead data");
        }
      })
      .catch((error) => {
        toast.error("Error fetching lead data");
        console.error("Error fetching lead by ID", error);
      });
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
  };

  const [getLeadData, setGetLeadData] = useState([]);
  const fetchTodaysBirthdayLeads = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    date = filters.date,
  ) => {
    try {
      const res = await dispatch(
        getTodaysBirthdayLeads(page, limit, search, date),
      );

      if (res?.status === 200) {
        setGetLeadData(res?.data?.data);
        setTotalPages(res?.data?.data?.totalPages || 0);
        setTotalRecords(res?.data?.data?.totalRecords || 0);
      }
    } catch (error) {
      console.error("Error fetching leads", error);
    }
  };
  useEffect(() => {
    if (location.state?.filters) {
      setFilters(location.state.filters);
      setSearch(location.state.search);
      setCurrentPage(location.state.currentPage);
      setItemsPerPage(location.state.itemsPerPage);
    }
  }, [location.state]);

  useEffect(() => {
    if (canRead) {
      fetchTodaysBirthdayLeads(currentPage, itemsPerPage, search, filters.date);
    }
  }, [currentPage, search, filters]);

  const [leadStatus, setLeadStatus] = useState([]);
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
  const fetchCountries = async () => {
    const res = await dispatch(countryDropdown());
    setCountries(res?.data?.data || []);
  };
  const fetchAllBranchs = async () => {
    try {
      const res = await dispatch(getAllBranch(1, 100));
      const responseData = res?.data?.data;
      setAllBranchs(responseData?.data || []);
    } catch (error) {
      console.log("Error fetching camouses:", error);
      setAllBranchs([]);
    }
  };
  const fetchAllAdmins = async () => {
    try {
      const res = await dispatch(adminGetAll(1, 100, "", "", "", true));
      const responseData = res?.data?.data;
      setAllAdmins(responseData?.data || []);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setAllAdmins([]);
    }
  };

  useEffect(() => {
    fetchLeadStatus();
    fetchCountries();
    fetchAllBranchs();
    fetchAllAdmins();
  }, []);

  const getStatusColor = (statusName) => {
    const status = leadStatus.find(
      (item) => item.name.toLowerCase() === statusName?.toLowerCase(),
    );
    return status?.color || "#ccc";
  };
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      fetchTodaysBirthdayLeads(1, newItemsPerPage, search, filters.date);
    }
  };
  const [rolesByBranch, setRolesByBranch] = useState({});
  // Helper to get branch name by ID
  const getBranchNameById = (branchId) => {
    const branch = allBranchs?.find((b) => b._id === branchId);
    return branch ? branch.name : "Head Office";
  };

  // Fetch roles for a given branch ID and cache them
  const fetchRolesForBranch = async (branchId) => {
    if (rolesByBranch[branchId || "head_office"]) {
      return rolesByBranch[branchId || "head_office"];
    }

    try {
      const res = await dispatch(getAllRoleList(branchId || "", false));
      const roleData = res?.data?.data || [];
      setRolesByBranch((prev) => ({
        ...prev,
        [branchId || "head_office"]: roleData,
      }));
      return roleData;
    } catch (error) {
      console.error("Error fetching roles for branch:", branchId, error);
      return [];
    }
  };

  const getRoleNameById = (roleId, branchId) => {
    const branchKey = branchId || "head_office";
    const roles = rolesByBranch[branchKey] || [];

    const found = roles.find((r) => r._id === roleId);
    return found ? found.name : "N/A";
  };

  useEffect(() => {
    if (getLeadData?.data?.length > 0) {
      const uniqueBranchIds = [
        ...new Set(
          getLeadData.data.map(
            (lead) => lead.lead_assign_Branch || "head_office",
          ),
        ),
      ];

      uniqueBranchIds.forEach((bId) => {
        fetchRolesForBranch(bId);
      });
    }
  }, [getLeadData]);

  const getAdminNameById = (id) => {
    const admin = allAdmins.find((a) => a._id === id);
    return admin ? admin.name : "N/A";
  };

  const leadSections = [
    {
      title: "Lead Details",
      fields: [
        { label: "Name", key: "name" },
        { label: "Email", key: "email" },
        { label: "Phone", key: "phone" },
        { label: "Country", key: "country" },
        { label: "City", key: "city" },
        { label: "Alternate Contact", key: "alternate_contact" },
        { label: "Gender", key: "gender" },
        {
          label: "Date of Birth",
          key: "dateofbirth",
          render: (data) =>
            data.dateofbirth
              ? new Date(data.dateofbirth).toLocaleDateString()
              : "N/A",
        },
        { label: "Age", key: "age" },
        { label: "Address", key: "address" },
        { label: "Nationality", key: "nationality" },
        { label: "Pincode", key: "pincode" },
        { label: "Comments", key: "comments" },
        { label: "Office Use Only", key: "office_use_only" },
      ],
    },
    {
      title: "Follow-up Details",
      fields: [
        {
          label: "Next Follow-up",
          key: "next_follow_up",
          render: (data) =>
            data.next_follow_up
              ? new Date(data.next_follow_up).toLocaleDateString()
              : "N/A",
        },
        { label: "From", key: "from" },
        { label: "To", key: "to" },
        { label: "Lead Follow-up Remark", key: "lead_followup_remark" },
        { label: "Lead Status", key: "lead_status" },
        { label: "Lead Form", key: "lead_form" },
        // { label: "Lead Assign", key: "lead_assign_name" },
        {
          label: "Lead Assign",
          key: "lead_assign",
          render: (data) => {
            const assigns = data.lead_assign || [];

            if (!assigns.length) return "N/A";

            return (
              <div>
                {assigns.map((la) => (
                  <div
                    key={la._id}
                    style={{
                      fontSize: "13px",
                      lineHeight: "1.5",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <strong>{la.role?.name || "-"}</strong>{" "}
                    <span style={{ color: "#555" }}>
                      ({la.user?.name || "-"})
                    </span>
                  </div>
                ))}
              </div>
            );
          },
        },

        // { label: "Branch Lead Assign", key: "lead_assign_Branch" },
        {
          label: "Branch Lead Assign",
          key: "lead_assign_Branch",
          render: (data) =>
            getBranchNameById?.(data.lead_assign_Branch?._id) || "N/A",
        },
      ],
    },
    {
      title: "Inquiry Info",
      fields: [
        { label: "Inquiry For", key: "inquiry_for" },
        { label: "Inquiry For Other", key: "inquiry_for_other" },
        { label: "Source of Reference", key: "source_of_reference" },
        { label: "Form Type", key: "form_type" },
      ],
    },
    {
      title: "Education & Course Info",
      fields: [
        {
          label: "Country Interested",
          key: "country_interested",
          render: (data) =>
            data.country_interested?.length > 0
              ? data.country_interested.join(", ")
              : "N/A",
        },
        { label: "Course", key: "course" },
        { label: "Level", key: "level" },
        { label: "Budget", key: "budget" },
        { label: "How Much in Bank", key: "how_much_in_bank" },
        { label: "English Proficiency", key: "english_proficiency" },
        { label: "Passport", key: "passport" },
        { label: "Intake", key: "intake" },
      ],
    },
    {
      title: "Family & Work",
      fields: [
        { label: "Father's Occupation", key: "occupation_father" },
        { label: "Mother's Occupation", key: "occupation_mother" },
        { label: "Work Experience", key: "work_experience" },
        { label: "Work Post", key: "work_post" },
        { label: "Work Year", key: "work_year" },
      ],
    },
    {
      title: "Visa Info",
      fields: [
        { label: "Visited Countries", key: "visited_countries" },
        { label: "Visit Count", key: "visit_count" },
        { label: "Visa Type", key: "visa_type" },
        {
          label: "Visa Refused",
          key: "visa_refused",
          render: (data) => (data.visa_refused ? "Yes" : "No"),
        },
        { label: "Refused Country", key: "refused_country" },
        { label: "Refused Times", key: "refused_times" },
        {
          label: "Refused Years",
          key: "refused_years",
          render: (data) =>
            data.refused_years?.length > 0
              ? data.refused_years.join(", ")
              : "N/A",
        },
        { label: "Refused Visa Type", key: "refused_visa_type" },
      ],
    },
    {
      title: "Education Evaluation",
      type: "table",
      headers: [
        "Test Name",
        "Listening",
        "Reading",
        "Writing",
        "Speaking",
        "Overall",
        "Duolingo Score",
      ],
      data: getLeadDataById?.data?.education_evaluation || [],
      renderRow: (row) => [
        row.test_name,
        row.scores?.listen,
        row.scores?.read,
        row.scores?.write,
        row.scores?.speak,
        row.scores?.overall,
        row.scores?.duolingoScore,
      ],
    },
    {
      title: "Education Details",
      type: "table",
      headers: [
        "Degree",
        "Stream",
        "MOI",
        "Year",
        "Score",
        "Institution",
        "Backlogs",
      ],
      data: getLeadDataById?.data?.education_details || [],
      renderRow: (row) => [
        row.degree,
        row.stream,
        row.moi,
        row.year,
        row.score,
        row.institution,
        row.backlogs,
      ],
    },
    {
      title: "Refer a Friend",
      fields: [
        { label: "Name", key: "refer_friend.name" },
        { label: "Phone", key: "refer_friend.phone" },
        { label: "Email", key: "refer_friend.email" },
        {
          label: "Suggested Countries",
          key: "refer_friend.suggested_countries",
        },
        { label: "Courses", key: "refer_friend.courses" },
        { label: "Response", key: "refer_friend.response" },
      ],
    },
    {
      title: "Reviews",
      fields: [
        { label: "Reception Greetings", key: "reviews.reception_greetings" },
        {
          label: "Counsellor Explanation",
          key: "reviews.counsellor_explanation",
        },
        { label: "Hospitality", key: "reviews.hospitality" },
        { label: "Hygiene & Cleanliness", key: "reviews.hygiene_cleanliness" },
        { label: "Team Response", key: "reviews.team_response" },
      ],
    },
  ];
  return (
    <>
      <Pageheader
        mainheading="Today's Birthday"
        parentfolder="Home"
        activepage="Today's Birthday"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0 mt-2">
              <div>
                {/* <div className="card-title">Today's Birthday</div> */}
              </div>
            </Card.Header>
            <Card.Body>
              {canRead && (
                <Col className="d-flex flex-wrap align-items-end justify-content-end gap-2">
                  <div className="filter-item">
                    <Form.Label>Birthday</Form.Label>
                    <div style={{ position: "relative" }}>
                      <Form.Control
                        type="text"
                        className="filter-height"
                        placeholder="dd/mm/yyyy"
                        value={
                          filters.date
                            ? formatDate(parseDate(filters.date))
                            : ""
                        }
                        readOnly
                        ref={dateInputRef}
                        onClick={() => {
                          if (filters.date) {
                            setDateValue(parseDate(filters.date));
                          }
                          setShowDateCalendar((show) => !show);
                        }}
                        style={{ cursor: "pointer", backgroundColor: "#fff" }}
                      />
                      {filters.date ? (
                        <button
                          type="button"
                          onClick={() => {
                            setFilters({ ...filters, date: "" });
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
                        <MdOutlineCalendarToday
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
                          ref={dateCalenderRef}
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
                              setFilters({
                                ...filters,
                                date: toISODate(selectedDate),
                              });
                              setShowDateCalendar(false);
                              setCurrentPage(1);
                            }}
                            value={dateValue}
                            locale="en-GB"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ms-auto">
                    <div className="contact-search3">
                      <button type="button" className="btn border-0">
                        <i
                          className="fe fe-search fw-semibold text-muted dark_theme"
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
                  <div className="custom-select-height total-records px-3 mt-2 mt-md-0 d-flex align-items-center h-6">
                    <span>
                      Total Records :<strong>&nbsp;{totalRecords}</strong>
                    </span>
                  </div>
                </Col>
              )}
              <Row className="mb-3 align-items-end justify-content-between"></Row>

              <ViewModal
                show={showViewModal}
                onHide={handleCloseViewModal}
                title="Today's Birthday Details"
                data={getLeadDataById?.data}
                fields={leadSections}
              />

              <ConvertToApplicationModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                // setIsLoading={setIsLoading}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                selectedLead={selectedLead}
                // searchTerm={searchTerm}
                filters={filters}
                setGetLeadData={setGetLeadData}
                setTotalPages={setTotalPages}
                setTotalRecords={setTotalRecords}
                fetchLeadStatus={fetchLeadStatus}
                countries={countries}
                convertPage="todaysbirthdayleads"
                fetchTodaysBirthdayLeads={fetchTodaysBirthdayLeads}
                search={search}
                canRead={canRead}
              />

              <WhatsappMessageModal
                isWhatsappModalOpen={isWhatsappModalOpen}
                closeWhatsappModal={() => setIsWhatsappModalOpen(false)}
                selectedLeadName={selectedLeadName}
                selectedMobileNumber={selectedMobileNumber}
                handleSendMessage={handleSendMessage}
              />
              <WaDaddyWhatsAppModal
                show={isWaDaddyWhatsappModalOpen}
                onClose={() => setIsWaDaddyWhatsappModalOpen(false)}
                data={selectedWaDaddyWhatsappData}
              />

              <div className="application-card-container">
                {getLeadData?.data?.length > 0 ? (
                  getLeadData?.data?.map((item, index) => (
                    <div
                      key={item._id}
                      className="application-card rounded-lg mb-4 position-relative hover-shadow"
                      style={{
                        transition: "all 0.3s ease",
                        backgroundColor: "#ffffff",
                        borderRadius: "10px",
                        boxShadow: "rgba(0, 0, 0, 0.4) 0px 2px 8px",
                        padding: "10px",
                      }}
                    >
                      {/* --- HEADER SECTION --- */}
                      <div
                        className="px-4 py-3 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3"
                        style={{ backgroundColor: "#fbfbff" }}
                      >
                        <div className="d-flex align-items-start gap-3">
                          <div>
                            <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                              {item?.leadId && (
                                <span
                                  className="badge border-0 fw-bold px-2 py-1 shadow-sm"
                                  style={{
                                    fontSize: "0.7rem",
                                    letterSpacing: "0.8px",
                                    backgroundColor: "#5d54be",
                                    color: "#ffffff",
                                    borderRadius: "4px",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {item?.leadId}
                                </span>
                              )}
                              <h5
                                className="mb-0 fw-bold"
                                style={{
                                  color: "#4B49AC",
                                  cursor: "pointer",
                                  letterSpacing: "-0.2px",
                                }}
                                onClick={() => {
                                  handleView(item?._id);
                                }}
                              >
                                {item?.name || "-"}
                              </h5>
                              {item?.isDuplicate && (
                                <span
                                  className="badge bg-danger rounded-pill px-2 py-1 shadow-sm small"
                                  style={{ fontSize: "0.65rem" }}
                                >
                                  Duplicate Lead
                                </span>
                              )}
                            </div>

                            {/* Metadata Row */}
                            {(item?.createdByName?.length > 0 ||
                              item?.updatedByName?.length > 0 ||
                              item?.created_by_type?.length > 0 ||
                              item?.b2bCompany?.length > 0) && (
                                <div className="d-flex flex-wrap gap-x-4 gap-y-1 align-items-center small mt-2">
                                  {item?.created_by_type?.length > 0 && (
                                    <div
                                      className="d-flex align-items-center me-3"
                                    // style={{ color: "#6366f1" }}
                                    >
                                      <AssignmentIndIcon
                                        className="me-1 flex-shrink-0"
                                        size={18}
                                        style={{
                                          color: "#475569"
                                        }}
                                      />
                                      <div className="text-muted small fw-medium mb-0">
                                        Type
                                      </div>
                                      &nbsp;:&nbsp;
                                      <span className="fw-semibold">
                                        {item?.created_by_type === "B2B Admin" ||
                                          item?.created_by_type === "B2B Member" ? (
                                          <>
                                            B2B Partner
                                            {item?.b2bCompany && ` (${item.branch})`}
                                          </>
                                        ) : item?.created_by_type === "user" ? (
                                          <>
                                            Head Office
                                            {item?.b2bCompany && ` (${item.branch})`}
                                          </>
                                        ) : item?.created_by_type === "Branch" ||
                                          item?.created_by_type === "branch" ? (
                                          <>
                                            Branch
                                            {item?.createdByName &&
                                              ` (${item.createdByName})`}
                                          </>
                                        ) : item?.created_by_type === "Branch User" ||
                                          item?.created_by_type === "Branch user" ? (
                                          <>
                                            Branch User
                                            {item?.branch && ` (${item.branch})`}
                                          </>
                                        ) : (
                                          item?.created_by_type
                                        )}
                                      </span>
                                    </div>
                                  )}
                                  {item?.createdByName?.length > 0 && (
                                    <div
                                      className="d-flex align-items-center me-3 border-start ps-3 d-none d-sm-flex"

                                    >
                                      <PersonIcon
                                        className="me-1 flex-shrink-0"
                                        size={18}
                                        style={{
                                          color: "#0F766E"
                                        }}
                                      />
                                      <div className="text-muted small fw-medium mb-0">
                                        Created By
                                      </div>
                                      &nbsp;:&nbsp;
                                      <span className="fw-semibold">
                                        {item?.createdByName}
                                      </span>
                                    </div>
                                  )}
                                  {item?.updatedByName?.length > 0 && (
                                    <div
                                      className="d-flex align-items-center border-start ps-3 d-none d-md-flex"

                                    >
                                      <CreateIcon
                                        className="me-1 flex-shrink-0"
                                        size={18}
                                        style={{
                                          color: "#92400E"
                                        }}
                                      />
                                      <div className="text-muted small fw-medium mb-0">
                                        Updated By
                                      </div>
                                      &nbsp;:&nbsp;
                                      <span className="fw-semibold">
                                        {item?.updatedByName}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-2 ms-auto">
                          <div className="d-flex align-items-center gap-2">
                            {(canUpdate || canCreate) && (
                              <IconButton
                                aria-label="whatsapp"
                                className="ms-1 border shadow-sm"
                                style={{
                                  backgroundColor: "#25D36615",
                                  borderColor: "#25D36630",
                                  width: "36px",
                                  height: "36px",
                                }}
                                onClick={() => {
                                  setSelectedLeadName(item?.name || "");
                                  setSelectedMobileNumber(
                                    item?.phone
                                      ? item.phone.replace(/[^\d]/g, "")
                                      : "",
                                  );
                                  setIsWhatsappModalOpen(true);
                                }}
                              >
                                <FaWhatsapp
                                  style={{ color: "#25D366", fontSize: "20px" }}
                                />
                              </IconButton>
                            )}

                            <IconButton
                              aria-label="more"
                              className="ms-1 border shadow-sm"
                              style={{
                                backgroundColor: "#5d54be34",
                                borderColor: "#5d54be34",
                                width: "36px",
                                height: "36px",
                              }}
                              onClick={(e) => {
                                setOpenDropdown(
                                  openDropdown === index ? null : index,
                                );
                                setAnchorEl(e.currentTarget);
                              }}
                            >
                              <MoreVertIcon
                                className="three-dots-icon"
                                style={{ color: "#5d54be", fontSize: "20px" }}
                              />
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
                                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                },
                              }}
                            >
                              <MenuItem
                                onClick={() => {
                                  handleView(item?._id);
                                  setOpenDropdown(null);
                                }}
                              >
                                <VisibilityIcon
                                  fontSize="small"
                                  sx={{ mr: 1 }}
                                  className="view-icon"
                                />
                                <span className="view-action-text">View</span>
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  setSelecteWaDaddyWhatsappdData({
                                    name: item?.name || "",
                                    mobile:
                                      item?.phone?.replace(/[^\d]/g, "") || "",
                                  });
                                  setIsWaDaddyWhatsappModalOpen(true);
                                  setOpenDropdown(null);
                                }}
                              >
                                <MdMessage
                                  fontSize="small"
                                  style={{ marginRight: "8px" }}
                                  className="wadaddy-icon"
                                />
                                <span className="wadaddy-action-text">
                                  Send Message
                                </span>
                              </MenuItem>
                              {(canCreate || canUpdate) &&
                                (item.lead_status === "Converted" ? (
                                  <MenuItem disabled>
                                    <FaAppStore
                                      fontSize="small"
                                      className="convert-icon"
                                      style={{ marginRight: "8px" }}
                                    />
                                    <span className="convert-action-text">
                                      Already Converted
                                    </span>
                                  </MenuItem>
                                ) : (
                                  <MenuItem
                                    onClick={() => {
                                      setOpenDropdown(null);
                                      setSelectedLead(item);
                                      setOpenModal(true);
                                    }}
                                  >
                                    <FaAppStore
                                      fontSize="small"
                                      className="convert-icon"
                                      style={{ marginRight: "8px" }}
                                    />
                                    <span className="convert-action-text">
                                      Convert to Application
                                    </span>
                                  </MenuItem>
                                ))}
                              <MenuItem
                                onClick={() => {
                                  navigate(`/lead-track/${item._id}`, {
                                    state: {
                                      from: location.pathname,
                                      filters,
                                      search,
                                      currentPage,
                                      itemsPerPage,
                                    },
                                  });
                                  setOpenDropdown(null);
                                }}
                              >
                                <FaBullseye
                                  fontSize="small"
                                  style={{ marginRight: "8px" }}
                                  className="leadtrack-icon"
                                />
                                <span className="leadtrack-action-text">
                                  History
                                </span>
                              </MenuItem>
                            </Menu>
                          </div>
                        </div>
                      </div>

                      {/* --- CONTENT SECTION --- */}
                      <div className="px-4 py-4">
                        <div className="row g-4">
                          {/* Lead Status */}
                          <div className="col-12 col-sm-6 col-lg-3">
                            <div className="d-flex align-items-start gap-2">
                              <MdDescription
                                className="mt-1 flex-shrink-0"
                                size={19}
                                color="#4285F4"
                              />
                              <div>
                                <div className="text-muted small fw-medium mb-1">
                                  Lead Status
                                </div>
                                <span
                                  className="badge border-0"
                                  style={{
                                    backgroundColor: getStatusColor(
                                      item.lead_status,
                                    ),
                                    color: "#fff",
                                    padding: "6px 14px",
                                    borderRadius: "20px",
                                    cursor: "pointer",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                  }}
                                >
                                  {item.lead_status}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Date */}
                          <div className="col-12 col-sm-6 col-lg-3">
                            <div className="d-flex align-items-start gap-2 text-gray-6">
                              <MdOutlineCalendarToday
                                className="mt-1 flex-shrink-0"
                                size={19}
                                color="#34A853"
                              />
                              <div>
                                <div className="text-muted small fw-medium mb-0">
                                  Follow-up Date
                                </div>
                                <div className="fw-semibold">
                                  {new Date(
                                    item.next_follow_up,
                                  ).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    timeZone: "UTC",
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Time */}
                          <div className="col-12 col-sm-6 col-lg-3">
                            <div className="d-flex align-items-start gap-2 text-gray-6">
                              <MdAccessTime
                                className="mt-1 flex-shrink-0"
                                size={19}
                                color="#FB8C00"
                              />
                              <div>
                                <div className="text-muted small fw-medium mb-0">
                                  Time
                                </div>
                                <div className="fw-semibold">
                                  {new Date(item.createdAt).toLocaleString(
                                    "en-GB",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    },
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Lead From */}
                          <div className="col-12 col-sm-6 col-lg-3">
                            <div className="d-flex align-items-start gap-2 text-gray-6">
                              <FaBullseye
                                className="mt-1 flex-shrink-0"
                                size={19}
                                color="#A259FF"
                              />
                              <div>
                                <div className="text-muted small fw-medium mb-0">
                                  Lead From
                                </div>
                                <div className="fw-semibold">
                                  {item?.lead_form || "N/A"}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Phone */}
                          <div className="col-12 col-sm-6 col-lg-3">
                            <div className="d-flex align-items-start gap-2 text-gray-6">
                              <MdCall
                                className="mt-1 flex-shrink-0"
                                size={19}
                                color="#4285F4"
                              />
                              <div>
                                <div className="text-muted small fw-medium mb-0">
                                  Phone
                                </div>
                                <div className="fw-semibold">
                                  {item.phone || "N/A"}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Date of Birth */}
                          <div className="col-12 col-sm-6 col-lg-3">
                            <div className="d-flex align-items-start gap-2 text-gray-6">
                              <MdOutlineCalendarToday
                                className="mt-1 flex-shrink-0"
                                size={19}
                                color="#34A853"
                              />
                              <div>
                                <div className="text-muted small fw-medium mb-0">
                                  Date of Birth
                                </div>
                                <div className="fw-semibold">
                                  {new Date(
                                    item.dateofbirth,
                                  ).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    timeZone: "UTC",
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="col-12 col-sm-6 col-lg-3">
                            <div className="d-flex align-items-start gap-2 text-gray-6">
                              <MdLocationOn
                                className="mt-1 flex-shrink-0"
                                size={19}
                                color="#EA4335"
                              />
                              <div>
                                <div className="text-muted small fw-medium mb-0">
                                  Location
                                </div>
                                <div className="fw-semibold">
                                  {item.city || "N/A"}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Branch Lead Assign */}
                          <div className="col-12 col-sm-6 col-lg-3">
                            <div className="d-flex align-items-start gap-2 text-gray-6">
                              <MdPersonOutline
                                className="mt-1 flex-shrink-0"
                                size={19}
                                color="#00796B"
                              />
                              <div>
                                <div className="text-muted small fw-medium mb-0">
                                  Branch Lead Assign
                                </div>
                                <div className="fw-semibold">
                                  {getBranchNameById(
                                    item?.lead_assign_Branch?._id,
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row g-3">
                            {/* Lead Assign */}
                            <div className="col-12 col-lg-6">
                              <div
                                className="p-3 border rounded-4 h-100"
                                style={{
                                  backgroundColor: "#ffffff",
                                  border: "0.25px solid #e5e7eb",
                                  boxShadow:
                                    "rgba(0, 0, 0, 0.05) 0px 6px 24px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
                                }}
                              >
                                {/* Header */}
                                <div className="d-flex align-items-center gap-2 mb-3">
                                  <div
                                    className="d-flex align-items-center justify-content-center rounded-circle"
                                    style={{
                                      width: "36px",
                                      height: "36px",
                                      backgroundColor: "#ffedd5",
                                      border: "1px solid #fed7aa",
                                    }}
                                  >
                                    <MdVerifiedUser
                                      size={18}
                                      style={{ color: "#f59e0b" }}
                                    />
                                  </div>

                                  <div
                                    className="fw-semibold text-uppercase"
                                    style={{
                                      fontSize: "0.75rem",
                                      letterSpacing: "0.08em",
                                      color: "#0f172a",
                                    }}
                                  >
                                    Lead Assign
                                  </div>
                                </div>

                                {/* Content */}
                                {item?.lead_assign?.length > 0 ? (
                                  <div className="d-flex flex-wrap gap-2">
                                    {item.lead_assign.map((assign, idx) => {
                                      const theme =
                                        badgeThemes[idx % badgeThemes.length];
                                      return (
                                        <div
                                          key={assign?._id || idx}
                                          className="d-inline-flex align-items-center gap-1 px-3 py-2 rounded-pill border"
                                          style={{
                                            backgroundColor: theme.bg,
                                            borderColor: theme.border,
                                            fontSize: "0.85rem",
                                          }}
                                        >
                                          <span
                                            className="fw-medium"
                                            style={{ color: theme.role }}
                                          >
                                            {assign?.role?.name}
                                          </span>
                                          <span style={{ opacity: 0.5 }}>
                                            •
                                          </span>
                                          <span
                                            className="fw-semibold"
                                            style={{ color: theme.user }}
                                          >
                                            {assign?.user?.name || "Unassigned"}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="small fst-italic text-muted">
                                    No active assignments available.
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Remark */}
                            <div className="col-12 col-lg-6">
                              <div
                                className="p-3 rounded-4 h-100"
                                style={{
                                  backgroundColor: "#f8fafc",
                                  border: "0.25px solid #e5e7eb",
                                  boxShadow:
                                    "rgba(0, 0, 0, 0.04) 0px 6px 20px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
                                }}
                              >
                                {/* Header */}
                                <div className="d-flex align-items-center gap-2 mb-2">
                                  <MdChatBubble
                                    className="text-secondary"
                                    size={16}
                                    style={{ opacity: 0.7 }}
                                  />
                                  <span
                                    className="text-uppercase fw-bold text-muted small"
                                    style={{
                                      letterSpacing: "1px",
                                      fontSize: "0.65rem",
                                    }}
                                  >
                                    {" "}
                                    Remark{" "}
                                  </span>
                                </div>

                                {/* Content */}
                                <div
                                  style={{
                                    fontSize: "0.9rem",
                                    lineHeight: "1.6",
                                    color: "#1f2937",
                                  }}
                                >
                                  {item?.remarks ||
                                    "No additional remarks available."}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-6-600 py-5">
                    {!canRead
                      ? "You do not have permission to view this Data"
                      : "No data available"}
                  </div>
                )}
              </div>

              {totalPages > 1 && getLeadData?.data?.length > 0 && (
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

export default TodaysBirthdayLeads;
