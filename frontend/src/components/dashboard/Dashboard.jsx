import { useEffect, useRef, useState, useMemo } from "react";
import Pageheader from "../../layouts/Pageheader";
import {
  Card,
  Col,
  Row,
  ProgressBar,
  Button,
  Form,
  Dropdown,
  Table,
  Pagination,
  Container,
  OverlayTrigger,
  Tooltip,
  Badge,
} from "react-bootstrap";
import ALLImages from "../../common/Imagedata";
import {
  BudgetTask,
  MobileAppDesign,
  ProjectBudget,
  WebsiteAppDesign,
  WebsiteDesign,
} from "../../common/Chartdata";
import { TASKS } from "../../common/Comondata";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminGetOne } from "../../redux/actions/Admin.action";
import { decryptData } from "../../utils/encryptionUtils";
import { getOneB2BAdmin } from "../../redux/actions/B2BAdmin.action";
import { getAllBranch, getOneBranch } from "../../redux/actions/Branch.action";
import { getB2BMemberById } from "../../redux/actions/B2BMember.action";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import { CircularProgress } from "@mui/material";
import { countryDropDownCourse } from "../../redux/actions/CourseFinder.action";
import { getBranchMemberById } from "../../redux/actions/BranchMember.action";
import { MdCalendarToday } from "react-icons/md";
import Calendar from "react-calendar";
import DashboardTabs from "./components/DashboardTabs";
import ApplicationPipeline from "./components/ApplicationPipeline";
import CounselorPerformance from "./components/CounselorPerformance";
import FinancialOverview from "./components/FinancialOverview";
import StudentFunnel from "./components/studentFunnel";
import IeltsSummary from "./components/IeltsSummary";
import Dialpad from "./components/Dialpad";
import {
  FaCalendarAlt,
  FaChartBar,
  FaDownload,
  FaUpload,
} from "react-icons/fa";
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
              borderRadius: "30px",
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

  const generateDistinctColors = (count) => {
    const colors = [];
    const hueStep = 360 / count;
    for (let i = 0; i < count; i++) {
      const hue = i * hueStep;
      colors.push(`hsl(${hue}, 70%, 55%)`);
    }
    return colors;
  };

  // const labels = preferredCountries?.map((c) => c?.name) || [];
  const totalCountry = dashboardData?.countryVisaApproval?.length || [];
  const countryVisaData = dashboardData?.countryVisaApproval || [];
  const labels = countryVisaData?.map((item) => item?._id);

  const colors = generateDistinctColors(labels.length);

  const data = countryVisaData?.map((item) => item?.totalApproved);

  // const data = labels.map((name) =>
  //   name === "Finland" ? 20000 : Math.floor(Math.random() * 10000 + 1000)
  // );

  const pieChartData = {
    labels,
    datasets: [
      {
        label: "Transaction Amount by Country (%)",
        data,
        backgroundColor: colors,
        borderColor: "#fff",
        borderWidth: 2,
        hoverOffset: 20,
      },
    ],
  };

  const pieChartOptions = {
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
          boxWidth: 20,
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#ddd",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce(
              (sum, val) => sum + val,
              0,
            );
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
        // callbacks: {
        //   label: function (context) {
        //     const total = 209313;
        //     const percentage = ((context.raw / total) * 100).toFixed(1);
        //     return `${context.label}: ${percentage}%`;
        //   },
        // },
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: "#fff",
        shadowOffsetX: 3,
        shadowOffsetY: 3,
        shadowBlur: 10,
        shadowColor: "rgba(0, 0, 0, 0.2)",
      },
    },
    layout: {
      padding: 10,
    },
  };

  const bankLabels = bankwiseTotals.map(
    (bank) => bank.bankName || "Unknown Bank",
  );
  const bankData = bankwiseTotals.map((bank) => bank.totalAmount || 0);

  const bankPieChartData = {
    labels: bankLabels,
    datasets: [
      {
        label: "Transaction Amount by Bank (%)",
        data: bankData,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderColor: "#fff",
        borderWidth: 2,
        hoverOffset: 20,
      },
    ],
  };

  const bankPieChartOptions = {
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
          boxWidth: 20,
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#ddd",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce(
              (sum, val) => sum + val,
              0,
            );
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${
              storedEncryptedCurrency
                ? getSymbolFromCurrency(storedEncryptedCurrency)
                : "₹"
            } ${value} (${percentage}%)`;
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: "#fff",
        shadowOffsetX: 3,
        shadowOffsetY: 3,
        shadowBlur: 10,
        shadowColor: "rgba(0, 0, 0, 0.2)",
      },
    },
    layout: {
      padding: 10,
    },
  };

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

  // Static options for Visa Country dropdown
  const visaCountryOptions = ["USA", "Canada", "UK", "Australia", "Germany"];
  const formattedVisaCountryOptions = visaCountryOptions.map((country) => ({
    label: country,
    value: country,
  }));

  // Static options for Counsellor dropdown
  const counsellorOptions = [
    "Jane Smith",
    "John Doe",
    "Emily Davis",
    "Michael Brown",
    "Sarah Wilson",
  ];
  const formattedCounsellorOptions = counsellorOptions.map((name) => ({
    label: name,
    value: name,
  }));

  // Static options for Application Status dropdown
  const applicationStatusOptions2 = [
    "Submitted",
    "Reviewed",
    "Approved",
    "Rejected",
    "Pending",
  ];

  const visaApprovalOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Visa Approvals" },
      },
      x: { title: { display: true, text: "Month" } },
    },
  };

  // Country-wise Visa Approval Chart Data
  const countryVisaApprovalData = {
    labels: ["USA", "Canada", "UK", "Australia"],
    datasets: [
      {
        data: [25.0, 30.0, 20.0, 15.0],
        backgroundColor: ["#4A90E2", "#50E3C2", "#9013FE", "#F5A623"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
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
      title: "Pending Leads",
      value: dashboardData?.totalPendingLeads || 0,
      link: `/lead/allleads?status=New&selectedBranch=${selectedBranch}`,
      icon: "fe-clock", // Change to your icon class
      color: "primary",
    },
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
      title: "Total Applications",
      value: dashboardData?.totalStudents || 0,
      link: `/student/studentapplication?selectedBranch=${selectedBranch}`,
      icon: "fe-file-text",
      color: "info",
    },
  ];

  const academicStats = [
    {
      title: "Total Offer Letters",
      value: dashboardData?.totalOfferLetter || 0,
      link: `/student/studentapplication?selectedBranch=${selectedBranch}`,
      icon: "fe-mail",
      color: "info",
    },
    {
      title: "Total Admissions",
      value: dashboardData?.totalAdmissions || 0,
      link: `/student/studentapplication?selectedBranch=${selectedBranch}`,
      icon: "fe-user-check",
      color: "success",
    },
    {
      title: "Visa Approved",
      value: dashboardData?.totalVisaApproved || 0,
      link: `/student/studentapplication?selectedBranch=${selectedBranch}`,
      icon: "fe-check-square",
      color: "primary",
    },
  ];

  const performanceStats = [
    {
      title: "Top Visa Counsellor",
      value: dashboardData?.topCounselor?.name || "N/A",
      icon: "fe-award",
      color: "warning",
    },
    {
      title: "Top Performing Branch",
      value: dashboardData?.topBranchName || "N/A",
      icon: "fe-trending-up",
      color: "secondary",
    },
    {
      title: "Total Collection",
      value: dashboardData?.totalUniversityCollection || 0,
      icon: "fe-briefcase",
      color: "danger",
    },
  ];

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
            <Col sm={12} md={6} lg={6} xl={3}>
              <Link
                to={`/lead/allleads?status=New&selectedBranch=${selectedBranch}`}
                style={{ textDecoration: "none", cursor: "pointer" }}
              >
                <Card className="custom-card py-2">
                  <Card.Body>
                    <div className="card-item">
                      <div className="card-item-icon card-icon">
                        <svg
                          className="text-primary"
                          xmlns="http://www.w3.org/2000/svg"
                          height="24"
                          viewBox="0 0 24 24"
                          width="24"
                        >
                          <path d="M0 0h24v24H0z" fill="none" />
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-7h2v4h-2zm0-6h2v2h-2z" />
                        </svg>
                      </div>
                      <div className="card-item-title mb-2">
                        <label className="main-content-label fs-13 font-weight-bold mb-1">
                          Pending Leads
                        </label>
                      </div>
                      <div className="card-item-body">
                        <div className="card-item-stat">
                          <h4 className="font-weight-bold">
                            {dashboardData?.totalPendingLeads || 0}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            {(userType === "Branch User" ? canShowAllLeads : true) && (
              <Col sm={12} md={6} lg={6} xl={3}>
                <Link
                  to={`/lead/allleads?selectedBranch=${selectedBranch}`}
                  style={{ textDecoration: "none", cursor: "pointer" }}
                >
                  <Card className="custom-card py-2">
                    <Card.Body>
                      <div className="card-item">
                        <div className="card-item-icon card-icon">
                          <svg
                            className="text-primary"
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            viewBox="0 0 24 24"
                            width="24"
                          >
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-7h2v4h-2zm0-6h2v2h-2z" />
                          </svg>
                        </div>
                        <div className="card-item-title mb-2">
                          <label className="main-content-label fs-13 font-weight-bold mb-1">
                            Total Leads
                          </label>
                        </div>
                        <div className="card-item-body">
                          <div className="card-item-stat">
                            <h4 className="font-weight-bold">
                              {dashboardData?.totalLeads || 0}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            )}
            <Col sm={12} md={6} lg={6} xl={3}>
              <Link
                to={`/lead/allleads?selectedBranch=${selectedBranch}`}
                style={{ textDecoration: "none", cursor: "pointer" }}
              >
                <Card className="custom-card py-2">
                  <Card.Body>
                    <div className="card-item">
                      <div className="card-item-icon card-icon">
                        <svg
                          className="text-primary"
                          xmlns="http://www.w3.org/2000/svg"
                          height="24"
                          viewBox="0 0 24 24"
                          width="24"
                        >
                          <path d="M0 0h24v24H0z" fill="none" />
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-7h2v4h-2zm0-6h2v2h-2z" />
                        </svg>
                      </div>
                      <div className="card-item-title mb-2">
                        <label className="main-content-label fs-13 font-weight-bold mb-1">
                          Allocated Leads
                        </label>
                      </div>
                      <div className="card-item-body">
                        <div className="card-item-stat">
                          <h4 className="font-weight-bold">
                            {dashboardData?.allocatedLeads || 0}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col sm={12} md={6} lg={6} xl={3}>
              <Link
                to="/lead/todayfollowup"
                style={{ textDecoration: "none", cursor: "pointer" }}
              >
                <Card className="custom-card py-2">
                  <Card.Body>
                    <div className="card-item">
                      <div className="card-item-icon card-icon">
                        <svg
                          className="text-primary"
                          xmlns="http://www.w3.org/2000/svg"
                          height="24"
                          viewBox="0 0 24 24"
                          width="24"
                        >
                          <path d="M0 0h24v24H0z" fill="none" />
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-7h2v4h-2zm0-6h2v2h-2z" />
                        </svg>
                      </div>
                      <div className="card-item-title mb-2">
                        <label className="main-content-label fs-13 font-weight-bold mb-1">
                          Today's FollowUp Leads
                        </label>
                        {/* <span className="d-block fs-12 mb-0 text-muted">`
                        Scheduled for today
                      </span> */}
                      </div>
                      <div className="card-item-body">
                        <div className="card-item-stat">
                          <h4 className="font-weight-bold">
                            {dashboardData?.todayFollowUpLeads || 0}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col sm={12} md={6} lg={6} xl={3}>
              <Link
                to={`/student/studentapplication?selectedBranch=${selectedBranch}`}
                style={{ textDecoration: "none", cursor: "pointer" }}
              >
                <Card className="custom-card py-2">
                  <Card.Body>
                    <div className="card-item">
                      <div className="card-item-icon card-icon">
                        <svg
                          className="text-primary"
                          xmlns="http://www.w3.org/2000/svg"
                          height="24"
                          viewBox="0 0 24 24"
                          width="24"
                        >
                          <path d="M0 0h24v24H0z" fill="none" />
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79-4-4-4z" />
                        </svg>
                      </div>
                      <div className="card-item-title mb-2">
                        <label className="main-content-label fs-13 font-weight-bold mb-1">
                          Total Applications
                        </label>
                        {/* <span className="d-block fs-12 mb-0 text-muted">
                        Total leads generated
                      </span> */}
                      </div>
                      <div className="card-item-body">
                        <div className="card-item-stat">
                          <h4 className="font-weight-bold">
                            {dashboardData?.totalStudents || 0}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col sm={12} md={6} lg={6} xl={3}>
              <Link
                to={`/student/studentapplication?selectedBranch=${selectedBranch}`}
                style={{ textDecoration: "none", cursor: "pointer" }}
              >
                <Card className="custom-card py-2">
                  <Card.Body>
                    <div className="card-item">
                      <div className="card-item-icon card-icon">
                        <svg
                          className="text-primary"
                          xmlns="http://www.w3.org/2000/svg"
                          height="24"
                          viewBox="0 0 24 24"
                          width="24"
                        >
                          <path d="M0 0h24v24H0z" fill="none" />
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                        </svg>
                      </div>
                      <div className="card-item-title mb-2">
                        <label className="main-content-label fs-13 font-weight-bold mb-1">
                          Total Offer Letters
                        </label>
                        {/* <span className="d-block fs-12 mb-0 text-muted">
                        New leads this month
                      </span> */}
                      </div>
                      <div className="card-item-body">
                        <div className="card-item-stat">
                          <h4 className="font-weight-bold">
                            {dashboardData?.totalOfferLetter || 0}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col sm={12} md={6} lg={6} xl={3}>
              <Link
                to={`/student/studentapplication?selectedBranch=${selectedBranch}`}
                style={{ textDecoration: "none", cursor: "pointer" }}
              >
                <Card className="custom-card py-2">
                  <Card.Body>
                    <div className="card-item">
                      <div className="card-item-icon card-icon">
                        <svg
                          className="text-primary"
                          xmlns="http://www.w3.org/2000/svg"
                          height="24"
                          viewBox="0 0 24 24"
                          width="24"
                        >
                          <path d="M0 0h24v24H0z" fill="none" />
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-7h2v4h-2zm0-6h2v2h-2z" />
                        </svg>
                      </div>
                      <div className="card-item-title mb-2">
                        <label className="main-content-label fs-13 font-weight-bold mb-1">
                          Total Admissions
                        </label>
                        {/* <span className="d-block fs-12 mb-0 text-muted">
                        Scheduled for today
                      </span> */}
                      </div>
                      <div className="card-item-body">
                        <div className="card-item-stat">
                          <h4 className="font-weight-bold">
                            {dashboardData?.totalAdmissions || 0}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col sm={12} md={6} lg={6} xl={3}>
              <Link
                to={`/student/studentapplication?selectedBranch=${selectedBranch}`}
                style={{ textDecoration: "none", cursor: "pointer" }}
              >
                <Card className="custom-card py-2">
                  <Card.Body>
                    <div className="card-item">
                      <div className="card-item-icon card-icon">
                        <svg
                          className="text-primary"
                          xmlns="http://www.w3.org/2000/svg"
                          height="24"
                          viewBox="0 0 24 24"
                          width="24"
                        >
                          <path d="M0 0h24v24H0z" fill="none" />
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-7h2v4h-2zm0-6h2v2h-2z" />
                        </svg>
                      </div>
                      <div className="card-item-title mb-2">
                        <label className="main-content-label fs-13 font-weight-bold mb-1">
                          Visa Approved
                        </label>
                        {/* <span className="d-block fs-12 mb-0 text-muted">
                        Total follow-ups
                      </span> */}
                      </div>
                      <div className="card-item-body">
                        <div className="card-item-stat">
                          <h4 className="font-weight-bold">
                            {dashboardData?.totalVisaApproved || 0}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
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
                        style={{ zIndex: 100 }}
                      >
                        <Card.Body className="p-3">
                          <div className="d-flex align-items-center">
                            {/* Icon Badge - Matches KPI style */}
                            <div
                              className="bg-primary-transparent rounded-circle d-flex align-items-center justify-content-center me-3"
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
                              <div className="d-flex align-items-center gap-2">
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
                                    onClick={() =>
                                      setShowStartDateCalendar(
                                        !showStartDateCalendar,
                                      )
                                    }
                                    className="form-control-sm bg-light border-0 px-3 rounded-pill fs-13"
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
                                      className="position-absolute top-100 start-0 mt-2 shadow-lg rounded-3 bg-white border"
                                      style={{ zIndex: 1000 }}
                                    >
                                      <Calendar
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

                                <span className="text-muted fw-bold">→</span>

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
                                    onClick={() =>
                                      setShowEndDateCalendar(
                                        !showEndDateCalendar,
                                      )
                                    }
                                    className="form-control-sm bg-light border-0 px-3 rounded-pill fs-13"
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
                                      className="position-absolute top-100 start-0 mt-2 shadow-lg rounded-3 bg-white border"
                                      style={{ zIndex: 1000 }}
                                    >
                                      <Calendar
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
                          background:
                            "linear-gradient(45deg, #6259ca, #8e85ef)",
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
                              <p className="mb-1 text-white-50 fs-10 fw-bold text-uppercase letter-spacing-1">
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
                    {KPI_CARDS.map((card, index) => (
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
                                  <p className="text-muted mb-1 fs-12 fw-bold text-uppercase letter-spacing-1">
                                    {card.title}
                                  </p>
                                  <div className="d-flex align-items-baseline">
                                    <h3 className="mb-0 fw-bold">
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
                                <p className="text-muted mb-1 fs-12 fw-bold text-uppercase letter-spacing-1">
                                  Total Offer Letters
                                </p>
                                <h3 className="mb-0 fw-bold">
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
                                <p className="text-muted mb-1 fs-12 fw-bold text-uppercase letter-spacing-1">
                                  Total Admissions
                                </p>
                                <h3 className="mb-0 fw-bold">
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
                                <p className="text-muted mb-1 fs-12 fw-bold text-uppercase letter-spacing-1">
                                  Visa Approved
                                </p>
                                <h3 className="mb-0 fw-bold">
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
                              <p className="text-muted mb-1 fs-12 fw-bold text-uppercase letter-spacing-1">
                                Top Visa Counsellor
                              </p>
                              <h4 className="mb-0 fw-bold text-truncate">
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
                              <p className="text-muted mb-1 fs-12 fw-bold text-uppercase letter-spacing-1">
                                Top Performing Branch
                              </p>
                              <h4 className="mb-0 fw-bold text-truncate">
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
                              <p className="text-muted mb-1 fs-12 fw-bold text-uppercase letter-spacing-1">
                                Total Collection
                              </p>
                              <h3 className="mb-0 fw-bold">
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
                
                <Col sm={12} lg={6} xl={6}>
                  <Card className="custom-card overflow-hidden">
                    <Card.Header>
                      <label className="main-content-label mb-2">
                        Country-wise Visa Approval
                      </label>
                    </Card.Header>
                    <Card.Body>
                      <div
                        className="d-flex flex-column justify-content-between"
                        style={{ height: "370px" }}
                      >
                        <div className="w-100 border shadow-sm px-2 py-1 rounded">
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-2">
                              <i
                                className="bi bi-flag"
                                style={{ fontSize: "1rem", color: "#198754" }}
                              ></i>
                              <span
                                className="fw-semibold"
                                style={{ color: "#198754" }}
                              >
                                Total Country
                              </span>
                            </div>
                            <span>
                              {new Intl.NumberFormat().format(totalCountry)}
                            </span>
                          </div>
                        </div>
                        {/* <Pie
                  data={countryVisaApprovalData}
                  options={countryVisaApprovalOptions}
                /> */}
                        <div style={{ height: "300px" }}>
                          <Pie data={pieChartData} options={pieChartOptions} />
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col sm={12} lg={6} xl={6}>
                  <Card className="custom-card overflow-hidden">
                    <Card.Header>
                      <label className="main-content-label mb-2">
                        Bank-wise total Amount
                      </label>
                    </Card.Header>
                    <Card.Body>
                      <div style={{ height: "370px" }}>
                        <div className="d-flex flex-wrap justify-content-center gap-2">
                          <div className="w-100 border shadow-sm px-2 py-1 rounded">
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="d-flex align-items-center gap-2">
                                <i
                                  className="bi bi-bank"
                                  style={{ fontSize: "1rem", color: "#0d6efd" }}
                                ></i>
                                <span
                                  className="fw-semibold"
                                  style={{ color: "#0d6efd" }}
                                >
                                  Bank Balance
                                </span>
                              </div>
                              <span>
                                {storedEncryptedCurrency
                                  ? getSymbolFromCurrency(
                                      storedEncryptedCurrency,
                                    )
                                  : "₹"}{" "}
                                {new Intl.NumberFormat().format(
                                  totalPaidAmount,
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="w-100 border shadow-sm px-2 py-1 rounded">
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="d-flex align-items-center gap-2">
                                <i
                                  className="bi bi-cash-stack text-warning"
                                  style={{ fontSize: "1.1rem" }}
                                ></i>
                                <span className="fw-semibold text-warning">
                                  Cash Balance
                                </span>
                              </div>
                              <span>
                                {storedEncryptedCurrency
                                  ? getSymbolFromCurrency(
                                      storedEncryptedCurrency,
                                    )
                                  : "₹"}{" "}
                                {new Intl.NumberFormat().format(totalDueAmount)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* <Pie
                  data={countryVisaApprovalData}
                  options={countryVisaApprovalOptions}
                /> */}
                        <div style={{ height: "300px" }}>
                          <Pie
                            data={bankPieChartData}
                            options={bankPieChartOptions}
                          />
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

                <Col sm={12} md={6} lg={6} xl={6}>
                  <Card className="custom-card overflow-hidden h-100">
                    <Card.Header className="d-block border-bottom-0 pb-0">
                      <div>
                        <div className="d-md-flex">
                          <label className="main-content-label my-auto pt-2">
                            Counselor Tasks Today
                          </label>
                          <div className="ms-auto mt-3 d-flex">
                            <div className="me-3 d-flex text-muted fs-13">
                              <span className="legend bg-primary rounded-circle"></span>
                              Completed
                            </div>
                            <div className="d-flex text-muted fs-13">
                              <span className="legend bg-light rounded-circle"></span>
                              Pending
                            </div>
                          </div>
                        </div>
                        <span className="d-block fs-12 mt-2 mb-0 text-muted">
                          Follow-up activities for student applications
                        </span>
                      </div>
                    </Card.Header>
                    <Card.Body className="py-0">
                      <Row>
                        <Col sm={6} className="my-auto">
                          <h6 className="mb-3 font-weight-normal">
                            Follow-ups Due
                          </h6>
                          <div className="text-start">
                            <h3 className="font-weight-bold me-3 mb-2 text-primary">
                              {dashboardData?.todaysLeadFollowup || 0}
                            </h3>
                            <p className="fs-13 my-auto text-muted">
                              June 17, 2025
                            </p>
                          </div>
                        </Col>
                        <Col md={6} className="px-0">
                          <div className="forth circle d-flex justify-content-end">
                            <div className="mt-4 mb-3">
                              <Doughnut
                                style={{ height: "100px" }}
                                data={counselorTasksData}
                                options={counselorTasksOptions}
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={12} md={6} lg={6} xl={6}>
                  <Card className="custom-card top-inquiries h-100">
                    <Card.Header className="border-bottom-0 pb-0">
                      <div>
                        <div className="d-flex">
                          <label className="main-content-label my-auto pt-2">
                            Top Inquiries Sources
                          </label>
                        </div>
                        <span className="d-block fs-12 mt-2 -mb-2 text-muted">
                          Sources generating the most student inquiries
                        </span>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <div
                        style={{
                          maxHeight: "120px",
                          overflowY: "auto",
                          overflowX: "hidden",
                          scrollbarWidth: "thin",
                          scrollbarColor: "#6c757d #e9ecef",
                        }}
                      >
                        {topInquiries.length > 0 ? (
                          topInquiries.map((source, index) => (
                            <Row
                              key={index}
                              className={index > 0 ? "mt-4" : "mt-1"}
                            >
                              <Col sm={5} className="col-4">
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip id={`tooltip-${index}`}>
                                      {source.lead_from}
                                    </Tooltip>
                                  }
                                >
                                  <span
                                    style={{
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      display: "block",
                                      maxWidth: "100%",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {source.lead_from}
                                  </span>
                                </OverlayTrigger>
                              </Col>
                              <Col sm={4} className="col-4 my-auto">
                                <ProgressBar
                                  className="ht-6 my-auto"
                                  now={Math.min(source.percentage * 10, 100)}
                                />
                              </Col>
                              <Col sm={3} className="col-4">
                                <div className="d-flex">
                                  <span className="fs-13">
                                    <i
                                      className={`fe fe-arrow-${
                                        source.percentage >= 5 ? "up" : "down"
                                      } text-${
                                        source.percentage >= 5
                                          ? "success"
                                          : "danger"
                                      }`}
                                    ></i>
                                    <b>{source.percentage.toFixed(2)}%</b>
                                  </span>
                                </div>
                              </Col>
                            </Row>
                          ))
                        ) : (
                          <Row className="mt-1">
                            <Col sm={12}>
                              <span>No inquiry sources available</span>
                            </Col>
                          </Row>
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
                  <Row className="row-sm">
                    <Col md={12} lg={12} xl={12}>
                      <Row className="row-sm">
                        <Col>
                          <Card className="custom-card transcation-crypto">
                            <Card.Body>
                              <div className="d-flex flex-wrap align-items-end gap-3">
                                <div>
                                  <Form.Label>Date Range</Form.Label>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                      position: "relative",
                                    }}
                                  >
                                    <div
                                      style={{
                                        position: "relative",
                                        flex: "1",
                                      }}
                                    >
                                      <Form.Control
                                        type="text"
                                        className="filter-height"
                                        placeholder="dd/mm/yyyy"
                                        value={
                                          filters.startDate
                                            ? formatDate(
                                                parseDate(filters.startDate),
                                              )
                                            : ""
                                        }
                                        readOnly
                                        ref={startDateInputRef}
                                        onClick={() => {
                                          if (filters.startDate) {
                                            setStartDateValue(
                                              parseDate(filters.startDate),
                                            );
                                          }
                                          setShowStartDateCalendar(
                                            (show) => !show,
                                          );
                                        }}
                                        style={{
                                          cursor: "pointer",
                                          backgroundColor: "#fff",
                                          borderRadius: "30px",
                                          width: "100%",
                                          maxWidth: "200px",
                                        }}
                                        aria-label="Start date"
                                      />
                                      {filters.startDate ? (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setFilters({
                                              ...filters,
                                              startDate: "",
                                            });
                                            setStartDateValue(null);
                                            setShowStartDateCalendar(false);
                                          }}
                                          style={{
                                            position: "absolute",
                                            right: 10,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            background: "transparent",
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: 16,
                                            color: "#888",
                                            padding: 0,
                                            zIndex: 1000,
                                          }}
                                          aria-label="Clear start date"
                                        >
                                          ×
                                        </button>
                                      ) : (
                                        <MdCalendarToday
                                          style={{
                                            position: "absolute",
                                            right: 12,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "#888",
                                            pointerEvents: "none",
                                          }}
                                          size={18}
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
                                            boxShadow:
                                              "0 4px 16px rgba(0,0,0,0.15)",
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
                                              if (
                                                filters.endDate &&
                                                selectedDate >
                                                  parseDate(filters.endDate)
                                              ) {
                                                alert(
                                                  "Start date cannot be after end date",
                                                );
                                                return;
                                              }
                                              setStartDateValue(selectedDate);
                                              setFilters({
                                                ...filters,
                                                startDate:
                                                  toISODate(selectedDate),
                                              });
                                              setShowStartDateCalendar(false);
                                            }}
                                            value={startDateValue}
                                            locale="en-GB"
                                            // maxDate={new Date()}
                                          />
                                        </div>
                                      )}
                                    </div>

                                    <span
                                      style={{
                                        color: "#888",
                                        fontSize: "16px",
                                        fontWeight: "normal",
                                      }}
                                    >
                                      -
                                    </span>

                                    <div
                                      style={{
                                        position: "relative",
                                        flex: "1",
                                      }}
                                    >
                                      <Form.Control
                                        type="text"
                                        className="filter-height"
                                        placeholder="dd/mm/yyyy"
                                        value={
                                          filters.endDate
                                            ? formatDate(
                                                parseDate(filters.endDate),
                                              )
                                            : ""
                                        }
                                        readOnly
                                        ref={endDateInputRef}
                                        onClick={() => {
                                          if (filters.endDate) {
                                            setEndDateValue(
                                              parseDate(filters.endDate),
                                            );
                                          }
                                          setShowEndDateCalendar(
                                            (show) => !show,
                                          );
                                        }}
                                        style={{
                                          cursor: "pointer",
                                          backgroundColor: "#fff",
                                          borderRadius: "30px",
                                          width: "100%",
                                          maxWidth: "200px",
                                        }}
                                        aria-label="End date"
                                      />
                                      {filters.endDate ? (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setFilters({
                                              ...filters,
                                              endDate: "",
                                            });
                                            setEndDateValue(null);
                                            setShowEndDateCalendar(false);
                                          }}
                                          style={{
                                            position: "absolute",
                                            right: 10,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            background: "transparent",
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: 16,
                                            color: "#888",
                                            padding: 0,
                                            zIndex: 1000,
                                          }}
                                          aria-label="Clear end date"
                                        >
                                          ×
                                        </button>
                                      ) : (
                                        <MdCalendarToday
                                          style={{
                                            position: "absolute",
                                            right: 12,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "#888",
                                            pointerEvents: "none",
                                          }}
                                          size={18}
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
                                            boxShadow:
                                              "0 4px 16px rgba(0,0,0,0.15)",
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
                                              if (
                                                filters.startDate &&
                                                selectedDate <
                                                  parseDate(filters.startDate)
                                              ) {
                                                alert(
                                                  "End date cannot be before start date",
                                                );
                                                return;
                                              }
                                              setEndDateValue(selectedDate);
                                              setFilters({
                                                ...filters,
                                                endDate:
                                                  toISODate(selectedDate),
                                              });
                                              setShowEndDateCalendar(false);
                                            }}
                                            value={endDateValue}
                                            locale="en-GB"
                                            // maxDate={new Date()}
                                            minDate={
                                              filters.startDate
                                                ? parseDate(filters.startDate)
                                                : undefined
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
                    </Col>
                  </Row>

                  <Row className="row-sm mt-lg">
                    <Col sm={12} md={6} lg={6}>
                      <Card className="custom-card">
                        <Card.Body>
                          <div className="card-item">
                            <div className="card-item-icon card-icon">
                              <svg
                                className="text-primary"
                                xmlns="http://www.w3.org/2000/svg"
                                height="24"
                                viewBox="0 0 24 24"
                                width="24"
                              >
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79-4-4-4z" />
                              </svg>
                            </div>
                            <div className="card-item-title mb-2">
                              <label className="main-content-label fs-13 font-weight-bold mb-1">
                                Total Applications
                              </label>
                              {/* <span className="d-block fs-12 mb-0 text-muted">
                        Total leads generated
                      </span> */}
                            </div>
                            <div className="card-item-body">
                              <div className="card-item-stat">
                                <h4 className="font-weight-bold">
                                  {dashboardData?.totalStudents || 0}
                                </h4>
                                <small>
                                  <b className="text-success">10%</b> increase
                                </small>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col sm={12} md={6} lg={6}>
                      <Card className="custom-card">
                        <Card.Body>
                          <div className="card-item">
                            <div className="card-item-icon card-icon">
                              <svg
                                className="text-primary"
                                xmlns="http://www.w3.org/2000/svg"
                                height="24"
                                viewBox="0 0 24 24"
                                width="24"
                              >
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                              </svg>
                            </div>
                            <div className="card-item-title mb-2">
                              <label className="main-content-label fs-13 font-weight-bold mb-1">
                                Total Offer Letters
                              </label>
                              {/* <span className="d-block fs-12 mb-0 text-muted">
                        New leads this month
                      </span> */}
                            </div>
                            <div className="card-item-body">
                              <div className="card-item-stat">
                                <h4 className="font-weight-bold">
                                  {dashboardData?.totalOfferLetter || 0}
                                </h4>
                                <small>
                                  <b className="text-success">5%</b> increase
                                </small>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <Row className="row-sm">
                    <Col sm={12} md={6} lg={6}>
                      <Card className="custom-card">
                        <Card.Body>
                          <div className="card-item">
                            <div className="card-item-icon card-icon">
                              <svg
                                className="text-primary"
                                xmlns="http://www.w3.org/2000/svg"
                                height="24"
                                viewBox="0 0 24 24"
                                width="24"
                              >
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-7h2v4h-2zm0-6h2v2h-2z" />
                              </svg>
                            </div>
                            <div className="card-item-title mb-2">
                              <label className="main-content-label fs-13 font-weight-bold mb-1">
                                Total Admissions
                              </label>
                              {/* <span className="d-block fs-12 mb-0 text-muted">
                        Scheduled for today
                      </span> */}
                            </div>
                            <div className="card-item-body">
                              <div className="card-item-stat">
                                <h4 className="font-weight-bold">
                                  {dashboardData?.totalAdmissions || 0}
                                </h4>
                                <small>
                                  <b className="text-danger">2%</b> decrease
                                </small>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col sm={12} md={6} lg={6}>
                      <Card className="custom-card">
                        <Card.Body>
                          <div className="card-item">
                            <div className="card-item-icon card-icon">
                              <svg
                                className="text-primary"
                                xmlns="http://www.w3.org/2000/svg"
                                height="24"
                                viewBox="0 0 24 24"
                                width="24"
                              >
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-7h2v4h-2zm0-6h2v2h-2z" />
                              </svg>
                            </div>
                            <div className="card-item-title mb-2">
                              <label className="main-content-label fs-13 font-weight-bold mb-1">
                                Visa Approved
                              </label>
                              {/* <span className="d-block fs-12 mb-0 text-muted">
                        Total follow-ups
                      </span> */}
                            </div>
                            <div className="card-item-body">
                              <div className="card-item-stat">
                                <h4 className="font-weight-bold">
                                  {dashboardData?.totalVisaApproved || 0}
                                </h4>
                                <small>
                                  <b className="text-success">8%</b> increase
                                </small>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Col>

                <Col md={3} lg={3} xl={3} className="mb-3">
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
                    <Col xs={12}>
                      <Card className="custom-card overflow-hidden h-100">
                        <Card.Header className="d-block border-bottom-0 pb-0">
                          <div>
                            <div className="d-md-flex">
                              <label className="main-content-label my-auto pt-2">
                                Counselor Tasks Today
                              </label>
                              <div className="ms-auto mt-2 d-flex">
                                <div className="me-3 d-flex text-muted fs-13">
                                  <span className="legend bg-primary rounded-circle"></span>
                                  Completed
                                </div>
                                <div className="d-flex text-muted fs-13">
                                  <span className="legend bg-light rounded-circle"></span>
                                  Pending
                                </div>
                              </div>
                            </div>
                            <span className="d-block fs-12 mt-2 mb-0 text-muted">
                              Follow-up activities for student applications
                            </span>
                          </div>
                        </Card.Header>
                        <Card.Body className="py-0">
                          <Row>
                            <Col sm={6} className="my-auto">
                              <h6 className="mb-3 font-weight-normal">
                                Follow-ups Due
                              </h6>
                              <div className="text-start">
                                <h3 className="font-weight-bold me-3 mb-2 text-primary">
                                  {dashboardData?.todaysLeadFollowup || 0}
                                </h3>
                                <p className="fs-13 my-auto text-muted">
                                  June 17, 2025
                                </p>
                              </div>
                            </Col>
                            <Col md={6} className="px-0">
                              <div className="forth circle d-flex justify-content-end">
                                <div className="mt-4">
                                  <Doughnut
                                    style={{ height: "100px" }}
                                    data={counselorTasksData}
                                    options={counselorTasksOptions}
                                  />
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col xs={12}>
                      <Card className="custom-card top-inquiries h-100">
                        <Card.Header className="border-bottom-0 pb-0">
                          <div>
                            <div className="d-flex">
                              <label className="main-content-label my-auto pt-2">
                                Top Inquiries Sources
                              </label>
                            </div>
                            <span className="d-block fs-12 mt-2 -mb-2 text-muted">
                              Sources generating the most student inquiries
                            </span>
                          </div>
                        </Card.Header>
                        <Card.Body>
                          <div
                            style={{
                              maxHeight: "120px",
                              overflowY: "auto",
                              overflowX: "hidden",
                              scrollbarWidth: "thin",
                              scrollbarColor: "#6c757d #e9ecef",
                            }}
                          >
                            {topInquiries.length > 0 ? (
                              topInquiries.map((source, index) => (
                                <Row
                                  key={index}
                                  className={index > 0 ? "mt-4" : "mt-1"}
                                >
                                  <Col sm={5} className="col-4">
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip id={`tooltip-${index}`}>
                                          {source.lead_from}
                                        </Tooltip>
                                      }
                                    >
                                      <span
                                        style={{
                                          whiteSpace: "nowrap",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          display: "block",
                                          maxWidth: "100%",
                                          cursor: "pointer",
                                        }}
                                      >
                                        {source.lead_from}
                                      </span>
                                    </OverlayTrigger>
                                  </Col>
                                  <Col sm={4} className="col-4 my-auto">
                                    <ProgressBar
                                      className="ht-6 my-auto"
                                      now={Math.min(
                                        source.percentage * 10,
                                        100,
                                      )}
                                    />
                                  </Col>
                                  <Col sm={3} className="col-4">
                                    <div className="d-flex">
                                      <span className="fs-13">
                                        <i
                                          className={`fe fe-arrow-${
                                            source.percentage >= 5
                                              ? "up"
                                              : "down"
                                          } text-${
                                            source.percentage >= 5
                                              ? "success"
                                              : "danger"
                                          }`}
                                        ></i>
                                        <b>{source.percentage.toFixed(2)}%</b>
                                      </span>
                                    </div>
                                  </Col>
                                </Row>
                              ))
                            ) : (
                              <Row className="mt-1">
                                <Col sm={12}>
                                  <span>No inquiry sources available</span>
                                </Col>
                              </Row>
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
                    <div className="w-100 d-flex flex-wrap justify-content-between align-items-center gap-3">
                      <h4 className="card-title mb-0">
                        Application Status Summary
                      </h4>
                      <div className="d-flex flex-wrap">
                        <div className="filter-item me-3">
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
                        <div className="d-flex align-items-center">
                          <div className="filter-item filter-height total-records px-3 d-flex align-items-center">
                            <span>
                              Total Records :
                              <strong>&nbsp;{totalRecords}</strong>
                            </span>
                          </div>
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
                      <div className="table-responsive">
                        <table
                          className="text-nowrap border"
                          style={{ tableLayout: "auto" }}
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
                      <div className="d-flex justify-content-between align-items-center mt-3">
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
