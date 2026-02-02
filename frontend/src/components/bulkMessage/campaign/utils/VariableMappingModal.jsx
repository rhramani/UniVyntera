import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, Card } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";

const VariableMappingModal = ({
  isOpen,
  onClose,
  messageBody = "",
  onSave,
  variableFields = [],
}) => {
  const [mappings, setMappings] = useState({});

  const fieldOptions = variableFields.map((field) => ({
    value: field,
    label: field.charAt(0).toUpperCase() + field.slice(1),
  }));

  const handleFieldChange = (index, selectedOption) => {
    setMappings((prev) => ({
      ...prev,
      [index]: { ...prev[index], field: selectedOption?.value || "" },
    }));
  };

  const handleDefaultChange = (index, value) => {
    setMappings((prev) => ({
      ...prev,
      [index]: { ...prev[index], default: value },
    }));
  };

  const renderMessageWithInlineControls = () => {
    const parts = messageBody.split(/({{\d+}})/g);

    return (
      <div className="d-flex flex-wrap align-items-center gap-2">
        {parts.map((part, i) => {
          const match = part.match(/{{(\d+)}}/);
          if (match) {
            const index = match[1];
            return (
              <Row key={i} className="align-items-center g-2 mb-2 w-100">
                <Col md={5}>
                  <Select
                    options={fieldOptions}
                    value={
                      fieldOptions.find(
                        (opt) => opt.value === mappings[index]?.field
                      ) || null
                    }
                    onChange={(option) => handleFieldChange(index, option)}
                    placeholder="Select field"
                    isClearable
                    classNamePrefix="custom-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: "13px",
                      }),
                    }}
                  />
                </Col>
                <Col xs="auto">
                  <span className="fw-semibold text-muted">OR</span>
                </Col>
                <Col md={5}>
                  <Form.Control
                    type="text"
                    placeholder="Default Value"
                    value={mappings[index]?.default || ""}
                    onChange={(e) => handleDefaultChange(index, e.target.value)}
                    className="custom-select-height"
                  />
                </Col>
              </Row>
            );
          }
          return (
            <span key={i} className="me-1">
              {part}
            </span>
          );
        })}
      </div>
    );
  };

  const handleSave = () => {
    onSave(mappings);
    onClose();
  };

  return (
    <Modal show={isOpen} onHide={onClose} size="lg" centered>
      <Modal.Header className="form-main-heading">
        <Modal.Title>Map Template Variables</Modal.Title>
        <AiOutlineClose
          size={20}
          style={{ cursor: "pointer", color: "white" }}
          onClick={onClose}
        />
      </Modal.Header>

      <Modal.Body>
        <p className="text-muted">
          Customize the message by mapping fields to variables. You can also
          provide a fallback default.
        </p>

        <Card className="p-3 bg-light border">
          {renderMessageWithInlineControls()}
        </Card>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-primary" className="custom-select-height" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" className="custom-select-height" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VariableMappingModal;
