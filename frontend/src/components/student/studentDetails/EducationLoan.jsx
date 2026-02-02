import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { updateStudentApplication } from "../../../redux/actions/Student/StudentApplication.action";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Row, Col, Button } from "react-bootstrap";
import LoadMoreButton from "../../commonComponents/LoadMoreButton";
import usePermissions from "../../commonComponents/usePermissions";
import { getAllLoanProvider } from "../../../redux/actions/LoanProvider.action";
import Select from "react-select";

const EducationLoan = ({
  fetchOneStudentDetails,
  formData,
  userRole,
  edit,
  id,
}) => {
  const { canRead, canUpdate, canCreate, canDelete } = usePermissions(
    "Student Applications",
    "Course Selection"
  );
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [loanProviders, setLoanProviders] = useState([]);

  const fetchLoanProviders = async () => {
    try {
      const res = await dispatch(getAllLoanProvider(1, 1000, ""));
      if (res?.status === 200) {
        setLoanProviders(res?.data?.data?.data || []);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };
  const loanProviderOptions = loanProviders.map((lp) => ({
  value: lp._id,
  label: `${lp.name}${lp.contact ? ` (${lp.contact})` : ""}`,
  contact: lp.contact || "",
}));


  const loanFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      loanRequired: formData?.loanRequired ?? false,
      loanAmount: formData?.loanAmount || "",
      loanProvider: formData?.loanProvider?._id || null,
    },
    validationSchema: Yup.object({
      loanRequired: Yup.boolean(),
      loanAmount: Yup.number()
        .nullable()
        .when("loanRequired", {
          is: true,
          then: (schema) =>
            schema.required("Loan amount is required when loan is selected"),
          otherwise: (schema) => schema.nullable(),
        }),
      loanProvider: Yup.string().nullable(),
    }),
    onSubmit: async (values) => handleLoanSubmit(values),
  });
  
  useEffect(() => {
    fetchLoanProviders();
    loanFormik.setValues({
      loanRequired: formData?.loanRequired ?? false,
      loanAmount: formData?.loanAmount || "",
      loanProvider: formData?.loanProvider?._id || null,
    });
  }, [formData]);

  const handleLoanSubmit = async (values) => {
    if (values.loanRequired === null) {
      toast.error("Please select whether a loan is required.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        loanRequired: values.loanRequired,
        loanAmount: values.loanRequired ? values.loanAmount : null,
        loanProvider: values.loanRequired ? values.loanProvider : null,
      };

      const res = await dispatch(updateStudentApplication(payload, id));
      if (res?.status !== 200) {
        toast.error(
          res?.data?.error?.message ||
            res?.data?.message ||
            "Error updating loan information"
        );
        return;
      }

      toast.success("Loan information updated successfully");
      await fetchOneStudentDetails();
    } catch (error) {
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

      <div className="my-5 p-4 bg-light rounded shadow-sm">
        <h5>Education Loan Information</h5>
        <Form className="mt-4" onSubmit={loanFormik.handleSubmit}>
          <Row className="align-items-center">
            <Col md="auto">
              <strong>Education loan Required?</strong>
            </Col>

            <Col md="auto">
              <Form.Check
                type="radio"
                id="isLoanRequiredYes"
                name="loanRequired"
                value={true}
                checked={loanFormik.values.loanRequired === true}
                onChange={() => loanFormik.setFieldValue("loanRequired", true)}
                onBlur={loanFormik.handleBlur}
                label="Yes"
                disabled={userRole === "Student" || userRole === "LeadStudent" || !edit || isLoading}
                className="custom-radio-border"
              />
            </Col>

            <Col md="auto">
              <Form.Check
                type="radio"
                id="isLoanRequiredNo"
                name="loanRequired"
                value={false}
                checked={loanFormik.values.loanRequired === false}
                onChange={() => loanFormik.setFieldValue("loanRequired", false)}
                onBlur={loanFormik.handleBlur}
                label="No"
                disabled={userRole === "Student" || userRole === "LeadStudent" || !edit || isLoading}
                className="custom-radio-border"
              />
            </Col>

            {loanFormik.values.loanRequired && (
              <>
                <Col md={3}>
                  <Form.Label>Loan Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="loanAmount"
                    className="custom-select-height"
                    value={loanFormik.values.loanAmount}
                    onChange={loanFormik.handleChange}
                    onBlur={loanFormik.handleBlur}
                    disabled={userRole === "Student" || userRole === "LeadStudent" || !edit || isLoading}
                    placeholder="Loan Amount"
                    min="0"
                  />
                  {loanFormik.touched.loanAmount &&
                    loanFormik.errors.loanAmount && (
                      <div className="text-danger mt-1">
                        {loanFormik.errors.loanAmount}
                      </div>
                    )}
                </Col>

                  <Col md={3}>
                  <Form.Label>Loan Provider</Form.Label>
                  <Select
                    name="loanProvider"
                    options={loanProviderOptions}
                    value={loanProviderOptions?.find(
                      (option) =>
                        option.value === loanFormik.values.loanProvider
                    )}
                    onChange={(option) =>
                      loanFormik.setFieldValue("loanProvider", option.value)
                    }
                    onBlur={loanFormik.handleBlur}
                    isDisabled={userRole === "Student" || userRole === "LeadStudent" || !edit || isLoading}
                    placeholder="Select Loan Provider"
                    isClearable
                    isSearchable
                    classNamePrefix="custom-select"
                  />
                  

                </Col>
              </>
            )}
          </Row>

          {userRole !== "Student" && userRole !== "LeadStudent" && canCreate && (
            <div className="d-flex justify-content-end mt-3">
              <Button
                type="submit"
                className="custom-select-height"
                variant="primary"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          )}
        </Form>
      </div>
    </>
  );
};

export default EducationLoan;
