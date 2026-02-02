import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Modal, Form, Button, Nav, Row, Col, Spinner } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import {
  addContactToGroup,
  createGroup,
  getAllGroup,
} from "../../../../redux/actions/BulkMessage/Group.action";
import Select from "react-select";

const AddGroupModal = ({
  show,
  onHide,
  selectedContacts = [],
  params,
  onGroupAdded,
  refreshGroups,
}) => {
  const [groupTabIndex, setGroupTabIndex] = useState(0);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();

  const fetchAllGroup = async () => {
    setIsLoading(true);
    try {
      const res = await dispatch(
        getAllGroup({ page: 1, limit: 1000, search: "" })
      );
      if (res?.status === 200) {
        const data = res?.data?.data?.data || res?.data?.data || [];
        setGroups(data);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error("Failed to fetch groups.");
      setGroups([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      fetchAllGroup();
    }
  }, [show, dispatch]);

  useEffect(() => {
    return () => {
      setGroups([]);
      setGroupName("");
      setDescription("");
      setSelectedGroupId("");
      setErrors({});
      setGroupTabIndex(0);
    };
  }, []);

  const resetForm = () => {
    setGroupName("");
    setDescription("");
    setSelectedGroupId("");
    setErrors({});
    setGroupTabIndex(0);
  };

  const validateNewGroup = () => {
    const newErrors = {};
    if (!groupName.trim()) {
      newErrors.groupName = "Group name is required";
    }
    return newErrors;
  };

  const validateExistingGroup = () => {
    const newErrors = {};
    if (!selectedGroupId) {
      newErrors.selectedGroup = "Please select a group";
    }
    if (selectedContacts.length === 0) {
      newErrors.contacts = "Please select at least one contact";
    }
    return newErrors;
  };

  const handleAddGroup = async () => {
    const validationErrors = validateNewGroup();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: groupName.trim(),
        description: description.trim(),
        contactIds: selectedContacts,
      };

      const res = await dispatch(createGroup(payload, params));
      if (res?.status === 201 || res?.data?.code === 201) {
        toast.success("Group created successfully.");
        resetForm();
        onHide();
        if (onGroupAdded) {
          onGroupAdded();
        }
        if (refreshGroups) {
          refreshGroups();
        }
      } else {
        toast.error(res?.data?.message || "Failed to create group.");
      }
    } catch (error) {
      console.error("Create group error:", error);
      toast.error(error?.response?.data?.message || "Failed to create group.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddContactToGroup = async () => {
    const validationErrors = validateExistingGroup();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await dispatch(
        addContactToGroup(
          selectedGroupId,
          { contactIds: selectedContacts },
          params
        )
      );
      if (res?.status === 200 || res?.data?.code === 200) {
        toast.success("Contacts added to group successfully.");
        resetForm();
        onHide();
        if (onGroupAdded) {
          onGroupAdded();
        }
        if (refreshGroups) {
          refreshGroups();
        }
      } else {
        toast.error(res?.data?.message || "Failed to add contacts to group.");
      }
    } catch (error) {
      console.error("Add to group error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to add contacts to group."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onHide();
    }
  };

  const groupOptions = groups
    ?.map((group) => ({
      value: group?._id || "",
      label: `${group?.name || "Unnamed Group"} (${
        group?.contactIds?.length || 0
      } contacts)`,
    }))
    .filter((group) => group.value);

  return (
    <Modal show={show} onHide={handleClose} size="md" centered>
      <Modal.Header className="form-main-heading">
        <Modal.Title>
          {selectedContacts.length > 0 ? `Create Group` : "Create a New Group"}
        </Modal.Title>
        <AiOutlineClose
          size={20}
          style={{ cursor: "pointer", color: "white" }}
          onClick={handleClose}
        />
      </Modal.Header>

      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <Nav
          variant="tabs"
          activeKey={groupTabIndex}
          onSelect={(selectedKey) => {
            setGroupTabIndex(parseInt(selectedKey));
            setErrors({});
          }}
          className="mb-3"
        >
          <Nav.Item>
            <Nav.Link eventKey={0}>New Group</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={1}>Add To Existing</Nav.Link>
          </Nav.Item>
        </Nav>

        <Form>
          {groupTabIndex === 0 ? (
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group controlId="groupName">
                  <Form.Label className="fw-semibold">
                    Group Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    className="custom-select-height"
                    placeholder="Enter Group Name"
                    value={groupName}
                    onChange={(e) => {
                      setGroupName(e.target.value);
                      if (errors.groupName) {
                        setErrors((prev) => ({ ...prev, groupName: "" }));
                      }
                    }}
                    isInvalid={!!errors.groupName}
                    disabled={isSubmitting}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.groupName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12} className="mb-3">
                <Form.Group controlId="description">
                  <Form.Label className="fw-semibold">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    className="rounded-4"
                    placeholder="Enter Group Description (Optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isSubmitting}
                  />
                </Form.Group>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group controlId="selectGroup">
                  <Form.Label className="fw-semibold">
                    Select Group <span className="text-danger">*</span>
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
                      setSelectedGroupId(
                        selectedOption ? selectedOption.value : ""
                      );
                      if (errors.selectedGroup) {
                        setErrors((prev) => ({ ...prev, selectedGroup: "" }));
                      }
                    }}
                    options={groupOptions}
                    placeholder="Select Group"
                    isClearable
                    isSearchable
                    isLoading={isLoading}
                    isDisabled={isSubmitting || isLoading}
                    // className="custom-select-height"
                    classNamePrefix="custom-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: "13px",
                      }),
                    }}
                  />
                  {errors.selectedGroup && (
                    <div className="invalid-feedback d-block">
                      {errors.selectedGroup}
                    </div>
                  )}
                </Form.Group>
                {isLoading && (
                  <small className="text-muted">Loading groups...</small>
                )}
              </Col>
              {selectedContacts.length > 0 && (
                <Col md={12} className="mb-3">
                  <div className="alert alert-success">
                    <i className="fe fe-check me-2"></i>
                    <strong>{selectedContacts.length}</strong> contacts will be
                    added to the selected group.
                  </div>
                </Col>
              )}
              {errors.contacts && (
                <Col md={12} className="mb-3">
                  <div className="alert alert-danger">{errors.contacts}</div>
                </Col>
              )}
            </Row>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="outline-primary"
          className="custom-select-height"
          onClick={handleClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          className="custom-select-height"
          onClick={
            groupTabIndex === 0 ? handleAddGroup : handleAddContactToGroup
          }
          disabled={
            isSubmitting ||
            (groupTabIndex === 1 && selectedContacts.length === 0)
          }
        >
          {isSubmitting ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              {groupTabIndex === 0 ? "Creating..." : "Adding..."}
            </>
          ) : groupTabIndex === 0 ? (
            "Create Group"
          ) : (
            "Add to Group"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddGroupModal;
