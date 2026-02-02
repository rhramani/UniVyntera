import { useFormik } from "formik";
import { Button, Col, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { updateStudentApplication } from "../../../../../redux/actions/Student/StudentApplication.action";
import { useEffect } from "react";
import Select from "react-select";

const OfferLetterAcceptance = ({
  editState,
  formData,
  setIsLoading,
  id,
  isRestrictedRole,
  userRole,
  setLocalCourses,
  setFormData,
  dispatch,
  localCourses,
  fetchStudentData,
  canCreate,
  canUpdate
}) => {
  const offerLetterDecisionOptions = [
    { value: "Accepted", label: "Accepted" },
    { value: "Declined", label: "Declined" },
  ];
  const offerLetterAcceptanceFormik = useFormik({
    initialValues: {
      offerLetterAcceptedByStudent: "",
      offerLetterAcceptedByStudentRemarks: "",
    },
    onSubmit: async (values) => {
      await handleOfferLetterAcceptanceSubmit(values);
    },
  });
  const handleOfferLetterAcceptanceSubmit = async (values) => {
    const updatedIndex = editState.interestedCourseIndex;
    const courseId = formData.interestedCourseDetails[updatedIndex]?._id;

    if (!courseId) {
      toast.error("Invalid course ID. Cannot update offer letter acceptance.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        interestedCourseId: courseId,
        interestedCourseUpdate: {
          offerLetterAcceptedByStudent: values.offerLetterAcceptedByStudent,
          offerLetterAcceptedByStudentRemarks:
            values.offerLetterAcceptedByStudentRemarks,
        },
      };

      const res = await dispatch(updateStudentApplication(payload, id));

      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          setIsLoading(false);
          return;
        }

        toast.success("Offer letter acceptance updated successfully");

        const updatedCourse = {
          ...localCourses[0],
          offerLetterAcceptedByStudent: values.offerLetterAcceptedByStudent,
          offerLetterAcceptedByStudentRemarks:
            values.offerLetterAcceptedByStudentRemarks,
        };

        setLocalCourses([updatedCourse]);

        setFormData({
          ...formData,
          interestedCourseDetails: formData.interestedCourseDetails.map(
            (item, index) => (index === updatedIndex ? updatedCourse : item)
          ),
        });

        await fetchStudentData();
        offerLetterAcceptanceFormik.resetForm();
      } else {
        toast.error(
          res?.data?.message || "Error updating offer letter acceptance"
        );
      }
    } catch (error) {
      console.error("Error updating offer letter acceptance:", error);
      toast.error(
        error?.response?.data?.message ||
          "Error updating offer letter acceptance"
      );
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (localCourses[0]) {
      const currentDecision = localCourses[0]?.offerLetterAcceptedByStudent;
      offerLetterAcceptanceFormik.setFieldValue(
        "offerLetterAcceptedByStudent",
        currentDecision
      );
      offerLetterAcceptanceFormik.setFieldValue(
        "offerLetterAcceptedByStudentRemarks",
        localCourses[0]?.offerLetterAcceptedByStudentRemarks || ""
      );
    }
  }, [localCourses]);
  return (
    <div className="my-5 p-4 bg-light rounded shadow-sm">
      <h5>Offer Letter Acceptance</h5>
      <div className="bg-white mt-3 p-3 rounded">
        <Form onSubmit={offerLetterAcceptanceFormik.handleSubmit}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>Student Decision</Form.Label>
              <Select
                name="offerLetterAcceptedByStudent"
                options={offerLetterDecisionOptions}
                value={
                  offerLetterAcceptanceFormik.values
                    .offerLetterAcceptedByStudent
                    ? {
                        value:
                          offerLetterAcceptanceFormik.values
                            .offerLetterAcceptedByStudent,
                        label:
                          offerLetterAcceptanceFormik.values
                            .offerLetterAcceptedByStudent,
                      }
                    : null
                }
                onChange={(selectedOption) => {
                  const value = selectedOption ? selectedOption.value : "";
                  offerLetterAcceptanceFormik.setFieldValue(
                    "offerLetterAcceptedByStudent",
                    value
                  );
                  // handleOfferLetterAcceptanceSubmit({
                  //   offerLetterAcceptedByStudent: value,
                  // });
                }}
                onBlur={() =>
                  offerLetterAcceptanceFormik.handleBlur(
                    "offerLetterAcceptedByStudent"
                  )
                }
                placeholder="Select Decision"
                className="custom-select-height"
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
                isDisabled={
                  isRestrictedRole ||
                  userRole === "Student" || userRole === "LeadStudent" ||
                  (!canCreate && !canUpdate)
                }
              />
            </Col>
            <Col md={6} className="mb-3">
              {" "}
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                type="text"
                name="offerLetterAcceptedByStudentRemarks"
                value={
                  offerLetterAcceptanceFormik.values
                    .offerLetterAcceptedByStudentRemarks
                }
                onChange={(e) =>
                  offerLetterAcceptanceFormik.setFieldValue(
                    "offerLetterAcceptedByStudentRemarks",
                    e.target.value
                  )
                }
                placeholder="Enter remarks"
                className="custom-select-height"
                disabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
              />
            </Col>
          </Row>
          {userRole !== "Student" && userRole !== "LeadStudent" && (
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

export default OfferLetterAcceptance;
