import { useEffect, useState } from "react";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import DataTable from "../commonComponents/DataTable";
import Paginations from "../elements/Paginations";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Select from "react-select";
import usePermissions from "../commonComponents/usePermissions";
import { createLevel, deleteLevel, getAllLevel, updateLevel } from "../../redux/actions/Master/CoachingLevel.action";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import Pageheader from "../../layouts/Pageheader";


const CoachingLevel = () => {
  const dispatch = useDispatch();
  const [levels, setLevels] = useState([]);
  const [search, setSearch] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [countries, setCountries] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions("Level");

  useEffect(() => {
    if (canRead) {
      fetchSubjects(currentPage, itemsPerPage, search);
    } else {
      setLevels([]);
      setTotalRecords(0);
      setTotalPages(0);
    }
  }, [canRead, currentPage, itemsPerPage, search, dispatch]);

  const fetchSubjects = async (
    page = 1,
    limit = itemsPerPage,
    searchTerm = ""
  ) => {
    setIsLoading(true);
    try {
      const res = await dispatch(getAllLevel(page, limit, searchTerm));
      const responseData = res?.data?.data || {};
      setLevels(responseData?.data || []);
      setTotalRecords(responseData?.totalRecords || 0);
      setTotalPages(responseData?.totalPages || 0);
    } catch (error) {
      console.error("Error fetching levels:", error);
      setLevels([]);
      setTotalRecords(0);
      setTotalPages(0);
      toast.error(error?.response?.data?.message);
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
      name: "",
      id: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Level is required"),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        toast.dismiss();
        let res;
        if (values.id && canUpdate) {
          res = await dispatch(updateLevel(values, values.id));
          if (res?.data?.code === 200) {
            toast.success("Level updated successfully");
          }
        } else if (!values.id && canCreate) {
          res = await dispatch(createLevel(values));
          if (res?.data?.code === 201) {
            toast.success("Level added successfully");
          }
        } else {
          toast.error("You do not have permission to perform this action.");
          return;
        }
        resetForm();
        setIsEditing(false);
        if (canRead) {
          setCurrentPage(1);
          fetchSubjects(1, itemsPerPage, search);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error(error?.response?.data?.message || "Failed to save level.");
      }
    },
  });

  const handleEdit = (item) => {
    if (canUpdate) {
      formik.setValues({
        id: item._id,
        name: item?.name,
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
        const res = await dispatch(deleteLevel(item._id));
        if (res?.data?.code === 200) {
          toast.success("Level deleted successfully");
          setCurrentPage(1);
          fetchSubjects(1, itemsPerPage, search);
        }
      } catch (error) {
        console.error("Error deleting level:", error);
        toast.error("Failed to delete the level.");
      }
    } else {
      toast.error("You do not have permission to delete.");
    }
  };

  const columns = [
    { label: "Level", key: "name" },
    {
      label: "CREATED BY",
      render: (item) => (item?.createdByName ? item?.createdByName : "-"),
    },
    {
      label: "UPDATED BY",
      render: (item) => (item.updatedByName ? item?.updatedByName : "-"),
    },
  ];

  return (
    <>
      <Pageheader
        mainheading="Coaching Level"
        parentfolder="Coaching"
        activepage="Coaching Level"
      />
     
    <Row className="mt-5 row-sm">
      <Col md={12} lg={12} xl={12}>
        <Card className="custom-card transcation-crypto">
          <Card.Header className="border-bottom-0">
            {/* <div className="card-title">
              {isEditing ? "Update Level" : "Add Level"}
            </div> */}
          </Card.Header>
          <Card.Body>
            <Form onSubmit={formik.handleSubmit} className="form_main_class">
              {(canCreate || (canUpdate && isEditing)) && (
                <div className="form_left_section">
                  <div className="form-group">
                    <Form.Label>Level</Form.Label>
                    <Form.Control
                      type="text"
                      className="custom-select-height"
                      placeholder="Enter level"
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
                  data={levels}
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

                {totalPages > 1 && levels.length > 0 && (
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

export default CoachingLevel;