import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Card,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Paginations from "../elements/Paginations";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import DataTable from "../commonComponents/DataTable";
import Select from "react-select";
import {
  createVisitorDocumentList,
  deleteVisitorDocumentList,
  getAllVisitorDocumentList,
  updateVisitorDocumentList,
} from "../../redux/actions/Document/VisitorDocumentList.action";
import { getAllVisitorDocumentType } from "../../redux/actions/Document/visitorDocumentType.action";
import usePermissions from "../commonComponents/usePermissions";

const VisitorDocumentList = () => {
  const dispatch = useDispatch();
  const [allDocumentList, setAllDocumentList] = useState([]);
  const [allDocumentType, setAllDocumentType] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [highlightForm, setHighlightForm] = useState(false);
  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Visitor Document List");
  useEffect(() => {
    fetchDocumentLists(currentPage, itemsPerPage, search);
  }, [currentPage, search]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      fetchDocumentLists(1, newItemsPerPage, search);
    }
  };

  const fetchDocumentLists = async (
    page = 1,
    limit = itemsPerPage,
    search = ""
  ) => {
    try {
      const res = await dispatch(getAllVisitorDocumentList(page, limit, search));
      const responseData = res?.data?.data;
      setAllDocumentList(responseData?.data || []);
      setTotalPages(responseData?.totalPages || 0);
      setTotalRecords(responseData?.totalRecords || 0);
    } catch (error) {
      console.error("Error fetching Exam:", error);
      setAllDocumentList([]);
      setTotalPages(0);
    }
  };
  const fetchDocumentType = async () => {
    try {
      const res = await dispatch(getAllVisitorDocumentType(1, 100));
      const responseData = res?.data?.data;
      setAllDocumentType(responseData?.data || []);
    } catch (error) {
      console.error("Error fetching Visitor Document Type:", error);
    }
  };
  useEffect(() => {
    fetchDocumentType();
  }, []);
  const formik = useFormik({
    initialValues: {
      name: "",
      type: "",
      id: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Visitor Document Name is required"),
      type: Yup.string().required("Visitor Document Type is required"),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        toast.dismiss();
        if (values.id && canUpdate) {
          const res = await dispatch(updateVisitorDocumentList(values, values?.id));
          if (res?.data?.code === 200) {
            toast.success("Visitor Document List updated successfully");
          }
        } else if (canCreate) {
          const res = await dispatch(createVisitorDocumentList(values));
          if (res?.data?.code == 201) {
            toast.success("Visitor Document List added successfully");
          }
        }
        resetForm();
        if (canRead) {
          fetchDocumentLists(currentPage, itemsPerPage, search);
        }
      } catch (error) {
        console.log("Error submitting form:", error);
        toast.dismiss();
        toast.error("Visitor Document List already exists..");
        resetForm();
      }
    },
  });

  const handleEdit = (documentList) => {
    if (canUpdate) {
      formik.setFieldValue("name", documentList?.name);
      formik.setFieldValue("type", documentList?.type?._id);
      formik.setFieldValue("id", documentList?._id);
      setHighlightForm(true);
    }
  };

  const handleDelete = async (documentList) => {
    try {
      toast.dismiss();
      const res = await dispatch(deleteVisitorDocumentList(documentList?._id));
      if (res?.data?.code === 200) {
        toast.success("Visitor Document List deleted successfully");
      }
      const updatedPage =
        allDocumentList.length === 1 && currentPage > 1
          ? currentPage - 1
          : currentPage;
      setCurrentPage(updatedPage);
      if (canRead) {
        fetchDocumentLists(updatedPage, itemsPerPage, search);
      }
    } catch (error) {
      console.log("Error", error);
      toast.error("Failed to delete the Visitor Document List.");
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
      label: "Visitor Document Type",
      render: (item) => (item.type ? item?.type?.name : "-"),
    },
    {
      label: "Visitor Document Name",
      render: (item) => {
        const documentName = item?.name || "-";

        return (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{documentName}</Tooltip>}
          >
            <span style={{ cursor: "pointer" }}>{documentName}</span>
          </OverlayTrigger>
        );
      },
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
                {highlightForm ? "Update Visitor Document List" : "Add Visitor Document List"}
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <form onSubmit={formik.handleSubmit} className="form_main_class">
              {(canCreate || (canUpdate && formik.values.id)) && (
                <div className="form_left_section">
                  <div className="form-group">
                    <Form.Label className="form-label">
                      Visitor Document Type
                    </Form.Label>
                    <Select
                      className="custom-select-height"
                      options={allDocumentType
                        ?.sort((a, b) => a.name.localeCompare(b.name))
                        ?.map((type) => ({
                          value: type._id,
                          label: type.name,
                        }))}
                      value={
                        formik.values.type
                          ? allDocumentType
                              ?.map((type) => ({
                                value: type._id,
                                label: type.name,
                              }))
                              .find((s) => s.value === formik.values.type)
                          : null
                      }
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          formik.setFieldValue("type", selectedOption.value);
                          formik.setFieldError("type", "");
                        } else {
                          formik.setFieldValue("type", "");
                        }
                      }}
                      isClearable
                      isSearchable
                      placeholder="Select Visitor Document type"
                      classNamePrefix="custom-select"
                      noOptionsMessage={() => "No Visitor Document Type available"}
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: " 30px",
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
                    {formik.touched.type && formik.errors.type && (
                      <div className="custom-text-danger">
                        {formik.errors.type}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <Form.Label className="form-label">
                      Visitor Document Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      className="custom-select-height"
                      placeholder="Enter Visitor Document name..."
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
              data={allDocumentList}
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

            {totalPages > 1 && allDocumentList.length > 0 && (
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
export default VisitorDocumentList;
