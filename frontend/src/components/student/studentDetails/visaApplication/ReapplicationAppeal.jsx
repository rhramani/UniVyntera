import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import { updateStudentApplication } from "../../../../redux/actions/Student/StudentApplication.action";
import { updateVisitorApplication } from "../../../../redux/actions/Visitor/VisitorApplication.action";
import LoadMoreButton from "../../../commonComponents/LoadMoreButton";
import { useDispatch } from "react-redux";
import usePermissions from "../../../commonComponents/usePermissions";

const ReapplicationAppeal = ({
  formData,
  fetchOneStudentDetails,
  id,
  fetchOneVisitorDetails,
  mode,
  userRole,
}) => {
  const { canCreate, canUpdate } = usePermissions(
    "Student Applications",
    "Visa Application"
  );
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const finalVisaStatusOptions = [
    { value: "Reapplication", label: "Reapplication" },
    { value: "Closed", label: "Closed" },
  ];
  const reapplicationAppealStatusOptions = [
    { value: "Reapply", label: "Reapply" },
    { value: "Appeal", label: "Appeal" },
    { value: "Change country/intake", label: "Change country/intake" },
    { value: "Withdrawal", label: "Withdrawal" },
  ];

  useEffect(() => {
    reapplicationAppealFormik.setValues({
      rejectionReason: formData?.visaApplicationDetails?.rejectionReason || "",
      appealOption: formData?.visaApplicationDetails?.appealOption || "",
    });
    finalVisaFormik.setValues({
      status: formData?.visaApplicationDetails?.status || "",
    });
  }, [formData]);
  const handleReapplicationAppealSubmit = async (
    values,
    resetForm,
    formikInstance
  ) => {
    const isFormChanged = values.rejectionReason || values.appealOption;

    if (!isFormChanged) {
      toast.error(
        "Please provide a rejection reason or select a reapplication option."
      );
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        visaApplicationDetails: {
          rejectionReason: values.rejectionReason,
          appealOption: values.appealOption,
        },
      };

      const res = await dispatch(
        mode === "student"
          ? updateStudentApplication(payload, id)
          : updateVisitorApplication(payload, id)
      );
      if (res?.status !== 200) {
        console.error("API response error:", res?.data);
        toast.error(
          res?.data?.error?.message ||
            res?.data?.message ||
            "Error updating reapplication/appeal"
        );
        return;
      }

      toast.success("Reapplication/appeal updated successfully");
      resetForm({
        values: {
          rejectionReason:
            formData?.visaApplicationDetails?.rejectionReason || "",
          appealOption: formData?.visaApplicationDetails?.appealOption || "",
        },
      });
      if (mode === "student") {
        await fetchOneStudentDetails();
      } else if (mode === "visitor") {
        await fetchOneVisitorDetails();
      }
    } catch (error) {
      console.error(
        "Submission error:",
        error?.response?.data || error.message
      );
      toast.error(
        error?.response?.data?.message ||
          "Failed to process request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleFinalVisaSubmit = async (values, formikInstance) => {
    setIsLoading(true);
    try {
      const payload = {
        visaApplicationDetails: {
          status: values.status,
        },
      };

      const res = await dispatch(
        mode === "student"
          ? updateStudentApplication(payload, id)
          : updateVisitorApplication(payload, id)
      );
      if (res?.status !== 200) {
        toast.error(
          res?.data?.error?.message ||
            res?.data?.message ||
            "Error updating visa outcome"
        );
        return;
      }

      toast.success("Final Visa updated successfully");
      if (mode === "student") {
        await fetchOneStudentDetails();
      } else if (mode === "visitor") {
        await fetchOneVisitorDetails();
      }
    } catch (error) {
      console.error(
        "Submission error:",
        error?.response?.data || error.message
      );
      toast.error(
        error?.response?.data?.message ||
          "Failed to process request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const reapplicationAppealFormik = useFormik({
    initialValues: {
      rejectionReason: formData?.visaApplicationDetails?.rejectionReason || "",
      appealOption: formData?.visaApplicationDetails?.appealOption || "",
    },
    onSubmit: (values, { resetForm }) => {
      handleReapplicationAppealSubmit(
        values,
        resetForm,
        reapplicationAppealFormik
      );
    },
  });
  const finalVisaFormik = useFormik({
    initialValues: {
      status: formData?.visaApplicationDetails?.status || "",
    },
  });

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
      <div className="my-5 p-4 bg-light rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center">
          <h5>Reapplication or Appeal</h5>
          <div>
            <Select
              options={finalVisaStatusOptions}
              value={
                finalVisaFormik.values.status
                  ? finalVisaStatusOptions.find(
                      (option) => option.value === finalVisaFormik.values.status
                    )
                  : null
              }
              onChange={(selectedOption) => {
                const newValue = selectedOption ? selectedOption.value : "";
                finalVisaFormik.setFieldValue("status", newValue);
                if (newValue) {
                  handleFinalVisaSubmit({ status: newValue }, finalVisaFormik);
                }
              }}
              onBlur={() => finalVisaFormik.setFieldTouched("status", true)}
              placeholder="Select Status"
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
            />
          </div>
        </div>
        <div className="bg-white mt-3 p-3">
          <Form onSubmit={reapplicationAppealFormik.handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Rejection Reason</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter rejection reason"
                    className="rounded-4"
                    name="rejectionReason"
                    value={reapplicationAppealFormik.values.rejectionReason}
                    onChange={reapplicationAppealFormik.handleChange}
                    onBlur={reapplicationAppealFormik.handleBlur}
                    style={{
                      cursor:
                        userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Reapplication</Form.Label>
                  <Select
                    options={reapplicationAppealStatusOptions}
                    name="appealOption"
                    value={reapplicationAppealStatusOptions.find(
                      (option) =>
                        option.value ===
                        reapplicationAppealFormik.values.appealOption
                    )}
                    onChange={(selectedOption) =>
                      reapplicationAppealFormik.setFieldValue(
                        "appealOption",
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    onBlur={() =>
                      reapplicationAppealFormik.setFieldTouched(
                        "appealOption",
                        true
                      )
                    }
                    placeholder="Select Reapplication"
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
                    isClearable
                    isDisabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                </Form.Group>
              </Col>
            </Row>
            {userRole !== "Student" && userRole !== "LeadStudent" && (canCreate || canUpdate) && (
              <div className="d-flex justify-content-end">
                <Button
                  variant="primary"
                  type="submit"
                  className="custom-select-height"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            )}
          </Form>
        </div>
      </div>
    </>
  );
};

export default ReapplicationAppeal;
