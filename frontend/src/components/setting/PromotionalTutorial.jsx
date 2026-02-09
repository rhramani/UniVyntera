import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import {
  createPromotionalTutorial,
  deletePromotionalTutorial,
  getAllPromotionalTutorial,
  updatePromotionalTutorial,
} from "../../redux/actions/promotionalTutorial.action";
import { countryDropdown } from "../../redux/actions/Master/Institute.action";
import usePermissions from "../commonComponents/usePermissions";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import Paginations from "../elements/Paginations";
import Pageheader from "../../layouts/Pageheader";
import ReactCountryFlag from "react-country-flag";

const PromotionalTutorial = () => {
  const dispatch = useDispatch();
  const [promotionalTutorials, setPromotionalTutorials] = useState([]);
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
  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Webinar");
  const fetchCountries = async () => {
    const res = await dispatch(countryDropdown());
    setCountries(res?.data?.data || []);
  };

  const fetchPromotionalTutorials = async (
    page = 1,
    limit = itemsPerPage,
    searchTerm = "",
  ) => {
    try {
      const res = await dispatch(
        getAllPromotionalTutorial(page, limit, searchTerm),
      );
      if (res?.status === 200) {
        const newDocuments = res?.data?.data || [];
        setPromotionalTutorials(newDocuments);
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
      fetchPromotionalTutorials(currentPage, itemsPerPage, search);
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
        name: item.videos[docIndex]?.name || "",
        url: item.videos[docIndex]?.url || "",
      });
    } else if (item) {
      formik.setValues({
        country: item.country || "",
        name: "",
        url: "",
      });
    } else {
      formik.resetForm({
        values: {
          country: "",
          name: "",
          url: "",
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

  const handleCloseDocumentsModal = () => {
    setShowDocumentsModal(false);
    setSelectedDocuments([]);
    setEditingItem(null);
  };

  const formik = useFormik({
    initialValues: {
      url: "",
      name: "",
      country: "",
    },
    validationSchema: Yup.object({
      // url: Yup.string().when("isEditing", {
      //   is: () => editingItem,
      //   then: () => Yup.string().optional(),
      //   otherwise: () => Yup.string().required("Tutorial URL is required"),
      // }),
      // name: Yup.string().when("isEditing", {
      //   is: () => editingItem,
      //   then: () => Yup.string().optional(),
      //   otherwise: () => Yup.string().required("Tutorial name is required"),
      // }),
      country: Yup.string().when("isEditing", {
        is: () => editingItem,
        then: () => Yup.string().optional(),
        otherwise: () => Yup.string().required("Country is required"),
      }),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {};
        if (values.country) payload.country = values.country;
        if (values.name) payload.name = values.name;
        if (values.url) payload.url = values.url;

        if (editingItem && Object.keys(payload).length === 0) {
          toast.error("At least one field must be provided for update");
          return;
        }

        let res;
        if (editingItem) {
          res = await dispatch(
            updatePromotionalTutorial(editingItem._id, "", "", payload),
          );
          if (res?.status === 200) {
            toast.success("Country updated successfully!");
            if (canRead) {
              setCurrentPage(1);
              await fetchPromotionalTutorials(1, itemsPerPage, search);
            }
          } else {
            toast.error(res?.data?.message || "Failed to update country");
          }
        } else {
          res = await dispatch(createPromotionalTutorial(payload));
          if (res?.status === 201) {
            toast.success("Promotional Webinar created successfully!");
            if (canRead) {
              setCurrentPage(1);
              await fetchPromotionalTutorials(1, itemsPerPage, search);
            }
          } else {
            toast.error(res?.data?.message || "Failed to create tutorial");
          }
        }
        handleCloseUploadModal();
      } catch (error) {
        console.error("Upload error:", error.response?.data || error);
        toast.error(
          error.response?.data?.message || "Failed to process request",
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
          await handleDeleteItem(item);
        } else {
          if (canRead) {
            setCurrentPage(1);
            await fetchPromotionalTutorials(1, itemsPerPage, search);
          }
        }
        toast.success("Promotional Webinar deleted successfully");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete Webinar.");
    }
    handleCloseDeleteModal();
  };

  const handleDeleteItem = async (item) => {
    try {
      const res = await dispatch(deletePromotionalTutorial(item._id, ""));
      if (res?.status === 200) {
        toast.success("Promotional Webinar deleted successfully");
        if (canRead) {
          setCurrentPage(1);
          await fetchPromotionalTutorials(1, itemsPerPage, search);
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
      <Pageheader
        mainheading="Promotional Webinar"
        parentfolder="Home"
        activepage="Promotional Webinar"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              {/* <div className="card-title">Promotional Webinar</div> */}
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
                    Add Promotional Webinar
                  </Button>
                )}
                {canRead && (
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
                )}
              </div>

              <Row className="mb-3">
                {promotionalTutorials?.data?.length > 0 ? (
                  promotionalTutorials?.data
                    ?.filter(Boolean)
                    .map((item, index) => {
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
                              to={`/promotionaltutorial-details/${item._id}`}
                              className="premium-country-link"
                              title="Click to view tutorial"
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
                                  <VideoLibraryIcon
                                    style={{
                                      fontSize: "16px",
                                      color: "#6c5ffc",
                                    }}
                                  />
                                  <span>
                                    {item?.videos?.length || 0} Webinars
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
                                  title="Delete Country"
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
                  <Modal.Title>View Webinar</Modal.Title>
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
                          <th>Document Name</th>
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
                                {doc.name || `Webinar`}
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
                                  title="Edit Webinar"
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
                                  title="Delete Webinar"
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
                    <span className="text-muted">
                      No Promotional Webinar available
                    </span>
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
                      ? "Update Promotional Webinar"
                      : editingItem
                        ? "Update Country"
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
                            borderRadius: "12px",
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
                          <Form.Label>Tutorial Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            className="custom-select-height"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            placeholder="Enter Name"
                            autoCapitalize="off"
                            isInvalid={
                              formik.touched.name && formik.errors.name
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.name}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="url" className="mb-3">
                          <Form.Label>Tutorial URL</Form.Label>
                          <Form.Control
                            type="text"
                            name="url"
                            className="custom-select-height"
                            value={formik.values.url}
                            onChange={formik.handleChange}
                            placeholder="Enter URL (e.g., YouTube, Vimeo)"
                            autoCapitalize="off"
                            isInvalid={formik.touched.url && formik.errors.url}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.url}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </>
                    )} */}

                    <Modal.Footer className="border-0 pt-0">
                      <Button
                        variant="link"
                        type="submit"
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
                          ? "Update Promotional Webinar"
                          : editingItem
                            ? "Update Country"
                            : "Add Promotional Webinar"}
                      </Button>
                    </Modal.Footer>
                  </Form>
                </Modal.Body>
              </Modal>

              <Modal
                show={showDeleteModal}
                onHide={handleCloseDeleteModal}
                centered
              >
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
                      if (selectedItem.docIndex !== null) {
                        handleDelete(selectedItem.item, selectedItem.docIndex);
                      } else {
                        handleDeleteItem(selectedItem.item);
                      }
                    }}
                  >
                    <i className="bi bi-trash-fill me-2"></i>Delete
                  </Button>
                </Modal.Footer>
              </Modal>
              {totalPages > 1 && promotionalTutorials?.data?.length > 0 && (
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

export default PromotionalTutorial;
