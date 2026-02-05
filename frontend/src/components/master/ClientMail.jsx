import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import {
  bulkUploadClientMail,
  createClientMail,
  deleteClientMail,
  getAllClientMail,
  updateClientMail,
} from "../../redux/actions/Master/ClientMail.action";
import usePermissions from "../commonComponents/usePermissions";
import Pageheader from "../../layouts/Pageheader";
import DataTable from "../commonComponents/DataTable";
import { Link } from "react-router-dom";
import { BASEURL } from "../../baseUrl";
import Select from "react-select";
import { getAllClientMailCategory } from "../../redux/actions/Master/AddClientCategory.action";
import Paginations from "../elements/Paginations";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";

const ClientMail = () => {
  const dispatch = useDispatch();
  const [clientMails, setClientMails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const fileInputRef = useRef();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { canCreate, canRead, canUpdate, canDelete, canUpload } =
    usePermissions("Add Client Mail");

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
    const fetchCategories = async () => {
      try {
        const res = await dispatch(getAllClientMailCategory(1, 100, ""));
        if (res?.status === 200) {
          const options = res?.data?.data?.data?.map((cat) => ({
            value: cat._id,
            label: cat.name,
          }));
          setCategories(options);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [dispatch]);

  const fetchClientMails = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    category
  ) => {
    try {
      setIsLoading(true);
      const res = await dispatch(
        getAllClientMail(page, limit, search, category)
      );

      const responseData = res?.data?.data || {};
      setClientMails(responseData?.data || []);
      setTotalRecords(responseData?.totalRecords || 0);
      setTotalPages(responseData?.totalPages || 0);
    } catch (error) {
      setClientMails([]);
      setTotalRecords(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchClientMails(
        currentPage,
        itemsPerPage,
        search,
        selectedCategory?.value
      );
    }
  }, [canRead, currentPage, itemsPerPage, search, selectedCategory]);

  const handleBulkUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("excelFile", file);

      const res = await dispatch(bulkUploadClientMail(formData));

      if (res.status === 201) {
        toast.success(res?.data?.data || "Bulk upload successful");
        if (canRead) {
          fetchClientMails(
            currentPage,
            itemsPerPage,
            search,
            selectedCategory?.value
          );
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Bulk upload failed");
    } finally {
      setIsLoading(false);
    }
  };
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };
  const formik = useFormik({
    initialValues: {
      category: "",
      name: "",
      email: "",
      contact: "",
      id: "",
    },
    validationSchema: Yup.object({
      category: Yup.string().required("Category is required"),
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      contact: Yup.string().required("Contact is required"),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    validateOnMount: false,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (values.id && canUpdate) {
          const { id, ...payload } = values;
          const res = await dispatch(updateClientMail(payload, values.id));
          if (res?.status === 200) {
            toast.success("Client Mail updated successfully");
          }
        } else if (canCreate) {
          const { id, ...payload } = values;
          const res = await dispatch(createClientMail(payload));
          if (res?.status === 201) {
            toast.success("Client Mail created successfully!");
          }
        }

        handleCloseUploadModal();
        resetForm();
        if (canRead) {
          fetchClientMails(
            currentPage,
            itemsPerPage,
            search,
            selectedCategory?.value
          );
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
        category: item?.category || "",
        name: item?.name || "",
        email: item?.email || "",
        contact: item?.contact || "",
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
      const res = await dispatch(deleteClientMail(item._id));
      if (res?.status === 200) {
        toast.success("Client Mail deleted successfully");
      }
      if (canRead) {
        fetchClientMails(
          currentPage,
          itemsPerPage,
          search,
          selectedCategory?.value
        );
      }
    } catch (error) {
      console.log("error", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const columns = [
    {
      label: "Category",
      render: (row) => {
        const category = categories.find((cat) => cat.value === row.category);
        return category ? category.label : "-";
      },
    },
    {
      label: "Name",
      key: "name",
    },
    {
      label: "Email",
      key: "email",
    },
    {
      label: "Contact",
      key: "contact",
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

  const handleSampleFileDownload = () => {
    const link = document.createElement("a");
    link.href = `https://studyvisaconsultant.com/api/public/sampleClientMailFile/sample_client_mail_upload.xlsx`;
    link.setAttribute("download", "sample_client_mail_upload.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Pageheader
        mainheading="Client Mail"
        parentfolder="Master"
        activepage="Client Mail"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0 d-flex justify-content-between">
              <div className="card-title mb-0"></div>
              <div className="d-flex flex-wrap align-items-center gap-2">
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
                <Button
                  variant="primary"
                  type="button"
                  className="custom-select-height"
                  onClick={handleShowUploadModal}
                >
                  Add Client Mail
                </Button>
                {canUpload && (
                  <div className="d-flex flex-column">
                    <Button
                      variant="primary"
                      type="button"
                      className="custom-select-height px-3 mt-4"
                      onClick={handleBulkUploadClick}
                      disabled={isLoading}
                    >
                      <i className="fe fe-upload-cloud me-2 fs-14"></i>{" "}
                      {isLoading ? "Uploading..." : "Client Bulk Upload"}
                    </Button>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    <Link
                      href="#"
                      style={{ textAlign: "center" }}
                      className="mt-1 text-decoration-underline"
                      onClick={() => handleSampleFileDownload()}
                    >
                      Get Sample File
                    </Link>
                  </div>
                )}
              </div>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
                  {canCreate && (
                    <>
                      <div className="d-flex gap-2">
                        <div className="form-group">
                          {/* <Form.Label>Category</Form.Label> */}
                          <Select
                            name="category"
                            className="custom-select-height"
                            options={categories}
                            value={selectedCategory}
                            onChange={(option) => setSelectedCategory(option)}
                            styles={{
                              control: (base) => ({
                                ...base,
                                borderRadius: "30px",
                                color: "black",
                                minHeight: "38px",
                                width: "200px",
                              }),
                              placeholder: (base) => ({
                                ...base,
                                color: "black",
                                fontSize: "13px",
                              }),
                            }}
                            classNamePrefix="custom-select"
                            placeholder="Select Category"
                            isClearable
                          />
                          {formik.touched.category &&
                            formik.errors.category && (
                              <div className="custom-text-danger">
                                {formik.errors.category}
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="d-flex flex-wrap align-items-start justify-content-end gap-2">
                        <div className="d-flex align-items-end justify-content-end gap-2">
                          <div className="d-flex gap-2 ms-auto">
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
                      </div>
                    </>
                  )}
                </div>
              </Form>

              <Modal show={showUploadModal} onHide={handleCloseUploadModal}>
                <Modal.Header className="form-main-heading">
                  <Modal.Title>
                    {formik.values.id
                      ? "Update Client Mail"
                      : "Add Client Mail"}
                  </Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={handleCloseUploadModal}
                  />
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formCategory" className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Select
                        name="category"
                        className="custom-select-height"
                        options={categories}
                        value={
                          categories.find(
                            (opt) => opt.value === formik.values.category
                          ) || null
                        }
                        onChange={(option) =>
                          formik.setFieldValue(
                            "category",
                            option ? option.value : ""
                          )
                        }
                        onBlur={() => formik.setFieldTouched("category", true)}
                        classNamePrefix="custom-select"
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderRadius: "30px",
                            color: "black",
                            minHeight: "38px",
                          }),
                          placeholder: (base) => ({
                            ...base,
                            color: "black",
                            fontSize: "13px",
                          }),
                        }}
                        placeholder="Select Category"
                        isClearable
                      />
                      {formik.touched.category && formik.errors.category && (
                        <div className="custom-text-danger">
                          {formik.errors.category}
                        </div>
                      )}
                    </Form.Group>
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
                      {formik.touched.name && formik.errors.name && (
                        <div className="text-danger">{formik.errors.name}</div>
                      )}
                    </Form.Group>
                    <Form.Group controlId="formEmail" className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        className="custom-select-height"
                        placeholder="Enter email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <div className="text-danger">{formik.errors.email}</div>
                      )}
                    </Form.Group>
                    <Form.Group controlId="formContact" className="mb-3">
                      <Form.Label>Contact</Form.Label>
                      <Form.Control
                        type="text"
                        className="custom-select-height"
                        placeholder="Enter contact"
                        name="contact"
                        value={formik.values.contact}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.contact && formik.errors.contact && (
                        <div className="text-danger">
                          {formik.errors.contact}
                        </div>
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
                data={clientMails}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={canUpdate}
                canDelete={canDelete}
                canUpdate={canUpdate}
                canRead={canRead}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                showEditButton={canUpdate}
                showDeleteButton={canDelete}
                actionView={canUpdate || canDelete}
              />

              {totalPages > 1 && clientMails?.length > 0 && (
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
    </>
  );
};

export default ClientMail;
