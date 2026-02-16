import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import DataTable from "../commonComponents/DataTable";
import {
  createSetting,
  updateSetting,
  getAllSetting,
  deleteSetting,
} from "../../redux/actions/Setting.action";
import eventEmitter from "../../utils/eventEmitter";
import Pageheader from "../../layouts/Pageheader";
import { BASEURL } from "../../baseUrl";

const CompanyDetails = () => {
  const dispatch = useDispatch();
  const [settings, setSettings] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loginPreview, setLoginPreview] = useState(null);
  const [dashboardPreview, setDashboardPreview] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, [dispatch]);

  const fetchSettings = async () => {
    try {
      const res = await dispatch(getAllSetting());
      if (res?.status === 200) {
        setSettings(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Fetch settings error:", error);
      toast.error("Failed to fetch settings.");
    }
  };

  const handleShowUploadModal = (item = null) => {
    setEditingItem(item);
    setShowUploadModal(true);

    if (item) {
      formik.setValues({
        loginPageLogo: null,
        dashboardLogo: null,
        logoSize: item.logoSize || "",
        existingLoginPageLogo: item.loginPageLogo,
        existingDashboardLogo: item.dashboardLogo,
      });
      setLoginPreview(`${BASEURL}/${item.loginPageLogo}`);
      setDashboardPreview(`${BASEURL}/${item.dashboardLogo}`);
    } else {
      formik.resetForm();
      setLoginPreview(null);
      setDashboardPreview(null);
    }
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setEditingItem(null);
    formik.resetForm();
    setLoginPreview(null);
    setDashboardPreview(null);
  };

  const formik = useFormik({
    initialValues: {
      loginPageLogo: null,
      dashboardLogo: null,
      logoSize: "",
      existingLoginPageLogo: null,
      existingDashboardLogo: null,
    },
    validationSchema: Yup.object({
      loginPageLogo: Yup.mixed()
        .nullable()
        .test("fileType", "Only image files are allowed", (value) => {
          if (!value) return true;
          return value.type.startsWith("image/");
        }),
      dashboardLogo: Yup.mixed()
        .nullable()
        .test("fileType", "Only image files are allowed", (value) => {
          if (!value) return true;
          return value.type.startsWith("image/");
        }),
      logoSize: Yup.string().required("Logo size is required"),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        if (values.loginPageLogo) {
          formData.append("loginPageLogo", values.loginPageLogo);
        }
        if (values.dashboardLogo) {
          formData.append("logo", values.dashboardLogo);
        }
        if (values.logoSize) {
          formData.append("logoSize", values.logoSize);
        }

        let res;
        if (editingItem) {
          res = await dispatch(updateSetting(editingItem._id, formData));

          if (res?.status === 200) {
            toast.success("Logos updated successfully!");
            eventEmitter.emit("settingsUpdated");
          }
        } else {
          res = await dispatch(createSetting(formData));
          if (res?.status === 201) {
            toast.success("Logos uploaded successfully!");
            eventEmitter.emit("settingsUpdated");
          }
        }

        fetchSettings();
        handleCloseUploadModal();
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(
          error.response?.data?.message || "Only image file is allowed!",
        );
      }
    },
  });

  const handleDelete = async (item) => {
    try {
      const res = await dispatch(deleteSetting(item._id));
      if (res?.status === 200) {
        toast.success("Setting deleted successfully");
        fetchSettings();
        eventEmitter.emit("settingsUpdated");
      }
      fetchSettings();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete setting.");
    }
  };

  const handleLoginImageChange = (event) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue("loginPageLogo", file);
    if (file) {
      setLoginPreview(URL.createObjectURL(file));
    } else {
      setLoginPreview(
        formik.values.existingLoginPageLogo
          ? `${formik.values.existingLoginPageLogo}`
          : null,
      );
    }
  };

  const handleDashboardImageChange = (event) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue("dashboardLogo", file);
    if (file) {
      setDashboardPreview(URL.createObjectURL(file));
    } else {
      setDashboardPreview(
        formik.values.existingDashboardLogo
          ? `${formik.values.existingDashboardLogo}`
          : null,
      );
    }
  };

  const columns = [
    {
      label: "Login Logo",
      key: "loginPageLogo",
      render: (item) => {
        return item?.loginPageLogo ? (
          <img src={`${BASEURL}/${item.loginPageLogo}`} alt="Login Logo" width="50" />
        ) : (
          "-"
        );
      },
    },
    {
      label: "Dashboard Logo",
      key: "dashboardLogo",
      render: (item) => {
        return item?.dashboardLogo ? (
          <img src={`${BASEURL}/${item.dashboardLogo}`} alt="Dashboard Logo" width="50" />
        ) : (
          "-"
        );
      },
    },
    {
      label: "Logo Size",
      key: "logoSize",
      render: (item) => item?.logoSize || "",
    },
  ];

  return (
    <>
      <Pageheader
        mainheading="Company Details"
        parentfolder="Settings"
        activepage="Company Details"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              {/* <div>
                <div className="card-title">Company Logos</div>
              </div> */}
            </Card.Header>
            <Card.Body>
              {settings.length < 1 ? (
                <div className="form_left_section d-flex gap-3 mb-3">
                  <Button
                    variant="primary"
                    type="button"
                    className="custom-select-height"
                    onClick={() => handleShowUploadModal()}
                  >
                    Upload Logos
                  </Button>
                </div>
              ) : (
                <div className="update-warning mb-3">
                  If you want to use another logo, please delete existing one
                </div>
              )}

              <Modal show={showUploadModal} onHide={handleCloseUploadModal}>
                <Modal.Header className="form-main-heading">
                  <Modal.Title>
                    {editingItem ? "Update Logos" : "Upload Logos"}
                  </Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={handleCloseUploadModal}
                  />
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={formik.handleSubmit}>
                    <Form.Group controlId="loginPageLogo" className="mb-3">
                      <Form.Label>Login Page Logo</Form.Label>
                      {loginPreview && (
                        <div className="mb-2">
                          <img
                            src={loginPreview}
                            alt="Login Logo Preview"
                            width="100"
                          />
                        </div>
                      )}
                      <Form.Control
                        type="file"
                        className="custom-select-height"
                        accept="image/*"
                        onChange={handleLoginImageChange}
                        isInvalid={
                          formik.touched.loginPageLogo &&
                          formik.errors.loginPageLogo
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.loginPageLogo}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="dashboardLogo" className="mb-3">
                      <Form.Label>Dashboard Logo</Form.Label>
                      {dashboardPreview && (
                        <div className="mb-2">
                          <img
                            src={dashboardPreview}
                            alt="Dashboard Logo Preview"
                            width="100"
                          />
                        </div>
                      )}
                      <Form.Control
                        type="file"
                        className="custom-select-height"
                        accept="image/*"
                        onChange={handleDashboardImageChange}
                        isInvalid={
                          formik.touched.dashboardLogo &&
                          formik.errors.dashboardLogo
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.dashboardLogo}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="logoSize" className="mb-3">
                      <Form.Label>Dashboard Logo Size</Form.Label>
                      <Form.Select
                        name="logoSize"
                        value={formik.values.logoSize}
                        onChange={formik.handleChange}
                        isInvalid={
                          formik.touched.logoSize && formik.errors.logoSize
                        }
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.logoSize}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Modal.Footer>
                      <Button
                        variant="link"
                        className="btn border-primary text-primary text-decoration-none"
                        style={{ borderRadius: "12px" }}
                        onClick={handleCloseUploadModal}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        className="custom-select-height"
                        type="submit"
                      >
                        {editingItem ? "Update" : "Upload"}
                      </Button>
                    </Modal.Footer>
                  </Form>
                </Modal.Body>
              </Modal>

              <DataTable
                columns={columns}
                data={settings}
                currentPage={false}
                totalPages={false}
                itemsPerPage={false}
                onPageChange={false}
                onItemsPerPageChange={false}
                onEdit={handleShowUploadModal}
                onDelete={handleDelete}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CompanyDetails;
