import { useDispatch } from "react-redux";
import Pageheader from "../../layouts/Pageheader";
import { ipRestriction } from "../../redux/actions/Admin.action";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getAllCrmSettings,
  createCrmSettings,
  updateCrmSettings,
} from "../../redux/actions/CrmSettings.action";
import { currencyCode } from "../../redux/actions/CourseFinder.action";
import Select from "react-select";
import { Col, Row, Form, Button } from "react-bootstrap";
import { decryptData, encryptData } from "../../utils/encryptionUtils";

const IPRestriction = () => {
  const dispatch = useDispatch();

  const [enabled, setEnabled] = useState(true);
  const [currencyCodeData, setCurrencyCodeData] = useState([]);
  const [crmSettingId, setCrmSettingId] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [countryCode, setCountryCode] = useState("");

  const fetchAllCrmSettings = async () => {
    try {
      const response = await dispatch(getAllCrmSettings());
      const settingsData = response?.data?.data?.[0];
      const currency = settingsData?.crmCurrency || "";
      const country = settingsData?.countryCode || "";

      setEnabled(settingsData?.ipRestriction || false);
      setSelectedCurrency(currency);
      setCrmSettingId(settingsData?._id || null);
      setCountryCode(country);

      if (currency) {
        const encryptedCurrency = encryptData(currency);
        localStorage.setItem("crmCurrency", encryptedCurrency);
      } else {
        localStorage.removeItem("crmCurrency");
      }

      if (country) {
        const encryptedCountry = encryptData(country);
        localStorage.setItem("countryISOCode", encryptedCountry);
      } else {
        localStorage.removeItem("countryISOCode");
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const fetchAllCurrencyCode = async () => {
    try {
      const response = await dispatch(currencyCode(1, 1000));
      setCurrencyCodeData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching currency codes:", error);
      setCurrencyCodeData([]);
    }
  };

  useEffect(() => {
    const storedEncryptedCurrency = localStorage.getItem("crmCurrency");
    if (storedEncryptedCurrency) {
      const decryptedCurrency = decryptData(storedEncryptedCurrency);
      if (decryptedCurrency) {
        setSelectedCurrency(decryptedCurrency);
      }
    }
    fetchAllCrmSettings();
    fetchAllCurrencyCode();
  }, []);

  const handleToggle = async () => {
    try {
      const newState = !enabled;
      setEnabled(newState);
      const payload = { enable: newState };
      const response = await dispatch(ipRestriction(payload));
      if (response.status === 200) {
        toast.success(
          response?.data?.message ||
            "Global IP restriction updated successfully"
        );
        fetchAllCrmSettings();
      }
    } catch (error) {
      console.error("API Error:", error);
      setEnabled(!enabled);
    }
  };

  const handleCurrencyChange = async (selectedOption) => {
    const newCurrency = selectedOption ? selectedOption.value : "";
    setSelectedCurrency(newCurrency);

    try {
      const payload = { crmCurrency: newCurrency };
      let response;
      if (crmSettingId) {
        response = await dispatch(updateCrmSettings(payload));
        toast.success("Currency updated successfully");
      } else {
        response = await dispatch(createCrmSettings(payload));
        toast.success("Currency created successfully");
      }

      if (newCurrency) {
        const encryptedCurrency = encryptData(newCurrency);
        localStorage.setItem("crmCurrency", encryptedCurrency);
      } else {
        localStorage.removeItem("crmCurrency");
      }

      fetchAllCrmSettings();
    } catch (error) {
      console.error("Currency API Error:", error);
      toast.error("Failed to update currency");
    }
  };

  const handleCountryCodeSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = { countryCode };
      let response;
      if (crmSettingId) {
        response = await dispatch(updateCrmSettings(payload));
        toast.success("Country code updated successfully");
      } else {
        response = await dispatch(createCrmSettings(payload));
        toast.success("Country code created successfully");
      }
      fetchAllCrmSettings();
      return response;
    } catch (error) {
      console.error("Country code API Error:", error);
      toast.error("Failed to update country code");
    }
  };

  return (
    <>
      <Pageheader
        mainheading="IP Restriction"
        parentfolder="Settings"
        activepage="IP Restriction"
      />

      <div className="card p-3 mt-3">
        <h5 className="mb-3">IP Restriction</h5>
        <div className="form-check form-switch custom-toggle-button me-0">
          <input
            className="form-check-input three-dots-icon"
            type="checkbox"
            id="toggle-ip-restriction"
            checked={enabled}
            onChange={handleToggle}
          />
          <label
            className="form-check-label ms-2"
            htmlFor="toggle-ip-restriction"
          >
            {enabled ? "Enabled" : "Disabled"}
          </label>
        </div>
      </div>

      <div className="card mt-3 p-3">
        <h5 className="mb-3">Currency</h5>
        <Row>
          <Col md={4} className="mb-3">
            <Select
              name="currencyCode"
              options={currencyCodeData?.map((code) => ({
                value: code.code,
                label: code.code,
              }))}
              value={
                selectedCurrency
                  ? { value: selectedCurrency, label: selectedCurrency }
                  : null
              }
              onChange={handleCurrencyChange}
              placeholder="Select Currency"
              isClearable
              classNamePrefix="custom-select"
              styles={{
                control: (base) => ({
                  ...base,
                  fontSize: "13px",
                }),
              }}
            />
          </Col>
        </Row>
      </div>

      <div className="card mt-3 p-3">
        <h5 className="mb-3">Country ISO Code</h5>
        <form onSubmit={handleCountryCodeSubmit}>
          <Row className="align-items-center">
            <Col md={4} className="mb-3">
              <Form.Control
                type="text"
                className="custom-select-height"
                placeholder="e.g., in"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              />
            </Col>
            <Col md="auto" className="mb-3">
              <Button
                type="submit"
                variant="primary"
                className="custom-select-height"
              >
                Submit
              </Button>
            </Col>
          </Row>
        </form>
      </div>
    </>
  );
};

export default IPRestriction;
