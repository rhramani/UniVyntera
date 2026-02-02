import * as Yup from "yup";
import { Button, Col, Form, Modal, Row, Card, Table } from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Select from "react-select";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import DownloadIcon from "@mui/icons-material/Download";
import CancelIcon from "@mui/icons-material/Cancel";
import UploadIcon from "@mui/icons-material/Upload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { FaTrashAlt } from "react-icons/fa";

import {
  updateStudentApplication,
  getOneStudentApplication,
  downloadDocument,
  deleteStudentApplication,
  pendingDocMail,
} from "../../../../redux/actions/Student/StudentApplication.action";
import {
  getAllInstitute,
  instituteWiseCampusDropdown,
  instituteWiseProgramLevelDropdown,
} from "../../../../redux/actions/Master/Institute.action";
import {
  currencyCode,
  getAllCourseFinder,
} from "../../../../redux/actions/CourseFinder.action";
import { BASEURL, REACT_APP_API_URL } from "../../../../baseUrl";
import LoadMoreButton from "../../../commonComponents/LoadMoreButton";
import { useFormik } from "formik";
import { decryptData, encryptData } from "../../../../utils/encryptionUtils";
import usePermissions from "../../../commonComponents/usePermissions";
import UpdateInterestedCourse from "./sections/UpdateInterestedCourse";
import UniversityPortalDetails from "./sections/UniversityPortalDetails";

import TypeOfApplication from "./sections/TypeOfApplication";
import ApplicationSubmission from "./sections/ApplicationSubmission";
import InterviewScheduling from "./sections/InterviewScheduling";
import OfferLetterProcess from "./sections/OfferLetterProcess";
import OfferLetterAcceptance from "./sections/OfferLetterAcceptance";
import InstituteFeePayment from "./sections/InstituteFeePayment";
import DepositPaymentSection from "./sections/DepositPaymentSection";

