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

  return (
    <>
      <div className="application-card-container">
        {getLeadData?.data?.length > 0 ? (
          getLeadData.data.map((item, index) => (
            <div
              key={item._id}
              className="application-card bg-white border border-gray-200 rounded-lg px-4 pt-2 shadow-sm mb-3 rounded"
            >
              <div className="fw-semibold d-flex align-items-center gap-2">
                {item?.leadId}
              </div>
              <div className="application-card-1 flex-wrap mb-3">
                <div className="left-part mb-2">
                  <div className="d-flex flex-wrap gap-2 align-items-center">
                    {permissionName === "All Leads" && canDownload && (
                      <Form.Check
                        type="checkbox"
                        checked={selectedLeads.includes(item._id)}
                        onChange={() =>
                          handleSelectLead && handleSelectLead(item._id)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="custom-checkbox mb-0"
                      />
                    )}
                    <div
                      className="left-part-1"
                      onClick={() => {
                        handleEdit(item);
                        handleEditHistory(item);
                        if (handleChatOpen) handleChatOpen(item);
                      }}
                    >
                      {item?.name || "-"}
                    </div>
                    {item?.isDuplicate && (
                      <div
                        className={item?.isDuplicate ? "duplicate-warning" : ""}
                      >
                        Duplicate Lead
                      </div>
                    )}
                    {item?.dueAmount > 0 && (
                      <div className="px-2 d-flex align-items-center bg-danger bg-opacity-10 border border-danger rounded">
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
                <div className="right-part d-flex flex-wrap align-items-center">
                  {item?.deadLead && (
                    <strong
                      className="me-3"
                      style={{
                        letterSpacing: "0.5px",
                        backgroundColor: "red",
                        padding: "2px 8px 0px 8px",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    >
                      Inactive Lead
                    </strong>
                  )}
                  {/* <RiChatSmile2Fill
                    size={26}
                    style={{
                      color: "#007bff",
                      cursor: "pointer",
                      marginTop: "6px",
                      marginRight: "10px",
                    }}
                    onClick={() => handleChatOpen(item)}
                  /> */}

                  {(canUpdate || canCreate) &&
                    userRole !== "B2B Admin" &&
                    userRole !== "B2B Member" &&
                    permissionName === "All Leads" && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {/* RECORDING BUTTON */}
                        {item?.CTCCallRecording && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(item.CTCCallRecording, "_blank");
                            }}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "6px 12px",
                              borderRadius: "20px",
                              backgroundColor: "#eaf7f1",
                              color: "#198754",
                              cursor: "pointer",
                              fontWeight: 600,
                            }}
                            title="Listen Call Recording"
                          >
                            <MdOutlinePlayCircleFilled size={18} />
                            RECORDING
                          </div>
                        )}
                        {/* CALL BUTTON */}
                        <div
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              setIsLoading(true);
                              const payload = { entityType: "lead" };
                              await dispatch(addCtcCalling(item?._id, payload));
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
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            backgroundColor: "#e7f1ff",
                            color: "#0d6efd",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          <MdCall size={18} />
                          CALL
                        </div>
                      </div>
                    )}

                  {/* {(canUpdate || canCreate) &&
                    permissionName === "All Leads" && (
                      <MdCall
                        size={26}
                        style={{
                          color: "#0d6efd",
                          cursor: "pointer",
                        }}
                        title="CTC Call"
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            setIsLoading(true);
                            const res = await dispatch(
                              addCtcCalling(item?._id)
                            );
                            toast.success("CTC calling initiated");
                          } catch (error) {
                            toast.error(
                              error?.response?.data?.message ||
                                "Failed to initiate CTC call"
                            );
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                      />
                    )} */}

                  {(canUpdate || canCreate) &&
                    permissionName !== "Over Due Followup" && (
                      <FaWhatsapp
                        size={26}
                        style={{
                          color: "#25D366",
                          cursor: "pointer",
                          marginLeft: "10px",
                        }}
                        onClick={() => {
                          setSelectedLeadName(item?.name || "");
                          setSelectedMobileNumber(
                            item?.phone ? item.phone.replace(/[^\d]/g, "") : "",
                          );
                          setIsWhatsappModalOpen(true);
                        }}
                      />
                    )}
                  <IconButton
                    aria-label="more"
                    aria-controls={`menu-${index}`}
                    aria-haspopup="true"
                    onClick={(e) => {
                      setOpenDropdown(openDropdown === index ? null : index);
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
                      <span className="delete-action-text">Inactive Lead</span>
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
              <div className="row">
                <div className="col-12 col-md-4">
                  <p className="text-gray-6">
                    <MdDescription className="me-2" size={19} color="#4285F4" />
                    <strong>Lead Status : </strong>
                    <span
                      className="lead-status"
                      onClick={() => {
                        handleEdit(item);
                        setOpenDropdown(null);
                        handleEditHistory(item);
                      }}
                      style={{
                        backgroundColor: getStatusColor(item.lead_status),
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
                    {new Date(item.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      timeZone: "UTC",
                    })}
                  </p>
                </div>
                <div className="col-12 col-md-4">
                  <p className="text-gray-6">
                    <MdAccessTime className="me-2" size={19} color="#FB8C00" />
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
                    <FaBullseye className="me-2" size={19} color="#A259FF" />
                    <strong>Lead From : </strong>
                    {item?.lead_form || "N/A"}
                  </p>
                </div>
                <div className="col-12 col-md-4">
                  <p className="text-gray-6">
                    <MdCall className="me-2" size={19} color="#4285F4" />
                    <strong>Phone : </strong>
                    {item.phone || "N/A"}
                  </p>
                </div>
                <div className="col-12 col-md-4">
                  <p className="text-gray-6">
                    <MdLocationOn className="me-2" size={19} color="#EA4335" />
                    <strong>Location : </strong>
                    {item.city || "N/A"}
                  </p>
                </div>
                {/* {permissionName === "All Leads" || permissionName === "Allocated Leads" && (
                  <> */}
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

                {/* <div className="col-12 col-md-4">
                  <p className="text-gray-6">
                    <MdVerifiedUser
                      className="me-2"
                      size={19}
                      color="#FF6F00"
                    />
                    <strong>Lead Assign Role : </strong>
                    {getRoleNameById(
                      item?.lead_role,
                      item?.lead_assign_Branch || "HEAD_OFFICE"
                    )}
                    {item?.lead_assign?.length > 0
                      ? item.lead_assign
                          .map((assign) => assign?.role?.name)
                          .filter(Boolean)
                          .join(", ")
                      : "N/A"}
                  </p>
                </div> */}

                <div className="col-12 col-md-4">
                  <div>
                    <div className="d-flex align-items-center mb-1 text-gray-6">
                      <MdVerifiedUser className="me-2 text-warning" size={18} />
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
                            <span className="me-1">{assign?.role?.name}</span>
                            <span>{assign?.user?.name ? `(${assign?.user?.name})` : ""}</span>
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
                    <MdEditNote className="me-2" size={19} color="#2A48A0" />
                    <strong>Other Service : </strong>

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
                  </p>
                </div>
                {/* </>
                )} */}

                <div className="col-12 col-md-4">
                  <p className="text-gray-6">
                    <MdChatBubble className="me-2" size={19} color="#6C757D" />
                    <strong>Remark : </strong>
                    {item?.remarks || "N/A"}
                  </p>
                </div>
                {/* {permissionName !== "All Leads" || permissionName !== "Allocated Leads" && (
                  <>
                    <div className="col-12 col-md-4">
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
                        {item?.created_by_type ? item?.created_by_type : "N/A"}
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
                    </div>
                  </>
                )} */}
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
          <div className="text-danger text-primary fs-1 mb-3">
            <i className="bi bi-exclamation-triangle-fill"></i>{" "}
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

export default AllLeadsCard;
