import { Button, Col, Form, Row, Table } from "react-bootstrap";
import Select from "react-select";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import LoadMoreButton from "../../../../commonComponents/LoadMoreButton";
import { currencyCode } from "../../../../../redux/actions/CourseFinder.action";
import {
  sendFeesDeadlineEmail,
  updateStudentApplication,
} from "../../../../../redux/actions/Student/StudentApplication.action";
import DownloadIcon from "@mui/icons-material/Download";
import { FaTrashAlt } from "react-icons/fa";
import CancelIcon from "@mui/icons-material/Cancel";
import UploadIcon from "@mui/icons-material/Upload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { BASEURL } from "../../../../../baseUrl";
import {
  formatDate,
  parseDate,
  toISODate,
} from "../../../../../utils/leadsUtils";
import { useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdCalendarToday } from "react-icons/md";

const InstituteFeePayment = ({
  feeStatusOptions,
  canCreate,
  localCourses,
  formData,
  isRestrictedRole,
  userRole,
  editState,
  id,
  getFilePathsForCourse,
  setFormData,
  setOtherDocName,
  setOtherDocFile,
  fetchStudentData,
  currencyCodeData,
  otherDocFile,
  otherDocName,
  handleDocumentUpload,
  setLocalCourses,
  selectedIds,
  selectedSection,
  selectedDocsIds,
  getStatusColor,
  canDelete,
  handleSingleDocumentDownload,
  handleCheckboxChangeId,
  sendPendingDocumentMain,
  setSelectedStatus,
  statusOptions,
  setRemarks,
  setSelectedDocId,
  setShowStatusModal,
  setSelectedItem,
  setShowDeleteModal,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [feePaymentFilePaths, setFeePaymentFilePaths] = useState([]);

  const [showFeeDeadlineCalendar, setShowFeeDeadlineCalendar] = useState(false);
  const feeDeadlineRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        feeDeadlineRef.current &&
        !feeDeadlineRef.current.contains(event.target)
      ) {
        setShowFeeDeadlineCalendar(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const instituteFeePaymentFormik = useFormik({
    initialValues: {
      paymentType: "",
      feeAmount: "",
      paidAmount: "",
      dueAmount: "",
      feeStatus: "",
      currencyCode: "",
      feeDeadline: "",
      paymentDocument: null,
      remarks: "",
    },
    onSubmit: async (values, { resetForm }) => {
      await handleFeePaymentSubmit(values, resetForm);
    },
  });
  useEffect(() => {
    const fee = Number(instituteFeePaymentFormik.values.feeAmount || 0);
    const paid = Number(instituteFeePaymentFormik.values.paidAmount || 0);

    const due = Math.max(fee - paid, 0);

    instituteFeePaymentFormik.setFieldValue("dueAmount", String(due));
  }, [
    instituteFeePaymentFormik.values.feeAmount,
    instituteFeePaymentFormik.values.paidAmount,
  ]);

  const handleFeePaymentSubmit = async (values, resetForm) => {
    const updatedIndex = editState.interestedCourseIndex;
    const courseId = formData.interestedCourseDetails[updatedIndex]?._id;

    if (!courseId) {
      toast.error("Invalid course ID. Cannot update fee payment.");
      return;
    }

    if (
      values.feeStatus === "Paid" &&
      (!otherDocFile || otherDocFile.length === 0)
    ) {
      toast.error(
        "Please upload at least one payment document for this fee status."
      );
      return;
    }

    setIsLoading(true);
    try {
      let documentDetails = null;

      if (
        otherDocFile &&
        otherDocFile.length > 0 &&
        otherDocName === "Fee Payment Proof"
      ) {
        documentDetails = await handleDocumentUpload(
          otherDocName,
          otherDocFile,
          instituteFeePaymentFormik
        );
        if (!documentDetails) {
          setIsLoading(false);
          return;
        }
      }

      const interestedCourseUpdate = {
        instituteFeePayment: {
          paymentType: values.paymentType,
          feeAmount: values.feeAmount,
          paidAmount: values.paidAmount,
          dueAmount: String(values.dueAmount),
          feeStatus: values.feeStatus,
          currencyCode: values.currencyCode,
          remarks: values.remarks,
          feeDeadline: values.feeDeadline,
        },
      };

      const payload = {
        interestedCourseId: courseId,
        interestedCourseUpdate,
      };

      const res = await dispatch(updateStudentApplication(payload, id));

      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          setIsLoading(false);
          return;
        }

        toast.success("Institute fee payment updated successfully");

        const updatedCourse = {
          ...localCourses[0],
          instituteFeePayment: {
            ...localCourses[0].instituteFeePayment,
            paymentType: values.paymentType,
            feeAmount: values.feeAmount,
            paidAmount: values.paidAmount,
            dueAmount: values.dueAmount,
            feeStatus: values.feeStatus,
            currencyCode: values.currencyCode,
            remarks: values.remarks,
            feeDeadline: values.feeDeadline,
          },
          paymentDocument: documentDetails
            ? [...(localCourses[0].paymentDocument || []), ...documentDetails]
            : localCourses[0].paymentDocument,
        };

        setLocalCourses([updatedCourse]);

        setFormData({
          ...formData,
          interestedCourseDetails: formData.interestedCourseDetails.map(
            (item, index) => (index === updatedIndex ? updatedCourse : item)
          ),
        });

        resetForm();
        setOtherDocName("");
        setOtherDocFile(null);
        const paymentDocumentInput = document.querySelector(
          'input[name="paymentDocument"]'
        );
        if (paymentDocumentInput) {
          paymentDocumentInput.value = "";
        }
        instituteFeePaymentFormik.setFieldValue("paymentDocument", null);
        await fetchStudentData();
      } else {
        toast.error(
          res?.data?.message || "Error updating institute fee payment"
        );
      }
    } catch (error) {
      console.error("Error updating institute fee payment:", error);
      toast.error(
        error?.response?.data?.message || "Error updating institute fee payment"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const courseId = localCourses?.[0]?._id;
    if (courseId) {
      // Fee payment
      const feePaymentPaths = getFilePathsForCourse(
        courseId,
        formData?.uploadedDocumentDetails,
        ["Fee Payment Proof"]
      );

      setFeePaymentFilePaths(feePaymentPaths);
    }
  }, [localCourses, formData]);

  useEffect(() => {
    if (localCourses[0]) {
      // Institute Fee Payment
      instituteFeePaymentFormik.setFieldValue(
        "paymentType",
        localCourses[0]?.instituteFeePayment?.paymentType || ""
      );
      instituteFeePaymentFormik.setFieldValue(
        "feeAmount",
        localCourses[0]?.instituteFeePayment?.feeAmount || ""
      );
      instituteFeePaymentFormik.setFieldValue(
        "paidAmount",
        localCourses[0]?.instituteFeePayment?.paidAmount || ""
      );
      instituteFeePaymentFormik.setFieldValue(
        "dueAmount",
        localCourses[0]?.instituteFeePayment?.dueAmount || ""
      );
      instituteFeePaymentFormik.setFieldValue(
        "feeStatus",
        localCourses[0]?.instituteFeePayment?.feeStatus || ""
      );
      instituteFeePaymentFormik.setFieldValue(
        "currencyCode",
        localCourses[0]?.instituteFeePayment?.currencyCode || ""
      );
      instituteFeePaymentFormik.setFieldValue(
        "remarks",
        localCourses[0]?.instituteFeePayment?.remarks || ""
      );
      instituteFeePaymentFormik.setFieldValue(
        "feeDeadline",
        localCourses[0]?.instituteFeePayment?.feeDeadline || ""
      );
    }
  }, [localCourses]);

  useEffect(() => {
    instituteFeePaymentFormik.setValues({
      paymentType: localCourses[0]?.instituteFeePayment?.paymentType || "",
      feeAmount: localCourses[0]?.instituteFeePayment?.feeAmount || "",
      paidAmount: localCourses[0]?.instituteFeePayment?.paidAmount || "",
      dueAmount: localCourses[0]?.instituteFeePayment?.dueAmount || "",
      feeStatus: localCourses[0]?.instituteFeePayment?.feeStatus || "",
      currencyCode: localCourses[0]?.instituteFeePayment?.currencyCode || "",
      remarks: localCourses[0]?.instituteFeePayment?.remarks || "",
      feeDeadline: localCourses[0]?.instituteFeePayment?.feeDeadline || "",
      paymentDocument: null,
    });
  }, [localCourses]);

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
      <div className="my-5 p-4 bg-light rounded shadow-sm">
        <div className="d-flex align-items-center justify-content-between">
          <h5 className="mb-0">Institute Fee Payment</h5>
          <div className="d-flex gap-3 align-items-center">
            {feePaymentFilePaths?.length > 0 && (
              <span
                style={{
                  color: "green",
                  fontSize: "16px",
                  letterSpacing: "1px",
                }}
              >
                <strong>Payment Document Uploaded</strong>
              </span>
            )}
            {/* {feePaymentFilePaths?.length > 0 && (
                    <div className="d-flex gap-2">
                      {feePaymentFilePaths?.map((doc, index) => (
                        <Button
                          key={index}
                          variant="primary"
                          className="custom-select-height"
                          onClick={() => {
                            window.open(
                              `${BASEURL}/${doc.filePath}`,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }}
                          disabled={isRestrictedRole}
                        >
                          <VisibilityIcon
                            className="me-1"
                            style={{ fontSize: "16px" }}
                          />
                          View
                        </Button>
                      ))}
                    </div>
                  )} */}
          </div>
        </div>
        <div className="bg-white mt-3 p-3 rounded">
          <Form onSubmit={instituteFeePaymentFormik.handleSubmit}>
            <Row>
              <Col md={12} className="mb-3">
                <Form.Label>Fee Payment Method</Form.Label>
                <div className="border-bottom-0 d-flex justify-content-between mt-3 gap-3">
                  <Form.Check
                    inline
                    label="Online"
                    name="paymentType"
                    type="radio"
                    value="Online"
                    checked={
                      instituteFeePaymentFormik.values.paymentType ===
                        "Online" || "online"
                    }
                    onChange={(e) => {
                      instituteFeePaymentFormik.handleChange(e.target.value);
                      // const encryptedValue = encryptData(e.target.value);
                      // localStorage.setItem("paymentType", encryptedValue);
                    }}
                    onBlur={instituteFeePaymentFormik.handleBlur}
                    disabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
                  />
                  <Button
                    variant="primary"
                    className="custom-select-height"
                    onClick={async () => {
                      try {
                        const res = await dispatch(sendFeesDeadlineEmail(id));

                        if (res?.status === 200) {
                          toast.success(
                            res?.data?.message ||
                              "Fee payment reminder sent successfully"
                          );
                        } else {
                          toast.error(
                            res?.data?.message || "Failed to send reminder"
                          );
                        }
                      } catch (error) {
                        console.error("Reminder error:", error);
                        toast.error(
                          "Something went wrong while sending reminder"
                        );
                      }
                    }}
                  >
                    Reminder
                  </Button>
                  {/* <Form.Check
                        inline
                        label="Cash"
                        name="paymentType"
                        type="radio"
                        value="Cash"
                        checked={
                          instituteFeePaymentFormik.values.paymentType === "Cash" ||
                          decryptData(localStorage.getItem("paymentType"))
                        }
                        onChange={(e) => {
                          instituteFeePaymentFormik.handleChange(e);
                          const encryptedValue = encryptData(e.target.value);
                          localStorage.setItem("paymentType", encryptedValue);
                        }}
                        onBlur={instituteFeePaymentFormik.handleBlur}
                      /> */}
                </div>
              </Col>
              <Col md={4} className="mb-3">
                <Form.Label>Fee Status</Form.Label>
                <Select
                  name="feeStatus"
                  options={feeStatusOptions}
                  value={feeStatusOptions.find(
                    (option) =>
                      option.value ===
                      instituteFeePaymentFormik.values.feeStatus
                  )}
                  onChange={(selectedOption) => {
                    const value = selectedOption ? selectedOption.value : "";
                    instituteFeePaymentFormik.setFieldValue("feeStatus", value);
                    if (value === "Pending") {
                      instituteFeePaymentFormik.setFieldValue(
                        "paymentDocument",
                        null
                      );
                      setOtherDocFile(null);
                      setOtherDocName("");
                    }
                  }}
                  onBlur={() =>
                    instituteFeePaymentFormik.handleBlur("feeStatus")
                  }
                  placeholder="Select Fee Status"
                  className="custom-select-height"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "30px",
                      color: "black",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "black",
                      fontSize: "13px",
                    }),
                  }}
                  isDisabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
                />
              </Col>
              <Col md={4} className="mb-3">
                <Form.Label>Upload Payment Document</Form.Label>
                <Form.Control
                  type="file"
                  name="paymentDocument"
                  className="custom-select-height"
                  accept="
      image/*,
      application/pdf,
      application/msword,
      application/vnd.openxmlformats-officedocument.wordprocessingml.document,
      application/vnd.ms-excel,
      application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    "
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;

                    if (files && files.length > 0) {
                      const allowedTypes = [
                        "image/jpeg",
                        "image/png",
                        "image/jpg",
                        "application/pdf",
                        "application/msword",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "application/vnd.ms-excel",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                      ];

                      const validFiles = Array.from(files).filter((file) => {
                        if (!allowedTypes.includes(file.type)) {
                          toast.error(
                            `File ${file.name} is not a valid file type`
                          );
                          return false;
                        }
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error(
                            `File ${file.name} must be less than 5MB`
                          );
                          return false;
                        }
                        return true;
                      });

                      if (validFiles.length > 0) {
                        setOtherDocFile(validFiles);
                        instituteFeePaymentFormik.setFieldValue(
                          "paymentDocument",
                          validFiles
                        );
                        setOtherDocName("Fee Payment Proof");
                      } else {
                        setOtherDocFile(null);
                        instituteFeePaymentFormik.setFieldValue(
                          "paymentDocument",
                          null
                        );
                        setOtherDocName("");
                      }
                    } else {
                      setOtherDocFile(null);
                      instituteFeePaymentFormik.setFieldValue(
                        "paymentDocument",
                        null
                      );
                      setOtherDocName("");
                    }
                  }}
                  onBlur={() =>
                    instituteFeePaymentFormik.handleBlur("paymentDocument")
                  }
                  disabled={userRole === "Student" || userRole === "LeadStudent" || isRestrictedRole}
                />
                {instituteFeePaymentFormik.errors.paymentDocument &&
                  instituteFeePaymentFormik.touched.paymentDocument && (
                    <div
                      className="text-danger"
                      style={{ fontSize: "12px", marginTop: "5px" }}
                    >
                      {instituteFeePaymentFormik.errors.paymentDocument}
                    </div>
                  )}
                {/* {localCourses[0]?.paymentDocument?.length > 0 && (
                        <div className="mt-2">
                          {localCourses[0].paymentDocument.map((doc, index) => (
                            <div key={index}>
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                disabled={isRestrictedRole}
                              >
                                View Uploaded Document {index + 1}
                              </a>
                            </div>
                          ))}
                        </div>
                      )} */}
              </Col>
              {instituteFeePaymentFormik.values.feeStatus === "paid" && (
                <>
                  <Col md={4} className="mb-3">
                    <Form.Label>Currency Code</Form.Label>
                    <Select
                      className="custom-select-height"
                      name="currencyCode"
                      options={currencyCodeData?.map((code) => ({
                        value: code.code,
                        label: code.code,
                      }))}
                      value={currencyCodeData
                        ?.map((code) => ({
                          value: code.code,
                          label: code.code,
                        }))
                        .find(
                          (option) =>
                            option.value ===
                            instituteFeePaymentFormik.values.currencyCode
                        )}
                      onChange={(selectedOption) =>
                        instituteFeePaymentFormik.setFieldValue(
                          "currencyCode",
                          selectedOption ? selectedOption.value : ""
                        )
                      }
                      placeholder="Select Currency"
                      isClearable
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderRadius: "30px",
                          color: "black",
                          minWidth: "160px",
                          border: state.isFocused ? "1px" : base.border,
                          borderColor: state.isFocused
                            ? "#3B3665"
                            : base.borderColor,
                          boxShadow: state.isFocused
                            ? "0 0 0 1px #6C63FF"
                            : base.boxShadow,
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: "black",
                          fontSize: "13px",
                        }),
                      }}
                      isDisabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
                    />
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Label>Fee Amount</Form.Label>
                    <Form.Control
                      type="text"
                      name="feeAmount"
                      value={instituteFeePaymentFormik.values.feeAmount || ""}
                      onChange={instituteFeePaymentFormik.handleChange}
                      onBlur={instituteFeePaymentFormik.handleBlur}
                      placeholder="Enter Fee Amount"
                      className="custom-select-height"
                      disabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
                    />
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Label>Paid Amount</Form.Label>
                    <Form.Control
                      type="text"
                      name="paidAmount"
                      value={instituteFeePaymentFormik.values.paidAmount || ""}
                      onChange={instituteFeePaymentFormik.handleChange}
                      onBlur={instituteFeePaymentFormik.handleBlur}
                      placeholder="Enter Paid Amount"
                      className="custom-select-height"
                      disabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
                    />
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Label>Due Amount</Form.Label>
                    <Form.Control
                      type="text"
                      name="dueAmount"
                      value={instituteFeePaymentFormik.values.dueAmount || ""}
                      onChange={instituteFeePaymentFormik.handleChange}
                      onBlur={instituteFeePaymentFormik.handleBlur}
                      placeholder="Enter Due Amount"
                      className="custom-select-height"
                      disabled
                    />
                  </Col>
                  <Col md={8} className="mb-3">
                    <Form.Label>Remarks</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="remarks"
                      value={instituteFeePaymentFormik.values.remarks || ""}
                      onChange={instituteFeePaymentFormik.handleChange}
                      onBlur={instituteFeePaymentFormik.handleBlur}
                      placeholder="Enter Remarks"
                      // className="custom-select-height"
                      disabled={isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"}
                    />
                  </Col>
                </>
              )}
              <Col md={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Fee Deadline</Form.Label>
                  <div style={{ position: "relative" }} ref={feeDeadlineRef}>
                    <Form.Control
                      type="text"
                      placeholder="dd/mm/yyyy"
                      value={
                        instituteFeePaymentFormik.values.feeDeadline
                          ? formatDate(
                              parseDate(
                                instituteFeePaymentFormik.values.feeDeadline
                              )
                            )
                          : ""
                      }
                      readOnly
                      onClick={() => setShowFeeDeadlineCalendar(true)}
                      style={{
                        cursor:
                          userRole === "Student" || userRole === "LeadStudent" ? "not-allowed" : "pointer",
                        paddingRight: "40px",
                      }}
                      className="custom-select-height"
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
                    {showFeeDeadlineCalendar && (
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
                            instituteFeePaymentFormik.setFieldValue(
                              "feeDeadline",
                              toISODate(date)
                            );
                            setShowFeeDeadlineCalendar(false);
                          }}
                          value={
                            parseDate(
                              instituteFeePaymentFormik.values.feeDeadline
                            ) || null
                          }
                          locale="en-GB"
                        />
                      </div>
                    )}
                  </div>
                </Form.Group>
              </Col>
            </Row>
            {userRole !== "Student" && userRole !== "LeadStudent" && (canCreate || canUpdate) && (
              <div className="d-flex justify-content-end me-3">
                <Button
                  variant="primary"
                  type="submit"
                  className="custom-select-height"
                  disabled={isLoading || isRestrictedRole}
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            )}
          </Form>
        </div>
        {feePaymentFilePaths?.length > 0 && (
          <div className="mb-4 my-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="text-primary mb-0"></h6>
              <div>
                {selectedIds[selectedSection]?.length > 0 && (
                  <Button
                    variant="primary"
                    className="custom-select-height me-2"
                    onClick={() =>
                      handleAllDownloadDocument(
                        id,
                        selectedIds[selectedSection]
                      )
                    }
                    disabled={isRestrictedRole}
                  >
                    <DownloadIcon />
                    Download Document
                  </Button>
                )}
                {userRole !== "Student" && userRole !== "LeadStudent" && (
                  <Button
                    variant="primary"
                    className="custom-select-height"
                    onClick={() => {
                      if (selectedDocsIds?.length > 0) {
                        sendPendingDocumentMain(id, selectedDocumentNames);
                      } else {
                        toast.error(
                          "Please select at least one document to send via mail."
                        );
                      }
                    }}
                    disabled={isRestrictedRole}
                  >
                    Send Mail
                  </Button>
                )}
              </div>
            </div>
            <div className="table-responsive rounded">
              <Table bordered hover>
                <thead className="thead-light">
                  <tr>
                    {/* {selectedSection !== "all" && (
                            <th>
                              <Form.Check
                                type="checkbox"
                                checked={selectAllByType["rgdocument"] || false}
                                onChange={() =>
                                  handleSelectAllChange(-1, "rgdocument")
                                }
                                className="custom-checkbox"
                              />
                            </th>
                          )} */}
                    {userRole !== "B2B Admin" &&
                      userRole !== "B2B Member" &&
                      userRole !== "Student" && userRole !== "LeadStudent" && <th>Document Pendency</th>}
                    <th>Sr No</th>
                    <th>Document Name</th>
                    <th>Upload File</th>
                    <th>Download</th>
                    <th>Status</th>
                    <th>Added By</th>
                    <th>Added On</th>
                    <th>Remarks</th>
                    {userRole !== "Student" && userRole !== "LeadStudent" && (
                      <th className="sticky-col-right-last">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {formData?.uploadedDocumentDetails?.length > 0 ? (
                    formData.uploadedDocumentDetails
                      ?.filter((doc) => {
                        const allowedDocuments = ["Fee Payment Proof"];
                        const selectedCourseId =
                          formData?.interestedCourseDetails?.[
                            editState.interestedCourseIndex
                          ]?._id;
                        return (
                          doc.customDocumentName &&
                          allowedDocuments.includes(doc.customDocumentName) &&
                          doc.ref_module === selectedCourseId
                        );
                      })
                      ?.map((doc, index) => {
                        const docName =
                          doc.customDocumentName ||
                          doc.documentName ||
                          "Unnamed Document";
                        return (
                          <tr key={doc._id}>
                            {/* {selectedSection !== "all" && (
                                    <td>
                                      <Form.Check
                                        type="checkbox"
                                        checked={
                                          selectedRows[
                                            `rgdocument--1-${index}`
                                          ] || false
                                        }
                                        onChange={() =>
                                          handleCheckboxChange(
                                            -1,
                                            index,
                                            "rgdocument",
                                            doc._id,
                                            `rgdocument--1-${index}`
                                          )
                                        }
                                        disabled={doc.status === "Reupload"}
                                        className="custom-checkbox"
                                      />
                                    </td>
                                  )} */}
                            {userRole !== "B2B Admin" &&
                              userRole !== "B2B Member" &&
                              userRole !== "Student" && userRole !== "LeadStudent" && (
                                <td>
                                  <div className="form-check form-switch custom-toggle-button me-0">
                                    <input
                                      className="form-check-input three-dots-icon"
                                      type="checkbox"
                                      id={`toggle-${doc._id}-${index}`}
                                      checked={selectedDocsIds?.includes(
                                        `${doc._id}-${index}`
                                      )}
                                      onChange={() =>
                                        handleCheckboxChangeId(
                                          `${doc._id}-${index}`,
                                          docName
                                        )
                                      }
                                    />
                                  </div>
                                </td>
                              )}
                            <td>{index + 1}</td>
                            <td>{docName}</td>
                            <td>
                              {doc.status !== "Reupload" ? (
                                <span className="text-success me-2">
                                  {doc.filePath?.split("/")?.pop() || "No File"}
                                </span>
                              ) : (
                                <Form.Control
                                  type="file"
                                  accept="image/*,application/pdf"
                                  onChange={(e) =>
                                    handleOtherDocUpload(
                                      e,
                                      index,
                                      doc._id,
                                      docName
                                    )
                                  }
                                  className="custom-select-height"
                                  disabled={userRole === "Student" || userRole === "LeadStudent"}
                                />
                              )}
                            </td>
                            <td>
                              {doc.status !== "Reupload" ? (
                                <button
                                  className="btn btn-sm fw-normal rounded-4"
                                  style={{
                                    cursor: "pointer",
                                    color: "#fff",
                                    backgroundColor: "#007bff",
                                    height: "32px",
                                    width: "100px",
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    // const fileName =
                                    //   doc.filePath
                                    //     ?.split("/")
                                    //     ?.pop() || "document";
                                    // handleSingleDocumentDownload(
                                    //   id,
                                    //   doc._id,
                                    //   fileName
                                    // );
                                    const filePath = doc?.filePath;
                                    const fileName = filePath
                                      ?.split("/")
                                      ?.pop();

                                    handleSingleDocumentDownload(
                                      filePath,
                                      fileName
                                    );
                                  }}
                                  disabled={isRestrictedRole}
                                >
                                  <DownloadIcon />
                                  Download
                                </button>
                              ) : (
                                <span>-</span>
                              )}
                            </td>
                            <td>
                              {doc ? (
                                <button
                                  className="btn btn-sm fw-normal d-flex align-items-center justify-content-center rounded-4"
                                  style={{
                                    cursor: "pointer",
                                    color: "#fff",
                                    backgroundColor: getStatusColor(
                                      doc.status || "unverified"
                                    ),
                                    border: "none",
                                    borderRadius: "4px",
                                    padding: "5px 10px",
                                    height: "32px",
                                    width: "100px",
                                    fontSize: "14px",
                                  }}
                                  onClick={() => {
                                    setSelectedStatus(
                                      statusOptions.find(
                                        (opt) =>
                                          opt.value ===
                                          (doc.status || "unverified")
                                      ) ||
                                        statusOptions.find(
                                          (opt) => opt.value === "unverified"
                                        )
                                    );
                                    setRemarks(doc.remarks || "");
                                    setSelectedDocId(doc._id);
                                    setShowStatusModal(true);
                                  }}
                                  disabled={
                                    isRestrictedRole || userRole === "Student" || userRole === "LeadStudent"
                                  }
                                >
                                  {(doc.status === "verified" ||
                                    doc.status === "Verified") && (
                                    <CheckCircleIcon
                                      className="me-1"
                                      style={{ fontSize: "16px" }}
                                    />
                                  )}
                                  {(!doc.status ||
                                    doc.status === "unverified" ||
                                    doc.status === "Unverified") && (
                                    <CancelIcon
                                      className="me-1"
                                      style={{ fontSize: "16px" }}
                                    />
                                  )}
                                  {(doc.status === "reupload" ||
                                    doc.status === "Reupload") && (
                                    <UploadIcon
                                      className="me-1"
                                      style={{ fontSize: "16px" }}
                                    />
                                  )}
                                  {doc.status
                                    ? doc.status.charAt(0).toUpperCase() +
                                      doc.status.slice(1)
                                    : "Unverified"}
                                </button>
                              ) : (
                                <span>-</span>
                              )}
                            </td>
                            <td>{doc.createdByName || "-"}</td>
                            <td>
                              {doc.createdAt
                                ? new Date(doc.createdAt).toLocaleDateString(
                                    "en-GB"
                                  )
                                : "-"}
                            </td>
                            <td>{doc.remarks || "-"}</td>
                            {userRole !== "Student" && userRole !== "LeadStudent" && (
                              <td className="sticky-col-right-last">
                                {canDelete && (
                                  <Button
                                    variant="link"
                                    className="text-danger"
                                    style={{ fontSize: "18px" }}
                                    onClick={() => {
                                      setSelectedItem(doc._id);
                                      setShowDeleteModal(true);
                                    }}
                                    title="Delete"
                                    disabled={isRestrictedRole}
                                  >
                                    <FaTrashAlt />
                                  </Button>
                                )}
                              </td>
                            )}
                          </tr>
                        );
                      })
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-muted text-center">
                        No US documents available
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default InstituteFeePayment;
