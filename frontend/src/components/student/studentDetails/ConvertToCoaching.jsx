import React, { useState, useRef, useEffect, useCallback } from "react";
import { Modal, Button, Form, Col, Row, Card } from "react-bootstrap";
import Select from "react-select";
import { MdCalendarToday } from "react-icons/md";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getAllStudentRegisterFor } from "../../../redux/actions/Master/StudentRegisterFor.action";
import { getAllCoachingRequirement } from "../../../redux/actions/Master/CoachingRequirement.action";
import {
  getAllCoachingFaculty,
  getAllBatchTimes,
} from "../../../redux/actions/Master/CoachingFaculty.action";
import {
  getAllSubPlan,
  getOneSubPlan,
} from "../../../redux/actions/Master/SubPlan.action";
import { createGenerateInvoice } from "../../../redux/actions/Accountant/GenerateInvoice.action";
import { getAllMainPlan } from "../../../redux/actions/Master/MainPlan.action";
import { updateStudentApplication } from "../../../redux/actions/Student/StudentApplication.action";
import { AiOutlineClose } from "react-icons/ai";
import { decryptData } from "../../../utils/encryptionUtils";
import { getAllBankingDetails } from "../../../redux/actions/Master/Banking.action";
import LoadMoreButton from "../../commonComponents/LoadMoreButton";
import { getAllBranch } from "../../../redux/actions/Branch.action";

const convertToApplicationSchema = Yup.object({
  coachingDetails: Yup.object({
    coachingRequired: Yup.boolean().nullable(),
    city: Yup.string(),
    startDate: Yup.date(),
    endDate: Yup.date(),
    registerFor: Yup.string().nullable(),
    coachingRequirement: Yup.string().nullable(),
    batchStatus: Yup.string(),
    branch: Yup.string().nullable(),
    batchFaculty: Yup.string().nullable(),
    batchTiming: Yup.string().nullable(),
    examRegistrationDate: Yup.string(),
    targetedScore: Yup.number(),
    hasGivenExam: Yup.boolean().nullable(),
    examDetails: Yup.array()
      .of(
        Yup.object({
          examName: Yup.string(),
          scores: Yup.object({
            reading: Yup.number(),
            writing: Yup.number(),
            speaking: Yup.number(),
            listening: Yup.number(),
            total: Yup.number(),
          }),
        }),
      )
      .nullable(),
    remarks: Yup.string(),
    subPlan: Yup.string().nullable(),
    amount: Yup.string(),
    discount: Yup.string(),
    discountAmount: Yup.string(),
    payableAmount: Yup.string(),
    paidAmount: Yup.array(),
    dueAmount: Yup.string(),
    paymentType: Yup.string(),
    invoiceRemarks: Yup.string(),
  }),
});

