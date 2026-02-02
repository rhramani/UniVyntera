import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  deleteGroupContact,
  getGroupById,
  updateGroup,
  addContactToGroup,
} from "../../../../redux/actions/BulkMessage/Group.action";
import { Modal, Form, Button, Alert, Spinner } from "react-bootstrap";
import { getAllContacts } from "../../../../redux/actions/BulkMessage/Contact.action";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";

const UpdateGroupModal = ({ show, onHide, group, params, onGroupUpdated }) => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [checkedContactIds, setCheckedContactIds] = useState([]);
  const [contactSearch, setContactSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [originalContactIds, setOriginalContactIds] = useState([]);

  const [allContacts, setAllContacts] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (show && group) {
      setGroupName(group.name || "");
      setDescription(group.description || "");
      setContactSearch("");
      setErrors({});
      fetchGroupData(group._id);
    }
  }, [group, show]);

  const fetchGroupData = async (groupId) => {
    if (!groupId) return;
    setIsLoading(true);
    try {
      const groupRes = await dispatch(getGroupById(groupId));
      const gData = groupRes?.data?.data || {};

      // Contact IDs from group
      const rawIds = gData?.contactIds || [];
      const toIds = (arr) =>
        (arr || [])
          .map((c) => (typeof c === "string" ? c : c?._id))
          .filter(Boolean);

      const ids = toIds(rawIds);

      // Sirf group ke contacts ko display karna hai
      let contactsList = [];
      if (Array.isArray(rawIds)) {
        contactsList = rawIds.map(
          (c) =>
            typeof c === "string"
              ? { _id: c } // fallback agar API ne sirf ID bheja
              : c // agar object bheja
        );
      }

      setAllContacts(contactsList); // ✅ ab sirf group ke contacts aayenge
      setCheckedContactIds(ids);
      setOriginalContactIds(ids);
    } catch (error) {
      console.error("Error fetching group data:", error);
      toast.error("Failed to fetch group data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxToggle = (id) => {
    setCheckedContactIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const validateForm = () => {
    const newErrors = {};
    if (!groupName.trim()) {
      newErrors.groupName = "Group name is required";
    }
    return newErrors;
  };

  // const handleUpdateGroup = async () => {
  //   const validationErrors = validateForm();
  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);
  //     return;
  //   }

  //   if (!group?._id) {
  //     toast.error("Group ID is missing.");
  //     return;
  //   }

  //   try {
  //     setIsSubmitting(true);

  //     const updatePayload = {
  //       name: groupName.trim(),
  //       description: description.trim(),
  //     };

  //     const updateRes = await dispatch(updateGroup(group._id, updatePayload));

  //     if (updateRes?.status === 200 || updateRes?.data?.code === 200) {
  //       const removedContactIds = originalContactIds.filter(
  //         (id) => !checkedContactIds.includes(id)
  //       );
  //       const addedContactIds = checkedContactIds.filter(
  //         (id) => !originalContactIds.includes(id)
  //       );

  //       if (removedContactIds.length > 0) {
  //         await dispatch(
  //           deleteGroupContact(
  //             group._id,
  //             { contactIds: removedContactIds },
  //             params
  //           )
  //         );
  //       }
  //       if (addedContactIds.length > 0) {
  //         await dispatch(
  //           addContactToGroup(
  //             group._id,
  //             { contactIds: addedContactIds },
  //             params
  //           )
  //         );
  //       }

  //       toast.success("Group updated successfully.");
  //       onHide();
  //       if (onGroupUpdated) onGroupUpdated();
  //     } else {
  //       toast.error(updateRes?.data?.message || "Failed to update group.");
  //     }
  //   } catch (error) {
  //     console.error("Update group error:", error);
  //     toast.error(error?.response?.data?.message || "Failed to update group.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  const handleDeleteContacts = async () => {
    if (!group?._id) return;

    const removedContactIds = originalContactIds.filter(
      (id) => !checkedContactIds.includes(id)
    );

    if (removedContactIds.length === 0) return;

    try {
      setIsSubmitting(true);

      const res = await dispatch(
        deleteGroupContact(group._id, { contactIds: removedContactIds })
      );

      if (res?.status === 200 || res?.data?.code === 200) {
        toast.success("Selected contacts removed successfully.");

        await fetchGroupData(group._id);

        if (onGroupUpdated) {
          onGroupUpdated();
        }
        onHide();
      } else {
        toast.error(res?.data?.message || "Failed to remove contacts.");
      }
    } catch (error) {
      console.error("Delete contacts error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to remove contacts."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleClose = () => {
    if (!isSubmitting) {
      setGroupName("");
      setDescription("");
      setCheckedContactIds([]);
      setOriginalContactIds([]);
      setContactSearch("");
      setErrors({});
      onHide();
    }
  };

  const allContactsForDisplay = (allContacts || [])?.map((c) => ({
    ...c,
    isChecked: checkedContactIds?.includes(c._id),
  }));

  const filteredContacts = (allContactsForDisplay || [])?.filter((contact) => {
    const q = contactSearch.toLowerCase();
    return (
      (contact?.fname || "").toLowerCase()?.includes(q) ||
      (contact?.lname || "").toLowerCase()?.includes(q) ||
      (contact?.phoneNumber || "").toLowerCase()?.includes(q)
    );
  });

  const addedContactIds = checkedContactIds?.filter(
    (id) => !originalContactIds?.includes(id)
  );
  const removedContactIds = originalContactIds?.filter(
    (id) => !checkedContactIds?.includes(id)
  );
  const hasChanges =
    groupName !== (group?.name || "") ||
    description !== (group?.description || "") ||
    checkedContactIds?.length !== originalContactIds?.length ||
    !checkedContactIds?.every((id) => originalContactIds?.includes(id));

  return (
    <Modal show={show} onHide={handleClose} size="md" centered>
      <Modal.Header className="form-main-heading">
        <Modal.Title>Update Group</Modal.Title>
        <AiOutlineClose
          size={20}
          style={{ cursor: "pointer", color: "white" }}
          onClick={handleClose}
        />
      </Modal.Header>

      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {isLoading ? (
          <div className="d-flex justify-content-center py-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                Group Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => {
                  setGroupName(e.target.value);
                  if (errors.groupName) {
                    setErrors((prev) => ({ ...prev, groupName: "" }));
                  }
                }}
                isInvalid={!!errors.groupName}
                disabled={isSubmitting}
            className="custom-select-height"
              />
              <Form.Control.Feedback type="invalid">
                {errors.groupName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter group description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                    className="rounded-4"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                Group Contact List
              </Form.Label>

              {(addedContactIds.length > 0 || removedContactIds.length > 0) && (
                <Alert variant="warning" className="mb-2">
                  {addedContactIds.length > 0 && (
                    <span className="me-3">
                      {addedContactIds.length} to add
                    </span>
                  )}
                  {removedContactIds.length > 0 && (
                    <span>{removedContactIds.length} to remove</span>
                  )}
                </Alert>
              )}

              <Form.Control
                type="text"
                className="mb-2 custom-select-height"
                placeholder="Search by name or phone number"
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                disabled={isSubmitting}
              />

              <div
                style={{
                  maxHeight: "250px",
                  overflowY: "auto",
                  border: "1px solid #dee2e6",
                  borderRadius: "0.375rem",
                  padding: "0.5rem",
                }}
              >
                {filteredContacts?.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <div
                      key={contact._id}
                      className="d-flex align-items-center p-2 border-bottom"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        !isSubmitting && handleCheckboxToggle(contact._id)
                      }
                    >
                      <Form.Check
                        type="checkbox"
                        checked={checkedContactIds.includes(contact._id)}
                        onChange={() => {
                          e.stopPropagation();
                          handleCheckboxToggle(contact._id);
                        }}
                        disabled={isSubmitting}
                        className="custom-checkbox me-2"
                        style={{ cursor: "pointer" }}
                      />
                      <div className="flex-grow-1">
                        <div className="fw-medium">
                          {contact?.fname || ""} {contact?.lname || ""} -{" "}
                          {contact?.phoneNumber || ""}
                        </div>
                        {/* <small className="text-muted">
                          {contact?.phoneNumber || ""}
                          {contact?.email && ` • ${contact.email}`}
                        </small> */}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted py-3">
                    {contactSearch
                      ? "No contacts match your search."
                      : "No contacts found."}
                  </div>
                )}
              </div>

              {/* <div className="mt-2">
                <small className="fw-semibold d-block mb-1">
                  Selected Contacts ({checkedContactIds.length})
                </small>
                <div
                  style={{
                    maxHeight: "120px",
                    overflowY: "auto",
                    border: "1px solid #dee2e6",
                    borderRadius: "0.375rem",
                    padding: "0.5rem",
                  }}
                >
                  {checkedContactIds.length > 0 ? (
                    allContacts
                      .filter((c) => checkedContactIds.includes(c._id))
                      .map((c) => (
                        <div key={c._id} className="small text-muted border-bottom py-1">
                          <span className="fw-medium">
                            {c.fname} {c.lname}
                          </span>{" "}
                          – {c.phoneNumber || "N/A"}
                          {c.email && ` • ${c.email}`}
                        </div>
                      ))
                  ) : (
                    <div className="text-muted small">No contacts selected</div>
                  )}
                </div>
              </div> */}
            </Form.Group>
          </Form>
        )}
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
          // onClick={handleUpdateGroup}
          onClick={handleDeleteContacts}
          disabled={isSubmitting || !hasChanges || isLoading}
        >
          {isSubmitting ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                className="me-2"
              />
              Updating...
            </>
          ) : (
            "Update Group"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateGroupModal;
