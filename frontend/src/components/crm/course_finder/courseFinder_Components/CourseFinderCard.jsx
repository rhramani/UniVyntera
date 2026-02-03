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
  handleApplyClick
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
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div className="w-100 d-flex justify-content-between align-items-center">
                <div className="card-title w-50">Course Finder</div>
                <div className="d-flex align-items-center justify-content-between gap-4">
                  {showSlider && (
                    <div>
                      <Box sx={{ width: 300 }}>
                        <Slider
                          getAriaLabel={() => "Range"}
                          value={[minPrice, maxPrice]}
                          onChange={handleChange}
                          valueLabelDisplay="auto"
                          getAriaValueText={valuetext}
                          max={100000}
                        />
                        <div className="d-flex gap-2">
                          <TextField
                            label="Min"
                            type="number"
                            value={minPrice}
                            onChange={handleMinChange}
                            size="small"
                            sx={{ width: 100 }}
                          />
                          <TextField
                            label="Max"
                            type="number"
                            value={maxPrice}
                            onChange={handleMaxChange}
                            size="small"
                            sx={{ width: 100 }}
                          />
                        </div>
                      </Box>
                    </div>
                  )}
                  <div className="custom-select-height total-records px-3 mt-2 mt-md-0 d-flex align-items-center h-6 w-15">
                    <span style={{ whiteSpace: "nowrap" }}>
                      Total Records: <strong>{totalRecords}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div>
                {hasSearched &&
                  relexFilterMsg &&
                  relexFilterMsg !== "Courses fetched successfully" &&
                  relexFilterMsg !== "No matching courses found." && (
                    // <div
                    //   className="text-muted mt-1 update-warning mb-3"
                    //   style={{ fontSize: "14px" }}
                    // >
                    //   {relexFilterMsg}
                    // </div>
                    <div
                      style={{
                        padding: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="card"
                        style={{
                          border: "1px solid #FFD600",
                          borderRadius: "10px",
                          padding: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor: "#FFF9C4",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div
                            style={{
                              backgroundColor: "#FFD600",
                              color: "#333",
                              borderRadius: "50%",
                              width: "18px",
                              height: "18px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginRight: "10px",
                              fontSize: "14px",
                              fontWeight: "bold",
                            }}
                          >
                            !
                          </div>
                          <div>
                            <h5
                              style={{
                                margin: 0,
                                fontSize: "14px",
                                fontWeight: "bold",
                              }}
                            >
                              {relexFilterMsg}
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
              <div className="my-4">
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-xl-3 row-cols-xxl-4 g-4">
                  {courseFinderData?.length > 0
                    ? courseFinderData?.map((item, index) => (
                        <div key={index} className="col">
                          <div
                            className="card h-100 border-0 course_card"
                            style={{ position: "relative" }}
                          >
                            <div className="card-body">
                              {item?.status === "Inactive" && (
                                <div className="notification-unavailable">
                                  Course Unavailable
                                </div>
                              )}
                              <div className="d-flex justify-content-between align-items-center mb-2 gap-2">
                                <div className="d-flex align-items-center gap-3">
                                  <div className="university-logo-main">
                                    <img
                                      src={`${REACT_APP_API_URL}/${item?.university?.profile?.replace(
                                        /\\/g,
                                        "/"
                                      )}`}
                                      alt="University Logo"
                                      className="university-logo"
                                    />
                                  </div>
                                  <div className="tooltip-wrapper">
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip>
                                          {item?.university?.instituteName ||
                                            "-"}
                                        </Tooltip>
                                      }
                                    >
                                      <span
                                        className="institute_name text-dark"
                                        style={{
                                          fontSize: "17px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <strong>
                                          {item?.university?.instituteName ||
                                            "-"}
                                        </strong>
                                      </span>
                                    </OverlayTrigger>
                                  </div>
                                </div>
                                <div className="d-flex align-items-center">
                                  {userRole !== "Student" && userRole !== "LeadStudent" && (
                                    <div className="form-check form-switch custom-toggle-button me-0">
                                      <input
                                        className="form-check-input three-dots-icon"
                                        type="checkbox"
                                        id={`toggle-${index}`}
                                        checked={selectedIds.includes(item._id)}
                                        onChange={() =>
                                          handleCheckboxChangeId(item?._id)
                                        }
                                      />
                                    </div>
                                  )}
                                  {canCreate && (
                                    <IconButton
                                      aria-label="more"
                                      aria-controls={`menu-${index}`}
                                      aria-haspopup="true"
                                      onClick={(e) => {
                                        setOpenDropdown(
                                          openDropdown === index ? null : index
                                        );
                                        setAnchorEl(e.currentTarget);
                                      }}
                                    >
                                      <MoreVertIcon className="three-dots-icon" />
                                    </IconButton>
                                  )}
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
                                </div>
                              </div>
                              <div className="program-name-wrapper">
                                <span
                                  className="text-primary"
                                  style={{
                                    fontSize: "18px",
                                    color: "#053880",
                                  }}
                                >
                                  {item?.studyLevel[0]?.name || "-"}
                                </span>
                                <h5
                                  className="course_program_title text-primary mb-3"
                                  onClick={() => handleView(item)}
                                >
                                  {item?.programName || "-"}
                                </h5>
                              </div>
                              <div className="d-flex flex-wrap justify-content-between mb-3">
                                <div className="d-flex">
                                  <span className="me-1">
                                    <PublicIcon className="course_icon_1" />
                                  </span>
                                  <span
                                    className="text-muted"
                                    style={{ fontSize: "18px" }}
                                  >
                                    {item?.university?.country || "-"}
                                    {item?.university?.state
                                      ? `, ${item?.university?.state}`
                                      : ""}
                                    {item?.university?.city
                                      ? `, ${item?.university?.city}`
                                      : ""}
                                  </span>
                                </div>
                              </div>

                              <div className="tag-pill-container">
                                {item?.tags?.length > 0 &&
                                  item?.tags?.map((tag) => (
                                    <span
                                      key={tag._id}
                                      className="tag-pill d-inline-flex align-items-center me-2 mb-2 gap-1"
                                      style={{
                                        backgroundColor: hexToRgba(
                                          tag.color || "#d0e2ff",
                                          0.2
                                        ),
                                        borderRadius: "20px",
                                        padding: "2px 8px",
                                        fontSize: "13px",
                                        fontWeight: 500,
                                        color: tag.color || "#000",
                                      }}
                                    >
                                      {getIconForTag(tag)}
                                      {tag.name}
                                    </span>
                                  ))}
                              </div>

                              <div className="horizontal_line mb-3"></div>
                              <p className="course_card_main">
                                <span className="span-1">
                                  Application Fee&nbsp;:&nbsp;
                                </span>
                                <span className="span-2">
                                  {item.applicationFee && item.currencyCode ? (
                                    <>
                                      {getSymbolFromCurrency(
                                        item.currencyCode
                                      ) || item.currencyCode}
                                      &nbsp;
                                      {new Intl.NumberFormat().format(
                                        Number(
                                          String(item.applicationFee).replace(
                                            /,/g,
                                            ""
                                          )
                                        )
                                      )}
                                    </>
                                  ) : item.applicationFee ? (
                                    new Intl.NumberFormat().format(
                                      Number(
                                        String(item.applicationFee).replace(
                                          /,/g,
                                          ""
                                        )
                                      )
                                    )
                                  ) : (
                                    "N/A"
                                  )}
                                </span>
                              </p>

                              <p className="course_card_main">
                                <span className="span-1">
                                  Yearly Tuition Fee :{" "}
                                </span>
                                <span
                                  className="span-2"
                                  style={{
                                    position: "relative",
                                    display: "inline-block",
                                  }}
                                >
                                  {item.yearlyTuitionFee &&
                                  item.currencyCode ? (
                                    <>
                                      {getSymbolFromCurrency(
                                        item.currencyCode
                                      ) || item.currencyCode}
                                      &nbsp;
                                      {new Intl.NumberFormat().format(
                                        Number(
                                          String(item.yearlyTuitionFee).replace(
                                            /,/g,
                                            ""
                                          )
                                        )
                                      )}
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>
                                            {getINRValue(
                                              item.yearlyTuitionFee,
                                              item.currencyCode
                                            )}
                                          </Tooltip>
                                        }
                                      >
                                        <span
                                          style={{
                                            position: "absolute",
                                            top: "-11px",
                                            right: "-5px",
                                            cursor: "pointer",
                                          }}
                                        >
                                          <img
                                            src={ALLImages("course1")}
                                            height="15px"
                                            width="15px"
                                            style={{ marginBottom: "15px" }}
                                            alt=""
                                          />
                                        </span>
                                      </OverlayTrigger>
                                    </>
                                  ) : item.yearlyTuitionFee ? (
                                    <>
                                      {new Intl.NumberFormat().format(
                                        Number(
                                          String(item.yearlyTuitionFee).replace(
                                            /,/g,
                                            ""
                                          )
                                        )
                                      )}
                                    </>
                                  ) : (
                                    "N/A"
                                  )}
                                </span>
                              </p>

                              <p className="course_card_main">
                                <span className="span-1">
                                  Duration&nbsp;:&nbsp;
                                </span>
                                <span className="span-2">
                                  {item?.duration || "N/A"}
                                </span>
                              </p>
                              <p className="course_card_main">
                                <span className="span-1">
                                  Intake Months&nbsp;:&nbsp;
                                </span>
                                <span className="span-2">
                                  {item?.intakes && item.intakes.length > 0
                                    ? item.intakes
                                        .map((intake) => intake.month)
                                        .join(", ")
                                    : "N/A"}
                                </span>
                              </p>
                              <p className="course_card_main">
                                <span className="span-1">
                                  Intake Years&nbsp;:&nbsp;
                                </span>
                                <span className="span-2">
                                  {item?.intakeYear &&
                                  item.intakeYear.length > 0
                                    ? item.intakeYear.join(", ")
                                    : "N/A"}
                                </span>
                              </p>
                              <p className="course_card_main text-gray-6 bg-light-purple text-dark px-2 py-1">
                                <span className="span-1">
                                  Level&nbsp;:&nbsp;
                                </span>
                                <span className="span-2">
                                  {item?.studyLevel?.length > 0
                                    ? item.studyLevel
                                        .map((level) => level.name)
                                        .join(", ")
                                    : "N/A"}
                                </span>
                              </p>
                              <p className="course_card_main text-gray-6 mb-3 text-dark px-2 py-1 rounded">
                                <span className="span-1">
                                  Requirements&nbsp;:&nbsp;
                                </span>
                                <span className="span-2 d-flex flex-wrap gap-2">
                                  {item?.requirements?.length > 0
                                    ? item.requirements.map((req, idx) => {
                                        const name = req?.name || "N/A";
                                        const { bg, text } =
                                          getColorForRequirement(name);
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
                                      })
                                    : "N/A"}
                                </span>
                              </p>
                              <div className="horizontal_line"></div>
                              <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 gap-2">
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "20px",
                                  }}
                                >
                                  {item.websiteUrl && (
                                    <a
                                      href={item.websiteUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <FaGlobe
                                        style={{
                                          fontSize: "24px",
                                          color: "#00b2c5",
                                        }}
                                      />
                                    </a>
                                  )}
                                  {item.university?.youtubeLink && (
                                    <a
                                      href={item.university?.youtubeLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <FaYoutube
                                        style={{
                                          fontSize: "26px",
                                          color: "white",
                                          background: "#FF0033",
                                          borderRadius: "50%",
                                          padding: "5px",
                                        }}
                                      />
                                    </a>
                                  )}
                                  {item.university?.galleryLink && (
                                    <a
                                      href={item.university?.galleryLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <FaInstagram
                                        className="instagram-icon"
                                        style={{
                                          fontSize: "26px",
                                          color: "#E1306C",
                                        }}
                                      />
                                    </a>
                                  )}
                                </div>
                                <div className="d-flex flex-wrap gap-2">
                                  <button
                                    className="btn btn-primary rounded_button"
                                    onClick={() => handleApplyClick(item)}
                                  >
                                    Apply Now
                                  </button>
                                  <button
                                    className="btn btn-outline-primary rounded_button"
                                    onClick={() => handleView(item)}
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
                        <div className="w-100 d-flex justify-content-center">
                          No data available
                        </div>
                      )}
                </div>
              </div>

              <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                centered
              >
                <Modal.Header className="form-main-heading">
                  <Modal.Title className="fw-semibold">
                    Confirm Deletion
                  </Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={() => setShowDeleteModal(false)}
                  />
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                  <div className="text-danger text-primary fs-1 mb-3">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                  </div>
                  <p className="mb-1 fw-semibold">
                    Are you sure you want to delete this item?
                  </p>
                  <small className="text-muted">
                    This action cannot be undone.
                  </small>
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
