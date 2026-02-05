import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import Paginations from "../../elements/Paginations";
import ItemsPerPageSelect from "../../commonComponents/ItemsPerPageSelect";
import Pageheader from "../../../layouts/Pageheader";
import LoadMoreButton from "../../commonComponents/LoadMoreButton";
import usePermissions from "../../commonComponents/usePermissions";
import { toast } from "react-toastify";
import Calendar from "react-calendar";
import { MdCalendarToday } from "react-icons/md";
import "react-calendar/dist/Calendar.css";
import { getAllExpenses } from "../../../redux/actions/Report/Expenses.action";
import { render } from "@fullcalendar/core/preact.js";
import Select from "react-select";
import { getAllBranch } from "../../../redux/actions/Branch.action"

const ExpensesReport = () => {
  const dispatch = useDispatch();
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [expensesData, setExpensesData] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [endDateValue, setEndDateValue] = useState(null);
  const startDateInputRef = useRef(null);
  const endDateInputRef = useRef(null);
  const { canRead, canDownload } = usePermissions("Expenses ");
  const [branchList, setBranchList] = useState([]);
    const [filters, setFilters] = useState({
      startDate: "",
      endDate: "",
      center: { value: "All", label: "All" },
    });

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

  const columns = [
    {
      label: "Date",
      key: "date",
      render: (item) => formatDate(new Date(item?.date)),
    },
    {
      label: "Branch",
      key: "center",
    },
    {
      label: "Expenses",
      key: "expenses",
      render: (item) => item?.type?.name || "-",
    },
    {
      label: "Mode",
      key: "mode",
    },
    {
      label: "Amount",
      key: "amount",
    },
  ];

  const fetchExpensesReports = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    center = filters.center?.value || "",
  ) => {
    try {
      const res = await dispatch(
        getAllExpenses(page, limit, search, startDate || "", endDate || "", center, ""),
      );
      setExpensesData(res?.data?.data?.data || []);
      setTotalRecords(res?.data?.data?.totalRecords || 0);
      setTotalPages(res?.data?.data?.totalPages || 0);
    } catch (error) {
      console.error("Error fetching Expenses reports:", error);
      setExpensesData([]);
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchExpensesReports(currentPage, itemsPerPage, search);
    }
  }, [currentPage, itemsPerPage, search, canRead, startDate, endDate, filters.center]);

  useEffect(() => {
  fetchAllBranches();
}, [dispatch]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleExport = async () => {
    try {
      setIsLoading(true);

      const res = await dispatch(
        getAllExpenses(
          1,
          Number.MAX_SAFE_INTEGER,
          search,
          startDate || "",
          endDate || "",
          filters.center?.value || "",
        "",
        ),
      );

      const allCourseReports = res?.data?.data?.data || [];

      if (!allCourseReports || allCourseReports.length === 0) {
        toast.error("No data available to export.");
        setIsLoading(false);
        return;
      }

      const headers = columns.map((col) => col.label);

      const rows = allCourseReports.map((item) => {
        return columns.map((col) => {
          let value = col.render ? col.render(item) : item[col.key] || "-";
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
      link.setAttribute("download", "Expenses_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Expenses report downloaded successfully!");
    } catch (error) {
      console.error("Error exporting reports:", error);
      toast.error("Something went wrong while exporting the report.");
    } finally {
      setIsLoading(false);
    }
  };

   const fetchAllBranches = async () => {
      try {
        const res = await dispatch(getAllBranch(1, 1000, ""));
        const responseData = res?.data?.data;
        setBranchList(responseData?.data || []);
      } catch (error) {
        console.log("Error fetching branches:", error);
      }
    }

  return (
    <>
      <Pageheader
        mainheading="Expenses"
        parentfolder="Reports"
        activepage="Expenses"
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
                <div className="d-flex justify-content-between">
                  <div className="card-title">Expenses Report</div>
                </div>
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
                      placeholder="Search here..."
                      autoComplete="off"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                  {expensesData?.length > 0 && canDownload && (
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
                      value={startDate ? formatDate(parseDate(startDate)) : ""}
                      readOnly
                      ref={startDateInputRef}
                      onClick={() => {
                        if (startDate) {
                          setStartDateValue(parseDate(startDate));
                        }
                        setShowStartDateCalendar((show) => !show);
                      }}
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#fff",
                        width: "100%",
                      }}
                    />
                    {startDate ? (
                      <button
                        type="button"
                        onClick={() => {
                          setStartDate("");
                          setStartDateValue(null);
                          setShowStartDateCalendar(false);
                          setCurrentPage(1);
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
                        aria-label="Clear start date"
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
                            setStartDate(toISODate(selectedDate));
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
                      value={endDate ? formatDate(parseDate(endDate)) : ""}
                      readOnly
                      ref={endDateInputRef}
                      onClick={() => {
                        if (endDate) {
                          setEndDateValue(parseDate(endDate));
                        }
                        setShowEndDateCalendar((show) => !show);
                      }}
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#fff",
                        width: "100%",
                      }}
                    />
                    {endDate ? (
                      <button
                        type="button"
                        onClick={() => {
                          setEndDate("");
                          setEndDateValue(null);
                          setShowEndDateCalendar(false);
                          setCurrentPage(1);
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
                        aria-label="Clear end date"
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
                            setEndDate(toISODate(selectedDate));
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
                  <Form.Label>Center</Form.Label>
                  <Select
                    options={[
                      { value: "All", label: "All" },
                      { value: "Head Office", label: "Head Office" },
                      ...(Array.isArray(branchList)
                        ? branchList
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((branch) => ({
                              value: branch.name,
                              label: branch.name,
                            }))
                        : []),
                    ]}
                    value={filters.center}
                    onChange={(selectedOption) => {
                      setFilters({
                        ...filters,
                        center: selectedOption,
                      });
                      setCurrentPage(1);
                    }}
                    placeholder="Select Center"
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
                      <th scope="col" className="No-column">
                        No
                      </th>
                      {columns?.map((col, index) => (
                        <th key={index} scope="col" className="dynamic-width">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {expensesData?.length > 0 ? (
                      expensesData.filter(Boolean).map((item, index) => (
                        <tr
                          key={item._id || index}
                          className={`${
                            index % 2 === 0 ? "table-row-even" : "table-row-odd"
                          }`}
                        >
                          <td className="No-column fw-semibold">
                            {currentPage && itemsPerPage
                              ? index + 1 + (currentPage - 1) * itemsPerPage
                              : index + 1}
                          </td>
                          {columns?.map((col, colIndex) => (
                            <td key={colIndex} className="dynamic-width-data">
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

              {totalPages > 1 && expensesData.length > 0 && (
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

export default ExpensesReport;
