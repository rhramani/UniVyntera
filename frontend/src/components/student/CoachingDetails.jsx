import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  deleteStudentApplication,
  getAccountant,
  getOneStudentApplication,
  updateStudentApplication,
} from "../../redux/actions/Student/StudentApplication.action";
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoadMoreButton from "../commonComponents/LoadMoreButton";
import CoachingStudentInfo from "./coachingDetails/CoachingStudentInfo";
import CoachingTabs from "./coachingDetails/CoachingTabs";
import { decryptData } from "../../utils/encryptionUtils";
import Select from "react-select";
import DataTable from "../commonComponents/DataTable";
import Calendar from "react-calendar";
import { MdCalendarToday } from "react-icons/md";
import { toast } from "react-toastify";
import { getAllCoachingFaculty } from "../../redux/actions/Master/CoachingFaculty.action";
import usePermissions from "../commonComponents/usePermissions";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getAllSubject } from "../../redux/actions/Master/CoachingSubject.action";
import { getAllLevel } from "../../redux/actions/Master/CoachingLevel.action";
import { getAllMainPlan } from "../../redux/actions/Master/MainPlan.action";
import ApplicationAccountant from "./ApplicationAccountant";
import { BASEURL } from "../../baseUrl";
import { getAllBranch } from "../../redux/actions/Branch.action";

const CoachingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [coachingSubject, setCoachingSubject] = useState([]);
  const [coachingLevel, setCoachingLevel] = useState([]);

  const [accountantData, setAccountantData] = useState([]);
  const [totalData, setTotalData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [oneStudentData, setOneStudentData] = useState(null);
  const [selectedPersonalSection, setSelectedPersonalSection] = useState("all");
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [edit, setEdit] = useState({
    remarkDetails: false,
    remarkDetailsIndex: 0,
    remarkDetailsObj: null,
  });

  const [formData, setFormData] = useState({
    remarkHistory: [],
    mockTestDetails: [],
    masterSessionDetails: [],
    targetAchieved: {},
    subjectLevelDetails: [],
  });
  const [showMockTestModal, setShowMockTestModal] = useState(false);
  const [editMockTest, setEditMockTest] = useState({
    isEditing: false,
    mockTestId: null,
    mockTestData: null,
  });
  const [showMasterSessionModal, setShowMasterSessionModal] = useState(false);
  const [editMasterSession, setEditMasterSession] = useState({
    isEditing: false,
    masterSessionId: null,
    masterSessionData: null,
  });

  const [showTargetAchievedModal, setShowTargetAchievedModal] = useState(false);
  const [editTargetAchieved, setEditTargetAchieved] = useState({
    isEditing: false,
    targetAchievedData: null,
  });
  const [showSubjectGradeModal, setShowSubjectGradeModal] = useState(false);
  const [editSubjectGrade, setEditSubjectGrade] = useState({
    isEditing: false,
    subjectGradeData: null,
    subjectLevelId: null,
  });

  const achievedDateInputRef = useRef(null);
  const achievedDateCalendarRef = useRef(null);
  const [showAchievedDateCalendar, setShowAchievedDateCalendar] =
    useState(false);

  const [showMockTestDateCalendar, setShowMockTestDateCalendar] =
    useState(false);
  const [showMockTestAssmtDateCalendar, setShowMockTestAssmtDateCalendar] =
    useState(false);
  const [showSessionDateCalendar, setShowSessionDateCalendar] = useState(false);
  const [
    showMasterSessionAssmtDateCalendar,
    setShowMasterSessionAssmtDateCalendar,
  ] = useState(false);

  const [facultyOptions, setFacultyOptions] = useState([]);
  const { canUpdate, canCreate } = usePermissions("Coaching Students");

  const [branchList, setBranchList] = useState([]);

  const mockTestDateInputRef = useRef(null);
  const mockTestAssmtDateInputRef = useRef(null);
  const sessionDateInputRef = useRef(null);
  const masterSessionAssmtDateInputRef = useRef(null);

  const mockTestDateCalendarRef = useRef(null);
  const mockTestAssmtDateCalendarRef = useRef(null);
  const sessionDateCalendarRef = useRef(null);
  const masterSessionAssmtDateCalendarRef = useRef(null);

  const userRole = decryptData(localStorage.getItem("role"));
  const userType = decryptData(localStorage.getItem("userRole"));
  const branchID = decryptData(localStorage.getItem("userId"));
  const branchUserId = decryptData(localStorage.getItem("branchId"));

  const derivedBranchValue =
    userRole === "Branch"
      ? branchID
      : userType === "Branch User"
        ? branchUserId
        : null;

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showMockTestDateCalendar &&
        mockTestDateCalendarRef.current &&
        !mockTestDateCalendarRef.current.contains(event.target) &&
        mockTestDateInputRef.current &&
        !mockTestDateInputRef.current.contains(event.target)
      ) {
        setShowMockTestDateCalendar(false);
      }
      if (
        showMockTestAssmtDateCalendar &&
        mockTestAssmtDateCalendarRef.current &&
        !mockTestAssmtDateCalendarRef.current.contains(event.target) &&
        mockTestAssmtDateInputRef.current &&
        !mockTestAssmtDateInputRef.current.contains(event.target)
      ) {
        setShowMockTestAssmtDateCalendar(false);
      }
      if (
        showSessionDateCalendar &&
        sessionDateCalendarRef.current &&
        !sessionDateCalendarRef.current.contains(event.target) &&
        sessionDateInputRef.current &&
        !sessionDateInputRef.current.contains(event.target)
      ) {
        setShowSessionDateCalendar(false);
      }
      if (
        showMasterSessionAssmtDateCalendar &&
        masterSessionAssmtDateCalendarRef.current &&
        !masterSessionAssmtDateCalendarRef.current.contains(event.target) &&
        masterSessionAssmtDateInputRef.current &&
        !masterSessionAssmtDateInputRef.current.contains(event.target)
      ) {
        setShowMasterSessionAssmtDateCalendar(false);
      }

      if (
        showAchievedDateCalendar &&
        achievedDateCalendarRef.current &&
        !achievedDateCalendarRef.current.contains(event.target) &&
        achievedDateInputRef.current &&
        !achievedDateInputRef.current.contains(event.target)
      ) {
        setShowAchievedDateCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    showMockTestDateCalendar,
    showMockTestAssmtDateCalendar,
    showSessionDateCalendar,
    showMasterSessionAssmtDateCalendar,
    showAchievedDateCalendar,
  ]);

  const fetchFacultyOptions = async (branchValue = "", showAll = false) => {
    try {
      const finalBranchId =
        branchValue ||
        (userType === "Branch User"
          ? branchUserId
          : userRole === "Branch"
            ? branchID
            : "");

      const res = await dispatch(
        getAllCoachingFaculty(1, 1000, "", "", showAll, finalBranchId)
      );
      const facultyData = res?.data?.data?.data || [];
      const options = facultyData.map((faculty) => ({
        value: faculty._id,
        label: faculty.name,
      }));
      setFacultyOptions(options);
      return options;
    } catch (error) {
      console.error("Error fetching faculty options:", error);
      toast.error("Failed to fetch faculty data");
    }
  };

  const fetchOneStudentDetails = async () => {
    setIsLoading(true);
    try {
      const res = await dispatch(getOneStudentApplication(id));
      const studentData = res?.data?.data;
      setOneStudentData(studentData);
      setFormData({
        remarkHistory: studentData?.coachingDetails?.remarkHistory || [],
        mockTestDetails: studentData?.coachingDetails?.mockTestDetails || [],
        masterSessionDetails:
          studentData?.coachingDetails?.masterSessionDetails || [],
        targetAchieved: studentData?.coachingDetails?.targetAchieved || {},
        subjectLevelDetails:
          studentData?.coachingDetails?.subjectLevelDetails || [],
      });
    } catch (error) {
      console.log("Error fetching in coaching student data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllSubject = async () => {
    try {
      const res = await dispatch(getAllSubject(1, 1000, ""));
      if (res?.status === 200) {
        setCoachingSubject(res?.data?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };
  const fetchAllLevel = async () => {
    try {
      const res = await dispatch(getAllLevel(1, 1000, ""));
      if (res?.status === 200) {
        setCoachingLevel(res?.data?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const subjectOptions = coachingSubject?.map((subject) => ({
    value: subject._id,
    label: subject.name,
  }));
  const levelOptions = coachingLevel?.map((level) => ({
    value: level._id,
    label: level.name,
  }));

  useEffect(() => {
    fetchOneStudentDetails();
    fetchFacultyOptions();
    fetchAllSubject();
    fetchAllLevel();
  }, [id]);

  const fetchMainPlans = async () => {
    try {
      const res = await dispatch(getAllMainPlan());
      const plans = res?.data?.data?.data || [];

      const admissionPlan = plans.find(
        (plan) => plan.name.toLowerCase() === "coaching"
      );

      if (admissionPlan?._id && id) {
        await fetchAccountant(admissionPlan._id);
      }
    } catch (error) {
      console.error("Error fetching main plans:", error);
    }
  };

  const fetchAccountant = async (mainPlanId) => {
    try {
      const res = await dispatch(getAccountant(id, mainPlanId));
      setAccountantData(res?.data?.data?.data);
      setTotalData(res?.data?.data?.totals);
    } catch (error) {
      console.log("Error fetching in get Accountant Data : ", error);
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

  useEffect(() => {
    fetchMainPlans();
    fetchAllBranches();
  }, [id]);

  // Formik setup for remark form
  const remarkFormik = useFormik({
    initialValues: {
      remarkHistory: [{ remark: "" }],
    },
    validationSchema: Yup.object({
      remarkHistory: Yup.array().of(
        Yup.object({
          remark: Yup.string().required("Remark is required"),
        })
      ),
    }),
    onSubmit: async (values) => {
      try {
        const remarkData = values.remarkHistory[0];
        const payload = new FormData();

        if (edit.remarkDetails) {
          const existingRemark = edit.remarkDetailsObj;
          if (!existingRemark || !existingRemark._id) {
            toast.error("Remark ID not found. Cannot update.");
            return;
          }
          payload.append("remarksId", existingRemark._id);
          payload.append("updatedRemark", remarkData.remark);
        } else {
          payload.append("remarkHistory", remarkData.remark);
        }

        const res = await dispatch(updateStudentApplication(payload, id));
        if (res?.status === 200) {
          toast.success(
            edit.remarkDetails
              ? "Remark updated successfully!"
              : "Remark added successfully!"
          );
          await fetchOneStudentDetails();
          setShowRemarkModal(false);
          remarkFormik.resetForm();
          setEdit({
            remarkDetails: false,
            remarkDetailsIndex: 0,
            remarkDetailsObj: null,
          });
        }
      } catch (error) {
        console.error("Error updating remark:", error);
        toast.error("Failed to update remark");
      }
    },
  });

  const handleDeleteRemark = async (remarksId) => {
    try {
      const payload = { remarksId };
      const res = await dispatch(deleteStudentApplication(payload, id));
      if (res?.status === 200) {
        toast.success("Remark deleted successfully!");
        fetchOneStudentDetails();
      }
    } catch (error) {
      console.error("Error deleting Remark:", error);
    }
  };

  // Formik setup for Mock Test form
  const mockTestFormik = useFormik({
    initialValues: {
      testDate: "",
      branch: userType === "Branch User" ? branchUserId : derivedBranchValue,
      faculty: userRole === "Coaching Faculty" ? branchID : null,
      AssmtDate: "",
      testAssmt: "",
      listening: "",
      reading: "",
      writing: "",
      speaking: "",
      total: "",
      mockFile: "",
    },
    validationSchema: Yup.object({
      testDate: Yup.string().required("Mock Test Date is required"),
      AssmtDate: Yup.string().required("Assessment Date is required"),
      testAssmt: Yup.string().required("Mock Test Assessment is required"),
      branch: Yup.string().nullable(),
      listening: Yup.number().nullable(),
      reading: Yup.number().nullable(),
      writing: Yup.number().nullable(),
      speaking: Yup.number().nullable(),
      total: Yup.number().nullable(),
      mockFile: Yup.string().nullable(),
    }),
    onSubmit: async (values) => {
      try {
        const payload = new FormData();

        const testDate = parseDate(values.testDate);
        const assmtDate = parseDate(values.AssmtDate);

        if (editMockTest.isEditing) {
          payload.append("mockTestId", editMockTest.mockTestId);
          payload.append(
            "mockTestUpdate[testDate]",
            testDate ? toISODate(testDate) : ""
          );

          payload.append("mockTestDetails[branch]", values.branch || null);
          payload.append(
            "mockTestUpdate[faculty]",
            values.faculty?.value || ""
          );
          payload.append(
            "mockTestUpdate[AssmtDate]",
            assmtDate ? toISODate(assmtDate) : ""
          );
          payload.append("mockTestUpdate[testAssmt]", values.testAssmt);
          payload.append("mockTestUpdate[reading]", values.reading || "");
          payload.append("mockTestUpdate[writing]", values.writing || "");
          payload.append("mockTestUpdate[speaking]", values.speaking || "");
          payload.append("mockTestUpdate[listening]", values.listening || "");
          payload.append("mockTestUpdate[total]", values.total || "");
          if (values.mockFile) {
            payload.append("mockTestDoc", values.mockFile);
          }
        } else {
          payload.append(
            "mockTestDetails[testDate]",
            testDate ? toISODate(testDate) : ""
          );
          payload.append("mockTestDetails[branch]", values.branch || null);
          payload.append(
            "mockTestDetails[faculty]",
            values.faculty?.value || ""
          );
          payload.append(
            "mockTestDetails[AssmtDate]",
            assmtDate ? toISODate(assmtDate) : ""
          );
          payload.append("mockTestDetails[testAssmt]", values.testAssmt);
          payload.append("mockTestDetails[reading]", values.reading || "");
          payload.append("mockTestDetails[writing]", values.writing || "");
          payload.append("mockTestDetails[speaking]", values.speaking || "");
          payload.append("mockTestDetails[listening]", values.listening || "");
          payload.append("mockTestDetails[total]", values.total || "");
          if (values.mockFile) {
            payload.append("mockTestDoc", values.mockFile);
          }
        }

        const res = await dispatch(updateStudentApplication(payload, id));
        if (res?.status === 200) {
          toast.success(
            editMockTest.isEditing
              ? "Mock Test updated successfully!"
              : "Mock Test added successfully!"
          );
          await fetchOneStudentDetails();
          setShowMockTestModal(false);
          mockTestFormik.resetForm();
          setEditMockTest({
            isEditing: false,
            mockTestId: null,
            mockTestData: null,
          });
        }
      } catch (error) {
        console.error("Error processing mock test:", error);
        toast.error(
          editMockTest.isEditing
            ? "Failed to update mock test"
            : "Failed to add mock test"
        );
      }
    },
  });

  const handleDeleteMockTest = async (mockTestId) => {
    try {
      const payload = { mockTestId };
      const res = await dispatch(deleteStudentApplication(payload, id));
      if (res?.status === 200) {
        toast.success("Mock Test deleted successfully!");
        fetchOneStudentDetails();
      }
    } catch (error) {
      console.error("Error deleting Mock Test:", error);
    }
  };

  // Formik setup for Master Session form
  const masterSessionFormik = useFormik({
    initialValues: {
      testDate: "",
      branch: userType === "Branch User" ? branchUserId : derivedBranchValue,
      faculty: userRole === "Coaching Faculty" ? branchID : null,
      AssmtDate: "",
      testAssmt: "",
      listening: "",
      reading: "",
      writing: "",
      speaking: "",
      total: "",
    },
    validationSchema: Yup.object({
      testDate: Yup.string().required("Master session Date is required"),
      AssmtDate: Yup.string().required("Assessment Date is required"),
      testAssmt: Yup.string().required("Master session Assessment is required"),
      branch: Yup.string().nullable(),
      listening: Yup.number().nullable(),
      reading: Yup.number().nullable(),
      writing: Yup.number().nullable(),
      speaking: Yup.number().nullable(),
      total: Yup.number().nullable(),
    }),
    onSubmit: async (values) => {
      try {
        let payload;

        const testDate = parseDate(values.testDate);
        const assmtDate = parseDate(values.AssmtDate);

        if (editMasterSession.isEditing) {
          payload = {
            masterSessionId: editMasterSession.masterSessionId,
            masterSessionUpdate: {
              testDate: testDate ? toISODate(testDate) : "",
              branch: values.branch || null,
              faculty: values.faculty?.value || "",
              AssmtDate: assmtDate ? toISODate(assmtDate) : "",
              testAssmt: values.testAssmt,
              reading: values.reading || "",
              writing: values.writing || "",
              speaking: values.speaking || "",
              listening: values.listening || "",
              total: values.total || "",
            },
          };
        } else {
          payload = {
            masterSessionDetails: {
              testDate: testDate ? toISODate(testDate) : "",
              branch: values.branch || null,
              faculty: values.faculty?.value || "",
              AssmtDate: assmtDate ? toISODate(assmtDate) : "",
              testAssmt: values.testAssmt,
              reading: values.reading || "",
              writing: values.writing || "",
              speaking: values.speaking || "",
              listening: values.listening || "",
              total: values.total || "",
            },
          };
        }

        const res = await dispatch(updateStudentApplication(payload, id));
        if (res?.status === 200) {
          toast.success(
            editMasterSession.isEditing
              ? "Master Session updated successfully!"
              : "Master Session added successfully!"
          );
          await fetchOneStudentDetails();
          setShowMasterSessionModal(false);
          masterSessionFormik.resetForm();
          setEditMasterSession({
            isEditing: false,
            masterSessionId: null,
            masterSessionData: null,
          });
        }
      } catch (error) {
        console.error("Error processing master session:", error);
        toast.error(
          editMasterSession.isEditing
            ? "Failed to update master session"
            : "Failed to add master session"
        );
      }
    },
  });

  const handleDeleteMasterSession = async (masterSessionId) => {
    try {
      const payload = { masterSessionId };
      const res = await dispatch(deleteStudentApplication(payload, id));
      if (res?.status === 200) {
        toast.success("Master session deleted successfully!");
        fetchOneStudentDetails();
      }
    } catch (error) {
      console.error("Error deleting Master session:", error);
    }
  };

  const targetAchievedFormik = useFormik({
    initialValues: {
      date: "",
      scores: {
        reading: "",
        writing: "",
        speaking: "",
        listening: "",
        total: "",
      },
      resultFile: "",
    },
    validationSchema: Yup.object({
      date: Yup.string().required("Achieved Date is required"),
      scores: Yup.object({
        reading: Yup.number().nullable(),
        writing: Yup.number().nullable(),
        speaking: Yup.number().nullable(),
        listening: Yup.number().nullable(),
        total: Yup.number().nullable(),
      }),
      resultFile: Yup.string().nullable(),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const payload = new FormData();
        const date = parseDate(values.date);

        if (editTargetAchieved.isEditing) {
          payload.append(
            "targetAchievedDetails[date]",
            date ? toISODate(date) : ""
          );
          payload.append(
            "targetAchievedDetails[scores][reading]",
            values.scores.reading || ""
          );
          payload.append(
            "targetAchievedDetails[scores][writing]",
            values.scores.writing || ""
          );
          payload.append(
            "targetAchievedDetails[scores][speaking]",
            values.scores.speaking || ""
          );
          payload.append(
            "targetAchievedDetails[scores][listening]",
            values.scores.listening || ""
          );
          payload.append(
            "targetAchievedDetails[scores][total]",
            values.scores.total || ""
          );
          if (values.resultFile) {
            payload.append("resultDoc", values.resultFile);
          }
        } else {
          payload.append(
            "targetAchievedDetails[date]",
            date ? toISODate(date) : ""
          );
          payload.append(
            "targetAchievedDetails[scores][reading]",
            values.scores.reading || ""
          );
          payload.append(
            "targetAchievedDetails[scores][writing]",
            values.scores.writing || ""
          );
          payload.append(
            "targetAchievedDetails[scores][speaking]",
            values.scores.speaking || ""
          );
          payload.append(
            "targetAchievedDetails[scores][listening]",
            values.scores.listening || ""
          );
          payload.append(
            "targetAchievedDetails[scores][total]",
            values.scores.total || ""
          );
          if (values.resultFile) {
            payload.append("resultDoc", values.resultFile);
          }
        }

        const res = await dispatch(updateStudentApplication(payload, id));
        if (res?.status === 200) {
          toast.success(
            editTargetAchieved.isEditing
              ? "Target Achieved updated successfully!"
              : "Target Achieved added successfully!"
          );

          fetchOneStudentDetails();
          setShowTargetAchievedModal(false);
          targetAchievedFormik.resetForm();
          setEditTargetAchieved({
            isEditing: false,
            targetAchievedData: null,
          });
        }
      } catch (error) {
        console.error("Error updating target achieved details:", error);
        toast.error(
          error?.response?.data?.message ||
          "Failed to update target achieved details"
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  const subjectGradeFormik = useFormik({
    initialValues: {
      subject: null,
      level: null,
      remarks: "",
    },
    validationSchema: Yup.object({
      subject: Yup.string().nullable(),
      level: Yup.string().nullable(),
      remarks: Yup.string().nullable(),
    }),
    onSubmit: async (values) => {
      try {
        let payload;
        setIsLoading(true);

        if (editSubjectGrade.isEditing) {
          payload = {
            subjectLevelId: editSubjectGrade.subjectLevelId,
            subjectLevelUpdate: {
              subject: values.subject || null,
              level: values.level || null,
              remarks: values.remarks || "",
            },
          };
        } else {
          payload = {
            subjectLevelDetails: {
              subject: values.subject || null,
              level: values.level || null,
              remarks: values.remarks || "",
            },
          };
        }

        const res = await dispatch(updateStudentApplication(payload, id));

        if (res?.status === 200) {
          toast.success(
            editSubjectGrade.isEditing
              ? "Subject grade updated successfully!"
              : "Subject grade added successfully!"
          );
          fetchOneStudentDetails();
          setShowSubjectGradeModal(false);
          subjectGradeFormik.resetForm();
          setEditSubjectGrade({
            isEditing: false,
            subjectLevelId: null,
            subjectLevelData: null,
          });
        }
      } catch (error) {
        console.error("Error adding/updating subject grade:", error);
        toast.error("Failed to process subject grade");
      } finally {
        setIsLoading(false);
      }
    },
  });

  // const handleDeleteSubjectGrade = async (subjectLevelId) => {
  //     try {
  //       const payload = { subjectLevelId };
  //       const res = await dispatch(deleteStudentApplication(payload, id));
  //       if (res?.status === 200) {
  //         toast.success("Subject Grade deleted successfully!");
  //         fetchOneStudentDetails();
  //       }
  //     } catch (error) {
  //       console.error("Error deleting Subject Grade:", error);
  //     }

  // }

  const handleDeleteTargetAchieved = async () => {
    try {
      const payload = { deleteTargetAchieved: true };
      const res = await dispatch(deleteStudentApplication(payload, id));
      if (res?.status === 200) {
        toast.success("Target Achieved deleted successfully!");
        fetchOneStudentDetails();
      }
    } catch (error) {
      console.error("Error deleting Target Achieved:", error);
    }
  };

  const handlePersonalSectionSelect = (sectionKey) => {
    setSelectedPersonalSection(sectionKey);
  };

  const remarkColumns = [
    {
      label: "Date",
      render: (item) =>
        item?.createdAt ? formatDate(parseDate(item?.createdAt)) : "-",
    },
    {
      label: "Remark",
      render: (item) => (item ? item.remarks || "-" : "-"),
      className: "remarkColumn",
    },
    {
      label: "Created by",
      render: (item) => (item ? item.createdByName || "-" : "-"),
    },
    {
      label: "Updated by",
      render: (item) => (item ? item.updatedByName || "-" : "-"),
    },
  ];

  const mockTestColumns = [
    {
      label: "Test Date",
      render: (item) =>
        item?.testDate ? formatDate(parseDate(item?.testDate)) : "-",
    },
    {
      label: "Branch",
      render: (item) =>
        item?.branch === null ? "Head Office" : item?.branch?.name || "-",
    },
    {
      label: "Faculty",
      render: (item) => item?.faculty?.name || "-",
    },
    {
      label: "Assessment Date",
      render: (item) =>
        item?.AssmtDate ? formatDate(parseDate(item?.AssmtDate)) : "-",
    },
    {
      label: "Test Assessment",
      render: (item) => (item ? item.testAssmt || "-" : "-"),
    },
    {
      label: "Reading",
      render: (item) => (item ? item.reading || "-" : "-"),
    },
    {
      label: "Writing",
      render: (item) => (item ? item.writing || "-" : "-"),
    },
    {
      label: "Speaking",
      render: (item) => (item ? item.speaking || "-" : "-"),
    },
    {
      label: "Listening",
      render: (item) => (item ? item.listening || "-" : "-"),
    },
    {
      label: "Overall",
      render: (item) => (item ? item.total || "-" : "-"),
    },
    {
      label: "Document",
      render: (item) =>
        item?.document ? (
          <button
            className="btn btn-sm btn-primary fw-normal d-flex align-items-center justify-content-center rounded-4"
            style={{
              cursor: "pointer",
              height: "32px",
              color: "#6259CA",
              width: "70px",
              fontSize: "14px",
            }}
            onClick={() =>
              window.open(
                `${BASEURL}/${item.document}`,
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            <VisibilityIcon className="me-1" style={{ fontSize: "16px" }} />
            View
          </button>
        ) : (
          "-"
        ),
    },
  ];

  const masterSessionColumns = [
    {
      label: "Session Date",
      render: (item) =>
        item?.testDate ? formatDate(parseDate(item?.testDate)) : "-",
    },
    {
      label: "Branch",
      render: (item) =>
        item?.branch === null ? "Head Office" : item?.branch?.name || "-",
    },
    {
      label: "Faculty",
      render: (item) => item?.faculty?.name || "-",
    },
    {
      label: "Assessment Date",
      render: (item) =>
        item?.AssmtDate ? formatDate(parseDate(item?.AssmtDate)) : "-",
    },
    {
      label: "Session Assessment",
      render: (item) => (item ? item.testAssmt || "-" : "-"),
    },
    {
      label: "Reading",
      render: (item) => (item ? item.reading || "-" : "-"),
    },
    {
      label: "Writing",
      render: (item) => (item ? item.writing || "-" : "-"),
    },
    {
      label: "Speaking",
      render: (item) => (item ? item.speaking || "-" : "-"),
    },
    {
      label: "Listening",
      render: (item) => (item ? item.listening || "-" : "-"),
    },
    {
      label: "Overall",
      render: (item) => (item ? item.total || "" : ""),
    },
  ];

  const targetAchievedColumns = [
    {
      label: "Achieved Date",
      render: (item) => (item?.date ? formatDate(parseDate(item?.date)) : "-"),
    },
    {
      label: "Reading Score",
      render: (item) => (item ? item?.scores?.reading : "-"),
    },
    {
      label: "Writing Score",
      render: (item) => (item ? item?.scores?.writing : "-"),
    },
    {
      label: "Speaking Score",
      render: (item) => (item ? item?.scores?.speaking : "-"),
    },
    {
      label: "Listening Score",
      render: (item) => (item ? item?.scores?.listening : "-"),
    },
    {
      label: "Total Score",
      render: (item) => (item ? item?.scores?.total : "-"),
    },
    {
      label: "Document",
      render: (item) =>
        item?.document ? (
          <button
            className="btn btn-sm btn-primary fw-normal d-flex align-items-center justify-content-center rounded-4"
            style={{
              cursor: "pointer",
              height: "32px",
              color: "#6259CA",
              width: "70px",
              fontSize: "14px",
            }}
            onClick={() =>
              window.open(
                `${BASEURL}/${item.document}`,
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            <VisibilityIcon className="me-1" style={{ fontSize: "16px" }} />
            View
          </button>
        ) : (
          "-"
        ),
    },
  ];

  const subjectGradeColumns = [
    {
      label: "Subject",
      render: (item) =>
        item && item.subject
          ? subjectOptions.find((opt) => opt.value === item.subject)?.label ||
          "-"
          : "-",
    },
    {
      label: "Level",
      render: (item) =>
        item && item.level
          ? levelOptions.find((opt) => opt.value === item.level)?.label || "-"
          : "-",
    },
    { label: "Remarks", render: (item) => (item ? item.remarks || "-" : "-") },
  ];

  const dateFormat = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const AccountantColumns = [
    { label: "Name", key: "name" },
    { label: "Contact No", key: "contactNo" },
    {
      label: "Main Plan",
      key: "mainPlan",
      render: (item) => item.mainPlan?.name,
    },
    { label: "Sub Plan", key: "subPlan", render: (item) => item.subPlan?.name },
    { label: "Amount", key: "amount" },
    { label: "Discount", key: "discount" },
    { label: "Payable Amount", key: "payableAmount" },
    {
      label: "Receive Amount",
      key: "paidAmount",
      render: (item) =>
        item.paidAmount?.length ? (
          <ul className="mb-0">
            {item.paidAmount.map((p) => (
              <li key={p._id}>
                {p.amount} ({dateFormat(p.date)})
              </li>
            ))}
          </ul>
        ) : (
          "-"
        ),
    },
    { label: "Receivable Amount", key: "dueAmount" },
    { label: "Payment Type", key: "paymentType" },
    { label: "Payment Mode", key: "paymentMode" },
    { label: "Created By", key: "createdByName" },
    {
      label: "Created At",
      key: "createdAt",
      render: (item) => dateFormat(item.createdAt),
    },
  ];

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

      <div className="form-main-heading w-100 p-2 position-sticky top-0 z-3">
        <div className="d-flex justify-content-between align-items-center">
          <h3>Coaching Details</h3>
          <Button
            variant="link"
            onClick={() =>
              navigate("/student/coachingstudents", {
                state: location.state,
              })
            }
            className="text-light"
          >
            <AiOutlineClose size={20} />
          </Button>
        </div>
      </div>

      <Card
        className="custom-card transcation-crypto mb-0"
        style={{
          minHeight: "94vh",
          borderTopLeftRadius: "0",
          borderTopRightRadius: "0",
        }}
      >
        <Card.Header className="border-bottom-0 d-flex justify-content-between">
          <div className="card-title">Coaching Student Information</div>
        </Card.Header>
        <div className="mx-4">
          <CoachingStudentInfo oneStudentData={oneStudentData} />

          <CoachingTabs
            onPersonalSectionSelect={handlePersonalSectionSelect}
            selectedPersonalSection={selectedPersonalSection}
            userRole={userRole}
            userType={userType}
          />

          {(selectedPersonalSection === "all" ||
            selectedPersonalSection === "remark") && (
              <div className="my-4 p-4 bg-light rounded shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Remark</h5>
                  <Button
                    variant="primary"
                    className="px-4 py-2"
                    style={{ borderRadius: "20px" }}
                    onClick={() => {
                      remarkFormik.resetForm();
                      setEdit({
                        remarkDetails: false,
                        remarkDetailsIndex: 0,
                        remarkDetailsObj: null,
                      });
                      setShowRemarkModal(true);
                    }}
                  >
                    Add New
                  </Button>
                </div>

                <Modal
                  show={showRemarkModal}
                  onHide={() => {
                    setShowRemarkModal(false);
                    remarkFormik.resetForm();
                    setEdit({
                      remarkDetails: false,
                      remarkDetailsIndex: 0,
                      remarkDetailsObj: null,
                    });
                  }}
                  size="md"
                  centered
                >
                  <Modal.Header className="form-main-heading">
                    <Modal.Title>
                      {edit.remarkDetails ? "Update Remark" : "Add Remark"}
                    </Modal.Title>
                    <AiOutlineClose
                      size={20}
                      style={{ cursor: "pointer", color: "white" }}
                      onClick={() => {
                        setShowRemarkModal(false);
                        remarkFormik.resetForm();
                        setEdit({
                          remarkDetails: false,
                          remarkDetailsIndex: 0,
                          remarkDetailsObj: null,
                        });
                      }}
                    />
                  </Modal.Header>
                  <Modal.Body className="p-4">
                    <Form onSubmit={remarkFormik.handleSubmit}>
                      <Row>
                        <Col className="mb-3">
                          <Form.Label>Remark</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Remark"
                            className="rounded-pill"
                            name="remarkHistory[0].remark"
                            value={remarkFormik.values.remarkHistory[0].remark}
                            onChange={remarkFormik.handleChange}
                            onBlur={remarkFormik.handleBlur}
                          />
                          {remarkFormik.touched.remarkHistory?.[0]?.remark &&
                            remarkFormik.errors.remarkHistory?.[0]?.remark && (
                              <div className="text-danger">
                                {remarkFormik.errors.remarkHistory[0].remark}
                              </div>
                            )}
                        </Col>
                      </Row>
                      <div className="text-end mt-4">
                        <Button
                          variant="primary"
                          type="submit"
                          className="rounded-pill px-4"
                        >
                          {edit.remarkDetails ? "Update" : "Add"}
                        </Button>
                      </div>
                    </Form>
                  </Modal.Body>
                </Modal>

                <DataTable
                  columns={remarkColumns}
                  data={formData.remarkHistory || []}
                  currentPage={1}
                  totalPages={1}
                  itemsPerPage={10}
                  onEdit={(item, index) => {
                    remarkFormik.setValues({
                      remarkHistory: [{ remark: item.remarks || "" }],
                    });
                    setEdit({
                      remarkDetails: true,
                      remarkDetailsIndex: index,
                      remarkDetailsObj: item,
                    });
                    setShowRemarkModal(true);
                  }}
                  onDelete={(item) => handleDeleteRemark(item._id)}
                  section="Remark Details"
                />
              </div>
            )}

          {(selectedPersonalSection === "all" ||
            selectedPersonalSection === "mockTest") && (
              <div className="my-4 p-4 bg-light rounded shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Mock Test</h5>
                  <Button
                    variant="primary"
                    className="px-4 py-2"
                    style={{ borderRadius: "20px" }}
                    onClick={() => {
                      mockTestFormik.resetForm();
                      setShowMockTestModal(true);
                    }}
                  >
                    Add New
                  </Button>
                </div>

                <Modal
                  show={showMockTestModal}
                  onHide={() => {
                    setShowMockTestModal(false);
                    setShowMockTestDateCalendar(false);
                    setShowMockTestAssmtDateCalendar(false);
                    mockTestFormik.resetForm();
                    setEditMockTest({
                      isEditing: false,
                      mockTestId: null,
                      mockTestData: null,
                    });
                  }}
                  size="lg"
                  centered
                >
                  <Modal.Header className="form-main-heading">
                    <Modal.Title>
                      {editMockTest.isEditing
                        ? "Update Mock Test"
                        : "Add Mock Test"}
                    </Modal.Title>
                    <AiOutlineClose
                      size={20}
                      style={{ cursor: "pointer", color: "white" }}
                      onClick={() => {
                        setShowMockTestModal(false);
                        setShowMockTestDateCalendar(false);
                        setShowMockTestAssmtDateCalendar(false);
                        mockTestFormik.resetForm();
                        setEditMockTest({
                          isEditing: false,
                          mockTestId: null,
                          mockTestData: null,
                        });
                      }}
                    />
                  </Modal.Header>
                  <Modal.Body className="p-4">
                    <Form onSubmit={mockTestFormik.handleSubmit}>
                      <Row>
                        <Col md={6} className="mb-3">
                          <Form.Label>Mock Test Date</Form.Label>
                          <div style={{ position: "relative" }}>
                            <Form.Control
                              type="text"
                              className="custom-select-height"
                              name="testDate"
                              placeholder="dd/mm/yyyy"
                              value={
                                mockTestFormik.values.testDate
                                  ? formatDate(
                                    parseDate(mockTestFormik.values.testDate)
                                  )
                                  : ""
                              }
                              readOnly
                              ref={mockTestDateInputRef}
                              onClick={() => {
                                setShowMockTestDateCalendar((show) => !show);
                              }}
                              style={{
                                cursor: "pointer",
                                backgroundColor: "#fff",
                              }}
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
                            {showMockTestDateCalendar && (
                              <div
                                ref={mockTestDateCalendarRef}
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
                                    mockTestFormik.setFieldValue(
                                      "testDate",
                                      formatDate(selectedDate)
                                    );
                                    setShowMockTestDateCalendar(false);
                                  }}
                                  value={parseDate(
                                    mockTestFormik.values.testDate
                                  )}
                                  locale="en-GB"
                                />
                              </div>
                            )}
                          </div>
                          {mockTestFormik.touched.testDate &&
                            mockTestFormik.errors.testDate && (
                              <div className="text-danger">
                                {mockTestFormik.errors.testDate}
                              </div>
                            )}
                        </Col>
                        {userRole === "Super Admin" && (
                          <Col md={6} className="mb-3">
                            <Form.Label>Branch</Form.Label>
                            <Select
                              options={[
                                { value: "HeadOffice", label: "Head Office" },
                                ...branchList.map((branch) => ({
                                  value: branch._id,
                                  label: branch.branchName || branch.name,
                                })),
                              ]}
                              value={
                                mockTestFormik.values.branch === null ||
                                  mockTestFormik.values.branch === "HeadOffice"
                                  ? { value: "HeadOffice", label: "Head Office" }
                                  : branchList
                                    .map((b) => ({
                                      value: b._id,
                                      label: b.branchName || b.name,
                                    }))
                                    .find(
                                      (opt) =>
                                        opt.value ===
                                        mockTestFormik.values.branch
                                    ) || null
                              }
                              onChange={(selectedOption) => {
                                const branchValue =
                                  selectedOption?.value === "HeadOffice"
                                    ? null
                                    : selectedOption?.value;

                                mockTestFormik.setFieldValue(
                                  "branch",
                                  branchValue
                                );

                                fetchFacultyOptions(branchValue, false);

                                mockTestFormik.setFieldValue("faculty", null);
                              }}
                              placeholder="Select Branch"
                              isClearable={false}
                              classNamePrefix="custom-select"
                            />
                          </Col>
                        )}
                        {userRole !== "Coaching Faculty" && (

                          <Col md={6} className="mb-3">
                            <Form.Label>Assmt. By Faculty</Form.Label>
                            <Select
                              options={facultyOptions}
                              name="faculty"
                              placeholder="Select Faculty"
                              classNamePrefix="custom-select"
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  borderRadius: "30px",
                                  color: "black",
                                }),
                                placeholder: (base) => ({
                                  ...base,
                                  color: "black",
                                  fontSize: "13px",
                                }),
                              }}
                              isClearable
                              onChange={(option) =>
                                mockTestFormik.setFieldValue("faculty", option)
                              }
                              value={mockTestFormik.values.faculty}
                            />
                          </Col>
                        )}
                        <Col md={6} className="mb-3">
                          <Form.Label>Assmt. Date</Form.Label>
                          <div style={{ position: "relative" }}>
                            <Form.Control
                              type="text"
                              name="AssmtDate"
                              className="rounded-pill"
                              placeholder="dd/mm/yyyy"
                              value={
                                mockTestFormik.values.AssmtDate
                                  ? formatDate(
                                    parseDate(mockTestFormik.values.AssmtDate)
                                  )
                                  : ""
                              }
                              readOnly
                              ref={mockTestAssmtDateInputRef}
                              onClick={() => {
                                setShowMockTestAssmtDateCalendar((show) => !show);
                              }}
                              style={{
                                cursor: "pointer",
                                backgroundColor: "#fff",
                              }}
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
                            {showMockTestAssmtDateCalendar && (
                              <div
                                ref={mockTestAssmtDateCalendarRef}
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
                                    mockTestFormik.setFieldValue(
                                      "AssmtDate",
                                      formatDate(selectedDate)
                                    );
                                    setShowMockTestAssmtDateCalendar(false);
                                  }}
                                  value={parseDate(
                                    mockTestFormik.values.AssmtDate
                                  )}
                                  locale="en-GB"
                                />
                              </div>
                            )}
                          </div>
                          {mockTestFormik.touched.AssmtDate &&
                            mockTestFormik.errors.AssmtDate && (
                              <div className="text-danger">
                                {mockTestFormik.errors.AssmtDate}
                              </div>
                            )}
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>Mock Test Assmt.</Form.Label>
                          <Form.Control
                            type="text"
                            name="testAssmt"
                            placeholder="Enter Mock Test Assmt."
                            className="rounded-pill"
                            value={mockTestFormik.values.testAssmt}
                            onChange={mockTestFormik.handleChange}
                            onBlur={mockTestFormik.handleBlur}
                          />
                          {mockTestFormik.touched.testAssmt &&
                            mockTestFormik.errors.testAssmt && (
                              <div className="text-danger">
                                {mockTestFormik.errors.testAssmt}
                              </div>
                            )}
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>Listening</Form.Label>
                          <Form.Control
                            type="number"
                            name="listening"
                            placeholder="Enter Listening"
                            className="rounded-pill"
                            value={mockTestFormik.values.listening}
                            onChange={mockTestFormik.handleChange}
                            onBlur={mockTestFormik.handleBlur}
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>Reading</Form.Label>
                          <Form.Control
                            type="number"
                            name="reading"
                            placeholder="Enter Reading"
                            className="rounded-pill"
                            value={mockTestFormik.values.reading}
                            onChange={mockTestFormik.handleChange}
                            onBlur={mockTestFormik.handleBlur}
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>Writing</Form.Label>
                          <Form.Control
                            type="number"
                            name="writing"
                            placeholder="Enter Writing"
                            className="rounded-pill"
                            value={mockTestFormik.values.writing}
                            onChange={mockTestFormik.handleChange}
                            onBlur={mockTestFormik.handleBlur}
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>Speaking</Form.Label>
                          <Form.Control
                            type="number"
                            name="speaking"
                            placeholder="Enter Speaking"
                            className="rounded-pill"
                            value={mockTestFormik.values.speaking}
                            onChange={mockTestFormik.handleChange}
                            onBlur={mockTestFormik.handleBlur}
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>Overall</Form.Label>
                          <Form.Control
                            type="number"
                            name="total"
                            placeholder="Enter Overall"
                            className="rounded-pill"
                            value={mockTestFormik.values.total}
                            onChange={mockTestFormik.handleChange}
                            onBlur={mockTestFormik.handleBlur}
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>Upload Document</Form.Label>
                          <Form.Control
                            type="file"
                            name="mockFile"
                            onChange={(event) => {
                              mockTestFormik.setFieldValue(
                                "mockFile",
                                event.currentTarget.files[0]
                              );
                            }}
                            onBlur={mockTestFormik.handleBlur}
                            className="rounded-pill"
                          />
                        </Col>
                      </Row>
                      <div className="text-end mt-4">
                        <Button
                          variant="primary"
                          type="submit"
                          className="rounded-pill px-4"
                        >
                          {editMockTest.isEditing ? "Update" : "Add"}
                        </Button>
                      </div>
                    </Form>
                  </Modal.Body>
                </Modal>

                <DataTable
                  columns={mockTestColumns}
                  data={formData.mockTestDetails || []}
                  currentPage={1}
                  totalPages={1}
                  itemsPerPage={10}
                  onEdit={async (item) => {
                    const options = await fetchFacultyOptions(
                      item.branch?._id || null,
                      false
                    );

                    const selectedFaculty =
                      options.find((opt) => opt.value === item.faculty?._id) ||
                      null;

                    mockTestFormik.setValues({
                      testDate: item.testDate || "",
                      branch: item.branch?._id || null,
                      faculty: selectedFaculty,
                      AssmtDate: item.AssmtDate || "",
                      testAssmt: item.testAssmt || "",
                      listening: item.listening || "",
                      reading: item.reading || "",
                      writing: item.writing || "",
                      speaking: item.speaking || "",
                      total: item.total || "",
                      mockFile: "",
                    });

                    setEditMockTest({
                      isEditing: true,
                      mockTestId: item._id,
                      mockTestData: item,
                    });

                    setShowMockTestModal(true);
                  }}
                  onDelete={(item) => handleDeleteMockTest(item._id)}
                  section="Mock Test Details"
                />
              </div>
            )}

          {(selectedPersonalSection === "all" ||
            selectedPersonalSection === "masterSession") && (
              <div className="my-4 p-4 bg-light rounded shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Master Session</h5>
                  <Button
                    variant="primary"
                    className="px-4 py-2"
                    style={{ borderRadius: "20px" }}
                    onClick={() => {
                      masterSessionFormik.resetForm();
                      setShowMasterSessionModal(true);
                    }}
                  >
                    Add New
                  </Button>
                </div>

                <Modal
                  show={showMasterSessionModal}
                  onHide={() => {
                    setShowMasterSessionModal(false);
                    setShowSessionDateCalendar(false);
                    setShowMasterSessionAssmtDateCalendar(false);
                    masterSessionFormik.resetForm();
                    setEditMasterSession({
                      isEditing: false,
                      masterSessionId: null,
                      masterSessionData: null,
                    });
                  }}
                  size="lg"
                  centered
                >
                  <Modal.Header className="form-main-heading">
                    <Modal.Title>
                      {editMasterSession.isEditing
                        ? "Update Master Session"
                        : "Add Master Session"}
                    </Modal.Title>
                    <AiOutlineClose
                      size={20}
                      style={{ cursor: "pointer", color: "white" }}
                      onClick={() => {
                        setShowMasterSessionModal(false);
                        setShowSessionDateCalendar(false);
                        setShowMasterSessionAssmtDateCalendar(false);
                        masterSessionFormik.resetForm();
                        setEditMasterSession({
                          isEditing: false,
                          masterSessionId: null,
                          masterSessionData: null,
                        });
                      }}
                    />
                  </Modal.Header>
                  <Modal.Body className="p-4">
                    <Form onSubmit={masterSessionFormik.handleSubmit}>
                      <Row>
                        <Col md={6} className="mb-3">
                          <Form.Label>Session Date</Form.Label>
                          <div style={{ position: "relative" }}>
                            <Form.Control
                              type="text"
                              name="testDate"
                              className="rounded-pill"
                              placeholder="dd/mm/yyyy"
                              value={
                                masterSessionFormik.values.testDate
                                  ? formatDate(
                                    parseDate(
                                      masterSessionFormik.values.testDate
                                    )
                                  )
                                  : ""
                              }
                              readOnly
                              ref={sessionDateInputRef}
                              onClick={() => {
                                setShowSessionDateCalendar((show) => !show);
                              }}
                              style={{
                                cursor: "pointer",
                                backgroundColor: "#fff",
                              }}
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
                            {showSessionDateCalendar && (
                              <div
                                ref={sessionDateCalendarRef}
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
                                    masterSessionFormik.setFieldValue(
                                      "testDate",
                                      formatDate(selectedDate)
                                    );
                                    setShowSessionDateCalendar(false);
                                  }}
                                  value={parseDate(
                                    masterSessionFormik.values.testDate
                                  )}
                                  locale="en-GB"
                                />
                              </div>
                            )}
                          </div>
                          {masterSessionFormik.touched.testDate &&
                            masterSessionFormik.errors.testDate && (
                              <div className="text-danger">
                                {masterSessionFormik.errors.testDate}
                              </div>
                            )}
                        </Col>
                        {userRole === "Super Admin" && (
                          <Col md={6} className="mb-3">
                            <Form.Label>Branch</Form.Label>
                            <Select
                              options={[
                                { value: "HeadOffice", label: "Head Office" },
                                ...branchList.map((branch) => ({
                                  value: branch._id,
                                  label: branch.branchName || branch.name,
                                })),
                              ]}
                              value={
                                masterSessionFormik.values.branch === null ||
                                  masterSessionFormik.values.branch === "HeadOffice"
                                  ? { value: "HeadOffice", label: "Head Office" }
                                  : branchList
                                    .map((b) => ({
                                      value: b._id,
                                      label: b.branchName || b.name,
                                    }))
                                    .find(
                                      (opt) =>
                                        opt.value ===
                                        masterSessionFormik.values.branch
                                    ) || null
                              }
                              onChange={(selectedOption) => {
                                const branchValue =
                                  selectedOption?.value === "HeadOffice"
                                    ? null
                                    : selectedOption?.value;

                                masterSessionFormik.setFieldValue(
                                  "branch",
                                  branchValue
                                );

                                fetchFacultyOptions(branchValue, false);

                                masterSessionFormik.setFieldValue(
                                  "faculty",
                                  null
                                );
                              }}
                              placeholder="Select Branch"
                              isClearable={false}
                              classNamePrefix="custom-select"
                            />
                          </Col>
                        )}
                        {userRole !== "Coaching Faculty" && (
                          <Col md={6} className="mb-3">
                            <Form.Label>Assmt. By Faculty</Form.Label>
                            <Select
                              options={facultyOptions}
                              name="faculty"
                              placeholder="Select Faculty"
                              classNamePrefix="custom-select"
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  borderRadius: "30px",
                                  color: "black",
                                }),
                                placeholder: (base) => ({
                                  ...base,
                                  color: "black",
                                  fontSize: "13px",
                                }),
                              }}
                              isClearable
                              onChange={(option) =>
                                masterSessionFormik.setFieldValue("faculty", option)
                              }
                              value={masterSessionFormik.values.faculty}
                            />
                          </Col>)}
                        <Col md={6} className="mb-3">
                          <Form.Label>Assmt. Date</Form.Label>
                          <div style={{ position: "relative" }}>
                            <Form.Control
                              type="text"
                              name="AssmtDate"
                              className="rounded-pill"
                              placeholder="dd/mm/yyyy"
                              value={
                                masterSessionFormik.values.AssmtDate
                                  ? formatDate(
                                    parseDate(
                                      masterSessionFormik.values.AssmtDate
                                    )
                                  )
                                  : ""
                              }
                              readOnly
                              ref={masterSessionAssmtDateInputRef}
                              onClick={() => {
                                setShowMasterSessionAssmtDateCalendar(
                                  (show) => !show
                                );
                              }}
                              style={{
                                cursor: "pointer",
                                backgroundColor: "#fff",
                              }}
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
                            {showMasterSessionAssmtDateCalendar && (
                              <div
                                ref={masterSessionAssmtDateCalendarRef}
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
                                    masterSessionFormik.setFieldValue(
                                      "AssmtDate",
                                      formatDate(selectedDate)
                                    );
                                    setShowMasterSessionAssmtDateCalendar(false);
                                  }}
                                  value={parseDate(
                                    masterSessionFormik.values.AssmtDate
                                  )}
                                  locale="en-GB"
                                />
                              </div>
                            )}
                          </div>
                          {masterSessionFormik.touched.AssmtDate &&
                            masterSessionFormik.errors.AssmtDate && (
                              <div className="text-danger">
                                {masterSessionFormik.errors.AssmtDate}
                              </div>
                            )}
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>Master Session Assmt.</Form.Label>
                          <Form.Control
                            type="text"
                            name="testAssmt"
                            placeholder="Enter Master Session Assmt."
                            className="rounded-pill"
                            value={masterSessionFormik.values.testAssmt}
                            onChange={masterSessionFormik.handleChange}
                            onBlur={masterSessionFormik.handleBlur}
                          />
                          {masterSessionFormik.touched.testAssmt &&
                            masterSessionFormik.errors.testAssmt && (
                              <div className="text-danger">
                                {masterSessionFormik.errors.testAssmt}
                              </div>
                            )}
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>Listening</Form.Label>
                          <Form.Control
                            type="number"
                            name="listening"
                            placeholder="Enter Listening"
                            className="rounded-pill"
                            value={masterSessionFormik.values.listening}
                            onChange={masterSessionFormik.handleChange}
                            onBlur={masterSessionFormik.handleBlur}
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>Reading</Form.Label>
                          <Form.Control
                            type="number"
                            name="reading"
                            placeholder="Enter Reading"
                            className="rounded-pill"
                            value={masterSessionFormik.values.reading}
                            onChange={masterSessionFormik.handleChange}
                            onBlur={masterSessionFormik.handleBlur}
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>Writing</Form.Label>
                          <Form.Control
                            type="number"
                            name="writing"
                            placeholder="Enter Writing"
                            className="rounded-pill"
                            value={masterSessionFormik.values.writing}
                            onChange={masterSessionFormik.handleChange}
                            onBlur={masterSessionFormik.handleBlur}
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>Speaking</Form.Label>
                          <Form.Control
                            type="number"
                            name="speaking"
                            placeholder="Enter Speaking"
                            className="rounded-pill"
                            value={masterSessionFormik.values.speaking}
                            onChange={masterSessionFormik.handleChange}
                            onBlur={masterSessionFormik.handleBlur}
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>Overall</Form.Label>
                          <Form.Control
                            type="number"
                            name="total"
                            placeholder="Enter Overall"
                            className="rounded-pill"
                            value={masterSessionFormik.values.total}
                            onChange={masterSessionFormik.handleChange}
                            onBlur={masterSessionFormik.handleBlur}
                          />
                        </Col>
                      </Row>
                      <div className="text-end mt-4">
                        <Button
                          variant="primary"
                          type="submit"
                          className="rounded-pill px-4"
                        >
                          {editMasterSession.isEditing ? "Update" : "Add"}
                        </Button>
                      </div>
                    </Form>
                  </Modal.Body>
                </Modal>

                <DataTable
                  columns={masterSessionColumns}
                  data={formData.masterSessionDetails || []}
                  currentPage={1}
                  totalPages={1}
                  itemsPerPage={10}
                  onEdit={async (item) => {
                    const options = await fetchFacultyOptions(
                      item.branch?._id || null,
                      false
                    );

                    const selectedFaculty =
                      options.find((opt) => opt.value === item.faculty?._id) ||
                      null;

                    masterSessionFormik.setValues({
                      testDate: item.testDate || "",
                      branch: item.branch?._id || null,
                      faculty: selectedFaculty,
                      AssmtDate: item.AssmtDate || "",
                      testAssmt: item.testAssmt || "",
                      listening: item.listening || "",
                      reading: item.reading || "",
                      writing: item.writing || "",
                      speaking: item.speaking || "",
                      total: item.total || "",
                    });
                    setEditMasterSession({
                      isEditing: true,
                      masterSessionId: item._id,
                      masterSessionData: item,
                    });
                    setShowMasterSessionModal(true);
                  }}
                  onDelete={(item) => handleDeleteMasterSession(item._id)}
                  section="Master Session Details"
                />
              </div>
            )}

          {(selectedPersonalSection === "all" ||
            selectedPersonalSection === "targetAchieved") && (
              <div className="my-4 p-4 bg-light rounded shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Exam Score Achieved</h5>
                  {!(
                    formData?.targetAchieved &&
                    (formData?.targetAchieved?.scores?.reading ||
                      formData?.targetAchieved?.scores?.writing ||
                      formData?.targetAchieved?.scores?.speaking ||
                      formData?.targetAchieved?.scores?.listening ||
                      formData?.targetAchieved?.scores?.total ||
                      formData?.targetAchieved?.document ||
                      formData?.targetAchieved?.date)
                  ) && (
                      <Button
                        variant="primary"
                        className="px-4 py-2"
                        style={{ borderRadius: "20px" }}
                        onClick={() => {
                          targetAchievedFormik.resetForm();
                          setShowTargetAchievedModal(true);
                          setShowAchievedDateCalendar(false);
                        }}
                      >
                        Add New
                      </Button>
                    )}
                </div>

                <Modal
                  show={showTargetAchievedModal}
                  onHide={() => {
                    setShowTargetAchievedModal(false);
                    setShowAchievedDateCalendar(false);
                    targetAchievedFormik.resetForm();
                    setEditTargetAchieved({
                      isEditing: false,
                      targetAchievedData: null,
                    });
                  }}
                  size="lg"
                  centered
                >
                  <Modal.Header className="form-main-heading">
                    <Modal.Title>
                      {editTargetAchieved.isEditing
                        ? "Update Target Achieved"
                        : "Add Target Achieved"}
                    </Modal.Title>
                    <AiOutlineClose
                      onClick={() => {
                        setShowTargetAchievedModal(false);
                        setShowAchievedDateCalendar(false);
                        targetAchievedFormik.resetForm();
                        setEditTargetAchieved({
                          isEditing: false,
                          targetAchievedData: null,
                        });
                      }}
                      style={{ cursor: "pointer", color: "white" }}
                    />
                  </Modal.Header>
                  <Modal.Body>
                    <Form onSubmit={targetAchievedFormik.handleSubmit}>
                      <Row>
                        <Col md={6} className="mb-3">
                          <Form.Label>Achieved Date</Form.Label>
                          <div style={{ position: "relative" }}>
                            <Form.Control
                              type="text"
                              name="date"
                              className="rounded-pill"
                              placeholder="dd/mm/yyyy"
                              value={
                                targetAchievedFormik.values.date
                                  ? formatDate(
                                    parseDate(targetAchievedFormik.values.date)
                                  )
                                  : ""
                              }
                              readOnly
                              ref={achievedDateInputRef}
                              onClick={() => {
                                setShowAchievedDateCalendar((show) => !show);
                              }}
                              style={{
                                cursor: "pointer",
                                backgroundColor: "#fff",
                              }}
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
                            {showAchievedDateCalendar && (
                              <div
                                ref={achievedDateCalendarRef}
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
                                    targetAchievedFormik.setFieldValue(
                                      "date",
                                      formatDate(selectedDate)
                                    );
                                    setShowAchievedDateCalendar(false);
                                  }}
                                  value={parseDate(
                                    targetAchievedFormik.values.date
                                  )}
                                  locale="en-GB"
                                />
                              </div>
                            )}
                          </div>
                          {targetAchievedFormik.touched.date &&
                            targetAchievedFormik.errors.date && (
                              <div className="text-danger">
                                {targetAchievedFormik.errors.date}
                              </div>
                            )}
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>Upload Document</Form.Label>
                          <Form.Control
                            type="file"
                            name="resultFile"
                            onChange={(event) => {
                              targetAchievedFormik.setFieldValue(
                                "resultFile",
                                event.currentTarget.files[0]
                              );
                            }}
                            onBlur={targetAchievedFormik.handleBlur}
                            className="rounded-pill"
                          />
                        </Col>
                        {[
                          "reading",
                          "writing",
                          "speaking",
                          "listening",
                          "total",
                        ].map((scoreType) => (
                          <Col md={4} key={scoreType} className="mb-3">
                            <Form.Label>
                              {scoreType?.charAt(0)?.toUpperCase() +
                                scoreType?.slice(1)}{" "}
                              Score
                            </Form.Label>
                            <Form.Control
                              type="number"
                              placeholder={`Enter ${scoreType} score`}
                              className="rounded-pill"
                              name={`scores.${scoreType}`}
                              value={
                                targetAchievedFormik.values.scores[scoreType]
                              }
                              onChange={targetAchievedFormik.handleChange}
                              onBlur={targetAchievedFormik.handleBlur}
                            />
                          </Col>
                        ))}
                      </Row>
                      <div className="text-end mt-4">
                        <Button
                          variant="primary"
                          type="submit"
                          className="rounded-pill px-4"
                        >
                          {editTargetAchieved.isEditing ? "Update" : "Add"}
                        </Button>
                      </div>
                    </Form>
                  </Modal.Body>
                </Modal>

                <DataTable
                  columns={targetAchievedColumns}
                  data={
                    formData?.targetAchieved &&
                      (formData?.targetAchieved?.scores?.reading ||
                        formData?.targetAchieved?.scores?.writing ||
                        formData?.targetAchieved?.scores?.speaking ||
                        formData?.targetAchieved?.scores?.listening ||
                        formData?.targetAchieved?.scores?.total ||
                        formData?.targetAchieved?.document ||
                        formData?.targetAchieved?.date)
                      ? [formData?.targetAchieved]
                      : []
                  }
                  currentPage={1}
                  totalPages={1}
                  itemsPerPage={10}
                  onEdit={(item) => {
                    targetAchievedFormik.setValues({
                      date: item.date || "",
                      scores: {
                        reading: item.scores?.reading || "",
                        writing: item.scores?.writing || "",
                        speaking: item.scores?.speaking || "",
                        listening: item.scores?.listening || "",
                        total: item.scores?.total || "",
                      },
                      resultFile: "",
                    });
                    setEditTargetAchieved({
                      isEditing: true,
                      targetAchievedData: item,
                    });
                    setShowTargetAchievedModal(true);
                  }}
                  onDelete={() => handleDeleteTargetAchieved()}
                  section="Target Achieved Details"
                />
              </div>
            )}

          {(selectedPersonalSection === "all" ||
            selectedPersonalSection === "subjectGrade") && (
              <div className="my-4 p-4 bg-light rounded shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Subject Grade</h5>
                  <Button
                    variant="primary"
                    className="px-4 py-2"
                    style={{ borderRadius: "20px" }}
                    onClick={() => {
                      subjectGradeFormik.resetForm();
                      setShowSubjectGradeModal(true);
                    }}
                  >
                    Add New
                  </Button>
                </div>

                <Modal
                  show={showSubjectGradeModal}
                  onHide={() => {
                    setShowSubjectGradeModal(false);
                    subjectGradeFormik.resetForm();
                    setEditSubjectGrade({
                      isEditing: false,
                      subjectGradeData: null,
                    });
                  }}
                  size="lg"
                  centered
                >
                  <Modal.Header className="form-main-heading">
                    <Modal.Title>
                      {editSubjectGrade.isEditing
                        ? "Update Subject Grade"
                        : "Add Subject Grade"}
                    </Modal.Title>
                    <AiOutlineClose
                      onClick={() => {
                        setShowSubjectGradeModal(false);
                        subjectGradeFormik.resetForm();
                        setEditSubjectGrade({
                          isEditing: false,
                          subjectGradeData: null,
                        });
                      }}
                      style={{ cursor: "pointer", color: "white" }}
                    />
                  </Modal.Header>
                  <Modal.Body>
                    <Form onSubmit={subjectGradeFormik.handleSubmit}>
                      <Row>
                        <Col md={6} className="mb-3">
                          <Form.Label>Subject</Form.Label>
                          <Select
                            options={subjectOptions}
                            name="subject"
                            placeholder="Select Subject"
                            classNamePrefix="custom-select"
                            styles={{
                              control: (base) => ({
                                ...base,
                                borderRadius: "30px",
                                color: "black",
                              }),
                              placeholder: (base) => ({
                                ...base,
                                color: "black",
                                fontSize: "13px",
                              }),
                            }}
                            isClearable
                            onChange={(option) =>
                              subjectGradeFormik.setFieldValue(
                                "subject",
                                option ? option.value : null
                              )
                            }
                            value={
                              subjectOptions.find(
                                (opt) =>
                                  opt.value === subjectGradeFormik.values.subject
                              ) || null
                            }
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>Level</Form.Label>
                          <Select
                            options={levelOptions}
                            name="level"
                            placeholder="Select Level"
                            classNamePrefix="custom-select"
                            styles={{
                              control: (base) => ({
                                ...base,
                                borderRadius: "30px",
                                color: "black",
                              }),
                              placeholder: (base) => ({
                                ...base,
                                color: "black",
                                fontSize: "13px",
                              }),
                            }}
                            isClearable
                            onChange={(option) =>
                              subjectGradeFormik.setFieldValue(
                                "level",
                                option ? option.value : null
                              )
                            }
                            value={
                              levelOptions.find(
                                (opt) =>
                                  opt.value === subjectGradeFormik.values.level
                              ) || null
                            }
                          />
                        </Col>
                        <Col className="mb-3">
                          <Form.Label>Remark</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Remark"
                            className="rounded-pill"
                            name="remarks"
                            value={subjectGradeFormik.values.remarks}
                            onChange={subjectGradeFormik.handleChange}
                            onBlur={subjectGradeFormik.handleBlur}
                          />
                        </Col>
                      </Row>
                      <div className="text-end mt-4">
                        <Button
                          variant="primary"
                          type="submit"
                          className="rounded-pill px-4"
                        >
                          {editSubjectGrade.isEditing ? "Update" : "Add"}
                        </Button>
                      </div>
                    </Form>
                  </Modal.Body>
                </Modal>

                <DataTable
                  columns={subjectGradeColumns}
                  data={formData.subjectLevelDetails || []}
                  currentPage={1}
                  totalPages={1}
                  itemsPerPage={10}
                  onEdit={(item) => {
                    subjectGradeFormik.setValues({
                      subject: item.subject || null,
                      level: item.level || null,
                      remarks: item.remarks || "",
                    });
                    setEditSubjectGrade({
                      isEditing: true,
                      subjectLevelId: item._id,
                      subjectGradeData: item,
                    });
                    setShowSubjectGradeModal(true);
                  }}
                  showDeleteButton={false}
                  // onDelete={(item) => handleDeleteSubjectGrade(item._id)}
                  section="Subject Grade Details"
                />
              </div>
            )}

          {(selectedPersonalSection === "all" ||
            selectedPersonalSection === "accountant") && (
              // <div className="my-5 p-4 bg-light rounded shadow-sm">
              //   <DataTable
              //     columns={AccountantColumns}
              //     data={accountantData}
              //     totalData={totalData}
              //     currentPage={1}
              //     itemsPerPage={10}
              //     actionView={false}
              //     rowHeight={false}
              //   />
              // </div>
              <ApplicationAccountant
                accountantData={accountantData}
                oneStudentData={oneStudentData}
                fetchAccountant={fetchAccountant}
                totalData={totalData}
                mainPlanKey="coaching"
              />
            )}
        </div>
      </Card>
    </>
  );
};

export default CoachingDetails;
