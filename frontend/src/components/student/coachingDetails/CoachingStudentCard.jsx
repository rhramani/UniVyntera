import {
  Button,
  Col,
  Form,
  Modal,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import {
  MdEvent,
  MdLocationOn,
  MdPublic,
  MdQuestionAnswer,
  MdInfoOutline,
  MdAccessTime,
  MdAppRegistration,
  MdChecklist,
  MdCoPresent,
} from "react-icons/md";

import TaskAltIcon from "@mui/icons-material/TaskAlt";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import CreateIcon from "@mui/icons-material/Create";
import EmailIcon from "@mui/icons-material/Email";
import SportsScoreIcon from "@mui/icons-material/TrackChanges";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { FaPlus } from "react-icons/fa";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { updateStudentApplication } from "../../../redux/actions/Student/StudentApplication.action";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import getSymbolFromCurrency from "currency-symbol-map";
import { decryptData } from "../../../utils/encryptionUtils";
import PropTypes from "prop-types";
const CoachingStudentCard = ({
  coachingStudentData,
  currentPage,
  itemsPerPage,
  search,
  filters,
  canRead,
  parseDate,
  formatDate,
  canUpdate,
  canDelete,
  userRole,
  handleEdit,
  setSelectedItem,
  setShowDeleteModal,
  handleViewAttendance,
  handleConvertToApplication,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null); //Remark Modal States
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [edit, setEdit] = useState({
    remarkDetails: false,
    remarkDetailsIndex: 0,
    remarkDetailsObj: null,
    studentId: null,
  });
  const storedEncryptedCurrency = decryptData(
    localStorage.getItem("crmCurrency"),
  );

  //   const isCourseEnded = (endDate) => {
  //   if (!endDate) return false;
  //   const today = new Date();
  //   const parsedEndDate = parseDate(endDate);
  //   return parsedEndDate && today >= parsedEndDate;
  // };
  const isCourseEnded = (endDate) => {
    if (!endDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const parsedEndDate = parseDate(endDate);
    if (!parsedEndDate) return false;
    parsedEndDate.setHours(0, 0, 0, 0);
    return today > parsedEndDate;
  };
  const tagColors = [
    { bg: "#D1FAE5", text: "#047857" }, // green
    { bg: "#DBEAFE", text: "#1D4ED8" }, // blue
    { bg: "#EDE9FE", text: "#6D28D9" }, // purple
    { bg: "#FEF3C7", text: "#B45309" }, // yellow
    { bg: "#F5D0FE", text: "#A21CAF" }, // pink
    { bg: "#C7D2FE", text: "#3730A3" }, // indigo
  ];
  const getColors = (name) => {
    const index =
      [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      tagColors.length;
    return tagColors[index];
  };
  const remarkFormik = useFormik({
    initialValues: {
      remarkHistory: [{ remark: "" }],
    },
    validationSchema: Yup.object({
      remarkHistory: Yup.array().of(
        Yup.object({
          remark: Yup.string().required("Remark is required"),
        }),
      ),
    }),
    onSubmit: async (values) => {
      try {
        const remarkData = values.remarkHistory[0];
        const payload = new FormData();

        if (edit.remarkDetails) {
          const existingRemark = edit.remarkDetailsObj;
          if (!existingRemark || !existingRemark._id) {
            toast.error("Remark ID not found. Cannot update.");
            return;
          }
          payload.append("remarksId", existingRemark._id);
          payload.append("updatedRemark", remarkData.remark);
        } else {
          payload.append("remarkHistory", remarkData.remark);
        }

        const res = await dispatch(
          updateStudentApplication(payload, edit.studentId),
        );
        if (res?.status === 200) {
          toast.success(
            edit.remarkDetails
              ? "Remark updated successfully!"
              : "Remark added successfully!",
          );
          setShowRemarkModal(false);
          remarkFormik.resetForm();
          setEdit({
            remarkDetails: false,
            remarkDetailsIndex: 0,
            remarkDetailsObj: null,
            studentId: null,
          });
        }
      } catch (error) {
        console.error("Error updating remark:", error);
        toast.error("Failed to update remark");
      }
    },
  });

  return (
    <>
      <div className="application-card-container">
        {coachingStudentData?.length > 0 ? (
          coachingStudentData.map((item, index) => {
            const courseEnded = isCourseEnded(item?.coachingDetails?.endDate);

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
                  style={{
                    backgroundColor: "#fbfbff",
                    borderRadius: "10px 10px 0 0",
                  }}
                >
                  <div className="d-flex align-items-start gap-3">
                    <div>
                      <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                        {item?.studentId && (
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
                        )}
                        <h5
                          className="mb-0 fw-bold"
                          style={{
                            color: "#4B49AC",
                            cursor: "pointer",
                            letterSpacing: "-0.2px",
                          }}
                          onClick={() =>
                            navigate(`/coachingdetails/${item._id}`, {
                              state: {
                                currentPage,
                                itemsPerPage,
                                search,
                                filters,
                              },
                            })
                          }
                        >
                          {item?.name || "-"}
                        </h5>
                        {item?.coachingDetails?.targetAchieved &&
                          Object.values(
                            item.coachingDetails.targetAchieved.scores || {},
                          ).some((v) => v !== null) && (
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip id="tooltip-target">
                                  Target Achieved
                                </Tooltip>
                              }
                            >
                              <div className="ms-2">
                                <TaskAltIcon
                                  style={{ color: "green", fontSize: 20 }}
                                />
                              </div>
                            </OverlayTrigger>
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

                  <div className="d-flex flex-wrap align-items-center  justify-content-end  gap-2 ms-md-auto ">
                    {item?.dueAmount > 0 && (
                      <div
                        className="px-2 px-md-3 py-1 text-white rounded-pill shadow-sm d-flex justify-content-end  align-items-center gap-2"
                        style={{
                          fontSize: "0.8rem",
                          backgroundColor: "#dc3545",
                          border: "1px solid #dc3545",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <i className="bi bi-exclamation-circle"></i>
                        <span className="fw-bold">
                          Receivable:{" "}
                          {storedEncryptedCurrency
                            ? getSymbolFromCurrency(storedEncryptedCurrency)
                            : "₹"}{" "}
                          {Math.floor(item?.dueAmount)}
                        </span>
                      </div>
                    )}

                    <div className="d-flex align-items-center order-1 order-md-2 gap-2">
                      <button
                        className="btn btn-sm btn-primary rounded-pill px-3 d-flex align-items-center gap-1"
                        style={{ height: "36px", fontSize: "0.85rem" }}
                        onClick={() => {
                          setEdit({
                            remarkDetails: false,
                            remarkDetailsIndex: 0,
                            remarkDetailsObj: null,
                            studentId: item._id,
                          });
                          remarkFormik.resetForm();
                          setShowRemarkModal(true);
                          setOpenDropdown(null);
                        }}
                      >
                        <FaPlus style={{ fontSize: "10px" }} /> Remark
                      </button>

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
                        aria-controls={`menu-${index}`}
                        aria-haspopup="true"
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
                        {canUpdate && (
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
                        {canDelete && (
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
                        {canRead && (
                          <MenuItem
                            key="view"
                            onClick={() =>
                              navigate(`/coachingdetails/${item._id}`, {
                                state: {
                                  currentPage,
                                  itemsPerPage,
                                  search,
                                  filters,
                                },
                              })
                            }
                          >
                            <VisibilityIcon
                              fontSize="small"
                              sx={{ mr: 1 }}
                              className="view-icon"
                            />
                            <span className="view-action-text">View</span>
                          </MenuItem>
                        )}
                        {canRead && (
                          <MenuItem
                            onClick={() => {
                              handleViewAttendance(item);
                              setOpenDropdown(null);
                            }}
                          >
                            <DescriptionIcon
                              fontSize="small"
                              sx={{ mr: 1 }}
                              className="attendance-icon"
                            />
                            <span className="attendance-action-text">
                              View Attendance
                            </span>
                          </MenuItem>
                        )}
                        {userRole !== "B2B Admin" &&
                          userRole !== "B2B Member" && (
                            <MenuItem
                              onClick={() => {
                                handleConvertToApplication(item);
                                setOpenDropdown(null);
                              }}
                              key="converttocoaching"
                            >
                              <AutorenewIcon
                                fontSize="small"
                                sx={{ mr: 1 }}
                                className="coaching-icon"
                              />
                              <span className="coaching-action-text">
                                Convert to Application
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
                    {/* Status, Note & Alert - Rich Layout */}
                    {(item?.mainStatus ||
                      item?.admissionProcessRequired ||
                      courseEnded) && (
                      <div className="col-12">
                        <div
                          className="d-inline-flex flex-column flex-md-row flex-wrap gap-3 p-3 bg-light border border-light"
                          style={{
                            borderRadius: "12px",
                            width: "fit-content",
                            maxWidth: "100%",
                          }}
                        >
                          {item?.mainStatus && (
                            <div
                              className={`d-flex align-items-center gap-3 pe-md-4 mb-2 mb-md-0 ${
                                item?.admissionProcessRequired || courseEnded
                                  ? "border-md-end border-light"
                                  : ""
                              }`}
                            >
                              <div
                                className="p-2 rounded-circle shadow-sm d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{
                                  backgroundColor: "#4b49ac31",
                                  borderColor: "#4b49ac49",
                                }}
                              >
                                <AssignmentIcon
                                  style={{ fontSize: "20px", color: "#4B49AC" }}
                                />
                              </div>
                              <div>
                                <div className="text-muted small fw-medium mb-1">
                                  Status
                                </div>
                                <span
                                  className="badge border-0"
                                  style={{
                                    backgroundColor:
                                      item?.mainStatus?.color || "#5d54be",
                                    color: "#fff",
                                    padding: "6px 14px",
                                    borderRadius: "20px",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                  }}
                                >
                                  {item.mainStatus.name}
                                </span>
                              </div>
                            </div>
                          )}

                          {item?.admissionProcessRequired && (
                            <div
                              className={`d-flex align-items-center gap-3 mb-2 mb-md-0 ${
                                courseEnded
                                  ? "pe-md-4 border-md-end border-light"
                                  : ""
                              }`}
                            >
                              <div
                                className="p-2 rounded-circle shadow-sm d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{
                                  backgroundColor: "#0061643a",
                                  borderColor: "#0061643a",
                                }}
                              >
                                <MdInfoOutline size={20} color="#006064" />
                              </div>
                              <div>
                                <div className="text-muted small fw-medium mb-1">
                                  Note
                                </div>
                                <span
                                  className="badge border-0"
                                  style={{
                                    backgroundColor: "#e0f7fa",
                                    color: "#006064",
                                    padding: "6px 14px",
                                    borderRadius: "20px",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    border: "1px solid #b2ebf2",
                                  }}
                                >
                                  Direct Student Application
                                </span>
                              </div>
                            </div>
                          )}

                          {courseEnded && (
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="p-2 rounded-circle shadow-sm d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{
                                  backgroundColor: "#ef44442c",
                                  borderColor: "#ef44442c",
                                }}
                              >
                                <MdAccessTime size={20} color="#ef4444" />
                              </div>
                              <div>
                                <div className="text-muted small fw-medium mb-1">
                                  Alert
                                </div>
                                <span
                                  className="badge border-0"
                                  style={{
                                    backgroundColor: "#fee2e2",
                                    color: "#ef4444",
                                    padding: "6px 14px",
                                    borderRadius: "20px",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    border: "1px solid #fecaca",
                                  }}
                                >
                                  Course Duration Closed
                                </span>
                              </div>
                            </div>
                          )}
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
                          <div className="text-muted small fw-medium mb-1">
                            Email
                          </div>
                          <div className="fw-semibold">
                            {item?.email || "-"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="col-12 col-sm-6 col-lg-3">
                      <div className="d-flex align-items-start gap-2 text-gray-6">
                        <PhoneIcon
                          className="mt-1 flex-shrink-0"
                          style={{ fontSize: "19px", color: "#34A853" }}
                        />
                        <div>
                          <div className="text-muted small fw-medium mb-1">
                            Phone
                          </div>
                          <div className="fw-semibold">
                            {userRole === "Super Admin"
                              ? item?.b2bContact || item?.contact || "-"
                              : item?.contact || "-"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    {item?.coachingDetails?.city && (
                      <div className="col-12 col-sm-6 col-lg-3">
                        <div className="d-flex align-items-start gap-2 text-gray-6">
                          <MdLocationOn
                            className="mt-1 flex-shrink-0"
                            size={19}
                            color="#EA4335"
                          />
                          <div>
                            <div className="text-muted small fw-medium mb-1">
                              Location
                            </div>
                            <div className="fw-semibold">
                              {item?.coachingDetails?.city}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Register For */}
                    {item?.coachingDetails?.registerFor && (
                      <div className="col-12 col-sm-6 col-lg-3">
                        <div className="d-flex align-items-start gap-2 text-gray-6">
                          <MdAppRegistration
                            className="mt-1 flex-shrink-0"
                            size={19}
                            color="#6366f1"
                          />
                          <div>
                            <div className="text-muted small fw-medium mb-1">
                              Register For
                            </div>
                            <div className="fw-semibold">
                              {item?.coachingDetails?.registerFor?.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Requirement */}
                    {item?.coachingDetails?.coachingRequirement && (
                      <div className="col-12 col-sm-6 col-lg-3">
                        <div className="d-flex align-items-start gap-2 text-gray-6">
                          <MdChecklist
                            className="mt-1 flex-shrink-0"
                            size={19}
                            color="#8b5cf6"
                          />
                          <div>
                            <div className="text-muted small fw-medium mb-1">
                              Requirement
                            </div>
                            <div className="fw-semibold">
                              {item?.coachingDetails?.coachingRequirement?.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Target Score */}
                    {item?.coachingDetails?.targetedScore && (
                      <div className="col-12 col-sm-6 col-lg-3">
                        <div className="d-flex align-items-start gap-2 text-gray-6">
                          <SportsScoreIcon
                            className="mt-1 flex-shrink-0"
                            style={{ fontSize: "19px", color: "#f43f5e" }}
                          />
                          <div>
                            <div className="text-muted small fw-medium mb-1">
                              Target Score
                            </div>
                            <div className="fw-semibold">
                              {item?.coachingDetails?.targetedScore}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Batch */}
                    <div className="col-12 col-sm-6 col-lg-3">
                      <div className="d-flex align-items-start gap-2 text-gray-6">
                        <MdEvent
                          className="mt-1 flex-shrink-0"
                          size={19}
                          color="#059669"
                        />
                        <div>
                          <div className="text-muted small fw-medium mb-1">
                            Batch
                          </div>
                          <div className="fw-semibold">
                            {item?.coachingDetails?.startDate
                              ? formatDate(
                                  parseDate(item.coachingDetails.startDate),
                                )
                              : "-"}
                            {" to "}
                            {item?.coachingDetails?.endDate
                              ? formatDate(
                                  parseDate(item.coachingDetails.endDate),
                                )
                              : "-"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timing */}
                    {item?.coachingDetails?.batchTiming && (
                      <div className="col-12 col-sm-6 col-lg-3">
                        <div className="d-flex align-items-start gap-2 text-gray-6">
                          <MdAccessTime
                            className="mt-1 flex-shrink-0"
                            size={19}
                            color="#d97706"
                          />
                          <div>
                            <div className="text-muted small fw-medium mb-1">
                              Timing
                            </div>
                            <div className="fw-semibold">
                              {item.coachingDetails.batchTiming}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Faculty */}
                    {item?.coachingDetails?.batchFaculty && (
                      <div className="col-12 col-sm-6 col-lg-3">
                        <div className="d-flex align-items-start gap-2 text-gray-6">
                          <MdCoPresent
                            className="mt-1 flex-shrink-0"
                            size={19}
                            color="#0288d1"
                          />
                          <div>
                            <div className="text-muted small fw-medium mb-1">
                              Faculty
                            </div>
                            <div className="fw-semibold">
                              {item.coachingDetails.batchFaculty?.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Preferred Countries Tags */}
                    {item?.purposeDetails?.preferredCountry?.length > 0 && (
                      <div className="col-12 col-sm-6 col-lg-3">
                        <div className="d-flex align-items-start gap-2 text-gray-6">
                          <MdPublic
                            className="mt-1 flex-shrink-0"
                            size={19}
                            color="#64748b"
                          />
                          <div>
                            <div className="text-muted small fw-medium mb-1">
                              Preferred Countries
                            </div>
                            <div className="d-flex flex-wrap gap-1 mt-1">
                              {item?.purposeDetails?.preferredCountry?.map(
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

                    {/* Latest Remark */}
                    {item?.coachingDetails?.remarkHistory?.length > 0 && (
                      <div className="col-12">
                        <div className="p-3 bg-light rounded border border-dashed d-flex align-items-start gap-2">
                          <MdQuestionAnswer
                            style={{
                              fontSize: "18px",
                              color: "#4f46e5",
                              marginTop: "2px",
                              flexShrink: 0,
                            }}
                          />
                          <div>
                            <div className="text-muted small fw-medium mb-1">
                              Latest Remark
                            </div>
                            <p className="mb-0 small text-dark fw-medium">
                              {
                                item.coachingDetails.remarkHistory[
                                  item.coachingDetails.remarkHistory.length - 1
                                ]?.remarks
                              }
                            </p>
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
          <div className="text-center py-5 bg-white rounded shadow-sm">
            <div className="mb-3">
              <MdInfoOutline size={48} color="#cbd5e1" />
            </div>
            <h5 className="text-muted">
              {!canRead ? "Access Denied" : "No Coaching Data Found"}
            </h5>
            <p className="text-secondary small">
              {!canRead
                ? "You do not have permission to view coaching records."
                : "Try adjusting your filters or search criteria."}
            </p>
          </div>
        )}
      </div>
      <Modal
        show={showRemarkModal}
        onHide={() => {
          setShowRemarkModal(false);
          remarkFormik.resetForm();
          setEdit({
            remarkDetails: false,
            remarkDetailsIndex: 0,
            remarkDetailsObj: null,
            studentId: null,
          });
        }}
        size="md"
        centered
      >
        <Modal.Header className="form-main-heading">
          <Modal.Title>
            {edit.remarkDetails ? "Update Remark" : "Add Remark"}
          </Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={() => {
              setShowRemarkModal(false);
              remarkFormik.resetForm();
              setEdit({
                remarkDetails: false,
                remarkDetailsIndex: 0,
                remarkDetailsObj: null,
                studentId: null,
              });
            }}
          />
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={remarkFormik.handleSubmit}>
            <Row>
              <Col className="mb-3">
                <Form.Label>Remark</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Remark"
                  className="rounded-pill"
                  name="remarkHistory[0].remark"
                  value={remarkFormik.values.remarkHistory[0].remark}
                  onChange={remarkFormik.handleChange}
                  onBlur={remarkFormik.handleBlur}
                />
                {remarkFormik.touched.remarkHistory?.[0]?.remark &&
                  remarkFormik.errors.remarkHistory?.[0]?.remark && (
                    <div className="text-danger">
                      {remarkFormik.errors.remarkHistory[0].remark}
                    </div>
                  )}
              </Col>
            </Row>
            <div className="text-end mt-4">
              <Button
                variant="primary"
                type="submit"
                className="rounded-pill px-4"
              >
                {edit.remarkDetails ? "Update" : "Add"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

CoachingStudentCard.propTypes = {
  coachingStudentData: PropTypes.array,
  currentPage: PropTypes.number,
  itemsPerPage: PropTypes.number,
  search: PropTypes.string,
  filters: PropTypes.object,
  canRead: PropTypes.bool,
  parseDate: PropTypes.func,
  formatDate: PropTypes.func,
  canUpdate: PropTypes.bool,
  canDelete: PropTypes.bool,
  userRole: PropTypes.string,
  handleEdit: PropTypes.func,
  setSelectedItem: PropTypes.func,
  setShowDeleteModal: PropTypes.func,
  handleViewAttendance: PropTypes.func,
  handleConvertToApplication: PropTypes.func,
};

export default CoachingStudentCard;