const interestedCourseValidationSchema = Yup.object({
  interestedCourseDetails: Yup.array().of(
    Yup.object({
      institute: Yup.string().required("Institute is required"),
      course: Yup.string().required("Course is required"),
      intakeMonth: Yup.string(),
      intakeYear: Yup.string(),
      status: Yup.string(),
      remarks: Yup.string(),
      campus: Yup.string().required("Campus is required"),
      programLevel: Yup.string(),
    })
  ),
});
const InterestedApplicationInitiation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { state } = useLocation();
  const { activeTab } = location.state || {};
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions(
    "Student Applications",
    "Course Selection"
  );

  const [selectedOption, setSelectedOption] = useState(null);
  const [otherDocName, setOtherDocName] = useState(
    "Compulsory Agreement Document"
  );
  const [programLevelData, setProgramLevelData] = useState([]);
  const [otherDocFile, setOtherDocFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allcourseData, setAllCourseData] = useState([]);
  const [instituteData, setInstituteData] = useState([]);
  const [campusData, setCampusData] = useState([]);
  const [formData, setFormData] = useState(state?.formData || {});
  const [localCourses, setLocalCourses] = useState([]);
  const [showModal, setShowModal] = useState(
    state?.showCounsellingModal || false
  );
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [editState, setEditState] = useState(
    state?.edit || { interestedCourseDetails: false, interestedCourseIndex: 0 }
  );

  const [showInterviewSection, setShowInterviewSection] = useState(() => {
    const encryptedValue = localStorage.getItem("showInterviewSection");

    const storedValue = decryptData(encryptedValue);

    return storedValue === null ? true : storedValue === "true";
  });

  useEffect(() => {
    const encryptedValue = encryptData(String(showInterviewSection));

    localStorage.setItem("showInterviewSection", encryptedValue);
  }, [showInterviewSection]);

  const {
    interestedCourseFormikValues = { interestedCourseDetails: [{}] },
    interestedCourseStatus = [],
    oneStudentData = {},
    setOneStudentData,
  } = state || {};

  const [selectedSection, setSelectedSection] = useState("all");
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [selectedRows, setSelectedRows] = useState({});
  const [selectAllByType, setSelectAllByType] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const userRole = decryptData(localStorage.getItem("role"));
  const userType = decryptData(localStorage.getItem("userRole"));
  const isRestrictedRole = [
    "B2B Admin",
    "B2B Member",
    "Branch",
    "Branch User",
  ].includes(userRole || userType);

  const isRestrictedRoleForDownload = ["Branch", "Branch User"].includes(
    userRole || userType
  );

  const [currencyCodeData, setCurrencyCodeData] = useState([]);

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "#28a745";
      case "unverified":
        return "#ffc107";
      case "Reupload":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const scrollContainerRef = useRef(null);

  const sections = [
    { key: "all", label: "All" },
    ...(!["Student", "B2B Admin", "B2B Member"].includes(userRole)
      ? [{ key: "universityPortalDetails", label: "University Portal Details" }]
      : []),
    // ...(oneStudentData?.purposeDetails?.preferredCountry[0] === "Finland" ||
    // oneStudentData?.purposeDetails?.preferredCountry[0] === "finland"
    //   ? [{ key: "applicationType", label: "Type of Application" }]
    //   : []),
    { key: "applicationType", label: "Type of Application" },
    { key: "proofUpload", label: "Application Submission" },
    ...(showInterviewSection
      ? [{ key: "interviewScheduling", label: "Interview Scheduling" }]
      : []),
    { key: "offerLetterProcess", label: "Offer Letter Process" },
    { key: "offerLetterAcceptance", label: "Offer Letter Acceptance" },
    { key: "instituteFeePayment", label: "Institute Fee Payment" },
    { key: "depositPayment", label: "Deposit Payment" },
    { key: "rgdocument", label: "US Documents" },
  ];

  const fetchAllCurrencyCode = async () => {
    const response = await dispatch(currencyCode(1, 100));
    const responseData = response?.data?.data;
    setCurrencyCodeData(responseData || []);
  };

  const fetchAllInstitute = async (country) => {
    try {
      const response = await dispatch(getAllInstitute(1, 100, "", country));
      setInstituteData(response?.data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching institutes:", error);
      setInstituteData([]);
      toast.dismiss();
    }
  };

  const fetchAllCourse = async (country, campus) => {
    try {
      const res = await dispatch(
        getAllCourseFinder(1, 1000, { country, campus })
      );
      if (res?.status === 200) {
        const programNames =
          res?.data?.data?.data
            ?.filter((item) => item.status === "Active")
            ?.map((item) => ({
              _id: item._id,
              programName: item.programName,
              intakeMonths: item.intakes?.map((intake) => intake.month) || [],
              intakeYears: item.intakeYear || [],
            })) || [];
        setAllCourseData([
          ...new Map(programNames.map((item) => [item._id, item])).values(),
        ]);
      } else {
        console.error("Error fetching courses:", res?.data?.message);
        setAllCourseData([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setAllCourseData([]);
    }
  };

  const instituteOptions = Array.from(
    new Map(
      instituteData
        ?.sort((a, b) => a.instituteName.localeCompare(b.instituteName))
        ?.map((institute) => [institute.instituteName, institute])
    ).values()
  ).map((institute) => ({
    label: institute.instituteName,
    value: institute._id,
  }));

  const fetchAllCampusByInstitute = async (selectedOption, country) => {
    try {
      const response = await dispatch(
        instituteWiseCampusDropdown(selectedOption, country)
      );
      const responseData = response?.data?.data || [];
      setCampusData(responseData);
      fetchProgramLevels(selectedOption, country);
    } catch (error) {
      console.error("Error fetching campuses:", error);
      setCampusData([]);
    }
  };

  const fetchStudentData = async () => {
    try {
      const res = await dispatch(getOneStudentApplication(id));
      if (res?.status === 200) {
        const studentData = res.data.data;
        setFormData(studentData);
        const courseData =
          studentData.interestedCourseDetails?.[
            editState.interestedCourseIndex
          ] || {};
        setLocalCourses(
          editState.interestedCourseDetails && courseData
            ? [
                {
                  ...courseData,
                  institute: {
                    _id: courseData.institute?._id || "",
                    instituteName:
                      courseData.institute?.instituteName ||
                      "Unknown Institute",
                  },
                  course: {
                    _id: courseData.course?._id || "",
                    programName:
                      courseData.course?.programName || "Unknown Course",
                  },
                },
              ]
            : []
        );
      } else {
        toast.error(res?.data?.message || "Error fetching student data");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error(
        error?.response?.data?.message || "Error fetching student data"
      );
    }
  };

  const fetchProgramLevels = async (instituteName, country) => {
    if (!instituteName || !country) {
      setProgramLevelData([]);
      return;
    }
    try {
      const res = await dispatch(
        instituteWiseProgramLevelDropdown(instituteName, country)
      );
      if (res?.status === 200) {
        setProgramLevelData(res.data?.data || []);
      } else {
        setProgramLevelData([]);
      }
    } catch (e) {
      console.error(e);
      setProgramLevelData([]);
    }
  };
  useEffect(() => {
    const fetchProgramLevelsForExistingCourses = async () => {
      const country = oneStudentData?.purposeDetails?.preferredCountry?.[0];
      if (!country || !formData.interestedCourseDetails?.length) return;

      const instituteIds = [
        ...new Set(
          formData.interestedCourseDetails
            .map((ic) => ic.institute?._id)
            .filter(Boolean)
        ),
      ];

      for (const instId of instituteIds) {
        const institute = instituteData.find((i) => i._id === instId);
        if (institute) {
          await fetchProgramLevels(institute.instituteName, country);
        }
      }
    };

    if (instituteData.length > 0) {
      fetchProgramLevelsForExistingCourses();
    }
  }, [
    formData.interestedCourseDetails,
    instituteData,
    oneStudentData?.purposeDetails?.preferredCountry,
  ]);

  useEffect(() => {
    fetchStudentData();
    fetchAllCurrencyCode();
    const preferredCountries =
      oneStudentData?.purposeDetails?.preferredCountry || [];
    const selectedCampus =
      interestedCourseFormik.values.interestedCourseDetails?.[0]?.campus;
    if (preferredCountries?.length > 0 && selectedCampus) {
      Promise.all([
        fetchAllCourse(preferredCountries[0], selectedCampus),
        fetchAllInstitute(preferredCountries[0]),
      ]);
    }
  }, [id, oneStudentData?.purposeDetails?.preferredCountry]);

  const interestedCourseFormik = useFormik({
    initialValues: {
      ...interestedCourseFormikValues,
    },
    validationSchema: interestedCourseValidationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      await handleEditInterestedCourse(values);
    },
  });

  useEffect(() => {
    const instituteId =
      interestedCourseFormik.values.interestedCourseDetails[0].institute;
    const instituteName = instituteOptions?.find(
      (option) => option.value === instituteId
    )?.label;

    const preferredCountries =
      oneStudentData?.purposeDetails?.preferredCountry || [];
    if (instituteName && instituteId && preferredCountries) {
      fetchAllCampusByInstitute(instituteName, preferredCountries[0]);
    }
  }, [showModal]);

  useEffect(() => {
    if (localCourses[0]) {
      const currentStatus = localCourses[0]?.typeOfApplication || "";

      // Type of Application
      const option =
        options?.find((opt) => opt.value === currentStatus) || null;
      setSelectedOption(option);
      interestedCourseFormik.setFieldValue("typeOfApplication", currentStatus);
    }
  }, [localCourses]);

  const handleEditInterestedCourse = async (values) => {
    const updatedIndex = editState.interestedCourseIndex;
    const updatedEntry = values.interestedCourseDetails[0];
    const courseId = formData.interestedCourseDetails[updatedIndex]?._id;

    if (!courseId) {
      toast.error("Invalid course ID. Cannot update.");
      return;
    }

    const errors = await interestedCourseFormik.validateForm();
    if (
      errors.interestedCourseDetails?.[0]?.institute ||
      errors.interestedCourseDetails?.[0]?.course ||
      errors.interestedCourseDetails?.[0]?.campus ||
      errors.interestedCourseDetails?.[0]?.intakeMonth ||
      errors.interestedCourseDetails?.[0]?.intakeYear ||
      (values.typeOfApplication === "Tailormade" &&
        errors.interestedCourseDetails?.[0]?.document)
    ) {
      interestedCourseFormik.setTouched({
        interestedCourseDetails: [
          {
            institute: true,
            course: true,
            campus: true,
            intakeMonth: true,
            intakeYear: true,
            document: values.typeOfApplication === "Tailormade" ? true : false,
          },
        ],
      });
      toast.error("Please fill all required fields.");
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        interestedCourseId: courseId,
        interestedCourseUpdate: {
          institute: updatedEntry.institute,
          course: updatedEntry.course,
          campus: updatedEntry.campus,
          intakeMonth: updatedEntry.intakeMonth,
          intakeYear: updatedEntry.intakeYear,
          status: updatedEntry.status,
          remarks: updatedEntry.remarks,
          typeOfApplication: values.typeOfApplication,
        },
      };
      const res = await dispatch(updateStudentApplication(payload, id));

      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("Interested course updated successfully");

        const institute = instituteData.find(
          (inst) => inst._id === updatedEntry.institute
        ) || {
          _id: updatedEntry.institute,
          instituteName: "Unknown Institute",
        };
        const course = allcourseData.find(
          (c) => c._id === updatedEntry.course
        ) || {
          _id: updatedEntry.course,
          programName: "Unknown Course",
        };
        const campus = campusData.find(
          (c) => c._id === updatedEntry.campus
        ) || {
          _id: updatedEntry.campus,
          campus: "Unknown campus",
        };

        const programLevel = programLevelData.find(
          (pl) => pl._id === updatedEntry.programLevel
        ) || {
          _id: updatedEntry.programLevel,
          name: "Unknown Program Level",
        };

        const updatedCourse = {
          ...localCourses[0],
          institute: {
            _id: institute._id,
            instituteName: institute.instituteName,
          },
          course: { _id: course._id, programName: course.programName },
          campus: { _id: campus._id, campus: campus.campus },
          intakeMonth: updatedEntry.intakeMonth,
          intakeYear: updatedEntry.intakeYear,
          status: updatedEntry.status,
          remarks: updatedEntry.remarks,
          typeOfApplication: values.typeOfApplication,
          createdByName:
            res.data.data.interestedCourseDetails?.[0]?.createdByName ||
            localCourses[0]?.createdByName,
          updatedByName:
            res.data.data.interestedCourseDetails?.[0]?.updatedByName ||
            localCourses[0]?.updatedByName,
          _id: courseId,
        };

        setLocalCourses([updatedCourse]);

        setFormData({
          ...formData,
          interestedCourseDetails: formData.interestedCourseDetails.map(
            (item, index) => (index === updatedIndex ? updatedCourse : item)
          ),
        });

        setEditState({
          interestedCourseDetails: false,
          interestedCourseIndex: 0,
        });
        setShowModal(false);
        interestedCourseFormik.resetForm();
        setOtherDocFile(null);
        setOtherDocName("");
      } else {
        toast.error(res?.data?.message || "Error updating interested course");
      }
    } catch (error) {
      console.error("Error updating interested course:", error);
      toast.error(
        error?.response?.data?.message || "Error updating interested course"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = async (docName, files, formikInstance) => {
    if (!docName || !files || files.length === 0) {
      toast.error("Please provide document name and at least one file");
      return null;
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > maxSizeInBytes) {
        toast.error(`File ${files[i].name} must be less than 5MB`);
        return null;
      }
    }

    setIsLoading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("customDocumentName", docName);
      uploadFormData.append("ref_module", localCourses?.[0]?._id);

      for (let i = 0; i < files.length; i++) {
        uploadFormData.append("uploadedDocument", files[i]);
      }

      const res = await dispatch(updateStudentApplication(uploadFormData, id));

      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return null;
        }

        const newDocs =
          res.data.data.uploadedDocumentDetails?.slice(-files.length) || [];
        const newDocumentEntries = newDocs.map((doc) => ({
          _id: doc._id,
          customDocumentName: doc.customDocumentName || docName,
          filePath: doc.filePath,
          fileUrl: doc.filePath ? `${REACT_APP_API_URL}/${doc.filePath}` : "",
          status: doc.status || "unverified",
          createdByName: doc.createdByName || "Unknown",
          createdAt: doc.createdAt,
          remarks: doc.remarks || "",
        }));

        const updatedCourse = {
          ...localCourses[0],
          paymentDocument:
            docName === "Fee Payment Proof"
              ? [
                  ...(localCourses[0].paymentDocument || []),
                  ...newDocumentEntries,
                ]
              : newDocumentEntries[0], // Single file for other documents
          document: docName.includes("Offer Letter")
            ? [...(localCourses[0].document || []), ...newDocumentEntries]
            : newDocumentEntries[0], // Single file for other documents
        };

        setLocalCourses([updatedCourse]);

        setFormData({
          ...formData,
          interestedCourseDetails: formData.interestedCourseDetails.map(
            (item, index) =>
              index === editState.interestedCourseIndex ? updatedCourse : item
          ),
        });

        toast.success("Documents uploaded successfully");
        setOtherDocName("");
        setOtherDocFile(null);
        const fieldNames = [
          "proofDocument",
          "uploadOfferLetter",
          "paymentDocument",
          "interestedCourseDetails[0].document",
        ];
        fieldNames.forEach((field) => {
          const input = document.querySelector(`input[name="${field}"]`);
          if (input) {
            input.value = "";
            formikInstance.setFieldValue(
              field,
              field === "uploadOfferLetter" ? [] : null
            );
          }
        });

        setShowModal(false);
        await fetchStudentData();
        return newDocumentEntries;
      } else {
        toast.error(res?.data?.message || "Error uploading documents");
        return null;
      }
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast.error(
        error?.response?.data?.message || "Error uploading documents"
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  const handleUpdateApplicationStatus = async (field, value) => {
    const updatedIndex = editState.interestedCourseIndex;
    const courseId = formData.interestedCourseDetails[updatedIndex]?._id;

    if (!courseId) {
      toast.error("Invalid course ID. Cannot update status.");
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        interestedCourseId: courseId,
        interestedCourseUpdate: {
          [field]: value,
        },
      };

      const res = await dispatch(updateStudentApplication(payload, id));

      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        if (value !== "Tailormade" || field !== "typeOfApplication") {
          toast.success("Application status updated successfully");
        }

        const institute = instituteData.find(
          (inst) => inst._id === localCourses[0].institute?._id
        ) || {
          _id: localCourses[0].institute?._id,
          instituteName: "Unknown Institute",
        };
        const course = allcourseData.find(
          (c) => c._id === localCourses[0].course?._id
        ) || {
          _id: localCourses[0].course?._id,
          programName: "Unknown Course",
        };
        const campus = campusData.find(
          (c) => c._id === localCourses[0].campus
        ) || {
          _id: localCourses[0].campus,
          campus: "Unknown campus",
        };

        const updatedCourse = {
          ...localCourses[0],
          [field]: value,
          institute: {
            _id: institute._id,
            instituteName: institute.instituteName,
          },
          course: { _id: course._id, programName: course.programName },
          campus: { _id: campus._id, campus: campus.campus },
          createdByName:
            res.data.data.interestedCourseDetails?.[0]?.createdByName ||
            localCourses[0]?.createdByName,
          updatedByName:
            res.data.data.interestedCourseDetails?.[0]?.updatedByName ||
            localCourses[0]?.updatedByName,
          _id: courseId,
        };

        setLocalCourses([updatedCourse]);
        await fetchStudentData();
        setFormData({
          ...formData,
          interestedCourseDetails: formData.interestedCourseDetails.map(
            (item, index) => (index === updatedIndex ? updatedCourse : item)
          ),
        });
        await fetchStudentData();
      } else {
        toast.error(res?.data?.message || "Error application status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(
        error?.response?.data?.message || "updating application status"
      );
    }
    setIsLoading(false);
  };

  const handleFileChange = async (event, formikInstance) => {
    const files = event.target.files;
    const fieldName = event.target.name;

    if (files && files.length > 0) {
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

      // Allowed types: images, pdf, doc, docx, xls, xlsx
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
        "application/msword", // .doc
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "application/vnd.ms-excel", // .xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      ];

      const isPaymentDocument = fieldName === "paymentDocument";

      const validFiles = Array.from(files)
        .slice(0, isPaymentDocument ? files.length : 1)
        .filter((file) => {
          if (!allowedTypes.includes(file.type)) {
            toast.error(`File ${file.name} is not a valid file type`);
            return false;
          }
          if (file.size > maxSizeInBytes) {
            toast.error(`File ${file.name} must be less than 5MB`);
            return false;
          }
          return true;
        });

      if (validFiles.length === 0) {
        formikInstance.setFieldValue(fieldName, null);
        setOtherDocFile(null);
        setOtherDocName("");
        return;
      }

      setOtherDocFile(validFiles);

      let docName = "";

      if (fieldName === "proofDocument") {
        docName = "Application Submission Form";
        formikInstance.setFieldValue("proofDocument", validFiles[0]);
        await handleDocumentUpload(docName, [validFiles[0]], formikInstance);
      } else if (fieldName === "paymentDocument") {
        docName = "Fee Payment Proof";
        formikInstance.setFieldValue("paymentDocument", validFiles);
        setOtherDocName(docName);
      } else if (fieldName === "interestedCourseDetails[0].document") {
        docName = "Compulsory Agreement Document";
        formikInstance.setFieldValue(
          "interestedCourseDetails[0].document",
          validFiles[0]
        );
        await handleDocumentUpload(docName, [validFiles[0]], formikInstance);
      }
    } else {
      setOtherDocFile(null);
      formikInstance.setFieldValue(fieldName, null);
      setOtherDocName("");
    }
  };

  const handleRemoveDocument = async (documentId) => {
    if (!documentId) {
      toast.error("Invalid document detail. Cannot delete.");
      return;
    }

    try {
      const res = await dispatch(deleteStudentApplication({ documentId }, id));
      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("Document deleted successfully");
        setFormData((prev) => ({
          ...prev,
          uploadedDocumentDetails: prev.uploadedDocumentDetails.filter(
            (doc) => doc?._id !== documentId
          ),
        }));
        await fetchStudentData();
      } else {
        toast.error(res?.data?.message || "Error deleting document");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error(error?.response?.data?.message || "Error deleting document");
    }
  };

  const handleCheckboxChange = (
    docIndex,
    index,
    typeKey,
    uploadedDocId,
    rowKey
  ) => {
    setSelectedRows((prev) => {
      const newRowKey =
        typeKey === "other"
          ? `other--1-${index}`
          : typeKey === "rgdocument"
          ? `rgdocument--1-${index}`
          : rowKey;
      const newSelected = { ...prev, [newRowKey]: !prev[newRowKey] };

      setSelectedIds((prev) => {
        const currentIds = prev[typeKey] ? [...prev[typeKey]] : [];
        let newSelectedIdsForType;

        if (uploadedDocId) {
          if (newSelected[newRowKey]) {
            newSelectedIdsForType = [...currentIds, uploadedDocId];
          } else {
            newSelectedIdsForType = currentIds.filter(
              (id) => id !== uploadedDocId
            );
          }
        } else {
          newSelectedIdsForType = currentIds;
        }

        const newSelectedIds = {
          ...prev,
          [typeKey]: newSelectedIdsForType,
        };

        let allCheckedForType;
        if (docIndex === -1 && typeKey === "other") {
          const excludedDocuments = [
            "Application Submission Form",
            "Fee Payment Proof",
            "Conditional Offer Letter",
            "Unconditional Offer Letter",
            "Rejection Letter",
            "Compulsory Agreement Document",
          ];
          const otherDocs =
            oneStudentData?.uploadedDocumentDetails?.filter((doc) => {
              const isCategorized =
                countryDocuments?.data?.[0]?.documents?.some((catDoc) =>
                  catDoc.documentList?.some((d) => d?._id === doc.documentName)
                );
              return (
                (doc.customDocumentName || !isCategorized) &&
                !excludedDocuments.includes(doc.customDocumentName)
              );
            }) || [];
          allCheckedForType = otherDocs.every(
            (_, idx) => !otherDocs[idx]?._id || newSelected[`other--1-${idx}`]
          );
        } else if (docIndex === -1 && typeKey === "rgdocument") {
          const allowedDocuments = [
            "Application Submission Form",
            "Fee Payment Proof",
            "Conditional Offer Letter",
            "Unconditional Offer Letter",
            "Rejection Letter",
            "Compulsory Agreement Document",
          ];
          const rgDocs =
            oneStudentData?.uploadedDocumentDetails?.filter((doc) => {
              return (
                doc.customDocumentName &&
                allowedDocuments.includes(doc.customDocumentName)
              );
            }) || [];
          allCheckedForType = rgDocs.every(
            (_, idx) => !rgDocs[idx]?._id || newSelected[`rgdocument--1-${idx}`]
          );
        } else {
          const typeDocuments =
            countryDocuments?.data?.[0]?.documents?.[docIndex]?.documentList;
          allCheckedForType = typeDocuments.every((document, idx) => {
            const uploadedDocs =
              oneStudentData?.uploadedDocumentDetails?.filter(
                (uploaded) => uploaded.documentName === document?._id
              );
            if (!uploadedDocs || uploadedDocs.length === 0) return true;
            return uploadedDocs.every(
              (_, uploadIdx) => newSelected[`${docIndex}-${idx}-${uploadIdx}`]
            );
          });
        }

        setSelectAllByType((prev) => ({
          ...prev,
          [typeKey]: allCheckedForType,
        }));

        return newSelectedIds;
      });

      return newSelected;
    });
  };

  const handleSelectAllChange = (docIndex, typeKey) => {
    const newSelectAll = !selectAllByType[typeKey];
    setSelectAllByType((prev) => ({
      ...prev,
      [typeKey]: newSelectAll,
    }));

    const newSelectedRows = { ...selectedRows };
    let newSelectedIdsForType = [];

    if (docIndex === -1 && typeKey === "other") {
      const excludedDocuments = [
        "Application Submission Form",
        "Fee Payment Proof",
        "Conditional Offer Letter",
        "Unconditional Offer Letter",
        "Rejection Letter",
        "Compulsory Agreement Document",
      ];
      const otherDocs =
        oneStudentData?.uploadedDocumentDetails?.filter((doc) => {
          const isCategorized = countryDocuments?.data?.[0]?.documents?.some(
            (catDoc) =>
              catDoc.documentList?.some((d) => d?._id === doc.documentName)
          );
          return (
            (doc.customDocumentName || !isCategorized) &&
            !excludedDocuments.includes(doc.customDocumentName)
          );
        }) || [];

      otherDocs?.forEach((doc, index) => {
        const key = `other--1-${index}`;
        if (doc?._id && doc.status !== "Reupload") {
          newSelectedRows[key] = newSelectAll;
          if (newSelectAll) {
            newSelectedIdsForType.push(doc?._id);
          }
        } else {
          newSelectedRows[key] = false;
        }
      });
    } else if (docIndex === -1 && typeKey === "rgdocument") {
      const allowedDocuments = [
        "Application Submission Form",
        "Fee Payment Proof",
        "Conditional Offer Letter",
        "Unconditional Offer Letter",
        "Rejection Letter",
        "Compulsory Agreement Document",
      ];
      const rgDocs =
        oneStudentData?.uploadedDocumentDetails?.filter((doc) => {
          return (
            doc.customDocumentName &&
            allowedDocuments.includes(doc.customDocumentName)
          );
        }) || [];

      rgDocs?.forEach((doc, index) => {
        const key = `rgdocument--1-${index}`;
        if (doc?._id && doc.status !== "Reupload") {
          newSelectedRows[key] = newSelectAll;
          if (newSelectAll) {
            newSelectedIdsForType.push(doc?._id);
          }
        } else {
          newSelectedRows[key] = false;
        }
      });
    } else {
      countryDocuments?.data?.[0]?.documents?.[docIndex]?.documentList?.forEach(
        (document, index) => {
          const uploadedDocs = oneStudentData?.uploadedDocumentDetails?.filter(
            (uploaded) => uploaded.documentName === document?.document._id
          );

          if (uploadedDocs && uploadedDocs?.length > 0) {
            uploadedDocs?.forEach((uploadedDoc, uploadIndex) => {
              const key = `${docIndex}-${index}-${uploadIndex}`;
              if (uploadedDoc?._id && uploadedDoc?.status !== "Reupload") {
                newSelectedRows[key] = newSelectAll;
                if (newSelectAll) {
                  newSelectedIdsForType.push(uploadedDoc?._id);
                }
              } else {
                newSelectedRows[key] = false;
              }
            });
          } else {
            const key = `${docIndex}-${index}`;
            newSelectedRows[key] = false;
          }
        }
      );
    }

    setSelectedRows(newSelectedRows);
    setSelectedIds((prev) => ({
      ...prev,
      [typeKey]: newSelectAll ? newSelectedIdsForType : [],
    }));
  };

  const sendPendingDocumentMain = (id, selectedDocumentNames) => {
    const toastId = toast.loading("Sending the pending documents email");

    try {
      dispatch(pendingDocMail(id, selectedDocumentNames))
        .then((res) => {
          if (res?.status === 200) {
            toast.update(toastId, {
              render:
                res?.data?.data || "Pending documents email sent successfully",
              type: "success",
              isLoading: false,
              autoClose: 3000,
            });
            setSelectedDocsIds([]);
            setSelectedDocumentNames([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching pending doc count:", error);
        });
    } catch (error) {
      console.error("Error fetching pending doc count:", error);
    }
  };
  const handleSingleDocumentDownload = async (filePath, fileName) => {
    try {
      if (!filePath) {
        toast.error("File path not found");
        return;
      }

      // ✅ Ensure the file URL is absolute (important!)
      let fileUrl = filePath;
      if (!fileUrl.startsWith("http") && !fileUrl.startsWith("https")) {
        // 👉 Replace with your backend/server base URL
        // Example for local:
        fileUrl = `${BASEURL}/${filePath}`;
        // Example for production:
        // fileUrl = `https://yourdomain.com/${filePath}`;
      }

      // ✅ Fetch the file as binary data
      const response = await fetch(fileUrl, { method: "GET" });
      if (!response.ok) {
        throw new Error("Unable to download file. File not found on server.");
      }

      // ✅ Convert to blob (binary data)
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // ✅ Clean and decode file name
      let downloadFileName = decodeURIComponent(
        fileName?.trim() || fileUrl.split("/").pop() || "downloaded_file"
      );

      // ✅ Add extension if missing
      const contentType = blob.type;
      if (!/\.[a-zA-Z0-9]+$/.test(downloadFileName)) {
        if (contentType.includes("jpeg")) downloadFileName += ".jpg";
        else if (contentType.includes("png")) downloadFileName += ".png";
        else if (contentType.includes("pdf")) downloadFileName += ".pdf";
        else downloadFileName += ".file";
      }

      // ✅ Create temporary link to trigger download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", downloadFileName);
      document.body.appendChild(link);
      link.click();

      // ✅ Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast.success("File downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error(error.message || "Error downloading file");
    }
  };

  const handleAllDownloadDocument = async (applicationId, documentIds) => {
    setIsLoading(true);
    if (documentIds.length === 0) {
      toast.error("Please select at least one document to download");
      return;
    }

    try {
      const ids = documentIds.join(",");
      const res = await dispatch(downloadDocument(applicationId, ids));

      if (res?.status === 200) {
        const blob = new Blob([res.data], {
          type: res.headers["content-type"] || "application/zip",
        });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        const contentDisposition = res.headers["content-disposition"];
        let fileName = "documents.zip";
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
          if (fileNameMatch && fileNameMatch[1]) {
            fileName = fileNameMatch[1];
          }
        }
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("Documents downloaded successfully");
        setSelectedIds([]);
        setSelectedRows({});
        setSelectAllByType({});
      } else {
        toast.error(res?.data?.message || "Error downloading documents");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error downloading documents"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChangeId = (id, documentName) => {
    setSelectedDocsIds((prev) => {
      const updatedIds = prev?.includes(id)
        ? prev?.filter((item) => item !== id)
        : [...prev, id];
      setSelectedDocumentNames((prevNames) => {
        if (updatedIds?.includes(id)) {
          return prevNames?.includes(documentName)
            ? prevNames
            : [...prevNames, documentName];
        } else {
          return prevNames?.filter((name) => name !== documentName);
        }
      });
      return updatedIds;
    });
  };

  const handleStatusChange = async (documentId) => {
    setShowStatusModal(false);
    setIsLoading(true);
    try {
      const payload = {
        documentId,
        documentUpdate: {
          status: selectedStatus.value,
          remarks,
        },
      };
      const res = await dispatch(updateStudentApplication(payload, id));
      if (res?.status === 200) {
        toast.success("Status updated successfully");
        setShowStatusModal(false);
        setSelectedStatus(null);
        setRemarks("");
        setSelectedDocId(null);
        await fetchStudentData();
      } else {
        toast.error(res?.data?.message || "Error updating status");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtherDocUpload = async (e, index, documentId, docName) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsLoading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("uploadedDocument", file);
      uploadFormData.append("documentId", documentId);
      uploadFormData.append("customDocumentName", docName);

      const res = await dispatch(updateStudentApplication(uploadFormData, id));
      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
        } else {
          toast.success("File uploaded successfully");
          await fetchStudentData();
        }
      } else {
        toast.error(res?.data?.message || "Error uploading document");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Error preparing file for reupload");
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { value: "verified", label: "Verified" },
    { value: "unverified", label: "Unverified" },
    { value: "Reupload", label: "Reupload" },
  ];

  const options = [
    { value: "Joint", label: "Joint" },
    { value: "Rolling", label: "Rolling" },
    { value: "Separate", label: "Separate" },
    { value: "Tailormade", label: "Tailormade" },
  ];

  const feeStatusOptions = [
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
  ];
  const [tailormadeFilePaths, setTailormadeFilePaths] = useState([]);

  const getFilePathsForCourse = (courseId, documents, documentType) => {
    return documents
      ?.filter(
        (doc) =>
          doc.ref_module === courseId &&
          documentType.includes(doc.customDocumentName)
      )
      .map((doc) => {
        const filePath = doc?.filePath
          ? doc.filePath
          : `${BASEURL}${doc.filePath}`; // safely prepend base URL if not absolute

        return {
          filePath,
          customDocumentName: doc?.customDocumentName || "Unknown Document",
        };
      });
  };
  useEffect(() => {
    const courseId = localCourses?.[0]?._id;
    if (courseId) {
      // Tailormade documents
      const tailormadePaths = getFilePathsForCourse(
        courseId,
        formData?.uploadedDocumentDetails,
        ["Compulsory Agreement Document"]
      );

      setTailormadeFilePaths(tailormadePaths);
    }
  }, [localCourses, formData]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      checkScroll();
    }, 0);

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }

    return () => {
      clearTimeout(timer);
      if (container) {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      }
    };
  }, [selectedSection]);

  const handleClose = () => {
    navigate(`/student-details/${id}`, {
      state: {
        activeTab: activeTab || "courseSelection",
        // Pass back the filter state
        ...state?.filterState,
      },
    });
  };
  return (
    <div>
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
          <h3>
            Interested Application Initiation
            {oneStudentData?.name && oneStudentData?.studentId && (
              <span
                style={{
                  marginLeft: "8px",
                  fontSize: "18px",
                  fontWeight: "400",
                  color: "#f3f7faff",
                  whiteSpace: "nowrap",
                }}
              >
                - {oneStudentData.name} ({oneStudentData.studentId})
              </span>
            )}
          </h3>
          <Button variant="link" onClick={handleClose} className="text-light">
            <AiOutlineClose size={20} />
          </Button>
        </div>
      </div>

      <Card
        className="custom-card transcation-crypto mb-0"
        style={{ minHeight: "94vh" }}
      >
        <Card.Header className="border-bottom-0 d-flex justify-content-between mb-4">
          <div className="card-title">Interested Course</div>
        </Card.Header>

        <div className="mx-4">
          {localCourses?.length > 0 ? (
            localCourses.map((item, index) => {
              const statusInfo = interestedCourseStatus.find(
                (status) => status.name === item.status
              );
              const backgroundColor = statusInfo ? statusInfo.color : "#6c757d";

              return (
                <div key={index} className="mb-3 student-info-container">
                  <Row>
                    <div className="d-flex justify-content-end align-items-center gap-3 mb-3">
                      <span
                        className="custom-select-height d-inline-flex justify-content-center align-items-center px-3 rounded-4"
                        style={{
                          minWidth: "80px",
                          backgroundColor: item.status
                            ? backgroundColor
                            : "transparent",
                          color: "white",
                        }}
                      >
                        {item.status || "-"}
                      </span>
                      {userRole !== "Student" && userRole !== "LeadStudent" && (
                        <Button
                          className="custom-select-height d-flex align-items-center gap-1"
                          variant="primary"
                          onClick={() => {
                            const values = {
                              interestedCourseDetails: [
                                {
                                  institute: item.institute?._id || "",
                                  programLevel: item.programLevel || "",
                                  course: item.course?._id || "",
                                  campus: item.campus?._id || "",
                                  intakeMonth: item.intakeMonth || "",
                                  intakeYear: item.intakeYear || "",
                                  status: item.status || "",
                                  remarks: item.remarks || "",
                                },
                              ],
                            };
                            interestedCourseFormik.setValues(values);
                            setSelectedOption(
                              options.find(
                                (opt) => opt.value === item.typeOfApplication
                              ) || null
                            );
                            setOtherDocName(
                              item.document?.customDocumentName || ""
                            );
                            setOtherDocFile(null);
                            setEditState({
                              interestedCourseDetails: true,
                              interestedCourseIndex:
                                editState.interestedCourseIndex,
                            });
                            setShowModal(true);
                          }}
                          disabled={
                            isRestrictedRole || (!canCreate && !canUpdate)
                          }
                        >
                          <EditIcon style={{ fontSize: "16px" }} />
                          Update
                        </Button>
                      )}
                    </div>

                    <Col md={4} className="mb-3">
                      <p className="student-info-item d-flex">
                        <strong>Institute</strong> <span>:</span>{" "}
                        <span className="truncate-2">
                          {item.institute?.instituteName ||
                            "Institute not found"}
                        </span>
                      </p>
                    </Col>
                    <Col md={4} className="mb-3">
                      <p className="student-info-item d-flex">
                        <strong>Program Level</strong> <span>:</span>{" "}
                        <span className="truncate-2">
                          {(() => {
                            if (!item?.programLevel) return "-";
                            const level = programLevelData.find(
                              (pl) => pl._id === item.programLevel
                            );
                            return level ? level.name : "-";
                          })()}
                        </span>
                      </p>
                    </Col>
                    <Col md={4} className="mb-3">
                      <p className="student-info-item d-flex">
                        <strong>Course</strong> <span>:</span>{" "}
                        <span className="truncate-2">
                          {item.course?.programName || "Course not found"}
                        </span>
                      </p>
                    </Col>
                    <Col md={4} className="mb-3">
                      <p className="student-info-item d-flex">
                        <strong>Campus</strong> <span>:</span>{" "}
                        <span className="truncate-2">
                          {item?.campus?.campus || "Campus not found"}
                        </span>
                      </p>
                    </Col>
                    <Col md={4} className="mb-3">
                      <p className="student-info-item">
                        <strong>Intake:</strong> {item.intakeMonth || "-"}{" "}
                        {item.intakeYear || "-"}
                      </p>
                    </Col>
                    <Col md={4} className="mb-3">
                      <p className="student-info-item">
                        <strong>Remarks:</strong> {item.remarks || "-"}
                      </p>
                    </Col>
                    <Col md={4} className="mb-3">
                      <p className="student-info-item">
                        <strong>Created By:</strong> {item.createdByName || "-"}
                      </p>
                    </Col>
                    <Col md={4} className="mb-3">
                      <p className="student-info-item">
                        <strong>Updated By:</strong> {item.updatedByName || "-"}
                      </p>
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-end">
                    {!(
                      tailormadeFilePaths?.length > 0 ||
                      // oneStudentData?.purposeDetails?.preferredCountry[0] !==
                      //   "Finland" ||
                      selectedOption?.value !== "Tailormade"
                    ) && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "16px",
                          letterSpacing: "1px",
                        }}
                      >
                        <strong>Agreement Document is pending</strong>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p>No interested course available.</p>
          )}
        </div>

        <div className="mx-4 mt-3">
          <Row className="mb-4">
            <Col className="d-flex justify-content-between align-items-center">
              <div
                className="w-100 d-flex align-items-center position-relative gap-2"
                style={{
                  padding: "15px",
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
                  marginTop: "10px",
                }}
              >
                {showLeftArrow && (
                  <div
                    onClick={scrollLeft}
                    style={{
                      cursor: "pointer",
                      padding: "0 10px",
                      display: "flex",
                      alignItems: "center",
                      transition: "all 0.3s ease",
                      zIndex: 1,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.querySelector("svg").style.color =
                        "#1f4da0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.querySelector("svg").style.color =
                        "#053880";
                    }}
                  >
                    <ArrowBackIosNewIcon
                      style={{
                        fontSize: "20px",
                        color: "#053880",
                      }}
                    />
                  </div>
                )}

                <div
                  ref={scrollContainerRef}
                  className="d-flex scroll-container"
                  style={{
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                    flex: 1,
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <style>
                    {`
                  .scroll-container::-webkit-scrollbar {
                    display: none;
                  }
                `}
                  </style>
                  {sections.map((section) => (
                    <span
                      key={section.key}
                      onClick={() => setSelectedSection(section.key)}
                      style={{
                        fontSize: "16px",
                        fontWeight:
                          selectedSection === section.key ? "600" : "400",
                        color:
                          selectedSection === section.key
                            ? "#053880"
                            : "#000000",
                        textDecoration: "underline",
                        textDecorationColor:
                          selectedSection === section.key
                            ? "#053880"
                            : "#d0d0d0",
                        textDecorationThickness: "2px",
                        textUnderlineOffset: "4px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        position: "relative",
                        padding: "8px 15px",
                        display: "inline-block",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color =
                          selectedSection === section.key
                            ? "#1f4da0"
                            : "#053880";
                        e.target.style.textDecorationColor =
                          selectedSection === section.key
                            ? "#1f4da0"
                            : "#053880";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color =
                          selectedSection === section.key
                            ? "#053880"
                            : "#000000";
                        e.target.style.textDecorationColor =
                          selectedSection === section.key
                            ? "#053880"
                            : "#d0d0d0";
                      }}
                    >
                      {section.label}
                    </span>
                  ))}
                </div>

                {showRightArrow && (
                  <div
                    onClick={scrollRight}
                    style={{
                      cursor: "pointer",
                      padding: "0 10px",
                      display: "flex",
                      alignItems: "center",
                      transition: "all 0.3s ease",
                      zIndex: 1,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.querySelector("svg").style.color =
                        "#1f4da0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.querySelector("svg").style.color =
                        "#053880";
                    }}
                  >
                    <ArrowForwardIosIcon
                      style={{
                        fontSize: "20px",
                        color: "#053880",
                      }}
                    />
                  </div>
                )}
              </div>
            </Col>
          </Row>
          {(selectedSection === "all" ||
            selectedSection === "universityPortalDetails") &&
            userRole !== "Student" && userRole !== "LeadStudent" &&
            userRole !== "B2B Admin" &&
            userRole !== "B2B Member" && (
              <UniversityPortalDetails
                id={id}
                fetchStudentData={fetchStudentData}
                formData={formData}
                userRole={userRole}
                isRestrictedRole={isRestrictedRole}
                editState={editState}
              />
            )}

          {(selectedSection === "all" ||
            selectedSection === "applicationType") && (
            // (oneStudentData?.purposeDetails?.preferredCountry[0] ===
            //   "Finland" ||
            //   oneStudentData?.purposeDetails?.preferredCountry[0] ===
            //     "finland") &&
            <TypeOfApplication
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              options={options}
              interestedCourseFormik={interestedCourseFormik}
              handleUpdateApplicationStatus={handleUpdateApplicationStatus}
              isRestrictedRole={isRestrictedRole}
              isLoading={isLoading}
              canCreate={canCreate}
              canUpdate={canUpdate}
              formData={formData}
              sendPendingDocumentMain={sendPendingDocumentMain}
              id={id}
              handleAllDownloadDocument={handleAllDownloadDocument}
              tailormadeFilePaths={tailormadeFilePaths}
              handleFileChange={handleFileChange}
              handleOtherDocUpload={handleOtherDocUpload}
              selectedIds={selectedIds}
              selectedDocumentNames={selectedDocumentNames}
              selectedDocsIds={selectedDocsIds}
              userRole={userRole}
              editState={editState}
              handleCheckboxChangeId={handleCheckboxChangeId}
              handleSingleDocumentDownload={handleSingleDocumentDownload}
              getStatusColor={getStatusColor}
              setSelectedStatus={setSelectedStatus}
              setRemarks={setRemarks}
              setSelectedDocId={setSelectedDocId}
              setShowStatusModal={setShowStatusModal}
              setSelectedItem={setSelectedItem}
              setShowDeleteModal={setShowDeleteModal}
              selectedSection={selectedSection}
              canDelete={canDelete}
              statusOptions={statusOptions}
            />
          )}

          {(selectedSection === "all" || selectedSection === "proofUpload") && (
            <ApplicationSubmission
              userRole={userRole}
              interestedCourseFormik={interestedCourseFormik}
              isRestrictedRole={isRestrictedRole}
              localCourses={localCourses}
              id={id}
              fetchStudentData={fetchStudentData}
              editState={editState}
              formData={formData}
              setIsLoading={setIsLoading}
              handleDocumentUpload={handleDocumentUpload}
              dispatch={dispatch}
              setLocalCourses={setLocalCourses}
              setFormData={setFormData}
              handleAllDownloadDocument={handleAllDownloadDocument}
              handleSingleDocumentDownload={handleSingleDocumentDownload}
              getFilePathsForCourse={getFilePathsForCourse}
              selectedIds={selectedIds}
              selectedSection={selectedSection}
              selectedDocumentNames={selectedDocumentNames}
              selectedDocsIds={selectedDocsIds}
              handleCheckboxChangeId={handleCheckboxChangeId}
              setSelectedStatus={setSelectedStatus}
              handleOtherDocUpload={handleOtherDocUpload}
              getStatusColor={getStatusColor}
              setSelectedItem={setSelectedItem}
              setShowDeleteModal={setShowDeleteModal}
              setRemarks={setRemarks}
              setSelectedDocId={setSelectedDocId}
              setShowStatusModal={setShowStatusModal}
              statusOptions={statusOptions}
              handleUpdateApplicationStatus={handleUpdateApplicationStatus}
              sendPendingDocumentMain={sendPendingDocumentMain}
            />
          )}

          {(selectedSection === "all" ||
            selectedSection === "interviewScheduling") && (
            <div className="d-flex align-items-center gap-3 my-3 p-3 bg-white rounded shadow-sm">
              <Form.Check
                type="checkbox"
                id="enableInterviewScheduling"
                checked={showInterviewSection}
                onChange={(e) => setShowInterviewSection(e.target.checked)}
                label=""
                className="custom-checkbox"
                aria-label="Enable Interview Scheduling"
                disabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
              />
              <Form.Label
                htmlFor="enableInterviewScheduling"
                className="mb-0"
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#333",
                  cursor: "pointer",
                }}
              >
                Enable Interview Scheduling
              </Form.Label>
            </div>
          )}

          {showInterviewSection &&
            (selectedSection === "all" ||
              selectedSection === "interviewScheduling") && (
              <InterviewScheduling
                id={id}
                editState={editState}
                formData={formData}
                isRestrictedRole={isRestrictedRole}
                userRole={userRole}
                setLocalCourses={setLocalCourses}
                setFormData={setFormData}
                setIsLoading={setIsLoading}
                handleUpdateApplicationStatus={handleUpdateApplicationStatus}
                localCourses={localCourses}
                canCreate={canCreate}
                dispatch={dispatch}
                interestedCourseFormik={interestedCourseFormik}
              />
            )}

          {(selectedSection === "all" ||
            selectedSection === "offerLetterProcess") && (
            <OfferLetterProcess
              editState={editState}
              formData={formData}
              id={id}
              isRestrictedRole={isRestrictedRole}
              userRole={userRole}
              setLocalCourses={setLocalCourses}
              setFormData={setFormData}
              setIsLoading={setIsLoading}
              localCourses={localCourses}
              handleDocumentUpload={handleDocumentUpload}
              setOtherDocName={setOtherDocName}
              setOtherDocFile={setOtherDocFile}
              fetchStudentData={fetchStudentData}
              getFilePathsForCourse={getFilePathsForCourse}
              canCreate={canCreate}
              canUpdate={canUpdate}
              dispatch={dispatch}
              isLoading={isLoading}
              selectedIds={selectedIds}
              selectedSection={selectedSection}
              getStatusColor={getStatusColor}
              selectedDocsIds={selectedDocsIds}
              canDelete={canDelete}
              setSelectedItem={setSelectedItem}
              setShowDeleteModal={setShowDeleteModal}
              handleCheckboxChangeId={handleCheckboxChangeId}
              handleSingleDocumentDownload={handleSingleDocumentDownload}
              setSelectedStatus={setSelectedStatus}
              setRemarks={setRemarks}
              setSelectedDocId={setSelectedDocId}
              setShowStatusModal={setShowStatusModal}
              statusOptions={statusOptions}
              sendPendingDocumentMain={sendPendingDocumentMain}
            />
          )}

          {(selectedSection === "all" ||
            selectedSection === "offerLetterAcceptance") && (
            <OfferLetterAcceptance
              editState={editState}
              formData={formData}
              setIsLoading={setIsLoading}
              id={id}
              isRestrictedRole={isRestrictedRole}
              userRole={userRole}
              setLocalCourses={setLocalCourses}
              setFormData={setFormData}
              localCourses={localCourses}
              fetchStudentData={fetchStudentData}
              dispatch={dispatch}
              canCreate={canCreate}
              canUpdate={canUpdate}
            />
          )}

          {(selectedSection === "all" ||
            selectedSection === "instituteFeePayment") && (
            <InstituteFeePayment
              feeStatusOptions={feeStatusOptions}
              canCreate={canCreate}
              localCourses={localCourses}
              formData={formData}
              isRestrictedRole={isRestrictedRole}
              userRole={userRole}
              editState={editState}
              id={id}
              getFilePathsForCourse={getFilePathsForCourse}
              setLocalCourses={setLocalCourses}
              setFormData={setFormData}
              setOtherDocName={setOtherDocName}
              setOtherDocFile={setOtherDocFile}
              fetchStudentData={fetchStudentData}
              currencyCodeData={currencyCodeData}
              otherDocFile={otherDocFile}
              otherDocName={otherDocName}
              handleDocumentUpload={handleDocumentUpload}
              selectedIds={selectedIds}
              selectedSection={selectedSection}
              selectedDocsIds={selectedDocsIds}
              getStatusColor={getStatusColor}
              canDelete={canDelete}
              handleSingleDocumentDownload={handleSingleDocumentDownload}
              handleCheckboxChangeId={handleCheckboxChangeId}
              sendPendingDocumentMain={sendPendingDocumentMain}
              setSelectedStatus={setSelectedStatus}
              statusOptions={statusOptions}
              setRemarks={setRemarks}
              setSelectedDocId={setSelectedDocId}
              setShowStatusModal={setShowStatusModal}
              setSelectedItem={setSelectedItem}
              setShowDeleteModal={setShowDeleteModal}
            />
          )}

          {(selectedSection === "all" ||
            selectedSection === "depositPayment") && (
            <DepositPaymentSection
              feeStatusOptions={feeStatusOptions}
              canCreate={canCreate}
              localCourses={localCourses}
              formData={formData}
              isRestrictedRole={isRestrictedRole}
              userRole={userRole}
              editState={editState}
              id={id}
              getFilePathsForCourse={getFilePathsForCourse}
              setLocalCourses={setLocalCourses}
              setFormData={setFormData}
              setOtherDocName={setOtherDocName}
              setOtherDocFile={setOtherDocFile}
              fetchStudentData={fetchStudentData}
              currencyCodeData={currencyCodeData}
              otherDocFile={otherDocFile}
              otherDocName={otherDocName}
              handleDocumentUpload={handleDocumentUpload}
              selectedIds={selectedIds}
              selectedSection={selectedSection}
              selectedDocsIds={selectedDocsIds}
              getStatusColor={getStatusColor}
              canDelete={canDelete}
              handleSingleDocumentDownload={handleSingleDocumentDownload}
              handleCheckboxChangeId={handleCheckboxChangeId}
              sendPendingDocumentMain={sendPendingDocumentMain}
              setSelectedStatus={setSelectedStatus}
              statusOptions={statusOptions}
              setRemarks={setRemarks}
              setSelectedDocId={setSelectedDocId}
              setShowStatusModal={setShowStatusModal}
              setSelectedItem={setSelectedItem}
              setShowDeleteModal={setShowDeleteModal}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}

          {(selectedSection === "all" || selectedSection === "rgdocument") && (
            <div className="mb-4 my-5 p-4 bg-light rounded shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-primary mb-0">US Documents</h6>
                <div>
                  {selectedIds[selectedSection]?.length > 0 && (
                    <Button
                      variant="primary"
                      className="custom-select-height me-2"
                      onClick={() =>
                        handleAllDownloadDocument(
                          id,
                          selectedIds[selectedSection]
                        )
                      }
                      disabled={isRestrictedRole}
                    >
                      <DownloadIcon />
                      Download Document
                    </Button>
                  )}
                  {userRole !== "Student" && userRole !== "LeadStudent" && (
                    <Button
                      variant="primary"
                      className="custom-select-height"
                      onClick={() => {
                        if (selectedDocsIds?.length > 0) {
                          sendPendingDocumentMain(id, selectedDocumentNames);
                        } else {
                          toast.error(
                            "Please select at least one document to send via mail."
                          );
                        }
                      }}
                      disabled={isRestrictedRole}
                    >
                      Send Mail
                    </Button>
                  )}
                </div>
              </div>
              <div className="table-responsive rounded">
                <Table bordered hover>
                  <thead className="thead-light">
                    <tr>
                      {selectedSection !== "all" && (
                        <th>
                          <Form.Check
                            type="checkbox"
                            checked={selectAllByType["rgdocument"] || false}
                            onChange={() =>
                              handleSelectAllChange(-1, "rgdocument")
                            }
                            className="custom-checkbox"
                          />
                        </th>
                      )}
                      {userRole !== "B2B Admin" &&
                        userRole !== "B2B Member" &&
                        userRole !== "Student" && userRole !== "LeadStudent" && <th>Document Pendency</th>}
                      <th>Sr No</th>
                      <th>Document Name</th>
                      <th>Upload File</th>
                      <th>Download</th>
                      <th>Status</th>
                      <th>Added By</th>
                      <th>Added On</th>
                      <th>Remarks</th>
                      {userRole !== "Student" && userRole !== "LeadStudent" && (
                        <th className="sticky-col-right-last">Action</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {formData?.uploadedDocumentDetails?.length > 0 ? (
                      formData.uploadedDocumentDetails
                        ?.filter((doc) => {
                          const allowedDocuments = [
                            "Application Submission Form",
                            "Deposit Payment Proof",
                            "Fee Payment Proof",
                            "Conditional Offer Letter",
                            "Unconditional Offer Letter",
                            "Rejection Letter",
                            "Compulsory Agreement Document",
                          ];
                          const selectedCourseId =
                            formData?.interestedCourseDetails?.[
                              editState.interestedCourseIndex
                            ]?._id;
                          return (
                            doc.customDocumentName &&
                            allowedDocuments.includes(doc.customDocumentName) &&
                            doc.ref_module === selectedCourseId
                          );
                        })
                        ?.map((doc, index) => {
                          const docName =
                            doc.customDocumentName ||
                            doc.documentName ||
                            "Unnamed Document";
                          return (
                            <tr key={doc._id}>
                              {selectedSection !== "all" && (
                                <td>
                                  <Form.Check
                                    type="checkbox"
                                    checked={
                                      selectedRows[`rgdocument--1-${index}`] ||
                                      false
                                    }
                                    onChange={() =>
                                      handleCheckboxChange(
                                        -1,
                                        index,
                                        "rgdocument",
                                        doc._id,
                                        `rgdocument--1-${index}`
                                      )
                                    }
                                    disabled={doc.status === "Reupload"}
                                    className="custom-checkbox"
                                  />
                                </td>
                              )}
                              {userRole !== "B2B Admin" &&
                                userRole !== "B2B Member" &&
                                userRole !== "Student" && userRole !== "LeadStudent" && (
                                  <td>
                                    <div className="form-check form-switch custom-toggle-button me-0">
                                      <input
                                        className="form-check-input three-dots-icon"
                                        type="checkbox"
                                        id={`toggle-${doc._id}-${index}`}
                                        checked={selectedDocsIds?.includes(
                                          `${doc._id}-${index}`
                                        )}
                                        onChange={() =>
                                          handleCheckboxChangeId(
                                            `${doc._id}-${index}`,
                                            docName
                                          )
                                        }
                                      />
                                    </div>
                                  </td>
                                )}
                              <td>{index + 1}</td>
                              <td>{docName}</td>
                              <td>
                                {doc.status !== "Reupload" ? (
                                  <span className="text-success me-2">
                                    {doc.filePath?.split("/")?.pop() ||
                                      "No File"}
                                  </span>
                                ) : (
                                  <Form.Control
                                    type="file"
                                    accept="image/*,application/pdf"
                                    onChange={(e) =>
                                      handleOtherDocUpload(
                                        e,
                                        index,
                                        doc._id,
                                        docName
                                      )
                                    }
                                    className="custom-select-height"
                                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                                  />
                                )}
                              </td>
                              <td>
                                {doc.status !== "Reupload" ? (
                                  <button
                                    className="btn btn-sm fw-normal rounded-4"
                                    style={{
                                      cursor: "pointer",
                                      color: "#fff",
                                      backgroundColor: "#007bff",
                                      height: "32px",
                                      width: "100px",
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      // const fileName =
                                      //   doc.filePath
                                      //     ?.split("/")
                                      //     ?.pop() || "document";
                                      // handleSingleDocumentDownload(
                                      //   id,
                                      //   doc._id,
                                      //   fileName
                                      // );
                                      const filePath = doc?.filePath;
                                      const fileName = filePath
                                        ?.split("/")
                                        ?.pop();

                                      handleSingleDocumentDownload(
                                        filePath,
                                        fileName
                                      );
                                    }}
                                    disabled={isRestrictedRole}
                                  >
                                    <DownloadIcon />
                                    Download
                                  </button>
                                ) : (
                                  <span>-</span>
                                )}
                              </td>
                              <td>
                                {doc ? (
                                  <button
                                    className="btn btn-sm fw-normal d-flex align-items-center justify-content-center rounded-4"
                                    style={{
                                      cursor: "pointer",
                                      color: "#fff",
                                      backgroundColor: getStatusColor(
                                        doc.status || "unverified"
                                      ),
                                      border: "none",
                                      borderRadius: "4px",
                                      padding: "5px 10px",
                                      height: "32px",
                                      width: "100px",
                                      fontSize: "14px",
                                    }}
                                    onClick={() => {
                                      setSelectedStatus(
                                        statusOptions.find(
                                          (opt) =>
                                            opt.value ===
                                            (doc.status || "unverified")
                                        ) ||
                                          statusOptions.find(
                                            (opt) => opt.value === "unverified"
                                          )
                                      );
                                      setRemarks(doc.remarks || "");
                                      setSelectedDocId(doc._id);
                                      setShowStatusModal(true);
                                    }}
                                    disabled={
                                      isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"
                                    }
                                  >
                                    {(doc.status === "verified" ||
                                      doc.status === "Verified") && (
                                      <CheckCircleIcon
                                        className="me-1"
                                        style={{ fontSize: "16px" }}
                                      />
                                    )}
                                    {(!doc.status ||
                                      doc.status === "unverified" ||
                                      doc.status === "Unverified") && (
                                      <CancelIcon
                                        className="me-1"
                                        style={{ fontSize: "16px" }}
                                      />
                                    )}
                                    {(doc.status === "reupload" ||
                                      doc.status === "Reupload") && (
                                      <UploadIcon
                                        className="me-1"
                                        style={{ fontSize: "16px" }}
                                      />
                                    )}
                                    {doc.status
                                      ? doc.status.charAt(0).toUpperCase() +
                                        doc.status.slice(1)
                                      : "Unverified"}
                                  </button>
                                ) : (
                                  <span>-</span>
                                )}
                              </td>
                              <td>{doc.createdByName || "-"}</td>
                              <td>
                                {doc.createdAt
                                  ? new Date(doc.createdAt).toLocaleDateString(
                                      "en-GB"
                                    )
                                  : "-"}
                              </td>
                              <td>{doc.remarks || "-"}</td>
                              {userRole !== "Student" && userRole !== "LeadStudent" && (
                                <td className="sticky-col-right-last">
                                  {canDelete && (
                                    <Button
                                      variant="link"
                                      className="text-danger"
                                      style={{ fontSize: "18px" }}
                                      onClick={() => {
                                        setSelectedItem(doc._id);
                                        setShowDeleteModal(true);
                                      }}
                                      title="Delete"
                                      disabled={isRestrictedRole}
                                    >
                                      <FaTrashAlt />
                                    </Button>
                                  )}
                                </td>
                              )}
                            </tr>
                          );
                        })
                    ) : (
                      <tr>
                        <td colSpan="10" className="text-muted text-center">
                          No US documents available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </Card>

      <UpdateInterestedCourse
        showModal={showModal}
        setShowModal={setShowModal}
        interestedCourseFormik={interestedCourseFormik}
        instituteOptions={instituteOptions}
        campusData={campusData}
        allcourseData={allcourseData}
        setEditState={setEditState}
        setOtherDocName={setOtherDocName}
        setOtherDocFile={setOtherDocFile}
        interestedCourseStatus={interestedCourseStatus}
        oneStudentData={oneStudentData}
        fetchAllCampusByInstitute={fetchAllCampusByInstitute}
        fetchAllCourse={fetchAllCourse}
        programLevelData={programLevelData}
      />

      {/* Status Update Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header className="form-main-heading">
          <Modal.Title>Update Document Status</Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={() => setShowStatusModal(false)}
          />
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="statusSelect">
              <Form.Label>Status</Form.Label>

              <Select
                classNamePrefix="custom-select"
                value={selectedStatus}
                onChange={(option) => setSelectedStatus(option)}
                options={statusOptions}
                placeholder="Select status..."
                isClearable
                isSearchable
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="remarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="rounded-4"
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button
                variant="primary"
                className="custom-select-height"
                onClick={() => handleStatusChange(selectedDocId)}
              >
                Update
              </Button>
            </div>
          </Form>
        </Modal.Body>
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
              handleRemoveDocument(selectedItem);
              setShowDeleteModal(false);
            }}
          >
            <i className="bi bi-trash-fill me-2"></i>Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InterestedApplicationInitiation;
