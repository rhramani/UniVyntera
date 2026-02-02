import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import DataTable from "../commonComponents/DataTable";
import { MdCalendarToday } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  deleteVisitorApplication,
  updateVisitorApplication,
} from "../../redux/actions/Visitor/VisitorApplication.action";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LoadMoreButton from "../commonComponents/LoadMoreButton";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { BASEURL } from "../../baseUrl";

const CategoryDetails = ({
  formData,
  edit,
  setEdit,
  countries,
  setFormData,
  setIsLoading,
  isLoading,
  fetchOneVisitorDetails,
}) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [
    showVisitorProcessRenewalDateCalendar,
    setShowVisitorProcessRenewalDateCalendar,
  ] = useState({});
  const [
    showVisitorProcessRefusalDateCalendar,
    setShowVisitorProcessRefusalDateCalendar,
  ] = useState({});
  const visitorProcessRenewalDateInputRef = useRef(null);
  const visitorProcessRenewalDateCalendarRef = useRef(null);
  const visitorProcessRefusalDateInputRef = useRef(null);
  const visitorProcessRefusalDateCalendarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        Object.values(showVisitorProcessRenewalDateCalendar).some(Boolean) &&
        visitorProcessRenewalDateCalendarRef.current &&
        !visitorProcessRenewalDateCalendarRef.current.contains(event.target) &&
        visitorProcessRenewalDateInputRef.current &&
        !visitorProcessRenewalDateInputRef.current.contains(event.target)
      ) {
        setShowVisitorProcessRenewalDateCalendar({});
      }
      if (
        Object.values(showVisitorProcessRefusalDateCalendar).some(Boolean) &&
        visitorProcessRefusalDateCalendarRef.current &&
        !visitorProcessRefusalDateCalendarRef.current.contains(event.target) &&
        visitorProcessRefusalDateInputRef.current &&
        !visitorProcessRefusalDateInputRef.current.contains(event.target)
      ) {
        setShowVisitorProcessRefusalDateCalendar({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    showVisitorProcessRenewalDateCalendar,
    showVisitorProcessRefusalDateCalendar,
  ]);

  const categoryValidationSchema = Yup.object({
    categoryDetails: Yup.object({
      type: Yup.string().required("Category type is required"),
      entries: Yup.array()
        .of(
          Yup.object({
            country: Yup.string().required("Country is required"),
            date: Yup.date().required("Date is required"),
            document: Yup.mixed().required("Document is required"),
            remarks: Yup.string().nullable(),
          })
        )
        .when(["visitorApplication", "type"], {
          is: (visitorApplication, type) =>
            visitorApplication && (type === "Renewal" || type === "Refusal"),
          then: () => Yup.array().min(1, "At least one detail is required"),
          otherwise: () => Yup.array().nullable(),
        }),
    }),
  });

  const toISODate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDate = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      return new Date(`${year}-${month}-${day}`);
    }
    if (dateStr.includes("-")) {
      return new Date(dateStr);
    }
    return null;
  };

  const addVisitorEntry = () => {
    categoryFormik.setFieldValue("categoryDetails.entries", [
      ...categoryFormik.values.categoryDetails.entries,
      { country: "", date: "", document: "", remarks: "" },
    ]);
  };

  const removeVisitorEntry = (index) => {
    const newEntries = [...categoryFormik.values.categoryDetails.entries];
    newEntries.splice(index, 1);
    categoryFormik.setFieldValue("categoryDetails.entries", newEntries);
  };

  const visitorProcessOptions = [
    { value: "Fresh", label: "Fresh" },
    { value: "Renewal", label: "Renewal" },
    { value: "Refusal", label: "Refusal" },
  ];

  const categoryDetailsColumns = [
    { label: "Category", render: (item) => item?.type || "-" },
    { label: "Country", render: (item) => item?.country || "-" },
    {
      label: "Renewal/Refusal Date",
      render: (item) => formatDate(parseDate(item?.date)) || "-",
    },
    { label: "Remarks", render: (item) => item?.remarks || "-" },
    {
      label: "Renewal/Refusal Document",
      render: (item) =>
        item?.document ? (
          <button
            className="btn btn-sm btn-primary fw-normal d-flex align-items-center justify-content-center rounded-4"
            style={{
              cursor: "pointer",
              height: "32px",
              color: "#6259CA",
              width: "70px",
              fontSize: "14px",
            }}
            onClick={() =>
              window.open(`${BASEURL}${item.document}`, "_blank", "noopener,noreferrer")
            }
          >
            <VisibilityIcon className="me-1" style={{ fontSize: "16px" }} />
            View
          </button>
        ) : (
          "-"
        ),
    },
    { label: "Created by", render: (item) => item?.createdByName || "-" },
    { label: "Updated by", render: (item) => item?.updatedByName || "-" },
  ];

  const categoryFormik = useFormik({
    initialValues: {
      categoryDetails: {
        type: "",
        entries: [{ country: "", date: "", document: "", remarks: "" }],
      },
    },
    validationSchema: categoryValidationSchema,
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values) => {
      const { type, entries } = values.categoryDetails;
      setIsLoading(true);

      try {
        toast.dismiss();

        if (edit.categoryDetails) {
          const updatedIndex = edit.categoryDetailsIndex;
          const categoryId = formData.categoryDetails[updatedIndex]?._id;

          if (!categoryId) {
            toast.error("Invalid category ID");
            setIsLoading(false);
            return;
          }

          const categoryUpdatePayload = {
            categoryId,
            categoryUpdate: {
              type,
              ...(type !== "Fresh" && {
                country: entries[0].country || "",
                date: entries[0].date
                  ? toISODate(parseDate(entries[0].date))
                  : "",
                remarks: entries[0].remarks || "",
              }),
            },
          };

          const detailsRes = await dispatch(
            updateVisitorApplication(categoryUpdatePayload, id)
          );

          if (detailsRes?.status === 200) {
            toast.success("Category details updated successfully");

            setFormData((prev) => ({
              ...prev,
              categoryDetails: prev.categoryDetails.map((item, index) =>
                index === updatedIndex
                  ? { ...item, ...categoryUpdatePayload.categoryUpdate }
                  : item
              ),
            }));

            if (entries[0].document && entries[0].document instanceof File) {
              const documentPayload = new FormData();
              documentPayload.append("categoryId", categoryId);
              documentPayload.append("categoryDoc", entries[0].document);

              const documentRes = await dispatch(
                updateVisitorApplication(documentPayload, id)
              );

              if (documentRes?.status === 200) {
                toast.success("Document uploaded successfully");
                setFormData((prev) => ({
                  ...prev,
                  categoryDetails: prev.categoryDetails.map((item, index) =>
                    index === updatedIndex
                      ? { ...item, document: documentRes.data.documentUrl }
                      : item
                  ),
                }));
              } else {
                toast.error(
                  documentRes?.data?.message || "Error uploading document"
                );
              }
            }

            fetchOneVisitorDetails();
          } else {
            toast.error(
              detailsRes?.data?.message || "Error updating category details"
            );
          }
        } else {
          const payload = new FormData();
          const keyPrefix = "categoryDetails";

          if (type === "Fresh") {
            payload.append(`${keyPrefix}[0][type]`, "Fresh");
          } else {
            entries.forEach((entry, index) => {
              payload.append(`${keyPrefix}[${index}][type]`, type);
              payload.append(
                `${keyPrefix}[${index}][country]`,
                entry.country || ""
              );
              payload.append(
                `${keyPrefix}[${index}][date]`,
                entry.date ? toISODate(parseDate(entry.date)) : ""
              );
              payload.append(
                `${keyPrefix}[${index}][remarks]`,
                entry.remarks || ""
              );
              if (entry.document && entry.document instanceof File) {
                payload.append(`categoryDoc[${index}]`, entry.document);
              }
            });
          }

          const res = await dispatch(updateVisitorApplication(payload, id));
          if (res?.status === 200) {
            toast.success("Category added successfully");
            setFormData((prev) => ({
              ...prev,
              categoryDetails: [
                ...prev.categoryDetails,
                values.categoryDetails,
              ],
            }));
            fetchOneVisitorDetails();
          } else {
            toast.error(res?.data?.message || "Error adding category");
          }
        }

        setShowCategoryModal(false);
        categoryFormik.resetForm();
        setEdit((prev) => ({
          ...prev,
          categoryDetails: false,
          categoryDetailsIndex: 0,
        }));
      } catch (error) {
        console.error("Error in category operation:", error);
        toast.error(
          error?.response?.data?.message || "Error processing category"
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleDeleteCategoryDetails = async (indexToDelete) => {
    const categoryId = formData.categoryDetails[indexToDelete]?._id;

    if (!categoryId) {
      toast.error("Invalid category. Cannot delete.");
      return;
    }

    const payload = { categoryId };

    try {
      const res = await dispatch(deleteVisitorApplication(payload, id));
      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("Category deleted successfully");
        setFormData((prev) => ({
          ...prev,
          categoryDetails: prev.categoryDetails.filter(
            (_, i) => i !== indexToDelete
          ),
        }));
        fetchOneVisitorDetails();
      } else {
        toast.error(res?.data?.message || "Error deleting category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error?.response?.data?.message || "Error deleting category");
    }
  };

  return (
    <>
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
      <div className="my-5 p-4 bg-light rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Category</h5>
          <Button
            variant="primary"
            className="custom-select-height"
            onClick={() => {
              categoryFormik.resetForm();
              setEdit((prev) => ({
                ...prev,
                categoryDetails: false,
                categoryDetailsIndex: 0,
              }));
              setShowCategoryModal(true);
            }}
          >
            Add New
          </Button>
        </div>
        <Modal
          show={showCategoryModal}
          onHide={() => {
            setShowCategoryModal(false);
            categoryFormik.resetForm();
            setEdit((prev) => ({
              ...prev,
              categoryDetails: false,
              categoryDetailsIndex: 0,
            }));
          }}
          size="lg"
          centered
        >
          <Modal.Header className="form-main-heading">
            <Modal.Title>
              {edit.categoryDetails ? "Update Category" : "Add Category"}
            </Modal.Title>
            <AiOutlineClose
              size={20}
              style={{ cursor: "pointer", color: "white" }}
              onClick={() => {
                setShowCategoryModal(false);
                categoryFormik.resetForm();
                setEdit((prev) => ({
                  ...prev,
                  categoryDetails: false,
                  categoryDetailsIndex: 0,
                }));
              }}
            />
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={categoryFormik.handleSubmit}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Select
                    options={visitorProcessOptions}
                    onChange={(selectedOption) =>
                      categoryFormik.setFieldValue(
                        "categoryDetails.type",
                        selectedOption?.value || ""
                      )
                    }
                    value={visitorProcessOptions?.find(
                      (option) =>
                        option.value ===
                        categoryFormik.values?.categoryDetails?.type
                    )}
                    classNamePrefix="custom-select"
                    placeholder="Select Category"
                    isClearable
                    isSearchable
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "30px",
                        color: "black",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "black",
                        fontSize: "13px",
                      }),
                    }}
                  />
                  {categoryFormik.touched.categoryDetails?.type &&
                    categoryFormik.errors.categoryDetails?.type && (
                      <div className="text-danger">
                        {categoryFormik.errors.categoryDetails.type}
                      </div>
                    )}
                </Col>
                {(categoryFormik.values?.categoryDetails?.type === "Renewal" ||
                  categoryFormik.values?.categoryDetails?.type ===
                    "Refusal") && (
                  <>
                    <Col md={12} className="mb-3">
                      <Form.Label>
                        {categoryFormik.values.categoryDetails.type} Details
                      </Form.Label>

                      {categoryFormik.values.categoryDetails.entries.map(
                        (entry, index) => (
                          <Row key={index} className="mb-3 border py-2 rounded">
                            <Col md={6} className="mb-3">
                              <Form.Group>
                                <Form.Label>Country</Form.Label>
                                <Select
                                  options={countries?.map((c) => ({
                                    value: c.name,
                                    label: c.name,
                                  }))}
                                  value={
                                    entry.country
                                      ? {
                                          value: entry.country,
                                          label: entry.country,
                                        }
                                      : null
                                  }
                                  onChange={(option) =>
                                    categoryFormik.setFieldValue(
                                      `categoryDetails.entries[${index}].country`,
                                      option ? option.value : ""
                                    )
                                  }
                                  placeholder="Select Country"
                                  classNamePrefix="custom-select"
                                  isSearchable
                                />
                                {categoryFormik.touched.categoryDetails
                                  ?.entries?.[index]?.country &&
                                  categoryFormik.errors.categoryDetails
                                    ?.entries?.[index]?.country && (
                                    <div className="text-danger">
                                      {
                                        categoryFormik.errors.categoryDetails
                                          .entries[index].country
                                      }
                                    </div>
                                  )}
                              </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                              <Form.Label>
                                {categoryFormik.values.categoryDetails.type}{" "}
                                Date
                              </Form.Label>
                              <div style={{ position: "relative" }}>
                                <Form.Control
                                  type="text"
                                  placeholder="dd/mm/yyyy"
                                  className="custom-select-height"
                                  value={
                                    entry.date
                                      ? formatDate(parseDate(entry.date))
                                      : ""
                                  }
                                  readOnly
                                  onClick={() =>
                                    setShowVisitorProcessRenewalDateCalendar(
                                      (prev) => ({
                                        ...prev,
                                        [index]: !prev[index],
                                      })
                                    )
                                  }
                                  ref={visitorProcessRenewalDateInputRef}
                                  style={{ cursor: "pointer" }}
                                />
                                <MdCalendarToday
                                  style={{
                                    position: "absolute",
                                    right: 10,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#888",
                                    pointerEvents: "none",
                                  }}
                                  size={20}
                                />
                                {showVisitorProcessRenewalDateCalendar[
                                  index
                                ] && (
                                  <div
                                    ref={visitorProcessRenewalDateCalendarRef}
                                    style={{
                                      position: "absolute",
                                      top: "100%",
                                      left: "0",
                                      zIndex: 9999,
                                      background: "#fff",
                                      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                                      borderRadius: "8px",
                                      marginTop: "4px",
                                      width: 300,
                                      minWidth: 300,
                                      maxWidth: 300,
                                    }}
                                  >
                                    <Calendar
                                      className="form-control m-0 p-0 border-0"
                                      onChange={(selectedDate) => {
                                        categoryFormik.setFieldValue(
                                          `categoryDetails.entries[${index}].date`,
                                          toISODate(selectedDate)
                                        );
                                        setShowVisitorProcessRenewalDateCalendar(
                                          (prev) => ({
                                            ...prev,
                                            [index]: false,
                                          })
                                        );
                                      }}
                                      value={
                                        entry.date
                                          ? parseDate(entry.date)
                                          : new Date()
                                      }
                                      locale="en-GB"
                                    />
                                  </div>
                                )}
                              </div>
                              {categoryFormik.touched.categoryDetails
                                ?.entries?.[index]?.date &&
                                categoryFormik.errors.categoryDetails
                                  ?.entries?.[index]?.date && (
                                  <div className="text-danger">
                                    {
                                      categoryFormik.errors.categoryDetails
                                        .entries?.[index]?.date
                                    }
                                  </div>
                                )}
                            </Col>
                            <Col md={6} className="mb-3">
                              <Form.Label>
                                Upload{" "}
                                {categoryFormik.values?.categoryDetails.type}{" "}
                                Document
                              </Form.Label>
                              <Form.Control
                                type="file"
                                name="categoryDetails.document"
                                onChange={(event) =>
                                  categoryFormik.setFieldValue(
                                    `categoryDetails.entries[${index}].document`,
                                    event.currentTarget.files[0]
                                  )
                                }
                                onBlur={categoryFormik.handleBlur}
                                className="custom-select-height"
                              />
                              {categoryFormik.touched.categoryDetails
                                ?.entries?.[index]?.document &&
                                categoryFormik.errors.categoryDetails
                                  ?.entries?.[index]?.document && (
                                  <div className="text-danger">
                                    {
                                      categoryFormik.errors.categoryDetails
                                        .entries?.[index]?.document
                                    }
                                  </div>
                                )}
                            </Col>
                            <Col md={6} className="mb-3">
                              <Form.Group>
                                <Form.Label>Remarks</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  name={`categoryDetails.entries[${index}].remarks`}
                                  value={entry.remarks || ""}
                                  onChange={categoryFormik.handleChange}
                                  rows={1}
                                  className="custom-select-height"
                                />
                              </Form.Group>
                            </Col>
                            {categoryFormik.values.categoryDetails.entries
                              .length > 1 && (
                              <Col md={12} className="text-end">
                                <Button
                                  variant="link"
                                  className="p-0"
                                  onClick={() => removeVisitorEntry(index)}
                                >
                                  <i className="bi bi-trash text-danger"></i>
                                </Button>
                              </Col>
                            )}
                          </Row>
                        )
                      )}
                      {!edit.categoryDetails && (
                        <Row>
                          <Button
                            variant="link"
                            className="d-flex justify-content-end"
                            onClick={addVisitorEntry}
                          >
                            <i className="bi bi-plus-circle fs-4"></i>
                          </Button>
                        </Row>
                      )}
                    </Col>
                  </>
                )}
              </Row>
              <div className="text-end mt-3">
                <Button
                  variant="primary"
                  className="custom-select-height"
                  type="submit"
                >
                  {edit.categoryDetails ? "Update" : "Add"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
        <DataTable
          columns={categoryDetailsColumns}
          data={formData.categoryDetails || []}
          currentPage={1}
          totalPages={1}
          itemsPerPage={10}
          onEdit={(item) => {
            const values = {
              categoryDetails: {
                type: item.type || "",
                entries: item.entries?.length
                  ? item.entries.map((entry) => ({
                      country: entry.country || "",
                      date: entry.date || "",
                      document: entry.document || "",
                      remarks: entry.remarks || "",
                    }))
                  : [
                      {
                        country: item.country || "",
                        date: item.date || "",
                        document: item.document || "",
                        remarks: item.remarks || "",
                      },
                    ],
              },
            };
            categoryFormik.setValues(values);
            setEdit((prev) => ({
              ...prev,
              categoryDetails: true,
              categoryDetailsIndex: formData.categoryDetails.indexOf(item),
            }));
            setShowCategoryModal(true);
          }}
          onDelete={(item) => {
            const index = formData.categoryDetails.indexOf(item);
            handleDeleteCategoryDetails(index);
          }}
        />
      </div>
    </>
  );
};

export default CategoryDetails;
