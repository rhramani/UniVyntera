import { Button, Form, Modal } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { getLead, insertMany } from "../../../redux/actions/Lead.action";
import { useState } from "react";
import { toast } from "react-toastify";

const UploadLeadModal = ({
  setShowUploadModal,
  showUploadModal,
  currentPage,
  itemsPerPage,
  searchTerm,
  filters,
  selectedFilter,
  canRead,
  setGetLeadData,
  setTotalPages,
  setTotalRecords,
}) => {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      return alert("Please select a file first.");
    }

    const formData = new FormData();
    formData.append("excelFile", selectedFile);

    try {
      const response = await dispatch(insertMany(formData));
      if (response?.status === 200) {
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
        toast.success("Leads uploaded successfully!");
      }
      handleCloseUploadModal();
    } catch (error) {
      toast.error("Error uploading file");
    }
  };
  return (
    <Modal show={showUploadModal} onHide={handleCloseUploadModal}>
      <Modal.Header className="form-main-heading">
        <Modal.Title>Upload File</Modal.Title>
        <AiOutlineClose
          size={20}
          style={{ cursor: "pointer", color: "white" }}
          onClick={handleCloseUploadModal}
        />
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Select a file to upload</Form.Label>
            <Form.Control
              type="file"
              className="custom-select-height"
              onChange={handleFileChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="link"
          className="custom-select-height btn border-primary text-primary text-decoration-none"
          onClick={handleCloseUploadModal}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          className="custom-select-height"
          onClick={handleFileUpload}
        >
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadLeadModal;
