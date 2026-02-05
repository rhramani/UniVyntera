import { useEffect, useState } from "react";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import Pageheader from "../../layouts/Pageheader";
import "react-phone-input-2/lib/bootstrap.css";
import PhoneInput from "react-phone-input-2";
import { useFormik } from "formik";
import {
  createCredential,
  getAllCredential,
  updateCredential,
} from "../../redux/actions/BulkMessage/Credential.action";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import usePermissions from "../commonComponents/usePermissions";
import { countryCodeISO } from "../../utils/countryISOCode";
import { FaPhoneAlt, FaBuilding, FaKey, FaEye, FaEyeSlash, FaCopy } from "react-icons/fa";

const WADaddyCredentials = () => {
  const dispatch = useDispatch();
  const { canCreate, canUpdate, canRead } =
    usePermissions("Wa Daddy Credentials");

  const [showAccessToken, setShowAccessToken] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const formik = useFormik({
    initialValues: {
      id: "",
      facebookAppId: "",
      registerdPhoneNumber: "",
      phoneNumberId: "",
      wbaId: "",
      accessToken: "",
      apikey: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        let res;
        if (values.id && canUpdate) {
          res = await dispatch(updateCredential(values, values.id));
          if (res?.data?.code === 200) {
            toast.success("Credential updated successfully");
          }
        } else if (!values.id && canCreate) {
          res = await dispatch(createCredential(values));
          if (res?.data?.code === 201) {
            toast.success("Credential added successfully");
          }
        } else {
          toast.error("You do not have permission to perform this action.");
          return;
        }
        resetForm();
        if (canRead) {
          fetchCredentials();
        }
      } catch (error) {
        toast.error("An error occurred while processing the request.");
      }
    },
  });

  const fetchCredentials = async () => {
    try {
      const res = await dispatch(getAllCredential());
      if (res?.data?.data && res.data.data.length > 0) {
        const credential = res.data.data[0]; // Assuming single credential for simplicity
        formik.setValues({
          id: credential._id || "",
          facebookAppId: credential.facebookAppId || "",
          registerdPhoneNumber: credential.registerdPhoneNumber || "",
          phoneNumberId: credential.phoneNumberId || "",
          wbaId: credential.wbaId || "",
          accessToken: credential.accessToken || "",
          apikey: credential.apikey || "",
        });
      }
    } catch (error) {
      console.log("Error fetching credentials", error);
      toast.error("Failed to fetch credentials");
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchCredentials();
    }
  }, [canRead]);

  return (
    <>
      <Pageheader
        mainheading="Wa Daddy Credentials"
        parentfolder="Settings"
        activepage="Wa Daddy Credentials"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card">
            <Card.Header className="border-bottom-0">
              {/* <div className="card-title">WhatsApp API Integration</div> */}
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                {/* Facebook App ID - Full Width */}
                <Col md={12} className="mb-4">
                  <Form.Label>Facebook APP ID <strong>*</strong></Form.Label>
                  <Form.Control
                    type="text"
                    name="facebookAppId"
                    className="custom-select-height"
                    value={formik.values.facebookAppId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="We need your Facebook App ID for WhatsApp Template creation."
                  />
                </Col>

                <h5 className="mb-4">Enter your Official WhatsApp API Credentials:</h5>
                
                <Row className="g-4">
                  {/* Group 1: Phone Configuration - Left Column */}
                  <Col lg={6} md={12}>
                    <Card className="h-100 wa-credentials-group">
                      <Card.Body>
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <span className="d-flex align-items-center">
                            <FaPhoneAlt size={18} className="text-primary" />
                          </span>
                          <h5 className="mb-0 fs-6">
                            Phone Configuration
                          </h5>
                        </div>

                        
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Registered WhatsApp Number <strong>*</strong>
                          </Form.Label>
                          <PhoneInput
                            country={countryCodeISO()}
                            value={formik.values.registerdPhoneNumber}
                            onChange={(phone, data) => {
                              const dialCode = data.dialCode
                                ? `+${data.dialCode}`
                                : "";
                              const formattedPhone = `${dialCode} ${phone.replace(
                                data.dialCode,
                                ""
                              )}`.trim();
                              formik.setFieldValue(
                                "registerdPhoneNumber",
                                formattedPhone
                              );
                            }}
                            onBlur={formik.handleBlur}
                            inputProps={{
                              name: "registerdPhoneNumber",
                              required: true,
                              className: "form-control custom-select-height",
                            }}
                            inputStyle={{
                              width: "100%",
                              paddingLeft: "65px",
                              borderRadius: "4px",
                            }}
                            buttonStyle={{
                              marginRight: "8px",
                            }}
                          />
                        </Form.Group>

                        <Form.Group className="mb-0">
                          <Form.Label>Phone Number ID<strong> *</strong></Form.Label>
                          <Form.Control
                            type="text"
                            name="phoneNumberId"
                            className="custom-select-height"
                            placeholder="Enter phone number ID"
                            value={formik.values.phoneNumberId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* Group 2: Business & Security - Right Column */}
                  <Col lg={6} md={12}>
                    <Card className="h-100 wa-credentials-group">
                      <Card.Body>
                        <div className="d-flex align-items-center mb-3">
                          <div className="me-2 text-primary">
                            <FaBuilding size={20} />
                          </div>
                          <h5 className="mb-0 fs-6">Business & Security</h5>
                        </div>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>WhatsApp Business Account ID<strong> *</strong></Form.Label>
                          <Form.Control
                            type="text"
                            name="wbaId"
                            className="custom-select-height"
                            placeholder="Enter WhatsApp business account ID"
                            value={formik.values.wbaId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Permanent Access Token<strong> *</strong></Form.Label>
                          <div className="position-relative">
                            <Form.Control
                              type={showAccessToken ? "text" : "password"}
                              name="accessToken"
                              className="custom-select-height pe-5 secure-input"
                              placeholder="Enter permanent access token"
                              value={formik.values.accessToken}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <div className="position-absolute" style={{ right: '35px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                              <FaCopy 
                                className="text-muted me-2" 
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  navigator.clipboard.writeText(formik.values.accessToken);
                                  toast.success("Access token copied to clipboard");
                                }}
                              />
                              {showAccessToken ? 
                                <FaEyeSlash 
                                  className="text-muted" 
                                  onClick={() => setShowAccessToken(false)}
                                /> : 
                                <FaEye 
                                  className="text-muted" 
                                  onClick={() => setShowAccessToken(true)}
                                />
                              }
                            </div>
                          </div>
                        </Form.Group>

                        <Form.Group className="mb-0">
                          <Form.Label>API Key<strong> *</strong></Form.Label>
                          <div className="position-relative">
                            <Form.Control
                              type={showApiKey ? "text" : "password"}
                              name="apikey"
                              className="custom-select-height pe-5 secure-input"
                              placeholder="Enter API key"
                              value={formik.values.apikey}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <div className="position-absolute" style={{ right: '35px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                              <FaCopy 
                                className="text-muted me-2" 
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  navigator.clipboard.writeText(formik.values.apikey);
                                  toast.success("API key copied to clipboard");
                                }}
                              />
                              {showApiKey ? 
                                <FaEyeSlash 
                                  className="text-muted" 
                                  onClick={() => setShowApiKey(false)}
                                /> : 
                                <FaEye 
                                  className="text-muted" 
                                  onClick={() => setShowApiKey(true)}
                                />
                              }
                            </div>
                          </div>
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end mt-4">
                  <Button
                    variant="primary"
                    className="custom-select-height px-4"
                    type="submit"
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default WADaddyCredentials;
