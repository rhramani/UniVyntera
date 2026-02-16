import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Card } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import { useDispatch } from "react-redux";
import TemplatePicture from "../../../assets/images/template image/BrowseMedia.png";
import { toast } from "react-toastify";
import { getTemplates } from "../../../redux/actions/BulkMessage/Template.action";
import { BASEURL } from "../../../baseUrl";

const categoryOption = [
  { label: "Authentication", value: "authentication" },
  { label: "Marketing", value: "marketing" },
  { label: "Utility", value: "utility" },
];

const WaDaddyWhatsAppModal = ({ show, onClose, data, onSubmit }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: data?.name || "",
    mobile: data?.mobile || "",
    category: "",
    categoryLabel: "",
    template: "",
  });

  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [variableMapping, setVariableMapping] = useState({});
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState("");
  const [mediaUploading, setMediaUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  useEffect(() => {
    if (data) {
      setFormData({
        name: data?.name || "",
        mobile: data?.mobile || "",
        category: "",
        categoryLabel: "",
        template: "",
      });
    }
  }, [data]);

  const fetchAllTemplates = async (categoryLabel) => {
    try {
      setLoadingTemplates(true);
      const res = await dispatch(getTemplates(categoryLabel));
      const responseData = res?.data?.data || [];
      setTemplates(responseData);
    } catch (error) {
      console.error("Error fetching templates:", error);
      setTemplates([]);
      toast.error("Failed to load templates");
    } finally {
      setLoadingTemplates(false);
    }
  };

  const approvedTemplates = templates.filter((t) => t.status === "APPROVED");
  const templateOptions = approvedTemplates?.map((template) => ({
    value: template.id,
    label: template.name,
  }));

  useEffect(() => {
    if (formData.categoryLabel) {
      fetchAllTemplates(formData.categoryLabel);
    } else {
      setTemplates([]);
      setSelectedTemplate(null);
    }
  }, [formData.categoryLabel]);

  const handleChange = (field, value, label = "") => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "category" && { categoryLabel: label }),
    }));
    if (field === "category") {
      setSelectedTemplate(null);
      setVariableMapping({});
      setMediaFile(null);
      setMediaUrl("");
      setMediaPreviewUrl("");
      setUploadedFileName("");
      if (value) {
        fetchAllTemplates(label);
      } else {
        setTemplates([]);
      }
    }
  };

  const extractVariables = (template) => {
    const bodyText =
      template?.components.find((c) => c.type === "BODY")?.text || "";
    const matches = [...bodyText.matchAll(/{{(\d+)}}/g)];
    const vars = {};
    matches.forEach(([, index]) => {
      vars[index] = { field: "", default: "" };
    });
    setVariableMapping(vars);
  };

  const getFieldValue = (index) => {
    const mapping = variableMapping[index];
    if (!mapping) return "";
    switch (mapping.field) {
      case "firstName":
        return data?.name?.split(" ")[0] || mapping.default || "";
      case "lastName":
        return data?.name?.split(" ")[1] || mapping.default || "";
      case "fullName":
        return data?.name || mapping.default || "";
      default:
        return mapping.default || "";
    }
  };

  const handleMediaUpload = async () => {
    if (!mediaFile || mediaUploading) return null;
    if (mediaUrl) return mediaUrl;

    const formDataObj = new FormData();
    formDataObj.append("file", mediaFile);
    setMediaUploading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASEURL}/chatbox/media/upload-sample-media`, {
        method: "POST",
        body: formDataObj,
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.message) {
        setMediaUrl(data.message);
        toast.success("Media uploaded successfully!");
        return data.message;
      } else {
        toast.error("Upload failed: media_id not returned");
        return null;
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload failed: Network or server error");
      return null;
    } finally {
      setMediaUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTemplate) return;
    setSending(true);

    const header = selectedTemplate.components.find((c) => c.type === "HEADER");
    const body = selectedTemplate.components.find((c) => c.type === "BODY");
    const hasVariables = /{{\d+}}/.test(body?.text || "");
    const format = header?.format?.toUpperCase();
    let mediaIdToUse = null;

    if (["IMAGE", "VIDEO", "DOCUMENT"].includes(format) && mediaFile) {
      const uploadedId = await handleMediaUpload();
      if (!uploadedId) {
        toast.error("Message send aborted due to failed media upload.");
        setSending(false);
        return;
      }
      mediaIdToUse = uploadedId;
    }

    const bodyParams = Object.keys(variableMapping)
      .sort((a, b) => +a - +b)
      .map((index) => getFieldValue(index));

    const payload = {
      to: formData.mobile,
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      fromNumberId: "917359266930",
      languageCode: selectedTemplate.language || "en",
      parameters: {
        body: hasVariables ? bodyParams : [],
        ...(mediaIdToUse && {
          header: {
            type: format.toLowerCase(),
            value: mediaIdToUse,
            ...(uploadedFileName && { filename: uploadedFileName }),
          },
        }),
      },
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${BASEURL}/chatbox/campaign/send-single-message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (res.ok) {
        toast.success("Message sent successfully!");
        onClose();
      } else {
        toast.error(`Failed to send message`);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Network error while sending message");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <style>
        {`
          .custom-loader {
            width: 24px;
            height: 24px;
            border: 3px solid #fff;
            border-bottom-color: transparent;
            border-radius: 50%;
            display: inline-block;
            box-sizing: border-box;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <Modal show={show} onHide={onClose} size="lg" centered>
        <Modal.Header className="bg-primary text-white">
          <Modal.Title>Send Message Using Template</Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer" }}
            onClick={onClose}
          />
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Select
                  options={categoryOption}
                  value={
                    categoryOption.find(
                      (opt) => opt.value === formData.category
                    ) || null
                  }
                  onChange={(selected) => {
                    handleChange(
                      "category",
                      selected ? selected.value : "",
                      selected ? selected.label : ""
                    );
                  }}
                  placeholder="Select Category"
                  isClearable
                  classNamePrefix="custom-select"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Template</Form.Label>
                {loadingTemplates ? (
                  <div>
                    <span className="custom-loader"></span> Loading...
                  </div>
                ) : (
                  <Select
                    options={templateOptions}
                    value={
                      templateOptions.find(
                        (option) => option.value === selectedTemplate?.id
                      ) || null
                    }
                    onChange={(selectedOption) => {
                      const template = approvedTemplates.find(
                        (t) => t.id === selectedOption?.value
                      );
                      if (template) {
                        setSelectedTemplate(template);
                        extractVariables(template);
                      } else {
                        setSelectedTemplate(null);
                        setVariableMapping({});
                      }
                    }}
                    placeholder="Choose a template"
                    isClearable
                    classNamePrefix="custom-select"
                  />
                )}
              </Form.Group>
            </Col>

            {selectedTemplate && (
              <Col md={6}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title className="fw-bold">
                      {selectedTemplate.name} ({selectedTemplate.language})
                    </Card.Title>

                    {(() => {
                      const header = selectedTemplate.components.find(
                        (c) => c.type === "HEADER"
                      );
                      const format = header?.format?.toUpperCase();

                      return (
                        <>
                          <h6 className="fw-bold mt-3">Header</h6>
                          {format === "TEXT" && (
                            <p className="text-muted">{header?.text}</p>
                          )}
                          {["IMAGE", "VIDEO", "DOCUMENT"].includes(format) && (
                            <Form.Group>
                              {!mediaFile && (
                                <Button
                                  variant="link"
                                  className="p-0"
                                  onClick={() => {
                                    const input =
                                      document.createElement("input");
                                    input.type = "file";
                                    input.accept =
                                      "image/*,video/*,.pdf,.doc,.docx";
                                    input.onchange = (e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        setMediaFile(file);
                                        setUploadedFileName(file.name);
                                        setMediaUrl("");
                                        if (file.type.startsWith("image/")) {
                                          setMediaPreviewUrl(
                                            URL.createObjectURL(file)
                                          );
                                        } else {
                                          setMediaPreviewUrl("");
                                        }
                                      }
                                    };
                                    input.click();
                                  }}
                                >
                                  <img
                                    src={TemplatePicture}
                                    alt="Select Media"
                                    style={{ maxWidth: "150px" }}
                                    className="img-fluid"
                                  />
                                </Button>
                              )}

                              {mediaPreviewUrl && (
                                <div className="mt-2">
                                  <p className="fw-medium">Image Preview:</p>
                                  <img
                                    src={mediaPreviewUrl}
                                    alt="Selected"
                                    className="img-fluid rounded"
                                    style={{ maxWidth: "200px" }}
                                  />
                                </div>
                              )}

                              {mediaFile && !mediaUrl && (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  className="custom-select-height mt-2"
                                  onClick={handleMediaUpload}
                                  disabled={mediaUploading}
                                  style={{ width: "120px" }}
                                >
                                  <div
                                    className="d-flex justify-content-center align-items-center"
                                    style={{ height: "100%" }}
                                  >
                                    {mediaUploading ? (
                                      <div
                                        style={{
                                          width: "24px",
                                          marginTop: "4px",
                                        }}
                                      >
                                        <span className="custom-loader"></span>
                                      </div>
                                    ) : (
                                      "Upload Media"
                                    )}
                                  </div>
                                </Button>
                              )}

                              {mediaUrl && !mediaUploading && (
                                <p className="text-success mt-2">
                                  ✅ Media uploaded successfully
                                </p>
                              )}
                            </Form.Group>
                          )}
                        </>
                      );
                    })()}

                    <h6 className="fw-bold mt-3">Body</h6>
                    <p
                      className="text-muted"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {
                        selectedTemplate.components.find(
                          (c) => c.type === "BODY"
                        )?.text
                      }
                    </p>

                    {Object.keys(variableMapping).length > 0 && (
                      <Form.Group className="mt-3">
                        <h6 className="fw-bold">Variables</h6>
                        {Object.entries(variableMapping).map(
                          ([index, value]) => (
                            <Row
                              key={index}
                              className="mb-2 align-items-center"
                            >
                              <Col xs={2}>
                                <span>{`{{${index}}}`}</span>
                              </Col>
                              <Col xs={5}>
                                <Form.Select
                                  size="sm"
                                  value={value.field}
                                  onChange={(e) =>
                                    setVariableMapping((prev) => ({
                                      ...prev,
                                      [index]: {
                                        ...prev[index],
                                        field: e.target.value,
                                      },
                                    }))
                                  }
                                >
                                  <option value="" disabled>
                                    Select Field
                                  </option>
                                  <option value="firstName">First Name</option>
                                  <option value="lastName">Last Name</option>
                                  <option value="fullName">Full Name</option>
                                </Form.Select>
                              </Col>
                              <Col xs={5}>
                                <Form.Control
                                  type="text"
                                  size="sm"
                                  placeholder="Default"
                                  value={value.default}
                                  onChange={(e) =>
                                    setVariableMapping((prev) => ({
                                      ...prev,
                                      [index]: {
                                        ...prev[index],
                                        default: e.target.value,
                                      },
                                    }))
                                  }
                                />
                              </Col>
                            </Row>
                          )
                        )}
                      </Form.Group>
                    )}

                    {selectedTemplate.components.find(
                      (c) => c.type === "FOOTER"
                    ) && (
                      <p className="mt-3 fst-italic text-muted">
                        {
                          selectedTemplate.components.find(
                            (c) => c.type === "FOOTER"
                          )?.text
                        }
                      </p>
                    )}

                    {selectedTemplate.components.find(
                      (c) => c.type === "BUTTONS"
                    )?.buttons?.length > 0 && (
                      <div className="d-flex gap-2 mt-3">
                        {selectedTemplate.components
                          .find((c) => c.type === "BUTTONS")
                          ?.buttons.map((btn, i) => (
                            <Button
                              key={i}
                              variant="outline-primary"
                              className="custom-select-height"
                            >
                              {btn.text}
                            </Button>
                          ))}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            )}
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
            onClick={handleSubmit}
            disabled={(() => {
              if (!selectedTemplate) return true;

              const header = selectedTemplate.components.find(
                (c) => c.type === "HEADER"
              );
              const headerFormat = header?.format?.toUpperCase();

              const requiresMedia = ["IMAGE", "VIDEO", "DOCUMENT"].includes(
                headerFormat
              );
              const mediaMissing = requiresMedia && !mediaUrl;

              const hasVariables = Object.keys(variableMapping).length > 0;
              const anyVariableIncomplete =
                hasVariables &&
                Object.values(variableMapping).some(
                  (v) => !v.field && !v.default
                );

              return mediaMissing || anyVariableIncomplete || sending;
            })()}
            style={{ width: "120px" }}
          >
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "100%" }}
            >
              {sending ? (
                <div style={{ width: "24px", marginTop: "4px" }}>
                  <span className="custom-loader"></span>
                </div>
              ) : (
                "Send"
              )}
            </div>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default WaDaddyWhatsAppModal;
