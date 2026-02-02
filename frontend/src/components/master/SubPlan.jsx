import { useEffect, useState } from "react";
import { Button, Form, Row, Col, Card, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import DataTable from "../commonComponents/DataTable";
import usePermissions from "../commonComponents/usePermissions";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import Paginations from "../elements/Paginations";
import Select from "react-select";
import { AiOutlineClose } from "react-icons/ai";
import {
  createSubPlan,
  deleteSubPlan,
  getAllSubPlan,
  updateSubPlan,
} from "../../redux/actions/Master/SubPlan.action";
import { getAllMainPlan } from "../../redux/actions/Master/MainPlan.action";
import { countryDropdown } from "../../redux/actions/Master/Institute.action";

const SubPlan = () => {
  const dispatch = useDispatch();
  const [subPlans, setSubPlans] = useState([]);
  const [search, setSearch] = useState("");
  const [mainPlanFilter, setMainPlanFilter] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [mainPlans, setMainPlans] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Sub Plan");

  const fetchAllCountry = async () => {
    try {
      const res = await dispatch(countryDropdown());
      setCountryData(res?.data?.data);
    } catch (error) {
      toast.error("Error fetching in getAll country");
    }
  };

  const countryOptions = countryData?.map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));

  useEffect(() => {
    if (canRead) {
      fetchSubPlans(currentPage, itemsPerPage, search, mainPlanFilter);
      fetchMainPlans();
    }
    fetchAllCountry();
  }, [canRead, currentPage, itemsPerPage, search, mainPlanFilter, dispatch]);

  const fetchSubPlans = async (
    page = 1,
    limit = itemsPerPage,
    searchTerm = "",
    mainPlanId = ""
  ) => {
    try {
      const res = await dispatch(
        getAllSubPlan(page, limit, searchTerm, mainPlanId)
      );
      const responseData = res?.data?.data || {};
      setSubPlans(responseData?.data || []);
      setTotalRecords(responseData?.totalRecords || 0);
      setTotalPages(responseData?.totalPages || 0);
    } catch (error) {
      console.error("Error fetching sub plans:", error);
      setSubPlans([]);
      setTotalRecords(0);
      setTotalPages(0);
      toast.error("Failed to fetch sub plans.");
    }
  };

  const fetchMainPlans = async () => {
    try {
      const res = await dispatch(getAllMainPlan());
      setMainPlans(res?.data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching main plans:", error);
      setMainPlans([]);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      fetchSubPlans(1, newItemsPerPage, search, mainPlanFilter);
    }
  };

  const handleMainPlanFilterChange = (selectedOption) => {
    const mainPlanId = selectedOption?.value || "";
    setMainPlanFilter(mainPlanId);
    setCurrentPage(1);
    if (canRead) {
      fetchSubPlans(1, itemsPerPage, search, mainPlanId);
    }
  };

  const formik = useFormik({
    initialValues: {
      mainPlan: "",
      country: "",
      name: "",
      totalAmount: "",
      // maxDiscount: "",
      id: "",
    },
    validationSchema: Yup.object({
      mainPlan: Yup.string().required("Main Plan is required"),
      country: Yup.string().required("Country is required"),
      name: Yup.string().required("Sub Plan is required"),
      totalAmount: Yup.number()
        .required("Total Amount is required")
        .min(0, "Total Amount must be non-negative"),
      // maxDiscount: Yup.number(),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        toast.dismiss();

        const countryName =
          countryData?.find((c) => c.isoCode === values.country)?.name ||
          values.country;
        const payload = {
          ...values,
          country: countryName,
        };

        let res;
        if (values.id && canUpdate) {
          res = await dispatch(updateSubPlan(payload, values.id));
          if (res?.data?.code === 200) {
            toast.success("Sub Plan updated successfully");
          }
        } else if (!values.id && canCreate) {
          res = await dispatch(createSubPlan(payload));
          if (res?.data?.code === 201) {
            toast.success("Sub Plan added successfully");
          }
        } else {
          toast.error("You do not have permission to perform this action.");
          return;
        }
        resetForm();
        setShowModal(false);
        if (canRead) {
          setCurrentPage(1);
          fetchSubPlans(1, itemsPerPage, search, mainPlanFilter);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error(
          error?.response?.data?.message || "Failed to save Sub Plan."
        );
      }
    },
  });

  const handleEdit = (item) => {
    if (canUpdate) {
      formik.setValues({
        id: item._id,
        mainPlan: item.mainPlan._id,
        country: item.country,
        name: item.name,
        totalAmount: item.totalAmount,
        // maxDiscount: item.maxDiscount,
      });
      setShowModal(true);
    } else {
      toast.error("You do not have permission to edit.");
    }
  };

  const handleDelete = async (item) => {
    if (canDelete) {
      try {
        toast.dismiss();
        const res = await dispatch(deleteSubPlan(item._id));
        if (res?.data?.code === 200) {
          toast.success("Sub Plan deleted successfully");
          const updatedPage =
            subPlans.length === 1 && currentPage > 1
              ? currentPage - 1
              : currentPage;
          setCurrentPage(updatedPage);
          fetchSubPlans(updatedPage, itemsPerPage, search, mainPlanFilter);
        }
      } catch (error) {
        console.error("Error deleting sub plan:", error);
        toast.error("Failed to delete the sub plan.");
      }
    } else {
      toast.error("You do not have permission to delete.");
    }
  };

  const handleOpenModal = () => {
    if (canCreate) {
      formik.resetForm();
      setShowModal(true);
    } else {
      toast.error("You do not have permission to create.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    formik.resetForm();
  };

  const columns = [
    {
      label: "Main Plan",
      key: "mainPlan",
      render: (item) => (item?.mainPlan ? item?.mainPlan?.name : "-"),
    },
    { label: "Country", key: "country" },
    { label: "Sub Plan", key: "name" },
    { label: "Total Amount", key: "totalAmount" },
    // { label: "Max Discount", key: "maxDiscount" },
    {
      label: "CREATED BY",
      render: (item) => (item.createdByName ? item?.createdByName : "-"),
    },
    {
      label: "UPDATED BY",
      render: (item) => (item.updatedByName ? item?.updatedByName : "-"),
    },
  ];

  const selectedMainPlan = mainPlans.find(
  (p) => p._id === formik.values.mainPlan
);

const isCoachingPlan = selectedMainPlan?.name === "Coaching";


  return (
    <Row className="mt-5 row-sm">
      <Col md={12} lg={12} xl={12}>
        <Card className="custom-card transcation-crypto">
          <Card.Header className="border-bottom-0">
            <div className="card-title">
              {formik.values.id ? "Update Sub Plan" : "Add Sub Plan"}
            </div>
          </Card.Header>
          <Card.Body>
            <form onSubmit={formik.handleSubmit}>
              <Row className="mb-3">
                <Col md={4} className="d-flex align-items-end gap-2">
                  {canCreate && (
                    <Button
                      variant="primary"
                      className="custom-select-height"
                      onClick={handleOpenModal}
                    >
                      {formik.values.id ? "Update Sub Plan" : "Add Sub Plan"}
                    </Button>
                  )}
                  <Select
                    options={[
                      { value: "", label: "All Main Plans" },
                      ...mainPlans.map((p) => ({
                        value: p._id,
                        label: p.name,
                      })),
                    ]}
                    value={
                      mainPlanFilter
                        ? {
                            value: mainPlanFilter,
                            label:
                              mainPlans.find((p) => p._id === mainPlanFilter)
                                ?.name || "All Main Plans",
                          }
                        : { value: "", label: "All Main Plans" }
                    }
                    onChange={handleMainPlanFilterChange}
                    placeholder="Select Main Plan"
                    classNamePrefix="custom-select"
                    isSearchable
                    noOptionsMessage={() => "No main plans available"}
                  />
                </Col>
                <Col className="d-flex align-items-end justify-content-end gap-2">
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
                        id="typehead1"
                        placeholder="Search here..."
                        autoComplete="off"
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          setCurrentPage(1);
                        }}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <ItemsPerPageSelect
                    itemsPerPage={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                  />
                  <div className="custom-select-height total-records px-3 mt-2 mt-md-0 d-flex align-items-center h-6">
                    <span
                      className="dark_theme"
                      style={{ color: "#000000", minWidth: "90px" }}
                    >
                      Total Records: <strong>{totalRecords}</strong>
                    </span>
                  </div>
                </Col>
              </Row>
            </form>

            <Modal
              show={showModal}
              onHide={handleCloseModal}
              size="lg"
              centered
            >
              <Modal.Header className="form-main-heading">
                <Modal.Title>
                  {formik.values.id ? "Update Sub Plan" : "Add Sub Plan"}
                </Modal.Title>
                <AiOutlineClose
                  size={20}
                  style={{ cursor: "pointer", color: "white" }}
                  onClick={handleCloseModal}
                />
              </Modal.Header>
              <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
                {(canCreate || (canUpdate && formik.values.id)) && (
                  <Form onSubmit={formik.handleSubmit}>
                    <Row className="mb-3 mt-0">
                      <Col md={6} className="mb-3">
                        <Form.Label className="fw-semibold">
                          Main Plan
                        </Form.Label>
                        <Select
                          name="mainPlan"
                          classNamePrefix="custom-select"
                          value={
                            formik.values.mainPlan
                              ? {
                                  value: formik.values.mainPlan,
                                  label:
                                    mainPlans?.find(
                                      (p) => p._id === formik.values.mainPlan
                                    )?.name || formik.values.mainPlan,
                                }
                              : null
                          }
                          onChange={(option) =>
                            formik.setFieldValue(
                              "mainPlan",
                              option?.value || ""
                            )
                          }
                          options={mainPlans?.map((p) => ({
                            value: p._id,
                            label: p.name,
                          }))}
                          placeholder="Select Main Plan"
                          isClearable
                          isSearchable
                          noOptionsMessage={() => "No main plans available"}
                        />
                        {formik.touched.mainPlan && formik.errors.mainPlan && (
                          <div className="text-danger">
                            {formik.errors.mainPlan}
                          </div>
                        )}
                      </Col>
                      {!isCoachingPlan && (
                      <Col md={6} className="mb-3">
                        <Form.Label>Country</Form.Label>
                        <Select
                          name="country"
                          classNamePrefix="custom-select"
                          value={
                            formik.values.country
                              ? {
                                  value: formik.values.country,
                                  label:
                                    countryData?.find(
                                      (c) => c.isoCode === formik.values.country
                                    )?.name || formik.values.country,
                                }
                              : null
                          }
                          onChange={(option) => {
                            formik.setFieldValue(
                              "country",
                              option?.value || ""
                            );
                          }}
                          options={countryOptions}
                          placeholder="Select Country"
                          isClearable
                          styles={{
                            control: (base) => ({
                              ...base,
                              fontSize: "13px",
                              minHeight: "38px",
                            }),
                          }}
                        />
                      </Col>)}
                      <Col md={6} className="mb-3">
                        <Form.Label className="fw-semibold">
                          Sub Plan
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          className="custom-select-height"
                          placeholder="Enter Sub Plan"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.name && formik.errors.name && (
                          <div className="text-danger">
                            {formik.errors.name}
                          </div>
                        )}
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label className="fw-semibold">
                          Total Amount
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="totalAmount"
                          className="custom-select-height"
                          placeholder="Enter Total Amount"
                          value={formik.values.totalAmount}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.totalAmount &&
                          formik.errors.totalAmount && (
                            <div className="text-danger">
                              {formik.errors.totalAmount}
                            </div>
                          )}
                      </Col>
                      {/* <Col md={6} className="mb-3">
                        <Form.Label className="fw-semibold">
                          Max Discount
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="maxDiscount"
                          className="custom-select-height"
                          placeholder="Enter Max Discount"
                          value={formik.values.maxDiscount}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.maxDiscount &&
                          formik.errors.maxDiscount && (
                            <div className="text-danger">
                              {formik.errors.maxDiscount}
                            </div>
                          )}
                      </Col> */}
                    </Row>
                    <div className="text-end">
                      <Button
                        variant="primary"
                        className="custom-select-height"
                        type="submit"
                        disabled={formik.values.id ? !canUpdate : !canCreate}
                      >
                        {formik.values.id ? "Update" : "Add"}
                      </Button>
                    </div>
                  </Form>
                )}
              </Modal.Body>
            </Modal>

            {isLoading ? (
              <div className="d-flex justify-content-center my-4">
                <div
                  className="spinner-border text-primary"
                  role="status"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <DataTable
                  columns={columns}
                  data={subPlans}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  canEdit={canUpdate}
                  canDelete={canDelete}
                  canRead={canRead}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />

                {totalPages > 1 && subPlans.length > 0 && (
                  <Paginations
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SubPlan;
