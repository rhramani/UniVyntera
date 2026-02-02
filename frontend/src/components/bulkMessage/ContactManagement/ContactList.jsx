import React, { useEffect, useState } from "react";
import { Form, Row, Col, Card, Modal, Button } from "react-bootstrap";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import TemplateSelectorModal from "./utils/TemplateSelectorModal";
import {
  getAllContacts,
  deleteContact,
} from "../../../redux/actions/BulkMessage/Contact.action";
import ItemsPerPageSelect from "../../commonComponents/ItemsPerPageSelect";
import Paginations from "../../elements/Paginations";
import DataTable from "../../commonComponents/DataTable";

const ContactList = ({
  selectedContacts,
  onSelectContact,
  onSelectAll,
  onOpenUpdateModal,
  setAllContact,
  setSelectedContacts,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  search,
  setSearch,
  canUpdate,
  canDelete,
  refreshContacts,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [selectedContactForCampaign, setSelectedContactForCampaign] =
    useState(null);
  const [contacts, setContacts] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuContactId, setMenuContactId] = useState(null);

  const dispatch = useDispatch();

  const fetchAllContacts = async () => {
    setIsLoading(true);
    try {
      const res = await dispatch(
        getAllContacts({
          page: currentPage,
          limit: itemsPerPage,
          search,
        })
      );

      if (res?.status === 200) {
        const responseData = res?.data?.data || [];
        setContacts(responseData);
        setTotalRecords(res?.data?.totalCount || 0);
        setTotalPages(res?.data?.totalPages || 0);
        setAllContact(responseData);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to fetch contacts.");
      setContacts([]);
      setTotalRecords(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllContacts();
  }, [currentPage, itemsPerPage, search, dispatch]);

  useEffect(() => {
    setSelectedContacts((prev) =>
      prev.filter((id) => contacts.some((c) => c._id === id))
    );
  }, [contacts, setSelectedContacts]);

  useEffect(() => {
    return () => {
      setContacts([]);
      setTotalRecords(0);
      setTotalPages(0);
    };
  }, []);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    if (!canDelete) {
      toast.error("You don't have permission to delete contacts.");
      return;
    }
    setContactToDelete(id);
    setShowDeleteModal(true);
    handleMenuClose();
  };

  const confirmDelete = async () => {
    if (contactToDelete && canDelete) {
      try {
        await dispatch(deleteContact(contactToDelete));
        toast.success("Contact deleted successfully.");
        setShowDeleteModal(false);
        setContactToDelete(null);
        setCurrentPage(1);
        if (refreshContacts) refreshContacts();
        fetchAllContacts();
      } catch (error) {
        toast.error("Failed to delete contact.");
        console.error(error);
      }
    }
  };

  const handleSendMessage = (contact) => {
    setSelectedContactForCampaign(contact);
    handleMenuClose();
  };

  const handleMenuOpen = (event, contactId) => {
    setAnchorEl(event.currentTarget);
    setMenuContactId(contactId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuContactId(null);
  };

  return (
    <>
      <Card.Body>
        <TemplateSelectorModal
          show={!!selectedContactForCampaign}
          onHide={() => setSelectedContactForCampaign(null)}
          contact={selectedContactForCampaign}
        />

        <Row className="mb-3">
          <Col md={6} className="d-flex align-items-end"></Col>
          <Col
            md={6}
            className="d-flex flex-wrap align-items-end justify-content-end gap-2"
          >
            <div className="contact-search3">
              <button type="button" className="btn border-0">
                <i
                  className="fe fe-search fw-semibold text-muted"
                  aria-hidden="true"
                ></i>
              </button>
              <Form.Control
                type="text"
                className="filter-height border-0"
                id="contact-search"
                placeholder="Search here..."
                autoComplete="off"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <ItemsPerPageSelect
              itemsPerPage={itemsPerPage}
              onChange={handleItemsPerPageChange}
            />
            <div className="custom-select-height total-records px-3 mt-2 mt-md-0 d-flex align-items-center h-6">
              <span>
                Total Records :<strong>&nbsp;{totalRecords}</strong>
              </span>
            </div>
          </Col>
        </Row>

        {isLoading ? (
          <div className="d-flex justify-content-center my-4">
            <div
              className="spinner-border text-primary"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <DataTable
              columns={[
                {
                  label: (
                    <Form.Check
                      type="checkbox"
                      checked={
                        selectedContacts?.length === contacts?.length &&
                        contacts?.length > 0
                      }
                      indeterminate={
                        selectedContacts?.length > 0 &&
                        selectedContacts?.length < contacts?.length
                          ? "true"
                          : ""
                      }
                      onChange={(e) => onSelectAll(e, contacts)}
                      className="custom-checkbox"
                    />
                  ),
                  render: (c) => (
                    <Form.Check
                      type="checkbox"
                      className="custom-checkbox"
                      checked={selectedContacts.includes(c._id)}
                      onChange={() => onSelectContact(c._id)}
                    />
                  ),
                },
                {
                  label: "Full Name",
                  render: (c) =>
                    `${c?.fname || ""} ${c?.lname || ""}`.trim() || "-",
                },
                { label: "Phone", key: "phoneNumber" },
                { label: "Email", key: "email" },
                {
                  label: "Created By",
                  render: (c) => c?.contact_create_by?.name || "-",
                },
              ]}
              data={contacts}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              renderActions={(item) => (
                <>
                  <IconButton
                    aria-label="more"
                    aria-controls={`menu-${item._id}`}
                    aria-haspopup="true"
                    onClick={(e) => handleMenuOpen(e, item._id)}
                    size="small"
                  >
                    <BsThreeDotsVertical />
                  </IconButton>
                  <Menu
                    id={`menu-${item._id}`}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && menuContactId === item._id}
                    onClose={handleMenuClose}
                    MenuListProps={{
                      "aria-labelledby": `menu-${item._id}`,
                    }}
                    sx={{
                      "& .MuiPaper-root": {
                        minWidth: "160px",
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    <MenuItem
                      key="message"
                      onClick={() => handleSendMessage(item)}
                    >
                      <ChatBubbleOutlineIcon
                        fontSize="small"
                        sx={{ mr: 1 }}
                        className="message-icon"
                      />
                      <span className="message-action-text">Send Message</span>
                    </MenuItem>

                    {canUpdate && (
                      <MenuItem
                        key="edit"
                        onClick={() => {
                          onOpenUpdateModal(item);
                          handleMenuClose();
                        }}
                      >
                        <EditIcon
                          fontSize="small"
                          sx={{ mr: 1 }}
                          className="edit-icon"
                        />

                        <span className="edit-action-text">Edit Contact</span>
                      </MenuItem>
                    )}
                    {canDelete && (
                      <MenuItem
                        key="delete"
                        onClick={() => handleDelete(item._id)}
                      >
                        <DeleteIcon
                          fontSize="small"
                          sx={{ mr: 1 }}
                          className="delete-icon"
                        />
                        <span className="delete-action-text">
                          Delete Contact
                        </span>
                      </MenuItem>
                    )}
                  </Menu>
                </>
              )}
              canEdit={canUpdate}
              canDelete={canDelete}
              canRead={true}
              showEditButton={false}
              showDeleteButton={false}
              showNoColumn={false}
            />

            {totalPages > 1 && contacts?.length > 0 && (
              <Paginations
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          centered
        >
          <Modal.Header className="form-main-heading">
            <Modal.Title className="fw-semibold">Confirm Deletion</Modal.Title>
            <AiOutlineClose
              size={20}
              style={{ cursor: "pointer", color: "white" }}
              onClick={() => setShowDeleteModal(false)}
            />
          </Modal.Header>
          <Modal.Body className="text-center py-4">
            <div className="text-danger fs-1 mb-3">
              <i className="bi bi-exclamation-triangle-fill"></i>
            </div>
            <p className="mb-1 fw-semibold">
              Are you sure you want to delete this contact?
            </p>
            <small className="text-muted">This action cannot be undone.</small>
          </Modal.Body>
          <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
            <Button
              variant="light"
              className="btn-cancel-delete px-4"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="btn-delete-confirm"
              onClick={confirmDelete}
            >
              <i className="bi bi-trash-fill me-2"></i>Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </>
  );
};

export default ContactList;
