import { useDispatch } from "react-redux";
import usePermissions from "../commonComponents/usePermissions";
import { useEffect, useRef, useState } from "react";
import LoadMoreButton from "../commonComponents/LoadMoreButton";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { MdCalendarToday } from "react-icons/md";
import Pageheader from "../../layouts/Pageheader";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import {
  exportExpensesReports,
  getAllExpenses,
} from "../../redux/actions/Report/Expenses.action";
import Paginations from "../elements/Paginations";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-toastify";
import { BASEURL } from "../../baseUrl";
import { getAllExpenseType } from "../../redux/actions/Master/ExpenseType.action";
import { getAllBranch } from "../../redux/actions/Branch.action";
import Select from "react-select";
import getSymbolFromCurrency from "currency-symbol-map";
import { decryptData } from "../../utils/encryptionUtils";

const ExpensesReports = () => {
  const dispatch = useDispatch();
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [expensesData, setExpensesData] = useState([]);
  const [search, setSearch] = useState("");
  const { canRead, canDownload } = usePermissions("Accountant Expenses");
  const [isLoading, setIsLoading] = useState(false);
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const startDateInputRef = useRef(null);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [endDateValue, setEndDateValue] = useState(null);
  const endDateInputRef = useRef(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [branchList, setBranchList] = useState([]);
  const [expenseType, setExpenseType] = useState([]);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    center: { value: "All", label: "All" },
    expenseType: "",
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

  const expenseTypeOptions = expenseType?.map((expense) => ({
    value: expense._id,
    label: expense.name,
  }));

  const columns = [
    {
      label: "DATE",
      render: (item) => formatDate(parseDate(item.date)),
    },
    { label: "CENTER", key: "center" },
    { label: "EXPENSES", render: (item) => item?.type?.name || "-" },
    { label: "MODE", key: "mode" },
    { label: "AMOUNT", key: "amount" },
    { label: "REMARKS", key: "remarks" },
  ];

  const fetchExpenses = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    startDate = filters.startDate,
    endDate = filters.endDate,
    center = filters.center?.value || "",
    expenseType = filters.expenseType?.value || ""
  ) => {
    try {
      const res = await dispatch(
        getAllExpenses(
          page,
          limit,
          search,
          startDate,
          endDate,
          center,
          expenseType
        )
      );
      const data = res?.data?.data?.data || [];
      setExpensesData(data);
      setTotalRecords(res?.data?.data?.totalRecords || 0);
      setTotalPages(res?.data?.data?.totalPages || 0);

      // Calculate total amount
      const total = data.reduce((sum, item) => {
        const amount = item?.amount ? parseFloat(item.amount) : 0;
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
      setTotalAmount(total);
    } catch (error) {
      console.error("Error fetching expenses reports:", error);
      setExpensesData([]);
      setTotalAmount(0);
    }
  };

  // const handleExport = async () => {
  //   try {
  //     const res = await dispatch(
  //       getAllExpenses(1, 10000, search, filters.startDate, filters.endDate, filters.center?.value || "", filters.expenseType?.value || "")
  //     );
  //     const idsToExport = res?.data?.data?.data?.map((item) => item._id) || [];

  //     const response = await dispatch(exportExpensesReports(idsToExport));
  //     if (response?.status === 200 && response?.data?.fileUrl) {
  //       const fileUrl = `${BASEURL}${response.data.fileUrl}`;
  //       const link = document.createElement("a");
  //       link.href = fileUrl;
  //       link.setAttribute("download", "expenses_report.csv");
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //       toast.success("Expenses report downloaded successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Error exporting reports:", error);
  //     toast.error("Failed to export expenses report");
  //   }
  // };

  const handleExport = async (
    page = 1,
    limit = 10000,
    search = "",
    startDate = filters.startDate,
    endDate = filters.endDate,
    center = filters.center?.value || "",
    expenseType = filters.expenseType?.value || ""
  ) => {
    try {
      setIsLoading(true);
      const res = await dispatch(
        getAllExpenses(
          page,
          limit,
          search,
          startDate,
          endDate,
          center,
          expenseType
        )
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
      link.setAttribute("download", "expenses_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Expenses report downloaded successfully!");
    } catch (error) {
      console.error("Error exporting report:", error);
      toast.error("Something went wrong while exporting the report.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchExpenses(
        currentPage,
        itemsPerPage,
        search,
        filters.startDate,
        filters.endDate,
        filters.center?.value,
        filters.expenseType?.value
      );
    }
  }, [currentPage, itemsPerPage, search, filters]);

  const fetchAllBranches = async () => {
    try {
      const res = await dispatch(getAllBranch(1, 1000, ""));
      const responseData = res?.data?.data;
      setBranchList(responseData?.data || []);
    } catch (error) {
      console.log("Error fetching branches:", error);
    }
  };

  const fetchAllExpenseType = async () => {
    try {
      const res = await dispatch(getAllExpenseType(1, 1000, ""));
      const responseData = res?.data?.data;
      setExpenseType(responseData?.data || []);
    } catch (error) {
      console.log("Error fetching branches:", error);
    }
  };

  useEffect(() => {
    fetchAllExpenseType();
    fetchAllBranches();
  }, []);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

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
                <div className="card-title">Expenses Report</div>
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
                  <Form.Label>Expenses Type</Form.Label>
                  <Select
                    options={expenseTypeOptions}
                    value={filters.expenseType}
                    onChange={(selectedOption) => {
                      setFilters({
                        ...filters,
                        expenseType: selectedOption,
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
                    Total Amount:{" "}
                    <strong>
                      {storedEncryptedCurrency
                        ? getSymbolFromCurrency(storedEncryptedCurrency)
                        : "₹"}{" "}
                      {expensesData?.length > 0
                        ? totalAmount?.toLocaleString("en-IN", {
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
                    {expensesData?.length > 0 ? (
                      expensesData.filter(Boolean).map((item, index) => (
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

              {totalPages > 1 && expensesData?.length > 0 && (
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

export default ExpensesReports;
