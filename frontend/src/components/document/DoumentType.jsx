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
  createDocumentType,
  deleteDocumentType,
  getAllDocumentType,
  updateDocumentType,
} from "../../redux/actions/Document/DocumentType.action";
import usePermissions from "../commonComponents/usePermissions";
import Pageheader from "../../layouts/Pageheader";

const DocumentType = () => {
  const dispatch = useDispatch();
  const [allDocumentType, setAllDocumentType] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [highlightForm, setHighlightForm] = useState(false);
  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Assign Document Type");

  useEffect(() => {
    if (canRead) {
      fetchDocumentType(currentPage, itemsPerPage, search);
    }
  }, [currentPage, search]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      fetchDocumentType(1, newItemsPerPage, search);
    }
  };

  const fetchDocumentType = async (
    page = 1,
    limit = itemsPerPage,
    search = ""
  ) => {
    try {
      const res = await dispatch(getAllDocumentType(page, limit, search));
      const responseData = res?.data?.data;
      setAllDocumentType(responseData?.data || []);
      setTotalPages(responseData?.totalPages || 0);
      setTotalRecords(responseData?.totalRecords || 0);
    } catch (error) {
      console.error("Error fetching Document Type:", error);
      setAllDocumentType([]);
      setTotalPages(0);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      id: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Document Type is required"),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        toast.dismiss();
        if (values.id && canUpdate) {
          const res = await dispatch(
            updateDocumentType({ name: values?.name }, values?.id)
          );
          if (res?.data?.code === 200) {
            toast.success("Document Type updated successfully");
          }
        } else if (canCreate) {
          const res = await dispatch(
            createDocumentType({ name: values?.name })
          );
          if (res?.data?.code == 201) {
            toast.success("Document Type added successfully");
          }
        }
        resetForm();
        if (canRead) {
          fetchDocumentType(currentPage, itemsPerPage, search);
        }
      } catch (error) {
        console.log("Error submitting form:", error);
        toast.dismiss();
        toast.error("Document Type already exists..");
        resetForm();
      }
    },
  });

  const handleEdit = (documentType) => {
    if (canUpdate) {
      formik.setFieldValue("name", documentType?.name);
      formik.setFieldValue("id", documentType?._id);
      setHighlightForm(true);
    }
  };

  const handleDelete = async (documentType) => {
    try {
      toast.dismiss();
      const res = await dispatch(deleteDocumentType(documentType?._id));
      if (res?.data?.code === 200) {
        toast.success("Document Type deleted successfully");
      }
      const updatedPage =
        allDocumentType.length === 1 && currentPage > 1
          ? currentPage - 1
          : currentPage;
      setCurrentPage(updatedPage);
      if (canRead) {
        fetchDocumentType(updatedPage, itemsPerPage, search);
      }
    } catch (error) {
      console.log("Error", error);
      toast.error("Failed to delete the documentType.");
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
      label: "Document Type",
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
        mainheading="Document Type"
        parentfolder="Assign"
        activepage="Document Type"
      />
    <Row className="mt-5 row-sm">
      <Col md={12} lg={12} xl={12}>
        <Card className="custom-card transcation-crypto">
          <Card.Header className="border-bottom-0">
            {/* <div>
              <div className="card-title">
                {highlightForm ? "Update Document Type" : "Add Document Type"}
              </div>
            </div> */}
          </Card.Header>
          <Card.Body>
            <form onSubmit={formik.handleSubmit} className="form_main_class">
              {(canCreate || (canUpdate && formik.values.id)) && (
                <div className="form_left_section">
                  <div className="form-group">
                    <Form.Label className="form-label">
                      Document Type
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      className="custom-select-height"
                      placeholder="Enter document type"
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
                      className="custom-select-height submit-button"
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
                  <span
                    className="dark_theme"
                    style={{
                      color: "#000000",
                      fontSize: "13px",
                      minWidth: "70px",
                    }}
                  >
                    Total Records :
                    <strong>{totalRecords}</strong>
                  </span>
                </div>
              </div>
            </form>

            <div className={highlightForm ? "update-warning mb-3" : ""}>
              {highlightForm ? "Update your information" : ""}
            </div>

            <DataTable
              columns={columns}
              data={allDocumentType}
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

            {totalPages > 1 && allDocumentType.length > 0 && (
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
export default DocumentType;
