import { useEffect, useState, useCallback, useRef } from "react";
import DataTable from "../commonComponents/DataTable";
import LoadMoreButton from "../commonComponents/LoadMoreButton";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import { getAllMainPlan } from "../../redux/actions/Master/MainPlan.action";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  getAllSubPlan,
  getOneSubPlan,
} from "../../redux/actions/Master/SubPlan.action";
import {
  createGenerateInvoice,
  updateGenerateInvoice,
  deleteGenerateInvoice,
} from "../../redux/actions/Accountant/GenerateInvoice.action";
import { getAllBankingDetails } from "../../redux/actions/Master/Banking.action";
import { MdCalendarToday } from "react-icons/md";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { decryptData } from "../../utils/encryptionUtils";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptIcon from "@mui/icons-material/Receipt";
import usePermissions from "../commonComponents/usePermissions";

const ApplicationAccountant = ({
  accountantData,
  fetchAccountant,
  oneStudentData,
  totalData,
  mainPlanKey,
}) => {
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions(
    "Student Applications",
    "Accountant"
  );
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [visitorSubPlans, setVisitorSubPlans] = useState([]);
  const [mainPlans, setMainPlans] = useState([]);
  const [visitorSubPlan, setVisitorSubPlan] = useState("");
  const [bankingDetails, setBankingDetails] = useState([]);
  const [showPaidDateCalendar, setShowPaidDateCalendar] = useState(false);
  const [paidDateValue, setPaidDateValue] = useState(null);
  const paidDateInputRef = useRef(null);
  const paidDateCalendarRef = useRef(null);
  const userRole = decryptData(localStorage.getItem("role"));
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  console.log("selectedItem", selectedItem)
  const [otherPaidSum, setOtherPaidSum] = useState(0);

  const [anchorEl, setAnchorEl] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        paidDateInputRef.current &&
        !paidDateInputRef.current.contains(event.target) &&
        paidDateCalendarRef.current &&
        !paidDateCalendarRef.current.contains(event.target)
      ) {
        setShowPaidDateCalendar(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [paidDateInputRef, paidDateCalendarRef]);
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

  const toISODate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleCloseModal = () => {
    setShowModal(false);
    formik.resetForm();
    setVisitorSubPlan("");
    setOtherPaidSum(0);
  };

  const handleCloseBillingModal = () => {
    setShowBillingModal(false);
    billingFormik.resetForm();
    setSelectedItem(null);
    setPaidDateValue(null);
    setShowPaidDateCalendar(false);
  };

  const visitorPlan = mainPlans.find(
    (plan) => plan.name.toLowerCase() === mainPlanKey
  );

  const formik = useFormik({
    initialValues: {
      name: oneStudentData?._id || "",
      contactNo: oneStudentData?.contact || "",
      mainPlan: visitorPlan?._id || null,
      subPlan: null,
      amount: "",
      discount: "",
      discountAmount: "",
      payableAmount: "",
      paymentType: "",
      paidAmount: { amount: "", bank: "", paymentMode: "", date: "", _id: "" },
      dueAmount: "",
      remarks: "",
      id: "",
    },
    validationSchema: Yup.object({
      subPlan: Yup.string().required("Sub Plan is required"),
      discount: Yup.string().matches(
        /^\d+(\.\d+)?%?$/,
        "Discount must be a valid number or percentage (e.g., 10 or 10%)"
      ),
      discountAmount: Yup.string(),
      paymentType: Yup.string(),
      paidAmount: Yup.object().shape({
        amount: Yup.string().required("Receive Amount is required"),
        paymentMode: Yup.string().required("Payment Mode is required"),
        date: Yup.string().required("Payment Date is required"),
        bank: Yup.string().when("paymentMode", {
          is: (paymentMode) => ["GPay", "Bank", "UPI"].includes(paymentMode),
          then: (schema) =>
            schema.required("Bank selection is required for this payment mode"),
          otherwise: (schema) => schema.optional(),
        }),
        _id: Yup.string(),
      }),
      amount: Yup.string(),
      payableAmount: Yup.string(),
      dueAmount: Yup.string(),
      id: Yup.string(),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        toast.dismiss();
        setIsLoading(true);

        if (values.id) {
          let firstCallPayload = {};
          if (values.paidAmount._id) {
            // Update existing paidAmount entry
            firstCallPayload = {
              paidAmountId: values.paidAmount._id,
              paidAmount: [
                {
                  amount: values.paidAmount.amount,
                  bank: values.paidAmount.bank || null, // Ensure bank is included
                  paymentMode: values.paidAmount.paymentMode,
                  date: values.paidAmount.date,
                },
              ],
            };
          } else {
            // Add new paidAmount entry
            firstCallPayload = {
              paidAmount: [
                {
                  amount: values.paidAmount.amount,
                  bank: values.paidAmount.bank || null, // Ensure bank is included
                  paymentMode: values.paidAmount.paymentMode,
                  date: values.paidAmount.date,
                },
              ],
            };
          }

          if (Object.keys(firstCallPayload).length > 0) {
            const res1 = await dispatch(
              updateGenerateInvoice(firstCallPayload, values.id)
            );
            if (res1?.data?.code !== 200) {
              throw new Error(res1?.data?.message || "First API call failed");
            }
          }

          const fullPayload = {
            name: oneStudentData?._id || "",
            contactNo: oneStudentData?.contact || "",
            mainPlan: visitorPlan?._id || null,
            subPlan: values.subPlan || "",
            amount: values.amount || "",
            discount: values.discount || "",
            discountAmount: values.discountAmount || "",
            payableAmount: values.payableAmount || "",
            paymentType: values.paymentType || "",
            dueAmount: values.dueAmount || "",
            remarks: values.remarks || "",
          };
          const res2 = await dispatch(
            updateGenerateInvoice(fullPayload, values.id)
          );
          if (res2?.data?.code === 200) {
            toast.success("Accountant updated successfully");
            handleCloseModal();
            fetchAccountant(visitorPlan?._id);
          }
        } else {
          const createPayload = {
            name: oneStudentData?._id || "",
            contactNo: oneStudentData?.contact || "",
            mainPlan: visitorPlan?._id || null,
            subPlan: values.subPlan || "",
            amount: values.amount || "",
            discount: values.discount || "",
            discountAmount: values.discountAmount || "",
            payableAmount: values.payableAmount || "",
            paymentType: values.paymentType || "",
            paidAmount: [
              {
                amount: values.paidAmount.amount,
                bank: values.paidAmount.bank || null,
                paymentMode: values.paidAmount.paymentMode || "",
                date: values.paidAmount.date,
              },
            ],
            dueAmount: values.dueAmount || "",
            remarks: values.remarks || "",
          };
          const res = await dispatch(createGenerateInvoice(createPayload));
          if (res?.data?.code === 201) {
            toast.success("Accountant added successfully");
            handleCloseModal();
            fetchAccountant(visitorPlan?._id);
          }
        }
        resetForm();
      } catch (error) {
        console.error(
          "Error submitting form:",
          error?.response?.data?.message || error.message
        );
        toast.error(error?.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    },
  });
  const billingFormik = useFormik({
    initialValues: {
      totalAmount: "",
      dueAmount: "",
      paidAmount: "",
      paymentMode: "",
      bank: "",
      date: "",
      id: "",
    },
    validationSchema: Yup.object({
      paidAmount: Yup.string().required("Receive Amount is required"),
      paymentMode: Yup.string().required("Payment Mode is required"),
      date: Yup.string().required("Payment Date is required"),
      bank: Yup.string().when("paymentMode", {
        is: (mode) => ["GPay", "Bank", "UPI"].includes(mode),
        then: (schema) => schema.required("Bank is required"),
      }),
    }),
    onSubmit: async (values) => {
      const newPaid = parseFloat(values.paidAmount) || 0;
      const currentDue = parseFloat(values.dueAmount) || 0;
      const newDue = Math.max(0, currentDue - newPaid);

      const payload = {
        dueAmount: newDue.toFixed(0),
        paidAmount: [
          {
            amount: values.paidAmount,
            paymentMode: values.paymentMode,
            date: values.date,
            bank: values.bank || null,
          },
        ],
      };

      const res = await dispatch(updateGenerateInvoice(payload, values.id));
      if (res?.data?.code === 200) {
        toast.success("Billing updated successfully");
        setShowBillingModal(false);
        fetchAccountant(visitorPlan?._id);
      }
    },
  });

  const handleEdit = (row) => {
    const paidAmount = row.paidAmount?.[0] || {};
    const otherSum =
      row.paidAmount
        ?.slice(1)
        .reduce((sum, entry) => sum + parseFloat(entry.amount || 0), 0) || 0;
    setOtherPaidSum(otherSum);
    formik.setValues({
      ...row,
      id: row._id,
      subPlan: row.subPlan?._id || null,
      paidAmount: {
        amount: paidAmount.amount || "",
        bank: paidAmount.bank?._id || "", // Ensure bank ID is set
        paymentMode: paidAmount.paymentMode || "",
        date: paidAmount.date,
        _id: paidAmount._id || "",
      },
    });
    setVisitorSubPlan(row.subPlan?._id || "");
    setShowModal(true);
  };

  const handleDelete = async (row) => {
    try {
      setIsLoading(true);
      const res = await dispatch(deleteGenerateInvoice(row._id));
      if (res?.data?.code === 200) {
        toast.success("Deleted successfully");
        fetchAccountant(visitorPlan?._id);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchBankingDetails = async () => {
      try {
        const res = await dispatch(getAllBankingDetails(1, 1000, ""));
        const responseData = res?.data?.data?.data || [];
        setBankingDetails(responseData);
      } catch (error) {
        console.error("Error fetching banking details:", error);
        setBankingDetails([]);
      }
    };

    fetchBankingDetails();
  }, [dispatch]);

  const bankOptions = bankingDetails.map((bank) => ({
    label: bank.bankName,
    value: bank._id,
  }));

  const fetchMainPlans = async () => {
    try {
      const res = await dispatch(getAllMainPlan());
      setMainPlans(res?.data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching main plans:", error);
      setMainPlans([]);
      toast.error("Failed to fetch main plans.");
    }
  };

  const fetchSubPlans = async () => {
    if (!mainPlanKey) return;
    const coachingPlan = mainPlans.find(
      (plan) => plan.name.toLowerCase() === "coaching"
    );
    const studentAdmissionPlan = mainPlans.find(
      (plan) => plan.name.toLowerCase() === "student admission"
    );
    const visitorPlan = mainPlans.find(
      (plan) => plan.name.toLowerCase() === "visitor"
    );

    try {
      if (mainPlanKey === "coaching" && coachingPlan?._id) {
        const res = await dispatch(
          getAllSubPlan(1, 10000, "", coachingPlan._id)
        );
        const responseData = res?.data?.data || {};
        setVisitorSubPlans(responseData?.data || []);
      } else if (
        mainPlanKey === "student admission" &&
        studentAdmissionPlan?._id
      ) {
        const res = await dispatch(
          getAllSubPlan(1, 10000, "", studentAdmissionPlan._id)
        );
        const responseData = res?.data?.data || {};
        setVisitorSubPlans(responseData?.data || []);
      } else if (mainPlanKey === "visitor" && visitorPlan?._id) {
        const res = await dispatch(
          getAllSubPlan(1, 10000, "", visitorPlan._id)
        );
        const responseData = res?.data?.data || {};
        setVisitorSubPlans(responseData?.data || []);
      }
    } catch (error) {
      console.error("Error fetching sub plans:", error);
      toast.error("Failed to fetch sub plans.");
    }
  };

  useEffect(() => {
    const setDetailsForSubPlan = async (subPlanId) => {
      if (!subPlanId) {
        formik.setFieldValue("amount", "");
        formik.setFieldValue("payableAmount", "");
        formik.setFieldValue("dueAmount", "");
        return;
      }
      try {
        const res = await dispatch(getOneSubPlan(subPlanId));
        const subPlan = res?.data?.data;

        if (subPlan) {
          const totalAmount = subPlan.totalAmount || 0;
          formik.setFieldValue("amount", totalAmount.toString());
        }
      } catch (error) {
        console.error("Error fetching sub-plan:", error);
        toast.error("Failed to fetch sub-plan details.");
      }
    };

    if (formik.values.subPlan && formik.values.subPlan !== visitorSubPlan) {
      setVisitorSubPlan(formik.values.subPlan);
      setDetailsForSubPlan(formik.values.subPlan);
    }
  }, [formik.values.subPlan, visitorSubPlan, dispatch]);

  const calculateAmounts = useCallback(() => {
    const amount = parseFloat(formik.values.amount) || 0;
    let payableAmount = amount;

    // -------- % Discount / Flat Discount from "discount" field ----------
    let discountFromDiscountField = 0;

    // if (formik.values.discount) {
    //   if (formik.values.discount.includes("%")) {
    //     const percent =
    //       parseFloat(formik.values.discount.replace("%", "").trim()) || 0;
    //     discountFromDiscountField = (amount * percent) / 100;
    //   } else {
    //     discountFromDiscountField = parseFloat(formik.values.discount) || 0;
    //   }
    // }
    if (formik.values.discount) {
      // Always treat entered value as a percentage, even if '%' is not included
      const percent = parseFloat(formik.values.discount) || 0;
      discountFromDiscountField = (amount * percent) / 100;
    }

    // -------- Flat Discount from "discountAmount" field ----------
    const discountFromDiscountAmount =
      parseFloat(formik.values.discountAmount) || 0;

    // -------- Total Discount (add both) ----------
    const totalDiscount =
      discountFromDiscountField + discountFromDiscountAmount;

    // -------- Payable Amount (Plan - totalDiscount) ----------
    payableAmount = amount - totalDiscount;

    // -------- Due Amount (Payable - Paid) ----------
    const totalPaid = parseFloat(formik.values.paidAmount.amount) || 0;
    const dueAmount = Math.max(0, payableAmount - totalPaid - otherPaidSum);

    // -------- Update Formik --------
    formik.setFieldValue(
      "payableAmount",
      Math.max(0, payableAmount).toFixed(0)
    );
    formik.setFieldValue("dueAmount", dueAmount.toFixed(0));
  }, [
    formik.values.amount,
    formik.values.discount,
    formik.values.discountAmount,
    formik.values.paidAmount.amount,
  ]);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      calculateAmounts();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [
    formik.values.amount,
    formik.values.discount,
    formik.values.discountAmount, // ✅ add this
    formik.values.paidAmount.amount,
    calculateAmounts,
  ]);

  useEffect(() => {
    if (visitorPlan?._id) {
      fetchSubPlans(1, 1000, "", visitorPlan._id);
    }
  }, [visitorPlan, dispatch]);

  const paymentTypeOptions = [
    { label: "Full", value: "Full" },
    { label: "Half", value: "Half" },
  ];

  const paymentModeOptions = [
    { label: "GPay", value: "GPay" },
    { label: "Bank", value: "Bank" },
    { label: "Cash", value: "Cash" },
    { label: "UPI", value: "UPI" },
  ];

  useEffect(() => {
    fetchMainPlans();
  }, [dispatch]);

  const handlePaidAmountChange = useCallback(
    (event) => {
      formik.setFieldValue("paidAmount.amount", event.target.value);
    },
    [formik]
  );

  const handlePaymentModeChange = useCallback(
    (option) => {
      const newPaymentMode = option ? option.value : "";
      formik.setFieldValue("paidAmount.paymentMode", newPaymentMode);
      if (!["GPay", "Bank", "UPI"].includes(newPaymentMode)) {
        formik.setFieldValue("paidAmount.bank", "");
      }
    },
    [formik]
  );

  const handleBankChange = useCallback(
    (option) => {
      const newBank = option ? option.value : "";
      formik.setFieldValue("paidAmount.bank", newBank);
    },
    [formik]
  );

  const AccountantColumns = [
    { label: "Name", key: "name" },
    { label: "Contact No", key: "contactNo" },
    {
      label: "Main Plan",
      key: "mainPlan",
      render: (item) => item.mainPlan?.name || "-",
    },
    {
      label: "Sub Plan",
      key: "subPlan",
      render: (item) => item.subPlan?.name || "-",
    },
    { label: "Amount", key: "amount" },
    { label: "Discount", key: "discount" },
    { label: "Discount Amount", key: "discountAmount" },
    { label: "Payable Amount", key: "payableAmount" },
    {
      label: "Paid Date",
      render: (item) =>
        formatDate(parseDate(item.paidAmount?.[0]?.date)) || "-",
    },

    {
      label: "Receive Amount",
      key: "paidAmount",
      render: (item) =>
        item.paidAmount?.length ? item.paidAmount[0].amount : "-",
    },
    { label: "Receivable Amount", key: "dueAmount" },
    // { label: "Payment Type", key: "paymentType" },
    {
      label: "Payment Mode",
      key: "paidAmount",
      render: (item) =>
        item.paidAmount?.length ? item.paidAmount[0].paymentMode : "-",
    },
    { label: "Created By", key: "createdByName" },
    {
      label: "Created Date",
      key: "createdAt",
      render: (item) => formatDate(parseDate(item.createdAt)) || "-",
    },
  ];
  const renderActions = (item, index) => (
    <div className="d-flex">
      <IconButton
        aria-label="more"
        onClick={(e) => {
          setOpenDropdown(openDropdown === index ? null : index);
          setAnchorEl(e.currentTarget);
        }}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={openDropdown === index}
        onClose={() => setOpenDropdown(null)}
        sx={{
          "& .MuiPaper-root": {
            minWidth: "160px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          },
        }}
      >
        {canUpdate && (
          <MenuItem
            onClick={() => {
              handleEdit(item);
              setOpenDropdown(null);
            }}
          >
            <EditIcon fontSize="small" sx={{ mr: 1 }} className="edit-icon" />
            <span className="edit-action-text">Edit</span>
          </MenuItem>
        )}
        {canUpdate && canCreate && (
          <MenuItem
            onClick={() => {
              setSelectedItem(item);
              billingFormik.setValues({
                totalAmount: item.payableAmount || "",
                dueAmount: item.dueAmount || "",
                paidAmount: "",
                paymentMode: "",
                bank: "",
                date: "",
                id: item._id,
              });
              setShowBillingModal(true);
              setOpenDropdown(null);
            }}
          >
            <ReceiptIcon
              fontSize="small"
              sx={{ mr: 1 }}
              className="billing-icon"
            />
            <span className="billing-action-text">Billing</span>
          </MenuItem>
        )}
        {canDelete && (
          <MenuItem
            onClick={() => {
              handleDelete(item);
              setOpenDropdown(null);
            }}
          >
            <DeleteIcon
              fontSize="small"
              sx={{ mr: 1 }}
              className="delete-icon"
            />
            <span className="delete-action-text">Delete</span>
          </MenuItem>
        )}
      </Menu>
    </div>
  );

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

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header className="form-main-heading">
          <Modal.Title>
            {formik.values.id ? "Update Accountant" : "Add Accountant"}
          </Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={handleCloseModal}
          />
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sub Plan</Form.Label>
                  <Select
                    options={
                      visitorSubPlans?.map((sp) => ({
                        value: sp._id,
                        label: sp.name,
                      })) || []
                    }
                    value={
                      visitorSubPlans
                        ?.map((sp) => ({
                          value: sp._id,
                          label: sp.name,
                        }))
                        ?.find((opt) => opt.value === formik.values.subPlan) ||
                      null
                    }
                    onChange={(opt) => {
                      formik.setFieldValue("subPlan", opt ? opt.value : "");
                    }}
                    placeholder="Select sub plan"
                    classNamePrefix="custom-select"
                    isSearchable
                    isClearable
                  />
                  {formik.touched.subPlan && formik.errors.subPlan && (
                    <div className="text-danger">{formik.errors.subPlan}</div>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Plan Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="amount"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    className="custom-select-height"
                    disabled
                    readOnly
                  />
                  {formik.touched.amount && formik.errors.amount && (
                    <div className="text-danger">{formik.errors.amount}</div>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount</Form.Label>
                  <Form.Control
                    type="text"
                    name="discount"
                    value={formik.values.discount}
                    onChange={formik.handleChange}
                    className="custom-select-height"
                    // placeholder="e.g., 10%"
                  />
                  {formik.touched.discount && formik.errors.discount && (
                    <div className="text-danger">{formik.errors.discount}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="discountAmount"
                    value={formik.values.discountAmount}
                    onChange={formik.handleChange}
                    className="custom-select-height"
                    placeholder="e.g., 10"
                  />
                  {formik.touched.discountAmount &&
                    formik.errors.discountAmount && (
                      <div className="text-danger">
                        {formik.errors.discountAmount}
                      </div>
                    )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Payable Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="payableAmount"
                    value={formik.values.payableAmount}
                    onChange={formik.handleChange}
                    className="custom-select-height"
                    disabled
                    readOnly
                  />
                  {formik.touched.payableAmount &&
                    formik.errors.payableAmount && (
                      <div className="text-danger">
                        {formik.errors.payableAmount}
                      </div>
                    )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Receive Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="paidAmount.amount"
                    value={formik.values.paidAmount.amount}
                    onChange={handlePaidAmountChange}
                    className="custom-select-height"
                    placeholder="Enter Receive Amount"
                  />
                  {formik.touched.paidAmount?.amount &&
                    formik.errors.paidAmount?.amount && (
                      <div className="text-danger mt-1">
                        {formik.errors.paidAmount.amount}
                      </div>
                    )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Mode</Form.Label>
                  <Select
                    options={paymentModeOptions}
                    value={
                      paymentModeOptions.find(
                        (option) =>
                          option.value === formik.values.paidAmount.paymentMode
                      ) || null
                    }
                    onChange={handlePaymentModeChange}
                    placeholder="Select Payment Mode"
                    classNamePrefix="custom-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: "38px",
                        fontSize: "13px",
                      }),
                    }}
                  />
                  {formik.touched.paidAmount?.paymentMode &&
                    formik.errors.paidAmount?.paymentMode && (
                      <div className="text-danger mt-1">
                        {formik.errors.paidAmount.paymentMode}
                      </div>
                    )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Paid Date</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      name="paidAmount.date"
                      value={
                        formik.values.paidAmount.date
                          ? formatDate(parseDate(formik.values.paidAmount.date))
                          : ""
                      }
                      readOnly
                      ref={paidDateInputRef}
                      onClick={() => {
                        if (formik.values.paidAmount.date) {
                          setPaidDateValue(
                            parseDate(formik.values.paidAmount.date)
                          );
                        }
                        setShowPaidDateCalendar((show) => !show);
                      }}
                      className="custom-select-height"
                      placeholder="dd/mm/yyyy"
                      style={{ cursor: "pointer", backgroundColor: "#fff" }}
                    />
                    {formik.values.paidAmount.date ? (
                      <button
                        type="button"
                        onClick={() => {
                          formik.setFieldValue("paidAmount.date", "");
                          setPaidDateValue(null);
                          setShowPaidDateCalendar(false);
                        }}
                        style={{
                          position: "absolute",
                          right: 8,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 16,
                          color: "#888",
                          padding: 0,
                          zIndex: 10000,
                        }}
                        aria-label="Clear date"
                      >
                        ×
                      </button>
                    ) : (
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
                    )}
                    {showPaidDateCalendar && (
                      <div
                        ref={paidDateCalendarRef}
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
                            setPaidDateValue(selectedDate);
                            formik.setFieldValue(
                              "paidAmount.date",
                              toISODate(selectedDate)
                            );
                            setShowPaidDateCalendar(false);
                          }}
                          value={paidDateValue}
                          locale="en-GB"
                        />
                      </div>
                    )}
                  </div>
                  {formik.touched.paidAmount?.date &&
                    formik.errors.paidAmount?.date && (
                      <div className="text-danger mt-1">
                        {formik.errors.paidAmount.date}
                      </div>
                    )}
                </Form.Group>
              </Col>
              {["GPay", "Bank", "UPI"].includes(
                formik.values.paidAmount.paymentMode
              ) && (
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Bank</Form.Label>
                    <Select
                      options={bankOptions}
                      value={
                        bankOptions.find(
                          (option) =>
                            option.value === formik.values.paidAmount.bank
                        ) || null
                      }
                      onChange={handleBankChange}
                      placeholder="Select Bank"
                      classNamePrefix="custom-select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: "38px",
                          fontSize: "13px",
                        }),
                      }}
                    />
                    {formik.touched.paidAmount?.bank &&
                      formik.errors.paidAmount?.bank && (
                        <div className="text-danger mt-1">
                          {formik.errors.paidAmount.bank}
                        </div>
                      )}
                  </Form.Group>
                </Col>
              )}

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Receivable Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="dueAmount"
                    value={formik.values.dueAmount}
                    onChange={formik.handleChange}
                    className="custom-select-height"
                    disabled
                    readOnly
                  />
                  {formik.touched.dueAmount && formik.errors.dueAmount && (
                    <div className="text-danger">{formik.errors.dueAmount}</div>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Remarks</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="remarks"
                    value={formik.values.remarks}
                    onChange={formik.handleChange}
                    className="rounded-4"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Modal.Footer>
              <Button
                variant="outline-primary"
                className="custom-select-height"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="custom-select-height"
              >
                {formik.values.id ? "Update" : "Submit"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal
        show={showBillingModal}
        onHide={handleCloseBillingModal}
        centered
        size="lg"
      >
        <Modal.Header className="form-main-heading">
          <Modal.Title className="fw-semibold">Billing Details</Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={handleCloseBillingModal}
          />
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={billingFormik.handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Total Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="totalAmount"
                    value={billingFormik.values.totalAmount}
                    onChange={billingFormik.handleChange}
                    className="custom-select-height"
                    placeholder="Enter total amount"
                    disabled
                  />
                  {billingFormik.touched.totalAmount &&
                    billingFormik.errors.totalAmount && (
                      <div className="text-danger">
                        {billingFormik.errors.totalAmount}
                      </div>
                    )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Receivable Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="dueAmount"
                    value={billingFormik.values.dueAmount}
                    onChange={billingFormik.handleChange}
                    className="custom-select-height"
                    placeholder="Enter Receivable Amount"
                    disabled
                  />
                  {billingFormik.touched.dueAmount &&
                    billingFormik.errors.dueAmount && (
                      <div className="text-danger">
                        {billingFormik.errors.dueAmount}
                      </div>
                    )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Receive Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="paidAmount"
                    value={billingFormik.values.paidAmount}
                    onChange={billingFormik.handleChange}
                    className="custom-select-height"
                    placeholder="Enter Receive Amount"
                    disabled={billingFormik.values.dueAmount === "0" || 0}
                  />
                  {billingFormik.touched.paidAmount &&
                    billingFormik.errors.paidAmount && (
                      <div className="text-danger">
                        {billingFormik.errors.paidAmount}
                      </div>
                    )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Mode</Form.Label>
                  <Select
                    options={paymentModeOptions}
                    value={
                      paymentModeOptions?.find(
                        (option) =>
                          option.value === billingFormik.values.paymentMode
                      ) || null
                    }
                    onChange={(option) =>
                      billingFormik.setFieldValue(
                        "paymentMode",
                        option ? option.value : ""
                      )
                    }
                    placeholder="Select Payment Mode"
                    classNamePrefix="custom-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: "38px",
                        fontSize: "13px",
                      }),
                    }}
                    isDisabled={billingFormik.values.dueAmount === "0" || 0}
                  />
                  {billingFormik.touched.paymentMode &&
                    billingFormik.errors.paymentMode && (
                      <div className="text-danger">
                        {billingFormik.errors.paymentMode}
                      </div>
                    )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Date</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      name="date"
                      value={
                        billingFormik.values.date
                          ? formatDate(parseDate(billingFormik.values.date))
                          : ""
                      }
                      disabled={billingFormik.values.dueAmount === "0" || 0}
                      ref={paidDateInputRef}
                      onClick={() => {
                        if (billingFormik.values.date) {
                          setPaidDateValue(
                            parseDate(billingFormik.values.date)
                          );
                        }
                        setShowPaidDateCalendar((show) => !show);
                      }}
                      className="custom-select-height"
                      placeholder="dd/mm/yyyy"
                      style={{
                        cursor:
                          billingFormik.values.dueAmount === "0" || 0
                            ? "not-allowed"
                            : "pointer",
                        backgroundColor: "#fff",
                      }}
                    />
                    {billingFormik.values.date ? (
                      <button
                        type="button"
                        onClick={() => {
                          billingFormik.setFieldValue("date", "");
                          setPaidDateValue(null);
                          setShowPaidDateCalendar(false);
                        }}
                        style={{
                          position: "absolute",
                          right: 8,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 16,
                          color: "#888",
                          padding: 0,
                          zIndex: 10000,
                        }}
                        aria-label="Clear date"
                      >
                        ×
                      </button>
                    ) : (
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
                    )}
                    {showPaidDateCalendar && (
                      <div
                        ref={paidDateCalendarRef}
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
                          minDate={new Date()} 
                          onChange={(selectedDate) => {
                            setPaidDateValue(selectedDate);
                            billingFormik.setFieldValue(
                              "date",
                              toISODate(selectedDate)
                            );
                            setShowPaidDateCalendar(false);
                          }}
                          value={paidDateValue}
                          locale="en-GB"
                        />
                      </div>
                    )}
                  </div>
                  {billingFormik.touched.date && billingFormik.errors.date && (
                    <div className="text-danger">
                      {billingFormik.errors.date}
                    </div>
                  )}
                </Form.Group>
              </Col>
              {["GPay", "Bank", "UPI"].includes(
                billingFormik.values.paymentMode
              ) && (
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Bank</Form.Label>
                    <Select
                      options={bankOptions}
                      value={
                        bankOptions?.find(
                          (option) => option.value === billingFormik.values.bank
                        ) || null
                      }
                      onChange={(option) =>
                        billingFormik.setFieldValue(
                          "bank",
                          option ? option.value : ""
                        )
                      }
                      placeholder="Select Bank"
                      classNamePrefix="custom-select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: "38px",
                          fontSize: "13px",
                        }),
                      }}
                    />
                    {billingFormik.touched.bank &&
                      billingFormik.errors.bank && (
                        <div className="text-danger">
                          {billingFormik.errors.bank}
                        </div>
                      )}
                  </Form.Group>
                </Col>
              )}
            </Row>
            <Modal.Footer className="border-0">
              <Button
                variant="outline-primary"
                className="custom-select-height"
                onClick={handleCloseBillingModal}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="custom-select-height"
              >
                Update
              </Button>
            </Modal.Footer>
          </Form>

          {/* Payment History Section */}
          {selectedItem?.paidAmount?.length > 0 && (
            <div className="mt-4">
              <h5
                className="rounded-pill shadow-sm my-3 p-2"
                style={{
                  backgroundColor: "#E9ECEF",
                  border: "1px solid #D3D3D3",
                }}
              >
                Payment History
              </h5>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Bank</th>
                      <th>Payment Mode</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItem.paidAmount?.map((payment, index) => (
                      <tr key={index}>
                        <td>{formatDate(parseDate(payment.date)) || "-"}</td>
                        <td>{payment.amount || "-"}</td>
                        <td>
                          {payment.bank
                            ? bankingDetails?.find(
                                (b) => b._id === payment.bank?._id
                              )?.bankName || "N/A"
                            : "-"}
                        </td>
                        <td>{payment.paymentMode || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
      <div className="my-5 p-4 bg-light rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Accountant</h5>
          {userRole !== "Student" && userRole !== "LeadStudent" && (
            <Button
              variant="primary"
              className="custom-select-height"
              onClick={() => {
                formik.resetForm();
                setShowModal(true);
                setOtherPaidSum(0);
              }}
            >
              Add New
            </Button>
          )}
        </div>
        <DataTable
          columns={AccountantColumns}
          data={canRead ? accountantData : []}
          currentPage={1}
          itemsPerPage={10}
          rowHeight={false}
          onEdit={handleEdit}
          onDelete={handleDelete}
          totalData={totalData}
          renderActions={renderActions}
          canEdit={canUpdate}
          canDelete={canDelete}
          canRead={canRead}
        />
      </div>
    </>
  );
};

export default ApplicationAccountant;
