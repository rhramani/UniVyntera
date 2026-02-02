import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Modal, Table } from "react-bootstrap";
import Select from "react-select";
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

const CanadaConditionalOfferLetter = ({ id }) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
  const userRole = decryptData(localStorage.getItem("role"));

  const documentTypes = ["Conditional Offer Letters"];

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
      conditionalOfferLetter: "No",
      offerLetter: [],
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      conditionalOfferLetter: Yup.string().required("Please select an option"),
      offerLetter: Yup.mixed(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        const oldData =
          applicationData?.visaApplicationDetails?.conditionalOfferLetter || {};
        const hasJsonChange =
          (values.conditionalOfferLetter === "Yes") !== oldData.received;
        const hasFileUpload =
          values.conditionalOfferLetter === "Yes" &&
          values.offerLetter &&
          values.offerLetter.length > 0;

        if (!hasJsonChange && !hasFileUpload) {
          toast.info("No changes detected.");
          return;
        }

        const jsonData = {
          visaApplicationDetails: {
            conditionalOfferLetter: {
              received: values.conditionalOfferLetter === "Yes",
            },
          },
        };

        if (hasJsonChange) {
          await dispatch(updateStudentApplication(jsonData, id));
        }

        if (hasFileUpload) {
          let uploadedDocIds = [];

          for (const file of values.offerLetter) {
            const formData = new FormData();
            formData.append("uploadedDocument", file);
            formData.append("customDocumentName", "Conditional Offer Letters");
            formData.append(
              "ref_module",
              applicationData?.visaApplicationDetails?._id
            );

            const uploadResponse = await dispatch(
              updateStudentApplication(formData, id)
            );

            if (uploadResponse?.data?.documentId) {
              uploadedDocIds.push(uploadResponse.data.documentId);
            }
          }

          if (uploadedDocIds.length > 0) {
            const updatedJsonData = {
              visaApplicationDetails: {
                conditionalOfferLetter: {
                  received: values.conditionalOfferLetter === "Yes",
                  documents: [...(oldData.documents || []), ...uploadedDocIds],
                },
              },
            };
            await dispatch(updateStudentApplication(updatedJsonData, id));
          }
        }

        await fetchData();
        toast.success("Conditional offer letter details updated successfully!");
        resetForm();
      } catch (error) {
        console.error(
          "Failed to update conditional offer letter details:",
          error
        );
        toast.error(
          "Failed to update conditional offer letter details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.conditionalOfferLetter) {
      const offer =
        applicationData.visaApplicationDetails.conditionalOfferLetter;
      formik.setValues({
        conditionalOfferLetter: offer.received ? "Yes" : "No",
        offerLetter: "",
      });
    }
  }, [applicationData]);

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
          <h5>Conditional Offer Letter</h5>
        </div>
        <div className="bg-white mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Conditional Offer Letter?</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Yes"
                      name="conditionalOfferLetter"
                      value="Yes"
                      id="yesCanadaOfferLetter"
                      checked={formik.values.conditionalOfferLetter === "Yes"}
                      onChange={formik.handleChange}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="No"
                      name="conditionalOfferLetter"
                      value="No"
                      id="noCanadaOfferLetter"
                      checked={formik.values.conditionalOfferLetter === "No"}
                      onChange={formik.handleChange}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    {formik.errors.conditionalOfferLetter &&
                      formik.touched.conditionalOfferLetter && (
                        <div className="text-danger">
                          {formik.errors.conditionalOfferLetter}
                        </div>
                      )}
                  </div>
                </Form.Group>
              </Col>
              {formik.values.conditionalOfferLetter === "Yes" && (
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Upload Offer Letter (PDF/JPG)</Form.Label>
                    <Form.Control
                      type="file"
                      name="offerLetter"
                      accept=".pdf,.jpg,.jpeg"
                      className="custom-select-height"
                      onChange={(e) =>
                        formik.setFieldValue(
                          "offerLetter",
                          Array.from(e.target.files)
                        )
                      }
                      multiple
                      // disabled={applicationData?.uploadedDocumentDetails?.some(
                      //   (doc) =>
                      //     doc.customDocumentName === "Conditional Offer Letters"
                      // )}
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                  </Form.Group>
                </Col>
              )}
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

export default CanadaConditionalOfferLetter;
