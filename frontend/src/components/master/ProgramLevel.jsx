import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Paginations from "../elements/Paginations";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  createProgramLevel,
  deleteProgramLevel,
  getAllProgramLevel,
  updateProgramLevel,
} from "../../redux/actions/Master/ProgramLevel.action";
import { useEffect, useState } from "react";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import DataTable from "../commonComponents/DataTable";
import usePermissions from "../commonComponents/usePermissions";

const ProgramLevel = () => {
  const dispatch = useDispatch();
  const [programLevel, setProgramLevel] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [highlightForm, setHighlightForm] = useState(false);
  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Program Level");

  useEffect(() => {
    if (canRead) {
      fetchProgramLevel(currentPage, itemsPerPage, search);
    } else {
      setProgramLevel([]);
      setTotalPages(0);
      setTotalRecords(0);
    }
  }, [currentPage, search, canRead]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      fetchProgramLevel(1, newItemsPerPage, search);
    }
  };

  const fetchProgramLevel = async (
    page = 1,
    limit = itemsPerPage,
    search = ""
  ) => {
    try {
      const res = await dispatch(getAllProgramLevel(page, limit, search));

      const responseData = res?.data?.data;
      setProgramLevel(responseData?.data || []);
      setTotalPages(responseData?.totalPages || 0);
      setTotalRecords(responseData?.totalRecords || 0);
    } catch (error) {
      console.error("Error fetching program level:", error);
      setProgramLevel([]);
      setTotalPages(0);
    }
  };
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("ProgramLevel is Required"),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        toast.dismiss();
        if (values.id && canUpdate) {
          const res = await dispatch(updateProgramLevel(values, values.id));
          if (res?.data?.code === 200) {
            toast.success("ProgramLevel updated successfully");
          }
        } else if (canCreate) {
          const res = await dispatch(createProgramLevel(values));

          if (res?.data?.code === 201) {
            toast.success("ProgramLevel added successfully");
          }
        }
        resetForm();
        if (canRead) {
          fetchProgramLevel(currentPage, itemsPerPage, search);
        }
      } catch (error) {
        toast.dismiss();
        console.log("Error submitting form:", error);
        resetForm();
      }
    },
  });

  const handleEdit = (item) => {
    if (canUpdate) {
      formik.setFieldValue("id", item?._id);
      formik.setFieldValue("name", item?.name);
      setHighlightForm(true);
    } else {
      toast.error("You do not have permission to edit.");
    }
  };

  const columns = [
    {
      label: "Program Level",
      key: "name",
    },
    {
      label: "CREATED BY",
      render: (item) => (item.created_by ? item?.created_by?.name : "-"),
    },
    {
      label: "UPDATED BY",
      render: (item) => (item.updatedByName ? item?.updatedByName : "-"),
    },
  ];

  const handleDelete = async (item) => {
    if (canDelete) {
      try {
        toast.dismiss();
        const res = await dispatch(deleteProgramLevel(item?._id));
        if (res?.data?.code === 200) {
          toast.success("ProgramLevel deleted successfully");
        }
        const newPage =
          programLevel.length === 1 && currentPage > 1
            ? currentPage - 1
            : currentPage;
        setCurrentPage(newPage);
        if (canRead) {
          fetchProgramLevel(newPage, itemsPerPage, search);
        }
      } catch (error) {
        console.log("Error deleting program level:", error);
      }
    }
  };
  return (
    <Row className="mt-5 row-sm">
      <Col md={12} lg={12} xl={12}>
        <Card className="custom-card transcation-crypto">
          <Card.Header className="border-bottom-0">
            <div>
              <div className="card-title">
                {highlightForm ? "Update Program Level" : "Add Program Level"}
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={formik.handleSubmit} className="form_main_class">
              {(canCreate || (canUpdate && formik.values.id)) && (
                <div className="form_left_section">
                  <div className="form-group">
                    <Form.Label>Program Level</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      className="custom-select-height"
                      placeholder="Enter program level..."
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
                    Total Records :<strong>&nbsp;{totalRecords}</strong>
                  </span>
                </div>
              </div>
            </Form>

            <div className={highlightForm ? "update-warning mb-3" : ""}>
              {highlightForm ? "Update your information" : ""}
            </div>

            <DataTable
              columns={columns}
              data={programLevel}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              onEdit={handleEdit}
              onDelete={handleDelete}
              renderActions={false}
              itemsPerPageOptions={true}
              canEdit={canUpdate}
              canDelete={canDelete}
              canRead={canRead}
            />
            {totalPages > 1 && programLevel.length > 0 && (
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

export default ProgramLevel;
