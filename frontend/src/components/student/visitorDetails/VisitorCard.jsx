import AssignmentIcon from "@mui/icons-material/Assignment";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PersonIcon from "@mui/icons-material/Person";
import CreateIcon from "@mui/icons-material/Create";
import { RiChatSmile2Fill } from "react-icons/ri";
import {
  MdCake,
  MdCalendarToday,
  MdCardTravel,
  MdCategory,
  MdFace,
  MdLocationOn,
  MdMessage,
  MdPerson,
  MdPublic,
} from "react-icons/md";
import { FaAppStore, FaWhatsapp } from "react-icons/fa";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import usePermissions from "../../commonComponents/usePermissions";
import { decryptData } from "../../../utils/encryptionUtils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import getSymbolFromCurrency from "currency-symbol-map";

const VisitorCard = ({
  allVisitorApplication,
  formatDate,
  parseDate,
  getColors,
  handleChatOpen,
  setSelectedLeadName,
  setSelectedMobileNumber,
  setIsWhatsappModalOpen,
  setSelecteWaDaddyWhatsappdData,
  setIsWaDaddyWhatsappModalOpen,
  handleEdit,
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
  setCloneModalOpen,
  setSelectedVisitor,
}) => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showFollowUps, setShowFollowUps] = useState({});

  const userRole = decryptData(localStorage.getItem("role"));

  const { canCreate, canRead, canUpdate, canDelete } = usePermissions(
    "Visitor Applications"
  );
  const storedEncryptedCurrency = decryptData(
    localStorage.getItem("crmCurrency")
  );

  return (
    <>
      <div className="application-card-container">
        {allVisitorApplication?.length > 0 ? (
          allVisitorApplication?.map((item, index) => {
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
                          navigate(`/visitordetails/${item._id}`, {
                            state: {
                              selectedBranch,
                              mainStatus,
                              search,
                              currentPage,
                              itemsPerPage,
                              showAll,
                              selectedCountry,
                              followUpDate,
                            },
                          })
                        }
                      >
                        {item?.name || "-"}
                      </div>
                      {item?.studentId && (
                        <div className="d-flex align-items-center text-primary">
                          <AssignmentIcon
                            className="me-2 fixed-icon"
                            color="#4B0082"
                          />
                          <strong>Visitor ID</strong> &nbsp;
                          <strong> : </strong> &nbsp;
                          {item?.studentId || "-"}
                        </div>
                      )}
                      {item?.otherCountriesApplied &&
                        item?.otherCountriesApplied?.length > 0 && (
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip>
                                {item?.otherCountriesApplied?.join(", ")}
                              </Tooltip>
                            }
                          >
                            <span
                              style={{
                                backgroundColor: "#053880",
                                color: "#fff",
                                padding: "0 6px",
                                borderRadius: "50px",
                                fontSize: "0.875rem",
                                cursor: "pointer",
                              }}
                            >
                              {`+${item?.otherCountriesApplied?.length}`}
                            </span>
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
                                      ` (${item?.b2bCompany})`}
                                  </>
                                ) : item?.created_by_type === "Branch User" ||
                                  item?.created_by_type === "Branch user" ? (
                                  <>
                                    Branch Member
                                    {item?.branch && ` (${item?.branch})`}
                                  </>
                                ) : (
                                  <>
                                    {item?.created_by_type}
                                    {item?.branch && ` (${item?.branch})`}
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
                            }}
                          >
                            {item?.mainStatus ? item.mainStatus?.name : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="right-part d-flex align-items-start">
                    {(canUpdate || canCreate) && (
                      <>
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
                                item?.contact?.replace(/[^\d]/g, "") || "",
                            });
                            setIsWaDaddyWhatsappModalOpen(true);
                          }}
                        />
                        {userRole !== "B2B Admin" &&
                          userRole !== "B2B Member" && (
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
                                        ? item?.b2bContact?.replace(
                                            /[^\d]/g,
                                            ""
                                          )
                                        : item?.contact?.replace(/[^\d]/g, "")
                                    )
                                  : setSelectedMobileNumber(
                                      item?.contact
                                        ? item?.contact?.replace(/[^\d]/g, "")
                                        : ""
                                    );
                                setIsWhatsappModalOpen(true);
                              }}
                            />
                          )}
                      </>
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
                          onClick={() => {
                            navigate(`/visitordetails/${item._id}`, {
                              state: {
                                selectedBranch,
                                mainStatus,
                                search,
                                currentPage,
                                itemsPerPage,
                                showAll,
                                selectedCountry,
                                followUpDate,
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
                      {(canCreate || canUpdate) && (
                        <MenuItem
                          onClick={() => {
                            setCloneModalOpen(true);
                            setSelectedVisitor(item);
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
                              ? item?.b2bContact
                              : item?.contact
                            : item?.contact
                            ? item?.contact
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

                  {item?.age ?? item?.age === 0 ? (
                    <div className="col-12 col-md-4 p-0">
                      <p className="d-flex text-gray-6">
                        <MdPerson className="me-2 fixed-icon" color="#4A90E2" />
                        <strong>Age</strong>
                        <strong>&nbsp;:&nbsp;</strong>
                        {item?.age}
                      </p>
                    </div>
                  ) : null}

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

                  {item?.passportNumber && (
                    <div className="col-12 col-md-4 p-0">
                      <p className="d-flex text-gray-6">
                        <MdCardTravel
                          className="me-2 fixed-icon"
                          color="#27ae60"
                        />
                        <strong>Passport Number</strong>
                        <strong>&nbsp;:&nbsp;</strong>
                        {item?.passportNumber}
                      </p>
                    </div>
                  )}
                  {item?.categoryDetails?.type && (
                    <div className="col-12 col-md-4 p-0">
                      <p className="d-flex text-gray-6">
                        <MdCategory
                          className="me-2 fixed-icon"
                          color="#2A48A0"
                        />
                        <strong>Category</strong>
                        <strong>&nbsp;:&nbsp;</strong>
                        {item?.categoryDetails?.type}
                      </p>
                    </div>
                  )}

                  {item?.preferredCountry && (
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
                          {(() => {
                            const name = item?.preferredCountry || "N/A";
                            const { bg, text } = getColors(name);
                            return (
                              <span
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
                          })()}
                        </span>
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
                          ?.filter(Boolean)
                          ?.join(", ")}
                      </p>
                    </div>
                  )}

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
                  {showFollowUps[index] && item?.followUps && (
                    <div className="row g-1">
                      {Object.entries(item.followUps)?.map(
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
                                          parseDate(followup.nextFollowUpDate)
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
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
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
    </>
  );
};

export default VisitorCard;
