import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import usePermissions from "../commonComponents/usePermissions";
import {
  exportStudentApplicationReports,
  partnerPendingB2BInvoiceGetAll,
  totalB2BPendingCountry,
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
import Paginations from "../elements/Paginations";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import { BASEURL } from "../../baseUrl";
import { toast } from "react-toastify";
import Select from "react-select";
import { getAllBranch } from "../../redux/actions/Branch.action";
import { getAllB2BAdmin } from "../../redux/actions/B2BAdmin.action";
import { decryptData } from "../../utils/encryptionUtils";
import { MdCalendarToday } from "react-icons/md";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import getSymbolFromCurrency from "currency-symbol-map";

const PendingB2BInvoice = () => {
  const dispatch = useDispatch();
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [partnerPendingB2BInvoice, setPartnerPendingB2BInvoice] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [totalCommissionAmount, setTotalCommissionAmount] = useState(0);
  const [b2BPendingCountryList, setB2BPendingCountryList] = useState([]);
  const { canRead, canCreate, canUpdate, canDelete, canDownload } = usePermissions(
    "Pending B2B Invoice"
  );

  const userRole = decryptData(localStorage.getItem("role"));
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const startDateInputRef = useRef(null);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [endDateValue, setEndDateValue] = useState(null);
  const endDateInputRef = useRef(null);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    country: "",
    b2bId: "",
    branchId: "",
    showAll: true,
    type: "",
  });
  const [branchList, setBranchList] = useState([]);
  const [b2BList, setB2BList] = useState([]);
  const storedEncryptedCurrency = decryptData(
    localStorage.getItem("crmCurrency")
  );

  const b2bListOptions = b2BList?.map((b2b) => ({
    value: b2b._id,
    label: b2b.companyName,
  }));

  const b2bPartnerOptions = [
    { value: "b2b", label: "B2B Partner" },
    { value: "branch", label: "Branch" },
  ];

  const countryOptions = b2BPendingCountryList?.map((country) => ({
    value: country,
    label: country,
  }));
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

  const calculateCommission = (item) => {
    // Tuition Fee calculation
    const tuitionFee = item?.interestedCourseDetails?.[0]?.instituteFeePayment
      ?.feeAmount
      ? parseFloat(
          item.interestedCourseDetails[0].instituteFeePayment.feeAmount
            .toString()
            .replace(/,/g, "")
        )
      : 0;
    // University Commission calculation
    const universityCommissionType =
      item?.universitySideConfirmation?.commissionType;
    const universityCommissionPercent = parseFloat(
      item?.universitySideConfirmation?.commissionPercentage || 0
    );
    const universityCommissionAmount =
      universityCommissionType === "Percentage"
        ? (tuitionFee * universityCommissionPercent) / 100
        : parseFloat(item?.universitySideConfirmation?.commissionAmount || 0);
    // B2B/Branch
    const b2bCommissionType =
      item?.universityPaymentReceived?.b2bCommission?.commissionType;
    const b2bCommissionPercent = parseFloat(
      item?.universityPaymentReceived?.b2bCommission?.commissionPercentage || 0
    );
    const b2bCommissionAmount =
      b2bCommissionType === "Percentage"
        ? (universityCommissionAmount * b2bCommissionPercent) / 100
        : parseFloat(
            item?.universityPaymentReceived?.b2bCommission?.commissionAmount ||
              0
          );

    return {
      b2bCommissionAmount,
      b2bCommissionType,
      b2bCommissionPercent,
    };
  };

  const columns = [
    {
      label: "Student Id",
      key: "studentId",
    },
    {
      label: "Date",
      render: (item) =>
        new Date(item.universitytInvoiceGenerated.date).toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            timeZone: "UTC",
          }
        ),
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
      key: "createdByName",
    },
    {
      label: "Amount",
      render: (item) => {
        const { b2bCommissionAmount, b2bCommissionType, b2bCommissionPercent } =
          calculateCommission(item);

        // If no valid amount or percent, show "-"
        if (!b2bCommissionAmount && !b2bCommissionPercent) {
          return "-";
        }

        if (b2bCommissionType === "Percentage") {
          return b2bCommissionPercent
            ? `${b2bCommissionPercent}% (${
                b2bCommissionAmount?.toLocaleString("en-IN") || "-"
              })`
            : "-";
        }

        return b2bCommissionAmount
          ? b2bCommissionAmount.toLocaleString("en-IN")
          : "-";
      },
    },
    // {
    //   label: "Amount",
    //   render: (item) => {
    //     const { b2bCommissionAmount, b2bCommissionType, b2bCommissionPercent } =
    //       calculateCommission(item);

    //     return b2bCommissionType === "Percentage"
    //       ? `${b2bCommissionPercent || "-"}% (${
    //           b2bCommissionAmount
    //             ? b2bCommissionAmount?.toLocaleString("en-IN")
    //             : "-"
    //         })`
    //       : `${
    //           b2bCommissionAmount
    //             ? b2bCommissionAmount?.toLocaleString("en-IN")
    //             : "-"
    //         }`;
    //   },
    // },
    {
      label: "Status",
      render: (item) => {
        return (
          <span
            style={{
              backgroundColor: item?.mainStatus?.color,
              color: item?.mainStatus ? "#ffffff" : "#000000",
              padding: "1px 8px",
              borderRadius: "30px",
              display: "inline-block",
            }}
          >
            {item?.mainStatus ? item.mainStatus?.name : "-"}
          </span>
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

  const fetchPartnerPendingB2BInvoice = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    startDate = filters.startDate,
    endDate = filters.endDate,
    country = filters.country?.value || "",
    b2bId = filters.b2bId?.value || "",
    branchId = filters.branchId || "",
    showAll = filters.showAll,
    type = filters.type?.value || ""
  ) => {
    try {
      const res = await dispatch(
        partnerPendingB2BInvoiceGetAll(
          page,
          limit,
          search,
          startDate,
          endDate,
          country,
          b2bId,
          branchId,
          showAll,
          type
        )
      );
      const data = res?.data?.data?.data || [];
      setPartnerPendingB2BInvoice(data);
      setTotalRecords(res?.data?.data?.totalRecords || 0);
      setTotalPages(res?.data?.data?.totalPages || 0);
      // Calculate total commission
      const total = data?.reduce((sum, item) => {
        const { b2bCommissionAmount } = calculateCommission(item);
        return sum + (b2bCommissionAmount || 0);
      }, 0);
      setTotalCommissionAmount(total);
    } catch (error) {
      console.error("Error fetching partner pending b2b invoice:", error);
      setPartnerPendingB2BInvoice([]);
      setTotalCommissionAmount(0);
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchPartnerPendingB2BInvoice(
        currentPage,
        itemsPerPage,
        search,
        filters.startDate,
        filters.endDate,
        filters.country?.value,
        filters.b2bId?.value,
        filters.branchId,
        filters.showAll,
        filters.type?.value
      );
    }
  }, [currentPage, itemsPerPage, search, canRead, filters]);

  const fetchAllBranches = async () => {
    try {
      const res = await dispatch(getAllBranch(1, 1000, ""));
      const responseData = res?.data?.data;
      setBranchList(responseData?.data || []);
    } catch (error) {
      console.log("Error fetching branches:", error);
      setBranchList([]);
    }
  };

  const fetchAllB2B = async () => {
    try {
      const res = await dispatch(getAllB2BAdmin(1, 1000, ""));
      const responseData = res?.data?.data;
      setB2BList(responseData?.data || []);
    } catch (error) {
      console.log("Error fetching branches:", error);
      setB2BList([]);
    }
  };

  const fetchAllB2BPendingCountry = async () => {
    try {
      const res = await dispatch(totalB2BPendingCountry());
      const responseData = res?.data?.data;
      setB2BPendingCountryList(responseData || []);
    } catch (error) {
      console.log("Error fetching branches:", error);
      setB2BPendingCountryList([]);
    }
  };

  useEffect(() => {
    fetchAllBranches();
    fetchAllB2B();
    fetchAllB2BPendingCountry();
  }, []);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // const handleExport = async () => {
  //   try {
  //     const res = await dispatch(
  //       partnerPendingB2BInvoiceGetAll(
  //         1,
  //         10000,
  //         search,
  //         filters.startDate,
  //         filters.endDate,
  //         filters.country?.value,
  //         filters.b2bId?.value,
  //         filters.branchId,
  //         filters.showAll,
  //         filters.type?.value
  //       )
  //     );
  //     const idsToExport = res?.data?.data?.data?.map((item) => item._id) || [];

  //     const response = await dispatch(
  //       exportStudentApplicationReports(idsToExport)
  //     );
  //     if (response?.status === 200 && response?.data?.fileUrl) {
  //       const fileUrl = `${BASEURL}${response.data.fileUrl}`;
  //       const link = document.createElement("a");
  //       link.href = fileUrl;
  //       link.setAttribute("download", "pending_b2b_invoice.csv");
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //       toast.success("Pending B2B Invoice report downloaded successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Error exporting reports:", error);
  //   }
  // };

  const handleExport = async () => {
    try {
      setIsLoading(true);
      const res = await dispatch(
        partnerPendingB2BInvoiceGetAll(
          1,
          10000,
          search,
          filters.startDate,
          filters.endDate,
          filters.country?.value || "",
          filters.b2bId?.value || "",
          filters.branchId || "",
          filters.showAll,
          filters.type?.value || ""
        )
      );
      const dataToExport = res?.data?.data?.data || [];

      if (!dataToExport || dataToExport.length === 0) {
        toast.error("No data available to export.");
        return;
      }

      // Prepare CSV headers
      const headers = columns.map((col) => col.label);

      // Prepare CSV rows
      const rows = dataToExport.map((item) => {
        return columns.map((col) => {
          const value = col.render ? col.render(item) : item[col.key] || "-";

          // Handle React elements (like <span> or OverlayTrigger)
          if (React.isValidElement(value)) {
            // Extract text content from OverlayTrigger or span
            if (value.type === OverlayTrigger) {
              return value.props.children.props.children || "-";
            }
            return value.props.children || "-";
          }

          // Handle basic values
          return String(value).replace(/"/g, '""');
        });
      });

      // Combine headers and rows into CSV string
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      // Create a Blob for the CSV file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      // Set up the download
      link.setAttribute("href", url);
      link.setAttribute("download", "pending_b2b_invoice.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Pending B2B Invoice report downloaded successfully!");
    } catch (error) {
      console.error("Error exporting report:", error);
      toast.error("Something went wrong while exporting the report.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Pageheader
        mainheading="Pending B2B Invoice"
        parentfolder="Reports"
        activepage="Pending B2B Invoice"
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
                <div className="card-title">Pending B2B Invoice Report</div>
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
                  {partnerPendingB2BInvoice?.length > 0 && canDownload && (
                    <Button
                      variant="primary"
                      className="custom-select-height px-3"
                      onClick={() => handleExport()}
                    >
                      Download
                    </Button>
                  )}
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              {canRead && (
                <>
                  <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
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
                                    return branch._id === filters.branchId;
                                  }
                                  return (
                                    branch.name && branch.name.trim() !== ""
                                  );
                                })
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((branch) => ({
                                  value: branch._id,
                                  label: branch.name,
                                }))
                            : []),
                        ]}
                        value={
                          filters.branchId !== null &&
                          filters.branchId !== undefined
                            ? {
                                value: filters.showAll
                                  ? "all"
                                  : filters.branchId,
                                label: filters.showAll
                                  ? "All"
                                  : filters.branchId === ""
                                  ? "Head Office"
                                  : branchList.find(
                                      (branch) =>
                                        branch._id === filters.branchId
                                    )?.name || "Select Branch",
                              }
                            : null
                        }
                        onChange={(selectedOption) => {
                          const newBranchId =
                            selectedOption?.value === "all"
                              ? ""
                              : selectedOption?.value || "";
                          const newShowAll = selectedOption?.value === "all";
                          setFilters({
                            ...filters,
                            branchId: newBranchId,
                            showAll: newShowAll,
                          });
                          setCurrentPage(1);
                        }}
                      />
                    </div>                      
                    )}
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
                      <Form.Label>Type</Form.Label>
                      <Select
                        options={b2bPartnerOptions}
                        value={filters.type}
                        onChange={(option) => {
                          setFilters({ ...filters, type: option });
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
                      <Form.Label>B2B</Form.Label>
                      <Select
                        options={b2bListOptions}
                        value={filters.b2bId}
                        onChange={(option) => {
                          setFilters({ ...filters, b2bId: option });
                          setCurrentPage(1);
                        }}
                        placeholder="Select B2B"
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
                          {partnerPendingB2BInvoice?.length > 0
                            ? totalCommissionAmount?.toLocaleString("en-IN")
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
                          Total Records :<strong> {totalRecords}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}

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
                        <th key={index} scope="col" className="dynamic-width">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {partnerPendingB2BInvoice?.length > 0 ? (
                      partnerPendingB2BInvoice
                        .filter(Boolean)
                        .map((item, index) => (
                          <tr
                            key={item._id || index}
                            className={`${
                              index % 2 === 0
                                ? "table-row-even"
                                : "table-row-odd"
                            }`}
                          >
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

              {totalPages > 1 && partnerPendingB2BInvoice.length > 0 && (
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
export default PendingB2BInvoice;
