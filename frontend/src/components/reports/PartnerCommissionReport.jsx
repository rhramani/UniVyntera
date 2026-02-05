import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import usePermissions from "../commonComponents/usePermissions";
import {
  exportStudentApplicationReports,
  partnerCommissionReportGetAll,
  partnerUniqueB2BAndBranchListGetAll,
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
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import Paginations from "../elements/Paginations";
import { MdCalendarToday } from "react-icons/md";
import Select from "react-select";
import { decryptData } from "../../utils/encryptionUtils";
import {
  getTotalCommissionCountry,
  getTotalCommissionUniversity,
} from "../../redux/actions/Accountant/UniversityCom.action";
import { getAllAccountantStatus } from "../../redux/actions/Master/AccountantStatus.action";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { BASEURL } from "../../baseUrl";
import { toast } from "react-toastify";
import getSymbolFromCurrency from "currency-symbol-map";

const PartnerCommissionReport = () => {
  const dispatch = useDispatch();
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [partnerCommissionReports, setPartnerCommissionReports] = useState([]);
  const [search, setSearch] = useState("");
  const [instituteData, setInstituteData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [b2bPartnerData, setB2BPartnerData] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [b2BCommissionStatus, setB2BCommissionStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCommissionAmount, setTotalCommissionAmount] = useState(0);

  const { canRead, canCreate, canUpdate, canDownload } =
    usePermissions("Partner Commission");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "",
    institute: null,
    country: null,
    status: null,
    b2bId: null,
    branchId: null,
  });
  const userRole = decryptData(localStorage.getItem("role"));
  const storedEncryptedCurrency = decryptData(
    localStorage.getItem("crmCurrency")
  );

  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const startDateInputRef = useRef(null);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [endDateValue, setEndDateValue] = useState(null);
  const endDateInputRef = useRef(null);

  const instituteOptions = instituteData?.map((institute) => ({
    value: institute._id,
    label: institute.instituteName,
  }));

  const countryOptions = countryData?.map((country) => ({
    value: country,
    label: country,
  }));

  const b2bPartnerOptions = [
    { value: "b2b", label: "B2B Partner" },
    { value: "branch", label: "Branch" },
  ];

  const statusOptions = b2BCommissionStatus?.map((status) => ({
    value: status?.name,
    label: status?.name,
  }));

  const b2bOptions = b2bPartnerData?.map((b2b) => ({
    value: b2b._id,
    label: b2b.companyName,
  }));

  const branchOptions = branchData?.map((branch) => ({
    value: branch._id,
    label: branch.name,
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
      label: "Date",
      key: "date",
      render: (item) =>
        new Date(item.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          timeZone: "UTC",
        }),
    },
    {
      label: "Student Id",
      key: "studentId",
    },
    {
      label: "Student Name",
      key: "name",
    },
    {
      label: "Type",
      render: (item) => {
        const type = item?.created_by_type;
        const company = item?.b2bCompany || item?.createdByName;
        const branchName = item?.branch || item?.createdByName;

        if (type === "B2B Admin" || type === "B2B Member") {
          return <>B2B{company && ` (${company})`}</>;
        } else if (
          type === "Branch" ||
          type === "Branch User" ||
          type === "Branch Member"
        ) {
          return <>Branch{branchName && ` (${branchName})`}</>;
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
      // render: (item) => (item?.branch ? item?.branch : item?.createdByName),
    },
    {
      label: "Amount",
      render: (item) => {
        const { b2bCommissionAmount, b2bCommissionType, b2bCommissionPercent } =
          calculateCommission(item);

        return b2bCommissionType === "Percentage"
          ? `${b2bCommissionPercent || "-"}% (${b2bCommissionAmount
            ? b2bCommissionAmount?.toLocaleString("en-IN")
            : "-"
          })`
          : `${b2bCommissionAmount
            ? b2bCommissionAmount?.toLocaleString("en-IN")
            : "-"
          }`;
      },
    },
    {
      label: "Preferred Country",
      render: (item) =>
        item?.purposeDetails?.preferredCountry?.join(", ") || "-",
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
      label: "Status",
      render: (item) => {
        const statusObj = b2BCommissionStatus.find(
          (status) => status.name === item?.accountantStatus
        );
        const textColor = ["#e9e216", "#1fff44"].includes(statusObj?.color)
          ? "#000000"
          : "#222222";
        const displayStatus =
          item?.accountantStatus === "false" ||
            item?.accountantStatus === false ||
            item?.accountantStatus === ""
            ? "New"
            : item?.accountantStatus || "New";
        return (
          <span
            style={{
              backgroundColor: statusObj?.color || "#0b3c8c",
              padding: "4px 8px",
              color: displayStatus ? "#ffffff" : textColor,
              borderRadius: "30px",
            }}
          >
            {displayStatus || "-"}
          </span>
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
      key: "city",
      render: (item) => item.email || "-",
    },
    {
      label: "Phone Number",
      key: "city",
      render: (item) => item.contact || "-",
    },
  ];

  const fetchPartnerCommissionReports = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    startDate = filters.startDate,
    endDate = filters.endDate,
    type = filters.type?.value || "",
    institute = filters.institute?.value || "",
    country = filters.country?.value || "",
    status = filters.status?.value || "",
    b2bId = filters.b2bId?.value || "",
    branchId = filters.branchId?.value || ""
  ) => {
    try {
      const res = await dispatch(
        partnerCommissionReportGetAll(
          page,
          limit,
          search,
          startDate,
          endDate,
          type,
          institute,
          country,
          status,
          b2bId,
          branchId
        )
      );
      const data = res?.data?.data?.data || [];
      setPartnerCommissionReports(data);
      setTotalRecords(res?.data?.data?.totalRecords || 0);
      setTotalPages(res?.data?.data?.totalPages || 0);

      // Calculate total commission
      const total = data?.reduce((sum, item) => {
        const { b2bCommissionAmount } = calculateCommission(item);
        return sum + (b2bCommissionAmount || 0);
      }, 0);
      setTotalCommissionAmount(total);
    } catch (error) {
      console.error("Error fetching partner commission reports:", error);
      setPartnerCommissionReports([]);
      setTotalCommissionAmount(0);
    }
  };

  const fetchAllInstitute = async () => {
    try {
      const res = await dispatch(getTotalCommissionUniversity());
      setInstituteData(res?.data?.data);
    } catch (error) {
      toast.error("Error fetching in getAll Institute");
    }
  };

  const fetchAllCountry = async () => {
    try {
      const res = await dispatch(getTotalCommissionCountry());
      setCountryData(res?.data?.data);
    } catch (error) {
      toast.error("Error fetching in getAll country");
    }
  };

  const fetchEligibleStudentStatus = async () => {
    try {
      const res = await dispatch(getAllAccountantStatus());
      if (res?.status === 200) {
        setB2BCommissionStatus(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching student statuses:", error);
    }
  };

  const fetchUniqueB2BAndBranchPartner = async () => {
    try {
      const res = await dispatch(partnerUniqueB2BAndBranchListGetAll());
      setB2BPartnerData(res?.data?.data?.b2bAdmins || []);
      setBranchData(res?.data?.data?.branches || []);
    } catch (error) {
      console.error("Error fetching unique b2b partner:", error);
    }
  };

  useEffect(() => {
    fetchEligibleStudentStatus();
    fetchAllInstitute();
    fetchAllCountry();
    fetchUniqueB2BAndBranchPartner();
  }, []);

  useEffect(() => {
    if (canRead) {
      fetchPartnerCommissionReports(
        currentPage,
        itemsPerPage,
        search,
        filters.startDate,
        filters.endDate,
        filters.type?.value,
        filters.institute?.value,
        filters.country?.value,
        filters.status?.value,
        filters.b2bId?.value,
        filters.branchId?.value
      );
    }
  }, [currentPage, itemsPerPage, search, canRead, filters]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // const handleExport = async () => {
  //   try {
  //     setIsLoading(true);
  //     const res = await dispatch(
  //       partnerCommissionReportGetAll(
  //         1,
  //         10000,
  //         search,
  //         filters.startDate,
  //         filters.endDate,
  //         filters.type?.value || "",
  //         filters.institute?.value || "",
  //         filters.country?.value || "",
  //         filters.status?.value || "",
  //         filters.b2bId?.value || "",
  //         filters.branchId?.value || ""
  //       )
  //     );
  //     const dataToExport = res?.data?.data?.data || [];

  //     if (!dataToExport || dataToExport.length === 0) {
  //       toast.error("No data available to export.");
  //       return;
  //     }

  //     // Prepare CSV headers
  //     const headers = columns.map((col) => col.label);

  //     // Prepare CSV rows
  //     const rows = dataToExport.map((item) => {
  //       return columns.map((col) => {
  //         const value = col.render ? col.render(item) : item[col.key] || "-";

  //         // If it's a React element (like <span>), extract the string content
  //         if (React.isValidElement(value)) {
  //           // Try to extract from props.children (for span, etc.)
  //           if (
  //             typeof value.props.children === "string" ||
  //             typeof value.props.children === "number"
  //           ) {
  //             return value.props.children;
  //           }

  //           // If it's nested, handle arrays or fallback
  //           if (Array.isArray(value.props.children)) {
  //             return value.props.children
  //               .map((child) =>
  //                 typeof child === "string" || typeof child === "number"
  //                   ? child
  //                   : ""
  //               )
  //               .join(" ");
  //           }

  //           return "-";
  //         }

  //         // Handle basic values
  //         if (typeof value === "number" || value === true || value === false) {
  //           return value;
  //         }

  //         if (!isNaN(value) && value !== "") {
  //           return Number(value);
  //         }

  //         return `${String(value).replace(/"/g, '""')}`;
  //       });
  //     });

  //     // Combine headers and rows into CSV string
  //     const csvContent = [
  //       headers.join(","),
  //       ...rows.map((row) =>
  //         row
  //           .map((cell) => {
  //             const rawValue = typeof cell === "string" ? cell.trim() : cell;

  //             if (
  //               typeof rawValue === "number" ||
  //               rawValue === true ||
  //               rawValue === false
  //             ) {
  //               return rawValue;
  //             }

  //             if (!isNaN(rawValue) && rawValue !== "") {
  //               return Number(rawValue);
  //             }

  //             return `${String(rawValue).replace(/"/g, '""')}`;
  //           })
  //           .join(",")
  //       ),
  //     ].join("\n");

  //     // Create a Blob for the CSV file
  //     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  //     const link = document.createElement("a");
  //     const url = URL.createObjectURL(blob);

  //     // Set up the download
  //     link.setAttribute("href", url);
  //     link.setAttribute("download", "partner_commission.csv");
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     URL.revokeObjectURL(url);

  //     toast.success("Partner Commission report downloaded successfully!");
  //   } catch (error) {
  //     console.error("Error exporting report:", error);
  //     toast.error("Something went wrong while exporting the report.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleExport = async () => {
    try {
      setIsLoading(true);
      const res = await dispatch(
        partnerCommissionReportGetAll(
          1,
          10000,
          search,
          filters.startDate,
          filters.endDate,
          filters.type?.value || "",
          filters.institute?.value || "",
          filters.country?.value || "",
          filters.status?.value || "",
          filters.b2bId?.value || "",
          filters.branchId?.value || ""
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
      link.setAttribute("download", "partner_commission.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Partner Commission report downloaded successfully!");
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
        mainheading="Partner Commission"
        parentfolder="Reports"
        activepage="Partner Commission"
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
                <div className="card-title">Partner Commission Report</div>
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
                      placeholder="Search here..."
                      autoComplete="off"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>

                  {partnerCommissionReports?.length > 0 && canDownload && (
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

                    <div className="filter-item">
                      <Form.Label>Institute</Form.Label>
                      <Select
                        options={instituteOptions}
                        value={
                          instituteOptions.find(
                            (option) =>
                              option.value === filters.institute?.value
                          ) || null
                        }
                        onChange={(option) => {
                          setFilters({ ...filters, institute: option });
                          setCurrentPage(1);
                        }}
                        placeholder="Select Institute"
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
                      <Form.Label>Country</Form.Label>
                      <Select
                        options={countryOptions}
                        value={
                          countryOptions.find(
                            (option) => option.value === filters.country?.value
                          ) || null
                        }
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
                        options={statusOptions}
                        value={
                          statusOptions.find(
                            (option) => option.value === filters.status?.value
                          ) || null
                        }
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
                      <Form.Label>B2B</Form.Label>
                      <Select
                        options={b2bOptions}
                        value={
                          b2bOptions.find(
                            (option) => option.value === filters.b2bId?.value
                          ) || null
                        }
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

                    <div className="filter-item">
                      <Form.Label>Branch</Form.Label>
                      <Select
                        options={branchOptions}
                        value={
                          branchOptions.find(
                            (option) => option.value === filters.branchId?.value
                          ) || null
                        }
                        onChange={(option) => {
                          setFilters({ ...filters, branchId: option });
                          setCurrentPage(1);
                        }}
                        placeholder="Select Branch"
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
                          {partnerCommissionReports?.length > 0
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

                    <div className="align-items-center">
                      <div className="filter-item filter-height total-records px-3 d-flex align-items-center">
                        <span>
                          Total Records :<strong> {totalRecords}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}

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
                        <th key={index} scope="col" className="dynamic-width">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {partnerCommissionReports?.length > 0 ? (
                      partnerCommissionReports
                        .filter(Boolean)
                        .map((item, index) => (
                          <tr
                            key={item._id || index}
                            className={`${index % 2 === 0
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

              {totalPages > 1 && partnerCommissionReports.length > 0 && (
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

export default PartnerCommissionReport;
