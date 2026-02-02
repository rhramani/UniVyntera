import { useDispatch } from "react-redux";
import {
  bulkUploadCurrencyRate,
  createCurrencyRate,
  deleteCurrencyRate,
  getAllCurrencyRate,
  updateCurrencyRate,
} from "../../redux/actions/Master/CurrencyRate.action";
import usePermissions from "../commonComponents/usePermissions";
import { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import DataTable from "../commonComponents/DataTable";
import { countryDropdown } from "../../redux/actions/Master/Institute.action";
import Select from "react-select";
import { currencyCode } from "../../redux/actions/CourseFinder.action";
import { toast } from "react-toastify";

const CurrencyRate = () => {
  const dispatch = useDispatch();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currencyRate, setCurrencyRate] = useState([]);
  const [countries, setCountries] = useState([]);
  const [currencyCodeData, setCurrencyCodeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef();
  const { canCreate, canRead, canUpdate, canDelete, canUpload } =
    usePermissions("Currency Rate");

  const handleShowUploadModal = () => {
    setShowUploadModal(true);
    formik.resetForm();
    formik.setTouched({});
    formik.setErrors({});
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    formik.resetForm();
  };

  const handleBulkUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("excelFile", file);

      const res = await dispatch(bulkUploadCurrencyRate(formData));

      if (res.status === 200) {
        toast.success("Bulk upload successful");
        if (canRead) {
          fetchCurrencyRate(search);
        }
      }
    } catch (error) {
      toast.error(error?.message || "Bulk upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const res = await dispatch(countryDropdown());
      setCountries(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching countries:", error);
      setCountries([]);
    }
  };

  const fetchAllCurrencyCode = async () => {
    const response = await dispatch(currencyCode());
    const responseData = response?.data?.data;
    setCurrencyCodeData(responseData || []);
  };

  useEffect(() => {
    if (canRead) {
      fetchCurrencyRate(search);
    }
    fetchCountries();
    fetchAllCurrencyCode();
  }, [search]);

  const fetchCurrencyRate = async (search) => {
    try {
      const res = await dispatch(getAllCurrencyRate(search));
      if (res?.status === 200) {
        setCurrencyRate(res?.data?.message || []);
      }
    } catch (error) {
      console.error("Error fetching student statuses:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      country: "",
      currencyName: "",
      currencyCode: "",
      INRvalue: "",
    },
    validationSchema: Yup.object({
      country: Yup.string().required("Country is required"),
      currencyName: Yup.string().required("currency Name is required"),
      currencyCode: Yup.string().required("Currency Code is required"),
      INRvalue: Yup.string().required("INR Value is required"),
    }),
    validateOnBlur: true,
    validateOnChange: true,
    validateOnMount: false,
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          country: values.country,
          currencyName: values.currencyName,
          currencyCode: values.currencyCode,
          INRvalue: values.INRvalue,
        };

        if (values.id && canUpdate) {
          const res = await dispatch(updateCurrencyRate(payload, values.id));
          if (res?.status === 200) {
            toast.success("Currency Rate updated successfully");
          }
        } else if (canCreate) {
          const res = await dispatch(createCurrencyRate(payload));
          if (res?.status === 201) {
            toast.success("Currency Rate created successfully");
          }
        }

        handleCloseUploadModal();
        resetForm();
        if (canRead) {
          fetchCurrencyRate(search);
        }
      } catch (error) {
        console.error("Error in onSubmit:", error);
        toast.error(error?.response?.data?.message || "An error occurred");
      }
    },
  });

  const handleEdit = (item) => {
    if (canUpdate) {
      try {
        formik.setValues({
          country: item?.country || "",
          currencyName: item?.currencyName || "",
          currencyCode: item?.currencyCode || "",
          INRvalue: item?.INRvalue || "",
          id: item?._id,
        });
        formik.setTouched({});
        formik.setErrors({});
        setShowUploadModal(true);
      } catch (error) {
        console.error("Error in handleEdit:", error);
        toast.error("Failed to populate edit form");
      }
    }
  };

  const handleDelete = async (item) => {
    if (canDelete) {
      try {
        const res = await dispatch(deleteCurrencyRate(item._id));
        if (res?.status === 200) {
          toast.success("Currency Rate deleted successfully");
          if (canRead) {
            fetchCurrencyRate(search);
          }
        }
      } catch (error) {
        console.error("Error deleting student status:", error);
        toast.error(
          error?.response?.data?.message || "Failed to delete student status"
        );
      }
    }
  };

  const columns = [
    {
      label: "Country",
      key: "country",
    },
    {
      label: "Currency Name",
      key: "currencyName",
    },
    {
      label: "Currency Code",
      key: "currencyCode",
    },
    {
      label: "INR Value",
      key: "INRvalue",
    },
    {
      label: "Created By",
      key: "createdByName",
      render: (row) => row.createdByName || "-",
    },
    {
      label: "Updated By",
      key: "updatedByName",
      render: (row) => row.updatedByName || "-",
    },
  ];

  return (
    <Row className="mt-5 row-sm">
      <Col md={12} lg={12} xl={12}>
        <Card className="custom-card transcation-crypto">
          <Card.Header className="border-bottom-0">
            <div>
              <div className="card-title">Currency Rate</div>
            </div>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={formik.handleSubmit}>
              <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
                {canCreate && (
                  <>
                    <Button
                      variant="primary"
                      type="button"
                      className="custom-select-height"
                      onClick={handleShowUploadModal}
                    >
                      Add Currency Rate
                    </Button>
                    <div className="d-flex flex-wrap justify-content-end gap-2">
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
                      {canUpload && (
                        <>
                          <Button
                            variant="primary"
                            type="button"
                            className="custom-select-height"
                            onClick={handleBulkUploadClick}
                            disabled={isLoading}
                          >
                            <i className="fe fe-upload-cloud me-2 fs-14"></i>{" "}
                            {isLoading
                              ? "Uploading..."
                              : "Currency Bulk Upload"}
                          </Button>
                          <input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                          />
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </Form>

            <Modal show={showUploadModal} onHide={handleCloseUploadModal}>
              <Modal.Header className="form-main-heading">
                <Modal.Title>
                  {formik.values.id
                    ? "Update Currency Rate"
                    : "Add Currency Rate"}
                </Modal.Title>
                <AiOutlineClose
                  size={20}
                  style={{ cursor: "pointer", color: "white" }}
                  onClick={handleCloseUploadModal}
                />
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group controlId="status" className="mb-3">
                    <Form.Label>Country</Form.Label>
                    <Select
                      name="country"
                      className="custom-select-height"
                      classNamePrefix="select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: " 30px",
                          color: "black",
                          minHeight: "38px",
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: "black",
                          fontSize: "13px",
                        }),
                      }}
                      value={
                        formik.values.country
                          ? {
                              value: formik.values.country,
                              label: formik.values.country,
                            }
                          : null
                      }
                      onChange={(option) => {
                        formik.setFieldValue(
                          "country",
                          option ? option.value : ""
                        );
                        formik.setFieldError("country", "");
                      }}
                      onBlur={() => formik.setFieldTouched("country", true)}
                      options={countries?.map((c) => ({
                        value: c.name,
                        label: c.name,
                      }))}
                      placeholder="Select Country"
                      isClearable
                    />
                    {formik.touched.country && formik.errors.country && (
                      <div className="text-danger">{formik.errors.country}</div>
                    )}
                  </Form.Group>
                  <Form.Group controlId="status" className="mb-3">
                    <Form.Label>Currency Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Currency Name"
                      className="custom-select-height"
                      name="currencyName"
                      value={formik.values.currencyName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.currencyName &&
                      formik.errors.currencyName && (
                        <div className="text-danger">
                          {formik.errors.currencyName}
                        </div>
                      )}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Currency Code</Form.Label>
                    <Select
                      className="custom-select-height"
                      name="currencyCode"
                      options={currencyCodeData?.map((code) => ({
                        value: code.code,
                        label: code.code,
                      }))}
                      value={currencyCodeData
                        ?.map((code) => ({
                          value: code.code,
                          label: code.code,
                        }))
                        .find(
                          (option) =>
                            option.value === formik.values.currencyCode
                        )}
                      onChange={(option) => {
                        formik.setFieldValue(
                          "currencyCode",
                          option ? option.value : ""
                        );
                        formik.setFieldError("currencyCode", "");
                      }}
                      onBlur={() =>
                        formik.setFieldTouched("currencyCode", true)
                      }
                      placeholder="Select Currency"
                      isClearable
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderRadius: "30px",
                          color: "black",
                          minWidth: "160px",
                          border: state.isFocused ? "1px" : base.border,
                          borderColor: state.isFocused
                            ? "#3B3665"
                            : base.borderColor,
                          boxShadow: state.isFocused
                            ? "0 0 0 1px #6C63FF"
                            : base.boxShadow,
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: "black",
                          fontSize: "13px",
                        }),
                      }}
                    />

                    {formik?.touched?.currencyCode &&
                      formik.errors.currencyCode && (
                        <div className="text-danger">
                          {formik.errors.currencyCode}
                        </div>
                      )}
                  </Form.Group>
                  <Form.Group controlId="status" className="mb-3">
                    <Form.Label>INR Value</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter INR Value"
                      className="custom-select-height"
                      name="INRvalue"
                      value={formik.values.INRvalue}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.INRvalue && formik.errors.INRvalue && (
                      <div className="text-danger">
                        {formik.errors.INRvalue}
                      </div>
                    )}
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="link"
                  className="custom-add-button btn border-primary text-primary text-decoration-none"
                  onClick={handleCloseUploadModal}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="button"
                  className="custom-add-button"
                  onClick={formik.handleSubmit}
                >
                  {formik.values.id ? "Update" : "Add"}
                </Button>
              </Modal.Footer>
            </Modal>

            <DataTable
              columns={columns}
              data={currencyRate}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default CurrencyRate;
