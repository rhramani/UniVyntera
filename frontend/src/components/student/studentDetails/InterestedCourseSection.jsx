import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import DataTable from "../../commonComponents/DataTable";
import usePermissions from "../../commonComponents/usePermissions";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { decryptData } from "../../../utils/encryptionUtils";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  getAllInstitute,
  instituteWiseCampusDropdown,
  instituteWiseProgramLevelDropdown,
} from "../../../redux/actions/Master/Institute.action";
import { useDispatch } from "react-redux";
import { getAllCourseFinder } from "../../../redux/actions/CourseFinder.action";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAllInterestedCourseStatus } from "../../../redux/actions/Master/InterestedCourseStatus.action";
import LoadMoreButton from "../../commonComponents/LoadMoreButton";
import { toast } from "react-toastify";
import {
  deleteStudentApplication,
  updateStudentApplication,
} from "../../../redux/actions/Student/StudentApplication.action";
import { getAllApplicationType } from "../../../redux/actions/Master/ApplicationType.action";

const interestedCourseValidationSchema = Yup.object({
  institute: Yup.string().required("Institute is required"),
  course: Yup.string().required("Course is required"),
  campus: Yup.string().required("Campus is required"),
  programLevel: Yup.string().required("Program Level is required"),
  applicationType: Yup.string().required("Application type is required"),
  intakeMonth: Yup.string(),
  intakeYear: Yup.string(),
  status: Yup.string(),
  remarks: Yup.string(),
});

