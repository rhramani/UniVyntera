import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import {
  createLeadStatus,
  deleteLeadStatus,
  getAllLeadStatus,
  updateLeadStatus,
} from "../../../redux/actions/Master/LeadStatuses/LeadStatus.action";
import usePermissions from "../../commonComponents/usePermissions";
import Pageheader from "../../../layouts/Pageheader";
import DataTable from "../../commonComponents/DataTable";

const LeadStatus = () => {
  const dispatch = useDispatch();
  const [leadStatus, setLeadStatus] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [search, setSearch] = useState("");
  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Lead Status");

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
      fetchLeadStatus(search);
    }
  }, [search]);

  const fetchLeadStatus = async (search) => {
    try {
      const res = await dispatch(getAllLeadStatus(search));
      if (res?.status === 200) {
        setLeadStatus(res?.data?.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      color: "",
      id: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    validateOnMount: false,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (values.id && canUpdate) {
          const { id, ...payload } = values; // Exclude id from payload
          const res = await dispatch(updateLeadStatus(payload, values.id));
          if (res?.status === 200) {
            toast.success("Lead Status updated successfully");
          }
        } else if (canCreate) {
          const { id, ...payload } = values; // Exclude id from payload
          const res = await dispatch(createLeadStatus(payload));
          if (res?.status === 201) {
            toast.success("Lead Status created successfully!");
          }
        }

        handleCloseUploadModal();
        resetForm();
        if (canRead) {
          fetchLeadStatus(search);
        }
      } catch (error) {
        console.error("Error in onSubmit:", error);
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    },
  });

  const handleEdit = (item) => {
    if (canUpdate) {
      formik.setValues({
        name: item?.name || "",
        color: item?.color || "#000000",
        id: item?._id || "",
      });
      formik.setTouched({});
      formik.setErrors({});
      setShowUploadModal(true);
    }
  };

  const handleDelete = async (item) => {
    try {
      toast.dismiss();
      const res = await dispatch(deleteLeadStatus(item._id));
      if (res?.status === 200) {
        toast.success("Lead Status deleted successfully");
      }
      if (canRead) {
        fetchLeadStatus(search);
      }
    } catch (error) {
      console.log("error", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  // Define columns for DataTable
  const columns = [
    {
      label: "Name",
      key: "name",
    },
    {
      label: "Background Color",
      key: "color",
      render: (item) => (
        <div
          style={{
            backgroundColor: item?.color || "#000000",
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
      label: "createdByName",
      key: "createdByName",
    },
    {
      label: "Updated By",
      key: "updatedByName",
    },
  ];

  return (
    <>
      <Pageheader
        mainheading="Lead Status"
        parentfolder="Settings"
        activepage="Lead Status"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div>
                <div className="card-title">Lead Status</div>
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
                      Add Lead Status
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
                      ? "Update Lead Status"
                      : "Add Lead Status"}
                  </Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={handleCloseUploadModal}
                  />
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formName" className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        className="custom-select-height"
                        placeholder="Enter name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik?.touched?.name && formik.errors.name && (
                        <div className="text-danger">{formik.errors.name}</div>
                      )}
                    </Form.Group>
                    <Form.Group controlId="formColor" className="mb-3">
                      <Form.Label>Background Color</Form.Label>
                      <Form.Control
                        type="color"
                        name="color"
                        className="form-control-color border-0 w-100"
                        title="Choose your color"
                        value={formik.values.color || "#000000"}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik?.touched?.color && formik.errors.color && (
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
                data={leadStatus}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={canUpdate}
                canDelete={canDelete}
                canUpdate={canUpdate}
                canRead={canRead}
                showEditButton={canUpdate}
                showDeleteButton={canDelete}
                actionView={canUpdate || canDelete}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default LeadStatus;
