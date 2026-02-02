import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import WhatsAppMessagePreview from "./WhatsAppMessagePreview";
import { AiOutlineClose } from "react-icons/ai";

const AddSampleModal = ({
  isOpen,
  onClose,
  mediaType,
  messageText = "",
  headerType,
  media,
  headerText,
  footerText,
  buttonType,
  quickReplies,
  ctaButtons,
  onDone,
  bodyVariableExamples,
  setBodyVariableExamples,
}) => {
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
    }
  }, [isOpen]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const extractVariables = (text) => {
    const matches = text.match(/{{\d+}}/g);
    return [...new Set(matches || [])];
  };

  const replaceVariables = (text, variableValues) => {
    return text.replace(
      /{{\d+}}/g,
      (match) => variableValues?.[match] || match
    );
  };

  const variables = extractVariables(messageText);

  return (
    <Modal show={isOpen} onHide={onClose} size="xl" centered>
      <Modal.Header className="form-main-heading">
        <Modal.Title>Add Sample</Modal.Title>
        <AiOutlineClose
          size={20}
          style={{ cursor: "pointer", color: "white" }}
          onClick={onClose}
        />
      </Modal.Header>

      <Modal.Body>
        <Row style={{ maxHeight: "calc(90vh - 160px)" }}>
          
          <Col md={6}>
            <div className="d-flex flex-column gap-4">
              {headerType === "media" && (
                <div>
                  <h6 className="fw-semibold mb-2">
                    Upload{" "}
                    {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}
                  </h6>

                  {media || file ? (
                    <div className="border p-3 rounded bg-light d-flex justify-content-between align-items-center gap-2">
                      <span className="text-truncate">
                        {(file && file.name) ||
                          (typeof media === "string"
                            ? media.split("/").pop()
                            : "Uploaded media")}
                      </span>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setFile(null);
                          onDone(mediaType, null);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="border border-2 border-dashed rounded p-4 bg-light">
                      <Form.Control
                        type="file"
                        accept={
                          mediaType === "image"
                            ? "image/*"
                            : mediaType === "video"
                            ? "video/*"
                            : ".pdf,.doc,.docx"
                        }
                        className="custom-select-height"
                        onChange={handleFileChange}
                      />
                    </div>
                  )}
                </div>
              )}

              {variables.length > 0 && (
                <div>
                  <h6 className="fw-semibold mb-2">Variable Examples</h6>
                  <div className="d-flex flex-column gap-3">
                    {variables.map((variable) => (
                      <Form.Control
                        key={variable}
                        className="custom-select-height"
                        value={bodyVariableExamples?.[variable] || ""}
                        placeholder={`Enter example for ${variable}`}
                        onChange={(e) =>
                          setBodyVariableExamples((prev) => ({
                            ...prev,
                            [variable]: e.target.value,
                          }))
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Col>

          <Col md={6} className="ps-2">
            <div className="bg-light p-4 rounded h-100 overflow-hidden">
              <WhatsAppMessagePreview
                headerType={headerType}
                media={file || media}
                headerText={headerText}
                messageText={replaceVariables(
                  messageText,
                  bodyVariableExamples
                )}
                footerText={footerText}
                buttonType={buttonType}
                quickReplies={quickReplies}
                ctaButtons={ctaButtons}
              />
            </div>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="outline-primary"
          className="custom-select-height"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          className="custom-select-height"
          onClick={() => {
            onDone(mediaType, file instanceof File ? file : null);
            onClose();
          }}
        >
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddSampleModal;