const InterestedCourseSection = ({
  formData,
  edit,
  setEdit,
  id,
  oneStudentData,
  filterState,
  setFormData,
  fetchOneStudentDetails,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [allcourseData, setAllCourseData] = useState([]);
  const [instituteData, setInstituteData] = useState([]);
  const [programLevelData, setProgramLevelData] = useState([]);
  const [showCounsellingModal, setShowCounsellingModal] = useState(false);
  const [interestedCourseStatus, setInterestedCourseStatus] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [campusData, setCampusData] = useState([]);
  const [applicationTypes, setApplicationTypes] = useState([]);
  const { canRead, canUpdate, canCreate, canDelete } = usePermissions(
    "Student Applications",
    "Course Selection"
  );

  const interestedCourseStatusOptions = interestedCourseStatus?.map((item) => ({
    value: item.name,
    label: item.name,
  }));

  const userRole = decryptData(localStorage.getItem("role"));
  const userType = decryptData(localStorage.getItem("userRole"));
  const restrictedRoles = [
    "B2B Admin",
    "B2B Member",
    "Branch",
    "Branch Member",
    "Branch User",
  ];

  const interestedCourseFormik = useFormik({
    initialValues: {
      interestedCourseDetails: [
        {
          institute: "",
          course: "",
          campus: "",
          programLevel: "",
          // portalDetails:{
          applicationType: "",
          // },
          intakeMonth: "",
          intakeYear: "",
          status: "New",
          remarks: "",
        },
      ],
    },
    validationSchema: Yup.object({
      interestedCourseDetails: Yup.array().of(interestedCourseValidationSchema),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: (values) => {
      if (edit.interestedCourseDetails) {
        handleEditInterestedCourse(values);
      } else {
        handleInterestedCourseSubmit(values);
      }
    },
  });
  const fetchAllInstitute = async (country) => {
    try {
      const response = await dispatch(getAllInstitute(1, 5000, "", country));
      const responseData = response?.data?.data;
      setInstituteData(responseData?.data || []);
    } catch (error) {
      console.error("Error fetching institutes:", error);
      setInstituteData([]);
      toast.dismiss();
    }
  };
  const fetchAllCourse = async (institute, campus, programLevel) => {
    try {
      const res = await dispatch(
        getAllCourseFinder(1, 1000, { institute, campus, programLevel })
      );

      if (res?.status === 200) {
        const programNames =
          res?.data?.data?.data
            ?.filter((item) => item.status === "Active")
            ?.map((item) => ({
              _id: item._id,
              programName: item.programName,
              intakeMonths:
                item.intakes
                  ?.filter((intake) => intake?.status === "Active")
                  ?.map((intake) => intake.month) || [],
              intakeYears: item.intakeYear || [],
            })) || [];
        const uniqueProgramNames = [...new Set(programNames)];
        setAllCourseData(uniqueProgramNames);
      } else {
        console.error("Error fetching courses:", res?.data?.message);
        setAllCourseData([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setAllCourseData([]);
    }
  };
  const onInstituteSelect = (campus) => {
    const instituteId =
      interestedCourseFormik.values.interestedCourseDetails[0].institute || "";
    if (instituteId) {
      fetchAllCourse(instituteId, campus); // Pass instituteId instead of country
    } else {
      fetchAllCourse(undefined, campus);
    }
  };
  useEffect(() => {
    const preferredCountries =
      oneStudentData?.purposeDetails?.preferredCountry || [];
    if (preferredCountries.length > 0) {
      // fetchAllCourse(preferredCountries[0]);
      fetchAllInstitute(preferredCountries[0]);
    } else {
      // fetchAllCourse();
      fetchAllInstitute();
    }
  }, [oneStudentData?.purposeDetails?.preferredCountry]);

  const handleInterestedCourseSubmit = async (values) => {
    setIsLoading(true);
    const currentIndex = 0;
    const newCourse = {
      ...values.interestedCourseDetails[currentIndex],
      programLevel: values.interestedCourseDetails[currentIndex].programLevel,
      portalDetails: {
        applicationType:
          values.interestedCourseDetails[currentIndex].applicationType,
      },
      status: "New",
    };

    const errors = await interestedCourseFormik.validateForm();
    if (
      errors.interestedCourseDetails?.[0]?.institute ||
      errors.interestedCourseDetails?.[0]?.course
    ) {
      interestedCourseFormik.setTouched({
        interestedCourseDetails: [{ institute: true, course: true }],
      });
      toast.error("Please fill all required fields.");
      return;
    }

    if (
      !newCourse ||
      Object.values(newCourse).every(
        (val) => !val || val.toString().trim() === ""
      )
    ) {
      toast.error("Please fill at least one field before submitting.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        interestedCourseDetails: [newCourse],
      };
      const res = await dispatch(updateStudentApplication(payload, id));
      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("Interested course added successfully");
        setFormData((prev) => ({
          ...prev,
          interestedCourseDetails: [
            ...prev.interestedCourseDetails,
            res.data.data.interestedCourseDetails?.[0],
          ],
        }));
        interestedCourseFormik.resetForm();
        setShowCounsellingModal(false);
        fetchOneStudentDetails();
      } else {
        toast.error(res?.data?.message || "Error adding interested course");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error adding interested course"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplicationTypes = async () => {
    try {
      const res = await dispatch(getAllApplicationType(1, 10000, ""));
      const responseData = res?.data?.data?.data || [];
      setApplicationTypes(responseData);
    } catch (error) {
      console.error("Error fetching application types:", error);
      setApplicationTypes([]);
    }
  };

  useEffect(() => {
    fetchApplicationTypes();
  }, []);

  const applicationTypeOptions = applicationTypes
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((type) => ({
      value: type._id,
      label: type.name,
    }));

  const handleEditInterestedCourse = async (values) => {
    setIsLoading(true);
    const updatedIndex = edit.interestedCourseIndex;
    const updatedEntry = values.interestedCourseDetails[0];
    const courseId = formData.interestedCourseDetails[updatedIndex]?._id;

    if (!courseId) {
      toast.error("Invalid course ID. Cannot update.");
      setIsLoading(false);
      return;
    }

    const errors = await interestedCourseFormik.validateForm();
    if (
      errors.interestedCourseDetails?.[0]?.institute ||
      errors.interestedCourseDetails?.[0]?.course ||
      errors.interestedCourseDetails?.[0]?.campus
    ) {
      interestedCourseFormik.setTouched({
        interestedCourseDetails: [{ institute: true, course: true }],
      });
      toast.error("Please fill all required fields.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        interestedCourseId: courseId,
        interestedCourseUpdate: {
          institute: updatedEntry.institute,
          course: updatedEntry.course,
          campus: updatedEntry.campus,
          programLevel: updatedEntry.programLevel,
          portalDetails: {
            applicationType: updatedEntry.applicationType,
          },
          intakeMonth: updatedEntry.intakeMonth,
          intakeYear: updatedEntry.intakeYear,
          status: updatedEntry.status || "New",
          remarks: updatedEntry.remarks,
        },
      };
      const res = await dispatch(updateStudentApplication(payload, id));

      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("Interested course updated successfully");
        setFormData((prev) => {
          const updatedData = [...prev.interestedCourseDetails];
          updatedData[updatedIndex] = {
            ...updatedData[updatedIndex],
            ...res.data.data.interestedCourseDetails[0],
          };
          return { ...prev, interestedCourseDetails: updatedData };
        });
        setEdit((prev) => ({
          ...prev,
          interestedCourseDetails: false,
          interestedCourseIndex: 0,
        }));
        setShowCounsellingModal(false);
        interestedCourseFormik.resetForm();
        fetchOneStudentDetails();
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
  const handleDeleteInterestedCourse = async (indexToDelete) => {
    const interestedCourseId =
      formData.interestedCourseDetails[indexToDelete]?._id;

    if (!interestedCourseId) {
      toast.error("Invalid course detail. Cannot delete.");
      return;
    }
    const payload = { interestedCourseId };
    try {
      const res = await dispatch(deleteStudentApplication(payload, id));
      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("Interested course deleted successfully");
        setFormData((prev) => ({
          ...prev,
          interestedCourseDetails: prev.interestedCourseDetails.filter(
            (_, i) => i !== indexToDelete
          ),
        }));
        if (
          edit.interestedCourseDetails &&
          edit.interestedCourseIndex === indexToDelete
        ) {
          setEdit((prev) => ({
            ...prev,
            interestedCourseDetails: false,
            interestedCourseIndex: 0,
          }));
        }
        fetchOneStudentDetails();
      } else {
        toast.error(res?.data?.message || "Error deleting interested course");
      }
    } catch (error) {
      console.error("Error deleting interested course:", error);
      toast.error(
        error?.response?.data?.message || "Error deleting interested course"
      );
    }
  };

  const shouldShowEdit = !restrictedRoles.includes(userRole || userType);

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
      setProgramLevelData([]);
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

    const campusId =
      interestedCourseFormik.values.interestedCourseDetails[0].campus;
    const programLevelId =
      interestedCourseFormik.values.interestedCourseDetails[0].programLevel;
    // fetch courses only when we have institute + campus + programLevel
    if (instituteId && campusId) {
      fetchAllCourse(instituteId, campusId, programLevelId);
    }
    // const campusId =
    //   interestedCourseFormik.values.interestedCourseDetails[0].campus;
    // if (instituteId && campusId) {
    //   getAllCourseFinder(instituteId, campusId); // Call fetchAllCourse with instituteId
    //   if (onInstituteSelect) {
    //     onInstituteSelect(campusId);
    //   }
    // }
  }, [
    interestedCourseFormik.values.interestedCourseDetails[0].institute,
    interestedCourseFormik.values.interestedCourseDetails[0].campus,
    interestedCourseFormik.values.interestedCourseDetails[0].programLevel,
    showCounsellingModal,
  ]);
  const fetchInterestedCourseStatuses = async () => {
    try {
      const res = await dispatch(getAllInterestedCourseStatus(""));
      if (res?.status === 200) {
        setInterestedCourseStatus(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching student statuses:", error);
    }
  };
  useEffect(() => {
    fetchInterestedCourseStatuses();

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

  const handleEdit = (item) => {
    const values = {
      interestedCourseDetails: [
        {
          institute: item.institute?._id || "",
          course: item.course?._id || "",
          intakeMonth: item.intakeMonth || "",
          intakeYear: item.intakeYear || "",
          portalDetails: {
            applicationType: item.applicationType || "",
          },
          status: item.status || "New",
          remarks: item.remarks || "",
          campus: item.campus?._id || "",
        },
      ],
    };
    interestedCourseFormik.setValues(values);
    setEdit((prev) => ({
      ...prev,
      interestedCourseDetails: true,
      interestedCourseIndex: formData.interestedCourseDetails.indexOf(item),
    }));
    navigate(`/interested-application/${id}`, {
      state: {
        instituteData,
        formData,
        interestedCourseFormikValues: values,
        edit: {
          interestedCourseDetails: true,
          interestedCourseIndex: formData.interestedCourseDetails.indexOf(item),
        },
        showCounsellingModal,
        interestedCourseStatus,
        allcourseData,
        id,
        oneStudentData,
        // Pass filter state from StudentDetails
        filterState: filterState,
      },
    });
  };

  const handleEditModal = (item) => {
    const values = {
      interestedCourseDetails: [
        {
          institute: item.institute?._id || "",
          course: item.course?._id || "",
          intakeMonth: item.intakeMonth || "",
          intakeYear: item.intakeYear || "",
          // portalDetails:{
          applicationType: item.portalDetails.applicationType?._id || "",
          // },
          status: item.status || "New",
          remarks: item.remarks || "",
          campus: item.campus?._id || "",
          programLevel: item.programLevel?._id || "",
        },
      ],
    };
    interestedCourseFormik.setValues(values);
    setEdit((prev) => ({
      ...prev,
      interestedCourseDetails: true,
      interestedCourseIndex: formData.interestedCourseDetails.indexOf(item),
    }));
    setShowCounsellingModal(true);
  };

  const handleDelete = (item) => {
    const index = formData.interestedCourseDetails.indexOf(item);
    handleDeleteInterestedCourse(index);
    setShowDeleteModal(false);
    setSelectedItem(null);
  };

  const interestedCourse = [
    {
      label: "Application Id",
      render: (item) => {
        const isClickable = !(
          userRole === "B2B Admin" || userRole === "Branch"
        );

        return (
          <span
            className="text-primary"
            style={{
              cursor: userRole === "Student" || userRole === "LeadStudent" ? "" : "pointer",
            }}
            onClick={() => {
              if (userRole !== "Student" && userRole !== "LeadStudent") {
                handleEdit(item);
                setOpenDropdown(null);
              }
            }}
          >
            {item ? item?.applicationId : "-"}
          </span>
        );
      },
    },
    {
      label: "Institute",
      render: (item) => (item ? item.institute?.instituteName : "-"),
    },
    {
      label: "Campus",
      render: (item) => (item ? item.campus?.campus : "-"),
    },
    {
      label: "Program Level",
      render: (item) => {
        if (!item?.programLevel) return "-";
        const level = programLevelData.find(
          (pl) => pl._id === item.programLevel
        );
        return level ? level.name : "-";
      },
    },
    {
      label: "Course",
      render: (item) => (item ? item.course?.programName : "-"),
    },
    {
      label: "Intake Month",
      render: (item) => (item ? item.intakeMonth : "-"),
    },
    {
      label: "Intake Year",
      render: (item) => (item ? item.intakeYear : "-"),
    },
    {
      label: "Status",
      render: (item) => {
        const statusInfo = interestedCourseStatus.find(
          (status) => status.name === item.status
        );
        const backgroundColor = statusInfo ? statusInfo.color : "#6c757d";
        return (
          <span
            className={`d-flex justify-content-center align-items-center p-1 gap-2 rounded-4`}
            style={{
              minWidth: "40px",
              color: "white",
              backgroundColor: backgroundColor || "#053880",
            }}
          >
            {item?.status || "New"}
          </span>
        );
      },
    },
    {
      label: "Remarks",
      render: (item) => (item ? item.remarks || "-" : "-"),
    },
    ...( userRole !== "LeadStudent" && userRole !== "Student"
      ? [
          {
            label: "Application Type",
            render: (item) => {
              if (!item?.portalDetails.applicationType) return "-";

              const appType = applicationTypeOptions.find(
                (opt) => opt.value === item.portalDetails.applicationType?._id
              );

              return appType ? appType.label : "-";
            },
          },
        ]
      : []),
    {
      label: "Created by",
      render: (item) => (item ? item.createdByName || "-" : "-"),
    },
    {
      label: "Updated by",
      render: (item) => (item ? item.updatedByName || "-" : "-"),
    },
  ];

  const renderActions = (item, index, onEdit) => (
    <div className="d-flex align-items-center">
      <IconButton
        aria-label="more"
        aria-controls={`menu-${index}`}
        aria-haspopup="true"
        onClick={(e) => {
          setOpenDropdown(openDropdown === index ? null : index);
          setAnchorEl(e.currentTarget);
        }}
      >
        <MoreVertIcon className="three-dots-icon" />
      </IconButton>
      <Menu
        id={`menu-${index}`}
        anchorEl={anchorEl}
        open={openDropdown === index}
        onClose={() => setOpenDropdown(null)}
        MenuListProps={{
          "aria-labelledby": `menu-${index}`,
        }}
        sx={{
          "& .MuiPaper-root": {
            minWidth: "150px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        {shouldShowEdit && canUpdate && (
          <MenuItem
            onClick={() => {
              if (onEdit) {
                onEdit(item);
              }
              setOpenDropdown(null);
            }}
          >
            <EditNoteIcon
              fontSize="small"
              sx={{ mr: 1 }}
              className="convert-icon"
            />
            <span className="convert-action-text">Application Edit</span>
          </MenuItem>
        )}
        {restrictedRoles.includes(userRole || userType) && canRead && (
          <MenuItem
            onClick={() => {
              handleEdit(item);
              setOpenDropdown(null);
            }}
          >
            <VisibilityIcon
              fontSize="small"
              sx={{ mr: 1 }}
              className="view-icon"
            />
            <span className="view-action-text">View</span>
          </MenuItem>
        )}
        {canUpdate && (

          <MenuItem
          onClick={() => {
            handleEditModal(item);
            setOpenDropdown(null);
          }}
          >
          <EditIcon fontSize="small" sx={{ mr: 1 }} className="edit-icon" />
          <span className="edit-action-text">Edit</span>
        </MenuItem>
        )}
        {canDelete && (
          <MenuItem
          onClick={() => {
            setSelectedItem(item);
            setShowDeleteModal(true);
            setOpenDropdown(null);
          }}
          >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} className="delete-icon" />
          <span className="delete-action-text">Delete</span>
        </MenuItem>
        )}
      </Menu>
    </div>
  );

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
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Interested Course</h5>
          {userRole !== "Student" && userRole !== "LeadStudent" && canCreate && (
            <Button
              variant="primary"
              className="custom-select-height"
              onClick={() => {
                interestedCourseFormik.resetForm();
                setEdit((prev) => ({
                  ...prev,
                  interestedCourseDetails: false,
                  interestedCourseIndex: 0,
                }));
                setShowCounsellingModal(true);
              }}
            >
              Add New
            </Button>
          )}
        </div>
        <DataTable
          columns={interestedCourse}
          renderActions={(item, index) =>
            renderActions(item, index, shouldShowEdit ? handleEdit : null)
          }
          data={canRead ? formData.interestedCourseDetails || [] : []}
          currentPage={1}
          totalPages={1}
          itemsPerPage={10}
          showEditButton={shouldShowEdit}
          showNoColumn={false}
          onEdit={shouldShowEdit ? handleEdit : false}
          onDelete={(item) => {
            setSelectedItem(item);
            setShowDeleteModal(true);
          }}
          canEdit={canUpdate}
          canDelete={canDelete}
          canRead={canRead}
        />
      </div>

      <Modal
        show={showCounsellingModal}
        onHide={() => {
          setShowCounsellingModal(false);
          interestedCourseFormik.resetForm();
          setEdit((prev) => ({
            ...prev,
            interestedCourseDetails: false,
            interestedCourseIndex: 0,
          }));
        }}
        size="lg"
        centered
      >
        <Modal.Header className="form-main-heading">
          <Modal.Title>
            {edit.interestedCourseDetails
              ? "Update Interested Course"
              : "Add Interested Course"}
          </Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={() => {
              setShowCounsellingModal(false);
              interestedCourseFormik.resetForm();
              setEdit((prev) => ({
                ...prev,
                interestedCourseDetails: false,
                interestedCourseIndex: 0,
              }));
            }}
          />
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={interestedCourseFormik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Institute</Form.Label>
                <Select
                  name="interestedCourseDetails[0].institute"
                  className="custom-select-height"
                  options={instituteOptions}
                  value={
                    interestedCourseFormik.values.interestedCourseDetails[0]
                      .institute
                      ? instituteOptions?.find(
                          (option) =>
                            option.value ===
                            interestedCourseFormik.values
                              .interestedCourseDetails[0].institute
                        )
                      : null
                  }
                  onChange={(selectedOption) => {
                    interestedCourseFormik.setFieldValue(
                      "interestedCourseDetails[0].institute",
                      selectedOption ? selectedOption.value : ""
                    );
                    interestedCourseFormik.setFieldValue(
                      "interestedCourseDetails[0].campus",
                      ""
                    );
                    interestedCourseFormik.setFieldValue(
                      "interestedCourseDetails[0].course",
                      ""
                    );
                    const preferredCountry =
                      oneStudentData?.purposeDetails?.preferredCountry?.[0] ||
                      "";
                    fetchAllCampusByInstitute(
                      selectedOption ? selectedOption.label : "",
                      preferredCountry
                    );
                    if (selectedOption) {
                      getAllCourseFinder(selectedOption.value, ""); // Fetch courses for the selected institute
                    }
                  }}
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
                  placeholder="Select Institute"
                  isClearable
                />
                {interestedCourseFormik.errors.interestedCourseDetails?.[0]
                  ?.institute &&
                  interestedCourseFormik.touched.interestedCourseDetails?.[0]
                    ?.institute && (
                    <div
                      className="text-danger"
                      style={{ fontSize: "12px", marginTop: "5px" }}
                    >
                      {
                        interestedCourseFormik.errors.interestedCourseDetails[0]
                          .institute
                      }
                    </div>
                  )}
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Campus</Form.Label>
                <Select
                  name="interestedCourseDetails[0].campus"
                  className="custom-select-height"
                  options={Array.from(
                    new Map(
                      campusData?.map((campus) => [campus.campus, campus])
                    ).values()
                  )
                    ?.sort((a, b) => a.campus.localeCompare(b.campus))
                    ?.map((campus) => ({
                      label: campus.campus,
                      value: campus._id,
                    }))}
                  value={
                    interestedCourseFormik.values.interestedCourseDetails[0]
                      .campus
                      ? campusData
                          ?.map((campus) => ({
                            label: campus.campus,
                            value: campus._id,
                          }))
                          ?.find(
                            (option) =>
                              option.value ===
                              interestedCourseFormik.values
                                .interestedCourseDetails[0].campus
                          )
                      : null
                  }
                  onChange={(selectedOption) => {
                    interestedCourseFormik.setFieldValue(
                      "interestedCourseDetails[0].campus",
                      selectedOption ? selectedOption.value : ""
                    );
                    // interestedCourseFormik.setFieldTouched(
                    //   "interestedCourseDetails[0].campus",
                    //   true
                    // );
                    interestedCourseFormik.setFieldValue(
                      "interestedCourseDetails[0].course",
                      ""
                    );
                    if (onInstituteSelect) {
                      onInstituteSelect(
                        selectedOption ? selectedOption.value : ""
                      );
                    }
                  }}
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
                  placeholder="Select Campus"
                  isClearable
                />
                {interestedCourseFormik.errors.interestedCourseDetails?.[0]
                  ?.campus &&
                  interestedCourseFormik.touched.interestedCourseDetails?.[0]
                    ?.campus && (
                    <div
                      className="text-danger"
                      style={{ fontSize: "12px", marginTop: "5px" }}
                    >
                      {
                        interestedCourseFormik.errors.interestedCourseDetails[0]
                          .campus
                      }
                    </div>
                  )}
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>Program Level *</Form.Label>
                <Select
                  name="interestedCourseDetails[0].programLevel"
                  className="custom-select-height"
                  options={programLevelData
                    .sort((a, b) => a.name?.localeCompare(b.name))
                    .map((programLevel) => ({
                      label: programLevel.name,
                      value: programLevel._id,
                    }))}
                  value={programLevelData
                    .map((programLevel) => ({
                      label: programLevel.name,
                      value: programLevel._id,
                    }))
                    .find(
                      (opt) =>
                        opt.value ===
                        interestedCourseFormik.values.interestedCourseDetails[0]
                          .programLevel
                    )}
                  onChange={(sel) => {
                    interestedCourseFormik.setFieldValue(
                      "interestedCourseDetails[0].programLevel",
                      sel ? sel.value : ""
                    );
                    interestedCourseFormik.setFieldValue(
                      "interestedCourseDetails[0].course",
                      ""
                    );
                  }}
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
                  placeholder="Select Program Level"
                  isClearable
                />
                {interestedCourseFormik.errors.interestedCourseDetails?.[0]
                  ?.programLevel &&
                  interestedCourseFormik.touched.interestedCourseDetails?.[0]
                    ?.programLevel && (
                    <div
                      className="text-danger"
                      style={{ fontSize: "12px", marginTop: "5px" }}
                    >
                      {
                        interestedCourseFormik.errors.interestedCourseDetails[0]
                          .programLevel
                      }
                    </div>
                  )}
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>Course</Form.Label>
                <Select
                  name="interestedCourseDetails[0].course"
                  className="custom-select-height"
                  options={Array.from(
                    new Map(
                      allcourseData?.map((course) => [
                        course.programName,
                        course,
                      ])
                    ).values()
                  )
                    ?.sort((a, b) => a.programName.localeCompare(b.programName))
                    ?.map((course) => ({
                      label: course.programName,
                      value: course._id,
                    }))}
                  value={
                    interestedCourseFormik.values.interestedCourseDetails[0]
                      .course
                      ? allcourseData
                          ?.map((course) => ({
                            label: course.programName,
                            value: course._id,
                          }))
                          ?.find(
                            (option) =>
                              option.value ===
                              interestedCourseFormik.values
                                .interestedCourseDetails[0].course
                          )
                      : null
                  }
                  onChange={(selectedOption) => {
                    interestedCourseFormik.setFieldValue(
                      "interestedCourseDetails[0].course",
                      selectedOption ? selectedOption.value : ""
                    );
                    // interestedCourseFormik.setFieldTouched(
                    //   "interestedCourseDetails[0].course",
                    //   true
                    // );
                  }}
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
                  placeholder="Select Course"
                  isClearable
                />
                {interestedCourseFormik.errors.interestedCourseDetails?.[0]
                  ?.course &&
                  interestedCourseFormik.touched.interestedCourseDetails?.[0]
                    ?.course && (
                    <div
                      className="text-danger"
                      style={{ fontSize: "12px", marginTop: "5px" }}
                    >
                      {
                        interestedCourseFormik.errors.interestedCourseDetails[0]
                          .course
                      }
                    </div>
                  )}
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Intake Month</Form.Label>
                <Select
                  name="interestedCourseDetails[0].intakeMonth"
                  className="custom-select-height"
                  options={
                    allcourseData
                      .find(
                        (course) =>
                          course._id ===
                          interestedCourseFormik.values
                            .interestedCourseDetails?.[0]?.course
                      )
                      ?.intakeMonths?.map((month) => ({
                        value: month,
                        label: month,
                      })) || []
                  }
                  value={
                    interestedCourseFormik.values.interestedCourseDetails[0]
                      .intakeMonth
                      ? {
                          value:
                            interestedCourseFormik.values
                              .interestedCourseDetails[0].intakeMonth,
                          label:
                            interestedCourseFormik.values
                              .interestedCourseDetails[0].intakeMonth,
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    interestedCourseFormik.setFieldValue(
                      "interestedCourseDetails[0].intakeMonth",
                      selectedOption ? selectedOption.value : ""
                    );
                    interestedCourseFormik.setFieldTouched(
                      "interestedCourseDetails[0].intakeMonth",
                      true
                    );
                  }}
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
                  placeholder="Select Intake Month"
                  isClearable
                />
                {interestedCourseFormik.errors.interestedCourseDetails?.[0]
                  ?.intakeMonth &&
                  interestedCourseFormik.touched.interestedCourseDetails?.[0]
                    ?.intakeMonth && (
                    <div
                      className="text-danger"
                      style={{ fontSize: "12px", marginTop: "5px" }}
                    >
                      {
                        interestedCourseFormik.errors.interestedCourseDetails[0]
                          .intakeMonth
                      }
                    </div>
                  )}
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Intake Year</Form.Label>
                <Select
                  name="interestedCourseDetails[0].intakeYear"
                  className="custom-select-height"
                  options={
                    allcourseData
                      .find(
                        (course) =>
                          course._id ===
                          interestedCourseFormik.values
                            .interestedCourseDetails?.[0]?.course
                      )
                      ?.intakeYears?.map((year) => ({
                        value: year,
                        label: year,
                      })) || []
                  }
                  value={
                    interestedCourseFormik.values.interestedCourseDetails[0]
                      .intakeYear
                      ? {
                          value:
                            interestedCourseFormik.values
                              .interestedCourseDetails[0].intakeYear,
                          label:
                            interestedCourseFormik.values
                              .interestedCourseDetails[0].intakeYear,
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    interestedCourseFormik.setFieldValue(
                      "interestedCourseDetails[0].intakeYear",
                      selectedOption ? selectedOption.value : ""
                    );
                    interestedCourseFormik.setFieldTouched(
                      "interestedCourseDetails[0].intakeYear",
                      true
                    );
                  }}
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
                  placeholder="Select Intake Year"
                  isClearable
                />
                {interestedCourseFormik.errors.interestedCourseDetails?.[0]
                  ?.intakeYear &&
                  interestedCourseFormik.touched.interestedCourseDetails?.[0]
                    ?.intakeYear && (
                    <div
                      className="text-danger"
                      style={{ fontSize: "12px", marginTop: "5px" }}
                    >
                      {
                        interestedCourseFormik.errors.interestedCourseDetails[0]
                          .intakeYear
                      }
                    </div>
                  )}
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  type="text"
                  name="interestedCourseDetails[0].remarks"
                  className="custom-select-height"
                  placeholder="Enter Remarks"
                  value={
                    interestedCourseFormik.values.interestedCourseDetails[0]
                      .remarks || ""
                  }
                  onChange={interestedCourseFormik.handleChange}
                  onBlur={interestedCourseFormik.handleBlur}
                />
              </Col>
              {userRole !== "Student" && userRole !== "LeadStudent" && (
                <Col md={6} className="mb-3">
                  <Form.Label>Application Type</Form.Label>

                  <Select
                    name="interestedCourseDetails[0].applicationType"
                    className="custom-select-height"
                    options={applicationTypeOptions}
                    value={
                      interestedCourseFormik.values.interestedCourseDetails[0]
                        .applicationType
                        ? applicationTypeOptions.find(
                            (option) =>
                              option.value ===
                              interestedCourseFormik.values
                                .interestedCourseDetails[0].applicationType
                          )
                        : null
                    }
                    onChange={(selectedOption) => {
                      interestedCourseFormik.setFieldValue(
                        "interestedCourseDetails[0].applicationType",
                        selectedOption ? selectedOption.value : ""
                      );
                    }}
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
                    placeholder="Select Application Type"
                    isClearable
                  />
                  {interestedCourseFormik.errors.interestedCourseDetails?.[0]
                    ?.applicationType &&
                    interestedCourseFormik.touched.interestedCourseDetails?.[0]
                      ?.applicationType && (
                      <div
                        className="text-danger"
                        style={{ fontSize: "12px", marginTop: "5px" }}
                      >
                        {
                          interestedCourseFormik.errors
                            .interestedCourseDetails[0].applicationType
                        }
                      </div>
                    )}
                </Col>
              )}
            </Row>
            <div className="text-end mt-3">
              <Button
                variant="primary"
                className="custom-select-height"
                type="submit"
              >
                {edit.interestedCourseDetails ? "Update" : "Add"}
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
            <i className="bi bi-exclamation-triangle-fill"></i>{" "}
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
    </>
  );
};

export default InterestedCourseSection;
