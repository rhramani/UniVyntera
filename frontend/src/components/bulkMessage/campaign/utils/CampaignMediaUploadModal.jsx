import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Card, Row, Col, Spinner } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { BASEURL } from "../../../../baseUrl";
import { toast } from "react-toastify";
import LoadMoreButton from "../../../commonComponents/LoadMoreButton";

const CampaignMediaUploadModal = ({
  isOpen,
  onClose,
  headerFormat,
  onUploadSuccess,
  onCloseWithoutUpload,
  selectedTemplate,
}) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setPreviewUrl(null);
      setUploaded(false);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const getAcceptType = () => {
    switch (headerFormat) {
      case "IMAGE":
        return "image/*";
      case "VIDEO":
        return "video/*";
      case "DOCUMENT":
        return ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx";
      default:
        return "*/*";
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File too large. Maximum allowed size is 10MB.");
      return;
    }
    setFile(selectedFile);
    if (selectedFile && ["IMAGE", "VIDEO"].includes(headerFormat)) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASEURL}/chatbox/media/upload-sample-media`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { message } = response.data;
      if (message) {
        setUploaded(true);
        onUploadSuccess({ mediaId: message, fileName: file.name });
        toast.success("File uploaded successfully!");
        onClose();
      } else {
        throw new Error("No media_id returned");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    if (!uploaded && onCloseWithoutUpload) onCloseWithoutUpload();
    onClose();
  };

  const header = selectedTemplate?.components?.find((c) => c.type === "HEADER");
  const body = selectedTemplate?.components?.find((c) => c.type === "BODY");
  const footer = selectedTemplate?.components?.find((c) => c.type === "FOOTER");

  const renderBodyText = (text) => {
    if (!text) return "";
    return text.replace(/{{(\d+)}}/g, (_m, num) => `[Variable ${num}]`);
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
      <Modal show={isOpen} onHide={handleModalClose} centered>
        <Modal.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <Modal.Title>Upload {headerFormat}</Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer" }}
            onClick={handleModalClose}
          />
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col xs={12}>
              <Card className="bg-light border-secondary">
                <Card.Body className="p-3">
                  {header &&
                    headerFormat &&
                    ["IMAGE", "VIDEO", "DOCUMENT"].includes(headerFormat) && (
                      <div className="mb-3 text-center">
                        {headerFormat === "IMAGE" && previewUrl && (
                          <img
                            src={previewUrl}
                            alt="Media Preview"
                            className="img-fluid rounded"
                            style={{ maxHeight: "200px", objectFit: "contain" }}
                          />
                        )}
                        {headerFormat === "VIDEO" && previewUrl && (
                          <video
                            src={previewUrl}
                            controls
                            className="rounded"
                            style={{ maxHeight: "200px", width: "100%" }}
                          />
                        )}
                        {headerFormat === "DOCUMENT" && file && (
                          <div className="p-2 bg-secondary-subtle rounded text-center">
                            <p className="fw-bold mb-1">
                              Document: {file.name}
                            </p>
                            <p className="text-muted small mb-0">
                              Document preview not available
                            </p>
                          </div>
                        )}
                        {!file && (
                          <div className="p-2 bg-secondary-subtle rounded text-center">
                            <p className="text-muted mb-0">
                              No {headerFormat.toLowerCase()} uploaded
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  {body && (
                    <div className="mb-3">
                      <p
                        className="text-muted"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {renderBodyText(body.text)}
                      </p>
                    </div>
                  )}
                  {footer && (
                    <div className="text-center">
                      <p className="text-muted small fst-italic mb-0">
                        {footer.text}
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12}>
              <Form.Group controlId="fileUpload">
                <Form.Control
                  type="file"
                  className="custom-select-height"
                  accept={getAcceptType()}
                  onChange={handleFileChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="custom-select-height"
            onClick={handleUpload}
            disabled={!file || isLoading}
          >
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CampaignMediaUploadModal;
