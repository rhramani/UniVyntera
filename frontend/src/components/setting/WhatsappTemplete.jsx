import { Button, Form, Row, Col, Card, Modal } from "react-bootstrap";
import Paginations from "../elements/Paginations";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import DataTable from "../commonComponents/DataTable";
import usePermissions from "../commonComponents/usePermissions";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import {
  createWpTemplate,
  deleteWpTemplate,
  getAllWpTemplate,
  updateWpTemplate,
} from "../../redux/actions/Whatsapp/WhatsappTemplate.action";
import { getAllWpCategory } from "../../redux/actions/Whatsapp/WhatsappCategory.action";
import Pageheader from "../../layouts/Pageheader";

const WhatsappTemplete = () => {
  const dispatch = useDispatch();
  const [wpTemplate, setWpTemplate] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Template");

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

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const fetchWpCategory = async () => {
    try {
      const res = await dispatch(getAllWpCategory(1, 100));
      const responseData = res?.data?.data;
      setCategoryOptions(responseData?.data || []);
    } catch (error) {
      console.log("Error fetching category:", error);
      setCategoryOptions([]);
    }
  };

  useEffect(() => {
    fetchWpCategory();
  }, []);

  const fetchAllWpTemplate = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    category = ""
  ) => {
    try {
      const res = await dispatch(
        getAllWpTemplate(page, limit, search, category)
      );
      const responseData = res?.data?.data;
      setWpTemplate(responseData?.data || []);
      setTotalPages(responseData?.totalPages || 0);
      setTotalRecords(responseData?.totalRecords || 0);
    } catch (error) {
      console.log("Error fetching wpTemplate:", error);
      setWpTemplate([]);
      setTotalPages(0);
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchAllWpTemplate(currentPage, itemsPerPage, search, selectedCategory);
    }
  }, [currentPage, itemsPerPage, search, selectedCategory]);

  const formik = useFormik({
    initialValues: {
      category: "",
      type: "",
      message: "",
    },
    validationSchema: Yup.object({
      category: Yup.string().required("Category is required"),
      type: Yup.string().required("Title is required"),
      message: Yup.string().required("Message is required"),
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        toast.dismiss();
        if (values.id && canUpdate) {
          const res = await dispatch(updateWpTemplate(values, values.id));
          if (res?.data?.code === 200) {
            toast.success("Template updated successfully");
          }
        } else if (canCreate) {
          const res = await dispatch(createWpTemplate(values));
          if (res?.data?.code === 201) {
            toast.success(
              res?.data?.data?.message || "Template added successfully"
            );
          }
        }
        resetForm();
        setShowUploadModal(false);
        if (canRead) {
          fetchAllWpTemplate(
            currentPage,
            itemsPerPage,
            search,
            selectedCategory
          );
        }
      } catch (error) {
        toast.dismiss();
        console.log("Error submitting form:", error);
        toast.error(error?.response?.data?.message || "An error occurred");
      }
    },
  });

  const handleEdit = (item) => {
    if (canUpdate) {
      formik.setValues({
        category: item.category?._id || "",
        type: item.type || "",
        message: item.message || "",
        id: item._id,
      });
      setShowUploadModal(true);
    }
  };

  const handleDelete = async (item) => {
    if (canDelete) {
      try {
        toast.dismiss();
        const res = await dispatch(deleteWpTemplate(item._id));
        if (res?.data?.code === 200) {
          toast.success("Template deleted successfully");
        }
        const updatedPage =
          wpTemplate?.length === 1 && currentPage > 1
            ? currentPage - 1
            : currentPage;
        setCurrentPage(updatedPage);
        if (canRead) {
          fetchAllWpTemplate(
            currentPage,
            itemsPerPage,
            search,
            selectedCategory
          );
        }
      } catch (error) {
        console.log("Error deleting template:", error);
      }
    }
  };

  const columns = [
    {
      label: "Category",
      key: "category",
      render: (item) => (item?.category ? item?.category?.name : "-"),
    },
    {
      label: "Title",
      key: "type",
    },
    {
      label: "Message",
      key: "message",
    },
    {
      label: "CREATED BY",
      render: (item) => (item?.createdByName ? item?.createdByName : "-"),
    },
    {
      label: "UPDATED BY",
      render: (item) => (item?.updatedByName ? item?.updatedByName : "-"),
    },
  ];

  const selectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "30px",
      color: "black",
    }),
    placeholder: (base) => ({
      ...base,
      color: "black",
      fontSize: "13px",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <>
      <Pageheader
        mainheading="Template"
        parentfolder="Whatsapp"
        activepage="Template"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div>
                <div className="card-title">Template</div>
              </div>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                <Row className="mb-3 align-items-end">
                  {(canCreate || (canUpdate && formik.values.id)) && (
                    <Col xs="auto" className="pt-md-2 mt-2 mt-md-0">
                      <Button
                        variant="primary"
                        className="custom-select-height custom-add-button"
                        type="button"
                        onClick={handleShowUploadModal}
                      >
                        Add
                      </Button>
                    </Col>
                  )}
                  {canRead && (
                    <Col className="d-flex align-items-end justify-content-end gap-2">
                      <div className="flex-grow-1"></div>
                      <div className="filter-item">
                        <Form.Label>Category</Form.Label>
                        <Select
                          className="filter-height"
                          options={categoryOptions
                            ?.sort((a, b) => a.name?.localeCompare(b.name))
                            ?.map((option) => ({
                              value: option._id,
                              label: option.name,
                            }))}
                          value={
                            categoryOptions
                              ? categoryOptions
                                  .map((option) => ({
                                    value: option._id,
                                    label: option.name,
                                  }))
                                  .find(
                                    (option) =>
                                      option.value === selectedCategory
                                  ) || null
                              : null
                          }
                          onChange={(selectedOption) => {
                            setSelectedCategory(
                              selectedOption ? selectedOption.value : ""
                            );
                            setCurrentPage(1);
                          }}
                          placeholder="Select Category"
                          isClearable
                          isSearchable
                          classNamePrefix="custom-select"
                          noOptionsMessage={() =>
                            "No category options available"
                          }
                          styles={selectStyles}
                        />
                      </div>
                      {/* Search Input */}
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
                          Total Records: <strong>{totalRecords}</strong>
                        </span>
                      </div>
                    </Col>
                  )}
                </Row>
              </Form>

              <Modal show={showUploadModal} onHide={handleCloseUploadModal}>
                <Modal.Header className="form-main-heading">
                  <Modal.Title>
                    {formik.values.id
                      ? "Update Whatsapp Template"
                      : "Add Whatsapp Template"}
                  </Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={handleCloseUploadModal}
                  />
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col md={12} className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Select
                          className="custom-select-height"
                          options={categoryOptions
                            ?.sort((a, b) => a.name?.localeCompare(b.name))
                            ?.map((option) => ({
                              value: option._id,
                              label: option.name,
                            }))}
                          value={
                            categoryOptions
                              ? categoryOptions
                                  .map((option) => ({
                                    value: option._id,
                                    label: option.name,
                                  }))
                                  .find(
                                    (option) =>
                                      option.value === formik.values.category
                                  ) || null
                              : null
                          }
                          onChange={(selectedOption) => {
                            if (selectedOption) {
                              formik.setFieldValue(
                                "category",
                                selectedOption.value
                              );
                              formik.setFieldError("category", "");
                            } else {
                              formik.setFieldValue("category", "");
                            }
                          }}
                          placeholder="Select Category"
                          isClearable
                          isSearchable
                          classNamePrefix="custom-select"
                          noOptionsMessage={() =>
                            "No category options available"
                          }
                          styles={selectStyles}
                        />
                        {formik.touched.category && formik.errors.category && (
                          <div className="text-danger">
                            {formik.errors.category}
                          </div>
                        )}
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          rows={4}
                          className="custom-select-height"
                          placeholder="Enter Title"
                          name="type"
                          value={formik.values.type}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.type && formik.errors.type && (
                          <div className="text-danger">
                            {formik.errors.type}
                          </div>
                        )}
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Label>Message</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          className="rounded-4"
                          placeholder="Enter message"
                          name="message"
                          value={formik.values.message}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.message && formik.errors.message && (
                          <div className="text-danger">
                            {formik.errors.message}
                          </div>
                        )}
                      </Col>
                    </Row>
                    <div className="text-end mt-3">
                      <Button
                        variant="primary"
                        className="custom-select-height"
                        type="submit"
                      >
                        {formik?.values?.id ? "Update" : "Add"}
                      </Button>
                    </div>
                  </Form>
                </Modal.Body>
              </Modal>

              <DataTable
                columns={columns}
                data={wpTemplate}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerpageChange={handleItemsPerPageChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
                renderActions={false}
                ItemsPerPageOptions={true}
                canEdit={canUpdate}
                canDelete={canDelete}
                canRead={canRead}
              />

              {totalPages > 1 && wpTemplate?.length > 0 && (
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

export default WhatsappTemplete;
