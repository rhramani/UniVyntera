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
  createLeadSubStatus,
  deleteLeadSubStatus,
  getAllLeadSubStatus,
  updateLeadSubStatus,
} from "../../../redux/actions/Master/LeadStatuses/LeadSubStatus.action";
import { getAllLeadStatus } from "../../../redux/actions/Master/LeadStatuses/LeadStatus.action";
import LoadMoreButton from "../../commonComponents/LoadMoreButton";
import ItemsPerPageSelect from "../../commonComponents/ItemsPerPageSelect";
import Paginations from "../../elements/Paginations";

const LeadSubStatus = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [leadSubStatuses, setLeadSubStatuses] = useState([]);
  const [mainTabOptions, setMainTabOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Sub Tab Status");

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

  const fetchMainTabs = async (searchTerm = "") => {
    try {
      const res = await dispatch(getAllLeadStatus(searchTerm));
      const responseData = res?.data?.data || [];
      const options = responseData.map((item) => ({
        value: item._id,
        label: item.name,
      }));
      setMainTabOptions(options);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load Main Tabs");
      setMainTabOptions([]);
    }
  };

  const fetchSubStatuses = async (
    page = 1,
    limit = itemsPerPage,
    search = ""
  ) => {
    setIsLoading(true);
    try {
      const res = await dispatch(getAllLeadSubStatus(page, limit, search));
      setLeadSubStatuses(res?.data?.data?.data || []);
      setTotalRecords(res?.data?.data?.totalRecords || 0);
      setTotalPages(res?.data?.data?.totalPages || 0);
    } catch (error) {
      console.error("Error fetching application statuses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchSubStatuses(currentPage, itemsPerPage, search);
    }
    fetchMainTabs();
  }, [currentPage, itemsPerPage, search]);

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
          const res = await dispatch(updateLeadSubStatus(payload, values.id));
          if (res?.status === 200) {
            toast.success("Sub Status updated successfully");
          }
        } else if (canCreate) {
          const res = await dispatch(createLeadSubStatus(payload));
          if (res?.status === 201) {
            toast.success("Sub Status created successfully");
          }
        }

        handleCloseModal();
        resetForm();
        if (canRead) {
          fetchSubStatuses(currentPage, itemsPerPage, search);
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
        setShowModal(true);
      } catch (error) {
        console.error("Error in handleEdit:", error);
        toast.error("Failed to populate edit form");
      }
    }
  };

  const handleDelete = async (item) => {
    if (canDelete) {
      try {
        const res = await dispatch(deleteLeadSubStatus(item._id));
        if (res?.status === 200) {
          toast.success("Sub Status deleted successfully");
          if (canRead) {
            fetchSubStatuses(currentPage, itemsPerPage, search);
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
        const mainTab = mainTabOptions.find(
          (opt) => opt.value === item?.mainTab
        );
        return mainTab?.label || "-";
      },
    },
    {
      label: "Status",
      key: "name",
    },
    {
      label: "Created By",
      key: "createdByName",
    },
    {
      label: "Updated By",
      key: "updatedByName",
    },
  ];

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <LoadMoreButton isLoading={isLoading} />
        </div>
      )}
      <Pageheader
        mainheading="Sub Tab Status"
        parentfolder="Settings"
        activepage="Sub Tab Status"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div>
                <div className="card-title">Sub Tab Status</div>
              </div>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3 d-flex justify-content-between">
                <Col md={2} className="d-flex align-items-end">
                  {canCreate && (
                    <Button
                      variant="primary"
                      type="button"
                      className="custom-select-height"
                      onClick={handleShowModal}
                    >
                      Add Sub Status
                    </Button>
                  )}
                </Col>
                {canRead && (
                  <Col className="d-flex align-items-end justify-content-end gap-2">
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
                          id="typehead1"
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
                    <ItemsPerPageSelect
                      itemsPerPage={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                    />
                    <div className="custom-select-height total-records px-3 mt-2 mt-md-0 d-flex align-items-center h-6">
                      <span>
                        Total Records :<strong>&nbsp;{totalRecords}</strong>
                      </span>
                    </div>
                  </Col>
                )}
              </Row>

              <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header className="form-main-heading">
                  <Modal.Title>
                    {formik.values.id ? "Update Sub Status" : "Add Sub Status"}
                  </Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={handleCloseModal}
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
                    onClick={handleCloseModal}
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
                data={leadSubStatuses}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={handleItemsPerPageChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canUpdate={canUpdate}
              />
              {totalPages > 1 && leadSubStatuses?.length > 0 && (
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

export default LeadSubStatus;
