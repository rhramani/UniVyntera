import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";

// Reusable CustomModal Component
const CustomModal = ({
  show,
  onHide,
  title,
  formik,
  fields,
  onSubmit,
  submitLabel,
  instituteOptions = [],
  courseOptions = [],
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header className="bg-primary text-white">
        <Modal.Title>{title}</Modal.Title>
        <AiOutlineClose size={20} className="cursor-pointer" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            {fields.map((field, index) => (
              <Col md={6} className="mb-3" key={index}>
                <Form.Label>
                  {field.label} {field.isRequired && <span className="text-danger">*</span>}
                </Form.Label>
                {field.type === "select" ? (
                  <>
                    <Select
                      name={`details[0].${field.name}`}
                      options={field.name === "institute" ? instituteOptions : courseOptions}
                      value={
                        formik.values.details[0][field.name]
                          ? (field.name === "institute" ? instituteOptions : courseOptions).find(
                              (option) => option.value === formik.values.details[0][field.name]
                            )
                          : null
                      }
                      onChange={(selectedOption) => {
                        formik.setFieldValue(`details[0].${field.name}`, selectedOption ? selectedOption.value : "");
                        formik.setFieldTouched(`details[0].${field.name}`, true);
                      }}
                      placeholder={field.placeholder}
                      isClearable
                    />
                    {formik.touched.details?.[0]?.[field.name] && formik.errors.details?.[0]?.[field.name] && (
                      <div className="text-danger">{formik.errors.details[0][field.name]}</div>
                    )}
                  </>
                ) : (
                  <>
                    <Form.Control
                      type={field.type}
                      name={`details[0].${field.name}`}
                      placeholder={field.placeholder}
                      value={formik.values.details[0][field.name] || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.details?.[0]?.[field.name] && formik.errors.details?.[0]?.[field.name] && (
                      <div className="text-danger">{formik.errors.details[0][field.name]}</div>
                    )}
                  </>
                )}
              </Col>
            ))}
          </Row>
          <div className="text-right mt-3">
            <Button variant="primary" type="submit">
              {submitLabel}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CustomModal;