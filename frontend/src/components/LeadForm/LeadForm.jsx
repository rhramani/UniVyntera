import { useDispatch } from "react-redux";
import logo from "../../assets/images/LeadForm-logo/LeadForm01.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addLead } from "../../redux/actions/Lead.action";
import { toast } from "react-toastify";

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
      phone: Yup.string()
        .matches(/^[0-9]+$/, "Phone number must contain only digits")
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number cannot exceed 15 digits")
        .required("Phone number is required"),
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

  return (
    <>
      <div className="mainLeadform">
        <header className="leadFormHeader my-5">
          <img src={logo} alt="RG International Logo" className="img-fluid" />
        </header>
        <div className="d-flex justify-content-center align-items-center leadFormBackground">
          <div className="leadFormContainer rounded-5">
            <h1 className="text-center mb-3">REGISTRATION</h1>
            <h5 className="text-center mb-3">Grab your seat today!</h5>
            <h5 className="text-center mb-4">Surat: +91 75758 66622</h5>
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control rounded-4"
                  placeholder="Full Name*"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="invalid-feedback">{formik.errors.name}</div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="tel"
                  className="form-control rounded-4"
                  placeholder="Phone Number*"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div className="invalid-feedback">{formik.errors.phone}</div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control rounded-4"
                  placeholder="Email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="invalid-feedback">{formik.errors.email}</div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control rounded-4"
                  placeholder="City"
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.city && formik.errors.city && (
                  <div className="invalid-feedback">{formik.errors.city}</div>
                )}
              </div>
              <div className="d-flex justify-content-center mt-4">
                <button
                  type="submit"
                  className="btn leadFormBtnCustom rounded-4"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadForm;
