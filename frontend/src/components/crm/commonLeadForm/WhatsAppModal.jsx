import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import { getAllWpCategory } from "../../../redux/actions/Whatsapp/WhatsappCategory.action";
import { getAllWpTemplate } from "../../../redux/actions/Whatsapp/WhatsappTemplate.action";
import { sendWPMessage } from "../../../redux/actions/Lead.action";

const WhatsappMessageModal = ({
  isWhatsappModalOpen,
  closeWhatsappModal,
  selectedLeadName,
  selectedMobileNumber,
  // handleSendMessage,
}) => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [otherMessage, setOtherMessage] = useState("");
  const [errors, setErrors] = useState({
    category: "",
    template: "",
    other: "",
  });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [templateOptions, setTemplateOptions] = useState([]);

  const handleSendMessage = async (payload) => {
    try {
      const apiPayload = {
        phoneNumber: payload.mobileNumber,
        categoryId: payload.categoryId,
        customMessage: payload.customMessage,
      };
      const response = await dispatch(sendWPMessage(apiPayload));
      const whatsappUrl = response.data;
      window.open(whatsappUrl?.data, "_blank");
    } catch (error) {
      console.error("Failed to send WhatsApp message:", error);
      alert(error.message || "Failed to send WhatsApp message");
    }
  };
  const fetchWpCategory = async () => {
    try {
      const res = await dispatch(getAllWpCategory(1, 100));
      const responseData = res?.data?.data?.data;
      setCategoryOptions(responseData || []);
    } catch (error) {
      console.error("Error fetching category:", error);
      setCategoryOptions([]);
    }
  };

  const fetchAllTemplates = async (category) => {
    try {
      const res = await dispatch(getAllWpTemplate(1, 100, "", category));
      const responseData = res?.data?.data?.data;
      setTemplateOptions(responseData || []);
    } catch (error) {
      console.error("Error fetching templates:", error);
      setTemplateOptions([]);
    }
  };

  useEffect(() => {
    if (isWhatsappModalOpen) {
      fetchWpCategory();
    }
  }, [isWhatsappModalOpen]);

  useEffect(() => {
    if (selectedCategory && selectedCategory !== "other") {
      fetchAllTemplates(selectedCategory);
    } else {
      setTemplateOptions([]);
      setSelectedTemplate("");
      setOtherMessage("");
    }
  }, [selectedCategory]);

  const handleSend = () => {
    let hasError = false;
    const newErrors = { category: "", template: "", other: "" };

    if (!selectedCategory) {
      newErrors.category = "Please select a category.";
      hasError = true;
    }

    if (selectedCategory !== "other" && !selectedTemplate) {
      newErrors.template = "Please select a template.";
      hasError = true;
    }

    if (selectedCategory === "other" && !otherMessage.trim()) {
      newErrors.other = "Please enter a custom message.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      leadName: selectedLeadName || "N/A",
      mobileNumber: selectedMobileNumber || "N/A",
      categoryId: selectedCategory !== "other" ? selectedCategory : null,
      customMessage:
        selectedCategory === "other" || selectedTemplate
          ? otherMessage.trim()
          : null,
    };

    handleSendMessage(payload);

    setSelectedCategory("");
    setSelectedTemplate("");
    setOtherMessage("");
    setErrors({ category: "", template: "", other: "" });
    closeWhatsappModal();
  };

  const selectStyles = {
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
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  const categoryTypeOptions = [
    ...(categoryOptions.map((doc) => ({
      value: doc._id,
      label: doc.name,
    })) || []),
    { value: "other", label: "Other" },
  ];

  const templateTypeOptions = [
    ...(templateOptions.map((doc) => ({
      value: doc._id,
      label: doc.type,
    })) || []),
  ];

  const handleTemplateChange = (selectedOption) => {
    const templateId = selectedOption?.value || "";
    setSelectedTemplate(templateId);
    setErrors((prev) => ({ ...prev, template: "" }));

    if (templateId) {
      const selectedTemplateObj = templateOptions.find(
        (template) => template._id === templateId,
      );
      setOtherMessage(selectedTemplateObj?.message || "");
    } else {
      setOtherMessage("");
    }
  };

  return (
    <Modal show={isWhatsappModalOpen} onHide={closeWhatsappModal}>
      <Modal.Header className="form-main-heading">
        <Modal.Title>Send WhatsApp Message</Modal.Title>
        <AiOutlineClose
          size={20}
          style={{ cursor: "pointer", color: "white" }}
          onClick={closeWhatsappModal}
        />
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={12} className="mb-3">
              <Form.Label>Lead Name</Form.Label>
              <Form.Control
                type="text"
                readOnly
                disabled
                value={selectedLeadName || "N/A"}
                className="custom-select-height bg-light border-0 fw-bold text-dark"
              />
            </Col>
            <Col md={12} className="mb-3">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="text"
                readOnly
                disabled
                value={selectedMobileNumber || "N/A"}
                className="custom-select-height bg-light border-0 fw-bold text-dark"
              />
            </Col>
            <Col md={12} className="mb-3">
              <Form.Label>Category</Form.Label>
              <Select
                className="custom-select-height"
                options={categoryTypeOptions}
                value={
                  selectedCategory
                    ? categoryTypeOptions.find(
                        (option) => option.value === selectedCategory,
                      )
                    : null
                }
                onChange={(selectedOption) => {
                  setSelectedCategory(selectedOption?.value || "");
                  setErrors((prev) => ({ ...prev, category: "" }));
                }}
                placeholder="Select Category"
                isClearable
                isSearchable
                classNamePrefix="custom-select"
                noOptionsMessage={() => "No category options available"}
                styles={selectStyles}
                menuPortalTarget={document.body}
              />
              {errors.category && (
                <div
                  className="text-danger mt-1"
                  style={{ fontSize: "0.875rem" }}
                >
                  {errors.category}
                </div>
              )}
            </Col>
            {selectedCategory !== "other" && (
              <Col md={12} className="mb-3">
                <Form.Label>Template</Form.Label>
                <Select
                  className="custom-select-height"
                  options={templateTypeOptions}
                  value={
                    selectedTemplate
                      ? templateTypeOptions.find(
                          (option) => option.value === selectedTemplate,
                        )
                      : null
                  }
                  onChange={handleTemplateChange}
                  placeholder="Select Template"
                  isClearable
                  isSearchable
                  classNamePrefix="custom-select"
                  noOptionsMessage={() => "No template options available"}
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                />
                {errors.template && (
                  <div
                    className="text-danger mt-1"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {errors.template}
                  </div>
                )}
              </Col>
            )}
            {(selectedCategory === "other" || selectedTemplate) && (
              <Col md={12} className="mb-3">
                <Form.Label>Custom Message</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter your custom message"
                  className="border-2 rounded-4"
                  value={otherMessage}
                  onChange={(e) => {
                    setOtherMessage(e.target.value);
                    setErrors((prev) => ({ ...prev, other: "" }));
                  }}
                  rows={4}
                />
                {errors.other && (
                  <div
                    className="text-danger mt-1"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {errors.other}
                  </div>
                )}
              </Col>
            )}
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="link"
          className="custom-add-button btn border-primary text-primary text-decoration-none"
          onClick={closeWhatsappModal}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          className="custom-add-button"
          onClick={handleSend}
        >
          Send
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WhatsappMessageModal;
