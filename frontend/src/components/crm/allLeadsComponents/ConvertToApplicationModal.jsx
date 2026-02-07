import { useFormik } from "formik";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import Calendar from "react-calendar";
import { AiOutlineClose } from "react-icons/ai";
import { MdCalendarToday } from "react-icons/md";
import Select from "react-select";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { getAllMainPlan } from "../../../redux/actions/Master/MainPlan.action";
import { useDispatch } from "react-redux";
import {
  getAllSubPlan,
  getOneSubPlan,
} from "../../../redux/actions/Master/SubPlan.action";
import {
  convertToApplication,
  getLead,
  updateLead,
  getLeadByAssignUserId,
  getB2BLead,
} from "../../../redux/actions/Lead.action";
import {
  createLeadStatus,
  getAllLeadStatus,
  updateLeadStatus,
} from "../../../redux/actions/Master/LeadStatuses/LeadStatus.action";
import { getAllBankingDetails } from "../../../redux/actions/Master/Banking.action";
import { countryDropDownCourse } from "../../../redux/actions/CourseFinder.action";
import { getAllStudentRegisterFor } from "../../../redux/actions/Master/StudentRegisterFor.action";
import { getAllCoachingRequirement } from "../../../redux/actions/Master/CoachingRequirement.action";
import {
  getAllBatchTimes,
  getAllCoachingFaculty,
} from "../../../redux/actions/Master/CoachingFaculty.action";
import { decryptData } from "../../../utils/encryptionUtils";
import usePermissions from "../../commonComponents/usePermissions";
import { getAllBranch } from "../../../redux/actions/Branch.action";

