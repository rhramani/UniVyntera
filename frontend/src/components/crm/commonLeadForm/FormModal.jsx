import React, { useEffect, useRef, useState } from 'react';
import { ErrorMessage, Formik } from 'formik';
import { Button, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import Select from 'react-select';
import { AiOutlineClose } from 'react-icons/ai';
import PhoneInput from 'react-phone-input-2';
import { FaChevronDown, FaChevronUp, FaPlus } from 'react-icons/fa';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { MdCalendarToday } from 'react-icons/md';
import { getAllProgramLevel } from '../../../redux/actions/Master/ProgramLevel.action';
import { useDispatch } from 'react-redux';
import ChatComponent from '../../student/studentDetails/chat/ChatComponent';
import B2bChatComponent from '../../student/studentDetails/chat/B2bChatComponent';
import { countryCodeISO } from '../../../utils/countryISOCode';
import {
  getAllInstitute,
  instituteWiseCampusDropdown,
  instituteWiseProgramLevelDropdown,
} from '../../../redux/actions/Master/Institute.action';
import { getAllCourseFinder } from '../../../redux/actions/CourseFinder.action';

const FormModal = ({
  show,
  setShow,
  handleClose,
  isEdit,
  edit,
  setEdit,
  index,
  formData,
  validationSchema,
  userRole,
  userType,
  loggedInMemberId,
  fetchAllUser,
  countries,
  getRoleList,
  setLeadSubStatus,
  fetchLeadSubStatus,
  handelSubmitLead,
  handelEditLead,
  genderOptions,
  followUpTypeOptions,
  leadStatusOptions,
  leadSubStatusOptions,
  b2BLeadStatusOptions,
  allInquiry,
  roleOptions,
  handleBranchChange,
  branchRoleOptions,
  userOptions,
  allBranchOptions,
  courseOptions,
  degreeOptions,
  examOptions,
  reviewOptions,
  leadFollowUpRemarkOptions,
  showHistory,
  handleEducationSubmit,
  handleEditEvaluation,
  handleDeleteEvaluation,
  handleEducatiDetailonSubmit,
  handleEducationDetailedit,
  handleDeleteEvaluationDetail,
  editHistoryData,
  setShowHistory,
  fullLeadAssignments = [],
  setCurrentEditingAssignment,
  isB2B = false,
  studentId,
  senderId,
  studentData,
  handleChatClose,
  branchId,
  branchUserId,
  roleId,
  allOther,
  handleFamilyWorkDelete,
  handleFamilyWorkSubmit,
  handleFamilyWorkDetailEdit,
  handleVisaInfoEdit,
  handleVisaInfoSubmit,
  handleVisaInfoDelete,
  handleLeadAssignmentSubmit,
  handleLeadAssignmentEdit,
  handleLeadAssignmentDelete,
  handleInterestedCourseDetailEdit,
  handleInterestedCourseSubmit,
  handleInterestedCourseDelete,
}) => {
  const dispatch = useDispatch();
  const [showEducationCourseInfo, setShowEducationCourseInfo] = useState(false);
  const [showFamilyWork, setShowFamilyWork] = useState(false);
  const [showVisaInfo, setShowVisaInfo] = useState(false);
  const [showEducationEvaluation, setShowEducationEvaluation] = useState(false);
  const [showEducationDetails, setShowEducationDetails] = useState(false);
  const [showReferFriend, setShowReferFriend] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showLeadAssignments, setShowLeadAssignments] = useState(false);
  const [showInterestedCourse, setShowInterestedCourse] = useState(false);
  const [showDobCalendar, setShowDobCalendar] = useState(false);
  const [dobValue, setDobValue] = useState(null);
  const [showNextFollowupCalendar, setShowNextFollowupCalendar] = useState(false);
  const [nextFollowupValue, setNextFollowupValue] = useState(null);

  const [isSubStatusDisabled, setIsSubStatusDisabled] = useState(true);

  const [campusData, setCampusData] = useState([]);
  const [allcourseData, setAllCourseData] = useState([]);
  const [instituteData, setInstituteData] = useState([]);
  const [programLevelData, setProgramLevelData] = useState([]);

  const campusOptions = campusData
    ?.map((c) => ({
      label: c.campus,
      value: c._id,
    }))
    ?.sort((a, b) => a.label.localeCompare(b.label));

  const leadDetailsRef = useRef(null);
  const followUpDetailsRef = useRef(null);
  const educationCourseInfoRef = useRef(null);
  const familyWorkRef = useRef(null);
  const visaInfoRef = useRef(null);
  const educationEvaluationRef = useRef(null);
  const educationDetailsRef = useRef(null);
  const referFriendRef = useRef(null);
  const reviewsRef = useRef(null);
  const leadAssignmentsRef = useRef(null);
  const interestedCourseRef = useRef(null);
  const dobInputRef = useRef(null);
  const nextFollowupInputRef = useRef(null);
  const dobCalendarRef = useRef(null);
  const nextFollowupCalendarRef = useRef(null);
  const [programLevels, setProgramLevels] = useState([]);
  const months = [
    { value: 'Jan', label: 'Jan' },
    { value: 'Feb', label: 'Feb' },
    { value: 'Mar', label: 'Mar' },
    { value: 'Apr', label: 'Apr' },
    { value: 'May', label: 'May' },
    { value: 'Jun', label: 'Jun' },
    { value: 'Jul', label: 'Jul' },
    { value: 'Aug', label: 'Aug' },
    { value: 'Sep', label: 'Sep' },
    { value: 'Oct', label: 'Oct' },
    { value: 'Nov', label: 'Nov' },
    { value: 'Dec', label: 'Dec' },
  ];

  const leadFromOptions = [
    { value: 'Web Enquiry', label: 'Web Enquiry' },
    { value: 'Social Media', label: 'Social Media' },
    { value: 'Phone Call', label: 'Phone Call' },
    { value: 'Email', label: 'Email' },
    { value: 'Fair Enquiry', label: 'Fair Enquiry' },
    { value: 'Walk in', label: 'Walk in' },
  ];

  const startYear = 2026;
  const years = Array.from({ length: 5 }, (_, i) => ({
    value: startYear + i,
    label: startYear + i,
  }));

  const occupationOptions = [
    { value: 'Student', label: 'Student' },
    { value: 'Father', label: 'Father' },
    { value: 'Mother', label: 'Mother' },
    { value: 'Brother', label: 'Brother' },
    { value: 'Sister', label: 'Sister' },
  ];

  const occupationTypeOptions = [
    { value: 'Business Owner', label: 'Business Owner' },
    { value: 'Self Employed', label: 'Self Employed' },
    { value: 'Farmer', label: 'Farmer' },
    { value: 'Employed / Job', label: 'Employed / Job' },
    { value: 'Government Services', label: 'Government Services' },
  ];

  useEffect(() => {
    const fetchProgramLevels = async () => {
      try {
        const res = await dispatch(getAllProgramLevel(1, 1000, ''));
        setProgramLevels(res?.data?.data?.data || []);
      } catch (error) {
        console.error('Error fetching program levels:', error);
      }
    };
    fetchProgramLevels();
  }, [dispatch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dobInputRef.current &&
        !dobInputRef.current.contains(event.target) &&
        dobCalendarRef.current &&
        !dobCalendarRef.current.contains(event.target)
      ) {
        setShowDobCalendar(false);
      }

      if (
        nextFollowupInputRef.current &&
        !nextFollowupInputRef.current.contains(event.target) &&
        nextFollowupCalendarRef.current &&
        !nextFollowupCalendarRef.current.contains(event.target)
      ) {
        setShowNextFollowupCalendar(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchAllInstitute = async (country) => {
    try {
      const response = await dispatch(getAllInstitute(1, 5000, '', country));
      const responseData = response?.data?.data;
      setInstituteData(responseData?.data || []);
    } catch (error) {
      console.error('Error fetching institutes:', error);
      setInstituteData([]);
      toast.dismiss();
    }
  };
  const fetchAllCourse = async (institute, campus, programLevel) => {
    try {
      const res = await dispatch(getAllCourseFinder(1, 1000, { institute, campus, programLevel }));

      if (res?.status === 200) {
        const programNames =
          res?.data?.data?.data
            ?.filter((item) => item.status === 'Active')
            ?.map((item) => ({
              _id: item._id,
              programName: item.programName,
              intakeMonths:
                item.intakes?.filter((intake) => intake?.status === 'Active')?.map((intake) => intake.month) || [],
              intakeYears: item.intakeYear || [],
            })) || [];
        const uniqueProgramNames = [...new Set(programNames)];
        setAllCourseData(uniqueProgramNames);
      } else {
        console.error('Error fetching courses:', res?.data?.message);
        setAllCourseData([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setAllCourseData([]);
    }
  };

  const instituteOptions = Array.from(
    new Map(
      instituteData
        ?.sort((a, b) => a.instituteName.localeCompare(b.instituteName))
        ?.map((institute) => [institute.instituteName, institute]),
    ).values(),
  ).map((institute) => ({
    label: institute.instituteName,
    value: institute._id,
  }));

  const fetchAllCampusByInstitute = async (selectedOption, country) => {
    try {
      const response = await dispatch(instituteWiseCampusDropdown(selectedOption, country));
      const responseData = response?.data?.data || [];
      setCampusData(responseData);
      if (selectedOption && country) {
        fetchCourseProgramLevels(selectedOption, country);
      }
    } catch (error) {
      console.error('Error fetching campuses:', error);
      setCampusData([]);
      setProgramLevelData([]);
    }
  };

  const fetchCourseProgramLevels = async (instituteName, country) => {
    if (!instituteName || !country) {
      setProgramLevelData([]);
      return;
    }
    try {
      const res = await dispatch(instituteWiseProgramLevelDropdown(instituteName, country));
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

  const fieldToSectionMap = {
    name: leadDetailsRef,
    city: leadDetailsRef,
    phone: leadDetailsRef,
    alternate_contact: leadDetailsRef,
    gender: leadDetailsRef,
    dateofbirth: leadDetailsRef,
    age: leadDetailsRef,
    comments: leadDetailsRef,
    lead_status: leadDetailsRef,
    lead_sub_status: leadDetailsRef,
    lead_form: leadDetailsRef,
    lead_role: leadDetailsRef,
    // lead_assign: leadDetailsRef,
    inquiry_for: leadDetailsRef,
    inquiry_for_other: leadDetailsRef,
    source_of_reference: leadDetailsRef,
    office_use_only: leadDetailsRef,
    next_follow_up: followUpDetailsRef,
    follow_up_type: followUpDetailsRef,
    from: followUpDetailsRef,
    to: followUpDetailsRef,
    nationality: followUpDetailsRef,
    email: followUpDetailsRef,
    address: followUpDetailsRef,
    pincode: followUpDetailsRef,
    lead_followup_remark: followUpDetailsRef,
    country_interested: educationCourseInfoRef,
    // course: educationCourseInfoRef,
    level: educationCourseInfoRef,
    budget: educationCourseInfoRef,
    intake: educationCourseInfoRef,
    english_proficiency: educationCourseInfoRef,
    passport: educationCourseInfoRef,
    how_much_in_bank: educationCourseInfoRef,
    occupation_father: familyWorkRef,
    occupation_mother: familyWorkRef,
    work_experience: familyWorkRef,
    work_post: familyWorkRef,
    work_year: familyWorkRef,
    visited_countries: visaInfoRef,
    visit_count: visaInfoRef,
    visa_type: visaInfoRef,
    visa_refused: visaInfoRef,
    refused_country: visaInfoRef,
    refused_times: visaInfoRef,
    refused_years: visaInfoRef,
    refused_visa_type: visaInfoRef,
    refer_friend: referFriendRef,
    reviews: reviewsRef,
    education_evaluation: educationEvaluationRef,
    education_details: educationDetailsRef,
    lead_assign: leadAssignmentsRef,
    institute: interestedCourseRef,
    campus: interestedCourseRef,
    programLevel: interestedCourseRef,
    course: interestedCourseRef,
    intakeMonth: interestedCourseRef,
    intakeYear: interestedCourseRef,
    remarks: interestedCourseRef,
    acceptedByUs: interestedCourseRef,
  };

  const scrollToFirstError = (errors) => {
    const errorFields = Object.keys(errors);

    for (let field of errorFields) {
      let fieldKey = field;
      if (field.includes('.')) {
        fieldKey = field.split('.').slice(0, 2).join('.');
      }

      const sectionRef = fieldToSectionMap[field] || fieldToSectionMap[fieldKey];
      if (sectionRef?.current) {
        sectionRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        if (sectionRef === educationCourseInfoRef && !showEducationCourseInfo) {
          setShowEducationCourseInfo(true);
        } else if (sectionRef === familyWorkRef && !showFamilyWork) {
          setShowFamilyWork(true);
        } else if (sectionRef === visaInfoRef && !showVisaInfo) {
          setShowVisaInfo(true);
        } else if (sectionRef === educationEvaluationRef && !showEducationEvaluation) {
          setShowEducationEvaluation(true);
        } else if (sectionRef === educationDetailsRef && !showEducationDetails) {
          setShowEducationDetails(true);
        } else if (sectionRef === referFriendRef && !showReferFriend) {
          setShowReferFriend(true);
        } else if (sectionRef === reviewsRef && !showReviews) {
          setShowReviews(true);
        } else if (sectionRef === leadAssignmentsRef && !showLeadAssignments) {
          setShowLeadAssignments(true);
        } else if (sectionRef === interestedCourseRef && !showInterestedCourse) {
          setShowInterestedCourse(true);
        }

        break;
      }
    }
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: '12px',
      color: 'black',
    }),
    placeholder: (base) => ({
      ...base,
      color: 'black',
      fontSize: '13px',
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  const closeModal = () => {
    handleClose();
    setShowEducationCourseInfo(false);
    setShowFamilyWork(false);
    setShowVisaInfo(false);
    setShowEducationEvaluation(false);
    setShowReferFriend(false);
    setShowEducationDetails(false);
    setShowReviews(false);
    setShowLeadAssignments(false);
  };

  const formatDate = (date) => {
    if (!date) return '';
    if (typeof date === 'string') {
      // Try to parse ISO string
      const d = new Date(date);
      if (!isNaN(d)) date = d;
      else return '';
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    // Try ISO first
    let d = new Date(dateStr);
    if (!isNaN(d)) return d;
    // Try dd/mm/yyyy
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split('/');
      d = new Date(`${year}-${month}-${day}`);
      if (!isNaN(d)) return d;
    }
    return null;
  };

  const formatTime = (dateValue) => {
    if (!dateValue) return '-';

    // Extract time part manually for strings like "2025/12/05 16:12"
    if (/^\d{4}[-/]\d{2}[-/]\d{2}\s+\d{2}:\d{2}/.test(dateValue)) {
      const timePart = dateValue.split(' ')[1];
      if (!timePart) return '-';
      const [hour, minute] = timePart.split(':');
      const date = new Date();
      date.setHours(hour);
      date.setMinutes(minute);
      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    }

    // Handle ISO timestamps or Date objects
    try {
      const date = new Date(dateValue);
      if (isNaN(date)) return '-';
      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    } catch {
      return '-';
    }
  };

  const mapInterestedCourseDetailsForPayload = (details = []) => {
    return details
      .filter((item) => {
        // Filter out completely empty entries (entries with no meaningful data)
        const hasInstitute =
          item.institute && (typeof item.institute === 'object' ? item.institute?._id : item.institute);
        const hasCampus = item.campus && (typeof item.campus === 'object' ? item.campus?._id : item.campus);
        const hasCourse = item.course && (typeof item.course === 'object' ? item.course?._id : item.course);
        const hasRemarks = item.remarks && item.remarks.trim() !== '';

        // Keep the entry if it has at least institute OR course OR remarks
        return hasInstitute || hasCourse || hasRemarks;
      })
      .map((item) => ({
        institute: typeof item.institute === 'object' ? item.institute?._id : item.institute,

        campus: typeof item.campus === 'object' ? item.campus?._id : item.campus,

        programLevel: typeof item.programLevel === 'object' ? item.programLevel?._id : item.programLevel,

        course: typeof item.course === 'object' ? item.course?._id : item.course,

        intakeMonth: item.intakeMonth || '',
        intakeYear: item.intakeYear || '',
        remarks: item.remarks || '',
        acceptedByUs: item.acceptedByUs || false,
      }));
  };

  return (
    <Modal show={show} onHide={closeModal} size="xl" centered>
      <Modal.Header className="form-main-heading">
        <Modal.Title>{isEdit ? 'Update' : 'Add'} Lead</Modal.Title>
        <AiOutlineClose size={20} style={{ cursor: 'pointer', color: 'white' }} onClick={closeModal} />
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <Formik
          initialValues={{
            ...formData,
            // Initialize with empty form fields - editing is handled by useEffect
            interestedCourseDetails: [
              {
                institute: '',
                campus: '',
                programLevel: '',
                course: '',
                intakeMonth: '',
                intakeYear: '',
                remarks: '',
                acceptedByUs: false,
                _id: null,
              },
            ],
            lead_assign: [],
            dateofbirth:
              formData.dateofbirth && parseDate(formData.dateofbirth)
                ? parseDate(formData.dateofbirth).toISOString().slice(0, 10)
                : '',
            next_follow_up:
              formData.next_follow_up && parseDate(formData.next_follow_up)
                ? parseDate(formData.next_follow_up).toISOString().slice(0, 10)
                : '',
          }}
          validationSchema={validationSchema}
          context={{ userRole }}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            const payload = {
              ...values,
              interestedCourseDetails: mapInterestedCourseDetailsForPayload(formData.interestedCourseDetails || []),
            };
            setShow(false);
            if (!isEdit) {
              handelSubmitLead(payload).finally(() => setSubmitting(false));
            } else {
              handelEditLead(payload).finally(() => setSubmitting(false));
            }
          }}
        >
          {({ handleSubmit, setFieldValue, values, errors }) => {
            useEffect(() => {
              if (userType === 'Branch User' && values.lead_role && !isEdit) {
                const selectedRole = getRoleList?.data?.find((role) => role._id === values.lead_role);
                if (selectedRole && userOptions.length === 0) {
                  fetchAllUser(values.lead_role, selectedRole.name, branchUserId || branchId, false);
                }
              }
            }, [userType, values.lead_role, isEdit, getRoleList, branchUserId, branchId, userOptions.length]);

            // Handle interested course editing - populate form when edit state changes
            useEffect(() => {
              if (edit.interestedCourse && formData.interestedCourseDetails?.[edit.interestedCourseIndex]) {
                const editItem = formData.interestedCourseDetails[edit.interestedCourseIndex];

                // Set the form values for the interested course fields
                setFieldValue('interestedCourseDetails', [
                  {
                    institute: typeof editItem.institute === 'object' ? editItem.institute?._id : editItem.institute,
                    campus: typeof editItem.campus === 'object' ? editItem.campus?._id : editItem.campus,
                    programLevel:
                      typeof editItem.programLevel === 'object' ? editItem.programLevel?._id : editItem.programLevel,
                    course: typeof editItem.course === 'object' ? editItem.course?._id : editItem.course,
                    intakeMonth: editItem.intakeMonth || '',
                    intakeYear: editItem.intakeYear || '',
                    remarks: editItem.remarks || '',
                    acceptedByUs: editItem.acceptedByUs || false,
                    _id: editItem._id || null,
                  },
                ]);
              } else if (!edit.interestedCourse) {
                // Clear the form fields when not editing
                setFieldValue('interestedCourseDetails', [
                  {
                    institute: '',
                    campus: '',
                    programLevel: '',
                    course: '',
                    intakeMonth: '',
                    intakeYear: '',
                    remarks: '',
                    acceptedByUs: false,
                    _id: null,
                  },
                ]);
              }
            }, [edit.interestedCourse, edit.interestedCourseIndex, setFieldValue, formData.interestedCourseDetails]);

            // Handle lead assignment editing - populate form when edit state changes
            useEffect(() => {
              if (edit.leadAssignment && formData.lead_assign?.[edit.leadAssignmentIndex]) {
                const editItem = formData.lead_assign[edit.leadAssignmentIndex];

                // Store the current editing data
                setCurrentEditingAssignment({
                  role: editItem.role,
                  user: editItem.user,
                  _id: editItem._id || null,
                  index: edit.leadAssignmentIndex,
                });

                // Populate the form fields with the assignment data
                setFieldValue('lead_assign', [
                  {
                    role: editItem.role,
                    user: editItem.user,
                    _id: editItem._id || null,
                  },
                ]);

                // Also fetch users for the selected role to populate the dropdown
                const selectedRole = getRoleList?.data?.find((r) => r._id === editItem.role);
                if (selectedRole) {
                  let selectedBranchId = null;
                  if (userRole === 'Branch') {
                    selectedBranchId = branchId;
                  } else if (userType === 'Branch User') {
                    selectedBranchId = branchUserId || branchId;
                  } else {
                    selectedBranchId = values.lead_assign_Branch === null ? null : values.lead_assign_Branch || null;
                  }

                  fetchAllUser(editItem.role, selectedRole.name, selectedBranchId, false);
                }
              } else if (!edit.leadAssignment) {
                // Clear the current editing data
                setCurrentEditingAssignment(null);

                // Initialize with empty object for adding new assignment
                setFieldValue('lead_assign', [
                  {
                    role: '',
                    user: '',
                    _id: null,
                  },
                ]);
              }
            }, [
              edit.leadAssignment,
              edit.leadAssignmentIndex,
              setFieldValue,
              formData.lead_assign,
              getRoleList,
              userRole,
              userType,
              branchId,
              branchUserId,
              values.lead_assign_Branch,
            ]);

            const selectedIndex = edit.interestedCourse
              ? 0 // When editing, form values are at index 0
              : index.interestedCourse;

            const selectedCourse = allcourseData?.find(
              (c) => c._id === values.interestedCourseDetails[selectedIndex]?.course,
            );

            const intakeMonthOptions =
              selectedCourse?.intakeMonths?.map((m) => ({
                label: m,
                value: m,
              })) || [];

            const intakeYearOptions =
              selectedCourse?.intakeYears?.map((y) => ({
                label: y,
                value: y,
              })) || [];

            useEffect(() => {
              const preferredCountries = values?.country_interested || [];
              if (preferredCountries.length > 0) {
                fetchAllInstitute(preferredCountries[0]);
              } else {
                fetchAllInstitute();
              }
            }, [values?.country_interested]);

            useEffect(() => {
              // When editing, form values are at index 0, otherwise use the current index
              const currentIndex = edit.interestedCourse ? 0 : index.interestedCourse;

              const instituteId = values?.interestedCourseDetails?.[currentIndex]?.institute || '';
              const campusId = values?.interestedCourseDetails?.[currentIndex]?.campus || '';
              const programLevelId = values?.interestedCourseDetails?.[currentIndex]?.programLevel || '';

              // Only fetch if we have valid institute and country
              if (instituteId && values?.country_interested?.length > 0) {
                const instituteName = instituteOptions?.find((option) => option.value === instituteId)?.label;

                if (instituteName) {
                  fetchAllCampusByInstitute(instituteName, values.country_interested[0]);
                }
              }

              // Only fetch courses if we have institute and campus
              if (instituteId && campusId) {
                fetchAllCourse(instituteId, campusId, programLevelId);
              }
            }, [
              // Only depend on the actual form values that matter
              values?.interestedCourseDetails?.[edit.interestedCourse ? 0 : index.interestedCourse]?.institute,
              values?.interestedCourseDetails?.[edit.interestedCourse ? 0 : index.interestedCourse]?.campus,
              values?.interestedCourseDetails?.[edit.interestedCourse ? 0 : index.interestedCourse]?.programLevel,
              edit.interestedCourse,
              index.interestedCourse,
              values?.country_interested,
              // Remove instituteOptions from dependencies to prevent infinite loops
            ]);

            useEffect(() => {
              const row =
                values?.interestedCourseDetails?.[
                  edit.interestedCourse ? edit.interestedCourseIndex : index.interestedCourse
                ];

              const instituteId = row?.institute;
              const country = values?.country_interested?.[0];

              if (!instituteId || !country) {
                setProgramLevelData([]);
                return;
              }

              const instituteName = instituteOptions.find((i) => i.value === instituteId)?.label;

              if (instituteName) {
                fetchCourseProgramLevels(instituteName, country);
              }
            }, [
              formData?.interestedCourseDetails?.[
                edit.interestedCourse ? edit.interestedCourseIndex : index.interestedCourse
              ]?.institute,
              formData?.country_interested,
            ]);

            const onInstituteSelect = (campus) => {
              const instituteId =
                values?.interestedCourseDetails[
                  edit.interestedCourse ? edit.interestedCourseIndex : index.interestedCourse
                ]?.institute || '';

              if (instituteId) {
                fetchAllCourse(instituteId, campus);
              } else {
                fetchAllCourse(undefined, campus);
              }
            };
            return (
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                  if (Object.keys(errors).length > 0) {
                    scrollToFirstError(errors);
                  }
                }}
              >
                <div className="mb-5" ref={leadDetailsRef}>
                  {/* <h5 className="mb-3">Lead Details</h5> */}
                  <Row className="mb-3">
                    <Col md={3} className="mt-3">
                      <Form.Label>Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        as={Form.Control}
                        onChange={(e) => setFieldValue('name', e.target.value)}
                        value={values.name}
                        className="custom-select-height"
                        placeholder="Enter name"
                      />
                      <ErrorMessage name="name" component="div" className="text-danger" />
                    </Col>
                    <Col md={3} className="mt-3">
                      <Form.Label>Country</Form.Label>
                      <Select
                        options={countries?.map((c) => ({
                          value: c.name,
                          label: c.name,
                        }))}
                        value={values.country ? { value: values.country, label: values.country } : ''}
                        onChange={(selectedOption) => {
                          setFieldValue('country', selectedOption ? selectedOption.value : '');
                        }}
                        placeholder="Select Country"
                        isClearable
                        isSearchable
                        classNamePrefix="custom-select"
                        noOptionsMessage={() => 'No countries available'}
                        styles={selectStyles}
                      />
                      <ErrorMessage name="country" component="div" className="text-danger" />
                    </Col>
                    {!isB2B && (
                      <>
                        <Col md={3} className="mt-3">
                          <Form.Label>City *</Form.Label>
                          <Form.Control
                            type="text"
                            name="city"
                            as={Form.Control}
                            onChange={(e) => setFieldValue('city', e.target.value)}
                            value={values.city}
                            className="custom-select-height"
                            placeholder="Enter city"
                          />
                          <ErrorMessage name="city" component="div" className="text-danger" />
                        </Col>

                        <Col md={3} className="mt-3">
                          <Form.Label>Email *</Form.Label>
                          <Form.Control
                            name="email"
                            as={Form.Control}
                            onChange={(e) => setFieldValue('email', e.target.value)}
                            value={values.email}
                            type="email"
                            className="custom-select-height"
                            placeholder="Enter Email"
                          />
                          <ErrorMessage name="email" component="div" className="text-danger" />
                        </Col>
                        <Col md={3} className="mt-3">
                          <Form.Label>Phone *</Form.Label>
                          <PhoneInput
                            country={countryCodeISO()}
                            value={values.phone}
                            onChange={(phone, data) => {
                              const dialCode = data.dialCode ? `+${data.dialCode}` : '';
                              const formattedPhone = `${dialCode} ${phone.replace(data.dialCode, '')}`.trim();
                              setFieldValue('phone', formattedPhone);
                            }}
                            // disableCountryGuess={true}
                            inputProps={{
                              name: 'phone',
                              required: true,
                              className: 'form-control custom-select-height',
                            }}
                            inputStyle={{
                              width: '100%',
                              paddingLeft: '65px',
                              borderRadius: '4px',
                            }}
                            buttonStyle={{
                              marginRight: '10px',
                            }}
                          />
                          <ErrorMessage name="phone" component="div" className="text-danger" />
                        </Col>
                        <Col md={3} className="mt-3">
                          <Form.Label>Alternate Contact</Form.Label>
                          <PhoneInput
                            country={countryCodeISO()}
                            value={values.alternate_contact}
                            onChange={(phone, data) => {
                              const dialCode = data.dialCode ? `+${data.dialCode}` : '';
                              const formattedPhone = `${dialCode} ${phone.replace(data.dialCode, '')}`.trim();
                              setFieldValue('alternate_contact', formattedPhone);
                            }}
                            // disableCountryGuess={true}
                            inputProps={{
                              name: 'phone',
                              required: true,
                              className: 'form-control custom-select-height',
                            }}
                            inputStyle={{
                              width: '100%',
                              paddingLeft: '65px',
                              borderRadius: '4px',
                            }}
                            buttonStyle={{
                              marginRight: '10px',
                            }}
                          />
                          <ErrorMessage name="alternate_contact" component="div" className="text-danger" />
                        </Col>
                      </>
                    )}

                    <Col md={3} className="mt-3">
                      <Form.Label>Gender</Form.Label>
                      <Select
                        className="custom-select-height"
                        options={genderOptions}
                        value={genderOptions.find((option) => option.value === values.gender) || null}
                        onChange={(selectedOption) =>
                          setFieldValue('gender', selectedOption ? selectedOption.value : '')
                        }
                        placeholder="Select Gender"
                        isClearable
                        isSearchable
                        classNamePrefix="custom-select"
                        noOptionsMessage={() => 'No gender options available'}
                        styles={selectStyles}
                      />
                      <ErrorMessage name="gender" component="div" className="text-danger  " />
                    </Col>
                    <Col md={3} className="mt-3">
                      <Form.Label>Date of Birth</Form.Label>
                      <div style={{ position: 'relative' }}>
                        <Form.Control
                          type="text"
                          name="dateofbirth"
                          className="custom-select-height"
                          placeholder="dd/mm/yyyy"
                          value={values.dateofbirth ? formatDate(parseDate(values.dateofbirth)) : ''}
                          readOnly
                          ref={dobInputRef}
                          onClick={() => {
                            setDobValue(parseDate(values.dateofbirth) || new Date());
                            setShowDobCalendar((show) => !show);
                          }}
                          style={{ cursor: 'pointer', backgroundColor: '#fff' }}
                        />
                        <MdCalendarToday
                          style={{
                            position: 'absolute',
                            right: 10,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#888',
                            pointerEvents: 'none',
                          }}
                          size={20}
                        />
                        {showDobCalendar && (
                          <div
                            ref={dobCalendarRef}
                            style={{
                              position: 'absolute',
                              top: '100%',
                              left: '0',
                              zIndex: 9999,
                              background: '#fff',
                              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                              borderRadius: '8px',
                              marginTop: '4px',
                              width: dobInputRef.current ? dobInputRef.current.offsetWidth : 'auto',
                              minWidth: 180,
                            }}
                          >
                            <Calendar
                              className="form-control m-0 p-0 border-0"
                              onChange={(selectedDate) => {
                                setDobValue(selectedDate);

                                // Format DOB as yyyy-mm-dd
                                const yyyy = selectedDate.getFullYear();
                                const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
                                const dd = String(selectedDate.getDate()).padStart(2, '0');
                                const dobString = `${yyyy}-${mm}-${dd}`;
                                setFieldValue('dateofbirth', dobString);

                                // ✅ Calculate Age
                                const today = new Date();
                                let age = today.getFullYear() - yyyy;
                                const m = today.getMonth() - selectedDate.getMonth();
                                if (m < 0 || (m === 0 && today.getDate() < selectedDate.getDate())) {
                                  age--;
                                }
                                setFieldValue('age', age);

                                setShowDobCalendar(false);
                              }}
                              value={dobValue || new Date()}
                              locale="en-GB"
                            />
                          </div>
                        )}
                      </div>
                      <ErrorMessage name="dateofbirth" component="div" className="text-danger" />
                    </Col>

                    {!isB2B && (
                      <>
                        <Col md={3} className="mt-3">
                          <Form.Label>Age</Form.Label>
                          <Form.Control
                            type="number"
                            name="age"
                            as={Form.Control}
                            onChange={(e) => setFieldValue('age', e.target.value)}
                            value={values.age}
                            className="custom-select-height"
                            placeholder="Enter age"
                            readOnly
                          />
                          <ErrorMessage name="age" component="div" className="text-danger" />
                        </Col>

                        <Col md={3} className="mt-3">
                          <Form.Label>Comments</Form.Label>
                          <Form.Control
                            name="comments"
                            as={Form.Control}
                            onChange={(e) => setFieldValue('comments', e.target.value)}
                            value={values.comments}
                            className="custom-select-height"
                            placeholder="Add comment"
                            rows={2}
                          />
                          <ErrorMessage name="comments" component="div" className="text-danger" />
                        </Col>
                      </>
                    )}
                    {!(isB2B && (userRole === 'B2B Admin' || userRole === 'B2B Member')) && (
                      <Col md={3} className="mt-3">
                        <Form.Label>Lead Status</Form.Label>
                        <Select
                          options={isB2B ? b2BLeadStatusOptions : leadStatusOptions}
                          value={
                            isB2B
                              ? b2BLeadStatusOptions.find((option) => option.value === values.b2b_lead_status)
                              : leadStatusOptions.find((option) => option.value === values.lead_status)
                          }
                          onChange={(selectedOption) => {
                            const selectedValue = selectedOption ? selectedOption.value : '';

                            setFieldValue(isB2B ? 'b2b_lead_status' : 'lead_status', selectedValue);
                            if (selectedValue) {
                              setIsSubStatusDisabled(false);
                              fetchLeadSubStatus(selectedValue);
                            } else {
                              setIsSubStatusDisabled(true);
                              setLeadSubStatus([]);
                              setFieldValue('lead_sub_status', '');
                            }
                            fetchLeadSubStatus(selectedValue);
                          }}
                          placeholder="Select option"
                          isClearable
                          isSearchable
                          classNamePrefix="custom-select"
                          noOptionsMessage={() => 'No lead status options available'}
                          styles={selectStyles}
                        />
                        <ErrorMessage
                          name={isB2B ? 'b2b_lead_status' : 'lead_status'}
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                    )}
                    <Col md={3} className="mt-3">
                      <Form.Label>Other Service</Form.Label>
                      <Select
                        className="custom-select-height"
                        options={allOther?.map((type) => ({
                          value: type._id,
                          label: type.name,
                        }))}
                        value={
                          Array.isArray(values.other_for)
                            ? values.other_for.map((id) => ({
                                value: id,
                                label: allOther?.find((type) => type._id === id)?.name || '',
                              }))
                            : []
                        }
                        onChange={(selectedOptions) => {
                          const selectedValues = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
                          setFieldValue('other_for', selectedValues);
                        }}
                        placeholder="Select Other Type"
                        isMulti
                        isClearable
                        isSearchable
                        classNamePrefix="custom-select"
                        noOptionsMessage={() => 'No other types available'}
                        styles={selectStyles}
                      />
                      <ErrorMessage name="other_for" component="div" className="text-danger" />
                      <ErrorMessage name="other_for" component="div" className="text-danger" />
                    </Col>
                    {/* {
                      !isB2B &&
                      !(userRole === "B2B Admin" || userRole === "B2B Member")
                     && (
                      <Col md={3} className="mt-3">
                        <Form.Label>Lead Sub Status</Form.Label>
                        <Select
                          options={leadSubStatusOptions}
                          value={
                            leadSubStatusOptions.find(
                              (option) =>
                                option.value === values.lead_sub_status
                            )
                          }
                          onChange={(selectedOption) => {
                            const selectedValue = selectedOption
                              ? selectedOption.value
                              : "";
                            setFieldValue("lead_sub_status", selectedValue);
                          }}
                          placeholder="Select option"
                          isClearable
                          isSearchable
                          classNamePrefix="custom-select"
                          noOptionsMessage={() =>
                            "No lead status options available"
                          }
                          styles={selectStyles}
                          isDisabled={isSubStatusDisabled}
                        />
                        <ErrorMessage
                          name={isB2B ? "b2b_lead_status" : "lead_sub_status"}
                          component="div"
                          className="text-danger"
                        />
                      </Col>
                    )} */}
                    {!isB2B && (
                      <>
                        <Col md={3} className="mt-3">
                          <Form.Label>Lead from</Form.Label>
                          <Form.Select
                            className="custom-select-height"
                            placeholder="Add Lead From"
                            // type="text"
                            name="lead_form"
                            value={values.lead_form}
                            //  as={Form.select}
                            onChange={(e) => setFieldValue('lead_form', e.target.value)}
                          >
                            <option value="">Select option</option>
                            <option value="Web Enquiry">Web Enquiry</option>
                            <option value="Social Media">Social Media</option>
                            <option value="Phone Call">Phone Call</option>
                            <option value="Email">Email</option>
                            <option value="Fair Enquiry">Fair Enquiry</option>
                            <option value="Walk in">Walk in</option>
                          </Form.Select>
                          <ErrorMessage name="lead_form" component="div" className="text-danger" />
                        </Col>

                        <Col md={3} className="mt-3">
                          <Form.Label>Inquiry For *</Form.Label>
                          <Select
                            className="custom-select-height"
                            options={allInquiry?.map((type) => ({
                              value: type._id,
                              label: type.name,
                            }))}
                            value={
                              values.inquiry_for
                                ? {
                                    value: values.inquiry_for,
                                    label: allInquiry?.find((type) => type._id === values.inquiry_for)?.name || '',
                                  }
                                : null
                            }
                            onChange={(selectedOption) => {
                              setFieldValue('inquiry_for', selectedOption ? selectedOption.value : '');
                            }}
                            placeholder="Select Inquiry Type"
                            isClearable
                            isSearchable
                            classNamePrefix="custom-select"
                            noOptionsMessage={() => 'No inquiry types available'}
                            styles={{
                              control: (base) => ({
                                ...base,
                                borderRadius: '12px',
                                color: 'black',
                              }),
                              placeholder: (base) => ({
                                ...base,
                                color: 'black',
                                fontSize: '13px',
                              }),
                            }}
                          />
                          <ErrorMessage name="inquiry_for" component="div" className="text-danger" />
                        </Col>
                        {allInquiry?.find(
                          (item) => item._id === values.inquiry_for && item.name?.toLowerCase() === 'others',
                        ) && (
                          <Col md={3} className="mt-3">
                            <Form.Label>Inquiry For Other</Form.Label>
                            <Form.Control
                              type="text"
                              name="inquiry_for_other"
                              as={Form.Control}
                              onChange={(e) => setFieldValue('inquiry_for_other', e.target.value)}
                              placeholder="Add Inquiry For Other"
                              value={values.inquiry_for_other}
                              className="custom-select-height"
                            />
                            <ErrorMessage name="inquiry_for_other" component="div" className="text-danger" />
                          </Col>
                        )}
                      </>
                    )}
                    <Col md={3} className="mt-3">
                      <Form.Label>Preferred Country</Form.Label>
                      <Select
                        options={countries?.map((c) => ({
                          value: c.name,
                          label: c.name,
                        }))}
                        value={
                          values.country_interested
                            ? (Array.isArray(values.country_interested)
                                ? values.country_interested
                                : [values.country_interested]
                              ).map((country) => ({
                                value: country,
                                label: country,
                              }))
                            : []
                        }
                        onChange={(selectedOptions) => {
                          const selected = selectedOptions || [];
                          const selectedValues = selected.map((opt) => opt.value);
                          setFieldValue('country_interested', selectedValues);
                          fetchAllInstitute(selectedValues);
                        }}
                        placeholder="Select Country"
                        isClearable
                        isSearchable
                        isMulti
                        classNamePrefix="custom-select"
                        menuPortalTarget={document.body}
                        noOptionsMessage={() => 'No countries available'}
                        styles={selectStyles}
                      />
                      <ErrorMessage name="country_intrested" component="div" className="text-danger" />
                    </Col>
                    {!isB2B && (
                      <>
                        <Col md={3} className="mt-3">
                          <Form.Label>Source of Reference</Form.Label>
                          <Form.Control
                            name="source_of_reference"
                            as={Form.Control}
                            onChange={(e) => setFieldValue('source_of_reference', e.target.value)}
                            value={values.source_of_reference}
                            type="text"
                            className="custom-select-height"
                            placeholder="Enter Source of Reference"
                          />
                          <ErrorMessage name="source_of_refrence" component="div" className="text-danger" />
                        </Col>
                        <Col md={3} className="mt-3">
                          <Form.Label>Office Use Only</Form.Label>
                          <Form.Control
                            name="office_use_only"
                            as={Form.Control}
                            onChange={(e) => setFieldValue('office_use_only', e.target.value)}
                            value={values.office_use_only}
                            className="custom-select-height"
                            placeholder="Enter Office Use Only"
                            rows={2}
                          />
                        </Col>
                      </>
                    )}
                    {isB2B && (
                      <>
                        <Col md={3} className="mt-3">
                          <Form.Label>Prefer Degree</Form.Label>
                          <Select
                            name="prefferedDegree"
                            options={programLevels?.map((level) => ({
                              value: level._id,
                              label: level.name,
                            }))}
                            value={
                              values.prefferedDegree
                                ? {
                                    value: values.prefferedDegree,
                                    label:
                                      programLevels?.find((level) => level._id === values.prefferedDegree)?.name || '',
                                  }
                                : null
                            }
                            onChange={(selected) => setFieldValue('prefferedDegree', selected?.value || '')}
                            placeholder="Select Degree"
                            isClearable
                            isSearchable
                            styles={{
                              control: (base) => ({
                                ...base,
                                borderRadius: '12px',
                                color: 'black',
                              }),
                              placeholder: (base) => ({
                                ...base,
                                color: 'black',
                                fontSize: '13px',
                              }),
                            }}
                          />
                          <ErrorMessage name="prefferedDegree" component="div" className="text-danger" />
                        </Col>

                        <Col md={3} className="mt-3">
                          <Form.Label>Prefer Course</Form.Label>
                          <Form.Control
                            type="text"
                            name="prefferedCourse"
                            onChange={(e) => setFieldValue('prefferedCourse', e.target.value)}
                            value={values.prefferedCourse}
                            className="custom-select-height"
                            placeholder="Enter Course"
                          />
                          <ErrorMessage name="prefferedCourse" component="div" className="text-danger" />
                        </Col>

                        <Col md={3} className="mt-3">
                          <Form.Label>Prefer Intake Year</Form.Label>
                          <Select
                            name="prefferedIntakeYear"
                            options={years}
                            value={years.find((opt) => opt.value === Number(values.prefferedIntakeYear)) || null}
                            onChange={(selected) => setFieldValue('prefferedIntakeYear', selected?.value || '')}
                            placeholder="Select Year"
                            isClearable
                            isSearchable
                            styles={{
                              control: (base) => ({
                                ...base,
                                borderRadius: '12px',
                                color: 'black',
                              }),
                              placeholder: (base) => ({
                                ...base,
                                color: 'black',
                                fontSize: '13px',
                              }),
                            }}
                          />
                          <ErrorMessage name="prefferedIntakeYear" component="div" className="text-danger" />
                        </Col>

                        <Col md={3} className="mt-3">
                          <Form.Label>Prefer Intake Month</Form.Label>
                          <Select
                            name="prefferedIntakeMonth"
                            options={months}
                            value={months.find((opt) => opt.value === values.prefferedIntakeMonth) || null}
                            onChange={(selected) => setFieldValue('prefferedIntakeMonth', selected?.value || '')}
                            placeholder="Select Month"
                            isClearable
                            isSearchable
                            styles={{
                              control: (base) => ({
                                ...base,
                                borderRadius: '12px',
                                color: 'black',
                              }),
                              placeholder: (base) => ({
                                ...base,
                                color: 'black',
                                fontSize: '13px',
                              }),
                            }}
                          />
                          <ErrorMessage name="prefferedIntakeMonth" component="div" className="text-danger" />
                        </Col>
                      </>
                    )}

                    <Col md={isB2B ? 6 : 3} className="mt-3">
                      <Form.Label>Remarks</Form.Label>
                      <Form.Control
                        className="rounded-1"
                        as="textarea"
                        name="remarks"
                        onChange={(e) => setFieldValue('remarks', e.target.value)}
                        value={values.remarks}
                        rows={4}
                        placeholder="Enter remarks"
                      />
                      <ErrorMessage name="remarks" component="div" className="text-danger" />
                    </Col>
                  </Row>
                </div>

                {!(isB2B && (userRole === 'B2B Admin' || userRole === 'B2B Member')) && (
                  <div className="section-wrapper mb-5" ref={leadAssignmentsRef}>
                    <h5
                      className="form-heading p-2 d-flex justify-content-between mb-2"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setShowLeadAssignments(!showLeadAssignments)}
                    >
                      Lead Assignments
                      {showLeadAssignments ? <FaChevronUp /> : <FaChevronDown />}
                    </h5>
                    {showLeadAssignments && (
                      <div className="section-content mt-4 mb-5">
                        <Row className="mb-3">
                          {!isB2B &&
                            userRole !== 'Branch' &&
                            userRole !== 'Branch Member' &&
                            userType !== 'Branch User' && (
                              <Col md={3} className="mt-3">
                                <Form.Label>Branch Lead Assign</Form.Label>
                                <Select
                                  className="custom-select-height"
                                  options={[
                                    { value: 'head_office', label: 'Head Office' }, // ✅ give it a distinct value
                                    ...(allBranchOptions || []),
                                  ]}
                                  value={
                                    [{ value: 'head_office', label: 'Head Office' }, ...(allBranchOptions || [])].find(
                                      (option) =>
                                        option.value ===
                                        (values.lead_assign_Branch === null
                                          ? 'head_office'
                                          : values.lead_assign_Branch),
                                    ) || null
                                  }
                                  onChange={async (selectedOption) => {
                                    const selectedBranchValue = selectedOption ? selectedOption.value : null;

                                    const branchValueToSet =
                                      selectedBranchValue === 'head_office' ? null : selectedBranchValue;

                                    setFieldValue('lead_assign_Branch', branchValueToSet);

                                    // setFieldValue("lead_role", null);
                                    // setFieldValue("lead_assign", null);

                                    if (handleBranchChange) {
                                      await handleBranchChange(branchValueToSet);
                                    }
                                  }}
                                  menuPortalTarget={document.body}
                                  placeholder="Select Branch"
                                  isClearable
                                  isSearchable
                                  classNamePrefix="custom-select"
                                  noOptionsMessage={() => 'No branches available'}
                                  styles={selectStyles}
                                />
                                <ErrorMessage name="lead_assign_Branch" component="div" className="text-danger" />
                              </Col>
                            )}
                          <Col md={3} className="mt-3">
                            <Form.Label>Lead Assign Role</Form.Label>
                            <Select
                              name={`lead_assign[${edit.leadAssignment ? 0 : index.leadAssignment}].role`}
                              className="custom-select-height"
                              options={roleOptions}
                              value={
                                roleOptions.find(
                                  (option) =>
                                    option.value ===
                                    values.lead_assign[edit.leadAssignment ? 0 : index.leadAssignment]?.role,
                                ) || null
                              }
                              onChange={(selectedOption) => {
                                const selectedRoleId = selectedOption ? selectedOption.value : null;

                                setFieldValue(
                                  `lead_assign[${edit.leadAssignment ? 0 : index.leadAssignment}].role`,
                                  selectedRoleId,
                                );
                                setFieldValue(
                                  `lead_assign[${edit.leadAssignment ? 0 : index.leadAssignment}].user`,
                                  null,
                                );

                                if (selectedRoleId) {
                                  const selectedRole = getRoleList?.data?.find((role) => role._id === selectedRoleId);

                                  let selectedBranchId = null;
                                  if (userRole === 'Branch') {
                                    selectedBranchId = branchId;
                                  } else if (userType === 'Branch User') {
                                    selectedBranchId = branchUserId || branchId;
                                  } else {
                                    selectedBranchId =
                                      values.lead_assign_Branch === null ? null : values.lead_assign_Branch || null;
                                  }

                                  if (selectedRole) {
                                    fetchAllUser(selectedRoleId, selectedRole.name, selectedBranchId, false);
                                  }
                                } else {
                                  // Clear user list when no role is selected
                                  fetchAllUser(null, '', null, true);
                                }
                              }}
                              placeholder="Select Role"
                              isClearable
                              isSearchable
                              classNamePrefix="custom-select"
                              noOptionsMessage={() => 'No roles available'}
                              menuPortalTarget={document.body}
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                            />
                            <ErrorMessage
                              name={`lead_assign[${edit.leadAssignment ? 0 : index.leadAssignment}].role`}
                              component="div"
                              className="text-danger"
                            />
                          </Col>
                          <Col md={3} className="mt-3">
                            <Form.Label>Lead Assign</Form.Label>
                            <Select
                              name={`lead_assign[${edit.leadAssignment ? 0 : index.leadAssignment}].user`}
                              className="custom-select-height"
                              options={userOptions || []}
                              value={
                                userOptions?.find(
                                  (option) =>
                                    option.value ===
                                    values.lead_assign[edit.leadAssignment ? 0 : index.leadAssignment]?.user,
                                ) || null
                              }
                              onChange={(selectedOption) => {
                                setFieldValue(
                                  `lead_assign[${edit.leadAssignment ? 0 : index.leadAssignment}].user`,
                                  selectedOption ? selectedOption.value : null,
                                );
                              }}
                              placeholder="Select User"
                              isClearable
                              isSearchable
                              isDisabled={!userOptions || userOptions.length === 0}
                              classNamePrefix="custom-select"
                              noOptionsMessage={() => 'No users available'}
                              menuPortalTarget={document.body}
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                            />
                            <ErrorMessage
                              name={`lead_assign[${edit.leadAssignment ? 0 : index.leadAssignment}].user`}
                              component="div"
                              className="text-danger"
                            />
                          </Col>
                        </Row>
                        <Row className="mb-3">
                          <Col md={{ span: 3, offset: 9 }} className="mt-3">
                            <Button
                              type="button"
                              className="w-100 custom-select-height text-white"
                              style={{ backgroundColor: '#3b3665' }}
                              onClick={() => {
                                if (edit.leadAssignment) {
                                  handleLeadAssignmentEdit(values);
                                } else {
                                  handleLeadAssignmentSubmit(values);
                                }
                              }}
                            >
                              <FaPlus className="plus-button mx-2" /> {edit.leadAssignment ? 'Update' : 'Add'}
                              Lead Assignment
                            </Button>
                          </Col>
                        </Row>
                        {fullLeadAssignments && fullLeadAssignments?.length > 0 && (
                          <div className="mt-5">
                            <h5>Lead Assignments Data:</h5>
                            <div className="table-responsive">
                              <Table className="text-nowrap border">
                                <thead>
                                  <tr>
                                    <th scope="col">NO.</th>
                                    <th scope="col">Role</th>
                                    <th scope="col">User</th>
                                    <th scope="col">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {fullLeadAssignments?.map((data, i) => {
                                    const roleName = data.role?.name || 'N/A';
                                    const userName = data.user?.name || 'N/A';
                                    return (
                                      <tr key={i} className="custom-table-row">
                                        <td>{i + 1}</td>
                                        <td>{roleName || 'N/A'}</td>
                                        <td>{userName || 'N/A'}</td>
                                        <td>
                                          <div className="d-flex">
                                            <span className="icon-border edit-icon">
                                              <EditIcon
                                                onClick={() =>
                                                  setEdit((prev) => ({
                                                    ...prev,
                                                    leadAssignment: true,
                                                    leadAssignmentIndex: i,
                                                  }))
                                                }
                                              />
                                            </span>
                                            <span className="icon-border delete-icon ms-2">
                                              <DeleteIcon onClick={() => handleLeadAssignmentDelete(i)} />
                                            </span>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </Table>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {!isB2B && (
                  <>
                    <h5 className="form-heading p-2 rounded-5">Follow-up Details</h5>
                    <div className="mt-4 mb-5" ref={followUpDetailsRef}>
                      <Row className="mb-3">
                        <Col md={3} className="mt-3">
                          <Form.Label>Next Followup Date</Form.Label>
                          <div style={{ position: 'relative' }}>
                            <Form.Control
                              type="text"
                              name="next_follow_up"
                              className="custom-select-height"
                              placeholder="dd/mm/yyyy"
                              value={values.next_follow_up ? formatDate(parseDate(values.next_follow_up)) : ''}
                              readOnly
                              ref={nextFollowupInputRef}
                              onClick={() => {
                                setNextFollowupValue(parseDate(values.next_follow_up) || new Date());
                                setShowNextFollowupCalendar((show) => !show);
                              }}
                              style={{
                                cursor: 'pointer',
                                backgroundColor: '#fff',
                              }}
                            />
                            <MdCalendarToday
                              style={{
                                position: 'absolute',
                                right: 10,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#888',
                                pointerEvents: 'none',
                              }}
                              size={20}
                            />
                            {showNextFollowupCalendar && (
                              <div
                                ref={nextFollowupCalendarRef}
                                style={{
                                  position: 'absolute',
                                  top: '100%',
                                  left: '0',
                                  zIndex: 9999,
                                  background: '#fff',
                                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                                  borderRadius: '8px',
                                  marginTop: '4px',
                                  width: nextFollowupInputRef.current
                                    ? nextFollowupInputRef.current.offsetWidth
                                    : 'auto',
                                  minWidth: 180,
                                }}
                              >
                                <Calendar
                                  className="form-control m-0 p-0 border-0"
                                  onChange={(selectedDate) => {
                                    setNextFollowupValue(selectedDate);
                                    // Store as local yyyy-mm-dd, not toISOString
                                    const yyyy = selectedDate.getFullYear();
                                    const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
                                    const dd = String(selectedDate.getDate()).padStart(2, '0');
                                    setFieldValue('next_follow_up', `${yyyy}-${mm}-${dd}`);
                                    setShowNextFollowupCalendar(false);
                                  }}
                                  value={nextFollowupValue || new Date()}
                                  locale="en-GB"
                                  // minDate={new Date()}
                                />
                              </div>
                            )}
                          </div>
                          <ErrorMessage name="next_follow_up" component="div" className="text-danger" />
                        </Col>
                        <Col md={3} className="mt-3">
                          <Form.Label>Follow Up Type</Form.Label>
                          <Select
                            className="custom-select-height"
                            options={followUpTypeOptions}
                            value={
                              followUpTypeOptions?.find((option) => option.value === values.follow_up_type) || null
                            }
                            onChange={(selectedOption) =>
                              setFieldValue('follow_up_type', selectedOption ? selectedOption.value : null)
                            }
                            placeholder="Select Follow up type"
                            isClearable
                            isSearchable
                            classNamePrefix="custom-select"
                            noOptionsMessage={() => 'No follow up type options available'}
                            styles={selectStyles}
                          />
                          <ErrorMessage name="follow_up_type" component="div" className="text-danger" />
                        </Col>
                        <Col md={3} className="mt-3">
                          <Form.Label>From</Form.Label>
                          <Form.Control
                            name="from"
                            as={Form.Control}
                            onChange={(e) => setFieldValue('from', e.target.value)}
                            value={values.from}
                            type="time"
                            className="custom-select-height"
                          />
                          <ErrorMessage name="from" component="div" className="text-danger" />
                        </Col>
                        <Col md={3} className="mt-3">
                          <Form.Label>To</Form.Label>
                          <Form.Control
                            name="to"
                            as={Form.Control}
                            onChange={(e) => setFieldValue('to', e.target.value)}
                            value={values.to}
                            type="time"
                            className="custom-select-height"
                          />
                          <ErrorMessage name="to" component="div" className="text-danger" />
                        </Col>
                        {/* <Col md={3} className="mt-3">
                          <Form.Label>Nationality</Form.Label>
                          <Form.Control
                            name="nationality"
                            as={Form.Control}
                            onChange={(e) =>
                              setFieldValue("nationality", e.target.value)
                            }
                            value={values.nationality}
                            type="text"
                            className="custom-select-height"
                            placeholder="Enter Nationality"
                          />
                          <ErrorMessage
                            name="nationality"
                            component="div"
                            className="text-danger"
                          />
                        </Col> */}
                        {/* <Col md={3} className="mt-3">
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            name="address"
                            as={Form.Control}
                            onChange={(e) =>
                              setFieldValue("address", e.target.value)
                            }
                            value={values.address}
                            type="text"
                            className="custom-select-height"
                            placeholder="Enter Address"
                          />
                          <ErrorMessage
                            name="address"
                            component="div"
                            className="text-danger"
                          />
                        </Col> */}
                        {/* <Col md={3} className="mt-3">
                          <Form.Label>Pincode</Form.Label>
                          <Form.Control
                            name="pincode"
                            as={Form.Control}
                            onChange={(e) =>
                              setFieldValue("pincode", e.target.value)
                            }
                            value={values.pincode}
                            type="text"
                            className="custom-select-height"
                            placeholder="Enter Pincode"
                          />
                          <ErrorMessage
                            name="pincode"
                            component="div"
                            className="text-danger"
                          />
                        </Col> */}
                        <Col md={3} className="mt-3">
                          <Form.Label>Lead FollowUp Remark</Form.Label>
                          <Select
                            className="custom-select-height"
                            options={leadFollowUpRemarkOptions}
                            value={
                              leadFollowUpRemarkOptions.find(
                                (option) => option.value === values.lead_followup_remark,
                              ) || null
                            }
                            onChange={(selectedOption) =>
                              setFieldValue('lead_followup_remark', selectedOption ? selectedOption.value : '')
                            }
                            placeholder="Select Lead FollowUp Remark"
                            isClearable
                            isSearchable
                            classNamePrefix="custom-select"
                            noOptionsMessage={() => 'No follow-up remark options available'}
                            styles={selectStyles}
                          />
                          <ErrorMessage name="lead_followup_remark" component="div" className="text-danger" />
                        </Col>
                        <Col md={3} className="mt-3">
                          <Form.Label>Lead Text Remark</Form.Label>
                          <Form.Control
                            name="lead_text_remark"
                            as="textarea"
                            onChange={(e) => setFieldValue('lead_text_remark', e.target.value)}
                            value={values.lead_text_remark}
                            className="rounded-1"
                            placeholder="Enter Lead Text Remark"
                            rows={4}
                          />
                        </Col>
                      </Row>
                    </div>
                  </>
                )}
                <div className="section-wrapper" ref={interestedCourseRef}>
                  {' '}
                  <h5
                    className="form-heading p-2 d-flex justify-content-between mb-3"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowInterestedCourse(!showInterestedCourse)}
                  >
                    Interested Course
                    {showInterestedCourse ? <FaChevronUp /> : <FaChevronDown />}
                  </h5>
                  {showInterestedCourse && (
                    <div className="section-content mt-4 mb-5">
                      <Row>
                        <Col md={3} className="mb-3">
                          <Form.Label>Institute</Form.Label>
                          <Select
                            name={`interestedCourseDetails[${
                              edit.interestedCourse ? 0 : index.interestedCourse
                            }].institute`}
                            options={instituteOptions}
                            value={
                              instituteOptions.find(
                                (option) =>
                                  option.value ===
                                  (typeof values.interestedCourseDetails?.[
                                    edit.interestedCourse ? 0 : index.interestedCourse
                                  ]?.institute === 'object'
                                    ? values.interestedCourseDetails?.[
                                        edit.interestedCourse ? 0 : index.interestedCourse
                                      ]?.institute?._id
                                    : values.interestedCourseDetails?.[
                                        edit.interestedCourse ? 0 : index.interestedCourse
                                      ]?.institute),
                              ) || null
                            }
                            onChange={(selectedOption) => {
                              setFieldValue(
                                `interestedCourseDetails[${
                                  edit.interestedCourse ? edit.interestedCourseIndex : index.interestedCourse
                                }].institute`,
                                selectedOption ? selectedOption.value : '',
                              );
                              const preferredCountry = values.country_interested?.[0] || '';

                              fetchAllCampusByInstitute(selectedOption ? selectedOption.label : '', preferredCountry);

                              if (selectedOption) {
                                getAllCourseFinder(selectedOption.value, ''); // Fetch courses for the selected institute
                              }
                            }}
                            menuPortalTarget={document.body}
                            placeholder="Select Institute"
                            isClearable
                            isSearchable
                            classNamePrefix="custom-select"
                            noOptionsMessage={() => 'No institutes available'}
                            styles={selectStyles}
                          />
                        </Col>
                        <Col md={3} className="mb-3">
                          <Form.Label>Campus</Form.Label>
                          <Select
                            name={`interestedCourseDetails[${
                              edit.interestedCourse ? 0 : index.interestedCourse
                            }].campus`}
                            options={campusOptions}
                            value={campusOptions?.find(
                              (option) =>
                                option.value ===
                                (typeof values.interestedCourseDetails[
                                  edit.interestedCourse ? 0 : index.interestedCourse
                                ]?.campus === 'object'
                                  ? values.interestedCourseDetails[edit.interestedCourse ? 0 : index.interestedCourse]
                                      ?.campus?._id
                                  : values.interestedCourseDetails[edit.interestedCourse ? 0 : index.interestedCourse]
                                      ?.campus),
                            )}
                            onChange={(selectedOption) => {
                              setFieldValue(
                                `interestedCourseDetails[${
                                  edit.interestedCourse ? edit.interestedCourseIndex : index.interestedCourse
                                }].campus`,
                                selectedOption ? selectedOption.value : '',
                              );

                              if (onInstituteSelect) {
                                onInstituteSelect(selectedOption ? selectedOption.value : '');
                              }
                            }}
                            menuPortalTarget={document.body}
                            placeholder="Select Campus"
                            isClearable
                            isSearchable
                            classNamePrefix="custom-select"
                            noOptionsMessage={() => 'No campuses available'}
                            styles={selectStyles}
                          />
                        </Col>
                        <Col md={3} className="mb-3">
                          <Form.Label>Program Level</Form.Label>
                          <Select
                            name={`interestedCourseDetails[${
                              edit.interestedCourse ? 0 : index.interestedCourse
                            }].programLevel`}
                            options={programLevelData.map((pl) => ({
                              label: pl.name,
                              value: pl._id,
                            }))}
                            value={
                              programLevelData
                                .map((pl) => ({
                                  label: pl.name,
                                  value: pl._id,
                                }))
                                .find(
                                  (pl) =>
                                    pl.value ===
                                    (typeof values.interestedCourseDetails[
                                      edit.interestedCourse ? 0 : index.interestedCourse
                                    ]?.programLevel === 'object'
                                      ? values.interestedCourseDetails[
                                          edit.interestedCourse ? 0 : index.interestedCourse
                                        ]?.programLevel?._id
                                      : values.interestedCourseDetails[
                                          edit.interestedCourse ? 0 : index.interestedCourse
                                        ]?.programLevel),
                                ) || null
                            }
                            onChange={(selected) =>
                              setFieldValue(
                                `interestedCourseDetails[${
                                  edit.interestedCourse ? edit.interestedCourseIndex : index.interestedCourse
                                }].programLevel`,
                                selected?.value || '',
                              )
                            }
                            menuPortalTarget={document.body}
                            placeholder="Select Program Level"
                            isClearable
                            isSearchable
                            classNamePrefix="custom-select"
                            noOptionsMessage={() => 'No program levels available'}
                            styles={selectStyles}
                          />
                        </Col>
                        <Col md={3} className="mb-3">
                          <Form.Label>Course</Form.Label>
                          <Select
                            name={`interestedCourseDetails[${selectedIndex}].course`}
                            options={allcourseData
                              ?.sort((a, b) => a.programName.localeCompare(b.programName))
                              ?.map((course) => ({
                                label: course.programName,
                                value: course._id,
                              }))}
                            value={
                              allcourseData
                                ?.map((course) => ({
                                  label: course.programName,
                                  value: course._id,
                                }))
                                ?.find(
                                  (opt) =>
                                    opt.value ===
                                    (typeof values.interestedCourseDetails[selectedIndex]?.course === 'object'
                                      ? values.interestedCourseDetails[selectedIndex]?.course?._id
                                      : values.interestedCourseDetails[selectedIndex]?.course),
                                ) || null
                            }
                            onChange={(selected) => {
                              setFieldValue(`interestedCourseDetails[${selectedIndex}].course`, selected?.value || '');

                              // 🔥 RESET dependent fields
                              setFieldValue(`interestedCourseDetails[${selectedIndex}].intakeMonth`, '');
                              setFieldValue(`interestedCourseDetails[${selectedIndex}].intakeYear`, '');
                            }}
                            menuPortalTarget={document.body}
                            placeholder="Select Course"
                            isClearable
                            isSearchable
                            classNamePrefix="custom-select"
                            noOptionsMessage={() => 'No course available'}
                            styles={selectStyles}
                          />
                        </Col>
                        <Col md={3} className="mb-3">
                          <Form.Label>Intake Month</Form.Label>
                          <Select
                            name={`interestedCourseDetails[${selectedIndex}].intakeMonth`}
                            options={intakeMonthOptions}
                            value={
                              intakeMonthOptions.find(
                                (opt) => opt.value === values.interestedCourseDetails[selectedIndex]?.intakeMonth,
                              ) || null
                            }
                            onChange={(selected) =>
                              setFieldValue(
                                `interestedCourseDetails[${selectedIndex}].intakeMonth`,
                                selected?.value || '',
                              )
                            }
                            placeholder="Select Intake Month"
                            menuPortalTarget={document.body}
                            isClearable
                            isSearchable
                            classNamePrefix="custom-select"
                            noOptionsMessage={() => 'No intake months available'}
                            styles={selectStyles}
                          />
                        </Col>
                        <Col md={3} className="mb-3">
                          <Form.Label>Intake Year</Form.Label>
                          <Select
                            name={`interestedCourseDetails[${selectedIndex}].intakeYear`}
                            options={intakeYearOptions}
                            value={
                              intakeYearOptions.find(
                                (opt) => opt.value === values.interestedCourseDetails[selectedIndex]?.intakeYear,
                              ) || null
                            }
                            onChange={(selected) =>
                              setFieldValue(
                                `interestedCourseDetails[${selectedIndex}].intakeYear`,
                                selected?.value || '',
                              )
                            }
                            menuPortalTarget={document.body}
                            placeholder="Select Intake Year"
                            isClearable
                            isSearchable
                            classNamePrefix="custom-select"
                            noOptionsMessage={() => 'No intake years available'}
                            styles={selectStyles}
                          />
                        </Col>
                        <Col md={3} className="mb-3">
                          <Form.Label>Remarks</Form.Label>
                          <Form.Control
                            name={`interestedCourseDetails[${selectedIndex}].remarks`}
                            type="text"
                            placeholder="Enter Remarks"
                            value={values.interestedCourseDetails?.[selectedIndex]?.remarks || ''}
                            onChange={(e) => {
                              setFieldValue(`interestedCourseDetails[${selectedIndex}].remarks`, e.target.value);
                            }}
                            className="custom-select-height"
                          />
                        </Col>
                        {isB2B && (
                          <Col md={3} className="mb-3">
                            <Form.Label>Accepted By Us</Form.Label>
                            <div className="d-flex gap-3 mt-2">
                              <Form.Check
                                type="radio"
                                label="Yes"
                                className="custom-radio-border"
                                name={`interestedCourseDetails[${
                                  edit.interestedCourse ? 0 : index.interestedCourse
                                }].acceptedByUs`}
                                id={`acceptedByUs-yes-${edit.interestedCourse ? 0 : index.interestedCourse}`}
                                checked={
                                  values.interestedCourseDetails[edit.interestedCourse ? 0 : index.interestedCourse]
                                    ?.acceptedByUs === true
                                }
                                onChange={() =>
                                  setFieldValue(
                                    `interestedCourseDetails[${
                                      edit.interestedCourse ? 0 : index.interestedCourse
                                    }].acceptedByUs`,
                                    true,
                                  )
                                }
                              />

                              <Form.Check
                                type="radio"
                                label="No"
                                className="custom-radio-border"
                                name={`interestedCourseDetails[${
                                  edit.interestedCourse ? 0 : index.interestedCourse
                                }].acceptedByUs`}
                                id={`acceptedByUs-no-${edit.interestedCourse ? 0 : index.interestedCourse}`}
                                checked={
                                  values.interestedCourseDetails[edit.interestedCourse ? 0 : index.interestedCourse]
                                    ?.acceptedByUs === false
                                }
                                onChange={() =>
                                  setFieldValue(
                                    `interestedCourseDetails[${
                                      edit.interestedCourse ? 0 : index.interestedCourse
                                    }].acceptedByUs`,
                                    false,
                                  )
                                }
                              />
                            </div>
                          </Col>
                        )}
                      </Row>
                      <Row className="mb-3">
                        <Col md={{ span: 3, offset: 9 }} className="mt-3">
                          <Button
                            type="button"
                            className="w-100 custom-select-height text-white"
                            style={{ backgroundColor: '#3b3665' }}
                            onClick={() => {
                              const resetInterestedCourseFields = () => {
                                setFieldValue('interestedCourseDetails', [
                                  {
                                    institute: '',
                                    campus: '',
                                    programLevel: '',
                                    course: '',
                                    intakeMonth: '',
                                    intakeYear: '',
                                    remarks: '',
                                    acceptedByUs: false,
                                  },
                                ]);
                              };

                              if (edit.interestedCourse) {
                                const ok = handleInterestedCourseDetailEdit(
                                  values,
                                  instituteOptions,
                                  campusOptions,
                                  programLevelData,
                                  allcourseData,
                                );
                                if (ok) resetInterestedCourseFields();
                              } else {
                                const ok = handleInterestedCourseSubmit(
                                  values,
                                  instituteOptions,
                                  campusOptions,
                                  programLevelData,
                                  allcourseData,
                                );
                                if (ok) resetInterestedCourseFields();
                              }
                            }}
                          >
                            <FaPlus className="plus-button mx-2" /> {edit.interestedCourse ? 'Update' : 'Add'}{' '}
                            Interested Course
                          </Button>
                        </Col>
                      </Row>
                      {formData.interestedCourseDetails && formData.interestedCourseDetails.length > 0 && (
                        <div className="mt-5">
                          <h5>Interested Course</h5>
                          <div className="table-responsive">
                            <Table className="text-nowrap border">
                              <thead>
                                <tr>
                                  <th scope="col">Institute</th>
                                  <th scope="col">Campus</th>
                                  <th scope="col">Program Level</th>
                                  <th scope="col">Course</th>
                                  <th scope="col">Intake Month</th>
                                  <th scope="col">Intake Year</th>
                                  <th scope="col">Remarks</th>
                                  <th scope="col">Accepted By Us</th>
                                  <th scope="col">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {formData?.interestedCourseDetails?.map((item, index) => {
                                  const getInstituteName = (instituteId) => {
                                    if (!instituteId) return 'N/A';
                                    const institute = instituteOptions.find((opt) => opt.value === instituteId);
                                    return institute ? institute.label : `Institute: ${instituteId}`;
                                  };

                                  const getCampusName = (campusId) => {
                                    if (!campusId) return 'N/A';
                                    const campus = campusOptions.find((opt) => opt.value === campusId);
                                    return campus ? campus.label : `Campus: ${campusId}`;
                                  };

                                  const getProgramLevelName = (programLevelId) => {
                                    if (!programLevelId) return 'N/A';
                                    const programLevel = programLevelData.find((pl) => pl._id === programLevelId);
                                    return programLevel ? programLevel.name : `Program Level: ${programLevelId}`;
                                  };

                                  const getCourseName = (courseId) => {
                                    if (!courseId) return 'N/A';
                                    const course = allcourseData.find((c) => c._id === courseId);
                                    return course ? course.programName : `Course: ${courseId}`;
                                  };

                                  // Debug logging removed for cleaner console
                                  return (
                                    <tr key={index}>
                                      <td>
                                        {typeof item?.institute === 'object'
                                          ? item?.institute?.instituteName || 'N/A'
                                          : item?.instituteName || getInstituteName(item?.institute)}
                                      </td>
                                      <td>
                                        {typeof item?.campus === 'object'
                                          ? item?.campus?.campus || 'N/A'
                                          : item?.campusName || getCampusName(item?.campus)}
                                      </td>
                                      <td>
                                        {typeof item?.programLevel === 'object'
                                          ? item?.programLevel?.name || 'N/A'
                                          : item?.programLevelName || getProgramLevelName(item?.programLevel)}
                                      </td>
                                      <td>
                                        {typeof item?.course === 'object'
                                          ? item?.course?.programName || item?.course?.duration || 'N/A'
                                          : item?.courseName || getCourseName(item?.course)}
                                      </td>
                                      <td>{item?.intakeMonth || 'N/A'}</td>
                                      <td>{item?.intakeYear || 'N/A'}</td>
                                      <td>{item?.remarks || 'N/A'}</td>
                                      <td>{item?.acceptedByUs === true ? 'Yes' : 'No' || 'N/A'}</td>
                                      <td>
                                        <div className="d-flex">
                                          <span className="icon-border edit-icon">
                                            <EditIcon
                                              onClick={() => {
                                                setEdit((prev) => ({
                                                  ...prev,
                                                  interestedCourse: true,
                                                  interestedCourseIndex: index,
                                                }));

                                                // fetchAllCourse(item?.institute?._id, item?.campus?._id, item?.programLevel?._id)
                                              }}
                                            />
                                          </span>
                                          <span className="icon-border delete-icon ms-2">
                                            <DeleteIcon onClick={() => handleInterestedCourseDelete(index)} />
                                          </span>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </Table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {!isB2B && (
                  <>
                    <div className="section-wrapper" ref={educationCourseInfoRef}>
                      <h5
                        className="form-heading p-2 d-flex justify-content-between"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowEducationCourseInfo(!showEducationCourseInfo)}
                      >
                        Education & Course Info
                        {showEducationCourseInfo ? <FaChevronUp /> : <FaChevronDown />}
                      </h5>
                      {showEducationCourseInfo && (
                        <div className="section-content mt-4 mb-5">
                          <Row className="mb-3">
                            <Col md={3} className="mt-3">
                              <Form.Label>Course</Form.Label>
                              <Form.Control
                                name="course"
                                as={Form.Control}
                                onChange={(e) => setFieldValue('course', e.target.value)}
                                value={values.course}
                                type="text"
                                className="custom-select-height"
                                placeholder="Enter Course"
                              />
                              <ErrorMessage name="course" component="div" className="text-danger" />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Level</Form.Label>
                              <Form.Control
                                name="level"
                                as={Form.Control}
                                onChange={(e) => setFieldValue('level', e.target.value)}
                                value={values.level}
                                type="text"
                                className="custom-select-height"
                                placeholder="Enter Level"
                              />
                              <ErrorMessage name="level" component="div" className="text-danger" />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Budget</Form.Label>
                              <Form.Control
                                name="budget"
                                as={Form.Control}
                                onChange={(e) => setFieldValue('budget', e.target.value)}
                                value={values.budget}
                                type="text"
                                className="custom-select-height"
                                placeholder="Enter Budget"
                              />
                              <ErrorMessage name="budget" component="div" className="text-danger" />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Intake</Form.Label>
                              <Form.Control
                                name="intake"
                                as={Form.Control}
                                onChange={(e) => setFieldValue('intake', e.target.value)}
                                value={values.intake}
                                type="text"
                                className="custom-select-height"
                                placeholder="Enter Intake"
                              />
                              <ErrorMessage name="intake" component="div" className="text-danger" />
                            </Col>
                          </Row>

                          <Row className="mb-3">
                            <Col md={3} className="mt-3">
                              <Form.Label>English Proficiency</Form.Label>
                              <Form.Control
                                name="english_proficiency"
                                as={Form.Control}
                                onChange={(e) => setFieldValue('english_proficiency', e.target.value)}
                                value={values.english_proficiency}
                                type="text"
                                className="custom-select-height"
                                placeholder="Enter English Proficiency"
                              />
                              <ErrorMessage name="english_proficiency" component="div" className="text-danger" />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Passport</Form.Label>
                              <Form.Control
                                name="passport"
                                as={Form.Control}
                                onChange={(e) => setFieldValue('passport', e.target.value)}
                                value={values.passport}
                                type="text"
                                className="custom-select-height"
                                placeholder="Enter Passport"
                              />
                              <ErrorMessage name="passport" component="div" className="text-danger" />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>How Much in Bank</Form.Label>
                              <Form.Control
                                name="how_much_in_bank"
                                as={Form.Control}
                                onChange={(e) => setFieldValue('how_much_in_bank', e.target.value)}
                                value={values.how_much_in_bank}
                                type="text"
                                className="custom-select-height"
                                placeholder="Enter How Much in Bank"
                              />
                              <ErrorMessage name="how_much_in_bank" component="div" className="text-danger" />
                            </Col>
                          </Row>
                        </div>
                      )}
                    </div>

                    <div className="section-wrapper" ref={familyWorkRef}>
                      <h5
                        className="form-heading p-2 d-flex justify-content-between mb-2"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowFamilyWork(!showFamilyWork)}
                      >
                        Work Experience
                        {showFamilyWork ? <FaChevronUp /> : <FaChevronDown />}
                      </h5>
                      {showFamilyWork && (
                        <div className="section-content mt-4 mb-5">
                          <Row className="mb-3">
                            <Col md={3} className="mt-3">
                              <Form.Label>Relation</Form.Label>
                              <Select
                                name={`family_work[${
                                  edit.familyWork ? edit.familyWorkIndex : index.familyWork
                                }].occupation_father`}
                                options={occupationOptions}
                                value={occupationOptions.find(
                                  (option) =>
                                    option.value ===
                                    values?.family_work[edit.familyWork ? edit.familyWorkIndex : index.familyWork]
                                      ?.occupation_father,
                                )}
                                onChange={(selected) =>
                                  setFieldValue(
                                    `family_work[${
                                      edit.familyWork ? edit.familyWorkIndex : index.familyWork
                                    }].occupation_father`,
                                    selected.value,
                                  )
                                }
                                isClearable
                                isSearchable
                                classNamePrefix="custom-select"
                                placeholder="Select Relation"
                                menuPortalTarget={document.body}
                                styles={{
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                  }),
                                  menu: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                    position: 'absolute',
                                    width: '100%',
                                  }),
                                }}
                              />

                              <ErrorMessage
                                name={`family_work[${
                                  edit.familyWork ? edit.familyWorkIndex : index.familyWork
                                }].occupation_father`}
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Occupation Type</Form.Label>

                              <Select
                                name={`family_work[${
                                  edit.familyWork ? edit.familyWorkIndex : index.familyWork
                                }].occupation`}
                                options={occupationTypeOptions}
                                value={occupationTypeOptions.find(
                                  (option) =>
                                    option.value ===
                                    values.family_work[edit.familyWork ? edit.familyWorkIndex : index.familyWork]
                                      ?.occupation,
                                )}
                                onChange={(selected) =>
                                  setFieldValue(
                                    `family_work[${
                                      edit.familyWork ? edit.familyWorkIndex : index.familyWork
                                    }].occupation`,
                                    selected.value,
                                  )
                                }
                                isClearable
                                isSearchable
                                classNamePrefix="custom-select"
                                placeholder="Select Occupation"
                                menuPortalTarget={document.body}
                                styles={{
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                  }),
                                  menu: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                    position: 'absolute',
                                    width: '100%',
                                  }),
                                }}
                              />

                              <ErrorMessage
                                name={`family_work[${
                                  edit.familyWork ? edit.familyWorkIndex : index.familyWork
                                }].occupation`}
                                component="div"
                                className="text-danger"
                              />
                            </Col>

                            {/* <Col md={3} className="mt-3">
                              <Form.Label>Occupation Mother</Form.Label>
                              <Form.Control
                                name="occupation_mother"
                                as={Form.Control}
                                onChange={(e) =>
                                  setFieldValue(
                                    "occupation_mother",
                                    e.target.value
                                  )
                                }
                                value={values.occupation_mother}
                                type="text"
                                className="custom-select-height"
                              />
                              <ErrorMessage
                                name="occupation_mother"
                                component="div"
                                className="text-danger"
                              />
                            </Col> */}
                            <Col md={3} className="mt-3">
                              <Form.Label>Work Experience</Form.Label>
                              <Form.Control
                                name={`family_work[${
                                  edit.familyWork ? edit.familyWorkIndex : index.familyWork
                                }].work_experience`}
                                as={Form.Control}
                                onChange={(e) =>
                                  setFieldValue(
                                    `family_work[${
                                      edit.familyWork ? edit.familyWorkIndex : index.familyWork
                                    }].work_experience`,
                                    e.target.value,
                                  )
                                }
                                value={
                                  values.family_work[edit.familyWork ? edit.familyWorkIndex : index.familyWork]
                                    ?.work_experience || ''
                                }
                                type="text"
                                className="custom-select-height"
                                placeholder="Enter Work Experience"
                              />
                              <ErrorMessage
                                name={`family_work[${
                                  edit.familyWork ? edit.familyWorkIndex : index.familyWork
                                }].work_experience`}
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Work Post</Form.Label>
                              <Form.Control
                                name={`family_work[${
                                  edit.familyWork ? edit.familyWorkIndex : index.familyWork
                                }].work_post`}
                                as={Form.Control}
                                onChange={(e) =>
                                  setFieldValue(
                                    `family_work[${
                                      edit.familyWork ? edit.familyWorkIndex : index.familyWork
                                    }].work_post`,
                                    e.target.value,
                                  )
                                }
                                value={
                                  values.family_work[edit.familyWork ? edit.familyWorkIndex : index.familyWork]
                                    ?.work_post || ''
                                }
                                type="text"
                                className="custom-select-height"
                                placeholder="Enter Work Post"
                              />
                              <ErrorMessage
                                name={`family_work[${
                                  edit.familyWork ? edit.familyWorkIndex : index.familyWork
                                }].work_post`}
                                component="div"
                                className="text-danger"
                              />
                            </Col>

                            <Col md={3} className="mt-3">
                              <Form.Label>Work Year</Form.Label>
                              <Form.Control
                                name={`family_work[${
                                  edit.familyWork ? edit.familyWorkIndex : index.familyWork
                                }].work_year`}
                                as={Form.Control}
                                onChange={(e) =>
                                  setFieldValue(
                                    `family_work[${
                                      edit.familyWork ? edit.familyWorkIndex : index.familyWork
                                    }].work_year`,
                                    e.target.value,
                                  )
                                }
                                value={
                                  values.family_work[edit.familyWork ? edit.familyWorkIndex : index.familyWork]
                                    ?.work_year || ''
                                }
                                type="number"
                                className="custom-select-height"
                                placeholder="Enter Work Year"
                              />
                              <ErrorMessage
                                name={`family_work[${
                                  edit.familyWork ? edit.familyWorkIndex : index.familyWork
                                }].work_year`}
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col md={{ span: 3, offset: 9 }} className="mt-3">
                              <Button
                                type="button"
                                className="w-100 custom-select-height text-white"
                                style={{ backgroundColor: '#3b3665' }}
                                onClick={() => {
                                  if (edit.familyWork) {
                                    handleFamilyWorkDetailEdit(values);
                                  } else {
                                    handleFamilyWorkSubmit(values);
                                  }
                                }}
                              >
                                <FaPlus className="plus-button mx-2" /> {edit.familyWork ? 'Update' : 'Add'} Family Work
                              </Button>
                            </Col>
                          </Row>
                          {formData.family_work && formData.family_work.length > 0 && (
                            <div className="mt-5">
                              <h5>Family Work Data:</h5>
                              <div className="table-responsive">
                                <Table className="text-nowrap border">
                                  <thead>
                                    <tr>
                                      <th scope="col">NO.</th>
                                      <th scope="col">Relation</th>
                                      <th scope="col">Occupation</th>
                                      <th scope="col">Work Experience</th>
                                      <th scope="col">Work Post</th>
                                      <th scope="col">Work Year</th>
                                      <th scope="col">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {formData?.family_work?.map((data, i) => (
                                      <tr key={i} className="custom-table-row">
                                        <td>{i + 1}</td>
                                        <td>{data?.occupation_father || 'N/A'}</td>
                                        <td>{data?.occupation || 'N/A'}</td>
                                        <td>{data?.work_experience || 'N/A'}</td>
                                        <td>{data?.work_post || 'N/A'}</td>
                                        <td>{data?.work_year || 'N/A'}</td>
                                        <td>
                                          <div className="d-flex">
                                            <span className="icon-border edit-icon">
                                              <EditIcon
                                                onClick={() =>
                                                  setEdit((prev) => ({
                                                    ...prev,
                                                    familyWork: true,
                                                    familyWorkIndex: i || 0,
                                                  }))
                                                }
                                              />
                                            </span>
                                            <span className="icon-border delete-icon ms-2">
                                              <DeleteIcon onClick={() => handleFamilyWorkDelete(i)} />
                                            </span>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="section-wrapper" ref={visaInfoRef}>
                      <h5
                        className="form-heading p-2 d-flex justify-content-between mb-2"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowVisaInfo(!showVisaInfo)}
                      >
                        Visa Info
                        {showVisaInfo ? <FaChevronUp /> : <FaChevronDown />}
                      </h5>
                      {showVisaInfo && (
                        <div className="section-content mt-4 mb-5">
                          <Row className="mb-3">
                            <Col md={3} className="mt-3">
                              <Form.Label>Visited Countries</Form.Label>
                              <Select
                                name={`visa_info[${
                                  edit.visaInfo ? edit.visaInfoIndex : index.visaInfo
                                }].visited_countries`}
                                options={countries?.map((c) => ({
                                  value: c.name,
                                  label: c.name,
                                }))}
                                isClearable
                                isSearchable
                                classNamePrefix="custom-select"
                                placeholder="Select visited countries"
                                onChange={(selectedOptions) =>
                                  setFieldValue(
                                    `visa_info[${
                                      edit.visaInfo ? edit.visaInfoIndex : index.visaInfo
                                    }].visited_countries`,
                                    selectedOptions ? selectedOptions.value : '',
                                  )
                                }
                                value={
                                  values.visa_info[edit.visaInfo ? edit.visaInfoIndex : index.visaInfo]
                                    ?.visited_countries
                                    ? {
                                        value:
                                          values.visa_info[edit.visaInfo ? edit.visaInfoIndex : index.visaInfo]
                                            ?.visited_countries,
                                        label:
                                          values.visa_info[edit.visaInfo ? edit.visaInfoIndex : index.visaInfo]
                                            ?.visited_countries,
                                      }
                                    : null
                                }
                                menuPortalTarget={document.body}
                                styles={{
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                  }),
                                  menu: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                    position: 'absolute',
                                    width: '100%',
                                  }),
                                }}
                              />
                              <ErrorMessage
                                name={`visa_info[${
                                  edit.visaInfo ? edit.visaInfoIndex : index.visaInfo
                                }].visited_countries`}
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Visit Count</Form.Label>
                              <Form.Control
                                name={`visa_info[${edit.visaInfo ? edit.visaInfoIndex : index.visaInfo}].visit_count`}
                                as={Form.Control}
                                onChange={(e) =>
                                  setFieldValue(
                                    `visa_info[${edit.visaInfo ? edit.visaInfoIndex : index.visaInfo}].visit_count`,
                                    e.target.value,
                                  )
                                }
                                value={
                                  values.visa_info[edit.visaInfo ? edit.visaInfoIndex : index.visaInfo]?.visit_count ||
                                  ''
                                }
                                type="number"
                                className="custom-select-height"
                                placeholder="Enter Visit Count"
                              />
                              <ErrorMessage
                                name={`visa_info[${edit.visaInfo ? edit.visaInfoIndex : index.visaInfo}].visit_count`}
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Visa Type</Form.Label>
                              <Form.Control
                                name={`visa_info[${edit.visaInfo ? edit.visaInfoIndex : index.visaInfo}].visa_type`}
                                as={Form.Control}
                                onChange={(e) =>
                                  setFieldValue(
                                    `visa_info[${edit.visaInfo ? edit.visaInfoIndex : index.visaInfo}].visa_type`,
                                    e.target.value,
                                  )
                                }
                                value={
                                  values.visa_info[edit.visaInfo ? edit.visaInfoIndex : index.visaInfo]?.visa_type || ''
                                }
                                type="text"
                                className="custom-select-height"
                                placeholder="Enter Visa Type"
                              />
                              <ErrorMessage
                                name={`visa_info[${edit.visaInfo ? edit.visaInfoIndex : index.visaInfo}].visa_type`}
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Visa Refused</Form.Label>
                              <div className="d-flex gap-3">
                                {/* YES */}
                                <Form.Check
                                  type="radio"
                                  name={`visa_info[${
                                    edit.visaInfo ? edit.visaInfoIndex : index.visaInfo
                                  }].visa_refused`}
                                  id="visa_refusedYes"
                                  label="Yes"
                                  value="true"
                                  onChange={() =>
                                    setFieldValue(
                                      `visa_info[${edit.visaInfo ? edit.visaInfoIndex : index.visaInfo}].visa_refused`,
                                      true,
                                    )
                                  }
                                  checked={
                                    values.visa_info[edit.visaInfo ? edit.visaInfoIndex : index.visaInfo]
                                      ?.visa_refused === true
                                  }
                                />

                                {/* NO */}
                                <Form.Check
                                  type="radio"
                                  name={`visa_info[${
                                    edit.visaInfo ? edit.visaInfoIndex : index.visaInfo
                                  }].visa_refused`}
                                  id="visa_refusedNo"
                                  label="No"
                                  value="false"
                                  onChange={() => {
                                    setFieldValue(
                                      `visa_info[${edit.visaInfo ? edit.visaInfoIndex : index.visaInfo}].visa_refused`,
                                      false,
                                    );
                                    // Optional: auto-clear refusal details
                                    setFieldValue(
                                      `visa_info[${
                                        edit.visaInfo ? edit.visaInfoIndex : index.visaInfo
                                      }].refused_country`,
                                      '',
                                    );
                                    setFieldValue(
                                      `visa_info[${edit.visaInfo ? edit.visaInfoIndex : index.visaInfo}].refused_times`,
                                      '',
                                    );
                                    setFieldValue(
                                      `visa_info[${edit.visaInfo ? edit.visaInfoIndex : index.visaInfo}].refused_years`,
                                      [],
                                    );
                                    setFieldValue(
                                      `visa_info[${
                                        edit.visaInfo ? edit.visaInfoIndex : index.visaInfo
                                      }].refused_visa_type`,
                                      '',
                                    );
                                  }}
                                  checked={
                                    values.visa_info[edit.visaInfo ? edit.visaInfoIndex : index.visaInfo]
                                      ?.visa_refused === false
                                  }
                                />
                              </div>
                            </Col>
                          </Row>
                          {values.visa_info[edit.visaInfo ? edit.visaInfoIndex : index.visaInfo]?.visa_refused ===
                            true && (
                            <Row className="mb-3">
                              <Col md={3} className="mt-3">
                                <Form.Label>Refused Country</Form.Label>
                                <Form.Control
                                  name={`visa_info[${
                                    edit.visaInfo ? edit.visaInfoIndex : index.visaInfo
                                  }].refused_country`}
                                  as={Form.Control}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `visa_info[${
                                        edit.visaInfo ? edit.visaInfoIndex : index.visaInfo
                                      }].refused_country`,
                                      e.target.value,
                                    )
                                  }
                                  value={
                                    values.visa_info[edit.visaInfo ? edit.visaInfoIndex : index.visaInfo]
                                      ?.refused_country || ''
                                  }
                                  type="text"
                                  className="custom-select-height"
                                  placeholder="Enter Refused Country"
                                />
                                <ErrorMessage
                                  name={`visa_info[${
                                    edit.visaInfo ? edit.visaInfoIndex : index.visaInfo
                                  }].refused_country`}
                                  component="div"
                                  className="text-danger"
                                />
                              </Col>
                              <Col md={3} className="mt-3">
                                <Form.Label>Refused Times</Form.Label>
                                <Form.Control
                                  name={`visa_info[${
                                    edit.visaInfo ? edit.visaInfoIndex : index.visaInfo
                                  }].refused_times`}
                                  as={Form.Control}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `visa_info[${edit.visaInfo ? edit.visaInfoIndex : index.visaInfo}].refused_times`,
                                      e.target.value,
                                    )
                                  }
                                  value={
                                    values.visa_info[edit.visaInfo ? edit.visaInfoIndex : index.visaInfo]
                                      ?.refused_times || ''
                                  }
                                  type="number"
                                  className="custom-select-height"
                                  placeholder="Enter Refused Times"
                                />
                                {/* <ErrorMessage
                                    name={`visa_info[${edit.visaInfo
                                        ? edit.visaInfoIndex
                                        : index.visaInfo
                                      }].refused_times`}
                                    component="div"
                                    className="text-danger"
                                  /> */}
                              </Col>
                              <Col md={3} className="mt-3">
                                <Form.Label>Refused Years</Form.Label>
                                <Form.Control
                                  name={`visa_info[${
                                    edit.visaInfo ? edit.visaInfoIndex : index.visaInfo
                                  }].refused_years`}
                                  as={Form.Control}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `visa_info[${edit.visaInfo ? edit.visaInfoIndex : index.visaInfo}].refused_years`,
                                      e.target.value.split(','),
                                    )
                                  }
                                  value={
                                    values.visa_info[edit.visaInfo ? edit.visaInfoIndex : index.visaInfo]
                                      ?.refused_years || ''
                                  }
                                  type="text"
                                  className="custom-select-height"
                                  placeholder="e.g., 2020, 2022"
                                />
                                <ErrorMessage
                                  name={`visa_info[${
                                    edit.visaInfo ? edit.visaInfoIndex : index.visaInfo
                                  }].refused_years`}
                                  component="div"
                                  className="text-danger"
                                />
                              </Col>
                              <Col md={3} className="mt-3">
                                <Form.Label>Refused Visa Type</Form.Label>
                                <Form.Control
                                  name={`visa_info[${
                                    edit.visaInfo ? edit.visaInfoIndex : index.visaInfo
                                  }].refused_visa_type`}
                                  as={Form.Control}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `visa_info[${
                                        edit.visaInfo ? edit.visaInfoIndex : index.visaInfo
                                      }].refused_visa_type`,
                                      e.target.value,
                                    )
                                  }
                                  value={
                                    values.visa_info[edit.visaInfo ? edit.visaInfoIndex : index.visaInfo]
                                      ?.refused_visa_type || ''
                                  }
                                  type="text"
                                  className="custom-select-height"
                                  placeholder="Enter Refused Visa Type"
                                />
                                <ErrorMessage
                                  name={`visa_info[${
                                    edit.visaInfo ? edit.visaInfoIndex : index.visaInfo
                                  }].refused_visa_type`}
                                  component="div"
                                  className="text-danger"
                                />
                              </Col>
                            </Row>
                          )}
                          <Row className="mt-3">
                            <Col md={{ span: 3, offset: 9 }} className="mt-auto">
                              <Button
                                type="button"
                                className="w-100 custom-select-height text-white"
                                style={{ backgroundColor: '#3b3665' }}
                                onClick={() => {
                                  if (edit.visaInfo) {
                                    handleVisaInfoEdit(values);
                                  } else {
                                    handleVisaInfoSubmit(values);
                                  }
                                }}
                              >
                                <FaPlus className="plus-button mx-2" /> {edit.visaInfo ? 'Update' : 'Add'} Visa Info
                              </Button>
                            </Col>
                          </Row>
                          {formData.visa_info && formData.visa_info.length > 0 && (
                            <div className="mt-5">
                              <h5>Visa Info:</h5>
                              <div className="table-responsive">
                                <Table className="text-nowrap border">
                                  <thead>
                                    <tr>
                                      <th scope="col">NO.</th>
                                      <th scope="col">Visited Country</th>
                                      <th scope="col">Visit Count</th>
                                      <th scope="col">Visa Type</th>
                                      <th scope="col">Visa Refused</th>
                                      <th scope="col">Refused Country</th>
                                      <th scope="col">Refused Times</th>
                                      <th scope="col">Refused Years</th>
                                      <th scope="col">Refused Visa Type</th>
                                      <th scope="col">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {formData?.visa_info?.map((data, i) => (
                                      <tr key={i} className="custom-table-row">
                                        <td>{i + 1}</td>
                                        <td>{data?.visited_countries || 'N/A'}</td>
                                        <td>{data?.visit_count || 'N/A'}</td>
                                        <td>{data?.visa_type || 'N/A'}</td>
                                        <td>{data?.visa_refused === true ? 'Yes' : 'No' || 'N/A'}</td>
                                        <td>{data?.refused_country || 'N/A'}</td>
                                        <td>{data?.refused_times || 'N/A'}</td>
                                        <td>{data?.refused_years || 'N/A'}</td>
                                        <td>{data?.refused_visa_type || 'N/A'}</td>
                                        <td>
                                          <div className="d-flex">
                                            <span className="icon-border edit-icon">
                                              <EditIcon
                                                onClick={() =>
                                                  setEdit((prev) => ({
                                                    ...prev,
                                                    visaInfo: true,
                                                    visaInfoIndex: i || 0,
                                                  }))
                                                }
                                              />
                                            </span>
                                            <span className="icon-border delete-icon ms-2">
                                              <DeleteIcon onClick={() => handleVisaInfoDelete(i)} />
                                            </span>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="section-wrapper" ref={educationEvaluationRef}>
                      <h5
                        className="form-heading p-2 d-flex justify-content-between mb-3"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowEducationEvaluation(!showEducationEvaluation)}
                      >
                        Education Evaluation
                        <div className="d-flex gap-3">
                          {showEducationEvaluation ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                      </h5>
                      {showEducationEvaluation && (
                        <div className="section-content mt-4 mb-5">
                          <Row className="mb-3">
                            <Col md={3} className="mt-3">
                              <Form.Label>Select Exam</Form.Label>
                              <Select
                                className="custom-select-height"
                                options={examOptions}
                                value={
                                  examOptions.find(
                                    (option) =>
                                      option.value ===
                                      values.education_evaluation[
                                        edit.educationEvaluation
                                          ? edit.educationEvaluationIndex
                                          : index.educationEvaluation
                                      ]?.test_name,
                                  ) || null
                                }
                                onChange={(selectedOption) =>
                                  setFieldValue(
                                    `education_evaluation[${
                                      edit.educationEvaluation
                                        ? edit.educationEvaluationIndex
                                        : index.educationEvaluation
                                    }].test_name`,
                                    selectedOption ? selectedOption.value : '',
                                  )
                                }
                                placeholder="Select Exam"
                                isClearable
                                isSearchable
                                classNamePrefix="custom-select"
                                menuPortalTarget={document.body}
                                noOptionsMessage={() => 'No exam options available'}
                                styles={selectStyles}
                              />
                              <ErrorMessage
                                name={`education_evaluation[${
                                  edit.educationEvaluation ? edit.educationEvaluationIndex : index.educationEvaluation
                                }].test_name`}
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Listening Score</Form.Label>
                              <Form.Control
                                type="number"
                                as={Form.Control}
                                name={`education_evaluation[${
                                  edit.educationEvaluation ? edit.educationEvaluationIndex : index.educationEvaluation
                                }].scores.listen`}
                                onChange={(e) =>
                                  setFieldValue(
                                    `education_evaluation[${
                                      edit.educationEvaluation
                                        ? edit.educationEvaluationIndex
                                        : index.educationEvaluation
                                    }].scores.listen`,
                                    e.target.value,
                                  )
                                }
                                value={
                                  values.education_evaluation[
                                    edit.educationEvaluation ? edit.educationEvaluationIndex : index.educationEvaluation
                                  ]?.scores?.listen || ''
                                }
                                className="custom-select-height"
                                placeholder="Enter Listening Score"
                              />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Reading Score</Form.Label>
                              <Form.Control
                                type="number"
                                as={Form.Control}
                                name={`education_evaluation[${
                                  edit.educationEvaluation ? edit.educationEvaluationIndex : index.educationEvaluation
                                }].scores.read`}
                                onChange={(e) =>
                                  setFieldValue(
                                    `education_evaluation[${
                                      edit.educationEvaluation
                                        ? edit.educationEvaluationIndex
                                        : index.educationEvaluation
                                    }].scores.read`,
                                    e.target.value,
                                  )
                                }
                                value={
                                  values.education_evaluation[
                                    edit.educationEvaluation ? edit.educationEvaluationIndex : index.educationEvaluation
                                  ]?.scores?.read || ''
                                }
                                className="custom-select-height"
                                placeholder="Enter Reading Score"
                              />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Writing Score</Form.Label>
                              <Form.Control
                                type="number"
                                as={Form.Control}
                                name={`education_evaluation[${
                                  edit.educationEvaluation ? edit.educationEvaluationIndex : index.educationEvaluation
                                }].scores.write`}
                                onChange={(e) =>
                                  setFieldValue(
                                    `education_evaluation[${
                                      edit.educationEvaluation
                                        ? edit.educationEvaluationIndex
                                        : index.educationEvaluation
                                    }].scores.write`,
                                    e.target.value,
                                  )
                                }
                                value={
                                  values.education_evaluation[
                                    edit.educationEvaluation ? edit.educationEvaluationIndex : index.educationEvaluation
                                  ]?.scores?.write || ''
                                }
                                className="custom-select-height"
                                placeholder="Enter Writing Score"
                              />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Speaking Score</Form.Label>
                              <Form.Control
                                type="number"
                                as={Form.Control}
                                name={`education_evaluation[${
                                  edit.educationEvaluation ? edit.educationEvaluationIndex : index.educationEvaluation
                                }].scores.speak`}
                                onChange={(e) =>
                                  setFieldValue(
                                    `education_evaluation[${
                                      edit.educationEvaluation
                                        ? edit.educationEvaluationIndex
                                        : index.educationEvaluation
                                    }].scores.speak`,
                                    e.target.value,
                                  )
                                }
                                value={
                                  values.education_evaluation[
                                    edit.educationEvaluation ? edit.educationEvaluationIndex : index.educationEvaluation
                                  ]?.scores?.speak || ''
                                }
                                className="custom-select-height"
                                placeholder="Enter Speaking Score"
                              />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Overall Score</Form.Label>
                              <Form.Control
                                type="number"
                                as={Form.Control}
                                name={`education_evaluation[${
                                  edit.educationEvaluation ? edit.educationEvaluationIndex : index.educationEvaluation
                                }].scores.overall`}
                                onChange={(e) =>
                                  setFieldValue(
                                    `education_evaluation[${
                                      edit.educationEvaluation
                                        ? edit.educationEvaluationIndex
                                        : index.educationEvaluation
                                    }].scores.overall`,
                                    e.target.value,
                                  )
                                }
                                value={
                                  values.education_evaluation[
                                    edit.educationEvaluation ? edit.educationEvaluationIndex : index.educationEvaluation
                                  ]?.scores?.overall || ''
                                }
                                className="custom-select-height"
                                placeholder="Enter Overall Score"
                              />
                            </Col>
                            {values?.education_evaluation[
                              edit.educationEvaluation ? edit.educationEvaluationIndex : index.educationEvaluation
                            ]?.test_name === 'P.T.E.' && (
                              <Col md={3} className="mt-3">
                                <Form.Label>DUOLINGO Score</Form.Label>
                                <Form.Control
                                  type="number"
                                  as={Form.Control}
                                  name={`education_evaluation[${
                                    edit.educationEvaluation ? edit.educationEvaluationIndex : index.educationEvaluation
                                  }].scores.duolingoScore`}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `education_evaluation[${
                                        edit.educationEvaluation
                                          ? edit.educationEvaluationIndex
                                          : index.educationEvaluation
                                      }].scores.duolingoScore`,
                                      e.target.value,
                                    )
                                  }
                                  value={
                                    values.education_evaluation[
                                      edit.educationEvaluation
                                        ? edit.educationEvaluationIndex
                                        : index.educationEvaluation
                                    ]?.scores?.duolingoScore || ''
                                  }
                                  className="custom-select-height"
                                />
                              </Col>
                            )}
                            <Col md={3} className="mt-auto">
                              <Button
                                type="button"
                                className="w-100 custom-select-height text-white"
                                style={{ backgroundColor: '#3b3665' }}
                                onClick={() => {
                                  if (edit.educationEvaluation) {
                                    handleEditEvaluation(values);
                                  } else {
                                    handleEducationSubmit(values);
                                  }
                                }}
                              >
                                <FaPlus className="plus-button mx-2" />
                                {edit.educationEvaluation ? 'Update' : 'Add'} Education Evaluation
                              </Button>
                            </Col>
                            {formData?.education_evaluation?.length > 0 && (
                              <div className="mt-5">
                                <h5>Education Evaluation Data :</h5>
                                <div className="table-responsive">
                                  <Table className="text-nowrap border">
                                    <thead>
                                      <tr>
                                        <th scope="col">NO.</th>
                                        <th scope="col">Test Name</th>
                                        <th scope="col">Listening</th>
                                        <th scope="col">Reading</th>
                                        <th scope="col">Writing</th>
                                        <th scope="col">Speaking</th>
                                        <th scope="col">Overall</th>
                                        <th scope="col">DUOLINGO</th>
                                        <th scope="col">Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {formData?.education_evaluation?.map((data, i) => (
                                        <tr key={i} className="custom-table-row">
                                          <td>{i + 1}</td>
                                          <td>{data?.test_name || 'N/A'}</td>
                                          <td>{data?.scores?.listen || 'N/A'}</td>
                                          <td>{data?.scores?.read || 'N/A'}</td>
                                          <td>{data?.scores?.write || 'N/A'}</td>
                                          <td>{data?.scores?.speak || 'N/A'}</td>
                                          <td>{data?.scores?.overall || 'N/A'}</td>
                                          <td>{data?.scores?.duolingoScore || 'N/A'}</td>
                                          <td>
                                            <div className="d-flex">
                                              <span className="icon-border edit-icon">
                                                <EditIcon
                                                  onClick={() =>
                                                    setEdit((prev) => ({
                                                      ...prev,
                                                      educationEvaluation: true,
                                                      educationEvaluationIndex: i || 0,
                                                    }))
                                                  }
                                                />
                                              </span>
                                              <span className="icon-border delete-icon ms-2">
                                                <DeleteIcon onClick={() => handleDeleteEvaluation(i)} />
                                              </span>
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </Table>
                                </div>
                              </div>
                            )}
                          </Row>
                        </div>
                      )}
                    </div>

                    <div className="section-wrapper" ref={educationDetailsRef}>
                      <h5
                        className="form-heading p-2 d-flex justify-content-between mb-3"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowEducationDetails(!showEducationDetails)}
                      >
                        Education Details
                        <div className="d-flex gap-3">{showEducationDetails ? <FaChevronUp /> : <FaChevronDown />}</div>
                      </h5>
                      {showEducationDetails && (
                        <div className="section-content mt-4 mb-5">
                          <Row className="mb-3">
                            <Col md={3} className="mt-3">
                              <Form.Label>Select Degree</Form.Label>
                              <Select
                                className="custom-select-height"
                                options={degreeOptions}
                                value={
                                  degreeOptions.find(
                                    (option) =>
                                      option.value ===
                                      values.education_details[
                                        edit.educationDetails ? edit.educationDetailsIndex : index.educationDetails
                                      ]?.degree,
                                  ) || null
                                }
                                onChange={(selectedOption) =>
                                  setFieldValue(
                                    `education_details[${
                                      edit.educationDetails ? edit.educationDetailsIndex : index.educationDetails
                                    }].degree`,
                                    selectedOption ? selectedOption.value : '',
                                  )
                                }
                                placeholder="Select Degree"
                                isClearable
                                isSearchable
                                classNamePrefix="custom-select"
                                menuPortalTarget={document.body}
                                noOptionsMessage={() => 'No degree options available'}
                                styles={selectStyles}
                              />
                              <ErrorMessage
                                name={`education_details[${
                                  edit.educationDetails ? edit.educationDetailsIndex : index.educationDetails
                                }].degree`}
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Stream</Form.Label>
                              <Form.Control
                                type="text"
                                as={Form.Control}
                                name={`education_details[${
                                  edit.educationDetails ? edit.educationDetailsIndex : index.educationDetails
                                }].stream`}
                                onChange={(e) =>
                                  setFieldValue(
                                    `education_details[${
                                      edit.educationDetails ? edit.educationDetailsIndex : index.educationDetails
                                    }].stream`,
                                    e.target.value,
                                  )
                                }
                                value={
                                  values.education_details[
                                    edit.educationDetails ? edit.educationDetailsIndex : index.educationDetails
                                  ]?.stream || ''
                                }
                                className="custom-select-height"
                                placeholder="Enter Stream"
                              />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Medium of Instruction (MOI)</Form.Label>
                              <Form.Control
                                type="text"
                                as={Form.Control}
                                name={`education_details[${
                                  edit.educationDetails ? edit.educationDetailsIndex : index.educationDetails
                                }].moi`}
                                onChange={(e) =>
                                  setFieldValue(
                                    `education_details[${
                                      edit.educationDetails ? edit.educationDetailsIndex : index.educationDetails
                                    }].moi`,
                                    e.target.value,
                                  )
                                }
                                value={
                                  values.education_details[
                                    edit.educationDetails ? edit.educationDetailsIndex : index.educationDetails
                                  ]?.moi || ''
                                }
                                className="custom-select-height"
                                placeholder="Enter Medium of Instruction"
                              />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Year</Form.Label>
                              <Form.Control
                                type="number"
                                as={Form.Control}
                                name={`education_details[${
                                  edit.educationDetails ? edit.educationDetailsIndex : index.educationDetails
                                }].year`}
                                onChange={(e) =>
                                  setFieldValue(
                                    `education_details[${
                                      edit.educationDetails ? edit.educationDetailsIndex : index.educationDetails
                                    }].year`,
                                    e.target.value,
                                  )
                                }
                                value={
                                  values.education_details[
                                    edit.educationDetails ? edit.educationDetailsIndex : index.educationDetails
                                  ]?.year || ''
                                }
                                className="custom-select-height"
                                placeholder="Enter Year"
                              />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Score</Form.Label>
                              <Form.Control
                                type="text"
                                as={Form.Control}
                                name={`education_details[${
                                  edit.educationDetails ? edit.educationDetailsIndex : index.educationDetails
                                }].score`}
                                onChange={(e) =>
                                  setFieldValue(
                                    `education_details[${
                                      edit.educationDetails ? edit.educationDetailsIndex : index.educationDetails
                                    }].score`,
                                    e.target.value,
                                  )
                                }
                                value={
                                  values.education_details[
                                    edit.educationDetails ? edit.educationDetailsIndex : index.educationDetails
                                  ]?.score || ''
                                }
                                className="custom-select-height"
                                placeholder="Enter Score"
                              />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Institution</Form.Label>
                              <Form.Control
                                type="text"
                                as={Form.Control}
                                name={`education_details[${
                                  edit.educationDetails ? edit.educationDetailsIndex : index.educationDetails
                                }].institution`}
                                onChange={(e) =>
                                  setFieldValue(
                                    `education_details[${
                                      edit.educationDetails ? edit.educationDetailsIndex : index.educationDetails
                                    }].institution`,
                                    e.target.value,
                                  )
                                }
                                value={
                                  values.education_details[
                                    edit.educationDetails ? edit.educationDetailsIndex : index.educationDetails
                                  ]?.institution || ''
                                }
                                className="custom-select-height"
                                placeholder="Enter Institution"
                              />
                            </Col>
                            {values?.education_details[
                              edit.educationDetails ? edit.educationDetailsIndex : index.educationDetails
                            ]?.degree === "BACHELOR'S" && (
                              <Col md={3} className="mt-3">
                                <Form.Label>Backlogs</Form.Label>
                                <Form.Control
                                  type="number"
                                  as={Form.Control}
                                  name={`education_details[${
                                    edit.educationDetails ? edit.educationDetailsIndex : index.educationDetails
                                  }].backlogs`}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `education_details[${
                                        edit.educationDetails ? edit.educationDetailsIndex : index.educationDetails
                                      }].backlogs`,
                                      e.target.value,
                                    )
                                  }
                                  value={
                                    values.education_details[
                                      edit.educationDetails ? edit.educationDetailsIndex : index.educationDetails
                                    ]?.backlogs || ''
                                  }
                                  className="custom-select-height"
                                />
                              </Col>
                            )}
                            <Col md={3} className="mt-auto">
                              <Button
                                type="button"
                                className="w-100 custom-select-height text-white"
                                style={{ backgroundColor: '#3b3665' }}
                                onClick={() => {
                                  if (edit.educationEvaluation) {
                                    handleEducationDetailedit(values);
                                  } else {
                                    handleEducatiDetailonSubmit(values);
                                  }
                                }}
                              >
                                <FaPlus className="plus-button mx-2" /> Add Education Details
                              </Button>
                            </Col>
                          </Row>
                          {formData?.education_details?.length > 0 && (
                            <div className="mt-5">
                              <h5>Education Evaluation Data:</h5>
                              <div className="table-responsive">
                                <Table className="text-nowrap border">
                                  <thead>
                                    <tr>
                                      <th scope="col">NO.</th>
                                      <th scope="col">Degree</th>
                                      <th scope="col">Stream</th>
                                      <th scope="col">MOI</th>
                                      <th scope="col">Year</th>
                                      <th scope="col">Score</th>
                                      <th scope="col">Institution</th>
                                      <th scope="col">Backlogs</th>
                                      <th scope="col">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {formData?.education_details?.map((data, i) => (
                                      <tr key={i} className="custom-table-row">
                                        <td>{i + 1}</td>
                                        <td>{data?.degree || 'N/A'}</td>
                                        <td>{data?.institution || 'N/A'}</td>
                                        <td>{data?.year || 'N/A'}</td>
                                        <td>{data?.stream || 'N/A'}</td>
                                        <td>{data?.score || 'N/A'}</td>
                                        <td>{data?.institution || 'N/A'}</td>
                                        <td>{data?.backlogs || 'N/A'}</td>
                                        <td>
                                          <div className="d-flex">
                                            <span className="icon-border edit-icon">
                                              <EditIcon
                                                onClick={() =>
                                                  setEdit((prev) => ({
                                                    ...prev,
                                                    educationDetails: true,
                                                    educationDetailsIndex: i || 0,
                                                  }))
                                                }
                                              />
                                            </span>
                                            <span className="icon-border delete-icon ms-2">
                                              <DeleteIcon onClick={() => handleDeleteEvaluationDetail(i)} />
                                            </span>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="section-wrapper" ref={referFriendRef}>
                      <h5
                        className="form-heading p-2 d-flex justify-content-between mb-3"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowReferFriend(!showReferFriend)}
                      >
                        Refer a Friend
                        {showReferFriend ? <FaChevronUp /> : <FaChevronDown />}
                      </h5>
                      {showReferFriend && (
                        <div className="section-content mt-4 mb-5">
                          <Row className="mb-3">
                            <Col md={3} className="mt-3">
                              <Form.Label>Friend Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="refer_friend.name"
                                value={values.refer_friend?.name || ''}
                                onChange={(e) => setFieldValue('refer_friend.name', e.target.value)}
                                className="custom-select-height"
                                placeholder="Enter Friend Name"
                              />
                              <ErrorMessage name="refer_friend.name" component="div" className="text-danger" />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Friend Phone</Form.Label>
                              <PhoneInput
                                country={countryCodeISO()}
                                value={values.refer_friend?.phone || ''}
                                onChange={(phone, data) => {
                                  const dialCode = data.dialCode ? `+${data.dialCode}` : '';
                                  const formattedPhone = `${dialCode} ${phone.replace(data.dialCode, '')}`.trim();
                                  setFieldValue('refer_friend.phone', formattedPhone);
                                }}
                                // disableCountryGuess={true}
                                inputProps={{
                                  name: 'phone',
                                  required: true,
                                  className: 'form-control custom-select-height',
                                }}
                                inputStyle={{
                                  width: '100%',
                                  paddingLeft: '65px',
                                  borderRadius: '4px',
                                }}
                                buttonStyle={{
                                  marginRight: '10px',
                                }}
                              />
                              <ErrorMessage name="refer_friend.phone" component="div" className="text-danger" />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Friend Email</Form.Label>
                              <Form.Control
                                type="email"
                                name="refer_friend.email"
                                value={values.refer_friend?.email || ''}
                                onChange={(e) => setFieldValue('refer_friend.email', e.target.value)}
                                className="custom-select-height"
                                placeholder="Enter Friend Email"
                              />
                              <ErrorMessage name="refer_friend.email" component="div" className="text-danger" />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Suggested Countries</Form.Label>
                              <Form.Control
                                type="text"
                                name="refer_friend.suggested_countries"
                                value={values.refer_friend?.suggested_countries || ''}
                                onChange={(e) => setFieldValue('refer_friend.suggested_countries', e.target.value)}
                                className="custom-select-height"
                                placeholder="Comma-separated"
                              />
                              <ErrorMessage
                                name="refer_friend.suggested_countries"
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Suggested Courses</Form.Label>
                              <Form.Control
                                type="text"
                                name="refer_friend.courses"
                                value={values.refer_friend?.courses || ''}
                                onChange={(e) => setFieldValue('refer_friend.courses', e.target.value)}
                                className="custom-select-height"
                                placeholder="Comma-separated"
                              />
                              <ErrorMessage name="refer_friend.courses" component="div" className="text-danger" />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Response</Form.Label>
                              <Form.Control
                                type="text"
                                name="refer_friend.response"
                                value={values.refer_friend?.response || ''}
                                onChange={(e) => setFieldValue('refer_friend.response', e.target.value)}
                                className="custom-select-height"
                                placeholder="Enter Response"
                              />
                              <ErrorMessage name="refer_friend.response" component="div" className="text-danger" />
                            </Col>
                          </Row>
                        </div>
                      )}
                    </div>

                    <div className="section-wrapper" ref={reviewsRef}>
                      <h5
                        className="form-heading p-2 d-flex justify-content-between mb-3"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowReviews(!showReviews)}
                      >
                        Reviews
                        {showReviews ? <FaChevronUp /> : <FaChevronDown />}
                      </h5>

                      {showReviews && (
                        <div className="section-content mt-4 mb-5">
                          <Row className="mb-3">
                            <Col md={3} className="mt-3">
                              <Form.Label>Reception Greetings</Form.Label>
                              <Select
                                className="custom-select-height"
                                options={reviewOptions}
                                value={
                                  reviewOptions.find(
                                    (option) => option.value === values.reviews?.reception_greetings,
                                  ) || null
                                }
                                onChange={(selectedOption) =>
                                  setFieldValue(
                                    'reviews.reception_greetings',
                                    selectedOption ? selectedOption.value : '',
                                  )
                                }
                                placeholder="Select"
                                isClearable
                                isSearchable
                                classNamePrefix="custom-select"
                                menuPortalTarget={document.body}
                                noOptionsMessage={() => 'No reception greetings options available'}
                                styles={selectStyles}
                              />
                              <ErrorMessage
                                name="reviews.reception_greetings"
                                component="div"
                                className="text-danger"
                              />
                            </Col>

                            <Col md={3} className="mt-3">
                              <Form.Label>Counsellor Explanation</Form.Label>
                              <Select
                                className="custom-select-height"
                                options={reviewOptions}
                                value={
                                  reviewOptions.find(
                                    (option) => option.value === values.reviews?.counsellor_explanation,
                                  ) || null
                                }
                                onChange={(selectedOption) =>
                                  setFieldValue(
                                    'reviews.counsellor_explanation',
                                    selectedOption ? selectedOption.value : '',
                                  )
                                }
                                placeholder="Select"
                                isClearable
                                isSearchable
                                classNamePrefix="custom-select"
                                menuPortalTarget={document.body}
                                noOptionsMessage={() => 'No counsellor explanation options available'}
                                styles={selectStyles}
                              />
                              <ErrorMessage
                                name="reviews.counsellor_explanation"
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Hospitality</Form.Label>
                              <Select
                                className="custom-select-height"
                                options={reviewOptions}
                                value={
                                  reviewOptions.find((option) => option.value === values.reviews?.hospitality) || null
                                }
                                onChange={(selectedOption) =>
                                  setFieldValue('reviews.hospitality', selectedOption ? selectedOption.value : '')
                                }
                                placeholder="Select"
                                isClearable
                                isSearchable
                                classNamePrefix="custom-select"
                                menuPortalTarget={document.body}
                                noOptionsMessage={() => 'No hospitality options available'}
                                styles={selectStyles}
                              />
                              <ErrorMessage name="reviews.hospitality" component="div" className="text-danger" />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Hygiene & Cleanliness</Form.Label>
                              <Select
                                className="custom-select-height"
                                options={reviewOptions}
                                value={
                                  reviewOptions.find(
                                    (option) => option.value === values.reviews?.hygiene_cleanliness,
                                  ) || null
                                }
                                onChange={(selectedOption) =>
                                  setFieldValue(
                                    'reviews.hygiene_cleanliness',
                                    selectedOption ? selectedOption.value : '',
                                  )
                                }
                                placeholder="Select"
                                isClearable
                                isSearchable
                                classNamePrefix="custom-select"
                                menuPortalTarget={document.body}
                                noOptionsMessage={() => 'No hygiene & cleanliness options available'}
                                styles={selectStyles}
                              />
                              <ErrorMessage
                                name="reviews.hygiene_cleanliness"
                                component="div"
                                className="text-danger"
                              />
                            </Col>
                            <Col md={3} className="mt-3">
                              <Form.Label>Team Response</Form.Label>
                              <Select
                                className="custom-select-height"
                                options={reviewOptions}
                                value={
                                  reviewOptions.find((option) => option.value === values.reviews?.team_response) || null
                                }
                                onChange={(selectedOption) =>
                                  setFieldValue('reviews.team_response', selectedOption ? selectedOption.value : '')
                                }
                                placeholder="Select"
                                isClearable
                                isSearchable
                                classNamePrefix="custom-select"
                                menuPortalTarget={document.body}
                                noOptionsMessage={() => 'No team response options available'}
                                styles={selectStyles}
                              />
                              <ErrorMessage name="reviews.team_response" component="div" className="text-danger" />
                            </Col>
                          </Row>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {isEdit && (
                  <div className="mt-4 mb-4 section-wrapper">
                    <h5
                      className="form-heading p-2 d-flex justify-content-between mt-4 mb-3"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setShowHistory(!showHistory)}
                    >
                      History
                      {showHistory ? <FaChevronUp /> : <FaChevronDown />}
                    </h5>
                    {showHistory && (
                      <div className="table-responsive lead-table">
                        <Table className="text-nowrap border">
                          <thead>
                            <tr>
                              <th scope="col">Created Date</th>
                              <th scope="col">Time</th>
                              <th scope="col">Name</th>
                              <th scope="col">Phone</th>
                              <th scope="col">City</th>
                              <th scope="col">Lead Form</th>
                              <th scope="col">Lead Assign</th>
                              <th scope="col">Remarks</th>
                              <th scope="col">Lead Text Remark</th>
                            </tr>
                          </thead>
                          <tbody>
                            {editHistoryData?.length > 0 ? (
                              editHistoryData?.map((item, index) => (
                                <tr key={index}>
                                  <td className="fw-semibold">
                                    {new Date(item.createdAt).toLocaleDateString(`en-GB`, {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      timeZone: 'UTC',
                                    })}
                                  </td>
                                  <td className="fw-semibold">{formatTime(new Date(item.createdAt))}</td>
                                  <td>{item?.name ? item?.name : '-'}</td>
                                  <td>{item?.phone ? item?.phone : '-'}</td>
                                  <td>{item?.city ? item?.city : '-'}</td>
                                  <td>{item?.lead_form ? item?.lead_form : '-'}</td>
                                  <td>{item?.lead_assign ? item?.lead_assign?.name : '-'}</td>
                                  <td>{item?.remarks ? item?.remarks : '-'}</td>
                                  <td>{item?.lead_text_remark ? item?.lead_text_remark : '-'}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="8" className="text-center">
                                  No Data Found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}
                <div className="text-end mt-4">
                  <Button variant="primary" className="custom-select-height" type="submit">
                    {isEdit ? 'Update' : 'Add'}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
        {isB2B && isEdit && (
          <div className="form-modal-chat p-1 bg-primary mt-3">
            <ChatComponent
              studentId={studentId}
              senderId={senderId}
              role={userRole}
              studentData={studentData}
              handleChatClose={handleChatClose}
              isB2B={true}
            />
          </div>
        )}
        {/* {isB2B && isEdit && (
          <div className="form-modal-chat p-1 bg-primary mt-3">
            <B2bChatComponent
              studentId={studentId}
              senderId={senderId}
              role={userRole}
              studentData={studentData}
              handleChatClose={handleChatClose}
            />
          </div>
        )} */}
      </Modal.Body>
    </Modal>
  );
};

export default FormModal;
