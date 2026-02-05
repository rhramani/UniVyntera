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
  createExam,
  deleteExam,
  getAllExam,
  updateExam,
} from "../../redux/actions/Lead/Exam.action";
import usePermissions from "../commonComponents/usePermissions";
import Pageheader from "../../layouts/Pageheader";

const Exam = () => {
  const dispatch = useDispatch();
  const [allExam, setAllExam] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [highlightForm, setHighlightForm] = useState(false);
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions("Exam");

  useEffect(() => {
    if (canRead) {
      fetchExams(currentPage, itemsPerPage, search);
    }
  }, [currentPage, search]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      fetchExams(1, newItemsPerPage, search);
    }
  };

  const fetchExams = async (page = 1, limit = itemsPerPage, search = "") => {
    try {
      const res = await dispatch(getAllExam(page, limit, search));
      const responseData = res?.data?.data;
      setAllExam(responseData?.data || []);
      setTotalPages(responseData?.totalPages || 0);
      setTotalRecords(responseData?.totalRecords || 0);
    } catch (error) {
      console.error("Error fetching Exam:", error);
      setAllExam([]);
      setTotalPages(0);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      id: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Exam Name is required"),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        toast.dismiss();
        if (values.id && canUpdate) {
          const res = await dispatch(
            updateExam({ name: values?.name }, values?.id)
          );
          if (res?.data?.code === 200) {
            toast.success("Exam updated successfully");
          }
        } else if (canCreate) {
          const res = await dispatch(createExam({ name: values?.name }));
          if (res?.data?.code == 201) {
            toast.success("Exam added successfully");
          }
        }
        resetForm();
        if (canRead) {
          fetchExams(currentPage, itemsPerPage, search);
        }
      } catch (error) {
        console.log("Error submitting form:", error);
        toast.dismiss();
        toast.error("Exam already exists..");
        resetForm();
      }
    },
  });

  const handleEdit = (exam) => {
    if (canUpdate) {
      formik.setFieldValue("name", exam?.name);
      formik.setFieldValue("id", exam?._id);
      setHighlightForm(true);
    }
  };

  const handleDelete = async (exam) => {
    try {
      toast.dismiss();
      const res = await dispatch(deleteExam(exam?._id));
      if (res?.data?.code === 200) {
        toast.success("Exam deleted successfully");
      }
      const updatedPage =
        allExam.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      setCurrentPage(updatedPage);
      if (canRead) {
        fetchExams(updatedPage, itemsPerPage, search);
      }
    } catch (error) {
      console.log("Error", error);
      toast.error("Failed to delete the Exam.");
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
      label: "Exam",
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
        mainheading="Exam"
        parentfolder="Lead Management"
        activepage="Exam"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              {/* <div>
              <div className="card-title">
                {highlightForm ? "Update Exam" : "Add Exam"}
              </div>
            </div> */}
            </Card.Header>
            <Card.Body>
              <form onSubmit={formik.handleSubmit} className="form_main_class bottom-margin">
                {(canCreate || (canUpdate && formik.values.id)) && (
                  <div className="form_left_section">
                    <div className="form-group">
                      <Form.Label>Exam</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        className="custom-select-height"
                        placeholder="Enter exam"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <div className="custom-text-danger">{formik.errors.name}</div>
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
                data={allExam}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
                // itemsPerPageOptions={false}
                canEdit={canUpdate}
                canDelete={canDelete}
                canRead={canRead}
              />

              {totalPages > 1 && allExam.length > 0 && (
                <div className="mt-4 d-flex justify-content-end align-items-end">
                  <Paginations
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  /></div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default Exam;
