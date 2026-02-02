import { useDispatch } from "react-redux";
import {
  getCoachingStudent,
  getAllAttendence,
  updateStudentApplication,
  createStudentApplication,
  deleteStudentApplication,
} from "../../redux/actions/Student/StudentApplication.action";
import { useEffect, useState, useRef, useCallback } from "react";
import Paginations from "../elements/Paginations";
import {
  Card,
  Col,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
  Modal,
  Table,
  Button,
} from "react-bootstrap";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import usePermissions from "../commonComponents/usePermissions";
import { decryptData } from "../../utils/encryptionUtils";
import { MdCalendarToday } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { Check, Close } from "@mui/icons-material";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  getAllBatchTimes,
  getAllCoachingFaculty,
} from "../../redux/actions/Master/CoachingFaculty.action";
import Select from "react-select";
import Pageheader from "../../layouts/Pageheader";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  cityDropdown,
  countryDropdown,
  stateDropdown,
} from "../../redux/actions/Master/Institute.action";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllMainPlan } from "../../redux/actions/Master/MainPlan.action";
import { getOneSubPlan } from "../../redux/actions/Master/SubPlan.action";
import { getAllBankingDetails } from "../../redux/actions/Master/Banking.action";
import ConvertToApplication from "./coachingDetails/ConvertToApplication";
import CoachingStudentCard from "./coachingDetails/CoachingStudentCard";
import CoachingStudentForm from "./coachingDetails/CoachingStudentForm";
import { getAllBranch } from "../../redux/actions/Branch.action";

