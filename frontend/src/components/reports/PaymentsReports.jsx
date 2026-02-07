import Select from "react-select";
import {
  exportReportGenerateInvoice,
  getAllGenerateInvoice,
} from "../../redux/actions/Accountant/GenerateInvoice.action";
import LoadMoreButton from "../commonComponents/LoadMoreButton";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Pageheader from "../../layouts/Pageheader";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import Paginations from "../elements/Paginations";
import usePermissions from "../commonComponents/usePermissions";
import { BASEURL } from "../../baseUrl";
import { toast } from "react-toastify";
import { getAllMainPlan } from "../../redux/actions/Master/MainPlan.action";
import { getAllSubPlan } from "../../redux/actions/Master/SubPlan.action";
import { MdCalendarToday } from "react-icons/md";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getAllBranch } from "../../redux/actions/Branch.action";
import { decryptData } from "../../utils/encryptionUtils";
import getSymbolFromCurrency from "currency-symbol-map";

const PaymentsReports = () => {
  const dispatch = useDispatch();
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [paymentData, setPaymentData] = useState([]);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [totalDueAmount, setTotalDueAmount] = useState(0);
  const [search, setSearch] = useState("");
  const { canRead, canDownload } = usePermissions("Payment Invoice");
  const [isLoading, setIsLoading] = useState(false);
  const [allMainPlan, setMainPlan] = useState([]);
  const [allSubPlan, setSubPlan] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const userRole = decryptData(localStorage.getItem("role"));
  const branchId = decryptData(localStorage.getItem("userId"));

  const [filters, setFilters] = useState({
    paymentType: "",
    mainPlan: "",
    subPlan: "",
    startDate: "",
    endDate: "",
    status: { label: "All", value: "all" },
    showAll: true,
    branchId: null,
  });
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const startDateInputRef = useRef(null);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [endDateValue, setEndDateValue] = useState(null);
  const endDateInputRef = useRef(null);
  const startDateCalendarRef = useRef(null);
  const endDateCalendarRef = useRef(null);
  const storedEncryptedCurrency = decryptData(
    localStorage.getItem("crmCurrency")
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        startDateInputRef.current &&
        !startDateInputRef.current.contains(event.target) &&
        startDateCalendarRef.current &&
        !startDateCalendarRef.current.contains(event.target)
      ) {
        setShowStartDateCalendar(false);
      }
      if (
        endDateInputRef.current &&
        !endDateInputRef.current.contains(event.target) &&
        endDateCalendarRef.current &&
        !endDateCalendarRef.current.contains(event.target)
      ) {
        setShowEndDateCalendar(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [
    startDateInputRef,
    startDateCalendarRef,
    endDateInputRef,
    endDateCalendarRef,
  ]);

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

  const paymentFilterOptions = [
    { label: "Full", value: "Full" },
    { label: "Half", value: "Half" },
  ];
  const amountStatus = [
    { label: "All", value: "all" },
    { label: "Paid", value: "paid" },
    { label: "Due", value: "due" },
  ];

  const mainPlanOptions = allMainPlan?.map((plan) => ({
    value: plan._id,
    label: plan.name,
  }));

  const subPlanOptions = allSubPlan?.map((plan) => ({
    value: plan._id,
    label: plan.name,
  }));

  useEffect(() => {
    const calculateTotals = () => {
      const paidTotal = paymentData?.reduce((sum, item) => {
        const paidSum =
          item.paidAmount?.reduce(
            (acc, entry) => acc + (parseFloat(entry.amount) || 0),
            0
          ) || 0;
        return sum + paidSum;
      }, 0);

      const dueTotal = paymentData?.reduce(
        (sum, item) => sum + (parseFloat(item.dueAmount) || 0),
        0
      );

      setTotalPaidAmount(
        paidTotal.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
      setTotalDueAmount(
        dueTotal.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    };

    calculateTotals();
  }, [paymentData]);

  const columns = [
    { label: "Student Name", key: "name" },
    { label: "Phone Number", key: "contactNo" },
    { label: "Main Plan", render: (item) => item?.mainPlan?.name || "-" },
    { label: "Sub Plan", render: (item) => item?.subPlan?.name || "-" },
    { label: "Plan Amount", key: "amount" },
    { label: "Discount", key: "discount" },
    { label: "Payment Type", key: "paymentType" },
    { label: "Payment Mode", key: "paymentMode" },
    { label: "Payable Amount", key: "payableAmount" },
    {
      label: "Receive Amount",
      render: (item) =>
        item?.paidAmount?.map((entry) => entry.amount).join(", ") || "-",
    },
    { label: "Receivable Amount", key: "dueAmount" },
  ];

  const fetchExpenses = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    paymentType = filters.paymentType?.value || "",
    mainPlan = filters.mainPlan?.value || "",
    subPlan = filters.subPlan?.value || "",
    startDate = filters.startDate || "",
    endDate = filters.endDate || "",
    status = filters.status?.value || "",
    showAll = filters.showAll,
    branchId = filters.branchId || ""
  ) => {
    try {
      const res = await dispatch(
        getAllGenerateInvoice(
          page,
          limit,
          search,
          paymentType,
          mainPlan,
          subPlan,
          startDate,
          endDate,
          status,
          showAll,
          branchId
        )
      );
      setPaymentData(res?.data?.data?.data || []);
      setTotalRecords(res?.data?.data?.totalRecords || 0);
      setTotalPages(res?.data?.data?.totalPages || 0);
    } catch (error) {
      console.error("Error fetching lead reports:", error);
      setPaymentData([]);
    }
  };

  // const handleExport = async () => {
  //   try {
  //     const res = await dispatch(
  //       getAllGenerateInvoice(
  //         1,
  //         10000,
  //         search,
  //         filters.paymentType?.value,
  //         filters.mainPlan?.value || "",
  //         filters.subPlan?.value || ""
  //       )
  //     );
  //     const idsToExport = res?.data?.data?.data?.map((item) => item._id) || [];

  //     const response = await dispatch(exportReportGenerateInvoice(idsToExport));
  //     if (response?.status === 200 && response?.data?.fileUrl) {
  //       const fileUrl = `${BASEURL}${response.data.fileUrl}`;
  //       const link = document.createElement("a");
  //       link.href = fileUrl;
  //       link.setAttribute("download", "payments_report.csv");
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //       toast.success("Payments report downloaded successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Error exporting reports:", error);
  //   }
  // };

  const handleExport = async (
    page = 1,
    limit = 10000,
    search = "",
    paymentType = filters.paymentType?.value || "",
    mainPlan = filters.mainPlan?.value || "",
    subPlan = filters.subPlan?.value || "",
    startDate = filters.startDate || "",
    endDate = filters.endDate || "",
    status = filters.status?.value || "",
    showAll = filters.showAll,
    branchId = filters.branchId || ""
  ) => {
    try {
      setIsLoading(true);
      const res = await dispatch(
        getAllGenerateInvoice(
          page,
          limit,
          search,
          paymentType,
          mainPlan,
          subPlan,
          startDate,
          endDate,
          status,
          showAll,
          branchId
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
      link.setAttribute("download", "payments_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Payments report downloaded successfully!");
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
        filters.paymentType?.value,
        filters.mainPlan?.value || "",
        filters.subPlan?.value || "",
        filters.startDate || "",
        filters.endDate || "",
        filters.status?.value || "",
        filters.showAll,
        filters.branchId
      );
    }
  }, [currentPage, itemsPerPage, search, filters]);

  const fetchMainPlans = async () => {
    try {
      const res = await dispatch(getAllMainPlan(1, 1000, ""));
      setMainPlan(res?.data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching main plans:", error);
    }
  };

  const fetchSubPlans = async (mainPlanId) => {
    try {
      const res = await dispatch(getAllSubPlan(1, 1000, "", mainPlanId));
      setSubPlan(res?.data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching sub plans:", error);
      setSubPlan([]);
    }
  };
  const fetchAllBranches = async () => {
    try {
      const res = await dispatch(getAllBranch(1, 10000, ""));
      const responseData = res?.data?.data;
      setBranchList(responseData?.data || []);
    } catch (error) {
      console.log("Error fetching branches:", error);
      setBranchList([]);
    }
  };

  useEffect(() => {
    fetchMainPlans();
    fetchAllBranches();
  }, []);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <>
      <Pageheader
        mainheading="Payments"
        parentfolder="Reports"
        activepage="Payments"
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
                {/* <div className="card-title">Payments Report</div> */}
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
                  {paymentData?.length > 0 && canDownload && (
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
                      style={{ cursor: "pointer", backgroundColor: "#fff" }}
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
                        ref={startDateCalendarRef}
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
                      style={{ cursor: "pointer", backgroundColor: "#fff" }}
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
                        ref={endDateCalendarRef}
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
                {userRole !== "Branch" && (
                <div className="filter-item">
                  <Form.Label>Branch</Form.Label>
                  <Select
                    className="filter-height"
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: "13px",
                        minHeight: "38px",
                      }),
                    }}
                    placeholder="Select Branch"
                    classNamePrefix="custom-select"
                    options={[
                      { value: "all", label: "All" },
                      { value: "", label: "Head Office" },
                      ...(Array.isArray(branchList)
                        ? branchList
                            .filter((branch) => {
                              if (userRole === "Branch") {
                                return branch._id === branchId;
                              }
                              return branch.name && branch.name.trim() !== "";
                            })
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((branch) => ({
                              value: branch._id,
                              label: branch.name,
                            }))
                        : []),
                    ]}
                    value={
                      selectedBranch !== null && selectedBranch !== undefined
                        ? {
                            value: selectedBranch,
                            label:
                              selectedBranch === "all"
                                ? "All"
                                : selectedBranch === ""
                                ? "Head Office"
                                : branchList.find(
                                    (branch) => branch._id === selectedBranch
                                  )?.name || "Select Branch",
                          }
                        : null
                    }
                    onChange={(selectedOption) => {
                      setSelectedBranch(selectedOption?.value || "");
                      setFilters({
                        ...filters,
                        branchId:
                          selectedOption.value === "all"
                            ? ""
                            : selectedOption.value,
                        showAll: selectedOption.value === "all" ? true : false,
                      });
                      setCurrentPage(1);
                    }}
                  />
                </div>                  
                )}
                <div className="filter-item">
                  <Form.Label>Status</Form.Label>
                  <Select
                    options={amountStatus}
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
                <div className="filter-item">
                  <Form.Label>Payment Type</Form.Label>
                  <Select
                    options={paymentFilterOptions}
                    value={filters.paymentType}
                    onChange={(option) => {
                      setFilters({ ...filters, paymentType: option });
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
                <div className="filter-item">
                  <Form.Label>Main Plan</Form.Label>
                  <Select
                    options={mainPlanOptions}
                    value={filters.mainPlan}
                    onChange={(option) => {
                      setFilters({
                        ...filters,
                        mainPlan: option,
                        subPlan: null,
                      });
                      setCurrentPage(1);

                      if (option?.value) {
                        fetchSubPlans(option.value);
                      } else {
                        setSubPlan([]);
                      }
                    }}
                    placeholder="Select Main Plan"
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
                  <Form.Label>Sub Plan</Form.Label>
                  <Select
                    options={subPlanOptions}
                    value={filters.subPlan}
                    onChange={(option) => {
                      setFilters({ ...filters, subPlan: option });
                      setCurrentPage(1);
                    }}
                    placeholder="Select Sub Plan"
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
                    Receive Amount:{" "}
                    <strong>
                      {storedEncryptedCurrency
                        ? getSymbolFromCurrency(storedEncryptedCurrency)
                        : "₹"}{" "}
                      {totalPaidAmount}
                    </strong>
                  </span>
                </div>
                <div className="custom-select-height px-3 mt-2 mt-md-0 d-flex align-items-center bg-danger bg-opacity-10 border border-danger rounded">
                  <span className="text-danger fw-semibold">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    Receivable Amount:{" "}
                    <strong>
                      {storedEncryptedCurrency
                        ? getSymbolFromCurrency(storedEncryptedCurrency)
                        : "₹"}{" "}
                      {totalDueAmount}
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
                    {paymentData?.length > 0 ? (
                      paymentData.filter(Boolean).map((item, index) => (
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

              {totalPages > 1 && paymentData?.length > 0 && (
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

export default PaymentsReports;
