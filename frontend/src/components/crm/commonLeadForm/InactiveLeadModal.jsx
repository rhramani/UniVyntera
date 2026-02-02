import { AiOutlineClose } from "react-icons/ai";
import DangerousIcon from "@mui/icons-material/Dangerous";
import { Button, Modal } from "react-bootstrap";
import { getLead, updateLead } from "../../../redux/actions/Lead.action";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const InactiveLeadModal = ({
  showDeadLeadModal,
  setShowDeadLeadModal,
  setSelectedDeadLead,
  selectedDeadLead,
  currentPage,
  itemsPerPage,
  selectedFilter,
  searchTerm,
  filters,
  canRead,
  setGetLeadData,
  setTotalPages,
  setTotalRecords,
}) => {
  const dispatch = useDispatch();
  const handleMarkDeadLead = async () => {
    try {
      const updatedLeadData = {
        deadLead: true,
      };
      const response = await dispatch(
        updateLead(selectedDeadLead._id, updatedLeadData)
      );
      if (response.status === 200) {
        toast.success("Lead marked as inactive successfully!");
        const payload = {
          page: currentPage || 1,
          limit: itemsPerPage,
          searchOnField: selectedFilter.value,
          search: searchTerm,
          status: filters.status,
          subStatus: filters.subStatus,
          assignId: filters.assignId,
          lead_from: filters.lead_from,
          startdate: filters.startDate,
          enddate: filters.endDate,
          branchId: filters.branchId,
          showAll: filters.showAll,
          leadActivity: filters.leadActivity,
          country: filters.country,
          followUpType: filters.followUpType,
          assignRole: filters.assignRole || "",
          updatedOn: filters.updatedOn || "",
        };
        if (canRead) {
          dispatch(getLead(payload)).then((res) => {
            setGetLeadData(res?.data);
            setTotalPages(res?.data?.totalPages || 0);
            setTotalRecords(res?.data?.totalLeads || 0);
          });
        }
        setShowDeadLeadModal(false);
        setSelectedDeadLead(null);
      } else {
        toast.error("Failed to mark lead as inactive");
      }
    } catch (error) {
      toast.error("Something went wrong while marking lead as inactive");
      console.error("Error marking lead as inactive", error);
    }
  };
  return (
    <Modal
      className="leads-modal"
      show={showDeadLeadModal}
      onHide={() => {
        setShowDeadLeadModal(false);
        setSelectedDeadLead(null);
      }}
      centered
    >
      <Modal.Header className="form-main-heading">
        <Modal.Title className="fw-semibold">
          Confirm Mark as Inactive Lead
        </Modal.Title>
        <AiOutlineClose
          size={20}
          style={{ cursor: "pointer", color: "white" }}
          onClick={() => {
            setShowDeadLeadModal(false);
            setSelectedDeadLead(null);
          }}
        />
      </Modal.Header>
      <Modal.Body className="text-center py-4">
        <div className="text-danger fs-1 mb-3">
          <DangerousIcon fontSize="large" />
        </div>
        <p className="mb-1 fw-semibold">
          Are you sure you want to mark this lead as inactive?
        </p>
        <small className="text-muted">
          This action will update the lead status to inactive.
        </small>
      </Modal.Body>
      <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
        <Button
          variant="light"
          className="btn-cancel-delete px-4"
          onClick={() => {
            setShowDeadLeadModal(false);
            setSelectedDeadLead(null);
          }}
        >
          Cancel
        </Button>
        <Button
          className="btn-delete-confirm"
          onClick={() => handleMarkDeadLead(setSelectedDeadLead)}
        >
          <i className="bi bi-check-circle-fill me-2"></i>Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default InactiveLeadModal;