const ConvertToCoaching = ({
  show,
  onHide,
  setShowConvertModal,
  data: selectedLead,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const userRole = decryptData(localStorage.getItem("role"));
  const branchID = decryptData(localStorage.getItem("userId"));
  const branchUserId = decryptData(localStorage.getItem("branchId"));
  const userType = decryptData(localStorage.getItem("userType"));

  const derivedBranchValue =
    userRole === "Branch"
      ? branchID
      : userType === "Branch User"
        ? branchUserId
        : null;

  const [allStudentRegisterFor, setAllStudentRegisterFor] = useState([]);
  const [allCoachingRequirements, setAllCoachingRequirements] = useState([]);
  const [coachingFaculties, setCoachingFaculties] = useState([]);
  const [batchTimes, setBatchTimes] = useState([]);
  const [mainPlans, setMainPlans] = useState([]);
  const [coachingSubPlans, setCoachingSubPlans] = useState([]);

  const [showCoachingStartDateCalendar, setShowCoachingStartDateCalendar] =
    useState(false);
  const [showCoachingEndDateCalendar, setShowCoachingEndDateCalendar] =
    useState(false);
  const [showExamDateCalendar, setShowExamDateCalendar] = useState(false);
  const [showPaidDateCalendar, setShowPaidDateCalendar] = useState(false);
  const coachingStartDateInputRef = useRef(null);
  const coachingEndDateInputRef = useRef(null);
  const examDateInputRef = useRef(null);
  const paidDateInputRef = useRef(null);
  const coachingStartDateCalenderRef = useRef(null);
  const coachingEndDateCalenderRef = useRef(null);
  const examDateCalenderRef = useRef(null);
  const paidDateCalendarRef = useRef(null);
  const [isLoadingSubPlan, setIsLoadingSubPlan] = useState(false);
  const [bankingDetails, setBankingDetails] = useState([]);
  const [coachingSubPlan, setCoachingSubPlan] = useState("");
  const [paidDateValue, setPaidDateValue] = useState(null);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        coachingStartDateInputRef.current &&
        !coachingStartDateInputRef.current.contains(event.target) &&
        coachingStartDateCalenderRef.current &&
        !coachingStartDateCalenderRef.current.contains(event.target)
      ) {
        setShowCoachingStartDateCalendar(false);
      }
      if (
        coachingEndDateInputRef.current &&
        !coachingEndDateInputRef.current.contains(event.target) &&
        coachingEndDateCalenderRef.current &&
        !coachingEndDateCalenderRef.current.contains(event.target)
      ) {
        setShowCoachingEndDateCalendar(false);
      }
      if (
        paidDateInputRef.current &&
        !paidDateInputRef.current.contains(event.target) &&
        paidDateCalendarRef.current &&
        !paidDateCalendarRef.current.contains(event.target)
      ) {
        setShowPaidDateCalendar(false);
      }
      if (
        examDateInputRef.current &&
        !examDateInputRef.current.contains(event.target) &&
        examDateCalenderRef.current &&
        !examDateCalenderRef.current.contains(event.target)
      ) {
        setShowExamDateCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const convertToApplicationFormik = useFormik({
    initialValues: {
      coachingDetails: {
        coachingRequired: true,
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
        subPlan: null,
        amount: "",
        discount: "",
        discountAmount: "",
        payableAmount: "",
        paidAmount: [{ amount: "", date: "", bank: null, paymentMode: "" }],
        dueAmount: "",
        paymentType: "",
        invoiceRemarks: "",
      },
    },
    validationSchema: convertToApplicationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      if (!values.coachingDetails.coachingRequired) {
        toast.error("Please select at least one: Coaching Required");
        return;
      }

      const coachingMainPlan = mainPlans.find(
        (plan) => plan.name.toLowerCase() === "coaching",
      );

      // Prepare invoice payload for createGenerateInvoice
      const invoicePayload = {
        name: selectedLead._id || "",
        contactNo: selectedLead.contact || "",
        mainPlan: coachingMainPlan?._id || "",
        subPlan: values.coachingDetails.subPlan || null,
        amount: values.coachingDetails.amount || "",
        discount: values.coachingDetails.discount || "",
        discountAmount: values.coachingDetails.discountAmount || "",
        payableAmount: values.coachingDetails.payableAmount || "",
        paymentType: values.coachingDetails.paymentType || "",
        paidAmount: values.coachingDetails.paidAmount
          .filter((entry) => entry.amount && entry.amount.trim() !== "")
          .map((entry) => ({
            amount: entry.amount || "",
            date: entry.date || new Date().toISOString(),
            bank: entry.bank || "",
            paymentMode: entry.paymentMode || "",
          })),
        dueAmount: values.coachingDetails.dueAmount || "",
        remarks: values.coachingDetails.invoiceRemarks || "",
      };

      // Prepare coaching payload for updateStudentApplication
      const formData = new FormData();
      // Coaching Data (without invoice)
      formData.append(
        "coachingDetails[coachingRequired]",
        values.coachingDetails.coachingRequired,
      );
      if (values.coachingDetails.city) {
        formData.append("coachingDetails[city]", values.coachingDetails.city);
      }
      if (values.coachingDetails.startDate) {
        formData.append(
          "coachingDetails[startDate]",
          values.coachingDetails.startDate,
        );
      }
      if (values.coachingDetails.endDate) {
        formData.append(
          "coachingDetails[endDate]",
          values.coachingDetails.endDate,
        );
      }
      if (values.coachingDetails.registerFor) {
        formData.append(
          "coachingDetails[registerFor]",
          values.coachingDetails.registerFor,
        );
      }
      if (values.coachingDetails.coachingRequirement) {
        formData.append(
          "coachingDetails[coachingRequirement]",
          values.coachingDetails.coachingRequirement,
        );
      }
      if (values.coachingDetails.branch) {
        formData.append(
          "coachingDetails[branch]",
          values.coachingDetails.branch,
        );
      }
      if (values.coachingDetails.batchStatus) {
        formData.append(
          "coachingDetails[batchStatus]",
          values.coachingDetails.batchStatus,
        );
      }
      if (values.coachingDetails.batchFaculty) {
        formData.append(
          "coachingDetails[batchFaculty]",
          values.coachingDetails.batchFaculty,
        );
      }
      if (values.coachingDetails.batchTiming) {
        formData.append(
          "coachingDetails[batchTiming]",
          values.coachingDetails.batchTiming,
        );
      }
      if (values.coachingDetails.examRegistrationDate) {
        formData.append(
          "coachingDetails[examRegistrationDate]",
          values.coachingDetails.examRegistrationDate,
        );
      }
      if (values.coachingDetails.targetedScore) {
        formData.append(
          "coachingDetails[targetedScore]",
          values.coachingDetails.targetedScore,
        );
      }
      formData.append(
        "coachingDetails[hasGivenExam]",
        values.coachingDetails.hasGivenExam,
      );
      if (values.coachingDetails.remarks) {
        formData.append(
          "coachingDetails[remarks]",
          values.coachingDetails.remarks,
        );
      }

      if (
        values.coachingDetails.hasGivenExam &&
        values.coachingDetails.examDetails
      ) {
        values.coachingDetails.examDetails.forEach((exam, index) => {
          if (exam.examName) {
            formData.append(
              `coachingDetails[examDetails][${index}][examName]`,
              exam.examName,
            );
          }
          if (exam.scores.reading) {
            formData.append(
              `coachingDetails[examDetails][${index}][scores][reading]`,
              exam.scores.reading,
            );
          }
          if (exam.scores.writing) {
            formData.append(
              `coachingDetails[examDetails][${index}][scores][writing]`,
              exam.scores.writing,
            );
          }
          if (exam.scores.speaking) {
            formData.append(
              `coachingDetails[examDetails][${index}][scores][speaking]`,
              exam.scores.speaking,
            );
          }
          if (exam.scores.listening) {
            formData.append(
              `coachingDetails[examDetails][${index}][scores][listening]`,
              exam.scores.listening,
            );
          }
          if (exam.scores.total) {
            formData.append(
              `coachingDetails[examDetails][${index}][scores][total]`,
              exam.scores.total,
            );
          }
          if (exam.scoreFile) {
            formData.append(`coachingDoc`, exam.scoreFile);
          }
        });
      }

      try {
        // First API call: createGenerateInvoice
        const invoiceResponse = await dispatch(
          createGenerateInvoice(invoicePayload),
        );
        if (invoiceResponse?.status !== 201) {
          throw new Error(
            invoiceResponse?.data?.message || "Failed to create invoice",
          );
        }

        // Second API call: updateStudentApplication
        const convertResponse = await dispatch(
          updateStudentApplication(formData, selectedLead?._id),
        );
        if (convertResponse?.status === 200) {
          toast.success("Application converted successfully");
          setShowConvertModal(false);
        } else {
          toast.error(
            convertResponse?.data?.message || "Failed to convert lead",
          );
        }
      } catch (error) {
        console.error("Error in convert to application:", error);
        toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
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

  const paymentModeOptions = [
    { label: "GPay", value: "GPay" },
    { label: "Bank", value: "Bank" },
    { label: "Cash", value: "Cash" },
    { label: "UPI", value: "UPI" },
  ];

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
      convertToApplicationFormik.values.coachingDetails.subPlan !==
      coachingSubPlan
    ) {
      setCoachingSubPlan(
        convertToApplicationFormik.values.coachingDetails.subPlan,
      );
      if (convertToApplicationFormik.values.coachingDetails.subPlan) {
        setAmountForSection(
          convertToApplicationFormik.values.coachingDetails.subPlan,
          "coachingDetails",
        );
      }
    }
  }, [
    convertToApplicationFormik.values.coachingDetails?.subPlan,
    isLoadingSubPlan,
  ]);

  const calculateAmounts = useCallback(
    (section) => {
      const values = convertToApplicationFormik.values[section];
      const amount = parseFloat(values.amount) || 0;

      let discountFromDiscountField = 0;
      // if (values.discount) {
      //   if (values.discount.toString().includes("%")) {
      //     const percent =
      //       parseFloat(values.discount.replace("%", "").trim()) || 0;
      //     discountFromDiscountField = (amount * percent) / 100;
      //   } else {
      //     discountFromDiscountField = parseFloat(values.discount) || 0;
      //   }
      // }
      if (values.discount) {
        // Always treat entered value as a percentage, even if % is not written
        const percent = parseFloat(values.discount) || 0;
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
      const totalPaid =
        values.paidAmount?.reduce(
          (sum, entry) => sum + (parseFloat(entry.amount) || 0),
          0,
        ) || 0;

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
      if (convertToApplicationFormik.values.coachingDetails.coachingRequired) {
        calculateAmounts("coachingDetails");
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    convertToApplicationFormik.values.coachingDetails.amount,
    convertToApplicationFormik.values.coachingDetails.discount,
    convertToApplicationFormik.values.coachingDetails.discountAmount,
    convertToApplicationFormik.values.coachingDetails.paidAmount,
  ]);

  const fetchSubPlans = async (
    page = 1,
    limit = 1000,
    searchTerm = "",
    mainPlanId = "",
  ) => {
    try {
      const res = await dispatch(
        getAllSubPlan(page, limit, searchTerm, mainPlanId),
      );
      const responseData = res?.data?.data || {};
      if (res?.status === 200) {
        return responseData?.data || [];
      } else {
        toast.error("Failed to fetch sub-plans.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching sub plans:", error);
      toast.error("Error fetching sub-plans: " + error.message);
      return [];
    }
  };

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
    convertToApplicationFormik.setFieldValue("coachingDetails.examDetails", [
      ...convertToApplicationFormik.values.coachingDetails.examDetails,
      newExam,
    ]);
  };

  const handlePaidAmountChange = (index, field, value, section) => {
    const updatedPaidAmount = [
      ...convertToApplicationFormik.values[section].paidAmount,
    ];
    updatedPaidAmount[index] = {
      ...updatedPaidAmount[index],
      [field]: value,
    };
    convertToApplicationFormik.setFieldValue(
      `${section}.paidAmount`,
      updatedPaidAmount,
    );
  };

  // Fetch sub-plans when mainPlans are loaded
  useEffect(() => {
    const fetchCoachingSubPlans = async () => {
      if (mainPlans.length > 0) {
        const coachingPlan = mainPlans.find(
          (plan) => plan.name.toLowerCase() === "coaching",
        );
        if (coachingPlan && coachingSubPlans.length === 0) {
          const subPlansData = await fetchSubPlans(
            1,
            1000,
            "",
            coachingPlan._id,
          );
          setCoachingSubPlans(subPlansData);
        }
      }
    };

    if (convertToApplicationFormik.values.coachingDetails.coachingRequired) {
      fetchCoachingSubPlans();
    }
  }, [
    mainPlans,
    convertToApplicationFormik.values.coachingDetails.coachingRequired,
  ]);

  const fetchStudentRegisterFor = async () => {
    try {
      const res = await dispatch(getAllStudentRegisterFor(1, 1000, ""));
      if (res?.status === 200) {
        setAllStudentRegisterFor(res?.data?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching lead sources:", error);
      toast.error("Failed to fetch student register for data.");
    }
  };

  const fetchCoachingRequirements = async () => {
    try {
      const res = await dispatch(getAllCoachingRequirement(1, 1000, ""));
      const responseData = res?.data?.data;
      if (res?.status === 200) {
        setAllCoachingRequirements(responseData?.data || []);
      } else {
        toast.error("Failed to fetch coaching requirements.");
      }
    } catch (error) {
      console.error("Error fetching coaching requirements:", error);
      toast.error("Error fetching coaching requirements: " + error.message);
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
    let branch = "";

    if (!selectedOption || selectedOption.value === "All") {
      // ✅ All
      showAll = true;
      branch = "";
    } else if (selectedOption.value === "head_office") {
      // ✅ Head Office
      showAll = false;
      branch = "";
    } else {
      // ✅ Specific Branch
      showAll = false;
      branch = selectedOption.value;
    }

    // 🔥 Branch user override (important)
    const finalBranch =
      userType === "Branch User"
        ? branchUserId
        : userRole === "Branch"
          ? branchID
          : branch;

    try {
      const res = await dispatch(
        getAllCoachingFaculty(
          1,
          1000,
          "",
          convertToApplicationFormik.values.coachingDetails.batchStatus || "",
          showAll,
          finalBranch,
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
      if (res?.status === 200) {
        setBatchTimes(res?.data?.message || []);
      } else {
        toast.error("Failed to fetch batch times.");
      }
    } catch (error) {
      console.error("Error fetching batch times:", error);
      toast.error("Error fetching batch times: " + error.message);
    }
  };

  const fetchMainPlans = async () => {
    try {
      const res = await dispatch(getAllMainPlan());
      if (res?.status === 200) {
        setMainPlans(res?.data?.data?.data || []);
      } else {
        toast.error("Failed to fetch main plans.");
      }
    } catch (error) {
      console.error("Error fetching main plans:", error);
      toast.error("Error fetching main plans: " + error.message);
      setMainPlans([]);
    }
  };

  const fetchBankingDetails = async () => {
    try {
      const res = await dispatch(getAllBankingDetails(1, 1000, ""));
      const responseData = res?.data?.data?.data || [];
      if (res?.status === 200) {
        setBankingDetails(responseData);
      } else {
        toast.error("Failed to fetch banking details.");
      }
    } catch (error) {
      console.error("Error fetching banking details:", error);
      toast.error("Error fetching banking details: " + error.message);
      setBankingDetails([]);
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
    fetchStudentRegisterFor();
    fetchCoachingRequirements();
    fetchCoachingFaculties();
    // fetchBatchTimes();
    fetchMainPlans();
    fetchBankingDetails();
  }, []);

  return (
    <>
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
      <Modal
        show={show}
        onHide={() => {
          setShowConvertModal(false);
          convertToApplicationFormik.resetForm();
        }}
        size="lg"
        style={{ maxHeight: "95vh", overflowY: "auto" }}
      >
        <Modal.Header className="form-main-heading">
          <Modal.Title>Convert to Coaching</Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={() => {
              setShowConvertModal(false);
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
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="coachingDetails.city" className="mb-3">
                  <Form.Label>Student Resident City</Form.Label>
                  <Form.Control
                    type="text"
                    name="coachingDetails.city"
                    value={
                      convertToApplicationFormik.values.coachingDetails.city
                    }
                    onChange={convertToApplicationFormik.handleChange}
                    className="custom-select-height"
                    placeholder="Enter Resident City"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group
                  controlId="coachingDetails.startDate"
                  className="mb-3"
                >
                  <Form.Label>Coaching Start Date</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      placeholder="dd/mm/yyyy"
                      className="custom-select-height"
                      value={
                        convertToApplicationFormik.values.coachingDetails
                          .startDate
                          ? formatDate(
                              parseDate(
                                convertToApplicationFormik.values
                                  .coachingDetails.startDate,
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
                              "coachingDetails.startDate",
                              toISODate(selectedDate),
                            );
                            setShowCoachingStartDateCalendar(false);
                          }}
                          value={
                            convertToApplicationFormik.values.coachingDetails
                              .startDate
                              ? parseDate(
                                  convertToApplicationFormik.values
                                    .coachingDetails.startDate,
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
                  controlId="coachingDetails.endDate"
                  className="mb-3"
                >
                  <Form.Label>Coaching End Date</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      placeholder="dd/mm/yyyy"
                      className="custom-select-height"
                      value={
                        convertToApplicationFormik.values.coachingDetails
                          .endDate
                          ? formatDate(
                              parseDate(
                                convertToApplicationFormik.values
                                  .coachingDetails.endDate,
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
                              "coachingDetails.endDate",
                              toISODate(selectedDate),
                            );
                            setShowCoachingEndDateCalendar(false);
                          }}
                          value={
                            convertToApplicationFormik.values.coachingDetails
                              .endDate
                              ? parseDate(
                                  convertToApplicationFormik.values
                                    .coachingDetails.endDate,
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
                  controlId="coachingDetails.registerFor"
                  className="mb-3"
                >
                  <Form.Label>Student Register For</Form.Label>
                  <Select
                    options={studentRegisterForOptions}
                    onChange={(selectedOption) =>
                      convertToApplicationFormik.setFieldValue(
                        "coachingDetails.registerFor",
                        selectedOption?.value || null,
                      )
                    }
                    value={studentRegisterForOptions.find(
                      (option) =>
                        option.value ===
                        convertToApplicationFormik.values.coachingDetails
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
                  controlId="coachingDetails.coachingRequirement"
                  className="mb-3"
                >
                  <Form.Label>Coaching Requirement</Form.Label>
                  <Select
                    options={coachingRequirementsOptions}
                    onChange={(selectedOption) =>
                      convertToApplicationFormik.setFieldValue(
                        "coachingDetails.coachingRequirement",
                        selectedOption?.value || null,
                      )
                    }
                    value={coachingRequirementsOptions.find(
                      (option) =>
                        option.value ===
                        convertToApplicationFormik.values.coachingDetails
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
                  controlId="coachingDetails.batchStatus"
                  className="mb-3"
                >
                  <Form.Label>Coaching Batches Status</Form.Label>
                  <Select
                    options={batchStatusOptions}
                    onChange={(selectedOption) => {
                      const batchStatus = selectedOption?.value || "";

                      // ✅ current selected branch from formik
                      const branchValue =
                        convertToApplicationFormik.values.coachingDetails
                          .branch || "";

                      convertToApplicationFormik.setFieldValue(
                        "coachingDetails.batchStatus",
                        batchStatus,
                      );

                      // ✅ batchStatus + branch dono pass
                      fetchCoachingFaculties(batchStatus, branchValue);

                      fetchBatchTimes(
                        convertToApplicationFormik.values.coachingDetails
                          .batchFaculty || "",
                        batchStatus,
                      );
                    }}
                    value={batchStatusOptions.find(
                      (option) =>
                        option.value ===
                        convertToApplicationFormik.values.coachingDetails
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
                          "coachingDetails.branch",
                          branchValue,
                        );

                        fetchCoachingFaculties(
                          convertToApplicationFormik.values.coachingDetails
                            .batchStatus || "",
                          branchValue || "",
                        );
                      }}
                      value={
                        convertToApplicationFormik.values.coachingDetails
                          .branch === null
                          ? branchOptions.find(
                              (opt) => opt.value === "HeadOffice",
                            )
                          : branchOptions.find(
                              (opt) =>
                                opt.value ===
                                convertToApplicationFormik.values
                                  .coachingDetails.branch,
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
                    controlId="coachingDetails.batchFaculty"
                    className="mb-3"
                  >
                    <Form.Label>Batch Faculty</Form.Label>
                    <Select
                      options={coachingFacultiesOptions}
                      onChange={(selectedOption) => {
                        convertToApplicationFormik.setFieldValue(
                          "coachingDetails.batchFaculty",
                          selectedOption?.value || null,
                        );
                        fetchBatchTimes(
                          selectedOption?.value || "",
                          convertToApplicationFormik.values.coachingDetails
                            .batchStatus,
                        );
                      }}
                      value={coachingFacultiesOptions.find(
                        (option) =>
                          option.value ===
                          convertToApplicationFormik.values.coachingDetails
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
                  controlId="coachingDetails.batchTiming"
                  className="mb-3"
                >
                  <Form.Label>Batch Timing</Form.Label>
                  <Select
                    options={batchTimesOptions}
                    onChange={(selectedOption) =>
                      convertToApplicationFormik.setFieldValue(
                        "coachingDetails.batchTiming",
                        selectedOption?.value || "",
                      )
                    }
                    value={batchTimesOptions?.find(
                      (option) =>
                        option.value ===
                        convertToApplicationFormik.values.coachingDetails
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
                  controlId="coachingDetails.examRegistrationDate"
                  className="mb-3"
                >
                  <Form.Label>Exam Date</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      placeholder="dd/mm/yyyy"
                      className="custom-select-height"
                      value={
                        convertToApplicationFormik.values.coachingDetails
                          .examRegistrationDate
                          ? formatDate(
                              parseDate(
                                convertToApplicationFormik.values
                                  .coachingDetails.examRegistrationDate,
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
                              "coachingDetails.examRegistrationDate",
                              toISODate(selectedDate),
                            );
                            setShowExamDateCalendar(false);
                          }}
                          value={
                            convertToApplicationFormik.values.coachingDetails
                              .examRegistrationDate
                              ? parseDate(
                                  convertToApplicationFormik.values
                                    .coachingDetails.examRegistrationDate,
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
                  controlId="coachingDetails.remarks"
                  className="mb-3"
                >
                  <Form.Label>Counsellor Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="coachingDetails.remarks"
                    value={
                      convertToApplicationFormik.values.coachingDetails.remarks
                    }
                    onChange={convertToApplicationFormik.handleChange}
                    className="rounded-4"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group
                  controlId="coachingDetails.targetedScore"
                  className="mb-3"
                >
                  <Form.Label>Targeted Score</Form.Label>
                  <Form.Control
                    type="number"
                    name="coachingDetails.targetedScore"
                    className="custom-select-height"
                    value={
                      convertToApplicationFormik.values.coachingDetails
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
                  controlId="coachingDetails.hasGivenExam"
                  className="mb-4"
                >
                  <Form.Label>Has Client Given any Language Exam</Form.Label>
                  <Select
                    options={hasClientLanguage}
                    onChange={(selectedOption) =>
                      convertToApplicationFormik.setFieldValue(
                        "coachingDetails.hasGivenExam",
                        selectedOption?.value === true,
                      )
                    }
                    value={hasClientLanguage.find(
                      (option) =>
                        option.value ===
                        (convertToApplicationFormik.values.coachingDetails
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

              {convertToApplicationFormik.values.coachingDetails
                .hasGivenExam && (
                <>
                  {convertToApplicationFormik.values.coachingDetails.examDetails.map(
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
                              controlId={`coachingDetails.examDetails[${index}].examName`}
                              className=""
                            >
                              <Form.Label>Exam Name</Form.Label>
                              <Form.Control
                                type="text"
                                name={`coachingDetails.examDetails[${index}].examName`}
                                value={
                                  convertToApplicationFormik.values
                                    .coachingDetails.examDetails[index].examName
                                }
                                onChange={
                                  convertToApplicationFormik.handleChange
                                }
                                onBlur={convertToApplicationFormik.handleBlur}
                                className="custom-select-height"
                                placeholder="Enter Exam Name"
                              />
                              {convertToApplicationFormik.touched
                                .coachingDetails?.examDetails?.[index]
                                ?.examName &&
                                convertToApplicationFormik.errors
                                  .coachingDetails?.examDetails?.[index]
                                  ?.examName && (
                                  <div className="text-danger">
                                    {
                                      convertToApplicationFormik.errors
                                        .coachingDetails.examDetails[index]
                                        .examName
                                    }
                                  </div>
                                )}
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group
                              controlId={`coachingDetails.examDetails[${index}].scoreFile`}
                              className="mb-3"
                            >
                              <Form.Label>Upload Document</Form.Label>
                              <Form.Control
                                type="file"
                                name={`coachingDetails.examDetails[${index}].scoreFile`}
                                onChange={(event) => {
                                  convertToApplicationFormik.setFieldValue(
                                    `coachingDetails.examDetails[${index}].scoreFile`,
                                    event.currentTarget.files[0],
                                  );
                                }}
                                onBlur={convertToApplicationFormik.handleBlur}
                                className="custom-select-height"
                              />
                              {convertToApplicationFormik.touched
                                .coachingDetails?.examDetails?.[index]
                                ?.scoreFile &&
                                convertToApplicationFormik.errors
                                  .coachingDetails?.examDetails?.[index]
                                  ?.scoreFile && (
                                  <div className="text-danger">
                                    {
                                      convertToApplicationFormik.errors
                                        .coachingDetails.examDetails[index]
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
                                controlId={`coachingDetails.examDetails[${index}].scores.${scoreType}`}
                                className="mb-3"
                              >
                                <Form.Label>
                                  {scoreType.charAt(0).toUpperCase() +
                                    scoreType.slice(1)}{" "}
                                  Score
                                </Form.Label>
                                <Form.Control
                                  type="number"
                                  name={`coachingDetails.examDetails[${index}].scores.${scoreType}`}
                                  value={
                                    convertToApplicationFormik.values
                                      .coachingDetails.examDetails[index]
                                      .scores[scoreType]
                                  }
                                  onChange={
                                    convertToApplicationFormik.handleChange
                                  }
                                  onBlur={convertToApplicationFormik.handleBlur}
                                  className="custom-select-height"
                                  placeholder={`Enter ${scoreType} score`}
                                />
                                {convertToApplicationFormik.touched
                                  .coachingDetails?.examDetails?.[index]
                                  ?.scores?.[scoreType] &&
                                  convertToApplicationFormik.errors
                                    .coachingDetails?.examDetails?.[index]
                                    ?.scores?.[scoreType] && (
                                    <div className="text-danger">
                                      {
                                        convertToApplicationFormik.errors
                                          .coachingDetails.examDetails[index]
                                          .scores[scoreType]
                                      }
                                    </div>
                                  )}
                              </Form.Group>
                            </Col>
                          ))}
                          {convertToApplicationFormik.values.coachingDetails
                            .examDetails.length > 1 && (
                            <Col md={12} className="mb-3">
                              <Button
                                variant="outline-danger"
                                className="custom-select-height"
                                onClick={() => {
                                  const updatedExams = [
                                    ...convertToApplicationFormik.values
                                      .coachingDetails.examDetails,
                                  ];
                                  updatedExams.splice(index, 1);
                                  convertToApplicationFormik.setFieldValue(
                                    "coachingDetails.examDetails",
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
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group
                        controlId="coachingDetails.subPlan"
                        className="mb-3"
                      >
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
                                convertToApplicationFormik.values
                                  .coachingDetails.subPlan,
                            )}
                          onChange={(option) => {
                            const subPlanValue = option?.value || "";
                            convertToApplicationFormik.setFieldValue(
                              "coachingDetails.subPlan",
                              subPlanValue,
                            );

                            if (!subPlanValue) {
                              convertToApplicationFormik.setFieldValue(
                                "coachingDetails.amount",
                                "",
                              );
                              convertToApplicationFormik.setFieldValue(
                                "coachingDetails.payableAmount",
                                "",
                              );
                              convertToApplicationFormik.setFieldValue(
                                "coachingDetails.dueAmount",
                                "",
                              );
                              convertToApplicationFormik.setFieldValue(
                                "coachingDetails.paidAmount",
                                [
                                  {
                                    amount: "",
                                    date: "",
                                    bank: "",
                                    paymentMode: "",
                                  },
                                ],
                              );
                            }
                          }}
                          placeholder="Select Coaching Sub Plan"
                          styles={selectStyles}
                          isClearable
                          isLoading={isLoadingSubPlan}
                          noOptionsMessage={() =>
                            coachingSubPlans.length === 0
                              ? "No sub-plans available. Please check if main plans are loaded."
                              : "No sub-plans found."
                          }
                        />
                        {convertToApplicationFormik.touched.coachingDetails
                          ?.subPlan &&
                          convertToApplicationFormik.errors.coachingDetails
                            ?.subPlan && (
                            <div className="text-danger">
                              {
                                convertToApplicationFormik.errors
                                  .coachingDetails?.subPlan
                              }
                            </div>
                          )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group
                        controlId="coachingDetails.amount"
                        className="mb-3"
                      >
                        <Form.Label>Plan Amount</Form.Label>
                        <Form.Control
                          type="text"
                          name="coachingDetails.amount"
                          value={
                            convertToApplicationFormik.values.coachingDetails
                              .amount
                          }
                          onChange={convertToApplicationFormik.handleChange}
                          className="custom-select-height"
                          disabled
                          readOnly
                        />
                        {convertToApplicationFormik.touched.coachingDetails
                          ?.amount &&
                          convertToApplicationFormik.errors.coachingDetails
                            ?.amount && (
                            <div className="text-danger">
                              {
                                convertToApplicationFormik.errors
                                  .coachingDetails?.amount
                              }
                            </div>
                          )}
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group
                        controlId="coachingDetails.discount"
                        className="mb-3"
                      >
                        <Form.Label>Discount</Form.Label>
                        <Form.Control
                          type="text"
                          name="coachingDetails.discount"
                          value={
                            convertToApplicationFormik.values.coachingDetails
                              .discount
                          }
                          onChange={convertToApplicationFormik.handleChange}
                          className="custom-select-height"
                          // placeholder="e.g., 10%"
                        />
                        {convertToApplicationFormik.touched.coachingDetails
                          ?.discount &&
                          convertToApplicationFormik.errors.coachingDetails
                            ?.discount && (
                            <div className="text-danger">
                              {
                                convertToApplicationFormik.errors
                                  .coachingDetails?.discount
                              }
                            </div>
                          )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group
                        controlId="coachingDetails.discountAmount"
                        className="mb-3"
                      >
                        <Form.Label>Discount Amount</Form.Label>
                        <Form.Control
                          type="text"
                          name="coachingDetails.discountAmount"
                          value={
                            convertToApplicationFormik.values.coachingDetails
                              .discountAmount
                          }
                          onChange={convertToApplicationFormik.handleChange}
                          className="custom-select-height"
                          placeholder="e.g., 10"
                        />
                        {convertToApplicationFormik.touched.coachingDetails
                          ?.discountAmount &&
                          convertToApplicationFormik.errors.coachingDetails
                            ?.discountAmount && (
                            <div className="text-danger">
                              {
                                convertToApplicationFormik.errors
                                  .coachingDetails?.discountAmount
                              }
                            </div>
                          )}
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group
                        controlId="coachingDetails.payableAmount"
                        className="mb-3"
                      >
                        <Form.Label>Payable Amount</Form.Label>
                        <Form.Control
                          type="text"
                          name="coachingDetails.payableAmount"
                          value={
                            convertToApplicationFormik.values.coachingDetails
                              .payableAmount
                          }
                          onChange={convertToApplicationFormik.handleChange}
                          className="custom-select-height"
                          disabled
                          readOnly
                        />
                        {convertToApplicationFormik.touched.coachingDetails
                          ?.payableAmount &&
                          convertToApplicationFormik.errors.coachingDetails
                            ?.payableAmount && (
                            <div className="text-danger">
                              {
                                convertToApplicationFormik.errors
                                  .coachingDetails?.payableAmount
                              }
                            </div>
                          )}
                      </Form.Group>
                    </Col>

                    <Col
                      md={6}
                      controlId="coachingDetails.paidAmount[0].amount"
                      className="mb-3"
                    >
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        type="text"
                        name="coachingDetails.paidAmount[0].amount"
                        value={
                          convertToApplicationFormik.values.coachingDetails
                            .paidAmount?.[0]?.amount || ""
                        }
                        onChange={(e) =>
                          handlePaidAmountChange(
                            0,
                            "amount",
                            e.target.value,
                            "coachingDetails",
                          )
                        }
                        className="custom-select-height"
                        placeholder="Enter amount"
                      />
                      {convertToApplicationFormik.touched.coachingDetails
                        ?.paidAmount?.[0]?.amount &&
                        convertToApplicationFormik.errors.coachingDetails
                          ?.paidAmount?.[0]?.amount && (
                          <div className="text-danger mt-1">
                            {
                              convertToApplicationFormik.errors.coachingDetails
                                .paidAmount[0].amount
                            }
                          </div>
                        )}
                    </Col>

                    <Col
                      md={6}
                      controlId="coachingDetails.paidAmount[0].paymentMode"
                      className="mb-3"
                    >
                      <Form.Label>Payment Mode</Form.Label>
                      <Select
                        options={paymentModeOptions}
                        value={
                          paymentModeOptions.find(
                            (option) =>
                              option.value ===
                              convertToApplicationFormik.values.coachingDetails
                                .paidAmount?.[0]?.paymentMode,
                          ) || null
                        }
                        onChange={(option) =>
                          handlePaidAmountChange(
                            0,
                            "paymentMode",
                            option ? option.value : "",
                            "coachingDetails",
                          )
                        }
                        placeholder="Select mode"
                        styles={selectStyles}
                      />
                      {convertToApplicationFormik.touched.coachingDetails
                        ?.paidAmount?.[0]?.paymentMode &&
                        convertToApplicationFormik.errors.coachingDetails
                          ?.paidAmount?.[0]?.paymentMode && (
                          <div className="text-danger mt-1">
                            {
                              convertToApplicationFormik.errors.coachingDetails
                                .paidAmount[0].paymentMode
                            }
                          </div>
                        )}
                    </Col>

                    {(convertToApplicationFormik.values.coachingDetails
                      ?.paidAmount[0]?.paymentMode === "GPay" ||
                      convertToApplicationFormik.values.coachingDetails
                        ?.paidAmount[0]?.paymentMode === "Bank" ||
                      convertToApplicationFormik.values.coachingDetails
                        ?.paidAmount[0]?.paymentMode === "UPI") && (
                      <Col
                        md={6}
                        controlId="coachingDetails.paidAmount[0].bank"
                        className="mb-3"
                      >
                        <Form.Label>Bank</Form.Label>
                        <Select
                          options={bankOptions}
                          value={
                            bankOptions.find(
                              (option) =>
                                option.value ===
                                convertToApplicationFormik.values
                                  .coachingDetails.paidAmount?.[0]?.bank,
                            ) || null
                          }
                          onChange={(option) =>
                            handlePaidAmountChange(
                              0,
                              "bank",
                              option ? option.value : "",
                              "coachingDetails",
                            )
                          }
                          placeholder="Select bank"
                          styles={selectStyles}
                          isClearable
                        />
                      </Col>
                    )}

                    <Col
                      md={6}
                      controlId="coachingDetails.paidAmount[0].date"
                      className="mb-3"
                    >
                      <Form.Label>Payment Date</Form.Label>
                      <div style={{ position: "relative" }}>
                        <Form.Control
                          type="text"
                          name="coachingDetails.paidAmount[0].date"
                          value={
                            convertToApplicationFormik.values.coachingDetails
                              .paidAmount?.[0]?.date
                              ? formatDate(
                                  parseDate(
                                    convertToApplicationFormik.values
                                      .coachingDetails.paidAmount[0].date,
                                  ),
                                )
                              : ""
                          }
                          disabled={
                            convertToApplicationFormik.values.coachingDetails
                              .dueAmount === "0" || 0
                          }
                          ref={paidDateInputRef}
                          onClick={() => {
                            if (
                              convertToApplicationFormik.values.coachingDetails
                                .paidAmount?.[0]?.date
                            ) {
                              setPaidDateValue(
                                parseDate(
                                  convertToApplicationFormik.values
                                    .coachingDetails.paidAmount[0].date,
                                ),
                              );
                            }
                            setShowPaidDateCalendar(true);
                          }}
                          className="custom-select-height"
                          placeholder="dd/mm/yyyy"
                          style={{
                            cursor:
                              convertToApplicationFormik.values.coachingDetails
                                .dueAmount === "0" || 0
                                ? "not-allowed"
                                : "pointer",
                            backgroundColor: "#fff",
                          }}
                        />
                        {convertToApplicationFormik.values.coachingDetails
                          .paidAmount?.[0]?.date ? (
                          <button
                            type="button"
                            onClick={() => {
                              handlePaidAmountChange(
                                0,
                                "date",
                                "",
                                "coachingDetails",
                              );
                              setPaidDateValue(null);
                              setShowPaidDateCalendar(false);
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
                        {showPaidDateCalendar && (
                          <div
                            ref={paidDateCalendarRef}
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
                            }}
                          >
                            <Calendar
                              className="form-control m-0 p-0 border-0"
                              onChange={(selectedDate) => {
                                handlePaidAmountChange(
                                  0,
                                  "date",
                                  toISODate(selectedDate),
                                  "coachingDetails",
                                );
                                setPaidDateValue(selectedDate);
                                setShowPaidDateCalendar(false);
                              }}
                              value={paidDateValue}
                              locale="en-GB"
                            />
                          </div>
                        )}
                      </div>
                    </Col>

                    <Col md={6}>
                      <Form.Group
                        controlId="coachingDetails.dueAmount"
                        className="mb-3"
                      >
                        <Form.Label>Receivable Amount</Form.Label>
                        <Form.Control
                          type="text"
                          name="coachingDetails.dueAmount"
                          value={
                            convertToApplicationFormik.values.coachingDetails
                              .dueAmount
                          }
                          onChange={convertToApplicationFormik.handleChange}
                          className="custom-select-height"
                          disabled
                          readOnly
                        />
                        {convertToApplicationFormik.touched.coachingDetails
                          ?.dueAmount &&
                          convertToApplicationFormik.errors.coachingDetails
                            ?.dueAmount && (
                            <div className="text-danger">
                              {
                                convertToApplicationFormik.errors
                                  .coachingDetails?.dueAmount
                              }
                            </div>
                          )}
                      </Form.Group>
                    </Col>
                  </Row>
                </>
              )}
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button
                variant="link"
                className="custom-select-height btn border-primary text-primary text-decoration-none"
                onClick={() => {
                  setShowConvertModal(false);
                  convertToApplicationFormik.resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="custom-select-height"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Confirm"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ConvertToCoaching;
