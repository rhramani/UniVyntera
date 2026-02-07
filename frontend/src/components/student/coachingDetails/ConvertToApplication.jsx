import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { createGenerateInvoice } from "../../../redux/actions/Accountant/GenerateInvoice.action";
import { useFormik } from "formik";
import { AiOutlineClose } from "react-icons/ai";
import { MdCalendarToday } from "react-icons/md";
import {
  getAllSubPlan,
  getOneSubPlan,
} from "../../../redux/actions/Master/SubPlan.action";
import { useEffect, useState, useCallback, useRef } from "react";
import { getAllMainPlan } from "../../../redux/actions/Master/MainPlan.action";
import { updateStudentApplication } from "../../../redux/actions/Student/StudentApplication.action";
import { getAllBankingDetails } from "../../../redux/actions/Master/Banking.action";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

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

const convertToApplicationSchema = Yup.object({
  invoice: Yup.object({
    subPlan: Yup.string().required("Admission Sub Plan is required"),
    amount: Yup.string(),
    discount: Yup.string(),
    discountAmount: Yup.string(),
    payableAmount: Yup.string(),
    paidAmount: Yup.array()
      .of(
        Yup.object().shape({
          amount: Yup.string().required("Receive Amount is required"),
          date: Yup.string().nullable(),
          bank: Yup.string().nullable(),
          paymentMode: Yup.string().required("Payment Mode is required"),
        }),
      )
      .min(1, "At least one Receive Amount is required"),
    dueAmount: Yup.string(),
    paymentType: Yup.string(),
    invoiceRemarks: Yup.string(),
  }),
  admissionProcessRequired: Yup.boolean(),
});

