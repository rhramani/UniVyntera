import { useState, useEffect } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  updateStudentApplication,
  getOneStudentApplication,
  deleteStudentApplication,
  downloadDocument,
  pendingDocMail,
} from "../../../../../redux/actions/Student/StudentApplication.action";
import LoadMoreButton from "../../../../commonComponents/LoadMoreButton";
import Select from "react-select";
import DocumentHandler from "../DocumentHandler";
import { decryptData } from "../../../../../utils/encryptionUtils";

const FranceProofofFundsBlockedAccount = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  const dispatch = useDispatch();
  const userRole = decryptData(localStorage.getItem("role"));

  const documentTypes = ["Proof of Funds"];
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);

  const fetchData = async () => {
    try {
      const res = await dispatch(getOneStudentApplication(id));
      setApplicationData(res?.data?.data);
    } catch (error) {
      console.error("Failed to fetch application:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    } else {
      toast.error("Invalid application ID. Please provide a valid ID.");
    }
  }, [dispatch, id]);

  const formik = useFormik({
    initialValues: {
      method: "",
      bankName: "",
      fundAmount: "",
      proofUpload: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      method: Yup.string(),
      bankName: Yup.string(),
      fundAmount: Yup.string(),
      proofUpload: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const jsonData = {
          visaApplicationDetails: {
            proofOfFunds: {
              method: values.method,
              bankName: values.bankName,
              fundAmount: values.fundAmount,
            },
          },
        };

        const oldProof =
          applicationData?.visaApplicationDetails?.proofOfFunds || {};
        if (
          oldProof.method !== values.method ||
          oldProof.bankName !== values.bankName ||
          oldProof.fundAmount !== values.fundAmount
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.proofUpload) {
          hasFileUpload = true;
          formData = new FormData();
          formData.append("uploadedDocument", values.proofUpload);
          formData.append("customDocumentName", "Proof of Funds");
          formData.append(
            "ref_module",
            applicationData?.visaApplicationDetails?._id
          );
        }

        if (!hasJsonChanges && !hasFileUpload) {
          toast.info("No changes detected.");
          return;
        }

        if (hasJsonChanges) {
          await dispatch(updateStudentApplication(jsonData, id));
        }

        if (hasFileUpload && formData) {
          await dispatch(updateStudentApplication(formData, id));
        }

        await fetchData();
        toast.success("Proof of Funds details updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to update Proof of Funds details:", error);
        toast.error(
          error.message ||
            "Failed to update Proof of Funds details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.proofOfFunds) {
      const proofOfFunds = applicationData.visaApplicationDetails.proofOfFunds;
      formik.setValues({
        method: proofOfFunds.method || "",
        bankName: proofOfFunds.bankName || "",
        fundAmount: proofOfFunds.fundAmount ? proofOfFunds.fundAmount : "",
        proofUpload: "",
      });
    }
  }, [applicationData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("proofUpload", file);
  };

  const handleCheckboxChangeId = (docId, docName) => {
    setSelectedDocsIds((prev) => {
      if (prev.includes(docId)) {
        return prev.filter((id) => id !== docId);
      }
      return [...prev, docId];
    });
    setSelectedDocumentNames((prev) => {
      if (prev.includes(docName)) {
        return prev.filter((name) => name !== docName);
      }
      return [...prev, docName];
    });
  };

  const sendPendingDocumentMain = (id, selectedDocumentNames) => {
    const toastId = toast.loading("Sending the pending documents email");

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
        } else {
          toast.update(toastId, {
            render: res?.data?.message || "Failed to send email",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      })
      .catch((error) => {
        console.error("Error sending pending doc email:", error);
        toast.update(toastId, {
          render: "Failed to send email. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      });
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

      <div className="mb-4 my-5 p-4 bg-light rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center">
          <h5>Proof of Funds / Blocked Account</h5>
        </div>
        <div className="bg-white rounded mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Funding Method</Form.Label>
                  <Select
                    name="method"
                    options={[
                      { value: "Blocked Account", label: "Blocked Account" },
                      { value: "Sponsorship", label: "Sponsorship" },
                      { value: "Family Support", label: "Family Support" },
                      { value: "Other", label: "Other" },
                    ]}
                    value={[
                      { value: "Blocked Account", label: "Blocked Account" },
                      { value: "Sponsorship", label: "Sponsorship" },
                      { value: "Family Support", label: "Family Support" },
                      { value: "Other", label: "Other" },
                    ].find((option) => option.value === formik.values.method)}
                    onChange={(selectedOption) =>
                      formik.setFieldValue(
                        "method",
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: "40px",
                        borderRadius: "4px",
                        borderColor: "#ced4da",
                        boxShadow: "none",
                        "&:hover": { borderColor: "#888" },
                      }),
                      menu: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    placeholder="Select funding method"
                    classNamePrefix="custom-select"
                    isClearable
                    isDisabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.touched.method && formik.errors.method && (
                    <div className="text-danger">{formik.errors.method}</div>
                  )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Bank Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="bankName"
                    placeholder="Enter bank name (e.g., Deutsche Bank)"
                    value={formik.values.bankName}
                    onChange={formik.handleChange}
                    className="custom-select-height"
                    style={{
                      cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.touched.bankName && formik.errors.bankName && (
                    <div className="text-danger">{formik.errors.bankName}</div>
                  )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Fund Amount (EUR)</Form.Label>
                  <Form.Control
                    type="text"
                    name="fundAmount"
                    placeholder="Enter amount (e.g., 10000.00)"
                    value={formik.values.fundAmount}
                    onChange={formik.handleChange}
                    className="custom-select-height"
                    style={{
                      cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.touched.fundAmount && formik.errors.fundAmount && (
                    <div className="text-danger">
                      {formik.errors.fundAmount}
                    </div>
                  )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Upload Fund Proof (PDF/JPG/PNG)</Form.Label>
                  <Form.Control
                    type="file"
                    name="proofUpload"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="custom-select-height"
                    disabled={applicationData?.uploadedDocumentDetails?.some(
                      (doc) => doc.customDocumentName === "Proof of Funds"
                    ) || userRole === "Student" || userRole === "LeadStudent"}
                  />
                </Form.Group>
              </Col>
            </Row>
 {userRole !== "Student" && userRole !== "LeadStudent" && (
            <div className="d-flex justify-content-end me-3">
              <Button
                type="submit"
                className="custom-select-height"
                variant="primary"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </div>)}
          </Form>
        </div>
        <DocumentHandler
          applicationData={applicationData}
          documentTypes={documentTypes}
          id={id}
          dispatch={dispatch}
          updateStudentApplication={updateStudentApplication}
          deleteStudentApplication={deleteStudentApplication}
          downloadDocument={downloadDocument}
          userRole={userRole}
          selectedDocsIds={selectedDocsIds}
          handleCheckboxChangeId={handleCheckboxChangeId}
          selectedDocumentNames={selectedDocumentNames}
          sendPendingDocumentMain={sendPendingDocumentMain}
          fetchData={fetchData}
        />
      </div>
    </>
  );
};

export default FranceProofofFundsBlockedAccount;
