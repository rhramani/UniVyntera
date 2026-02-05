import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import usePermissions from "../commonComponents/usePermissions";
import {
  createLoanStatus,
  deleteLoanStatus,
  getAllLoanStatus,
  updateLoanStatus,
} from "../../redux/actions/Master/EducationLoanStatus.action";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineClose } from "react-icons/ai";
import DataTable from "../commonComponents/DataTable";
import { toast } from "react-toastify";
import Pageheader from "../../layouts/Pageheader";

const EducationLoanStatus = () => {
  const dispatch = useDispatch();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loanStatus, setLoanStatus] = useState([]);
  const [search, setSearch] = useState("");

  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Education Loan Status");

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

  useEffect(() => {
    if (canRead) {
      fetchLoanStatus(search);
    }
  }, [search]);

  const fetchLoanStatus = async (search) => {
    try {
      const res = await dispatch(getAllLoanStatus(search));
      if (res?.status === 200) {
        setLoanStatus(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching loan statuses:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      status: "",
      color: "",
    },
    validationSchema: Yup.object({
      status: Yup.string().required("Status is required"),
      color: Yup.string().required("Color is required"),
    }),
    validateOnBlur: true,
    validateOnChange: true,
    validateOnMount: false,
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          name: values.status,
          color: values.color,
        };

        if (values.id && canUpdate) {
          const res = await dispatch(
            updateLoanStatus(payload, values.id)
          );
          if (res?.status === 200) {
            toast.success("Education Loan Status updated successfully");
          }
        } else if (canCreate) {
          const res = await dispatch(createLoanStatus(payload));
          if (res?.status === 201) {
            toast.success("Education Loan Status created successfully");
          }
        }

        handleCloseUploadModal();
        resetForm();
        if (canRead) {
          fetchLoanStatus(search);
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
        formik.setValues({
          status: item?.name || "",
          color: item?.color || "ffffff",
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
        const res = await dispatch(deleteLoanStatus(item._id));
        if (res?.status === 200) {
          toast.success("Education Loan Status deleted successfully");
          if (canRead) {
            fetchLoanStatus(search);
          }
        }
      } catch (error) {
        console.error("Error deleting loan status:", error);
        toast.error(
          error?.response?.data?.message || "Failed to delete loan status"
        );
      }
    }
  };

  const columns = [
    {
      label: "Status",
      key: "name",
      render: (row) => row.name || "-",
    },
    {
      label: "Background Color",
      key: "color",
      render: (row) => (
        <div
          style={{
            backgroundColor: row.color || "#ffffff",
            borderRadius: "50%",
            width: "25px",
            height: "25px",
            display: "inline-block",
            border: "1px solid #ccc",
          }}
        ></div>
      ),
    },
    {
      label: "Created By",
      key: "createdByName",
      render: (row) => row.createdByName || "-",
    },
    {
      label: "Updated By",
      key: "updatedByName",
      render: (row) => row.updatedByName || "-",
    },
  ];

  return (
    <>
      <Pageheader
        mainheading="Education Loan Status"
        parentfolder="Master"
        activepage="Education Loan Status"
      />

      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              {/* <div>
              <div className="card-title">Add Education Loan Status</div>
            </div> */}
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
                      Add Education Loan Status
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
                    {formik.values.id
                      ? "Update Education Loan Status"
                      : "Add Education Loan Status"}
                  </Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={handleCloseUploadModal}
                  />
                </Modal.Header>
                <Modal.Body>
                  <Form>
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
                        <div className="text-danger">{formik.errors.status}</div>
                      )}
                    </Form.Group>
                    <Form.Group controlId="color" className="mb-3">
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
                    </Form.Group>
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
                data={loanStatus}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default EducationLoanStatus;