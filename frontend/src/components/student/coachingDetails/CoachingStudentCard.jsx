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
  MdSchool,
  MdQuestionAnswer,
  MdInfoOutline,
  MdAccessTime,
  MdAppRegistration,
  MdChecklist,
  MdCoPresent,
  MdPendingActions,
} from "react-icons/md";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
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
    localStorage.getItem("crmCurrency")
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
        })
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
          updateStudentApplication(payload, edit.studentId)
        );
        if (res?.status === 200) {
          toast.success(
            edit.remarkDetails
              ? "Remark updated successfully!"
              : "Remark added successfully!"
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

  const handleDeleteRemark = async (remarksId, studentId) => {
    try {
      const payload = { remarksId };
      const res = await dispatch(deleteStudentApplication(payload, studentId));
      if (res?.status === 200) {
        toast.success("Remark deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting remark:", error);
      toast.error("Failed to delete remark");
    }
  };

  return (
    <>
      <div className="application-card-container">
        {coachingStudentData?.length > 0 ? (
          coachingStudentData?.map((item, index) => (
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
                        navigate(`/coachingdetails/${item._id}`, {
                          state: {
                            currentPage,
                            itemsPerPage,
                            search,
                            filters,
                          },
                        })
                      }
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      {item?.name || "-"}
                    </div>
                    {item?.studentId && (
                      <div className="d-flex align-items-center text-primary">
                        <AssignmentIcon
                          className="me-2 fixed-icon"
                          color="#4B0082"
                        />
                        <strong>Student ID</strong> &nbsp;
                        <strong> : </strong> &nbsp;
                        {item?.studentId || "-"}
                      </div>
                    )}
                    {item?.coachingDetails?.targetAchieved &&
                      Object.values(
                        item.coachingDetails.targetAchieved.scores || {}
                      ).some((v) => v !== null) && (
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="tooltip-target">
                              Target Achieved
                            </Tooltip>
                          }
                        >
                          <div
                            className="d-flex align-items-center text-primary"
                            style={{ cursor: "pointer" }}
                          >
                            <TaskAltIcon
                              className="me-2 fixed-icon"
                              style={{ color: "green", fontSize: 24 }}
                            />
                          </div>
                        </OverlayTrigger>
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
                                  B2B Partner{" "}
                                  {item?.b2bCompany && `(${item?.b2bCompany})`}
                                </>
                              ) : item?.created_by_type === "user" ? (
                                <>
                                  Head Office{" "}
                                  {item?.b2bCompany && `(${item?.b2bCompany})`}
                                </>
                              ) : item?.created_by_type === "Branch User" ||
                                item?.created_by_type === "Branch user" ? (
                                <>
                                  Branch Member{" "}
                                  {item?.branch && `(${item?.branch})`}
                                </>
                              ) : (
                                <>
                                  {item?.created_by_type}{" "}
                                  {item?.branch && `(${item?.branch})`}
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
                              <strong>Updated By</strong>&nbsp;:&nbsp;
                              {item?.updatedByName}
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
                              item?.mainStatus?.color || "#09D345",
                            color: "#fff",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            cursor: "pointer",
                          }}
                        >
                          {item?.mainStatus ? item?.mainStatus?.name : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="right-part d-flex flex-wrap align-items-center gap-2">
                  {item?.admissionProcessRequired && (
                    <strong
                      style={{
                        letterSpacing: "0.5px",
                        backgroundColor: "#E0F7FA",
                        color: "#006064",
                        padding: "2px 8px",
                        borderRadius: "12px",
                      }}
                    >
                      This application is a student application
                    </strong>
                  )}
                  {isCourseEnded(item?.coachingDetails?.endDate) && (
                    <strong
                      style={{
                        letterSpacing: "0.5px",
                        backgroundColor: "red",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    >
                      Course Duration Closed
                    </strong>
                  )}
                  <button
                    className="d-flex align-items-center bg-primary text-white border-0 gap-1"
                    style={{
                      borderRadius: "20px",
                      padding: "4px 10px",
                    }}
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
                    {userRole !== "B2B Admin" && userRole !== "B2B Member" && (
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
              <div className="font-sizes d-flex flex-wrap justify-content-between mb-3">
                <div className="d-flex flex-wrap">
                  <div className="course_icon_main d-flex me-5 align-items-center gap-2">
                    <span>
                      <EmailIcon fontSize="small" className="course_icon_1" />
                    </span>
                    {item?.email || "-"}
                  </div>
                  {userRole === "Super Admin" &&
                    ((item?.b2bContact && item?.b2bContact !== "na") ||
                      (item?.contact && item?.contact !== "na")) && (
                      <div className="course_icon_main d-flex me-5 align-items-center gap-2">
                        <span>
                          <PhoneIcon
                            fontSize="small"
                            className="course_icon_1"
                          />
                        </span>
                        {userRole === "Super Admin"
                          ? item?.b2bContact
                            ? item.b2bContact
                            : item?.contact
                          : item?.contact || "-"}
                      </div>
                    )}
                  {item?.coachingDetails?.targetedScore && (
                    <div className="course_icon_main d-flex me-5 align-items-center gap-2">
                      <span>
                        <SportsScoreIcon
                          fontSize="small"
                          className="course_icon_1"
                          style={{ color: "#f44336", fontSize: "20px" }}
                        />
                      </span>
                      {item?.coachingDetails?.targetedScore || "-"}
                    </div>
                  )}
                </div>
              </div>
              <div className="row font-sizes row-margin">
                {item?.coachingDetails?.city && (
                  <div className="col-12 col-md-4 p-0">
                    <p className="d-flex text-gray-6">
                      <MdLocationOn
                        className="me-2 fixed-icon"
                        color="#EA4335"
                      />
                      <strong>Location</strong>&nbsp;:&nbsp;
                      {item?.coachingDetails?.city}
                    </p>
                  </div>
                )}
                {item?.coachingDetails?.remarkHistory?.length > 0 && (
                  <div className="col-12 col-md-4 p-0">
                    <p className="d-flex text-gray-6">
                      <MdQuestionAnswer
                        className="me-2 fixed-icon"
                        color="#2A48A0"
                      />
                      <strong>Remark</strong>&nbsp;:&nbsp;
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-remark`}>
                            {item.coachingDetails.remarkHistory[
                              item.coachingDetails.remarkHistory.length - 1
                            ]?.remarks || "-"}
                          </Tooltip>
                        }
                      >
                        <span
                          className="text-truncate"
                          style={{
                            maxWidth: "200px",
                            display: "inline-block",
                            verticalAlign: "middle",
                            cursor: "pointer",
                          }}
                        >
                          {item.coachingDetails.remarkHistory[
                            item.coachingDetails.remarkHistory.length - 1
                          ]?.remarks || "-"}
                        </span>
                      </OverlayTrigger>
                    </p>
                  </div>
                )}
                {item?.purposeDetails?.preferredCountry?.length > 0 && (
                  <div className="col-12 col-md-4 p-0">
                    <p className="d-flex align-items-center text-gray-6">
                      <span className="d-flex">
                        <MdPublic className="me-2 fixed-icon" color="#6D4C41" />
                        <strong>Preferred Country</strong>&nbsp;:&nbsp;
                      </span>
                      <span className="d-flex flex-wrap gap-2">
                        {item?.purposeDetails?.preferredCountry?.map(
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
                          }
                        )}
                      </span>
                    </p>
                  </div>
                )}
                {item?.coachingDetails?.registerFor && (
                  <div className="col-12 col-md-4 p-0">
                    <p className="d-flex text-gray-6">
                      <MdAppRegistration
                        className="me-2 fixed-icon"
                        color="#2A48A0"
                      />
                      <strong>Register For</strong>&nbsp;:&nbsp;
                      {item?.coachingDetails?.registerFor?.name}
                    </p>
                  </div>
                )}
                {item?.coachingDetails?.coachingRequirement && (
                  <div className="col-12 col-md-4 p-0">
                    <p className="d-flex text-gray-6">
                      <MdChecklist
                        className="me-2 fixed-icon"
                        color="#2A48A0"
                      />
                      <strong>Coaching Requirement</strong>&nbsp;:&nbsp;
                      {item?.coachingDetails?.coachingRequirement?.name}
                    </p>
                  </div>
                )}
                {item?.coachingDetails?.startDate && (
                  <div className="col-12 col-md-4 p-0">
                    <p className="d-flex text-gray-6">
                      <MdEvent className="me-2 fixed-icon" color="#00796B" />
                      <strong>Start Date</strong>&nbsp;:&nbsp;
                      {formatDate(parseDate(item?.coachingDetails?.startDate))}
                    </p>
                  </div>
                )}
                {item?.coachingDetails?.endDate && (
                  <div className="col-12 col-md-4 p-0">
                    <p className="d-flex text-gray-6">
                      <MdEvent className="me-2 fixed-icon" color="#00796B" />
                      <strong>End Date</strong>&nbsp;:&nbsp;
                      {formatDate(parseDate(item?.coachingDetails?.endDate))}
                    </p>
                  </div>
                )}
                {item?.coachingDetails?.batchStatus && (
                  <div className="col-12 col-md-4 p-0">
                    <p className="d-flex text-gray-6">
                      <MdPendingActions
                        className="me-2 fixed-icon"
                        color="#0288D1"
                      />
                      <strong>Batch Status</strong>&nbsp;:&nbsp;
                      {item?.coachingDetails?.batchStatus}
                    </p>
                  </div>
                )}
                {item?.coachingDetails?.batchFaculty && (
                  <div className="col-12 col-md-4 p-0">
                    <p className="d-flex text-gray-6">
                      <MdCoPresent
                        className="me-2 fixed-icon"
                        color="#0288D1"
                      />
                      <strong>Batch Faculty</strong>&nbsp;:&nbsp;
                      {item?.coachingDetails?.batchFaculty?.name}
                    </p>
                  </div>
                )}
                {item?.coachingDetails?.batchTiming && (
                  <div className="col-12 col-md-4 p-0">
                    <p className="d-flex text-gray-6">
                      <MdAccessTime
                        className="me-2 fixed-icon"
                        color="#34A853"
                      />
                      <strong>Batch Timing</strong>&nbsp;:&nbsp;
                      {item?.coachingDetails?.batchTiming}
                    </p>
                  </div>
                )}
                {item?.coachingDetails?.examRegistrationDate && (
                  <div className="col-12 col-md-4 p-0">
                    <p className="d-flex text-gray-6">
                      <MdEvent className="me-2 fixed-icon" color="#00796B" />
                      <strong>Exam Registration Date</strong>
                      &nbsp;:&nbsp;
                      {formatDate(
                        parseDate(item?.coachingDetails?.examRegistrationDate)
                      )}
                    </p>
                  </div>
                )}
                {item?.coachingDetails?.remarks && (
                  <div className="col-12 col-md-4 p-0">
                    <p className="d-flex text-gray-6">
                      <MdQuestionAnswer
                        className="me-2 fixed-icon"
                        color="#2A48A0"
                      />
                      <strong>Remarks</strong>&nbsp;:&nbsp;
                      {item?.coachingDetails?.remarks}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center d-flex text-gray-6-600">
            {!canRead
              ? "You do not have permission to view this Data"
              : "No data available"}
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

export default CoachingStudentCard;
