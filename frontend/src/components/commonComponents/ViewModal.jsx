import { Modal, Button, Table, Row, Col } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";

const ViewModal = ({ show, onHide, title, data, fields }) => {

  const renderValue = (field, data) => {
    try {
      if (field.render) {
        return field.render(data);
      }
      if (field.key) {
        const value = field.key
          .split(".")
          .reduce((obj, key) => obj?.[key], data);
        return value !== undefined && value !== null ? value : "N/A";
      }
      return "N/A";
    } catch (error) {
      console.error(`Error rendering field ${field.label}:`, error);
      return "Error";
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
          backgroundColor: "#fff",
          fontFamily: "Arial, sans-serif",
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        {data ? (
          <div className="container-fluid">
            {fields && fields?.length > 0 ? (
              fields?.map((section, index) => (
                <div key={index} className="mb-4">
                  <h5
                    style={{
                      color: "#053880",
                      fontWeight: "bold",
                      marginBottom: "15px",
                      fontSize: "18px",
                    }}
                  >
                    {section.title}
                  </h5>
                  {section.type === "table" ? (
                    section.data &&
                    Array.isArray(section.data) &&
                    section.data.length > 0 ? (
                      <Table className="text-nowrap border">
                        <thead>
                          <tr>
                            {section.headers.map((header, i) => (
                              <th key={i}>{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {section.renderRow(row).map((cell, cellIndex) => (
                                <td key={cellIndex}>{cell || "N/A"}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <p>No {section.title.toLowerCase()} available.</p>
                    )
                  ) : (
                    <Row className="gy-3">
                      {section.fields && Array.isArray(section.fields) ? (
                        section.fields.map((field, fieldIndex) => (
                          <Col md={4} key={fieldIndex}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                padding: "8px 0",
                                borderBottom: "1px solid #e0e0e0",
                                fontSize: "14px",
                                minHeight: "40px",
                              }}
                            >
                              <strong
                                style={{
                                  color: "#333",
                                  fontWeight: 500,
                                  flex: "0 0 40%",
                                  whiteSpace: "normal",
                                  lineHeight: "1.4",
                                }}
                              >
                                {field.label}
                              </strong>
                              <span
                                style={{
                                  color: "#666",
                                  flex: "0 0 55%",
                                  wordBreak: "break-word",
                                  whiteSpace: "normal",
                                  lineHeight: "1.4",
                                  overflow: "visible",
                                }}
                              >
                                {renderValue(field, data)}
                              </span>
                            </div>
                          </Col>
                        ))
                      ) : (
                        <p>No fields available for this section.</p>
                      )}
                    </Row>
                  )}
                </div>
              ))
            ) : (
              <p>No sections provided.</p>
            )}
          </div>
        ) : (
          <p>No details available.</p>
        )}
      </Modal.Body>
      <Modal.Footer
        style={{
          borderTop: "none",
          padding: "10px 20px",
        }}
      >
        <Button
          variant="link"
          className="custom-select-height btn border-primary text-primary text-decoration-none"
          onClick={onHide}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewModal;
