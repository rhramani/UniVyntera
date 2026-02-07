import { useEffect, useRef, useState, useMemo } from "react";
import Pageheader from "../../layouts/Pageheader";
import {
  Card,
  Col,
  Row,
  ProgressBar,
  Form,
  Dropdown,
  OverlayTrigger,
  Tooltip,
  Badge,
} from "react-bootstrap";

import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminGetOne } from "../../redux/actions/Admin.action";
import { decryptData } from "../../utils/encryptionUtils";
import { getOneB2BAdmin } from "../../redux/actions/B2BAdmin.action";
import { getAllBranch, getOneBranch } from "../../redux/actions/Branch.action";
import { getB2BMemberById } from "../../redux/actions/B2BMember.action";
import { Bar, Doughnut } from "react-chartjs-2";
import { getBranchMemberById } from "../../redux/actions/BranchMember.action";
import { MdCalendarToday } from "react-icons/md";
import Calendar from "react-calendar";
import DashboardTabs from "./components/DashboardTabs";
import Dialpad from "./components/Dialpad";

import { getAllStudentApplication } from "../../redux/actions/Student/StudentApplication.action";
import { getAllStudentStatus } from "../../redux/actions/Student/StudentStatus.action";
import Select from "react-select";
import usePermissions from "../commonComponents/usePermissions";
import { getAllDashboardData } from "../../redux/actions/Dashboard.action";
import Paginations from "../elements/Paginations";
import { getAllTotalBankCash } from "../../redux/actions/Accountant/GenerateInvoice.action";
import { getOneCoachingFaculty } from "../../redux/actions/Master/CoachingFaculty.action";
import SmallDialpad from "./components/SmallDialpad";
import getSymbolFromCurrency from "currency-symbol-map";
import { QRCodeCanvas } from "qrcode.react";
import { QRCODE_URL } from "../../baseUrl";
import UserDashboardTab from "./components/UserDashboardTab";

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

