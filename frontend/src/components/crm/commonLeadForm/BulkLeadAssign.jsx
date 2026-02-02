import { Button, Form, Modal } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import { getAllRoleList } from "../../../redux/actions/Master/Role.action";
import {
  bulkUpdateLeadAssign,
  getLead,
} from "../../../redux/actions/Lead.action";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { adminGetAll } from "../../../redux/actions/Admin.action";
import { toast } from "react-toastify";

const BulkLeadAssign = ({
  showBulkAssignModal,
  allBranchOptions,
  selectStyles,
  isLoading,
  selectedLeads,
  setIsLoading,
  setSelectedLeads,
  setShowBulkAssignModal,
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
  const [bulkAssignRoleList, setBulkAssignRoleList] = useState(null);
  const [bulkAssignUserList, setBulkAssignUserList] = useState([]);
  const [bulkAssignData, setBulkAssignData] = useState({
    lead_assign_Branch: null,
    lead_role: "",
    lead_assign: "",
  });

  const bulkAssignRoleOptions =
    bulkAssignRoleList?.data
      ?.filter((role) => role?.name !== "Super Admin")
      ?.map((data) => ({
        value: data._id,
        label: data.name,
      })) || [];

  const bulkAssignUserOptions =
    bulkAssignUserList?.map((user) => {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
      return {
        value: user._id,
        label: fullName || user.name,
      };
    }) || [];
  useEffect(() => {
    if (showBulkAssignModal) {
      const fetchRolesForBulkAssign = async () => {
        try {
          const res = await dispatch(getAllRoleList("", false));
          setBulkAssignRoleList(res?.data);
        } catch (error) {
          console.error("Error fetching roles for bulk assign:", error);
          setBulkAssignRoleList(null);
        }
      };
      fetchRolesForBulkAssign();
    } else {
      setBulkAssignRoleList(null);
      setBulkAssignUserList([]);
    }
  }, [showBulkAssignModal, dispatch]);
  const handleBulkAssign = async () => {
    if (selectedLeads.length === 0) {
      toast.error("Please select at least one lead");
      return;
    }

    if (
      bulkAssignData.lead_assign_Branch === undefined ||
      bulkAssignData.lead_assign_Branch === ""
    ) {
      toast.error("Please select Branch Lead Assign");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        leadIds: selectedLeads,
        lead_assign_Branch: bulkAssignData.lead_assign_Branch,
        lead_role: bulkAssignData.lead_role || null,
        lead_assign: bulkAssignData.lead_assign || null,
      };

      const response = await dispatch(bulkUpdateLeadAssign(payload));

      if (response?.status === 200) {
        toast.success(
          response?.data?.message || "Leads assigned successfully!"
        );

        const refreshPayload = {
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
          dispatch(getLead(refreshPayload)).then((res) => {
            setGetLeadData(res?.data);
            setTotalPages(res?.data?.totalPages || 0);
            setTotalRecords(res?.data?.totalLeads || 0);
          });
        }

        setSelectedLeads([]);
        setShowBulkAssignModal(false);
        setBulkAssignData({
          lead_assign_Branch: null,
          lead_role: "",
          lead_assign: "",
        });
      }
    } catch (error) {
      console.error("Error bulk assigning leads:", error);
      toast.error(error?.response?.data?.message || "Failed to assign leads");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkAssignBranchChange = async (selectedOption) => {
    let branchId = null;
    if (selectedOption) {
      if (selectedOption.value === "head_office") {
        branchId = null;
      } else if (selectedOption.value === "All") {
        branchId = "";
      } else {
        branchId = selectedOption.value;
      }
    }

    const branchIdToUse = branchId === null ? "" : branchId;
    try {
      const res = await dispatch(getAllRoleList(branchIdToUse, false));
      setBulkAssignRoleList(res?.data);
      setBulkAssignData((prev) => ({
        ...prev,
        lead_assign_Branch: branchId === "" ? null : branchId,
        lead_role: "",
        lead_assign: "",
      }));
      setBulkAssignUserList([]);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setBulkAssignRoleList(null);
      setBulkAssignUserList([]);
    }
  };

  const handleBulkAssignRoleChange = async (selectedOption) => {
    const selectedRoleId = selectedOption ? selectedOption.value : null;
    const selectedRoleName = selectedOption ? selectedOption.label : "";

    setBulkAssignData((prev) => ({
      ...prev,
      lead_role: selectedRoleId,
      lead_assign: "",
    }));

    if (selectedRoleId && selectedRoleName) {
      const branchIdToUse =
        bulkAssignData.lead_assign_Branch === null
          ? null
          : bulkAssignData.lead_assign_Branch || "";

      try {
        const effectiveBranchId =
          branchIdToUse === "head_office" ? null : branchIdToUse;
        const res = await dispatch(
          adminGetAll(
            1,
            100,
            "",
            selectedRoleName || "",
            effectiveBranchId || "",
            false
          )
        );
        const responseData = res?.data?.data;
        setBulkAssignUserList(responseData?.data || []);
      } catch (error) {
        console.log("Error fetching users for bulk assign:", error);
        setBulkAssignUserList([]);
      }
    } else {
      setBulkAssignUserList([]);
    }
  };
  return (
    <Modal
      className="leads-modal"
      show={showBulkAssignModal}
      onHide={() => {
        setShowBulkAssignModal(false);
        setBulkAssignData({
          lead_assign_Branch: null,
          lead_role: "",
          lead_assign: "",
        });
        setBulkAssignRoleList(null);
        setBulkAssignUserList([]);
      }}
      centered
    >
      <Modal.Header className="form-main-heading">
        <Modal.Title className="fw-semibold">Bulk Lead Assign</Modal.Title>
        <AiOutlineClose
          size={20}
          style={{ cursor: "pointer", color: "white" }}
          onClick={() => {
            setShowBulkAssignModal(false);
            setBulkAssignData({
              lead_assign_Branch: null,
              lead_role: "",
              lead_assign: "",
            });
            setBulkAssignRoleList(null);
            setBulkAssignUserList([]);
          }}
        />
      </Modal.Header>
      <Modal.Body className="py-4">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Branch Lead Assign</Form.Label>
            <Select
              className="custom-select-height"
              options={[
                { value: "head_office", label: "Head Office" },
                ...allBranchOptions,
              ]}
              value={
                [
                  { value: "head_office", label: "Head Office" },
                  ...allBranchOptions,
                ].find(
                  (option) =>
                    option.value ===
                    (bulkAssignData.lead_assign_Branch === null
                      ? "head_office"
                      : bulkAssignData.lead_assign_Branch)
                ) || null
              }
              onChange={handleBulkAssignBranchChange}
              placeholder="Select Branch"
              isClearable
              isSearchable
              classNamePrefix="custom-select"
              styles={selectStyles}
              noOptionsMessage={() => "No branches available"}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Lead Assign Role</Form.Label>
            <Select
              className="custom-select-height"
              options={bulkAssignRoleOptions}
              value={
                bulkAssignRoleOptions.find(
                  (option) => option.value === bulkAssignData.lead_role
                ) || null
              }
              onChange={handleBulkAssignRoleChange}
              placeholder="Select Lead Assign Role"
              isClearable
              isSearchable
              classNamePrefix="custom-select"
              styles={selectStyles}
              isDisabled={
                bulkAssignData.lead_assign_Branch === undefined ||
                bulkAssignData.lead_assign_Branch === ""
              }
              noOptionsMessage={() => "No roles available"}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Lead Assign</Form.Label>
            <Select
              className="custom-select-height"
              options={bulkAssignUserOptions}
              value={
                bulkAssignUserOptions.find(
                  (option) => option.value === bulkAssignData.lead_assign
                ) || null
              }
              onChange={(selectedOption) =>
                setBulkAssignData((prev) => ({
                  ...prev,
                  lead_assign: selectedOption ? selectedOption.value : "",
                }))
              }
              placeholder="Select Lead Assign"
              isClearable
              isSearchable
              isDisabled={!bulkAssignData.lead_role}
              classNamePrefix="custom-select"
              styles={selectStyles}
              noOptionsMessage={() => "No users available"}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0 justify-content-center gap-2 pb-4">
        <Button
          variant="outline-primary"
          className="custom-select-height"
          onClick={() => {
            setShowBulkAssignModal(false);
            setBulkAssignData({
              lead_assign_Branch: null,
              lead_role: "",
              lead_assign: "",
            });
            setBulkAssignRoleList(null);
            setBulkAssignUserList([]);
          }}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          className="custom-select-height"
          onClick={handleBulkAssign}
          disabled={isLoading}
        >
          Assign
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BulkLeadAssign;
