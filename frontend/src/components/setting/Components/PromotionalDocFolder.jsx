import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createFolder,
  deletePromotionalDoc,
  getOnePromotionalDoc,
  updatePromotionalDoc,
} from "../../../redux/actions/PromotionalDocument.action";
import usePermissions from "../../commonComponents/usePermissions";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const PromotionalDocFolder = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [editingItem, setEditingItem] = useState(null);
  const [editingDocIndex, setEditingDocIndex] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [search, setSearch] = useState("");
  const { canUpdate, canDelete, canRead, canCreate } = usePermissions(
    "Promotional Materials",
  );

  const fetchData = async (searchTerm = "") => {
    try {
      const res = await dispatch(getOnePromotionalDoc(id, searchTerm));
      if (res?.status === 200) {
        setEditingItem(res.data.data);
      } else {
        toast.error("No documents found for this country");
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchData(search);
    }
  }, [id, search]);

  const handleShowUploadModal = (item, docIndex = null) => {
    setEditingItem(item);
    setEditingDocIndex(docIndex);
    setShowUploadModal(true);

    if (item && docIndex !== null) {
      formik.setValues({
        folderName: item.documents[docIndex]?.folderName || "",
      });
    } else {
      formik.setValues({
        folderName: "",
      });
    }
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    formik.resetForm();
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedItem(null);
  };

  const getValidationSchema = () =>
    Yup.object({
      folderName: Yup.string().required("Promotional Folder name is required"),
    });

  const formik = useFormik({
    initialValues: {
      folderName: "",
    },
    validationSchema: getValidationSchema(),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const formData = new FormData();
        formData.append("folderName", values.folderName);

        const payload = {
          folderName: values.folderName,
        };

        let res;
        if (
          editingDocIndex !== null &&
          editingItem?.documents[editingDocIndex]?._id
        ) {
          const docId = editingItem.documents[editingDocIndex]._id;
          res = await dispatch(
            updatePromotionalDoc(editingItem._id, docId, "", formData),
          );
        } else {
          res = await dispatch(createFolder(editingItem._id, payload));
        }

        // const res = await dispatch(createFolder(editingItem._id, payload));

        if (res?.status === 200) {
          toast.success("Promotional Folder created successfully!");
          if (canRead) {
            await fetchData(search);
          }
        } else {
          toast.error(res?.data?.message || "Failed to create folder");
        }
        handleCloseUploadModal();
      } catch (error) {
        console.error("Create folder error:", error.response?.data || error);
        toast.error(error.response?.data?.message || "Failed to create folder");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDelete = async (item, docIndex) => {
    try {
      const docId = item.documents[docIndex]._id;
      const res = await dispatch(deletePromotionalDoc(item._id, docId, ""));
      if (res?.status === 200) {
        toast.success("Folder deleted successfully");
        if (canRead) {
          await fetchData(search);
        }
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete folder.");
    }
    handleCloseDeleteModal();
  };

  return (
    <>
      <div>
        <div className="form-main-heading w-100 p-2 position-sticky top-0 z-3">
          <div className="d-flex justify-content-between align-items-center">
            <h3>Promotional Folder Details</h3>
            <Button
              variant="link"
              onClick={() => navigate("/promotionalmeterials")}
              className="text-light"
            >
              <AiOutlineClose size={20} />
            </Button>
          </div>
        </div>
        <Row className="mt-5 row-sm">
          <Col md={12} lg={12} xl={12}>
            <Card className="custom-card transcation-crypto">
              <Card.Header className="border-bottom-0 d-flex justify-content-between">
                <div className="card-title">
                  Promotional Material for{" "}
                  <span className="text-primary text-decoration-underline">
                    {editingItem?.country || "-"}
                  </span>
                </div>
                <div className="d-flex gap-4">
                  {canRead && (
                    <div className="contact-search3">
                      <button type="button" className="btn border-0">
                        <i
                          className="fe fe-search fw-semibold text-muted"
                          aria-hidden="true"
                        ></i>
                      </button>
                      <Form.Control
                        type="text"
                        className="custom-select-height h-6"
                        placeholder="Search here..."
                        autoComplete="off"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  )}
                  {canCreate && (
                    <Button
                      className="custom-select-height px-3"
                      onClick={() => handleShowUploadModal(editingItem)}
                    >
                      Add Promotional Folder
                    </Button>
                  )}
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  {editingItem?.documents?.length > 0 ? (
                    editingItem.documents.map((doc, index) => (
                      <Col md={6} lg={4} xl={3} key={doc._id} className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3 p-3 border rounded shadow-sm">
                          <Link
                            to={`/document-details/${id}`}
                            state={{ folderName: doc.folderName }}
                            className="clickable-country d-flex align-items-center text-primary fw-bold text-decoration-underline-hover gap-2"
                            title="Click to view folder details"
                          >
                            {doc.folderName || "Folder"}
                          </Link>
                          <div className="d-flex gap-2">
                            {canUpdate && (
                              <span
                                className="icon-border edit-icon"
                                onClick={() =>
                                  handleShowUploadModal(editingItem, index)
                                }
                              >
                                <EditIcon />
                              </span>
                            )}
                            {canDelete && (
                              <span
                                className="icon-border delete-icon"
                                onClick={() => {
                                  setSelectedItem({
                                    item: editingItem,
                                    docIndex: index,
                                  });
                                  setShowDeleteModal(true);
                                }}
                              >
                                <DeleteIcon />
                              </span>
                            )}
                          </div>
                        </div>
                      </Col>
                    ))
                  ) : (
                    <Col>
                      <div className="text-center text-muted py-4">
                        {!canRead
                          ? "You do not have permission to view this Data"
                          : "No folders available"}
                      </div>
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Modal
          show={showUploadModal}
          onHide={handleCloseUploadModal}
          centered
          size="lg"
        >
          <Modal.Header className="form-main-heading">
            <Modal.Title>
              {editingDocIndex !== null
                ? "Update Promotional Folder"
                : "Add Promotional Folder"}
            </Modal.Title>
            <AiOutlineClose
              size={20}
              style={{ cursor: "pointer", color: "white" }}
              onClick={handleCloseUploadModal}
            />
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group controlId="folderName" className="mb-3">
                <Form.Label>Folder Name</Form.Label>
                <Form.Control
                  type="text"
                  name="folderName"
                  placeholder="Enter folder name"
                  className="custom-select-height"
                  value={formik.values.folderName}
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.touched.folderName && formik.errors.folderName
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.folderName}
                </Form.Control.Feedback>
              </Form.Group>

              <Modal.Footer className="border-0 pt-0">
                <Button
                  variant="link"
                  className="border-primary text-primary text-decoration-none"
                  style={{ borderRadius: "12px" }}
                  onClick={handleCloseUploadModal}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  className="custom-select-height"
                >
                  {editingDocIndex !== null
                    ? "Update Promotional Folder"
                    : "Add Promotional Folder"}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
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
              onClick={handleCloseDeleteModal}
            />
          </Modal.Header>
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
          <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
            <Button
              variant="light"
              className="px-4"
              onClick={handleCloseDeleteModal}
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
              onClick={() => {
                handleDelete(selectedItem.item, selectedItem.docIndex);
              }}
            >
              <i className="bi bi-trash-fill me-2"></i>Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default PromotionalDocFolder;
