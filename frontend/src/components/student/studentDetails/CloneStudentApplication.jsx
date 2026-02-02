import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import { useState, useEffect } from "react";
import { getAllBankingDetails } from "../../../redux/actions/Master/Banking.action";
import { useDispatch } from "react-redux";
import { studentAccountant } from "../../../redux/actions/Student/StudentApplication.action";
import { toast } from "react-toastify";
import getSymbolFromCurrency from "currency-symbol-map";
import { decryptData } from "../../../utils/encryptionUtils";

const CloneStudentApplication = ({
  setCloneModalOpen,
  setCountryName,
  cloneModalOpen,
  preferredCountries,
  handleCloneSubmit,
  countryName,
  studentSubPlans,
  formik,
  fetchSubPlans,
  studentPlan,
  selectedStudent,
  userRole,
}) => {
  const dispatch = useDispatch();
  const [bankingDetails, setBankingDetails] = useState([]);
  const [useOldAmount, setUseOldAmount] = useState(false); // Default: No
  const [accountantData, setAccountantData] = useState(null); // Store API response

  const [overpaymentMessage, setOverpaymentMessage] = useState(""); // Overpayment info
  const storedEncryptedCurrency = decryptData(
    localStorage.getItem("crmCurrency")
  );
  const fetchAccountantStudent = async (studentId) => {
    if (!studentId) {
      toast.error("No student selected for fetching accountant data.");
      return;
    }
    try {
      const res = await dispatch(studentAccountant(studentId));
      setAccountantData(res?.data?.data || null);
    } catch (error) {
      console.error("Error fetching accountant data:", error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch accountant data"
      );
      setAccountantData(null);
    }
  };

  const handlePaidAmountChange = (index, field, value, section) => {
    const updatedPaidAmount = [...formik.values[section].paidAmount];
    updatedPaidAmount[index] = {
      ...updatedPaidAmount[index],
      [field]: value,
    };
    formik.setFieldValue(`${section}.paidAmount`, updatedPaidAmount);
  };

  const fetchBankingDetails = async () => {
    try {
      const res = await dispatch(getAllBankingDetails(1, 1000, ""));
      const responseData = res?.data?.data?.data || [];
      setBankingDetails(responseData);
    } catch (error) {
      console.error("Error fetching banking details:", error);
      setBankingDetails([]);
      toast.error(
        error?.response?.data?.message || "Failed to fetch banking details"
      );
    }
  };

  useEffect(() => {
    if (cloneModalOpen && selectedStudent?._id) {
      fetchAccountantStudent(selectedStudent._id);
      fetchBankingDetails();
    }
  }, [cloneModalOpen, selectedStudent?._id]);

  // Calculate paidAmount and dueAmount based on totalPaidAmount and payableAmount
  useEffect(() => {
    if (
      useOldAmount &&
      accountantData?.totalPaidAmount &&
      formik.values.invoice.payableAmount
    ) {
      const totalPaid = parseFloat(accountantData.totalPaidAmount) || 0;
      const payable = parseFloat(formik.values.invoice.payableAmount) || 0;

      let adjustedPaid = totalPaid;
      let due = payable - totalPaid;
      setOverpaymentMessage("");

      if (totalPaid > payable) {
        adjustedPaid = payable; // Cap at payable
        due = 0;
        const overpayment = totalPaid - payable;
        setOverpaymentMessage(
          `Overpayment of ${
            storedEncryptedCurrency
              ? getSymbolFromCurrency(storedEncryptedCurrency)
              : "₹"
          }${overpayment.toFixed(2)} deposited.`
        );
      } else if (totalPaid <= payable) {
        due = payable - totalPaid; // Normal calculation
      }

      // Update formik values
      handlePaidAmountChange(0, "amount", adjustedPaid.toFixed(2), "invoice");
      formik.setFieldValue("invoice.dueAmount", due.toFixed(2));
    } else if (!useOldAmount) {
      setOverpaymentMessage("");
      if (accountantData?.totalPaidAmount) {
        handlePaidAmountChange(0, "amount", "", "invoice");
        formik.setFieldValue(
          "invoice.dueAmount",
          formik.values.invoice.payableAmount || ""
        );
      }
    }
  }, [useOldAmount, accountantData, formik.values.invoice.payableAmount]);

  const selectStyles = {
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
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  const paymentModeOptions = [
    { label: "GPay", value: "GPay" },
    { label: "Bank", value: "Bank" },
    { label: "Cash", value: "Cash" },
    { label: "UPI", value: "UPI" },
  ];

  const bankOptions = bankingDetails.map((bank) => ({
    label: bank.bankName,
    value: bank._id,
  }));

  return (
    <>
      <Modal
        show={cloneModalOpen}
        onHide={() => {
          setCloneModalOpen(false);
          setCountryName("");
          setAccountantData(null); // Reset on close
          setUseOldAmount(false); // Reset to No
        }}
        size="lg"
      >
        <Modal.Header className="form-main-heading">
          <Modal.Title>Clone Student Application</Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={() => {
              setCloneModalOpen(false);
              setCountryName("");
              setAccountantData(null);
              setUseOldAmount(false);
            }}
          />
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={12} className="mb-3">
                <Form.Label>Country</Form.Label>
                <Select
                  name="countryName"
                  className="custom-select-height"
                  options={preferredCountries?.map((country) => ({
                    label: country.name,
                    value: country.name,
                  }))}
                  value={
                    countryName
                      ? { label: countryName, value: countryName }
                      : null
                  }
                  onChange={async (selectedOption) => {
                    const selectedCountry = selectedOption
                      ? selectedOption.value
                      : "";
                    setCountryName(selectedCountry);

                    if (selectedCountry && studentPlan) {
                      await fetchSubPlans(
                        1,
                        10,
                        "",
                        studentPlan._id,
                        selectedCountry
                      );
                    }
                  }}
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
                  placeholder="Select Country"
                  isClearable
                />
              </Col>
              {userRole !== "B2B Admin" && userRole !== "B2B Member" && (
                <>
                  <Col md={12} className="mb-3">
                    <Form.Label>Old Amount Calculate</Form.Label>
                    <div className="d-flex gap-3">
                      <Form.Check
                        type="radio"
                        label="Yes"
                        name="useOldAmount"
                        checked={useOldAmount === true}
                        onChange={() => setUseOldAmount(true)}
                        className="custom-radio-border"
                      />
                      <Form.Check
                        type="radio"
                        label="No"
                        name="useOldAmount"
                        checked={useOldAmount === false}
                        onChange={() => setUseOldAmount(false)}
                        className="custom-radio-border"
                      />
                    </div>
                  </Col>
                </>
              )}
            </Row>
            {userRole !== "B2B Admin" && userRole !== "B2B Member" && (
              <>
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
                        ?.map((sp) => ({
                          value: sp._id,
                          label: sp.name,
                        }))
                        .find(
                          (option) =>
                            option.value === formik.values.invoice.subPlan
                        )}
                      onChange={(option) => {
                        const subPlanValue = option?.value || null;
                        formik.setFieldValue("invoice.subPlan", subPlanValue);

                        if (subPlanValue) {
                          const currentPaid =
                            formik.values.invoice.paidAmount || [];
                          if (currentPaid.length === 0) {
                            formik.setFieldValue("invoice.paidAmount", [
                              {
                                amount: "",
                                date: "",
                                bank: "",
                                paymentMode: "",
                              },
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
                        // placeholder="e.g., 10%"
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
                        value={
                          formik.values.invoice.paidAmount[0]?.amount || ""
                        }
                        onChange={(e) =>
                          handlePaidAmountChange(
                            0,
                            "amount",
                            e.target.value,
                            "invoice"
                          )
                        }
                        className="custom-select-height"
                        placeholder="Enter Receive Amount"
                        // disabled={useOldAmount} // Disable if using old amount
                      />
                      {formik.touched.invoice?.paidAmount?.[0]?.amount &&
                        formik.errors.invoice?.paidAmount?.[0]?.amount && (
                          <div className="text-danger">
                            {formik.errors.invoice.paidAmount[0].amount}
                          </div>
                        )}
                      {overpaymentMessage && (
                        <div className="text-info mt-1">
                          {overpaymentMessage}
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
                              formik.values.invoice.paidAmount[0]?.paymentMode
                          ) || null
                        }
                        onChange={(option) =>
                          handlePaidAmountChange(
                            0,
                            "paymentMode",
                            option ? option.value : "",
                            "invoice"
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
                            {formik.errors.invoice?.dueAmount}
                          </div>
                        )}
                    </Form.Group>
                  </Col>
                  {(formik.values.invoice.paidAmount[0]?.paymentMode ===
                    "GPay" ||
                    formik.values.invoice.paidAmount[0]?.paymentMode ===
                      "Bank" ||
                    formik.values.invoice.paidAmount[0]?.paymentMode ===
                      "UPI") && (
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Bank</Form.Label>
                        <Select
                          options={bankOptions}
                          value={
                            bankOptions.find(
                              (option) =>
                                option.value ===
                                formik.values.invoice.paidAmount[0]?.bank
                            ) || null
                          }
                          onChange={(option) =>
                            handlePaidAmountChange(
                              0,
                              "bank",
                              option ? option.value : null,
                              "invoice"
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
                </Row>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="link"
            className="custom-select-height btn border-primary text-primary text-decoration-none"
            onClick={() => {
              setCloneModalOpen(false);
              setCountryName("");
              setAccountantData(null);
              setUseOldAmount(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="custom-select-height"
            onClick={handleCloneSubmit}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CloneStudentApplication;
