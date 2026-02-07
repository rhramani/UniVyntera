import { Button, Card, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import { AiOutlineClose, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import usePermissions from "../../commonComponents/usePermissions";
import {
  createSubPromotionalPpt,
  deletePromotionalPpt,
  getOnePromotionalPpt,
  updatePromotionalPpt,
} from "../../../redux/actions/PromotionalPpt.action";
import { countryDropdown } from "../../../redux/actions/Master/Institute.action";
import LoadMoreButton from "../../commonComponents/LoadMoreButton";
import { BASEURL } from "../../../baseUrl";

const PromotionalPPTDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [flattenedFiles, setFlattenedFiles] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editingDocIndex, setEditingDocIndex] = useState(null);
  const [countries, setCountries] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { canUpdate, canDelete, canRead, canCreate } = usePermissions("PPT");

  const fetchData = async (searchTerm = "") => {
    try {
      const res = await dispatch(getOnePromotionalPpt(id, searchTerm));
      if (res?.status === 200) {
        const item = res.data.data;
        setEditingItem(item);
        setSelectedDocuments(item || []);

        // Flatten the documents into a list of files, including fileId
        const files = item.documents.flatMap((doc, docIndex) =>
          doc.urls.map((url, urlIndex) => ({
            docIndex,
            urlIndex,
            name: doc.name,
            url: url.link,
            docId: doc._id,
            fileId: url._id, // Store the _id from the urls array
          })),
        );
        setFlattenedFiles(files);
      } else {
        toast.error("No documents found for this country");
      }
    } catch (error) {
      console.error("Fetch documents error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch documents");
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
        country: item.country || "",
        name: item.documents[docIndex]?.name || "",
        documents: null,
      });
    } else {
      formik.setValues({
        name: "",
        documents: null,
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
      country: Yup.string(),
      name: Yup.string().required("PPT name is required"),
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
      setShowUploadModal(false);
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append("country", values.country);
        formData.append("materialName", values.name);

        if (values.documents && values.documents.length > 0) {
          Array.from(values.documents).forEach((file) => {
            formData.append("material", file);
          });
        } else {
          formData.append("material", "");
        }

        let res;
        if (
          editingDocIndex !== null &&
          editingItem?.documents[editingDocIndex]?._id
        ) {
          const docId = editingItem.documents[editingDocIndex]._id;
          res = await dispatch(
            updatePromotionalPpt(editingItem._id, docId, formData),
          );
        } else {
          res = await dispatch(
            createSubPromotionalPpt(editingItem._id, formData),
          );
        }

        if (res?.status === 200) {
          toast.success(
            editingDocIndex !== null
              ? "PPT updated successfully!"
              : "PPTs added successfully!",
          );
          if (canRead) {
            await fetchData(search);
          }
        } else {
          toast.error(res?.data?.message || "File too large");
        }
        handleCloseUploadModal();
      } catch (error) {
        console.error("Upload error:", error.response?.data || error);
        toast.error(error.response?.data?.message || "File too large");
      } finally {
        setIsLoading(false);
      }
    },
  });

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

  const handleDelete = async (item, docIndex) => {
    try {
      const docId = item.documents[docIndex]._id;

      const res = await dispatch(deletePromotionalPpt(item._id, docId));
      if (res?.status === 200) {
        toast.success("File deleted successfully");
        if (canRead) {
          await fetchData(search);
        }
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete file.");
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
        <div className="form-main-heading w-100 p-2 position-sticky top-0 z-3">
          <div className="d-flex justify-content-between align-items-center">
            <h3>Promotional PPT Details</h3>
            <Button
              variant="link"
              onClick={() => navigate("/promotionaltutorial/ppt")}
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
                  Promotional PPT for{" "}
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
                      Add Promotional PPT
                    </Button>
                  )}
                </div>
              </Card.Header>
              <Card.Body>
                {flattenedFiles.length > 0 ? (
                  <Table
                    responsive
                    className="align-middle shadow-sm table-hover rounded"
                  >
                    <thead className="bg-light">
                      <tr className="text-dark">
                        <th style={{ marginLeft: "100px" }}>No</th>
                        <th className="text-start">PPT Name</th>
                        <th className="text-start">Created by</th>
                        <th className="text-center">View</th>
                        <th className="text-center">Download</th>
                        {(canUpdate || canDelete) && (
                          <th className="text-center">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {flattenedFiles.map((file, index) => (
                        <tr key={`${file.docId}-${file.urlIndex}`}>
                          <td style={{ fontWeight: "500" }}>{index + 1}</td>
                          <td className="text-start">
                            <span style={{ fontWeight: "500" }}>
                              {file.name || "PPT"}
                            </span>
                          </td>
                          <td className="text-start">
                            <span style={{ fontWeight: "500" }}>
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
                                      file.docIndex,
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
                                      docIndex: file.docIndex,
                                      fileId: file.fileId, // Pass the fileId to the modal
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
                  </Table>
                ) : (
                  <div className="text-center text-muted py-4">
                    {!canRead
                      ? "You do not have permission to view this Data"
                      : "No PPTs available"}
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
                ? "Update Promotional PPT"
                : "Add Promotional PPT"}
            </Modal.Title>
            <AiOutlineClose
              size={20}
              style={{ cursor: "pointer", color: "white" }}
              onClick={handleCloseUploadModal}
            />
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={formik.handleSubmit}>
              {/* {editingDocIndex !== null && (
                <Form.Group controlId="country" className="mb-3">
                  <Form.Label>Select Country</Form.Label>
                  <Form.Select
                    disabled
                    name="country"
                    value={formik.values.country}
                    onChange={formik.handleChange}
                    isInvalid={formik.touched.country && formik.errors.country}
                    className="custom-select-height"
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.country}
                  </Form.Control.Feedback>
                </Form.Group>
              )} */}

              <Form.Group controlId="name" className="mb-3">
                <Form.Label>PPT Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter PPT name"
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
                    const files = Array.from(event.currentTarget.files);
                    const maxSize = 10 * 1024 * 1024; // 10MB

                    const hasOversizedFile = files.some(
                      (file) => file.size > maxSize,
                    );
                    if (hasOversizedFile) {
                      toast.error("File size must be less than 10MB");
                      event.target.value = null;
                      return;
                    }

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
                    ? "Update Promotional PPT"
                    : "Upload Promotional PPT"}
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

export default PromotionalPPTDetails;
