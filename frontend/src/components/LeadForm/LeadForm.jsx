import { useDispatch } from "react-redux";
import logo from "../../assets/images/LeadForm-logo/LeadForm01.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addLead } from "../../redux/actions/Lead.action";
import { toast } from "react-toastify";
import { Button, Form } from "react-bootstrap";
import "react-phone-input-2/lib/bootstrap.css";
import PhoneInput from "react-phone-input-2";
import { countryCodeISO } from "../../utils/countryISOCode";

const LeadForm = () => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      city: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phone: Yup.string().required("Phone number is required"),
      city: Yup.string().required("City is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        try {
          const res = await dispatch(addLead(values));
          if (res?.data?.code === 201) {
            toast.success("Form submitted successfully!");
            resetForm();
          } else {
            toast.error("Failed to submit the form.");
          }
        } catch (error) {
          console.error("Error submitting form:", error);
          toast.error("An error occurred. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });
  console.log("formikformik", formik.errors);
  return (
    <>
      <div className="mainLeadform">
        <header className="leadFormHeader my-5">
          {/* <img src={logo} alt="RG International Logo" className="img-fluid" /> */}
        </header>
        <div className="d-flex justify-content-center align-items-center leadFormBackground">
          <div className="leadFormContainer rounded-5">
            <h1 className="text-center mb-3">REGISTRATION</h1>
            <h5 className="text-center mb-3">Grab your seat today!</h5>
            <h5 className="text-center mb-4">Surat: +91 75758 66622</h5>
            <Form noValidate onSubmit={formik.handleSubmit}>
              <Form.Group className="mb-3" controlId="leadName">
                <Form.Control
                  type="text"
                  className="custom-select-height"
                  placeholder="Full Name*"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.name && !!formik.errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="leadPhone">
                <PhoneInput
                  country={countryCodeISO()}
                  value={formik.values.phone}
                  onChange={(phone, data) => {
                    const dialCode = data.dialCode ? `+${data.dialCode}` : "";
                    const formattedPhone = `${dialCode} ${phone.replace(
                      data.dialCode,
                      "",
                    )}`.trim();

                    formik.setFieldValue("phone", formattedPhone);
                  }}
                  onBlur={formik.handleBlur}
                  inputProps={{
                    name: "phone",
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
                <Form.Control.Feedback type="invalid">
                  {formik.errors.phone}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="leadEmail">
                <Form.Control
                  type="email"
                  className="custom-select-height"
                  placeholder="Email*"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.email && !!formik.errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="leadCity">
                <Form.Control
                  type="text"
                  className="custom-select-height"
                  placeholder="City*"
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.city && !!formik.errors.city}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.city}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-grid">
                <Button type="submit" className="leadFormBtnCustom rounded-4">
                  Submit
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadForm;
