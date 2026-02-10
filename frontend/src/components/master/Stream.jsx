import { useEffect, useState } from "react";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createStream,
  deleteStream,
  getAllStream,
  updateStream,
} from "../../redux/actions/Master/Stream.action";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Paginations from "../elements/Paginations";
import { getAllQualification } from "../../redux/actions/Master/Qualification.action";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import DataTable from "../commonComponents/DataTable";
import usePermissions from "../commonComponents/usePermissions";
import Select from "react-select";
import Pageheader from "../../layouts/Pageheader";

const Stream = () => {
  const dispatch = useDispatch();
  const [allQualification, setAllQualification] = useState([]);
  const [allStream, setAllStream] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [highlightForm, setHighlightForm] = useState(false);
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions("Stream");

  useEffect(() => {
    if (canRead) {
      fetchQualifications();
      fetchStreams(currentPage, itemsPerPage, search);
    }
  }, [canRead]);
  useEffect(() => {
    if (canRead) fetchStreams(currentPage, itemsPerPage, search);
  }, [currentPage, search]);
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      fetchStreams(1, newItemsPerPage, search);
    }
  };

  const fetchQualifications = async () => {
    try {
      const res = await dispatch(getAllQualification(1, 100));
      const responseData = res?.data?.data;
      setAllQualification(responseData?.data || []);
    } catch (error) {
      console.error("Error fetching qualifications:", error);
    }
  };

  const fetchStreams = async (page = 1, limit = itemsPerPage, search = "") => {
    try {
      const res = await dispatch(getAllStream(page, limit, search));
      const responseData = res?.data?.data;
      setAllStream(responseData?.data || []);
      
      setTotalPages(responseData?.totalPages || 0);
      setTotalRecords(responseData?.totalRecords || 0);
    } catch (error) {
      console.error("Error fetching streams:", error);
      setAllStream([]);
      setTotalPages(0);
    }
  };

  const formik = useFormik({
    initialValues: {
      qualification: "",
      stream: "",
      // id: "",
    },
    validationSchema: Yup.object({
      stream: Yup.string().required("Stream is required"),
      qualification: Yup.string().required("Qualification is required"),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        toast.dismiss();
        if (values.id && canUpdate) {
          const res = await dispatch(
            updateStream(
              { stream: values?.stream, qualification: values?.qualification },
              values.id
            )
          );
          if (res?.data?.code === 200) {
            toast.success("Stream updated successfully");
            resetForm();
            setHighlightForm(false);
          }
        } else if (canCreate) {
          const res = await dispatch(
            createStream({
              stream: values?.stream,
              qualification: values?.qualification,
            })
          );
          if (res?.data?.code == 201) {
            toast.success("Stream added successfully");
            resetForm();
            setHighlightForm(false);
          }
        }

        if (canRead) {
          fetchStreams(currentPage, itemsPerPage, search);
        }
      } catch (error) {
        console.log("Error submitting form:", error);
        toast.dismiss();
        toast.error("Stream already exists..");
        resetForm();
      }
    },
  });

  const handleEdit = (stream) => {
    if (canUpdate) {
      formik.setFieldValue("stream", stream?.stream);
      formik.setFieldValue("qualification", stream?.qualification?._id);
      formik.setFieldValue("id", stream?._id);
      setHighlightForm(true);
    } else {
      toast.error("You do not have permission to edit.");
    }
  };

  const handleDelete = async (stream) => {
    if (canDelete) {
      try {
        toast.dismiss();
        const res = await dispatch(deleteStream(stream?._id));
        if (res?.data?.code === 200) {
          toast.success("Stream deleted successfully");
        }
        const updatedPage =
          allStream.length === 1 && currentPage > 1
            ? currentPage - 1
            : currentPage;
        setCurrentPage(updatedPage);
        fetchStreams(updatedPage, itemsPerPage, search);
      } catch (error) {
        console.log("Error", error);
        toast.error("Failed to delete the stream.");
      }
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
      label: "Qualification",
      key: "qualification",
      render: (item) => item?.qualification?.qualification || "-",
    },
    {
      label: "Stream Name",
      key: "stream",
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
        mainheading="Stream"
        parentfolder="Course"
        activepage="Stream"
      />
    <Row className="mt-5 row-sm">
      <Col md={12} lg={12} xl={12}>
        <Card className="custom-card transcation-crypto">
          <Card.Header className="border-bottom-0">
            {/* <div>
              <div className="card-title">
                {highlightForm ? "Update stream" : "Add stream"}
              </div>
            </div> */}
          </Card.Header>
          <Card.Body>
            <Form onSubmit={formik.handleSubmit} className="form_main_class">
              {(canCreate || (canUpdate && highlightForm)) && (
                <div className="form_left_section">
                  <div className="form-group">
                    <Form.Label>Qualification</Form.Label>
                    <Select
                      name="qualification"
                      className="custom-select-height"
                      classNamePrefix="select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: "12px",
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
                      value={
                        formik.values.qualification
                          ? {
                              value: formik.values.qualification,
                              label:
                                allQualification?.find(
                                  (item) =>
                                    item._id === formik.values.qualification
                                )?.qualification || "Select Qualification",
                            }
                          : null
                      }
                      onChange={(option) => {
                        formik.setFieldValue(
                          "qualification",
                          option ? option.value : ""
                        );
                        formik.setFieldError("qualification", "");
                      }}
                      onBlur={() =>
                        formik.setFieldTouched("qualification", true)
                      }
                      options={allQualification?.map((item) => ({
                        value: item._id,
                        label: item.qualification,
                      }))}
                      placeholder="Select Qualification"
                      isClearable
                    />
                    {formik.touched.qualification &&
                      formik.errors.qualification && (
                        <div className="custom-text-danger">
                          {formik.errors.qualification}
                        </div>
                      )}
                  </div>
                  <div className="form-group">
                    <Form.Label>Stream</Form.Label>
                    <Form.Control
                      type="text"
                      name="stream"
                      className="custom-select-height"
                      placeholder="Enter stream"
                      value={formik.values.stream}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.stream && formik.errors.stream && (
                      <div className="custom-text-danger">{formik.errors.stream}</div>
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

            <div className={highlightForm ? "update-warning mb-3" : ""}>
              {highlightForm ? "Update your information" : ""}
            </div>

            <DataTable
              columns={columns}
              data={allStream}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              onEdit={handleEdit}
              onDelete={handleDelete}
              itemsPerPageOptions={true}
              canEdit={canUpdate}
              canDelete={canDelete}
              canRead={canRead}
            />

            {totalPages > 1 && allStream.length > 0 && (
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

export default Stream;
