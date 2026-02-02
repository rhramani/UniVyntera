import {
  MdAssignmentInd,
  MdDateRange,
  MdEvent,
  MdMenuBook,
  MdMessage,
  MdPersonAdd,
  MdPublic,
  MdSchool,
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
import { Button, Modal } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import getSymbolFromCurrency from "currency-symbol-map";
import { decryptData } from "../../../utils/encryptionUtils";
import { RiChatSmile2Fill } from "react-icons/ri";
import { getAllProgramLevel } from "../../../redux/actions/Master/ProgramLevel.action";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

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
              className="application-card bg-white border border-gray-200 rounded-lg px-4 pt-2 shadow-sm mb-3 rounded"
            >
              <div className="application-card-1 mb-3">
                <div className="left-part mb-2">
                  <div className="d-flex flex-wrap gap-3 align-items-center">
                    <div
                      className="left-part-1"
                      onClick={() => {
                        handleEdit(item);
                        handleEditHistory(item);
                        handleChatOpen(item);
                      }}
                    >
                      {item?.name || "-"}
                    </div>
                    {/* {item?.isDuplicate && (
                      <div
                        className={item?.isDuplicate ? "duplicate-warning" : ""}
                      >
                        Duplicate Lead
                      </div>
                    )} */}
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
                  {/* {item?.deadLead && (
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
                  )} */}
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
                  {(canUpdate || canCreate) && (
                    <FaWhatsapp
                      size={26}
                      style={{ color: "#25D366", cursor: "pointer" }}
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
                    {/* <MenuItem
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
                    </MenuItem> */}
                    {/* <MenuItem
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
                      <span className="wadaddy-action-text">Send Message</span>
                    </MenuItem> */}
                  </Menu>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md-4">
                  <p className="text-gray-6">
                    <MdDescription className="me-2" size={19} color="#FB8C00" />
                    <strong>Lead Status: </strong>
                    <span
                      className="lead-status"
                      onClick={() => {
                        handleEdit(item);
                        setOpenDropdown(null);
                        handleEditHistory(item);
                      }}
                      style={{
                        backgroundColor: getStatusColor(item.b2b_lead_status),
                        color: "#fff",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        cursor: "pointer",
                      }}
                    >
                      {item.b2b_lead_status || "New"}
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
                {/* <div className="col-12 col-md-4">
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
                </div> */}
                {/* <div className="col-12 col-md-4">
                  <p className="text-gray-6">
                    <MdAssignmentInd
                      className="me-2"
                      size={19}
                      color="#A259FF"
                    />
                    <strong>Lead Assign Role: </strong>
                    {item?.lead_role || "N/A"}
                  </p>
                </div> */}
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
                  </p>
                </div>

                <div className="col-12 col-md-4">
                  <p className="text-gray-6">
                    <MdPersonAdd className="me-2" size={19} color="#2A48A0" />
                    <strong>Lead Assign: </strong>
                    {item?.lead_assign_name || item?.lead_assign?.name || "N/A"}
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
                    <MdPublic className="me-2" size={19} color="#6C757D" />
                    <strong>Prefer Country: </strong>
                    {item?.country_interested &&
                    item.country_interested.length > 0
                      ? item.country_interested.join(", ")
                      : "N/A"}
                  </p>
                </div>

                <div className="col-12 col-md-4">
                  <p className="text-gray-6">
                    <MdSchool className="me-2" size={19} color="#00796B" />
                    <strong>Prefer Degree: </strong>
                    {getProgramLevelName(item.prefferedDegree)}
                  </p>
                </div>

                <div className="col-12 col-md-4">
                  <p className="text-gray-6">
                    <MdMenuBook className="me-2" size={19} color="#8E24AA" />
                    <strong>Prefer Course: </strong>
                    {item?.prefferedCourse || "N/A"}
                  </p>
                </div>

                <div className="col-12 col-md-4">
                  <p className="text-gray-6">
                    <MdEvent className="me-2" size={19} color="#009688" />
                    <strong>Prefer Intake Year: </strong>
                    {item?.prefferedIntakeYear || "N/A"}
                  </p>
                </div>

                <div className="col-12 col-md-4">
                  <p className="text-gray-6">
                    <MdDateRange className="me-2" size={19} color="#6D4C41" />
                    <strong>Prefer Intake Month: </strong>
                    {item?.prefferedIntakeMonth || "N/A"}
                  </p>
                </div>
                <div className="col-12 col-md-4">
                  <p className="text-gray-6">
                    <MdChatBubble className="me-2" size={19} color="#6C757D" />
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
                </div> */}
                {/* <div className="col-12 col-md-4">
                  <p className="text-gray-6">
                    <MdVerifiedUser
                      className="me-2"
                      size={19}
                      color="#6D4C41"
                    />
                    <strong>Created type : </strong>
                    {item?.created_by_type ? item?.created_by_type : "N/A"}
                  </p>
                </div> */}
                {/* <div className="col-12 col-md-4">
                  <p className="text-gray-6">
                    <MdEditNote className="me-2" size={19} color="#2A48A0" />
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

export default B2BLeadsCard;
