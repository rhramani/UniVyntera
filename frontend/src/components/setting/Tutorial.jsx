import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createTutorial,
  deleteTutorial,
  getAllTutorial,
} from "../../redux/actions/Tutorial.action";
import {
  AiOutlineClose,
  AiOutlineVideoCamera,
  AiOutlineLink,
  AiOutlineUser,
  AiOutlineCalendar,
  AiOutlineCloudUpload,
  AiOutlineSearch,
} from "react-icons/ai";
import usePermissions from "../commonComponents/usePermissions";
import Paginations from "../elements/Paginations";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import Pageheader from "../../layouts/Pageheader";
import DeleteIcon from "@mui/icons-material/Delete";
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

  const [showAddModal, setShowAddModal] = useState(false);

  const fetchTutorials = useCallback(
    async (page = 1, limit = itemsPerPage, searchTerm = "") => {
      try {
        const res = await dispatch(getAllTutorial(page, limit, searchTerm));
        if (res?.status === 200) {
          setTutorials(res?.data?.data || { data: [] });
          setTotalRecords(res?.data?.data?.totalRecords || 0);
          setTotalPages(res?.data?.data?.totalPages || 0);
        }
      } catch (error) {
        setTotalRecords(0);
        setTotalPages(0);
        console.error("Fetch tutorials error:", error);
        toast.error("Failed to fetch tutorials.");
      }
    },
    [dispatch, itemsPerPage],
  );

  useEffect(() => {
    if (canRead) {
      fetchTutorials(currentPage, itemsPerPage, search);
    }
  }, [canRead, currentPage, itemsPerPage, search, fetchTutorials]);

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
            setShowAddModal(false);
          }
        }
        if (canRead) {
          setCurrentPage(1);
          fetchTutorials(1, itemsPerPage, search);
        }
      } catch (error) {
        console.error("Submit error:", error);
        toast.error(
          error.response?.data?.message || "Error submitting tutorial!",
        );
      }
    },
  });

  const handleShowAddModal = () => setShowAddModal(true);

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    formik.resetForm();
  };

  const handleCloseDeleteModal = () => {
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
          <Card className="custom-card transcation-crypto overflow-hidden">
            <Card.Header className="border-bottom-0 p-4">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 w-100">
                <div>
                  {canCreate && (
                    <Button
                      variant="primary"
                      className="custom-select-height px-4 d-flex align-items-center gap-2 fw-bold"
                      onClick={handleShowAddModal}
                      style={{ borderRadius: "10px" }}
                    >
                      <AiOutlineCloudUpload size={18} />
                      Add Tutorial
                    </Button>
                  )}
                </div>

                <div className="d-flex flex-wrap gap-3 align-items-center">
                  {canRead && (
                    <div className="contact-search3">
                      <button type="button" className="btn border-0">
                        <AiOutlineSearch
                          className="fw-semibold text-muted"
                          size={18}
                        />
                      </button>
                      <Form.Control
                        type="text"
                        className="filter-height border-0"
                        placeholder="Search tutorials..."
                        autoComplete="off"
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                  )}

                  <ItemsPerPageSelect
                    itemsPerPage={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                  />

                  <div className="custom-select-height total-records px-3 d-flex align-items-center h-6 border rounded bg-light">
                    <span className="text-muted small">
                      Total:{" "}
                      <strong className="text-dark">{totalRecords}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </Card.Header>

            <Card.Body className="p-4">
              <Row className="g-4">
                {tutorials?.data?.length > 0 ? (
                  tutorials?.data?.map((item) => (
                    <Col md={6} lg={4} xl={4} key={item._id}>
                      <div className="premium-tutorial-card p-0 rounded-4 border-0 shadow-sm h-100 bg-white overflow-hidden transition-all hover-translate-y">
                        <div
                          className="tutorial-video-wrapper position-relative"
                          style={{ height: "220px", background: "#f8fafc" }}
                        >
                          {isGoogleDriveLink(item.url) ? (
                            <div className="d-flex flex-column align-items-center justify-content-center h-100 gap-3">
                              <div
                                className="icon-border bg-primary-transparent text-primary shadow-sm"
                                style={{ width: "64px", height: "64px" }}
                              >
                                <AiOutlineLink size={28} />
                              </div>
                              <Button
                                variant="primary"
                                onClick={() => window.open(item.url, "_blank")}
                                className="rounded-pill px-4 btn-sm fw-bold shadow-sm"
                              >
                                Open Google Drive
                              </Button>
                            </div>
                          ) : (
                            <iframe
                              className="w-100 h-100 border-0"
                              src={getEmbedUrl(item.url)}
                              allowFullScreen
                              title={item.name}
                            ></iframe>
                          )}
                          <div className="position-absolute top-0 end-0 p-3">
                            <div className="badge bg-blur-white text-primary rounded-pill px-3 py-2 shadow-sm d-flex align-items-center gap-2">
                              <div className="pulse-dot"></div>
                              <span className="small fw-bold letter-spacing-1">
                                VIDEO
                              </span>
                            </div>
                          </div>
                        </div>

                        <div
                          className="p-4 d-flex flex-column"
                          style={{ minHeight: "160px" }}
                        >
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <h5
                              className="fw-bold text-dark mb-0 line-clamp-1 flex-grow-1 me-2"
                              title={item?.name}
                            >
                              {item?.name || "Untitled Tutorial"}
                            </h5>
                            {canDelete && (
                              <span
                                className="icon-border delete-icon"
                                title="Delete"
                                size="sm"
                                onClick={() => {
                                  setSelectedItem(item);
                                  setShowDeleteModal(true);
                                }}
                              >
                                <DeleteIcon style={{ fontSize: "18px" }} />
                              </span>
                            )}
                          </div>

                          <div className="tutorial-meta pt-3 border-top d-flex justify-content-between align-items-center mt-3">
                            <div className="d-flex align-items-center gap-2">
                              <div
                                className="avatar text-primary rounded-pill d-flex align-items-center justify-content-center"
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  backgroundColor: "#5d54be4f",
                                }}
                              >
                                <AiOutlineUser size={14} />
                              </div>
                              <div className="d-flex flex-column">
                                <span
                                  className="text-muted text-uppercase"
                                  style={{
                                    fontSize: "9px",
                                    fontWeight: "700",
                                    letterSpacing: "0.5px",
                                  }}
                                >
                                  Author
                                </span>
                                <span
                                  className="small fw-bold text-dark text-truncate"
                                  style={{ maxWidth: "80px" }}
                                >
                                  {item?.createdByName || "Admin"}
                                </span>
                              </div>
                            </div>

                            <div className="d-flex align-items-center gap-2 text-end">
                              <div className="d-flex flex-column">
                                <span
                                  className="text-muted text-uppercase"
                                  style={{
                                    fontSize: "9px",
                                    fontWeight: "700",
                                    letterSpacing: "0.5px",
                                  }}
                                >
                                  Published
                                </span>
                                <span className="small fw-bold text-dark">
                                  {item?.createdAt
                                    ? new Date(
                                        item.createdAt,
                                      ).toLocaleDateString("en-GB")
                                    : "N/A"}
                                </span>
                              </div>
                              <div
                                className="avatar bg-light text-muted rounded-pill d-flex align-items-center justify-content-center"
                                style={{ width: "32px", height: "32px" }}
                              >
                                <AiOutlineCalendar size={14} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))
                ) : (
                  <Col xs={12}>
                    <div className="text-center py-5 rounded-4 bg-light border border-dashed">
                      <div className="mb-3 text-muted opacity-50">
                        <AiOutlineVideoCamera size={48} />
                      </div>
                      <h5 className="text-muted fw-semibold">
                        {!canRead
                          ? "Access restricted. Please contact administrator."
                          : "No tutorials found. Add your first video above!"}
                      </h5>
                    </div>
                  </Col>
                )}
              </Row>

              {/* Add Tutorial Modal */}
              <Modal
                show={showAddModal}
                onHide={handleCloseAddModal}
                centered
                size="lg"
                className="premium-modal"
              >
                <Modal.Header className="form-main-heading p-4">
                  <Modal.Title className="fw-bold text-white d-flex align-items-center gap-2">
                    <AiOutlineVideoCamera />
                    Add New CRM Tutorial
                  </Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={handleCloseAddModal}
                  />
                </Modal.Header>
                <Modal.Body className="p-4">
                  <Form onSubmit={formik.handleSubmit}>
                    <Row className="g-4">
                      <Col md={12}>
                        <Form.Group controlId="name">
                          <Form.Label className="fw-semibold mb-2">
                            Tutorial Name
                          </Form.Label>
                          <div className="position-relative">
                            <Form.Control
                              type="text"
                              name="name"
                              className="custom-select-height ps-5 rounded-3 border-light shadow-sm"
                              value={formik.values.name}
                              onChange={formik.handleChange}
                              placeholder="e.g., How to manage leads"
                              autoFocus
                              isInvalid={
                                formik.touched.name && formik.errors.name
                              }
                            />
                            <AiOutlineVideoCamera
                              className="position-absolute translate-middle-y top-50 start-0 ms-3 text-primary"
                              size={18}
                            />
                          </div>
                          {formik.touched.name && formik.errors.name && (
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.name}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </Col>

                      <Col md={12}>
                        <Form.Group controlId="url">
                          <Form.Label className="fw-semibold mb-2">
                            Tutorial / Video URL
                          </Form.Label>
                          <div className="position-relative">
                            <Form.Control
                              type="text"
                              name="url"
                              className="custom-select-height ps-5 rounded-3 border-light shadow-sm"
                              value={formik.values.url}
                              onChange={formik.handleChange}
                              placeholder="YouTube link, Drive link, etc."
                              isInvalid={
                                formik.touched.url && formik.errors.url
                              }
                            />
                            <AiOutlineLink
                              className="position-absolute translate-middle-y top-50 start-0 ms-3 text-primary"
                              size={18}
                            />
                          </div>
                          <Form.Text className="text-muted small mt-2">
                            Enter a valid URL for the video or document.
                          </Form.Text>
                          {formik.touched.url && formik.errors.url && (
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.url}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </Modal.Body>
                <Modal.Footer className="border-0 p-4 pt-0">
                  <Button
                    variant="light"
                    className="rounded-pill px-4 fw-bold"
                    onClick={handleCloseAddModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="rounded-pill px-4 fw-bold shadow-sm"
                    onClick={formik.handleSubmit}
                  >
                    Add Tutorial
                  </Button>
                </Modal.Footer>
              </Modal>

              <Modal
                show={showDeleteModal}
                onHide={handleCloseDeleteModal}
                centered
              >
                <Modal.Header className="form-main-heading">
                  <Modal.Title className="fw-semibold">
                    Confirm Deletion
                  </Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={handleCloseDeleteModal}
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
                    onClick={handleCloseDeleteModal}
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
                  />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style>{`
        .hover-translate-y:hover {
          transform: translateY(-8px);
        }
        .bg-blur-white {
          background: rgba(255, 255, 255, 0.8) !important;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .letter-spacing-1 {
          letter-spacing: 1px;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .bg-primary-transparent {
          background-color: rgba(108, 95, 252, 0.1) !important;
        }
        .pulse-dot {
          width: 8px;
          height: 8px;
          background-color: #6c5ffc;
          border-radius: 50%;
          display: inline-block;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(108, 95, 252, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(108, 95, 252, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(108, 95, 252, 0); }
        }
        .premium-tutorial-card {
          border-radius: 20px !important;
          border: 1px solid #e2e8f0 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .premium-tutorial-card:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
        }
        .premium-modal .modal-content {
          border: none;
          border-radius: 20px;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default Tutorial;
