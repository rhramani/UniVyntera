import { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row, Table, Modal } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdCalendarToday } from "react-icons/md";
import Select from "react-select";
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

const GerBlockedAccount = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
  const userRole = decryptData(localStorage.getItem("role"));

  const documentTypes = ["Blocked Account Confirmation", "Remittance Copy"];
  const calendarRef = useRef(null);

  const dispatch = useDispatch();

  const bankOptions = [
    { value: "Deutsche Bank", label: "Deutsche Bank" },
    { value: "Expatrio", label: "Expatrio" },
    { value: "Fintiba", label: "Fintiba" },
    { value: "Others", label: "Others" },
  ];

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      return new Date(`${year}-${month}-${day}`);
    }
    if (dateStr.includes("-")) return new Date(dateStr);
    return null;
  };
  const toISODate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const isDocumentUploaded = (docType) => {
    return applicationData?.uploadedDocumentDetails?.some(
      (doc) => doc.customDocumentName === docType,
    );
  };

  const formik = useFormik({
    initialValues: {
      bankName: "",
      customBankName: "",
      accountOpeningDate: "",
      blockedAmount: "",
      confirmationUpload: "",
      remittanceUpload: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      bankName: Yup.string(),
      customBankName: Yup.string(),
      accountOpeningDate: Yup.string(),
      blockedAmount: Yup.string(),
      confirmationUpload: Yup.string(),
      remittanceUpload: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const oldBlocked =
          applicationData?.visaApplicationDetails?.blockedAccount || {};

        if (
          oldBlocked.bankName !== values.bankName ||
          oldBlocked.accountOpeningDate !== values.accountOpeningDate ||
          oldBlocked.blockedAmount !== values.blockedAmount
        ) {
          hasJsonChanges = true;
        }

        if (values.confirmationUpload || values.remittanceUpload) {
          hasFileUpload = true;
        }

        if (!hasJsonChanges && !hasFileUpload) {
          toast.info("No changes detected.");
          return;
        }

        const finalBankName =
          values.bankName === "Others"
            ? values.customBankName
            : values.bankName;

        const jsonData = {
          visaApplicationDetails: {
            blockedAccount: {
              bankName: finalBankName,
              accountOpeningDate: values.accountOpeningDate,
              blockedAmount: values.blockedAmount,
            },
          },
        };

        if (hasJsonChanges) {
          await dispatch(updateStudentApplication(jsonData, id));
        }

        const refModuleId = applicationData.visaApplicationDetails?._id;

        if (values.confirmationUpload) {
          const formData1 = new FormData();
          formData1.append("uploadedDocument", values.confirmationUpload);
          formData1.append(
            "customDocumentName",
            "Blocked Account Confirmation",
          );
          formData1.append("ref_module", refModuleId);

          await dispatch(updateStudentApplication(formData1, id));
        }

        if (values.remittanceUpload) {
          const formData2 = new FormData();
          formData2.append("uploadedDocument", values.remittanceUpload);
          formData2.append("customDocumentName", "Remittance Copy");
          formData2.append("ref_module", refModuleId);

          await dispatch(updateStudentApplication(formData2, id));
        }

        await fetchData();
        toast.success("Blocked Account details updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to update blocked account details:", error);
        toast.error(
          error.message ||
            "Failed to update blocked account details. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.blockedAccount) {
      const blockedAccount =
        applicationData.visaApplicationDetails.blockedAccount;

      const matchedOption = bankOptions.find(
        (opt) => opt.value === blockedAccount.bankName,
      );
      formik.setValues({
        bankName: matchedOption ? blockedAccount.bankName : "Others",
        customBankName: matchedOption ? "" : blockedAccount.bankName,
        accountOpeningDate: blockedAccount.accountOpeningDate
          ? toISODate(parseDate(blockedAccount.accountOpeningDate))
          : "",
        blockedAmount: blockedAccount.blockedAmount || "",
        confirmationUpload: "",
        remittanceUpload: "",
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
        <h5>Blocked Account (Banking Process)</h5>
        <div className="bg-white mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Bank Name</Form.Label>
                  <Select
                    options={bankOptions}
                    value={bankOptions.find(
                      (o) => o.value === formik.values.bankName,
                    )}
                    onChange={(selected) => {
                      formik.setFieldValue("bankName", selected?.value || "");
                      if (selected?.value !== "Others") {
                        formik.setFieldValue("customBankName", "");
                      }
                    }}
                    classNamePrefix="custom-select"
                    placeholder="Select option"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "12px",
                        color: "black",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "black",
                        fontSize: "13px",
                      }),
                    }}
                    isClearable
                    isDisabled={
                      userRole === "Student" || userRole === "LeadStudent"
                    }
                  />
                  {formik.touched.bankName && formik.errors.bankName && (
                    <div className="text-danger">{formik.errors.bankName}</div>
                  )}

                  {formik.values.bankName === "Others" && (
                    <Form.Control
                      type="text"
                      placeholder="Enter bank name"
                      className="mt-2 custom-select-height"
                      value={formik.values.customBankName || ""}
                      onChange={(e) =>
                        formik.setFieldValue("customBankName", e.target.value)
                      }
                    />
                  )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Account Opening Date</Form.Label>
                  <div style={{ position: "relative" }} ref={calendarRef}>
                    <Form.Control
                      type="text"
                      placeholder="dd/mm/yyyy"
                      value={
                        formik.values.accountOpeningDate
                          ? formatDate(
                              parseDate(formik.values.accountOpeningDate),
                            )
                          : ""
                      }
                      readOnly
                      onClick={() => setShowCalendar(true)}
                      style={{
                        cursor:
                          userRole === "Student" || userRole === "LeadStudent"
                            ? "not-allowed"
                            : "pointer",
                        paddingRight: "40px",
                      }}
                      className="custom-select-height"
                      disabled={
                        userRole === "Student" || userRole === "LeadStudent"
                      }
                    />
                    <MdCalendarToday
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#888",
                        pointerEvents: "none",
                      }}
                      size={20}
                    />
                    {showCalendar && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          zIndex: 10000,
                          background: "#fff",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                          borderRadius: "8px",
                          marginTop: "4px",
                          width: 350,
                        }}
                      >
                        <Calendar
                          className="form-control border-0"
                          onChange={(date) => {
                            formik.setFieldValue(
                              "accountOpeningDate",
                              toISODate(date),
                            );
                            setShowCalendar(false);
                          }}
                          value={
                            parseDate(formik.values.accountOpeningDate) || null
                          }
                          locale="en-GB"
                        />
                      </div>
                    )}
                    {formik.touched.accountOpeningDate &&
                      formik.errors.accountOpeningDate && (
                        <div className="text-danger">
                          {formik.errors.accountOpeningDate}
                        </div>
                      )}
                  </div>
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Blocked Amount (in EUR)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter blocked amount"
                    value={formik.values.blockedAmount}
                    onChange={formik.handleChange}
                    name="blockedAmount"
                    className="custom-select-height"
                    style={{
                      cursor:
                        userRole === "Student" || userRole === "LeadStudent"
                          ? "not-allowed"
                          : "",
                    }}
                    disabled={
                      userRole === "Student" || userRole === "LeadStudent"
                    }
                  />
                  {formik.touched.blockedAmount &&
                    formik.errors.blockedAmount && (
                      <div className="text-danger">
                        {formik.errors.blockedAmount}
                      </div>
                    )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Upload Blocked Account Confirmation</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    onChange={(event) =>
                      formik.setFieldValue(
                        "confirmationUpload",
                        event.currentTarget.files[0],
                      )
                    }
                    className="custom-select-height"
                    disabled={
                      isDocumentUploaded("Blocked Account Confirmation") ||
                      userRole === "Student" ||
                      userRole === "LeadStudent"
                    }
                  />
                  {formik.touched.confirmationUpload &&
                    formik.errors.confirmationUpload && (
                      <div className="text-danger">
                        {formik.errors.confirmationUpload}
                      </div>
                    )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Upload Remittance (TT Copy)</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    onChange={(event) =>
                      formik.setFieldValue(
                        "remittanceUpload",
                        event.currentTarget.files[0],
                      )
                    }
                    className="custom-select-height"
                    disabled={
                      isDocumentUploaded("Remittance Copy") ||
                      userRole === "Student" ||
                      userRole === "LeadStudent"
                    }
                  />
                  {formik.touched.remittanceUpload &&
                    formik.errors.remittanceUpload && (
                      <div className="text-danger">
                        {formik.errors.remittanceUpload}
                      </div>
                    )}
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

export default GerBlockedAccount;
