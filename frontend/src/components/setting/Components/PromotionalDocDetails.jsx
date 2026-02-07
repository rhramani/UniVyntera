import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { AiOutlineClose, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createSubPromotionalDoc,
  deletePromotionalDoc,
  getOnePromotionalDoc,
  updatePromotionalDoc,
} from "../../../redux/actions/PromotionalDocument.action";
import { countryDropdown } from "../../../redux/actions/Master/Institute.action";
import usePermissions from "../../commonComponents/usePermissions";
import LoadMoreButton from "../../commonComponents/LoadMoreButton";
import { BASEURL } from "../../../baseUrl";

const PromotionalDocDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { folderName } = location.state || {};
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [flattenedFiles, setFlattenedFiles] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editingDocIndex, setEditingDocIndex] = useState(null);
  const [editingFileId, setEditingFileId] = useState(null);
  const [countries, setCountries] = useState([]);
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
        const item = res.data.data;
        setEditingItem(item);
        setSelectedDocuments(item || []);

        const filteredDocuments = folderName
          ? item.documents.filter(
              (folder) =>
                folder.folderName.toLowerCase() === folderName.toLowerCase(),
            )
          : item.documents;

        if (folderName && filteredDocuments.length === 0) {
          toast.warn(`No folder found with name "${folderName}"`);
        }

        let materialCounter = 0;
        const files = filteredDocuments.flatMap((folder, folderIndex) =>
          folder.materials.flatMap((doc) =>
            doc.urls.map((url, urlIndex) => ({
              materialKey: materialCounter++,
              folderIndex,
              name: doc.name,
              url: url.link,
              docId: folder._id,
              materialId: doc._id,
              fileId: url._id,
              folderName: folder.folderName,
            })),
          ),
        );
        setFlattenedFiles(files);
      } else {
        toast.error("No documents found for this country");
      }
    } catch (error) {
      console.error("Fetch error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to fetch data");
    }
  };

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const fullUrl = fileUrl.startsWith("http")
        ? fileUrl
        : `${BASEURL}${fileUrl}`;

      const cleanFileName =
        fileName.replace(/[^a-zA-Z0-9._-]/g, "_") || "document";
      const fileExtension = fullUrl.split(".").pop() || "pdf";
      const downloadFileName = `${cleanFileName}.${fileExtension}`;

      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch the file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Document downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download the file");
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

  const handleShowUploadModal = (item, materialKey = null, fileId = null) => {
    setEditingItem(item);
    setEditingDocIndex(materialKey);

    const selectedFile = flattenedFiles.find((file) => file.fileId === fileId);

    if (selectedFile) {
      setEditingFileId(selectedFile.materialId);
      setEditingDocIndex(selectedFile.materialKey);
      formik.setValues({
        country: item.country || "",
        name: selectedFile.name || "",
        documents: null,
      });
    } else {
      setEditingFileId(null);
      setEditingDocIndex(null);
      formik.setValues({
        country: item?.country || "",
        name: "",
        documents: null,
      });
    }

    setShowUploadModal(true);
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setEditingFileId(null);
    setEditingDocIndex(null);
    formik.resetForm();
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedItem(null);
  };

  const getValidationSchema = () =>
    Yup.object({
      country: Yup.string(),
      name: Yup.string(),
      documents: Yup.mixed().nullable(),
    });

  const formik = useFormik({
    initialValues: {
      country: "",
      name: "",
      documents: null,
    },
    validationSchema: getValidationSchema(),
    onSubmit: async (values) => {
      handleCloseUploadModal();
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append("country", values.country);
        formData.append("materialName", values.name);

        if (editingDocIndex === null) {
          formData.append("folderName", folderName);
        }

        if (values.documents && values.documents.length > 0) {
          Array.from(values.documents).forEach((file) => {
            formData.append("material", file);
          });
        } else {
          formData.append("material", "");
        }

        let res;
        if (editingDocIndex !== null) {
          const selectedFile = flattenedFiles.find(
            (file) => file.materialKey === editingDocIndex,
          );
          if (!selectedFile) {
            throw new Error("Selected material not found");
          }
          const docId = selectedFile.docId;
          const materialId = selectedFile.materialId;
          res = await dispatch(
            updatePromotionalDoc(editingItem._id, docId, materialId, formData),
          );
        } else {
          res = await dispatch(
            createSubPromotionalDoc(editingItem._id, formData),
          );
        }

        if (res?.status === 200) {
          toast.success(
            editingDocIndex !== null
              ? "Promotional Material updated successfully!"
              : "Promotional Materials added successfully!",
          );
          if (canRead) {
            await fetchData(search);
          }
        } else {
          toast.error(res?.data?.message || "Failed to process document");
        }
        handleCloseUploadModal();
      } catch (error) {
        console.error("Upload error:", error.response?.data || error);
        toast.error(
          error.response?.data?.message || "Failed to process document",
          { autoClose: 5000 },
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleDelete = async (item, materialKey, fileId) => {
    try {
      const file = flattenedFiles.find(
        (file) => file.fileId === fileId && file.materialKey === materialKey,
      );
      if (!file) {
        throw new Error("File not found");
      }

      const res = await dispatch(
        deletePromotionalDoc(item._id, file.docId, fileId),
      );
      if (res?.status === 200) {
        toast.success("File deleted successfully");
        if (canRead) {
          await fetchData(search);
        }
      }
    } catch (error) {
      console.error("Delete error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to delete file");
    }
    handleCloseDeleteModal();
  };

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <LoadMoreButton isLoading={isLoading} />
        </div>
      )}
      <div>
        <div className="form-main-heading w-100 p-3 position-sticky top-0 z-3">
          <div className="d-flex justify-content-between align-items-center">
            <h3>Promotional Material Details</h3>
            <Button
              variant="link"
              onClick={() => navigate(`/promotional-folder/${id}`)}
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
                  <i className="bi bi-folder2-open text-primary fs-4"></i>
                  <span>Promotional Material for</span>
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
                      Add Promotional Material
                    </Button>
                  )}
                </div>
              </Card.Header>
              <Card.Body>
                {flattenedFiles.length > 0 ? (
                  <div className="table-responsive">
                    <table className="modern-premium-table">
                      <thead>
                        <tr>
                          <th style={{ width: "60px" }}>No</th>
                          <th>Document Name</th>
                          <th>Created by</th>
                          <th className="text-center">View</th>
                          <th className="text-center">Download</th>
                          {(canUpdate || canDelete) && (
                            <th className="text-center">Actions</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {flattenedFiles.map((file, index) => (
                          <tr key={`${file.docId}-${file.fileId}`}>
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
                                  <InsertDriveFileIcon
                                    style={{
                                      fontSize: "20px",
                                      color: "#6c5ffc",
                                    }}
                                  />
                                </div>
                                <span className="fw-bold text-dark">
                                  {file.name || "Document"}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className="text-muted small">
                                {selectedDocuments.updatedByName || "-"}
                              </span>
                            </td>
                            <td className="text-center">
                              <a
                                href={`${BASEURL}${file.url}` || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                              className="btn btn-sm btn-success px-3 rounded-4"
                              >
                              View
                              </a>
                            </td>
                            <td className="text-center">
                            <Button
                              variant="info"
                              size="sm"
                              className="px-3 rounded-4"
                                onClick={() =>
                                  handleDownload(file.url, file.name)
                                }
                              >
                              <DownloadIcon />
                              Download
                            </Button>
                            </td>
                            <td className="text-center">
                              <div className="d-flex justify-content-center gap-2">
                                {canUpdate && (
                                <Button
                                  variant="primary"
                                  size="sm"
                                    title="Edit"
                                    onClick={() =>
                                      handleShowUploadModal(
                                        editingItem,
                                        file.materialKey,
                                      file.fileId
                                      )
                                    }
                                  >
                                  <AiOutlineEdit size={16} />
                                </Button>
                                )}
                                {canDelete && (
                                <Button
                                  variant="danger"
                                  size="sm"
                                    title="Delete"
                                    onClick={() => {
                                      setSelectedItem({
                                        item: editingItem,
                                        materialKey: file.materialKey,
                                        fileId: file.fileId,
                                      });
                                      setShowDeleteModal(true);
                                    }}
                                  >
                                  <AiOutlineDelete size={16} />
                                </Button>
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
                      : "No documents available"}
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
                ? "Update Promotional Material"
                : "Add Promotional Material"}
            </Modal.Title>
            <AiOutlineClose
              size={20}
              style={{ cursor: "pointer", color: "white" }}
              onClick={handleCloseUploadModal}
            />
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group controlId="name" className="mb-3">
                <Form.Label>Material Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter material name"
                  className="custom-select-height"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  isInvalid={formik.touched.name && formik.errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="documents" className="mb-3">
                <Form.Label>Upload Documents</Form.Label>
                <Form.Control
                  type="file"
                  name="documents"
                  multiple
                  onChange={(event) => {
                    formik.setFieldValue(
                      "documents",
                      event.currentTarget.files,
                    );
                  }}
                  isInvalid={
                    formik.touched.documents && formik.errors.documents
                  }
                  className="custom-select-height"
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.documents}
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
                    ? "Update Promotional Material"
                    : "Upload Promotional Material"}
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
                handleDelete(
                  selectedItem.item,
                  selectedItem.materialKey,
                  selectedItem.fileId,
                );
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

export default PromotionalDocDetails;
