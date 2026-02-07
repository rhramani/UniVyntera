import { useDispatch } from "react-redux";
import { getFollowupStudent } from "../../redux/actions/Student/StudentApplication.action";
import usePermissions from "../commonComponents/usePermissions";
import { useState } from "react";
import { useEffect } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import CreateIcon from "@mui/icons-material/Create";
import EmailIcon from "@mui/icons-material/Email";
import {
  MdLocationOn,
  MdPublic,
  MdCalendarToday,
  MdEventNote,
} from "react-icons/md";
import { useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { countryDropDownCourse } from "../../redux/actions/CourseFinder.action";
import Select from "react-select";
import { decryptData } from "../../utils/encryptionUtils";
import Pageheader from "../../layouts/Pageheader";

const FollowupStudent = () => {
  const dispatch = useDispatch();
  const [followupStudentData, setFollowupStudentData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const { canRead } = usePermissions("Followup Students");
  const userRole = decryptData(localStorage.getItem("role"));

  const [filters, setFilters] = useState({
    date: "",
    country: "",
    type: "",
  });
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const startDateInputRef = useRef(null);
  const [preferredCountries, setPreferredCountries] = useState([]);

  const fetchFollowupStudent = async (
    page = 1,
    limit = itemsPerPage,
    searchTerm = "",
    date = filters.date,
    country = filters.country,
    type = filters.type,
  ) => {
    try {
      const res = await dispatch(
        getFollowupStudent(page, limit, searchTerm, date, country, type),
      );
      setFollowupStudentData(res?.data?.data?.data || []);
      setTotalPages(res?.data?.data?.totalPages || 0);
      setTotalRecords(res?.data?.data?.totalRecords || 0);
    } catch (error) {
      console.error("Error fetching followup student data:", error);
    }
  };

  const fetchPreferredCountries = async () => {
    try {
      const res = await dispatch(countryDropDownCourse());
      setPreferredCountries(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching preferred countries:", error);
    }
  };

  useEffect(() => {
    fetchPreferredCountries();
  }, []);

  useEffect(() => {
    if (canRead) {
      fetchFollowupStudent(
        currentPage,
        itemsPerPage,
        search,
        filters.date,
        filters.country,
        filters.type,
      );
    }
  }, [currentPage, itemsPerPage, search, filters]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const formatDate = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      return new Date(`${year}-${month}-${day}`);
    }
    if (dateStr.includes("-")) {
      return new Date(dateStr);
    }
    return null;
  };

  const toISODate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const followupTypeOption = [
    { value: "personalDetails", label: "Personal Details" },
    { value: "documentDetails", label: "Document" },
    { value: "interestedCourse", label: "Course Selection" },
    { value: "visaApplication", label: "Visa Application" },
  ];

  const selectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "12px",
      color: "black",
    }),
    placeholder: (base) => ({
      ...base,
      color: "black",
      fontSize: "13px",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
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

  return (
    <>
      <Pageheader
        mainheading="Followup Students"
        parentfolder="Applications"
        activepage="Followup Students"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div className="card-title">Followup Students</div>
            </Card.Header>
            <Card.Body>
              {canRead && (
                <>
                  <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
                    <div className="filter-item">
                      <Form.Label>Followup Date</Form.Label>
                      <div style={{ position: "relative" }}>
                        <Form.Control
                          type="text"
                          className="filter-height"
                          placeholder="dd/mm/yyyy"
                          value={
                            filters.date
                              ? formatDate(parseDate(filters.date))
                              : ""
                          }
                          readOnly
                          ref={startDateInputRef}
                          onClick={() => {
                            if (filters.date) {
                              setStartDateValue(parseDate(filters.date));
                            }
                            setShowStartDateCalendar((show) => !show);
                          }}
                          style={{
                            cursor: "pointer",
                            backgroundColor: "#fff",
                            width: "100%",
                          }}
                        />
                        {filters.date ? (
                          <button
                            type="button"
                            onClick={() => {
                              setFilters({ ...filters, date: "" });
                              setStartDateValue(null);
                              setShowStartDateCalendar(false);
                            }}
                            style={{
                              position: "absolute",
                              right: 8,
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              fontSize: 16,
                              color: "#888",
                              padding: 0,
                              zIndex: 10000,
                            }}
                            aria-label="Clear date"
                          >
                            ×
                          </button>
                        ) : (
                          <MdCalendarToday
                            style={{
                              position: "absolute",
                              right: 10,
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#888",
                              pointerEvents: "none",
                            }}
                            size={20}
                          />
                        )}
                        {showStartDateCalendar && (
                          <div
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: "0",
                              zIndex: 9999,
                              background: "#fff",
                              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                              borderRadius: "8px",
                              marginTop: "4px",
                              width: 300,
                              minWidth: 300,
                              maxWidth: 300,
                            }}
                          >
                            <Calendar
                              className="form-control m-0 p-0 border-0"
                              onChange={(selectedDate) => {
                                setStartDateValue(selectedDate);
                                setFilters({
                                  ...filters,
                                  date: toISODate(selectedDate),
                                });
                                setShowStartDateCalendar(false);
                                setCurrentPage(1);
                              }}
                              value={startDateValue}
                              locale="en-GB"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="filter-item">
                      <Form.Label>Country</Form.Label>
                      <Select
                        className="filter-height"
                        styles={selectStyles}
                        classNamePrefix="select"
                        value={
                          filters.country
                            ? {
                                value: filters.country,
                                label:
                                  preferredCountries?.find(
                                    (c) => c === filters.country,
                                  ) || filters.country,
                              }
                            : null
                        }
                        onChange={(selected) => {
                          setFilters({
                            ...filters,
                            country: selected ? selected.value : "",
                          });
                          setCurrentPage(1);
                        }}
                        options={preferredCountries?.map((country) => ({
                          value: country?.name,
                          label: country?.name,
                        }))}
                        placeholder="Select Country"
                        isClearable
                        isSearchable
                        noOptionsMessage={() => "No countries available"}
                      />
                    </div>

                    <div className="filter-item">
                      <Form.Label>Type</Form.Label>
                      <Select
                        className="filter-height"
                        styles={selectStyles}
                        classNamePrefix="select"
                        options={followupTypeOption?.map((item) => ({
                          value: item.value,
                          label: item.label,
                        }))}
                        value={
                          filters.type
                            ? {
                                value: filters.type,
                                label: filters.type,
                              }
                            : null
                        }
                        onChange={(selected) => {
                          setFilters({
                            ...filters,
                            type: selected ? selected.value : "",
                          });
                          setCurrentPage(1);
                        }}
                        placeholder="Select Type"
                        isClearable
                        isSearchable
                        noOptionsMessage={() => "No types available"}
                      />
                    </div>

                    <div className="flex-grow-1"></div>
                    <div className="filter-item">
                      <div className="contact-search3">
                        <button type="button" className="btn border-0">
                          <i
                            className="fe fe-search fw-semibold text-muted"
                            aria-hidden="true"
                          ></i>
                        </button>
                        <Form.Control
                          type="text"
                          className="filter-height border-0"
                          id="typehead1"
                          placeholder="Search here..."
                          autoComplete="off"
                          value={search}
                          onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                          }}
                        />
                      </div>
                    </div>
                    <div className="filter-item-rows">
                      <ItemsPerPageSelect
                        itemsPerPage={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                      />
                    </div>

                    <div className="d-flex align-items-center">
                      <div className="filter-item filter-height total-records px-3 d-flex align-items-center">
                        <span>
                          Total Records :<strong> {totalRecords}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="application-card-container">
                {followupStudentData?.length > 0 ? (
                  followupStudentData?.map((item, index) => (
                    <div
                      key={item._id}
                      className="application-card bg-white border border-gray-200 rounded-lg shadow-sm mb-3 rounded"
                    >
                      <div className="application-card-1 mb-3">
                        <div className="left-part">
                          <div className="d-flex flex-wrap align-items-center gap-3">
                            <div
                              className="left-part-1"
                              style={{
                                cursor: "auto",
                              }}
                            >
                              {item?.name || "-"}
                            </div>
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
                                          {item?.b2bCompany &&
                                            `(${item?.b2bCompany})`}
                                        </>
                                      ) : item?.created_by_type === "user" ? (
                                        <>
                                          Head Office{" "}
                                          {item?.b2bCompany &&
                                            `(${item?.b2bCompany})`}
                                        </>
                                      ) : item?.created_by_type ===
                                          "Branch User" ||
                                        item?.created_by_type ===
                                          "Branch user" ? (
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
                                  {item?.mainStatus
                                    ? item?.mainStatus?.name
                                    : ""}
                                </span>
                              </div>
                            )}
                          </div>
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
                      </div>
                      <div className="font-sizes d-flex flex-wrap justify-content-between mb-3">
                        <div className="d-flex flex-wrap">
                          <div className="course_icon_main d-flex me-5 align-items-center gap-2">
                            <span>
                              <EmailIcon
                                fontSize="small"
                                className="course_icon_1"
                              />
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
                        </div>
                      </div>
                      <div className="row font-sizes row-margin">
                        {item?.city && (
                          <div className="col-12 col-md-4 p-0">
                            <p className="d-flex text-gray-6">
                              <MdLocationOn
                                className="me-2 fixed-icon"
                                color="#EA4335"
                              />
                              <strong>Location</strong>&nbsp;:&nbsp;
                              {item?.city}
                            </p>
                          </div>
                        )}
                        {item?.purposeDetails?.preferredCountry?.length > 0 && (
                          <div className="col-12 col-md-4 p-0">
                            <p className="d-flex align-items-center text-gray-6">
                              <span className="d-flex">
                                <MdPublic
                                  className="me-2 fixed-icon"
                                  color="#6D4C41"
                                />
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
                                  },
                                )}
                              </span>
                            </p>
                          </div>
                        )}
                        {item?.followUps && (
                          <div className="row g-1">
                            {Object.entries(item.followUps).map(
                              ([key, followup]) => {
                                const title = key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase());

                                // Color coding for status
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
                                                statusColors[
                                                  followup?.status
                                                ] || "#9E9E9E",
                                              color: "#fff",
                                              borderRadius: "10px",
                                            }}
                                          >
                                            {followup?.status || "-"}
                                          </span>
                                        </div>
                                        <MdEventNote
                                          color="#6C757D"
                                          size={18}
                                        />
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
                                                parseDate(
                                                  followup.nextFollowUpDate,
                                                ),
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
                              },
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center d-flex text-gray-6-600 justify-content-center">
                    {!canRead
                      ? "You do not have permission to view this Data"
                      : "No data available"}
                  </div>
                )}
              </div>
              {totalPages > 1 && followupStudentData?.length > 0 && (
                <Paginations
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default FollowupStudent;
