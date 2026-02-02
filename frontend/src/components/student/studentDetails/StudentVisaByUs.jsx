import { Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { updateStudentApplication } from "../../../redux/actions/Student/StudentApplication.action";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoadMoreButton from "../../commonComponents/LoadMoreButton";

const StudentVisaByUs = ({
  formData,
  fetchOneStudentDetails,
  id,
  edit,
  userRole,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const visaByRGFormik = useFormik({
    initialValues: {
      visaByRG: formData?.visaByRG ?? false,
    },
    validationSchema: Yup.object({
      visaByRG: Yup.boolean(),
    }),
  });

  useEffect(() => {
    visaByRGFormik.setValues({
      visaByRG: formData?.visaByRG ?? false,
    });
  }, [formData?.visaByRG]);

  useEffect(() => {
    visaByRGFormik.setValues({
      visaByRG: formData?.visaByRG || false,
    });
  }, [formData]);
  const handleVisaByRGSubmit = async (values, formikInstance) => {
    if (values.visaByRG === null) {
      toast.error("Please select whether a visa is required.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        visaByRG: values.visaByRG,
      };

      const res = await dispatch(updateStudentApplication(payload, id));
      if (res?.status !== 200) {
        console.error("API response error:", res?.data);
        toast.error(
          res?.data?.error?.message ||
            res?.data?.message ||
            "Error updating visa information"
        );
        return;
      }

      toast.success("Visa By US updated successfully");
      await fetchOneStudentDetails();
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
      <div className="d-flex align-items-center gap-3 my-5 p-3 bg-light rounded shadow-sm">
        <strong>Student Visa By Us?</strong>
        <Form.Check
          type="radio"
          id="isVisaByRGYes"
          name="visaByRG"
          value={true}
          checked={visaByRGFormik.values.visaByRG === true}
          onChange={() => {
            visaByRGFormik.setFieldValue("visaByRG", true);
            handleVisaByRGSubmit({ visaByRG: true }, visaByRGFormik);
          }}
          onBlur={visaByRGFormik.handleBlur}
          label="Yes"
          disabled={userRole === "Student" || userRole === "LeadStudent" || !edit || isLoading}
          className="custom-radio-border"
        />
        <Form.Check
          type="radio"
          id="isVisaByRGNo"
          name="visaByRG"
          value={false}
          checked={visaByRGFormik.values.visaByRG === false}
          onChange={() => {
            visaByRGFormik.setFieldValue("visaByRG", false);
            handleVisaByRGSubmit({ visaByRG: false }, visaByRGFormik);
          }}
          onBlur={visaByRGFormik.handleBlur}
          label="No"
          disabled={userRole === "Student" || userRole === "LeadStudent" || !edit || isLoading}
          className="custom-radio-border"
        />
      </div>
    </>
  );
};

export default StudentVisaByUs;
