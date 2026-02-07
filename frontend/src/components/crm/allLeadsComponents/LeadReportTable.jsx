import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import DangerousIcon from "@mui/icons-material/Dangerous";
import { MdMessage } from "react-icons/md";
import { FaAppStore, FaBullseye, FaWhatsapp } from "react-icons/fa";
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import usePermissions from "../../commonComponents/usePermissions";
import { useNavigate } from "react-router-dom";
import { MdCall, MdOutlinePlayCircleFilled } from "react-icons/md";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addCtcCalling } from "../../../redux/actions/Lead.action";
import DeleteConfirmModal from "../../bulkMessage/commonDeleteModal/DeleteConfirmModal";

const LeadReportTable = ({
  columns,
  leadReports,
  canRead,
  canCreate,
  canUpdate,
  canDelete,
  canDownload,
  handleEdit,
  handleDelete,
  handleView,
  handleEditHistory,
  setSelectedDeadLead,
  setShowDeadLeadModal,
  setSelecteWaDaddyWhatsappdData,
  setIsWaDaddyWhatsappModalOpen,
  setSelectedLeadName,
  setSelectedMobileNumber,
  setIsWhatsappModalOpen,
  setSelectedLead,
  setOpenModal,
  selectedLeads = [],
  handleSelectLead,
  permissionName = "All Leads",
  filters,
  selectedFilter,
  searchTerm,
  currentPage,
  itemsPerPage,
  activeView,
  setIsLoading,
  userRole,
}) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    canCreate: canCreatePerm,
    canUpdate: canUpdatePerm,
    canDelete: canDeletePerm,
  } = usePermissions(permissionName);

  const open = Boolean(anchorEl);

  const handleClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setOpenDropdown(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenDropdown(null);
  };

  // Add Actions column
  const actionColumn = {
    label: "Actions",
    key: "actions",
    render: (item, index) => (
      <div style={{ position: "relative", display: "inline-block" }}>
        <IconButton
          size="small"
          aria-label="more"
          aria-controls={`menu-${index}`}
          aria-haspopup="true"
          onClick={(e) => handleClick(e, index)}
          sx={{ padding: "4px" }}
        >
          <MoreVertIcon fontSize="small" className="three-dots-icon" />
        </IconButton>

        <Menu
          id={`menu-${index}`}
          anchorEl={anchorEl}
          open={openDropdown === index}
          onClose={handleClose}
          MenuListProps={{ "aria-labelledby": `menu-${index}` }}
          PaperProps={{
            sx: {
              minWidth: "180px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              "& .MuiMenuItem-root": {
                fontSize: "13px",
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              },
            },
          }}
        >
          {/* EDIT */}
          {(canUpdatePerm || canCreatePerm) && (
            <MenuItem
              onClick={() => {
                handleEdit(item);
                handleEditHistory(item);
                handleClose();
              }}
              sx={{ color: "#007bff" }}
            >
              <EditIcon fontSize="small" className="edit-icon" />
              <span className="edit-action-text">Edit</span>
            </MenuItem>
          )}

          {/* DELETE */}
          {canDeletePerm && (
            <MenuItem
              onClick={() => {
                setSelectedItem(item);
                setShowDeleteModal(true);
                handleClose();
              }}
              sx={{ color: "#dc3545" }}
            >
              <DeleteIcon fontSize="small" className="delete-icon" />
              <span className="delete-action-text">Delete</span>
            </MenuItem>
          )}

          {/* VIEW */}
          <MenuItem
            onClick={() => {
              handleView(item._id);
              handleClose();
            }}
            sx={{ color: "#17a2b8" }}
          >
            <VisibilityIcon fontSize="small" className="view-icon" />
            <span className="view-action-text">View</span>
          </MenuItem>

          {/* CONVERT TO APP */}
          {(canCreatePerm || canUpdatePerm) &&
            (item.lead_status === "Converted" ? (
              <MenuItem disabled sx={{ opacity: 0.6 }}>
                <FaAppStore fontSize="small" className="convert-icon" />
                <span className="convert-action-text">Already Converted</span>
              </MenuItem>
            ) : (
              <MenuItem
                onClick={() => {
                  setSelectedLead(item);
                  setOpenModal(true);
                  handleClose();
                }}
                sx={{ color: "#28a745" }}
              >
                <FaAppStore fontSize="small" className="convert-icon" />
                <span className="convert-action-text">
                  Convert to Application
                </span>
              </MenuItem>
            ))}

          {/* INACTIVE LEAD */}
          <MenuItem
            onClick={() => {
              setSelectedDeadLead(item);
              setShowDeadLeadModal(true);
              handleClose();
            }}
            disabled={item?.deadLead === true}
            sx={{
              color: item?.deadLead ? "#6c757d" : "#dc3545",
              opacity: item?.deadLead ? 0.6 : 1,
            }}
          >
            <DangerousIcon fontSize="small" className="delete-icon" />
            <span className="delete-action-text">Inactive Lead</span>
          </MenuItem>

          {/* SEND WHATSAPP */}
          <MenuItem
            onClick={() => {
              setSelectedLeadName(item?.name || "");
              setSelectedMobileNumber(item?.phone?.replace(/[^\d]/g, "") || "");
              setIsWhatsappModalOpen(true);
              handleClose();
            }}
            sx={{ color: "#25D366" }}
          >
            <FaWhatsapp fontSize="small" className="whatsapp-icon" />
            <span className="whatsapp-action-text">Send WhatsApp</span>
          </MenuItem>

          {permissionName === "All Leads" &&
            userRole !== "B2B Admin" &&
            userRole !== "B2B Member" &&
            item?.CTCCallRecording && (
              <MenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(item?.CTCCallRecording, "_blank");
                }}
                sx={{ color: "#198754" }}
              >
                <MdOutlinePlayCircleFilled
                  fontSize="small"
                  className="recording-icon"
                />
                <span className="recording-action-text">Recording</span>
              </MenuItem>
            )}

          {/* CTC CALL */}
          {permissionName === "All Leads" &&
            userRole !== "B2B Admin" &&
            userRole !== "B2B Member" && (
              <MenuItem
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    const payload = { entityType: "lead" };
                    await dispatch(addCtcCalling(item?._id, payload));
                    toast.success("CTC calling initiated");
                    handleClose();
                  } catch (error) {
                    toast.error(
                      error?.response?.data?.message ||
                        "Failed to initiate CTC call",
                    );
                    handleClose();
                  } finally {
                    setIsLoading(false);
                  }
                }}
                sx={{ color: "#0d6efd" }}
              >
                <MdCall fontSize="small" className="call-icon" />
                <span className="call-action-text">CTC Call</span>
              </MenuItem>
            )}

          {/* WADADDY MESSAGE */}
          <MenuItem
            onClick={() => {
              setSelecteWaDaddyWhatsappdData({
                name: item?.name || "",
                mobile: item?.phone?.replace(/[^\d]/g, "") || "",
              });
              setIsWaDaddyWhatsappModalOpen(true);
              handleClose();
            }}
            // sx={{ color: "#007bff" }}
          >
            <MdMessage fontSize="small" className="lead-message-icon" />
            <span className="lead-message-action-text">Send Message</span>
          </MenuItem>
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
              handleClose();
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
    ),
  };

  // Combine original columns with Actions column
  const tableColumns = [...columns, actionColumn];

  return (
    <>
      <div
        className="table-responsive modern-table-wrapper"
        style={{
          borderRadius: "12px",
          border: "1px solid #dee2e6",
        }}
      >
        <table
          className="table table-hover modern-table table-nowrap"
          style={{ width: "100%", overflowX: "auto" }}
        >
          <thead className="text-uppercase">
            <tr>
              {tableColumns.map((col, index) => (
                <th
                  key={index}
                  className={`dynamic-width ${
                    col.label === "Age" ? "center-align" : ""
                  } ${
                    col.label === "Actions"
                      ? "sticky-col-right-last bg-white text-center"
                      : ""
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {leadReports?.length > 0 ? (
              leadReports.map((item, index) => (
                <tr
                  key={item._id}
                  className={`${
                    index % 2 === 0 ? "table-row-even" : "table-row-odd"
                  }`}
                >
                  {tableColumns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`dynamic-width-data
                        ${col.isLongText ? "long-text" : ""}
                        ${col.label === "Age" ? "center-align" : ""}
                        ${
                          col.label === "Actions"
                            ? "sticky-col-right-last text-center"
                            : ""
                        }`}
                      style={{
                        verticalAlign: "middle",
                        whiteSpace: col.isLongText ? "normal" : "nowrap",
                        // backgroundColor: `${index % 2 === 0 ? "#f7f7f7" : "#ffffff"
                        //   }`,
                      }}
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
                <td colSpan={tableColumns.length}>
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
      <DeleteConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={() => {
          handleDelete(selectedItem);
          setShowDeleteModal(false);
        }}
      />
    </>
  );
};

export default LeadReportTable;

// const LeadReportTable = ({ columns, leadReports, canRead }) => {
//   return (
//     <div className="table-responsive">
//       <table className="text-nowrap border" style={{ tableLayout: "auto" }}>
//         <thead className="text-uppercase">
//           <tr>
//             {columns?.map((col, index) => (
//               <th
//                 key={index}
//                 className={`dynamic-width ${
//                   col.label === "Age" ? "center-align" : ""
//                 }`}
//               >
//                 {col.label}
//               </th>
//             ))}
//           </tr>
//         </thead>

//         <tbody>
//           {leadReports?.length > 0 ? (
//             leadReports.map((item, index) => (
//               <tr
//                 key={index}
//                 className={`${
//                   index % 2 === 0 ? "table-row-even" : "table-row-odd"
//                 }`}
//               >
//                 {columns?.map((col, colIndex) => (
//                   <td
//                     key={colIndex}
//                     className={`dynamic-width-data
//                         ${col.isLongText ? "long-text" : ""}
//                         ${col.label === "Age" ? "center-align" : ""}`}
//                   >
//                     {col.render ? col.render(item) : item[col.key] || "-"}
//                   </td>
//                 ))}
//               </tr>
//             ))
//           ) : (
//             <tr className="no-data-row">
//               <td colSpan={columns.length}>
//                 <div className="no-data-text">
//                   {!canRead
//                     ? "You do not have permission to view this Data"
//                     : "No data available"}
//                 </div>
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default LeadReportTable;
