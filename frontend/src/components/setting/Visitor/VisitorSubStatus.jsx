import { Button, Card, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import usePermissions from "../../commonComponents/usePermissions";
import DataTable from "../../commonComponents/DataTable";
import Pageheader from "../../../layouts/Pageheader";
import {
  createVisitorSubStatus,
  deleteVisitorSubStatus,
  getAllVisitorSubStatus,
  updateVisitorSubStatus,
} from "../../../redux/actions/Visitor/VisitorSubStatus.action";
import Paginations from "../../elements/Paginations";
import ItemsPerPageSelect from "../../commonComponents/ItemsPerPageSelect";

const VisitorSubStatus = () => {
  const dispatch = useDispatch();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [visitorSubStatus, setVisitorSubStatus] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Visitor Sub Status");

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
      fetchVisitorSubStatuss(currentPage, itemsPerPage, search);
    }
  }, [currentPage, itemsPerPage, search]);

  const fetchVisitorSubStatuss = async (
    page = 1,
    limit = itemsPerPage,
    search = ""
  ) => {
    try {
      const res = await dispatch(getAllVisitorSubStatus(page, limit, search));
      
      if (res?.status === 200) {
        setVisitorSubStatus(res?.data?.data?.data || []);
        setTotalRecords(res?.data?.data?.totalRecords || 0);
        setTotalPages(res?.data?.data?.totalPages || 0);
      }
    } catch (error) {
      console.error("Error fetching sub statuses:", error);
      setTotalRecords(0);
      setTotalPages(0);
    }
  };

  const mainTabOptions = [
    { value: "personal", label: "Personal Details" },
    { value: "document", label: "Document" },
    { value: "visaApplication", label: "Visa Application" },
  ];

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

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
            updateVisitorSubStatus(payload, values.id)
          );
          if (res?.status === 200) {
            toast.success("Visitor Sub Status updated successfully");
          }
        } else if (canCreate) {
          const res = await dispatch(createVisitorSubStatus(payload));
          if (res?.status === 201) {
            toast.success("Visitor Sub Status created successfully");
          }
        }

        handleCloseUploadModal();
        resetForm();
        if (canRead) {
          fetchVisitorSubStatuss(1, itemsPerPage, search);
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
        const res = await dispatch(deleteVisitorSubStatus(item._id));
        if (res?.status === 200) {
          toast.success("Visitor Sub Status deleted successfully");
          if (canRead) {
            fetchVisitorSubStatuss(1, itemsPerPage, search);
          }
        }
      } catch (error) {
        console.error("Error deleting sub status:", error);
        toast.error(
          error?.response?.data?.message || "Failed to delete sub status"
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
        mainheading="Visitor Sub Status"
        parentfolder="Visitor Status"
        activepage="Visitor Sub Status"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div>
                <div className="card-title">Visitor Sub Status</div>
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
                      Add Visitor Sub Status
                    </Button>
                  )}
                  <div className="d-flex align-items-end justify-content-end gap-2">
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
                data={visitorSubStatus}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canUpdate={canUpdate}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />

              {totalPages > 1 && visitorSubStatus?.length > 0 && (
                <Paginations
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default VisitorSubStatus;
