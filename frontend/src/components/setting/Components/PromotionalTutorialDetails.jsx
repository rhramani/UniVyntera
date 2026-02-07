import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { countryDropdown } from "../../../redux/actions/Master/Institute.action";
import usePermissions from "../../commonComponents/usePermissions";
import {
  deletePromotionalTutorial,
  getAllPromotionalTutorial,
  getOnePromotionalTutorial,
  updatePromotionalTutorial,
  createSubPromotionalTutorial,
} from "../../../redux/actions/promotionalTutorial.action";
import Select from "react-select";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const PromotionalTutorialDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editingDocIndex, setEditingDocIndex] = useState(null);
  const [countries, setCountries] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [search, setSearch] = useState("");
  const { canCreate, canUpdate, canDelete, canRead } =
    usePermissions("Webinar");

  const fetchData = async (searchTerm = "") => {
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
  };

  const fetchCountries = async () => {
    const res = await dispatch(countryDropdown());
    setCountries(res?.data?.data || []);
  };

  useEffect(() => {
    fetchCountries();
    if (canRead) {
      fetchData(search);
    }
  }, [dispatch, id, search]);

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

  const getEmbedUrl = (url) => {
    try {
      if (!url) throw new Error("URL is missing");
      const urlObj = new URL(url);
      let embedUrl = url;

      if (
        urlObj.hostname.includes("youtube.com") ||
        urlObj.hostname.includes("youtu.be")
      ) {
        const videoId =
          urlObj.searchParams.get("v") || url.split("/").pop().split("?")[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (urlObj.hostname.includes("vimeo.com")) {
        const videoId = url.split("/").pop();
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
      }

      return embedUrl;
    } catch (error) {
      console.error("Invalid URL:", error);
      return "";
    }
  };

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
        <div
          style={{
            backgroundColor: "#5D54BE",
            width: "100%",
            padding: "10px 20px",
            position: "sticky",
            top: 0,
            zIndex: 3,
            color: "white",
            fontSize: "18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Promotional Webinar Details</span>
          <Button
            variant="link"
            onClick={() => {
              navigate("/promotionaltutorial/webinar");
            }}
            style={{ color: "white" }}
          >
            <AiOutlineClose size={20} />
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
            backgroundColor: "#F5F6FA",
          }}
        >
          <div className="d-flex gap-3 align-items-center justify-content-between w-100">
            <div>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#000",
                  margin: 0,
                }}
              >
                Promotional Webinar for{" "}
                <span className="text-primary text-decoration-underline">
                  {editingItem?.country || ""}
                </span>
              </h2>
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
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
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
          </div>
        </div>
        <Row style={{ padding: "0 20px", backgroundColor: "#F5F6FA" }}>
          {selectedDocuments?.videos?.length > 0 ? (
            selectedDocuments?.videos?.map((doc, index) => (
              <Col
                md={6}
                lg={4}
                xl={3}
                key={doc._id}
                style={{ marginBottom: "20px" }}
              >
                <Card
                  style={{
                    borderRadius: "15px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                    border: "none",
                  }}
                >
                  <Card.Body style={{ padding: "15px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#4B3C88",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      >
                        {doc.name || ""}
                      </span>
                    </div>
                    <div>
                      {doc.urls && doc.urls[0]?.link ? (
                        <>
                          {/* <iframe
                            style={{
                              width: "100%",
                              height: "150px",
                              borderRadius: "10px",
                            }}
                            src={getEmbedUrl(doc.urls[0].link)}
                            allowFullScreen
                            title="Tutorial Video"
                          ></iframe> */}
                          {doc.urls[0].link && (
                            <Button
                              variant="primary"
                              style={{
                                marginTop: "10px",
                                backgroundColor: "#4B3C88",
                                border: "none",
                                borderRadius: "5px",
                                padding: "5px 15px",
                              }}
                              onClick={() =>
                                window.open(doc.urls[0].link, "_blank")
                              }
                            >
                              Open Webinar
                            </Button>
                          )}
                        </>
                      ) : (
                        <p style={{ color: "#6c757d", textAlign: "center" }}>
                          Video URL not available
                        </p>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "10px",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <small>
                            <strong>Created By: </strong>
                            {selectedDocuments?.createdByName || "Unknown"}
                          </small>
                          <br />
                          <small>
                            <strong>Created On: </strong>
                            {selectedDocuments?.createdAt
                              ? new Date(
                                  selectedDocuments.createdAt,
                                ).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  timeZone: "UTC",
                                })
                              : "N/A"}
                          </small>
                        </div>
                      </div>
                      {(canUpdate || canDelete) && (
                        <div style={{ display: "flex", gap: "10px" }}>
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
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <p
                style={{
                  textAlign: "center",
                  color: "#6c757d",
                  padding: "40px 0",
                }}
              >
                {!canRead
                  ? "You do not have permission to view this Data"
                  : "No documents available"}
              </p>
            </Col>
          )}
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
