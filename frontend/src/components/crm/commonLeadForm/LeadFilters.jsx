import { Form } from "react-bootstrap";
import { MdCalendarToday } from "react-icons/md";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import ItemsPerPageSelect from "../../commonComponents/ItemsPerPageSelect";
import { formatDate, parseDate, toISODate } from "../../../utils/leadsUtils";
import { getAllRoleList } from "../../../redux/actions/Master/Role.action";
import { getLead } from "../../../redux/actions/Lead.action";

import { toast } from "react-toastify";

const LeadFilters = ({
  canRead,
  filters,
  setFilters,
  userRole,
  allBranchOptions,
  selectStyles,
  filterRoleOptions,
  userOptions,
  leadCountries,
  followUpTypeOptions,
  leadStatus,
  leadFrom,
  leadStatusOption,
  itemsPerPage,
  totalRecords,
  setCurrentPage,
  dispatch,
  setGetRoleList,
  setAllUser,
  fetchAllUser,
  setIsLoading,
  setGetLeadData,
  setTotalPages,
  setTotalRecords,
  isLoading,
  setItemsPerPage,
  selectedFilter,
  searchTerm,
  leadSubStatusOptions,
  fetchLeadSubStatus,
  leadSubStatus,
  allOther,
}) => {
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const startDateInputRef = useRef(null);
  const startDateCalenderRef = useRef(null);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [endDateValue, setEndDateValue] = useState(null);
  const endDateInputRef = useRef(null);
  const endDateCalenderRef = useRef(null);
  const [showUpdatedOnCalendar, setShowUpdatedOnCalendar] = useState(false);
  const [updatedOnValue, setUpdatedOnValue] = useState(null);
  const updatedOnInputRef = useRef(null);
  const updatedOnCalenderRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showStartDateCalendar &&
        startDateInputRef.current &&
        !startDateInputRef.current.contains(event.target) &&
        startDateCalenderRef.current &&
        !startDateCalenderRef.current.contains(event.target)
      ) {
        setShowStartDateCalendar(false);
      }
      if (
        showEndDateCalendar &&
        endDateInputRef.current &&
        !endDateInputRef.current.contains(event.target) &&
        endDateCalenderRef.current &&
        !endDateCalenderRef.current.contains(event.target)
      ) {
        setShowEndDateCalendar(false);
      }
      if (
        showUpdatedOnCalendar &&
        updatedOnInputRef.current &&
        !updatedOnInputRef.current.contains(event.target) &&
        updatedOnCalenderRef.current &&
        !updatedOnCalenderRef.current.contains(event.target)
      ) {
        setShowUpdatedOnCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStartDateCalendar, showEndDateCalendar, showUpdatedOnCalendar]);

  const handleItemsPerPageChange = async (newItemsPerPage) => {
    if (isLoading) return;

    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setIsLoading(true);

    const payload = {
      page: 1,
      limit: newItemsPerPage,
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
      otherService: filters.otherService || "",
    };

    if (canRead) {
      try {
        const res = await dispatch(getLead(payload));
        setGetLeadData(res?.data);
        setTotalPages(res?.data?.totalPages || 0);
        setTotalRecords(res?.data?.totalLeads || 0);
      } catch (error) {
        console.error("Error fetching leads:", error);
        toast.error("Failed to fetch leads");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {canRead && (
        <>
          <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
            <div className="filter-item">
              <Form.Label>Start Date</Form.Label>
              <div style={{ position: "relative" }}>
                <Form.Control
                  type="text"
                  className="filter-height"
                  placeholder="dd/mm/yyyy"
                  value={
                    filters.startDate
                      ? formatDate(parseDate(filters.startDate))
                      : ""
                  }
                  readOnly
                  ref={startDateInputRef}
                  onClick={() => {
                    if (filters.startDate) {
                      setStartDateValue(parseDate(filters.startDate));
                    }
                    setShowStartDateCalendar((show) => !show);
                  }}
                  style={{ cursor: "pointer", backgroundColor: "#fff" }}
                />
                {filters.startDate ? (
                  <button
                    type="button"
                    onClick={() => {
                      setFilters({ ...filters, startDate: "" });
                      setStartDateValue(null);
                      setShowStartDateCalendar(false);
                    }}
                    style={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 16,
                      color: "#888",
                      padding: 0,
                    }}
                    aria-label="Clear date"
                  >
                    ×
                  </button>
                ) : (
                  <MdCalendarToday
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#888",
                      pointerEvents: "none",
                    }}
                    size={20}
                  />
                )}
                {showStartDateCalendar && (
                  <div
                    ref={startDateCalenderRef}
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "0",
                      zIndex: 9999,
                      background: "#fff",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                      borderRadius: "8px",
                      marginTop: "4px",
                      width: 300,
                      minWidth: 300,
                      maxWidth: 300,
                    }}
                  >
                    <Calendar
                      className="form-control m-0 p-0 border-0"
                      onChange={(selectedDate) => {
                        setStartDateValue(selectedDate);
                        setFilters({
                          ...filters,
                          startDate: toISODate(selectedDate),
                        });
                        setShowStartDateCalendar(false);
                        setCurrentPage(1);
                      }}
                      value={startDateValue}
                      locale="en-GB"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="filter-item">
              <Form.Label>End Date</Form.Label>
              <div style={{ position: "relative" }}>
                <Form.Control
                  type="text"
                  className="filter-height"
                  placeholder="dd/mm/yyyy"
                  value={
                    filters.endDate
                      ? formatDate(parseDate(filters.endDate))
                      : ""
                  }
                  readOnly
                  ref={endDateInputRef}
                  onClick={() => {
                    if (filters.endDate) {
                      setEndDateValue(parseDate(filters.endDate));
                    }
                    setShowEndDateCalendar((show) => !show);
                  }}
                  style={{ cursor: "pointer", backgroundColor: "#fff" }}
                />
                {filters.endDate ? (
                  <button
                    type="button"
                    onClick={() => {
                      setFilters({ ...filters, endDate: "" });
                      setEndDateValue(null);
                      setShowEndDateCalendar(false);
                    }}
                    style={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 16,
                      color: "#888",
                      padding: 0,
                    }}
                    aria-label="Clear date"
                  >
                    ×
                  </button>
                ) : (
                  <MdCalendarToday
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#888",
                      pointerEvents: "none",
                    }}
                    size={20}
                  />
                )}
                {showEndDateCalendar && (
                  <div
                    ref={endDateCalenderRef}
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "0",
                      zIndex: 9999,
                      background: "#fff",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                      borderRadius: "8px",
                      marginTop: "4px",
                      width: 300,
                      minWidth: 300,
                      maxWidth: 300,
                    }}
                  >
                    <Calendar
                      className="form-control m-0 p-0 border-0"
                      onChange={(selectedDate) => {
                        setEndDateValue(selectedDate);
                        setFilters({
                          ...filters,
                          endDate: toISODate(selectedDate),
                        });
                        setShowEndDateCalendar(false);
                        setCurrentPage(1);
                      }}
                      value={endDateValue}
                      locale="en-GB"
                    />
                  </div>
                )}
              </div>
            </div>
            {userRole !== "B2B Admin" && userRole !== "B2B Member" && (
              <div className="filter-item">
                <Form.Label>Branch</Form.Label>
                <Select
                  className="filter-height"
                  options={[
                    { value: "All", label: "All" },
                    { value: "head_office", label: "Head Office" },
                    ...allBranchOptions,
                  ]}
                  value={
                    [
                      { value: "All", label: "All" },
                      { value: "head_office", label: "Head Office" },
                      ...allBranchOptions,
                    ].find(
                      (option) =>
                        option.value ===
                        (filters.branchId === ""
                          ? "All"
                          : filters.branchId === null
                            ? "head_office"
                            : filters.branchId),
                    ) || null
                  }
                  onChange={async (selectedOption) => {
                    let branchId = null;
                    let showAll = false;

                    if (!selectedOption || selectedOption.value === "All") {
                      showAll = true;
                      branchId = "";
                    } else if (selectedOption.value === "head_office") {
                      showAll = false;
                      branchId = null;
                    } else {
                      showAll = false;
                      branchId = selectedOption.value;
                    }

                    setFilters((prev) => ({
                      ...prev,
                      branchId,
                      showAll,
                      assignRole: "",
                      assignId: "",
                    }));

                    try {
                      const res = await dispatch(
                        getAllRoleList(branchId || "", showAll),
                      );
                      setGetRoleList(res?.data);
                      setAllUser([]);
                    } catch (err) {
                      console.error("Error fetching roles:", err);
                      setGetRoleList([]);
                      setAllUser([]);
                    }
                  }}
                  placeholder="Select Branch"
                  isClearable
                  isSearchable
                  styles={selectStyles}
                  noOptionsMessage={() => "No branches available"}
                />
              </div>
            )}
            <div className="filter-item">
              <Form.Label>Lead Assign Role</Form.Label>
              <Select
                className="filter-height"
                options={filterRoleOptions}
                value={
                  filterRoleOptions?.find(
                    (option) => option.value === filters.assignRole,
                  ) || null
                }
                onChange={(selectedOption) => {
                  const selectedRoleId = selectedOption
                    ? selectedOption.value
                    : null;
                  const selectedRoleName = selectedOption
                    ? selectedOption.label
                    : "";

                  setFilters((prev) => ({
                    ...prev,
                    assignRole: selectedRoleId,
                    assignId: "",
                  }));

                  let selectedBranchId = null;
                  let showAllUsers = false;

                  if (filters.showAll) {
                    showAllUsers = true;
                    selectedBranchId = "";
                  } else if (filters.branchId === null) {
                    selectedBranchId = null;
                    showAllUsers = false;
                  } else if (filters.branchId) {
                    selectedBranchId = filters.branchId;
                    showAllUsers = false;
                  } else {
                    selectedBranchId = userRole === "Branch" ? branchId : null;
                    showAllUsers = false;
                  }

                  if (selectedRoleId && selectedRoleName) {
                    fetchAllUser(
                      selectedRoleId,
                      selectedRoleName,
                      selectedBranchId,
                      showAllUsers,
                    );
                  } else {
                    setAllUser([]);
                  }
                }}
                placeholder="Select Lead Assign Role"
                isClearable
                isSearchable
                styles={selectStyles}
                noOptionsMessage={() => "No roles available"}
              />
            </div>
            <div className="filter-item">
              <Form.Label>Lead Assign</Form.Label>
              <Select
                className="filter-height"
                options={userOptions}
                value={
                  userOptions.find(
                    (option) => option.value === filters.assignId,
                  ) || null
                }
                onChange={(selectedOption) =>
                  setFilters((prev) => ({
                    ...prev,
                    assignId: selectedOption ? selectedOption.value : "",
                  }))
                }
                placeholder="Select Lead Assign"
                isClearable
                isSearchable
                isDisabled={!filters.assignRole}
                styles={selectStyles}
                noOptionsMessage={() => "No users available"}
              />
            </div>
            <div className="filter-item">
              <Form.Label>Country</Form.Label>
              <Select
                className="filter-height"
                styles={selectStyles}
                classNamePrefix="select"
                value={
                  filters.country
                    ? {
                        value: filters.country,
                        label:
                          leadCountries.find((c) => c === filters.country) ||
                          filters.country,
                      }
                    : null
                }
                onChange={(selected) => {
                  setFilters({
                    ...filters,
                    country: selected ? selected.value : "",
                  });
                  setCurrentPage(1);
                }}
                options={leadCountries.map((country) => ({
                  value: country,
                  label: country,
                }))}
                placeholder="Select Country"
                isClearable
                isSearchable
                noOptionsMessage={() => "No countries available"}
              />
            </div>
            <div className="filter-item">
              <Form.Label>Follow Up Type</Form.Label>
              <Select
                className="filter-height"
                styles={selectStyles}
                classNamePrefix="select"
                value={
                  filters.followUpType
                    ? followUpTypeOptions.find(
                        (option) => option.value === filters.followUpType,
                      )
                    : null
                }
                onChange={(selected) => {
                  setFilters({
                    ...filters,
                    followUpType: selected ? selected.value : "",
                  });
                  setCurrentPage(1);
                }}
                options={followUpTypeOptions}
                placeholder="Select Type"
                isClearable
                isSearchable
                noOptionsMessage={() => "No countries available"}
              />
            </div>
            <div className="filter-item">
              <Form.Label>Status</Form.Label>
              <Select
                styles={selectStyles}
                classNamePrefix="select"
                value={
                  filters.status
                    ? {
                        value: filters.status,
                        label: filters.status,
                      }
                    : null
                }
                onChange={(option) => {
                  const statusValue = option ? option.value : "";
                  setFilters({
                    ...filters,
                    status: statusValue,
                    subStatus: "",
                  });
                  setCurrentPage(1);

                  if (statusValue) {
                    fetchLeadSubStatus(statusValue);
                  } else {
                    setLeadSubStatus([]);
                  }
                }}
                options={leadStatus?.map((item) => ({
                  value: item.name,
                  label: item.name,
                }))}
                placeholder="Select Status"
                isClearable
              />
            </div>
            {/* <div className="filter-item">
              <Form.Label>Sub status</Form.Label>
              <Select
                styles={selectStyles}
                classNamePrefix="select"
                value={
                  filters.subStatus
                    ? {
                        value: filters.subStatus,
                        label: filters.subStatus,
                      }
                    : null
                }
                onChange={(option) => {
                  setFilters({
                    ...filters,
                    subStatus: option ? option.value : "",
                  });
                  setCurrentPage(1);
                }}
                options={leadSubStatusOptions}
                placeholder="Select Sub Status"
                isClearable
                isDisabled={!filters.status || leadSubStatus.length === 0}
              />
            </div> */}
            <div className="filter-item">
              <Form.Label>Lead From</Form.Label>
              <Select
                className="filter-height"
                value={
                  leadFrom?.includes(filters.lead_from)
                    ? {
                        value: filters.lead_from,
                        label: filters.lead_from,
                      }
                    : null
                }
                onChange={(selected) => {
                  setFilters({
                    ...filters,
                    lead_from: selected ? selected.value : "",
                  });
                  setCurrentPage(1);
                }}
                options={
                  leadFrom?.length > 0
                    ? leadFrom?.map((item) => ({
                        value: item,
                        label: item,
                      }))
                    : []
                }
                placeholder="Select From"
                isClearable
                styles={selectStyles}
                noOptionsMessage={() => "No lead sources available"}
              />
            </div>
            <div className="filter-item">
              <Form.Label>Activity</Form.Label>
              <Select
                className="filter-height"
                styles={selectStyles}
                classNamePrefix="select"
                value={
                  filters.leadActivity
                    ? {
                        value: filters.leadActivity,
                        label: filters.leadActivity,
                      }
                    : null
                }
                onChange={(option) => {
                  setFilters({
                    ...filters,
                    leadActivity: option ? option.value : "",
                  });
                  setCurrentPage(1);
                }}
                options={leadStatusOption?.map((item) => ({
                  value: item.value,
                  label: item.label,
                }))}
                placeholder="Select Activity"
                isClearable
              />
            </div>{" "}
            <div className="filter-item">
              <Form.Label>Other Service</Form.Label>
              <Select
                className="filter-height"
                styles={selectStyles}
                classNamePrefix="select"
                value={
                  filters.otherService
                    ? allOther.find(
                        (option) => option.value === filters.otherService,
                      )
                    : null
                }
                onChange={(option) => {
                  setFilters({
                    ...filters,
                    otherService: option ? option.value : "",
                  });
                  setCurrentPage(1);
                }}
                options={allOther?.map((item) => ({
                  value: item._id,
                  label: item.name,
                }))}
                placeholder="Select Other Service"
                isClearable
              />
            </div>
            <div className="filter-item">
              <Form.Label>Updated On</Form.Label>

              <div style={{ position: "relative" }}>
                <Form.Control
                  type="text"
                  className="filter-height"
                  placeholder="dd/mm/yyyy"
                  value={
                    filters.updatedOn
                      ? formatDate(parseDate(filters.updatedOn))
                      : ""
                  }
                  ref={updatedOnInputRef}
                  readOnly
                  onClick={() => {
                    if (filters.updatedOn) {
                      setUpdatedOnValue(parseDate(filters.updatedOn));
                    }
                    setShowUpdatedOnCalendar((prev) => !prev);
                  }}
                  style={{ cursor: "pointer", backgroundColor: "#fff" }}
                />

                {filters.updatedOn ? (
                  <button
                    type="button"
                    onClick={() => {
                      setFilters({ ...filters, updatedOn: "" });
                      setUpdatedOnValue(null);
                      setShowUpdatedOnCalendar(false);
                      setCurrentPage(1);
                    }}
                    style={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      fontSize: 16,
                      cursor: "pointer",
                      color: "#888",
                    }}
                  >
                    ×
                  </button>
                ) : (
                  <MdCalendarToday
                    size={20}
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#888",
                      pointerEvents: "none",
                    }}
                  />
                )}

                {showUpdatedOnCalendar && (
                  <div
                    ref={updatedOnCalenderRef}
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      zIndex: 9999,
                      background: "#fff",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                      borderRadius: "8px",
                      marginTop: "4px",
                      width: 300,
                    }}
                  >
                    <Calendar
                      className="form-control m-0 p-0 border-0"
                      locale="en-GB"
                      value={updatedOnValue}
                      onChange={(date) => {
                        setFilters({
                          ...filters,
                          updatedOn: toISODate(date),
                        });
                        setUpdatedOnValue(date);
                        setShowUpdatedOnCalendar(false);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-grow-1"></div>
            <div className="filter-item-rows">
              <ItemsPerPageSelect
                itemsPerPage={itemsPerPage}
                onChange={handleItemsPerPageChange}
              />
            </div>
            <div className="d-flex align-items-center">
              <div className="filter-item filter-height total-records px-3 d-flex align-items-center">
                <span>
                  Total Records: <strong>{totalRecords}</strong>
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default LeadFilters;
