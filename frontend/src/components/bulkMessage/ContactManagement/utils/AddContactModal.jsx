import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  addContact,
  getAllContacts,
} from "../../../../redux/actions/BulkMessage/Contact.action";
import { getAllGroup } from "../../../../redux/actions/BulkMessage/Group.action";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-phone-input-2/lib/bootstrap.css";
import PhoneInput from "react-phone-input-2";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import { countryCodeISO } from "../../../../utils/countryISOCode";

const AddContactModal = ({ show, onHide, params, onContactAdded, refreshContacts }) => {
  const dispatch = useDispatch();

  const [groups, setGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phoneNumber: "",
  });
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchGroups = async () => {
    setGroupsLoading(true);
    try {
      const res = await dispatch(
        getAllGroup({
          page: 1,
          limit: 100,
          search: "",
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
  }, [show, dispatch]);

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
    if (!trimmed.fname) newErrors.fname = "First name is required.";
    if (!trimmed.lname) newErrors.lname = "Last name is required.";

    if (
      trimmed.email &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(trimmed.email)
    ) {
      newErrors.email = "Invalid email address.";
    }

    const digits = trimmed.phoneNumber.replace(/\D/g, "");
    if (!digits) newErrors.phoneNumber = "Phone number is required.";
    else if (digits.length < 8)
      newErrors.phoneNumber = "Phone seems too short.";

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

    try {
      setSubmitting(true);
      const payload = {
        ...trimmed,
        ...(selectedGroupId ? { groupId: selectedGroupId } : {}),
      };

      const res = await dispatch(addContact(payload));
      if (res?.status === 201 || res?.data?.code === 201) {
        toast.success("Contact added successfully.");
        await dispatch(
          getAllContacts({
            page: params?.page || 1,
            limit: params?.limit || params?.itemsPerPage || 10,
            search: params?.search || "",
            subscribed: params?.subscribed ?? "",
          })
        );

        resetForm();
        onHide();
        
        if (refreshContacts) {
          refreshContacts();
        }
        
        if (onContactAdded) {
          onContactAdded();
        }
      } else {
        toast.error(res?.data?.message || "Failed to add contact.");
      }
    } catch (error) {
      console.error("Add contact error:", error);
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

  const groupOptions = groups?.map((group) => ({
    value: group?._id || "",
    label: `${group?.name || "Unnamed Group"} (${group?.contactIds?.length || 0} contacts)`,
  })).filter(group => group.value); 

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header className="form-main-heading">
        <Modal.Title>Add Contact</Modal.Title>
        <AiOutlineClose
          size={20}
          style={{ cursor: "pointer", color: "white" }}
          onClick={handleClose}
        />
      </Modal.Header>

      <Form noValidate onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              First Name <span className="text-danger">*</span>
            </Form.Label>
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
            <Form.Label className="fw-semibold">
              Last Name <span className="text-danger">*</span>
            </Form.Label>
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
              placeholder="Enter email"
              isInvalid={!!errors.email}
              disabled={submitting}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Phone Number <span className="text-danger">*</span>
            </Form.Label>
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

          <Form.Group className="mb-3">
            <Form.Label>
              Group <span className="text-muted">(optional)</span>
            </Form.Label>
            <Select
              value={
                selectedGroupId
                  ? groupOptions.find(
                      (option) => option.value === selectedGroupId
                    )
                  : null
              }
              onChange={(selectedOption) => {
                setSelectedGroupId(selectedOption ? selectedOption.value : "");
              }}
              options={groupOptions}
              placeholder="Select Group (Optional)"
              isClearable
              isSearchable
              isLoading={groupsLoading}
              isDisabled={submitting || groupsLoading}
                            classNamePrefix="custom-select"
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "38px",
                }),
              }}
            />
            {groupsLoading && (
              <small className="text-muted">Loading groups...</small>
            )}
          </Form.Group>
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
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Adding...
              </>
            ) : (
              "Add Contact"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddContactModal;
