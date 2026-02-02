import { useEffect, useState } from "react";
import { Button, Form, Row, Col, Card, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Paginations from "../elements/Paginations";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import DataTable from "../commonComponents/DataTable";
import { AiOutlineClose } from "react-icons/ai";
import usePermissions from "../commonComponents/usePermissions";
import {
  createBankingDetails,
  deleteBankingDetails,
  getAllBankingDetails,
  updateBankingDetails,
} from "../../redux/actions/Master/Banking.action";

const BankingDetail = () => {
  const dispatch = useDispatch();
  const [bankingDetails, setBankingDetails] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [show, setShow] = useState(false);
  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Banking details");

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
  };

  // Fetch banking details
  useEffect(() => {
    if (canRead) {
      fetchBankingDetails(currentPage, itemsPerPage, search);
    }
  }, [currentPage, itemsPerPage, search]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      fetchBankingDetails(1, newItemsPerPage, search);
    }
  };

  const fetchBankingDetails = async (
    page = 1,
    limit = itemsPerPage,
    search = ""
  ) => {
    try {
      const res = await dispatch(getAllBankingDetails(page, limit, search));
      const responseData = res?.data?.data;
      setBankingDetails(responseData?.data || []);
      setTotalPages(responseData?.totalPages || 0);
      setTotalRecords(responseData?.totalRecords || 0);
    } catch (error) {
      console.error("Error fetching banking details:", error);
      setBankingDetails([]);
      setTotalPages(0);
      setTotalRecords(0);
      toast.error("Failed to fetch banking details.");
    }
  };

  const formik = useFormik({
    initialValues: {
      bankName: "",
      accountType: "",
      accountNumber: "",
      bankAddress: "",
      ifscCode: "",
      swiftCode: "",
    },
    validationSchema: Yup.object({
      bankName: Yup.string().required("Bank name is required."),
      accountType: Yup.string().required("Account type is required."),
      accountNumber: Yup.string().required("Account number is required."),
      bankAddress: Yup.string().required("Bank address is required."),
      ifscCode: Yup.string().required("IFSC code is required."),
      swiftCode: Yup.string(),
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        toast.dismiss();
        const payload = {
          bankName: values.bankName,
          accountType: values.accountType,
          accountNumber: values.accountNumber,
          bankAddress: values.bankAddress,
          ifscCode: values.ifscCode,
          swiftCode: values.swiftCode,
        };

        if (values.id && canUpdate) {
          const res = await dispatch(updateBankingDetails(payload, values.id));
          if (res?.data?.code === 200) {
            toast.success("Banking details updated successfully");
            resetForm();
            handleClose();
            fetchBankingDetails(currentPage, itemsPerPage, search);
          }
        } else if (canCreate) {
          const res = await dispatch(createBankingDetails(payload));
          if (res?.data?.code === 201) {
            toast.success("Banking details added successfully");
            resetForm();
            handleClose();
            fetchBankingDetails(currentPage, itemsPerPage, search);
          }
        }
      } catch (error) {
        toast.dismiss();
        console.error("Error submitting form:", error);
        toast.error(
          error?.response?.data?.message || "Failed to save banking details."
        );
      }
    },
  });

  const handleEdit = (bankingDetail) => {
    if (canUpdate) {
      formik.setValues({
        bankName: bankingDetail.bankName || "",
        accountType: bankingDetail.accountType || "",
        accountNumber: bankingDetail.accountNumber || "",
        bankAddress: bankingDetail.bankAddress || "",
        ifscCode: bankingDetail.ifscCode || "",
        swiftCode: bankingDetail.swiftCode || "",
        id: bankingDetail._id || "",
      });
      setShow(true);
    }
  };

  const handleDelete = async (bankingDetail) => {
    if (canDelete) {
      try {
        toast.dismiss();
        const res = await dispatch(deleteBankingDetails(bankingDetail._id));
        if (res?.data?.code === 200) {
          toast.success("Banking details deleted successfully");
          const updatedPage =
            bankingDetails.length === 1 && currentPage > 1
              ? currentPage - 1
              : currentPage;
          setCurrentPage(updatedPage);
          fetchBankingDetails(updatedPage, itemsPerPage, search);
        }
      } catch (error) {
        console.error("Error deleting banking details:", error);
        toast.error("Failed to delete banking details.");
      }
    }
  };

  // Define DataTable columns for banking details
  const columns = [
    {
      label: "Bank Name",
      key: "bankName",
    },
    {
      label: "Account Type",
      key: "accountType",
    },
    {
      label: "Account Number",
      key: "accountNumber",
    },
    {
      label: "Bank Address",
      key: "bankAddress",
    },
    {
      label: "IFSC Code",
      key: "ifscCode",
    },
    {
      label: "SWIFT Code",
      key: "swiftCode",
    },
    {
      label: "Created By",
      render: (item) => (item.createdByName ? item.createdByName : "-"),
    },
    {
      label: "Updated By",
      render: (item) => (item.updatedByName ? item.updatedByName : "-"),
    },
  ];

  return (
    <Row className="mt-5 row-sm">
      <Col md={12} lg={12} xl={12}>
        <Card className="custom-card transcation-crypto">
          <Card.Header className="border-bottom-0">
            <div>
              <div className="card-title">
                {formik.values.id
                  ? "Update Banking Details"
                  : "Add Banking Details"}
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <form onSubmit={formik.handleSubmit}>
              <Row className="mb-3">
                <Col md={4} className="d-flex align-items-end">
                  {canCreate && (
                    <Button
                      variant="primary"
                      className="custom-select-height"
                      onClick={handleShow}
                    >
                      {formik.values.id
                        ? "Update Banking Details"
                        : "Add Banking Details"}
                    </Button>
                  )}
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
                      />
                    </div>
                  </div>
                  <ItemsPerPageSelect
                    itemsPerPage={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                  />
                  <div className="custom-select-height border px-3 mt-2 mt-md-0 d-flex align-items-center h-6">
                    <span>
                      Total Records: <strong>{totalRecords}</strong>
                    </span>
                  </div>
                </Col>
              </Row>
            </form>

            <Modal show={show} onHide={handleClose} size="lg" centered>
              <Modal.Header className="form-main-heading">
                <Modal.Title>
                  {formik.values.id
                    ? "Update Banking Details"
                    : "Add Banking Details"}
                </Modal.Title>
                <AiOutlineClose
                  size={20}
                  style={{ cursor: "pointer", color: "white" }}
                  onClick={handleClose}
                />
              </Modal.Header>
              <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <Form onSubmit={formik.handleSubmit}>
                  <Row className="mb-3 mt-0">
                    <Col md={6} className="mb-3">
                      <Form.Label className="fw-semibold">Bank Name</Form.Label>
                      <Form.Control
                        type="text"
                        className="custom-select-height"
                        placeholder="Enter Bank Name"
                        name="bankName"
                        value={formik.values.bankName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.touched.bankName && !!formik.errors.bankName
                        }
                      />
                      {formik.touched.bankName && formik.errors.bankName && (
                        <div className="text-danger">
                          {formik.errors.bankName}
                        </div>
                      )}
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label className="fw-semibold">
                        Account Type
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="custom-select-height"
                        placeholder="Enter Account Type"
                        name="accountType"
                        value={formik.values.accountType}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.touched.accountType &&
                          !!formik.errors.accountType
                        }
                      />
                      {formik.touched.accountType &&
                        formik.errors.accountType && (
                          <div className="text-danger">
                            {formik.errors.accountType}
                          </div>
                        )}
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label className="fw-semibold">
                        Account Number
                      </Form.Label>
                      <Form.Control
                        type="number"
                        className="custom-select-height"
                        placeholder="Enter Account Number"
                        name="accountNumber"
                        value={formik.values.accountNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.touched.accountNumber &&
                          !!formik.errors.accountNumber
                        }
                      />
                      {formik.touched.accountNumber &&
                        formik.errors.accountNumber && (
                          <div className="text-danger">
                            {formik.errors.accountNumber}
                          </div>
                        )}
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label className="fw-semibold">
                        Bank Address
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="custom-select-height"
                        placeholder="Enter Bank Address"
                        name="bankAddress"
                        value={formik.values.bankAddress}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.touched.bankAddress &&
                          !!formik.errors.bankAddress
                        }
                      />
                      {formik.touched.bankAddress &&
                        formik.errors.bankAddress && (
                          <div className="text-danger">
                            {formik.errors.bankAddress}
                          </div>
                        )}
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label className="fw-semibold">IFSC Code</Form.Label>
                      <Form.Control
                        type="text"
                        className="custom-select-height"
                        placeholder="Enter IFSC Code"
                        name="ifscCode"
                        value={formik.values.ifscCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.touched.ifscCode && !!formik.errors.ifscCode
                        }
                      />
                      {formik.touched.ifscCode && formik.errors.ifscCode && (
                        <div className="text-danger">
                          {formik.errors.ifscCode}
                        </div>
                      )}
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label className="fw-semibold">
                        SWIFT Code
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="custom-select-height"
                        placeholder="Enter SWIFT Code"
                        name="swiftCode"
                        value={formik.values.swiftCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.touched.swiftCode && !!formik.errors.swiftCode
                        }
                      />
                      {formik.touched.swiftCode && formik.errors.swiftCode && (
                        <div className="text-danger">
                          {formik.errors.swiftCode}
                        </div>
                      )}
                    </Col>
                  </Row>
                  <div className="text-end">
                    <Button
                      variant="primary"
                      className="custom-select-height"
                      type="submit"
                    >
                      {formik.values.id ? "Update" : "Add"}
                    </Button>
                  </div>
                </Form>
              </Modal.Body>
            </Modal>

            <DataTable
              columns={columns}
              data={bankingDetails}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canEdit={canUpdate}
              canDelete={canDelete}
              canRead={canRead}
            />

            {totalPages > 1 && bankingDetails.length > 0 && (
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

export default BankingDetail;
