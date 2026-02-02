import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import LoadMoreButton from "../../../../commonComponents/LoadMoreButton";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import {
  updateStudentApplication,
  getOneStudentApplication,
  deleteStudentApplication,
  downloadDocument,
  pendingDocMail,
} from "../../../../../redux/actions/Student/StudentApplication.action";
import { toast } from "react-toastify";
import { decryptData } from "../../../../../utils/encryptionUtils";
import DocumentHandler from "../DocumentHandler";

const FranceOfferAdmissionLetter = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  const dispatch = useDispatch();
  const documentTypes = ["Offer / Admission Letter"];
  const userRole = decryptData(localStorage.getItem("role"));
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
      received: "",
      institutionName: "",
      letterUpload: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      received: Yup.string(),
      institutionName: Yup.string(),
      letterUpload: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const oldAdmissionLetter =
          applicationData?.visaApplicationDetails?.admissionLetter || {};

        const jsonData = {
          visaApplicationDetails: {
            admissionLetter: {
              received: values.received === "Yes",
              institutionName:
                values.received === "Yes" ? values.institutionName : "",
            },
          },
        };

        if (
          oldAdmissionLetter.received !== (values.received === "Yes") ||
          oldAdmissionLetter.institutionName !==
            (values.received === "Yes" ? values.institutionName : "")
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.letterUpload) {
          hasFileUpload = true;
          formData = new FormData();
          formData.append("uploadedDocument", values.letterUpload);
          formData.append("customDocumentName", "Offer / Admission Letter");
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
        institutionName: admissionLetter.institutionName || "",
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
          <h5>Offer / Admission Letter</h5>
        </div>
        <div className="bg-white mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Admission Letter Received?</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      label="Yes"
                      type="radio"
                      name="received"
                      value="Yes"
                      id="yesAdmissionLetterReceived"
                      checked={formik.values.received === "Yes"}
                      onChange={(e) => {
                        formik.handleChange(e);
                        if (e.target.value === "No") {
                          formik.setValues({
                            ...formik.values,
                            received: "No",
                            institutionName: "",
                            letterUpload: null,
                          });
                        }
                      }}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    <Form.Check
                      inline
                      label="No"
                      type="radio"
                      name="received"
                      value="No"
                      id="noAdmissionLetterReceived"
                      checked={formik.values.received === "No"}
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.setValues({
                          ...formik.values,
                          received: "No",
                          institutionName: "",
                          letterUpload: null,
                        });
                      }}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    {formik.touched.received && formik.errors.received && (
                      <div className="text-danger">
                        {formik.errors.received}
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>

              {formik.values.received === "Yes" && (
                <>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>University / Institution Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="institutionName"
                        placeholder="Enter university/institution name"
                        value={formik.values.institutionName}
                        onChange={formik.handleChange}
                        className="custom-select-height"
                        style={{
                          cursor: userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "",
                        }}
                        disabled={userRole === "Student" || userRole === "LeadStudent"}
                      />
                      {formik.touched.institutionName &&
                        formik.errors.institutionName && (
                          <div className="text-danger">
                            {formik.errors.institutionName}
                          </div>
                        )}
                    </Form.Group>
                  </Col>

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
                            (doc) =>
                              doc.customDocumentName ===
                              "Offer / Admission Letter"
                          ) || userRole === "Student" || userRole === "LeadStudent"
                        }
                      />
                    </Form.Group>
                  </Col>
                </>
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

export default FranceOfferAdmissionLetter;
