import { Button, Card, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import usePermissions from "../commonComponents/usePermissions";
import {
  createApplicationStatus,
  updateApplicationStatus,
  getAllApplicationStatus,
  deleteApplicationStatus,
} from "../../redux/actions/Student/ApplicationStatus.action";
import { getAllDocumentType } from "../../redux/actions/Document/DocumentType.action";
import DataTable from "../commonComponents/DataTable";
import Pageheader from "../../layouts/Pageheader";

const SubStatus = () => {
  const dispatch = useDispatch();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [applicationStatuses, setApplicationStatuses] = useState([]);
  const [allDocumentType, setAllDocumentType] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Sub Status");

  const handleShowUploadModal = () => {
    setShowUploadModal(true);
    formik.resetForm();
    formik.setTouched({});
    formik.setErrors({});
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    formik.resetForm();
  };

  const fetchDocumentType = async (
    page = currentPage,
    limit = "",
    search = ""
  ) => {
    try {
      const res = await dispatch(getAllDocumentType(page, limit, search));
      const responseData = res?.data?.data;
      setAllDocumentType(responseData?.data || []);
    } catch (error) {
      console.error("Error fetching Document Type:", error);
      setAllDocumentType([]);
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchApplicationStatuses(currentPage, limit, search);
      // fetchDocumentType();
    }
  }, [currentPage, limit, search]);

  const fetchApplicationStatuses = async (
    page = currentPage,
    limit = "",
    search = ""
  ) => {
    try {
      const res = await dispatch(getAllApplicationStatus(page, limit, search));
      if (res?.status === 200) {
        setApplicationStatuses(res?.data?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching application statuses:", error);
    }
  };

  const mainTabOptions = [
    { value: "personal", label: "Personal Details" },
    { value: "document", label: "Document" },
    { value: "courseSelection", label: "Course Selection" },
    { value: "visaApplication", label: "Visa Application" },
  ];

  const formik = useFormik({
    initialValues: {
      mainTab: null,
      status: "",
      Color: "#000000",
    },
    validationSchema: Yup.object({
      mainTab: Yup.mixed()
        .nullable()
        .test(
          "is-object-or-null",
          "Main Tab is required",
          (value) =>
            value === null ||
            (typeof value === "object" && value !== null && "value" in value)
        ),
      status: Yup.string().required("Status is required"),
      color: Yup.string().matches(
        /^#[0-9A-Fa-f]{6}$/,
        "Invalid hex color format"
      ),
    }),
    validateOnBlur: true,
    validateOnChange: true,
    validateOnMount: false,
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          mainTab: values.mainTab?.value,
          name: values.status,
          color: values.color,
        };

        if (values.id && canUpdate) {
          const res = await dispatch(
            updateApplicationStatus(payload, values.id)
          );
          if (res?.status === 200) {
            toast.success("Sub Status updated successfully");
          }
        } else if (canCreate) {
          const res = await dispatch(createApplicationStatus(payload));
          if (res?.status === 201) {
            toast.success("Sub Status created successfully");
          }
        }

        handleCloseUploadModal();
        resetForm();
        if (canRead) {
          fetchApplicationStatuses((page = currentPage), limit, search);
        }
      } catch (error) {
        console.error("Error in onSubmit:", error);
        toast.error(error?.response?.data?.message || "An error occurred");
      }
    },
  });

  const handleEdit = (item) => {
    if (canUpdate) {
      try {
        const selectedMainTab =
          mainTabOptions.find((option) => option.value === item?.mainTab) ||
          null;

        formik.setValues({
          mainTab: selectedMainTab,
          status: item?.name || "",
          color: item?.color || "#000000",
          id: item?._id,
        });
        formik.setTouched({});
        formik.setErrors({});
        setShowUploadModal(true);
      } catch (error) {
        console.error("Error in handleEdit:", error);
        toast.error("Failed to populate edit form");
      }
    }
  };

  const handleDelete = async (item) => {
    if (canDelete) {
      try {
        const res = await dispatch(deleteApplicationStatus(item._id));
        if (res?.status === 200) {
          toast.success("Sub Status deleted successfully");
          if (canRead) {
            fetchApplicationStatuses((page = currentPage), limit, search);
          }
        }
      } catch (error) {
        console.error("Error deleting application status:", error);
        toast.error(
          error?.response?.data?.message ||
            "Failed to delete application status"
        );
      }
    }
  };

  const columns = [
    {
      label: "Main Tab",
      key: "mainTab",
      render: (item) => {
        const tabLabels = {
          personal: "Personal Details",
          document: "Document",
          courseSelection: "Course Selection",
          visaApplication: "Visa Application",
        };
        return tabLabels[item?.mainTab] || item?.mainTab || "-";
      },
    },
    {
      label: "Status",
      key: "name",
      render: (item) => item?.name || "-",
    },
    {
      label: "Created By",
      key: "createdByName",
      render: (item) => item.createdByName || "-",
    },
    {
      label: "Updated By",
      key: "updatedByName",
      render: (item) => item.updatedByName || "-",
    },
  ];

  return (
    <>
      <Pageheader
        mainheading="Sub Status"
        parentfolder="Application Statuses"
        activepage="Sub Status"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div>
                <div className="card-title">Sub Status</div>
              </div>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
                  {canCreate && (
                    <Button
                      variant="primary"
                      type="button"
                      className="custom-select-height"
                      onClick={handleShowUploadModal}
                    >
                      Add Sub Status
                    </Button>
                  )}
                  <div className="d-flex align-items-end justify-content-end gap-2">
                    <div className="ms-auto">
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
                    </div>
                  </div>
                </div>
              </Form>

              <Modal show={showUploadModal} onHide={handleCloseUploadModal}>
                <Modal.Header className="form-main-heading">
                  <Modal.Title>
                    {formik.values.id ? "Update Sub Status" : "Add Sub Status"}
                  </Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={handleCloseUploadModal}
                  />
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="mainTab" className="mb-3">
                      <Form.Label>Main Tab</Form.Label>
                      <Select
                        name="mainTab"
                        options={mainTabOptions}
                        value={formik.values.mainTab}
                        onChange={(option) =>
                          formik.setFieldValue("mainTab", option)
                        }
                        onBlur={() => formik.setFieldTouched("mainTab", true)}
                        placeholder="Select Main Tab"
                        classNamePrefix="custom-select"
                      />
                      {formik.touched.mainTab && formik.errors.mainTab && (
                        <div className="text-danger">
                          {formik.errors.mainTab}
                        </div>
                      )}
                    </Form.Group>
                    <Form.Group controlId="status" className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter status"
                        className="custom-select-height"
                        name="status"
                        value={formik.values.status}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.status && formik.errors.status && (
                        <div className="text-danger">
                          {formik.errors.status}
                        </div>
                      )}
                    </Form.Group>
                    {/* <Form.Group controlId="color" className="mb-3">
                    <Form.Label>Background Color</Form.Label>
                    <Form.Control
                      type="color"
                      name="color"
                      className="form-control-color border-0 w-100"
                      value={formik.values.color}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.color && formik.errors.color && (
                      <div className="text-danger">{formik.errors.color}</div>
                    )}
                  </Form.Group> */}
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="link"
                    className="custom-add-button btn border-primary text-primary text-decoration-none"
                    onClick={handleCloseUploadModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="button"
                    className="custom-add-button"
                    onClick={formik.handleSubmit}
                  >
                    {formik.values.id ? "Update" : "Add"}
                  </Button>
                </Modal.Footer>
              </Modal>

              <DataTable
                columns={columns}
                data={applicationStatuses}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canUpdate={canUpdate}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default SubStatus;
