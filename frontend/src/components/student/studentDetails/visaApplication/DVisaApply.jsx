import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadIcon from "@mui/icons-material/Download";
import CancelIcon from "@mui/icons-material/Cancel";
import UploadIcon from "@mui/icons-material/Upload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import { useState, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdCalendarToday } from "react-icons/md";
import { useFormik } from "formik";
import { updateStudentApplication } from "../../../../redux/actions/Student/StudentApplication.action";
import { updateVisitorApplication } from "../../../../redux/actions/Visitor/VisitorApplication.action";
import { useDispatch } from "react-redux";
import LoadMoreButton from "../../../commonComponents/LoadMoreButton";
import { BASEURL } from "../../../../baseUrl";

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

const DVisaApply = ({
  dVisaDocsFilePaths,
  handleFileChange,
  userRole,
  formData,
  selectedDocsIds,
  getStatusColor,
  handleSingleDocumentDownload,
  id,
  setSelectedStatus,
  statusOptions,
  setRemarks,
  setSelectedDocId,
  showModal,
  setShowModal,
  selectedStatus,
  remarks,
  handleStatusChange,
  selectedDocId,
  setSelectedItem,
  setShowDeleteModal,
  toast,
  handleCheckboxChangeId,
  sendPendingDocumentMain,
  selectedDocumentNames,
  handleOtherDocUpload,
  handleVisaFlowDocumentUpload,
  fetchOneStudentDetails,
  fetchOneVisitorDetails,
  mode,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const startDateInputRef = useRef(null);

  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [endDateValue, setEndDateValue] = useState(null);
  const endDateInputRef = useRef(null);
  const dVisaApplyFormik = useFormik({
    initialValues: {
      d_visa_apply: {
        apply: formData?.visaApplicationDetails?.d_visa_apply?.apply || "no",
        startDate:
          formData?.visaApplicationDetails?.d_visa_apply?.startDate || "",
        endDate: formData?.visaApplicationDetails?.d_visa_apply?.endDate || "",
      },
      dVisaDocument: null,
    },
    onSubmit: (values, { resetForm }) => {
      handleDVisaApplySubmit(values, dVisaApplyFormik, resetForm);
    },
    enableReinitialize: true,
  });
  const handleDVisaApplySubmit = async (values, formikInstance, resetForm) => {
    const isFileUploaded = !!values.dVisaDocument;
    if (
      values.d_visa_apply.apply === "yes" &&
      (!values.d_visa_apply.startDate || !values.d_visa_apply.endDate)
    ) {
      toast.error("Please provide both start and end dates for D Visa.");
      return;
    }

    setIsLoading(true);
    try {
      let payload = {};
      if (values.d_visa_apply.apply === "yes") {
        payload = {
          visaApplicationDetails: {
            d_visa_apply: {
              startDate: values.d_visa_apply.startDate,
              endDate: values.d_visa_apply.endDate,
              apply: values.d_visa_apply.apply,
            },
          },
        };

        let uploadSuccess = true;
        let documentDetails = null;

        if (isFileUploaded) {
          const uploadResult = await handleVisaFlowDocumentUpload(
            "D Visa Document",
            values.dVisaDocument,
            resetForm,
            formikInstance
          );
          uploadSuccess = uploadResult.success;
          documentDetails = uploadResult.documentDetails;
          if (!uploadSuccess) {
            console.error("Document upload failed:", uploadResult);
            return;
          }
        }
      } else {
        payload = {
          visaApplicationDetails: {
            d_visa_apply: null,
          },
        };
      }

      const res = await dispatch(
        mode === "student"
          ? updateStudentApplication(payload, id)
          : updateVisitorApplication(payload, id)
      );
      if (res?.status !== 200) {
        console.error("API response error:", res?.data);
        toast.error(
          res?.data?.error?.message ||
            res?.data?.message ||
            "Error updating D Visa details"
        );
        return;
      }

      toast.success("D Visa details updated successfully");
      resetForm({
        values: {
          d_visa_apply: {
            apply: formData?.visaApplicationDetails?.d_visa_apply?.apply || "",
            startDate:
              formData?.visaApplicationDetails?.d_visa_apply?.startDate || "",
            endDate:
              formData?.visaApplicationDetails?.d_visa_apply?.endDate || "",
          },
        },
      });
      if (mode === "student") {
        fetchOneStudentDetails();
      } else if (mode === "visitor") {
        fetchOneVisitorDetails();
      }
    } catch (error) {
      console.error(
        "Submission error:",
        error?.response?.data || error.message
      );
      toast.error(
        error?.response?.data?.message ||
          "Failed to process request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
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
      <div className="my-5 p-4 bg-light rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center">
          <h5>D Visa Apply?</h5>
          <div className="d-flex justify-content-end align-items-center gap-3">
            {/* {dVisaDocsFilePaths?.length > 0 && (
              <div>
                {dVisaDocsFilePaths?.map((doc, index) => (
                  <Button
                    key={index}
                    variant="primary"
                    className="custom-select-height"
                    onClick={() =>
                      window.open(`${BASEURL}${doc.filePath}`, "_blank", "noopener,noreferrer")
                    }
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

        <div className="bg-white mt-3 p-3">
          <Form onSubmit={dVisaApplyFormik.handleSubmit}>
            <Form.Group className="mb-3" controlId="dVisaApply">
              <Form.Label>D Visa Apply?</Form.Label>
              <Form.Check
                inline
                type="radio"
                label="Yes"
                name="d_visa_apply.apply"
                value="yes"
                id="yes"
                checked={dVisaApplyFormik.values.d_visa_apply.apply === "yes"}
                onChange={dVisaApplyFormik.handleChange}
                className="custom-radio-border"
                disabled={userRole === "Student" || userRole === "LeadStudent"}
              />
              <Form.Check
                inline
                type="radio"
                label="No"
                name="d_visa_apply.apply"
                value="no"
                id="no"
                checked={dVisaApplyFormik.values.d_visa_apply.apply === "no"}
                onChange={dVisaApplyFormik.handleChange}
                className="custom-radio-border"
                disabled={userRole === "Student" || userRole === "LeadStudent"}
              />
            </Form.Group>

            {dVisaApplyFormik.values.d_visa_apply.apply === "yes" && (
              <>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="dVisaStartDate">
                      <Form.Label>D Visa Start Date</Form.Label>
                      <div style={{ position: "relative" }}>
                        <Form.Control
                          type="text"
                          name="d_visa_apply.startDate"
                          className="custom-select-height"
                          placeholder="dd/mm/yyyy"
                          value={
                            dVisaApplyFormik.values.d_visa_apply?.startDate
                              ? formatDate(
                                  parseDate(
                                    dVisaApplyFormik.values.d_visa_apply
                                      ?.startDate
                                  )
                                )
                              : ""
                          }
                          readOnly
                          ref={startDateInputRef}
                          onClick={() => {
                            if (
                              dVisaApplyFormik.values.d_visa_apply?.startDate
                            ) {
                              setStartDateValue(
                                parseDate(
                                  dVisaApplyFormik.values.d_visa_apply
                                    ?.startDate
                                )
                              );
                            }
                            setShowStartDateCalendar((show) => !show);
                          }}
                          style={{
                            cursor:
                              userRole === "Student" || userRole === "LeadStudent"
                                ? "not-allowed"
                                : "pointer",
                            backgroundColor: "#fff",
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
                        {showStartDateCalendar && (
                          <div
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: "0",
                              zIndex: 9999,
                              background: "#fff",
                              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                              borderRadius: "8px",
                              marginTop: "4px",
                              width: 300,
                              minWidth: 300,
                              maxWidth: 300,
                            }}
                          >
                            <Calendar
                              className="form-control m-0 p-0 border-0"
                              onChange={(selectedDate) => {
                                setStartDateValue(selectedDate);
                                dVisaApplyFormik.setFieldValue(
                                  "d_visa_apply.startDate",
                                  formatDate(selectedDate)
                                );
                                setShowStartDateCalendar(false);
                              }}
                              value={startDateValue}
                              locale="en-GB"
                            />
                          </div>
                        )}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="dVisaEndDate">
                      <Form.Label>D Visa End Date</Form.Label>
                      <div style={{ position: "relative" }}>
                        <Form.Control
                          type="text"
                          name="d_visa_apply.endDate"
                          className="custom-select-height"
                          placeholder="dd/mm/yyyy"
                          value={
                            dVisaApplyFormik.values.d_visa_apply?.endDate
                              ? formatDate(
                                  parseDate(
                                    dVisaApplyFormik.values.d_visa_apply
                                      ?.endDate
                                  )
                                )
                              : ""
                          }
                          readOnly
                          ref={endDateInputRef}
                          onClick={() => {
                            if (dVisaApplyFormik.values.d_visa_apply?.endDate) {
                              setEndDateValue(
                                parseDate(
                                  dVisaApplyFormik.values.d_visa_apply?.endDate
                                )
                              );
                            }
                            setShowEndDateCalendar((show) => !show);
                          }}
                          style={{
                            cursor:
                              userRole === "Student" || userRole === "LeadStudent"
                                ? "not-allowed"
                                : "pointer",
                            backgroundColor: "#fff",
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
                        {showEndDateCalendar && (
                          <div
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: "0",
                              zIndex: 9999,
                              background: "#fff",
                              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                              borderRadius: "8px",
                              marginTop: "4px",
                              width: 300,
                              minWidth: 300,
                              maxWidth: 300,
                            }}
                          >
                            <Calendar
                              className="form-control m-0 p-0 border-0"
                              onChange={(selectedDate) => {
                                setEndDateValue(selectedDate);
                                dVisaApplyFormik.setFieldValue(
                                  "d_visa_apply.endDate",
                                  formatDate(selectedDate)
                                );
                                setShowEndDateCalendar(false);
                              }}
                              value={endDateValue}
                              locale="en-GB"
                            />
                          </div>
                        )}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>D Visa</Form.Label>
                      <Form.Control
                        type="file"
                        name="dVisaDocument"
                        className="custom-select-height"
                        onChange={(e) => handleFileChange(e, dVisaApplyFormik)}
                        onBlur={() =>
                          dVisaApplyFormik.setFieldTouched(
                            "dVisaDocument",
                            true
                          )
                        }
                        disabled={
                          dVisaDocsFilePaths?.length > 0 ||
                          userRole === "Student" || userRole === "LeadStudent"
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}
            {userRole !== "Student" && userRole !== "LeadStudent" && (
              <div className="d-flex justify-content-end">
                <Button
                  variant="primary"
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

        {dVisaDocsFilePaths?.length > 0 && (
          <div className="mb-4 my-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="text-primary mb-0"></h6>
              {userRole !== "Student" && userRole !== "LeadStudent" && (
                <div>
                  {/* {selectedIds[selectedSection]?.length > 0 && (
                        <Button
                            variant="primary"
                            className="custom-select-height me-2"
                            onClick={() =>
                            handleAllDownloadDocument(
                                id,
                                selectedIds[selectedSection]
                            )
                            }
                        >
                            <DownloadIcon />
                            Download Document
                        </Button>
                    )} */}
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
                  >
                    Send Mail
                  </Button>
                </div>
              )}
            </div>
            <div className="table-responsive rounded">
              <Table bordered hover>
                <thead className="thead-light">
                  <tr>
                    {/* {selectedSection !== "all" && (
                            <th>
                                <Form.Check
                                type="checkbox"
                                checked={
                                    selectAllByType["rgdocument"] || false
                                }
                                onChange={() =>
                                    handleSelectAllChange(-1, "rgdocument")
                                }
                                className="custom-checkbox"
                                />
                            </th>
                        )} */}
                    {userRole !== "B2B Admin" &&
                      userRole !== "B2B Member" &&
                      userRole !== "Student" && userRole !== "LeadStudent" && <th>For Mail Send</th>}
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
                        const allowedDocuments = ["D Visa Document"];
                        const selectedCourseId =
                          formData?.visaApplicationDetails?._id;
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
                                            `visadocuments--1-${index}`
                                            ] || false
                                        }
                                        onChange={() =>
                                            handleCheckboxChange(
                                            -1,
                                            index,
                                            "visadocuments",
                                            doc._id,
                                            `visadocuments--1-${index}`
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
                                    //   doc.filePath?.split("/")?.pop() ||
                                    //   "document";
                                    // handleSingleDocumentDownload(
                                    //   id,
                                    //   doc._id,
                                    //   fileName
                                    // );
                                    const filePath = doc?.filePath;
                                          const fileName = filePath?.split("/")?.pop();
                                          handleSingleDocumentDownload(filePath, fileName);
                                  }}
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
                                  disabled={userRole === "Student" || userRole === "LeadStudent"}
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
                                    setShowModal(true);
                                  }}
                                >
                                  {(doc.status === "verified" ||
                                    doc.status === "Verified") && (
                                    <CheckCircleIcon
                                      className="me-1"
                                      style={{
                                        fontSize: "16px",
                                      }}
                                    />
                                  )}
                                  {(!doc.status ||
                                    doc.status === "unverified" ||
                                    doc.status === "Unverified") && (
                                    <CancelIcon
                                      className="me-1"
                                      style={{
                                        fontSize: "16px",
                                      }}
                                    />
                                  )}
                                  {(doc.status === "reupload" ||
                                    doc.status === "Reupload") && (
                                    <UploadIcon
                                      className="me-1"
                                      style={{
                                        fontSize: "16px",
                                      }}
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
                                <Button
                                  variant="link"
                                  className="text-danger"
                                  style={{ fontSize: "18px" }}
                                  onClick={() => {
                                    setSelectedItem(doc._id);
                                    setShowDeleteModal(true);
                                  }}
                                  title="Delete"
                                >
                                  <FaTrashAlt />
                                </Button>
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
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header className="form-main-heading">
          <Modal.Title>Update Document Status</Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={() => setShowModal(false)}
          />
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="statusSelect">
              <Form.Label>Status</Form.Label>
              <Select
                classNamePrefix="custom-select"
                value={selectedStatus || null}
                onChange={(selected) => setSelectedStatus(selected)}
                options={statusOptions}
                isClearable
                isSearchable
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="remarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="rounded-4"
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button
                variant="primary"
                className="custom-select-height"
                onClick={() => handleStatusChange(selectedDocId)}
              >
                Update
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DVisaApply;
