import { useEffect, useState } from "react";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import Paginations from "../elements/Paginations";
import { toast } from "react-toastify";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import DataTable from "../commonComponents/DataTable";
import usePermissions from "../commonComponents/usePermissions";
import {
  createClientMailCategory,
  deleteClientMailCategory,
  getAllClientMailCategory,
  updateClientMailCategory,
} from "../../redux/actions/Master/AddClientCategory.action";

const ClientMailCategory = () => {
  const dispatch = useDispatch();
  const [allCategories, setAllCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [highlightForm, setHighlightForm] = useState(false);
  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Add Category");

  useEffect(() => {
    if (canRead) {
      fetchCategories(currentPage, itemsPerPage, search);
    }
  }, [currentPage, search]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      fetchCategories(1, newItemsPerPage, search);
    }
  };

  const fetchCategories = async (
    page = 1,
    limit = itemsPerPage,
    search = ""
  ) => {
    try {
      const res = await dispatch(getAllClientMailCategory(page, limit, search));
      const responseData = res?.data?.data;
      setAllCategories(responseData?.data || []);
      setTotalPages(responseData?.totalPages || 0);
      setTotalRecords(responseData?.totalRecords || 0);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setAllCategories([]);
      setTotalPages(0);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      id: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Category is required"),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        toast.dismiss();
        if (values.id && canUpdate) {
          const res = await dispatch(
            updateClientMailCategory({ name: values?.name }, values?.id)
          );
          if (res?.data?.code === 200) {
            toast.success("Category updated successfully");
            resetForm();
            setHighlightForm(false);
          }
        } else if (!values.id && canCreate) {
          const res = await dispatch(
            createClientMailCategory({ name: values?.name })
          );
          if (res?.data?.code === 201) {
            toast.success("Category added successfully");
            resetForm();
            setHighlightForm(false);
          }
        }

        if (canRead) {
          fetchCategories(currentPage, itemsPerPage, search);
        }
      } catch (error) {
        console.log("Error submitting form:", error);
        toast.dismiss();
        toast.error("Category already exists.");
        resetForm();
      }
    },
  });

  const handleEdit = (category) => {
    if (canUpdate) {
      formik.setFieldValue("name", category?.name);
      formik.setFieldValue("id", category?._id);
      setHighlightForm(true);
    } else {
      toast.error("You do not have permission to edit.");
    }
  };

  const handleDelete = async (category) => {
    try {
      toast.dismiss();
      const res = await dispatch(deleteClientMailCategory(category?._id));
      if (res?.data?.code === 200) {
        toast.success("Category deleted successfully");
      }
      const updatedPage =
        allCategories.length === 1 && currentPage > 1
          ? currentPage - 1
          : currentPage;
      setCurrentPage(updatedPage);
      if (canRead) {
        fetchCategories(currentPage, itemsPerPage, search);
      }
    } catch (error) {
      console.log("Error", error);
      toast.error("Failed to delete the category.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.name !== "name") {
        formik.setFieldTouched("name", false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [formik]);

  const columns = [
    {
      label: "Category",
      key: "name",
    },
    {
      label: "CREATED BY",
      key: "createdByName",
    },
    {
      label: "UPDATED BY",
      key: "updatedByName",
    },
  ];

  return (
    <Row className="mt-5 row-sm">
      <Col md={12} lg={12} xl={12}>
        <Card className="custom-card transcation-crypto">
          <Card.Header className="border-bottom-0">
            <div>
              <div className="card-title">
                {highlightForm ? "Update category" : "Add category"}
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={formik.handleSubmit} className="form_main_class">
              {(canCreate || (canUpdate && highlightForm)) && (
                <div className="form_left_section">
                  <div className="form-group">
                    <Form.Label>Category Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      className="custom-select-height"
                      placeholder="Enter category name..."
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <div className="custom-text-danger">
                        {formik.errors.name}
                      </div>
                    )}
                  </div>
                  <div className="form-group form-group-button">
                    <Button
                      variant="primary"
                      type="submit"
                      className="custom-select-height"
                    >
                      {formik.values.id ? "Update" : "Add"}
                    </Button>
                  </div>
                </div>
              )}

              <div className="form_right_section my-3">
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
                <ItemsPerPageSelect
                  itemsPerPage={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                />
                <div className="custom-select-height total-records px-3 mt-2 mt-md-0 d-flex align-items-center h-6">
                  <span
                    className="dark_theme"
                    style={{ color: "#000000", minWidth: "90px" }}
                  >
                    Total Records : <strong>{totalRecords}</strong>
                  </span>
                </div>
              </div>
            </Form>

            <div className={highlightForm ? "update-warning mb-3" : ""}>
              {highlightForm ? "Update your information" : ""}
            </div>

            <DataTable
              columns={columns}
              data={allCategories}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canEdit={canUpdate}
              canDelete={canDelete}
              canRead={canRead}
            />

            {totalPages > 1 && allCategories.length > 0 && (
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
  );
};

export default ClientMailCategory;