const Dashboard = () => {
  const dispatch = useDispatch();
  const [loginData, setLoginData] = useState();
  const userId = decryptData(localStorage.getItem("userId"));
  const branchId = decryptData(localStorage.getItem("branchId"));
  const role = decryptData(localStorage.getItem("role"));
  const userRole = decryptData(localStorage.getItem("userRole"));
  const userName = decryptData(localStorage.getItem("userName"));
  const userType = decryptData(localStorage.getItem("userType"));

  const [b2BAdminLoginData, setB2BAdminLoginData] = useState();
  const [b2BMemberLoginData, setB2BMemberLoginData] = useState({});
  const [branchLoginData, setbranchLoginData] = useState();
  const [branchMemberLoginData, setbranchMemberLoginData] = useState();
  const [branchesList, setBranchesList] = useState([]);
  const [coachingFaculty, setCoachingFaculty] = useState({});
  const [selectedBranch, setSelectedBranch] = useState("All");

  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [showAll, setShowAll] = useState(true);

  const [studentStatuses, setStudentStatuses] = useState([]);
  const { canRead } = usePermissions("Dashboard");
  const { canShow: canShowAllLeads } = usePermissions("All Leads");
  const { canShow: canShowAllocated } = usePermissions("Allocated Leads");

  const [dashboardData, setDashboardData] = useState();

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  // Tabs States :
  const [activeTab, setActiveTab] = useState("applicationPipeline");
  const storedEncryptedCurrency = decryptData(
    localStorage.getItem("crmCurrency"),
  );

  const [allStudentApplication, setAllStudentApplication] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState("");
  const [mainStatus, setMainStatus] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [totalDueAmount, setTotalDueAmount] = useState(0);
  const [bankwiseTotals, setBankwiseTotals] = useState([]);

  const startDateInputRef = useRef(null);
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const endDateInputRef = useRef(null);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const [endDateValue, setEndDateValue] = useState(null);
  const startDateCalendarRef = useRef(null);
  const endDateCalendarRef = useRef(null);

  const fetchAllStudentApplication = async (
    page = 1,
    limit = itemsPerPage,
    searchOnField = "",
    search = "",
    mainStatus = "",
    branchId = "",
    showAll = false,
    country = "",
    followUp = "",
    b2bId = "",
  ) => {
    try {
      const res = await dispatch(
        getAllStudentApplication(
          page,
          limit,
          searchOnField,
          search,
          mainStatus,
          branchId,
          showAll,
          country,
          followUp,
          b2bId,
        ),
      );
      const responseData = res?.data?.data;
      setAllStudentApplication(responseData?.data || []);
      setTotalPages(responseData?.totalPages || 0);
      setTotalRecords(responseData?.totalRecords || 0);
    } catch (error) {
      console.error("Error fetching student applications:", error);
      setAllStudentApplication([]);
      setTotalPages(0);
      setTotalRecords(0);
    }
  };

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    if (canRead) {
      // const branchId = selectedBranch === "all" ? "" : selectedBranch || "";
      // const newShowAll = selectedBranch === "all" ? true : showAll;
      fetchAllStudentApplication(
        currentPage,
        itemsPerPage,
        search,
        mainStatus?.value || "",
        selectedBranchId,
        showAll,
        selectedCountry?.value || "",
      );
    }
  }, [
    currentPage,
    itemsPerPage,
    search,
    mainStatus,
    selectedBranch,
    selectedBranchId,
    showAll,
    selectedCountry,
    canRead,
  ]);

  const handleStudentStatusChange = (selectedOption) => {
    setMainStatus(selectedOption);
    setCurrentPage(1);
    if (canRead) {
      const branchId = selectedBranch === "all" ? "" : selectedBranch || "";
      const newShowAll = selectedBranch === "all" ? true : showAll;
      fetchAllStudentApplication(
        1,
        itemsPerPage,
        search,
        selectedOption?.value || "",
        branchId,
        newShowAll,
        selectedCountry?.value || "",
      );
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const columns = [
    {
      label: "Student Name",
      key: "name",
      render: (item) => item.name || "-",
    },
    {
      label: "Counselor",
      key: "createdByName",
      render: (item) => item.createdByName || "-",
    },
    {
      label: "Country",
      key: "country",
      render: (item) =>
        item.purposeDetails?.preferredCountry?.[0] || item.country || "-",
    },
    {
      label: "University",
      key: "instituteName",
      render: (item) =>
        item.interestedCourseDetails?.[0]?.institute?.instituteName || "-",
    },
    {
      label: "Status",
      key: "mainStatus",
      render: (item) => {
        const statusName = item.mainStatus?.name;

        if (!statusName) return "-";
        const statusColor =
          studentStatuses.find((status) => status.name === statusName)?.color ||
          "#6c757d"; // Fallback color if no match
        return (
          <span
            style={{
              backgroundColor: statusColor,
              padding: "4px 8px",
              color: "#FFF",
              borderRadius: "12px",
            }}
          >
            {statusName}
          </span>
        );
      },
    },
    {
      label: "Last Updated",
      key: "updatedAt",
      render: (item) => formatDate(item.updatedAt),
    },
    // {
    //   label: "Actions",
    //   key: "actions",
    //   render: () => (
    //     <Button variant="link" className="text-primary">
    //       View
    //     </Button>
    //   ),
    // },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
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
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchAllBranches = async () => {
    try {
      const res = await dispatch(getAllBranch(1, 100, ""));
      const responseData = res?.data?.data;
      if (responseData?.data?.length === 0) {
        setBranchesList([]);
      } else {
        setBranchesList(responseData?.data || []);
      }
    } catch (error) {
      console.error("Error fetching institute:", error);
      setBranchesList([]);
    }
  };

  useEffect(() => {
    fetchAllBranches();
    if (branchesList?.length > 0) {
      setSelectedBranch(branchesList[0]?.name);
    }
  }, []);

  // const fetchAllStudentApplication = async (
  //   page = "",
  //   limit = "",
  //   search = "",
  //   mainStatus = "",
  //   branchId = "",
  //   showAll = true,
  //   country = ""
  // ) => {
  //   const res = await dispatch(
  //     getAllStudentApplication(
  //       page,
  //       limit,
  //       search,
  //       mainStatus,
  //       branchId,
  //       showAll,
  //       country
  //     )
  //   );
  //   setTotalApplicationCount(res?.data?.data?.totalRecords);
  // };

  const handleBranchSelect = (branchName, branchId = "") => {
    setSelectedBranch(branchName);
    setSelectedBranchId(branchId);

    if (branchName === "All") {
      setShowAll(true);
      setSelectedBranchId("");
    } else if (branchName === "Head Office") {
      setShowAll(false);
      setSelectedBranchId("");
    } else {
      setShowAll(false);
      setSelectedBranchId(branchId);
    }
  };

  const fetchTotalBankCash = async () => {
    try {
      if (canRead) {
        const res = await dispatch(getAllTotalBankCash());
        setTotalPaidAmount(res?.data?.data?.bankBalance || 0);
        setTotalDueAmount(res?.data?.data?.cashBalance || 0);
        setBankwiseTotals(res?.data?.data?.bankwiseTotals || []);
      }
    } catch (error) {
      console.error("Error fetching total bank cash:", error);
    }
  };

  const fetchAllDashboardData = async () => {
    try {
      const headOffice = selectedBranch === "Head Office" ? true : false;
      const branchId = selectedBranchId;

      const res = await dispatch(
        getAllDashboardData(
          filters.startDate,
          filters.endDate,
          branchId,
          headOffice,
        ),
      );
      const responseData = res?.data?.data;

      setDashboardData(responseData);
    } catch (error) {
      console.error("Error fetching in dashboard totals:", error);
    }
  };

  const fetchStudentStatuses = async () => {
    try {
      const res = await dispatch(getAllStudentStatus());
      if (res?.status === 200) {
        setStudentStatuses(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching student statuses:", error);
    }
  };

  const studentStatusOptions = studentStatuses.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  useEffect(() => {
    const isB2BAdmin = role === "b2bAdmin" || role === "B2B Admin";
    const isB2BMember = role === "b2bMember" || role === "B2B Member";

    if (isB2BAdmin) {
      dispatch(getOneB2BAdmin(userId))
        .then((res) => {
          setB2BAdminLoginData(res.data);
        })
        .catch((err) => {
          console.log("errerrerrerr", err);
        });
    }
    if (isB2BMember) {
      dispatch(getB2BMemberById(userId))
        .then((res) => {
          setB2BMemberLoginData(res?.data?.data || {});
        })
        .catch((err) => {
          console.log("errerrerrerr", err);
        });
    }

    if (!isB2BAdmin && !isB2BMember) {
      dispatch(adminGetOne(userId))
        .then((res) => {
          setLoginData(res.data);
        })
        .catch((err) => {
          console.log("errerrerrerr", err);
        });
    }

    if (role === "Branch") {
      dispatch(getOneBranch(userId))
        .then((res) => {
          setbranchLoginData(res.data);
        })
        .catch((err) => {
          console.log("errerrerrerr", err);
        });
    }

    if (role === "Branch Member") {
      dispatch(getBranchMemberById(userId))
        .then((res) => {
          setbranchMemberLoginData(res.data);
        })
        .catch((err) => {
          console.log("errerrerrerr", err);
        });
    }

    if (role === "Coaching Faculty") {
      dispatch(getOneCoachingFaculty(userId))
        .then((res) => {
          setCoachingFaculty(res?.data?.data || {});
        })
        .catch((err) => {
          console.error("coachingFaculty fetch error:", err);
        });
    }

    fetchAllDashboardData();
    fetchStudentStatuses();
    fetchTotalBankCash();
  }, [
    userId,
    role,
    filters.startDate,
    filters.endDate,
    selectedBranch,
    selectedBranchId,
  ]);

  const totalCountry = dashboardData?.countryVisaApproval?.length || 0;

  const counselorTasksData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        label: "Follow-ups",
        data: [30, 20],
        backgroundColor: ["rgba(98, 89, 202, 0.8)", "rgba(204, 204, 204, 0.3)"], // Match bg-primary and bg-light
        borderColor: ["rgba(255, 255, 255, 1)"],
        borderWidth: 2,
      },
    ],
  };

  const counselorTasksOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Legends are shown in the header
      tooltip: { enabled: true },
    },
    cutout: "60%", // Donut effect
  };

  const filteredBranchData =
    dashboardData?.branchWiseCollectionVsExpense?.filter(
      (branch) => branch.branch !== "Head Office",
    );

  const branchName = filteredBranchData?.map((branch) => branch?.branch);
  const Collection = filteredBranchData?.map((branch) => branch?.collection);
  const expense = filteredBranchData?.map((branch) => branch?.expense);

  // Branch-wise Collection vs Expense Chart Data
  const branchCollectionData = {
    labels: branchName,
    datasets: [
      {
        label: "Collection",
        data: Collection,
        backgroundColor: "#4A90E2",
      },
      {
        label: "Expenses",
        data: expense,
        backgroundColor: "#9013FE",
      },
    ],
  };

  const branchCollectionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        beginAtZero: true,
        title: { display: true, text: "Amount (₹M)" },
      },
    },
  };

  const applicationsVsOfferLettersData = {
    labels: ["Total Applications", "Offer Letters"],
    datasets: [
      {
        label: "Count",
        data: [
          dashboardData?.totalStudents || 0,
          dashboardData?.totalOfferLetter || 0,
        ],
        backgroundColor: ["#4A90E2", "#9013FE"],
        borderColor: ["#fff", "#fff"],
        borderWidth: 2,
      },
    ],
  };

  const applicationsVsOfferLettersOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#333",
          font: {
            weight: "bold",
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#ddd",
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Count",
        },
      },
      x: {
        title: {
          display: true,
          text: "Category",
        },
      },
    },
  };

  const topCounselorByadmissionCount =
    dashboardData?.topCounselorByAdmission || [];

  const topCounselorNames = topCounselorByadmissionCount?.map(
    (item) => item.name,
  );
  const topCounselorData = topCounselorByadmissionCount?.map(
    (item) => item.count,
  );

  // Top Counselors by Admission Count Chart Data
  const topCounselorsData = {
    labels: topCounselorNames,
    datasets: [
      {
        label: "Admissions",
        data: topCounselorData,
        backgroundColor: "#4A90E2",
        barPercentage: 0.5,
      },
    ],
  };

  const topCounselorsOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { beginAtZero: true, title: { display: true, text: "Admissions" } },
    },
  };

  const topInquiries = (dashboardData?.topLeadInquiryFrom || [])
    .filter((item) => item.lead_from && item.lead_from.trim() !== "")
    .sort((a, b) => b.count - a.count);

  //   const qrCodeUrl = `${QRCODE_URL}/publicleadform?from=qr&userName=${
  //   userName || ""
  // }&userType=${userType || ""}&userId=${userId || ""}&branchId=${
  //   branchId || ""
  // }`;
  // QR Code URL (points to the PublicLeadForm route)
  // Properly encode URL parameters and only generate when all required values are present
  const qrCodeUrl = useMemo(() => {
    if (!userName || !userType || !userId) {
      return null; // Don't generate QR code if required values are missing
    }

    const params = new URLSearchParams({
      from: "qr",
      userName: userName || "",
      userType: userType || "",
      userId: userId || "",
      branchId: branchId || "",
    });

    return `${QRCODE_URL}/publicleadform?${params.toString()}`;
  }, [userName, userType, userId, branchId]);

  // Check if QR code should be displayed (all required values present)
  const shouldShowQRCode = userName && userType && userId;

  const KPI_CARDS = [
    {
      title: "Total Leads",
      value: dashboardData?.totalLeads || 0,
      link: `/lead/allleads?selectedBranch=${selectedBranch}`,
      icon: "fe-users",
      color: "success",
    },
    {
      title: "Today's Follow-ups",
      value: dashboardData?.todayFollowUpLeads || 0,
      link: "/lead/todayfollowup",
      icon: "fe-phone-call",
      color: "warning",
    },
    {
      title: "Pending Leads",
      value: dashboardData?.totalPendingLeads || 0,
      link: `/lead/allleads?status=New&selectedBranch=${selectedBranch}`,
      icon: "fe-clock", // Change to your icon class
      color: "primary",
    },
    {
      title: "Total Applications",
      value: dashboardData?.totalStudents || 0,
      link: `/student/studentapplication?selectedBranch=${selectedBranch}`,
      icon: "fe-file-text",
      color: "info",
    },
  ];

  // --- Custom Data Prep for Refined UI ---

  // 1. Country-Wise Visa Approval Logic
  const refinedCountryData = useMemo(() => {
    const raw = dashboardData?.countryVisaApproval || [];
    const total = raw.reduce((sum, item) => sum + (item.totalApproved || 0), 0);
    const sorted = [...raw].sort(
      (a, b) => (b.totalApproved || 0) - (a.totalApproved || 0),
    );

    // Muted Pastel Colors Palette
    const palette = [
      "#6c5ffc",
      "#05c3fb",
      "#f7b731",
      "#e82646",
      "#09ad95",
      "#1170e4",
      "#f82649",
    ];

    return sorted.map((item, index) => ({
      name: item._id || "Unknown",
      count: item.totalApproved || 0,
      percentage:
        total > 0 ? ((item.totalApproved / total) * 100).toFixed(1) : 0,
      color: palette[index % palette.length],
    }));
  }, [dashboardData]);

  const maxCountryValue =
    Math.max(...refinedCountryData.map((d) => d.count), 0) || 1;

  // 2. Bank-Wise Total Amount Logic
  const refinedBankData = useMemo(() => {
    const raw = bankwiseTotals || [];
    // const total = raw.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
    const palette = ["#6259ca", "#01b8ff", "#198754", "#f7b731", "#dc3545"];

    const chartData = {
      labels: raw.map((i) => i.bankName || "Unknown"),
      datasets: [
        {
          data: raw.map((i) => i.totalAmount || 0),
          backgroundColor: palette,
          borderWidth: 0,
          hoverOffset: 5,
          cutout: "75%",
          radius: "90%",
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
      },
    };

    return { list: raw, chartData, chartOptions, palette };
  }, [bankwiseTotals]);

  return (
    <>
      <div
        className={
          userRole === "Super Admin"
            ? ""
            : "d-flex justify-content-between mt-4 mb-3"
        }
      >
        <Pageheader
          mainheading="Dashboard"
          parentfolder="Home"
          activepage="Dashboard"
        />
        {userRole !== "Super Admin" &&
          userRole !== "B2B Admin" &&
          userRole !== "Branch" &&
          shouldShowQRCode &&
          qrCodeUrl && (
            <Col sm={12} md={6} lg={6} xl={3}>
              <Card className="custom-card h-100">
                <div className="card-item">
                  <div className="text-center my-2">
                    <label className="main-content-label fs-13 font-weight-bold">
                      Create New Lead
                    </label>
                  </div>
                  <div className="text-center">
                    <QRCodeCanvas
                      value={qrCodeUrl}
                      size={120}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>
              </Card>
            </Col>
          )}
      </div>

      {(userType === "user" || userType === "Branch User") &&
      userRole !== "Super Admin" ? (
        <>
          <Row className="row-sm mt-lg">
            <Col sm={12} md={6} lg={6} xl={3} className="mb-3">
              <UserDashboardTab
                title="Pending Leads"
                value={dashboardData?.totalPendingLeads}
                iconClass="fe fe-file-text"
                bgClass="bg-info-transparent"
                textClass="text-info"
              />
            </Col>

            {(userType === "Branch User" ? canShowAllLeads : true) && (
              <Col sm={12} md={6} lg={6} xl={3} className="mb-3">
                <UserDashboardTab
                  title="Total Leads"
                  value={dashboardData?.totalLeads}
                  iconClass="fe fe-layers"
                  bgClass="bg-primary-transparent"
                  textClass="text-primary"
                />
              </Col>
            )}
            <Col sm={12} md={6} lg={6} xl={3} className="mb-3">
              <UserDashboardTab
                title="Allocated Leads"
                value={dashboardData?.allocatedLeads}
                iconClass="fe fe-users"
                bgClass="bg-success-transparent"
                textClass="text-success"
              />
            </Col>

            <Col sm={12} md={6} lg={6} xl={3} className="mb-3">
              <UserDashboardTab
                title="Today's FollowUp Leads"
                value={dashboardData?.todayFollowUpLeads}
                iconClass="fe fe-phone-call"
                bgClass="bg-warning-transparent"
                textClass="text-warning"
              />
            </Col>

            <Col sm={12} md={6} lg={6} xl={3} className="mb-3">
              <UserDashboardTab
                title="Total Applications"
                value={dashboardData?.totalStudents}
                iconClass="fe fe-file"
                bgClass="bg-secondary-transparent"
                textClass="text-secondary"
              />
            </Col>

            <Col sm={12} md={6} lg={6} xl={3} className="mb-3">
              <UserDashboardTab
                title="Total Offer Letters"
                value={dashboardData?.totalOfferLetter}
                iconClass="fe fe-mail"
                bgClass="bg-info-transparent"
                textClass="text-info"
              />
            </Col>

            <Col sm={12} md={6} lg={6} xl={3} className="mb-3">
              <UserDashboardTab
                title="Total Admissions"
                value={dashboardData?.totalAdmissions}
                iconClass="fe fe-check-circle"
                bgClass="bg-success-transparent"
                textClass="text-success"
              />
            </Col>

            <Col sm={12} md={6} lg={6} xl={3} className="mb-3">
              <UserDashboardTab
                title="Visa Approved"
                value={dashboardData?.totalVisaApproved}
                iconClass="fe fe-award"
                bgClass="bg-primary-transparent"
                textClass="text-primary"
              />
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Row className="row-sm align-items-stretch">
            <Col sm={12} md={8} lg={9} xl={10} className="mb-3">
              <Card className="bg-primary custom-card card-box h-100 overflow-hidden shadow-sm border-0">
                {/* Added a subtle decorative background circle for a modern look */}
                <div
                  className="pos-absolute all-0 opacity-10"
                  style={{
                    background:
                      "radial-gradient(circle at top right, #ffffff 0%, transparent 70%)",
                    pointerEvents: "none",
                  }}
                ></div>

                <Card.Body className="p-4 d-flex flex-column justify-content-center position-relative">
                  <div className="d-flex align-items-center mb-2">
                    <h3 className="font-weight-bold text-fixed-white mb-0">
                      Welcome back, {userName}!
                    </h3>
                  </div>

                  <p
                    className="text-fixed-white op-9 mb-4 fs-14"
                    style={{ maxWidth: "600px" }}
                  >
                    Your dashboard is up to date. Here is a quick snapshot of
                    what requires your attention today.
                  </p>

                  <div className="d-flex flex-wrap gap-3">
                    {/* Stat Pill 1 */}
                    <div className="d-flex align-items-center bg-white-10 rounded-3 px-3 py-2 border border-white-2">
                      <div
                        className="me-3 bg-warning rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "32px", height: "32px" }}
                      >
                        <i className="fe fe-phone text-dark fs-14"></i>
                      </div>
                      <div>
                        <div className="text-fixed-white fs-12 op-8">
                          Today's Follow-ups
                        </div>
                        <div className="text-fixed-white fw-bold fs-16">
                          {dashboardData?.totalStudents || 0}
                        </div>
                      </div>
                    </div>

                    {/* Stat Pill 2 */}
                    <div className="d-flex align-items-center bg-white-10 rounded-3 px-3 py-2 border border-white-2">
                      <div
                        className="me-3 bg-info rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "32px", height: "32px" }}
                      >
                        <i className="fe fe-file-text text-white fs-14"></i>
                      </div>
                      <div>
                        <div className="text-fixed-white fs-12 op-8">
                          Pending Reviews
                        </div>
                        <div className="text-fixed-white fw-bold fs-16">
                          {dashboardData?.totalStudents || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {shouldShowQRCode && qrCodeUrl && (
              <Col sm={12} md={4} lg={3} xl={2} className="mb-3">
                <Card className="custom-card h-100 border-0 shadow-sm text-center">
                  <Card.Body className="d-flex flex-column align-items-center justify-content-center p-3">
                    <div className="mb-2">
                      <span className="text-uppercase fw-bold fs-11 text-muted letter-spacing-1">
                        Quick Action
                      </span>
                      <h6 className="mb-3 mt-1 fw-bold">Create New Lead</h6>
                    </div>

                    <div className="p-2 bg-light rounded-3 shadow-inner">
                      <QRCodeCanvas
                        value={qrCodeUrl}
                        size={110}
                        bgColor="transparent"
                        fgColor="#2b313c"
                        level="H"
                        includeMargin={false}
                      />
                    </div>

                    <div className="mt-3">
                      <Badge
                        bg="primary-light"
                        className="text-primary fw-normal border-0"
                        style={{ cursor: "pointer" }} // Makes it look clickable
                        onClick={() => window.open(qrCodeUrl, "_blank")} // Opens the link
                      >
                        <i className="fe fe-external-link me-1"></i> Open Link
                      </Badge>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>

          {/* Filters */}
          <Row className="row-sm">
            {!(
              [
                "Branch",
                "b2bAdmin",
                "B2B Admin",
                "b2bMember",
                "B2B Member",
              ].includes(role) || userRole == "Branch User"
            ) && (
              <>
                <Col md={9}>
                  <Row className="row-sm mb-4 align-items-stretch">
                    {/* DATE RANGE CONTROL CARD */}
                    <Col xl={8} lg={7} md={12} className="mb-3">
                      <Card
                        className="custom-card h-100 border-0 shadow-sm overflow-visible"
                        // style={{ zIndex: 100 }}
                      >
                        <Card.Body className="p-3">
                          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center">
                            {/* Icon Badge - Matches KPI style */}
                            <div
                              className="bg-primary-transparent rounded-circle d-flex align-items-center justify-content-center mb-3 mb-sm-0 me-sm-3"
                              style={{
                                width: "54px",
                                height: "54px",
                                minWidth: "54px",
                              }}
                            >
                              <i className="fe fe-calendar fs-24 text-primary"></i>
                            </div>

                            <div className="flex-grow-1">
                              <h6 className="fw-bold mb-2 fs-14">Date Range</h6>
                              <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-2">
                                {/* Start Date Field */}
                                <div className="position-relative flex-fill">
                                  <Form.Control
                                    type="text"
                                    placeholder="From Date"
                                    value={
                                      filters.startDate
                                        ? formatDate(
                                            parseDate(filters.startDate),
                                          )
                                        : ""
                                    }
                                    readOnly
                                    ref={startDateInputRef}
                                    onClick={() =>
                                      setShowStartDateCalendar(
                                        !showStartDateCalendar,
                                      )
                                    }
                                    className="form-control-sm bg-light border-0 px-3 fs-13"
                                    style={{
                                      height: "38px",
                                      cursor: "pointer",
                                    }}
                                  />
                                  {filters.startDate && (
                                    <span
                                      className="position-absolute end-0 top-50 translate-middle-y me-3 cursor-pointer text-muted hover-primary"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setFilters({
                                          ...filters,
                                          startDate: "",
                                        });
                                      }}
                                      style={{ zIndex: 10 }}
                                    >
                                      <i className="fe fe-x fs-10"></i>
                                    </span>
                                  )}
                                  {showStartDateCalendar && (
                                    <div
                                      ref={startDateCalendarRef}
                                      className="position-absolute top-100 start-0 mt-2 shadow-lg bg-white border"
                                      style={{
                                        zIndex: 1000,
                                        borderRadius: "8px",
                                      }}
                                    >
                                      <Calendar
                                        className="form-control m-0 p-0 border-0"
                                        onChange={(d) => {
                                          setFilters({
                                            ...filters,
                                            startDate: toISODate(d),
                                          });
                                          setShowStartDateCalendar(false);
                                        }}
                                        value={
                                          filters.startDate
                                            ? parseDate(filters.startDate)
                                            : null
                                        }
                                        tileClassName={({ date, view }) =>
                                          view === "month" &&
                                          date.toDateString() ===
                                            new Date().toDateString()
                                            ? "no-today-highlight"
                                            : null
                                        }
                                      />
                                    </div>
                                  )}
                                </div>

                                <span className="text-muted fw-bold d-none d-md-inline">
                                  →
                                </span>

                                {/* End Date Field */}
                                <div className="position-relative flex-fill">
                                  <Form.Control
                                    type="text"
                                    placeholder="To Date"
                                    value={
                                      filters.endDate
                                        ? formatDate(parseDate(filters.endDate))
                                        : ""
                                    }
                                    readOnly
                                    ref={endDateInputRef}
                                    onClick={() =>
                                      setShowEndDateCalendar(
                                        !showEndDateCalendar,
                                      )
                                    }
                                    className="form-control-sm bg-light border-0 px-3 fs-13"
                                    style={{
                                      height: "38px",
                                      cursor: "pointer",
                                    }}
                                  />
                                  {filters.endDate && (
                                    <span
                                      className="position-absolute end-0 top-50 translate-middle-y me-3 cursor-pointer text-muted hover-primary"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setFilters({
                                          ...filters,
                                          endDate: "",
                                        });
                                      }}
                                      style={{ zIndex: 10 }}
                                    >
                                      <i className="fe fe-x fs-10"></i>
                                    </span>
                                  )}
                                  {showEndDateCalendar && (
                                    <div
                                      ref={endDateCalendarRef}
                                      className="position-absolute top-100 start-0 mt-2 shadow-lg bg-white border"
                                      style={{
                                        zIndex: 1000,
                                        borderRadius: "8px",
                                      }}
                                    >
                                      <Calendar
                                        className="form-control m-0 p-0 border-0"
                                        onChange={(d) => {
                                          setFilters({
                                            ...filters,
                                            endDate: toISODate(d),
                                          });
                                          setShowEndDateCalendar(false);
                                        }}
                                        value={
                                          filters.endDate
                                            ? parseDate(filters.endDate)
                                            : null
                                        }
                                        tileClassName={({ date, view }) =>
                                          view === "month" &&
                                          date.toDateString() ===
                                            new Date().toDateString()
                                            ? "no-today-highlight"
                                            : null
                                        }
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>

                    {/* BRANCH SELECTOR CARD */}
                    <Col xl={4} lg={5} md={12} className="mb-3">
                      <Card
                        className="custom-card h-100 border-0 shadow-sm overflow-visible"
                        style={{
                          background: "#5D54BE",
                        }}
                      >
                        <Card.Body className="p-3">
                          <div className="d-flex align-items-center h-100">
                            {/* Icon Badge */}
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center me-3"
                              style={{
                                width: "48px",
                                height: "48px",
                                minWidth: "48px",
                                background: "rgba(255, 255, 255, 0.2)",
                              }}
                            >
                              <i className="fe fe-map-pin fs-18 text-white"></i>
                            </div>

                            <div className="flex-grow-1">
                              <p className="mb-1 text-white-50 fs-11 fw-bold text-uppercase letter-spacing-1">
                                Workspace
                              </p>

                              <Dropdown className="w-100">
                                <Dropdown.Toggle
                                  as="div" // Use as="div" to remove default bootstrap caret/button styles
                                  role="button"
                                  className="d-flex align-items-center justify-content-between px-3 py-2 rounded-2 text-white fw-bold fs-15 shadow-none no-caret"
                                  style={{
                                    background: "rgba(255, 255, 255, 0.1)", // Light tint
                                    border:
                                      "1px solid rgba(255, 255, 255, 0.3)", // Subtle white border
                                    cursor: "pointer",
                                  }}
                                >
                                  <span className="text-truncate">
                                    {selectedBranch ||
                                      (branchesList && branchesList[0]?.name) ||
                                      "Global View"}
                                  </span>
                                  {/* Only this arrow will show now */}
                                  <i className="fe fe-chevron-down fs-14 ms-2 opacity-75"></i>
                                </Dropdown.Toggle>

                                <Dropdown.Menu
                                  className="shadow-lg border-0 mt-2 py-2"
                                  style={{
                                    minWidth: "220px",
                                    borderRadius: "10px",
                                  }}
                                >
                                  <Dropdown.Header className="fs-10 text-uppercase fw-bold text-muted">
                                    Switch Branch
                                  </Dropdown.Header>
                                  <Dropdown.Item
                                    className="py-2 px-3 fs-13"
                                    onClick={() =>
                                      handleBranchSelect("All", "")
                                    }
                                  >
                                    <i className="fe fe-globe me-2 text-primary opacity-50"></i>
                                    Global View (All)
                                  </Dropdown.Item>

                                  <Dropdown.Divider className="mx-2" />

                                  <div
                                    style={{
                                      maxHeight: "200px",
                                      overflowY: "auto",
                                    }}
                                  >
                                    {branchesList?.map((branch, index) => (
                                      <Dropdown.Item
                                        key={index}
                                        className={`py-2 px-3 fs-13 ${selectedBranch === branch.name ? "bg-primary-light fw-bold text-primary" : ""}`}
                                        onClick={() =>
                                          handleBranchSelect(
                                            branch?.name,
                                            branch?._id,
                                          )
                                        }
                                      >
                                        <i className="fe fe-map-pin me-2 opacity-50"></i>
                                        {branch?.name}
                                      </Dropdown.Item>
                                    ))}
                                  </div>
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <Row className="row-sm mt-lg">
                    {KPI_CARDS?.map((card, index) => (
                      <Col
                        key={index}
                        sm={12}
                        md={6}
                        lg={6}
                        xl={3}
                        className="mb-3"
                      >
                        <Link to={card.link} style={{ textDecoration: "none" }}>
                          <Card className="custom-card h-100 border-0 shadow-sm kpi-hover-card">
                            <Card.Body className="p-3">
                              <div className="d-flex align-items-center">
                                {/* Icon Container with subtle background */}
                                <div
                                  className={`bg-${card.color}-transparent rounded-circle d-flex align-items-center justify-content-center me-3`}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    minWidth: "50px",
                                  }}
                                >
                                  <i
                                    className={`fe ${card.icon} fs-20 text-${card.color}`}
                                  ></i>
                                </div>

                                {/* Text Content */}
                                <div className="flex-grow-1">
                                  <p className="main-content-label mb-1 text-uppercase letter-spacing-1">
                                    {card.title}
                                  </p>
                                  <div className="d-flex align-items-baseline">
                                    <h3
                                      className="text-muted mb-0"
                                      style={{ fontSize: "16px" }}
                                    >
                                      {card.value}
                                    </h3>
                                    {/* Optional: Add a small trend indicator if you have the data */}
                                    {/* <span className="ms-2 text-success fs-11 fw-semibold">+5%</span> */}
                                  </div>
                                </div>

                                {/* Optional: Simple Arrow indicator */}
                                <div className="ms-auto opacity-25">
                                  <i className="fe fe-chevron-right fs-16"></i>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Link>
                      </Col>
                    ))}
                  </Row>

                  <Row className="row-sm">
                    {/* Total Admissions */}
                    <Col sm={12} md={6} lg={6} xl={4} className="mb-3">
                      <Link
                        to={`/student/studentapplication?selectedBranch=${selectedBranch}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Card className="custom-card h-100 border-0 shadow-sm kpi-hover-card">
                          <Card.Body className="p-3">
                            <div className="d-flex align-items-center">
                              <div
                                className="bg-success-transparent rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  minWidth: "50px",
                                }}
                              >
                                <i className="fe fe-user-check fs-20 text-success"></i>
                              </div>
                              <div className="flex-grow-1">
                                <p className="main-content-label mb-1 text-uppercase letter-spacing-1">
                                  Total Admissions
                                </p>
                                <h3
                                  className="text-muted mb-0 fw-bold"
                                  style={{ fontSize: "16px" }}
                                >
                                  {dashboardData?.totalAdmissions || 0}
                                </h3>
                              </div>
                              <div className="ms-auto opacity-25">
                                <i className="fe fe-chevron-right fs-16"></i>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Link>
                    </Col>

                    {/* Visa Approved */}
                    <Col sm={12} md={6} lg={6} xl={4} className="mb-3">
                      <Link
                        to={`/student/studentapplication?selectedBranch=${selectedBranch}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Card className="custom-card h-100 border-0 shadow-sm kpi-hover-card">
                          <Card.Body className="p-3">
                            <div className="d-flex align-items-center">
                              <div
                                className="bg-primary-transparent rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  minWidth: "50px",
                                }}
                              >
                                <i className="fe fe-check-square fs-20 text-primary"></i>
                              </div>
                              <div className="flex-grow-1">
                                <p className="main-content-label mb-1 text-uppercase letter-spacing-1 ">
                                  Visa Approved
                                </p>
                                <h3
                                  className="text-muted mb-0 fw-bold"
                                  style={{ fontSize: "16px" }}
                                >
                                  {dashboardData?.totalVisaApproved || 0}
                                </h3>
                              </div>
                              <div className="ms-auto opacity-25">
                                <i className="fe fe-chevron-right fs-16"></i>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Link>
                    </Col>
                    {/* Total Offer Letters */}
                    <Col sm={12} md={6} lg={6} xl={4} className="mb-3">
                      <Link
                        to={`/student/studentapplication?selectedBranch=${selectedBranch}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Card className="custom-card h-100 border-0 shadow-sm kpi-hover-card">
                          <Card.Body className="p-3">
                            <div className="d-flex align-items-center">
                              <div
                                className="bg-info-transparent rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  minWidth: "50px",
                                }}
                              >
                                <i className="fe fe-mail fs-20 text-info"></i>
                              </div>
                              <div className="flex-grow-1">
                                <p className="main-content-label mb-1 text-uppercase letter-spacing-1">
                                  Total Offer Letters
                                </p>
                                <h3
                                  className="text-muted mb-0 fw-bold"
                                  style={{ fontSize: "16px" }}
                                >
                                  {dashboardData?.totalOfferLetter || 0}
                                </h3>
                              </div>
                              <div className="ms-auto opacity-25">
                                <i className="fe fe-chevron-right fs-16"></i>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Link>
                    </Col>
                  </Row>

                  <Row className="row-sm">
                    {/* Top Visa Counsellor */}
                    <Col sm={12} md={6} lg={6} xl={4} className="mb-3">
                      <Card className="custom-card h-100 border-0 shadow-sm kpi-hover-card">
                        <Card.Body className="p-3">
                          <div className="d-flex align-items-center">
                            <div
                              className="bg-warning-transparent  d-flex align-items-center justify-content-center me-3"
                              style={{
                                width: "50px",
                                height: "50px",
                                minWidth: "50px",
                              }}
                            >
                              <i className="fe fe-award fs-20 text-warning"></i>
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                              <p className="main-content-label mb-1 text-uppercase letter-spacing-1">
                                Top Visa Counsellor
                              </p>
                              <h4
                                className="text-muted mb-0 text-truncate"
                                style={{ fontSize: "14px" }}
                              >
                                {dashboardData?.topCounselor?.name || "N/A"}
                              </h4>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>

                    {/* Top Performing Branch */}
                    <Col sm={12} md={6} lg={6} xl={4} className="mb-3">
                      <Card className="custom-card h-100 border-0 shadow-sm kpi-hover-card">
                        <Card.Body className="p-3">
                          <div className="d-flex align-items-center">
                            <div
                              className="bg-secondary-transparent rounded-circle d-flex align-items-center justify-content-center me-3"
                              style={{
                                width: "50px",
                                height: "50px",
                                minWidth: "50px",
                              }}
                            >
                              <i className="fe fe-trending-up fs-20 text-secondary"></i>
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                              <p className="main-content-label mb-1 text-uppercase letter-spacing-1">
                                Top Performing Branch
                              </p>
                              <h4
                                className="text-muted mb-0 text-truncate"
                                style={{ fontSize: "14px" }}
                              >
                                {dashboardData?.topBranchName || "N/A"}
                              </h4>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>

                    {/* Total Collection */}
                    <Col sm={12} md={6} lg={6} xl={4} className="mb-3">
                      <Card className="custom-card h-100 border-0 shadow-sm kpi-hover-card">
                        <Card.Body className="p-3">
                          <div className="d-flex align-items-center">
                            <div
                              className="bg-danger-transparent rounded-circle d-flex align-items-center justify-content-center me-3"
                              style={{
                                width: "50px",
                                height: "50px",
                                minWidth: "50px",
                              }}
                            >
                              <i className="fe fe-briefcase fs-20 text-danger"></i>
                            </div>
                            <div className="flex-grow-1">
                              <p className="main-content-label mb-1 text-uppercase letter-spacing-1">
                                Total Collection
                              </p>
                              <h3
                                className="text-muted mb-0"
                                style={{ fontSize: "16px" }}
                              >
                                {dashboardData?.totalUniversityCollection || 0}
                              </h3>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Col>

                <Col md={3} lg={3} xl={3} className="mb-3">
                  <Dialpad
                    onCall={(number) => console.log("Calling:", number)}
                  />
                </Col>

                <Col sm={12} lg={6} xl={6} className="mb-4">
                  <Card className="custom-card h-100 overflow-hidden shadow-sm border-0">
                    <Card.Header className="pt-3 px-4 border-bottom-0 bg-transparent d-flex justify-content-between align-items-center">
                      <div className="d-flex flex-column">
                        <label className="main-content-label mb-1">
                          Country-Wise Visa Approval
                        </label>
                        <span className="text-muted fs-12 fw-medium">
                          Global stats overview
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <div className="px-3 py-1 bg-primary-transparent rounded-pill text-primary fs-12 fw-bold">
                          <i className="fe fe-globe me-2"></i>
                          {totalCountry} Countries
                        </div>
                        {/* <i className="fe fe-filter text-muted bg-light p-2 rounded-circle cursor-pointer hover-effect"></i> */}
                      </div>
                    </Card.Header>
                    <Card.Body className="px-4 pb-4 pt-2">
                      <div
                        className="d-flex flex-column gap-3 mt-2"
                        style={{ maxHeight: "360px", overflowY: "hidden" }}
                      >
                        {refinedCountryData.map((country, idx) => (
                          <div key={idx} className="w-100">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <div className="d-flex align-items-center gap-2">
                                <span className="fw-semibold text-dark fs-13">
                                  {country.name}
                                </span>
                                <span className="text-muted fs-11">
                                  ({country.percentage}%)
                                </span>
                              </div>
                              <span className="fw-bold text-dark fs-13">
                                {country.count}
                              </span>
                            </div>
                            <div className="progress ht-6 rounded-pill bg-light">
                              <div
                                className="progress-bar rounded-pill"
                                role="progressbar"
                                style={{
                                  width: `${
                                    (country.count / maxCountryValue) * 100
                                  }%`,
                                  backgroundColor: country.color,
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                        {refinedCountryData.length === 0 && (
                          <div className="text-center text-muted py-5">
                            No data available
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col sm={12} lg={6} xl={6} className="mb-4">
                  <Card className="custom-card h-100 overflow-hidden shadow-sm border-0">
                    <Card.Header className="pt-3 px-4 border-bottom-0 bg-transparent">
                      <div className="d-flex align-items-center gap-2">
                        <i className="fe fe-briefcase text-primary fs-16 bg-primary-transparent p-2 rounded-circle"></i>
                        <div className="d-flex flex-column">
                          <label className="main-content-label mb-0">
                            Bank-Wise Total Amount
                          </label>
                          <span className="text-muted fs-11 fw-medium">
                            Financial Summary by Bank
                          </span>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body className="p-4 pt-2">
                      <div className="row g-3 mb-4 mt-1">
                        <div className="col-6">
                          <div
                            className="p-3 border-0 rounded-4 d-flex align-items-center justify-content-between shadow-sm"
                            style={{
                              backgroundColor: "#f5f3ff", // Ultra-light Lavender/Indigo
                              border: "1px solid #e0e7ff",
                            }}
                          >
                            <div>
                              <p
                                className="mb-1 text-muted fs-11 fw-bold text-uppercase tracking-wider"
                                style={{ opacity: 0.8 }}
                              >
                                Bank Balance
                              </p>
                              <h5
                                className="mb-0 fw-bold"
                                style={{
                                  color: "#4f46e5",
                                  letterSpacing: "-0.5px",
                                }}
                              >
                                {storedEncryptedCurrency
                                  ? getSymbolFromCurrency(
                                      storedEncryptedCurrency,
                                    )
                                  : "₹"}{" "}
                                {new Intl.NumberFormat().format(
                                  totalPaidAmount,
                                )}
                              </h5>
                            </div>
                            <div
                              className="d-flex align-items-center justify-content-center rounded-circle"
                              style={{
                                backgroundColor: "rgba(79, 70, 229, 0.1)",
                                width: "40px",
                                height: "40px",
                              }}
                            >
                              <i
                                className="bi bi-bank fs-5"
                                style={{ color: "#4f46e5" }}
                              ></i>
                            </div>
                          </div>
                        </div>

                        <div className="col-6">
                          <div
                            className="p-3 border-0 rounded-4 d-flex align-items-center justify-content-between shadow-sm"
                            style={{
                              backgroundColor: "#fffbeb", // Ultra-light warm Gold
                              border: "1px solid #fef3c7",
                            }}
                          >
                            <div>
                              <p
                                className="mb-1 text-muted fs-11 fw-bold text-uppercase tracking-wider"
                                style={{ opacity: 0.8 }}
                              >
                                Cash Balance
                              </p>
                              <h5
                                className="mb-0 fw-bold"
                                style={{
                                  color: "#b45309",
                                  letterSpacing: "-0.5px",
                                }}
                              >
                                {storedEncryptedCurrency
                                  ? getSymbolFromCurrency(
                                      storedEncryptedCurrency,
                                    )
                                  : "₹"}{" "}
                                {new Intl.NumberFormat().format(totalDueAmount)}
                              </h5>
                            </div>
                            <div
                              className="d-flex align-items-center justify-content-center rounded-circle"
                              style={{
                                backgroundColor: "rgba(180, 83, 9, 0.1)",
                                width: "40px",
                                height: "40px",
                              }}
                            >
                              <i
                                className="bi bi-wallet2 fs-5"
                                style={{ color: "#b45309" }}
                              ></i>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row align-items-center">
                        <div className="col-5 text-center position-relative">
                          <div
                            style={{
                              height: "140px",
                              width: "140px",
                              margin: "0 auto",
                            }}
                          >
                            <Doughnut
                              data={refinedBankData.chartData}
                              options={refinedBankData.chartOptions}
                            />
                          </div>
                        </div>

                        <div className="col-7 border-start border-light ps-4">
                          <div
                            className="d-flex flex-column gap-3"
                            style={{ maxHeight: "150px", overflowY: "auto" }}
                          >
                            {refinedBankData.list.map((bank, i) => (
                              <div
                                key={i}
                                className="d-flex align-items-center justify-content-between"
                              >
                                <div className="d-flex align-items-center gap-2">
                                  <span
                                    className="dot-label"
                                    style={{
                                      backgroundColor:
                                        refinedBankData.palette[
                                          i % refinedBankData.palette.length
                                        ],
                                      width: "8px",
                                      height: "8px",
                                      borderRadius: "50%",
                                    }}
                                  ></span>
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={
                                      <Tooltip id={`tooltip-bank-${bank._id}`}>
                                        {bank.bankName || "Unknown"}
                                      </Tooltip>
                                    }
                                  >
                                    <span
                                      className="fs-12 fw-semibold text-dark text-truncate d-inline-block"
                                      style={{
                                        maxWidth: "90px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      {bank.bankName || "Unknown"}
                                    </span>
                                  </OverlayTrigger>
                                </div>
                                <span className="fs-12 fw-bold text-dark">
                                  {new Intl.NumberFormat().format(
                                    bank.totalAmount || 0,
                                  )}
                                </span>
                              </div>
                            ))}
                            {refinedBankData.list.length === 0 && (
                              <span className="text-muted fs-12">
                                No transactions
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col sm={12} lg={6} xl={6}>
                  <Card className="custom-card overflow-hidden">
                    <Card.Header>
                      <label className="main-content-label mb-2">
                        Branch-wise Collection vs Expense
                      </label>
                    </Card.Header>
                    <Card.Body>
                      <div style={{ height: "300px" }}>
                        <Bar
                          data={branchCollectionData}
                          options={branchCollectionOptions}
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={12} lg={6} xl={6}>
                  <Card className="custom-card overflow-hidden">
                    <Card.Header>
                      <label className="main-content-label mb-2">
                        Top 5 Counselors by Admission Count
                      </label>
                    </Card.Header>
                    <Card.Body>
                      <div style={{ height: "300px" }}>
                        <Bar
                          data={topCounselorsData}
                          options={topCounselorsOptions}
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col sm={12} md={6} lg={6} xl={6} className="mb-4">
                  <Card className="custom-card h-100 shadow-sm border-0 overflow-hidden">
                    <Card.Header className="pt-4 px-4 border-bottom-0 bg-transparent">
                      <div>
                        <label className="main-content-label mb-1">
                          Counselor Tasks Today
                        </label>
                        <span className="d-block fs-12 text-muted fw-medium">
                          Follow-up activities snapshot
                        </span>
                      </div>
                    </Card.Header>

                    <Card.Body className="px-4 py-2">
                      <Row className="align-items-center">
                        {/* Left Stats Section */}
                        <Col xs={6} md={6} lg={6} xl={6}>
                          <div className="d-flex flex-column justify-content-center h-100">
                            <p className="text-muted text-uppercase fs-11 fw-bold letter-spacing-1 mb-1">
                              Follow-ups Due
                            </p>
                            <h2 className="display-6 fw-bold text-dark mb-2">
                              {dashboardData?.todaysLeadFollowup || 0}
                            </h2>
                            <div
                              className="d-flex align-items-center text-muted fs-12 bg-light p-2 rounded-2"
                              style={{ width: "fit-content" }}
                            >
                              <i className="bi bi-calendar3 me-2 text-primary"></i>
                              <span className="fw-medium">
                                {new Date().toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </Col>

                        {/* Right Chart Section */}
                        <Col xs={6} md={6} lg={6} xl={6}>
                          <div
                            className="position-relative d-flex justify-content-center align-items-center"
                            style={{ height: "140px" }}
                          >
                            <div style={{ width: "110px", height: "110px" }}>
                              <Doughnut
                                data={counselorTasksData}
                                options={counselorTasksOptions}
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>

                    {/* Moved Legend to the end (Bottom) */}
                    <Card.Footer className="bg-light border-0 py-3 px-4 d-flex justify-content-end gap-3">
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="rounded-circle"
                          style={{
                            width: "10px",
                            height: "10px",
                            backgroundColor: "#6c5ffc", // Zokep Purple
                            boxShadow: "0 0 5px rgba(108, 95, 252, 0.4)",
                          }}
                        ></span>
                        <span className="fs-12 text-dark fw-bold">Done</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="rounded-circle"
                          style={{
                            width: "10px",
                            height: "10px",
                            backgroundColor: "#cbd5e1", // Rich Slate/Pending color
                          }}
                        ></span>
                        <span className="fs-12 text-muted fw-bold">
                          Pending
                        </span>
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>

                <Col sm={12} md={6} lg={6} xl={6} className="mb-4">
                  <Card className="custom-card h-100 shadow-sm border-0">
                    <Card.Header className="pt-4 px-4 border-bottom-0 bg-transparent">
                      <div className="mb-2">
                        <label
                          className="main-content-label mb-1"
                          style={{ letterSpacing: "-0.3px" }}
                        >
                          Top Inquiries Sources
                        </label>
                        <span className="d-block fs-12 text-muted fw-medium">
                          Highest performing channels
                        </span>
                      </div>
                    </Card.Header>
                    <Card.Body className="px-4 pb-4 pt-2">
                      <div
                        className="custom-v-scrollbar" // Added custom class for scrollbar styling
                        style={{
                          maxHeight: "180px",
                          overflowY: "auto",
                          overflowX: "hidden",
                          paddingRight: "8px",
                        }}
                      >
                        {topInquiries.length > 0 ? (
                          <div className="d-flex flex-column gap-4">
                            {" "}
                            {/* Increased gap for more "breathability" */}
                            {topInquiries.map((source, index) => (
                              <div key={index} className="w-100">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <div className="d-flex align-items-center gap-3 overflow-hidden">
                                    {/* Refined Rank Circle */}
                                    <div
                                      className="d-flex align-items-center justify-content-center rounded-circle fw-bold"
                                      style={{
                                        minWidth: "26px",
                                        width: "26px",
                                        height: "26px",
                                        fontSize: "11px",
                                        backgroundColor:
                                          index === 0
                                            ? "rgba(108, 95, 252, 0.1)"
                                            : "#f8fafc",
                                        color:
                                          index === 0 ? "#6c5ffc" : "#64748b",
                                        border:
                                          index === 0
                                            ? "1px solid rgba(108, 95, 252, 0.2)"
                                            : "1px solid #e2e8f0",
                                      }}
                                    >
                                      {index + 1}
                                    </div>
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip>{source.lead_from}</Tooltip>
                                      }
                                    >
                                      <span
                                        className="text-dark fs-13 fw-bold text-truncate"
                                        style={{
                                          opacity: 0.85,
                                          cursor: "pointer",
                                        }}
                                      >
                                        {source.lead_from}
                                      </span>
                                    </OverlayTrigger>
                                  </div>

                                  <div className="d-flex align-items-center gap-2">
                                    <span
                                      className="fw-bold fs-13 text-dark"
                                      style={{
                                        fontFamily: "Inter, sans-serif",
                                      }}
                                    >
                                      {source.percentage.toFixed(1)}%
                                    </span>
                                    {/* Sleeker Badge */}
                                    <span
                                      className="badge rounded-pill px-2 py-1 fs-10 fw-bold d-flex align-items-center"
                                      style={{
                                        backgroundColor:
                                          source.percentage >= 5
                                            ? "#ecfdf5"
                                            : "#fef2f2",
                                        color:
                                          source.percentage >= 5
                                            ? "#059669"
                                            : "#dc2626",
                                        border: `1px solid ${source.percentage >= 5 ? "#10b98133" : "#ef444433"}`,
                                      }}
                                    >
                                      <i
                                        className={`bi bi-graph-${source.percentage >= 5 ? "up" : "down"} me-1`}
                                      ></i>
                                      {source.percentage >= 5 ? "High" : "Low"}
                                    </span>
                                  </div>
                                </div>

                                {/* Slimmer, more sophisticated Progress Bar */}
                                <div
                                  className="progress rounded-pill"
                                  style={{
                                    height: "6px",
                                    backgroundColor: "#f1f5f9",
                                  }}
                                >
                                  <div
                                    className="progress-bar rounded-pill"
                                    role="progressbar"
                                    style={{
                                      width: `${Math.min(source.percentage * 1.5, 100)}%`,
                                      backgroundColor:
                                        index === 0
                                          ? "#6c5ffc"
                                          : index === 1
                                            ? "#0ea5e9"
                                            : "#f59e0b",
                                      transition: "width 1s ease-in-out",
                                    }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted py-5">
                            <i className="bi bi-bar-chart-line fs-1 mb-2 opacity-25"></i>
                            <span className="fs-13 fw-medium">
                              No data available
                            </span>
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </>
            )}

            {([
              "Branch",
              "b2bAdmin",
              "B2B Admin",
              "b2bMember",
              "B2B Member",
            ].includes(role) ||
              userRole === "Branch User") && (
              <>
                <Col md={9}>
                  <Row className="row-sm mb-4 align-items-stretch">
                    <Col xl={12} lg={12} md={12} className="mb-3">
                      <Card
                        className="custom-card h-100 border-0 shadow-sm overflow-visible"
                        // style={{ zIndex: 100 }}
                      >
                        <Card.Body className="p-3">
                          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center">
                            {/* Icon Badge - Matches KPI style */}
                            <div
                              className="bg-primary-transparent rounded-circle d-flex align-items-center justify-content-center mb-3 mb-sm-0 me-sm-3"
                              style={{
                                width: "54px",
                                height: "54px",
                                minWidth: "54px",
                              }}
                            >
                              <i className="fe fe-calendar fs-24 text-primary"></i>
                            </div>

                            <div className="flex-grow-1">
                              <h6 className="fw-bold mb-2 fs-14">Date Range</h6>
                              <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-2">
                                {/* Start Date Field */}
                                <div className="position-relative flex-fill">
                                  <Form.Control
                                    type="text"
                                    placeholder="From Date"
                                    value={
                                      filters.startDate
                                        ? formatDate(
                                            parseDate(filters.startDate),
                                          )
                                        : ""
                                    }
                                    readOnly
                                    ref={startDateInputRef}
                                    onClick={() =>
                                      setShowStartDateCalendar(
                                        !showStartDateCalendar,
                                      )
                                    }
                                    className="form-control-sm bg-light border-0 px-3 fs-13"
                                    style={{
                                      height: "38px",
                                      cursor: "pointer",
                                    }}
                                  />
                                  {filters.startDate && (
                                    <span
                                      className="position-absolute end-0 top-50 translate-middle-y me-3 cursor-pointer text-muted hover-primary"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setFilters({
                                          ...filters,
                                          startDate: "",
                                        });
                                      }}
                                      style={{ zIndex: 10 }}
                                    >
                                      <i className="fe fe-x fs-10"></i>
                                    </span>
                                  )}
                                  {showStartDateCalendar && (
                                    <div
                                      ref={startDateCalendarRef}
                                      className="position-absolute top-100 start-0 mt-2 shadow-lg bg-white border"
                                      style={{
                                        zIndex: 1000,
                                        borderRadius: "8px",
                                      }}
                                    >
                                      <Calendar
                                        className="form-control m-0 p-0 border-0"
                                        onChange={(d) => {
                                          setFilters({
                                            ...filters,
                                            startDate: toISODate(d),
                                          });
                                          setShowStartDateCalendar(false);
                                        }}
                                        value={
                                          filters.startDate
                                            ? parseDate(filters.startDate)
                                            : null
                                        }
                                        tileClassName={({ date, view }) =>
                                          view === "month" &&
                                          date.toDateString() ===
                                            new Date().toDateString()
                                            ? "no-today-highlight"
                                            : null
                                        }
                                      />
                                    </div>
                                  )}
                                </div>

                                <span className="text-muted fw-bold d-none d-md-inline">
                                  →
                                </span>

                                {/* End Date Field */}
                                <div className="position-relative flex-fill">
                                  <Form.Control
                                    type="text"
                                    placeholder="To Date"
                                    value={
                                      filters.endDate
                                        ? formatDate(parseDate(filters.endDate))
                                        : ""
                                    }
                                    readOnly
                                    ref={endDateInputRef}
                                    onClick={() =>
                                      setShowEndDateCalendar(
                                        !showEndDateCalendar,
                                      )
                                    }
                                    className="form-control-sm bg-light border-0 px-3 fs-13"
                                    style={{
                                      height: "38px",
                                      cursor: "pointer",
                                    }}
                                  />
                                  {filters.endDate && (
                                    <span
                                      className="position-absolute end-0 top-50 translate-middle-y me-3 cursor-pointer text-muted hover-primary"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setFilters({
                                          ...filters,
                                          endDate: "",
                                        });
                                      }}
                                      style={{ zIndex: 10 }}
                                    >
                                      <i className="fe fe-x fs-10"></i>
                                    </span>
                                  )}
                                  {showEndDateCalendar && (
                                    <div
                                      ref={endDateCalendarRef}
                                      className="position-absolute top-100 start-0 mt-2 shadow-lg bg-white border"
                                      style={{
                                        zIndex: 1000,
                                        borderRadius: "8px",
                                      }}
                                    >
                                      <Calendar
                                        className="form-control m-0 p-0 border-0"
                                        onChange={(d) => {
                                          setFilters({
                                            ...filters,
                                            endDate: toISODate(d),
                                          });
                                          setShowEndDateCalendar(false);
                                        }}
                                        value={
                                          filters.endDate
                                            ? parseDate(filters.endDate)
                                            : null
                                        }
                                        tileClassName={({ date, view }) =>
                                          view === "month" &&
                                          date.toDateString() ===
                                            new Date().toDateString()
                                            ? "no-today-highlight"
                                            : null
                                        }
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <Row className="row-sm mt-lg">
                    <Col sm={12} md={6} lg={6} className="mb-3">
                      <Card className="custom-card h-100 border-0 shadow-sm kpi-hover-card">
                        <Card.Body className="p-3">
                          <div className="d-flex align-items-center">
                            <div
                              className="bg-info-transparent rounded-circle d-flex align-items-center justify-content-center me-3"
                              style={{
                                width: "50px",
                                height: "50px",
                                minWidth: "50px",
                              }}
                            >
                              <i className="fe fe-file-text fs-20 text-info"></i>
                            </div>
                            <div className="flex-grow-1">
                              <p className="main-content-label mb-1 text-uppercase letter-spacing-1">
                                Total Applications
                              </p>
                              <div className="d-flex align-items-baseline">
                                <h3
                                  className="text-muted mb-0"
                                  style={{ fontSize: "16px" }}
                                >
                                  {dashboardData?.totalStudents || 0}
                                </h3>
                                {/* Optional: Add a small trend indicator if you have the data */}
                                {/* <span className="ms-2 text-success fs-11 fw-semibold">+5%</span> */}
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col sm={12} md={6} lg={6} className="mb-3">
                      <Card className="custom-card h-100 border-0 shadow-sm kpi-hover-card">
                        <Card.Body className="p-3">
                          <div className="d-flex align-items-center">
                            <div
                              className="bg-success-transparent rounded-circle d-flex align-items-center justify-content-center me-3"
                              style={{
                                width: "50px",
                                height: "50px",
                                minWidth: "50px",
                              }}
                            >
                              <i className="fe fe-check-circle fs-20 text-success"></i>
                            </div>

                            <div className="flex-grow-1">
                              <p className="main-content-label mb-1 text-uppercase letter-spacing-1">
                                Total Offer Letters
                              </p>

                              <div className="d-flex align-items-baseline">
                                <h3
                                  className="text-muted mb-0"
                                  style={{ fontSize: "16px" }}
                                >
                                  {dashboardData?.totalOfferLetter || 0}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <Row className="row-sm">
                    <Col sm={12} md={6} lg={6} className="mb-3">
                      <Card className="custom-card h-100 border-0 shadow-sm kpi-hover-card">
                        <Card.Body className="p-3">
                          <div className="d-flex align-items-center">
                            <div
                              className="bg-warning-transparent rounded-circle d-flex align-items-center justify-content-center me-3"
                              style={{
                                width: "50px",
                                height: "50px",
                                minWidth: "50px",
                              }}
                            >
                              <i className="fe fe-users fs-20 text-warning"></i>
                            </div>

                            <div className="flex-grow-1">
                              <p className="main-content-label mb-1 text-uppercase letter-spacing-1">
                                Total Admissions
                              </p>

                              <div className="d-flex align-items-baseline">
                                <h3
                                  className="text-muted mb-0"
                                  style={{ fontSize: "16px" }}
                                >
                                  {dashboardData?.totalAdmissions || 0}
                                </h3>

                                {/* optional */}
                                {/* <span className="ms-2 text-danger fs-11 fw-semibold">-2%</span> */}
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col sm={12} md={6} lg={6} className="mb-3">
                      <Card className="custom-card h-100 border-0 shadow-sm kpi-hover-card">
                        <Card.Body className="p-3">
                          <div className="d-flex align-items-center">
                            <div
                              className="bg-success-transparent rounded-circle d-flex align-items-center justify-content-center me-3"
                              style={{
                                width: "50px",
                                height: "50px",
                                minWidth: "50px",
                              }}
                            >
                              <i className="fe fe-check-square fs-20 text-success"></i>
                            </div>

                            <div className="flex-grow-1">
                              <p className="main-content-label mb-1 text-uppercase letter-spacing-1">
                                Visa Approved
                              </p>

                              <div className="d-flex align-items-baseline">
                                <h3
                                  className="text-muted mb-0"
                                  style={{ fontSize: "16px" }}
                                >
                                  {dashboardData?.totalVisaApproved || 0}
                                </h3>

                                {/* optional */}
                                {/* <span className="ms-2 text-success fs-11 fw-semibold">+8%</span> */}
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Col>

                <Col xl={3} lg={4} md={12} className="mb-3">
                  <SmallDialpad
                    onCall={(number) => console.log("Calling:", number)}
                  />
                </Col>

                <Col sm={12} lg={6} xl={6}>
                  <Card className="custom-card overflow-hidden">
                    <Card.Header>
                      <label className="main-content-label my-2">
                        Total Applications vs Offer Letters
                      </label>
                    </Card.Header>
                    <Card.Body>
                      <div style={{ height: "300px" }}>
                        <Bar
                          data={applicationsVsOfferLettersData}
                          options={applicationsVsOfferLettersOptions}
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={12} md={12} lg={6} xl={6}>
                  <Row className="g-3 d-flex">
                    <Col xs={12} md={12} lg={12} xl={12}>
                      <Card className="custom-card h-100 shadow-sm border-0 overflow-hidden">
                        <Card.Header className="pt-4 px-4 border-bottom-0 bg-transparent">
                          <div>
                            <label className="main-content-label mb-1">
                              Counselor Tasks Today
                            </label>
                            <span className="d-block fs-12 text-muted fw-medium">
                              Follow-up activities snapshot
                            </span>
                          </div>
                        </Card.Header>

                        <Card.Body className="px-4 py-2">
                          <Row className="align-items-center">
                            {/* Left Stats Section */}
                            <Col xs={6} md={6} lg={6} xl={6}>
                              <div className="d-flex flex-column justify-content-center h-100">
                                <p className="text-muted text-uppercase fs-11 fw-bold letter-spacing-1 mb-1">
                                  Follow-ups Due
                                </p>
                                <h2 className="display-6 fw-bold text-dark mb-2">
                                  {dashboardData?.todaysLeadFollowup || 0}
                                </h2>
                                <div
                                  className="d-flex align-items-center text-muted fs-12 bg-light p-2 rounded-2"
                                  style={{ width: "fit-content" }}
                                >
                                  <i className="bi bi-calendar3 me-2 text-primary"></i>
                                  <span className="fw-medium">
                                    {new Date().toLocaleDateString("en-US", {
                                      month: "long",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </Col>

                            {/* Right Chart Section */}
                            <Col xs={6} md={6} lg={6} xl={6}>
                              <div
                                className="position-relative d-flex justify-content-center align-items-center"
                                style={{ height: "140px" }}
                              >
                                <div
                                  style={{ width: "110px", height: "110px" }}
                                >
                                  <Doughnut
                                    data={counselorTasksData}
                                    options={counselorTasksOptions}
                                  />
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Card.Body>

                        {/* Moved Legend to the end (Bottom) */}
                        <Card.Footer className="bg-light border-0 py-3 px-4 d-flex justify-content-end gap-3">
                          <div className="d-flex align-items-center gap-2">
                            <span
                              className="rounded-circle"
                              style={{
                                width: "10px",
                                height: "10px",
                                backgroundColor: "#6c5ffc", // Zokep Purple
                                boxShadow: "0 0 5px rgba(108, 95, 252, 0.4)",
                              }}
                            ></span>
                            <span className="fs-12 text-dark fw-bold">
                              Done
                            </span>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <span
                              className="rounded-circle"
                              style={{
                                width: "10px",
                                height: "10px",
                                backgroundColor: "#cbd5e1", // Rich Slate/Pending color
                              }}
                            ></span>
                            <span className="fs-12 text-muted fw-bold">
                              Pending
                            </span>
                          </div>
                        </Card.Footer>
                      </Card>
                    </Col>

                    <Col xs={12} md={12} lg={12} xl={12}>
                      <Card className="custom-card h-100 shadow-sm border-0">
                        <Card.Header className="pt-4 px-4 border-bottom-0 bg-transparent">
                          <div className="mb-2">
                            <label
                              className="main-content-label mb-1"
                              style={{ letterSpacing: "-0.3px" }}
                            >
                              Top Inquiries Sources
                            </label>
                            <span className="d-block fs-12 text-muted fw-medium">
                              Highest performing channels
                            </span>
                          </div>
                        </Card.Header>
                        <Card.Body className="px-4 pb-4 pt-2">
                          <div
                            className="custom-v-scrollbar" // Added custom class for scrollbar styling
                            style={{
                              maxHeight: "180px",
                              overflowY: "auto",
                              overflowX: "hidden",
                              paddingRight: "8px",
                            }}
                          >
                            {topInquiries.length > 0 ? (
                              <div className="d-flex flex-column gap-4">
                                {" "}
                                {/* Increased gap for more "breathability" */}
                                {topInquiries.map((source, index) => (
                                  <div key={index} className="w-100">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                      <div className="d-flex align-items-center gap-3 overflow-hidden">
                                        {/* Refined Rank Circle */}
                                        <div
                                          className="d-flex align-items-center justify-content-center rounded-circle fw-bold"
                                          style={{
                                            minWidth: "26px",
                                            width: "26px",
                                            height: "26px",
                                            fontSize: "11px",
                                            backgroundColor:
                                              index === 0
                                                ? "rgba(108, 95, 252, 0.1)"
                                                : "#f8fafc",
                                            color:
                                              index === 0
                                                ? "#6c5ffc"
                                                : "#64748b",
                                            border:
                                              index === 0
                                                ? "1px solid rgba(108, 95, 252, 0.2)"
                                                : "1px solid #e2e8f0",
                                          }}
                                        >
                                          {index + 1}
                                        </div>
                                        <OverlayTrigger
                                          placement="top"
                                          overlay={
                                            <Tooltip>
                                              {source.lead_from}
                                            </Tooltip>
                                          }
                                        >
                                          <span
                                            className="text-dark fs-13 fw-bold text-truncate"
                                            style={{
                                              opacity: 0.85,
                                              cursor: "pointer",
                                            }}
                                          >
                                            {source.lead_from}
                                          </span>
                                        </OverlayTrigger>
                                      </div>

                                      <div className="d-flex align-items-center gap-2">
                                        <span
                                          className="fw-bold fs-13 text-dark"
                                          style={{
                                            fontFamily: "Inter, sans-serif",
                                          }}
                                        >
                                          {source.percentage.toFixed(1)}%
                                        </span>
                                        {/* Sleeker Badge */}
                                        <span
                                          className="badge rounded-pill px-2 py-1 fs-10 fw-bold d-flex align-items-center"
                                          style={{
                                            backgroundColor:
                                              source.percentage >= 5
                                                ? "#ecfdf5"
                                                : "#fef2f2",
                                            color:
                                              source.percentage >= 5
                                                ? "#059669"
                                                : "#dc2626",
                                            border: `1px solid ${source.percentage >= 5 ? "#10b98133" : "#ef444433"}`,
                                          }}
                                        >
                                          <i
                                            className={`bi bi-graph-${source.percentage >= 5 ? "up" : "down"} me-1`}
                                          ></i>
                                          {source.percentage >= 5
                                            ? "High"
                                            : "Low"}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Slimmer, more sophisticated Progress Bar */}
                                    <div
                                      className="progress rounded-pill"
                                      style={{
                                        height: "6px",
                                        backgroundColor: "#f1f5f9",
                                      }}
                                    >
                                      <div
                                        className="progress-bar rounded-pill"
                                        role="progressbar"
                                        style={{
                                          width: `${Math.min(source.percentage * 1.5, 100)}%`,
                                          backgroundColor:
                                            index === 0
                                              ? "#6c5ffc"
                                              : index === 1
                                                ? "#0ea5e9"
                                                : "#f59e0b",
                                          transition: "width 1s ease-in-out",
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted py-5">
                                <i className="bi bi-bar-chart-line fs-1 mb-2 opacity-25"></i>
                                <span className="fs-13 fw-medium">
                                  No data available
                                </span>
                              </div>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </>
            )}
          </Row>

          <DashboardTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userRole={role}
          />

          {/* <Card className="custom-card">
        {activeTab === "applicationPipeline" && (
          <ApplicationPipeline
            showAll={showAll}
            selectedBranchId={selectedBranchId}
          />
        )}
        {activeTab === "counselorPerformance" && <CounselorPerformance />}
        {activeTab === "financialOverview" && <FinancialOverview />}
        {activeTab === "studentFunnel" && <StudentFunnel />}
        {activeTab === "ieltsSummary" && <IeltsSummary />}
      </Card> */}
          <Card className="custom-card">
            {activeTab === "applicationPipeline" && (
              <Row className="row-sm">
                <Col md={12} lg={12} xl={12}>
                  <Card.Header>
                    <div className="w-100 d-flex flex-wrap justify-content-center justify-content-sm-between align-items-center gap-3">
                      <h4
                        className="card-title mb-0 text-center text-sm-start"
                        style={{ color: "#1E293B" }}
                      >
                        Application Status Summary
                      </h4>
                      <div className="d-flex flex-wrap align-items-center justify-content-center gap-3">
                        {/* Select Status - Kept original styles as requested */}
                        <div className="filter-item">
                          <Select
                            className="filter-height"
                            options={studentStatusOptions}
                            value={mainStatus}
                            onChange={handleStudentStatusChange}
                            placeholder="Select Status"
                            classNamePrefix="custom-select"
                            isClearable
                            styles={{
                              control: (base) => ({
                                ...base,
                                minWidth: "150px",

                                fontSize: "13px",
                              }),
                              placeholder: (base) => ({
                                ...base,
                                fontSize: "13px",
                              }),
                            }}
                          />
                        </div>

                        {/* Refined Total Records Badge */}
                        <div
                          className="custom-select-height total-records px-4 py-2 mt-0 d-flex align-items-center h-6"
                          style={{
                            background: "#e0e7ff",
                            borderRadius: "20px",
                            color: "#6B5CE7",
                            fontWeight: "500",
                          }}
                        >
                          <span style={{ whiteSpace: "nowrap" }}>
                            Total Records: <strong>{totalRecords}</strong>
                          </span>
                        </div>
                      </div>
                      {/* <Button variant="link" className="text-primary">
                  Export
                </Button>
                <Button variant="link" className="text-primary ms-2">
                  Filter
                </Button> */}
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <div className="m-3">
                      <div
                        className="table-responsive modern-table-wrapper"
                        style={{
                          borderRadius: "12px",
                          border: "1px solid #dee2e6",
                        }}
                      >
                        <table
                          className="table table-hover modern-table table-nowrap"
                          style={{ width: "100%", overflowX: "auto" }}
                        >
                          <thead className="text-uppercase">
                            <tr>
                              {columns?.map((col, index) => (
                                <th
                                  key={index}
                                  scope="col"
                                  className="dynamic-width"
                                >
                                  {col.label}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {allStudentApplication?.length > 0 ? (
                              allStudentApplication
                                ?.filter(Boolean)
                                ?.map((item, index) => (
                                  <tr
                                    key={`${item._id}-${index}`}
                                    className={`${
                                      index % 2 === 0
                                        ? "table-row-even"
                                        : "table-row-odd"
                                    }`}
                                  >
                                    {columns?.map((col, colIndex) => (
                                      <td
                                        key={colIndex}
                                        className="dynamic-width-data"
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
                                    {canRead
                                      ? "No data available"
                                      : "You do not have permission to view this data"}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      <div className="p-4 d-flex justify-content-end">
                        {totalPages > 1 && (
                          <Paginations
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => setCurrentPage(page)}
                          />
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            )}
          </Card>
        </>
      )}
    </>
  );
};

export default Dashboard;
