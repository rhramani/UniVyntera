import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  updateContact,
  getAllContacts,
} from "../../../../redux/actions/BulkMessage/Contact.action";
import { getAllGroup } from "../../../../redux/actions/BulkMessage/Group.action";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-phone-input-2/lib/bootstrap.css";
import PhoneInput from "react-phone-input-2";
import { AiOutlineClose } from "react-icons/ai";
import { countryCodeISO } from "../../../../utils/countryISOCode";

const UpdateContactModal = ({
  show,
  onHide,
  contact,
  params,
  setSelectedContacts,
  refreshContacts,
}) => {
  const dispatch = useDispatch();

  const [groups, setGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [groupSearch, setGroupSearch] = useState("");

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phoneNumber: "",
  });
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (contact && show) {
      setFormData({
        fname: contact.fname || "",
        lname: contact.lname || "",
        email: contact.email || "",
        phoneNumber: contact.phoneNumber || "",
      });
      setSelectedGroupId(contact.groupId || "");
      setErrors({});
    }
  }, [contact, show]);

  const fetchGroups = async () => {
    setGroupsLoading(true);
    try {
      const res = await dispatch(
        getAllGroup({
          page: 1,
          limit: 10000, 
          search: groupSearch || "",
        })
      );
      const data = res?.data?.data?.data || res?.data?.data || [];
      setGroups(data);
    } catch (err) {
      console.error("Error fetching groups:", err);
      toast.error("Failed to fetch groups.");
      setGroups([]);
    } finally {
      setGroupsLoading(false);
    }
  };

  useEffect(() => {
    if (show) fetchGroups();
  }, [show, groupSearch, dispatch]);

  useEffect(() => {
    return () => {
      setGroups([]);
      setFormData({
        fname: "",
        lname: "",
        email: "",
        phoneNumber: "",
      });
      setSelectedGroupId("");
      setErrors({});
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phoneNumber: value }));
    if (errors.phoneNumber) {
      setErrors((prev) => ({ ...prev, phoneNumber: "" }));
    }
  };

  const trimmed = useMemo(
    () => ({
      fname: formData.fname.trim(),
      lname: formData.lname.trim(),
      email: formData.email.trim(),
      phoneNumber: (formData.phoneNumber || "").trim(),
    }),
    [formData]
  );

  const validate = () => {
    const newErrors = {};

    if (!trimmed.fname) {
      newErrors.fname = "First name is required.";
    }

    if (!trimmed.lname) {
      newErrors.lname = "Last name is required.";
    }

    if (
      trimmed.email &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(trimmed.email)
    ) {
      newErrors.email = "Invalid email address.";
    }

    const digits = trimmed.phoneNumber.replace(/\D/g, "");
    if (!digits) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (digits.length < 8) {
      newErrors.phoneNumber = "Phone number seems too short.";
    }

    return newErrors;
  };

  const resetForm = () => {
    setFormData({
      fname: "",
      lname: "",
      email: "",
      phoneNumber: "",
    });
    setSelectedGroupId("");
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!contact?._id) {
      toast.error("Contact ID is missing.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...trimmed,
        ...(selectedGroupId ? { groupId: selectedGroupId } : {}),
      };

      const res = await dispatch(updateContact(contact._id, payload));

      if (res?.status === 200 || res?.data?.code === 200) {
        toast.success("Contact updated successfully.");

        await dispatch(
          getAllContacts({
            page: params?.page || 1,
            limit: params?.limit || params?.itemsPerPage || 10,
            search: params?.search || "",
            subscribed: params?.subscribed ?? "",
          })
        );

        if (setSelectedContacts) {
          setSelectedContacts((prev) =>
            prev.filter((id) => id !== contact._id)
          );
        }

        resetForm();
        onHide();
        if (refreshContacts) {
          refreshContacts();
        }
      } else {
        toast.error(res?.data?.message || "Failed to update contact.");
      }
    } catch (error) {
      console.error("Update contact error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      resetForm();
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header className="form-main-heading">
        <Modal.Title>Update Contact</Modal.Title>
        <AiOutlineClose
          size={20}
          style={{ cursor: "pointer", color: "white" }}
          onClick={handleClose}
        />
      </Modal.Header>

      <Form noValidate onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">First Name *</Form.Label>
            <Form.Control
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              className="custom-select-height"
              placeholder="Enter first name"
              isInvalid={!!errors.fname}
              disabled={submitting}
            />
            <Form.Control.Feedback type="invalid">
              {errors.fname}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Last Name *</Form.Label>
            <Form.Control
              name="lname"
              value={formData.lname}
              onChange={handleChange}
              className="custom-select-height"
              placeholder="Enter last name"
              isInvalid={!!errors.lname}
              disabled={submitting}
            />
            <Form.Control.Feedback type="invalid">
              {errors.lname}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Email</Form.Label>
            <Form.Control
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="custom-select-height"
              placeholder="name@example.com"
              isInvalid={!!errors.email}
              disabled={submitting}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Phone Number *</Form.Label>
            <PhoneInput
              country={countryCodeISO()}
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              disabled={submitting}
              inputProps={{
                name: "phoneNumber",
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
              placeholder="Enter phone number"
            />
            {errors.phoneNumber && (
              <div className="invalid-feedback d-block">
                {errors.phoneNumber}
              </div>
            )}
          </Form.Group>

          {/* <Form.Group className="mb-3">
            <Form.Label>
              Group <span className="text-muted">(optional)</span>
            </Form.Label>
            <Form.Select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="custom-select-height"
              disabled={submitting || groupsLoading}
            >
              <option value="">No Group</option>
              {groups.map((group) => (
                <option key={group?._id || ""} value={group?._id || ""}>
                  {group?.name || "Unnamed Group"} ({group?.contactIds?.length || 0} contacts)
                </option>
              ))}
            </Form.Select>
            {groupsLoading && (
              <small className="text-muted">Loading groups...</small>
            )}
          </Form.Group> */}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-primary"
            className="custom-select-height"
            onClick={handleClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="custom-select-height"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Updating...
              </>
            ) : (
              "Update Contact"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UpdateContactModal;
