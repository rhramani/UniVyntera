import { MdMessage } from "react-icons/md";
import PersonIcon from "@mui/icons-material/Person";
import CreateIcon from "@mui/icons-material/Create";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import DangerousIcon from "@mui/icons-material/Dangerous";
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
import { FaAppStore, FaBullseye, FaWhatsapp } from "react-icons/fa";
import usePermissions from "../../commonComponents/usePermissions";
import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import getSymbolFromCurrency from "currency-symbol-map";
import { decryptData } from "../../../utils/encryptionUtils";
import { RiChatSmile2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCtcCalling } from "../../../redux/actions/Lead.action";
import { toast } from "react-toastify";
import { MdOutlinePlayCircleFilled } from "react-icons/md";
import DeleteConfirmModal from "../../bulkMessage/commonDeleteModal/DeleteConfirmModal";

const AllLeadsCard = ({
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
  permissionName,
  getBranchNameById,
  getRoleNameById,
  selectedLeads = [],
  handleSelectLead,
  filters,
  selectedFilter,
  searchTerm,
  currentPage,
  itemsPerPage,
  activeView,
  allOther,
  setIsLoading,
  userRole,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const { canCreate, canRead, canUpdate, canDelete, canDownload } =
    usePermissions(permissionName);
  const storedEncryptedCurrency = decryptData(
    localStorage.getItem("crmCurrency"),
  );

  const getStatusColor = (statusName) => {
    const status = leadStatus.find(
      (item) => item.name.toLowerCase() === statusName?.toLowerCase(),
    );
    return status?.color || "#ccc";
  };

  const badgeThemes = [
    {
      bg: "#c7d2fe", // indigo-200 (quite visible)
      border: "#a5b4fc", // indigo-300
      role: "#4f46e5", // indigo-600 (brighter for role)
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
                  {permissionName === "All Leads" && canDownload && (
                    <div className="mt-1">
                      <Form.Check
                        type="checkbox"
                        checked={selectedLeads.includes(item._id)}
                        onChange={() =>
                          handleSelectLead && handleSelectLead(item._id)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="custom-checkbox mb-0"
                      />
                    </div>
                  )}
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
                          handleEdit(item);
                          handleEditHistory(item);
                          if (handleChatOpen) handleChatOpen(item);
                        }}
                      >
                        {item?.name || "-"}
                      </h5>
                      {item?.isDuplicate && (
                        <span
                          className="duplicate-warning px-2 py-1"
                          style={{ fontSize: "0.7rem", borderRadius: "4px" }}
                        >
                          Duplicate Lead
                        </span>
                      )}
                      {item?.deadLead && (
                        <span
                          className="px-2 py-1 badge bg-danger text-white rounded-pill"
                          style={{ fontSize: "0.7rem", fontWeight: 500 }}
                        >
                          Inactive Lead
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
                                color: "#475569",
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
                          <div className="d-flex align-items-center me-3 border-start ps-3 d-none d-sm-flex">
                            <PersonIcon
                              className="me-1 flex-shrink-0"
                              size={18}
                              style={{
                                color: "#0F766E",
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
                          <div className="d-flex align-items-center border-start ps-3 d-none d-md-flex">
                            <CreateIcon
                              className="me-1 flex-shrink-0"
                              size={18}
                              style={{
                                color: "#92400E",
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
                    {(canUpdate || canCreate) &&
                      userRole !== "B2B Admin" &&
                      userRole !== "B2B Member" &&
                      permissionName === "All Leads" && (
                        <>
                          {item?.CTCCallRecording && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(item.CTCCallRecording, "_blank");
                              }}
                              className="d-inline-flex align-items-center gap-1 px-3 py-2 rounded-pill shadow-sm"
                              style={{
                                backgroundColor: "#eaf7f1",
                                color: "#198754",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                fontWeight: 700,
                              }}
                            >
                              <MdOutlinePlayCircleFilled size={18} />
                              RECORDING
                            </div>
                          )}
                          <div
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                setIsLoading(true);
                                const payload = { entityType: "lead" };
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
                            className="d-inline-flex align-items-center gap-1 px-3 py-2 rounded-pill shadow-sm"
                            style={{
                              backgroundColor: "#e7f1ff",
                              color: "#0d6efd",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                              fontWeight: 700,
                            }}
                          >
                            <MdCall size={18} />
                            CALL
                          </div>
                        </>
                      )}

                    {(canUpdate || canCreate) &&
                      permissionName !== "Over Due Followup" && (
                        <div
                          className="ms-2 d-flex align-items-center justify-content-center border rounded-circle shadow-sm"
                          style={{
                            width: "36px",
                            height: "36px",
                            cursor: "pointer",
                            backgroundColor: "#dcfce7", // light WhatsApp green
                            borderColor: "#22c55e40",
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
                          <FaWhatsapp size={20} color="#10b981" />
                        </div>
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
                            setOpenDropdown(null);
                            handleEditHistory(item);
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
                      {canDelete && permissionName !== "Over Due Followup" && (
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
                          setSelectedDeadLead(item);
                          setShowDeadLeadModal(true);
                          setOpenDropdown(null);
                        }}
                        disabled={item?.deadLead === true}
                      >
                        <DangerousIcon
                          fontSize="small"
                          sx={{ mr: 1 }}
                          className="delete-icon"
                        />
                        <span className="delete-action-text">
                          Inactive Lead
                        </span>
                      </MenuItem>
                      {permissionName !== "Over Due Followup" && (
                        <MenuItem
                          onClick={() => {
                            setSelecteWaDaddyWhatsappdData({
                              name: item?.name || "",
                              mobile: item?.phone?.replace(/[^\d]/g, "") || "",
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
                      )}
                      <MenuItem
                        onClick={() => {
                          navigate(`/lead-track/${item._id}`, {
                            state: {
                              from: location.pathname,
                              filters,
                              selectedFilter,
                              searchTerm,
                              currentPage,
                              itemsPerPage,
                              activeView,
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
                            handleEdit(item);
                            setOpenDropdown(null);
                            handleEditHistory(item);
                          }}
                          style={{
                            backgroundColor: getStatusColor(item.lead_status),
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
                          Date
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
                        <div className="fw-semibold">{item.phone || "N/A"}</div>
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
                        <div className="fw-semibold">{item.city || "N/A"}</div>
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
                          Branch Assigned
                        </div>
                        <div className="fw-semibold">
                          {getBranchNameById(item?.lead_assign_Branch?._id)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Other Service */}
                  <div className="col-12 col-sm-6 col-lg-3">
                    <div className="d-flex align-items-start gap-2 text-gray-6">
                      <MdEditNote
                        className="mt-1 flex-shrink-0"
                        size={19}
                        color="#2A48A0"
                      />
                      <div>
                        <div className="text-muted small fw-medium mb-0">
                          Other Service
                        </div>
                        <div
                          className="fw-semibold overflow-hidden text-truncate"
                          style={{ maxWidth: "200px" }}
                        >
                          {item?.other_for?.length > 0
                            ? item.other_for
                                .map((serviceId) => {
                                  const foundService = allOther?.find(
                                    (service) => service?._id === serviceId,
                                  );
                                  return foundService?.name || "";
                                })
                                .filter(Boolean)
                                .join(", ")
                            : "N/A"}
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
                            Lead Assignment
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
          <div className="text-center text-gray-6-600">
            {!canRead
              ? "You do not have permission to view this Data"
              : "No data available"}
          </div>
        )}
      </div>

      <DeleteConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={() => handleDelete(selectedItem)}
      />
    </>
  );
};

export default AllLeadsCard;
