import React, { useEffect } from "react";
import Pageheader from "../../layouts/Pageheader";
import LoadMoreButton from "../commonComponents/LoadMoreButton";
import usePermissions from "../commonComponents/usePermissions";
import Paginations from "../elements/Paginations";
import {
  visaProcessReportsExport,
  visaProcessReportsGet,
} from "../../redux/actions/Report/StudentApplicationReport.action";
import Select from "react-select";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useState } from "react";
import { useRef } from "react";
import { MdCalendarToday } from "react-icons/md";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { BASEURL } from "../../baseUrl";
import { getAllVisaStatus } from "../../redux/actions/Master/VisaStatus.action";
import { countryDropDownCourse } from "../../redux/actions/CourseFinder.action";

const VisaProcessReports = () => {
  const dispatch = useDispatch();
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [visaProcessReports, setVisaProcessReports] = useState([]);
  const [search, setSearch] = useState("");
  const { canRead, canDownload } = usePermissions("Visa Process");
  const [isLoading, setIsLoading] = useState(false);
  const [visaStatus, setVisaStatus] = useState([]);
  const [preferredCountries, setPreferredCountries] = useState([]);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: { value: "approved", label: "Approved" },
    country: "",
  });

  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const startDateInputRef = useRef(null);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [endDateValue, setEndDateValue] = useState(null);
  const endDateInputRef = useRef(null);

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

  const visaStatusOptions = [
    { value: "filed", label: "Filed" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const countryOptions = preferredCountries?.map((country) => ({
    value: country?.name,
    label: country?.name,
  }));

  const columns = [
    {
      label: "Student Id",
      key: "studentId",
    },
    {
      label: "VFS Date",
      render: (item) => {
        const dateStr = item?.visaApplicationDetails?.VFSAppointmentDateTime;

        if (!dateStr) return "-";

        const vfsDate = new Date(dateStr);
        if (isNaN(vfsDate.getTime())) return "-";

        return vfsDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          timeZone: "UTC",
        });
      },
    },
    {
      label: "Student Name",
      key: "name",
    },
    {
      label: "Type",
      render: (item) => {
        const type = item?.created_by_type;

        if (type === "B2B Admin" || type === "B2B Member") {
          return "B2B";
        } else if (type === "Branch" || type === "Branch User") {
          return "Branch";
        } else if (type === "user") {
          return "Head Office";
        } else {
          return "-";
        }
      },
    },
    {
      label: "Created By",
      render: (item) =>
        // item?.b2bCompany
        //   ? item.b2bCompany
        //   : item?.branch
        //   ? item.branch
        //   : item?.visaApplicationDetails?.createdByName || "",
        item?.visaApplicationDetails?.createdByName || "",
    },
    {
      label: "Status",
      key: "status",
      render: (item) => {
        const status = item?.visaApplicationDetails?.status || "New";
        const matchedStatus = visaStatus?.find(
          (statusItem) => statusItem.name === status
        );
        const bgColor = matchedStatus?.color || "#0b3c8c";
        const textColor = ["#e9e216", "#1fff44"].includes(bgColor)
          ? "#000000"
          : "#ffffff";
        const displayStatus = status || "New";

        return (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{displayStatus}</Tooltip>}
          >
            <span
              style={{
                backgroundColor: bgColor,
                color: textColor,
                cursor: "pointer",
                padding: "1px 8px",
                borderRadius: "30px",
                display: "inline-block",
                maxWidth: "180px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {displayStatus}
            </span>
          </OverlayTrigger>
        );
      },
    },
    {
      label: "Preferred Country",
      render: (item) =>
        item?.purposeDetails?.preferredCountry?.join(", ") || "-",
    },
    {
      label: "Institute Name",
      key: "instituteName",
      render: (item) => {
        const displayValues = item?.interestedCourseDetails?.length
          ? item?.interestedCourseDetails
              ?.filter(
                (detail) => detail?.instituteFeePayment?.feeStatus === "paid"
              )
              ?.map((detail) => {
                const instituteName = detail?.institute?.instituteName || "-";
                const campusName = detail?.campus?.campus;
                return campusName
                  ? `${instituteName} - ${campusName}`
                  : instituteName;
              })
              .join(", ")
          : "-";

        return (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{displayValues}</Tooltip>}
          >
            <span style={{ cursor: "pointer" }}>{displayValues || "-"}</span>
          </OverlayTrigger>
        );
      },
    },
    {
      label: "Course Name",
      key: "programName",
      render: (item) => {
        const displayValues = item?.interestedCourseDetails?.length
          ? item?.interestedCourseDetails
              ?.filter(
                (detail) => detail?.instituteFeePayment?.feeStatus === "paid"
              )
              ?.map((detail) => detail?.course?.programName || "-")
              .join(", ")
          : "-";

        return (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{displayValues}</Tooltip>}
          >
            <span style={{ cursor: "pointer" }}>{displayValues || "-"}</span>
          </OverlayTrigger>
        );
      },
    },
    {
      label: "Intake Year",
      key: "intakeYear",
      render: (item) => {
        const displayValues = item?.interestedCourseDetails?.length
          ? item?.interestedCourseDetails
              ?.filter(
                (detail) => detail?.instituteFeePayment?.feeStatus === "paid"
              )
              ?.map((detail) => detail?.intakeYear || "-")
              .join(", ")
          : "-";

        return <span>{displayValues || "-"}</span>;
      },
    },
    {
      label: "Email Id",
      key: "email",
    },
    {
      label: "Phone Number",
      key: "contact",
    },
  ];

  const fetchVisaProcessReport = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    startDate = filters.startDate,
    endDate = filters.endDate,
    status = filters.status?.value || "approved",
    country = filters.country?.value || ""
  ) => {
    try {
      const res = await dispatch(
        visaProcessReportsGet(
          page,
          limit,
          search,
          startDate,
          endDate,
          status,
          country
        )
      );
      setVisaProcessReports(res?.data?.data?.data || []);
      setTotalRecords(res?.data?.data?.totalRecords || 0);
      setTotalPages(res?.data?.data?.totalPages || 0);
    } catch (error) {
      console.error("Error fetching visa process reports:", error);
      setVisaProcessReports([]);
    }
  };

  //   const handleExport = async () => {
  //     try {
  //       let idsToExport = selectedIds;
  //       if (selectedIds.length === 0) {
  //         const res = await dispatch(
  //           visaProcessReportsGet(
  //             1,
  //             10000,
  //             search,
  //             filters.startDate,
  //             filters.endDate,
  //             filters.status?.value || "approved",
  //             filters.country?.value || "",
  //           )
  //         );
  //         idsToExport = res?.data?.data?.data?.map((item) => item._id) || [];
  //       }
  //       const response = await dispatch(
  //         visaProcessReportsExport(idsToExport)
  //       );
  //       if (response?.status === 200 && response?.data?.fileUrl) {
  //         const fileUrl = `${BASEURL}${response.data.fileUrl}`;
  //         const link = document.createElement("a");
  //         link.href = fileUrl;
  //         link.setAttribute("download", "visa_process.csv");
  //         document.body.appendChild(link);
  //         link.click();
  //         document.body.removeChild(link);
  //         toast.success("Visa Process report downloaded successfully!");
  //         setSelectedIds([]);
  //       }
  //     } catch (error) {
  //       console.error("Error exporting reports:", error);
  //     }
  //   };

  const handleExport = async () => {
    try {
      setIsLoading(true);

      const res = await dispatch(
        visaProcessReportsGet(
          1,
          Number.MAX_SAFE_INTEGER,
          search,
          filters.startDate,
          filters.endDate,
          filters.status?.value || "approved",
          filters.country?.value || ""
        )
      );

      const allVisaProcessReports = res?.data?.data?.data || [];

      if (!allVisaProcessReports || allVisaProcessReports.length === 0) {
        toast.error("No data available to export.");
        setIsLoading(false);
        return;
      }

      const headers = columns.map((col) => col.label);

      const rows = allVisaProcessReports.map((item) => {
        return columns.map((col) => {
          let value = col.render ? col.render(item) : item[col.key] || "-";
          if (
            (col.key === "status" ||
              col.key === "instituteName" ||
              col.key === "programName") &&
            React.isValidElement(value)
          ) {
            value = value.props.children.props.children || "-";
          }
          if (col.key === "intakeYear" && React.isValidElement(value)) {
            value = value.props.children || "-";
          }
          return String(value).replace(/"/g, '""');
        });
      });

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", "visa_process_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Visa Process report downloaded successfully!");
    } catch (error) {
      console.error("Error exporting reports:", error);
      toast.error("Something went wrong while exporting the report.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchVisaProcessReport(
        currentPage,
        itemsPerPage,
        search,
        filters.startDate,
        filters.endDate,
        filters.status?.value || "approved",
        filters.country?.value || ""
      );
    }
  }, [currentPage, itemsPerPage, search, filters]);

  const fetchVisaStatus = async () => {
    try {
      const res = await dispatch(getAllVisaStatus());
      if (res?.status === 200) {
        setVisaStatus(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching student statuses:", error);
    }
  };

  const fetchPreferredCountries = async () => {
    try {
      const res = await dispatch(countryDropDownCourse());
      setPreferredCountries(res?.data?.data || []);
    } catch (error) {
      console.log("Error fetching preferred countries:", error);
      setPreferredCountries([]);
    }
  };

  useEffect(() => {
    fetchVisaStatus();
    fetchPreferredCountries();
  }, []);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <>
      <Pageheader
        mainheading="Visa Process"
        parentfolder="Reports"
        activepage="Visa Process"
      />

      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <LoadMoreButton isLoading={isLoading} />
        </div>
      )}

      <Row className="mt-2">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div className="w-100 d-flex flex-wrap justify-content-end">
                {/* <div className="card-title">Visa Process report</div> */}
                <div className="d-flex flex-wrap gap-2">
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
                  {visaProcessReports?.length > 0 && canDownload && (
                    <Button
                      variant="primary"
                      className="custom-select-height px-3"
                      onClick={() => handleExport()}
                    >
                      Export Report
                    </Button>
                  )}
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap align-items-end gap-2 mb-3">
                <div className="filter-item">
                  <Form.Label>Start Date</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      className="filter-height"
                      placeholder="dd/mm/yyyy"
                      value={
                        filters.startDate
                          ? formatDate(parseDate(filters.startDate))
                          : ""
                      }
                      readOnly
                      ref={startDateInputRef}
                      onClick={() => {
                        if (filters.startDate) {
                          setStartDateValue(parseDate(filters.startDate));
                        }
                        setShowStartDateCalendar((show) => !show);
                      }}
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#fff",
                        width: "100%",
                      }}
                    />
                    {filters.startDate ? (
                      <button
                        type="button"
                        onClick={() => {
                          setFilters({ ...filters, startDate: "" });
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
                              startDate: toISODate(selectedDate),
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
                  <Form.Label>End Date</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      className="filter-height"
                      placeholder="dd/mm/yyyy"
                      value={
                        filters.endDate
                          ? formatDate(parseDate(filters.endDate))
                          : ""
                      }
                      readOnly
                      ref={endDateInputRef}
                      onClick={() => {
                        if (filters.endDate) {
                          setEndDateValue(parseDate(filters.endDate));
                        }
                        setShowEndDateCalendar((show) => !show);
                      }}
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#fff",
                        width: "100%",
                      }}
                    />
                    {filters.endDate ? (
                      <button
                        type="button"
                        onClick={() => {
                          setFilters({ ...filters, endDate: "" });
                          setEndDateValue(null);
                          setShowEndDateCalendar(false);
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
                    {showEndDateCalendar && (
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
                            setEndDateValue(selectedDate);
                            setFilters({
                              ...filters,
                              endDate: toISODate(selectedDate),
                            });
                            setShowEndDateCalendar(false);
                            setCurrentPage(1);
                          }}
                          value={endDateValue}
                          locale="en-GB"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="filter-item">
                  <Form.Label>Country</Form.Label>
                  <Select
                    options={countryOptions}
                    value={filters.country}
                    onChange={(option) => {
                      setFilters({ ...filters, country: option });
                      setCurrentPage(1);
                    }}
                    placeholder="Select Country"
                    className="filter-height"
                    classNamePrefix="custom-select"
                    isClearable
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: "13px",
                        minHeight: "38px",
                      }),
                    }}
                  />
                </div>

                <div className="filter-item">
                  <Form.Label>Status</Form.Label>
                  <Select
                    options={visaStatusOptions}
                    value={filters.status}
                    onChange={(option) => {
                      setFilters({ ...filters, status: option });
                      setCurrentPage(1);
                    }}
                    placeholder="Select Status"
                    className="filter-height"
                    classNamePrefix="custom-select"
                    isClearable
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: "13px",
                        minHeight: "38px",
                      }),
                    }}
                  />
                </div>

                <div className="flex-grow-1"></div>
                <div className="filter-item-rows">
                  <ItemsPerPageSelect
                    itemsPerPage={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                  />
                </div>

                <div className="d-flex align-items-center">
                  <div className="filter-item filter-height total-records px-3 d-flex align-items-center">
                    <span>
                      Total Records: <strong>{totalRecords}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="table-responsive modern-table-wrapper"
                style={{
                  borderRadius: "12px",
                  border: "1px solid #dee2e6",
                }}>
                <table
                  className="table table-hover modern-table table-nowrap"
                  style={{ tableLayout: "auto" }}
                >
                  <thead className="text-uppercase">
                    <tr>
                      {columns?.map((col, index) => (
                        <th
                          key={index}
                          scope="col"
                          className={`dynamic-width ${
                            col.label === "Age" ? "center-align" : ""
                          }`}
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visaProcessReports?.length > 0 ? (
                      visaProcessReports.filter(Boolean).map((item, index) => (
                        <tr
                          key={index}
                          className={`${
                            index % 2 === 0 ? "table-row-even" : "table-row-odd"
                          }`}
                        >
                          {columns?.map((col, colIndex) => (
                            <td
                              key={colIndex}
                              className={`dynamic-width-data ${
                                col.isLongText ? "long-text" : ""
                              } ${col.label === "Age" ? "center-align" : ""}`}
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
                        <td colSpan={columns.length}>
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

              {totalPages > 1 && visaProcessReports.length > 0 && (
                <div className="mt-4 d-flex justify-content-end align-items-end">
                  <Paginations
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default VisaProcessReports;
