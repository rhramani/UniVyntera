import React, { useState } from "react";
import { Card, Button, Modal, Badge } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AiOutlineClose } from "react-icons/ai";
import Paginations from "../../elements/Paginations";
import { FaArrowRight } from "react-icons/fa";

const CountryWiseSteps = ({
  data,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onEdit,
  onDelete,
  rowKey = "_id",
  canEdit = true,
  canDelete = true,
  canRead = true,
  stepOptions,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProgress, setSelectedProgress] = useState(null);

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setSelectedProgress(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedProgress) {
      onDelete(selectedProgress);
    }
    setShowDeleteModal(false);
    setSelectedProgress(null);
  };

  const getStepLabel = (stepValue) => {
    const stepOption = stepOptions.find((option) => option.value === stepValue);
    return stepOption ? stepOption.label : stepValue;
  };

  return (
    <div>
      {data && data.length > 0 ? (
        data.map((progress, index) => (
          <Card className="mb-3 p-3" key={progress[rowKey] || index}>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h5 className="progress_steps_country fw-semibold mb-0">
                {progress.country}
              </h5>
              <div className="d-flex">
                {canEdit && (
                  <span
                    className="icon-border edit-icon"
                    onClick={() => onEdit(progress)}
                  >
                    <EditIcon />
                  </span>
                )}
                {canDelete && (
                  <span
                    className="icon-border delete-icon ms-2"
                    onClick={() => {
                      setSelectedProgress(progress);
                      setShowDeleteModal(true);
                    }}
                  >
                    <DeleteIcon />
                  </span>
                )}
              </div>
            </div>
            <div className="d-flex flex-wrap align-items-center">
              {progress.steps.map((step, idx) => (
                <div
                  className="d-flex align-items-center"
                  key={`${progress.country}-${idx}`}
                >
                  <Badge className="custom-badge p-2">
                    {`${idx + 1}. ${getStepLabel(step)}`}
                  </Badge>
                  {idx < progress.steps.length - 1 && (
                    <span className="mx-3">
                      <FaArrowRight color="#9890DD" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))
      ) : (
        <p className="text-muted text-center">
          {!canRead
            ? "You do not have permission to view this Data"
            : "No progress data available"}
        </p>
      )}

      {totalPages > 1 && data.length > 0 && (
        <div className="d-flex justify-content-end align-items-center mt-4">
          <Paginations
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}

      <Modal show={showDeleteModal} onHide={handleCloseModal} centered>
        <Modal.Header className="form-main-heading">
          <Modal.Title className="fw-semibold">Confirm Deletion</Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={handleCloseModal}
          />
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <div className="text-danger fs-1 mb-3">
            <i className="bi bi-exclamation-triangle-fill"></i>
          </div>
          <p className="fw-semibold mb-1">
            Are you sure you want to delete the progress steps for{" "}
            {selectedProgress?.country}?
          </p>
          <small className="text-muted">This action cannot be undone.</small>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
          <Button variant="light" className="px-4" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button className="btn-delete-confirm" onClick={handleDeleteConfirm}>
            <i className="bi bi-trash-fill me-2"></i>Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CountryWiseSteps;