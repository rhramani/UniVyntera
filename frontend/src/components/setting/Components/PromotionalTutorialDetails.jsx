import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import usePermissions from "../../commonComponents/usePermissions";
import {
  deletePromotionalTutorial,
  getOnePromotionalTutorial,
  updatePromotionalTutorial,
  createSubPromotionalTutorial,
} from "../../../redux/actions/promotionalTutorial.action";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";

const PromotionalTutorialDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editingDocIndex, setEditingDocIndex] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [search, setSearch] = useState("");
  const { canCreate, canUpdate, canDelete, canRead } =
    usePermissions("Webinar");

  const fetchData = useCallback(
    async (searchTerm = "") => {
      try {
        const res = await dispatch(getOnePromotionalTutorial(id, searchTerm));
        if (res?.status === 200) {
          const item = res?.data?.data;
          setEditingItem(item);
          setSelectedDocuments(item || []);
        }
      } catch (error) {
        console.error("Fetch Webinar error:", error);
        toast.error(error.response?.data?.message || "Failed to fetch Webinar");
      }
    },
    [dispatch, id],
  );

  useEffect(() => {
    if (canRead) {
      fetchData(search);
    }
  }, [dispatch, id, search, canRead, fetchData]);

  const handleShowUploadModal = (item, docIndex = null) => {
    setEditingItem(item);
    setEditingDocIndex(docIndex);
    setShowUploadModal(true);

    if (item && docIndex !== null) {
      formik.setValues({
        name: item.videos[docIndex]?.name || "",
        url: item.videos[docIndex]?.urls[0]?.link || "",
      });
    } else {
      formik.setValues({
        name: "",
        url: "",
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

  const formik = useFormik({
    initialValues: {
      url: "",
      name: "",
    },
    validationSchema: Yup.object({
      url: Yup.string().required("Tutorial URL is required"),
      name: Yup.string().required("Tutorial name is required"),
    }),
    onSubmit: async (values) => {
      try {
        let payload;
        let res;
        if (editingDocIndex !== null) {
          // Update existing tutorial
          const videoId = editingItem.videos[editingDocIndex]._id;
          const fileId = editingItem.videos[editingDocIndex].urls[0]._id;
          payload = {
            name: values.name,
            urls: [values.url],
          };
          res = await dispatch(
            updatePromotionalTutorial(
              editingItem._id,
              videoId,
              fileId,
              payload,
            ),
          );
        } else {
          // Create new tutorial
          payload = {
            name: values.name,
            urls: [values.url],
          };
          res = await dispatch(
            createSubPromotionalTutorial(editingItem._id, payload),
          );
        }

        if (res?.status === 200) {
          toast.success(
            editingDocIndex !== null
              ? "Promotional Webinar updated successfully!"
              : "Promotional Webinar added successfully!",
          );
          if (canRead) {
            await fetchData(search);
          }
        }
        handleCloseUploadModal();
      } catch (error) {
        console.error("Error:", error.response?.data || error);
        toast.error(
          error.response?.data?.message ||
            `Failed to ${editingDocIndex !== null ? "update" : "add"} Webinar`,
        );
      }
    },
  });

  const handleDelete = async (item, docIndex) => {
    try {
      const videoId = item.videos[docIndex]._id;
      const res = await dispatch(deletePromotionalTutorial(item._id, videoId));
      if (res?.status === 200) {
        if (item.videos.length === 1) {
          toast.success("Promotional Webinar deleted successfully");
        }
        if (canRead) {
          await fetchData(search);
        }
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete Webinar.");
    }
    handleCloseDeleteModal();
  };

  return (
    <>
      <div>
        <div className="form-main-heading w-100 p-3 position-sticky top-0 z-3">
          <div className="d-flex justify-content-between align-items-center">
            <h3>Promotional Webinar Details</h3>
            <Button
              variant="link"
              onClick={() => navigate("/promotionaltutorial/webinar")}
              className="text-light"
            >
              <AiOutlineClose size={20} />
            </Button>
          </div>
        </div>
        <Row className="mt-3 p-4 row-sm">
          <Col md={12} lg={12} xl={12}>
            <Card className="custom-card transcation-crypto">
              <Card.Header className="border-bottom-0 d-flex justify-content-between">
                <div className="card-title d-flex align-items-center gap-2">
                  <i className="bi bi-play-circle text-primary fs-4"></i>
                  <span>Promotional Webinar for</span>
                  <span className="text-primary fw-bold">
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
                      Add Promotional Webinar
                    </Button>
                  )}
                </div>
              </Card.Header>
              <Card.Body>
                {selectedDocuments?.videos?.length > 0 ? (
                  <div className="table-responsive">
                    <table className="modern-premium-table">
                      <thead>
                        <tr>
                          <th style={{ width: "60px" }}>No</th>
                          <th>Webinar Name</th>
                          <th>Created info</th>
                          <th className="text-center">View</th>
                          {(canUpdate || canDelete) && (
                            <th className="text-center">Actions</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDocuments?.videos?.map((doc, index) => (
                          <tr key={doc._id}>
                            <td className="fw-semibold text-muted">
                              {index + 1}
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <div
                                  className="file-icon-bg d-flex align-items-center justify-content-center"
                                  style={{
                                    width: "35px",
                                    height: "35px",
                                    borderRadius: "8px",
                                    background: "#f8fafc",
                                  }}
                                >
                                  <OndemandVideoIcon
                                    style={{
                                      fontSize: "20px",
                                      color: "#6c5ffc",
                                    }}
                                  />
                                </div>
                                <span className="fw-bold text-dark">
                                  {doc.name || "Webinar"}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex flex-column">
                                <span className="text-muted small">
                                  <strong>By:</strong>{" "}
                                  {selectedDocuments?.createdByName ||
                                    "Unknown"}
                                </span>
                                <span
                                  className="text-muted extra-small"
                                  style={{ fontSize: "10px" }}
                                >
                                  <strong>On:</strong>{" "}
                                  {selectedDocuments?.createdAt
                                    ? new Date(
                                        selectedDocuments.createdAt,
                                      ).toLocaleDateString("en-GB")
                                    : "N/A"}
                                </span>
                              </div>
                            </td>
                            <td className="text-center">
                              {doc.urls && doc.urls[0]?.link ? (
                                <button
                                  className="icon-border view-icon"
                                  onClick={() =>
                                    window.open(doc.urls[0].link, "_blank")
                                  }
                                  title="Open Webinar"
                                >
                                  <VisibilityIcon
                                    style={{ fontSize: "18px" }}
                                  />
                                </button>
                              ) : (
                                <span className="text-muted small">No URL</span>
                              )}
                            </td>
                            <td className="text-center">
                              <div className="d-flex justify-content-center gap-2">
                                {canUpdate && (
                                  <button
                                    className="icon-border edit-icon"
                                    title="Edit"
                                    onClick={() =>
                                      handleShowUploadModal(editingItem, index)
                                    }
                                  >
                                    <EditIcon style={{ fontSize: "18px" }} />
                                  </button>
                                )}
                                {canDelete && (
                                  <button
                                    className="icon-border delete-icon"
                                    title="Delete"
                                    onClick={() => {
                                      setSelectedItem({
                                        item: editingItem,
                                        docIndex: index,
                                      });
                                      setShowDeleteModal(true);
                                    }}
                                  >
                                    <DeleteIcon style={{ fontSize: "18px" }} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center text-muted py-4">
                    {!canRead
                      ? "You do not have permission to view this Data"
                      : "No webinars available"}
                  </div>
                )}
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
                ? "Update Promotional Webinar"
                : "Add Promotional Webinar"}
            </Modal.Title>
            <AiOutlineClose
              size={20}
              style={{ cursor: "pointer", color: "white" }}
              onClick={handleCloseUploadModal}
            />
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group controlId="name" style={{ marginBottom: "20px" }}>
                <Form.Label>Tutorial Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  className="custom-select-height"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  placeholder="Enter Name"
                  autoCapitalize="off"
                  isInvalid={formik.touched.name && formik.errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="url" style={{ marginBottom: "20px" }}>
                <Form.Label>Tutorial URL</Form.Label>
                <Form.Control
                  type="text"
                  name="url"
                  className="custom-select-height"
                  value={formik.values.url}
                  onChange={formik.handleChange}
                  placeholder="Enter URL (e.g., YouTube, google drive link)"
                  autoCapitalize="off"
                  isInvalid={formik.touched.url && formik.errors.url}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.url}
                </Form.Control.Feedback>
              </Form.Group>

              <Modal.Footer style={{ borderTop: "none", paddingTop: 0 }}>
                <Button
                  variant="link"
                  style={{
                    border: "1px solid #4B3C88",
                    color: "#4B3C88",
                    textDecoration: "none",
                    borderRadius: "12px",
                    padding: "5px 20px",
                  }}
                  onClick={handleCloseUploadModal}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  style={{
                    backgroundColor: "#4B3C88",
                    border: "none",
                    borderRadius: "12px",
                    padding: "5px 20px",
                  }}
                >
                  {editingDocIndex !== null
                    ? "Update Promotional Webinar"
                    : "Upload Promotional Webinar"}
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
          <Modal.Body style={{ textAlign: "center", padding: "40px 0" }}>
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
            <small className="text-muted text-white">
              You won’t be able to undo this action.
            </small>
          </Modal.Body>
          <Modal.Footer
            style={{
              borderTop: "none",
              justifyContent: "center",
              gap: "15px",
              paddingBottom: "30px",
            }}
          >
            <Button
              variant="light"
              style={{ padding: "5px 20px", borderRadius: "5px" }}
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
              <i
                className="bi bi-trash-fill"
                style={{ marginRight: "5px" }}
              ></i>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default PromotionalTutorialDetails;
