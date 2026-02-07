import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createPromotionalDoc,
  deletePromotionalDoc,
  getAllPromotionalDoc,
  updatePromotionalDoc,
} from "../../redux/actions/PromotionalDocument.action";
import { countryDropdown } from "../../redux/actions/Master/Institute.action";
import usePermissions from "../commonComponents/usePermissions";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import Paginations from "../elements/Paginations";
import Pageheader from "../../layouts/Pageheader";
import ReactCountryFlag from "react-country-flag";
import Select from "react-select";
import LoadMoreButton from "../commonComponents/LoadMoreButton";
import DeleteConfirmModal from "../bulkMessage/commonDeleteModal/DeleteConfirmModal";

const PromotionalMeterials = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingDocIndex, setEditingDocIndex] = useState(null);
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions(
    "Promotional Materials",
  );

  const fetchCountries = async () => {
    const res = await dispatch(countryDropdown());
    setCountries(res?.data?.data || []);
  };

  const fetchDocuments = async (
    page = 1,
    limit = itemsPerPage,
    searchTerm = "",
  ) => {
    try {
      const res = await dispatch(getAllPromotionalDoc(page, limit, searchTerm));
      if (res?.status === 200) {
        const newDocuments = res?.data?.data || [];
        setDocuments(newDocuments);
        if (showDocumentsModal && editingItem) {
          const updatedItem = newDocuments.find(
            (doc) => doc._id === editingItem._id,
          );
          setSelectedDocuments(updatedItem?.documents || []);
        }
        setTotalRecords(res?.data?.data?.totalRecords || 0);
        setTotalPages(res?.data?.data?.totalPages || 0);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchCountries();
    if (canRead) {
      fetchDocuments(currentPage, itemsPerPage, search);
    }
  }, [dispatch, currentPage, itemsPerPage, search]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

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
    } else if (item) {
      formik.setValues({
        country: item.country || "",
        name: "",
        documents: null,
      });
    } else {
      formik.resetForm({
        values: {
          country: "",
          name: "",
          documents: null,
        },
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

  const handleShowDocumentsModal = (item) => {
    setSelectedDocuments(item.documents || []);
    setEditingItem(item);
    setShowDocumentsModal(true);
  };

  const handleCloseDocumentsModal = () => {
    setShowDocumentsModal(false);
    setSelectedDocuments([]);
    setEditingItem(null);
  };

  const getValidationSchema = () =>
    Yup.object({
      country: Yup.string().required("Country is required"),
      name:
        !editingItem || editingDocIndex !== null
          ? Yup.string()
          : Yup.string().optional(),
      documents:
        !editingItem || editingDocIndex === null
          ? Yup.mixed().nullable()
          : Yup.mixed().nullable(),
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

        let res;
        if (editingItem) {
          if (editingDocIndex !== null) {
            formData.append("materialName", values.name);
            if (values.documents) {
              formData.append("material", values.documents);
            } else {
              formData.append("material", "");
            }
            const docId = editingItem.documents[editingDocIndex]._id;
            res = await dispatch(
              updatePromotionalDoc(editingItem._id, docId, formData),
            );
            if (res?.status === 200) {
              toast.success("Document updated successfully!");
              if (canRead) {
                setCurrentPage(1);
                await fetchDocuments(1, itemsPerPage, search);
              }
              if (showDocumentsModal) {
                const updatedItem = documents.find(
                  (doc) => doc._id === editingItem._id,
                );
                setSelectedDocuments(updatedItem?.documents || []);
              }
            } else {
              toast.error(res?.data?.message || "Failed to update document");
            }
          } else {
            res = await dispatch(
              updatePromotionalDoc(editingItem._id, "", "", formData),
            );
            if (res?.status === 200) {
              toast.success("Country updated successfully!");
              if (canRead) {
                setCurrentPage(1);
                await fetchDocuments(1, itemsPerPage, search);
              }
            } else {
              toast.error(res?.data?.message || "Failed to update country");
            }
          }
        } else {
          formData.append("materialName", values.name);
          if (values.documents) {
            formData.append("material", values.documents);
          }
          res = await dispatch(createPromotionalDoc(formData));
          if (res?.status === 201) {
            toast.success("Material uploaded successfully!");
            if (canRead) {
              setCurrentPage(1);
              await fetchDocuments(1, itemsPerPage, search);
            }
          } else {
            toast.error(res?.data?.message || "Failed to upload document");
          }
        }
        handleCloseUploadModal();
      } catch (error) {
        console.error("Upload error:", error.response?.data || error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleDelete = async (item, docIndex) => {
    try {
      const docId = item.documents[docIndex]._id;
      const res = await dispatch(deletePromotionalDoc(item._id, docId));
      if (res?.status === 200) {
        if (item.documents.length === 1) {
          await handleDeleteItem(item);
        } else {
          if (canRead) {
            setCurrentPage(1);
            await fetchDocuments(1, itemsPerPage, search);
          }
        }
        toast.success("Material deleted successfully");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete document.",
      );
    }
    handleCloseDeleteModal();
  };

  const handleDeleteItem = async (item) => {
    try {
      const res = await dispatch(deletePromotionalDoc(item._id, "", ""));
      if (res?.status === 200) {
        toast.success("Material deleted successfully");
        if (canRead) {
          setCurrentPage(1);
          await fetchDocuments(1, itemsPerPage, search);
        }
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete document.",
      );
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
      <Pageheader
        mainheading="Promotional Materials"
        parentfolder="Home"
        activepage="Promotional Materials"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              {/* <div className="card-title">Promotional Materials</div> */}
            </Card.Header>
            <Card.Body>
              <div className="d-flex mb-3 justify-content-between">
                {canCreate && (
                  <div>
                    <Button
                      variant="primary"
                      className="custom-select-height"
                      onClick={() => handleShowUploadModal()}
                    >
                      Add Promotional Material
                    </Button>
                  </div>
                )}
                <div className="form_right_section">
                  <div className="contact-search3">
                    <button type="button" className="btn border-0">
                      <i
                        className="fe fe-search fw-semibold text-muted"
                        aria-hidden="true"
                      ></i>
                    </button>
                    <Form.Control
                      type="text"
                      className="filter-height border-0"
                      placeholder="Search here..."
                      autoComplete="off"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>

                  <ItemsPerPageSelect
                    itemsPerPage={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                  />

                  <div className="custom-select-height total-records px-3 mt-2 mt-md-0 d-flex align-items-center h-6">
                    <span>
                      Total Records: <strong>{totalRecords}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <Row>
                {documents?.data?.length > 0 ? (
                  documents?.data?.filter(Boolean).map((item, index) => {
                    const country = countries.find(
                      (c) => c.name === item?.country,
                    );
                    const countryCode = country ? country.isoCode : "";
                    return (
                      <Col
                        md={6}
                        lg={4}
                        xl={3}
                        key={item._id || index}
                        className="mb-4"
                      >
                        <div className="premium-country-card">
                          <Link
                            to={`/promotional-folder/${item._id}`}
                            className="premium-country-link"
                            title="Click to view documents"
                          >
                            <div className="country-card-flag-wrapper">
                              <ReactCountryFlag
                                countryCode={countryCode}
                                svg
                                style={{
                                  width: "1.2em",
                                  height: "1.2em",
                                  borderRadius: "4px",
                                }}
                                title={item?.country || "Unknown"}
                              />
                            </div>
                            <div className="country-card-content">
                              <div className="country-card-name">
                                {item?.country || "-"}
                              </div>
                              <div className="country-card-doc-count">
                                <FolderIcon
                                  style={{ fontSize: "16px", color: "#6c5ffc" }}
                                />
                                <span>
                                  {item?.documents?.length || 0} Documents
                                </span>
                              </div>
                            </div>
                          </Link>

                          <div className="country-card-actions mt-3">
                            {canUpdate && (
                              <span
                                className="icon-border edit-icon"
                                onClick={() => handleShowUploadModal(item)}
                                title="Edit Country"
                              >
                                <EditIcon fontSize="small" />
                              </span>
                            )}
                            {canDelete && (
                              <span
                                className="icon-border delete-icon ms-auto"
                                onClick={() => {
                                  setSelectedItem({ item, docIndex: null });
                                  setShowDeleteModal(true);
                                }}
                                title="Delete Material"
                              >
                                <DeleteIcon fontSize="small" />
                              </span>
                            )}
                          </div>
                        </div>
                      </Col>
                    );
                  })
                ) : (
                  <Col>
                    <div className="text-center text-muted py-4">
                      {!canRead
                        ? "You do not have permission to view this Data"
                        : "No data available"}
                    </div>
                  </Col>
                )}
              </Row>

              <Modal
                show={showDocumentsModal}
                onHide={handleCloseDocumentsModal}
                centered
                size="lg"
              >
                <Modal.Header className="form-main-heading">
                  <Modal.Title>View Documents</Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={handleCloseDocumentsModal}
                  />
                </Modal.Header>
                <Modal.Body>
                  {selectedDocuments.length > 0 ? (
                    <table className="mt-3 table">
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>Material Name</th>
                          {canDelete && canUpdate && <th>Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDocuments.map((doc, index) => (
                          <tr key={doc._id}>
                            <td>{index + 1}</td>
                            <td>
                              <Button
                                href={doc.url || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  backgroundColor: "#6259CA",
                                  color: "#fff",
                                  padding: "2px 8px",
                                  borderRadius: "12px",
                                  cursor: "pointer",
                                }}
                              >
                                {doc.name || `Material`}
                              </Button>
                            </td>
                            <td>
                              {canUpdate && (
                                <Button
                                  variant="link"
                                  className="p-0 me-2"
                                  onClick={() =>
                                    handleShowUploadModal(editingItem, index)
                                  }
                                  title="Edit Material"
                                >
                                  <AiOutlineEdit
                                    size={18}
                                    className="text-info"
                                  />
                                </Button>
                              )}
                              {canDelete && (
                                <Button
                                  variant="link"
                                  className="p-0"
                                  onClick={() => {
                                    setSelectedItem({
                                      item: editingItem,
                                      docIndex: index,
                                    });
                                    setShowDeleteModal(true);
                                  }}
                                  title="Delete Material"
                                >
                                  <AiOutlineDelete
                                    size={18}
                                    className="text-danger"
                                  />
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <span className="text-muted">No documents available</span>
                  )}
                </Modal.Body>
                <Modal.Footer className="border-0">
                  <Button
                    variant="link"
                    className="border-primary text-primary text-decoration-none"
                    onClick={handleCloseDocumentsModal}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>

              <Modal
                show={showUploadModal}
                onHide={handleCloseUploadModal}
                centered
                size="lg"
              >
                <Modal.Header className="form-main-heading">
                  <Modal.Title>
                    {editingItem && editingDocIndex !== null
                      ? "Update Promotional Material"
                      : editingItem
                        ? "Update Country"
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
                    {/* <Form.Group controlId="country" className="mb-3">
                      <Form.Label>Select Country</Form.Label>
                      <Form.Select
                        name="country"
                        value={formik.values.country}
                        onChange={formik.handleChange}
                        isInvalid={
                          formik.touched.country && formik.errors.country
                        }
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
                    </Form.Group> */}
                    <Form.Group controlId="country" className="mb-3">
                      <Form.Label>Select Country</Form.Label>
                      <Select
                        options={countries?.map((c) => ({
                          value: c.name,
                          label: c.name,
                        }))}
                        value={
                          countries
                            ?.map((c) => ({
                              value: c.name,
                              label: c.name,
                            }))
                            .filter((o) => o.value === formik.values.country)[0]
                        }
                        onChange={(selectedOption) => {
                          if (selectedOption) {
                            formik.setFieldValue(
                              "country",
                              selectedOption.value,
                            );
                            formik.setFieldError("country", "");
                          } else {
                            formik.setFieldValue("country", "");
                          }
                        }}
                        placeholder="Select Country"
                        isClearable
                        isSearchable
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderRadius: " 30px",
                            color: "black",
                          }),
                          placeholder: (base) => ({
                            ...base,
                            color: "black",
                            fontSize: "13px",
                          }),
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.country}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* {(!editingItem || editingDocIndex !== null) && (
                      <>
                        <Form.Group controlId="name" className="mb-3">
                          <Form.Label>Document Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            placeholder="Enter document name"
                            className="custom-select-height"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            isInvalid={
                              formik.touched.name && formik.errors.name
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.name}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="documents" className="mb-3">
                          <Form.Label>Upload Document</Form.Label>
                          <Form.Control
                            type="file"
                            name="documents"
                            onChange={(event) => {
                              formik.setFieldValue(
                                "documents",
                                event.currentTarget.files[0]
                              );
                            }}
                            isInvalid={
                              formik.touched.documents &&
                              formik.errors.documents
                            }
                            className="custom-select-height"
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.documents}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </>
                    )} */}

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
                        {editingItem && editingDocIndex !== null
                          ? "Update Promotional Material"
                          : editingItem
                            ? "Update Country"
                            : "Add Promotional Material"}
                      </Button>
                    </Modal.Footer>
                  </Form>
                </Modal.Body>
              </Modal>

              <DeleteConfirmModal
                show={showDeleteModal}
                onHide={handleCloseDeleteModal}
                onConfirm={() => handleDeleteItem(selectedItem.item)}
              />

              {totalPages > 1 && documents?.data?.length > 0 && (
                <div className="mt-4 d-flex justify-content-end align-items-end">
                  <Paginations
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PromotionalMeterials;