const ConvertToApplication = ({
  selectedForApplication,
  showConvertModal,
  setShowConvertModal,
  userRole,
}) => {
  const dispatch = useDispatch();
  const [mainPlans, setMainPlans] = useState([]);
  const [studentSubPlans, setStudentSubPlans] = useState([]);
  const [bankingDetails, setBankingDetails] = useState([]);
  const [isLoadingSubPlan, setIsLoadingSubPlan] = useState(false);
  const [currentSubPlan, setCurrentSubPlan] = useState("");
  const [showPaidDateCalendar, setShowPaidDateCalendar] = useState(false); // State for calendar visibility
  const [paidDateValue, setPaidDateValue] = useState(null); // State for selected date
  const paidDateInputRef = useRef(null); // Ref for date input
  const paidDateCalendarRef = useRef(null); // Ref for calendar popup

  const formik = useFormik({
    initialValues: {
      invoice: {
        subPlan: "",
        amount: "",
        discount: "",
        discountAmount: "",
        payableAmount: "",
        paidAmount: [{ amount: "", date: "", bank: "", paymentMode: "" }],
        dueAmount: "",
        invoiceRemarks: "",
        paymentType: "",
      },
      admissionProcessRequired: true,
    },
    validationSchema: convertToApplicationSchema,
    onSubmit: async (values) => {
      try {
        const studentPlan = mainPlans.find(
          (plan) => plan.name.toLowerCase() === "student admission",
        );

        const invoicePayload = {
          name: selectedForApplication._id || "",
          contactNo: selectedForApplication.contact || "",
          mainPlan: studentPlan?._id || "",
          subPlan: values.invoice.subPlan || "",
          amount: values.invoice.amount || "",
          discount: values.invoice.discount || "",
          discountAmount: values.invoice.discountAmount || "",
          payableAmount: values.invoice.payableAmount || "",
          paymentType: values.invoice.paymentType || "",
          paidAmount: values.invoice.paidAmount
            .filter((entry) => entry.amount && entry.amount.trim() !== "")
            .map((entry) => ({
              amount: entry.amount || "",
              date: entry.date || "", // Use the date as stored in Formik
              bank: entry.bank || "",
              paymentMode: entry.paymentMode || "",
            })),
          dueAmount: values.invoice.dueAmount || "",
          remarks: values.invoice.invoiceRemarks || "",
        };

        const invoiceResponse = await dispatch(
          createGenerateInvoice(invoicePayload),
        );
        if (invoiceResponse?.status !== 201) {
          throw new Error(
            invoiceResponse?.data?.message || "Failed to create invoice",
          );
        }

        const formData = new FormData();
        formData.append(
          "admissionProcessRequired",
          values.admissionProcessRequired,
        );

        const convertResponse = await dispatch(
          updateStudentApplication(formData, selectedForApplication._id),
        );
        if (convertResponse?.status === 200) {
          toast.success("Application converted successfully");
          setShowConvertModal(false);
        } else {
          throw new Error(
            convertResponse?.data?.message || "Failed to convert lead",
          );
        }
      } catch (err) {
        console.error("Error in convert to application:", err);
        toast.error(err?.response?.data?.message || "Something went wrong");
      }
    },
  });

  const fetchSubPlans = async (
    page = 1,
    limit = 1000,
    searchTerm = "",
    mainPlanId = "",
  ) => {
    try {
      const res = await dispatch(
        getAllSubPlan(page, limit, searchTerm, mainPlanId),
      );
      const responseData = res?.data?.data || {};
      setStudentSubPlans(responseData?.data || []);
    } catch (error) {
      console.error("Error fetching sub plans:", error);
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
      toast.error("Failed to fetch main plans.");
    }
  };

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

  const calculateAmounts = useCallback(() => {
    const values = formik.values.invoice;
    const amount = parseFloat(values.amount) || 0;

    let discountFromDiscountField = 0;
    if (values.discount) {
      const percent = parseFloat(values.discount.replace("%", "").trim()) || 0;
      discountFromDiscountField = (amount * percent) / 100;
    }

    const discountFromDiscountAmount = parseFloat(values.discountAmount) || 0;
    const totalDiscount =
      discountFromDiscountField + discountFromDiscountAmount;
    const payableAmount = amount - totalDiscount;
    const totalPaid =
      values.paidAmount?.reduce(
        (sum, entry) => sum + (parseFloat(entry.amount) || 0),
        0,
      ) || 0;
    const dueAmount = Math.max(0, payableAmount - totalPaid);

    formik.setFieldValue(
      "invoice.payableAmount",
      Math.max(0, payableAmount).toFixed(2),
    );
    formik.setFieldValue("invoice.dueAmount", dueAmount.toFixed(2));
  }, [formik]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      calculateAmounts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    formik.values.invoice.amount,
    formik.values.invoice.discount,
    formik.values.invoice.discountAmount,
    formik.values.invoice.paidAmount,
  ]);

  useEffect(() => {
    const setAmountForSubPlan = async (subPlanId) => {
      if (!subPlanId || isLoadingSubPlan) return;
      setIsLoadingSubPlan(true);
      try {
        const subPlan = await dispatch(getOneSubPlan(subPlanId));
        const totalAmount = subPlan?.data?.data?.totalAmount || "";
        formik.setFieldValue("invoice.amount", totalAmount.toString());
      } catch (error) {
        console.error("Error fetching sub-plan:", error);
        toast.error("Failed to fetch sub-plan details.");
      } finally {
        setIsLoadingSubPlan(false);
      }
    };

    if (formik.values.invoice.subPlan !== currentSubPlan) {
      setCurrentSubPlan(formik.values.invoice.subPlan);
      if (formik.values.invoice.subPlan) {
        setAmountForSubPlan(formik.values.invoice.subPlan);
      }
    }
  }, [formik.values.invoice.subPlan, isLoadingSubPlan]);

  useEffect(() => {
    const refetchSubPlans = async () => {
      const studentPlan = mainPlans.find(
        (plan) => plan.name.toLowerCase() === "student admission",
      );

      if (studentPlan?._id) {
        await fetchSubPlans(1, 1000, "", studentPlan._id);
        formik.setFieldValue("invoice.subPlan", "");
        formik.setFieldValue("invoice.amount", "");
        formik.setFieldValue("invoice.payableAmount", "");
        formik.setFieldValue("invoice.dueAmount", "");
        formik.setFieldValue("invoice.paidAmount", [
          { amount: "", date: "", bank: "", paymentMode: "" },
        ]);
      }
    };

    refetchSubPlans();
  }, [mainPlans]);

  useEffect(() => {
    fetchMainPlans();
    fetchBankingDetails();
  }, []);

  // Handle clicks outside the calendar to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        paidDateCalendarRef.current &&
        !paidDateCalendarRef.current.contains(event.target) &&
        paidDateInputRef.current &&
        !paidDateInputRef.current.contains(event.target)
      ) {
        setShowPaidDateCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePaidAmountChange = (index, field, value, section) => {
    const updatedPaidAmount = [...formik.values[section].paidAmount];
    updatedPaidAmount[index] = {
      ...updatedPaidAmount[index],
      [field]: value,
    };
    formik.setFieldValue(`${section}.paidAmount`, updatedPaidAmount);
  };

  const bankOptions = bankingDetails.map((bank) => ({
    label: bank.bankName,
    value: bank._id,
  }));

  const paymentModeOptions = [
    { label: "GPay", value: "GPay" },
    { label: "Bank", value: "Bank" },
    { label: "Cash", value: "Cash" },
    { label: "UPI", value: "UPI" },
    { label: "DD", value: "DD" },
  ];

  const selectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "12px",
      color: "black",
    }),
    placeholder: (base) => ({
      ...base,
      color: "black",
      fontSize: "13px",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <>
      <Modal
        show={showConvertModal}
        onHide={() => setShowConvertModal(false)}
        size="lg"
      >
        <Modal.Header className="form-main-heading">
          <Modal.Title>Convert to Application</Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={() => setShowConvertModal(false)}
          />
        </Modal.Header>
        <Modal.Body>
          {userRole !== "B2B Admin" && userRole !== "B2B Member" && (
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Admission Sub Plan</Form.Label>
                <Select
                  options={
                    studentSubPlans?.map((sp) => ({
                      value: sp._id,
                      label: sp.name,
                    })) || []
                  }
                  value={studentSubPlans
                    ?.map((sp) => ({ value: sp._id, label: sp.name }))
                    .find(
                      (option) =>
                        option.value === formik.values.invoice.subPlan,
                    )}
                  onChange={(option) => {
                    const subPlanValue = option?.value || "";
                    formik.setFieldValue("invoice.subPlan", subPlanValue);

                    if (subPlanValue) {
                      const currentPaid =
                        formik.values.invoice.paidAmount || [];
                      if (currentPaid.length === 0) {
                        formik.setFieldValue("invoice.paidAmount", [
                          { amount: "", date: "", bank: "", paymentMode: "" },
                        ]);
                      }
                    }

                    if (!subPlanValue) {
                      formik.setFieldValue("invoice.amount", "");
                      formik.setFieldValue("invoice.payableAmount", "");
                      formik.setFieldValue("invoice.dueAmount", "");
                      formik.setFieldValue("invoice.paidAmount", []);
                    }
                  }}
                  placeholder="Select Admission Sub Plan"
                  styles={selectStyles}
                  isClearable
                />
                {formik.touched.invoice?.subPlan &&
                  formik.errors.invoice?.subPlan && (
                    <div className="text-danger">
                      {formik.errors.invoice?.subPlan}
                    </div>
                  )}
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Plan Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="invoice.amount"
                    value={formik.values.invoice.amount}
                    onChange={formik.handleChange}
                    className="custom-select-height"
                    disabled
                    readOnly
                  />
                  {formik.touched.invoice?.amount &&
                    formik.errors.invoice?.amount && (
                      <div className="text-danger">
                        {formik.errors.invoice?.amount}
                      </div>
                    )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount</Form.Label>
                  <Form.Control
                    type="text"
                    name="invoice.discount"
                    value={formik.values.invoice.discount}
                    onChange={formik.handleChange}
                    className="custom-select-height"
                    // placeholder="e.g., 10"
                  />
                  {formik.touched.invoice?.discount &&
                    formik.errors.invoice?.discount && (
                      <div className="text-danger">
                        {formik.errors.invoice?.discount}
                      </div>
                    )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="invoice.discountAmount"
                    value={formik.values.invoice.discountAmount}
                    onChange={formik.handleChange}
                    className="custom-select-height"
                    placeholder="e.g., 10"
                  />
                  {formik.touched.invoice?.discountAmount &&
                    formik.errors.invoice?.discountAmount && (
                      <div className="text-danger">
                        {formik.errors.invoice?.discountAmount}
                      </div>
                    )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Payable Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="invoice.payableAmount"
                    value={formik.values.invoice.payableAmount}
                    onChange={formik.handleChange}
                    className="custom-select-height"
                    disabled
                    readOnly
                  />
                  {formik.touched.invoice?.payableAmount &&
                    formik.errors.invoice?.payableAmount && (
                      <div className="text-danger">
                        {formik.errors.invoice?.payableAmount}
                      </div>
                    )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Receive Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="invoice.paidAmount[0].amount"
                    value={formik.values.invoice.paidAmount[0]?.amount || ""}
                    onChange={(e) =>
                      handlePaidAmountChange(
                        0,
                        "amount",
                        e.target.value,
                        "invoice",
                      )
                    }
                    className="custom-select-height"
                    placeholder="Enter Receive Amount"
                  />
                  {formik.touched.invoice?.paidAmount?.[0]?.amount &&
                    formik.errors.invoice?.paidAmount?.[0]?.amount && (
                      <div className="text-danger">
                        {formik.errors.invoice.paidAmount[0].amount}
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
                      name="invoice.paidAmount[0].date"
                      value={
                        formik.values.invoice.paidAmount[0]?.date
                          ? formatDate(
                              parseDate(
                                formik.values.invoice.paidAmount[0].date,
                              ),
                            )
                          : ""
                      }
                      disabled={
                        formik.values.invoice.dueAmount === "0" ||
                        formik.values.invoice.dueAmount === 0
                      }
                      ref={paidDateInputRef}
                      onClick={() => {
                        if (formik.values.invoice.paidAmount[0]?.date) {
                          setPaidDateValue(
                            parseDate(formik.values.invoice.paidAmount[0].date),
                          );
                        }
                        setShowPaidDateCalendar(true);
                      }}
                      className="custom-select-height"
                      placeholder="dd/mm/yyyy"
                      style={{
                        cursor:
                          formik.values.invoice.dueAmount === "0" ||
                          formik.values.invoice.dueAmount === 0
                            ? "not-allowed"
                            : "pointer",
                        backgroundColor: "#fff",
                      }}
                    />
                    {formik.values.invoice.paidAmount[0]?.date ? (
                      <button
                        type="button"
                        onClick={() => {
                          handlePaidAmountChange(0, "date", "", "invoice");
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
                        }}
                      >
                        <Calendar
                          className="form-control m-0 p-0 border-0"
                          onChange={(selectedDate) => {
                            handlePaidAmountChange(
                              0,
                              "date",
                              toISODate(selectedDate),
                              "invoice",
                            );
                            setPaidDateValue(selectedDate);
                            setShowPaidDateCalendar(false);
                          }}
                          value={paidDateValue}
                          locale="en-GB"
                        />
                      </div>
                    )}
                  </div>
                  {formik.touched.invoice?.paidAmount?.[0]?.date &&
                    formik.errors.invoice?.paidAmount?.[0]?.date && (
                      <div className="text-danger">
                        {formik.errors.invoice.paidAmount[0].date}
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
                          option.value ===
                          formik.values.invoice.paidAmount[0]?.paymentMode,
                      ) || null
                    }
                    onChange={(option) =>
                      handlePaidAmountChange(
                        0,
                        "paymentMode",
                        option ? option.value : "",
                        "invoice",
                      )
                    }
                    placeholder="Select payment mode"
                    styles={selectStyles}
                  />
                  {formik.touched.invoice?.paidAmount?.[0]?.paymentMode &&
                    formik.errors.invoice?.paidAmount?.[0]?.paymentMode && (
                      <div className="text-danger">
                        {formik.errors.invoice.paidAmount[0].paymentMode}
                      </div>
                    )}
                </Form.Group>
              </Col>

              {(formik.values.invoice.paidAmount[0]?.paymentMode === "GPay" ||
                formik.values.invoice.paidAmount[0]?.paymentMode === "Bank" ||
                formik.values.invoice.paidAmount[0]?.paymentMode === "UPI") && (
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Bank</Form.Label>
                    <Select
                      options={bankOptions}
                      value={
                        bankOptions.find(
                          (option) =>
                            option.value ===
                            formik.values.invoice.paidAmount[0]?.bank,
                        ) || null
                      }
                      onChange={(option) =>
                        handlePaidAmountChange(
                          0,
                          "bank",
                          option ? option.value : null,
                          "invoice",
                        )
                      }
                      placeholder="Select bank"
                      styles={selectStyles}
                    />
                    {formik.touched.invoice?.paidAmount?.[0]?.bank &&
                      formik.errors.invoice?.paidAmount?.[0]?.bank && (
                        <div className="text-danger">
                          {formik.errors.invoice.paidAmount[0].bank}
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
                    name="invoice.dueAmount"
                    value={formik.values.invoice.dueAmount}
                    onChange={formik.handleChange}
                    className="custom-select-height"
                    disabled
                    readOnly
                  />
                  {formik.touched.invoice?.dueAmount &&
                    formik.errors.invoice?.dueAmount && (
                      <div className="text-danger">
                        {formik.errors.invoice.dueAmount}
                      </div>
                    )}
                </Form.Group>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            className="custom-select-height"
            onClick={() => setShowConvertModal(false)}
          >
            Close
          </Button>
          <Button
            variant="primary"
            className="custom-select-height"
            onClick={formik.handleSubmit}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConvertToApplication;
