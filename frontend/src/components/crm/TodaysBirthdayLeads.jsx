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
                <div className="card-title">Today's Birthday</div>
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
                      className="application-card bg-white border border-gray-200 rounded-lg px-4 pt-2 shadow-sm mb-3 rounded"
                    >
                      <div className="application-card-1 mb-3">
                        <div className="left-part mb-2">
                          <div className="d-flex gap-3 align-items-center">
                            <div
                              className="left-part-1"
                              style={{
                                textTransform: "capitalize",
                              }}
                            >
                              {item?.name || "-"}
                            </div>
                            {item?.isDuplicate && (
                              <div
                                className={
                                  item?.isDuplicate ? "duplicate-warning" : ""
                                }
                              >
                                Duplicate Lead
                              </div>
                            )}
                          </div>
                          {(item?.createdByName?.length > 0 ||
                            item?.updatedByName?.length > 0 ||
                            item?.created_by_type?.length > 0 ||
                            item?.b2bCompany?.length > 0) && (
                            <div className="left-part-2 bg-light border-top rounded">
                              {item?.created_by_type?.length > 0 && (
                                <div>
                                  <span className="left-span text-gray-6 d-flex justify-content-end align-items-center">
                                    <AssignmentIndIcon className="me-1 left-icon" />
                                    <strong>Type</strong>&nbsp;:&nbsp;
                                    {item?.created_by_type === "B2B Admin" ||
                                    item?.created_by_type === "B2B Member" ? (
                                      <>
                                        B2B Partner
                                        {item?.b2bCompany &&
                                          ` (${item.b2bCompany})`}
                                      </>
                                    ) : item?.created_by_type === "user" ? (
                                      <>
                                        Head Office
                                        {item?.b2bCompany &&
                                          ` (${item.b2bCompany})`}
                                      </>
                                    ) : item?.created_by_type ===
                                        "Branch Member" ||
                                      item?.created_by_type ===
                                        "Branch member" ? (
                                      <>
                                        Branch Member
                                        {item?.branch && ` (${item.branch})`}
                                      </>
                                    ) : (
                                      item?.created_by_type
                                    )}
                                  </span>
                                </div>
                              )}
                              {item?.createdByName?.length > 0 && (
                                <div className="me-3">
                                  <span className="left-span text-gray-6 d-flex align-items-center">
                                    <PersonIcon className="me-1 left-icon" />
                                    <strong>Created By</strong>&nbsp;:&nbsp;
                                    {item?.createdByName}
                                  </span>
                                </div>
                              )}
                              {item?.updatedByName?.length > 0 && (
                                <div className="me-3">
                                  <span className="left-span text-gray-6 d-flex justify-content-center align-items-center">
                                    <CreateIcon className="me-1 left-icon" />
                                    <strong>Updated By</strong>
                                    <strong>&nbsp;:&nbsp;</strong>
                                    <span>{item?.updatedByName}</span>
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="right-part d-flex align-items-center">
                          {(canUpdate || canCreate) && (
                            <FaWhatsapp
                              size={26}
                              style={{
                                color: "#25D366",
                                cursor: "pointer",
                                marginRight: "10px",
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
                            />
                          )}
                          <div className="d-flex">
                            <IconButton
                              aria-label="more"
                              aria-controls={`menu-${index}`}
                              aria-haspopup="true"
                              onClick={(e) => {
                                setOpenDropdown(
                                  openDropdown === index ? null : index,
                                );
                                setAnchorEl(e.currentTarget);
                              }}
                            >
                              <MoreVertIcon className="three-dots-icon" />
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
                              style={{ marginLeft: "-15px" }}
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

                      <div className="row">
                        <div className="col-12 col-md-4">
                          <p className="text-gray-6">
                            <MdDescription
                              className="me-2"
                              size={19}
                              color="#4285F4"
                            />
                            <strong>Lead Status : </strong>
                            <span
                              className="lead-status"
                              style={{
                                backgroundColor: getStatusColor(
                                  item.lead_status,
                                ),
                                color: "#fff",
                                padding: "2px 8px",
                                borderRadius: "12px",
                                cursor: "pointer",
                              }}
                            >
                              {item.lead_status}
                            </span>
                          </p>
                        </div>
                        <div className="col-12 col-md-4">
                          <p className="text-gray-6">
                            <MdOutlineCalendarToday
                              className="me-2"
                              size={19}
                              color="#34A853"
                            />
                            <strong>Date : </strong>
                            {new Date(item.next_follow_up).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                timeZone: "UTC",
                              },
                            )}
                          </p>
                        </div>
                        <div className="col-12 col-md-4">
                          <p className="text-gray-6">
                            <MdAccessTime
                              className="me-2"
                              size={19}
                              color="#FB8C00"
                            />
                            <strong>Time : </strong>
                            {new Date(item.createdAt).toLocaleString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </p>
                        </div>
                        <div className="col-12 col-md-4">
                          <p className="text-gray-6">
                            <FaBullseye
                              className="me-2"
                              size={19}
                              color="#A259FF"
                            />
                            <strong>Lead From : </strong>
                            {item?.lead_form || "N/A"}
                          </p>
                        </div>
                        <div className="col-12 col-md-4">
                          <p className="text-gray-6">
                            <MdCall
                              className="me-2"
                              size={19}
                              color="#4285F4"
                            />
                            <strong>Phone : </strong>
                            {item.phone || "N/A"}
                          </p>
                        </div>{" "}
                        <div className="col-12 col-md-4">
                          <p className="text-gray-6">
                            <MdOutlineCalendarToday
                              className="me-2"
                              size={19}
                              color="#34A853"
                            />
                            <strong>Date of Birth : </strong>
                            {new Date(item.dateofbirth).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                timeZone: "UTC",
                              },
                            )}
                          </p>
                        </div>
                        <div className="col-12 col-md-4">
                          <p className="text-gray-6">
                            <MdLocationOn
                              className="me-2"
                              size={19}
                              color="#EA4335"
                            />
                            <strong>Location : </strong>
                            {item.city || "N/A"}
                          </p>
                        </div>
                        <div className="col-12 col-md-4">
                          <p className="text-gray-6">
                            <MdPersonOutline
                              className="me-2"
                              size={19}
                              color="#00796B"
                            />
                            <strong>Branch Lead Assign : </strong>
                            {getBranchNameById(item?.lead_assign_Branch?._id)}
                          </p>
                        </div>
                        <div className="col-12 col-md-4">
                          <div>
                            <div className="d-flex align-items-center mb-1 text-gray-6">
                              <MdVerifiedUser
                                className="me-2 text-warning"
                                size={18}
                              />
                              <strong>Lead Assign :</strong>
                            </div>

                            {item?.lead_assign?.length > 0 ? (
                              <ul className="mb-0 ps-4">
                                {item.lead_assign.map((assign, index) => (
                                  <li
                                    key={assign?._id || index}
                                    className="mb-1"
                                    style={{ lineHeight: "1.4" }}
                                  >
                                    <span className="me-1">
                                      {assign?.role?.name}
                                    </span>
                                    <span>
                                      {assign?.user?.name
                                        ? `(${assign?.user?.name})`
                                        : ""}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-muted ps-4">N/A</span>
                            )}
                          </div>
                        </div>
                        <div className="col-12 col-md-4">
                          <p className="text-gray-6">
                            <MdChatBubble
                              className="me-2"
                              size={19}
                              color="#6C757D"
                            />
                            <strong>Remark : </strong>
                            {item?.remarks || "N/A"}
                          </p>
                        </div>
                        {/* <div className="col-12 col-md-4">
                          <p className="text-gray-6">
                            <MdPersonOutline
                              className="me-2"
                              size={19}
                              color="#00796B"
                            />
                            <strong>Created By : </strong>
                            {item?.createdByName ? item?.createdByName : "N/A"}
                          </p>
                        </div>
                        <div className="col-12 col-md-4">
                          <p className="text-gray-6">
                            <MdVerifiedUser
                              className="me-2"
                              size={19}
                              color="#6D4C41"
                            />
                            <strong>Created type : </strong>
                            {item?.created_by_type
                              ? item?.created_by_type
                              : "N/A"}
                          </p>
                        </div>
                        <div className="col-12 col-md-4">
                          <p className="text-gray-6">
                            <MdEditNote
                              className="me-2"
                              size={19}
                              color="#2A48A0"
                            />
                            <strong>Updated By : </strong>
                            {item?.updatedByName ? item?.updatedByName : "N/A"}
                          </p>
                        </div> */}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-6-600">
                    {!canRead
                      ? "You do not have permission to view this Data"
                      : "No data available"}
                  </div>
                )}
              </div>

              {totalPages > 1 && getLeadData?.data?.length > 0 && (
                <Paginations
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default TodaysBirthdayLeads;
