import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import Select from "react-select";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import {
  updateStudentApplication,
  getOneStudentApplication,
} from "../../../../../redux/actions/Student/StudentApplication.action";
import * as Yup from "yup";
import { toast } from "react-toastify";
import LoadMoreButton from "../../../../commonComponents/LoadMoreButton";
import { decryptData } from "../../../../../utils/encryptionUtils";

const UsaFundsShow = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const dispatch = useDispatch();
  const userRole = decryptData(localStorage.getItem("role"));

  const balanceOptions = [
    { value: "Bank", label: "Bank" },
    { value: "FD", label: "Fixed Deposit (FD)" },
    { value: "EducationLoan", label: "Education Loan" },
  ];

  const fetchData = async () => {
    try {
      const res = await dispatch(getOneStudentApplication(id));
      setApplicationData(res?.data?.data);
    } catch (error) {
      console.error("Failed to fetch application:", error);
      toast.error("Failed to fetch application data. Please try again.");
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [dispatch, id]);

  const formik = useFormik({
    initialValues: {
      balanceSource: "",
      remark: "",
      requiredAmount: "",
      shownAmount: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      balanceSource: Yup.string().required("Balance type is required"),
      remark: Yup.string(),
      requiredAmount: Yup.number().min(0, "Amount cannot be negative"),
      shownAmount: Yup.number().min(0, "Amount cannot be negative"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const jsonData = {
          visaApplicationDetails: {
            fundsShow: {
              balanceSource: values.balanceSource,
              remark: values.remark,
              requiredAmount: Number(values.requiredAmount),
              shownAmount: Number(values.shownAmount),
            },
          },
        };

        await dispatch(updateStudentApplication(jsonData, id));

        await fetchData();
        toast.success("Funds show details updated successfully!");
      } catch (error) {
        console.error("Failed to update funds show details:", error);
        toast.error("Failed to update funds show details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.fundsShow) {
      const funds = applicationData.visaApplicationDetails.fundsShow;
      formik.setValues({
        balanceSource: funds.balanceSource || "",
        remark: funds.remark || "",
        requiredAmount: funds.requiredAmount || "",
        shownAmount: funds.shownAmount || "",
      });
    }
  }, [applicationData]);

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
      <div className="mb-4 my-5 p-4 bg-light rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center">
          <h5>Funds Show</h5>
        </div>
        <div className="bg-white rounded mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Balance In</Form.Label>
                  <Select
                    name="balanceSource"
                    options={balanceOptions}
                    value={balanceOptions.find(
                      (option) => option.value === formik.values.balanceSource
                    )}
                    onChange={(selectedOption) =>
                      formik.setFieldValue(
                        "balanceSource",
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    classNamePrefix="custom-select"
                    placeholder="Select balance type"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        height: "40px",
                        minHeight: "40px",
                        borderRadius: "4px",
                        borderColor: "#ced4da",
                        fontSize: "13px",
                        boxShadow: "none",
                        "&:hover": {
                          borderColor: "#888",
                        },
                      }),
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 9999,
                      }),
                    }}
                    isSearchable
                    isClearable
                    isDisabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.errors.balanceSource &&
                    formik.touched.balanceSource && (
                      <div className="text-danger">
                        {formik.errors.balanceSource}
                      </div>
                    )}
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Remark</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="remark"
                    className="rounded-4"
                    placeholder="Enter remarks"
                    value={formik.values.remark}
                    onChange={formik.handleChange}
                    rows={2}
                    style={{
                      cursor:
                        userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.errors.remark && formik.touched.remark && (
                    <div className="text-danger">{formik.errors.remark}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Requirement (Amount)</Form.Label>
                  <Form.Control
                    type="number"
                    name="requiredAmount"
                    className="custom-select-height"
                    placeholder="Enter required amount"
                    value={formik.values.requiredAmount}
                    onChange={formik.handleChange}
                    style={{
                      cursor:
                        userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.errors.requiredAmount &&
                    formik.touched.requiredAmount && (
                      <div className="text-danger">
                        {formik.errors.requiredAmount}
                      </div>
                    )}
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Shown (Amount)</Form.Label>
                  <Form.Control
                    type="number"
                    name="shownAmount"
                    className="custom-select-height"
                    placeholder="Enter shown amount"
                    value={formik.values.shownAmount}
                    onChange={formik.handleChange}
                    style={{
                      cursor:
                        userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.errors.shownAmount && formik.touched.shownAmount && (
                    <div className="text-danger">
                      {formik.errors.shownAmount}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            {userRole !== "Student" && userRole !== "LeadStudent" && (
              <div className="d-flex justify-content-end me-3">
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

export default UsaFundsShow;
