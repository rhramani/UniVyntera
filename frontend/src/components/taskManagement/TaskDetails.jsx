import { useEffect, useState } from "react";
import { Button, Form, Row, Col, Card, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import Select from "react-select";
import { AiOutlineClose } from "react-icons/ai";
import { MdCalendarToday } from "react-icons/md";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import usePermissions from "../commonComponents/usePermissions";
import Paginations from "../elements/Paginations";
import {
  createTaskDetails,
  deleteTaskDetails,
  getAllTaskDetails,
  updateTaskDetails,
} from "../../redux/actions/TaskManagement/TaskDetails.action";

import Pageheader from "../../layouts/Pageheader";
import LoadMoreButton from "../commonComponents/LoadMoreButton";
import { getAllBranch } from "../../redux/actions/Branch.action";
import { getAllRoleList } from "../../redux/actions/Master/Role.action";
import { adminGetAll } from "../../redux/actions/Admin.action";
import { decryptData } from "../../utils/encryptionUtils";
import { getAllCategory } from "../../redux/actions/Master/TaskManagementMaster/TaskCategory.action";
import { getAllPriority } from "../../redux/actions/Master/TaskManagementMaster/TaskPriority.action";
import { getAllType } from "../../redux/actions/Master/TaskManagementMaster/TaskType.action";
import { getAllTaskStatus } from "../../redux/actions/Master/TaskManagementMaster/TaskStatus.action";
import DataTable from "../commonComponents/DataTable";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ViewModal from "../commonComponents/ViewModal";
import { BASEURL } from "../../baseUrl";
import DeleteConfirmModal from "../bulkMessage/commonDeleteModal/DeleteConfirmModal";

const TaskDetails = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [categoryList, setCategory] = useState([]);
  const [priorityList, setPriority] = useState([]);
  const [taskStatuses, setTaskStatuses] = useState([]);
  const [typeList, setType] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [show, setShow] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // Dropdown states
  const [roleOptions, setRoleOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [filterRoleOptions, setFilterRoleOptions] = useState([]);
  const [filterUserOptions, setFilterUserOptions] = useState([]);
  const [allBranchOptions, setAllBranchOptions] = useState([]);
  const [showDueDateCalendar, setShowDueDateCalendar] = useState(false);
  const [dueDateValue, setDueDateValue] = useState(null);
  const [existingTaskDoc, setExistingTaskDoc] = useState(null);

  const [taskDocPreview, setTaskDocPreview] = useState(null);
  const [originalTaskData, setOriginalTaskData] = useState(null);

  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Task Details");

  const handleCloseUploadModal = () => {
    setShowDeleteModal(false);
    setSelectedItem(null);
  };

  const branchId = decryptData(localStorage.getItem("userId"));
  const branchUserId = decryptData(localStorage.getItem("branchId"));
  const userRole = decryptData(localStorage.getItem("role"));
  const userRoleId = decryptData(localStorage.getItem("roleId"));
  const userType = decryptData(localStorage.getItem("userType"));

  const [filters, setFilters] = useState({
    branchId:
      userRole === "Branch"
        ? branchId
        : userType === "Branch User"
          ? branchUserId
          : "",
    showAll: true,
    role: "",
    user: "",
    status: "",
    category: "",
    priority: "",
    type: "",
  });

  useEffect(() => {
    fetchCategorys(1, 1000);
    fetchPriorities(1, 1000);
    fetchTypes(1, 1000);
    fetchTaskStatuses("");
  }, []);

  const fetchCategorys = async (
    page = 1,
    limit = itemsPerPage,
    searchTerm = "",
  ) => {
    setIsLoading(true);
    try {
      const res = await dispatch(getAllCategory(page, limit, searchTerm));
      const responseData = res?.data?.data || {};
      setCategory(responseData?.data || []);
      setTotalRecords(responseData?.totalRecords || 0);
      setTotalPages(responseData?.totalPages || 0);
    } catch (error) {
      setCategory([]);
      setTotalRecords(0);
      setTotalPages(0);
      toast.error(
        error?.response?.data?.message || "Failed to fetch categorys.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPriorities = async (
    page = 1,
    limit = itemsPerPage,
    searchTerm = "",
  ) => {
    setIsLoading(true);
    try {
      const res = await dispatch(getAllPriority(page, limit, searchTerm));
      const responseData = res?.data?.data || {};
      setPriority(responseData?.data || []);
      setTotalRecords(responseData?.totalRecords || 0);
      setTotalPages(responseData?.totalPages || 0);
    } catch (error) {
      setPriority([]);
      setTotalRecords(0);
      setTotalPages(0);
      toast.error(
        error?.response?.data?.message || "Failed to fetch priorities.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTypes = async (
    page = 1,
    limit = itemsPerPage,
    searchTerm = "",
  ) => {
    setIsLoading(true);
    try {
      const res = await dispatch(getAllType(page, limit, searchTerm));
      const responseData = res?.data?.data || {};
      setType(responseData?.data || []);
      setTotalRecords(responseData?.totalRecords || 0);
      setTotalPages(responseData?.totalPages || 0);
    } catch (error) {
      setType([]);
      setTotalRecords(0);
      setTotalPages(0);
      toast.error(error?.response?.data?.message || "Failed to fetch types.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTaskStatuses = async (searchTerm) => {
    try {
      const res = await dispatch(getAllTaskStatus(searchTerm));
      if (res?.status === 200 || res?.data?.code === 200) {
        setTaskStatuses(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching task statuses:", error);
      toast.error("Failed to load task statuses");
    }
  };

  const categoryOptions = categoryList.map((c) => ({
    value: c._id,
    label: c.name,
  }));

  const priorityOptions = priorityList.map((p) => ({
    value: p._id,
    label: p.name,
  }));

  const typeOptions = typeList.map((t) => ({
    value: t._id,
    label: t.name,
  }));

  const statusOptions = taskStatuses.map((s) => ({
    value: s._id,
    label: s.name,
  }));

  // Fetch branches
  const fetchAllBranches = async () => {
    try {
      const res = await dispatch(getAllBranch());
      const apiBranches = res?.data?.data?.data || res?.data?.data || [];

      const dynamicBranches = apiBranches.map((branch) => ({
        value: branch._id,
        label: branch.name || "Unnamed Branch",
      }));

      setAllBranchOptions(dynamicBranches);
    } catch (error) {
      console.error("Error fetching branches:", error);
      toast.error("Failed to load branches");
      setAllBranchOptions([]);
    }
  };

  // Fetch roles by branch - for MODAL (form)
  const fetchFormRolesByBranch = async (branchId, showAll = false) => {
    try {
      let branchIdToUse = branchId;
      let showAllToUse = showAll;

      // Special handling for Head Office
      if (branchId === null) {
        branchIdToUse = ""; // Head Office should send empty string
        showAllToUse = false;
      }

      // If branchId is a real branch (not null, not All), showAll = false
      if (branchId && branchId !== null) {
        showAllToUse = false;
      }

      // If All branches (branchId === ""), showAll = true
      if (branchId === "" || branchId === undefined) {
        showAllToUse = true;
      }

      const res = await dispatch(
        getAllRoleList(branchIdToUse, showAllToUse), // ← showAll pass करें
      );

      const roles = res?.data?.data || [];

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
      toast.warn("Failed to load roles");
      setRoleOptions([]);
    }
  };

  // Fetch roles by branch - for FILTER section
  const fetchFilterRolesByBranch = async (branchId, showAll = false) => {
    try {
      let branchIdToUse = branchId;
      let showAllToUse = showAll;

      if (branchId === null) {
        branchIdToUse = ""; // Head Office should send empty string
        showAllToUse = false;
      }

      if (branchId && branchId !== null) {
        showAllToUse = false;
      }

      if (branchId === "" || branchId === undefined) {
        showAllToUse = true;
      }
      const res = await dispatch(getAllRoleList(branchIdToUse, showAllToUse));

      const roles = res?.data?.data || [];

      if (roles.length === 0) {
        setFilterRoleOptions([]);
        return;
      }

      const mappedRoles = roles.map((role) => ({
        value: role._id,
        label: role.name,
      }));

      setFilterRoleOptions(mappedRoles);
    } catch (error) {
      console.error("Error fetching roles (filters):", error);
      toast.warn("Failed to load roles");
      setFilterRoleOptions([]);
    }
  };

  // Fetch users — same as fetchAllUser in FormModal
  const fetchUsersByRoleAndBranch = async (
    roleId,
    roleName,
    branchId,
    showAll = false,
    isForFilter = false,
  ) => {
    if (!roleId) {
      if (isForFilter) {
        setFilterUserOptions([]);
      } else {
        setUserOptions([]);
      }
      return;
    }

    try {
      const branchIdToUse = branchId === null ? undefined : branchId;
      const res = await dispatch(
        adminGetAll(1, 1000, "", roleName, branchIdToUse, showAll),
      );
      const users = res?.data?.data?.data || [];

      if (users.length === 0) {
        if (isForFilter) {
          setFilterUserOptions([]);
        } else {
          setUserOptions([]);
        }
        toast.info("No users found for this role/branch");
        return;
      }

      const mappedUsers = users.map((user) => ({
        value: user._id,
        label: user.name || user.email || "Unnamed User",
      }));

      if (isForFilter) {
        setFilterUserOptions(mappedUsers);
      } else {
        setUserOptions(mappedUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      if (isForFilter) {
        setFilterUserOptions([]);
      } else {
        setUserOptions([]);
      }
    }
  };

  // Handle Branch Change — same as in FormModal
  const handleBranchChange = async (branchValue) => {
    formik.setFieldValue("role", "");
    formik.setFieldValue("user", []);
    setUserOptions([]);
    setRoleOptions([]);

    let showAllForRoles = branchValue === null ? false : false; // Head Office या branch → false
    if (!branchValue && branchValue !== null) showAllForRoles = true;

    await fetchFormRolesByBranch(branchValue, showAllForRoles);
  };

  // Fetch tasks

  const fetchTasks = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    showAll = false,
    branchId = "",
    role = "",
    user = "",
    status = null,
    category = null,
    priority = null,
    type = null,
  ) => {
    try {
      const res = await dispatch(
        getAllTaskDetails(
          page,
          limit,
          search,
          showAll,
          branchId,
          role,
          user,
          status,
          category,
          priority,
          type,
        ),
      );
      const data = res?.data?.data;
      setAllTasks(data?.data || []);
      setTotalPages(data?.totalPages || 0);
      setTotalRecords(data?.totalRecords || 0);
    } catch (error) {
      setAllTasks([]);
      setTotalPages(0);
      setTotalRecords(0);
    }
  };

  useEffect(() => {
    fetchTasks(
      currentPage,
      itemsPerPage,
      search,
      filters.showAll,
      filters.branchId,
      filters.role,
      filters.user,
      filters.status,
      filters.category,
      filters.priority,
      filters.type,
    );
  }, [currentPage, itemsPerPage, search, filters]);

  useEffect(() => {
    if (filters.branchId !== "") {
      const branchToUse = filters.branchId === null ? null : filters.branchId;
      const showAllToUse = filters.showAll;

      fetchFilterRolesByBranch(branchToUse, showAllToUse);
    } else {
      // If "All Branches", load all roles for filters
      dispatch(getAllRoleList("", true)).then((res) => {
        const roles = res?.data?.data || [];
        setFilterRoleOptions(
          roles.map((r) => ({ value: r._id, label: r.name })),
        );
      });
    }
  }, [filters.branchId]);

  useEffect(() => {
    fetchAllBranches();
  }, [dispatch]);

  const handleItemsPerPageChange = (newItems) => {
    setItemsPerPage(newItems);
    setCurrentPage(1);
  };
  const getChangedFields = (original, updated) => {
    const changed = {};

    const normalize = (val) => {
      if (val === null || val === undefined) return "";
      if (Array.isArray(val)) return JSON.stringify(val);
      return val;
    };

    Object.keys(updated).forEach((key) => {
      const originalVal = normalize(original?.[key]);
      const updatedVal = normalize(updated?.[key]);

      if (originalVal !== updatedVal) {
        changed[key] = updated[key];
      }
    });

    return changed;
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      branch: null,
      role: "",
      user: [],
      dueDate: "",
      dueTime: "",
      category: null,
      priority: null,
      type: null,
      status: null,
      remarks: "",
      taskDoc: null,
      id: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Task Title is required"),
      description: Yup.string().required("Description is required"),
      type: Yup.string().required("Task Type is required"),
      priority: Yup.string().required("Priority is required"),
      branch: Yup.mixed().nullable(),
      role: Yup.string(),
      user: Yup.array(),
      taskDoc: Yup.mixed().nullable(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);

      const resolvedBranch =
        userRole === "Branch"
          ? branchId
          : userType === "Branch User"
            ? branchUserId
            : values.branch;

      const resolvedRole =
        userType === "Branch User" ? userRoleId : values.role;

      const resolvedUser =
        userType === "Branch User" ? [branchId] : values.user;

      try {
        /* ===============================
         🔹 UPDATED VALUES (RESOLVED)
      =============================== */
        const updatedValues = {
          title: values.title?.trim(),
          description: values.description?.trim(),
          branch: resolvedBranch || null,
          role: resolvedRole,
          user: resolvedUser,
          dueDate: values.dueDate || "",
          dueTime: values.dueTime || "",
          category: values.category || "",
          priority: values.priority || "",
          type: values.type || "",
          status: values.status || "",
          remarks: values.remarks || "",
          document: values.taskDoc || null,
        };

        /* ===============================
         🔹 ONLY CHANGED FIELDS (EDIT MODE)
      =============================== */
        let payload = updatedValues;

        if (values.id) {
          const changedFields = getChangedFields(
            originalTaskData,
            updatedValues,
          );

          if (Object.keys(changedFields).length === 0) {
            toast.info("No changes detected");
            setIsLoading(false);
            return;
          }

          payload = changedFields;
        }

        /* ===============================
         🔹 FormData (ONLY payload fields)
      =============================== */
        const formData = new FormData();

        Object.keys(payload).forEach((key) => {
          if (key === "user") {
            formData.append("user", JSON.stringify(payload.user));
          } else if (key === "document" && payload.document) {
            formData.append("taskDoc", payload.document);
          } else {
            formData.append(key, payload[key]);
          }
        });

        /* ===============================
         🔹 API CALL
      =============================== */
        if (values.id) {
          await dispatch(updateTaskDetails(formData, values.id));
          toast.success("Task updated successfully");
        } else {
          await dispatch(createTaskDetails(formData));
          toast.success("Task created successfully");
        }

        resetForm();
        setOriginalTaskData(null);
        handleClose();

        fetchTasks(
          currentPage,
          itemsPerPage,
          search,
          filters.showAll,
          filters.branchId,
          filters.role,
          filters.user,
          filters.status,
          filters.category,
          filters.priority,
          filters.type,
        );
      } catch (err) {
        toast.error("Failed to save task");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const { values, setFieldValue } = formik;

  const handleShow = async () => {
    let branchForRoles = null;

    if (userRole === "Branch") {
      formik.setFieldValue("branch", branchId);
      branchForRoles = branchId;
    } else if (userType === "Branch User") {
      formik.setFieldValue("branch", branchUserId);
      formik.setFieldValue("role", userRoleId);
      formik.setFieldValue("user", [branchId]);
      branchForRoles = branchUserId || branchId;
    } else {
      // Head office / admin – keep current branch value (can be null = head office)
      branchForRoles = values.branch === undefined ? null : values.branch;
    }

    await fetchFormRolesByBranch(branchForRoles, false);

    setShow(true);
  };

  // Initial load of form roles so Role * dropdown is populated when opening modal
  useEffect(() => {
    let initialBranchForRoles = null;

    if (userRole === "Branch") {
      initialBranchForRoles = branchId;
    } else if (userType === "Branch User") {
      initialBranchForRoles = branchUserId || branchId;
    } else {
      initialBranchForRoles = null; // Head Office / global roles
    }

    fetchFormRolesByBranch(initialBranchForRoles, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (showViewModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showViewModal]);

  const handleView = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleClose = async () => {
    setShow(false);

    setShowViewModal(false);
    setSelectedItem(null);

    formik.setFieldValue("branch", null);
    formik.setFieldValue("role", "");
    formik.setFieldValue("user", []);
    formik.resetForm();
    setExistingTaskDoc(null);
    setRoleOptions([]);
    setUserOptions([]);

    await fetchFormRolesByBranch(null);
  };

  const handleEdit = (task) => {
    const branchIdForTask =
      task.branch && task.branch._id ? task.branch._id : task.branch || null;

    formik.setValues({
      title: task.title || "",
      description: task.description || "",
      branch: branchIdForTask,
      role: task.role?._id || task.role || "",
      user: (task.user || []).map((u) => u._id || u),
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      dueTime: task.dueTime || "",
      category: task.category?._id || null,
      priority: task.priority?._id || null,
      type: task.type?._id || null,
      status: task.status?._id || null,
      remarks: task.remarks || "",
      taskDoc: null,
      id: task._id,
    });
    setOriginalTaskData({
      title: task.title || "",
      description: task.description || "",
      branch: task.branch?._id || null,
      role: task.role?._id || "",
      user: (task.user || []).map((u) => u._id),
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      dueTime: task.dueTime || "",
      category: task.category?._id || "",
      priority: task.priority?._id || "",
      type: task.type?._id || "",
      status: task.status?._id || "",
      remarks: task.remarks || "",
      document: task.document || null,
    });
    // Preload roles & users
    fetchFormRolesByBranch(branchIdForTask);
    if (task.role) {
      const roleId = task.role._id || task.role;
      const roleName = (typeof task.role === "object" && task.role.name) || "";

      fetchUsersByRoleAndBranch(
        roleId,
        roleName,
        branchIdForTask,
        false,
        false,
      );
    }
    setExistingTaskDoc(task.document || null);
    setTaskDocPreview(null);
    setShow(true);
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "12px",
      color: "black",
    }),
    placeholder: (base) => ({
      ...base,
      color: "black",
      fontSize: "13px",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  // Helpers for Due Date display/parse
  const formatUIDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseAPIDateToDate = (value) => {
    // value expected as "YYYY-MM-DD"
    if (!value) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const handleDelete = async (loan) => {
    setIsLoading(true);
    try {
      const res = await dispatch(deleteTaskDetails(loan._id));
      if (res?.data?.code === 200) toast.success("Task deleted");

      fetchTasks(
        currentPage,
        itemsPerPage,
        search,
        filters.showAll,
        filters.branchId,
        filters.role,
        filters.user,
        filters.status,
        filters.category,
        filters.priority,
        filters.type,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (statusName) => {
    const status = taskStatuses.find((item) => item._id === statusName);
    return status?.color || "#ccc";
  };

  const columns = [
    {
      label: "Task Title",
      key: "title",
    },
    {
      label: "Category",
      render: (row) => row.category?.name || "-",
    },
    {
      label: "Type",
      render: (row) => row.type?.name || "-",
    },
    {
      label: "Priority",
      render: (row) => <span>{row.priority?.name || "-"}</span>,
    },
    {
      label: "Status",
      render: (row) => (
        <span
          style={{
            backgroundColor: getStatusColor(row.status?._id),
            padding: "4px 10px",
            borderRadius: "12px",
            color: "#fff",
            fontSize: "12px",
            display: "inline-block",
          }}
        >
          {row.status?.name || "-"}
        </span>
      ),
    },
    {
      label: "Description",
      key: "description",
      isLongText: true,
    },
  ];
  const renderActions = (item, index) => (
    <div className="d-flex">
      <IconButton
        aria-label="more"
        aria-controls={`menu-${index}`}
        aria-haspopup="true"
        onClick={(e) => {
          setOpenDropdown(openDropdown === index ? null : index);
          setAnchorEl(e.currentTarget);
        }}
      >
        <MoreVertIcon className="three-dots-icon" />
      </IconButton>
      <Menu
        id={`menu-${index}`}
        anchorEl={anchorEl}
        open={openDropdown === index}
        onClose={() => setOpenDropdown(null)}
        MenuListProps={{
          "aria-labelledby": `menu-${index}`,
        }}
        sx={{
          "& .MuiPaper-root": {
            minWidth: "150px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        {canUpdate && (
          <MenuItem
            onClick={() => {
              handleEdit(item);
              setOpenDropdown(null);
            }}
          >
            <EditIcon fontSize="small" sx={{ mr: 1 }} className="edit-icon" />
            <span className="edit-action-text">Edit</span>
          </MenuItem>
        )}
        {canDelete && (
          <MenuItem
            onClick={() => {
              setSelectedItem(item);
              setShowDeleteModal(true);
              setOpenDropdown(null);
            }}
          >
            <DeleteIcon
              fontSize="small"
              sx={{ mr: 1 }}
              className="delete-icon"
            />
            <span className="delete-action-text">Delete</span>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            handleView(item);
            setOpenDropdown(null);
          }}
        >
          <VisibilityIcon
            fontSize="small"
            sx={{ mr: 1 }}
            className="view-icon"
          />
          <span className="view-action-text">View</span>
        </MenuItem>
      </Menu>
    </div>
  );
  const taskSections = [
    {
      title: "Basic Information",
      fields: [
        { label: "Task Title", key: "title" },
        { label: "Description", key: "description" },
        {
          label: "Status",
          render: (data) => data.status?.name || "N/A",
        },
        {
          label: "Priority",
          render: (data) => data.priority?.name || "N/A",
        },
        {
          label: "Category",
          render: (data) => data.category?.name || "N/A",
        },
        {
          label: "Type",
          render: (data) => data.type?.name || "N/A",
        },
      ],
    },
    {
      title: "Assignment Details",
      fields: [
        {
          label: "Branch",
          render: (data) => (data.branch ? data.branch.name : "Head Office"),
        },
        {
          label: "Role",
          render: (data) => data.role?.name || "N/A",
        },
        {
          label: "Assigned Users",
          render: (data) =>
            data.user?.length ? data.user.map((u) => u.name).join(", ") : "N/A",
        },
      ],
    },
    {
      title: "Due Date,Time & Remarks",
      fields: [
        {
          label: "Due Date",
          render: (data) => formatUIDate(data.dueDate) || "N/A",
        },
        {
          label: "Due Time",
          render: (data) => data.dueTime || "N/A",
        },
        {
          label: "Remarks",
          render: (data) => data.remarks || "-",
        },
      ],
    },
    {
      title: "Document",
      fields: [
        {
          label: "Task Document",
          render: (data) => {
            if (
              !data?.document ||
              data.document === "null" ||
              data.document === ""
            ) {
              return "N/A";
            }

            const docUrl = `${BASEURL}/${data.document}`;

            return isImageFile(data.document) ? (
              <img
                src={docUrl}
                alt="Task Document"
                style={{
                  width: "100%",
                  maxHeight: "250px",
                  objectFit: "contain",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "6px",
                  background: "#fafafa",
                }}
              />
            ) : (
              <a
                href={docUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary fw-semibold"
              >
                📄 View Document
              </a>
            );
          },
        },
      ],
    },
  ];

  const isImageFile = (filePath) => {
    if (!filePath) return false;
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);
  };

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <LoadMoreButton isLoading={isLoading} />
        </div>
      )}

      <Pageheader
        mainheading="Task Details"
        parentfolder="Home"
        activepage="Task Details"
      />

      <Row className="mt-5 row-sm">
        <Col md={12}>
          <Card className="custom-card">
            <Card.Header className="d-flex justify-content-between align-items-center border-bottom-0">
              <div className="d-flex align-items-center">
                <div className="card-title">Task Details</div>
              </div>
              <div className="d-flex flex-wrap align-items-center gap-2">
                <div className="filter-item">
                  <div className="contact-search3 d-flex align-items-center border rounded-pill">
                    <button type="button" className="btn border-0">
                      <i
                        className="fe fe-search fw-semibold text-muted"
                        aria-hidden="true"
                      ></i>
                    </button>
                    <Form.Control
                      type="text"
                      className="filter-height border-0"
                      placeholder="Search here..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>
                {canCreate && (
                  <Button
                    variant="primary"
                    className="custom-select-height ms-2"
                    onClick={() => handleShow("")}
                  >
                    Add Task
                  </Button>
                )}
              </div>
            </Card.Header>

            <Card.Body>
              <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
                {userRole !== "Branch" && (
                  <div className="filter-item">
                    <Form.Label>Branch</Form.Label>
                    <Select
                      className="custom-select-height"
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
                        const value = selectedOption
                          ? selectedOption.value
                          : null;

                        let branchId = null;
                        let showAll = false;

                        if (!value || value === "All") {
                          branchId = "";
                          showAll = true;
                        } else if (selectedOption.value === "head_office") {
                          branchId = null;
                          showAll = false;
                        } else {
                          branchId = value;
                          showAll = false;
                        }

                        setFilters({
                          ...filters,
                          branchId,
                          showAll,
                        });
                        setCurrentPage(1);
                        fetchFilterRolesByBranch(branchId, showAll);
                      }}
                      placeholder="Select Branch"
                      isClearable
                      isSearchable
                      classNamePrefix="custom-select"
                      styles={selectStyles}
                      noOptionsMessage={() => "No branches available"}
                    />
                  </div>
                )}

                <div className="filter-item">
                  <Form.Label>Role</Form.Label>
                  <Select
                    options={filterRoleOptions}
                    value={
                      filterRoleOptions.find(
                        (opt) => opt.value === filters.role,
                      ) || null
                    }
                    onChange={(selected) => {
                      const roleId = selected ? selected.value : "";
                      const roleName = selected ? selected.label : "";

                      setFilters({
                        ...filters,
                        role: roleId,
                        user: "",
                      });
                      setFilterUserOptions([]);
                      setCurrentPage(1);

                      if (roleId && roleName) {
                        const branchIdToUse =
                          filters.branchId === "" ? null : filters.branchId;
                        const showAllToUse = filters.showAll;

                        fetchUsersByRoleAndBranch(
                          roleId,
                          roleName,
                          branchIdToUse,
                          showAllToUse,
                          true,
                        );
                      } else {
                        setFilterUserOptions([]);
                      }
                    }}
                    placeholder="Select Role"
                    isClearable
                    isSearchable
                    styles={selectStyles}
                  />
                </div>

                <div className="filter-item">
                  <Form.Label>User</Form.Label>
                  <Select
                    options={filterUserOptions}
                    value={
                      filterUserOptions.find(
                        (opt) => opt.value === filters.user,
                      ) || null
                    }
                    onChange={(selected) => {
                      setFilters({
                        ...filters,
                        user: selected ? selected.value : "",
                      });
                      setCurrentPage(1);
                    }}
                    placeholder="Select User"
                    isClearable
                    isSearchable
                    styles={selectStyles}
                    noOptionsMessage={() =>
                      filters.role ? "No users found" : "Select role first"
                    }
                  />
                </div>

                {/* Status Filter */}
                <div className="filter-item">
                  <Form.Label>Status</Form.Label>
                  <Select
                    options={statusOptions}
                    value={
                      statusOptions.find(
                        (opt) => opt.value === filters.status,
                      ) || null
                    }
                    onChange={(selected) => {
                      setFilters({
                        ...filters,
                        status: selected ? selected.value : "",
                      });
                      setCurrentPage(1);
                    }}
                    placeholder="Select Status"
                    isClearable
                    isSearchable
                    styles={selectStyles}
                  />
                </div>

                {/* Category Filter */}
                <div className="filter-item">
                  <Form.Label>Category</Form.Label>
                  <Select
                    options={categoryOptions}
                    value={
                      categoryOptions.find(
                        (opt) => opt.value === filters.category,
                      ) || null
                    }
                    onChange={(selected) => {
                      setFilters({
                        ...filters,
                        category: selected ? selected.value : null,
                      });
                      setCurrentPage(1);
                    }}
                    placeholder="Select Category"
                    isClearable
                    styles={selectStyles}
                  />
                </div>

                {/* Priority Filter */}
                <div className="filter-item">
                  <Form.Label>Priority</Form.Label>
                  <Select
                    options={priorityOptions}
                    value={
                      priorityOptions.find(
                        (opt) => opt.value === filters.priority,
                      ) || null
                    }
                    onChange={(selected) => {
                      setFilters({
                        ...filters,
                        priority: selected ? selected.value : "",
                      });
                      setCurrentPage(1);
                    }}
                    placeholder="Select Priority"
                    isClearable
                    styles={selectStyles}
                  />
                </div>

                {/* Type Filter */}
                <div className="filter-item">
                  <Form.Label>Type</Form.Label>
                  <Select
                    options={typeOptions}
                    value={
                      typeOptions.find((opt) => opt.value === filters.type) ||
                      null
                    }
                    onChange={(selected) => {
                      setFilters({
                        ...filters,
                        type: selected ? selected.value : "",
                      });
                      setCurrentPage(1);
                    }}
                    placeholder="Select Type"
                    isClearable
                    styles={selectStyles}
                  />
                </div>

                <div className="flex-grow-1"></div>
                <div>
                  <ItemsPerPageSelect
                    itemsPerPage={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                  />
                </div>

                <div className="custom-select-height border px-3 mt-2 mt-md-0 d-flex align-items-center h-6">
                  <span>
                    Total Records: <strong>{totalRecords}</strong>
                  </span>
                </div>
              </div>

              <ViewModal
                show={showViewModal}
                onHide={handleClose}
                title="Task Details"
                data={selectedItem}
                fields={taskSections}
              />

              <DataTable
                columns={columns}
                data={allTasks}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                canEdit={canUpdate}
                canDelete={canDelete}
                canRead={canRead}
                onEdit={(row) => handleEdit(row)}
                onDelete={(row) => handleDelete(row)}
                actionView={true}
                showNoColumn={true}
                itemsPerPageOptions={true}
                renderActions={renderActions}
              />

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Paginations
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header className="form-main-heading">
          <Modal.Title>
            {formik.values.id ? "Update Task Details" : "Add Task Details"}
          </Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={handleClose}
          />
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <Form onSubmit={formik.handleSubmit}>
            <Row className="mb-3">
              {/* Task Title */}
              <Col md={4} className="mb-3">
                <Form.Group controlId="title">
                  <Form.Label className="fw-semibold">Task Title *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Task Title"
                    className="custom-select-height"
                    {...formik.getFieldProps("title")}
                  />
                  {formik.touched.title && formik.errors.title && (
                    <div className="text-danger small mt-1">
                      {formik.errors.title}
                    </div>
                  )}
                </Form.Group>
              </Col>
              {/* Task Description */}
              <Col md={8} className="mb-3">
                <Form.Group controlId="description">
                  <Form.Label className="fw-semibold">
                    Task Description *
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Enter Description"
                    className="rounded-4"
                    {...formik.getFieldProps("description")}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <div className="text-danger small mt-1">
                      {formik.errors.description}
                    </div>
                  )}
                </Form.Group>
              </Col>
              {!(userRole === "Branch" || userType === "Branch User") && (
                <Col md={4} className="mb-3">
                  <Form.Label>Branch *</Form.Label>
                  <Select
                    className="custom-select-height"
                    options={[
                      { value: "head_office", label: "Head Office" },
                      ...(allBranchOptions || []),
                    ]}
                    value={
                      [
                        { value: "head_office", label: "Head Office" },
                        ...(allBranchOptions || []),
                      ].find(
                        (option) =>
                          option.value ===
                          (values.branch === null
                            ? "head_office"
                            : values.branch),
                      ) || null
                    }
                    onChange={async (selectedOption) => {
                      const selectedBranchValue = selectedOption
                        ? selectedOption.value
                        : null;
                      const branchValueToSet =
                        selectedBranchValue === "head_office"
                          ? null
                          : selectedBranchValue;

                      setFieldValue("branch", branchValueToSet);
                      setFieldValue("role", "");
                      setFieldValue("user", []);

                      await handleBranchChange(branchValueToSet);
                    }}
                    placeholder="Select Branch"
                    isClearable
                    isSearchable
                    classNamePrefix="custom-select"
                    noOptionsMessage={() => "No branches available"}
                    styles={selectStyles}
                  />
                  {formik.touched.branch && formik.errors.branch && (
                    <div className="text-danger small mt-1">
                      {formik.errors.branch}
                    </div>
                  )}
                </Col>
              )}

              {!(userType === "Branch User") && (
                <>
                  <Col md={4} className="mb-3">
                    <Form.Label>Role *</Form.Label>
                    <Select
                      className="custom-select-height"
                      options={roleOptions}
                      value={
                        roleOptions.find(
                          (option) => option.value === values.role,
                        ) || null
                      }
                      onChange={(selectedOption) => {
                        const selectedRoleId = selectedOption
                          ? selectedOption.value
                          : "";
                        const selectedRoleName = selectedOption
                          ? selectedOption.label
                          : "";

                        setFieldValue("role", selectedRoleId);
                        setFieldValue("user", []);

                        let selectedBranchId = null;
                        if (userRole === "Branch") {
                          selectedBranchId = branchId;
                        } else if (userType === "Branch User") {
                          selectedBranchId = branchUserId || branchId;
                        } else {
                          selectedBranchId =
                            values.branch === null ? null : values.branch;
                        }

                        if (selectedRoleId && selectedRoleName) {
                          fetchUsersByRoleAndBranch(
                            selectedRoleId,
                            selectedRoleName, // ← Use label directly
                            selectedBranchId,
                            false,
                          );
                        } else {
                          setUserOptions([]);
                        }
                      }}
                      placeholder="Select Role"
                      isClearable
                      isSearchable
                      classNamePrefix="custom-select"
                      noOptionsMessage={() => "No roles available"}
                      styles={selectStyles}
                    />
                    {formik.touched.role && formik.errors.role && (
                      <div className="text-danger small mt-1">
                        {formik.errors.role}
                      </div>
                    )}
                  </Col>

                  <Col md={4} className="mb-3">
                    <Form.Label>User *</Form.Label>
                    <Select
                      className="custom-select-height"
                      options={userOptions}
                      isMulti
                      value={userOptions.filter((opt) =>
                        values.user.includes(opt.value),
                      )}
                      onChange={(selectedOptions) => {
                        const selectedUserIds = selectedOptions
                          ? selectedOptions.map((opt) => opt.value)
                          : [];
                        setFieldValue("user", selectedUserIds);
                      }}
                      placeholder="Select User"
                      isClearable
                      isSearchable
                      classNamePrefix="custom-select"
                      noOptionsMessage={() => "Select role first"}
                      styles={selectStyles}
                    />
                    {formik.touched.user && formik.errors.user && (
                      <div className="text-danger small mt-1">
                        {formik.errors.user}
                      </div>
                    )}
                  </Col>
                </>
              )}

              {/* Due Date */}
              <Col md={4} className="mb-3">
                <Form.Label className="fw-semibold">Due Date</Form.Label>
                <div style={{ position: "relative" }}>
                  <Form.Control
                    type="text"
                    className="custom-select-height"
                    name="dueDate"
                    placeholder="dd/mm/yyyy"
                    value={formatUIDate(values.dueDate)}
                    readOnly
                    onClick={() => {
                      if (values.dueDate) {
                        setDueDateValue(parseAPIDateToDate(values.dueDate));
                      }
                      setShowDueDateCalendar((show) => !show);
                    }}
                    style={{
                      cursor: "pointer",
                      backgroundColor: "#fff",
                    }}
                  />
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
                  {showDueDateCalendar && (
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
                          setDueDateValue(selectedDate);
                          if (selectedDate) {
                            const yyyy = selectedDate.getFullYear();
                            const mm = String(
                              selectedDate.getMonth() + 1,
                            ).padStart(2, "0");
                            const dd = String(selectedDate.getDate()).padStart(
                              2,
                              "0",
                            );
                            const apiValue = `${yyyy}-${mm}-${dd}`;
                            formik.setFieldValue("dueDate", apiValue);
                          } else {
                            formik.setFieldValue("dueDate", "");
                          }
                          setShowDueDateCalendar(false);
                        }}
                        value={dueDateValue}
                        locale="en-GB"
                      />
                    </div>
                  )}
                </div>
              </Col>
              {/* Due Time */}
              <Col md={4} className="mb-3">
                <Form.Label className="fw-semibold">Due Time</Form.Label>
                <Form.Control
                  type="time"
                  className="rounded-5"
                  {...formik.getFieldProps("dueTime")}
                />
              </Col>
              {/* Category */}
              <Col md={4} className="mb-3">
                <Form.Label className="fw-semibold">Task Category</Form.Label>
                <Select
                  options={categoryOptions}
                  value={
                    categoryOptions.find(
                      (opt) => opt.value === formik.values.category,
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    formik.setFieldValue(
                      "category",
                      selectedOption?.value || "",
                    )
                  }
                  placeholder="Select Category"
                  classNamePrefix="custom-select"
                  isClearable
                  styles={selectStyles}
                />
              </Col>
              {/* priority */}
              <Col md={4} className="mb-3">
                <Form.Label className="fw-semibold">Task Priority *</Form.Label>
                <Select
                  options={priorityOptions}
                  value={
                    priorityOptions.find(
                      (opt) => opt.value === formik.values.priority,
                    ) || null
                  }
                  onChange={(s) =>
                    formik.setFieldValue("priority", s?.value || "")
                  }
                  placeholder="Select Task Priority"
                  classNamePrefix="custom-select"
                  styles={selectStyles}
                />
                {formik.touched.priority && formik.errors.priority && (
                  <div className="text-danger mt-1 small">
                    {formik.errors.priority}
                  </div>
                )}
              </Col>
              {/* type */}
              <Col md={4} className="mb-3">
                <Form.Label className="fw-semibold">Task Type *</Form.Label>
                <Select
                  options={typeOptions}
                  value={
                    typeOptions.find(
                      (opt) => opt.value === formik.values.type,
                    ) || null
                  }
                  onChange={(s) => formik.setFieldValue("type", s?.value || "")}
                  placeholder="Select Task Type"
                  classNamePrefix="custom-select"
                  styles={selectStyles}
                />
                {formik.touched.type && formik.errors.type && (
                  <div className="text-danger mt-1 small">
                    {formik.errors.type}
                  </div>
                )}
              </Col>
              {/* status */}
              <Col md={4} className="mb-3">
                <Form.Label className="fw-semibold">Task Status</Form.Label>
                <Select
                  options={statusOptions}
                  value={
                    statusOptions.find(
                      (opt) => opt.value === formik.values.status,
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    formik.setFieldValue("status", selectedOption?.value || "")
                  }
                  placeholder="Select Status"
                  classNamePrefix="custom-select"
                  isClearable
                  styles={selectStyles}
                />
              </Col>
              {/* Task Document Upload */}
              <Col md={4} className="mb-3">
                <Form.Label className="fw-semibold">Task Document</Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  className="custom-select-height"
                  onChange={(e) => {
                    const file = e.currentTarget.files[0];
                    setFieldValue("taskDoc", file);
                    setTaskDocPreview(file);
                  }}
                />
                {Boolean(existingTaskDoc) &&
                  existingTaskDoc !== "null" &&
                  !taskDocPreview && (
                    <div className="mt-2">
                      {isImageFile(existingTaskDoc) ? (
                        <img
                          src={`${BASEURL}/${existingTaskDoc}`}
                          alt="Task Document"
                          style={{
                            width: "100%",
                            maxHeight: "180px",
                            objectFit: "contain",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "6px",
                            background: "#fafafa",
                          }}
                        />
                      ) : (
                        <a
                          href={`${BASEURL}/${existingTaskDoc}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary fw-semibold"
                        >
                          📄 View Uploaded Document
                        </a>
                      )}
                    </div>
                  )}

                {/* Newly selected document */}
                {taskDocPreview && (
                  <div className="mt-2">
                    {taskDocPreview instanceof File &&
                    taskDocPreview.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(taskDocPreview)}
                        alt="Selected Document"
                        style={{
                          width: "100%",
                          maxHeight: "180px",
                          objectFit: "contain",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          padding: "6px",
                          background: "#fafafa",
                        }}
                      />
                    ) : (
                      <small className="text-success d-block">
                        Selected: {taskDocPreview?.name || taskDocPreview}
                      </small>
                    )}
                  </div>
                )}
              </Col>

              {/* Remarks */}
              <Col md={8} className="mb-3">
                <Form.Label className="fw-semibold">Remarks</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  className="rounded-4"
                  placeholder="Enter Remarks"
                  {...formik.getFieldProps("remarks")}
                />
              </Col>
            </Row>

            <div className="text-end">
              <Button
                variant="primary"
                className="custom-select-height"
                type="submit"
              >
                {formik.values.id ? "Update" : "Add"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <DeleteConfirmModal
        show={showDeleteModal}
        onHide={handleCloseUploadModal}
        onConfirm={() => {
          handleDelete(selectedItem);
          setShowDeleteModal(false);
        }}
      />
    </>
  );
};

export default TaskDetails;
