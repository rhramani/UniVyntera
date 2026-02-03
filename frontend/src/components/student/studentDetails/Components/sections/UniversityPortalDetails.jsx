import { useEffect, useState } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateStudentApplication } from "../../../../../redux/actions/Student/StudentApplication.action";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Select from "react-select";
import { getAllApplicationType } from "../../../../../redux/actions/Master/ApplicationType.action";
import usePermissions from "../../../../commonComponents/usePermissions";

const UniversityPortalDetails = ({
  id,
  userRole,
  isRestrictedRole,
  fetchStudentData,
  editState,
  formData,
}) => {
  const { canCreate, canUpdate } = usePermissions(
    "Student Applications",
    "Visa Application"
  );
  const dispatch = useDispatch();
  const [showCredential, setShowCredential] = useState(false);
  const [applicationTypes, setApplicationTypes] = useState([]);

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

  const currentCourse =
    formData?.interestedCourseDetails?.[editState?.interestedCourseIndex] || {};

  const formik = useFormik({
    initialValues: {
      url: currentCourse?.portalDetails?.url || "",
      applicationType: currentCourse?.portalDetails?.applicationType || null,
      user: currentCourse?.portalDetails?.user || "",
      password: currentCourse?.portalDetails?.password || "",
      remarks: currentCourse?.portalDetails?.remarks || "",
    },

    enableReinitialize: true,

    validationSchema: Yup.object({
      url: Yup.string(),
      applicationType: Yup.string().nullable(),
      user: Yup.string(),
      password: Yup.string(),
      remarks: Yup.string(),
    }),

    onSubmit: async (values) => {
      const updatedIndex = editState.interestedCourseIndex;
      const courseId = formData.interestedCourseDetails[updatedIndex]?._id;
      if (!courseId) {
        toast.error("Invalid course ID. Cannot update.");
        return;
      }

      const payload = {
        interestedCourseId: courseId,
        interestedCourseUpdate: {
          portalDetails: {
            url: values.url,
            applicationType: values.applicationType,
            user: values.user,
            password: values.password,
            remarks: values.remarks,
          },
        },
      };

      try {
        const res = await dispatch(updateStudentApplication(payload, id));
        if (res?.status === 200) {
          toast.success("Portal details updated successfully");
          fetchStudentData();
        } else {
          toast.error(res?.data?.message || "Error updating details");
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to update portal details"
        );
      }
    },
  });

  useEffect(() => {
    if (currentCourse?.portalDetails) {
      formik.setValues({
        url: currentCourse.portalDetails.url || "",
        applicationType:
          currentCourse.portalDetails.applicationType?._id || null,
        user: currentCourse.portalDetails.user || "",
        password: currentCourse.portalDetails.password || "",
        remarks: currentCourse.portalDetails.remarks || "",
      });
    }
  }, [currentCourse]);

  return (
    <div className="my-5 p-4 bg-light rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center">
        <h5>University Portal Details</h5>
      </div>

      <div className="bg-white mt-3 p-3 rounded">
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col md={3} className="mb-3">
              <Form.Label>Application Type</Form.Label>
              <Select
                options={applicationTypeOptions}
                value={
                  applicationTypeOptions.find(
                    (option) =>
                      option.value === formik.values.applicationType ||
                      formik.values.applicationType?._id
                  ) || null
                }
                onChange={(selectedOption) =>
                  formik.setFieldValue(
                    "applicationType",
                    selectedOption ? selectedOption.value : null
                  )
                }
                onBlur={() => formik.setFieldTouched("applicationType", true)}
                placeholder="Select application type"
                classNamePrefix="custom-select"
                isClearable
                menuPortalTarget={document.body}
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "30px",
                    color: "black",
                    minHeight: "38px",
                    height: "38px",
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: "#6c757d",
                    fontSize: "13px",
                  }),
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  valueContainer: (base) => ({
                    ...base,
                    height: "38px",
                    padding: "0 8px",
                  }),
                  input: (base) => ({ ...base, margin: "0px" }),
                }}
              />
              {formik.touched.applicationType &&
                formik.errors.applicationType && (
                  <div className="text-danger" style={{ fontSize: "12px" }}>
                    {formik.errors.applicationType}
                  </div>
                )}
            </Col>
            <Col md={3} className="mb-3">
              <Form.Group controlId="portalUrl">
                <Form.Label>Portal URL</Form.Label>
                <Form.Control
                  type="text"
                  name="url"
                  placeholder="Enter portal URL"
                  value={formik.values.url}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="custom-select-height"
                />
              </Form.Group>
            </Col>
            <Col md={3} className="mb-3">
              <Form.Group controlId="portalUser">
                <Form.Label>User</Form.Label>
                <Form.Control
                  type="text"
                  name="user"
                  placeholder="Enter username"
                  value={formik.values.user}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="custom-select-height"
                />
              </Form.Group>
            </Col>
            <Col md={3} className="mb-3">
              <Form.Group controlId="portalPassword">
                <Form.Label>Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showCredential ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="custom-select-height"
                  />
                  <span
                    onClick={() => setShowCredential(!showCredential)}
                    className="position-absolute top-50 end-0 translate-middle-y pe-3"
                    style={{ cursor: "pointer" }}
                  >
                    {showCredential ? (
                      <VisibilityOff sx={{ fontSize: 18 }} />
                    ) : (
                      <Visibility sx={{ fontSize: 18 }} />
                    )}
                  </span>
                </div>
              </Form.Group>
            </Col>{" "}
            <Col md={3} className="mb-3">
              <Form.Group controlId="portalUser">
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  type="text"
                  name="remarks"
                  placeholder="Enter remarks"
                  value={formik.values.remarks}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="custom-select-height"
                />
              </Form.Group>
            </Col>
          </Row>

          {userRole !== "Student" && userRole !== "LeadStudent" && (canCreate || canUpdate) && (
            <div className="d-flex justify-content-end me-3">
              <Button
                variant="primary"
                type="submit"
                className="custom-select-height"
                disabled={isRestrictedRole}
              >
                Submit
              </Button>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default UniversityPortalDetails;
