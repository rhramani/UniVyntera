import {
  MdAccessTime,
  MdChatBubble,
  MdDateRange,
  MdDescription,
  MdEvent,
  MdMenuBook,
  MdOutlineCalendarToday,
  MdPublic,
  MdSchool,
  MdVerifiedUser,
} from "react-icons/md";
import PersonIcon from "@mui/icons-material/Person";
import CreateIcon from "@mui/icons-material/Create";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import DangerousIcon from "@mui/icons-material/Dangerous";
import { FaAppStore, FaBullseye, FaWhatsapp } from "react-icons/fa";
import usePermissions from "../../commonComponents/usePermissions";
import { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import getSymbolFromCurrency from "currency-symbol-map";
import { decryptData } from "../../../utils/encryptionUtils";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllProgramLevel } from "../../../redux/actions/Master/ProgramLevel.action";

const B2BLeadsCard = ({
  getLeadData,
  leadStatus,
  handleEdit,
  handleChatOpen,
  showDeleteModal,
  setShowDeleteModal,
  handleDelete,
  handleView,
  setSelectedDeadLead,
  setShowDeadLeadModal,
  handleEditHistory,
  setSelecteWaDaddyWhatsappdData,
  setIsWaDaddyWhatsappModalOpen,
  setSelectedLeadName,
  setSelectedMobileNumber,
  setIsWhatsappModalOpen,
  setSelectedLead,
  setOpenModal,
  isB2B = false,
  getRoleNameById,
  filters,
  searchTerm,
  currentPage,
  itemsPerPage,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [programLevels, setProgramLevels] = useState([]);

  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("B2B Leads");

  const badgeThemes = [
    {
      bg: "#c7d2fe",
      border: "#a5b4fc",
      role: "#4f46e5",
      user: "#1e1b4b",
    },
    {
      bg: "#a5f3fc",
      border: "#67e8f9",
      role: "#0891b2",
      user: "#083344",
    },
    {
      bg: "#bbf7d0",
      border: "#86efac",
      role: "#16a34a",
      user: "#052e16",
    },
  ];

  const storedEncryptedCurrency = decryptData(
    localStorage.getItem("crmCurrency"),
  );

  const getB2BStatusName = (statusId) => {
    const status = leadStatus.find((s) => s._id === statusId);
    return status ? status.name : "N/A";
  };

  const getStatusColor = (statusName) => {
    const nameToCheck = statusName || "New"; // default to "New" if statusName is falsy
    const status = leadStatus.find(
      (item) => item.name.toLowerCase() === nameToCheck.toLowerCase(),
    );
    return status?.color || "#ccc";
  };

  useEffect(() => {
    const fetchProgramLevels = async () => {
      try {
        const res = await dispatch(getAllProgramLevel(1, 1000, ""));
        setProgramLevels(res?.data?.data?.data || []);
      } catch (error) {
        console.error("Error fetching program levels:", error);
      }
    };
    fetchProgramLevels();
  }, [dispatch]);

  const getProgramLevelName = (levelId) => {
    const level = programLevels.find((lvl) => lvl._id === levelId);
    return level ? level.name : "N/A";
  };

  return (
    <>
      <div className="application-card-container">
        {getLeadData?.data?.length > 0 ? (
          getLeadData.data.map((item, index) => (
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
                        {item?.leadId}
                      </span>
                      <h5
                        className="mb-0 fw-bold"
                        style={{
                          color: "#4B49AC",
                          cursor: "pointer",
                          letterSpacing: "-0.2px",
                        }}
                        onClick={() => {
                          if (canUpdate) {
                            handleEdit(item);
                            handleEditHistory(item);
                          }
                        }}
                      >
                        {item?.name || "-"}
                      </h5>
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
                            style={{ color: "#6366f1" }}
                          >
                            <AssignmentIndIcon
                              className="me-1"
                              style={{
                                fontSize: "15px",
                                color: "#6366f1",
                                opacity: 0.9,
                              }}
                            />
                            <strong style={{ opacity: 0.8 }}>Type</strong>
                            &nbsp;:&nbsp;
                            <span className="fw-semibold">
                              {item?.created_by_type === "B2B Admin" ||
                              item?.created_by_type === "B2B Member" ? (
                                <>
                                  B2B Partner
                                  {item?.b2bCompany && ` (${item.b2bCompany})`}
                                </>
                              ) : item?.created_by_type === "user" ? (
                                <>
                                  Head Office
                                  {item?.b2bCompany && ` (${item.b2bCompany})`}
                                </>
                              ) : item?.created_by_type === "Branch Member" ||
                                item?.created_by_type === "Branch member" ? (
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
                          <div
                            className="d-flex align-items-center me-3 border-start ps-3 d-none d-sm-flex"
                            style={{ color: "#7c3aed" }}
                          >
                            <PersonIcon
                              className="me-1"
                              style={{
                                fontSize: "15px",
                                color: "#7c3aed",
                                opacity: 0.9,
                              }}
                            />
                            <strong style={{ opacity: 0.8 }}>Created By</strong>
                            &nbsp;:&nbsp;
                            <span className="fw-semibold">
                              {item?.createdByName}
                            </span>
                          </div>
                        )}
                        {item?.updatedByName?.length > 0 && (
                          <div
                            className="d-flex align-items-center border-start ps-3 d-none d-md-flex"
                            style={{ color: "#4f46e5" }}
                          >
                            <CreateIcon
                              className="me-1"
                              style={{
                                fontSize: "15px",
                                color: "#4f46e5",
                                opacity: 0.9,
                              }}
                            />
                            <strong style={{ opacity: 0.8 }}>Updated By</strong>
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
                            item?.phone ? item.phone.replace(/[^\d]/g, "") : "",
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
                        setOpenDropdown(openDropdown === index ? null : index);
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
                      {(canUpdate || canCreate) && (
                        <MenuItem
                          onClick={() => {
                            handleEdit(item);
                            handleEditHistory(item);
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
                      {canDelete && (
                        <MenuItem
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
                      {(canCreate || canUpdate) &&
                        (item.b2b_lead_status === "Converted" ? (
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
                              searchTerm,
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
                        <span className="leadtrack-action-text">History</span>
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
                          onClick={() => {
                            if (canUpdate) {
                              handleEdit(item);
                              handleEditHistory(item);
                            }
                          }}
                          style={{
                            backgroundColor: getStatusColor(
                              item.b2b_lead_status,
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
                          {item.b2b_lead_status || "New"}
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
                          Created Date
                        </div>
                        <div className="fw-semibold">
                          {new Date(item.createdAt).toLocaleDateString(
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
                          {new Date(item.createdAt).toLocaleString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Prefer Country */}
                  <div className="col-12 col-sm-6 col-lg-3">
                    <div className="d-flex align-items-start gap-2 text-gray-6">
                      <MdPublic
                        className="mt-1 flex-shrink-0"
                        size={19}
                        color="#A259FF"
                      />
                      <div>
                        <div className="text-muted small fw-medium mb-0">
                          Prefer Country
                        </div>
                        <div className="fw-semibold">
                          {item?.country_interested &&
                          item.country_interested.length > 0
                            ? item.country_interested.join(", ")
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Prefer Degree */}
                  <div className="col-12 col-sm-6 col-lg-3">
                    <div className="d-flex align-items-start gap-2 text-gray-6">
                      <MdSchool
                        className="mt-1 flex-shrink-0"
                        size={19}
                        color="#00796B"
                      />
                      <div>
                        <div className="text-muted small fw-medium mb-0">
                          Prefer Degree
                        </div>
                        <div className="fw-semibold text-primary">
                          {getProgramLevelName(item.prefferedDegree)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Prefer Course */}
                  <div className="col-12 col-sm-6 col-lg-3">
                    <div className="d-flex align-items-start gap-2 text-gray-6">
                      <MdMenuBook
                        className="mt-1 flex-shrink-0"
                        size={19}
                        color="#EA4335"
                      />
                      <div>
                        <div className="text-muted small fw-medium mb-0">
                          Prefer Course
                        </div>
                        <div className="fw-semibold">
                          {item?.prefferedCourse || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Prefer Intake Year */}
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
                          {item?.prefferedIntakeYear || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Prefer Intake Month */}
                  <div className="col-12 col-sm-6 col-lg-3">
                    <div className="d-flex align-items-start gap-2 text-gray-6">
                      <MdDateRange
                        className="mt-1 flex-shrink-0"
                        size={19}
                        color="#2A48A0"
                      />
                      <div>
                        <div className="text-muted small fw-medium mb-0">
                          Intake Month
                        </div>
                        <div className="fw-semibold">
                          {item?.prefferedIntakeMonth || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3">
                    {/* Counselor Assignment */}
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
                            Counselor Assignment
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
                                  <span style={{ opacity: 0.5 }}>•</span>
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
                          {item?.remarks || "No additional remarks available."}
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

      <Modal
        className="leads-modal"
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
          <div className="text-danger fs-1 mb-3">
            <DangerousIcon fontSize="large" />
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
            }}
          >
            <i className="bi bi-trash-fill me-2"></i>Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default B2BLeadsCard;
