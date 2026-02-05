import { useEffect, useState } from "react";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Paginations from "../elements/Paginations";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import DataTable from "../commonComponents/DataTable";
import {
  createApplicationType,
  deleteApplicationType,
  getAllApplicationType,
  updateApplicationType,
} from "../../redux/actions/Master/ApplicationType.action";
import usePermissions from "../commonComponents/usePermissions";
import LoadMoreButton from "../commonComponents/LoadMoreButton";
import Pageheader from "../../layouts/Pageheader";

const ApplicationType = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [allApplicationType, setAllApplicationType] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [highlightForm, setHighlightForm] = useState(false);
  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Application Type");

  useEffect(() => {
    if (canRead) {
      fetchApplicationTypes(currentPage, itemsPerPage, search);
    }
  }, [currentPage, search]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      fetchApplicationTypes(1, newItemsPerPage, search);
    }
  };

  const fetchApplicationTypes = async (
    page = 1,
    limit = itemsPerPage,
    search = ""
  ) => {
    try {
      setIsLoading(true);
      const res = await dispatch(getAllApplicationType(page, limit, search));
      const responseData = res?.data?.data;
      setAllApplicationType(responseData?.data || []);
      setTotalPages(responseData?.totalPages || 0);
      setTotalRecords(responseData?.totalRecords || 0);
    } catch (error) {
      console.error("Error fetching Application Type:", error);
      setAllApplicationType([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      id: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Application Type Name is required"),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        toast.dismiss();
        if (values.id && canUpdate) {
          const res = await dispatch(
            updateApplicationType({ name: values?.name }, values?.id)
          );
          if (res?.data?.code === 200) {
            toast.success("Application Type updated successfully");
          }
        } else if (canCreate) {
          const res = await dispatch(
            createApplicationType({ name: values?.name })
          );
          if (res?.data?.code === 201) {
            if (res?.data?.data?.message) {
              toast.error(res?.data?.data?.message);
            } else {
              toast.success("Application Type added successfully");
            }
          }
        }
        resetForm();
        if (canRead) {
          fetchApplicationTypes(currentPage, itemsPerPage, search);
        }
      } catch (error) {
        console.log("Error submitting form:", error);
        toast.dismiss();
        toast.error("Application Type already exists.");
        resetForm();
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleEdit = (applicationType) => {
    if (canUpdate) {
      formik.setFieldValue("name", applicationType?.name);
      formik.setFieldValue("id", applicationType?._id);
      setHighlightForm(true);
    } else {
      toast.error("You do not have permission to edit.");
    }
  };

  const handleDelete = async (applicationType) => {
    setIsLoading(true);
    try {
      toast.dismiss();
      const res = await dispatch(deleteApplicationType(applicationType?._id));
      if (res?.data?.code === 200) {
        toast.success("Application Type deleted successfully");
      }
      const updatedPage =
        allApplicationType.length === 1 && currentPage > 1
          ? currentPage - 1
          : currentPage;
      setCurrentPage(updatedPage);
      if (canRead) {
        fetchApplicationTypes(updatedPage, itemsPerPage, search);
      }
    } catch (error) {
      console.log("Error", error);
      toast.error("Failed to delete the Application Type.");
    } finally {
      setIsLoading(false);
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
      label: "Application Type",
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
    <>
      <Pageheader
        mainheading="Application Type"
        parentfolder="Master"
        activepage="Application Type"
      />
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
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              {/* <div className="card-title">
                {highlightForm
                  ? "Update Application Type"
                  : "Add Application Type"}
              </div> */}
            </Card.Header>

            <Card.Body>
              <form onSubmit={formik.handleSubmit} className="form_main_class">
                {(canCreate || (canUpdate && formik.values.id)) && (
                  <div className="form_left_section bottom-margin">
                    <div className="form-group">
                      <Form.Label>Application Type</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        className="custom-select-height"
                        placeholder="Enter application type"
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
                        onClick={() => setHighlightForm(false)}
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
                  <div className="custom-select-height border px-3 mt-2 mt-md-0 d-flex align-items-center h-6">
                    <span>
                      Total Records :<strong>&nbsp;{totalRecords}</strong>
                    </span>
                  </div>
                </div>
              </form>

              <div className={highlightForm ? "update-warning mb-3" : ""}>
                {highlightForm ? "Update your information" : ""}
              </div>

              <DataTable
                columns={columns}
                data={allApplicationType}
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

              {totalPages > 1 && allApplicationType.length > 0 && (
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

export default ApplicationType;
