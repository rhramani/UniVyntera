import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import DataTable from "../../commonComponents/DataTable";
import { AiOutlineClose } from "react-icons/ai";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import LoadMoreButton from "../../commonComponents/LoadMoreButton";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  updateStudentApplication,
  deleteStudentApplication,
} from "../../../redux/actions/Student/StudentApplication.action";
import {
  updateVisitorApplication,
  deleteVisitorApplication,
} from "../../../redux/actions/Visitor/VisitorApplication.action";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { countryCodeISO } from "../../../utils/countryISOCode";
import usePermissions from "../../commonComponents/usePermissions";

const emergencyValidationSchema = Yup.object({
  personName: Yup.string().required("Person name is required"),
  contactNum: Yup.string().required("Contact number is required"),
  email: Yup.string(),
  relationShip: Yup.string(),
});

const EmergencyDetails = ({
  formData,
  edit,
  setEdit,
  setFormData,
  fetchOneStudentDetails,
  id,
  mode,
  userRole,
}) => {
  const { canRead, canCreate, canUpdate, canDelete } = usePermissions(
    "Student Applications",
    "Personal Details"
  );
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const emergencyFormik = useFormik({
    initialValues: {
      personName: "",
      contactNum: "",
      email: "",
      relationShip: "",
    },
    validationSchema: emergencyValidationSchema,
    onSubmit: (values) => {
      edit.emergencyDetails
        ? handleUpdateEmergency(values)
        : handleAddEmergency(values);
    },
  });

  const handleAddEmergency = async (values) => {
    setIsLoading(true);
    try {
      const payload = {
        emergencyDetails: [
          {
            personName: values.personName.trim(),
            contactNum: values.contactNum.trim(),
            email: values.email.trim(),
            relationShip: values.relationShip.trim(),
          },
        ],
      };

      const res = await dispatch(
        mode === "student"
          ? updateStudentApplication(payload, id)
          : updateVisitorApplication(payload, id)
      );

      if (res?.status === 200) {
        toast.success("Emergency detail added");

        const newItem = res.data.data.emergencyDetails?.slice(-1)[0];

        setFormData((prev) => ({
          ...prev,
          emergencyDetails: [...(prev.emergencyDetails || []), newItem],
        }));

        closeModal();
        fetchOneStudentDetails?.();
      }
    } catch (err) {
      toast.error("Error adding emergency detail");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEmergency = async (values) => {
    setIsLoading(true);

    const index = edit.emergencyDetailsIndex;
    const emergencyId = formData.emergencyDetails[index]?._id;

    try {
      const payload = {
        emergencyDetailsId: emergencyId,
        emergencyDetailsUpdate: {
          personName: values.personName.trim(),
          email: values.email.trim(),
          relationShip: values.relationShip.trim(),
          contactNum: values.contactNum,
        },
      };

      const res = await dispatch(
        mode === "student"
          ? updateStudentApplication(payload, id)
          : updateVisitorApplication(payload, id)
      );

      if (res?.status === 200) {
        toast.success("Emergency detail updated");

        setFormData((prev) => {
          const updated = [...prev.emergencyDetails];
          updated[index] = {
            ...updated[index],
            ...payload.emergencyDetailsUpdate,
          };
          return { ...prev, emergencyDetails: updated };
        });

        closeModal();
        fetchOneStudentDetails?.();
      }
    } catch (err) {
      toast.error("Error updating emergency detail");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEmergency = async (index) => {
    const emergencyDetailsId = formData.emergencyDetails[index]?._id;
    if (!emergencyDetailsId) return;

    try {
      const payload = { emergencyDetailsId };

      const res = await dispatch(
        mode === "student"
          ? deleteStudentApplication(payload, id)
          : deleteVisitorApplication(payload, id)
      );

      if (res?.status === 200) {
        toast.success("Emergency detail deleted");

        setFormData((prev) => ({
          ...prev,
          emergencyDetails: prev.emergencyDetails.filter((_, i) => i !== index),
        }));
      }
    } catch (err) {
      toast.error("Error deleting emergency detail");
    }
  };

  const closeModal = () => {
    emergencyFormik.resetForm();
    setEdit({ emergencyDetails: false, emergencyDetailsIndex: 0 });
    setShowModal(false);
  };

  const columns = [
    { label: "Person Name", render: (i) => i.personName || "-" },
    { label: "Contact Number", render: (i) => i.contactNum || "-" },
    { label: "Email", render: (i) => i.email || "-" },
    { label: "Relationship", render: (i) => i.relationShip || "-" },
  ];

  return (
    <>
      {isLoading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center z-3">
          <LoadMoreButton isLoading />
        </div>
      )}

      <div className="my-5 p-4 bg-light rounded shadow-sm">
        <div className="d-flex justify-content-between mb-3">
          <h5>Emergency Details</h5>

          {userRole !== "Student" && userRole !== "LeadStudent" && canCreate && (
            <Button
              variant="primary"
              className="custom-select-height"
              onClick={() => {
                emergencyFormik.resetForm();
                setEdit({ emergencyDetails: false, emergencyDetailsIndex: 0 });
                setShowModal(true);
              }}
            >
              Add New
            </Button>
          )}
        </div>

        <Modal show={showModal} onHide={closeModal} centered size="lg">
          <Modal.Header className="form-main-heading">
            <Modal.Title>
              {edit.emergencyDetails
                ? "Update Emergency Detail"
                : "Add Emergency Detail"}
            </Modal.Title>
            <AiOutlineClose
              size={20}
              style={{ cursor: "pointer", color: "white" }}
              onClick={closeModal}
            />
          </Modal.Header>

          <Modal.Body>
            <Form onSubmit={emergencyFormik.handleSubmit}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Person Name</Form.Label>
                  <Form.Control
                    name="personName"
                    className="custom-select-height"
                    value={emergencyFormik.values.personName}
                    onChange={emergencyFormik.handleChange}
                    placeholder="Enter Person Name"
                  />

                  {emergencyFormik.touched.personName &&
                    emergencyFormik.errors.personName && (
                      <div className="text-danger">
                        {emergencyFormik.errors.personName}
                      </div>
                    )}
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Contact Number</Form.Label>

                  <PhoneInput
                    country={countryCodeISO()}
                    value={emergencyFormik.values.contactNum || ""}
                    onChange={(phone, data) => {
                      if (!phone || phone === data.dialCode) {
                        emergencyFormik.setFieldValue("contactNum", "");
                      } else {
                        const dialCode = data.dialCode
                          ? `+${data.dialCode}`
                          : "";
                        const formattedPhone = `${dialCode} ${phone.replace(
                          data.dialCode,
                          ""
                        )}`.trim();

                        emergencyFormik.setFieldValue(
                          "contactNum",
                          formattedPhone
                        );
                      }
                    }}
                    inputProps={{
                      name: "contactNum",
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

                  {emergencyFormik.touched.contactNum &&
                    emergencyFormik.errors.contactNum && (
                      <div className="text-danger">
                        {emergencyFormik.errors.contactNum}
                      </div>
                    )}
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    name="email"
                    className="custom-select-height"
                    value={emergencyFormik.values.email}
                    onChange={emergencyFormik.handleChange}
                    placeholder="Enter Email"
                  />

                  {emergencyFormik.touched.email &&
                    emergencyFormik.errors.email && (
                      <div className="text-danger">
                        {emergencyFormik.errors.email}
                      </div>
                    )}
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Relationship</Form.Label>
                  <Form.Control
                    name="relationShip"
                    className="custom-select-height"
                    value={emergencyFormik.values.relationShip}
                    onChange={emergencyFormik.handleChange}
                    placeholder="Enter Relationship"
                  />

                  {emergencyFormik.touched.relationShip &&
                    emergencyFormik.errors.relationShip && (
                      <div className="text-danger">
                        {emergencyFormik.errors.relationShip}
                      </div>
                    )}
                </Col>
              </Row>

              <div className="text-end">
                <Button
                  type="submit"
                  variant="primary"
                  className="custom-select-height"
                >
                  {edit.emergencyDetails ? "Update" : "Add"}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        <DataTable
          columns={columns}
          data={canRead ? formData.emergencyDetails || [] : []}
          onEdit={(item) => {
            const index = formData.emergencyDetails.indexOf(item);
            emergencyFormik.setValues({
              personName: item.personName || "",
              contactNum: item.contactNum || "",
              email: item.email || "",
              relationShip: item.relationShip || "",
            });
            setEdit({ emergencyDetails: true, emergencyDetailsIndex: index });
            setShowModal(true);
          }}
          onDelete={(item) => {
            const index = formData.emergencyDetails.indexOf(item);
            handleDeleteEmergency(index);
          }}
          canEdit={canUpdate}
          canDelete={canDelete}
          canRead={canRead}
        />
      </div>
    </>
  );
};

export default EmergencyDetails;
