import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import LoadMoreButton from "../../../../commonComponents/LoadMoreButton";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import {
  updateStudentApplication,
  getOneStudentApplication,
  deleteStudentApplication,
  downloadDocument,
  pendingDocMail,
} from "../../../../../redux/actions/Student/StudentApplication.action";
import * as Yup from "yup";
import { toast } from "react-toastify";
import DocumentHandler from "../DocumentHandler";
import { decryptData } from "../../../../../utils/encryptionUtils";

const CanadaVisaSubmissionConfirmation = ({ id }) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const documentTypes = ["Submission Confirmation Document"];
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
  const userRole = decryptData(localStorage.getItem("role"));

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
      documents: [],
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      documents: Yup.mixed(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let formData = null;
        if (values.documents) {
          if (!applicationData?.visaApplicationDetails?._id) {
            throw new Error(
              "Invalid ref_module: visaApplicationDetails._id is undefined"
            );
          }
          formData = new FormData();
          formData.append("uploadedDocument", values.documents);
          formData.append(
            "customDocumentName",
            "Submission Confirmation Document"
          );
          formData.append(
            "ref_module",
            applicationData.visaApplicationDetails._id
          );
        }

        if (formData) {
          const uploadResponse = await dispatch(
            updateStudentApplication(formData, id)
          );
          if (uploadResponse?.data?.documentId) {
            const updatedJsonData = {
              visaApplicationDetails: {
                submissionConfirmation: {
                  documents: [
                    ...(applicationData?.visaApplicationDetails
                      ?.submissionConfirmation?.documents || []),
                    uploadResponse.data.documentId,
                  ],
                },
              },
            };
            await dispatch(updateStudentApplication(updatedJsonData, id));
          }
        }

        await fetchData();
        toast.success(
          "Submission confirmation document uploaded successfully!"
        );
        resetForm();
      } catch (error) {
        console.error(
          "Failed to update submission confirmation details:",
          error
        );
        toast.error(
          error.message ||
            "Failed to upload submission confirmation document. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("documents", file);
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
          <h5>Visa Submission Confirmation</h5>
        </div>
        <div className="bg-white rounded mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>
                    Upload Submission Confirmation Document (PDF/JPG)
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="documents"
                    accept=".pdf,.jpg,.jpeg"
                    className="custom-select-height"
                    onChange={handleFileChange}
                    disabled={
                      applicationData?.uploadedDocumentDetails?.some(
                        (doc) =>
                          doc.customDocumentName ===
                          "Submission Confirmation Document"
                      ) || userRole === "Student" || userRole === "LeadStudent"
                    }
                  />
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
                  {isLoading ? "Submitting..." : "Update"}
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

export default CanadaVisaSubmissionConfirmation;
