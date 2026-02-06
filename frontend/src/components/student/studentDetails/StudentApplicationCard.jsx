import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import CreateIcon from "@mui/icons-material/Create";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { RiChatSmile2Fill } from "react-icons/ri";
import { decryptData } from "../../../utils/encryptionUtils";
import { FaAppStore, FaBullseye, FaWhatsapp } from "react-icons/fa";
import {
  MdDescription,
  MdEvent,
  MdOutlineCalendarToday,
  MdPublic,
  MdSchool,
  MdVerifiedUser,
  MdLocationOn,
  MdFace,
  MdCake,
  MdCall,
  MdOutlinePlayCircleFilled,
  MdQuestionAnswer,
  MdMessage,
} from "react-icons/md";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import ConvertToCoaching from "./ConvertToCoaching";
import getSymbolFromCurrency from "currency-symbol-map";
import { addCtcCalling } from "../../../redux/actions/Lead.action";
import { toast } from "react-toastify";

const StudentApplicationCard = ({
  allStudentApplication,
  canRead,
  canUpdate,
  canDelete,
  canCreate,
  formatDate,
  parseDate,
  handleChatOpen,
  setSelecteWaDaddyWhatsappdData,
  setIsWaDaddyWhatsappModalOpen,
  setSelectedLeadName,
  setSelectedMobileNumber,
  setIsWhatsappModalOpen,
  handleEdit,
  interestedCourseStatus,
  setSelectedItem,
  setShowDeleteModal,
  selectedBranch,
  mainStatus,
  search,
  currentPage,
  itemsPerPage,
  showAll,
  selectedCountry,
  followUpDate,
  selectedB2BAdmin,
  updatedOnDate,
  selectedRole,
  selectedUser,
  startDate,
  endDate,
  setCloneModalOpen,
  setSelectedStudent,
  setIsLoading,
  dispatch,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showFollowUps, setShowFollowUps] = useState({});
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedStudentForCoaching, setSelectedStudentForCoaching] =
    useState(null);
  const userRole = decryptData(localStorage.getItem("role"));
  const storedEncryptedCurrency = decryptData(
    localStorage.getItem("crmCurrency"),
  );

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

  const getColors = (name) => {
    const index =
      [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      tagColors.length;
    return tagColors[index];
  };

  const tagColors = [
    { bg: "#D1FAE5", text: "#047857" }, // green
    { bg: "#DBEAFE", text: "#1D4ED8" }, // blue
    { bg: "#EDE9FE", text: "#6D28D9" }, // purple
    { bg: "#FEF3C7", text: "#B45309" }, // yellow
    { bg: "#F5D0FE", text: "#A21CAF" }, // pink
    { bg: "#C7D2FE", text: "#3730A3" }, // indigo
  ];

  const handleConvertToCoaching = (item) => {
    setSelectedStudentForCoaching(item);
    setShowConvertModal(true);
    setOpenDropdown(null);
  };
  const getNearestDocumentDeadline = (uploadedDocumentDetails = []) => {
    const validDocs = uploadedDocumentDetails
      .filter((doc) => doc?.deadline)
      .map((doc) => ({
        deadline: new Date(doc.deadline),
        resolvedDocumentName: doc.resolvedDocumentName || "N/A",
      }))
      .sort((a, b) => a.deadline - b.deadline);

    return validDocs.length > 0 ? validDocs[0] : null;
  };

  return (
    <>
      <div className="application-card-container">
        {allStudentApplication?.length > 0 ? (
          allStudentApplication.map((item, index) => {
            const nearestDeadline = getNearestDocumentDeadline(
              item?.uploadedDocumentDetails || [],
            );

            return (
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
                          {item?.studentId || "N/A"}
                        </span>
                        <h5
                          className="mb-0 fw-bold"
                          style={{
                            color: "#4B49AC",
                            cursor: "pointer",
                            letterSpacing: "-0.2px",
                          }}
                          onClick={() =>
                            navigate(`/student-details/${item._id}`, {
                              state: {
                                selectedBranch,
                                mainStatus,
                                search,
                                currentPage,
                                itemsPerPage,
                                showAll,
                                selectedCountry,
                                followUpDate,
                                selectedB2BAdmin,
                                updatedOnDate,
                                selectedRole,
                                selectedUser,
                                startDate,
                                endDate,
                              },
                            })
                          }
                        >
                          {item?.name || "-"}
                        </h5>
                        {item?.otherCountriesApplied &&
                          item?.otherCountriesApplied?.length > 0 && (
                            <div className="d-flex flex-wrap gap-1 ms-2">
                              {item.otherCountriesApplied.map((c) => (
                                <span
                                  key={c._id}
                                  className="badge rounded-pill"
                                  style={{
                                    backgroundColor: "#053880",
                                    color: "#fff",
                                    fontSize: "0.7rem",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    navigate(`/student-details/${c._id}`)
                                  }
                                >
                                  {c.country}
                                </span>
                              ))}
                            </div>
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
                    {item?.dueAmount > 0 && (
                      <div className="px-3 py-1 bg-danger bg-opacity-10 border border-danger rounded-pill me-2">
                        <span className="text-danger fw-bold small">
                          <i className="bi bi-exclamation-circle me-1"></i>
                          Receivable:{" "}
                          {storedEncryptedCurrency
                            ? getSymbolFromCurrency(storedEncryptedCurrency)
                            : "₹"}{" "}
                          {Math.floor(item?.dueAmount)}
                        </span>
                      </div>
                    )}

                    <div className="d-flex align-items-center gap-2">
                      {userRole !== "B2B Admin" &&
                        userRole !== "B2B Member" &&
                        item?.CTCCallRecording && (
                          <IconButton
                            className="ms-1 border shadow-sm"
                            style={{
                              backgroundColor: "#e0f2fe",
                              borderColor: "#bae6fd",
                              width: "36px",
                              height: "36px",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(item?.CTCCallRecording, "_blank");
                            }}
                          >
                            <MdOutlinePlayCircleFilled
                              style={{ color: "#0369a1", fontSize: "20px" }}
                            />
                          </IconButton>
                        )}
                      {userRole !== "B2B Admin" &&
                        userRole !== "B2B Member" && (
                          <IconButton
                            className="ms-1 border shadow-sm"
                            style={{
                              backgroundColor: "#15803c36",
                              color: "#15803c3a",
                              cursor: "pointer",
                              width: "36px",
                              height: "36px",
                            }}
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                setIsLoading(true);
                                const payload = { entityType: "student" };
                                await dispatch(
                                  addCtcCalling(item?._id, payload),
                                );
                                toast.success("CTC calling initiated");
                              } catch (error) {
                                toast.error(
                                  error?.response?.data?.message ||
                                  "Failed to initiate CTC call",
                                );
                              } finally {
                                setIsLoading(false);
                              }
                            }}
                          >
                            <MdCall
                              style={{ color: "#15803d", fontSize: "20px" }}
                            />
                          </IconButton>
                        )}

                      <IconButton
                        className="ms-1 border shadow-sm"
                        style={{
                          backgroundColor: "#007bff33",
                          borderColor: "#007bff33",
                          cursor: "pointer",
                          width: "36px",
                          height: "36px",
                        }}
                        onClick={() => handleChatOpen(item)}
                      >
                        <RiChatSmile2Fill
                          style={{ color: "#007bff", fontSize: "20px" }}
                        />
                      </IconButton>

                      {(canUpdate || canCreate) &&
                        userRole !== "B2B Admin" &&
                        userRole !== "B2B Member" && (
                          <>
                            <IconButton
                              className="ms-1 border shadow-sm"
                              style={{
                                backgroundColor: "#f9741634",
                                borderColor: "#f9741634",
                                cursor: "pointer",
                                width: "36px",
                                height: "36px",
                              }}
                              onClick={() => {
                                setSelecteWaDaddyWhatsappdData({
                                  name: item?.name || "",
                                  mobile:
                                    item?.contact?.replace(/[^\d]/g, "") || "",
                                });
                                setIsWaDaddyWhatsappModalOpen(true);
                              }}
                            >
                              <MdMessage
                                style={{ color: "#f97316", fontSize: "20px" }}
                              />
                            </IconButton>

                            <IconButton
                              className="ms-1 border shadow-sm"
                              style={{
                                cursor: "pointer",
                                backgroundColor: "#dcfce7",
                                borderColor: "#22c55e40",
                                width: "36px",
                                height: "36px",
                              }}
                              onClick={() => {
                                setSelectedLeadName(item?.name || "");
                                userRole === "Super Admin"
                                  ? setSelectedMobileNumber(
                                    item?.b2bContact
                                      ? item.b2bContact.replace(/[^\d]/g, "")
                                      : item.contact.replace(/[^\d]/g, ""),
                                  )
                                  : setSelectedMobileNumber(
                                    item?.contact
                                      ? item.contact.replace(/[^\d]/g, "")
                                      : "",
                                  );
                                setIsWhatsappModalOpen(true);
                              }}
                            >
                              <FaWhatsapp
                                style={{ color: "#22c55e", fontSize: "20px" }}
                              />
                            </IconButton>
                          </>
                        )}

                      <IconButton
                        aria-label="more"
                        className="ms-1 border shadow-sm"
                        style={{
                          backgroundColor: "#5d54be34",
                          borderColor: "#5d54be34",
                          cursor: "pointer",
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
                        <MoreVertIcon className="three-dots-icon" style={{ color: "#5d54be", fontSize: "20px" }} />
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
                        {canUpdate &&
                          userRole !== "Student" &&
                          userRole !== "LeadStudent" && (
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
                              <span className="edit-action-text">Edit</span>
                            </MenuItem>
                          )}
                        {canDelete &&
                          userRole !== "Student" &&
                          userRole !== "LeadStudent" && (
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
                              <span className="delete-action-text">Delete</span>
                            </MenuItem>
                          )}
                        {(canRead || userRole === "LeadStudent") && (
                          <MenuItem
                            onClick={() => {
                              navigate(`/student-details/${item._id}`, {
                                state: {
                                  selectedBranch,
                                  mainStatus,
                                  search,
                                  currentPage,
                                  itemsPerPage,
                                  showAll,
                                  selectedCountry,
                                  followUpDate,
                                  selectedB2BAdmin,
                                  updatedOnDate,
                                  selectedRole,
                                  selectedUser,
                                  startDate,
                                  endDate,
                                },
                              });
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
                        )}
                        {(canCreate || canUpdate) &&
                          userRole !== "Student" &&
                          userRole !== "LeadStudent" &&
                          item?.interestedCourseDetails?.length > 0 && (
                            <MenuItem
                              onClick={() => {
                                setCloneModalOpen(true);
                                setSelectedStudent(item);
                                setOpenDropdown(null);
                              }}
                            >
                              <FaAppStore
                                fontSize="small"
                                className="convert-icon"
                                style={{ marginRight: "8px" }}
                              />
                              <span className="convert-action-text">Clone</span>
                            </MenuItem>
                          )}
                        {userRole !== "Student" &&
                          userRole !== "LeadStudent" &&
                          userRole !== "B2B Admin" &&
                          userRole !== "B2B Member" && (
                            <MenuItem
                              key="converttocoaching"
                              onClick={() => handleConvertToCoaching(item)}
                            >
                              <AutorenewIcon
                                fontSize="small"
                                sx={{ mr: 1 }}
                                className="coaching-icon"
                              />
                              <span className="coaching-action-text">
                                Convert to Coaching
                              </span>
                            </MenuItem>
                          )}
                        {userRole !== "Student" &&
                          userRole !== "LeadStudent" && (
                            <MenuItem
                              onClick={() => {
                                navigate(`/lead-track/${item._id}`, {
                                  state: {
                                    from: location.pathname,
                                    selectedBranch,
                                    mainStatus,
                                    search,
                                    currentPage,
                                    itemsPerPage,
                                    showAll,
                                    selectedCountry,
                                    followUpDate,
                                    selectedB2BAdmin,
                                    updatedOnDate,
                                    selectedRole,
                                    selectedUser,
                                    startDate,
                                    endDate,
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
                          )}
                      </Menu>
                    </div>
                  </div>
                </div>

                {/* --- CONTENT SECTION --- */}
                <div className="px-4 py-4">
                  <div className="row g-4">
                    {/* Status */}
                    <div className="col-12 col-sm-6 col-lg-3">
                      <div className="d-flex align-items-start gap-2">
                        <MdDescription
                          className="mt-1 flex-shrink-0"
                          size={19}
                          color="#4285F4"
                        />
                        <div>
                          <div className="text-muted small fw-medium mb-1">
                            Status
                          </div>
                          <span
                            className="badge border-0"
                            style={{
                              backgroundColor:
                                item?.mainStatus?.color || "#09D345",
                              color: "#fff",
                              padding: "6px 14px",
                              borderRadius: "20px",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            }}
                          >
                            {item?.mainStatus?.name || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Visa Status */}
                    {item?.visaApplicationDetails?.status && (
                      <div className="col-12 col-sm-6 col-lg-3">
                        <div className="d-flex align-items-start gap-2">
                          <MdVerifiedUser
                            className="mt-1 flex-shrink-0"
                            size={19}
                            color="#4DB6AC"
                          />
                          <div>
                            <div className="text-muted small fw-medium mb-1">
                              Visa Status
                            </div>
                            <span
                              className="badge border-0"
                              style={{
                                backgroundColor: "#4DB6AC",
                                color: "#fff",
                                padding: "6px 14px",
                                borderRadius: "20px",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                              }}
                            >
                              {item.visaApplicationDetails.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Email */}
                    <div className="col-12 col-sm-6 col-lg-3">
                      <div className="d-flex align-items-start gap-2 text-gray-6">
                        <EmailIcon
                          className="mt-1 flex-shrink-0"
                          style={{ fontSize: "19px", color: "#EA4335" }}
                        />
                        <div style={{ wordBreak: "break-all" }}>
                          <div className="text-muted small fw-medium mb-0">
                            Email
                          </div>
                          <div className="fw-semibold">
                            {item?.email || "-"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Phone */}
                    {userRole === "Super Admin" &&
                      ((item?.b2bContact && item.b2bContact !== "na") ||
                        (item?.contact && item.contact !== "na")) && (
                        <div className="col-12 col-sm-6 col-lg-3">
                          <div className="d-flex align-items-start gap-2 text-gray-6">
                            <PhoneIcon
                              className="mt-1 flex-shrink-0"
                              style={{ fontSize: "19px", color: "#34A853" }}
                            />
                            <div>
                              <div className="text-muted small fw-medium mb-0">
                                Phone
                              </div>
                              <div className="fw-semibold">
                                {userRole === "Super Admin"
                                  ? item?.b2bContact || item?.contact
                                  : item?.contact || "-"}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Created Date */}
                    <div className="col-12 col-sm-6 col-lg-3">
                      <div className="d-flex align-items-start gap-2 text-gray-6">
                        <MdOutlineCalendarToday
                          className="mt-1 flex-shrink-0"
                          size={19}
                          color="#34A853"
                        />
                        <div>
                          <div className="text-muted small fw-medium mb-0">
                            Created Date
                          </div>
                          <div className="fw-semibold">
                            {new Date(item?.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                timeZone: "UTC",
                              },
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DOB */}
                    {item?.DOB?.length > 0 && (
                      <div className="col-12 col-sm-6 col-lg-3">
                        <div className="d-flex align-items-start gap-2 text-gray-6">
                          <MdCake
                            className="mt-1 flex-shrink-0"
                            size={19}
                            color="#FB8C00"
                          />
                          <div>
                            <div className="text-muted small fw-medium mb-0">
                              DOB
                            </div>
                            <div className="fw-semibold">
                              {formatDate(parseDate(item.DOB))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Gender */}
                    {item?.gender?.length > 0 && (
                      <div className="col-12 col-sm-6 col-lg-3">
                        <div className="d-flex align-items-start gap-2 text-gray-6">
                          <MdFace
                            className="mt-1 flex-shrink-0"
                            size={19}
                            color="#6C757D"
                          />
                          <div>
                            <div className="text-muted small fw-medium mb-0">
                              Gender
                            </div>
                            <div className="fw-semibold">{item?.gender}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    {(item?.city || item?.state || item?.country) && (
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
                              {[item?.city, item?.state, item?.country]
                                .filter(Boolean)
                                .join(", ")}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Inquiry For */}
                    {item?.purposeDetails?.inquiryFor?.name?.length > 0 && (
                      <div className="col-12 col-sm-6 col-lg-3">
                        <div className="d-flex align-items-start gap-2 text-gray-6">
                          <MdQuestionAnswer
                            className="mt-1 flex-shrink-0"
                            size={19}
                            color="#2A48A0"
                          />
                          <div>
                            <div className="text-muted small fw-medium mb-0">
                              Inquiry For
                            </div>
                            <div className="fw-semibold">
                              {item?.purposeDetails?.inquiryFor?.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Preferred Country */}
                    {item?.purposeDetails?.preferredCountry?.length > 0 && (
                      <div className="col-12 col-sm-6 col-lg-3">
                        <div className="d-flex align-items-start gap-2 text-gray-6">
                          <MdPublic
                            className="mt-1 flex-shrink-0"
                            size={19}
                            color="#6D4C41"
                          />
                          <div>
                            <div className="text-muted small fw-medium mb-0">
                              Preferred Country
                            </div>
                            <div className="d-flex flex-wrap gap-1 mt-1">
                              {item.purposeDetails.preferredCountry.map(
                                (country, idx) => {
                                  const { bg, text } = getColors(
                                    country || "N/A",
                                  );
                                  return (
                                    <span
                                      key={idx}
                                      className="px-2 py-0.5 rounded fw-medium"
                                      style={{
                                        backgroundColor: bg,
                                        color: text,
                                        fontSize: "11px",
                                      }}
                                    >
                                      {country}
                                    </span>
                                  );
                                },
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Intake Year */}
                    {item?.purposeDetails?.intakeYear?.length > 0 && (
                      <div className="col-12 col-sm-6 col-lg-3">
                        <div className="d-flex align-items-start gap-2 text-gray-6">
                          <MdEvent
                            className="mt-1 flex-shrink-0"
                            size={19}
                            color="#00796B"
                          />
                          <div>
                            <div className="text-muted small fw-medium mb-0">
                              Intake Year
                            </div>
                            <div className="fw-semibold">
                              {item.purposeDetails.intakeYear.join(", ")}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Allocation Section */}
                    {(item?.userAllocationDetails?.length > 0 ||
                      item?.visaAllocationDetails?.length > 0) && (
                        <div className="col-12">
                          <div
                            className="p-3 rounded-lg border-0 shadow-sm"
                            style={{
                              background:
                                "linear-gradient(145deg, #f8faff 0%, #f0f4ff 100%)",
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            <div className="d-flex align-items-center gap-2 mb-3">
                              <AssignmentIndIcon
                                style={{ color: "#4f46e5", fontSize: "20px" }}
                              />
                              <h6
                                className="mb-0 fw-bold text-dark"
                                style={{ fontSize: "0.9rem" }}
                              >
                                Allocations
                              </h6>
                            </div>
                            <div className="d-flex flex-wrap gap-3">
                              {item?.userAllocationDetails?.map((alloc, idx) => {
                                const theme =
                                  badgeThemes[idx % badgeThemes.length];
                                return (
                                  <div
                                    key={idx}
                                    className="d-flex flex-column p-2 rounded border shadow-sm"
                                    style={{
                                      backgroundColor: theme.bg,
                                      borderColor: theme.border,
                                      minWidth: "140px",
                                    }}
                                  >
                                    <span
                                      className="small fw-bold mb-1"
                                      style={{
                                        color: theme.role,
                                        fontSize: "0.7rem",
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      {alloc?.role?.name || "N/A"}
                                    </span>
                                    <span
                                      className="fw-bold"
                                      style={{
                                        color: theme.user,
                                        fontSize: "0.85rem",
                                      }}
                                    >
                                      {alloc?.user?.name || "N/A"}
                                    </span>
                                  </div>
                                );
                              })}
                              {item?.visaAllocationDetails?.map((alloc, idx) => {
                                const theme =
                                  badgeThemes[
                                  (idx +
                                    (item?.userAllocationDetails?.length ||
                                      0)) %
                                  badgeThemes.length
                                  ];
                                return (
                                  <div
                                    key={`visa-${idx}`}
                                    className="d-flex flex-column p-2 rounded border shadow-sm"
                                    style={{
                                      backgroundColor: theme.bg,
                                      borderColor: theme.border,
                                      minWidth: "140px",
                                    }}
                                  >
                                    <span
                                      className="small fw-bold mb-1"
                                      style={{
                                        color: theme.role,
                                        fontSize: "0.7rem",
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      Visa: {alloc?.role?.name || "N/A"}
                                    </span>
                                    <span
                                      className="fw-bold"
                                      style={{
                                        color: theme.user,
                                        fontSize: "0.85rem",
                                      }}
                                    >
                                      {alloc?.user?.name || "N/A"}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Courses/Institutes */}
                    {item?.interestedCourseDetails?.length > 0 && (
                      <div className="col-12 mt-3">
                        <div className="d-flex flex-column gap-3">
                          {item.interestedCourseDetails.map((course, idx) => {
                            const statusObj = interestedCourseStatus.find(
                              (s) => s?.name === course?.status,
                            );
                            return (
                              <div
                                key={idx}
                                className="d-flex align-items-center gap-3 p-2 rounded bg-light border-start border-4 border-primary"
                              >
                                <div className="p-2 bg-white rounded shadow-sm">
                                  <MdSchool size={20} color="#0288D1" />
                                </div>
                                <div className="flex-grow-1">
                                  <div
                                    className="fw-bold text-dark"
                                    style={{ fontSize: "0.9rem" }}
                                  >
                                    {course?.course?.programName || "N/A"}
                                  </div>
                                  <div className="text-muted small">
                                    {course?.institute?.instituteName} -{" "}
                                    {course?.campus?.campus}
                                  </div>
                                </div>
                                <span
                                  className="badge"
                                  style={{
                                    backgroundColor:
                                      statusObj?.color || "#5d54be",
                                    fontSize: "0.7rem",
                                    padding: "6px 12px",
                                    borderRadius: "12px",
                                  }}
                                >
                                  {course?.status || "New"}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Follow Up Checkbox */}
                    {userRole !== "Student" && userRole !== "LeadStudent" && (
                      <div className="col-12 mt-3">
                        <div className="d-flex align-items-center gap-2 p-2 bg-light rounded border border-dashed">
                          <Form.Check
                            type="checkbox"
                            label={
                              <span className="fw-semibold small">
                                Show Follow Up Records
                              </span>
                            }
                            id={`followup-checkbox-${index}`}
                            className="custom-checkbox cursor-pointer mb-0"
                            checked={showFollowUps[index] || false}
                            onChange={() => {
                              setShowFollowUps((prev) => ({
                                ...prev,
                                [index]: !prev[index],
                              }));
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Follow Ups Display */}
                    {showFollowUps[index] && item?.followUps && (
                      <div className="col-12 mt-3">
                        <div className="row g-3">
                          {Object.entries(item.followUps).map(
                            ([key, followup]) => {
                              const title = key
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase());
                              const statusColors = {
                                Pending: "#F4B400",
                                Processing: "#1E88E5",
                                Closed: "#43A047",
                              };

                              return (
                                <div
                                  className="col-12 col-md-6"
                                  key={followup._id}
                                >
                                  <div
                                    className="p-3 border rounded shadow-sm h-100 bg-white"
                                    style={{
                                      borderLeft: `4px solid ${statusColors[followup?.status] || "#9E9E9E"}`,
                                    }}
                                  >
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                      <h6
                                        className="mb-0 fw-bold"
                                        style={{ fontSize: "0.85rem" }}
                                      >
                                        {title}
                                      </h6>
                                      <span
                                        className="badge"
                                        style={{
                                          backgroundColor:
                                            statusColors[followup?.status] ||
                                            "#9E9E9E",
                                          fontSize: "0.65rem",
                                        }}
                                      >
                                        {followup?.status || "-"}
                                      </span>
                                    </div>
                                    <div className="small text-muted">
                                      <div className="mb-1">
                                        <strong>Next:</strong>{" "}
                                        {followup?.nextFollowUpDate
                                          ? formatDate(
                                            parseDate(
                                              followup.nextFollowUpDate,
                                            ),
                                          )
                                          : "-"}
                                      </div>
                                      <div className="mb-1">
                                        <strong>Remarks:</strong>{" "}
                                        {followup?.remarks || "-"}
                                      </div>
                                      {followup?.updatedByName && (
                                        <div>
                                          <strong>Updated By:</strong>{" "}
                                          {followup.updatedByName}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>
                    )}

                    {/* Document Deadline Alert */}
                    {nearestDeadline && (
                      <div className="col-12 mt-3">
                        <div className="alert alert-danger d-flex align-items-center gap-2 mb-0 py-2 px-3">
                          <i className="bi bi-calendar-x-fill text-danger fs-5"></i>
                          <div className="small">
                            <strong className="text-danger">
                              Document Deadline:
                            </strong>{" "}
                            {nearestDeadline.deadline.toLocaleDateString(
                              "en-GB",
                            )}
                            <span className="ms-2 opacity-75">
                              ({nearestDeadline.resolvedDocumentName})
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center d-flex text-gray-6-600">
            {!canRead
              ? "You do not have permission to view this Data"
              : "No data available"}
          </div>
        )}
      </div>
      {showConvertModal && (
        <ConvertToCoaching
          show={showConvertModal}
          onHide={() => setShowConvertModal(false)}
          setShowConvertModal={setShowConvertModal}
          data={selectedStudentForCoaching}
        />
      )}
    </>
  );
};

export default StudentApplicationCard;
