import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import usePermissions from "../commonComponents/usePermissions";
import Pageheader from "../../layouts/Pageheader";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import { countryDropdown } from "../../redux/actions/Master/Institute.action";
import {
  createPromotionalPpt,
  deletePromotionalPpt,
  getAllPromotionalPpt,
  updatePromotionalPpt,
} from "../../redux/actions/PromotionalPpt.action";
import ReactCountryFlag from "react-country-flag";
import Paginations from "../elements/Paginations";
import Select from "react-select";
import DeleteConfirmModal from "../bulkMessage/commonDeleteModal/DeleteConfirmModal";

const PromotionalPPT = () => {
  const dispatch = useDispatch();
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
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions("PPT");

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
      const res = await dispatch(getAllPromotionalPpt(page, limit, searchTerm));
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
      console.error("Fetch documents error:", error);
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
              updatePromotionalPpt(editingItem._id, docId, formData),
            );
            if (res?.status === 200) {
              toast.success("Promotional PPT updated successfully!");
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
              updatePromotionalPpt(editingItem._id, "", formData),
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
          res = await dispatch(createPromotionalPpt(formData));
          if (res?.status === 200) {
            toast.success("Promotional PPT uploaded successfully!");
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
        toast.error(error?.response?.data?.message);
      }
    },
  });

  const handleDeleteItem = async (item) => {
    try {
      const res = await dispatch(deletePromotionalPpt(item._id, "", ""));
      if (res?.status === 200) {
        toast.success("Promotional PPT deleted successfully");
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
      <Pageheader
        mainheading="Promotional PPT"
        parentfolder="Home"
        activepage="Promotional PPT"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              {/* <div className="card-title">Promotional PPT</div> */}
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                {canCreate && (
                  <Button
                    variant="primary"
                    className="custom-select-height px-4"
                    onClick={() => handleShowUploadModal()}
                    style={{ borderRadius: "10px" }}
                  >
                    Add Promotional PPT
                  </Button>
                )}
                <div className="d-flex flex-wrap gap-3 align-items-center">
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

                  <div className="custom-select-height total-records px-3 d-flex align-items-center h-6 border rounded bg-light">
                    <span className="text-muted small">
                      Total Records:{" "}
                      <strong className="text-dark">{totalRecords}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <Row className="mb-3">
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
                            to={`/promotionaltutorialppt-details/${item._id}`}
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
                                <PresentToAllIcon
                                  style={{ fontSize: "16px", color: "#6c5ffc" }}
                                />
                                <span>{item?.documents?.length || 0} PPTs</span>
                              </div>
                            </div>
                          </Link>

                          <div className="country-card-actions mt-3">
                            {canUpdate && (
                              <span
                                className="icon-border edit-icon"
                                onClick={() => handleShowUploadModal(item)}
                                title="Edit"
                              >
                                <EditIcon fontSize="small" />
                              </span>
                            )}
                            {canDelete && (
                              <span
                                className="ms-auto icon-border delete-icon"
                                onClick={() => {
                                  setSelectedItem({ item, docIndex: null });
                                  setShowDeleteModal(true);
                                }}
                                title="Delete"
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
                          <th>PPT Name</th>
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
                                {doc.name || `PPT`}
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
                                  title="Edit PPT"
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
                                  title="Delete PPT"
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
                      ? "Update Promotional PPT"
                      : editingItem
                        ? "Update Country"
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
                          ? "Update Promotional PPT"
                          : editingItem
                            ? "Update Country"
                            : "Add Promotional PPT"}
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

export default PromotionalPPT;
