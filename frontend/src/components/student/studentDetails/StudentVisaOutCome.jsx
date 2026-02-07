import VisibilityIcon from "@mui/icons-material/Visibility";
import { Button, Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import DocumentHandler from "./visaApplication/DocumentHandler";
import { useDispatch } from "react-redux";
import {
  deleteStudentApplication,
  downloadDocument,
  updateStudentApplication,
} from "../../../redux/actions/Student/StudentApplication.action";
const StudentVisaOutCome = ({
  visaOutcomeFilePaths,
  visaOutcomeFormik,
  visaOutcomeTrackingStatusOptions,
  userRole,
  isLoading,
  formData,
  id,
  selectedDocsIds,
  handleCheckboxChangeId,
  selectedDocumentNames,
  sendPendingDocumentMain,
  fetchOneStudentDetails,
}) => {
  const dispatch = useDispatch();
  return (
    <div className="my-5 p-4 bg-light rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center">
        <h5>Visa Outcome Tracking</h5>
        <div className="d-flex justify-content-end align-items-center gap-3">
          {/* {visaOutcomeFilePaths?.length > 0 && (
            <div>
              {visaOutcomeFilePaths?.map((doc, index) => (
                <Button
                  key={index}
                  variant="primary"
                  className="custom-select-height"
                  onClick={() =>
                    window.open(doc.filePath, "_blank", "noopener,noreferrer")
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
      <div className="bg-white mt-3 p-3 rounded">
        <Form onSubmit={visaOutcomeFormik.handleSubmit}>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Visa Outcome</Form.Label>
                <Select
                  options={visaOutcomeTrackingStatusOptions}
                  value={
                    visaOutcomeFormik.values.visaOutcomeStatus
                      ? visaOutcomeTrackingStatusOptions.find(
                          (option) =>
                            option.value ===
                            visaOutcomeFormik.values.visaOutcomeStatus,
                        )
                      : null
                  }
                  onChange={(selectedOption) => {
                    const newValue = selectedOption ? selectedOption.value : "";
                    visaOutcomeFormik.setFieldValue(
                      "visaOutcomeStatus",
                      newValue,
                    );
                  }}
                  onBlur={() =>
                    visaOutcomeFormik.setFieldTouched("visaOutcomeStatus", true)
                  }
                  placeholder="Select Outcome"
                  className="custom-select-height"
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
                  isDisabled={
                    userRole === "Student" || userRole === "LeadStudent"
                  }
                />
              </Form.Group>
            </Col>
            <Col md={4} className="mb-3">
              <Form.Label>Visa Outcome Proof</Form.Label>
              <Form.Control
                type="file"
                name="visaOutcomeProof"
                className="custom-select-height"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileChange(e, visaOutcomeFormik)}
                onBlur={() =>
                  visaOutcomeFormik.setFieldTouched("visaOutcomeProof", true)
                }
                // disabled={
                //   visaOutcomeFilePaths?.length > 0 || userRole === "Student"
                // }
              />
            </Col>
          </Row>
          <div className="d-flex justify-content-end me-3">
            {userRole !== "Student" && userRole !== "LeadStudent" && (
              <Button
                variant="primary"
                type="submit"
                className="custom-select-height"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            )}
          </div>
        </Form>
      </div>
      <DocumentHandler
        applicationData={formData}
        documentTypes={["Visa Outcome Proof"]}
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
        fetchData={fetchOneStudentDetails}
      />
    </div>
  );
};
export default StudentVisaOutCome;
