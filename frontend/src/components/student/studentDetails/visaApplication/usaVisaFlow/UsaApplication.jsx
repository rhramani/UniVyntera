import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { MdCalendarToday } from "react-icons/md";
import Select from "react-select";
import { useFormik } from "formik";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
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
import LoadMoreButton from "../../../../commonComponents/LoadMoreButton";
import DocumentHandler from "../DocumentHandler";
import { decryptData } from "../../../../../utils/encryptionUtils";

const UsaApplication = ({ id }) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
  const depositDateCalendarRef = useRef(null);
  const documentTypes = ["Application Balance Certificate"];
  const userRole = decryptData(localStorage.getItem("role"));

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
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        depositDateCalendarRef.current &&
        !depositDateCalendarRef.current.contains(event.target)
      ) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
    if (dateStr.includes("-")) {
      return new Date(dateStr);
    }
    return null;
  };
  const toISODate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formik = useFormik({
    initialValues: {
      appliedForI20: "No",
      depositFeeAmount: "",
      depositCurrencyCode: "",
      depositFeePaymentDate: "",
      balanceCertificate: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      appliedForI20: Yup.string().required("Please select an option"),
      depositFeeAmount: Yup.number(),
      depositCurrencyCode: Yup.string(),
      depositFeePaymentDate: Yup.string(),
      balanceCertificate: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const jsonData = {
          visaApplicationDetails: {
            i20Application: {
              applied: values.appliedForI20 === "Yes",
              depositFeeAmount:
                values.appliedForI20 === "Yes" ? values.depositFeeAmount : null,
              depositCurrencyCode:
                values.appliedForI20 === "Yes"
                  ? values.depositCurrencyCode
                  : "",
              depositFeePaymentDate:
                values.appliedForI20 === "Yes"
                  ? values.depositFeePaymentDate
                  : "",
            },
          },
        };

        const oldI20 =
          applicationData?.visaApplicationDetails?.i20Application || {};
        if (
          oldI20.applied !== (values.appliedForI20 === "Yes") ||
          oldI20.depositFeeAmount !==
            (values.appliedForI20 === "Yes" ? values.depositFeeAmount : null) ||
          oldI20.depositCurrencyCode !==
            (values.appliedForI20 === "Yes"
              ? values.depositCurrencyCode
              : "") ||
          oldI20.depositFeePaymentDate !==
            (values.appliedForI20 === "Yes" ? values.depositFeePaymentDate : "")
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.appliedForI20 === "Yes" && values.balanceCertificate) {
          hasFileUpload = true;
          formData = new FormData();
          formData.append("uploadedDocument", values.balanceCertificate);
          formData.append(
            "customDocumentName",
            "Application Balance Certificate"
          );
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
        toast.success("Application updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to update application:", error);
        toast.error("Failed to update application. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.i20Application) {
      const i20 = applicationData.visaApplicationDetails.i20Application;
      formik.setValues({
        appliedForI20: i20.applied ? "Yes" : "No",
        depositFeeAmount: i20.depositFeeAmount || "",
        depositCurrencyCode: i20.depositCurrencyCode || "",
        depositFeePaymentDate:
          toISODate(parseDate(i20.depositFeePaymentDate)) || "",
        balanceCertificate: "",
      });
    }
  }, [applicationData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("balanceCertificate", file);
  };

  const handleCheckboxChangeId = (docId, docName) => {
    setSelectedDocsIds((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
    setSelectedDocumentNames((prev) =>
      prev.includes(docName)
        ? prev.filter((name) => name !== docName)
        : [...prev, docName]
    );
  };

  const sendPendingDocumentMain = (id, selectedDocumentNames) => {
    const toastId = toast.loading("Sending pending documents email...");
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
          <h5>I-20 Application</h5>
        </div>
        <div className="bg-white rounded mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Applied for I-20?</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Yes"
                      id="yesApplication"
                      name="appliedForI20"
                      value="Yes"
                      checked={formik.values.appliedForI20 === "Yes"}
                      onChange={formik.handleChange}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="No"
                      id="noApplication"
                      name="appliedForI20"
                      value="No"
                      checked={formik.values.appliedForI20 === "No"}
                      onChange={formik.handleChange}
                      className="custom-radio-border"
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    {formik.errors.appliedForI20 &&
                      formik.touched.appliedForI20 && (
                        <div className="text-danger">
                          {formik.errors.appliedForI20}
                        </div>
                      )}
                  </div>
                </Form.Group>
              </Col>
              {formik.values.appliedForI20 === "Yes" && (
                <>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Deposit Fee Amount</Form.Label>
                      <div className="d-flex gap-2">
                        <Form.Control
                          type="number"
                          name="depositFeeAmount"
                          placeholder="Enter amount"
                          className="custom-select-height"
                          value={formik.values.depositFeeAmount}
                          onChange={formik.handleChange}
                          style={{
                            cursor:
                              userRole === "Student" || userRole === "LeadStudent"
                                ? "not-allowed"
                                : "pointer",
                          }}
                          disabled={userRole === "Student" || userRole === "LeadStudent"}
                        />
                        <Select
                          name="depositCurrencyCode"
                          options={[
                            { value: "USD", label: "USD" },
                            { value: "INR", label: "INR" },
                          ]}
                          value={[
                            { value: "USD", label: "USD" },
                            { value: "INR", label: "INR" },
                          ].find(
                            (option) =>
                              option.value === formik.values.depositCurrencyCode
                          )}
                          onChange={(selectedOption) =>
                            formik.setFieldValue(
                              "depositCurrencyCode",
                              selectedOption ? selectedOption.value : ""
                            )
                          }
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              height: "40px",
                              minHeight: "40px",
                              width: "130px",
                              borderRadius: "4px",
                              borderColor: "#ced4da",
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
                          placeholder="Select currency"
                          classNamePrefix="custom-select"
                          isClearable
                          isDisabled={userRole === "Student" || userRole === "LeadStudent"}
                        />
                      </div>
                      {formik.errors.depositFeeAmount &&
                        formik.touched.depositFeeAmount && (
                          <div className="text-danger">
                            {formik.errors.depositFeeAmount}
                          </div>
                        )}
                      {formik.errors.depositCurrencyCode &&
                        formik.touched.depositCurrencyCode && (
                          <div className="text-danger">
                            {formik.errors.depositCurrencyCode}
                          </div>
                        )}
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Deposit Fee Payment Date</Form.Label>
                      <div
                        style={{ position: "relative" }}
                        ref={depositDateCalendarRef}
                      >
                        <Form.Control
                          type="text"
                          name="depositFeePaymentDate"
                          className="custom-select-height"
                          placeholder="dd/mm/yyyy"
                          value={
                            formik.values.depositFeePaymentDate
                              ? formatDate(
                                  parseDate(formik.values.depositFeePaymentDate)
                                )
                              : ""
                          }
                          readOnly
                          onClick={(e) => {
                            e.preventDefault();
                            setShowCalendar(true);
                          }}
                          style={{
                            cursor:
                              userRole === "Student" || userRole === "LeadStudent"
                                ? "not-allowed"
                                : "pointer",
                            backgroundColor: "#fff",
                            paddingRight: "40px",
                          }}
                          disabled={userRole === "Student" || userRole === "LeadStudent"}
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
                              onChange={(selectedDate) => {
                                formik.setFieldValue(
                                  "depositFeePaymentDate",
                                  toISODate(selectedDate)
                                );
                                setShowCalendar(false);
                              }}
                              value={
                                parseDate(
                                  formik.values.depositFeePaymentDate
                                ) || null
                              }
                              locale="en-GB"
                              onClickOutside={() => setShowCalendar(false)}
                            />
                          </div>
                        )}
                        {formik.errors.depositFeePaymentDate &&
                          formik.touched.depositFeePaymentDate && (
                            <div className="text-danger">
                              {formik.errors.depositFeePaymentDate}
                            </div>
                          )}
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Balance Certificate Upload</Form.Label>
                      <Form.Control
                        type="file"
                        name="balanceCertificate"
                        className="custom-select-height"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                        disabled={
                          applicationData?.uploadedDocumentDetails?.some(
                            (doc) =>
                              doc.customDocumentName ===
                              "Application Balance Certificate"
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

export default UsaApplication;
