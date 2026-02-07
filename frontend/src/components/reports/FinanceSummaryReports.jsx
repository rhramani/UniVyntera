import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import usePermissions from "../commonComponents/usePermissions";
import { decryptData } from "../../utils/encryptionUtils";
import {
  getStudentFinanceSummaryReport,
  studentFinanceSummaryReportsExport,
} from "../../redux/actions/Report/StudentApplicationReport.action";
import Pageheader from "../../layouts/Pageheader";
import LoadMoreButton from "../commonComponents/LoadMoreButton";
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import Select from "react-select";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import Paginations from "../elements/Paginations";
import { getAllInterestedCourseStatus } from "../../redux/actions/Master/InterestedCourseStatus.action";
import { BASEURL } from "../../baseUrl";
import { toast } from "react-toastify";
import { getAllVisaStatus } from "../../redux/actions/Master/VisaStatus.action";
import { MdCalendarToday } from "react-icons/md";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import getSymbolFromCurrency from "currency-symbol-map";

const FinanceSummaryReports = () => {
  const dispatch = useDispatch();
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [financeSummaryData, setFinanceSummaryData] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [search, setSearch] = useState("");
  const { canRead, canDownload } = usePermissions("Finance Summary");
  const [isLoading, setIsLoading] = useState(false);
  const [totalFeeAmount, setTotalFeeAmount] = useState(0);
  const [visaStatus, setVisaStatus] = useState([]);

  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const startDateInputRef = useRef(null);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [endDateValue, setEndDateValue] = useState(null);
  const endDateInputRef = useRef(null);

  const [filters, setFilters] = useState({
    type: "",
    startDate: "",
    endDate: "",
  });

  const storedEncryptedCurrency = decryptData(
    localStorage.getItem("crmCurrency"),
  );

  const userRole = decryptData(localStorage.getItem("role"));
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

  const feeStatusOptions = [
    { value: "b2b", label: "B2B Partner" },
    { value: "branch", label: "Branch" },
  ];

  const columns = [
    {
      label: "Student Id",
      key: "studentId",
    },
    {
      label: "Date",
      render: (item) =>
        new Date(
          item.visaApplicationDetails?.visaOutcomeDate,
        ).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          timeZone: "UTC",
        }),
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
        item?.b2bCompany
          ? item.b2bCompany
          : item?.branch
            ? item.branch
            : item?.createdByName || "",
    },
    {
      label: "Fee Amount",
      render: (item) =>
        item?.interestedCourseDetails?.[0]?.instituteFeePayment?.feeAmount ||
        "-",
    },
    {
      label: "Status",
      render: (item) => {
        const status = item?.interestedCourseDetails?.[0]?.status || "New";
        const matchedStatus = paymentStatus.find(
          (statusItem) => statusItem.name === status,
        );
        const bgColor = matchedStatus?.color || "#0b3c8c";
        const textColor = ["#e9e216", "#1fff44"].includes(bgColor)
          ? "#000000"
          : "#ffffff";
        const displayStatus = status || "New";

        return (
          <span
            style={{
              backgroundColor: bgColor,
              color: textColor,
              padding: "1px 8px",
              borderRadius: "12px",
              display: "inline-block",
            }}
          >
            {displayStatus}
          </span>
        );
      },
    },
    {
      label: "Status",
      render: (item) => {
        const status = item?.visaApplicationDetails?.status || "New";
        const matchedStatus = visaStatus?.find(
          (statusItem) => statusItem.name === status,
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
                borderRadius: "12px",
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
        item?.purposeDetails?.preferredCountry.join(", ") || "-",
    },
    {
      label: "Institute Name",
      render: (item) => {
        const displayValues = item?.interestedCourseDetails?.length
          ? item?.interestedCourseDetails
              ?.filter(
                (detail) => detail?.instituteFeePayment?.feeStatus === "paid",
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
      render: (item) => {
        const displayValues = item?.interestedCourseDetails?.length
          ? item?.interestedCourseDetails
              ?.filter(
                (detail) => detail?.instituteFeePayment?.feeStatus === "paid",
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
      render: (item) => {
        const displayValues = item?.interestedCourseDetails?.length
          ? item?.interestedCourseDetails
              ?.filter(
                (detail) => detail?.instituteFeePayment?.feeStatus === "paid",
              )
              ?.map((detail) => detail?.intakeYear || "-")
              .join(", ")
          : "-";

        return <span>{displayValues || "-"}</span>;
      },
    },
    {
      label: "Intake Month",
      render: (item) => {
        const displayValues = item?.interestedCourseDetails?.length
          ? item?.interestedCourseDetails
              ?.filter(
                (detail) => detail?.instituteFeePayment?.feeStatus === "paid",
              )
              ?.map((detail) => detail?.intakeMonth || "-")
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

  const fetchStudentFinanceSummary = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    type = filters.type?.value || "",
    startDate = filters.startDate,
    endDate = filters.endDate,
  ) => {
    try {
      const res = await dispatch(
        getStudentFinanceSummaryReport(
          page,
          limit,
          search,
          type,
          startDate,
          endDate,
        ),
      );
      const data = res?.data?.data?.data || [];
      setFinanceSummaryData(data);
      setTotalRecords(res?.data?.data?.totalRecords || 0);
      setTotalPages(res?.data?.data?.totalPages || 0);

      // Calculate total fee amount
      const total = data.reduce((sum, item) => {
        const feeAmount = item?.interestedCourseDetails?.[0]
          ?.instituteFeePayment?.feeAmount
          ? parseFloat(
              item.interestedCourseDetails[0].instituteFeePayment.feeAmount.replace(
                /,/g,
                "",
              ),
            )
          : 0;
        return sum + (isNaN(feeAmount) ? 0 : feeAmount);
      }, 0);
      setTotalFeeAmount(total);
    } catch (error) {
      console.error("Error fetching finance summary reports:", error);
      setFinanceSummaryData([]);
      setTotalFeeAmount(0);
    }
  };

  // const handleExport = async () => {
  //   try {
  //     const response = await dispatch(
  //       studentFinanceSummaryReportsExport(
  //         search,
  //         filters.type?.value || "",
  //         filters.startDate,
  //         filters.endDate
  //       )
  //     );
  //     if (response?.status === 200 && response?.data?.fileUrl) {
  //       const fileUrl = `${BASEURL}${response.data.fileUrl}`;
  //       const link = document.createElement("a");
  //       link.href = fileUrl;
  //       link.setAttribute("download", "finance_summary.csv");
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //       toast.success("Finance Summary report downloaded successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Error exporting reports:", error);
  //   }
  // };

  const handleExport = async (
    page = 1,
    limit = 10000,
    search = "",
    type = filters.type?.value || "",
    startDate = filters.startDate,
    endDate = filters.endDate,
  ) => {
    try {
      setIsLoading(true);
      const res = await dispatch(
        getStudentFinanceSummaryReport(
          page,
          limit,
          search,
          type,
          startDate,
          endDate,
        ),
      );
      const dataToExport = res?.data?.data?.data || [];

      if (!dataToExport || dataToExport.length === 0) {
        toast.error("No data available to export.");
        return;
      }

      const headers = columns.map((col) => col.label);

      const rows = dataToExport.map((item) => {
        return columns.map((col) => {
          const value = col.render ? col.render(item) : item[col.key] || "-";

          if (React.isValidElement(value)) {
            if (value.type === OverlayTrigger) {
              return value.props.children.props.children || "-";
            }
            return value.props.children || "-";
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
      link.setAttribute("download", "finance_summary.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Finance Summary report downloaded successfully!");
    } catch (error) {
      console.error("Error exporting report:", error);
      toast.error("Something went wrong while exporting the report.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentStatuses = async () => {
    try {
      const res = await dispatch(getAllInterestedCourseStatus(""));
      if (res?.status === 200) {
        setPaymentStatus(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching student statuses:", error);
    }
  };

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

  useEffect(() => {
    fetchStudentStatuses();
    fetchVisaStatus();
  }, []);

  useEffect(() => {
    if (canRead) {
      fetchStudentFinanceSummary(
        currentPage,
        itemsPerPage,
        search,
        filters.type?.value || "",
        filters.startDate,
        filters.endDate,
      );
    }
  }, [currentPage, itemsPerPage, search, filters]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <>
      <Pageheader
        mainheading="Finance Summary"
        parentfolder="Reports"
        activepage="Finance Summary"
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
              <div className="w-100 d-flex flex-wrap justify-content-between">
                <div className="card-title">Finance Summary report</div>
                <div className="d-flex flex-wrap align-items-center gap-2">
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
                  {financeSummaryData?.length > 0 && canDownload && (
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
                  <Form.Label>Type</Form.Label>
                  <Select
                    options={feeStatusOptions}
                    value={filters.type}
                    onChange={(selectedOption) => {
                      setFilters({
                        ...filters,
                        type: selectedOption,
                      });
                      setCurrentPage(1);
                    }}
                    placeholder="Select Type"
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
                <div className="custom-select-height px-3 mt-2 mt-md-0 d-flex align-items-center bg-success bg-opacity-10 border border-success rounded">
                  <span className="text-success fw-semibold">
                    <i className="bi bi-check-circle me-2"></i>
                    Total Fee Amount:{" "}
                    <strong>
                      {storedEncryptedCurrency
                        ? getSymbolFromCurrency(storedEncryptedCurrency)
                        : "₹"}{" "}
                      {financeSummaryData?.length > 0
                        ? totalFeeAmount?.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })
                        : "0"}
                    </strong>
                  </span>
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
                      Total Records: <strong>{totalRecords}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="table-responsive modern-table-wrapper"
                style={{
                  borderRadius: "12px",
                  border: "1px solid #dee2e6",
                }}
              >
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
                    {financeSummaryData?.length > 0 ? (
                      financeSummaryData.filter(Boolean).map((item, index) => (
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

              {totalPages > 1 && financeSummaryData.length > 0 && (
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

export default FinanceSummaryReports;
