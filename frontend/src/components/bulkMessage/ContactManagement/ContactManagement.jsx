import React, { useState, useRef, useEffect } from "react";
import { Card, Nav, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { FaRegTrashAlt } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import UpdateGroupModal from "./utils/UpdateGroupDrawer";
import AddGroupModal from "./utils/AddGroupDrawer";
import UpdateContactModal from "./utils/UpdateContactModal";
import AddContactModal from "./utils/AddContactModal";
import ContactList from "./ContactList";
import GroupList from "./GroupList";
import { getAllGroup } from "../../../redux/actions/BulkMessage/Group.action";
import {
  bulkImport,
  getAllExportContacts,
  multiDeleteContact,
} from "../../../redux/actions/BulkMessage/Contact.action";
import usePermissions from "../../commonComponents/usePermissions";
import Select from "react-select";
import Pageheader from "../../../layouts/Pageheader";

const ContactManagement = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [allContacts, setAllContact] = useState([]);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showUpdateContactModal, setShowUpdateContactModal] = useState(false);
  const [updateContact, setUpdateContact] = useState(null);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [isUpdateGroupModalOpen, setIsUpdateGroupModalOpen] = useState(false);
  const [updateGroup, setUpdateGroup] = useState(null);
  const [isGroupSelectOpen, setIsGroupSelectOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [groupRefreshKey, setGroupRefreshKey] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const { canCreate, canRead, canUpdate, canDelete, canDownload, canUpload } =
    usePermissions("Contacts");
  const { canCreate: canCreateGroup } = usePermissions("Contacts");

  const [contactCurrentPage, setContactCurrentPage] = useState(1);
  const [contactItemsPerPage, setContactItemsPerPage] = useState(10);
  const [contactSearch, setContactSearch] = useState("");

  const [groupCurrentPage, setGroupCurrentPage] = useState(1);
  const [groupItemsPerPage, setGroupItemsPerPage] = useState(10);
  const [groupSearch, setGroupSearch] = useState("");
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    return () => {
      setSelectedContacts([]);
      setAllContact([]);
      setGroups([]);
      setUploadedFile(null);
      setUpdateContact(null);
      setUpdateGroup(null);
    };
  }, []);

  const fetchAllGroup = async () => {
    if (!canRead) return;

    setIsLoading(true);
    try {
      const res = await dispatch(
        getAllGroup({
          page: groupCurrentPage,
          limit: groupItemsPerPage,
          search: groupSearch,
        }),
      );
      if (res?.status === 200) {
        setGroups(res?.data?.data || []);
      } else {
        setGroups([]);
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
    fetchAllGroup();
  }, [groupCurrentPage, groupItemsPerPage, groupSearch]);

  const refreshContacts = () => {
    setContactCurrentPage(1);
    setTimeout(() => {}, 100);
  };

  const refreshGroups = () => {
    setGroupCurrentPage(1);
    setGroupRefreshKey((prev) => prev + 1);
    if (tabIndex === 1) {
      setTimeout(() => {
        fetchAllGroup();
      }, 100);
    }
  };

  const refreshContactsData = () => {
    setContactCurrentPage(1);
    setContactSearch("");
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (tabIndex === 1) {
      fetchAllGroup();
    }
  }, [
    tabIndex,
    groupCurrentPage,
    groupItemsPerPage,
    groupSearch,
    canRead,
    dispatch,
  ]);

  const options = groups?.length
    ? groups.map((group) => ({
        value: group._id,
        label: group.name,
      }))
    : [];

  const handleChange = (selectedOption) => {
    setSelectedGroupId(selectedOption ? selectedOption.value : "");
  };

  const handleSelectContact = (id) => {
    if (!canUpdate) {
      toast.error("You don't have permission to select contacts.");
      return;
    }
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = (e, contacts) => {
    if (!canUpdate) {
      toast.error("You don't have permission to select contacts.");
      return;
    }
    if (e.target.checked) {
      setSelectedContacts(contacts.map((contact) => contact._id));
    } else {
      setSelectedContacts([]);
    }
  };

  const confirmDelete = async () => {
    if (!canDelete) {
      toast.error("You don't have permission to delete contacts.");
      return;
    }
    if (selectedContacts.length === 0) {
      setShowDeleteModal(false);
      return;
    }

    try {
      setIsLoading(true);
      await dispatch(
        multiDeleteContact(
          { contactIds: selectedContacts },
          {
            page: contactCurrentPage,
            limit: contactItemsPerPage,
            search: contactSearch,
          },
        ),
      );
      toast.success("Contacts deleted successfully.");
      setSelectedContacts([]);
      setContactCurrentPage(1);
      refreshContactsData();
    } catch (error) {
      toast.error("Failed to delete contacts.");
      console.error(error);
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleMultiDelete = () => {
    if (!canDelete) {
      toast.error("You don't have permission to delete contacts.");
      return;
    }
    if (selectedContacts.length === 0) {
      toast.warn("No contacts selected for deletion.");
      return;
    }
    setShowDeleteModal(true); // Show the confirmation modal
  };

  const handleOpenUpdateContactModal = (contact) => {
    if (!canUpdate) {
      toast.error("You don't have permission to update contacts.");
      return;
    }
    setUpdateContact(contact);
    setShowUpdateContactModal(true);
  };

  const handleOpenUpdateGroupModal = (group) => {
    if (!canUpdate) {
      toast.error("You don't have permission to update groups.");
      return;
    }
    setUpdateGroup(group);
    setIsUpdateGroupModalOpen(true);
  };

  const handleExportContacts = async () => {
    if (!canRead) {
      toast.error("You don't have permission to export contacts.");
      return;
    }

    try {
      setIsLoading(true);
      let exportData = [];

      if (selectedContacts?.length > 0) {
        exportData = selectedContacts
          ?.map((id) => {
            const contact = allContacts?.find((c) => c._id === id);
            if (!contact) {
              console.warn(`Contact with ID ${id} not found in allContacts`);
              return null;
            }
            return {
              Name: contact?.fname + " " + contact?.lname || "",
              Email: contact?.email || "",
              PhoneNumber: contact?.phoneNumber || "",
              Subscribed: contact?.isSubscribed ? "Yes" : "No",
            };
          })
          ?.filter(Boolean);
      } else {
        const res = await dispatch(
          getAllExportContacts({
            search: contactSearch,
          }),
        );
        const data = res?.data?.data || [];
        if (!data?.length) {
          toast.warn("No contacts found to export.");
          return;
        }
        exportData = data?.map((contact) => ({
          Name: contact?.fname + " " + contact?.lname || "",
          Phone: contact?.phoneNumber || "",
          Email: contact?.email || "",
          Subscribed: contact?.isSubscribed ? "Yes" : "No",
        }));
      }

      if (!exportData.length) {
        toast.warn("No contacts selected or available to export.");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
      const filename =
        selectedContacts.length > 0
          ? `Selected_Contacts_${selectedContacts?.length}.xlsx`
          : "All_Contacts.xlsx";
      XLSX.writeFile(workbook, filename);
      toast.success("Contacts exported successfully.");
      setSelectedContacts([]);
      refreshContactsData();
    } catch (error) {
      toast.error("Failed to export contacts.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkExcelUpload = (e) => {
    if (!canCreate) {
      toast.error("You don't have permission to import contacts.");
      return;
    }
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid Excel file (.xlsx or .xls)");
      e.target.value = null;
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      e.target.value = null;
      return;
    }

    setUploadedFile(file);
    setIsGroupSelectOpen(true);
    e.target.value = null;
  };

  const handleConfirmImport = async () => {
    if (!uploadedFile) return;

    try {
      setIsLoading(true);
      await dispatch(
        bulkImport(
          uploadedFile,
          selectedGroupId,
          contactCurrentPage,
          contactItemsPerPage,
          contactSearch,
        ),
      );
      toast.success("Contacts imported successfully.");
      setSelectedGroupId("");
      setUploadedFile(null);
      setIsGroupSelectOpen(false);
      setContactCurrentPage(1);
      refreshContactsData();
    } catch (error) {
      console.error("Bulk Import Failed:", error);
      toast.error("Failed to import contacts.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadSample = () => {
    const sampleData = [
      {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phoneNumber: "911234567890",
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        phoneNumber: "919876543210",
      },
    ];
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sample");
    XLSX.writeFile(workbook, "Sample_Contacts.xlsx");
  };

  if (!canRead) {
    return (
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Body>
              <div className="text-center py-5">
                <h5>You don't have permission to view contacts.</h5>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <>
      <Pageheader
        mainheading="Contacts"
        parentfolder="WA Daddy"
        activepage="Contacts"
      />

      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div className="card-title">Contacts</div>
            </Card.Header>
            <Card.Body>
              <Nav
                variant="tabs"
                activeKey={tabIndex}
                onSelect={(selectedKey) => {
                  setTabIndex(parseInt(selectedKey));
                  if (selectedKey === "0") {
                    setContactCurrentPage(1);
                    refreshContactsData();
                  } else {
                    setGroupCurrentPage(1);
                    refreshGroups();
                  }
                }}
                className="d-flex justify-content-between mb-3"
              >
                <div className="d-flex">
                  <Nav.Item>
                    <Nav.Link eventKey={0}>All Contacts</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey={1}>Groups</Nav.Link>
                  </Nav.Item>
                </div>
                <div className="d-flex justify-content-end align-items-start gap-2 flex-wrap">
                  {tabIndex === 0 &&
                    selectedContacts?.length > 0 &&
                    canDelete && (
                      <Button
                        variant="danger"
                        className="custom-select-height"
                        onClick={handleMultiDelete}
                        disabled={isLoading}
                      >
                        <FaRegTrashAlt className="me-2" />
                        Delete
                      </Button>
                    )}
                  {tabIndex === 0 && canUpload && (
                    <>
                      <input
                        type="file"
                        accept=".xlsx, .xls"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        onChange={handleBulkExcelUpload}
                      />
                      <Button
                        variant="primary"
                        className="custom-select-height"
                        onClick={() => fileInputRef.current.click()}
                        disabled={isLoading}
                      >
                        Add Bulk Contact
                      </Button>
                    </>
                  )}
                  {tabIndex === 0 && canDownload && (
                    <Button
                      variant="success"
                      className="custom-select-height"
                      onClick={handleExportContacts}
                      disabled={isLoading}
                    >
                      Export Contacts
                    </Button>
                  )}
                  {tabIndex === 0 && canCreate && (
                    <div className="d-flex flex-column">
                      <Button
                        variant="primary"
                        className="custom-select-height"
                        onClick={() => setShowAddContactModal(true)}
                        disabled={isLoading}
                      >
                        + Add Contact
                      </Button>
                      {canUpload && (
                        <a
                          href="#"
                          className="text-primary"
                          style={{
                            fontSize: "12px",
                            textDecoration: "underline",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            handleDownloadSample();
                          }}
                        >
                          Download Sample File
                        </a>
                      )}
                    </div>
                  )}
                  {tabIndex === 1 && canCreateGroup && (
                    <Button
                      variant="primary"
                      className="custom-select-height mb-3"
                      onClick={() => setIsAddGroupModalOpen(true)}
                      disabled={isLoading}
                    >
                      + Add Group
                    </Button>
                  )}
                  {tabIndex === 0 &&
                    selectedContacts?.length > 0 &&
                    canCreateGroup && (
                      <Button
                        variant="info"
                        className="custom-select-height"
                        onClick={() => setIsAddGroupModalOpen(true)}
                        disabled={isLoading}
                      >
                        + Add Group
                      </Button>
                    )}
                </div>
              </Nav>

              {isLoading && (
                <div className="d-flex justify-content-center my-4">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                    style={{ width: "3rem", height: "3rem" }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}

              <div>
                {tabIndex === 0 ? (
                  <ContactList
                    key={refreshKey}
                    selectedContacts={selectedContacts}
                    setSelectedContacts={setSelectedContacts}
                    onSelectContact={handleSelectContact}
                    onSelectAll={handleSelectAll}
                    onOpenUpdateModal={handleOpenUpdateContactModal}
                    setAllContact={setAllContact}
                    currentPage={contactCurrentPage}
                    setCurrentPage={setContactCurrentPage}
                    itemsPerPage={contactItemsPerPage}
                    setItemsPerPage={setContactItemsPerPage}
                    search={contactSearch}
                    setSearch={setContactSearch}
                    canUpdate={canUpdate}
                    canDelete={canDelete}
                    refreshContacts={refreshContactsData}
                  />
                ) : (
                  <GroupList
                    key={groupRefreshKey}
                    onOpenUpdateDrawer={handleOpenUpdateGroupModal}
                    currentPage={groupCurrentPage}
                    setCurrentPage={setGroupCurrentPage}
                    itemsPerPage={groupItemsPerPage}
                    setItemsPerPage={setGroupItemsPerPage}
                    search={groupSearch}
                    setSearch={setGroupSearch}
                    canUpdate={canUpdate}
                    canDelete={canDelete}
                    refreshGroups={refreshGroups}
                  />
                )}
              </div>

              <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                centered
                backdrop={isLoading ? "static" : true}
                keyboard={!isLoading}
              >
                {/* Header */}
                <Modal.Header
                  className="border-0"
                  style={{
                    background: "linear-gradient(90deg, #dc2626, #ef4444)",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                  }}
                >
                  <Modal.Title className="fw-semibold text-white">
                    Confirm Deletion
                  </Modal.Title>

                  <AiOutlineClose
                    size={18}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={() => setShowDeleteModal(false)}
                  />
                </Modal.Header>

                {/* Body */}
                <Modal.Body className="text-center py-4">
                  <div
                    className="d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "50%",
                      background: "#fee2e2",
                      color: "#dc2626",
                      fontSize: "34px",
                    }}
                  >
                    <i className="bi bi-exclamation-triangle-fill"></i>
                  </div>

                  <p className="mb-1 fw-semibold fs-5">
                    Delete {selectedContacts.length} contact
                    {selectedContacts.length > 1 ? "s" : ""}?
                  </p>

                  <small className="text-muted">
                    This action is permanent and cannot be undone.
                  </small>
                </Modal.Body>

                {/* Footer */}
                <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
                  <Button
                    variant="light"
                    className="px-4"
                    style={{ borderRadius: "8px" }}
                    onClick={() => setShowDeleteModal(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>

                  <Button
                    className="px-4 text-white"
                    style={{
                      borderRadius: "8px",
                      background: "linear-gradient(90deg, #dc2626, #ef4444)",
                      border: "none",
                      minWidth: "110px",
                    }}
                    onClick={confirmDelete}
                    disabled={isLoading}
                  >
                    <i className="bi bi-trash-fill me-2"></i>
                    {isLoading ? "Deleting..." : "Delete"}
                  </Button>
                </Modal.Footer>
              </Modal>

              <Modal
                show={isGroupSelectOpen}
                onHide={() => {
                  if (!isLoading) {
                    setIsGroupSelectOpen(false);
                    setSelectedGroupId("");
                    setUploadedFile(null);
                  }
                }}
                size="md"
                centered
                backdrop={isLoading ? "static" : true}
                keyboard={!isLoading}
              >
                <Modal.Header className="form-main-heading">
                  <Modal.Title>Add All Contacts to a Group?</Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={() => {
                      if (!isLoading) {
                        setIsGroupSelectOpen(false);
                        setSelectedGroupId("");
                        setUploadedFile(null);
                      }
                    }}
                  />
                </Modal.Header>
                <Modal.Body>
                  {isLoading ? (
                    <div className="d-flex justify-content-center py-4">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                        style={{ width: "3rem", height: "3rem" }}
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-3">
                        Choose a group to add all imported contacts (optional):
                      </p>
                      <Form.Group controlId="groupSelect" className="mb-3">
                        <Select
                          value={
                            options.find(
                              (opt) => opt.value === selectedGroupId,
                            ) || null
                          }
                          onChange={handleChange}
                          options={options}
                          isClearable
                          isDisabled={isLoading}
                          placeholder="No group (just import contacts)"
                          noOptionsMessage={() => "No groups available"}
                          classNamePrefix="custom-select"
                          styles={{
                            control: (base) => ({
                              ...base,
                              fontSize: "13px",
                            }),
                          }}
                        />
                      </Form.Group>
                    </div>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="outline-primary"
                    className="custom-select-height"
                    onClick={() => {
                      if (!isLoading) {
                        setIsGroupSelectOpen(false);
                        setSelectedGroupId("");
                        setUploadedFile(null);
                      }
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="custom-select-height"
                    onClick={handleConfirmImport}
                  >
                    {isLoading ? "Importing..." : "Import Contacts"}
                  </Button>
                </Modal.Footer>
              </Modal>

              {canCreate && (
                <AddContactModal
                  show={showAddContactModal}
                  onHide={() => {
                    setShowAddContactModal(false);
                    setContactCurrentPage(1);
                  }}
                  params={{
                    page: contactCurrentPage,
                    limit: contactItemsPerPage,
                    search: contactSearch,
                  }}
                  refreshContacts={refreshContactsData}
                />
              )}

              {canUpdate && (
                <UpdateContactModal
                  show={showUpdateContactModal}
                  onHide={() => {
                    setShowUpdateContactModal(false);
                    setContactCurrentPage(1);
                  }}
                  contact={updateContact}
                  params={{
                    page: contactCurrentPage,
                    limit: contactItemsPerPage,
                    search: contactSearch,
                  }}
                  setSelectedContacts={setSelectedContacts}
                  refreshContacts={refreshContactsData}
                />
              )}

              {canCreateGroup && (
                <AddGroupModal
                  show={isAddGroupModalOpen}
                  onHide={() => {
                    setIsAddGroupModalOpen(false);
                    setGroupCurrentPage(1);
                  }}
                  selectedContacts={selectedContacts}
                  params={{
                    page:
                      tabIndex === 0 ? contactCurrentPage : groupCurrentPage,
                    limit:
                      tabIndex === 0 ? contactItemsPerPage : groupItemsPerPage,
                    search: tabIndex === 0 ? contactSearch : groupSearch,
                  }}
                  onGroupAdded={() => {
                    setSelectedContacts([]);
                    setGroupCurrentPage(1);
                    refreshContactsData();
                    refreshGroups();
                  }}
                  refreshGroups={refreshGroups}
                />
              )}

              {canUpdate && (
                <UpdateGroupModal
                  show={isUpdateGroupModalOpen}
                  onHide={() => {
                    setIsUpdateGroupModalOpen(false);
                    setGroupCurrentPage(1);
                  }}
                  group={updateGroup}
                  params={{
                    page: groupCurrentPage,
                    limit: groupItemsPerPage,
                    search: groupSearch,
                  }}
                  refreshGroups={refreshGroups}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ContactManagement;
