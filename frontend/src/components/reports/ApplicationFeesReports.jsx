import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import usePermissions from "../commonComponents/usePermissions";
import { decryptData } from "../../utils/encryptionUtils";
import {
  studentInvoiceGetAll,
  studentInvoiceReportExport,
} from "../../redux/actions/Accountant/UniversityCom.action";
import Select from "react-select";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { MdCalendarToday } from "react-icons/md";
import Pageheader from "../../layouts/Pageheader";
import LoadMoreButton from "../commonComponents/LoadMoreButton";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import Paginations from "../elements/Paginations";
import { getAllB2BAdmin } from "../../redux/actions/B2BAdmin.action";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { BASEURL } from "../../baseUrl";
import { toast } from "react-toastify";
import getSymbolFromCurrency from "currency-symbol-map";

const ApplicationFeesReports = () => {
  const dispatch = useDispatch();
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [applicationFeesData, setApplicationFeesData] = useState([]);
  const [search, setSearch] = useState("");
  const { canRead, canDownload } = usePermissions("Application Fees");
  const [isLoading, setIsLoading] = useState(false);
  const [b2bList, setB2bList] = useState([]);
  const [filterB2B, setFilterB2B] = useState(null);
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const startDateInputRef = useRef(null);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [endDateValue, setEndDateValue] = useState(null);
  const endDateInputRef = useRef(null);
  const [totalPayable, setTotalPayable] = useState(0);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });
  const storedEncryptedCurrency = decryptData(
    localStorage.getItem("crmCurrency")
  );

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

  const formatDateForInput = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toISOString().split("T")[0];
  };

  const userRole = decryptData(localStorage.getItem("role"));

  const b2bOptions = b2bList.map((b2b) => ({
    value: b2b._id,
    label: b2b.companyName,
  }));

  const columns = [
    {
      label: "Invoice Date",
      render: (item) =>
        item.invoiceDate ? formatDate(new Date(item.invoiceDate)) : "-",
    },
    {
      label: "B2B Name",
      render: (item) => (item?.b2b ? item?.b2b?.companyName : "-"),
    },
    {
      label: "Student ID",
      render: (item) => item?.student?.studentId || "-",
    },
    {
      label: "Student Name",
      render: (item) => item?.student?.name || "-",
    },
    {
      label: "Student Email",
      render: (item) => item?.student?.email || "-",
    },
    {
      label: "Amount",
      render: (item) => item?.amount || "-",
    },
    {
      label: "Rate",
      render: (item) => item?.rate || "-",
    },
    {
      label: "Payable",
      render: (item) => item?.payable || "-",
    },
  ];

  const fetchApplicationFees = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    b2bId = filterB2B?.value || "",
    startDate = filters.startDate,
    endDate = filters.endDate
  ) => {
    try {
      const res = await dispatch(
        studentInvoiceGetAll(page, limit, search, b2bId, startDate, endDate)
      );
      const data = res?.data?.message?.data || [];
      setApplicationFeesData(data);
      setTotalRecords(res?.data?.message?.totalRecords || 0);
      setTotalPages(res?.data?.message?.totalPages || 0);

      // Calculate total payable
      const total = data?.reduce((sum, item) => {
        const payable = item?.payable ? parseFloat(item.payable) : 0;
        return sum + (isNaN(payable) ? 0 : payable);
      }, 0);
      setTotalPayable(total);
    } catch (error) {
      console.error("Error fetching application fees reports:", error);
      setApplicationFeesData([]);
      setTotalPayable(0);
    }
  };

  const fetchB2BAdmins = async () => {
    try {
      const res = await dispatch(getAllB2BAdmin(1, 1000, "", "", ""));
      const responseData = res?.data?.data;
      setB2bList(responseData?.data || []);
    } catch (error) {
      console.error("Error fetching B2B Admins:", error);
      toast.error("Failed to fetch B2B Admins");
    }
  };

  useEffect(() => {
    fetchB2BAdmins();
  }, []);

  // const handleExport = async () => {
  //   try {
  //     const res = await dispatch(
  //       studentInvoiceGetAll(
  //         1,
  //         10000,
  //         search,
  //         filterB2B?.value || "",
  //         filters.startDate,
  //         filters.endDate
  //       )
  //     );
  //     const idsToExport =
  //       res?.data?.message?.data?.map((item) => item._id) || [];

  //     const response = await dispatch(studentInvoiceReportExport(idsToExport));
  //     if (response?.status === 200 && response?.data?.fileUrl) {
  //       const fileUrl = `${BASEURL}${response.data.fileUrl}`;
  //       const link = document.createElement("a");
  //       link.href = fileUrl;
  //       link.setAttribute("download", "application_fees.csv");
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //       toast.success("Application Fees report downloaded successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Error exporting reports:", error);
  //     toast.error("Failed to export application fees report");
  //   }
  // };

  const handleExport = async (
    page = 1,
    limit = 10000,
    search = "",
    b2bId = filterB2B?.value || "",
    startDate = filters.startDate,
    endDate = filters.endDate
  ) => {
    try {
      setIsLoading(true);
      const res = await dispatch(
        studentInvoiceGetAll(page, limit, search, b2bId, startDate, endDate)
      );
      const dataToExport = res?.data?.message?.data || [];

      if (!dataToExport || dataToExport.length === 0) {
        toast.error("No data available to export.");
        return;
      }

      const headers = columns.map((col) => col.label);

      const rows = dataToExport.map((item) => {
        return columns.map((col) => {
          const value = col.render ? col.render(item) : item[col.key] || "-";
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
      link.setAttribute("download", "application_fees.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Application Fees report downloaded successfully!");
    } catch (error) {
      console.error("Error exporting report:", error);
      toast.error("Something went wrong while exporting the report.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchApplicationFees(
        currentPage,
        itemsPerPage,
        search,
        filterB2B?.value || "",
        filters.startDate,
        filters.endDate
      );
    }
  }, [currentPage, itemsPerPage, search, filterB2B, filters]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <>
      <Pageheader
        mainheading="Application Fees"
        parentfolder="Reports"
        activepage="Application Fees"
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
                {/* <div className="card-title">Application Fees Report</div> */}
                <div className="d-flex flex-wrap gap-2">
                  {applicationFeesData?.length > 0 && canDownload && (
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
                  <Form.Label>B2B</Form.Label>
                  <Select
                    options={b2bOptions}
                    value={filterB2B}
                    onChange={(option) => {
                      setFilterB2B(option);
                      setCurrentPage(1);
                    }}
                    placeholder="Select B2B"
                    isSearchable
                    isClearable
                    className="filter-height"
                    classNamePrefix="custom-select"
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
                    Total Payable:{" "}
                    <strong>
                      {storedEncryptedCurrency
                        ? getSymbolFromCurrency(storedEncryptedCurrency)
                        : "₹"}{" "}
                      {applicationFeesData?.length > 0
                        ? totalPayable?.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })
                        : "0"}
                    </strong>
                  </span>
                </div>
                {/* <div className="contact-search3">
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
                </div> */}

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
                    {applicationFeesData?.length > 0 ? (
                      applicationFeesData.filter(Boolean).map((item, index) => (
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

              {totalPages > 1 && applicationFeesData.length > 0 && (
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

export default ApplicationFeesReports;
