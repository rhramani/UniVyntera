import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import Pageheader from "../../layouts/Pageheader";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import Paginations from "../elements/Paginations";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import usePermissions from "../commonComponents/usePermissions";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createLoanProvider,
  deleteLoanProvider,
  getAllLoanProvider,
  updateLoanProvider,
} from "../../redux/actions/LoanProvider.action";
import { toast } from "react-toastify";
import "react-phone-input-2/lib/bootstrap.css";
import PhoneInput from "react-phone-input-2";
import { countryCodeISO } from "../../utils/countryISOCode";
import DataTable from "../commonComponents/DataTable";
import { AiOutlineClose } from "react-icons/ai";
import LoadMoreButton from "../commonComponents/LoadMoreButton";

const LoanProvider = () => {
  const dispatch = useDispatch();
  const [loanProviders, setLoanProviders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Loan Provider");

  const handleShowModal = () => {
    setShowModal(true);
    formik.resetForm();
    formik.setTouched({});
    formik.setErrors({});
  };

  const handleCloseModal = () => {
    setShowModal(false);
    formik.resetForm();
  };
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const fetchLoanProviders = async (page = 1, limit = itemsPerPage, search) => {
    try {
      setIsLoading(true);
      const res = await dispatch(getAllLoanProvider(page, limit, search));
      console.log(res);
      if (res?.status === 200) {
        setLoanProviders(res?.data?.data?.data || []);
        setTotalPages(res?.data?.data?.totalPages || 0);
        setTotalRecords(res?.data?.data?.totalRecords || 0);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error?.response?.data?.message || error.message);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchLoanProviders(currentPage, itemsPerPage, search);
    }
  }, [canRead, currentPage, itemsPerPage, search]);

  const formik = useFormik({
    initialValues: {
      name: "",
      contact: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required"),
      contact: Yup.string().required("Contact is required"),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    validateOnMount: false,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (values.id && canUpdate) {
          const { id, ...payload } = values;
          const res = await dispatch(updateLoanProvider(payload, values.id));
          console.log("res", res);
          if (res?.status === 200) {
            toast.success("Loan Provider updated successfully");
          }
        } else if (canCreate) {
          const { id, ...payload } = values;
          const res = await dispatch(createLoanProvider(payload));
          if (res?.status === 200) {
            toast.success("Loan Provider created successfully");
          }
        }
        handleCloseModal();
        resetForm();
        if (canRead) {
          fetchLoanProviders(currentPage, itemsPerPage, search);
        }
      } catch (error) {
        console.error("Error in onSubmit:", error);
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    },
  });

  const handleEdit = (item) => {
    if (canUpdate) {
      formik.setValues({
        name: item?.name || "",
        contact: item?.contact || "",
        id: item?._id || "",
      });
      formik.setTouched({});
      formik.setErrors({});
      setShowModal(true);
    }
  };

  const handleDelete = async (item) => {
    try {
      toast.dismiss();
      const res = await dispatch(deleteLoanProvider(item._id));
      if (res?.status === 200) {
        toast.success("Loan Provider deleted successfully");
      }
      if (canRead) {
        fetchLoanProviders(currentPage, itemsPerPage, search);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const columns = [
    {
      label: "Name",
      key: "name",
    },
    {
      label: "Contact",
      key: "contact",
    },
  ];

  return (
    <>
      <Pageheader mainheading="Loan Provider" parentfolder="Master" activepage="Loan Provider" />
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
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0 d-flex justify-content-between">
              {/* <div className="card-title mb-0">Loan Provider</div> */}
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
                {canCreate && (
                  <Button
                    variant="primary"
                    className="custom-select-height"
                    onClick={handleShowModal}
                  >
                    {formik.values.id
                      ? "Update Loan Provider"
                      : "Add Loan Provider"}
                  </Button>
                )}
                <div className="flex-grow-1"></div>

                <div className="filter-item">
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
                </div>

                <div className="filter-item-rows">
                  <ItemsPerPageSelect
                    itemsPerPage={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                  />
                </div>

                <div className="d-flex align-items-center">
                  <div className="filter-item filter-height total-records px-3 d-flex align-items-center">
                    <span>
                      Total Records :<strong>&nbsp;{totalRecords}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header className="form-main-heading">
                  <Modal.Title>
                    {formik.values.id
                      ? "Update Loan Provider"
                      : "Add Loan Provider"}
                  </Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={handleCloseModal}
                  />
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formName" className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        className="custom-select-height"
                        placeholder="Enter name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <div className="text-danger">{formik.errors.name}</div>
                      )}
                    </Form.Group>
                    <Form.Group controlId="formContact" className="mb-3">
                      <Form.Label>Contact</Form.Label>
                      <PhoneInput
                        country={countryCodeISO()}
                        value={formik.values.contact}
                        onChange={(contact, data) => {
                          const dialCode = data.dialCode
                            ? `+${data.dialCode}`
                            : "";
                          const formattedPhone = `${dialCode} ${contact.replace(
                            data.dialCode,
                            ""
                          )}`.trim();

                          formik.setFieldValue("contact", formattedPhone);
                        }}
                        onBlur={formik.handleBlur}
                        inputProps={{
                          name: "contact",
                          required: true,
                          className: "form-control custom-select-height",
                        }}
                        inputStyle={{
                          width: "100%",
                          paddingLeft: "65px",
                          borderRadius: "4px",
                        }}
                        buttonStyle={{
                          marginRight: "10px",
                        }}
                      />
                      {formik.touched.contact && formik.errors.contact && (
                        <div className="text-danger">
                          {formik.errors.contact}
                        </div>
                      )}
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="link"
                    className="custom-add-button btn border-primary text-primary text-decoration-none"
                    onClick={handleCloseModal}
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
                data={loanProviders}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={canUpdate}
                canDelete={canDelete}
                canUpdate={canUpdate}
                canRead={canRead}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                showEditButton={canUpdate}
                showDeleteButton={canDelete}
                actionView={canUpdate || canDelete}
              />

              {totalPages > 1 && loanProviders?.length > 0 && (
                <div className="mt-4 d-flex justify-content-end align-items-end">
                  <Paginations
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default LoanProvider;
