import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createTutorial,
  deleteTutorial,
  getAllTutorial,
} from "../../redux/actions/Tutorial.action";
import { AiOutlineClose } from "react-icons/ai";
import usePermissions from "../commonComponents/usePermissions";
import Paginations from "../elements/Paginations";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import Pageheader from "../../layouts/Pageheader";

const Tutorial = () => {
  const dispatch = useDispatch();
  const [tutorials, setTutorials] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState("");
  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("CRM Tutorials");

  useEffect(() => {
    if (canRead) {
      fetchTutorials(currentPage, itemsPerPage, search);
    }
  }, [dispatch, canRead, currentPage, itemsPerPage, search]);

  const fetchTutorials = async (
    page = 1,
    limit = itemsPerPage,
    searchTerm = ""
  ) => {
    try {
      const res = await dispatch(getAllTutorial(page, limit, searchTerm));
      if (res?.status === 200) {
        setTutorials(res?.data?.data || []);
        setTotalRecords(res?.data?.data?.totalRecords || 0);
        setTotalPages(res?.data?.data?.totalPages || 0);
      }
    } catch (error) {
      setTotalRecords(0);
      setTotalPages(0);
      console.error("Fetch tutorials error:", error);
      toast.error("Failed to fetch tutorials.");
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const formik = useFormik({
    initialValues: {
      url: "",
      name: "",
    },
    validationSchema: Yup.object({
      url: Yup.string()
        .url("Please enter a valid URL")
        .required("Tutorial URL is required"),
      name: Yup.string().required("Tutorial name is required"),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          url: values.url,
          name: values.name,
        };
        if (canCreate) {
          const res = await dispatch(createTutorial(payload));

          if (res?.status === 201) {
            toast.success("Tutorial added successfully!");
            formik.resetForm();
          }
        }
        if (canRead) {
          setCurrentPage(1);
          fetchTutorials(1, itemsPerPage, search);
        }
      } catch (error) {
        console.error("Submit error:", error);
        toast.error(
          error.response?.data?.message || "Error submitting tutorial!"
        );
      }
    },
  });

  const handleCloseUploadModal = () => {
    setShowDeleteModal(false);
    setSelectedItem(null);
  };

  const handleDelete = async (item) => {
    if (canDelete) {
      try {
        const res = await dispatch(deleteTutorial(item._id));
        if (res?.status === 200) {
          toast.success("Tutorial deleted successfully");
        }
        if (canRead) {
          setCurrentPage(1);
          fetchTutorials(1, itemsPerPage, search);
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete tutorial.");
      }
    }
  };

  const getEmbedUrl = (url) => {
    try {
      const urlObj = new URL(url);
      let embedUrl = url;

      if (
        urlObj.hostname.includes("youtube.com") ||
        urlObj.hostname.includes("youtu.be")
      ) {
        const videoId = urlObj.searchParams.get("v") || url.split("/").pop();
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (urlObj.hostname.includes("vimeo.com")) {
        const videoId = url.split("/").pop();
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
      } else if (urlObj.hostname.includes("drive.google.com")) {
        return url;
      }

      return embedUrl;
    } catch (error) {
      console.error("Invalid URL:", error);
      return url;
    }
  };

  const isGoogleDriveLink = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes("drive.google.com");
    } catch (error) {
      return false;
    }
  };

  return (
    <>
      <Pageheader
        mainheading="CRM Tutorial"
        parentfolder="Home"
        activepage="CRM Tutorial"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div>
                <div className="card-title">CRM Tutorial</div>
              </div>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                {canCreate && (
                  <div className="w-100 form_left_section d-flex justify-content-between gap-3 mb-3 align-items-end">
                    <div className="d-flex flex-wrap gap-3 align-items-end">
                      <Form.Group controlId="name" style={{ width: "200px" }}>
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
                        {formik.touched.name && formik.errors.name && (
                          <div className="custom-text-danger">
                            {formik.errors.name}
                          </div>
                        )}
                      </Form.Group>

                      <Form.Group controlId="url" style={{ width: "200px" }}>
                        <Form.Label>Tutorial URL</Form.Label>
                        <Form.Control
                          type="text"
                          name="url"
                          className="custom-select-height"
                          value={formik.values.url}
                          onChange={formik.handleChange}
                          placeholder="Enter URL (e.g., YouTube, Google Drive link)"
                          autoCapitalize="off"
                          isInvalid={formik.touched.url && formik.errors.url}
                        />
                        {formik.touched.url && formik.errors.url && (
                          <div className="custom-text-danger">
                            {formik.errors.url}
                          </div>
                        )}
                      </Form.Group>

                      {canCreate && (
                        <Button
                          variant="primary"
                          type="submit"
                          className="custom-select-height"
                        >
                          Add CRM Tutorial
                        </Button>
                      )}
                    </div>
                    <div className="d-flex flex-wrap gap-3 align-items-end">
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
                )}
              </Form>

              <Row className="mt-3">
                {tutorials?.data?.length > 0 ? (
                  tutorials?.data?.map((item) => (
                    <Col md={6} lg={4} xl={3} key={item._id} className="mb-3">
                      <Card className="shadow-sm rounded-4 tutorial-card">
                        <Card.Body>
                          {canRead && (
                            <>
                              <Card.Title>{item?.name ? item?.name : "Tutorial Video"}</Card.Title>
                              <Card.Text className="tutorial-content">
                                {isGoogleDriveLink(item.url) ? (
                                  <Button
                                    variant="primary"
                                    onClick={() =>
                                      window.open(item.url, "_blank")
                                    }
                                    className="mb-2"
                                  >
                                    Open Google Drive
                                  </Button>
                                ) : (
                                  <span className="embed-responsive embed-responsive-16by9">
                                    <iframe
                                      className="embed-responsive-item"
                                      src={getEmbedUrl(item.url)}
                                      allowFullScreen
                                      title="Tutorial Video"
                                      style={{ width: "100%", height: "200px" }}
                                    ></iframe>
                                  </span>
                                )}
                              </Card.Text>
                            </>
                          )}
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                              <small>
                                <strong>Created By: </strong>
                                {item?.createdByName || "Unknown"}
                              </small>
                              <br />
                              <small>
                                <strong>Created On: </strong>
                                {item?.createdAt
                                  ? new Date(item.createdAt).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      timeZone: "UTC",
                                    }
                                  )
                                  : "N/A"}
                              </small>
                            </div>
                            {canDelete && (
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => {
                                  setSelectedItem(item);
                                  setShowDeleteModal(true);
                                }}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <Col>
                    <p className="text-center">
                      {!canRead
                        ? "You do not have permission to view this Data"
                        : "No data available"}
                    </p>
                  </Col>
                )}
              </Row>

              <Modal
                show={showDeleteModal}
                onHide={handleCloseUploadModal}
                centered
              >
                <Modal.Header className="form-main-heading">
                  <Modal.Title className="fw-semibold">
                    Confirm Deletion
                  </Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={handleCloseUploadModal}
                  />
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                  <div className="text-danger text-primary fs-1 mb-3">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                  </div>
                  <p className="mb-1 fw-semibold">
                    Are you sure you want to delete this item?
                  </p>
                  <small className="text-muted">
                    This action cannot be undone.
                  </small>
                </Modal.Body>
                <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
                  <Button
                    variant="light"
                    className="btn-cancel-delete px-4"
                    onClick={handleCloseUploadModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="btn-delete-confirm"
                    onClick={() => {
                      handleDelete(selectedItem);
                      setShowDeleteModal(false);
                    }}
                  >
                    <i className="bi bi-trash-fill me-2"></i>Delete
                  </Button>
                </Modal.Footer>
              </Modal>

              {totalPages > 1 && tutorials?.data?.length > 0 && (
                <div className="mt-4 d-flex justify-content-end align-items-end">
                  <Paginations
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  /></div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Tutorial;
