import React, { useEffect, useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { Form, Button, Row, Col, Card, Modal } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  deleteGroup,
  getAllGroup,
  getGroupById,
} from "../../../redux/actions/BulkMessage/Group.action";
import ItemsPerPageSelect from "../../commonComponents/ItemsPerPageSelect";
import Paginations from "../../elements/Paginations";
import DataTable from "../../commonComponents/DataTable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";

const GroupList = ({
  onOpenUpdateDrawer,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  search,
  setSearch,
  canUpdate,
  canDelete,
  refreshGroups,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuGroupId, setMenuGroupId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [groups, setGroups] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const fetchAllGroup = async () => {
    setIsLoading(true);
    try {
      const res = await dispatch(
        getAllGroup({
          page: currentPage,
          limit: itemsPerPage,
          search,
        })
      );

      if (res?.status === 200) {
        const responseData = res?.data?.data || {};
        
        if (Array.isArray(responseData)) {
          setGroups(responseData);
          setTotalRecords(responseData.length);
          setTotalPages(1);
        } else if (responseData?.data && Array.isArray(responseData.data)) {
          setGroups(responseData.data);
          setTotalRecords(
            responseData.totalRecords ||
              responseData.totalCount ||
              responseData.data.length
          );
          setTotalPages(responseData.totalPages || 1);
        } else {
          setGroups([]);
          setTotalRecords(0);
          setTotalPages(0);
        }
      } else {
        setGroups([]);
        setTotalRecords(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error("Failed to fetch groups.");
      setGroups([]);
      setTotalRecords(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllGroup();
  }, [currentPage, itemsPerPage, search, dispatch]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleMenuOpen = (event, groupId) => {
    setAnchorEl(event.currentTarget);
    setMenuGroupId(groupId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuGroupId(null);
  };

  const handleDelete = (id) => {
    if (!canDelete) {
      toast.error("You don't have permission to delete groups.");
      return;
    }
    setGroupToDelete(id);
    setShowDeleteModal(true);
    handleMenuClose();
  };

  const confirmDelete = async () => {
    if (groupToDelete && canDelete) {
      try {
        await dispatch(deleteGroup(groupToDelete));
        toast.success("Group deleted successfully.");
        setShowDeleteModal(false);
        setGroupToDelete(null);
        setCurrentPage(1);
        
        if (refreshGroups) {
          refreshGroups();
        }
        fetchAllGroup();
      } catch (error) {
        toast.error("Failed to delete group.");
        console.error(error);
      }
    }
  };

  const handleUpdate = (group) => {
    if (!canUpdate) {
      toast.error("You don't have permission to update groups.");
      return;
    }
    onOpenUpdateDrawer(group);
    handleMenuClose();
  };

  const handleGroupUpdated = () => {
    fetchAllGroup();
  };

  const handleGroupCreated = () => {
    fetchAllGroup();
  };

  const handleGroupDeleted = () => {
    fetchAllGroup();
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const exportGroup = async (id) => {
    try {
      const response = await dispatch(getGroupById(id));
      const data = response?.data?.data?.contactIds || [];
      if (!data.length) {
        toast.warn("No contacts to export from this group.");
        return;
      }

      const formattedData = data.map((contact) => ({
        Name: `${contact?.fname || ""} ${contact?.lname || ""}`.trim(),
        Phone: contact?.phoneNumber || "",
        Email: contact?.email || "",
        Subscribed: contact?.isSubscribed ? "Yes" : "No",
      }));

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
      const filename = `Group_Contacts_${formattedData.length}.xlsx`;
      XLSX.writeFile(workbook, filename);
      toast.success("Group contacts exported successfully.");
    } catch (error) {
      console.error("Export group error:", error);
      toast.error("Failed to export group contacts. Please try again.");
    }
    handleMenuClose();
  };

  return (
    <Card.Body>
      <Row className="mb-3">
        <Col md={6} className="d-flex align-items-end">
        </Col>
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
              id="group-search"
              placeholder="Search groups..."
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
                label: "Group Name",
                render: (g) => g?.name || "Unnamed Group",
              },
              {
                label: "Members",
                render: (g) => `${g?.contactIds?.length || 0}`,
              },
              { label: "Description", key: "description" },
              {
                label: "Created By",
                render: (g) => g?.group_created_by?.name || "-",
              },
              {
                label: "Created Date",
                render: (g) => formatDate(g?.createdAt),
              },
            ]}
            data={groups}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            renderActions={(group) => (
              <>
                <IconButton
                  aria-label="more"
                  aria-controls={`menu-${group._id}`}
                  aria-haspopup="true"
                  onClick={(e) => {
                    setAnchorEl(e.currentTarget);
                    setMenuGroupId(group._id);
                  }}
                  size="small"
                >
                  <BsThreeDotsVertical />
                </IconButton>
                <Menu
                  id={`menu-${group._id}`}
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl) && menuGroupId === group._id}
                  onClose={handleMenuClose}
                  MenuListProps={{
                    "aria-labelledby": `menu-${group._id}`,
                  }}
                  sx={{
                    "& .MuiPaper-root": {
                      minWidth: "150px",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  {canUpdate && (
                    <MenuItem onClick={() => handleUpdate(group)}>
                      <EditIcon
                        fontSize="small"
                        sx={{ mr: 1 }}
                        className="edit-icon"
                      />
                      <span className="edit-action-text">Update Group</span>
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => exportGroup(group._id)}>
                    <DownloadIcon
                      fontSize="small"
                      sx={{ mr: 1 }}
                      className="download-icon"
                    />
                    <span className="download-action-text">
                      Export Contacts
                    </span>
                  </MenuItem>
                  {canDelete && (
                    <MenuItem
                      onClick={() => handleDelete(group._id)}
                      sx={{ color: "#e7515a" }}
                    >
                      <DeleteIcon
                        fontSize="small"
                        sx={{ mr: 1 }}
                        className="delete-icon"
                      />
                      <span className="delete-action-text">Delete Group</span>
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
          />

          {totalPages > 1 && groups.length > 0 && (
            <Paginations
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </>
      )}

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
            Are you sure you want to delete this group?
          </p>
          <small className="text-muted">
            This action cannot be undone. All contacts in this group will be
            unassigned.
          </small>
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
  );
};

export default GroupList;
