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
import DocumentHandler from "../DocumentHandler";
import { decryptData } from "../../../../../utils/encryptionUtils";

const GerAdmissionLetter = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
  const userRole = decryptData(localStorage.getItem("role"));

  const documentTypes = ["Admission Letter"];

  const dispatch = useDispatch();

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
    } else {
      toast.error("Invalid application ID. Please provide a valid ID.");
    }
  }, [dispatch, id]);

  const formik = useFormik({
    initialValues: {
      received: "",
      letterUpload: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      received: Yup.string(),
      letterUpload: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const oldLetter =
          applicationData?.visaApplicationDetails?.admissionLetter || {};
        const receivedBoolean = values.received === "Yes";

        if (oldLetter.received !== receivedBoolean) {
          hasJsonChanges = true;
        }

        const jsonData = {
          visaApplicationDetails: {
            admissionLetter: {
              received: receivedBoolean,
            },
          },
        };

        let formData = null;
        if (values.letterUpload) {
          hasFileUpload = true;
          formData = new FormData();
          formData.append("uploadedDocument", values.letterUpload);
          formData.append("customDocumentName", "Admission Letter");
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
        toast.success("Admission Letter details updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to update admission letter details:", error);
        toast.error(
          error.message ||
            "Failed to update admission letter details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.admissionLetter) {
      const admissionLetter =
        applicationData.visaApplicationDetails.admissionLetter;
      formik.setValues({
        received: admissionLetter.received ? "Yes" : "No",
        letterUpload: "",
      });
    }
  }, [applicationData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("letterUpload", file);
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
          <h5>Admission Letter</h5>
        </div>
        <div className="bg-white rounded mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Admission / Offer Letter Received?</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      label="Yes"
                      type="radio"
                      id="admissionYes"
                      name="received"
                      value="Yes"
                      checked={formik.values.received === "Yes"}
                      onChange={() => formik.setFieldValue("received", "Yes")}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    <Form.Check
                      inline
                      label="No"
                      type="radio"
                      id="admissionNo"
                      name="received"
                      value="No"
                      checked={formik.values.received === "No"}
                      onChange={() => formik.setFieldValue("received", "No")}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                  </div>
                  {formik.touched.received && formik.errors.received && (
                    <div className="text-danger">{formik.errors.received}</div>
                  )}
                </Form.Group>
              </Col>

              {formik.values.received === "Yes" && (
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>
                      Upload Admission Letter (PDF/JPG/PNG)
                    </Form.Label>
                    <Form.Control
                      type="file"
                      name="letterUpload"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="custom-select-height"
                      disabled={
                        applicationData?.uploadedDocumentDetails?.some(
                          (doc) => doc.customDocumentName === "Admission Letter"
                        ) || userRole === "student" || userRole === "LeadStudent"
                      }
                    />
                    {formik.touched.letterUpload &&
                      formik.errors.letterUpload && (
                        <div className="text-danger">
                          {formik.errors.letterUpload}
                        </div>
                      )}
                  </Form.Group>
                </Col>
              )}
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
              </div>
            )}
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

export default GerAdmissionLetter;
