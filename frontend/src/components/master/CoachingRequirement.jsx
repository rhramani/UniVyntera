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
import { createCoachingRequirement, deleteCoachingRequirement, getAllCoachingRequirement, updateCoachingRequirement } from "../../redux/actions/Master/CoachingRequirement.action";

const CoachingRequirement = () => {
  const dispatch = useDispatch();
  const [allCoachingRequirements, setAllCoachingRequirements] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [highlightForm, setHighlightForm] = useState(false);
  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Requirement");

  useEffect(() => {
    if (canRead) {
      fetchCoachingRequirements(currentPage, itemsPerPage, search);
    }
  }, [currentPage, search]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      fetchCoachingRequirements(1, newItemsPerPage, search);
    }
  };

  const fetchCoachingRequirements = async (
    page = 1,
    limit = itemsPerPage,
    search = ""
  ) => {
    try {
      const res = await dispatch(getAllCoachingRequirement(page, limit, search));
      const responseData = res?.data?.data;
      setAllCoachingRequirements(responseData?.data || []);
      setTotalPages(responseData?.totalPages || 0);
      setTotalRecords(responseData?.totalRecords || 0);
    } catch (error) {
      console.error("Error fetching coaching requirements:", error);
      setAllCoachingRequirements([]);
      setTotalPages(0);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      id: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Coaching Requirement name is required"),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        toast.dismiss();
        if (values.id && canUpdate) {
          const res = await dispatch(
            updateCoachingRequirement({ name: values?.name }, values?.id)
          );
          if (res?.status === 200) {
            toast.success("Coaching Requirement updated successfully");
            setHighlightForm(false);
            resetForm();
          }
        } else if (!values.id && canCreate) {
          const res = await dispatch(
            createCoachingRequirement({ name: values?.name })
          );
          if (res?.status === 201) {
            toast.success("Coaching Requirement added successfully");
            setHighlightForm(false);
            resetForm();
          }
        }

        if (canRead) {
          fetchCoachingRequirements(currentPage, itemsPerPage, search);
        }
      } catch (error) {
        console.log("Error submitting form:", error);
        toast.dismiss();
        toast.error("Coaching Requirement already exists.");
        resetForm();
      }
    },
  });

  const handleEdit = (item) => {
    if (canUpdate) {
      formik.setFieldValue("name", item?.name);
      formik.setFieldValue("id", item?._id);
      setHighlightForm(true);
    } else {
      toast.error("You do not have permission to edit.");
    }
  };

  const handleDelete = async (item) => {
    try {
      toast.dismiss();
      const res = await dispatch(deleteCoachingRequirement(item?._id));
      if (res?.data?.code === 200) {
        toast.success("Coaching Requirement deleted successfully");
      }
      const updatedPage =
        allCoachingRequirements.length === 1 && currentPage > 1
          ? currentPage - 1
          : currentPage;
      setCurrentPage(updatedPage);
      if (canRead) {
        fetchCoachingRequirements(currentPage, itemsPerPage, search);
      }
    } catch (error) {
      console.log("Error", error);
      toast.error("Failed to delete the Coaching Requirement.");
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
      label: "Coaching Requirement",
      key: "name",
    },
    {
      label: "CREATED BY",
      render: (item) => (item.createdByName ? item?.createdByName : "-"),
    },
    {
      label: "UPDATED BY",
      render: (item) => (item.updatedByName ? item?.updatedByName : "-"),
    },
  ];

  return (
    <Row className="mt-5 row-sm">
      <Col md={12} lg={12} xl={12}>
        <Card className="custom-card transcation-crypto">
          <Card.Header className="border-bottom-0">
            <div>
              <div className="card-title">
                {highlightForm
                  ? "Update Coaching Requirement"
                  : "Add Coaching Requirement"}
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={formik.handleSubmit} className="form_main_class">
              {(canCreate || (canUpdate && highlightForm)) && (
                <div className="form_left_section">
                  <div className="form-group">
                    <Form.Label>Coaching Requirement Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      className="custom-select-height"
                      placeholder="Enter Coaching Requirement name..."
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
                    style={{ color: "#000000", minWidth: "90px" }}
                  >
                    Total Records :<strong>{totalRecords}</strong>
                  </span>
                </div>
              </div>
            </Form>

            <div className={highlightForm ? "update-warning mb-3" : ""}>
              {highlightForm ? "Update your information" : ""}
            </div>

            <DataTable
              columns={columns}
              data={allCoachingRequirements}
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

            {totalPages > 1 && allCoachingRequirements.length > 0 && (
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

export default CoachingRequirement;
