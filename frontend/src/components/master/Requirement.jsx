import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Paginations from "../elements/Paginations";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  createRequirement,
  deleteRequirement,
  getAllRequirement,
  updateRequirement,
} from "../../redux/actions/Master/Requirement.action";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import DataTable from "../commonComponents/DataTable";
import usePermissions from "../commonComponents/usePermissions";
import Pageheader from "../../layouts/Pageheader";

const Requirement = () => {
  const dispatch = useDispatch();
  const [requirement, setRequirement] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [highlightForm, setHighlightForm] = useState(false);
  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Requirements");

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      fetchRequirement(1, newItemsPerPage, search);
    }
  };

  const fetchRequirement = async (
    page = 1,
    limit = itemsPerPage,
    search = ""
  ) => {
    try {
      const res = await dispatch(getAllRequirement(page, limit, search));
      const responseData = res?.data?.data;
      setRequirement(responseData?.data || []);
      setTotalPages(responseData?.totalPages || 0);
      setTotalRecords(responseData?.totalRecords || 0);
    } catch (error) {
      console.log("Error fetching Requirement:", error);
      setRequirement([]);
      setTotalPages(0);
    }
  };
  useEffect(() => {
    if (canRead) {
      fetchRequirement(currentPage, itemsPerPage, search);
    }
  }, [currentPage, itemsPerPage, search, canRead]);
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Requirement is Required"),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        toast.dismiss();
        if (values.id && canUpdate) {
          const res = await dispatch(updateRequirement(values, values.id));
          if (res?.data?.code === 200) {
            toast.success("Requirement updated successfully");
          }
        } else if (canCreate) {
          const res = await dispatch(createRequirement(values));
          if (res?.data?.code === 201) {
            toast.success("Requirement added successfully");
          }
        }
        resetForm();
        if (canRead) {
          fetchRequirement(currentPage, itemsPerPage, search);
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
      formik.setFieldValue("id", item?._id);
      formik.setFieldValue("name", item?.name);
      setHighlightForm(true);
    } else {
      toast.error("You do not have permission to edit.");
    }
  };

  const handleDelete = async (item) => {
    if (canDelete) {
      try {
        const res = await dispatch(deleteRequirement(item?._id));
        if (res?.data?.code === 200) {
          toast.success("Requirement deleted successfully");
        }
        const updatedPage =
          requirement.length === 1 && currentPage > 1
            ? currentPage - 1
            : currentPage;
        setCurrentPage(updatedPage);
        if (canRead) {
          fetchRequirement(currentPage, itemsPerPage, search);
        }
      } catch (error) {
        console.log("Error deleting Requirement:", error);
      }
    }
  };

  const columns = [
    {
      label: "Requirement",
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

  return (
    <>
      <Pageheader
        mainheading="Requirement"
        parentfolder="Course"
        activepage="Requirement"
      />
    <Row className="mt-5 row-sm">
      <Col md={12} lg={12} xl={12}>
        <Card className="custom-card transcation-crypto">
          <Card.Header className="border-bottom-0">
            {/* <div>
              <div className="card-title">
                {highlightForm ? "Update Requirement" : "Add Requirement"}
              </div>
            </div> */}
          </Card.Header>
          <Card.Body>
            <Form onSubmit={formik.handleSubmit} className="form_main_class">
              {(canCreate || (canUpdate && formik.values.id)) && (
                <div className="form_left_section">
                  <div className="form-group">
                    <Form.Label>Requirement</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      className="custom-select-height"
                      placeholder="Enter requirement"
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
              data={requirement}
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
            {totalPages > 1 && requirement.length > 0 && (
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

export default Requirement;
