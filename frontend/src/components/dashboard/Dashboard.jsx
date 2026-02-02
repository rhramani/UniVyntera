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
    localStorage.getItem("crmCurrency")
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
    b2bId = ""
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
          b2bId
        )
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
        selectedCountry?.value || ""
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
        selectedCountry?.value || ""
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
          headOffice
        )
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
              0
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
    (bank) => bank.bankName || "Unknown Bank"
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
              0
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
      (branch) => branch.branch !== "Head Office"
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
    (item) => item.name
  );
  const topCounselorData = topCounselorByadmissionCount?.map(
    (item) => item.count
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
        {userRole !== "Super Admin" && userRole !== "B2B Admin"  && userRole !== "Branch" && shouldShowQRCode && qrCodeUrl && (
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
            <Col sm={8} md={9} lg={9} xl={10} className="mb-3">
              <Card className="bg-primary custom-card card-box h-100">
                <Card.Body className="p-4">
                  <Row className="align-items-center">
                    <h4 className="d-flex mb-3">
                      <span className="font-weight-bold text-fixed-white">
                        {(role === "Coaching Faculty" &&
                          coachingFaculty?.name) ||
                          loginData?.data?.name ||
                          b2BAdminLoginData?.data?.companyName ||
                          branchLoginData?.data?.name ||
                          (branchMemberLoginData?.data?.firstName ||
                          branchMemberLoginData?.data?.lastName
                            ? `${
                                branchMemberLoginData?.data?.firstName || ""
                              } ${
                                branchMemberLoginData?.data?.lastName || ""
                              }`.trim()
                            : "") ||
                          (b2BMemberLoginData?.firstName ||
                          b2BMemberLoginData?.lastName
                            ? `${b2BMemberLoginData?.firstName || ""} ${
                                b2BMemberLoginData?.lastName || ""
                              }`.trim()
                            : "") ||
                          "User logout"}
                        !
                      </span>
                    </h4>
                    <p className="text-fixed-white op-8 mb-1">
                      You have{" "}
                      <b className="text-warning">
                        {dashboardData?.totalStudents || 0}
                      </b>{" "}
                      follow-ups scheduled today, with{" "}
                      <b className="text-warning">
                        {dashboardData?.totalStudents || 0}
                      </b>{" "}
                      applications pending review. Keep guiding students to
                      their dream destinations!
                    </p>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            {shouldShowQRCode && qrCodeUrl && (
              <Col sm={4} md={3} lg={3} xl={2} className="mb-3">
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
                                                parseDate(filters.startDate)
                                              )
                                            : ""
                                        }
                                        readOnly
                                        ref={startDateInputRef}
                                        onClick={() => {
                                          if (filters.startDate) {
                                            setStartDateValue(
                                              parseDate(filters.startDate)
                                            );
                                          }
                                          setShowStartDateCalendar(
                                            (show) => !show
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
                                                  "Start date cannot be after end date"
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
                                                parseDate(filters.endDate)
                                              )
                                            : ""
                                        }
                                        readOnly
                                        ref={endDateInputRef}
                                        onClick={() => {
                                          if (filters.endDate) {
                                            setEndDateValue(
                                              parseDate(filters.endDate)
                                            );
                                          }
                                          setShowEndDateCalendar(
                                            (show) => !show
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
                                                  "End date cannot be before start date"
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

                                {/* <div className="filter-item-2">
                                  <Form.Label>Visa Country</Form.Label>
                                  <Select
                                    className="filter-height"
                                    options={formattedVisaCountryOptions}
                                    // value={selectedVisaCountry}
                                    // onChange={handleVisaCountryChange}
                                    placeholder="Select Visa Country"
                                    classNamePrefix="custom-select"
                                    isClearable
                                    styles={{
                                      placeholder: (base) => ({
                                        ...base,
                                        fontSize: "13px",
                                      }),
                                    }}
                                  />
                                </div>

                                <div className="filter-item-2">
                                  <Form.Label>Counsellor</Form.Label>
                                  <Select
                                    className="filter-height"
                                    options={formattedCounsellorOptions}
                                    // value={selectedCounsellor}
                                    // onChange={handleCounsellorChange}
                                    placeholder="Select Counsellor"
                                    classNamePrefix="custom-select"
                                    isClearable
                                    styles={{
                                      placeholder: (base) => ({
                                        ...base,
                                        fontSize: "13px",
                                      }),
                                    }}
                                  />
                                </div>

                                <div className="filter-item-2">
                                  <Form.Label>Counsellor</Form.Label>
                                  <Form.Select
                                    className="filter-height"
                                    style={{ borderRadius: "30px" }}
                                  >
                                    <option value="">Select option</option>
                                    {counsellorOptions.map((counsellor, index) => (
                                      <option key={index} value={counsellor}>
                                        {counsellor}
                                      </option>
                                    ))}
                                  </Form.Select>
                                </div>

                                <div className="filter-item-2">
                                  <Form.Label>Application Status</Form.Label>
                                  <Select
                                    className="filter-height"
                                    options={studentStatusOptions}
                                    // value={mainStatus}
                                    // onChange={handleStudentStatusChange}
                                    placeholder="Select Status"
                                    classNamePrefix="custom-select"
                                    isClearable
                                    styles={{
                                      placeholder: (base) => ({
                                        ...base,
                                        fontSize: "13px",
                                      }),
                                    }}
                                  />
                                </div> */}
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>

                        <Col>
                          <Card className="custom-card">
                            <Card.Body>
                              <div className="card-item d-flex justify-content-between align-items-center">
                                <div className="my-2">
                                  <label className="main-content-label fs-13 font-weight-bold mb-2">
                                    Select Branch
                                  </label>
                                  <span className="d-block fs-12 mb-0 text-muted mt-1">
                                    Choose a branch to view data
                                  </span>
                                </div>
                                <div className="card-item-body">
                                  <Dropdown>
                                    <Dropdown.Toggle
                                      variant="default"
                                      className="btn btn-wave waves-effect waves-light btn-primary d-inline-flex align-items-center border-0"
                                    >
                                      {selectedBranch || branchesList[0]?.name}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={{ margin: "0px" }}>
                                      <Dropdown.Item
                                        key="all"
                                        onClick={() =>
                                          handleBranchSelect("All", "")
                                        }
                                      >
                                        All
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        key="head-office"
                                        onClick={() =>
                                          handleBranchSelect("Head Office", "")
                                        }
                                      >
                                        Head Office
                                      </Dropdown.Item>
                                      {branchesList?.map((branch, index) => (
                                        <Dropdown.Item
                                          key={index}
                                          onClick={() =>
                                            handleBranchSelect(
                                              branch?.name,
                                              branch?._id
                                            )
                                          }
                                        >
                                          {branch?.name}
                                        </Dropdown.Item>
                                      ))}
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

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
                  </Row>

                  <Row className="row-sm">
                    <Col sm={12} md={6} lg={6} xl={4}>
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
                    <Col sm={12} md={6} lg={6} xl={4}>
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
                    <Col sm={12} md={6} lg={6} xl={4}>
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

                  <Row className="row-sm">
                    <Col sm={12} md={6} lg={6} xl={4}>
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
                                Top Visa Counsellor
                              </label>
                              {/* <span className="d-block fs-12 mb-0 text-muted">
                        Total leads generated
                      </span> */}
                            </div>
                            <div className="card-item-body">
                              <div className="card-item-stat">
                                <h4 className="font-weight-bold">
                                  {dashboardData?.topCounselor?.name || 0}
                                </h4>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col sm={12} md={6} lg={6} xl={4}>
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
                                Top Performing Branch
                              </label>
                              {/* <span className="d-block fs-12 mb-0 text-muted">
                        New leads this month
                      </span> */}
                            </div>
                            <div className="card-item-body">
                              <div className="card-item-stat">
                                <h4 className="font-weight-bold">
                                  {dashboardData?.topBranchName || 0}
                                </h4>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col sm={12} md={6} lg={6} xl={4}>
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
                                Total Collection
                              </label>
                              {/* <span className="d-block fs-12 mb-0 text-muted">
                        Total follow-ups
                      </span> */}
                            </div>
                            <div className="card-item-body">
                              <div className="card-item-stat">
                                <h4 className="font-weight-bold">
                                  {dashboardData?.totalUniversityCollection ||
                                    0}
                                </h4>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Col>

                <Col md={3} lg={3} xl={3}>
                  <Dialpad
                    onCall={(number) => console.log("Calling:", number)}
                  />
                </Col>

                {/* <Col sm={12} lg={6} xl={6}>
              <Card className="custom-card overflow-hidden">
                <Card.Header>
                  <label className="main-content-label mb-2">
                    Visa Approval Trend (Monthly)
                  </label>
                </Card.Header>
                <Card.Body>
                  <div style={{ height: "300px" }}>
                    <Line
                      data={countryVisaApprovalData}
                      options={visaApprovalOptions}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col> */}
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
                                      storedEncryptedCurrency
                                    )
                                  : "₹"}{" "}
                                {new Intl.NumberFormat().format(
                                  totalPaidAmount
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
                                      storedEncryptedCurrency
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
                                                parseDate(filters.startDate)
                                              )
                                            : ""
                                        }
                                        readOnly
                                        ref={startDateInputRef}
                                        onClick={() => {
                                          if (filters.startDate) {
                                            setStartDateValue(
                                              parseDate(filters.startDate)
                                            );
                                          }
                                          setShowStartDateCalendar(
                                            (show) => !show
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
                                                  "Start date cannot be after end date"
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
                                                parseDate(filters.endDate)
                                              )
                                            : ""
                                        }
                                        readOnly
                                        ref={endDateInputRef}
                                        onClick={() => {
                                          if (filters.endDate) {
                                            setEndDateValue(
                                              parseDate(filters.endDate)
                                            );
                                          }
                                          setShowEndDateCalendar(
                                            (show) => !show
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
                                                  "End date cannot be before start date"
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
                                        100
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
            {/* {activeTab === "counselorPerformance" && <CounselorPerformance />}
        {activeTab === "financialOverview" && <FinancialOverview />}
        {activeTab === "studentFunnel" && <StudentFunnel />}
        {activeTab === "ieltsSummary" && <IeltsSummary />} */}
          </Card>

          {/* <Card className="p-4 shadow-sm rounded">
        <h5 className="mb-3 fw-semibold">Additional Controls</h5>
        <Row className="g-3">
          <Col xs={12} sm={6} md={3}>
            <Button
              variant="outline-primary"
              className="w-100 d-flex align-items-center justify-content-center gap-2"
            >
              <FaDownload />
              Download Report
            </Button>
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Button
              variant="outline-purple"
              className="btn-outline-purple w-100 d-flex align-items-center justify-content-center gap-2"
              style={{ color: "#6f42c1", borderColor: "#6f42c1" }}
            >
              <FaUpload />
              Import Student Data
            </Button>
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Button
              variant="outline-indigo"
              className="btn-outline-indigo w-100 d-flex align-items-center justify-content-center gap-2"
              style={{ color: "#6610f2", borderColor: "#6610f2" }}
            >
              <FaChartBar />
              Export Statistics
            </Button>
          </Col>
          <Col xs={12} sm={6} md={3}>
            <Button
              variant="outline-success"
              className="w-100 d-flex align-items-center justify-content-center gap-2"
            >
              <FaCalendarAlt />
              Upcoming Deadlines
            </Button>
          </Col>
        </Row>
      </Card> */}

          <Row className="row-sm">
            <Col sm={12} lg={12} xl={8}>
              {/* <Row className="row-sm">
            <Col sm={12} md={6} lg={6} xl={4}>
              <Card className="custom-card">
                <Card.Body>
                  <div className="card-item">
                    <div className="card-item-icon card-icon">
                      <svg
                        className="text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        enableBackground="new 0 0 24 24"
                        height="24"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <g>
                          <rect
                            height="14"
                            opacity=".3"
                            width="14"
                            x="5"
                            y="5"
                          />
                          <g>
                            <rect fill="none" height="24" width="24" />
                            <g>
                              <path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M19,19H5V5h14V19z" />
                              <rect height="5" width="2" x="7" y="12" />
                              <rect height="10" width="2" x="15" y="7" />
                              <rect height="3" width="2" x="11" y="14" />
                              <rect height="2" width="2" x="11" y="10" />
                            </g>
                          </g>
                        </g>
                      </svg>
                    </div>
                    <div className="card-item-title mb-2">
                      <label className="main-content-label fs-13 font-weight-bold mb-1">
                        Total Revenue
                      </label>
                      <span className="d-block fs-12 mb-0 text-muted">
                        Previous month vs this months
                      </span>
                    </div>
                    <div className="card-item-body">
                      <div className="card-item-stat">
                        <h4 className="font-weight-bold">$5,900.00</h4>
                        <small>
                          <b className="text-success">10%</b> higher
                        </small>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={6} lg={6} xl={4}>
              <Card className="custom-card">
                <Card.Body>
                  <div className="card-item">
                    <div className="card-item-icon card-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path
                          d="M12 4c-4.41 0-8 3.59-8 8 0 1.82.62 3.49 1.64 4.83 1.43-1.74 4.9-2.33 6.36-2.33s4.93.59 6.36 2.33C19.38 15.49 20 13.82 20 12c0-4.41-3.59-8-8-8zm0 9c-1.94 0-3.5-1.56-3.5-3.5S10.06 6 12 6s3.5 1.56 3.5 3.5S13.94 13 12 13z"
                          opacity=".3"
                        />
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.51.88 4.93 1.78C15.57 19.36 13.86 20 12 20s-3.57-.64-4.93-1.72zm11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6zm0 5c-.83 0-1.5-.67-1.5-1.5S11.17 8 12 8s1.5.67 1.5 1.5S12.83 11 12 11z" />
                      </svg>
                    </div>
                    <div className="card-item-title mb-2">
                      <label className="main-content-label fs-13 font-weight-bold mb-1">
                        New Employees
                      </label>
                      <span className="d-block fs-12 mb-0 text-muted">
                        Employees joined this month
                      </span>
                    </div>
                    <div className="card-item-body">
                      <div className="card-item-stat">
                        <h4 className="font-weight-bold">15</h4>
                        <small>
                          <b className="text-success">5%</b> Increased
                        </small>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={12} lg={12} xl={4}>
              <Card className="card custom-card">
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
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path
                          d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm1.23 13.33V19H10.9v-1.69c-1.5-.31-2.77-1.28-2.86-2.97h1.71c.09.92.72 1.64 2.32 1.64 1.71 0 2.1-.86 2.1-1.39 0-.73-.39-1.41-2.34-1.87-2.17-.53-3.66-1.42-3.66-3.21 0-1.51 1.22-2.48 2.72-2.81V5h2.34v1.71c1.63.39 2.44 1.63 2.49 2.97h-1.71c-.04-.97-.56-1.64-1.94-1.64-1.31 0-2.1.59-2.1 1.43 0 .73.57 1.22 2.34 1.67 1.77.46 3.66 1.22 3.66 3.42-.01 1.6-1.21 2.48-2.74 2.77z"
                          opacity=".3"
                        />
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                      </svg>
                    </div>
                    <div className="card-item-title  mb-2">
                      <label className="main-content-label fs-13 font-weight-bold mb-1">
                        Total Expenses
                      </label>
                      <span className="d-block fs-12 mb-0 text-muted">
                        Previous month vs this months
                      </span>
                    </div>
                    <div className="card-item-body">
                      <div className="card-item-stat">
                        <h4 className="font-weight-bold">$8,500</h4>
                        <small>
                          <b className="text-danger">12%</b> decrease
                        </small>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row> */}

              <Row className="row-sm">
                {/* <Col sm={12} lg={12} xl={12}>
              <Card className="custom-card overflow-hidden">
                <Card.Header className="border-bottom-0">
                  <div>
                    <label className="main-content-label mb-2">
                      Application Processing Status
                    </label>
                    <span className="d-block fs-12 mb-0 text-muted">
                      Track the progress of student applications through
                      submission, review, and approval stages
                    </span>
                  </div>
                </Card.Header>
                <Card.Body className="ps-12">
                  <div>
                    <Container>
                      <div className="chart-dropshadow2 ht-300">
                        <Bar
                          data={applicationStatusData}
                          options={applicationStatusOptions}
                        />
                      </div>
                    </Container>
                  </div>
                </Card.Body>
              </Card>
            </Col> */}

                {/* <Col lg={12}>
              <Card className="custom-card mg-b-20">
                <Card.Body>
                  <Card.Header className="border-bottom-0 pt-0 ps-0 pe-0 pb-2 d-flex">
                    <div>
                      <label className="main-content-label mb-2">Tasks</label>
                      <p className="mb-0 fs-12 mb-3 text-muted">
                        A task is accomplished by a set deadline, and must
                        contribute toward work-related objectives.
                      </p>
                    </div>
                    <div className="ms-auto d-flex flex-wrap gap-2">
                      <div className="contact-search3 me-3">
                        <Button variant="" type="button" className="border-0">
                          <i
                            className="fe fe-search fw-semibold text-muted"
                            aria-hidden="true"
                          ></i>
                        </Button>
                        <Form.Control
                          type="text"
                          className="h-6"
                          id="typehead1"
                          placeholder="Search here..."
                          autoComplete="off"
                        />
                      </div>
                      <Dropdown className="ms-auto d-flex">
                        <Dropdown.Toggle
                          variant="default"
                          className="btn btn-wave waves-effect waves-light btn-primary d-inline-flex align-items-center border-0"
                        >
                          <i className="ri-equalizer-line me-1"></i>Sort by
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ margin: "0px" }}>
                          <Dropdown.Item>Task</Dropdown.Item>
                          <Dropdown.Item>Team</Dropdown.Item>
                          <Dropdown.Item>Status</Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item>
                            <i className="fa fa-cog me-2"></i> Settings
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </Card.Header>
                  <div className="table-responsive tasks">
                    <Table className="card-table table-vcenter text-nowrap mb-0 border dashboard-table">
                      <thead>
                        <tr>
                          <th className="wd-lg-10p">Task</th>
                          <th className="wd-lg-20p text-center">Team</th>
                          <th className="wd-lg-20p text-center">Open task</th>
                          <th className="wd-lg-20p">Prority</th>
                          <th className="wd-lg-20p">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {TASKS.map((items, index) => (
                          <tr key={index} data-index={index}>
                            <td className="fw-medium">
                              <div className="d-flex">
                                <Form.Check
                                  className="me-4 rounded"
                                  defaultChecked={items.checked}
                                  type="radio"
                                  label=""
                                />
                                <span className="mt-1">{items.Task}</span>
                              </div>
                            </td>
                            <td className="text-nowrap">
                              <div className="avatar-list-stacked my-auto float-end">
                                <div className="avatar avatar-rounded avatar-sm">
                                  <img
                                    alt="avatar"
                                    className="rounded-circle"
                                    src={items.TeamMember1}
                                  />
                                </div>
                                <div className="avatar avatar-rounded avatar-sm">
                                  <img
                                    alt="avatar"
                                    className="rounded-circle"
                                    src={items.TeamMember2}
                                  />
                                </div>
                                <div className="avatar avatar-rounded avatar-sm">
                                  <img
                                    alt="avatar"
                                    className="rounded-circle"
                                    src={items.TeamMember3}
                                  />
                                </div>
                                <div className="avatar avatar-rounded avatar-sm">
                                  <img
                                    alt="avatar"
                                    className="rounded-circle"
                                    src={items.TeamMember4}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="text-center">
                              37<i className=""></i>
                            </td>
                            <td className={`text-${items.Profittext}`}>
                              {items.TaskProfit}
                            </td>
                            <td>
                              <span
                                className={`badge rounded-pill bg-${items.Statustext}-transparent`}
                              >
                                {items.Status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  <div className="float-end mt-3">
                    <nav className="pagination-style-3">
                      <Pagination className="mb-0 flex-wrap">
                        <Pagination.Item disabled>Prev</Pagination.Item>
                        <Pagination.Item active>{1}</Pagination.Item>
                        <Pagination.Item>{2}</Pagination.Item>
                        <Pagination.Ellipsis />
                        <Pagination.Item>{16}</Pagination.Item>
                        <Pagination.Item>Next</Pagination.Item>
                      </Pagination>
                    </nav>
                  </div>
                </Card.Body>
              </Card>
            </Col> */}
              </Row>
            </Col>
            <Col sm={12} lg={12} xl={4} className=" mt-xl-3">
              {/* <div className="card custom-card card-dashboard-calendar">
            <label className="main-content-label mb-2 pt-1">
              Recent Admissions
            </label>
            <span className="d-block fs-12 mb-2 text-muted">
              Number of student admissions by destination country
            </span>
            <div style={{ height: "300px" }}>
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
            <span className="d-block fs-12 mb-2 text-muted">
              Projects where development work is on completion
            </span>
            <table className="table m-b-0 transcations mt-2">
              <tbody>
                <tr>
                  <td className="wd-5p">
                    <div className="main-img-user avatar-md">
                      <img
                        alt="avatar"
                        className="rounded-circle me-3"
                        src={ALLImages("face5")}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-middle ms-3">
                      <div className="d-inline-block">
                        <h6 className="mb-1">Flicker</h6>
                        <p className="mb-0 fs-13 text-muted">App improvement</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-end">
                    <div className="d-inline-block">
                      <h6 className="mb-2 fs-15 fw-semibold">
                        $45.234
                        <i className="fas fa-level-up-alt ms-2 text-success m-l-10"></i>
                      </h6>
                      <p className="mb-0 text-muted">12 Jan 2020</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="wd-5p">
                    <div className="main-img-user avatar-md">
                      <img
                        alt="avatar"
                        className="rounded-circle me-3"
                        src={ALLImages("face6")}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-middle ms-3">
                      <div className="d-inline-block">
                        <h6 className="mb-1">Intoxica</h6>
                        <p className="mb-0 fs-13 text-muted">Milestone</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-end">
                    <div className="d-inline-block">
                      <h6 className="mb-2 fs-15 fw-semibold">
                        $23.452
                        <i className="fas fa-level-down-alt ms-2 text-danger m-l-10"></i>
                      </h6>
                      <p className="mb-0 text-muted">23 Jan 2020</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="wd-5p">
                    <div className="main-img-user avatar-md">
                      <img
                        alt="avatar"
                        className="rounded-circle me-3"
                        src={ALLImages("face7")}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-middle ms-3">
                      <div className="d-inline-block">
                        <h6 className="mb-1">Digiwatt</h6>
                        <p className="mb-0 fs-13 text-muted">Sales executive</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-end">
                    <div className="d-inline-block">
                      <h6 className="mb-2 fs-15 fw-semibold">
                        $78.001
                        <i className="fas fa-level-down-alt ms-2 text-danger m-l-10"></i>
                      </h6>
                      <p className="mb-0 text-muted">4 Apr 2020</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="wd-5p">
                    <div className="main-img-user avatar-md">
                      <img
                        alt="avatar"
                        className="rounded-circle me-3"
                        src={ALLImages("face8")}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-middle ms-3">
                      <div className="d-inline-block">
                        <h6 className="mb-1">Flicker</h6>
                        <p className="mb-0 fs-13 text-muted">Milestone2</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-end">
                    <div className="d-inline-block">
                      <h6 className="mb-2 fs-15 fw-semibold">
                        $37.285
                        <i className="fas fa-level-up-alt ms-2 text-success m-l-10"></i>
                      </h6>
                      <p className="mb-0 text-muted">4 Apr 2020</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="wd-5p pb-0">
                    <div className="main-img-user avatar-md">
                      <img
                        alt="avatar"
                        className="rounded-circle me-3"
                        src={ALLImages("face4")}
                      />
                    </div>
                  </td>
                  <td className="pb-0">
                    <div className="d-flex align-middle ms-3">
                      <div className="d-inline-block">
                        <h6 className="mb-1">Flicker</h6>
                        <p className="mb-0 fs-13 text-muted">App improvement</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-end pb-0">
                    <div className="d-inline-block">
                      <h6 className="mb-2 fs-15 fw-semibold">
                        $25.341
                        <i className="fas fa-level-down-alt ms-2 text-danger m-l-10"></i>
                      </h6>
                      <p className="mb-0 text-muted">4 Apr 2020</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div> */}

              {/* <Card className="custom-card">
            <Card.Body>
              <div className="card-item">
                <div className="card-item-title mb-2">
                  <label className="main-content-label fs-13 font-weight-bold mb-1">
                    Student Applications
                  </label>
                  <span className="d-block fs-12 mb-0 text-muted">
                    Total applications received
                  </span>
                </div>
                <div className="card-item-body">
                  <div className="card-item-stat">
                    <h4 className="font-weight-bold">
                      {staticData.studentApplication}
                    </h4>
                    <small>
                      <b className="text-success">15%</b> increase
                    </small>
                  </div>
                </div>
                <hr />
                <div className="card-item-title mb-2">
                  <label className="main-content-label fs-13 font-weight-bold mb-1">
                    Top Counselor
                  </label>
                  <span className="d-block fs-12 mb-0 text-muted">
                    Highest performing counselor
                  </span>
                </div>
                <div className="card-item-body">
                  <div className="card-item-stat">
                    <h4 className="font-weight-bold">
                      {staticData.topCounselor}
                    </h4>
                    <small>Closed {staticData.offerLetterCount} deals</small>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card> */}

              {/* Offer Letters and Total Transaction */}
              {/* <Card className="custom-card">
            <Card.Body>
              <div className="card-item">
                <div className="card-item-title mb-2">
                  <label className="main-content-label fs-13 font-weight-bold mb-1">
                    Offer Letters Issued
                  </label>
                  <span className="d-block fs-12 mb-0 text-muted">
                    Total offer letters sent
                  </span>
                </div>
                <div className="card-item-body">
                  <div className="card-item-stat">
                    <h4 className="font-weight-bold">
                      {staticData.offerLetterCount}
                    </h4>
                    <small>
                      <b className="text-success">20%</b> increase
                    </small>
                  </div>
                </div>
                <hr />
                <div className="card-item-title mb-2">
                  <label className="main-content-label fs-13 font-weight-bold mb-1">
                    Total Transaction
                  </label>
                  <span className="d-block fs-12 mb-0 text-muted">
                    Total transaction amount
                  </span>
                </div>
                <div className="card-item-body">
                  <div className="card-item-stat">
                    <h4 className="font-weight-bold">
                      ${staticData.totalTransaction.toLocaleString()}
                    </h4>
                    <small>
                      <b className="text-success">12%</b> increase
                    </small>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card> */}

              {/* <Card className="custom-card">
            <Card.Body>
              <Row className="row-sm">
                <Col className="col-6">
                  <div className="card-item-title">
                    <label className="main-content-label fs-13 font-weight-bold mb-2">
                      Project Launch
                    </label>
                    <span className="d-block fs-12 mb-0 text-muted">
                      the project is going to launch
                    </span>
                  </div>
                  <p className="mb-0 fs-24 mt-2">
                    <b className="text-primary">145 days</b>
                  </p>
                  <Link to="#" className="text-muted">
                    12 Monday, Oct 2020
                  </Link>
                </Col>
                <div className="col-6">
                  <img
                    src={ALLImages("png28")}
                    alt="work"
                    className="best-emp"
                  />
                </div>
              </Row>
            </Card.Body>
          </Card> */}

              {/* <Card className=" custom-card">
            <Card.Header className="border-bottom-0 pb-0 d-flex ps-3 ms-1">
              <div>
                <label className="main-content-label mb-2 pt-2">
                  On goiong projects
                </label>
                <span className="d-block fs-12 mb-2 text-muted">
                  Projects where development work is on completion
                </span>
              </div>
            </Card.Header>
            <Card.Body className="pt-2 mt-0">
              <div className="list-card">
                <div className="d-flex">
                  <div className="avatar-list-stacked d-flex align-items-center">
                    <div className="avatar avatar-rounded avatar-xs">
                      <img
                        alt="avatar"
                        className="rounded-circle"
                        src={ALLImages("face1")}
                      />
                    </div>
                    <div className="avatar avatar-rounded avatar-xs">
                      <img
                        alt="avatar"
                        className="rounded-circle"
                        src={ALLImages("face2")}
                      />
                    </div>
                    <div className="avatar avatar-rounded avatar-xs">
                      <img
                        alt="avatar"
                        className="rounded-circle"
                        src={ALLImages("face3")}
                      />
                    </div>
                    <div className="avatar avatar-rounded avatar-xs">
                      <img
                        alt="avatar"
                        className="rounded-circle"
                        src={ALLImages("face4")}
                      />
                    </div>
                    <div className="ms-4">Design team</div>
                  </div>
                  <div className="ms-auto float-end">
                    <Dropdown className="GOIONGPROJECTS">
                      <Dropdown.Toggle
                        as="a"
                        variant="default"
                        className="no-caret option-dots"
                      >
                        {" "}
                        <i className="fe fe-more-horizontal"></i>{" "}
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        className=" dropdown-menu-end"
                        style={{ margin: "0px" }}
                      >
                        <Dropdown.Item>Today</Dropdown.Item>
                        <Dropdown.Item>Last Week</Dropdown.Item>
                        <Dropdown.Item>Last Month</Dropdown.Item>
                        <Dropdown.Item>Last Year</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
                <div className="card-item mt-2">
                  <div className="card-item-icon bg-transparent card-icon">
                    <CircularProgress
                      variant="determinate"
                      value={85}
                      className="peity-donut"
                      data-peity='{ "fill": ["#6259ca", "rgba(204, 204, 204,0.3)"], "innerRadius": 15, "radius": 20}'
                      style={{ color: "#6259ca" }}
                    />
                    <MobileAppDesign />
                  </div>
                  <div className="card-item-body">
                    <div className="card-item-stat">
                      <small className="fs-10 text-primary fw-semibold">
                        25 August 2020
                      </small>
                      <h6 className=" mt-2">Mobile app design</h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="list-card mb-0">
                <div className="d-flex">
                  <div className="avatar-list-stacked d-flex align-items-center">
                    <div className="avatar avatar-rounded avatar-xs">
                      <img
                        alt="avatar"
                        className="rounded-circle"
                        src={ALLImages("face5")}
                      />
                    </div>
                    <div className="avatar avatar-rounded avatar-xs">
                      <img
                        alt="avatar"
                        className="rounded-circle"
                        src={ALLImages("face6")}
                      />
                    </div>
                    <div className="avatar avatar-rounded avatar-xs">
                      <img
                        alt="avatar"
                        className="rounded-circle"
                        src={ALLImages("face7")}
                      />
                    </div>
                    <div className="avatar avatar-rounded avatar-xs">
                      <img
                        alt="avatar"
                        className="rounded-circle"
                        src={ALLImages("face8")}
                      />
                    </div>
                    <div className="ms-4">Design team</div>
                  </div>
                  <div className="ms-auto float-end">
                    <Dropdown className="Designteam">
                      <Dropdown.Toggle
                        as="a"
                        variant=""
                        className="no-caret option-dots"
                      >
                        <i className="fe fe-more-horizontal"></i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        className=" dropdown-menu-end"
                        style={{ margin: "0px" }}
                      >
                        <Dropdown.Item>Today</Dropdown.Item>
                        <Dropdown.Item>Last Week</Dropdown.Item>
                        <Dropdown.Item>Last Month</Dropdown.Item>
                        <Dropdown.Item>Last Year</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
                <div className="card-item mt-2">
                  <div className="card-item-icon bg-transparent card-icon">
                    <WebsiteAppDesign />
                  </div>
                  <div className="card-item-body">
                    <div className="card-item-stat">
                      <small className="fs-10 text-primary fw-semibold">
                        12 JUNE 2020
                      </small>
                      <h6 className=" mt-2">Website Redesign</h6>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card> */}

              {/* <Card className="custom-card">
            <Card.Body>
              <div className="d-flex">
                <label className="main-content-label my-auto">
                  Website Design
                </label>
                <div className="ms-auto  d-flex">
                  <div className="me-3 d-flex text-muted fs-13">Running</div>
                </div>
              </div>
              <div className="mt-2">
                <div>
                  <span className="fs-15 text-muted">
                    Task completed : 7/10
                  </span>
                </div>
                <div className="container">
                  <WebsiteDesign />
                </div>
              </div>
              <Row className="row">
                <Col className="col">
                  <div className="mt-4">
                    <div className="d-flex mb-2">
                      <h5 className="fs-15 my-auto text-muted fw-normal">
                        Client :
                      </h5>
                      <h5 className="fs-15 my-auto ms-3">John Deo</h5>
                    </div>
                    <div className="d-flex mb-0">
                      <h5 className="fs-13 my-auto text-muted fw-normal">
                        Deadline :
                      </h5>
                      <h5 className="fs-13 my-auto text-muted ms-2">
                        25 Dec 2020
                      </h5>
                    </div>
                  </div>
                </Col>
                <Col className=" col-auto">
                  <div className="mt-3">
                    <div>
                      <img
                        alt="logo"
                        className="ht-50"
                        src={ALLImages("png21")}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card> */}
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default Dashboard;
