import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
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

import { decryptData } from "../../../../../utils/encryptionUtils";
import DocumentHandler from "../DocumentHandler";
import LoadMoreButton from "../../../../commonComponents/LoadMoreButton";

const SingaporeSolarApplicationSubmission = ({ id }) => {
  const dispatch = useDispatch();
  const userRole = decryptData(localStorage.getItem("role"));

  const [applicationData, setApplicationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);

  const documentTypes = [
    "SOLAR Application Passport",
    "SOLAR Application Offer Letter",
    "Photograph",
    "Financial Documents",
    "Address Details",
    "Declaration Form",
  ];

  const fetchData = async () => {
    try {
      const res = await dispatch(getOneStudentApplication(id));
      setApplicationData(res?.data?.data);
    } catch {
      toast.error("Failed to fetch application data");
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      passport: null,
      offerLetter: null,
      photograph: null,
      financialDocuments: null,
      addressDetails: null,
      declarationForm: null,
      studentPassFee: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      studentPassFee: Yup.number().typeError("Enter valid amount").nullable(),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        let hasUpdate = false;
        const formData = new FormData();

        const oldFee =
          applicationData?.visaApplicationDetails?.singaporeSolarSubmission
            ?.studentPassFee;

        if (
          values.studentPassFee !== "" &&
          String(values.studentPassFee) !== String(oldFee || "")
        ) {
          hasUpdate = true;
          formData.append(
            "visaApplicationDetails[singaporeSolarSubmission][studentPassFee]",
            values.studentPassFee
          );
        }

        Object.entries(values).forEach(([key, value]) => {
          if (value instanceof File) {
            hasUpdate = true;
            formData.append("uploadedDocument", value);
            formData.append(
              "customDocumentName",
              key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (s) => s.toUpperCase())
            );
          }
        });

        if (!hasUpdate) {
          toast.info("No changes detected");
          return;
        }

        await dispatch(updateStudentApplication(formData, id));
        await fetchData();

        toast.success("Singapore Solar Application updated successfully");
        formik.resetForm();
      } catch {
        toast.error("Update failed");
      } finally {
        setIsLoading(false);
      }
    },
  });

  /** 📧 Pending document mail */
  const sendPendingDocumentMain = (id, names) => {
    const toastId = toast.loading("Sending pending documents email...");
    dispatch(pendingDocMail(id, names))
      .then(() => {
        toast.update(toastId, {
          render: "Pending documents email sent",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        setSelectedDocsIds([]);
        setSelectedDocumentNames([]);
      })
      .catch(() => {
        toast.update(toastId, {
          render: "Failed to send email",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      });
  };

  return (
    <div className="mb-4 my-5 p-4 bg-light rounded shadow-sm">
      {isLoading && (
        <div className="loading-overlay">
          <LoadMoreButton isLoading />
        </div>
      )}

      <h5>SOLAR Application Submission</h5>

      <div className="bg-white mt-3 p-3 rounded">
        <Form onSubmit={formik.handleSubmit}>
          <Row className="mt-2">
            {/* 📄 Document Uploads */}
            {documentTypes.map((doc) => {
              const fieldKey = doc
                .toLowerCase()
                .replace(/\s+/g, "")
                .replace(/\(.*?\)/g, "");

              return (
                <Col md={6} className="mb-3" key={doc}>
                  <Form.Label>{doc}</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                    onChange={(e) =>
                      formik.setFieldValue(fieldKey, e.target.files[0])
                    }
                    className="custom-select-height"
                  />
                </Col>
              );
            })}
          </Row>
          <Row>
            {/* 💰 Student Pass Fee */}
            <Col md={6} className="mb-3">
              <Form.Label>
                Student Pass Application Fee <small>(Paid by Student)</small>
              </Form.Label>
              <Form.Control
                type="number"
                name="studentPassFee"
                placeholder="Enter amount"
                value={formik.values.studentPassFee}
                onChange={formik.handleChange}
                disabled={userRole === "Student" || userRole === "LeadStudent"}
                className="custom-select-height"
              />
            </Col>
          </Row>

          {userRole !== "Student" && userRole !== "LeadStudent" && (
            <div className="d-flex justify-content-end">
              <Button
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

      {/* 📂 Existing documents & pending mail */}
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
        handleCheckboxChangeId={(docId, docName) => {
          setSelectedDocsIds((prev) =>
            prev.includes(docId)
              ? prev.filter((i) => i !== docId)
              : [...prev, docId]
          );
          setSelectedDocumentNames((prev) =>
            prev.includes(docName)
              ? prev.filter((n) => n !== docName)
              : [...prev, docName]
          );
        }}
        selectedDocumentNames={selectedDocumentNames}
        sendPendingDocumentMain={sendPendingDocumentMain}
        fetchData={fetchData}
      />
    </div>
  );
};

export default SingaporeSolarApplicationSubmission;
