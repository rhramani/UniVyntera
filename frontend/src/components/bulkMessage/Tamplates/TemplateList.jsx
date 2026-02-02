import TemplateCard from './TemplateCard';
import { Modal, Button } from 'react-bootstrap';
import { AiOutlineClose } from 'react-icons/ai';

const TemplateList = ({
  templates,
  isOpen,
  setIsOpen,
  confirmDelete,
  handleConfirmDelete,
  showDelete = true,
  showRadio = true,
  selectedTemplate,
  onTemplateSelect,
}) => {
  return (
    <>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {templates?.map((template, index) => (
          <div key={index} className="col">
            <TemplateCard
              template={template}
              onDelete={() => confirmDelete(template.name)}
              showDelete={showDelete}
              showRadio={showRadio}
              radioValue={template.name}
              selectedValue={selectedTemplate?.name}
              onRadioChange={() => onTemplateSelect(template)}
              isSelected={selectedTemplate?.name === template.name}
            />
          </div>
        ))}
      </div>

      {isOpen && (
        <Modal show={isOpen} onHide={() => setIsOpen(false)} centered>
          <Modal.Header className="form-main-heading">
            <Modal.Title className="fw-semibold">Confirm Deletion</Modal.Title>
            <AiOutlineClose
              size={20}
              style={{ cursor: 'pointer', color: 'white' }}
              onClick={() => setIsOpen(false)}
            />
          </Modal.Header>
          <Modal.Body className="text-center py-4">
            <div className="text-danger text-primary fs-1 mb-3">
              <i className="bi bi-exclamation-triangle-fill"></i>
            </div>
            <p className="mb-1 fw-semibold">Are you sure you want to delete this item?</p>
            <small className="text-muted">This action cannot be undone.</small>
          </Modal.Body>
          <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
            <Button
              variant="light"
              className="btn-cancel-delete px-4"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="btn-delete-confirm"
              onClick={() => {
                handleConfirmDelete();
                setIsOpen(false);
              }}
            >
              <i className="bi bi-trash-fill me-2"></i>Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default TemplateList;