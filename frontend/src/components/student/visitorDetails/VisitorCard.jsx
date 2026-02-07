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
    "Visitor Applications",
  );
  const storedEncryptedCurrency = decryptData(
    localStorage.getItem("crmCurrency"),
  );

  return (
    <>
      <div className="application-card-container">
        {allVisitorApplication?.length > 0 ? (
          allVisitorApplication?.map((item, index) => {
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
                        </h5>
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
                                className="ms-2 px-2 py-0 rounded-pill shadow-sm"
                                style={{
                                  backgroundColor: "#5D54BE",
                                  color: "#fff",
                                  fontSize: "0.75rem",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                }}
                              >
                                {`+${item?.otherCountriesApplied?.length}`}
                              </span>
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
                                    B2B Partner{" "}
                                    {item?.b2bCompany &&
                                      `(${item?.b2bCompany})`}
                                  </>
                                ) : item?.created_by_type === "user" ? (
                                  <>
                                    Head Office{" "}
                                    {item?.b2bCompany &&
                                      `(${item?.b2bCompany})`}
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
                              <strong style={{ opacity: 0.8 }}>
                                Created By
                              </strong>
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
                              <strong style={{ opacity: 0.8 }}>
                                Updated By
                              </strong>
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

                  <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 ms-md-auto">
                    {item?.dueAmount > 0 && (
                      <div
                        className="px-2 px-md-3 py-1 text-white rounded-pill shadow-sm d-flex align-items-center gap-2"
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
                      {(canUpdate || canCreate) && (
                        <div className="d-flex gap-1 me-2 bg-light p-1 rounded-pill border">
                          <IconButton
                            size="small"
                            style={{ color: "#007bff" }}
                            onClick={() => handleChatOpen(item)}
                            title="Chat"
                          >
                            <RiChatSmile2Fill size={20} />
                          </IconButton>
                          <IconButton
                            size="small"
                            style={{ color: "#ff9800" }}
                            onClick={() => {
                              setSelecteWaDaddyWhatsappdData({
                                name: item?.name || "",
                                mobile:
                                  item?.contact?.replace(/[^\d]/g, "") || "",
                              });
                              setIsWaDaddyWhatsappModalOpen(true);
                            }}
                            title="Message"
                          >
                            <MdMessage size={20} />
                          </IconButton>
                          {userRole !== "B2B Admin" &&
                            userRole !== "B2B Member" && (
                              <IconButton
                                size="small"
                                style={{ color: "#25D366" }}
                                onClick={() => {
                                  setSelectedLeadName(item?.name || "");
                                  userRole === "Super Admin"
                                    ? setSelectedMobileNumber(
                                        item?.b2bContact
                                          ? item?.b2bContact?.replace(
                                              /[^\d]/g,
                                              "",
                                            )
                                          : item?.contact?.replace(
                                              /[^\d]/g,
                                              "",
                                            ),
                                      )
                                    : setSelectedMobileNumber(
                                        item?.contact
                                          ? item?.contact?.replace(/[^\d]/g, "")
                                          : "",
                                      );
                                  setIsWhatsappModalOpen(true);
                                }}
                                title="WhatsApp"
                              >
                                <FaWhatsapp size={20} />
                              </IconButton>
                            )}
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
                </div>

                {/* --- CONTENT SECTION --- */}
                <div className="px-4 py-4">
                  <div className="row g-4">
                    {/* Status Box */}
                    {item?.mainStatus && (
                      <div className="col-12">
                        <div
                          className="d-inline-flex align-items-center gap-3 p-3 bg-light border border-light"
                          style={{
                            borderRadius: "12px",
                            width: "fit-content",
                            maxWidth: "100%",
                          }}
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

                    {/* Created Date */}
                    <div className="col-12 col-sm-6 col-lg-3">
                      <div className="d-flex align-items-start gap-2 text-gray-6">
                        <MdCalendarToday
                          className="mt-1 flex-shrink-0"
                          size={19}
                          color="#34A853"
                        />
                        <div>
                          <div className="text-muted small fw-medium mb-1">
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
                            <div className="text-muted small fw-medium mb-1">
                              DOB
                            </div>
                            <div className="fw-semibold">
                              {formatDate(parseDate(item.DOB))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Age */}
                    {(item?.age ?? item?.age === 0) && (
                      <div className="col-12 col-sm-6 col-lg-3">
                        <div className="d-flex align-items-start gap-2 text-gray-6">
                          <MdPerson
                            className="mt-1 flex-shrink-0"
                            size={19}
                            color="#4A90E2"
                          />
                          <div>
                            <div className="text-muted small fw-medium mb-1">
                              Age
                            </div>
                            <div className="fw-semibold">{item?.age}</div>
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
                            <div className="text-muted small fw-medium mb-1">
                              Gender
                            </div>
                            <div className="fw-semibold">{item?.gender}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Passport */}
                    {item?.passportNumber && (
                      <div className="col-12 col-sm-6 col-lg-3">
                        <div className="d-flex align-items-start gap-2 text-gray-6">
                          <MdCardTravel
                            className="mt-1 flex-shrink-0"
                            size={19}
                            color="#27ae60"
                          />
                          <div>
                            <div className="text-muted small fw-medium mb-1">
                              Passport Number
                            </div>
                            <div className="fw-semibold">
                              {item?.passportNumber}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Category */}
                    {item?.categoryDetails?.type && (
                      <div className="col-12 col-sm-6 col-lg-3">
                        <div className="d-flex align-items-start gap-2 text-gray-6">
                          <MdCategory
                            className="mt-1 flex-shrink-0"
                            size={19}
                            color="#2A48A0"
                          />
                          <div>
                            <div className="text-muted small fw-medium mb-1">
                              Category
                            </div>
                            <div className="fw-semibold">
                              {item?.categoryDetails?.type}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Preferred Country */}
                    {item?.preferredCountry && (
                      <div className="col-12 col-sm-6 col-lg-3">
                        <div className="d-flex align-items-start gap-2 text-gray-6">
                          <MdPublic
                            className="mt-1 flex-shrink-0"
                            size={19}
                            color="#6D4C41"
                          />
                          <div>
                            <div className="text-muted small fw-medium mb-1">
                              Preferred Country
                            </div>
                            <div className="fw-semibold">
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
                            </div>
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
                            <div className="text-muted small fw-medium mb-1">
                              Location
                            </div>
                            <div className="fw-semibold">
                              {[item?.city, item?.state, item?.country]
                                ?.filter(Boolean)
                                ?.join(", ")}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Follow Ups Section */}
                  <div className="mt-4 border-top pt-3">
                    <Form.Check
                      type="checkbox"
                      label="Show Follow Up"
                      id={`followup-checkbox-${index}`}
                      className="custom-checkbox cursor-pointer mb-3 fw-semibold text-primary"
                      checked={showFollowUps[index] || false}
                      onChange={() => {
                        setShowFollowUps((prev) => ({
                          ...prev,
                          [index]: !prev[index],
                        }));
                      }}
                    />
                    {showFollowUps[index] && item?.followUps && (
                      <div className="row g-3">
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
                              <div
                                className="col-12 col-md-6"
                                key={followup._id}
                              >
                                <div
                                  className="p-3 border rounded shadow-sm h-100"
                                  style={{
                                    backgroundColor: "#fff",
                                    borderLeft: `4px solid ${
                                      statusColors[followup?.status] ||
                                      "#9E9E9E"
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
                                          display: "inline-block",
                                          marginTop: "4px",
                                        }}
                                      >
                                        {followup?.status || "-"}
                                      </span>
                                    </div>
                                  </div>
                                  <div
                                    className="mt-3"
                                    style={{
                                      fontSize: "13px",
                                      color: "#555",
                                    }}
                                  >
                                    <p className="mb-1 d-flex gap-2">
                                      <strong className="text-muted">
                                        Next Follow-up:
                                      </strong>{" "}
                                      <span className="fw-semibold">
                                        {followup?.nextFollowUpDate
                                          ? formatDate(
                                              parseDate(
                                                followup.nextFollowUpDate,
                                              ),
                                            )
                                          : "-"}
                                      </span>
                                    </p>
                                    <p className="mb-1 d-flex gap-2">
                                      <strong className="text-muted">
                                        Remarks:
                                      </strong>{" "}
                                      <span className="fw-semibold">
                                        {followup?.remarks || "-"}
                                      </span>
                                    </p>
                                    {followup?.updatedByName && (
                                      <p className="mb-0 d-flex gap-2">
                                        <strong className="text-muted">
                                          Updated By:
                                        </strong>{" "}
                                        <span className="fw-semibold">
                                          {followup.updatedByName}
                                        </span>
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-5 bg-white rounded shadow-sm">
            <div className="text-muted mb-2">
              <VisibilityIcon sx={{ fontSize: 48, opacity: 0.2 }} />
            </div>
            <p className="fw-semibold text-gray-6">
              {!canRead
                ? "You do not have permission to view this Data"
                : "No data available"}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default VisitorCard;
