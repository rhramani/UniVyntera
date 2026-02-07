import { Modal, Button } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";

const DeleteConfirmModal = ({ show, onHide, onConfirm }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      {/* Header */}
      <Modal.Header
        className="border-0"
        style={{
          background: "linear-gradient(90deg, #dc2626, #ef4444)",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
        }}
      >
        <Modal.Title className="fw-semibold text-white">
          Confirm Deletion
        </Modal.Title>

        <AiOutlineClose
          size={18}
          style={{ cursor: "pointer", color: "white" }}
          onClick={onHide}
        />
      </Modal.Header>

      {/* Body */}
      <Modal.Body className="text-center py-4">
        <div
          className="d-flex align-items-center justify-content-center mx-auto mb-3"
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "#fee2e2",
            color: "#dc2626",
            fontSize: "32px",
          }}
        >
          <i className="bi bi-exclamation-triangle-fill"></i>
        </div>

        <p className="mb-1 fw-semibold fs-5">
          Are you sure you want to proceed with deletion?
        </p>
        <small className="text-muted">
          You won’t be able to undo this action.
        </small>
      </Modal.Body>

      {/* Footer */}
      <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
        <Button
          variant="light"
          className="px-4"
          style={{ borderRadius: "8px" }}
          onClick={onHide}
        >
          Cancel
        </Button>

        <Button
          className="px-4 text-white"
          style={{
            borderRadius: "8px",
            background: "linear-gradient(90deg, #dc2626, #ef4444)",
            border: "none",
          }}
          onClick={onConfirm}
        >
          <i className="bi bi-trash-fill me-2"></i>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmModal;