const ConvertToApplicationModal = ({
  openModal,
  setOpenModal,
  setIsLoading,
  itemsPerPage,
  currentPage,
  selectedLead,
  searchTerm,
  filters,
  setGetLeadData,
  setTotalPages,
  setTotalRecords,
  fetchLeadStatus,
  countries,
  userId,
  convertPage,
  fetALlLeadDataByDate,
  search,
  fetchAllFollowupLeads,
  fetchTodaysBirthdayLeads,
  isB2B = false,
  selectedFilter,
  canRead,
}) => {
  const dispatch = useDispatch();
  const [coachingSubPlans, setCoachingSubPlans] = useState([]);
  const [admissionSubPlans, setAdmissionSubPlans] = useState([]);
  const [visitorSubPlans, setVisitorSubPlans] = useState([]);
  const [mainPlans, setMainPlans] = useState([]);
  const [bankingDetails, setBankingDetails] = useState([]);
  const [preferredCountries, setPreferredCountries] = useState([]);
  const [allStudentRegisterFor, setAllStudentRegisterFor] = useState([]);
  const [allCoachingRequirements, setAllCoachingRequirements] = useState([]);
  const [coachingFaculties, setCoachingFaculties] = useState([]);
  const [batchTimes, setBatchTimes] = useState([]);

  const [showCoachingStartDateCalendar, setShowCoachingStartDateCalendar] =
    useState(false);
  const [showCoachingEndDateCalendar, setShowCoachingEndDateCalendar] =
    useState(false);
  const [showExamDateCalendar, setShowExamDateCalendar] = useState(false);
  const coachingStartDateInputRef = useRef(null);
  const coachingEndDateInputRef = useRef(null);
  const examDateInputRef = useRef(null);
  const coachingStartDateCalenderRef = useRef(null);
  const coachingEndDateCalenderRef = useRef(null);
  const examDateCalenderRef = useRef(null);

  const [
    showVisitorProcessRenewalDateCalendar,
    setShowVisitorProcessRenewalDateCalendar,
  ] = useState({});
  const [
    showVisitorProcessRefusalDateCalendar,
    setShowVisitorProcessRefusalDateCalendar,
  ] = useState(false);
  const visitorProcessRenewalDateInputRef = useRef(null);
  const visitorProcessRenewalDateCalendarRef = useRef(null);
  const visitorProcessRefusalDateInputRef = useRef(null);
  const visitorProcessRefusalDateCalendarRef = useRef(null);

  const userRole = decryptData(localStorage.getItem("role"));
  const branchID = decryptData(localStorage.getItem("userId"));
  const branchUserId = decryptData(localStorage.getItem("branchId"));
  const userType = decryptData(localStorage.getItem("userType"));

  // const { canRead } = usePermissions("All Leads");

  const [branchList, setBranchList] = useState([]);
  const isBranchLogin = userRole === "Branch" || userType === "Branch User";

  const [selectedBranch, setSelectedBranch] = useState(
    isBranchLogin
      ? {
          value: userType === "Branch User" ? branchUserId : branchID,
          label:
            branchList.find(
              (b) =>
                b._id ===
                (userType === "Branch User" ? branchUserId : branchID),
            )?.branchName ||
            branchList.find(
              (b) =>
                b._id ===
                (userType === "Branch User" ? branchUserId : branchID),
            )?.name ||
            "Branch",
        }
      : { value: "HeadOffice", label: "Head Office" },
  );

  const branchOptions = [
    { value: "HeadOffice", label: "Head Office" },
    ...branchList.map((branch) => ({
      value: branch._id,
      label: branch.branchName || branch.name,
    })),
  ];

  const fetchPreferredCountries = async () => {
    const res = await dispatch(countryDropDownCourse());
    setPreferredCountries(res?.data?.data || []);
  };

  const fetchStudentRegisterFor = async () => {
    try {
      const res = await dispatch(getAllStudentRegisterFor(1, 1000, ""));
      if (res?.status === 200) {
        setAllStudentRegisterFor(res?.data?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching lead sources:", error);
    }
  };

  const fetchCoachingRequirements = async () => {
    try {
      const res = await dispatch(getAllCoachingRequirement(1, 1000, ""));
      const responseData = res?.data?.data;
      setAllCoachingRequirements(responseData?.data || []);
    } catch (error) {
      console.error("Error fetching coaching requirements:", error);
    }
  };

  const fetchAllBranches = async () => {
    try {
      const res = await dispatch(getAllBranch(1, 100, ""));
      const responseData = res?.data?.data;
      setBranchList(responseData?.data || []);
    } catch (error) {
      console.log("Error fetching branches:", error);
      setBranchList([]);
    }
  };
  const handleBranchSelection = async (selectedOption) => {
    let showAll = false;
    let branchId = "";

    if (selectedOption?.value === "All") {
      showAll = true;
    } else if (selectedOption?.value === "HeadOffice") {
      showAll = false;
    } else if (selectedOption?.value) {
      branchId = selectedOption.value;
    }

    try {
      const res = await dispatch(
        getAllCoachingFaculty(
          1,
          1000,
          "",
          convertToApplicationFormik.values.coachingData.batchStatus || "",
          showAll,
          userType === "Branch User"
            ? branchUserId
            : branchId || (userRole === "Branch" ? branchID : ""),
        ),
      );
      if (res?.status === 200) {
        setCoachingFaculties(res?.data?.data?.data || []);
      } else {
        toast.error("Failed to fetch coaching faculties.");
      }
    } catch (error) {
      console.error("Error fetching faculties:", error);
      toast.error("Error fetching faculties: " + error.message);
    }
  };

  const fetchCoachingFaculties = async (
    batchStatus,
    branchValue = "",
    showAll = false,
  ) => {
    try {
      const finalBranchId =
        branchValue || // ✅ selected branch first
        (userType === "Branch User"
          ? branchUserId
          : userRole === "Branch"
            ? branchID
            : "");

      const res = await dispatch(
        getAllCoachingFaculty(1, 1000, "", batchStatus, showAll, finalBranchId),
      );
      const responseData = res?.data?.data || {};
      if (res?.status === 200) {
        setCoachingFaculties(responseData?.data || []);
      } else {
        toast.error("Failed to fetch coaching faculties.");
      }
    } catch (error) {
      console.error("Error fetching coaching faculties:", error);
      toast.error("Error fetching coaching faculties: " + error.message);
    }
  };

  const fetchBatchTimes = async (facultyId = "", status = "") => {
    try {
      const res = await dispatch(getAllBatchTimes(facultyId, status));
      setBatchTimes(res?.data?.message || []);
    } catch (error) {
      console.error("Error fetching batch times:", error);
    }
  };

  useEffect(() => {
    fetchAllBranches();
    if (userRole === "Super Admin") {
      handleBranchSelection({ value: "All", label: "All" }); // ✅
    } else {
      handleBranchSelection({
        value: userType === "Branch User" ? branchUserId : branchID,
        label: "Branch",
      });
    }
    fetchPreferredCountries();
    fetchStudentRegisterFor();
    fetchCoachingRequirements();
    fetchCoachingFaculties();
  }, []);

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

  // Helper to get yyyy-mm-dd for API/backend
  const toISODate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "12px",
      color: "black",
    }),
    placeholder: (base) => ({
      ...base,
      color: "black",
      fontSize: "13px",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  const fetchMainPlans = async () => {
    try {
      const res = await dispatch(getAllMainPlan());
      setMainPlans(res?.data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching main plans:", error);
      setMainPlans([]);
      toast.error("Failed to fetch main plans.");
    }
  };

  useEffect(() => {
    fetchMainPlans();
  }, []);

  const fetchSubPlans = async (
    page = 1,
    limit = itemsPerPage,
    searchTerm = "",
    mainPlanId = "",
    country = "",
  ) => {
    try {
      const res = await dispatch(
        getAllSubPlan(page, limit, searchTerm, mainPlanId, country),
      );
      const responseData = res?.data?.data || {};
      return responseData?.data || [];
    } catch (error) {
      console.error("Error fetching sub plans:", error);
      return [];
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showCoachingStartDateCalendar &&
        coachingStartDateCalenderRef.current &&
        !coachingStartDateCalenderRef.current.contains(event.target) &&
        coachingStartDateInputRef.current &&
        !coachingStartDateInputRef.current.contains(event.target)
      ) {
        setShowCoachingStartDateCalendar(false);
      }
      if (
        showCoachingEndDateCalendar &&
        coachingEndDateCalenderRef.current &&
        !coachingEndDateCalenderRef.current.contains(event.target) &&
        coachingEndDateInputRef.current &&
        !coachingEndDateInputRef.current.contains(event.target)
      ) {
        setShowCoachingEndDateCalendar(false);
      }
      if (
        showExamDateCalendar &&
        examDateCalenderRef.current &&
        !examDateCalenderRef.current.contains(event.target) &&
        examDateInputRef.current &&
        !examDateInputRef.current.contains(event.target)
      ) {
        setShowCoachingEndDateCalendar(false);
      }
      if (
        showVisitorProcessRenewalDateCalendar &&
        visitorProcessRenewalDateCalendarRef.current &&
        !visitorProcessRenewalDateCalendarRef.current.contains(event.target) &&
        visitorProcessRenewalDateInputRef.current &&
        !visitorProcessRenewalDateInputRef.current.contains(event.target)
      ) {
        setShowVisitorProcessRenewalDateCalendar(false);
      }
      if (
        showVisitorProcessRefusalDateCalendar &&
        visitorProcessRefusalDateCalendarRef.current &&
        !visitorProcessRefusalDateCalendarRef.current.contains(event.target) &&
        visitorProcessRefusalDateInputRef.current &&
        !visitorProcessRefusalDateInputRef.current.contains(event.target)
      ) {
        setShowVisitorProcessRefusalDateCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    showCoachingStartDateCalendar,
    showCoachingEndDateCalendar,
    showExamDateCalendar,
    showVisitorProcessRenewalDateCalendar,
    showVisitorProcessRefusalDateCalendar,
  ]);

  const convertToApplicationSchema = Yup.object({
    preferredCountry: Yup.string().required("Preferred Country is required"),
    email: Yup.string().required("Email is required"),
    admissionProcess: Yup.boolean().nullable(),
    coachingData: Yup.object({
      coachingRequired: Yup.boolean().nullable(),
      city: Yup.string().nullable(),
      startDate: Yup.date().nullable(),
      endDate: Yup.date().nullable(),
      registerFor: Yup.string().nullable(),
      coachingRequirement: Yup.string().nullable(),
      batchStatus: Yup.string().nullable(),
      branch: Yup.string().nullable(),
      batchFaculty: Yup.string().nullable(),
      batchTiming: Yup.string().nullable(),
      examRegistrationDate: Yup.string().nullable(),
      targetedScore: Yup.number().nullable(),
      hasGivenExam: Yup.boolean().nullable(),
      examDetails: Yup.array()
        .of(
          Yup.object({
            examName: Yup.string().nullable(),
            scores: Yup.object({
              reading: Yup.number().nullable(),
              writing: Yup.number().nullable(),
              speaking: Yup.number().nullable(),
              listening: Yup.number().nullable(),
              total: Yup.number().nullable(),
            }),
          }),
        )
        .nullable(),
      remarks: Yup.string().nullable(),
      subPlan: Yup.string().when("coachingRequired", {
        is: true,
        then: () => Yup.string().required("Coaching Sub Plan is required"),
        otherwise: () => Yup.string().nullable(),
      }),
      amount: Yup.string(),
      discount: Yup.string().when("coachingRequired", {
        is: true,
        then: () => Yup.string(),
        otherwise: () => Yup.string().nullable(),
      }),
      discountAmount: Yup.string().when("coachingRequired", {
        is: true,
        then: () => Yup.string(),
        otherwise: () => Yup.string().nullable(),
      }),
      payableAmount: Yup.string(),
      paidAmount: Yup.mixed()
        .transform((value) => {
          if (Array.isArray(value) && value.length > 0) {
            return value[0];
          }
          if (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
          ) {
            return value;
          }
          return { amount: "", date: "", bank: "", paymentMode: "" };
        })
        .when("coachingRequired", {
          is: true,
          then: () =>
            Yup.object().shape({
              amount: Yup.string().required("Receive Amount is required"),
              date: Yup.string().nullable(),
              bank: Yup.string().nullable(),
              paymentMode: Yup.string().required("Payment Mode is required"),
            }),
          otherwise: () => Yup.object().nullable(),
        }),
      dueAmount: Yup.string(),
      paymentType: Yup.string().when("coachingRequired", {
        is: true,
        then: () => Yup.string(),
        otherwise: () => Yup.string().nullable(),
      }),
      invoiceRemarks: Yup.string(),
    }),
    admissionData: Yup.object({
      subPlan: Yup.string().when("admissionProcess", {
        is: true,
        then: () => Yup.string().required("Admission Sub Plan is required"),
        otherwise: () => Yup.string().nullable(),
      }),
      amount: Yup.string(),
      discount: Yup.string().when("admissionProcess", {
        is: true,
        then: () => Yup.string(),
        otherwise: () => Yup.string().nullable(),
      }),
      discountAmount: Yup.string().when("admissionProcess", {
        is: true,
        then: () => Yup.string(),
        otherwise: () => Yup.string().nullable(),
      }),
      payableAmount: Yup.string(),
      paidAmount: Yup.mixed()
        .transform((value) => {
          if (Array.isArray(value) && value.length > 0) {
            return value[0];
          }
          if (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
          ) {
            return value;
          }
          return { amount: "", date: "", bank: "", paymentMode: "" };
        })
        .when("admissionProcess", {
          is: true,
          then: () =>
            Yup.object().shape({
              amount: Yup.string().required("Receive Amount is required"),
              date: Yup.string().nullable(),
              bank: Yup.string().nullable(),
              paymentMode: Yup.string().required("Payment Mode is required"),
            }),
          otherwise: () => Yup.object().nullable(),
        }),
      dueAmount: Yup.string(),
      paymentType: Yup.string().when("admissionProcess", {
        is: true,
        then: () => Yup.string(),
        otherwise: () => Yup.string().nullable(),
      }),
      invoiceRemarks: Yup.string(),
    }),
    visitorApplication: Yup.boolean().nullable(),
    categoryDetails: Yup.object({
      type: Yup.string(),
      entries: Yup.array()
        .of(
          Yup.object({
            country: Yup.string().required("Country is required"),
            date: Yup.date().required("Date is required"),
            document: Yup.mixed().required("Document is required"),
            remarks: Yup.string().nullable(),
          }),
        )
        .when(["visitorApplication", "type"], {
          is: (visitorApplication, type) =>
            visitorApplication && (type === "Renewal" || type === "Refusal"),
          then: () => Yup.array().min(1, "At least one detail is required"),
          otherwise: () => Yup.array().nullable(),
        }),
      subPlan: Yup.string().when("visitorApplication", {
        is: true,
        then: () => Yup.string().required("Visitor Sub Plan is required"),
        otherwise: () => Yup.string().nullable(),
      }),
      amount: Yup.string(),
      discount: Yup.string().when("visitorApplication", {
        is: true,
        then: () => Yup.string(),
        otherwise: () => Yup.string().nullable(),
      }),
      discountAmount: Yup.string().when("visitorApplication", {
        is: true,
        then: () => Yup.string(),
        otherwise: () => Yup.string().nullable(),
      }),
      payableAmount: Yup.string(),
      paidAmount: Yup.mixed()
        .transform((value) => {
          if (Array.isArray(value) && value.length > 0) {
            return value[0];
          }
          if (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
          ) {
            return value;
          }
          return { amount: "", date: "", bank: "", paymentMode: "" };
        })
        .when("visitorApplication", {
          is: true,
          then: () =>
            Yup.object().shape({
              amount: Yup.string().required("Receive Amount is required"),
              date: Yup.string().nullable(),
              bank: Yup.string().nullable(),
              paymentMode: Yup.string().required("Payment Mode is required"),
            }),
          otherwise: () => Yup.object().nullable(),
        }),
      dueAmount: Yup.string(),
      paymentType: Yup.string().when("visitorApplication", {
        is: true,
        then: () => Yup.string(),
        otherwise: () => Yup.string().nullable(),
      }),
      invoiceRemarks: Yup.string(),
    }),
  });

  const addNewExam = () => {
    const newExam = {
      examName: "",
      scores: {
        reading: "",
        writing: "",
        speaking: "",
        listening: "",
        total: "",
      },
    };
    convertToApplicationFormik.setFieldValue("coachingData.examDetails", [
      ...convertToApplicationFormik.values.coachingData.examDetails,
      newExam,
    ]);
  };

  const handlePaidAmountChange = (field, value, section) => {
    const currentPaidAmount =
      convertToApplicationFormik.values[section].paidAmount || {};
    convertToApplicationFormik.setFieldValue(`${section}.paidAmount`, {
      ...currentPaidAmount,
      [field]: value,
    });
  };

  // Add these functions for adding/removing entries
  const addVisitorEntry = () => {
    convertToApplicationFormik.setFieldValue("categoryDetails.entries", [
      ...convertToApplicationFormik.values.categoryDetails.entries,
      { country: "", date: "", document: null, remarks: "" },
    ]);
  };

  const removeVisitorEntry = (index) => {
    const newEntries = [
      ...convertToApplicationFormik.values.categoryDetails.entries,
    ];
    newEntries.splice(index, 1);
    convertToApplicationFormik.setFieldValue(
      "categoryDetails.entries",
      newEntries,
    );
  };

  const derivedBranchValue =
    userRole === "Branch"
      ? branchID
      : userType === "Branch User"
        ? branchUserId
        : null;

  const convertToApplicationFormik = useFormik({
    initialValues: {
      preferredCountry: "",
      email: "",
      admissionProcess: false,
      coachingData: {
        coachingRequired: false,
        city: "",
        startDate: "",
        endDate: "",
        registerFor: null,
        coachingRequirement: null,
        batchStatus: "",
        branch: userType === "Branch User" ? branchUserId : derivedBranchValue,
        batchFaculty: userRole === "Coaching Faculty" ? branchID : null,
        batchTiming: "",
        examRegistrationDate: "",
        targetedScore: "",
        hasGivenExam: false,
        examDetails: [
          {
            examName: "",
            coachingDoc: null,
            scores: {
              reading: "",
              writing: "",
              speaking: "",
              listening: "",
              total: "",
            },
          },
        ],
        remarks: "",
        subPlan: "",
        amount: "",
        discount: "",
        discountAmount: "",
        payableAmount: "",
        paidAmount: { amount: "", date: "", bank: "", paymentMode: "" },
        dueAmount: "",
        paymentType: "",
        invoiceRemarks: "",
      },
      admissionData: {
        subPlan: "",
        amount: "",
        discount: "",
        discountAmount: "",
        payableAmount: "",
        paidAmount: { amount: "", date: "", bank: "", paymentMode: "" },
        dueAmount: "",
        paymentType: "",
        invoiceRemarks: "",
      },
      visitorApplication: false,
      categoryDetails: {
        type: "",
        entries: [],
        subPlan: "",
        amount: "",
        discount: "",
        discountAmount: "",
        payableAmount: "",
        paidAmount: { amount: "", date: "", bank: "", paymentMode: "" },
        dueAmount: "",
        paymentType: "",
        invoiceRemarks: "",
      },
    },
    validationSchema: convertToApplicationSchema,
    onSubmit: async (values) => {
      if (
        !values.admissionProcess &&
        !values.coachingData.coachingRequired &&
        !values.visitorApplication
      ) {
        toast.error(
          "Please select at least one: Student Application, Coaching Required or Visitor Application",
        );
        return;
      }
      setIsLoading(true);

      const formData = new FormData();

      formData.append("preferredCountry", values.preferredCountry);
      formData.append("email", values.email);
      // formData.append("admissionProcess", values.admissionProcess);

      // Coaching Data
      formData.append(
        "coachingData[coachingRequired]",
        values.coachingData.coachingRequired,
      );
      formData.append("coachingData[city]", values.coachingData.city);
      formData.append("coachingData[startDate]", values.coachingData.startDate);
      formData.append("coachingData[endDate]", values.coachingData.endDate);
      formData.append(
        "coachingData[registerFor]",
        values.coachingData.registerFor || "",
      );
      formData.append(
        "coachingData[coachingRequirement]",
        values.coachingData.coachingRequirement || "",
      );
      formData.append("coachingData[branch]", values.coachingData.branch);
      formData.append(
        "coachingData[batchStatus]",
        values.coachingData.batchStatus,
      );
      formData.append(
        "coachingData[batchFaculty]",
        values.coachingData.batchFaculty || "",
      );
      formData.append(
        "coachingData[batchTiming]",
        values.coachingData.batchTiming,
      );
      formData.append(
        "coachingData[examRegistrationDate]",
        values.coachingData.examRegistrationDate,
      );
      formData.append(
        "coachingData[targetedScore]",
        values.coachingData.targetedScore,
      );
      formData.append(
        "coachingData[hasGivenExam]",
        values.coachingData.hasGivenExam,
      );
      formData.append(
        "coachingData[remarks]",
        values.coachingData.remarks || "",
      );

      const coachingMainPlan = mainPlans.find(
        (plan) => plan.name.toLowerCase() === "coaching",
      );
      formData.append(
        "coachingData[invoice][mainPlan]",
        coachingMainPlan?._id || "",
      );
      if (values.coachingData.subPlan) {
        formData.append(
          "coachingData[invoice][subPlan]",
          values.coachingData.subPlan,
        );
      }
      formData.append(
        "coachingData[invoice][amount]",
        values.coachingData.amount || "",
      );
      formData.append(
        "coachingData[invoice][discount]",
        values.coachingData.discount || "",
      );
      formData.append(
        "coachingData[invoice][discountAmount]",
        values.coachingData.discountAmount || "",
      );
      formData.append(
        "coachingData[invoice][payableAmount]",
        values.coachingData.payableAmount || "",
      );

      if (
        values.coachingData.paidAmount?.amount &&
        values.coachingData.paidAmount.amount.trim() !== ""
      ) {
        formData.append(
          `coachingData[invoice][paidAmount][0][amount]`,
          values.coachingData.paidAmount.amount || "",
        );
        formData.append(
          `coachingData[invoice][paidAmount][0][date]`,
          values.coachingData.paidAmount.date || new Date().toISOString(),
        );
        formData.append(
          `coachingData[invoice][paidAmount][0][bank]`,
          values.coachingData.paidAmount.bank || "",
        );
        formData.append(
          `coachingData[invoice][paidAmount][0][paymentMode]`,
          values.coachingData.paidAmount.paymentMode || "",
        );
      }

      formData.append(
        "coachingData[invoice][dueAmount]",
        values.coachingData.dueAmount || "",
      );
      formData.append(
        "coachingData[invoice][paymentType]",
        values.coachingData.paymentType || "",
      );

      if (values.coachingData.hasGivenExam && values.coachingData.examDetails) {
        values.coachingData.examDetails.forEach((exam, index) => {
          formData.append(
            `coachingData[examDetails][${index}][examName]`,
            exam.examName,
          );
          formData.append(
            `coachingData[examDetails][${index}][scores][reading]`,
            exam.scores.reading || "",
          );
          formData.append(
            `coachingData[examDetails][${index}][scores][writing]`,
            exam.scores.writing || "",
          );
          formData.append(
            `coachingData[examDetails][${index}][scores][speaking]`,
            exam.scores.speaking || "",
          );
          formData.append(
            `coachingData[examDetails][${index}][scores][listening]`,
            exam.scores.listening || "",
          );
          formData.append(
            `coachingData[examDetails][${index}][scores][total]`,
            exam.scores.total || "",
          );

          if (exam.scoreFile) {
            formData.append(`coachingDoc`, exam.scoreFile);
          }
        });
      }

      // Admission Data
      if (userRole === "B2B Admin") {
        formData.append("admissionProcess", values.admissionProcess);
      } else {
        formData.append("admissionProcess", values.admissionProcess);
        if (values.admissionProcess) {
          const admissionMainPlan = mainPlans.find(
            (plan) => plan.name.toLowerCase() === "student admission",
          );
          formData.append(
            "admissionData[invoice][mainPlan]",
            admissionMainPlan?._id || "",
          );
          if (values.admissionData.subPlan) {
            formData.append(
              "admissionData[invoice][subPlan]",
              values.admissionData.subPlan,
            );
          }
          formData.append(
            "admissionData[invoice][amount]",
            values.admissionData.amount || "",
          );
          formData.append(
            "admissionData[invoice][discount]",
            values.admissionData.discount || "",
          );
          formData.append(
            "admissionData[invoice][discountAmount]",
            values.admissionData.discountAmount || "",
          );
          formData.append(
            "admissionData[invoice][payableAmount]",
            values.admissionData.payableAmount || "",
          );
          if (
            values.admissionData.paidAmount?.amount &&
            values.admissionData.paidAmount.amount.trim() !== ""
          ) {
            formData.append(
              `admissionData[invoice][paidAmount][0][amount]`,
              values.admissionData.paidAmount.amount || "",
            );
            formData.append(
              `admissionData[invoice][paidAmount][0][date]`,
              values.admissionData.paidAmount.date || new Date().toISOString(),
            );
            formData.append(
              `admissionData[invoice][paidAmount][0][bank]`,
              values.admissionData.paidAmount.bank || "",
            );
            formData.append(
              `admissionData[invoice][paidAmount][0][paymentMode]`,
              values.admissionData.paidAmount.paymentMode || "",
            );
          }
          formData.append(
            "admissionData[invoice][dueAmount]",
            values.admissionData.dueAmount || "",
          );
          formData.append(
            "admissionData[invoice][paymentType]",
            values.admissionData.paymentType || "",
          );
        }
      }

      // Visitor Data
      if (userRole === "B2B Admin") {
        formData.append("visitorApplication", values.visitorApplication);
      } else {
        formData.append("visitorApplication", values.visitorApplication);
        if (values.visitorApplication) {
          const { type, entries } = values.categoryDetails;

          if (type === "Fresh") {
            formData.append("categoryDetails[0][type]", "Fresh");
          } else if (type === "Renewal" || type === "Refusal") {
            entries.forEach((entry, index) => {
              formData.append(`categoryDetails[${index}][type]`, type);
              formData.append(
                `categoryDetails[${index}][country]`,
                entry.country || "",
              );
              formData.append(
                `categoryDetails[${index}][date]`,
                entry.date ? toISODate(parseDate(entry.date)) : "",
              );
              formData.append(
                `categoryDetails[${index}][remarks]`,
                entry.remarks || "",
              );
              if (entry.document) {
                formData.append("categoryDoc", entry.document);
              }
            });
          }

          const processedPaidAmount =
            values.categoryDetails.paidAmount?.amount &&
            values.categoryDetails.paidAmount.amount.trim() !== ""
              ? [
                  {
                    ...values.categoryDetails.paidAmount,
                    bank: values.categoryDetails.paidAmount.bank || "",
                    date:
                      values.categoryDetails.paidAmount.date ||
                      new Date().toISOString().split("T")[0],
                    paymentMode:
                      values.categoryDetails.paidAmount.paymentMode || "",
                  },
                ]
              : [];

          const visitorInvoiceData = {
            mainPlan:
              mainPlans.find((plan) => plan.name.toLowerCase() === "visitor")
                ?._id || "",
            subPlan: values.categoryDetails.subPlan || null,
            amount: values.categoryDetails.amount || "",
            discount: values.categoryDetails.discount || "",
            discountAmount: values.categoryDetails.discountAmount || "",
            payableAmount: values.categoryDetails.payableAmount || "",
            dueAmount: values.categoryDetails.dueAmount || "",
            paidAmount: processedPaidAmount,
            paymentType: values.categoryDetails.paymentType || "",
            remarks: values.categoryDetails.remarks || "",
          };
          formData.append("visitorInvoice", JSON.stringify(visitorInvoiceData));
        }
      }

      try {
        const convertResponse = await dispatch(
          convertToApplication(selectedLead?._id, formData),
        );
        if (convertResponse?.status === 200) {
          toast.success("Lead converted successfully");
          const statusRes = await dispatch(getAllLeadStatus());
          const statusList = statusRes?.data?.data || [];
          const convertedStatus = statusList.find(
            (status) => status?.name?.toLowerCase() === "converted",
          );
          if (!convertedStatus) {
            const createStatusRes = await dispatch(
              createLeadStatus({ name: "Converted" }),
            );
            if (createStatusRes?.status === 200) {
              toast.success("Converted status created");
            }
          } else {
            const updateStatusRes = await dispatch(
              updateLeadStatus({ name: "Converted" }, convertedStatus?._id),
            );
            if (updateStatusRes?.status === 200) {
              toast.success("Converted status updated");
            }
          }
          const updatedLeadData = {
            ...selectedLead,
            ...(isB2B
              ? { b2b_lead_status: "Converted" }
              : { lead_status: "Converted" }),
            country_interested: Array.isArray(selectedLead.country_interested)
              ? selectedLead.country_interested
              : [selectedLead.country_interested],
          };
          const updateResponse = await dispatch(
            updateLead(selectedLead?._id, updatedLeadData),
          );
          if (updateResponse?.status === 200) {
            if (convertPage === "allleads") {
              const payload = {
                page: currentPage || 1,
                limit: itemsPerPage,
                searchOnField: selectedFilter.value,
                search: searchTerm,
                status: filters.status,
                subStatus: filters.subStatus,
                assignId: filters.assignId,
                lead_from: filters.lead_from,
                startdate: filters.startDate,
                enddate: filters.endDate,
                branchId: filters.branchId,
                showAll: filters.showAll,
                leadActivity: filters.leadActivity,
                country: filters.country,
                followUpType: filters.followUpType,
                assignRole: filters.assignRole || "",
                updatedOn: filters.updatedOn,
              };
              if (canRead) {
                dispatch(getLead(payload)).then((res) => {
                  setGetLeadData(res?.data);
                  setTotalPages(res?.data?.totalPages || 0);
                  setTotalRecords(res?.data?.totalLeads || 0);
                });
              }
            } else if (convertPage === "allocatedleads") {
              const payload = {
                page: currentPage || 1,
                limit: itemsPerPage,
                search: searchTerm,
                startdate: filters.startDate,
                enddate: filters.endDate,
                status: filters.status,
                lead_from: filters.lead_from,
                userId: userId,
                leadActivity: filters.leadActivity,
                country: filters.country,
                followUpType: filters.followUpType,

                branchId: filters.branchId,
                showAll: filters.showAll,
                assignRole: filters.assignRole,
                assignId: filters.assignId,
              };

              if (canRead) {
                dispatch(getLeadByAssignUserId(payload)).then((res) => {
                  setGetLeadData(res?.data);
                  setTotalPages(res?.data?.totalPages || 0);
                  setTotalRecords(res?.data?.totalLeads || 0);
                });
              }
            } else if (convertPage === "todayFollowup") {
              if (canRead) {
                fetALlLeadDataByDate(
                  currentPage,
                  itemsPerPage,
                  search,
                  filters.date,
                  filters.country,
                  filters.followUpType,
                  filters.status,
                  filters.lead_from,
                  filters.branchId,
                  filters.showAll,
                  filters.assignRole,
                  filters.assignId,
                  filters.leadActivity,
                );
              }
            } else if (convertPage === "allfollowup") {
              if (canRead) {
                fetchAllFollowupLeads(
                  currentPage,
                  itemsPerPage,
                  search,
                  filters.country,
                  filters.followUpType,
                  filters.status,
                  filters.lead_from,
                  filters.leadActivity,
                  filters.startDate,
                  filters.endDate,
                  filters.branchId,
                  filters.showAll,
                  filters.assignRole,
                  filters.assignId,
                );
              }
            } else if (convertPage === "todaysbirthdayleads") {
              if (canRead) {
                fetchTodaysBirthdayLeads(
                  currentPage,
                  itemsPerPage,
                  search,
                  filters.date,
                );
              }
            } else {
              const payload = {
                page: currentPage || 1,
                limit: itemsPerPage,
                search: searchTerm,
                status: filters.status,
                assignId: filters.assignId,
                lead_from: filters.lead_from,
                startDate: filters.startDate,
                endDate: filters.endDate,
                leadActivity: filters.leadActivity,
                country: filters.country,
                followUpType: filters.followUpType,
              };

              if (canRead) {
                dispatch(getB2BLead(payload))
                  .then((res) => {
                    setGetLeadData(res?.data?.data);
                    setTotalPages(res?.data?.data?.totalPages || 0);
                    setTotalRecords(res?.data?.data?.totalRecords || 0);
                  })
                  .catch((error) => {
                    console.error("Error fetching leads:", error);
                    toast.error("Failed to fetch leads");
                  });
              }
            }
          } else {
            toast.error("Failed to update lead status");
          }
          fetchLeadStatus();
          setOpenModal(false);
        } else {
          toast.error(
            convertResponse?.data?.message || "Failed to convert lead",
          );
        }
      } catch (error) {
        console.error("Error in convert to application:", error);
        toast.error(error?.response?.data?.message || "Something went wrong 3");
      } finally {
        setIsLoading(false);
      }
    },
  });
  useEffect(() => {
    if (selectedLead?.email) {
      convertToApplicationFormik.setFieldValue("email", selectedLead.email);
    }
  }, [selectedLead, openModal]);

  const handleCheckboxChange = async (mainPlanId, isChecked) => {
    // Only fetch sub-plans if the checkbox is checked
    if (!isChecked) {
      return;
    }

    const coachingPlan = mainPlans.find(
      (plan) => plan.name.toLowerCase() === mainPlanId,
    );
    const studentAdmissionPlan = mainPlans.find(
      (plan) => plan.name.toLowerCase() === mainPlanId,
    );
    const visitorPlan = mainPlans.find(
      (plan) => plan.name.toLowerCase() === mainPlanId,
    );

    const preferredCountryValue =
      convertToApplicationFormik.values.preferredCountry;

    try {
      if (mainPlanId === "coaching") {
        // Only fetch if not already loaded
        if (coachingSubPlans.length === 0) {
          const subPlansData = await fetchSubPlans(
            1,
            itemsPerPage,
            "",
            coachingPlan._id,
            "",
          );
          setCoachingSubPlans(subPlansData);
        }
        convertToApplicationFormik.setFieldValue("coachingData.subPlan", "");
        convertToApplicationFormik.setFieldValue("coachingData.amount", "");
      } else if (mainPlanId === "student admission") {
        // Only fetch if not already loaded
        if (admissionSubPlans.length === 0) {
          const subPlansData = await fetchSubPlans(
            1,
            itemsPerPage,
            "",
            studentAdmissionPlan._id,
            preferredCountryValue,
          );
          setAdmissionSubPlans(subPlansData);
        }
        convertToApplicationFormik.setFieldValue("admissionData.subPlan", "");
        convertToApplicationFormik.setFieldValue("admissionData.amount", "");
      } else if (mainPlanId === "visitor") {
        // Only fetch if not already loaded
        if (visitorSubPlans.length === 0) {
          const subPlansData = await fetchSubPlans(
            1,
            itemsPerPage,
            "",
            visitorPlan._id,
            preferredCountryValue,
          );
          setVisitorSubPlans(subPlansData);
        }
        convertToApplicationFormik.setFieldValue("categoryDetails.subPlan", "");
        convertToApplicationFormik.setFieldValue("categoryDetails.amount", "");
      }
    } catch (error) {
      console.error("Error fetching sub-plans:", error);
      toast.error("Failed to fetch sub-plans.");
    }
  };

  useEffect(() => {
    const refetchSubPlans = async () => {
      const preferredCountryValue =
        convertToApplicationFormik.values.preferredCountry;

      if (convertToApplicationFormik.values.coachingData.coachingRequired) {
        const coachingPlan = mainPlans.find(
          (plan) => plan.name.toLowerCase() === "coaching",
        );
        if (coachingPlan) {
          const subPlansData = await fetchSubPlans(
            1,
            itemsPerPage,
            "",
            coachingPlan._id,
            "",
          );
          setCoachingSubPlans(subPlansData);
          convertToApplicationFormik.setFieldValue("coachingData.subPlan", "");
          convertToApplicationFormik.setFieldValue("coachingData.amount", "");
        }
      }

      if (convertToApplicationFormik.values.admissionProcess) {
        const studentAdmissionPlan = mainPlans.find(
          (plan) => plan.name.toLowerCase() === "student admission",
        );
        if (studentAdmissionPlan) {
          const subPlansData = await fetchSubPlans(
            1,
            itemsPerPage,
            "",
            studentAdmissionPlan._id,
            preferredCountryValue,
          );
          setAdmissionSubPlans(subPlansData);
          convertToApplicationFormik.setFieldValue("admissionData.subPlan", "");
          convertToApplicationFormik.setFieldValue("admissionData.amount", "");
        }
      }

      if (convertToApplicationFormik.values.visitorApplication) {
        const visitorPlan = mainPlans.find(
          (plan) => plan.name.toLowerCase() === "visitor",
        );
        if (visitorPlan) {
          const subPlansData = await fetchSubPlans(
            1,
            itemsPerPage,
            "",
            visitorPlan._id,
            preferredCountryValue,
          );
          setVisitorSubPlans(subPlansData);
          convertToApplicationFormik.setFieldValue(
            "categoryDetails.subPlan",
            "",
          );
          convertToApplicationFormik.setFieldValue(
            "categoryDetails.amount",
            "",
          );
        }
      }
    };

    refetchSubPlans();
  }, [convertToApplicationFormik.values.preferredCountry]);

  const [coachingSubPlan, setCoachingSubPlan] = useState("");
  const [admissionSubPlan, setAdmissionSubPlan] = useState("");
  const [visitorSubPlan, setVisitorSubPlan] = useState("");
  const [isLoadingSubPlan, setIsLoadingSubPlan] = useState(false);

  useEffect(() => {
    const setAmountForSection = async (subPlanId, section) => {
      if (!subPlanId || isLoadingSubPlan) return;
      setIsLoadingSubPlan(true);
      try {
        const subPlan = await dispatch(getOneSubPlan(subPlanId));
        const totalAmount = subPlan?.data?.data?.totalAmount || "";
        convertToApplicationFormik.setFieldValue(
          `${section}.amount`,
          totalAmount.toString(),
        );
      } catch (error) {
        console.error(`Error fetching sub-plan for ${section}:`, error);
        toast.error(`Failed to fetch sub-plan details for ${section}.`);
      } finally {
        setIsLoadingSubPlan(false);
      }
    };

    if (
      convertToApplicationFormik.values.coachingData.subPlan !== coachingSubPlan
    ) {
      setCoachingSubPlan(
        convertToApplicationFormik.values.coachingData.subPlan,
      );
      if (convertToApplicationFormik.values.coachingData.subPlan) {
        setAmountForSection(
          convertToApplicationFormik.values.coachingData.subPlan,
          "coachingData",
        );
      }
    }

    if (
      convertToApplicationFormik.values.admissionData?.subPlan !==
      admissionSubPlan
    ) {
      setAdmissionSubPlan(
        convertToApplicationFormik.values.admissionData?.subPlan,
      );
      if (convertToApplicationFormik.values.admissionData?.subPlan) {
        setAmountForSection(
          convertToApplicationFormik.values.admissionData.subPlan,
          "admissionData",
        );
      }
    }

    if (
      convertToApplicationFormik.values.categoryDetails.subPlan !==
      visitorSubPlan
    ) {
      setVisitorSubPlan(
        convertToApplicationFormik.values.categoryDetails.subPlan,
      );
      if (convertToApplicationFormik.values.categoryDetails.subPlan) {
        setAmountForSection(
          convertToApplicationFormik.values.categoryDetails.subPlan,
          "categoryDetails",
        );
      }
    }
  }, [
    convertToApplicationFormik.values.coachingData?.subPlan,
    convertToApplicationFormik.values.admissionData?.subPlan,
    convertToApplicationFormik.values.categoryDetails?.subPlan,
    coachingSubPlan,
    admissionSubPlan,
    visitorSubPlan,
    isLoadingSubPlan,
  ]);

  const calculateAmounts = useCallback(
    (section) => {
      const values = convertToApplicationFormik.values[section];
      const amount = parseFloat(values.amount) || 0;

      let discountFromDiscountField = 0;

      if (values.discount) {
        const percent = parseFloat(values.discount) || 0;
        // Always treat entered value as a percentage
        discountFromDiscountField = (amount * percent) / 100;
      }

      // -------- Direct Discount Amount field ----------
      const discountFromDiscountAmount = parseFloat(values.discountAmount) || 0;

      // -------- Total Discount ----------
      const totalDiscount =
        discountFromDiscountField + discountFromDiscountAmount;

      // -------- Payable Amount ----------
      const payableAmount = amount - totalDiscount;

      // -------- Total Paid ----------
      const totalPaid = parseFloat(values.paidAmount?.amount) || 0;

      // -------- Due Amount ----------
      const dueAmount = Math.max(0, payableAmount - totalPaid);

      // -------- Update Formik --------
      convertToApplicationFormik.setFieldValue(
        `${section}.payableAmount`,
        Math.max(0, payableAmount).toFixed(2),
      );
      convertToApplicationFormik.setFieldValue(
        `${section}.dueAmount`,
        dueAmount.toFixed(2),
      );
    },
    [convertToApplicationFormik],
  );

  // Debounced calculation effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (convertToApplicationFormik.values.coachingData.coachingRequired) {
        calculateAmounts("coachingData");
      }
      if (convertToApplicationFormik.values.admissionProcess) {
        calculateAmounts("admissionData");
      }
      if (convertToApplicationFormik.values.visitorApplication) {
        calculateAmounts("categoryDetails");
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    convertToApplicationFormik.values.coachingData.amount,
    convertToApplicationFormik.values.coachingData.discount,
    convertToApplicationFormik.values.coachingData.discountAmount, // ✅ add
    convertToApplicationFormik.values.coachingData.paidAmount,
    convertToApplicationFormik.values.admissionData?.amount,
    convertToApplicationFormik.values.admissionData?.discount,
    convertToApplicationFormik.values.admissionData?.discountAmount, // ✅ add
    convertToApplicationFormik.values.admissionData?.paidAmount,
    convertToApplicationFormik.values.categoryDetails.amount,
    convertToApplicationFormik.values.categoryDetails.discount,
    convertToApplicationFormik.values.categoryDetails.discountAmount, // ✅ add
    convertToApplicationFormik.values.categoryDetails.paidAmount,
  ]);

  useEffect(() => {
    const fetchBankingDetails = async () => {
      try {
        const res = await dispatch(getAllBankingDetails(1, 1000, ""));
        const responseData = res?.data?.data?.data || [];
        setBankingDetails(responseData);
      } catch (error) {
        console.error("Error fetching banking details:", error);
        setBankingDetails([]);
      }
    };

    fetchBankingDetails();
  }, [dispatch]);

  // Create bank options for dropdown
  const bankOptions = bankingDetails.map((bank) => ({
    label: bank.bankName,
    value: bank._id,
  }));

  const studentRegisterForOptions = allStudentRegisterFor?.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const coachingRequirementsOptions = allCoachingRequirements?.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const hasClientLanguage = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  const batchStatusOptions = [
    { value: "Online", label: "Online" },
    { value: "Offline", label: "Offline" },
  ];

  const coachingFacultiesOptions = coachingFaculties?.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const batchTimesOptions = batchTimes?.map((item) => ({
    value: item,
    label: item,
  }));

  const visitorProcessOptions = [
    { value: "Fresh", label: "Fresh" },
    { value: "Renewal", label: "Renewal" },
    { value: "Refusal", label: "Refusal" },
  ];

  const paymentTypeOptions = [
    { label: "Full", value: "Full" },
    { label: "Half", value: "Half" },
  ];

  const paymentModeOptions = [
    { label: "GPay", value: "GPay" },
    { label: "Bank", value: "Bank" },
    { label: "Cash", value: "Cash" },
    { label: "UPI", value: "UPI" },
  ];

  return (
    <>
      {openModal && (
        <Modal
          show={openModal}
          onHide={() => {
            setOpenModal(false);
            convertToApplicationFormik.resetForm();
          }}
          size="lg"
          style={{ maxHeight: "95vh", overflowY: "auto" }}
        >
          <Modal.Header className="form-main-heading">
            <Modal.Title>Convert to Application</Modal.Title>
            <AiOutlineClose
              size={20}
              style={{ cursor: "pointer", color: "white" }}
              onClick={() => {
                setOpenModal(false);
                convertToApplicationFormik.resetForm();
              }}
            />
          </Modal.Header>
          <Modal.Body
            style={{
              maxHeight: "70vh",
              overflowY: "auto",
              padding: "1rem",
            }}
          >
            <Form onSubmit={convertToApplicationFormik.handleSubmit}>
              <Form.Group controlId="preferredCountry" className="mb-3">
                <Form.Label>Preferred Country *</Form.Label>
                <Select
                  className="custom-select-height"
                  options={preferredCountries?.map((c) => ({
                    value: c.name,
                    label: c.name,
                  }))}
                  onChange={(selectedOption) =>
                    convertToApplicationFormik.setFieldValue(
                      "preferredCountry",
                      selectedOption?.value || "",
                    )
                  }
                  value={preferredCountries
                    ?.map((c) => ({ value: c.name, label: c.name }))
                    .find(
                      (option) =>
                        option.value ===
                        convertToApplicationFormik.values.preferredCountry,
                    )}
                  placeholder="Select Country"
                  isClearable
                  isSearchable
                  classNamePrefix="custom-select"
                  noOptionsMessage={() => "No countries available"}
                  styles={selectStyles}
                />
                {convertToApplicationFormik.touched.preferredCountry &&
                  convertToApplicationFormik.errors.preferredCountry && (
                    <Form.Text className="text-danger">
                      {convertToApplicationFormik.errors.preferredCountry}
                    </Form.Text>
                  )}
              </Form.Group>

              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  className="custom-select-height"
                  placeholder="Enter Email"
                  name="email"
                  value={convertToApplicationFormik.values.email}
                  onChange={convertToApplicationFormik.handleChange}
                  onBlur={convertToApplicationFormik.handleBlur}
                />
                {convertToApplicationFormik.touched.email &&
                  convertToApplicationFormik.errors.email && (
                    <Form.Text className="text-danger">
                      {convertToApplicationFormik.errors.email}
                    </Form.Text>
                  )}
              </Form.Group>

              <Row>
                <Col md={4}>
                  <Form.Group controlId="coachingCheckbox" className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Coaching Require or Not"
                      className="custom-checkbox"
                      checked={
                        convertToApplicationFormik.values.coachingData
                          .coachingRequired
                      }
                      onChange={async (e) => {
                        convertToApplicationFormik.setFieldValue(
                          "coachingData.coachingRequired",
                          e.target.checked,
                        );
                        await handleCheckboxChange(
                          "coaching",
                          e.target.checked,
                        );
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group
                    controlId="admissionProcessCheckbox"
                    className="mb-3"
                  >
                    <Form.Check
                      type="checkbox"
                      label="Student Application"
                      className="custom-checkbox"
                      checked={
                        convertToApplicationFormik.values.admissionProcess
                      }
                      onChange={async (e) => {
                        convertToApplicationFormik.setFieldValue(
                          "admissionProcess",
                          e.target.checked,
                        );
                        handleCheckboxChange(
                          "student admission",
                          e.target.checked,
                        );
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group
                    controlId="visitorapplicationCheckbox"
                    className="mb-3"
                  >
                    <Form.Check
                      type="checkbox"
                      label="Visitor Application"
                      className="custom-checkbox"
                      checked={
                        convertToApplicationFormik.values.visitorApplication
                      }
                      onChange={async (e) => {
                        convertToApplicationFormik.setFieldValue(
                          "visitorApplication",
                          e.target.checked,
                        );
                        handleCheckboxChange("visitor", e.target.checked);
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {convertToApplicationFormik.values.coachingData
                .coachingRequired && (
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="coachingData.city" className="mb-3">
                      <Form.Label>Student Resident City</Form.Label>
                      <Form.Control
                        type="text"
                        name="coachingData.city"
                        value={
                          convertToApplicationFormik.values.coachingData.city
                        }
                        onChange={convertToApplicationFormik.handleChange}
                        className="custom-select-height"
                        placeholder="Enter Resident City"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group
                      controlId="coachingData.startDate"
                      className="mb-3"
                    >
                      <Form.Label>Coaching Start Date</Form.Label>
                      <div style={{ position: "relative" }}>
                        <Form.Control
                          type="text"
                          placeholder="dd/mm/yyyy"
                          className="custom-select-height"
                          value={
                            convertToApplicationFormik.values.coachingData
                              .startDate
                              ? formatDate(
                                  parseDate(
                                    convertToApplicationFormik.values
                                      .coachingData.startDate,
                                  ),
                                )
                              : ""
                          }
                          readOnly
                          ref={coachingStartDateInputRef}
                          onClick={() =>
                            setShowCoachingStartDateCalendar(
                              !showCoachingStartDateCalendar,
                            )
                          }
                          style={{ cursor: "pointer" }}
                        />
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
                        {showCoachingStartDateCalendar && (
                          <div
                            ref={coachingStartDateCalenderRef}
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: "0",
                              zIndex: 9999,
                              background: "#fff",
                              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                              borderRadius: "8px",
                              marginTop: "10px",
                              marginBottom: "100px",
                              width: 300,
                              minWidth: 300,
                              maxWidth: 300,
                            }}
                          >
                            <Calendar
                              className="form-control m-0 p-0 border-0"
                              onChange={(selectedDate) => {
                                convertToApplicationFormik.setFieldValue(
                                  "coachingData.startDate",
                                  toISODate(selectedDate),
                                );
                                setShowCoachingStartDateCalendar(false);
                              }}
                              value={
                                convertToApplicationFormik.values.coachingData
                                  .startDate
                                  ? parseDate(
                                      convertToApplicationFormik.values
                                        .coachingData.startDate,
                                    )
                                  : new Date()
                              }
                              locale="en-GB"
                            />
                          </div>
                        )}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group
                      controlId="coachingData.endDate"
                      className="mb-3"
                    >
                      <Form.Label>Coaching End Date</Form.Label>
                      <div style={{ position: "relative" }}>
                        <Form.Control
                          type="text"
                          placeholder="dd/mm/yyyy"
                          className="custom-select-height"
                          value={
                            convertToApplicationFormik.values.coachingData
                              .endDate
                              ? formatDate(
                                  parseDate(
                                    convertToApplicationFormik.values
                                      .coachingData.endDate,
                                  ),
                                )
                              : ""
                          }
                          readOnly
                          ref={coachingEndDateInputRef}
                          onClick={() =>
                            setShowCoachingEndDateCalendar(
                              !showCoachingEndDateCalendar,
                            )
                          }
                          style={{ cursor: "pointer" }}
                        />
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
                        {showCoachingEndDateCalendar && (
                          <div
                            ref={coachingEndDateCalenderRef}
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: "0",
                              zIndex: 9999,
                              background: "#fff",
                              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                              borderRadius: "8px",
                              marginTop: "10px",
                              marginBottom: "100px",
                              width: 300,
                              minWidth: 300,
                              maxWidth: 300,
                            }}
                          >
                            <Calendar
                              className="form-control m-0 p-0 border-0"
                              onChange={(selectedDate) => {
                                convertToApplicationFormik.setFieldValue(
                                  "coachingData.endDate",
                                  toISODate(selectedDate),
                                );
                                setShowCoachingEndDateCalendar(false);
                              }}
                              value={
                                convertToApplicationFormik.values.coachingData
                                  .endDate
                                  ? parseDate(
                                      convertToApplicationFormik.values
                                        .coachingData.endDate,
                                    )
                                  : new Date()
                              }
                              locale="en-GB"
                            />
                          </div>
                        )}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group
                      controlId="coachingData.registerFor"
                      className="mb-3"
                    >
                      <Form.Label>Student Register For</Form.Label>
                      <Select
                        options={studentRegisterForOptions}
                        onChange={(selectedOption) =>
                          convertToApplicationFormik.setFieldValue(
                            "coachingData.registerFor",
                            selectedOption?.value || "",
                          )
                        }
                        value={studentRegisterForOptions.find(
                          (option) =>
                            option.value ===
                            convertToApplicationFormik.values.coachingData
                              .registerFor,
                        )}
                        classNamePrefix="custom-select"
                        placeholder="Select Register For"
                        isClearable
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group
                      controlId="coachingData.coachingRequirement"
                      className="mb-3"
                    >
                      <Form.Label>Coaching Requirement</Form.Label>
                      <Select
                        options={coachingRequirementsOptions}
                        onChange={(selectedOption) =>
                          convertToApplicationFormik.setFieldValue(
                            "coachingData.coachingRequirement",
                            selectedOption?.value || "",
                          )
                        }
                        value={coachingRequirementsOptions.find(
                          (option) =>
                            option.value ===
                            convertToApplicationFormik.values.coachingData
                              .coachingRequirement,
                        )}
                        classNamePrefix="custom-select"
                        placeholder="Select Requirement"
                        isClearable
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group
                      controlId="coachingData.batchStatus"
                      className="mb-3"
                    >
                      <Form.Label>Coaching Batches Status</Form.Label>
                      <Select
                        options={batchStatusOptions}
                        onChange={(selectedOption) => {
                          convertToApplicationFormik.setFieldValue(
                            "coachingData.batchStatus",
                            selectedOption?.value || "",
                          );

                          // ✅ current selected branch from formik
                          const branchValue =
                            convertToApplicationFormik.values.coachingData
                              .branch || "";
                          fetchCoachingFaculties(
                            selectedOption?.value || "",
                            branchValue,
                          );
                          fetchBatchTimes(
                            convertToApplicationFormik.values.coachingData
                              .batchFaculty || "",
                            selectedOption?.value || "",
                          );
                        }}
                        value={batchStatusOptions.find(
                          (option) =>
                            option.value ===
                            convertToApplicationFormik.values.coachingData
                              .batchStatus,
                        )}
                        classNamePrefix="custom-select"
                        placeholder="Select Batches Status"
                        isClearable
                      />
                    </Form.Group>
                  </Col>
                  {userRole === "Super Admin" && (
                    <Col md={6}>
                      <Form.Group controlId="branchSelection" className="mb-3">
                        <Form.Label>Branch</Form.Label>
                        <Select
                          options={[
                            // { value: "All", label: "All" },
                            { value: "HeadOffice", label: "Head Office" },
                            ...branchList.map((branch) => ({
                              value: branch._id,
                              label: branch.branchName || branch.name,
                            })),
                          ]}
                          onChange={(selectedOption) => {
                            setSelectedBranch(selectedOption);

                            const branchValue =
                              selectedOption?.value === "HeadOffice"
                                ? null
                                : selectedOption?.value;

                            convertToApplicationFormik.setFieldValue(
                              "coachingData.branch",
                              branchValue,
                            );

                            fetchCoachingFaculties(
                              convertToApplicationFormik.values.coachingData
                                .batchStatus || "",
                              branchValue || "",
                            );
                          }}
                          value={
                            convertToApplicationFormik.values.coachingData
                              .branch === null
                              ? branchOptions.find(
                                  (opt) => opt.value === "HeadOffice",
                                )
                              : branchOptions.find(
                                  (opt) =>
                                    opt.value ===
                                    convertToApplicationFormik.values
                                      .coachingData.branch,
                                )
                          }
                          classNamePrefix="custom-select"
                          placeholder="Select Branch"
                          isClearable={false}
                        />
                      </Form.Group>
                    </Col>
                  )}
                  {userRole !== "Coaching Faculty" && (
                    <Col md={6}>
                      <Form.Group
                        controlId="coachingData.batchFaculty"
                        className="mb-3"
                      >
                        <Form.Label>Batch Faculty</Form.Label>
                        <Select
                          options={coachingFacultiesOptions}
                          onChange={(selectedOption) => {
                            convertToApplicationFormik.setFieldValue(
                              "coachingData.batchFaculty",
                              selectedOption?.value || "",
                            );
                            fetchBatchTimes(
                              selectedOption?.value || "",
                              convertToApplicationFormik.values.coachingData
                                .batchStatus || "",
                            );
                          }}
                          value={coachingFacultiesOptions.find(
                            (option) =>
                              option.value ===
                              convertToApplicationFormik.values.coachingData
                                .batchFaculty,
                          )}
                          classNamePrefix="custom-select"
                          placeholder="Select Faculty"
                          isClearable
                        />
                      </Form.Group>
                    </Col>
                  )}

                  <Col md={6}>
                    <Form.Group
                      controlId="coachingData.batchTiming"
                      className="mb-3"
                    >
                      <Form.Label>Batch Timing</Form.Label>
                      <Select
                        options={batchTimesOptions}
                        onChange={(selectedOption) =>
                          convertToApplicationFormik.setFieldValue(
                            "coachingData.batchTiming",
                            selectedOption?.value || "",
                          )
                        }
                        value={batchTimesOptions?.find(
                          (option) =>
                            option.value ===
                            convertToApplicationFormik.values.coachingData
                              .batchTiming,
                        )}
                        classNamePrefix="custom-select"
                        placeholder="Select Timing"
                        isClearable
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group
                      controlId="coachingData.examRegistrationDate"
                      className="mb-3"
                    >
                      <Form.Label>Exam Date</Form.Label>
                      <div style={{ position: "relative" }}>
                        <Form.Control
                          type="text"
                          placeholder="dd/mm/yyyy"
                          className="custom-select-height"
                          value={
                            convertToApplicationFormik.values.coachingData
                              .examRegistrationDate
                              ? formatDate(
                                  parseDate(
                                    convertToApplicationFormik.values
                                      .coachingData.examRegistrationDate,
                                  ),
                                )
                              : ""
                          }
                          readOnly
                          ref={examDateInputRef}
                          onClick={() =>
                            setShowExamDateCalendar(!showExamDateCalendar)
                          }
                          style={{ cursor: "pointer" }}
                        />
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
                        {showExamDateCalendar && (
                          <div
                            ref={examDateCalenderRef}
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: "0",
                              zIndex: 9999,
                              background: "#fff",
                              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                              borderRadius: "8px",
                              marginTop: "10px",
                              marginBottom: "100px",
                              width: 300,
                              minWidth: 300,
                              maxWidth: 300,
                            }}
                          >
                            <Calendar
                              className="form-control m-0 p-0 border-0"
                              onChange={(selectedDate) => {
                                convertToApplicationFormik.setFieldValue(
                                  "coachingData.examRegistrationDate",
                                  toISODate(selectedDate),
                                );
                                setShowExamDateCalendar(false);
                              }}
                              value={
                                convertToApplicationFormik.values.coachingData
                                  .examRegistrationDate
                                  ? parseDate(
                                      convertToApplicationFormik.values
                                        .coachingData.examRegistrationDate,
                                    )
                                  : new Date()
                              }
                              locale="en-GB"
                            />
                          </div>
                        )}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group
                      controlId="coachingData.remarks"
                      className="mb-3"
                    >
                      <Form.Label>Counsellor Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="coachingData.remarks"
                        value={
                          convertToApplicationFormik.values.coachingData.remarks
                        }
                        onChange={convertToApplicationFormik.handleChange}
                        className="rounded-4"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group
                      controlId="coachingData.targetedScore"
                      className="mb-3"
                    >
                      <Form.Label>Targeted Score</Form.Label>
                      <Form.Control
                        type="number"
                        name="coachingData.targetedScore"
                        className="custom-select-height"
                        value={
                          convertToApplicationFormik.values.coachingData
                            .targetedScore
                        }
                        onChange={convertToApplicationFormik.handleChange}
                        onBlur={convertToApplicationFormik.handleBlur}
                        placeholder="Enter Targeted Score"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group
                      controlId="coachingData.hasGivenExam"
                      className="mb-4"
                    >
                      <Form.Label>
                        Has Client Given any Language Exam
                      </Form.Label>
                      <Select
                        options={hasClientLanguage}
                        onChange={(selectedOption) =>
                          convertToApplicationFormik.setFieldValue(
                            "coachingData.hasGivenExam",
                            selectedOption?.value === true,
                          )
                        }
                        value={hasClientLanguage.find(
                          (option) =>
                            option.value ===
                            (convertToApplicationFormik.values.coachingData
                              .hasGivenExam
                              ? true
                              : false),
                        )}
                        classNamePrefix="custom-select"
                        placeholder="Select Language Exam"
                        isClearable
                      />
                    </Form.Group>
                  </Col>

                  {convertToApplicationFormik.values.coachingData
                    .hasGivenExam && (
                    <>
                      {convertToApplicationFormik.values.coachingData.examDetails.map(
                        (exam, index) => (
                          <div key={index} className="mb-3">
                            <Row>
                              <Col md={12} className="mb-2">
                                <div
                                  className="bg-light px-3 py-2 rounded-5"
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "500",
                                  }}
                                >
                                  Exam {index + 1}
                                </div>
                              </Col>
                            </Row>
                            <Row className="px-3">
                              <Col md={6}>
                                <Form.Group
                                  controlId={`coachingData.examDetails[${index}].examName`}
                                  className=""
                                >
                                  <Form.Label>Exam Name</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name={`coachingData.examDetails[${index}].examName`}
                                    value={
                                      convertToApplicationFormik.values
                                        .coachingData.examDetails[index]
                                        .examName
                                    }
                                    onChange={
                                      convertToApplicationFormik.handleChange
                                    }
                                    onBlur={
                                      convertToApplicationFormik.handleBlur
                                    }
                                    className="custom-select-height"
                                    placeholder="Enter Exam Name"
                                  />
                                  {convertToApplicationFormik.touched
                                    .coachingData?.examDetails?.[index]
                                    ?.examName &&
                                    convertToApplicationFormik.errors
                                      .coachingData?.examDetails?.[index]
                                      ?.examName && (
                                      <div className="text-danger">
                                        {
                                          convertToApplicationFormik.errors
                                            .coachingData.examDetails[index]
                                            .examName
                                        }
                                      </div>
                                    )}
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group
                                  controlId={`coachingData.examDetails[${index}].scoreFile`}
                                  className="mb-3"
                                >
                                  <Form.Label>Upload Document</Form.Label>
                                  <Form.Control
                                    type="file"
                                    name={`coachingData.examDetails[${index}].scoreFile`}
                                    onChange={(event) => {
                                      convertToApplicationFormik.setFieldValue(
                                        `coachingData.examDetails[${index}].scoreFile`,
                                        event.currentTarget.files[0],
                                      );
                                    }}
                                    onBlur={
                                      convertToApplicationFormik.handleBlur
                                    }
                                    className="custom-select-height"
                                  />
                                  {convertToApplicationFormik.touched
                                    .coachingData?.examDetails?.[index]
                                    ?.scoreFile &&
                                    convertToApplicationFormik.errors
                                      .coachingData?.examDetails?.[index]
                                      ?.scoreFile && (
                                      <div className="text-danger">
                                        {
                                          convertToApplicationFormik.errors
                                            .coachingData.examDetails[index]
                                            .scoreFile
                                        }
                                      </div>
                                    )}
                                </Form.Group>
                              </Col>
                              {[
                                "reading",
                                "writing",
                                "speaking",
                                "listening",
                                "total",
                              ].map((scoreType) => (
                                <Col md={3} key={scoreType}>
                                  <Form.Group
                                    controlId={`coachingData.examDetails[${index}].scores.${scoreType}`}
                                    className="mb-3"
                                  >
                                    <Form.Label>
                                      {scoreType.charAt(0).toUpperCase() +
                                        scoreType.slice(1)}{" "}
                                      Score
                                    </Form.Label>
                                    <Form.Control
                                      type="number"
                                      name={`coachingData.examDetails[${index}].scores.${scoreType}`}
                                      value={
                                        convertToApplicationFormik.values
                                          .coachingData.examDetails[index]
                                          .scores[scoreType]
                                      }
                                      onChange={
                                        convertToApplicationFormik.handleChange
                                      }
                                      onBlur={
                                        convertToApplicationFormik.handleBlur
                                      }
                                      className="custom-select-height"
                                      placeholder={`Enter ${scoreType} score`}
                                    />
                                    {convertToApplicationFormik.touched
                                      .coachingData?.examDetails?.[index]
                                      ?.scores?.[scoreType] &&
                                      convertToApplicationFormik.errors
                                        .coachingData?.examDetails?.[index]
                                        ?.scores?.[scoreType] && (
                                        <div className="text-danger">
                                          {
                                            convertToApplicationFormik.errors
                                              .coachingData.examDetails[index]
                                              .scores[scoreType]
                                          }
                                        </div>
                                      )}
                                  </Form.Group>
                                </Col>
                              ))}
                              {convertToApplicationFormik.values.coachingData
                                .examDetails.length > 1 && (
                                <Col md={12} className="mb-3">
                                  <Button
                                    variant="outline-danger"
                                    className="custom-select-height"
                                    onClick={() => {
                                      const updatedExams = [
                                        ...convertToApplicationFormik.values
                                          .coachingData.examDetails,
                                      ];
                                      updatedExams.splice(index, 1);
                                      convertToApplicationFormik.setFieldValue(
                                        "coachingData.examDetails",
                                        updatedExams,
                                      );
                                    }}
                                  >
                                    Remove Exam
                                  </Button>
                                </Col>
                              )}
                            </Row>
                          </div>
                        ),
                      )}
                      <Col md={12} className="mb-3">
                        <Button
                          variant="outline-primary"
                          onClick={addNewExam}
                          className="custom-select-height"
                        >
                          Add Another Exam
                        </Button>
                      </Col>
                    </>
                  )}

                  {userRole !== "B2B Admin" && userRole !== "B2B Member" && (
                    <>
                      <hr />

                      <Card
                        className="rounded-pill shadow-sm my-3"
                        style={{
                          backgroundColor: "#E9ECEF",
                          border: "1px solid #D3D3D3",
                        }}
                      >
                        <Card.Body
                          className="py-2 px-1"
                          style={{ fontSize: "16px" }}
                        >
                          <strong>Coaching Plan</strong>
                        </Card.Body>
                      </Card>
                      <Col md={6} className="mb-3">
                        <Form.Label>Coaching Sub Plan</Form.Label>
                        <Select
                          options={
                            coachingSubPlans?.map((sp) => ({
                              value: sp._id,
                              label: sp.name,
                            })) || []
                          }
                          value={coachingSubPlans
                            ?.map((sp) => ({
                              value: sp._id,
                              label: sp.name,
                            }))
                            .find(
                              (option) =>
                                option.value ===
                                convertToApplicationFormik.values.coachingData
                                  .subPlan,
                            )}
                          onChange={(option) => {
                            const subPlanValue = option?.value || "";
                            convertToApplicationFormik.setFieldValue(
                              "coachingData.subPlan",
                              subPlanValue,
                            );

                            if (!subPlanValue) {
                              convertToApplicationFormik.setFieldValue(
                                "coachingData.amount",
                                "",
                              );
                              convertToApplicationFormik.setFieldValue(
                                "coachingData.payableAmount",
                                "",
                              );
                              convertToApplicationFormik.setFieldValue(
                                "coachingData.dueAmount",
                                "",
                              );
                              convertToApplicationFormik.setFieldValue(
                                "coachingData.paidAmount",
                                {
                                  amount: "",
                                  date: "",
                                  bank: "",
                                  paymentMode: "",
                                },
                              );
                            }
                          }}
                          placeholder="Select Coaching Sub Plan"
                          styles={selectStyles}
                          isClearable
                        />
                        {convertToApplicationFormik.touched.coachingData
                          ?.subPlan &&
                          convertToApplicationFormik.errors.coachingData
                            ?.subPlan && (
                            <div className="text-danger">
                              {
                                convertToApplicationFormik.errors.coachingData
                                  ?.subPlan
                              }
                            </div>
                          )}
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Plan Amount</Form.Label>
                          <Form.Control
                            type="text"
                            name="coachingData.amount"
                            value={
                              convertToApplicationFormik.values.coachingData
                                .amount
                            }
                            onChange={convertToApplicationFormik.handleChange}
                            className="custom-select-height"
                            disabled
                            readOnly
                          />
                          {convertToApplicationFormik.touched.coachingData
                            ?.amount &&
                            convertToApplicationFormik.errors.coachingData
                              ?.amount && (
                              <div className="text-danger">
                                {
                                  convertToApplicationFormik.errors.coachingData
                                    ?.amount
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Discount</Form.Label>
                          <Form.Control
                            type="text"
                            name="coachingData.discount"
                            value={
                              convertToApplicationFormik.values.coachingData
                                .discount
                            }
                            onChange={convertToApplicationFormik.handleChange}
                            className="custom-select-height"
                          />
                          {convertToApplicationFormik.touched.coachingData
                            ?.discount &&
                            convertToApplicationFormik.errors.coachingData
                              ?.discount && (
                              <div className="text-danger">
                                {
                                  convertToApplicationFormik.errors.coachingData
                                    ?.discount
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Discount Amount</Form.Label>
                          <Form.Control
                            type="text"
                            name="coachingData.discountAmount"
                            value={
                              convertToApplicationFormik.values.coachingData
                                .discountAmount
                            }
                            onChange={convertToApplicationFormik.handleChange}
                            className="custom-select-height"
                            placeholder="e.g., 10"
                          />
                          {convertToApplicationFormik.touched.coachingData
                            ?.discountAmount &&
                            convertToApplicationFormik.errors.coachingData
                              ?.discountAmount && (
                              <div className="text-danger">
                                {
                                  convertToApplicationFormik.errors.coachingData
                                    ?.discountAmount
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Payable Amount</Form.Label>
                          <Form.Control
                            type="text"
                            name="coachingData.payableAmount"
                            value={
                              convertToApplicationFormik.values.coachingData
                                .payableAmount
                            }
                            onChange={convertToApplicationFormik.handleChange}
                            className="custom-select-height"
                            disabled
                            readOnly
                          />
                          {convertToApplicationFormik.touched.coachingData
                            ?.payableAmount &&
                            convertToApplicationFormik.errors.coachingData
                              ?.payableAmount && (
                              <div className="text-danger">
                                {
                                  convertToApplicationFormik.errors.coachingData
                                    ?.payableAmount
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Receive Amount</Form.Label>
                          <Form.Control
                            type="text"
                            value={
                              convertToApplicationFormik.values.coachingData
                                .paidAmount?.amount || ""
                            }
                            onChange={(e) =>
                              handlePaidAmountChange(
                                "amount",
                                e.target.value,
                                "coachingData",
                              )
                            }
                            className="custom-select-height"
                            placeholder="Enter Receive Amount"
                          />
                          {convertToApplicationFormik.touched.coachingData
                            ?.paidAmount?.amount &&
                            convertToApplicationFormik.errors.coachingData
                              ?.paidAmount?.amount && (
                              <div className="text-danger mt-1">
                                {
                                  convertToApplicationFormik.errors.coachingData
                                    .paidAmount.amount
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Payment Mode</Form.Label>
                          <Select
                            options={paymentModeOptions}
                            value={
                              paymentModeOptions.find(
                                (option) =>
                                  option.value ===
                                  convertToApplicationFormik.values.coachingData
                                    .paidAmount?.paymentMode,
                              ) || null
                            }
                            onChange={(option) =>
                              handlePaidAmountChange(
                                "paymentMode",
                                option ? option.value : "",
                                "coachingData",
                              )
                            }
                            placeholder="Select payment mode"
                            styles={selectStyles}
                          />
                          {convertToApplicationFormik.touched.coachingData
                            ?.paidAmount?.paymentMode &&
                            convertToApplicationFormik.errors.coachingData
                              ?.paidAmount?.paymentMode && (
                              <div className="text-danger mt-1">
                                {
                                  convertToApplicationFormik.errors.coachingData
                                    .paidAmount.paymentMode
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      {(convertToApplicationFormik.values.coachingData
                        .paidAmount?.paymentMode === "GPay" ||
                        convertToApplicationFormik.values.coachingData
                          .paidAmount?.paymentMode === "Bank" ||
                        convertToApplicationFormik.values.coachingData
                          .paidAmount?.paymentMode === "UPI") && (
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Bank</Form.Label>
                            <Select
                              options={bankOptions}
                              value={
                                bankOptions.find(
                                  (option) =>
                                    option.value ===
                                    convertToApplicationFormik.values
                                      .coachingData.paidAmount?.bank,
                                ) || null
                              }
                              onChange={(option) =>
                                handlePaidAmountChange(
                                  "bank",
                                  option ? option.value : "",
                                  "coachingData",
                                )
                              }
                              placeholder="Select bank"
                              styles={selectStyles}
                            />
                            {convertToApplicationFormik.touched.coachingData
                              ?.paidAmount?.bank &&
                              convertToApplicationFormik.errors.coachingData
                                ?.paidAmount?.bank && (
                                <div className="text-danger mt-1">
                                  {
                                    convertToApplicationFormik.errors
                                      .coachingData.paidAmount.bank
                                  }
                                </div>
                              )}
                          </Form.Group>
                        </Col>
                      )}
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Receivable Amount</Form.Label>
                          <Form.Control
                            type="text"
                            name="coachingData.dueAmount"
                            value={
                              convertToApplicationFormik.values.coachingData
                                .dueAmount
                            }
                            onChange={convertToApplicationFormik.handleChange}
                            className="custom-select-height"
                            disabled
                            readOnly
                          />
                          {convertToApplicationFormik.touched.coachingData
                            ?.dueAmount &&
                            convertToApplicationFormik.errors.coachingData
                              ?.dueAmount && (
                              <div className="text-danger">
                                {
                                  convertToApplicationFormik.errors.coachingData
                                    ?.dueAmount
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                    </>
                  )}
                </Row>
              )}

              {convertToApplicationFormik.values.admissionProcess &&
                userRole !== "B2B Admin" &&
                userRole !== "B2B Member" && (
                  <>
                    <hr />
                    <Row className="mb-3">
                      <Card
                        className="rounded-pill shadow-sm my-3"
                        style={{
                          backgroundColor: "#E9ECEF",
                          border: "1px solid #D3D3D3",
                        }}
                      >
                        <Card.Body
                          className="py-2 px-1"
                          style={{ fontSize: "16px" }}
                        >
                          <strong>Student Admission Plan</strong>
                        </Card.Body>
                      </Card>

                      <Col md={6} className="mb-3">
                        <Form.Label>Admission Sub Plan</Form.Label>
                        <Select
                          options={
                            admissionSubPlans?.map((sp) => ({
                              value: sp._id,
                              label: sp.name,
                            })) || []
                          }
                          value={admissionSubPlans
                            ?.map((sp) => ({
                              value: sp._id,
                              label: sp.name,
                            }))
                            .find(
                              (option) =>
                                option.value ===
                                convertToApplicationFormik.values.admissionData
                                  .subPlan,
                            )}
                          onChange={(option) => {
                            const subPlanValue = option?.value || "";
                            convertToApplicationFormik.setFieldValue(
                              "admissionData.subPlan",
                              subPlanValue,
                            );

                            if (!subPlanValue) {
                              convertToApplicationFormik.setFieldValue(
                                "admissionData.amount",
                                "",
                              );
                              convertToApplicationFormik.setFieldValue(
                                "admissionData.payableAmount",
                                "",
                              );
                              convertToApplicationFormik.setFieldValue(
                                "admissionData.dueAmount",
                                "",
                              );
                              convertToApplicationFormik.setFieldValue(
                                "admissionData.paidAmount",
                                {
                                  amount: "",
                                  date: "",
                                  bank: "",
                                  paymentMode: "",
                                },
                              );
                            }
                          }}
                          placeholder="Select Admission Sub Plan"
                          styles={selectStyles}
                          isClearable
                        />
                        {convertToApplicationFormik.touched.admissionData
                          ?.subPlan &&
                          convertToApplicationFormik.errors.admissionData
                            ?.subPlan && (
                            <div className="text-danger">
                              {
                                convertToApplicationFormik.errors.admissionData
                                  ?.subPlan
                              }
                            </div>
                          )}
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Plan Amount</Form.Label>
                          <Form.Control
                            type="text"
                            name="admissionData.amount"
                            value={
                              convertToApplicationFormik.values.admissionData
                                .amount
                            }
                            onChange={convertToApplicationFormik.handleChange}
                            className="custom-select-height"
                            disabled
                            readOnly
                          />
                          {convertToApplicationFormik.touched.admissionData
                            ?.amount &&
                            convertToApplicationFormik.errors.admissionData
                              ?.amount && (
                              <div className="text-danger">
                                {
                                  convertToApplicationFormik.errors
                                    .admissionData?.amount
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Discount</Form.Label>
                          <Form.Control
                            type="text"
                            name="admissionData.discount"
                            value={
                              convertToApplicationFormik.values.admissionData
                                .discount
                            }
                            onChange={convertToApplicationFormik.handleChange}
                            className="custom-select-height"
                          />
                          {convertToApplicationFormik.touched.admissionData
                            ?.discount &&
                            convertToApplicationFormik.errors.admissionData
                              ?.discount && (
                              <div className="text-danger">
                                {
                                  convertToApplicationFormik.errors
                                    .admissionData?.discount
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Discount Amount</Form.Label>
                          <Form.Control
                            type="text"
                            name="admissionData.discountAmount"
                            value={
                              convertToApplicationFormik.values.admissionData
                                .discountAmount
                            }
                            onChange={convertToApplicationFormik.handleChange}
                            className="custom-select-height"
                            placeholder="e.g., 10"
                          />
                          {convertToApplicationFormik.touched.admissionData
                            ?.discountAmount &&
                            convertToApplicationFormik.errors.admissionData
                              ?.discountAmount && (
                              <div className="text-danger">
                                {
                                  convertToApplicationFormik.errors
                                    .admissionData?.discountAmount
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Payable Amount</Form.Label>
                          <Form.Control
                            type="text"
                            name="admissionData.payableAmount"
                            value={
                              convertToApplicationFormik.values.admissionData
                                .payableAmount
                            }
                            onChange={convertToApplicationFormik.handleChange}
                            className="custom-select-height"
                            disabled
                            readOnly
                          />
                          {convertToApplicationFormik.touched.admissionData
                            ?.payableAmount &&
                            convertToApplicationFormik.errors.admissionData
                              ?.payableAmount && (
                              <div className="text-danger">
                                {
                                  convertToApplicationFormik.errors
                                    .admissionData?.payableAmount
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Receive Amount</Form.Label>
                          <Form.Control
                            type="text"
                            value={
                              convertToApplicationFormik.values.admissionData
                                .paidAmount?.amount || ""
                            }
                            onChange={(e) =>
                              handlePaidAmountChange(
                                "amount",
                                e.target.value,
                                "admissionData",
                              )
                            }
                            className="custom-select-height"
                            placeholder="Enter Receive Amount"
                          />
                          {convertToApplicationFormik.touched.admissionData
                            ?.paidAmount?.amount &&
                            convertToApplicationFormik.errors.admissionData
                              ?.paidAmount?.amount && (
                              <div className="text-danger mt-1">
                                {
                                  convertToApplicationFormik.errors
                                    .admissionData.paidAmount.amount
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Payment Mode</Form.Label>
                          <Select
                            options={paymentModeOptions}
                            value={
                              paymentModeOptions.find(
                                (option) =>
                                  option.value ===
                                  convertToApplicationFormik.values
                                    .admissionData.paidAmount?.paymentMode,
                              ) || null
                            }
                            onChange={(option) =>
                              handlePaidAmountChange(
                                "paymentMode",
                                option ? option.value : "",
                                "admissionData",
                              )
                            }
                            placeholder="Select payment mode"
                            styles={selectStyles}
                          />
                          {convertToApplicationFormik.touched.admissionData
                            ?.paidAmount?.paymentMode &&
                            convertToApplicationFormik.errors.admissionData
                              ?.paidAmount?.paymentMode && (
                              <div className="text-danger mt-1">
                                {
                                  convertToApplicationFormik.errors
                                    .admissionData.paidAmount.paymentMode
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      {(convertToApplicationFormik.values.admissionData
                        .paidAmount?.paymentMode === "GPay" ||
                        convertToApplicationFormik.values.admissionData
                          .paidAmount?.paymentMode === "Bank" ||
                        convertToApplicationFormik.values.admissionData
                          .paidAmount?.paymentMode === "UPI") && (
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Bank</Form.Label>
                            <Select
                              options={bankOptions}
                              value={
                                bankOptions.find(
                                  (option) =>
                                    option.value ===
                                    convertToApplicationFormik.values
                                      .admissionData.paidAmount?.bank,
                                ) || null
                              }
                              onChange={(option) =>
                                handlePaidAmountChange(
                                  "bank",
                                  option ? option.value : "",
                                  "admissionData",
                                )
                              }
                              placeholder="Select bank"
                              styles={selectStyles}
                            />
                            {convertToApplicationFormik.touched.admissionData
                              ?.paidAmount?.bank &&
                              convertToApplicationFormik.errors.admissionData
                                ?.paidAmount?.bank && (
                                <div className="text-danger mt-1">
                                  {
                                    convertToApplicationFormik.errors
                                      .admissionData.paidAmount.bank
                                  }
                                </div>
                              )}
                          </Form.Group>
                        </Col>
                      )}
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Receivable Amount</Form.Label>
                          <Form.Control
                            type="text"
                            name="admissionData.dueAmount"
                            value={
                              convertToApplicationFormik.values.admissionData
                                .dueAmount
                            }
                            onChange={convertToApplicationFormik.handleChange}
                            className="custom-select-height"
                            disabled
                            readOnly
                          />
                          {convertToApplicationFormik.touched.admissionData
                            ?.dueAmount &&
                            convertToApplicationFormik.errors.admissionData
                              ?.dueAmount && (
                              <div className="text-danger">
                                {
                                  convertToApplicationFormik.errors
                                    .admissionData?.dueAmount
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                )}

              {convertToApplicationFormik.values.visitorApplication &&
                userRole !== "B2B Admin" &&
                userRole !== "B2B Member" && (
                  <>
                    <Row>
                      <Card
                        className="rounded-pill shadow-sm my-3"
                        style={{
                          backgroundColor: "#E9ECEF",
                          border: "1px solid #D3D3D3",
                        }}
                      >
                        <Card.Body
                          className="py-2 px-1"
                          style={{ fontSize: "16px" }}
                        >
                          <strong>Visitor Plan</strong>
                        </Card.Body>
                      </Card>

                      <Col md={6} className="mb-3">
                        <Form.Label>Visitor Sub Plan</Form.Label>
                        <Select
                          options={
                            visitorSubPlans?.map((sp) => ({
                              value: sp._id,
                              label: sp.name,
                            })) || []
                          }
                          value={visitorSubPlans
                            ?.map((sp) => ({
                              value: sp._id,
                              label: sp.name,
                            }))
                            .find(
                              (option) =>
                                option.value ===
                                convertToApplicationFormik.values
                                  .categoryDetails.subPlan,
                            )}
                          onChange={(option) => {
                            const subPlanValue = option?.value || "";
                            convertToApplicationFormik.setFieldValue(
                              "categoryDetails.subPlan",
                              subPlanValue,
                            );

                            if (!subPlanValue) {
                              convertToApplicationFormik.setFieldValue(
                                "categoryDetails.amount",
                                "",
                              );
                              convertToApplicationFormik.setFieldValue(
                                "categoryDetails.payableAmount",
                                "",
                              );
                              convertToApplicationFormik.setFieldValue(
                                "categoryDetails.dueAmount",
                                "",
                              );
                              convertToApplicationFormik.setFieldValue(
                                "categoryDetails.paidAmount",
                                {
                                  amount: "",
                                  date: "",
                                  bank: "",
                                  paymentMode: "",
                                },
                              );
                            }
                          }}
                          placeholder="Select Visitor Sub Plan"
                          styles={selectStyles}
                          isClearable
                        />
                        {convertToApplicationFormik.touched.categoryDetails
                          ?.subPlan &&
                          convertToApplicationFormik.errors.categoryDetails
                            ?.subPlan && (
                            <div className="text-danger">
                              {
                                convertToApplicationFormik.errors
                                  .categoryDetails?.subPlan
                              }
                            </div>
                          )}
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Plan Amount</Form.Label>
                          <Form.Control
                            type="text"
                            name="categoryDetails.amount"
                            value={
                              convertToApplicationFormik.values.categoryDetails
                                .amount
                            }
                            onChange={convertToApplicationFormik.handleChange}
                            className="custom-select-height"
                            disabled
                            readOnly
                          />
                          {convertToApplicationFormik.touched.categoryDetails
                            ?.amount &&
                            convertToApplicationFormik.errors.categoryDetails
                              ?.amount && (
                              <div className="text-danger">
                                {
                                  convertToApplicationFormik.errors
                                    .categoryDetails?.amount
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Discount</Form.Label>
                          <Form.Control
                            type="text"
                            name="categoryDetails.discount"
                            value={
                              convertToApplicationFormik.values.categoryDetails
                                .discount
                            }
                            onChange={convertToApplicationFormik.handleChange}
                            className="custom-select-height"
                          />
                          {convertToApplicationFormik.touched.categoryDetails
                            ?.discount &&
                            convertToApplicationFormik.errors.categoryDetails
                              ?.discount && (
                              <div className="text-danger">
                                {
                                  convertToApplicationFormik.errors
                                    .categoryDetails?.discount
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Discount Amount</Form.Label>
                          <Form.Control
                            type="text"
                            name="categoryDetails.discountAmount"
                            value={
                              convertToApplicationFormik.values.categoryDetails
                                .discountAmount
                            }
                            onChange={convertToApplicationFormik.handleChange}
                            className="custom-select-height"
                            placeholder="e.g., 10"
                          />
                          {convertToApplicationFormik.touched.categoryDetails
                            ?.discountAmount &&
                            convertToApplicationFormik.errors.categoryDetails
                              ?.discountAmount && (
                              <div className="text-danger">
                                {
                                  convertToApplicationFormik.errors
                                    .categoryDetails?.discountAmount
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Payable Amount</Form.Label>
                          <Form.Control
                            type="text"
                            name="categoryDetails.payableAmount"
                            value={
                              convertToApplicationFormik.values.categoryDetails
                                .payableAmount
                            }
                            onChange={convertToApplicationFormik.handleChange}
                            className="custom-select-height"
                            disabled
                            readOnly
                          />
                          {convertToApplicationFormik.touched.categoryDetails
                            ?.payableAmount &&
                            convertToApplicationFormik.errors.categoryDetails
                              ?.payableAmount && (
                              <div className="text-danger">
                                {
                                  convertToApplicationFormik.errors
                                    .categoryDetails?.payableAmount
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Receive Amount</Form.Label>
                          <Form.Control
                            type="text"
                            value={
                              convertToApplicationFormik.values.categoryDetails
                                .paidAmount?.amount || ""
                            }
                            onChange={(e) =>
                              handlePaidAmountChange(
                                "amount",
                                e.target.value,
                                "categoryDetails",
                              )
                            }
                            className="custom-select-height"
                            placeholder="Enter Receive Amount"
                          />
                          {convertToApplicationFormik.touched.categoryDetails
                            ?.paidAmount?.amount &&
                            convertToApplicationFormik.errors.categoryDetails
                              ?.paidAmount?.amount && (
                              <div className="text-danger mt-1">
                                {
                                  convertToApplicationFormik.errors
                                    .categoryDetails.paidAmount.amount
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Payment Mode</Form.Label>
                          <Select
                            options={paymentModeOptions}
                            value={
                              paymentModeOptions.find(
                                (option) =>
                                  option.value ===
                                  convertToApplicationFormik.values
                                    .categoryDetails.paidAmount?.paymentMode,
                              ) || null
                            }
                            onChange={(option) =>
                              handlePaidAmountChange(
                                "paymentMode",
                                option ? option.value : "",
                                "categoryDetails",
                              )
                            }
                            placeholder="Select payment mode"
                            styles={selectStyles}
                          />
                          {convertToApplicationFormik.touched.categoryDetails
                            ?.paidAmount?.paymentMode &&
                            convertToApplicationFormik.errors.categoryDetails
                              ?.paidAmount?.paymentMode && (
                              <div className="text-danger mt-1">
                                {
                                  convertToApplicationFormik.errors
                                    .categoryDetails.paidAmount.paymentMode
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      {(convertToApplicationFormik.values.categoryDetails
                        .paidAmount?.paymentMode === "GPay" ||
                        convertToApplicationFormik.values.categoryDetails
                          .paidAmount?.paymentMode === "Bank" ||
                        convertToApplicationFormik.values.categoryDetails
                          .paidAmount?.paymentMode === "UPI") && (
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Bank</Form.Label>
                            <Select
                              options={bankOptions}
                              value={
                                bankOptions.find(
                                  (option) =>
                                    option.value ===
                                    convertToApplicationFormik.values
                                      .categoryDetails.paidAmount?.bank,
                                ) || null
                              }
                              onChange={(option) =>
                                handlePaidAmountChange(
                                  "bank",
                                  option ? option.value : "",
                                  "categoryDetails",
                                )
                              }
                              placeholder="Select bank"
                              styles={selectStyles}
                            />
                            {convertToApplicationFormik.touched.categoryDetails
                              ?.paidAmount?.bank &&
                              convertToApplicationFormik.errors.categoryDetails
                                ?.paidAmount?.bank && (
                                <div className="text-danger mt-1">
                                  {
                                    convertToApplicationFormik.errors
                                      .categoryDetails.paidAmount.bank
                                  }
                                </div>
                              )}
                          </Form.Group>
                        </Col>
                      )}
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Receivable Amount</Form.Label>
                          <Form.Control
                            type="text"
                            name="categoryDetails.dueAmount"
                            value={
                              convertToApplicationFormik.values.categoryDetails
                                .dueAmount
                            }
                            onChange={convertToApplicationFormik.handleChange}
                            className="custom-select-height"
                            disabled
                            readOnly
                          />
                          {convertToApplicationFormik.touched.categoryDetails
                            ?.dueAmount &&
                            convertToApplicationFormik.errors.categoryDetails
                              ?.dueAmount && (
                              <div className="text-danger">
                                {
                                  convertToApplicationFormik.errors
                                    .categoryDetails?.dueAmount
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                    </Row>

                    <hr />

                    <Row className="my-3">
                      <Col md={12}>
                        <Form.Group
                          controlId="visitorProcessCategory"
                          className="mb-3"
                        >
                          <Form.Label>Visitor Process Category</Form.Label>
                          <Select
                            options={visitorProcessOptions}
                            onChange={(selectedOption) => {
                              const newType = selectedOption?.value || "";

                              convertToApplicationFormik.setFieldValue(
                                "categoryDetails.type",
                                newType,
                              );
                              if (
                                newType !== "Renewal" &&
                                newType !== "Refusal"
                              ) {
                                convertToApplicationFormik.setFieldValue(
                                  "categoryDetails.entries",
                                  [],
                                );
                              } else if (
                                convertToApplicationFormik.values
                                  .categoryDetails.entries.length === 0
                              ) {
                                addVisitorEntry();
                              }
                            }}
                            value={visitorProcessOptions.find(
                              (option) =>
                                option.value ===
                                convertToApplicationFormik.values
                                  .categoryDetails?.type,
                            )}
                            classNamePrefix="custom-select"
                            placeholder="Select Category"
                            isClearable
                            isSearchable
                          />
                        </Form.Group>
                        {convertToApplicationFormik.touched.categoryDetails
                          ?.type && (
                          <div className="text-danger">
                            {
                              convertToApplicationFormik.errors.categoryDetails
                                ?.type
                            }
                          </div>
                        )}
                      </Col>

                      {(convertToApplicationFormik.values?.categoryDetails
                        ?.type === "Renewal" ||
                        convertToApplicationFormik.values?.categoryDetails
                          ?.type === "Refusal") && (
                        <>
                          <Col md={12} className="mb-3">
                            <Form.Label>
                              {
                                convertToApplicationFormik.values
                                  .categoryDetails.type
                              }{" "}
                              Details
                            </Form.Label>

                            {convertToApplicationFormik.values.categoryDetails.entries.map(
                              (entry, index) => (
                                <Row
                                  key={index}
                                  className="mb-3 border py-2 rounded"
                                >
                                  <Col md={6} className="mb-3">
                                    <Form.Group>
                                      <Form.Label>Country</Form.Label>
                                      <Select
                                        options={countries?.map((c) => ({
                                          value: c.name,
                                          label: c.name,
                                        }))}
                                        value={
                                          entry.country
                                            ? {
                                                value: entry.country,
                                                label: entry.country,
                                              }
                                            : null
                                        }
                                        onChange={(option) =>
                                          convertToApplicationFormik.setFieldValue(
                                            `categoryDetails.entries[${index}].country`,
                                            option ? option.value : "",
                                          )
                                        }
                                        placeholder="Select Country"
                                        classNamePrefix="custom-select"
                                        isSearchable
                                      />
                                      {convertToApplicationFormik.touched
                                        .categoryDetails?.entries?.[index]
                                        ?.country &&
                                        convertToApplicationFormik.errors
                                          .categoryDetails?.entries?.[index]
                                          ?.country && (
                                          <div className="text-danger">
                                            {
                                              convertToApplicationFormik.errors
                                                .categoryDetails.entries[index]
                                                .country
                                            }
                                          </div>
                                        )}
                                    </Form.Group>
                                  </Col>
                                  <Col md={6} className="mb-3">
                                    <Form.Label>
                                      {
                                        convertToApplicationFormik.values
                                          .categoryDetails.type
                                      }{" "}
                                      Date
                                    </Form.Label>
                                    <div style={{ position: "relative" }}>
                                      <Form.Control
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        className="custom-select-height"
                                        value={
                                          entry.date
                                            ? formatDate(parseDate(entry.date))
                                            : ""
                                        }
                                        readOnly
                                        onClick={() =>
                                          setShowVisitorProcessRenewalDateCalendar(
                                            (prev) => ({
                                              ...prev,
                                              [index]: !prev[index],
                                            }),
                                          )
                                        }
                                        ref={visitorProcessRenewalDateInputRef}
                                        style={{ cursor: "pointer" }}
                                      />
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
                                      {showVisitorProcessRenewalDateCalendar[
                                        index
                                      ] && (
                                        <div
                                          ref={
                                            visitorProcessRenewalDateCalendarRef
                                          }
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
                                              convertToApplicationFormik.setFieldValue(
                                                `categoryDetails.entries[${index}].date`,
                                                toISODate(selectedDate),
                                              );
                                              setShowVisitorProcessRenewalDateCalendar(
                                                (prev) => ({
                                                  ...prev,
                                                  [index]: false,
                                                }),
                                              );
                                            }}
                                            value={
                                              entry.date
                                                ? parseDate(entry.date)
                                                : new Date()
                                            }
                                            locale="en-GB"
                                          />
                                        </div>
                                      )}
                                    </div>
                                    {convertToApplicationFormik.touched
                                      .categoryDetails?.entries?.[index]
                                      ?.date &&
                                      convertToApplicationFormik.errors
                                        .categoryDetails?.entries?.[index]
                                        ?.date && (
                                        <div className="text-danger">
                                          {
                                            convertToApplicationFormik.errors
                                              .categoryDetails.entries?.[index]
                                              ?.date
                                          }
                                        </div>
                                      )}
                                  </Col>
                                  <Col md={6} className="mb-3">
                                    <Form.Label>
                                      Upload{" "}
                                      {
                                        convertToApplicationFormik.values
                                          ?.categoryDetails.type
                                      }{" "}
                                      Document
                                    </Form.Label>
                                    <Form.Control
                                      type="file"
                                      name="categoryDetails.document"
                                      onChange={(event) =>
                                        convertToApplicationFormik.setFieldValue(
                                          `categoryDetails.entries[${index}].document`,
                                          event.currentTarget.files[0],
                                        )
                                      }
                                      onBlur={
                                        convertToApplicationFormik.handleBlur
                                      }
                                      className="custom-select-height"
                                    />
                                    {convertToApplicationFormik.touched
                                      .categoryDetails?.entries?.[index]
                                      ?.document &&
                                      convertToApplicationFormik.errors
                                        .categoryDetails?.entries?.[index]
                                        ?.document && (
                                        <div className="text-danger">
                                          {
                                            convertToApplicationFormik.errors
                                              .categoryDetails.entries?.[index]
                                              ?.document
                                          }
                                        </div>
                                      )}
                                  </Col>
                                  <Col md={6} className="mb-3">
                                    <Form.Group>
                                      <Form.Label>Remarks</Form.Label>
                                      <Form.Control
                                        as="textarea"
                                        name={`categoryDetails.entries[${index}].remarks`}
                                        value={entry.remarks}
                                        onChange={
                                          convertToApplicationFormik.handleChange
                                        }
                                        rows={1}
                                        className="custom-select-height"
                                      />
                                    </Form.Group>
                                  </Col>
                                  {convertToApplicationFormik.values
                                    .categoryDetails.entries.length > 1 && (
                                    <Col md={12} className="text-end">
                                      <Button
                                        variant="link"
                                        className="p-0"
                                        onClick={() =>
                                          removeVisitorEntry(index)
                                        }
                                      >
                                        <i className="bi bi-trash text-danger"></i>
                                      </Button>
                                    </Col>
                                  )}
                                </Row>
                              ),
                            )}

                            <Row>
                              <Button
                                variant="link"
                                className="d-flex justify-content-end"
                                onClick={addVisitorEntry}
                              >
                                <i className="bi bi-plus-circle fs-4"></i>
                              </Button>
                            </Row>
                          </Col>
                        </>
                      )}
                    </Row>
                  </>
                )}
              <div className="d-flex justify-content-end gap-2 mt-3">
                <Button
                  variant="link"
                  className="custom-select-height btn border-primary text-primary text-decoration-none"
                  onClick={() => {
                    setOpenModal(false);
                    convertToApplicationFormik.resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="custom-select-height"
                  type="submit"
                >
                  Confirm
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default ConvertToApplicationModal;
