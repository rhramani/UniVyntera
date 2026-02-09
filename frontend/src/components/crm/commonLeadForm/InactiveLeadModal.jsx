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
      <Modal.Header  className="border-0"
        style={{
          background: "linear-gradient(90deg, #dc2626, #ef4444)",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
        }}>
        <Modal.Title className="fw-semibold text-white">
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
        <div className="d-flex align-items-center justify-content-center mx-auto mb-3"
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "#fee2e2",
            color: "#dc2626",
            fontSize: "32px",
          }}>
           <i className="bi bi-exclamation-triangle-fill"></i>
        </div>
        <p className="mb-1 fw-semibold fs-6">
          Are you sure you want to mark this lead as inactive?
        </p>
        <small className="text-muted">
          This action will update the lead status to inactive.
        </small>
      </Modal.Body>
      <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
        <Button
          variant="light"
          className=" px-4"
          onClick={() => {
            setShowDeadLeadModal(false);
            setSelectedDeadLead(null);
          }}
        >
          Cancel
        </Button>
        <Button
       className="px-4 text-white"
          style={{
            borderRadius: "8px",
            background: "linear-gradient(90deg, #dc2626, #ef4444)",
            border: "none",
          }}
          onClick={() => handleMarkDeadLead(setSelectedDeadLead)}
        >
          <i className="bi bi-check-circle-fill me-2"></i>Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default InactiveLeadModal;
