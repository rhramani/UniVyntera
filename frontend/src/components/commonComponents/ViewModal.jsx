import {
  Modal,
  Button,
  Table,
  Row,
  Col,
  Card,
  Badge,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import {
  MdInfoOutline,
  MdHistory,
  MdContactPhone,
  MdSchool,
  MdWorkOutline,
  MdCreditCard,
  MdPersonOutline,
  MdOutlineLayers,
  MdOutlineAssignmentInd,
  MdOutlineMail,
  MdPhone,
  MdLocationOn,
  MdCalendarToday,
  MdOutlineMessage,
  MdOutlineQueryStats,
  MdOutlinePaid,
  MdOutlineAssignment,
  MdOutlineRateReview,
  MdOutlineCategory,
  MdOutlineLink,
} from "react-icons/md";

const ViewModal = ({ show, onHide, title, data, fields }) => {
  const getSectionIcon = (sectionTitle) => {
    const t = sectionTitle.toLowerCase();
    if (t.includes("lead"))
      return (
        <MdPersonOutline
          className="me-2"
          style={{ color: "#6366f1" }}
          size={22}
        />
      );
    if (t.includes("follow"))
      return (
        <MdHistory className="me-2" style={{ color: "#f59e0b" }} size={22} />
      );
    if (t.includes("inquiry"))
      return (
        <MdInfoOutline
          className="me-2"
          style={{ color: "#3b82f6" }}
          size={22}
        />
      );
    if (t.includes("education") || t.includes("course"))
      return (
        <MdSchool className="me-2" style={{ color: "#10b981" }} size={22} />
      );
    if (t.includes("work") || t.includes("family"))
      return (
        <MdWorkOutline
          className="me-2"
          style={{ color: "#8b5cf6" }}
          size={22}
        />
      );
    if (t.includes("visa"))
      return (
        <MdCreditCard className="me-2" style={{ color: "#ef4444" }} size={22} />
      );
    if (t.includes("refer"))
      return (
        <MdContactPhone
          className="me-2"
          style={{ color: "#ec4899" }}
          size={22}
        />
      );
    if (t.includes("review"))
      return (
        <MdOutlineLayers
          className="me-2"
          style={{ color: "#06b6d4" }}
          size={22}
        />
      );
    return (
      <MdOutlineAssignmentInd
        className="me-2"
        style={{ color: "#6b7280" }}
        size={22}
      />
    );
  };

  const getFieldIcon = (label) => {
    const l = label.toLowerCase();
    if (l.includes("email"))
      return (
        <MdOutlineMail
          className="me-2"
          style={{ color: "#4f46e5" }}
          size={16}
        />
      );
    if (l.includes("phone") || l.includes("contact"))
      return (
        <MdPhone className="me-2" style={{ color: "#059669" }} size={16} />
      );
    if (
      l.includes("country") ||
      l.includes("city") ||
      l.includes("address") ||
      l.includes("nationality") ||
      l.includes("pincode")
    )
      return (
        <MdLocationOn className="me-2" style={{ color: "#dc2626" }} size={16} />
      );
    if (
      l.includes("date") ||
      l.includes("year") ||
      l.includes("intake") ||
      l.includes("time") ||
      l.includes("age")
    )
      return (
        <MdCalendarToday
          className="me-2"
          style={{ color: "#d97706" }}
          size={16}
        />
      );
    if (
      l.includes("name") ||
      l.includes("gender") ||
      l.includes("person") ||
      l.includes("user") ||
      l.includes("assign")
    )
      return (
        <MdPersonOutline
          className="me-2"
          style={{ color: "#2563eb" }}
          size={16}
        />
      );
    if (
      l.includes("remark") ||
      l.includes("comment") ||
      l.includes("note") ||
      l.includes("description")
    )
      return (
        <MdOutlineMessage
          className="me-2"
          style={{ color: "#7c3aed" }}
          size={16}
        />
      );
    if (
      l.includes("status") ||
      l.includes("level") ||
      l.includes("type") ||
      l.includes("form")
    )
      return (
        <MdOutlineQueryStats
          className="me-2"
          style={{ color: "#db2777" }}
          size={16}
        />
      );
    if (
      l.includes("budget") ||
      l.includes("bank") ||
      l.includes("score") ||
      l.includes("marks") ||
      l.includes("fee") ||
      l.includes("paid")
    )
      return (
        <MdOutlinePaid
          className="me-2"
          style={{ color: "#059669" }}
          size={16}
        />
      );
    if (
      l.includes("course") ||
      l.includes("education") ||
      l.includes("degree") ||
      l.includes("stream") ||
      l.includes("institution") ||
      l.includes("test")
    )
      return (
        <MdSchool className="me-2" style={{ color: "#0891b2" }} size={16} />
      );
    if (
      l.includes("work") ||
      l.includes("occupation") ||
      l.includes("experience") ||
      l.includes("post") ||
      l.includes("office")
    )
      return (
        <MdWorkOutline
          className="me-2"
          style={{ color: "#4b5563" }}
          size={16}
        />
      );
    if (
      l.includes("inquiry") ||
      l.includes("source") ||
      l.includes("reference")
    )
      return (
        <MdInfoOutline
          className="me-2"
          style={{ color: "#2563eb" }}
          size={16}
        />
      );
    if (
      l.includes("reception") ||
      l.includes("hospitality") ||
      l.includes("hygiene") ||
      l.includes("cleanliness") ||
      l.includes("response") ||
      l.includes("explanation") ||
      l.includes("review")
    )
      return (
        <MdOutlineRateReview
          className="me-2"
          style={{ color: "#f59e0b" }}
          size={16}
        />
      );
    if (
      l.includes("visa") ||
      l.includes("passport") ||
      l.includes("country interested")
    )
      return (
        <MdCreditCard className="me-2" style={{ color: "#dc2626" }} size={16} />
      );

    return (
      <MdOutlineCategory
        className="me-2"
        style={{ color: "#94a3b8" }}
        size={16}
      />
    );
  };

  const renderValue = (field, data) => {
    try {
      if (field.render) {
        return field.render(data);
      }
      if (field.key) {
        const value = field.key
          .split(".")
          .reduce((obj, key) => obj?.[key], data);

        if (value === undefined || value === null || value === "")
          return <span className="text-muted">N/A</span>;

        // Intelligent rendering based on content
        if (field.label.toLowerCase().includes("status")) {
          return (
            <Badge
              pill
              bg="soft-primary"
              className="px-3 py-2 font-weight-bold"
              style={{
                backgroundColor: "#e0e7ff",
                color: "#4338ca",
                fontSize: "12px",
              }}
            >
              {value}
            </Badge>
          );
        }

        if (
          typeof value === "string" &&
          (value.includes("leadId") || value.length > 30)
        ) {
          return (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>{value}</Tooltip>}
            >
              <span
                className="text-truncate d-inline-block"
                style={{ maxWidth: "200px", cursor: "help" }}
              >
                {value}
              </span>
            </OverlayTrigger>
          );
        }

        return value;
      }
      return <span className="text-muted">N/A</span>;
    } catch (error) {
      console.error(`Error rendering field ${field.label}:`, error);
      return <Badge bg="danger">Error</Badge>;
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="xl">
      <Modal.Header className="form-main-heading">
        <Modal.Title>{title}</Modal.Title>
        <AiOutlineClose
          size={20}
          style={{ cursor: "pointer", color: "white" }}
          onClick={onHide}
        />
      </Modal.Header>

      <Modal.Body
        className="p-4"
        style={{
          maxHeight: "70vh",
          overflowY: "auto",
          backgroundColor: "#f0f2f5",
        }}
      >
        {data ? (
          <div className="container-fluid px-0">
            {fields && fields?.length > 0 ? (
              fields?.map((section, index) => {
                // If section is a table, or has fields that are not empty
                const hasData =
                  section.type === "table"
                    ? section.data && section.data.length > 0
                    : section.fields &&
                      section.fields.some((f) => {
                        const val = f.key
                          ?.split(".")
                          .reduce((obj, key) => obj?.[key], data);
                        return val !== undefined && val !== null && val !== "";
                      });

                if (!hasData) return null;

                return (
                  <Card
                    key={index}
                    className="border-0 shadow-sm mb-4 overflow-hidden"
                    style={{ borderRadius: "16px" }}
                  >
                    <Card.Header className="bg-white border-bottom py-3 px-4 d-flex align-items-center">
                      {getSectionIcon(section.title)}
                      <h6
                        className="mb-0 fw-bold text-primary text-uppercase ls-wide"
                        style={{ fontSize: "13px", letterSpacing: "1px" }}
                      >
                        {section.title}
                      </h6>
                    </Card.Header>
                    <Card.Body className="p-4">
                      {section.type === "table" ? (
                        <div className="table-responsive rounded-3 border">
                          <Table className="mb-0 align-middle">
                            <thead className="bg-light">
                              <tr>
                                {section.headers.map((header, i) => (
                                  <th
                                    key={i}
                                    className="py-3 px-4 text-muted fw-semibold small text-uppercase"
                                  >
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {section.data.map((row, rowIndex) => (
                                <tr
                                  key={rowIndex}
                                  className="border-bottom hover-bg-light transition-all"
                                >
                                  {section
                                    .renderRow(row)
                                    .map((cell, cellIndex) => (
                                      <td
                                        key={cellIndex}
                                        className="py-3 px-4 text-dark font-medium small"
                                      >
                                        {cell || (
                                          <span className="text-muted italic">
                                            N/A
                                          </span>
                                        )}
                                      </td>
                                    ))}
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      ) : (
                        <Row className="gy-4">
                          {section.fields?.map((field, fieldIndex) => {
                            const val = field.render
                              ? field.render(data)
                              : field.key
                                  ?.split(".")
                                  .reduce((obj, key) => obj?.[key], data);

                            if (val === undefined || val === null || val === "")
                              return null;

                            return (
                              <Col lg={4} md={6} key={fieldIndex}>
                                <div className="field-info group h-100 p-3 rounded-3 transition-all border bg-white shadow-sm">
                                  <label
                                    className="d-flex align-items-center text-muted small fw-semibold text-uppercase mb-2"
                                    style={{
                                      letterSpacing: "0.5px",
                                      fontSize: "11px",
                                    }}
                                  >
                                    {getFieldIcon(field.label)}
                                    {field.label}
                                  </label>
                                  <div
                                    className="text-dark fw-medium"
                                    style={{
                                      fontSize: "14px",
                                      lineHeight: "1.6",
                                    }}
                                  >
                                    {renderValue(field, data)}
                                  </div>
                                </div>
                              </Col>
                            );
                          })}
                        </Row>
                      )}
                    </Card.Body>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-5">
                <MdInfoOutline
                  size={48}
                  className="text-muted opacity-25 mb-3"
                />
                <h5 className="text-muted">No sections provided.</h5>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-5">
            <MdInfoOutline size={48} className="text-muted opacity-25 mb-3" />
            <h5 className="text-muted">No details available.</h5>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="bg-white border-top-0 px-4 py-3">
        <Button
          variant="link"
          className="custom-select-height btn border-primary text-primary text-decoration-none"
          onClick={onHide}
        >
          Close
        </Button>
      </Modal.Footer>

      <style>{`
        .ls-wide { letter-spacing: 0.1em; }
        .transition-all { transition: all 0.2s ease-in-out; }
        .hover-bg-gray:hover { background-color: #f3f4f6 !important; }
        .hover-bg-light:hover { background-color: #fafafa; }
        .hover-shadow-sm:hover { box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
        .premium-modal .modal-content {
          border: none;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .field-info {
          border: 1px solid #cbd5e1 !important;
          background-color: #f8fafc;
        }
        .field-info:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          border-color: #6366f1 !important;
          background-color: #ffffff;
        }
        .italic { font-style: italic; }
      `}</style>
    </Modal>
  );
};

export default ViewModal;
