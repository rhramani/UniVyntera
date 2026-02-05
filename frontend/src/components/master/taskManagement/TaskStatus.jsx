import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import usePermissions from "../../commonComponents/usePermissions";
import {
  createTaskStatus,
  updateTaskStatus,
  getAllTaskStatus,
  deleteTaskStatus,
} from "../../../redux/actions/Master/TaskManagementMaster/TaskStatus.action";

import DataTable from "../../commonComponents/DataTable";
import Pageheader from "../../../layouts/Pageheader";

const TaskStatus = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [taskStatuses, setTaskStatuses] = useState([]);
  const [search, setSearch] = useState("");

  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Task Status");

  const handleShowModal = () => {
    setShowModal(true);
    formik.resetForm();
    formik.setTouched({});
    formik.setErrors({});
  };

  const handleCloseModal = () => {
    setShowModal(false);
    formik.resetForm();
  };

  useEffect(() => {
    if (canRead) {
      fetchTaskStatuses(search);
    }
  }, [search, canRead]);

  const fetchTaskStatuses = async (searchTerm) => {
    try {
      const res = await dispatch(getAllTaskStatus(searchTerm));
      if (res?.status === 200 || res?.data?.code === 200) {
        setTaskStatuses(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching task statuses:", error);
      toast.error("Failed to load task statuses");
    }
  };

  const formik = useFormik({
    initialValues: {
      status: "",
      color: "#000000",
      id: "",
    },
    validationSchema: Yup.object({
      status: Yup.string().required("Status name is required"),
      color: Yup.string().required("Color is required"),
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          name: values.status.trim(),
          color: values.color,
        };

        let res;
        if (values.id && canUpdate) {
          res = await dispatch(updateTaskStatus(payload, values.id));
          if (res?.data?.code === 200 || res?.status === 200) {
            toast.success("Task status updated successfully");
          }
        } else if (canCreate) {
          res = await dispatch(createTaskStatus(payload));
          if (res?.data?.code === 201 || res?.status === 201) {
            toast.success("Task status created successfully");
          }
        } else {
          toast.error("You don't have permission to perform this action");
          return;
        }

        handleCloseModal();
        resetForm();
        fetchTaskStatuses(search);
      } catch (error) {
        console.error("Error saving task status:", error);
        toast.error(
          error?.response?.data?.message || "Failed to save task status"
        );
      }
    },
  });

  const handleEdit = (item) => {
    if (!canUpdate) {
      toast.error("You don't have permission to edit");
      return;
    }

    formik.setValues({
      id: item._id,
      status: item?.name || "",
      color: item?.color || "#ffffff",
    });
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    if (!canDelete) {
      toast.error("You don't have permission to delete");
      return;
    }

    try {
      const res = await dispatch(deleteTaskStatus(item._id));
      if (res?.data?.code === 200 || res?.status === 200) {
        toast.success("Task status deleted successfully");
        fetchTaskStatuses(search);
      }
    } catch (error) {
      console.error("Error deleting task status:", error);
      toast.error(
        error?.response?.data?.message || "Failed to delete task status"
      );
    }
  };

  const columns = [
    {
      label: "Status",
      key: "name",
      render: (item) => item?.name || "-",
    },
    {
      label: "Background Color",
      key: "color",
      render: (item) => (
        <div
          style={{
            backgroundColor: item?.color || "#000000",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            display: "inline-block",
            border: "2px solid #ddd",
            boxShadow: "0 0 5px rgba(0,0,0,0.1)",
          }}
        ></div>
      ),
    },
    {
      label: "Created By",
      key: "createdByName",
      render: (item) => item?.createdByName || "-",
    },
    {
      label: "Updated By",
      key: "updatedByName",
      render: (item) => item?.updatedByName || "-",
    },
  ];

  return (
    <>
      <Pageheader
        mainheading="Task Status"
        parentfolder="Task"
        activepage="Task Status"
      />

      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0 d-flex justify-content-between align-items-center">
              {/* <div className="card-title mb-0">Task Status</div> */}
            </Card.Header>

            <Card.Body>
              <div className="d-flex flex-wrap justify-content-between gap-3 mb-4">
                {canCreate && (
                  <Button
                    variant="primary"
                    className="custom-select-height"
                    onClick={handleShowModal}
                  >
                    Add Task Status
                  </Button>
                )}

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
                    placeholder="Search statuses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <DataTable
                columns={columns}
                data={taskStatuses}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={canUpdate}
                canDelete={canDelete}
              />

              {/* Modal for Add/Edit */}
              <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header className="form-main-heading">
                  <Modal.Title>
                    {formik.values.id
                      ? "Update Task Status"
                      : "Add Task Status"}
                  </Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={handleCloseModal}
                  />
                </Modal.Header>

                <Modal.Body>
                  <Form onSubmit={formik.handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter status"
                        name="status"
                        value={formik.values.status}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.touched.status && formik.errors.status
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.status}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Background Color</Form.Label>
                      <Form.Control
                        type="color"
                        name="color"
                        value={formik.values.color || "#000000"}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="form-control-color"
                        style={{ height: "50px", width: "100%" }}
                      />
                      {formik.touched.color && formik.errors.color && (
                        <div className="text-danger mt-1">
                          {formik.errors.color}
                        </div>
                      )}
                    </Form.Group>
                  </Form>
                </Modal.Body>

                <Modal.Footer>
                  <Button
                    variant="outline-primary"
                    className="custom-add-button"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="custom-add-button"
                    onClick={formik.handleSubmit}
                  >
                    {formik.values.id ? "Update" : "Add"}
                  </Button>
                </Modal.Footer>
              </Modal>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default TaskStatus;
