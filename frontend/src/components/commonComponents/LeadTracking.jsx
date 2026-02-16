import React, { useEffect, useState } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  AiOutlineClose,
  AiOutlineInfoCircle,
  AiOutlineClockCircle,
  AiOutlineUser,
} from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { applicationAndLeadProcess } from "../../redux/actions/Lead.action";
import { BASEURL } from "../../baseUrl";
import VisibilityIcon from "@mui/icons-material/Visibility";

const LeadTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [applicationProcess, setApplicationProcess] = useState([]);

  const getApplicationProcess = async () => {
    try {
      const res = await dispatch(applicationAndLeadProcess(id));
      const history = res?.data?.data?.history || [];
      setApplicationProcess(history);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  useEffect(() => {
    getApplicationProcess();
  }, [id]);

  // ✅ Robust Date Formatter: handles YYYY-MM-DD, YYYY/MM/DD, ISO, with or without time
  const formatDate = (dateValue) => {
    if (!dateValue) return "-";

    // If value includes both date & time in same string (like "2025/12/05 16:12")
    if (/^\d{4}[-/]\d{2}[-/]\d{2}\s+\d{2}:\d{2}/.test(dateValue)) {
      const [datePart] = dateValue.split(" ");
      const parts = datePart.includes("-")
        ? datePart.split("-")
        : datePart.split("/");
      const [year, month, day] = parts;
      return `${day}-${month}-${year}`;
    }

    // Handle plain YYYY-MM-DD or YYYY/MM/DD
    if (/^\d{4}[-/]\d{2}[-/]\d{2}$/.test(dateValue)) {
      const parts = dateValue.includes("-")
        ? dateValue.split("-")
        : dateValue.split("/");
      const [year, month, day] = parts;
      return `${day}-${month}-${year}`;
    }

    // Handle ISO or timestamp formats
    try {
      const date = new Date(dateValue);
      if (isNaN(date)) return "-";
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return "-";
    }
  };

  // ✅ Robust Time Formatter: handles "2025/12/05 16:12", ISO, etc.
  const formatTime = (dateValue) => {
    if (!dateValue) return "-";

    // Extract time part manually for strings like "2025/12/05 16:12"
    if (/^\d{4}[-/]\d{2}[-/]\d{2}\s+\d{2}:\d{2}/.test(dateValue)) {
      const timePart = dateValue.split(" ")[1];
      if (!timePart) return "-";
      const [hour, minute] = timePart.split(":");
      const date = new Date();
      date.setHours(hour);
      date.setMinutes(minute);
      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    // Handle ISO timestamps or Date objects
    try {
      const date = new Date(dateValue);
      if (isNaN(date)) return "-";
      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch {
      return "-";
    }
  };

  const getEventLabel = (event) => {
    switch (event) {
      case "lead_created":
        return "Lead Created";
      case "lead_assigned":
        return "Lead Assigned";
      case "lead_role_changed":
        return "Lead Role Changed";
      case "lead_branch_assigned":
        return "Branch Assigned";
      case "lead_status":
        return "Lead Status";
      case "lead_sub_status":
        return "Lead Sub Status";
      case "next_followup":
        return "Next Followup";
      case "followup_type":
        return "Followup Type";
      case "followup_completed":
        return "Followup Completed";
      case "remarks_updated":
        return "Remarks Updated";
      case "text_remark_updated":
        return "Text Remark Updated";
      case "lead_converted":
        return "Lead Converted";
      case "main_status_changed":
        return "Main Status Changed";
      case "tab_submitted":
        return "Tab Submitted";
      case "course_added":
        return "Course Added";
      case "course_status_changed":
        return "Course Status Changed";
      case "interview_scheduled":
        return "Interview Scheduled";
      case "offer_letter_acceptance":
        return "Offer Letter Acceptance";
      case "conditional_offer_letter_received":
        return "Conditional Offer Letter Received";
      case "deposit_payment":
        return "Deposit Payment";
      case "institute_fee":
        return "Institute Fee";
      case "Institute Fee Reminder Sent":
        return "Institute Fee Reminder Sent";
      case "admission_fee_paid":
        return "Admission Fee Paid";
      case "visa_step_update":
        return "Visa Application";
      case "document_uploaded":
        return "Document Uploaded";
      case "document_status_changed":
        return "Document Status Changed";
      case "student_created":
        return "Student Created";
      case "education_detail_added":
        return "Education Detail Added";
      case "entranceExam_detail_added":
        return "Entrance Exam Detail Added";
      case "purpose_details_updated":
        return "Purpose Details Updated";
      case "purpose_country_updated":
        return "Purpose Country Updated";
      case "purpose_intake_updated":
        return "Purpose Intake Updated";
      case "aptitude_exam_added":
        return "Aptitude Exam Added";
      case "work_experience_added":
        return "Work Experience Added";
      case "personal_remark_added":
        return "Personal Remark Added";
      case "emergency_detail_added":
        return "Emergency Detail Added";
      case "document_added":
        return "Document Added";
      case "education_detail_updated":
        return "Education Detail Updated";
      case "coaching_exam_updated":
        return "Coaching Exam Updated";
      case "mock_test_updated":
        return "Mock Test Updated";
      case "master_session_updated":
        return "Master Session Updated";
      case "subject_level_updated":
        return "Subject Level Updated";
      case "interested_course_updated":
        return "Interested Course Updated";
      case "document_updated":
        return "Document Updated";
      case "entranceExam_detail_updated":
        return "Entrance Exam Detail Updated";
      case "aptitudeExam_detail_updated":
        return "Aptitude Exam Detail Updated";
      case "workExperience_updated":
        return "Work Experience Updated";
      case "emergency_details_updated":
        return "Emergency Details Updated";
      case "personalDetailsRemark_details_updated":
        return "Personal Details Remark Updated";
      case "name_updated":
        return "Name Updated";
      case "contact_updated":
        return "Contact Updated";
      case "alternateContact_updated":
        return "Alternate Contact Updated";
      case "gender_updated":
        return "Gender Updated";
      case "email_updated":
        return "Email Updated";
      case "DOB_updated":
        return "DOB Updated";
      case "age_updated":
        return "Age Updated";
      case "address_updated":
        return "Address Updated";
      case "city_updated":
        return "City Updated";
      case "state_updated":
        return "State Updated";
      case "country_updated":
        return "Country Updated";
      case "passportNumber_updated":
        return "Passport Number Updated";
      case "personalDetailStatus_updated":
        return "Personal Detail Status Updated";
      case "documentDetailStatus_updated":
        return "Document Detail Status Updated";
      case "counsellingDetailStatus_updated":
        return "Counselling Detail Status Updated";
      case "loanRequired_updated":
        return "Loan Required Updated";
      case "loanAmount_updated":
        return "Loan Amount Updated";
      case "loanProvider_updated":
        return "Loan Provider Updated";
      case "visaByRG_updated":
        return "Visa By KURM Updated";
      case "accountantStatus_updated":
        return "Accountant Status Updated";
      case "b2bCommissionRemarks_updated":
        return "B2B Commission Remarks Updated";
      case "docUploadByStudent_updated":
        return "Document Upload By Student Updated";
      case "user_allocation":
        return "User Allocation";
      case "visa_allocation":
        return "Visa Allocation";
      case "CTC_Calling":
        return "CTC Calling";
      default:
        return event ? event.replace(/_/g, " ") : "-";
    }
  };

  const formatKeyLabel = (key) => {
    return key
      .replace(/_/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // ✅ Tooltip handler (Clickable links + hover text)
  const renderWithTooltip = (value) => {
    if (!value) return "-";
    const stringValue = String(value).trim();

    if (/^uploads\//i.test(stringValue)) {
      const fullUrl = `${BASEURL}/${stringValue}`;
      return (
        <OverlayTrigger placement="top" overlay={<Tooltip>View File</Tooltip>}>
          <Button
            variant="primary"
            className="custom-select-height p-1 px-2"
            size="sm"
            onClick={() => window.open(fullUrl, "_blank")}
          >
            <VisibilityIcon className="me-1" style={{ fontSize: "16px" }} />
            View
          </Button>
        </OverlayTrigger>
      );
    }

    if (/^https?:\/\//i.test(stringValue)) {
      return (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>{stringValue}</Tooltip>}
        >
          <a
            href={stringValue}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0d6efd", textDecoration: "underline" }}
          >
            {stringValue.length > 25
              ? stringValue.slice(0, 25) + "..."
              : stringValue}
          </a>
        </OverlayTrigger>
      );
    }

    // Full value rendered

    return stringValue;
  };

  // ✅ Flatten nested object (skip _id, remove "Data" and "Value" prefixes)
  const flattenObject = (obj, parentKey = "", result = {}) => {
    for (const [key, value] of Object.entries(obj)) {
      if (key.toLowerCase().includes("_id")) continue;

      // Clean unwanted words like "Data" or "Value" from parent labels
      let cleanedParent = parentKey
        .replace(/\bData\b/gi, "")
        .replace(/\bValue\b/gi, "")
        .trim();

      const labelKey = cleanedParent
        ? `${cleanedParent} ${formatKeyLabel(key)}`
        : formatKeyLabel(key);

      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        Object.keys(value).length > 0
      ) {
        flattenObject(value, labelKey.trim(), result);
      } else if (value !== "" && value !== null && value !== undefined) {
        result[labelKey.trim()] = value;
      }
    }
    return result;
  };

  // ✅ Generate columns dynamically per event
  const getColumnsForEvent = (item) => {
    const baseColumns = [
      {
        label: "Event Name",
        key: "event",
        render: () => getEventLabel(item.event),
      },
    ];

    let flatValue = {};
    if (typeof item.value === "object" && !Array.isArray(item.value)) {
      flatValue = flattenObject(item.value);
    }

    const valueKeys = Object.keys(flatValue);

    if (valueKeys.length > 0) {
      valueKeys.forEach((key) => {
        const val = flatValue[key];
        const labelBase = key.trim();

        // ✅ If key contains "DateTime", split it into separate columns
        if (
          /(DateTime|Datetime|dateTime)$/i.test(labelBase) &&
          typeof val === "string" &&
          val.includes(" ")
        ) {
          const [datePart] = val.split(" ");
          const timePart = val.split(" ")[1];

          baseColumns.push({
            label: labelBase.replace(/DateTime/i, "Date"),
            key: `${key}_date`,
            render: () => formatDate(datePart),
          });

          baseColumns.push({
            label: labelBase.replace(/DateTime/i, "Time"),
            key: `${key}_time`,
            render: () => formatTime(val),
          });
        }

        // ✅ If it's just a date (without time)
        else if (
          key.toLowerCase().includes("date") &&
          typeof val === "string" &&
          !val.includes(":")
        ) {
          baseColumns.push({
            label: labelBase,
            key,
            render: () => formatDate(val),
          });
        }

        // ✅ Handle normal date/time combo (like ISO or timestamp)
        else if (
          key.toLowerCase().includes("date") ||
          key.toLowerCase().includes("time")
        ) {
          baseColumns.push({
            label: labelBase,
            key,
            render: () => {
              const formattedDate = formatDate(val);
              const formattedTime =
                String(val).includes("T") || String(val).includes(":")
                  ? formatTime(val)
                  : "";
              return `${formattedDate}${
                formattedTime ? " " + formattedTime : ""
              }`;
            },
          });
        }

        // ✅ Handle normal string/boolean/number values
        else {
          baseColumns.push({
            label: labelBase,
            key,
            render: () => {
              if (typeof val === "boolean") return val ? "Yes" : "No";
              return renderWithTooltip(val);
            },
          });
        }
      });
    } else {
      baseColumns.push({
        label: "Event Value / Details",
        key: "value",
        render: () => renderWithTooltip(item.value),
      });
    }

    // ✅ Add default metadata columns
    baseColumns.push(
      {
        label: "Updated Time",
        key: "time",
        render: () => formatTime(item.date),
      },
      {
        label: "Updated By",
        key: "updatedByName",
        render: () => item?.updatedByName || "-",
      },
    );

    return baseColumns;
  };

  return (
    <>
      <div
        className="form-main-heading p-2 position-sticky top-0 z-3"
        style={{ width: "100%" }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h3>History</h3>
          <Button
            variant="link"
            onClick={() => {
              if (location.state?.from) {
                navigate(location.state.from, { state: location.state });
              } else {
                navigate(-1);
              }
            }}
            className="text-light"
          >
            <AiOutlineClose size={20} />
          </Button>
        </div>
      </div>

      <div className="leadtrack-wrapper">
        {applicationProcess && applicationProcess.length > 0 ? (
          <div className="leadtrack-timeline">
            {applicationProcess.map((item, index) => {
              // Filter out 'event' key as it's shown in title, keep others for grid
              const columns = getColumnsForEvent(item).filter(
                (c) => c.key !== "event",
              );

              return (
                <div key={index} className="leadtrack-timeline-item">
                  <div className="leadtrack-timeline-dot"></div>
                  <div className="leadtrack-timeline-content">
                    <div className="leadtrack-timeline-title mb-3 d-flex justify-content-between align-items-center">
                      <div>
                        <span className="fw-bold">
                          {getEventLabel(item.event)}
                        </span>
                        <span className="mx-2 text-muted">/</span>
                        <span className="text-white">
                          {formatDate(item.date)}
                        </span>
                      </div>
                    </div>

                    {/* Grid Layout Replacement for DataTable */}
                    <div
                      className="card border shadow-sm"
                      style={{ borderRadius: "10px" }}
                    >
                      <div className="card-body">
                        <div className="row g-3">
                          {columns.map((col, i) => (
                            <div className="col-12 col-md-6 col-lg-4" key={i}>
                              <div
                                className="text-uppercase text-muted fw-bold"
                                style={{
                                  fontSize: "0.75rem",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                {col.label}
                              </div>
                              <div
                                className="mt-1"
                                style={{
                                  fontWeight: 500,
                                  wordBreak: "break-word",
                                }}
                              >
                                {col.render
                                  ? col.render(item)
                                  : item[col.key] || "-"}
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Footer section for metadata */}
                        {/* <div className="mt-4 pt-3 border-top d-flex justify-content-end text-muted small align-items-center">
                          <span className="me-3 d-flex align-items-center">
                            <AiOutlineClockCircle className="me-1" />{" "}
                            {formatTime(item.date)}
                          </span>
                          <span className="d-flex align-items-center">
                            <AiOutlineUser className="me-1" /> Updated by:{" "}
                            <strong className="ms-1">
                              {item.updatedByName || "-"}
                            </strong>
                          </span>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="text-center py-5 fs-5 fw-semibold"
            style={{ color: "#dc3545" }}
          >
            <AiOutlineInfoCircle
              size={24}
              className="mb-2"
              style={{ color: "#dc3545" }}
            />
            <br />
            No History is available at the moment.
          </div>
        )}
      </div>
    </>
  );
};

export default LeadTracking;