const CoachingStudent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [coachingStudentData, setCoachingStudentData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const { canRead, canCreate, canUpdate, canDelete } =
    usePermissions("Coaching Students");
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

  const [isLoading, setIsLoading] = useState(false);

  const [countries, setCountries] = useState([]);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  const [stateDropDown, setStateDropDown] = useState([]);
  const [cityDropDownList, setCityDropDownList] = useState([]);

  const [batchTimes, setBatchTimes] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [show, setShow] = useState(false);

  const [mainPlans, setMainPlans] = useState([]);

  const [filters, setFilters] = useState({
    status: "",
    faculty: "",
    branch:
      userType === "Branch User" || userRole === "Branch"
        ? branchUserId || branchID
        : "",
    showAll: userType === "Branch User" || userRole === "Branch" ? false : true,
    startDate: "",
    endDate: "",
    targetAchieved: "",
  });

  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const startDateInputRef = useRef(null);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [endDateValue, setEndDateValue] = useState(null);
  const endDateInputRef = useRef(null);
  const [coachingFaculties, setCoachingFaculties] = useState([]);
  const [filterCoachingFaculties, setFilterCoachingFaculties] = useState([]);

  //Remark Modal States
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [edit, setEdit] = useState({
    remarkDetails: false,
    remarkDetailsIndex: 0,
    remarkDetailsObj: null,
    studentId: null,
  });

  // Attendance Modal States
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceStartDate, setAttendanceStartDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const dateRangeRef = useRef(null);

  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedForApplication, setSelectedForApplication] = useState(null);

  const [branchList, setBranchList] = useState([]);

  const isBranchLogin = userRole === "Branch" || userType === "Branch User";

  const [selectedBranch, setSelectedBranch] = useState(
    isBranchLogin
      ? {
          value: userType === "Branch User" ? branchUserId : branchID,
          label:
            branchList.find(
              (b) =>
                b._id === (userType === "Branch User" ? branchUserId : branchID)
            )?.branchName ||
            branchList.find(
              (b) =>
                b._id === (userType === "Branch User" ? branchUserId : branchID)
            )?.name ||
            "Branch",
        }
      : { value: "HeadOffice", label: "Head Office" }
  );

  const allBranchOptions =
    branchList?.map((branch) => ({
      value: branch._id,
      label: branch.name,
    })) || [];

  const handleShow = () => {
    setShow(true);
    // formik.resetForm();
  };

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
  };

  useEffect(() => {
    if (showAttendanceModal || showDocumentsModal || show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showAttendanceModal, showDocumentsModal, show]);

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

        const res = await dispatch(
          updateStudentApplication(payload, edit.studentId)
        );
        if (res?.status === 200) {
          toast.success(
            edit.remarkDetails
              ? "Remark updated successfully!"
              : "Remark added successfully!"
          );
          setShowRemarkModal(false);
          remarkFormik.resetForm();
          setEdit({
            remarkDetails: false,
            remarkDetailsIndex: 0,
            remarkDetailsObj: null,
            studentId: null,
          });
        }
      } catch (error) {
        console.error("Error updating remark:", error);
        toast.error("Failed to update remark");
      }
    },
  });

  const handleDeleteRemark = async (remarksId, studentId) => {
    try {
      const payload = { remarksId };
      const res = await dispatch(deleteStudentApplication(payload, studentId));
      if (res?.status === 200) {
        toast.success("Remark deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting remark:", error);
      toast.error("Failed to delete remark");
    }
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

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    contact:
      userRole !== "B2B Admin" && Yup.string().required("Contact is required"),
    alternateContact: Yup.string(),
    gender: Yup.string().required("Gender is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    DOB: Yup.string().required("Date of Birth is required"),
    age: Yup.string().required("Age is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
    coachingDetails: Yup.object({
      coachingRequired: Yup.boolean().nullable(),
      city: Yup.string(),
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
            }).nullable(),
          })
        )
        .nullable(),
      subPlan: Yup.string(),
      amount: Yup.string(),
      discount: Yup.string(),
      discountAmount: Yup.string(),
      payableAmount: Yup.string(),
      paidAmount: Yup.array().when("coachingRequired", {
        is: true,
        then: () =>
          Yup.array().of(
            Yup.object().shape({
              amount: Yup.string(),
              date: Yup.string().nullable(),
              bank: Yup.string().nullable(),
              paymentMode: Yup.string(),
            })
          ),
        otherwise: () => Yup.array().nullable(),
      }),
      dueAmount: Yup.string(),
      paymentType: Yup.string().when("coachingRequired", {
        is: true,
        then: () => Yup.string(),
        otherwise: () => Yup.string().nullable(),
      }),
      invoiceRemarks: Yup.string(),
      remarks: Yup.string().nullable(),
    }).nullable(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      contact: "",
      alternateContact: "",
      gender: "",
      email: "",
      DOB: "",
      age: "",
      address: "",
      city: "",
      state: "",
      country: "",
      coachingDetails: {
        coachingRequired: true,
        city: "",
        startDate: "",
        endDate: "",
        registerFor: null,
        coachingRequirement: null,
        batchStatus: null,
        branch: userType === "Branch User" ? branchUserId : derivedBranchValue,
        batchFaculty: userRole === "Coaching Faculty" ? branchID : null,
        batchTiming: "",
        examRegistrationDate: "",
        targetedScore: "",
        hasGivenExam: true,
        examDetails: [
          {
            examName: "",
            scores: {
              reading: "",
              writing: "",
              speaking: "",
              listening: "",
              total: "",
            },
          },
        ],
        subPlan: "",
        amount: "",
        discount: "",
        discountAmount: "",
        payableAmount: "",
        paidAmount: [{ amount: "", date: "", bank: null, paymentMode: "" }],
        dueAmount: "",
        paymentType: "",
        invoiceRemarks: "",
        remarks: "",
      },
    },
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        toast.dismiss();

        const selectedCountry = countries.find(
          (c) => c.isoCode === values.country
        );
        const selectedState = stateDropDown.find(
          (s) => s.isoCode === values.state
        );

        if (values.id && canUpdate) {
          const payload = {
            name: values.name,
            contact: values.contact,
            alternateContact: values.alternateContact,
            gender: values.gender,
            email: values.email,
            DOB: values.DOB,
            age: values.age,
            address: values.address,
            city: values.city,
            state: selectedState?.name || values.state,
            country: selectedCountry?.name || values.country,
            coachingDetails: {
              coachingRequired: values.coachingDetails.coachingRequired,
              city: values.coachingDetails.city,
              startDate: values.coachingDetails.startDate,
              endDate: values.coachingDetails.endDate,
              registerFor: values.coachingDetails.registerFor || null,
              coachingRequirement:
                values.coachingDetails.coachingRequirement || null,
              batchStatus: values.coachingDetails.batchStatus || null,
              branch: values.coachingDetails.branch || null,
              batchFaculty: values.coachingDetails.batchFaculty || null,
              batchTiming: values.coachingDetails.batchTiming || null,
              examRegistrationDate: values.coachingDetails.examRegistrationDate,
              targetedScore: values.coachingDetails.targetedScore,
              hasGivenExam: values.coachingDetails.hasGivenExam,
              remarks: values.coachingDetails.remarks,

              // ✅ always send full examDetails here
              examDetails: values.coachingDetails.examDetails.map((exam) => ({
                _id: exam._id, // important to keep for updates
                examName: exam.examName,
                document: exam.document || "",
                scores: {
                  reading: exam.scores?.reading || "",
                  writing: exam.scores?.writing || "",
                  speaking: exam.scores?.speaking || "",
                  listening: exam.scores?.listening || "",
                  total: exam.scores?.total || "",
                },
              })),
            },
          };

          // ✅ single exam update (optional)
          if (values.singleExamUpdate) {
            payload.coachingExamId = values.singleExamUpdate.examId;
            payload.coachingExamUpdate = values.singleExamUpdate.update;
          }

          // ✅ multiple exam updates (optional)
          if (values.multipleExamUpdates?.length > 0) {
            payload.coachingExamUpdates = values.multipleExamUpdates.map(
              (exam) => ({
                examId: exam.examId,
                update: exam.update,
              })
            );
          }

          const res = await dispatch(
            updateStudentApplication(payload, values.id)
          );

          if (res?.status === 200) {
            toast.success("Student updated successfully");
          }
        } else if (canCreate) {
          const formData = new FormData();

          formData.append("name", values.name);
          formData.append("contact", values.contact);
          formData.append("alternateContact", values.alternateContact);
          formData.append("gender", values.gender);
          formData.append("email", values.email);
          formData.append("DOB", values.DOB);
          formData.append("age", values.age);
          formData.append("address", values.address);
          formData.append("city", values.city);
          formData.append("state", selectedState?.name || values.state);
          formData.append("country", selectedCountry?.name || values.country);

          const coachingDetails = {
            coachingRequired: values.coachingDetails.coachingRequired,
            city: values.coachingDetails.city,
            startDate: values.coachingDetails.startDate,
            endDate: values.coachingDetails.endDate,
            registerFor: values.coachingDetails.registerFor,
            coachingRequirement: values.coachingDetails.coachingRequirement,
            batchStatus: values.coachingDetails.batchStatus,
            branch: values.coachingDetails.branch,
            batchFaculty: values.coachingDetails.batchFaculty,
            batchTiming: values.coachingDetails.batchTiming,
            examRegistrationDate: values.coachingDetails.examRegistrationDate,
            targetedScore: values.coachingDetails.targetedScore,
            hasGivenExam: values.coachingDetails.hasGivenExam,
            remarks: values.coachingDetails.remarks,
            examDetails: values.coachingDetails.examDetails.map((exam) => ({
              examName: exam.examName,
              scores: {
                reading: exam.scores.reading || "",
                writing: exam.scores.writing || "",
                speaking: exam.scores.speaking || "",
                listening: exam.scores.listening || "",
                total: exam.scores.total || "",
              },
            })),
          };

          formData.append("coachingDetails", JSON.stringify(coachingDetails));
          const processedPaidAmount =
            values.coachingDetails.paidAmount?.map((entry) => ({
              ...entry,
              bank: entry.bank || values.coachingDetails.bank || "",
              date: entry.date || new Date().toISOString().split("T")[0],
              paymentMode: entry.paymentMode || "",
            })) || [];

          const coachingInvoiceData = {
            mainPlan:
              mainPlans.find((plan) => plan.name.toLowerCase() === "coaching")
                ?._id || null,
            subPlan: values.coachingDetails.subPlan || "",
            amount: values.coachingDetails.amount || "",
            discount: values.coachingDetails.discount || "",
            discountAmount: values.coachingDetails.discountAmount || "",
            payableAmount: values.coachingDetails.payableAmount || "",
            dueAmount: values.coachingDetails.dueAmount || "",
            paidAmount: processedPaidAmount,
            paymentType: values.coachingDetails.paymentType || "",
            remarks: values.coachingDetails.remarks || "",
          };
          formData.append("invoice", JSON.stringify(coachingInvoiceData));

          values.coachingDetails.examDetails.forEach((exam) => {
            if (exam.scoreFile) {
              formData.append("coachingDoc", exam.scoreFile);
            }
          });

          const res = await dispatch(createStudentApplication(formData));
          if (res?.status === 201) {
            toast.success("Coaching Student added successfully");
          }
        }

        handleClose();
        resetForm();

        if (canRead) {
          fetchCoachingStudent(
            currentPage,
            itemsPerPage,
            search,
            filters.status,
            filters.faculty,
            filters.startDate,
            filters.endDate,
            filters.targetAchieved,
            filters.branch,
            filters.showAll
          );
        }
      } catch (error) {
        console.log("Error submitting form:", error);
        toast.error(error?.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const [coachingSubPlan, setCoachingSubPlan] = useState("");
  const [isLoadingSubPlan, setIsLoadingSubPlan] = useState(false);

  useEffect(() => {
    const setAmountForSection = async (subPlanId, section) => {
      if (!subPlanId || isLoadingSubPlan) return;
      setIsLoadingSubPlan(true);
      try {
        const subPlan = await dispatch(getOneSubPlan(subPlanId));
        const totalAmount = subPlan?.data?.data?.totalAmount || "";
        formik.setFieldValue(`${section}.amount`, totalAmount.toString());
      } catch (error) {
        console.error(`Error fetching sub-plan for ${section}:`, error);
        toast.error(`Failed to fetch sub-plan details for ${section}.`);
      } finally {
        setIsLoadingSubPlan(false);
      }
    };

    // Only make API call if subPlan actually changed
    if (formik.values.coachingDetails.subPlan !== coachingSubPlan) {
      setCoachingSubPlan(formik.values.coachingDetails.subPlan);
      if (formik.values.coachingDetails.subPlan) {
        setAmountForSection(
          formik.values.coachingDetails.subPlan,
          "coachingDetails"
        );
      }
    }
  }, [
    formik.values.coachingDetails?.subPlan,
    coachingSubPlan,
    isLoadingSubPlan,
  ]);

  // Memoize calculation function to prevent unnecessary recalculations
  const calculateAmounts = useCallback(
    (section) => {
      const values = formik.values[section];
      const amount = parseFloat(values.amount) || 0;

      // -------- % Discount ----------
      let discountPercent = 0;
      if (values.discount) {
        const discountStr = values.discount.toString().replace("%", "").trim();
        discountPercent = parseFloat(discountStr) || 0;
      }
      const discountFromPercent = (amount * discountPercent) / 100;

      // -------- Fixed Discount Amount ----------
      const discountFromAmount = parseFloat(values.discountAmount) || 0;

      // -------- Total Discount (both work together) ----------
      const totalDiscount = discountFromPercent + discountFromAmount;

      // -------- Payable & Due ----------
      const payableAmount = amount - totalDiscount;

      const totalPaid =
        values.paidAmount?.reduce(
          (sum, entry) => sum + (parseFloat(entry.amount) || 0),
          0
        ) || 0;

      const dueAmount = payableAmount - totalPaid;

      // -------- Update Formik --------
      formik.setFieldValue(
        `${section}.payableAmount`,
        Math.max(0, payableAmount).toFixed(2)
      );
      formik.setFieldValue(
        `${section}.dueAmount`,
        Math.max(0, dueAmount).toFixed(2)
      );
    },
    [formik]
  );

  // Debounced calculation effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Calculate for coaching
      if (formik.values.coachingDetails.coachingRequired) {
        calculateAmounts("coachingDetails");
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [
    formik.values.coachingDetails.amount,
    formik.values.coachingDetails.discount,
    formik.values.coachingDetails.discountAmount,
    formik.values.coachingDetails.paidAmount,
  ]);

  const handleEdit = async (item) => {
    const branchValue =
      item.coachingDetails?.branch === null
        ? null
        : item.coachingDetails?.branch;

    await fetchCoachingFaculties(
      item.coachingDetails?.batchStatus || "",
      branchValue,
      false
    );

    if (item.coachingDetails?.batchFaculty?._id) {
      await fetchBatchTimes(
        item.coachingDetails.batchFaculty._id,
        item.coachingDetails.batchStatus || ""
      );
    }
    const countryName = item.country;
    const stateName = item.state;
    const cityName = item.city;

    const selectedCountry = countries.find(
      (c) => c.name.trim() === countryName
    );
    const countryIsoCode = selectedCountry?.isoCode;

    if (!countryIsoCode) {
      formik.setFieldValue("country", countryName);
    }

    let fetchedStates = [];
    if (countryIsoCode) {
      const stateRes = await dispatch(stateDropdown(countryIsoCode));
      fetchedStates = stateRes?.data?.data || [];
      setStateDropDown(fetchedStates);
    }

    const selectedState = fetchedStates.find(
      (s) => s.name.trim() === stateName
    );
    const stateIsoCode = selectedState?.isoCode;

    if (!stateIsoCode) {
      formik.setFieldValue("state", stateName);
    }

    let fetchedCities = [];
    if (stateIsoCode) {
      const cityRes = await dispatch(
        cityDropdown(countryIsoCode, stateIsoCode)
      );
      fetchedCities = cityRes?.data?.data || [];
      setCityDropDownList(fetchedCities);
    }

    if (!cityName) {
      formik.setFieldValue("city", cityName);
    }

    formik.setValues({
      ...formik.initialValues,
      ...item,
      id: item._id,
      DOB: item.DOB || "",
      country: countryIsoCode || countryName,
      state: stateIsoCode || stateName,
      city: cityName || "",
      coachingDetails: {
        ...formik.initialValues.coachingDetails,
        ...item.coachingDetails,
        registerFor:
          item.coachingDetails?.registerFor?._id ||
          item.coachingDetails?.registerFor ||
          null,
        coachingRequirement:
          item.coachingDetails?.coachingRequirement?._id ||
          item.coachingDetails?.coachingRequirement ||
          null,
        branch: branchValue || null,
        batchStatus: item.coachingDetails?.batchStatus || "",
        batchFaculty:
          item.coachingDetails?.batchFaculty?._id ||
          item.coachingDetails?.batchFaculty ||
          null,
        batchTiming: item.coachingDetails?.batchTiming || "",
        examRegistrationDate: item.coachingDetails?.examRegistrationDate || "",
        targetedScore: item.coachingDetails?.targetedScore || "",
      },
    });

    if (item.coachingDetails?.batchFaculty?._id) {
      await fetchBatchTimes(
        item.coachingDetails.batchFaculty._id || "",
        item?.coachingDetails.batchStatus
      );
    }

    setShow(true);
  };

  const handleDelete = async (item) => {
    try {
      toast.dismiss();
      const res = await dispatch(deleteStudentApplication({}, item._id));
      if (res?.status === 200) {
        toast.success("Student Application deleted successfully");
      }
      const updatedPage =
        coachingStudentData.length === 1 && currentPage > 1
          ? currentPage - 1
          : currentPage;
      setCurrentPage(updatedPage);

      if (canRead) {
        fetchCoachingStudent(
          currentPage,
          itemsPerPage,
          search,
          filters.status,
          filters.faculty,
          filters.startDate,
          filters.endDate,
          filters.targetAchieved,
          filters.branch,
          filters.showAll
        );
      }
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const fetchCoachingStudent = async (
    page = 1,
    limit = itemsPerPage,
    searchTerm = "",
    status = filters.status,
    faculty = filters.faculty,
    startDate = filters.startDate,
    endDate = filters.endDate,
    targetAchieved = filters.targetAchieved,
    branch = filters.branch,
    showAll = filters.showAll
  ) => {
    try {
      const res = await dispatch(
        getCoachingStudent(
          page,
          limit,
          searchTerm,
          status,
          faculty,
          startDate,
          endDate,
          targetAchieved,
          branch,
          showAll
        )
      );
      setCoachingStudentData(res?.data?.data?.data || []);
      setTotalPages(res?.data?.data?.totalPages || 0);
      setTotalRecords(res?.data?.data?.totalRecords || 0);
    } catch (error) {
      console.error("Error fetching in get coaching student:", error);
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchCoachingStudent(
        currentPage,
        itemsPerPage,
        search,
        filters.status,
        filters.faculty,
        filters.startDate,
        filters.endDate,
        filters.targetAchieved,
        filters.branch,
        filters.showAll
      );
    }
  }, [canRead, currentPage, itemsPerPage, search, filters]);

  const fetchCountries = async () => {
    try {
      const res = await dispatch(countryDropdown());
      const responseData = res?.data?.data || {};
      setCountries(responseData || []);
    } catch (error) {
      console.log("Error fetching countries:", error);
    }
  };

  const handleCountryChange = async (countryIsoCode) => {
    try {
      if (!countryIsoCode || countryIsoCode.trim() === "") {
        return;
      }
      formik.setFieldValue("country", countryIsoCode);
      formik.setFieldValue("state", "");
      formik.setFieldValue("city", "");
      setStateDropDown([]);
      setCityDropDownList([]);

      const res = await dispatch(stateDropdown(countryIsoCode || "IN"));
      const data = res?.data?.data;
      setStateDropDown(data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleStateChange = async (countryIsoCode, stateIsoCode) => {
    try {
      formik.setFieldValue("state", stateIsoCode);
      formik.setFieldValue("city", "");
      setCityDropDownList([]);

      const res = await dispatch(cityDropdown(countryIsoCode, stateIsoCode));
      const data = res?.data?.data;
      setCityDropDownList(data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
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

    const res = await dispatch(
      getAllCoachingFaculty(
        1,
        1000,
        "",
        formik.values.coachingDetails.batchStatus || "",
        showAll,
        finalBranch
      )
    );

    setFilterCoachingFaculties(res?.data?.data?.data || []);
  };

  const fetchCoachingFaculties = async (
    batchStatus,
    branchValue = "",
    showAll = false,
  ) => {
    try {
      // const showAll = false;

      const finalBranchId =
        branchValue || // ✅ selected branch first
        (userType === "Branch User"
          ? branchUserId
          : userRole === "Branch"
          ? branchID
          : "");

      const res = await dispatch(
        getAllCoachingFaculty(
          1,
          1000,
          "",
          batchStatus,
          showAll,
          finalBranchId
        )
      );
      setCoachingFaculties(res?.data?.data?.data || []);
    } catch (err) {
      console.error("Faculty fetch error", err);
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
    fetchCountries();
    fetchCoachingFaculties();
    // fetchBatchTimes();
  }, []);
  useEffect(() => {
    if (location.state) {
      const { filters, search, currentPage, itemsPerPage } = location.state;

      if (filters !== undefined) setFilters(filters);
      if (search !== undefined) setSearch(search);
      if (currentPage !== undefined) setCurrentPage(currentPage);
      if (itemsPerPage !== undefined) setItemsPerPage(itemsPerPage);

      if (canRead) {
        const status = filters?.status || "";
        const faculty = filters?.faculty || "";
        const startDate = filters?.startDate || "";
        const endDate = filters?.endDate || "";
        const targetAchieved = filters?.targetAchieved || "";

        fetchCoachingStudent(
          currentPage || 1,
          itemsPerPage || 10,
          search || "",
          status,
          faculty,
          startDate,
          endDate,
          targetAchieved,
          filters.branch,
          filters.showAll
        );

        fetchCoachingStudent(
          currentPage || 1,
          itemsPerPage || 10,
          search || "",
          status,
          faculty,
          startDate,
          endDate,
          targetAchieved,
          filters.branch,
          filters.showAll
        );
        setTimeout(() => {
          navigate(location.pathname, { replace: true });
        }, 100);
      }
    }
  }, [location.state, navigate]);

  const fetchAttendanceHistory = async (studentId) => {
    try {
      const response = await dispatch(getAllAttendence("", "", studentId));
      const students = response?.data?.data?.data || [];
      const apiAttendance = [];
      students?.forEach((student) => {
        student?.attendenceRecords?.forEach((att) => {
          apiAttendance.push({
            student: student._id || student.id,
            date: att.date.includes("T") ? att.date.split("T")[0] : att.date,
            status: att.status === true ? "present" : "absent",
            remark: att.remark || "",
          });
        });
      });
      setAttendanceData(apiAttendance);
    } catch (error) {
      console.error("Error fetching attendance history:", error);
    }
  };

  const handleViewAttendance = (student) => {
    setSelectedStudent(student);
    fetchAttendanceHistory(student._id);
    setShowAttendanceModal(true);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

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

  //   const isCourseEnded = (endDate) => {
  //   if (!endDate) return false;
  //   const today = new Date();
  //   const parsedEndDate = parseDate(endDate);
  //   return parsedEndDate && today >= parsedEndDate;
  // };
  const isCourseEnded = (endDate) => {
    if (!endDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const parsedEndDate = parseDate(endDate);
    if (!parsedEndDate) return false;
    parsedEndDate.setHours(0, 0, 0, 0);
    return today > parsedEndDate;
  };

  const targetAchievedOptions = [
    { value: true, label: "Target Achieved" },
    { value: false, label: "Not Achieved" },
  ];

  const formatShort = (date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(attendanceStartDate);
      date.setDate(attendanceStartDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

  const getAttendanceStatus = (student, date) => {
    const record = attendanceData?.find(
      (r) => r?.student === student && r?.date === date
    );
    return record || { status: null, remark: "" };
  };

  const getButtonStyle = (status) => {
    const baseStyle = {
      width: 32,
      height: 32,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto",
      cursor: "default",
    };

    if (status === "present") {
      return { ...baseStyle, backgroundColor: "#d4f5d4", color: "green" };
    }
    if (status === "absent") {
      return { ...baseStyle, backgroundColor: "#fddddd", color: "red" };
    }
    return { ...baseStyle, backgroundColor: "#E8E8F7", color: "#555" };
  };

  const prevWeek = () => {
    const newDate = new Date(attendanceStartDate);
    newDate.setDate(newDate.getDate() - 7);
    setAttendanceStartDate(newDate);
    setShowCalendar(false);
  };

  const nextWeek = () => {
    const newDate = new Date(attendanceStartDate);
    newDate.setDate(newDate.getDate() + 7);
    setAttendanceStartDate(newDate);
    setShowCalendar(false);
  };

  const selectStyles = {
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
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  const tagColors = [
    { bg: "#D1FAE5", text: "#047857" }, // green
    { bg: "#DBEAFE", text: "#1D4ED8" }, // blue
    { bg: "#EDE9FE", text: "#6D28D9" }, // purple
    { bg: "#FEF3C7", text: "#B45309" }, // yellow
    { bg: "#F5D0FE", text: "#A21CAF" }, // pink
    { bg: "#C7D2FE", text: "#3730A3" }, // indigo
  ];

  const getColors = (name) => {
    const index =
      [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      tagColors.length;
    return tagColors[index];
  };

  const batchStatusOption = [
    { label: "Online", value: "Online" },
    { label: "Offline", value: "Offline" },
  ];

  const handleConvertToApplication = (item) => {
    setSelectedForApplication(item);
    setShowConvertModal(true);
  };

  return (
    <>
      <Pageheader
        mainheading="Coaching Students"
        parentfolder="Applications"
        activepage="Coaching Students"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0 d-flex justify-content-between">
              <div className="card-title">Coaching Students</div>
              <div className="d-flex flex-wrap align-items-center gap-2">
                <div className="filter-item">
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
                </div>
                <Button
                  variant="primary"
                  className="custom-select-height"
                  onClick={handleShow}
                >
                  Add Coaching Student
                </Button>
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
                    {userRole === "Super Admin" && (
                      <div className="filter-item">
                        <Form.Label>Branch</Form.Label>
                        <Select
                          className="custom-select-height"
                          options={[
                            { value: "All", label: "All" },
                            { value: "head_office", label: "Head Office" },
                            ...allBranchOptions,
                          ]}
                          value={(() => {
                            if (filters.showAll === true) {
                              return { value: "All", label: "All" };
                            }

                            if (
                              filters.showAll === false &&
                              filters.branch === ""
                            ) {
                              return {
                                value: "head_office",
                                label: "Head Office",
                              };
                            }

                            return (
                              allBranchOptions.find(
                                (option) => option.value === filters.branch
                              ) || null
                            );
                          })()}
                          onChange={async (selectedOption) => {
                            let branch = "";
                            let showAll = false;

                            if (
                              !selectedOption ||
                              selectedOption.value === "All"
                            ) {
                              showAll = true;
                              branch = "";
                            } else if (selectedOption.value === "head_office") {
                              showAll = false;
                              branch = "";
                            } else {
                              showAll = false;
                              branch = selectedOption.value;
                            }

                            setFilters((prev) => ({
                              ...prev,
                              branch,
                              showAll,
                            }));
                            await handleBranchSelection(selectedOption);
                          }}
                          placeholder="Select Branch"
                          isClearable
                          isSearchable
                          classNamePrefix="custom-select"
                          styles={selectStyles}
                          noOptionsMessage={() => "No branches available"}
                        />
                      </div>
                    )}
                    {userRole !== "Coaching Faculty" && (
                      <div className="filter-item">
                        <Form.Label>Faculty</Form.Label>
                        <Select
                          className="filter-height"
                          styles={selectStyles}
                          classNamePrefix="select"
                          options={filterCoachingFaculties?.map((faculty) => ({
                            value: faculty._id,
                            label: faculty.name,
                          }))}
                          value={
                            filterCoachingFaculties
                              ?.map((faculty) => ({
                                value: faculty._id,
                                label: faculty.name,
                              }))
                              .find(
                                (option) => option.value === filters.faculty
                              ) || null
                          }
                          onChange={(selected) => {
                            setFilters({
                              ...filters,
                              faculty: selected ? selected.value : "",
                            });
                            setCurrentPage(1);
                          }}
                          placeholder="Select Faculty"
                          isClearable
                          isSearchable
                          noOptionsMessage={() => "No faculties available"}
                        />
                      </div>
                    )}
                    <div className="filter-item">
                      <Form.Label>Status</Form.Label>
                      <Select
                        className="filter-height"
                        styles={selectStyles}
                        classNamePrefix="select"
                        options={batchStatusOption?.map((item) => ({
                          value: item.value,
                          label: item.label,
                        }))}
                        value={
                          filters.status
                            ? {
                                value: filters.status,
                                label: filters.status,
                              }
                            : null
                        }
                        onChange={(selected) => {
                          setFilters({
                            ...filters,
                            status: selected ? selected.value : "",
                          });
                          setCurrentPage(1);
                        }}
                        placeholder="Select Status"
                        isClearable
                        isSearchable
                        noOptionsMessage={() => "No types available"}
                      />
                    </div>
                    <div className="filter-item">
                      <Form.Label>Targeted Achieved</Form.Label>
                      <Select
                        className="filter-height"
                        styles={selectStyles}
                        classNamePrefix="select"
                        options={targetAchievedOptions?.map((item) => ({
                          value: item.value,
                          label: item.label,
                        }))}
                        value={
                          targetAchievedOptions?.find(
                            (opt) => opt.value === filters.targetAchieved
                          ) || null
                        }
                        onChange={(selected) => {
                          setFilters({
                            ...filters,
                            targetAchieved: selected ? selected.value : "",
                          });
                          setCurrentPage(1);
                        }}
                        placeholder="Select Target"
                        isClearable
                        isSearchable
                        noOptionsMessage={() => "No types available"}
                      />
                    </div>

                    <div className="flex-grow-1"></div>
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
                </>
              )}

              <Modal
                show={showRemarkModal}
                onHide={() => {
                  setShowRemarkModal(false);
                  remarkFormik.resetForm();
                  setEdit({
                    remarkDetails: false,
                    remarkDetailsIndex: 0,
                    remarkDetailsObj: null,
                    studentId: null,
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
                        studentId: null,
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
              <CoachingStudentForm
                show={show}
                handleClose={handleClose}
                formik={formik}
                isLoading={isLoading}
                countries={countries}
                stateDropDown={stateDropDown}
                cityDropDownList={cityDropDownList}
                coachingFaculties={coachingFaculties}
                batchTimes={batchTimes}
                userRole={userRole}
                mainPlans={mainPlans}
                selectStyles={selectStyles}
                formatDate={formatDate}
                parseDate={parseDate}
                toISODate={toISODate}
                handleCountryChange={handleCountryChange}
                handleStateChange={handleStateChange}
                fetchCoachingFaculties={fetchCoachingFaculties}
                fetchBatchTimes={fetchBatchTimes}
                branchList={branchList}
                selectedBranch={selectedBranch}
                setSelectedBranch={setSelectedBranch}
                handleBranchSelection={handleBranchSelection}
                endDateInputRef={endDateInputRef}
                startDateInputRef={startDateInputRef}
              />
              <CoachingStudentCard
                coachingStudentData={coachingStudentData}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                search={search}
                filters={filters}
                canRead={canRead}
                parseDate={parseDate}
                formatDate={formatDate}
                canUpdate={canUpdate}
                canDelete={canDelete}
                userRole={userRole}
                handleEdit={handleEdit}
                setSelectedItem={setSelectedItem}
                setShowDeleteModal={setShowDeleteModal}
                handleViewAttendance={handleViewAttendance}
                handleConvertToApplication={handleConvertToApplication}
              />
              {totalPages > 1 && coachingStudentData?.length > 0 && (
                <Paginations
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={showAttendanceModal}
        onHide={() => {
          setShowAttendanceModal(false);
          setSelectedStudent(null);
          setAttendanceData([]);
          setShowCalendar(false);
        }}
        centered
        size="xl"
      >
        <Modal.Header className="form-main-heading">
          <Modal.Title>Attendance History</Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setShowAttendanceModal(false);
              setSelectedStudent(null);
              setAttendanceData([]);
              setShowCalendar(false);
            }}
          />
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center align-items-center mb-3">
            <Button variant="light" onClick={prevWeek}>
              <BiChevronLeft size={20} />
            </Button>
            <h6
              className="mb-0 px-3"
              style={{ cursor: "pointer" }}
              onClick={() => setShowCalendar(!showCalendar)}
              ref={dateRangeRef}
            >
              {formatShort(attendanceStartDate)} - {formatShort(dates[6])}
            </h6>
            <Button variant="light" onClick={nextWeek}>
              <BiChevronRight size={20} />
            </Button>
          </div>
          {showCalendar && (
            <div
              style={{
                position: "absolute",
                // top: dateRangeRef.current
                //   ? dateRangeRef.current.getBoundingClientRect().bottom +
                //     window.scrollY +
                //     4
                //   : "70px",
                // left: dateRangeRef.current
                //   ? dateRangeRef.current.getBoundingClientRect().left +
                //     window.scrollX
                //   : "auto",
                // zIndex: 9999,
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(5px)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                borderRadius: "8px",
                padding: "10px",
                width: 300,
                minWidth: 300,
                maxWidth: 300,
              }}
            >
              <Calendar
                className="form-control m-0 p-0 border-0"
                onChange={(date) => {
                  setAttendanceStartDate(date);
                  setShowCalendar(false);
                }}
                value={attendanceStartDate}
                locale="en-GB"
              />
            </div>
          )}
          {attendanceData?.length > 0 ? (
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>Student</th>
                  {dates.map((date) => {
                    const isToday =
                      date.toDateString() === new Date().toDateString();
                    return (
                      <th key={date} className="text-center">
                        <div style={{ fontWeight: "bold" }}>
                          {isToday
                            ? "Today"
                            : date
                                .toLocaleDateString("en-US", {
                                  weekday: "short",
                                })
                                .toUpperCase()}
                        </div>
                        <small>{formatDate(date).toUpperCase()}</small>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedStudent?.name}</td>
                  {dates.map((date) => {
                    const dateString = date.toISOString().split("T")[0];
                    const { status, remark } = getAttendanceStatus(
                      selectedStudent?._id,
                      dateString
                    );
                    const isToday =
                      date.toDateString() === new Date().toDateString();
                    return (
                      <td
                        key={dateString}
                        className="text-center"
                        style={{
                          backgroundColor: isToday ? "#f9f9f9" : "transparent",
                        }}
                      >
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            remark ? (
                              <Tooltip
                                id={`tooltip-${selectedStudent?._id}-${dateString}`}
                              >
                                {remark}
                              </Tooltip>
                            ) : (
                              <Tooltip
                                id={`tooltip-${selectedStudent?._id}-${dateString}`}
                              >
                                No remark
                              </Tooltip>
                            )
                          }
                        >
                          <div style={getButtonStyle(status)}>
                            {status === "present" && <Check fontSize="small" />}
                            {status === "absent" && <Close fontSize="small" />}
                            {status === null && <span>•</span>}
                          </div>
                        </OverlayTrigger>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-5">
              No attendance data available for this student
            </div>
          )}
          {/* Legend */}
          <div className="d-flex gap-4 mt-3 flex-wrap justify-content-center">
            {["present", "absent", "notMarked"].map((type) => {
              let bgColor, icon, textColor, label;
              if (type === "present") {
                bgColor = "#d4f5d4";
                icon = <Check fontSize="small" />;
                label = "Present";
                textColor = "green";
              } else if (type === "absent") {
                bgColor = "#fddddd";
                icon = <Close fontSize="small" />;
                label = "Absent";
                textColor = "red";
              } else {
                bgColor = "#E8E8F7";
                icon = <span style={{ fontWeight: "bold" }}>•</span>;
                label = "Not Marked";
                textColor = "#555";
              }
              return (
                <div key={type} className="d-flex align-items-center gap-2">
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: bgColor,
                      color: textColor,
                    }}
                  >
                    {icon}
                  </div>
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="link"
            className="custom-select-height btn border-primary text-primary text-decoration-none"
            onClick={() => {
              setShowAttendanceModal(false);
              setSelectedStudent(null);
              setAttendanceData([]);
              setShowCalendar(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header className="form-main-heading">
          <Modal.Title className="fw-semibold">Confirm Deletion</Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={() => setShowDeleteModal(false)}
          />
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <div className="text-danger text-primary fs-1 mb-3">
            <i className="bi bi-exclamation-triangle-fill"></i>
          </div>
          <p className="mb-1 fw-semibold">
            Are you sure you want to delete this item?
          </p>
          <small className="text-muted">This action cannot be undone.</small>
        </Modal.Body>

        <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
          <Button
            variant="light"
            className="btn-cancel-delete px-4"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button
            className="btn-delete-confirm"
            onClick={() => {
              handleDelete(selectedItem);
            }}
          >
            <i className="bi bi-trash-fill me-2"></i>Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDocumentsModal}
        onHide={() => {
          setShowDocumentsModal(false);
          setSelectedDocuments([]);
          setSelectedStudent(null);
        }}
        centered
        size="lg"
      >
        <Modal.Header className="form-main-heading">
          <Modal.Title>View Documents</Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={() => {
              setShowDocumentsModal(false);
              setSelectedDocuments([]);
              setSelectedStudent(null);
            }}
          />
        </Modal.Header>
        <Modal.Body>
          {selectedDocuments?.length > 0 ? (
            <div>
              <h6>Documents for {selectedStudent?.name || "Student"}</h6>
              <Table bordered hover responsive>
                <thead>
                  <tr>
                    <th>Exam Name</th>
                    <th>Document</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDocuments?.map((exam, index) => (
                    <tr key={index}>
                      <td>{exam?.examName || "N/A"}</td>
                      <td>
                        {exam?.document ? (
                          <a
                            href={exam?.document}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary"
                          >
                            View Document
                          </a>
                        ) : (
                          <span>
                            {exam?.document?.name || "Document Available"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-5">No documents available</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="link"
            className="custom-select-height btn border-primary text-primary text-decoration-none"
            onClick={() => {
              setShowDocumentsModal(false);
              setSelectedDocuments([]);
              setSelectedStudent(null);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <ConvertToApplication
        setShowConvertModal={setShowConvertModal}
        showConvertModal={showConvertModal}
        selectedForApplication={selectedForApplication}
        userRole={userRole}
      />
    </>
  );
};

export default CoachingStudent;
