import { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import LoadMoreButton from "../../../../commonComponents/LoadMoreButton";
import { useFormik } from "formik";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdCalendarToday } from "react-icons/md";
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
import Select from "react-select";
import DocumentHandler from "../DocumentHandler";
import { decryptData } from "../../../../../utils/encryptionUtils";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const CanadaGICBankAccountCreation = ({ id }) => {
  const dispatch = useDispatch();
  const [showCredential, setShowCredential] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [showAccountOpeningCalendar, setShowAccountOpeningCalendar] =
    useState(false);
  const [applicationData, setApplicationData] = useState(null);

  const accountOpeningCalendarRef = useRef(null);

  const documentTypes = ["GIC Certificate & TT Copy"];
  const userRole = decryptData(localStorage.getItem("role"));
  const [selectedDocsIds, setSelectedDocsIds] = useState([]);
  const [selectedDocumentNames, setSelectedDocumentNames] = useState([]);
  const bankOptions = [
    { value: "CIBC", label: "CIBC" },
    { value: "Scotia Bank", label: "Scotia Bank" },
    { value: "ICICI Bank", label: "ICICI Bank" },
    { value: "Other", label: "Other" },
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
    } else {
      toast.error("Invalid application ID. Please provide a valid ID.");
    }
  }, [dispatch, id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountOpeningCalendarRef.current &&
        !accountOpeningCalendarRef.current.contains(event.target)
      ) {
        setShowAccountOpeningCalendar(false);
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

  const formik = useFormik({
    initialValues: {
      bankName: "",
      customBankName: "",
      accountOpeningDate: "",
      accountNumber: "",
      loginId: "",
      password: "",
      amount: "",
      documents: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      bankName: Yup.string(),
      customBankName: Yup.string(),
      accountOpeningDate: Yup.string(),
      accountNumber: Yup.string(),
      loginId: Yup.string(),
      password: Yup.string(),
      amount: Yup.number().positive("GIC amount must be a positive number"),
      documents: Yup.mixed(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        let hasJsonChanges = false;
        let hasFileUpload = false;

        const finalBankName =
          values.bankName === "Other" ? values.customBankName : values.bankName;

        const jsonData = {
          visaApplicationDetails: {
            gicDetails: {
              bankName: finalBankName,
              accountOpeningDate: values.accountOpeningDate || "",
              accountNumber: values.accountNumber,
              loginId: values.loginId,
              password: values.password,
              amount: values.amount ? parseFloat(values.amount) : "",
            },
          },
        };

        const oldGic =
          applicationData?.visaApplicationDetails?.gicDetails || {};
        if (
          oldGic.bankName !== values.bankName ||
          oldGic.accountOpeningDate !== values.accountOpeningDate ||
          oldGic.accountNumber !== values.accountNumber ||
          oldGic.loginId !== values.loginId ||
          oldGic.password !== values.password ||
          parseFloat(oldGic.amount) !== parseFloat(values.amount || 0)
        ) {
          hasJsonChanges = true;
        }

        let formData = null;
        if (values.documents) {
          hasFileUpload = true;
          formData = new FormData();
          formData.append("uploadedDocument", values.documents);
          formData.append("customDocumentName", "GIC Certificate & TT Copy");
          formData.append(
            "ref_module",
            applicationData.visaApplicationDetails._id
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
        toast.success("GIC bank account details updated successfully!");
        resetForm();
      } catch (error) {
        console.error("Failed to update GIC bank account details:", error);
        toast.error(
          error.message ||
            "Failed to update GIC bank account details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (applicationData?.visaApplicationDetails?.gicDetails) {
      const gic = applicationData.visaApplicationDetails.gicDetails;

      const matchedOption = bankOptions.find(
        (opt) => opt.value === gic.bankName
      );

      formik.setValues({
        bankName: matchedOption ? gic.bankName : "Other",
        customBankName: matchedOption ? "" : gic.bankName,
        accountOpeningDate: gic.accountOpeningDate
          ? toISODate(parseDate(gic.accountOpeningDate))
          : "",
        accountNumber: gic.accountNumber || "",
        loginId: gic.loginId || "",
        password: gic.password || "",
        amount: gic.amount || "",
        documents: "",
      });
    }
  }, [applicationData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("documents", file);
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
      .catch(() => {
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
          <h5>GIC (Bank Account Creation)</h5>
        </div>
        <div className="bg-white mt-3 p-3">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Bank Name</Form.Label>
                  <Select
                    options={bankOptions}
                    value={bankOptions.find(
                      (option) => option.value === formik.values.bankName
                    )}
                    onChange={(selectedOption) => {
                      formik.setFieldValue(
                        "bankName",
                        selectedOption ? selectedOption.value : ""
                      );
                      if (selectedOption?.value !== "Other") {
                        formik.setFieldValue("customBankName", "");
                      }
                    }}
                    classNamePrefix="custom-select"
                    placeholder="Select Bank Name"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        height: "40px",
                        minHeight: "40px",
                        borderRadius: "4px",
                        borderColor:
                          formik.touched.bankName && formik.errors.bankName
                            ? "#dc3545"
                            : "#ced4da",
                        fontSize: "13px",
                        boxShadow: "none",
                        "&:hover": {
                          borderColor:
                            formik.touched.bankName && formik.errors.bankName
                              ? "#dc3545"
                              : "#888",
                        },
                      }),
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 9999,
                      }),
                    }}
                    isDisabled={
                      userRole === "Student" || userRole === "LeadStudent"
                    }
                  />
                  {formik.touched.bankName && formik.errors.bankName && (
                    <div className="text-danger">{formik.errors.bankName}</div>
                  )}

                  {formik.values.bankName === "Other" && (
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
                  <div
                    style={{ position: "relative" }}
                    ref={accountOpeningCalendarRef}
                  >
                    <Form.Control
                      type="text"
                      name="accountOpeningDate"
                      className="custom-select-height"
                      placeholder="dd/mm/yyyy"
                      value={
                        formik.values.accountOpeningDate
                          ? formatDate(
                              parseDate(formik.values.accountOpeningDate)
                            )
                          : ""
                      }
                      readOnly
                      onClick={() => setShowAccountOpeningCalendar(true)}
                      style={{
                        cursor:
                          userRole === "Student" || userRole === "LeadStudent"
                            ? "not-allowed"
                            : "pointer",
                        backgroundColor: "#fff",
                        paddingRight: "40px",
                      }}
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
                    {showAccountOpeningCalendar && (
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
                              "accountOpeningDate",
                              toISODate(selectedDate)
                            );
                            setShowAccountOpeningCalendar(false);
                          }}
                          value={
                            parseDate(formik.values.accountOpeningDate) ||
                            new Date()
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
                  <Form.Label>Account Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="accountNumber"
                    className="custom-select-height"
                    placeholder="Enter Account Number"
                    value={formik.values.accountNumber}
                    onChange={formik.handleChange}
                    style={{
                      cursor:
                        userRole === "Student" || userRole === "LeadStudent"
                          ? "not-allowed"
                          : "pointer",
                    }}
                    disabled={
                      userRole === "Student" || userRole === "LeadStudent"
                    }
                  />
                  {formik.touched.accountNumber &&
                    formik.errors.accountNumber && (
                      <div className="text-danger">
                        {formik.errors.accountNumber}
                      </div>
                    )}
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Login ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="loginId"
                    className="custom-select-height"
                    placeholder="Enter Login ID"
                    value={formik.values.loginId}
                    onChange={formik.handleChange}
                    style={{
                      cursor:
                        userRole === "Student" || userRole === "LeadStudent"
                          ? "not-allowed"
                          : "pointer",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.touched.loginId && formik.errors.loginId && (
                    <div className="text-danger">{formik.errors.loginId}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showCredential ? "text" : "password"}
                      placeholder="Enter password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      name="password"
                      className="custom-select-height"
                      style={{
                        cursor:
                          userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                      }}
                      disabled={userRole === "Student" || userRole === "LeadStudent"}
                    />
                    <span
                      onClick={() => setShowCredential(!showCredential)}
                      className="position-absolute top-50 end-0 translate-middle-y pe-3"
                      style={{ cursor: "pointer" }}
                    >
                      {showCredential ? (
                        <Visibility sx={{ fontSize: 18 }} />
                      ) : (
                        <VisibilityOff sx={{ fontSize: 18 }} />
                      )}
                    </span>
                  </div>
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>GIC Amount (CAD)</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    className="custom-select-height"
                    placeholder="Enter amount in CAD"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    style={{
                      cursor:
                        userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                    }}
                    disabled={userRole === "Student" || userRole === "LeadStudent"}
                  />
                  {formik.touched.amount && formik.errors.amount && (
                    <div className="text-danger">{formik.errors.amount}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>
                    Upload GIC Certificate & TT Copy (PDF/JPG)
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
                          doc.customDocumentName === "GIC Certificate & TT Copy"
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

export default CanadaGICBankAccountCreation;
