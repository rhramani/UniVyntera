import { Button, Card, Col, Form, Modal, Row, Table } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import usePermissions from "../commonComponents/usePermissions";
import { createStudentStatus, deleteStudentStatus, getAllStudentStatus, updateStudentStatus } from "../../redux/actions/Student/StudentStatus.action";

const StudentStatus = () => {
  const dispatch = useDispatch();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [studentStatuss, setStudentStatuss] = useState([]);

  const { canCreate, canRead, canUpdate, canDelete } = usePermissions("Student Status");

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
      fetchStudentStatuss();
    }
  }, []);

  const fetchStudentStatuss = async () => {
    try {
      const res = await dispatch(getAllStudentStatus());
      if (res?.status === 200) {
        setStudentStatuss(res?.data?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching Student statuses:", error);
    }
  };

  const mainTabOptions = [
    { value: "personal", label: "Personal Details" },
    { value: "document", label: "Document" },
    { value: "counselling", label: "Counselling" },
  ];

  const formik = useFormik({
    initialValues: {
      mainTab: null,
      status: "",
    },
    validationSchema: Yup.object({
      mainTab: Yup.mixed()
        .nullable()
        .test(
          "is-object-or-null",
          "Main Tab is required",
          (value) => value === null || (typeof value === "object" && value !== null && "value" in value)
        ),
      status: Yup.string().required("Status is required"),
    }),
    validateOnBlur: true,
    validateOnChange: true,
    validateOnMount: false,
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          mainTab: values.mainTab?.value,
          name: values.status,
        };

        if (values.id && canUpdate) {
          const res = await dispatch(updateStudentStatus(payload, values.id));
          if (res?.status === 200) {
            toast.success("Student Status updated successfully");
          }
        } else if (canCreate) {
          const res = await dispatch(createStudentStatus(payload));
          if (res?.status === 201) {
            toast.success("Student Status created successfully");
          }
        }

        handleCloseUploadModal();
        resetForm();
        if (canRead) {
          fetchStudentStatuss();
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
        const selectedMainTab = mainTabOptions.find((option) => option.value === item?.mainTab) || null;

        formik.setValues({
          mainTab: selectedMainTab,
          status: item?.name || "",
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
        const res = await dispatch(deleteStudentStatus(item._id));
        if (res?.status === 200) {
          toast.success("Student Status deleted successfully");
          if (canRead) {
            fetchStudentStatuss();
          }
        }
      } catch (error) {
        console.error("Error deleting Student status:", error);
        toast.error(error?.response?.data?.message || "Failed to delete Student status");
      }
    }
  };

  return (
    <Row className="mt-5 row-sm">
      <Col md={12} lg={12} xl={12}>
        <Card className="custom-card transcation-crypto">
          <Card.Header className="border-bottom-0">
            <div>
              <div className="card-title">Add Student Status</div>
            </div>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={formik.handleSubmit}>
              <Row className="mb-3">
                <Col md={4} className="d-flex align-items-end">
                  {canCreate && (
                    <Button
                      variant="primary"
                      type="button"
                      className="custom-select-height"
                      onClick={handleShowUploadModal}
                    >
                      Add Student Status
                    </Button>
                  )}
                </Col>
              </Row>
            </Form>

            <Modal show={showUploadModal} onHide={handleCloseUploadModal}>
              <Modal.Header className="form-main-heading">
                <Modal.Title>
                  {formik.values.id ? "Update Student Status" : "Add Student Status"}
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
                      onChange={(option) => formik.setFieldValue("mainTab", option)}
                      onBlur={() => formik.setFieldTouched("mainTab", true)}
                      placeholder="Select Main Tab"
                      classNamePrefix="custom-select"
                    />
                    {formik.touched.mainTab && formik.errors.mainTab && (
                      <div className="text-danger">{formik.errors.mainTab}</div>
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
                      <div className="text-danger">{formik.errors.status}</div>
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

            <div className="table-responsive">
              <Table className="text-nowrap border">
                <thead>
                  <tr>
                    <th scope="col" className="dynamic-width-data">
                      Main Tab
                    </th>
                    <th scope="col" className="dynamic-width-data">
                      Status
                    </th>
                    <th scope="col" className="dynamic-width-data">
                      Created By
                    </th>
                    <th scope="col" className="dynamic-width-data">
                      Updated By
                    </th>
                    {(canUpdate || canDelete) && (
                      <th
                        scope="col"
                        className="dynamic-width-data sticky-col-right-last"
                      >
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {studentStatuss.length > 0 ? (
                    studentStatuss.map((item, index) => (
                      <tr key={index} className="custom-table-row">
                        <td className="dynamic-width"> {item?.mainTab === "personal" ? "Personal Details" : item?.mainTab || "-"}</td>
                        <td className="dynamic-width">{item?.name || "-"}</td>
                        <td className="dynamic-width">
                          {item.createdByName ? item.createdByName : "-"}
                        </td>
                        <td className="dynamic-width">
                          {item.updatedByName ? item.updatedByName : "-"}
                        </td>
                        {(canUpdate || canDelete) && (
                          <td className="sticky-col-right-last dynamic-width">
                            <div className="d-flex">
                              {canUpdate && (
                                <span
                                  className="icon-border edit-icon"
                                  onClick={() => handleEdit(item)}
                                >
                                  <EditIcon />
                                </span>
                              )}
                              {canDelete && (
                                <span
                                  className="icon-border delete-icon ms-2"
                                  onClick={() => handleDelete(item)}
                                >
                                  <DeleteIcon />
                                </span>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        {!canRead ? "You do not have permission to view this Data" : "No data available"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default StudentStatus;