import { useEffect, useState } from "react";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  createCampus,
  deleteCampus,
  getAllCampus,
  updateCampus,
} from "../../redux/actions/Master/Campus.action";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import DataTable from "../commonComponents/DataTable";
import { countryDropdown } from "../../redux/actions/Master/Institute.action";
import usePermissions from "../commonComponents/usePermissions";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import Paginations from "../elements/Paginations";
import Select from "react-select";
import Pageheader from "../../layouts/Pageheader";

const Campus = () => {
  const dispatch = useDispatch();
  const [campus, setCampus] = useState([]);
  const [search, setSearch] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [countries, setCountries] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions("Campus");

  useEffect(() => {
    if (canRead) {
      fetchCampuses(currentPage, itemsPerPage, search);
      fetchCountries();
    } else {
      setCampus([]);
      setCountries([]);
      setTotalRecords(0);
      setTotalPages(0);
    }
  }, [canRead, currentPage, itemsPerPage, search, dispatch]);

  const fetchCampuses = async (
    page = 1,
    limit = itemsPerPage,
    searchTerm = ""
  ) => {
    setIsLoading(true);
    try {
      const res = await dispatch(getAllCampus(page, limit, searchTerm));
      const responseData = res?.data?.data || {};
      setCampus(responseData?.data || []);
      setTotalRecords(responseData?.totalRecords || 0);
      setTotalPages(responseData?.totalPages || 0);
    } catch (error) {
      console.error("Error fetching campuses:", error);
      setCampus([]);
      setTotalRecords(0);
      setTotalPages(0);
      toast.error(error?.response?.data?.message || "Failed to fetch campuses.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const res = await dispatch(countryDropdown());
      setCountries(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching countries:", error);
      setCountries([]);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const formik = useFormik({
    initialValues: {
      campus: "",
      country: "",
      id: "",
    },
    validationSchema: Yup.object({
      campus: Yup.string().required("Campus is required"),
      country: Yup.string().required("Country is required"),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        toast.dismiss();
        let res;
        if (values.id && canUpdate) {
          res = await dispatch(updateCampus(values, values.id));
          if (res?.data?.code === 200) {
            toast.success("Campus updated successfully");
          }
        } else if (!values.id && canCreate) {
          res = await dispatch(createCampus(values));
          if (res?.data?.code === 201) {
            toast.success("Campus added successfully");
          }
        } else {
          toast.error("You do not have permission to perform this action.");
          return;
        }
        resetForm();
        setIsEditing(false);
        if (canRead) {
          setCurrentPage(1);
          fetchCampuses(1, itemsPerPage, search);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error(error?.response?.data?.message || "Failed to save campus.");
      }
    },
  });

  const handleEdit = (item) => {
    if (canUpdate) {
      formik.setValues({
        id: item._id,
        campus: item?.campus,
        country: item?.country,
      });
      setIsEditing(true);
    } else {
      toast.error("You do not have permission to edit.");
    }
  };

  const handleDelete = async (item) => {
    if (canDelete) {
      try {
        toast.dismiss();
        const res = await dispatch(deleteCampus(item._id));
        if (res?.data?.code === 200) {
          toast.success("Campus deleted successfully");
          setCurrentPage(1);
          fetchCampuses(1, itemsPerPage, search);
        }
      } catch (error) {
        console.error("Error deleting campus:", error);
        toast.error("Failed to delete the campus.");
      }
    } else {
      toast.error("You do not have permission to delete.");
    }
  };

  const columns = [
    { label: "Campus", key: "campus" },
    { label: "Country", key: "country" },
    {
      label: "CREATED BY",
      render: (item) => (item.created_by ? item?.created_by?.name : "-"),
    },
    {
      label: "UPDATED BY",
      render: (item) => (item.updatedByName ? item?.updatedByName : "-"),
    },
  ];

  return (
    <>
      <Pageheader
        mainheading="Campus"
        parentfolder="Master"
        activepage="Campus"
      />
    <Row className="mt-5 row-sm">
      <Col md={12} lg={12} xl={12}>
        <Card className="custom-card transcation-crypto">
          <Card.Header className="border-bottom-0">
            {/* <div className="card-title">
              {isEditing ? "Update Campus" : "Add Campus"}
            </div> */}
          </Card.Header>
          <Card.Body>
            <Form onSubmit={formik.handleSubmit} className="form_main_class">
              {(canCreate || (canUpdate && isEditing)) && (
                <div className="form_left_section">
                  <div className="form-group">
                    <Form.Label>Country</Form.Label>
                    <Select
                      name="country"
                      className="custom-select-height"
                      classNamePrefix="select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: "12px",
                          color: "black",
                          minHeight: "38px",
                          minWidth: "200px",
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: "black",
                          fontSize: "13px",
                        }),
                      }}
                      value={
                        formik.values.country
                          ? {
                              value: formik.values.country,
                              label: formik.values.country,
                            }
                          : null
                      }
                      onChange={(option) => {
                        formik.setFieldValue(
                          "country",
                          option ? option.value : ""
                        );
                        formik.setFieldError("country", "");
                      }}
                      onBlur={() => formik.setFieldTouched("country", true)}
                      options={countries?.map((c) => ({
                        value: c.name,
                        label: c.name,
                      }))}
                      placeholder="Select Country"
                      isClearable
                    />
                    {formik.touched.country && formik.errors.country && (
                      <div className="custom-text-danger">
                        {formik.errors.country}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <Form.Label>Campus</Form.Label>
                    <Form.Control
                      type="text"
                      className="custom-select-height"
                      placeholder="Enter campus"
                      name="campus"
                      value={formik.values.campus}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.campus && formik.errors.campus && (
                      <div className="custom-text-danger">
                        {formik.errors.campus}
                      </div>
                    )}
                  </div>
                  <div className="form-group form-group-button">
                    <Button
                      variant="primary"
                      className="custom-select-height"
                      type="submit"
                      disabled={formik.values.id ? !canUpdate : !canCreate}
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
            </Form>
            <div className={isEditing ? "update-warning mb-3" : ""}>
              {isEditing ? "Update your information" : ""}
            </div>

            {isLoading ? (
              <div className="d-flex justify-content-center my-4">
                <div
                  className="spinner-border text-primary"
                  role="status"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <DataTable
                  columns={columns}
                  data={campus}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  canEdit={canUpdate}
                  canDelete={canDelete}
                  canRead={canRead}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />

                {totalPages > 1 && campus.length > 0 && (
                  <div className="mt-4 d-flex justify-content-end align-items-end">
                    <Paginations
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(page) => setCurrentPage(page)}
                    />
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
    </>
  );
};

export default Campus;
