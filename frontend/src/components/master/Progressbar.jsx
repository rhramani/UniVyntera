import { useEffect, useState } from "react";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Paginations from "../elements/Paginations";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import Select from "react-select";
import { countryDropdown } from "../../redux/actions/Master/Institute.action";
import {
  createProgressbar,
  deleteProgressbar,
  getAllProgressbar,
} from "../../redux/actions/Master/Progressbar.action";
import CountryWiseSteps from "./components/CountryWiseSteps";
import usePermissions from "../commonComponents/usePermissions";

const Progressbar = () => {
  const dispatch = useDispatch();
  const [allProgress, setAllProgress] = useState([]);
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [highlightForm, setHighlightForm] = useState(false);
  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Progressbar");
  const stepOptions = [
    { value: "personalDetails", label: "Personal Details" },
    { value: "document", label: "Document" },
    { value: "courseSelection", label: "Course Selection" },
    { value: "visaApplication", label: "Visa Application" },
    // { value: "Visa", label: "Visa" },
  ];

  const formik = useFormik({
    initialValues: {
      country: "",
      steps: [],
      id: "",
    },
    validationSchema: Yup.object({
      country: Yup.string().required("Country is required"),
      steps: Yup.array()
        .of(Yup.string())
        .min(1, "At least one step is required")
        .required("Steps are required"),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        toast.dismiss();
        const payload = {
          country: values.country,
          steps: values.steps,
        };
        if (values.id && canUpdate) {
          const res = await dispatch(createProgressbar(payload, values.id));
          if (res?.data?.code === 200) {
            toast.success("Progress steps updated successfully");
          }
        } else if (canCreate) {
          const res = await dispatch(createProgressbar(payload));
          if (res?.data?.code === 201) {
            if (res?.data?.data?.message) {
              toast.error(res?.data?.data?.message);
            } else {
              toast.success("Progress steps added successfully");
            }
          }
        }
        resetForm();
        setHighlightForm(false);
        if (canRead) {
          fetchProgress(currentPage, itemsPerPage, search);
        }
      } catch (error) {
        console.log("Error submitting form:", error);
        toast.dismiss();
        toast.error("Failed to save progress steps.");
        resetForm();
      }
    },
  });

  const fetchCountries = async () => {
    const res = await dispatch(countryDropdown());
    setCountries(res?.data?.data || []);
  };

  useEffect(() => {
    if (canRead) {
      fetchProgress(currentPage, itemsPerPage, search);
    }
    fetchCountries();
  }, [currentPage, search]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      fetchProgress(1, newItemsPerPage, search);
    }
  };

  const fetchProgress = async (page = 1, limit = itemsPerPage, search = "") => {
    try {
      const res = await dispatch(getAllProgressbar(page, limit, search, ""));
      const responseData = res?.data?.data;
      setAllProgress(responseData?.data || []);
      setTotalPages(responseData?.totalPages || 0);
      setTotalRecords(responseData?.totalRecords || 0);
    } catch (error) {
      console.error("Error fetching progress:", error);
      setAllProgress([]);
      setTotalPages(0);
    }
  };

  const handleEdit = (progress) => {
    if (canUpdate) {
      formik.setFieldValue("country", progress?.country);
      formik.setFieldValue("steps", progress?.steps);
      formik.setFieldValue("id", progress?._id);
      setHighlightForm(true);
    }
  };

  const handleDelete = async (progress) => {
    try {
      toast.dismiss();
      if (!progress?._id) {
        throw new Error("Invalid progress ID");
      }
      const res = await dispatch(deleteProgressbar(progress._id));
      if (res?.data?.code === 200) {
        toast.success("Progress steps deleted successfully");
        const updatedPage =
          allProgress.length === 1 && currentPage > 1
            ? currentPage - 1
            : currentPage;
        setCurrentPage(updatedPage);
        if (canRead) {
          fetchProgress(updatedPage, itemsPerPage, search);
        }
      } else {
        throw new Error(res?.data?.message || "Deletion failed");
      }
    } catch (error) {
      console.error("Error deleting progress:", error);
      toast.error(error.message || "Failed to delete the progress steps.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.name !== "country" && event.target.name !== "steps") {
        formik.setFieldTouched("country", false);
        formik.setFieldTouched("steps", false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [formik]);

  const columns = [
    {
      label: "Country",
      key: "country",
    },
    {
      label: "Steps",
      render: (item) => item.steps.join(", "),
    },
    {
      label: "Created By",
      render: (item) => (item.createdByName ? item.createdByName : "-"),
    },
    {
      label: "Updated By",
      render: (item) => (item.updatedByName ? item.updatedByName : "-"),
    },
  ];

  return (
    <Row className="mt-5 row-sm">
      <Col md={12} lg={12} xl={12}>
        <Card className="custom-card transcation-crypto">
          <Card.Header className="border-bottom-0">
            <div>
              <div className="card-title">
                {allProgress?.length > 0 && (
                <>{highlightForm ? "Update Progress Steps" : "Add Progress Steps"}</>
                )}
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <form onSubmit={formik.handleSubmit} className="form_main_class">
              {(canCreate || (canUpdate && formik.values.id)) && (
                <div className="form_left_section">
                  <div className="form-group">
                    <Form.Label>Country</Form.Label>
                    <Select
                      className="custom-select-height"
                      options={countries?.map((c) => ({
                        value: c.name,
                        label: c.name,
                      }))}
                      value={countries
                        ?.map((c) => ({ value: c.name, label: c.name }))
                        .filter(
                          (option) => option.value === formik.values.country
                        )}
                      onChange={(selectedOption) => {
                        formik.setFieldValue(
                          "country",
                          selectedOption?.value || ""
                        );
                      }}
                      isClearable
                      isSearchable
                      placeholder="Select Country"
                      classNamePrefix="custom-select"
                      noOptionsMessage={() => "No countries available"}
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
                    />
                    {formik.touched.country && formik.errors.country ? (
                      <div className="text-danger">{formik.errors.country}</div>
                    ) : null}
                  </div>
                  <div className="form-group">
                    <Form.Label>Progress Steps</Form.Label>
                    <Select
                      className="custom-select-height"
                      options={stepOptions}
                      value={stepOptions?.filter((option) =>
                        formik.values.steps?.includes(option.value)
                      )}
                      onChange={(selectedOptions) => {
                        const selectedValues = selectedOptions
                          ? selectedOptions?.map((opt) => opt?.value)
                          : [];
                        formik.setFieldValue("steps", selectedValues);
                      }}
                      isMulti
                      isClearable
                      isSearchable
                      classNamePrefix="custom-select"
                      noOptionsMessage={() => "No steps available"}
                      placeholder="Select steps in order"
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
                    />
                    {formik.touched.steps && formik.errors.steps ? (
                      <div className="text-danger">{formik.errors.steps}</div>
                    ) : null}
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

              {canRead && allProgress?.length > 0 && (
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
                  <span>
                    Total Records: <strong>{totalRecords}</strong>
                  </span>
                </div>
              </div>
              )}
            </form>

            <div className={highlightForm ? "update-warning mb-3" : ""}>
              {highlightForm ? "Update your information" : ""}
            </div>

            <CountryWiseSteps
              columns={columns}
              data={allProgress}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canEdit={canUpdate}
              canDelete={canDelete}
              canRead={canRead}
              stepOptions={stepOptions}
            />

            {totalPages > 1 && allProgress.length > 0 && (
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

export default Progressbar;
