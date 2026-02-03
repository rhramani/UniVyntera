import { useEffect, useState } from "react";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import usePermissions from "../commonComponents/usePermissions";
import {
  createConfiguration,
  getAllConfigurations,
  updateConfiguration,
} from "../../redux/actions/Configuration.action";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { BASEURL } from "../../baseUrl";

const Configuration = () => {
  const dispatch = useDispatch();
  const [showCredential, setShowCredential] = useState(false);
  const { canCreate, canRead, canUpdate } = usePermissions("Configuration");

  useEffect(() => {
    if (canRead) {
      fetchConfigurations();
    }
  }, [canRead]);

  const fetchConfigurations = async () => {
    try {
      const res = await dispatch(getAllConfigurations());
      const responseData = res?.data;
      const config = responseData?.message?.[0] || null;
      if (config) {
        formik.setValues({
          leadFacebookToken: config.leadFacebookToken || "",
          leadFacebookPageId: config.leadFacebookPageId || "",
          cloudinary: {
            cloudName: config.cloudinary?.cloudName || "",
            apiKey: config.cloudinary?.apiKey || "",
            apiSecret: config.cloudinary?.apiSecret || "",
          },
          nodemailer: {
            email: config.nodemailer?.email || "",
            password: config.nodemailer?.password || "",
          },
          gmail: {
            topLogo: config.gmail?.topLogo || "",
            bottomLogo: config.gmail?.bottomLogo || "",
          },
          invoiceLogo: config.invoiceLogo || "",
          voiceAIDetails: {
            OMNIDIM_API_KEY: config.voiceAIDetails?.OMNIDIM_API_KEY || "",
            OMNIDIM_DEFAULT_PHONE_NUMBER_ID:
              config.voiceAIDetails?.OMNIDIM_DEFAULT_PHONE_NUMBER_ID || "",
            OMNIDIM_BASE_URL: config.voiceAIDetails?.OMNIDIM_BASE_URL || "",
          },
          uniCommissionInvoice: {
            name: config.uniCommissionInvoice?.name || "",
            address: config.uniCommissionInvoice?.address || "",
            taxRegistrationNo:
              config.uniCommissionInvoice?.taxRegistrationNo || "",
            phoneNo: config.uniCommissionInvoice?.phoneNo || "",
            bankDetails: {
              accountOwnerName:
                config.uniCommissionInvoice?.bankDetails?.accountOwnerName ||
                "",
              accountOwnerAddress:
                config.uniCommissionInvoice?.bankDetails?.accountOwnerAddress ||
                "",
              bankName:
                config.uniCommissionInvoice?.bankDetails?.bankName || "",
              accountNumber:
                config.uniCommissionInvoice?.bankDetails?.accountNumber || "",
              SWIFTCode:
                config.uniCommissionInvoice?.bankDetails?.SWIFTCode || "",
              IBAN: config.uniCommissionInvoice?.bankDetails?.IBAN || "",
            },
          },
          b2bInvoice: {
            name: config.b2bInvoice?.name || "",
            address: config.b2bInvoice?.address || "",
          },
          applicationFeeInvoice: {
            name: config.applicationFeeInvoice?.name || "",
            application: config.applicationFeeInvoice?.application || "",
            address: config.applicationFeeInvoice?.address || "",
            phoneNo: config.applicationFeeInvoice?.phoneNo || "",
            notes: config.applicationFeeInvoice?.notes || "",
            bankDetails: {
              bankName:
                config.applicationFeeInvoice?.bankDetails?.bankName || "",
              accountName:
                config.applicationFeeInvoice?.bankDetails?.accountName || "",
              accountNumber:
                config.applicationFeeInvoice?.bankDetails?.accountNumber || "",
              bankAddress:
                config.applicationFeeInvoice?.bankDetails?.bankAddress || "",
              IFSCCode:
                config.applicationFeeInvoice?.bankDetails?.IFSCCode || "",
              SwiftCode:
                config.applicationFeeInvoice?.bankDetails?.SwiftCode || "",
            },
          },
          CTCCredentials: {
            CTC_USERNAME: config.CTCCredentials?.CTC_USERNAME || "",
            CTC_PASSWORD: config.CTCCredentials?.CTC_PASSWORD || "",
            CTC_BASE_URL: config.CTCCredentials?.CTC_BASE_URL || "",
            CLINumber: config.CTCCredentials?.CLINumber || "",
            CTC_RECORDING_FLAG: config.CTCCredentials?.CTC_RECORDING_FLAG || 0,
            CTC_DTMF_FLAG: config.CTCCredentials?.CTC_DTMF_FLAG || 0,
            CTC_PINGBACK_URL: config.CTCCredentials?.CTC_PINGBACK_URL || "",
            CTC_PINGBACK_SECRET:
              config.CTCCredentials?.CTC_PINGBACK_SECRET || "",
          },
          id: config._id || "",
        });
      }
    } catch (error) {
      console.error("Error fetching Configuration:", error);
      toast.error("Failed to fetch configuration");
    }
  };

  const formik = useFormik({
    initialValues: {
      leadFacebookToken: "",
      leadFacebookPageId: "",
      cloudinary: {
        cloudName: "",
        apiKey: "",
        apiSecret: "",
      },
      nodemailer: {
        email: "",
        password: "",
      },
      gmail: {
        topLogo: "",
        bottomLogo: "",
      },
      invoiceLogo: "",
      voiceAIDetails: {
        OMNIDIM_API_KEY: "",
        OMNIDIM_DEFAULT_PHONE_NUMBER_ID: "",
        OMNIDIM_BASE_URL: "",
      },
      uniCommissionInvoice: {
        name: "",
        address: "",
        taxRegistrationNo: "",
        phoneNo: "",
        bankDetails: {
          accountOwnerName: "",
          accountOwnerAddress: "",
          bankName: "",
          accountNumber: "",
          SWIFTCode: "",
          IBAN: "",
        },
      },
      b2bInvoice: {
        name: "",
        address: "",
      },
      applicationFeeInvoice: {
        name: "",
        application: "",
        address: "",
        phoneNo: "",
        notes: "",
        bankDetails: {
          bankName: "",
          accountName: "",
          accountNumber: "",
          bankAddress: "",
          IFSCCode: "",
          SwiftCode: "",
        },
      },
      CTCCredentials: {
        CTC_USERNAME: "",
        CTC_PASSWORD: "",
        CTC_BASE_URL: "",
        CLINumber: "",
        CTC_RECORDING_FLAG: 0,
        CTC_DTMF_FLAG: 0,
        CTC_PINGBACK_URL: "",
        CTC_PINGBACK_SECRET: "",
      },
      id: "",
    },
    validationSchema: Yup.object({
      leadFacebookToken: Yup.string().required(
        "Lead Facebook Token is required"
      ),
      leadFacebookPageId: Yup.string().required(
        "Lead Facebook Page Id is required"
      ),
      cloudinary: Yup.object({
        cloudName: Yup.string(),
        apiKey: Yup.string(),
        apiSecret: Yup.string(),
      }),
      nodemailer: Yup.object({
        email: Yup.string()
          .email("Invalid email address")
          .required("Nodemailer Email is required"),
        password: Yup.string().required("Nodemailer Password is required"),
      }),
      gmail: Yup.object({
        topLogo: Yup.mixed().required("Gmail Top Logo is required"),
        bottomLogo: Yup.mixed().required("Gmail Bottom Logo is required"),
      }),
      invoiceLogo: Yup.mixed().required("Invoice Logo is required"),
      voiceAIDetails: Yup.object({
        OMNIDIM_API_KEY: Yup.string(),
        OMNIDIM_DEFAULT_PHONE_NUMBER_ID: Yup.string(),
        OMNIDIM_BASE_URL: Yup.string(),
      }),
      uniCommissionInvoice: Yup.object({
        name: Yup.string().required("Name is required"),
        address: Yup.string().required("Address is required"),
        taxRegistrationNo: Yup.string().required(
          "Tax Registration Number is required"
        ),
        phoneNo: Yup.string().required("Phone Number is required"),
        bankDetails: Yup.object({
          accountOwnerName: Yup.string().required(
            "Account Owner Name is required"
          ),
          accountOwnerAddress: Yup.string().required(
            "Account Owner Address is required"
          ),
          bankName: Yup.string().required("Bank Name is required"),
          accountNumber: Yup.string().required("Account Number is required"),
          SWIFTCode: Yup.string().required("SWIFT Code is required"),
          IBAN: Yup.string().required("IBAN is required"),
        }),
      }),
      b2bInvoice: Yup.object({
        name: Yup.string().required("B2B Invoice Name is required"),
        address: Yup.string().required("B2B Invoice Address is required"),
      }),
      applicationFeeInvoice: Yup.object({
        name: Yup.string().required("Application Fee Invoice Name is required"),
        application: Yup.string().required("Application is required"),
        address: Yup.string().required(
          "Application Fee Invoice Address is required"
        ),
        phoneNo: Yup.string().required("Phone Number is required"),
        notes: Yup.string().required("Notes is required"),
        bankDetails: Yup.object({
          bankName: Yup.string().required("Bank Name is required"),
          accountName: Yup.string().required("Account Name is required"),
          accountNumber: Yup.string().required("Account Number is required"),
          bankAddress: Yup.string().required("Bank Address is required"),
          IFSCCode: Yup.string().required("IFSC Code is required"),
          SwiftCode: Yup.string().required("Swift Code is required"),
        }),
      }),
      CTCCredentials: Yup.object({
        CTC_USERNAME: Yup.string().required("CTC Username is required"),
        CTC_PASSWORD: Yup.string().required("CTC Password is required"),
        CTC_BASE_URL: Yup.string().required("CTC Base URL is required"),
        CLINumber: Yup.string().required("CLI Number is required"),
        CTC_RECORDING_FLAG: Yup.number()
          .oneOf([0, 1], "Only 0 or 1 allowed")
          .required("CTC Recording Flag is required"),

        CTC_DTMF_FLAG: Yup.number()
          .oneOf([0, 1], "Only 0 or 1 allowed")
          .required("CTC DTMF Flag is required"),

        CTC_PINGBACK_URL: Yup.string().required("CTC Pingback URL is required"),
        CTC_PINGBACK_SECRET: Yup.string().required(
          "CTC Pingback Secret is required"
        ),
      }),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        toast.dismiss();
        const formData = new FormData();
        formData.append("leadFacebookToken", values.leadFacebookToken);
        formData.append("leadFacebookPageId", values.leadFacebookPageId);
        formData.append("cloudinary[cloudName]", values.cloudinary.cloudName);
        formData.append("cloudinary[apiKey]", values.cloudinary.apiKey);
        formData.append("cloudinary[apiSecret]", values.cloudinary.apiSecret);
        formData.append("nodemailer[email]", values.nodemailer.email);
        formData.append("nodemailer[password]", values.nodemailer.password);
        formData.append("gmailTopLogo", values.gmail.topLogo);
        formData.append("gmailBottomLogo", values.gmail.bottomLogo);
        formData.append("invoiceLogo", values.invoiceLogo);
        formData.append(
          "voiceAIDetails[OMNIDIM_API_KEY]",
          values.voiceAIDetails.OMNIDIM_API_KEY
        );
        formData.append(
          "voiceAIDetails[OMNIDIM_DEFAULT_PHONE_NUMBER_ID]",
          values.voiceAIDetails.OMNIDIM_DEFAULT_PHONE_NUMBER_ID
        );
        formData.append(
          "voiceAIDetails[OMNIDIM_BASE_URL]",
          values.voiceAIDetails.OMNIDIM_BASE_URL
        );
        formData.append(
          "uniCommissionInvoice[name]",
          values.uniCommissionInvoice.name
        );
        formData.append(
          "uniCommissionInvoice[address]",
          values.uniCommissionInvoice.address
        );
        formData.append(
          "uniCommissionInvoice[taxRegistrationNo]",
          values.uniCommissionInvoice.taxRegistrationNo
        );
        formData.append(
          "uniCommissionInvoice[phoneNo]",
          values.uniCommissionInvoice.phoneNo
        );
        formData.append(
          "uniCommissionInvoice[bankDetails][accountOwnerName]",
          values.uniCommissionInvoice.bankDetails.accountOwnerName
        );
        formData.append(
          "uniCommissionInvoice[bankDetails][accountOwnerAddress]",
          values.uniCommissionInvoice.bankDetails.accountOwnerAddress
        );
        formData.append(
          "uniCommissionInvoice[bankDetails][bankName]",
          values.uniCommissionInvoice.bankDetails.bankName
        );
        formData.append(
          "uniCommissionInvoice[bankDetails][accountNumber]",
          values.uniCommissionInvoice.bankDetails.accountNumber
        );
        formData.append(
          "uniCommissionInvoice[bankDetails][SWIFTCode]",
          values.uniCommissionInvoice.bankDetails.SWIFTCode
        );
        formData.append(
          "uniCommissionInvoice[bankDetails][IBAN]",
          values.uniCommissionInvoice.bankDetails.IBAN
        );
        formData.append("b2bInvoice.name", values.b2bInvoice.name);
        formData.append("b2bInvoice.address", values.b2bInvoice.address);
        formData.append(
          "applicationFeeInvoice[name]",
          values.applicationFeeInvoice.name
        );
        formData.append(
          "applicationFeeInvoice[application]",
          values.applicationFeeInvoice.application
        );
        formData.append(
          "applicationFeeInvoice[address]",
          values.applicationFeeInvoice.address
        );
        formData.append(
          "applicationFeeInvoice[phoneNo]",
          values.applicationFeeInvoice.phoneNo
        );
        formData.append(
          "applicationFeeInvoice[notes]",
          values.applicationFeeInvoice.notes
        );
        formData.append(
          "applicationFeeInvoice[bankDetails][bankName]",
          values.applicationFeeInvoice.bankDetails.bankName
        );
        formData.append(
          "applicationFeeInvoice[bankDetails][accountName]",
          values.applicationFeeInvoice.bankDetails.accountName
        );
        formData.append(
          "applicationFeeInvoice[bankDetails][accountNumber]",
          values.applicationFeeInvoice.bankDetails.accountNumber
        );
        formData.append(
          "applicationFeeInvoice[bankDetails][bankAddress]",
          values.applicationFeeInvoice.bankDetails.bankAddress
        );
        formData.append(
          "applicationFeeInvoice[bankDetails][IFSCCode]",
          values.applicationFeeInvoice.bankDetails.IFSCCode
        );
        formData.append(
          "applicationFeeInvoice[bankDetails][SwiftCode]",
          values.applicationFeeInvoice.bankDetails.SwiftCode
        );
        formData.append(
          "CTCCredentials[CTC_USERNAME]",
          values.CTCCredentials.CTC_USERNAME
        );
        formData.append(
          "CTCCredentials[CTC_PASSWORD]",
          values.CTCCredentials.CTC_PASSWORD
        );
        formData.append(
          "CTCCredentials[CTC_BASE_URL]",
          values.CTCCredentials.CTC_BASE_URL
        );
        formData.append(
          "CTCCredentials[CLINumber]",
          values.CTCCredentials.CLINumber
        );
        formData.append(
          "CTCCredentials[CTC_RECORDING_FLAG]",
          Number(values.CTCCredentials.CTC_RECORDING_FLAG)
        );

        formData.append(
          "CTCCredentials[CTC_DTMF_FLAG]",
          Number(values.CTCCredentials.CTC_DTMF_FLAG)
        );

        formData.append(
          "CTCCredentials[CTC_PINGBACK_URL]",
          values.CTCCredentials.CTC_PINGBACK_URL
        );
        formData.append(
          "CTCCredentials[CTC_PINGBACK_SECRET]",
          values.CTCCredentials.CTC_PINGBACK_SECRET
        );

        if (values.id && canUpdate) {
          const res = await dispatch(updateConfiguration(formData, values.id));
          if (res?.data?.code === 200) {
            toast.success("Configuration updated successfully");
          }
        } else if (canCreate) {
          const res = await dispatch(createConfiguration(formData));
          if (res?.data?.code === 201) {
            toast.success("Configuration added successfully");
          }
        }
        if (canRead) {
          fetchConfigurations();
        }
      } catch (error) {
        toast.dismiss();
        console.error("Error submitting form:", error);
        toast.error(
          error?.response?.data?.message || "Failed to submit configuration"
        );
      }
    },
  });
  console.log("formik.errors:", formik.errors);
  return (
    <Row className="mt-5 row-sm">
      <Col md={12} lg={12} xl={12}>
        <Card className="custom-card transcation-crypto">
          <Card.Header className="border-bottom-0">
            <div className="card-title">Configuration</div>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={formik.handleSubmit}>
              <Row className="mb-3 mt-0">
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    Lead Facebook Token
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="leadFacebookToken"
                    className="custom-select-height"
                    value={formik.values.leadFacebookToken}
                    onChange={formik.handleChange}
                    placeholder="Enter Lead Facebook Token"
                  />
                  {formik.touched.leadFacebookToken &&
                    formik.errors.leadFacebookToken && (
                      <div className="text-danger">
                        {formik.errors.leadFacebookToken}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    Lead Facebook Page Id
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="leadFacebookPageId"
                    className="custom-select-height"
                    value={formik.values.leadFacebookPageId}
                    onChange={formik.handleChange}
                    placeholder="Enter Lead Facebook Page Id"
                  />
                  {formik.touched.leadFacebookPageId &&
                    formik.errors.leadFacebookPageId && (
                      <div className="text-danger">
                        {formik.errors.leadFacebookPageId}
                      </div>
                    )}
                </Col>
                {/* <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    Cloudinary Cloud Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="cloudinary.cloudName"
                    className="custom-select-height"
                    value={formik.values.cloudinary.cloudName}
                    onChange={formik.handleChange}
                    placeholder="Cloud Name"
                  />
                  {formik.touched.cloudinary?.cloudName &&
                    formik.errors.cloudinary?.cloudName && (
                      <div className="text-danger">
                        {formik.errors.cloudinary.cloudName}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    Cloudinary API Key
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="cloudinary.apiKey"
                    className="custom-select-height"
                    value={formik.values.cloudinary.apiKey}
                    onChange={formik.handleChange}
                    placeholder="API Key"
                  />
                  {formik.touched.cloudinary?.apiKey &&
                    formik.errors.cloudinary?.apiKey && (
                      <div className="text-danger">
                        {formik.errors.cloudinary.apiKey}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    Cloudinary API Secret
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="cloudinary.apiSecret"
                    className="custom-select-height"
                    value={formik.values.cloudinary.apiSecret}
                    onChange={formik.handleChange}
                    placeholder="API Secret"
                  />
                  {formik.touched.cloudinary?.apiSecret &&
                    formik.errors.cloudinary?.apiSecret && (
                      <div className="text-danger">
                        {formik.errors.cloudinary.apiSecret}
                      </div>
                    )}
                </Col> */}
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    Nodemailer Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="nodemailer.email"
                    className="custom-select-height"
                    value={formik.values.nodemailer.email}
                    onChange={formik.handleChange}
                    placeholder="Enter Email"
                  />
                  {formik.touched.nodemailer?.email &&
                    formik.errors.nodemailer?.email && (
                      <div className="text-danger">
                        {formik.errors.nodemailer.email}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    Nodemailer Password
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showCredential ? "text" : "password"}
                      name="nodemailer.password"
                      className="custom-select-height"
                      value={formik.values.nodemailer.password}
                      onChange={formik.handleChange}
                      placeholder="Enter Password"
                    />
                    <span
                      onClick={() => setShowCredential(!showCredential)}
                      className="position-absolute top-50 end-0 translate-middle-y pe-3"
                      style={{ cursor: "pointer" }}
                    >
                      {showCredential ? (
                        <VisibilityOff sx={{ fontSize: 18 }} />
                      ) : (
                        <Visibility sx={{ fontSize: 18 }} />
                      )}
                    </span>
                  </div>
                  {formik.touched.nodemailer?.password &&
                    formik.errors.nodemailer?.password && (
                      <div className="text-danger">
                        {formik.errors.nodemailer.password}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    Gmail Top Logo
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="gmail.topLogo"
                    className="custom-select-height"
                    onChange={(event) =>
                      formik.setFieldValue(
                        "gmail.topLogo",
                        event.currentTarget.files[0]
                      )
                    }
                    accept="image/*"
                  />

                  {/* Show from backend */}
                  {typeof formik.values.gmail.topLogo === "string" &&
                    formik.values.gmail.topLogo && (
                      <img
                        src={`${BASEURL}/${formik.values.gmail.topLogo}`}
                        alt="Top Logo"
                        style={{ width: "100px", marginTop: "10px" }}
                      />
                    )}

                  {/* Show newly uploaded preview */}
                  {formik.values.gmail.topLogo instanceof File && (
                    <img
                      src={URL.createObjectURL(formik.values.gmail.topLogo)}
                      alt="Top Logo Preview"
                      style={{ width: "100px", marginTop: "10px" }}
                    />
                  )}

                  {formik.touched.gmail?.topLogo &&
                    formik.errors.gmail?.topLogo && (
                      <div className="text-danger">
                        {formik.errors.gmail.topLogo}
                      </div>
                    )}
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    Gmail Bottom Logo
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="gmail.bottomLogo"
                    className="custom-select-height"
                    onChange={(event) =>
                      formik.setFieldValue(
                        "gmail.bottomLogo",
                        event.currentTarget.files[0]
                      )
                    }
                    accept="image/*"
                  />

                  {/* Show from backend */}
                  {typeof formik.values.gmail.bottomLogo === "string" &&
                    formik.values.gmail.bottomLogo && (
                      <img
                        src={`${BASEURL}/${formik.values.gmail.bottomLogo}`}
                        alt="Bottom Logo"
                        style={{ width: "100px", marginTop: "10px" }}
                      />
                    )}

                  {/* Show newly uploaded preview */}
                  {formik.values.gmail.bottomLogo instanceof File && (
                    <img
                      src={URL.createObjectURL(formik.values.gmail.bottomLogo)}
                      alt="Bottom Logo Preview"
                      style={{ width: "100px", marginTop: "10px" }}
                    />
                  )}

                  {formik.touched.gmail?.bottomLogo &&
                    formik.errors.gmail?.bottomLogo && (
                      <div className="text-danger">
                        {formik.errors.gmail.bottomLogo}
                      </div>
                    )}
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">Invoice Logo</Form.Label>
                  <Form.Control
                    type="file"
                    name="invoiceLogo"
                    className="custom-select-height"
                    onChange={(event) =>
                      formik.setFieldValue(
                        "invoiceLogo",
                        event.currentTarget.files[0]
                      )
                    }
                    accept="image/*"
                  />

                  {/* Show from backend */}
                  {typeof formik.values.invoiceLogo === "string" &&
                    formik.values.invoiceLogo && (
                      <img
                        src={`${BASEURL}/${formik.values.invoiceLogo}`}
                        alt="Invoice Logo"
                        style={{ width: "100px", marginTop: "10px" }}
                      />
                    )}

                  {/* Show newly uploaded preview */}
                  {formik.values.invoiceLogo instanceof File && (
                    <img
                      src={URL.createObjectURL(formik.values.invoiceLogo)}
                      alt="Invoice Logo Preview"
                      style={{ width: "100px", marginTop: "10px" }}
                    />
                  )}

                  {formik.touched.invoiceLogo && formik.errors.invoiceLogo && (
                    <div className="text-danger">
                      {formik.errors.invoiceLogo}
                    </div>
                  )}
                </Col>

                <hr className="my-4" />

                {/* <Col md={12} className="mb-3">
                  <h5>Voice AI Details</h5>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    Omnidim Api Key
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="voiceAIDetails.OMNIDIM_API_KEY"
                    className="custom-select-height"
                    value={formik.values.voiceAIDetails.OMNIDIM_API_KEY}
                    onChange={formik.handleChange}
                    placeholder="Enter Omnidim Api Key"
                  />
                  {formik.touched.voiceAIDetails?.OMNIDIM_API_KEY &&
                    formik.errors.voiceAIDetails?.OMNIDIM_API_KEY && (
                      <div className="text-danger">
                        {formik.errors.voiceAIDetails.OMNIDIM_API_KEY}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    Omnidim Phone Number Id
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="voiceAIDetails.OMNIDIM_DEFAULT_PHONE_NUMBER_ID"
                    className="custom-select-height"
                    value={
                      formik.values.voiceAIDetails
                        .OMNIDIM_DEFAULT_PHONE_NUMBER_ID
                    }
                    onChange={formik.handleChange}
                    placeholder="Enter Omnidim Phone Number Id"
                  />
                  {formik.touched.voiceAIDetails
                    ?.OMNIDIM_DEFAULT_PHONE_NUMBER_ID &&
                    formik.errors.voiceAIDetails
                      ?.OMNIDIM_DEFAULT_PHONE_NUMBER_ID && (
                      <div className="text-danger">
                        {
                          formik.errors.voiceAIDetails
                            .OMNIDIM_DEFAULT_PHONE_NUMBER_ID
                        }
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    Omnidim Base Url
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="voiceAIDetails.OMNIDIM_BASE_URL"
                    className="custom-select-height"
                    value={formik.values.voiceAIDetails.OMNIDIM_BASE_URL}
                    onChange={formik.handleChange}
                    placeholder="Enter Omnidim Base Url"
                  />
                  {formik.touched.voiceAIDetails?.OMNIDIM_BASE_URL &&
                    formik.errors.voiceAIDetails?.OMNIDIM_BASE_URL && (
                      <div className="text-danger">
                        {formik.errors.voiceAIDetails.OMNIDIM_BASE_URL}
                      </div>
                    )}
                </Col> */}

                <hr className="my-4" />
                <Col md={12} className="mb-3">
                  <h5>CTC Credentials</h5>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">CTC Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="CTCCredentials.CTC_USERNAME"
                    className="custom-select-height"
                    value={formik.values.CTCCredentials?.CTC_USERNAME}
                    onChange={formik.handleChange}
                    placeholder="Enter CTC Username"
                  />
                  {formik.touched.CTCCredentials?.CTC_USERNAME &&
                    formik.errors.CTCCredentials?.CTC_USERNAME && (
                      <div className="text-danger">
                        {formik.errors.CTCCredentials?.CTC_USERNAME}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">CTC Password</Form.Label>
                  <Form.Control
                    type="text"
                    name="CTCCredentials.CTC_PASSWORD"
                    className="custom-select-height"
                    value={formik.values.CTCCredentials?.CTC_PASSWORD}
                    onChange={formik.handleChange}
                    placeholder="Enter CTC Password"
                  />
                  {formik.touched.CTCCredentials?.CTC_PASSWORD &&
                    formik.errors.CTCCredentials?.CTC_PASSWORD && (
                      <div className="text-danger">
                        {formik.errors.CTCCredentials?.CTC_PASSWORD}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">CTC Base Url</Form.Label>
                  <Form.Control
                    type="text"
                    name="CTCCredentials.CTC_BASE_URL"
                    className="custom-select-height"
                    value={formik.values.CTCCredentials?.CTC_BASE_URL}
                    onChange={formik.handleChange}
                    placeholder="Enter CTC Base Url"
                  />
                  {formik.touched.CTCCredentials?.CTC_BASE_URL &&
                    formik.errors.CTCCredentials?.CTC_BASE_URL && (
                      <div className="text-danger">
                        {formik.errors.CTCCredentials?.CTC_BASE_URL}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">CTC Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="CTCCredentials.CLINumber"
                    className="custom-select-height"
                    value={formik.values.CTCCredentials?.CLINumber}
                    onChange={formik.handleChange}
                    placeholder="Enter CTC Number"
                  />
                  {formik.touched.CTCCredentials?.CLINumber &&
                    formik.errors.CTCCredentials?.CLINumber && (
                      <div className="text-danger">
                        {formik.errors.CTCCredentials?.CLINumber}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    CTC Recording Flag
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="CTCCredentials.CTC_RECORDING_FLAG"
                    className="custom-select-height"
                    value={formik.values.CTCCredentials?.CTC_RECORDING_FLAG}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "CTCCredentials.CTC_RECORDING_FLAG",
                        Number(e.target.value)
                      )
                    }
                    placeholder="Enter CTC Recording Flag"
                  />
                  {formik.touched.CTCCredentials?.CTC_RECORDING_FLAG &&
                    formik.errors.CTCCredentials?.CTC_RECORDING_FLAG && (
                      <div className="text-danger">
                        {formik.errors.CTCCredentials?.CTC_RECORDING_FLAG}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">CTC DTMF Flag</Form.Label>
                  <Form.Control
                    type="number"
                    name="CTCCredentials.CTC_DTMF_FLAG"
                    className="custom-select-height"
                    value={formik.values.CTCCredentials?.CTC_DTMF_FLAG}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "CTCCredentials.CTC_DTMF_FLAG",
                        Number(e.target.value)
                      )
                    }
                    placeholder="Enter CTC DTMF Flag"
                  />
                  {formik.touched.CTCCredentials?.CTC_DTMF_FLAG &&
                    formik.errors.CTCCredentials?.CTC_DTMF_FLAG && (
                      <div className="text-danger">
                        {formik.errors.CTCCredentials?.CTC_DTMF_FLAG}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    CTC PINGBACK URL
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="CTCCredentials.CTC_PINGBACK_URL"
                    className="custom-select-height"
                    value={formik.values.CTCCredentials?.CTC_PINGBACK_URL}
                    onChange={formik.handleChange}
                    placeholder="Enter CTC Pingback Url"
                  />
                  {formik.touched.CTCCredentials?.CTC_PINGBACK_URL &&
                    formik.errors.CTCCredentials?.CTC_PINGBACK_URL && (
                      <div className="text-danger">
                        {formik.errors.CTCCredentials?.CTC_PINGBACK_URL}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    CTC PINGBACK SECRET
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="CTCCredentials.CTC_PINGBACK_SECRET"
                    className="custom-select-height"
                    value={formik.values.CTCCredentials?.CTC_PINGBACK_SECRET}
                    onChange={formik.handleChange}
                    placeholder="Enter CTC Pingback Secret"
                  />
                  {formik.touched.CTCCredentials?.CTC_PINGBACK_SECRET &&
                    formik.errors.CTCCredentials?.CTC_PINGBACK_SECRET && (
                      <div className="text-danger">
                        {formik.errors.CTCCredentials?.CTC_PINGBACK_SECRET}
                      </div>
                    )}
                </Col>

                <hr className="my-4" />

                <Col md={12} className="mb-3">
                  <h5>University Commission Invoice Details</h5>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="uniCommissionInvoice.name"
                    className="custom-select-height"
                    value={formik.values.uniCommissionInvoice.name}
                    onChange={formik.handleChange}
                    placeholder="Enter Name"
                  />
                  {formik.touched.uniCommissionInvoice?.name &&
                    formik.errors.uniCommissionInvoice?.name && (
                      <div className="text-danger">
                        {formik.errors.uniCommissionInvoice.name}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="uniCommissionInvoice.address"
                    className="custom-select-height"
                    value={formik.values.uniCommissionInvoice.address}
                    onChange={formik.handleChange}
                    placeholder="Enter Address"
                  />
                  {formik.touched.uniCommissionInvoice?.address &&
                    formik.errors.uniCommissionInvoice?.address && (
                      <div className="text-danger">
                        {formik.errors.uniCommissionInvoice.address}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    Tax Registration No
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="uniCommissionInvoice.taxRegistrationNo"
                    className="custom-select-height"
                    value={formik.values.uniCommissionInvoice.taxRegistrationNo}
                    onChange={formik.handleChange}
                    placeholder="Enter Tax Registration No"
                  />
                  {formik.touched.uniCommissionInvoice?.taxRegistrationNo &&
                    formik.errors.uniCommissionInvoice?.taxRegistrationNo && (
                      <div className="text-danger">
                        {formik.errors.uniCommissionInvoice.taxRegistrationNo}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">Phone No</Form.Label>
                  <Form.Control
                    type="text"
                    name="uniCommissionInvoice.phoneNo"
                    className="custom-select-height"
                    value={formik.values.uniCommissionInvoice.phoneNo}
                    onChange={formik.handleChange}
                    placeholder="Enter Phone No"
                  />
                  {formik.touched.uniCommissionInvoice?.phoneNo &&
                    formik.errors.uniCommissionInvoice?.phoneNo && (
                      <div className="text-danger">
                        {formik.errors.uniCommissionInvoice.phoneNo}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    Account Owner Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="uniCommissionInvoice.bankDetails.accountOwnerName"
                    className="custom-select-height"
                    value={
                      formik.values.uniCommissionInvoice.bankDetails
                        .accountOwnerName
                    }
                    onChange={formik.handleChange}
                    placeholder="Enter Account Owner Name"
                  />
                  {formik.touched.uniCommissionInvoice?.bankDetails
                    ?.accountOwnerName &&
                    formik.errors.uniCommissionInvoice?.bankDetails
                      ?.accountOwnerName && (
                      <div className="text-danger">
                        {
                          formik.errors.uniCommissionInvoice.bankDetails
                            .accountOwnerName
                        }
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    Account Owner Address
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="uniCommissionInvoice.bankDetails.accountOwnerAddress"
                    className="custom-select-height"
                    value={
                      formik.values.uniCommissionInvoice.bankDetails
                        .accountOwnerAddress
                    }
                    onChange={formik.handleChange}
                    placeholder="Enter Account Owner Address"
                  />
                  {formik.touched.uniCommissionInvoice?.bankDetails
                    ?.accountOwnerAddress &&
                    formik.errors.uniCommissionInvoice?.bankDetails
                      ?.accountOwnerAddress && (
                      <div className="text-danger">
                        {
                          formik.errors.uniCommissionInvoice.bankDetails
                            .accountOwnerAddress
                        }
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">Bank Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="uniCommissionInvoice.bankDetails.bankName"
                    className="custom-select-height"
                    value={
                      formik.values.uniCommissionInvoice.bankDetails.bankName
                    }
                    onChange={formik.handleChange}
                    placeholder="Enter Bank Name"
                  />
                  {formik.touched.uniCommissionInvoice?.bankDetails?.bankName &&
                    formik.errors.uniCommissionInvoice?.bankDetails
                      ?.bankName && (
                      <div className="text-danger">
                        {
                          formik.errors.uniCommissionInvoice.bankDetails
                            .bankName
                        }
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    Account Number
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="uniCommissionInvoice.bankDetails.accountNumber"
                    className="custom-select-height"
                    value={
                      formik.values.uniCommissionInvoice.bankDetails
                        .accountNumber
                    }
                    onChange={formik.handleChange}
                    placeholder="Enter Account Number"
                  />
                  {formik.touched.uniCommissionInvoice?.bankDetails
                    ?.accountNumber &&
                    formik.errors.uniCommissionInvoice?.bankDetails
                      ?.accountNumber && (
                      <div className="text-danger">
                        {
                          formik.errors.uniCommissionInvoice.bankDetails
                            .accountNumber
                        }
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">SWIFT Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="uniCommissionInvoice.bankDetails.SWIFTCode"
                    className="custom-select-height"
                    value={
                      formik.values.uniCommissionInvoice.bankDetails.SWIFTCode
                    }
                    onChange={formik.handleChange}
                    placeholder="Enter SWIFT Code"
                  />
                  {formik.touched.uniCommissionInvoice?.bankDetails
                    ?.SWIFTCode &&
                    formik.errors.uniCommissionInvoice?.bankDetails
                      ?.SWIFTCode && (
                      <div className="text-danger">
                        {
                          formik.errors.uniCommissionInvoice.bankDetails
                            .SWIFTCode
                        }
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">IBAN</Form.Label>
                  <Form.Control
                    type="text"
                    name="uniCommissionInvoice.bankDetails.IBAN"
                    className="custom-select-height"
                    value={formik.values.uniCommissionInvoice.bankDetails.IBAN}
                    onChange={formik.handleChange}
                    placeholder="Enter IBAN"
                  />
                  {formik.touched.uniCommissionInvoice?.bankDetails?.IBAN &&
                    formik.errors.uniCommissionInvoice?.bankDetails?.IBAN && (
                      <div className="text-danger">
                        {formik.errors.uniCommissionInvoice.bankDetails.IBAN}
                      </div>
                    )}
                </Col>

                <hr className="my-4" />

                <Col md={12} className="mb-3">
                  <h5>B2B Invoice Details</h5>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    B2B Invoice Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="b2bInvoice.name"
                    className="custom-select-height"
                    value={formik.values.b2bInvoice.name}
                    onChange={formik.handleChange}
                    placeholder="Enter B2B Invoice Name"
                  />
                  {formik.touched.b2bInvoice?.name &&
                    formik.errors.b2bInvoice?.name && (
                      <div className="text-danger">
                        {formik.errors.b2bInvoice.name}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    B2B Invoice Address
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="b2bInvoice.address"
                    className="custom-select-height"
                    value={formik.values.b2bInvoice.address}
                    onChange={formik.handleChange}
                    placeholder="Enter B2B Invoice Address"
                  />
                  {formik.touched.b2bInvoice?.address &&
                    formik.errors.b2bInvoice?.address && (
                      <div className="text-danger">
                        {formik.errors.b2bInvoice.address}
                      </div>
                    )}
                </Col>

                <hr className="my-4" />

                <Col md={12} className="mb-3">
                  <h5>Application Fee Invoice Details</h5>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="applicationFeeInvoice.name"
                    className="custom-select-height"
                    value={formik.values.applicationFeeInvoice.name}
                    onChange={formik.handleChange}
                    placeholder="Enter Name"
                  />
                  {formik.touched.applicationFeeInvoice?.name &&
                    formik.errors.applicationFeeInvoice?.name && (
                      <div className="text-danger">
                        {formik.errors.applicationFeeInvoice.name}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">Application</Form.Label>
                  <Form.Control
                    type="text"
                    name="applicationFeeInvoice.application"
                    className="custom-select-height"
                    value={formik.values.applicationFeeInvoice.application}
                    onChange={formik.handleChange}
                    placeholder="Enter Application"
                  />
                  {formik.touched.applicationFeeInvoice?.application &&
                    formik.errors.applicationFeeInvoice?.application && (
                      <div className="text-danger">
                        {formik.errors.applicationFeeInvoice.application}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="applicationFeeInvoice.address"
                    className="custom-select-height"
                    value={formik.values.applicationFeeInvoice.address}
                    onChange={formik.handleChange}
                    placeholder="Enter Address"
                  />
                  {formik.touched.applicationFeeInvoice?.address &&
                    formik.errors.applicationFeeInvoice?.address && (
                      <div className="text-danger">
                        {formik.errors.applicationFeeInvoice.address}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">Phone No</Form.Label>
                  <Form.Control
                    type="text"
                    name="applicationFeeInvoice.phoneNo"
                    className="custom-select-height"
                    value={formik.values.applicationFeeInvoice.phoneNo}
                    onChange={formik.handleChange}
                    placeholder="Enter Phone No"
                  />
                  {formik.touched.applicationFeeInvoice?.phoneNo &&
                    formik.errors.applicationFeeInvoice?.phoneNo && (
                      <div className="text-danger">
                        {formik.errors.applicationFeeInvoice.phoneNo}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">Notes</Form.Label>
                  <Form.Control
                    type="text"
                    name="applicationFeeInvoice.notes"
                    className="custom-select-height"
                    value={formik.values.applicationFeeInvoice.notes}
                    onChange={formik.handleChange}
                    placeholder="Enter Notes"
                  />
                  {formik.touched.applicationFeeInvoice?.notes &&
                    formik.errors.applicationFeeInvoice?.notes && (
                      <div className="text-danger">
                        {formik.errors.applicationFeeInvoice.notes}
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">Bank Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="applicationFeeInvoice.bankDetails.bankName"
                    className="custom-select-height"
                    value={
                      formik.values.applicationFeeInvoice.bankDetails.bankName
                    }
                    onChange={formik.handleChange}
                    placeholder="Enter Bank Name"
                  />
                  {formik.touched.applicationFeeInvoice?.bankDetails
                    ?.bankName &&
                    formik.errors.applicationFeeInvoice?.bankDetails
                      ?.bankName && (
                      <div className="text-danger">
                        {
                          formik.errors.applicationFeeInvoice.bankDetails
                            .bankName
                        }
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">Account Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="applicationFeeInvoice.bankDetails.accountName"
                    className="custom-select-height"
                    value={
                      formik.values.applicationFeeInvoice.bankDetails
                        .accountName
                    }
                    onChange={formik.handleChange}
                    placeholder="Enter Account Name"
                  />
                  {formik.touched.applicationFeeInvoice?.bankDetails
                    ?.accountName &&
                    formik.errors.applicationFeeInvoice?.bankDetails
                      ?.accountName && (
                      <div className="text-danger">
                        {
                          formik.errors.applicationFeeInvoice.bankDetails
                            .accountName
                        }
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    Account Number
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="applicationFeeInvoice.bankDetails.accountNumber"
                    className="custom-select-height"
                    value={
                      formik.values.applicationFeeInvoice.bankDetails
                        .accountNumber
                    }
                    onChange={formik.handleChange}
                    placeholder="Enter Account Number"
                  />
                  {formik.touched.applicationFeeInvoice?.bankDetails
                    ?.accountNumber &&
                    formik.errors.applicationFeeInvoice?.bankDetails
                      ?.accountNumber && (
                      <div className="text-danger">
                        {
                          formik.errors.applicationFeeInvoice.bankDetails
                            .accountNumber
                        }
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">Bank Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="applicationFeeInvoice.bankDetails.bankAddress"
                    className="custom-select-height"
                    value={
                      formik.values.applicationFeeInvoice.bankDetails
                        .bankAddress
                    }
                    onChange={formik.handleChange}
                    placeholder="Enter Bank Address"
                  />
                  {formik.touched.applicationFeeInvoice?.bankDetails
                    ?.bankAddress &&
                    formik.errors.applicationFeeInvoice?.bankDetails
                      ?.bankAddress && (
                      <div className="text-danger">
                        {
                          formik.errors.applicationFeeInvoice.bankDetails
                            .bankAddress
                        }
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">IFSC Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="applicationFeeInvoice.bankDetails.IFSCCode"
                    className="custom-select-height"
                    value={
                      formik.values.applicationFeeInvoice.bankDetails.IFSCCode
                    }
                    onChange={formik.handleChange}
                    placeholder="Enter IFSC Code"
                  />
                  {formik.touched.applicationFeeInvoice?.bankDetails
                    ?.IFSCCode &&
                    formik.errors.applicationFeeInvoice?.bankDetails
                      ?.IFSCCode && (
                      <div className="text-danger">
                        {
                          formik.errors.applicationFeeInvoice.bankDetails
                            .IFSCCode
                        }
                      </div>
                    )}
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">Swift Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="applicationFeeInvoice.bankDetails.SwiftCode"
                    className="custom-select-height"
                    value={
                      formik.values.applicationFeeInvoice.bankDetails.SwiftCode
                    }
                    onChange={formik.handleChange}
                    placeholder="Enter Swift Code"
                  />
                  {formik.touched.applicationFeeInvoice?.bankDetails
                    ?.SwiftCode &&
                    formik.errors.applicationFeeInvoice?.bankDetails
                      ?.SwiftCode && (
                      <div className="text-danger">
                        {
                          formik.errors.applicationFeeInvoice.bankDetails
                            .SwiftCode
                        }
                      </div>
                    )}
                </Col>
              </Row>
              {canCreate && (
                <div className="text-end">
                  <Button
                    variant="primary"
                    className="custom-select-height"
                    type="submit"
                  >
                    Submit
                  </Button>
                </div>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Configuration;
