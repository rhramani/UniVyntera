import { useEffect, useState } from "react";
import { Button, Form, Row, Col, Card, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import {
  createTag,
  deleteTag,
  getAllTag,
  updateTag,
} from "../../redux/actions/Master/Tag.action";
import usePermissions from "../commonComponents/usePermissions";
import Pageheader from "../../layouts/Pageheader";

const Tag = () => {
  const dispatch = useDispatch();
  const [allTags, setAllTags] = useState([]);
  const [highlightForm, setHighlightForm] = useState(false);
  const [search, setSearch] = useState("");

  const { canCreate, canRead, canUpdate, canDelete } = usePermissions("Tag");

  useEffect(() => {
    if (canRead) {
      fetchAllTags(search);
    } else {
      setAllTags([]);
    }
  }, [canRead, search]);

  const fetchAllTags = async (search = "") => {
    try {
      const res = await dispatch(getAllTag(search));
      const responseData = res?.data?.data;
      setAllTags(responseData || []);
    } catch (error) {
      console.error("Error fetching qualifications:", error);
      setAllTags([]);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      id: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Tag is required"),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        toast.dismiss();
        if (values.id) {
          const res = await dispatch(
            updateTag({ name: values?.name }, values?.id)
          );
          if (res?.data?.code === 200) {
            toast.success("Tag updated successfully");
          }
        } else {
          const res = await dispatch(createTag({ name: values?.name }));
          if (res?.data?.code == 201) {
            toast.success("Tag added successfully");
          }
        }
        resetForm();
        if (canRead) {
          fetchAllTags(search);
        }
      } catch (error) {
        console.log("Error submitting form:", error);
        toast.dismiss();
        toast.error("Tag already exists..");
        resetForm();
      }
    },
  });

  const handleEdit = (tag) => {
    if (canUpdate) {
      formik.setFieldValue("name", tag?.name);
      formik.setFieldValue("id", tag?._id);
      setHighlightForm(true);
    }
  };

  const handleDelete = async (tag) => {
    if (canDelete) {
      try {
        toast.dismiss();
        const res = await dispatch(deleteTag(tag?._id));
        if (res?.data?.code === 200) {
          toast.success("Tag deleted successfully");
        }
        if (canRead) {
          fetchAllTags(search);
        }
      } catch (error) {
        console.log("Error", error);
        toast.error("Failed to delete the name.");
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

  return (
    <>
      <Pageheader
        mainheading="Tag"
        parentfolder="Course"
        activepage="Tag"
      />
    <Row className="mt-5 row-sm">
      <Col md={12} lg={12} xl={12}>
        <Card className="custom-card transcation-crypto">
          <Card.Header className="border-bottom-0">
            {/* <div>
              <div className="card-title">
                {highlightForm ? "Update Tag" : "Add Tag"}
              </div>
            </div> */}
          </Card.Header>
          <Card.Body>
            {(canCreate || (canUpdate && formik.values.id)) && (
              <>
                <Form onSubmit={formik.handleSubmit} className="mb-4">
                  <div className="d-flex flex-wrap align-items-end gap-3">
                    <div className="filter-item">
                      <Form.Label>Tag</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        className="custom-select-height"
                        placeholder="Enter tag"
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
                    <div className="pt-md-2 mt-2 mt-md-0">
                      <Button
                        variant="primary"
                        type="submit"
                        className="custom-select-height"
                        onClick={() => setHighlightForm(false)}
                      >
                        {formik.values.id ? "Update" : "Add"}
                      </Button>
                    </div>

                    <div className="flex-grow-1"></div>

                    <div className="d-flex align-items-end justify-content-end gap-2">
                      <div className="ms-auto">
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
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              </>
            )}
            <div className={highlightForm ? "update-warning mb-3" : ""}>
              {highlightForm ? "Update your information" : ""}
            </div>
            <div className="table-responsive">
              <Table className="text-nowrap border">
                <thead>
                  <tr>
                    <th scope="col" className="dynamic-width-data">
                      Tag
                    </th>
                    <th scope="col" className="dynamic-width-data">
                      Color
                    </th>
                    <th scope="col" className="dynamic-width-data">
                      Created
                    </th>
                    {(canDelete || canUpdate) && (
                      <th
                        scope="col"
                        className="dynamic-width-data sticky-col-right-last"
                      >
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {allTags?.length > 0 ? (
                    allTags?.map((tag, index) => (
                      <tr key={index} className="custom-table-row">
                        <td className="dynamic-width">
                          {tag?.name ? tag?.name : "-"}
                        </td>
                        <td>
                          <div
                            style={{
                              backgroundColor: tag?.color || "#000000",
                              borderRadius: "50%",
                              width: "25px",
                              height: "25px",
                              display: "inline-block",
                              border: "1px solid #ccc",
                            }}
                          ></div>
                        </td>
                        <td className="dynamic-width">
                          {new Date(tag.createdAt).toLocaleDateString()}
                        </td>
                        <td className="sticky-col-right-last dynamic-width">
                          <div className="d-flex">
                            {canUpdate && (
                              <span
                                className="icon-border edit-icon"
                                onClick={() => handleEdit(tag)}
                              >
                                <EditIcon />
                              </span>
                            )}
                            {canDelete && (
                              <span
                                className="icon-border delete-icon ms-2"
                                onClick={() => handleDelete(tag)}
                              >
                                <DeleteIcon />
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    </>
  );
};

export default Tag;
