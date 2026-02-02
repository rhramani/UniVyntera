import AssignmentIcon from "@mui/icons-material/Assignment";
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
import { MdCalendarToday, MdMessage } from "react-icons/md";
import { decryptData } from "../../../utils/encryptionUtils";
import { FaAppStore, FaBullseye, FaWhatsapp } from "react-icons/fa";
import {
  MdFace,
  MdCake,
  MdLocationOn,
  MdQuestionAnswer,
  MdPublic,
  MdEvent,
  MdSchool,
  MdMenuBook,
  MdCall,
  MdOutlinePlayCircleFilled,
} from "react-icons/md";
import { useState } from "react";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
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
                className="application-card bg-white border border-gray-200 rounded-lg shadow-sm mb-3 rounded"
              >
                <div className="application-card-1 mb-3">
                  <div className="left-part">
                    <div className="d-flex flex-wrap align-items-center gap-3">
                      <div
                        className="left-part-1"
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
                      </div>
                      {item?.studentId && (
                        <div className="d-flex flex-wrap align-items-center text-primary">
                          <AssignmentIcon
                            className="me-2 fixed-icon"
                            color="#4B0082"
                          />
                          <strong>Student ID</strong> &nbsp;
                          <strong> : </strong> &nbsp;
                          {item?.studentId || "-"}
                        </div>
                      )}
                      {item?.otherCountriesApplied &&
                        item?.otherCountriesApplied?.length > 0 && (
                          <div className="text-primary d-flex align-items-center">
                            {/* Label (no gap applied here) */}
                            <strong>Other Country :</strong>

                            {/* Chips only (gap applied here) */}
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "4px",
                                marginLeft: "6px",
                              }}
                            >
                              {item.otherCountriesApplied.map((c) => (
                                <span
                                  key={c._id}
                                  onClick={() =>
                                    navigate(`/student-details/${c._id}`, {
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
                                  style={{
                                    backgroundColor: "#053880",
                                    color: "#fff",
                                    padding: "2px 10px",
                                    borderRadius: "14px",
                                    fontSize: "0.875rem",
                                    whiteSpace: "nowrap",
                                    cursor: "pointer",
                                  }}
                                  title="View student details"
                                >
                                  {c.country}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      {item?.dueAmount > 0 && (
                        <div className="px-3 mt-2 mt-md-0 d-flex align-items-center bg-danger bg-opacity-10 border border-danger rounded">
                          <span className="text-danger fw-semibold">
                            <i className="bi bi-exclamation-circle me-2"></i>
                            Receivable Amount:{" "}
                            <strong>
                              {storedEncryptedCurrency
                                ? getSymbolFromCurrency(storedEncryptedCurrency)
                                : "₹"}{" "}
                              {Math.floor(item?.dueAmount)}
                            </strong>
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="d-flex flex-wrap align-items-center gap-4">
                      {(item?.createdByName?.length > 0 ||
                        item?.purposeDetails?.updatedByName?.length > 0 ||
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
                                ) : item?.created_by_type === "Branch User" ||
                                  item?.created_by_type === "Branch user" ? (
                                  <>
                                    Branch Member
                                    {item?.branch && ` (${item.branch})`}
                                  </>
                                ) : (
                                  <>
                                    {item?.created_by_type}
                                    {item?.branch && ` (${item.branch})`}
                                  </>
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
                      {item?.mainStatus && (
                        <div className="course_icon_main d-flex align-items-center gap-2">
                          <b>Status:</b>
                          <span
                            style={{
                              backgroundColor:
                                item?.mainStatus?.color || "#09D345 ",
                              color: "#fff",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              cursor: "pointer",
                            }}
                          >
                            {item?.mainStatus ? item.mainStatus?.name : ""}
                          </span>
                        </div>
                      )}
                      {item?.visaApplicationDetails?.status && (
                        <div className="course_icon_main d-flex align-items-center gap-2">
                          <b>Visa Status:</b>
                          <span
                            style={{
                              backgroundColor: "#4DB6AC ",
                              color: "#fff",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              cursor: "pointer",
                            }}
                          >
                            {item?.visaApplicationDetails
                              ? item.visaApplicationDetails?.status
                              : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="right-part d-flex flex-wrap flex-column justify-content-start align-items-end gap-2">
                    <div className="d-flex flex-wrap first-div align-items-center">
                      {userRole !== "B2B Admin" &&
                        userRole !== "B2B Member" &&
                        item?.CTCCallRecording && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(item?.CTCCallRecording, "_blank");
                            }}
                            className="recording-pill-btn"
                          >
                            <MdOutlinePlayCircleFilled size={16} />
                            <span>RECORDING</span>
                          </button>
                        )}
                      {userRole !== "B2B Admin" &&
                        userRole !== "B2B Member" && (
                          <button
                            type="button"
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
                            className="call-pill-btn"
                          >
                            <MdCall size={16} />
                            <span>CALL</span>
                          </button>
                        )}

                      <RiChatSmile2Fill
                        size={26}
                        style={{
                          color: "#007bff",
                          cursor: "pointer",
                          marginTop: "6px",
                          marginRight: "10px",
                        }}
                        onClick={() => handleChatOpen(item)}
                      />
                      {(canUpdate || canCreate) && (
                        <>
                          {userRole !== "B2B Admin" &&
                            userRole !== "B2B Member" && (
                              <>
                                <MdMessage
                                  size={26}
                                  style={{
                                    color: "#ff9800",
                                    cursor: "pointer",
                                    marginTop: "6px",
                                    marginRight: "10px",
                                  }}
                                  onClick={() => {
                                    setSelecteWaDaddyWhatsappdData({
                                      name: item?.name || "",
                                      mobile:
                                        item?.contact?.replace(/[^\d]/g, "") ||
                                        "",
                                    });
                                    setIsWaDaddyWhatsappModalOpen(true);
                                  }}
                                />

                                <FaWhatsapp
                                  size={26}
                                  style={{
                                    color: "#25D366",
                                    cursor: "pointer",
                                    marginTop: "6px",
                                  }}
                                  onClick={() => {
                                    setSelectedLeadName(item?.name || "");
                                    userRole === "Super Admin"
                                      ? setSelectedMobileNumber(
                                          item?.b2bContact
                                            ? item.b2bContact.replace(
                                                /[^\d]/g,
                                                "",
                                              )
                                            : item.contact.replace(
                                                /[^\d]/g,
                                                "",
                                              ),
                                        )
                                      : setSelectedMobileNumber(
                                          item?.contact
                                            ? item.contact.replace(/[^\d]/g, "")
                                            : "",
                                        );
                                    setIsWhatsappModalOpen(true);
                                  }}
                                />
                              </>
                            )}
                        </>
                      )}
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
                    <div className="first-div">
                      {item?.coachingDetails?.coachingRequired && (
                        <strong
                          style={{
                            letterSpacing: "0.5px",
                            backgroundColor: "#E0F7FA",
                            color: "#006064",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            marginTop: "6px",
                            marginRight: "10px",
                          }}
                        >
                          This application is a coaching application
                        </strong>
                      )}
                    </div>
                  </div>
                </div>

                <div className="first-div-1">
                  {item?.coachingDetails?.coachingRequired && (
                    <strong
                      style={{
                        letterSpacing: "0.5px",
                        backgroundColor: "#E0F7FA",
                        color: "#006064",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        marginTop: "6px",
                        marginRight: "10px",
                        fontSize: "11px",
                      }}
                    >
                      This application is a coaching application
                    </strong>
                  )}
                </div>

                <div className="font-sizes d-flex flex-wrap justify-content-between my-3">
                  <div className="d-flex flex-wrap">
                    <div className="course_icon_main d-flex me-5 align-items-center gap-2">
                      <span>
                        <EmailIcon fontSize="small" className="course_icon_1" />
                      </span>
                      {item?.email || "-"}
                    </div>
                    {userRole === "Super Admin" &&
                      ((item?.b2bContact && item.b2bContact !== "na") ||
                        (item?.contact && item.contact !== "na")) && (
                        <div className="course_icon_main d-flex me-5 align-items-center gap-2">
                          <span>
                            <PhoneIcon
                              fontSize="small"
                              className="course_icon_1"
                            />
                          </span>
                          {userRole === "Super Admin"
                            ? item?.b2bContact
                              ? item.b2bContact // + when remove : .replace(/[^\d]/g, "")
                              : item?.contact
                            : item?.contact
                              ? item.contact
                              : "-"}
                        </div>
                      )}
                  </div>
                </div>

                <div className="row font-sizes row-margin">
                  <div className="col-12 col-md-4 p-0">
                    <p className="d-flex text-gray-6">
                      <MdCalendarToday
                        className="me-2 fixed-icon"
                        color="#34A853"
                      />
                      <strong>Created Date</strong>
                      <strong>&nbsp;:&nbsp;</strong>
                      {new Date(item?.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        timeZone: "UTC",
                      })}
                    </p>
                  </div>

                  {item?.DOB?.length > 0 && (
                    <div className="col-12 col-md-4 p-0">
                      <p className="d-flex text-gray-6">
                        <MdCake className="me-2 fixed-icon" color="#FB8C00" />
                        <strong>DOB</strong>
                        <strong>&nbsp;:&nbsp;</strong>
                        {formatDate(parseDate(item.DOB))}
                      </p>
                    </div>
                  )}

                  {item?.gender?.length > 0 && (
                    <div className="col-12 col-md-4 p-0">
                      <p className="d-flex text-gray-6">
                        <MdFace className="me-2 fixed-icon" color="#6C757D" />
                        <strong>Gender</strong>
                        <strong>&nbsp;:&nbsp;</strong>
                        {item?.gender}
                      </p>
                    </div>
                  )}

                  {(item?.city || item?.state || item?.country) && (
                    <div className="col-12 col-md-4 p-0">
                      <p className="d-flex text-gray-6">
                        <MdLocationOn
                          className="me-2 fixed-icon"
                          color="#EA4335"
                        />
                        <strong>Location</strong>
                        <strong>&nbsp;:&nbsp;</strong>
                        {[item?.city, item?.state, item?.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  )}

                  {item?.purposeDetails?.inquiryFor?.name?.length > 0 && (
                    <div className="col-12 col-md-4 p-0">
                      <p className="d-flex text-gray-6">
                        <MdQuestionAnswer
                          className="me-2 fixed-icon"
                          color="#2A48A0"
                        />
                        <strong>Inquiry For</strong>
                        <strong>&nbsp;:&nbsp;</strong>
                        {item?.purposeDetails?.inquiryFor?.name}
                      </p>
                    </div>
                  )}

                  {item?.purposeDetails?.preferredCountry?.length > 0 && (
                    <div className="col-12 col-md-4 p-0">
                      <p className="d-flex align-items-center text-gray-6">
                        <span className="d-flex">
                          <MdPublic
                            className="me-2 fixed-icon"
                            color="#6D4C41"
                          />
                          <strong>Preferred Country</strong>
                          <strong>&nbsp;:&nbsp;</strong>
                        </span>
                        <span className="d-flex flex-wrap gap-2">
                          {item.purposeDetails.preferredCountry.map(
                            (country, idx) => {
                              const name = country || "N/A";
                              const { bg, text } = getColors(name);
                              return (
                                <span
                                  key={idx}
                                  className="px-2 py-1 rounded"
                                  style={{
                                    backgroundColor: bg,
                                    color: text,
                                    fontSize: "13px",
                                    fontWeight: 500,
                                  }}
                                >
                                  {name}
                                </span>
                              );
                            },
                          )}
                        </span>
                      </p>
                    </div>
                  )}

                  {item?.purposeDetails &&
                    item.purposeDetails.intakeYear?.length > 0 && (
                      <div className="col-12 col-md-4 p-0">
                        <p className="d-flex text-gray-6">
                          <MdEvent className="me-2" size={19} color="#00796B" />
                          <strong>Intake Year</strong>
                          <strong>&nbsp;:&nbsp;</strong>
                          {item?.purposeDetails?.intakeYear?.join(", ") || "-"}
                        </p>
                      </div>
                    )}

                  {item?.interestedCourseDetails?.length > 0 && (
                    <div className="col-12 col-md-4 p-0">
                      <div className="d-flex text-gray-6">
                        <MdSchool className="me-2 fixed-icon" color="#0288D1" />
                        <strong>Institute</strong>
                        <strong>&nbsp;:&nbsp;</strong>
                        <ul>
                          {/* ul class : (truncate) hover */}
                          {item.interestedCourseDetails.map((course, index) => (
                            <li key={index}>
                              {`${course?.institute?.instituteName} - ${course?.campus?.campus}` ||
                                "N/A"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {item?.interestedCourseDetails?.length > 0 && (
                    <div className="col-12 col-md-4 p-0">
                      <div className="d-flex text-gray-6">
                        <MdMenuBook
                          className="me-2 fixed-icon"
                          color="#5E35B1"
                        />
                        <strong>Course</strong>
                        <strong>&nbsp;:&nbsp;</strong>
                        <ul>
                          {/* ul class : (truncate) hover */}
                          {item.interestedCourseDetails.map((course, index) => {
                            const statusObj = interestedCourseStatus.find(
                              (status) => status?.name === course?.status,
                            );
                            const bgColor = statusObj?.color || "#0b3c8c";
                            return (
                              <li key={index}>
                                <span style={{ position: "relative" }}>
                                  {course?.course?.programName || "N/A"}
                                  <span
                                    style={{
                                      fontSize: "13.5px",
                                      letterSpacing: "0.5px",
                                      backgroundColor: bgColor,
                                      padding: "2px 8px",
                                      borderRadius: "12px",
                                      color: "#FFFFFF",
                                      margin: "0px 0px 5px 8px",
                                      position: "static",
                                      whiteSpace: "nowrap",
                                      display: "inline-block",
                                      zIndex: 10,
                                    }}
                                  >
                                    {course?.status || "New"}
                                  </span>
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  )}
                  {/* <div className="col-12 col-md-4 p-0">
                    <div className="d-flex text-gray-6"></div>
                  </div> */}
                  {item?.userAllocationDetails?.length > 0 && (
                    <div className="col-12 col-md-4 p-0">
                      <div className="d-flex text-gray-6">
                        <AssignmentIndIcon
                          className="me-2 fixed-icon"
                          sx={{ color: "#6A1B9A" }}
                        />
                        <strong>User Allocation</strong>
                        <strong>&nbsp;:&nbsp;</strong>
                        <ul>
                          {item.userAllocationDetails.map((alloc, index) => (
                            <li key={index}>
                              {`${alloc?.user?.name || "N/A"} (${
                                alloc?.role?.name || "N/A"
                              })`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {item?.visaAllocationDetails?.length > 0 && (
                    <div className="col-12 col-md-4 p-0">
                      <div className="d-flex text-gray-6">
                        <AssignmentIcon
                          className="me-2 fixed-icon"
                          sx={{ color: "#0277BD" }}
                        />
                        <strong>Visa Allocation</strong>
                        <strong>&nbsp;:&nbsp;</strong>
                        <ul>
                          {item.visaAllocationDetails.map((alloc, index) => (
                            <li key={index}>
                              {`${alloc?.user?.name || "N/A"} (${
                                alloc?.role?.name || "N/A"
                              })`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {userRole !== "Student" && userRole !== "LeadStudent" && (
                    <Form.Check
                      type="checkbox"
                      label="Show Follow Up"
                      id={`followup-checkbox-${index}`}
                      className="custom-checkbox cursor-pointer"
                      checked={showFollowUps[index] || false}
                      onChange={() => {
                        setShowFollowUps((prev) => ({
                          ...prev,
                          [index]: !prev[index],
                        }));
                      }}
                    />
                  )}

                  {showFollowUps[index] && item?.followUps && (
                    <div className="row g-1">
                      {Object.entries(item.followUps).map(([key, followup]) => {
                        const title = key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase());

                        const statusColors = {
                          Pending: "#F4B400",
                          Processing: "#1E88E5",
                          Closed: "#43A047",
                        };

                        return (
                          <div className="col-12 col-md-6" key={followup._id}>
                            <div
                              className="p-3 border rounded shadow-sm h-100"
                              style={{
                                backgroundColor: "#fff",
                                borderLeft: `4px solid ${
                                  statusColors[followup?.status] || "#9E9E9E"
                                }`,
                              }}
                            >
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h6
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: 600,
                                      margin: 0,
                                    }}
                                  >
                                    {title}
                                  </h6>
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      padding: "2px 8px",
                                      backgroundColor:
                                        statusColors[followup?.status] ||
                                        "#9E9E9E",
                                      color: "#fff",
                                      borderRadius: "10px",
                                    }}
                                  >
                                    {followup?.status || "-"}
                                  </span>
                                </div>
                              </div>
                              <div
                                className="mt-2"
                                style={{
                                  fontSize: "13px",
                                  color: "#555",
                                }}
                              >
                                <p className="mb-1">
                                  <strong>Next Follow-up:</strong>{" "}
                                  {followup?.nextFollowUpDate
                                    ? formatDate(
                                        parseDate(followup.nextFollowUpDate),
                                      )
                                    : "-"}
                                </p>
                                <p className="mb-1">
                                  <strong>Remarks:</strong>{" "}
                                  {followup?.remarks || "-"}
                                </p>
                                {followup?.updatedByName && (
                                  <p className="mb-0">
                                    <strong>Updated By:</strong>{" "}
                                    {followup.updatedByName}
                                  </p>
                                )}
                                {title === "Document Details" &&
                                  nearestDeadline && (
                                    <p
                                      style={{ color: "red", fontWeight: 400 }}
                                    >
                                      <strong>Document Deadline:</strong>{" "}
                                      {nearestDeadline.deadline.toLocaleDateString(
                                        "en-GB",
                                      )}
                                      <span
                                        style={{
                                          color: "#000",
                                          marginLeft: "3px",
                                        }}
                                      >
                                        ({nearestDeadline.resolvedDocumentName})
                                      </span>
                                    </p>
                                  )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
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
