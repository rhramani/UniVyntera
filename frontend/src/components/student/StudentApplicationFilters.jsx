import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";
import { getAllB2BAdmin } from "../../redux/actions/B2BAdmin.action";
import { getAllRole } from "../../redux/actions/Master/Role.action";
import { adminGetAll } from "../../redux/actions/Admin.action";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdCalendarToday } from "react-icons/md";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";

const StudentApplicationFilters = ({
  selectedBranch,
  userRole,
  userType,
  branchList,
  selectedRole,
  selectedB2BAdmin,
  studentStatusOptions,
  mainStatus,
  preferredCountries,
  selectedCountry,
  followUpDate,
  updatedOnDate,
  allStudentApplication,
  canRead,
  itemsPerPage,
  totalRecords,
  dispatch,
  setItemsPerPage,
  fetchAllStudentApplication,
  selectedFilter,
  search,
  selectedUser,
  setMainStatus,
  setShowAll,
  setSelectedRole,
  setSelectedUser,
  setSelectedBranch,
  setCurrentPage,
  setSelectedCountry,
  setFollowUpDate,
  setSelectedB2BAdmin,
  setUpdatedOnDate,
  formatDate,
  parseDate,
  branchId,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  const [roleOptions, setRoleOptions] = useState([]);
  const [b2BAdminList, setB2BAdminList] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [showUpdatedOnCalendar, setShowUpdatedOnCalendar] = useState(false);
  const [updatedOnValue, setUpdatedOnValue] = useState(null);
  const updatedOnInputRef = useRef(null);
  const updatedOnCalenderRef = useRef(null);

  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);

  const [startDateValue, setStartDateValue] = useState(null);
  const [endDateValue, setEndDateValue] = useState(null);

  const startDateInputRef = useRef(null);
  const endDateInputRef = useRef(null);

  const startDateCalenderRef = useRef(null);
  const endDateCalenderRef = useRef(null);

  const [showFollowUpDateCalendar, setShowFollowUpDateCalendar] =
    useState(false);
  const [followUpDateValue, setFollowUpDateValue] = useState(null);
  const followUpDateInputRef = useRef(null);

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

  const isToday = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  const toISODate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      const branchId = selectedBranch === "all" ? "" : selectedBranch || "";
      const newShowAll = selectedBranch === "all" ? true : showAll;
      fetchAllStudentApplication(
        1,
        newItemsPerPage,
        selectedFilter?.value || "",
        search,
        mainStatus?.value || "",
        branchId,
        newShowAll,
        selectedCountry?.value || "",
        followUpDate,
        selectedB2BAdmin?.value || "",
        updatedOnDate,
        selectedRole,
        selectedUser || "",
        startDate,
        endDate
      );
    }
  };

  const handleStudentStatusChange = (selectedOption) => {
    setMainStatus(selectedOption);
    const isAllBranch = selectedBranch === "all";
    const newShowAll = isAllBranch ? true : false;
    setShowAll(newShowAll);

    fetchAllStudentApplication(
      1,
      itemsPerPage,
      selectedFilter?.value || "",
      search,
      selectedOption?.value || "",
      selectedBranch === "all" ? "" : selectedBranch || "",
      newShowAll,
      selectedCountry?.value || "",
      followUpDate,
      selectedB2BAdmin?.value || "",
      updatedOnDate,
      selectedRole,
      selectedUser.length > 0 ? selectedUser?.join(",") : "",
      startDate,
      endDate
    );
  };

  const fetchRolesByBranch = async (branchId, showAll = false) => {
    try {
      const res = await dispatch(getAllRole(1, 1000, "", branchId, showAll));

      const roles = res?.data?.data?.data || [];

      if (roles.length === 0) {
        setRoleOptions([]);
        return;
      }

      const mappedRoles = roles.map((role) => ({
        value: role._id,
        label: role.name,
      }));

      setRoleOptions(mappedRoles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setRoleOptions([]);
    }
  };

  useEffect(() => {
    if (selectedBranch === "all") {
      fetchRolesByBranch("", true);
    } else if (selectedBranch === "") {
      fetchRolesByBranch("", false);
    } else if (selectedBranch) {
      fetchRolesByBranch(selectedBranch, false);
    }
  }, [selectedBranch]);

  const handleBranchChangeForFilters = (branchValue) => {
    setSelectedRole("");
    setSelectedUser("");
    setUserOptions([]);
  };

  const fetchUsersByRoleAndBranch = async (
    roleId,
    roleName,
    branchId,
    showAll = false
  ) => {
    if (!roleId) {
      setUserOptions([]);
      return;
    }

    try {
      const branchIdToUse = branchId === null ? undefined : branchId;
      const res = await dispatch(
        adminGetAll(1, 1000, "", roleName, branchIdToUse, showAll)
      );
      const users = res?.data?.data?.data || [];

      if (users.length === 0) {
        setUserOptions([]);
        return;
      }

      const mappedUsers = users.map((user) => ({
        value: user._id,
        label: user.name || user.email || "Unnamed User",
      }));

      setUserOptions(mappedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUserOptions([]);
    }
  };

  const fetchAllB2BAdmin = async () => {
    try {
      const res = await dispatch(getAllB2BAdmin(1, 10000, "", "", "", ""));
      const responseData = res?.data?.data;
      setB2BAdminList(responseData?.data || []);
    } catch (error) {
      console.log("Error fetching branches:", error);
      setB2BAdminList([]);
    }
  };

  useEffect(() => {
    fetchAllB2BAdmin();
  }, []);

  return (
    <>
      <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
        <>
        {userRole !== "LeadStudent" && (
          <>
          <div className="filter-item">
            <Form.Label>Start Date</Form.Label>
            <div style={{ position: "relative" }}>
              <Form.Control
                type="text"
                className="filter-height"
                placeholder="dd/mm/yyyy"
                value={startDate ? formatDate(parseDate(startDate)) : ""}
                readOnly
                ref={startDateInputRef}
                onClick={() => {
                  if (startDate) {
                    setStartDateValue(parseDate(startDate));
                  }
                  setShowStartDateCalendar((show) => !show);
                }}
                style={{ cursor: "pointer", backgroundColor: "#fff" }}
              />
              {startDate ? (
                <button
                  type="button"
                  onClick={() => {
                    setStartDate("");
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
                      setStartDate(toISODate(selectedDate));
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
                value={endDate ? formatDate(parseDate(endDate)) : ""}
                readOnly
                ref={endDateInputRef}
                onClick={() => {
                  if (endDate) {
                    setEndDateValue(parseDate(endDate));
                  }
                  setShowEndDateCalendar((show) => !show);
                }}
                style={{ cursor: "pointer", backgroundColor: "#fff" }}
              />
              {endDate ? (
                <button
                  type="button"
                  onClick={() => {
                    setEndDate("");
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
                      setEndDate(toISODate(selectedDate));
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
          </>
        )}
          {userRole === "Super Admin" && userType === "user" && (
            <div className="filter-item">
              <Form.Label>Branch</Form.Label>
              <Select
                className="filter-height"
                styles={{
                  control: (base) => ({
                    ...base,
                    fontSize: "13px",
                  }),
                }}
                placeholder="Select Branch"
                classNamePrefix="custom-select"
                options={[
                  { value: "all", label: "All" },
                  { value: "", label: "Head Office" },
                  ...(Array.isArray(branchList)
                    ? branchList
                        .filter((branch) => {
                          if (userRole === "Branch") {
                            return branch._id === branchId;
                          }
                          return branch.name && branch.name.trim() !== "";
                        })
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((branch) => ({
                          value: branch._id,
                          label: branch.name,
                        }))
                    : []),
                ]}
                value={
                  selectedBranch !== null && selectedBranch !== undefined
                    ? {
                        value: selectedBranch,
                        label:
                          selectedBranch === "all"
                            ? "All"
                            : selectedBranch === ""
                            ? "Head Office"
                            : branchList.find(
                                (branch) => branch._id === selectedBranch
                              )?.name || "Select Branch",
                      }
                    : null
                }
                onChange={async (selectedOption) => {
                  const branchValue = selectedOption?.value || "";
                  setSelectedBranch(branchValue);

                  setSelectedRole("");
                  setSelectedUser("");
                  setUserOptions([]);
                  setRoleOptions([]);

                  let newShowAll = false;
                  let branchId = "";

                  if (branchValue === "all") {
                    newShowAll = true;
                    branchId = "";
                  } else if (branchValue === "") {
                    newShowAll = false;
                    branchId = "";
                  } else {
                    newShowAll = false;
                    branchId = branchValue;
                  }

                  setShowAll(newShowAll);

                  handleBranchChangeForFilters(branchValue);

                  if (canRead) {
                    fetchAllStudentApplication(
                      1,
                      itemsPerPage,
                      selectedFilter?.value || "",
                      search,
                      mainStatus?.value || "",
                      branchId,
                      newShowAll,
                      selectedCountry?.value || "",
                      followUpDate,
                      selectedB2BAdmin?.value || "",
                      updatedOnDate,
                      "",
                      "",
                      startDate,
                      endDate
                    );
                  }
                  setCurrentPage(1);
                }}
              />
            </div>
          )}

          {userRole === "Super Admin" && userType === "user" && (
            <div className="filter-item">
              <Form.Label>Role</Form.Label>
              <Select
                className="filter-height"
                options={roleOptions}
                value={
                  roleOptions.find((opt) => opt.value === selectedRole) || null
                }
                onChange={(selectedOption) => {
                  const roleId = selectedOption ? selectedOption.value : "";
                  const roleName = selectedOption ? selectedOption.label : "";

                  setSelectedRole(roleId);
                  setSelectedUser("");
                  setUserOptions([]);
                  setCurrentPage(1);

                  if (roleId && roleName) {
                    let branchIdForUsers = "";
                    let showAllForUsers = false;

                    if (selectedBranch === "all") {
                      branchIdForUsers = "";
                      showAllForUsers = true;
                    } else if (selectedBranch === "") {
                      branchIdForUsers = "";
                      showAllForUsers = false;
                    } else {
                      branchIdForUsers = selectedBranch;
                      showAllForUsers = false;
                    }

                    fetchUsersByRoleAndBranch(
                      roleId,
                      roleName,
                      branchIdForUsers,
                      showAllForUsers
                    );
                  }

                  if (!roleId && canRead) {
                    const branchId =
                      selectedBranch === "all" ? "" : selectedBranch || "";
                    const newShowAll =
                      selectedBranch === "all" ? true : showAll;
                    fetchAllStudentApplication(
                      1,
                      itemsPerPage,
                      selectedFilter?.value || "",
                      search,
                      mainStatus?.value || "",
                      branchId,
                      newShowAll,
                      selectedCountry?.value || "",
                      followUpDate,
                      selectedB2BAdmin?.value || "",
                      updatedOnDate,
                      "",
                      "",
                      startDate,
                      endDate
                    );
                  }
                }}
                placeholder="Select Role"
                isClearable
                isSearchable
                classNamePrefix="custom-select"
                styles={{
                  placeholder: (base) => ({
                    ...base,
                    fontSize: "13px",
                  }),
                }}
              />
            </div>
          )}

          {userRole === "Super Admin" && userType === "user" && (
            <div className="filter-item">
              <Form.Label>
                User {selectedRole && <span className="text-danger">*</span>}
              </Form.Label>
              <Select
                className="filter-height"
                options={userOptions}
                value={
                  userOptions.find((opt) => opt.value === selectedUser) || null
                }
                onChange={(selectedOption) => {
                  const userId = selectedOption ? selectedOption.value : "";
                  setSelectedUser(userId);
                  setCurrentPage(1);

                  if (canRead) {
                    const branchId =
                      selectedBranch === "all" ? "" : selectedBranch || "";
                    const newShowAll =
                      selectedBranch === "all" ? true : showAll;
                    fetchAllStudentApplication(
                      1,
                      itemsPerPage,
                      selectedFilter?.value || "",
                      search,
                      mainStatus?.value || "",
                      branchId,
                      newShowAll,
                      selectedCountry?.value || "",
                      followUpDate,
                      selectedB2BAdmin?.value || "",
                      updatedOnDate,
                      selectedRole,
                      userId || "",
                      startDate,
                      endDate
                    );
                  }
                }}
                placeholder={
                  selectedRole ? "Select User *" : "Select role first"
                }
                isClearable
                isSearchable
                classNamePrefix="custom-select"
                styles={{
                  placeholder: (base) => ({
                    ...base,
                    fontSize: "13px",
                  }),
                }}
                noOptionsMessage={() =>
                  selectedRole ? "No users found" : "Select role first"
                }
                isDisabled={!selectedRole}
              />
            </div>
          )}
        </>

        {(userRole === "Super Admin" || userType === "user") && (
          <div className="filter-item">
            <Form.Label>B2B Admin</Form.Label>
            <Select
              className="filter-height"
              styles={{
                control: (base) => ({
                  ...base,
                  fontSize: "13px",
                }),
              }}
              placeholder="Select B2B Admin"
              classNamePrefix="custom-select"
              options={[
                ...(Array.isArray(b2BAdminList)
                  ? b2BAdminList
                      .filter(
                        (admin) =>
                          admin.companyName && admin.companyName.trim() !== ""
                      )
                      .sort((a, b) =>
                        a.companyName.localeCompare(b.companyName)
                      )
                      .map((admin) => ({
                        value: admin._id,
                        label: admin.companyName,
                      }))
                  : []),
              ]}
              value={selectedB2BAdmin}
              onChange={(selectedOption) => {
                setSelectedB2BAdmin(selectedOption);
                setCurrentPage(1);
                if (canRead) {
                  const branchId =
                    selectedBranch === "all" ? "" : selectedBranch || "";
                  const newShowAll = selectedBranch === "all" ? true : showAll;
                  fetchAllStudentApplication(
                    1,
                    itemsPerPage,
                    selectedFilter?.value || "",
                    search,
                    mainStatus?.value || "",
                    branchId,
                    newShowAll,
                    selectedCountry?.value || "",
                    followUpDate,
                    selectedOption?.value === "all"
                      ? ""
                      : selectedOption?.value || "",
                    updatedOnDate,
                    selectedRole,
                    selectedUser || "",
                    startDate,
                    endDate
                  );
                }
              }}
              isClearable
            />
          </div>
        )}
        {userRole !== "Student" && userRole !== "LeadStudent" && (
          <>
            <div className="filter-item">
              <Form.Label>Status</Form.Label>
              <Select
                className="filter-height"
                options={studentStatusOptions}
                value={mainStatus}
                onChange={handleStudentStatusChange}
                placeholder="Select Status"
                classNamePrefix="custom-select"
                isClearable
                styles={{
                  placeholder: (base) => ({
                    ...base,
                    fontSize: "13px",
                  }),
                }}
              />
            </div>

            <div className="filter-item">
              <Form.Label>Country</Form.Label>
              <Select
                className="filter-height"
                options={preferredCountries?.map((c) => ({
                  value: c.name,
                  label: c.name,
                }))}
                placeholder="Select Country"
                classNamePrefix="custom-select"
                isClearable
                value={selectedCountry}
                onChange={(selectedOption) => {
                  setSelectedCountry(selectedOption);
                  setCurrentPage(1);
                  if (canRead) {
                    const branchId =
                      selectedBranch === "all" ? "" : selectedBranch || "";
                    const newShowAll =
                      selectedBranch === "all" ? true : showAll;
                    fetchAllStudentApplication(
                      1,
                      itemsPerPage,
                      selectedFilter?.value || "",
                      search,
                      mainStatus?.value || "",
                      branchId,
                      newShowAll,
                      selectedOption?.value || "",
                      followUpDate,
                      selectedB2BAdmin?.value || "",
                      updatedOnDate,
                      selectedRole,
                      selectedUser || "",
                      startDate,
                      endDate
                    );
                  }
                }}
                styles={{
                  placeholder: (base) => ({
                    ...base,
                    fontSize: "13px",
                  }),
                }}
              />
            </div>

            <div className="filter-item">
              <Form.Label>Follow Up Date</Form.Label>
              <div style={{ position: "relative" }}>
                <Form.Control
                  type="text"
                  className="filter-height"
                  placeholder="dd/mm/yyyy"
                  value={
                    followUpDate ? formatDate(parseDate(followUpDate)) : ""
                  }
                  readOnly
                  ref={followUpDateInputRef}
                  onClick={() => {
                    if (followUpDate) {
                      setFollowUpDateValue(parseDate(followUpDate));
                    }
                    setShowFollowUpDateCalendar((show) => !show);
                  }}
                  style={{ cursor: "pointer", backgroundColor: "#fff" }}
                />
                {followUpDate ? (
                  <button
                    type="button"
                    onClick={() => {
                      setFollowUpDate("");
                      setFollowUpDateValue(null);
                      setShowFollowUpDateCalendar(false);
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
                {showFollowUpDateCalendar && (
                  <div
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
                        setFollowUpDateValue(selectedDate);
                        setFollowUpDate(toISODate(selectedDate));
                        setShowFollowUpDateCalendar(false);
                        setCurrentPage(1);
                      }}
                      value={followUpDateValue}
                      locale="en-GB"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="filter-item">
              <Form.Label>Updated On</Form.Label>

              <div style={{ position: "relative" }}>
                <Form.Control
                  type="text"
                  className="filter-height"
                  placeholder="dd/mm/yyyy"
                  value={
                    updatedOnDate ? formatDate(parseDate(updatedOnDate)) : ""
                  }
                  readOnly
                  ref={updatedOnInputRef}
                  onClick={() => {
                    if (updatedOnDate) {
                      setUpdatedOnValue(parseDate(updatedOnDate));
                    }
                    setShowUpdatedOnCalendar((show) => !show);
                  }}
                  style={{ cursor: "pointer", backgroundColor: "#fff" }}
                />

                {updatedOnDate ? (
                  <button
                    type="button"
                    onClick={() => {
                      setUpdatedOnDate("");
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
                        setUpdatedOnValue(date);
                        setUpdatedOnDate(toISODate(date));
                        setShowUpdatedOnCalendar(false);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="filter-item">
              {allStudentApplication?.some((student) =>
                isToday(student.followUps?.personalDetails?.nextFollowUpDate)
              ) && (
                <Button
                  variant="primary"
                  className="custom-select-height"
                  onClick={() => {
                    const today = new Date();
                    setFollowUpDateValue(today);
                    setFollowUpDate(toISODate(today));
                    setCurrentPage(1);
                  }}
                >
                  Today Followup
                </Button>
              )}
            </div>

            <div className="flex-grow-1"></div>

            {canRead && (
              <>
                <div className="filter-item-rows">
                  <ItemsPerPageSelect
                    itemsPerPage={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                  />
                </div>

                <div className="d-flex align-items-center">
                  <div className="filter-item filter-height total-records px-3 d-flex align-items-center">
                    <span>
                      Total Records :<strong>&nbsp;{totalRecords}</strong>
                    </span>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};
export default StudentApplicationFilters;
