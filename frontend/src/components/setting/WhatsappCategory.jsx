import { Table, Button, Form, Row, Col, Card } from "react-bootstrap";
import Paginations from "../elements/Paginations";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import DataTable from "../commonComponents/DataTable";
import usePermissions from "../commonComponents/usePermissions";
import {
  createWpCategory,
  deleteWpCategory,
  getAllWpCategory,
  updateWpCategory,
} from "../../redux/actions/Whatsapp/WhatsappCategory.action";
import Pageheader from "../../layouts/Pageheader";

const WhatsappCategory = () => {
  const dispatch = useDispatch();
  const [wpCategory, setWpCategory] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [highlightForm, setHighlightForm] = useState(false);
  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Category");
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const fetchWpCategory = async (
    page = 1,
    limit = itemsPerPage,
    search = ""
  ) => {
    try {
      const res = await dispatch(getAllWpCategory(page, limit, search));
      const responseData = res?.data?.data;
      setWpCategory(responseData?.data || []);
      setTotalPages(responseData?.totalPages || 0);
      setTotalRecords(responseData?.totalRecords || 0);
    } catch (error) {
      console.log("Error fetching category:", error);
      setWpCategory([]);
      setTotalPages(0);
    }
  };
  useEffect(() => {
    if (canRead) {
      fetchWpCategory(currentPage, itemsPerPage, search);
    }
  }, [currentPage, itemsPerPage, search]);

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("WhatsApp Category is required"),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        toast.dismiss();
        if (values.id && canUpdate) {
          const res = await dispatch(
            updateWpCategory({ name: values?.name }, values.id)
          );
          if (res?.data?.code === 200) {
            toast.success("WhatsApp Category updated successfully");
          }
        } else if (canCreate) {
          const res = await dispatch(createWpCategory({ name: values?.name }));
          if (res?.data?.code === 201) {
            toast.success(
              res?.data?.data?.message || "WhatsApp Category added successfully"
            );
          }
        }
        resetForm();
        if (canRead) {
          fetchWpCategory(currentPage, itemsPerPage, search);
        }
      } catch (error) {
        toast.dismiss();
        console.log("Error submitting form:", error);
        toast.error(error?.response?.data?.message);
        resetForm();
      }
    },
  });

  const handleEdit = (item) => {
    if (canUpdate) {
      formik.setValues({
        name: item.name,
        id: item._id,
      });
      setHighlightForm(true);
    }
  };

  const handleDelete = async (item) => {
    if (canDelete) {
      try {
        toast.dismiss();
        const res = await dispatch(deleteWpCategory(item._id));
        if (res?.data?.code === 200) {
          toast.success("WhatsApp Category deleted successfully");
        }
        const updatedPage =
          wpCategory.length === 1 && currentPage > 1
            ? currentPage - 1
            : currentPage;
        setCurrentPage(updatedPage);
        if (canRead) {
          fetchWpCategory(currentPage, itemsPerPage, search);
        }
      } catch (error) {
        console.log("Error deleting wpCategory:", error);
      }
    }
  };

  const columns = [
    {
      label: "Category",
      key: "name",
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

  return (
    <>
      <Pageheader
        mainheading="Category"
        parentfolder="Whatsapp"
        activepage="Category"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div>
                <div className="card-title">
                  Category
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit} className="mb-3">
                <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
                  {(canCreate || (canUpdate && formik.values.id)) && (
                    <>
                      <div className="filter-item">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter Category..."
                          name="name"
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
                      <div className="pt-md-2 mt-2 mt-md-0">
                        {" "}
                        <Button
                          variant="primary"
                          className="custom-select-height"
                          type="submit"
                          onClick={() => setHighlightForm(false)}
                        >
                          {formik.values.id ? "Update" : "Add"}
                        </Button>
                      </div>
                    </>
                  )}
                  {canRead && (
                    <>
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
                    </>
                  )}
                </div>
              </Form>

              <div className={highlightForm ? "update-warning mb-3" : ""}>
                {highlightForm ? "Update your information" : ""}
              </div>

              <DataTable
                columns={columns}
                data={wpCategory}
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

              {totalPages > 1 && wpCategory.length > 0 && (
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

export default WhatsappCategory;
