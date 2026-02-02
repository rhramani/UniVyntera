import { useEffect } from "react";
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

const WADaddyCredentials = () => {
  const dispatch = useDispatch();
  const { canCreate, canUpdate, canRead } =
    usePermissions("Wa API Integration");

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
        mainheading="Wa API Integration"
        parentfolder="Settings"
        activepage="Wa API Integration"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card">
            <Card.Header className="border-bottom-0">
              <div className="card-title">WhatsApp API Integration</div>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Facebook APP ID: <strong>*</strong></Form.Label>
                  <Form.Control
                    type="text"
                    name="facebookAppId"
                    className="custom-select-height"
                    value={formik.values.facebookAppId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="We need your Facebook App ID for WhatsApp Template creation."
                  />
                </Form.Group>

                <h5>Enter your Official WhatsApp API Credentials</h5>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        Registered Number (with country code) *
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
                          marginRight: "10px",
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Phone Number Id<strong> *</strong></Form.Label>
                      <Form.Control
                        type="text"
                        name="phoneNumberId"
                        className="custom-select-height"
                        value={formik.values.phoneNumberId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>WhatsApp Business Account Id<strong> *</strong></Form.Label>
                      <Form.Control
                        type="text"
                        name="wbaId"
                        className="custom-select-height"
                        value={formik.values.wbaId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Permanent Access Token<strong> *</strong></Form.Label>
                  <Form.Control
                    type="text"
                    name="accessToken"
                    className="custom-select-height"
                    value={formik.values.accessToken}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Api Key<strong> *</strong></Form.Label>
                  <Form.Control
                    type="text"
                    name="apikey"
                    className="custom-select-height"
                    value={formik.values.apikey}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="primary"
                    className="custom-select-height"
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
