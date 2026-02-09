import {
  Button,
  Card,
  Col,
  Modal,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { IconButton, Menu, MenuItem, Slider, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { AiOutlineClose } from "react-icons/ai";
import PublicIcon from "@mui/icons-material/Public";
import LoadMoreButton from "../../../commonComponents/LoadMoreButton";
import { REACT_APP_API_URL } from "../../../../baseUrl";
import usePermissions from "../../../commonComponents/usePermissions";
import { useState } from "react";
import {
  FaBolt,
  FaBook,
  FaCalculator,
  FaCamera,
  FaChartBar,
  FaCode,
  FaCogs,
  FaGlobe,
  FaMusic,
  FaRocket,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";
import getSymbolFromCurrency from "currency-symbol-map";
import ALLImages from "../../../../common/Imagedata";
import DeleteConfirmModal from "../../../bulkMessage/commonDeleteModal/DeleteConfirmModal";

const CourseFinderCard = ({
  showSlider,
  totalRecords,
  hasSearched,
  courseFinderData,
  isLoading,
  showDeleteModal,
  loadedRecords,
  handleLoadMore,
  selectedIds,
  getINRValue,
  handleCheckboxChangeId,
  handleEdit,
  setSelectedItem,
  setShowDeleteModal,
  handleDelete,
  selectedItem,
  handleView,
  relexFilterMsg,
  minPrice,
  maxPrice,
  handleChange,
  valuetext,
  handleMinChange,
  handleMaxChange,
  userRole,
  handleApplyClick,
  canUpload,
  canDownload,
  handleFileChnage,
  fileKey,
  courseDownload,
  handleAllDownload,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Course Finder");

  const hexToRgba = (hex, alpha = 0.2) => {
    let r = 0,
      g = 0,
      b = 0;
    hex = hex.replace("#", "");
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const icons = [
    FaCode,
    FaCalculator,
    FaBook,
    FaChartBar,
    FaCogs,
    FaGlobe,
    FaBolt,
    FaCamera,
    FaMusic,
    FaRocket,
  ];

  const getIconForTag = (tag) => {
    const idValue = tag._id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = idValue % icons.length;
    const Icon = icons[index];
    return <Icon />;
  };

  const tagColors = [
    { bg: "#D1FAE5", text: "#047857" }, // green
    { bg: "#DBEAFE", text: "#1D4ED8" }, // blue
    { bg: "#EDE9FE", text: "#6D28D9" }, // purple
    { bg: "#FEF3C7", text: "#B45309" }, // yellow
    { bg: "#FECACA", text: "#B91C1C" }, // red
    { bg: "#F5D0FE", text: "#A21CAF" }, // pink
    { bg: "#C7D2FE", text: "#3730A3" }, // indigo
  ];

  const getColorForRequirement = (name) => {
    const index =
      [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      tagColors.length;
    return tagColors[index];
  };

  return (
    <>
      <Row className="row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card
            className="custom-card transcation-crypto"
            style={{
              background: "white",
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 32px rgba(107, 92, 231, 0.1)",
              borderRadius: "16px",
              overflow: "hidden",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
          >
            <Card.Header
              className="border-bottom-0"
              style={{
                background: "transparent",
                borderRadius: "16px 16px 0 0",
                borderBottom: "1px solid #e2e8f0",
                padding: "20px",
              }}
            >
              <div className="w-100">
                {/* Price Slider Section - Full width on mobile, responsive on larger screens */}
                {showSlider && (
                  <div className="mb-4 mb-md-3">
                    <div
                      className="bg-white p-3 p-md-4"
                      style={{
                        borderRadius: "12px",
                        maxWidth: "100%",
                        boxShadow: "0 4px 12px rgba(107, 92, 231, 0.15)",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <Box sx={{ width: "100%" }}>
                        <Slider
                          getAriaLabel={() => "Range"}
                          value={[minPrice, maxPrice]}
                          onChange={handleChange}
                          valueLabelDisplay="auto"
                          getAriaValueText={valuetext}
                          max={100000}
                          sx={{
                            "& .MuiSlider-track": {
                              background:
                                "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                            },
                            "& .MuiSlider-thumb": {
                              background:
                                "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                            },
                          }}
                        />
                        <div className="d-flex flex-row flex-sm-row gap-2 mt-2">
                          <TextField
                            label="Min"
                            type="number"
                            value={minPrice}
                            onChange={handleMinChange}
                            size="small"
                            sx={{
                              width: "100%",
                              maxWidth: "120px",
                              "& .MuiOutlinedInput-root": {
                                background: "#f8fafc",
                              },
                            }}
                          />
                          <TextField
                            label="Max"
                            type="number"
                            value={maxPrice}
                            onChange={handleMaxChange}
                            size="small"
                            sx={{
                              width: "100%",
                              maxWidth: "120px",
                              "& .MuiOutlinedInput-root": {
                                background: "#f8fafc",
                              },
                            }}
                          />
                        </div>
                      </Box>
                    </div>
                  </div>
                )}

                {/* Controls Section - Responsive layout */}
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-stretch gap-3">
                  {/* Action Buttons - Right aligned on large screens, full width on mobile */}
                  <div className="d-flex flex-wrap justify-content-start justify-content-lg-start gap-2 w-100 w-lg-auto">
                    <div
                      className="d-grid gap-2"
                      style={{
                        gridTemplateColumns: "repeat(2, 1fr)",
                        width: "100%",
                        display: "none",
                      }}
                    >
                      {/* Mobile grid layout - hidden by default, shown only on mobile */}
                    </div>

                    {/* Desktop layout - shown on md and up */}
                    <div className="d-none d-md-flex flex-wrap justify-content-start justify-content-lg-end gap-2">
                      {canUpload && (
                        <a
                          href={`https://studyvisaconsultant.com/api/public/sampleCourseBulkUpload/sampleCourseBulkUpload.xlsx`}
                          download
                          className="custom-select-height btn btn-primary btn-icon-text d-inline-flex align-items-center justify-content-center"
                          style={{
                            whiteSpace: "nowrap",
                            textDecoration: "none",
                            fontSize: "14px",
                            padding: "8px 16px",
                            background: "#e0e7ff",
                            color: "#6B5CE7",
                            border: "none",
                            borderRadius: "8px",
                            transition: "all 0.2s ease",
                            minWidth: "140px",
                          }}
                        >
                          <i className="fe fe-download me-2 fs-14"></i> Get
                          Sample File
                        </a>
                      )}
                      {canUpload && (
                        <>
                          <label
                            htmlFor="fileUpload"
                            className="custom-select-height btn btn-primary btn-icon-text d-inline-flex align-items-center justify-content-center"
                            style={{
                              cursor: "pointer",
                              whiteSpace: "nowrap",
                              fontSize: "14px",
                              padding: "8px 16px",
                              background: "#e0e7ff",
                              color: "#6B5CE7",
                              border: "none",
                              borderRadius: "8px",
                              transition: "all 0.2s ease",
                              minWidth: "120px",
                            }}
                          >
                            <i className="fe fe-upload-cloud me-2 fs-14"></i>{" "}
                            Bulk Upload
                          </label>

                          <input
                            key={fileKey}
                            type="file"
                            id="fileUpload"
                            accept=".xlsx, .xls, .csv"
                            onChange={handleFileChnage}
                            style={{ display: "none" }}
                          />
                        </>
                      )}
                      {userRole !== "Student" &&
                        userRole !== "LeadStudent" &&
                        canDownload && (
                          <button
                            type="button"
                            className="custom-select-height btn btn-primary btn-icon-text d-inline-flex align-items-center justify-content-center"
                            style={{
                              whiteSpace: "nowrap",
                              fontSize: "14px",
                              padding: "8px 16px",
                              background: "#e0e7ff",
                              color: "#6B5CE7",
                              border: "none",
                              borderRadius: "8px",
                              transition: "all 0.2s ease",
                              minWidth: "110px",
                            }}
                            onClick={courseDownload}
                          >
                            <i className="fe fe-download-cloud me-2 fs-14"></i>{" "}
                            Download
                          </button>
                        )}
                      {userRole === "Super Admin" && (
                        <button
                          type="button"
                          className="custom-select-height btn btn-primary btn-icon-text d-inline-flex align-items-center justify-content-center"
                          style={{
                            whiteSpace: "nowrap",
                            fontSize: "14px",
                            padding: "8px 16px",
                            background: "#e0e7ff",
                            color: "#6B5CE7",
                            border: "none",
                            borderRadius: "8px",
                            transition: "all 0.2s ease",
                            minWidth: "120px",
                          }}
                          onClick={handleAllDownload}
                        >
                          <i className="fe fe-download-cloud me-2 fs-14"></i>{" "}
                          All Download
                        </button>
                      )}
                    </div>

                    {/* Mobile layout - shown only on xs and sm */}
                    <div className="d-md-none" style={{ width: "100%" }}>
                      <div className="row g-2">
                        {canUpload && (
                          <div className="col-6">
                            <a
                              href={`https://studyvisaconsultant.com/api/public/sampleCourseBulkUpload/sampleCourseBulkUpload.xlsx`}
                              download
                              className="custom-select-height btn btn-primary btn-icon-text d-flex align-items-center justify-content-center w-100"
                              style={{
                                whiteSpace: "nowrap",
                                textDecoration: "none",
                                fontSize: "14px",
                                padding: "8px 16px",
                                background: "#e0e7ff",
                                color: "#6B5CE7",
                                border: "none",
                                borderRadius: "8px",
                                transition: "all 0.2s ease",
                                height: "100%",
                              }}
                            >
                              <i className="fe fe-download me-2 fs-14"></i>
                              <span className="d-none d-xxs-inline">Get</span>
                              <span className="d-xxs-none">Sample</span>
                            </a>
                          </div>
                        )}
                        {canUpload && (
                          <div className="col-6">
                            <label
                              htmlFor="fileUpload"
                              className="custom-select-height btn btn-primary btn-icon-text d-flex align-items-center justify-content-center w-100"
                              style={{
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                fontSize: "14px",
                                padding: "8px 16px",
                                background: "#e0e7ff",
                                color: "#6B5CE7",
                                border: "none",
                                borderRadius: "8px",
                                transition: "all 0.2s ease",
                                height: "100%",
                              }}
                            >
                              <i className="fe fe-upload-cloud me-2 fs-14"></i>
                              <span className="d-none d-xxs-inline">Bulk</span>
                              <span className="d-xxs-none">Upload</span>
                            </label>
                            <input
                              key={fileKey}
                              type="file"
                              id="fileUpload"
                              accept=".xlsx, .xls, .csv"
                              onChange={handleFileChnage}
                              style={{ display: "none" }}
                            />
                          </div>
                        )}
                        {userRole !== "Student" &&
                          userRole !== "LeadStudent" &&
                          canDownload && (
                            <div className="col-6">
                              <button
                                type="button"
                                className="custom-select-height btn btn-primary btn-icon-text d-flex align-items-center justify-content-center w-100"
                                style={{
                                  whiteSpace: "nowrap",
                                  fontSize: "14px",
                                  padding: "8px 16px",
                                  background: "#e0e7ff",
                                  color: "#6B5CE7",
                                  border: "none",
                                  borderRadius: "8px",
                                  transition: "all 0.2s ease",
                                  height: "100%",
                                }}
                                onClick={courseDownload}
                              >
                                <i className="fe fe-download-cloud me-2 fs-14"></i>
                                Download
                              </button>
                            </div>
                          )}
                        {userRole === "Super Admin" && (
                          <div className="col-6">
                            <button
                              type="button"
                              className="custom-select-height btn btn-primary btn-icon-text d-flex align-items-center justify-content-center w-100"
                              style={{
                                whiteSpace: "nowrap",
                                fontSize: "14px",
                                padding: "8px 16px",
                                background: "#e0e7ff",
                                color: "#6B5CE7",
                                border: "none",
                                borderRadius: "8px",
                                transition: "all 0.2s ease",
                                height: "100%",
                              }}
                              onClick={handleAllDownload}
                            >
                              <i className="fe fe-download-cloud me-2 fs-14"></i>
                              All
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Total Records - Left aligned on large screens, full width on mobile */}
                  <div className="d-flex justify-content-start justify-content-lg-end">
                    <div
                      className="custom-select-height total-records px-4 py-2 d-flex align-items-center"
                      style={{
                        background: "#e0e7ff",
                        borderRadius: "20px",
                        color: "#6B5CE7",
                        fontWeight: "500",
                        minWidth: "fit-content",
                        height: "fit-content",
                      }}
                    >
                      <span style={{ whiteSpace: "nowrap" }}>
                        Total Records: <strong>{totalRecords}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Header>
            <Card.Body style={{ padding: "25px" }}>
              <div className="mb-4">
                {hasSearched &&
                  relexFilterMsg &&
                  relexFilterMsg !== "Courses fetched successfully" &&
                  relexFilterMsg !== "No matching courses found." && (
                    <div
                      className="alert alert-info d-flex align-items-center"
                      role="alert"
                      style={{
                        background:
                          "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
                        border: "1px solid #fbbf24",
                        borderRadius: "12px",
                        padding: "15px 20px",
                      }}
                    >
                      <div
                        className="d-flex align-items-center"
                        style={{
                          width: "24px",
                          height: "24px",
                          background: "#f59e0b",
                          color: "white",
                          borderRadius: "50%",
                          fontSize: "14px",
                          fontWeight: "bold",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: "12px",
                        }}
                      >
                        !
                      </div>
                      <div>
                        <strong>{relexFilterMsg}</strong>
                      </div>
                    </div>
                  )}
              </div>
              <div className="my-4">
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-xl-3 row-cols-xxl-3 g-4">
                  {courseFinderData?.length > 0
                    ? courseFinderData?.map((item, index) => (
                        <div key={index} className="col">
                          <div
                            className="card h-100 border-0 course_card"
                            style={{
                              position: "relative",
                              background: "#fff",
                              borderRadius: "16px",
                              overflow: "hidden",
                              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
                              transition:
                                "transform 0.3s ease, box-shadow 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform =
                                "translateY(-5px)";
                              e.currentTarget.style.boxShadow =
                                "0 20px 40px rgba(0, 0, 0, 0.1)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow =
                                "0 10px 25px rgba(0, 0, 0, 0.15)";
                            }}
                          >
                            {item?.status === "Inactive" && (
                              <div
                                className="position-absolute top-0 start-0 bg-danger text-white px-3 py-1 rounded-end rounded-bottom"
                                style={{ zIndex: 10 }}
                              >
                                Course Unavailable
                              </div>
                            )}
                            <div className="card-body p-4">
                              <div className="d-flex justify-content-between align-items-start mb-3 gap-2">
                                <div className="d-flex align-items-center gap-3 flex-grow-1">
                                  <div
                                    className="university-logo-main"
                                    style={{
                                      minWidth: "60px",
                                      minHeight: "60px",
                                    }}
                                  >
                                    <img
                                      src={`${REACT_APP_API_URL}/${item?.university?.profile?.replace(
                                        /\\/g,
                                        "/",
                                      )}`}
                                      alt="University Logo"
                                      className="university-logo rounded-circle"
                                      style={{
                                        width: "60px",
                                        height: "60px",
                                        objectFit: "cover",
                                        // border: "2px solid #e2e8f0",
                                      }}
                                    />
                                  </div>
                                  <div className="flex-grow-1">
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip>
                                          {item?.university?.instituteName ||
                                            "-"}
                                        </Tooltip>
                                      }
                                    >
                                      <h6
                                        className="institute_name text-dark mb-1"
                                        style={{
                                          fontSize: "16px",
                                          fontWeight: "600",
                                          cursor: "pointer",
                                          lineHeight: 1.3,
                                        }}
                                      >
                                        {item?.university?.instituteName || "-"}
                                      </h6>
                                    </OverlayTrigger>
                                    <span className="text-muted small">
                                      {item?.studyLevel[0]?.name || "-"}
                                    </span>
                                  </div>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                  {userRole !== "Student" &&
                                    userRole !== "LeadStudent" && (
                                      <div className="form-check form-switch custom-toggle-button me-0">
                                        <input
                                          className="form-check-input three-dots-icon"
                                          type="checkbox"
                                          id={`toggle-${index}`}
                                          checked={selectedIds.includes(
                                            item._id,
                                          )}
                                          onChange={() =>
                                            handleCheckboxChangeId(item?._id)
                                          }
                                        />
                                      </div>
                                    )}
                                  {canCreate && (
                                    <>
                                      <IconButton
                                        aria-label="more"
                                        aria-controls={`menu-${index}`}
                                        aria-haspopup="true"
                                        onClick={(e) => {
                                          setOpenDropdown(
                                            openDropdown === index
                                              ? null
                                              : index,
                                          );
                                          setAnchorEl(e.currentTarget);
                                        }}
                                        style={{
                                          color: "#64748b",
                                          padding: "8px",
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
                                            boxShadow:
                                              "0px 4px 12px rgba(0, 0, 0, 0.1)",
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
                                            <span className="edit-action-text">
                                              Edit
                                            </span>
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
                                            <span className="delete-action-text">
                                              Delete
                                            </span>
                                          </MenuItem>
                                        )}
                                        <MenuItem
                                          onClick={() => {
                                            handleView(item);
                                            setOpenDropdown(null);
                                          }}
                                        >
                                          <VisibilityIcon
                                            fontSize="small"
                                            sx={{ mr: 1 }}
                                            className="view-icon"
                                          />
                                          <span className="view-action-text">
                                            View
                                          </span>
                                        </MenuItem>
                                      </Menu>
                                    </>
                                  )}
                                </div>
                              </div>

                              <h5
                                className="course_program_title text-primary mb-3"
                                onClick={() => handleView(item)}
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                  color: "#6B5CE7",
                                  transition: "color 0.2s ease",
                                }}
                                onMouseEnter={(e) =>
                                  (e.target.style.color = "#7B68EE")
                                }
                                onMouseLeave={(e) =>
                                  (e.target.style.color = "#6B5CE7")
                                }
                              >
                                {item?.programName || "-"}
                              </h5>

                              <div className="d-flex align-items-center mb-3 text-muted small">
                                <span className="me-1">
                                  <PublicIcon
                                    className="course_icon_1"
                                    style={{
                                      fontSize: "16px",
                                      verticalAlign: "middle",
                                    }}
                                  />
                                </span>
                                <span className="text-capitalize">
                                  {item?.university?.country || "-"}
                                  {item?.university?.state
                                    ? `, ${item?.university?.state}`
                                    : ""}
                                  {item?.university?.city
                                    ? `, ${item?.university?.city}`
                                    : ""}
                                </span>
                              </div>

                              <div className="tag-pill-container mb-3">
                                {item?.tags?.length > 0 &&
                                  item?.tags?.map((tag) => (
                                    <span
                                      key={tag._id}
                                      className="tag-pill d-inline-flex align-items-center me-2 mb-2 gap-1 px-3 py-1"
                                      style={{
                                        backgroundColor: hexToRgba(
                                          tag.color || "#667eea",
                                          0.1,
                                        ),
                                        borderRadius: "20px",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                        color: tag.color || "#667eea",
                                        border: `1px solid ${hexToRgba(tag.color || "#667eea", 0.3)}`,
                                      }}
                                    >
                                      {getIconForTag(tag)}
                                      {tag.name}
                                    </span>
                                  ))}
                              </div>

                              <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <span
                                    className="fw-bold"
                                    // style={{ fontWeight: "500" }}
                                  >
                                    Application Fee:
                                  </span>
                                  <span
                                    className="text-muted"
                                    style={{ fontSize: "14px" }}
                                  >
                                    {item.applicationFee &&
                                    item.currencyCode ? (
                                      <>
                                        {getSymbolFromCurrency(
                                          item.currencyCode,
                                        ) || item.currencyCode}
                                        &nbsp;
                                        {new Intl.NumberFormat().format(
                                          Number(
                                            String(item.applicationFee).replace(
                                              /,/g,
                                              "",
                                            ),
                                          ),
                                        )}
                                      </>
                                    ) : item.applicationFee ? (
                                      new Intl.NumberFormat().format(
                                        Number(
                                          String(item.applicationFee).replace(
                                            /,/g,
                                            "",
                                          ),
                                        ),
                                      )
                                    ) : (
                                      "N/A"
                                    )}
                                  </span>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <span
                                    className="fw-bold"
                                    // style={{ fontWeight: "500" }}
                                  >
                                    Yearly Tuition Fee:
                                  </span>
                                  <span
                                    className="text-muted"
                                    style={{ fontSize: "14px" }}
                                  >
                                    {item.yearlyTuitionFee &&
                                    item.currencyCode ? (
                                      <>
                                        {getSymbolFromCurrency(
                                          item.currencyCode,
                                        ) || item.currencyCode}
                                        &nbsp;
                                        {new Intl.NumberFormat().format(
                                          Number(
                                            String(
                                              item.yearlyTuitionFee,
                                            ).replace(/,/g, ""),
                                          ),
                                        )}
                                        <OverlayTrigger
                                          placement="top"
                                          overlay={
                                            <Tooltip>
                                              {getINRValue(
                                                item.yearlyTuitionFee,
                                                item.currencyCode,
                                              )}
                                            </Tooltip>
                                          }
                                        >
                                          <span
                                            style={{
                                              position: "relative",
                                              display: "inline-block",
                                              marginLeft: "8px",
                                              cursor: "pointer",
                                            }}
                                          >
                                            <img
                                              src={ALLImages("course1")}
                                              height="16px"
                                              width="16px"
                                              alt="INR"
                                              style={{ opacity: 0.7 }}
                                            />
                                          </span>
                                        </OverlayTrigger>
                                      </>
                                    ) : item.yearlyTuitionFee ? (
                                      <>
                                        {new Intl.NumberFormat().format(
                                          Number(
                                            String(
                                              item.yearlyTuitionFee,
                                            ).replace(/,/g, ""),
                                          ),
                                        )}
                                      </>
                                    ) : (
                                      "N/A"
                                    )}
                                  </span>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <span
                                    className="fw-bold"
                                    // style={{ fontWeight: "500" }}
                                  >
                                    Duration:
                                  </span>
                                  <span
                                    className="text-muted"
                                    style={{ fontSize: "14px" }}
                                  >
                                    {item?.duration || "N/A"}
                                  </span>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <span
                                    className="fw-bold"
                                    // style={{ fontWeight: "500" }}
                                  >
                                    Intake Months:
                                  </span>
                                  <span
                                    className="text-muted"
                                    style={{ fontSize: "14px" }}
                                  >
                                    {item?.intakes && item.intakes.length > 0
                                      ? item.intakes
                                          .map((intake) => intake.month)
                                          .join(", ")
                                      : "N/A"}
                                  </span>
                                </div>

                                <div className="d-flex justify-content-between align-items-center">
                                  <span
                                    className="fw-bold"
                                    // style={{ fontWeight: "500" }}
                                  >
                                    Intake Years:
                                  </span>
                                  <span
                                    className="text-muted"
                                    style={{ fontSize: "14px" }}
                                  >
                                    {item?.intakeYear &&
                                    item.intakeYear.length > 0
                                      ? item.intakeYear.join(", ")
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>

                              <div
                                className="mb-3 p-3 rounded-lg"
                                style={{ background: "#f8fafc" }}
                              >
                                <div className="d-flex justify-content-between align-items-center mb-2 gap-3">
                                  <span
                                    className="fw-bold"
                                    style={{
                                      minWidth: "70px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    Level:
                                  </span>
                                  <span
                                    className="text-muted"
                                    style={{
                                      fontSize: "14px",
                                      lineHeight: "1.5",
                                      textAlign: "right",
                                      flex: 1,
                                    }}
                                  >
                                    {item?.studyLevel?.length > 0
                                      ? item.studyLevel
                                          .map((level) => level.name)
                                          .join(", ")
                                      : "N/A"}
                                  </span>
                                </div>

                                <div>
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span
                                      className="fw-bold"
                                      // style={{ fontWeight: "500" }}
                                    >
                                      Requirements:
                                    </span>
                                  </div>
                                  <div className="d-flex flex-wrap gap-2">
                                    {item?.requirements?.length > 0 ? (
                                      item.requirements.map((req, idx) => {
                                        const name = req?.name || "N/A";
                                        const { bg, text } =
                                          getColorForRequirement(name);
                                        return (
                                          <span
                                            key={idx}
                                            className="px-3 py-1 rounded"
                                            style={{
                                              backgroundColor: bg,
                                              color: text,
                                              fontSize: "14px",
                                              fontWeight: 500,
                                            }}
                                          >
                                            {name}
                                          </span>
                                        );
                                      })
                                    ) : (
                                      <span className="text-muted small">
                                        N/A
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 gap-2">
                                <div className="d-flex align-items-center gap-3">
                                  {item.websiteUrl && (
                                    <a
                                      href={item.websiteUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-decoration-none"
                                      style={{ color: "#00b2c5" }}
                                    >
                                      <FaGlobe
                                        style={{
                                          fontSize: "20px",
                                        }}
                                      />
                                    </a>
                                  )}
                                  {item.university?.youtubeLink && (
                                    <a
                                      href={item.university?.youtubeLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-decoration-none"
                                      style={{ color: "#FF0033" }}
                                    >
                                      <FaYoutube
                                        style={{
                                          fontSize: "22px",
                                        }}
                                      />
                                    </a>
                                  )}
                                  {item.university?.galleryLink && (
                                    <a
                                      href={item.university?.galleryLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-decoration-none"
                                      style={{ color: "#E1306C" }}
                                    >
                                      <FaInstagram
                                        className="instagram-icon"
                                        style={{
                                          fontSize: "22px",
                                        }}
                                      />
                                    </a>
                                  )}
                                </div>
                                <div className="d-flex flex-wrap gap-2">
                                  <button
                                    className="btn btn-primary rounded_button"
                                    onClick={() => handleApplyClick(item)}
                                    style={{
                                      background:
                                        "linear-gradient(135deg, #6B5CE7 0%, #7B68EE 100%)",
                                      border: "none",
                                      borderRadius: "8px",
                                      padding: "8px 16px",
                                      fontWeight: "500",
                                      transition: "all 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.transform = "scale(1.05)";
                                      e.target.style.boxShadow =
                                        "0 4px 12px rgba(79, 70, 229, 0.3)";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.transform = "scale(1)";
                                      e.target.style.boxShadow = "none";
                                    }}
                                  >
                                    Apply Now
                                  </button>
                                  <button
                                    className="btn btn-outline-primary rounded_button"
                                    onClick={() => handleView(item)}
                                    style={{
                                      border: "1px solid #6B5CE7",
                                      color: "#6B5CE7",
                                      borderRadius: "8px",
                                      padding: "8px 16px",
                                      fontWeight: "500",
                                      transition: "all 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.background = "#4f46e5";
                                      e.target.style.color = "white";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.background = "transparent";
                                      e.target.style.color = "#4f46e5";
                                    }}
                                  >
                                    Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    : !isLoading && (
                        <div className="w-100 d-flex justify-content-center align-items-center py-5">
                          <div className="text-center">
                            <div
                              className="mb-3"
                              style={{ fontSize: "3rem", color: "#cbd5e1" }}
                            >
                              📚
                            </div>
                            <h5 className="text-muted">No courses found</h5>
                            <p className="text-muted">
                              Try adjusting your search criteria
                            </p>
                          </div>
                        </div>
                      )}
                </div>
              </div>

              <DeleteConfirmModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={() => handleDelete(selectedItem)}
              />

              <LoadMoreButton
                isLoading={isLoading}
                loadedRecords={loadedRecords}
                totalRecords={totalRecords}
                onLoadMore={handleLoadMore}
              />
              {/* {totalPages > 1 && courseFinderData.length > 0 && (
                <Paginations
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              )} */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CourseFinderCard;
