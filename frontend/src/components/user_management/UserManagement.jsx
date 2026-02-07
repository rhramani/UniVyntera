import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Table,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import Pageheader from "../../layouts/Pageheader";
import { AiOutlineClose } from "react-icons/ai";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect, useRef, useState } from "react";
import DataTable from "../commonComponents/DataTable";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  adminDelete,
  adminGetAll,
  adminRegister,
  adminUpdate,
} from "../../redux/actions/Admin.action";
import { getAllRole } from "../../redux/actions/Master/Role.action";
import Select from "react-select";
import {
  countryDropdown,
  stateDropdown,
} from "../../redux/actions/Master/Institute.action";
import "react-phone-input-2/lib/bootstrap.css";
import PhoneInput from "react-phone-input-2";
import usePermissions from "../commonComponents/usePermissions";
import LoadMoreButton from "../commonComponents/LoadMoreButton";
import { decryptData } from "../../utils/encryptionUtils";
import { getAllBranch } from "../../redux/actions/Branch.action";
import { FaPlus, FaMinus } from "react-icons/fa";
import { getAllB2BAdmin } from "../../redux/actions/B2BAdmin.action";
import { countryCodeISO } from "../../utils/countryISOCode";
import Calendar from "react-calendar";
import { MdCalendarToday } from "react-icons/md";

const UserManagement = () => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const branchID = decryptData(localStorage.getItem("userId"));
  const userRole = decryptData(localStorage.getItem("role"));
  const userType = decryptData(localStorage.getItem("userType"));
  const [allUser, setAllUser] = useState([]);
  const [roleDropDown, setRoleDropDown] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(
    userRole === "Super Admin" ? "all" : ""
  );
  const [role, setRole] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [countries, setCountries] = useState([]);
  const [stateDropDown, setStateDropDown] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("User Management");
  const [B2BAdminList, setB2BAdminList] = useState([]);
    const [showBirthdayDateCalendar, setShowBirthdayDateCalendar] =
    useState(false);
  const [birthdayDateValue, setBirthdayDateValue] = useState(null);
  const birthdayDateInputRef = useRef(null);
  const birthdayDateCalenderRef = useRef(null);
  const [showJoiningDateCalendar, setShowJoiningDateCalendar] = useState(false);
  const [joiningDateValue, setJoiningDateValue] = useState(null);
  const joiningDateInputRef = useRef(null);
  const joiningDateCalenderRef = useRef(null);

  const handleShow = () => {
    setShow(true);
    formik.resetForm();
  };
  const handleClose = () => {
    setShow(false);
    fetchRolesForBranch();
  };

  const [openDropdown, setOpenDropdown] = useState(null);
  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  const filteredOptions = roleDropDown
    ?.filter((role) => role.name !== "B2B Admin" && role.name !== "B2B Member")
    ?.sort((a, b) => a.name?.localeCompare(b.name))
    ?.map((role) => ({
      value: role.name,
      label: role.name,
    }));

  const toggleDropdown = (index) => {
    setOpenDropdown((prev) => (prev === index ? null : index));
  };

  const columns = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    {
      label: "Branch",
      key: "branchId",
      render: (item) => item?.branchId?.name || "-",
    },
    { label: "Role", key: "role", render: (item) => item?.role?.name || "-" },
    { label: "Status", key: "status" },
    {
      label: "Country",
      render: (item) => {
        const countryList = [];
        if (item && Array.isArray(item.country) && item.country.length > 0) {
          countryList.push(...item.country);
        }
        if (item?.branchId?.country) {
          countryList.push(item.branchId.country);
        }

        const displayCountry =
          countryList.length > 0 ? countryList.join(", ") : "-";

        return (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{displayCountry}</Tooltip>}
          >
            <span style={{ cursor: "pointer" }}>{displayCountry}</span>
          </OverlayTrigger>
        );
      },
    },
    {
      label: "State",
      render: (item) => (item.branchId ? item?.branchId?.state : "-"),
    },
    {
      label: "City",
      render: (item) => (item.branchId ? item?.branchId?.city : "-"),
    },
    {
      label: "B2B Country",
      render: (item) => {
        const countryList = [];

        if (
          item &&
          Array.isArray(item.b2bCountry) &&
          item.b2bCountry.length > 0
        ) {
          countryList.push(...item.b2bCountry);
        }

        return countryList.length > 0 ? countryList.join(", ") : "-";
      },
    },
    {
      label: "B2B State",
      render: (item) => {
        const stateList = [];

        if (item && Array.isArray(item.b2bState) && item.b2bState.length > 0) {
          stateList.push(...item.b2bState);
        }

        return stateList.length > 0 ? stateList.join(", ") : "-";
      },
    },
    {
      label: "Allowed IPs",
      render: (item) =>
        item.allowedIps?.length > 0 ? item.allowedIps?.join(", ") : "-",
    },
    {
      label: "Address",
      render: (item) => (item.branchId ? item?.branchId?.address : "-"),
    },
    {
      label: "Date of Birth",
      key: "BirthdayDate",
      render: (data) =>
        data.birthdayDate
          ? new Date(data.birthdayDate).toLocaleDateString()
          : "-",
    },
    {
      label: "Joining Date",
      key: "JoiningDate",
      render: (data) =>
        data.joiningDate
          ? new Date(data.joiningDate).toLocaleDateString()
          : "-",
    },
    {
      label: "CREATED BY",
      render: (item) => (item.created_by ? item?.created_by?.name : "-"),
    },
    {
      label: "UPDATED BY",
      render: (item) => (item.updatedByName ? item?.updatedByName : "-"),
    },
  ];

  const fetchRolesForBranch = async (branchId = "", showAll = true) => {
    const res = await dispatch(
      getAllRole(
        1,
        100,
        "",
        userRole === "Branch" ? branchID : branchId,
        showAll
      )
    );
    setRoleDropDown(res?.data?.data?.data || []);
  };

  const fetchAllB2BAdmin = async () => {
    try {
      const res = await dispatch(getAllB2BAdmin(1, 10000, "", "", "", ""));
      const responseData = res?.data?.data;
      setB2BAdminList(responseData?.data || []);
    } catch (error) {
      console.log("Error fetching B2B admins:", error);
      setB2BAdminList([]);
    }
  };
  useEffect(() => {
    fetchCountries();
    fetchAllBranches();
    fetchAllB2BAdmin();
    // …
  }, []);

  const handleBranchChangeInForm = (selectedOption) => {
    const branchId = selectedOption ? selectedOption.value : "";
    formik.setFieldValue("branchId", branchId);

    if (userRole === "Super Admin") {
      fetchRolesForBranch(branchId, false);
    }
  };
  // const fetchRole = async (branchId = "", showAll = false) => {
  //   const res = await dispatch(
  //     getAllRole(
  //       1,
  //       100,
  //       "",
  //       userRole === "Branch" ? branchID : branchId,
  //       showAll
  //     )
  //   );
  //   setRoleDropDown(res?.data?.data?.data || []);
  // };

  const fetchCountries = async () => {
    const res = await dispatch(countryDropdown());
    setCountries(res?.data?.data || []);
  };

  const fetchAllBranches = async () => {
    try {
      const res = await dispatch(getAllBranch(1, 100, ""));
      const responseData = res?.data?.data;
      setBranchList(responseData?.data || []);
    } catch (error) {
      console.log("Error fetching branches:", error);
      setBranchList([]);
    }
  };

  const fetchAllUser = async (
    search = "",
    role = "",
    branchId = "",
    showAll = false
  ) => {
    try {
      const res = await dispatch(
        adminGetAll(
          currentPage,
          "",
          search,
          role,
          userRole === "Branch" ? branchID : branchId,
          showAll
        )
      );
      const responseData = res?.data?.data;
      setAllUser(responseData?.data || []);
      setTotalRecords(responseData?.totalRecords || 0);
    } catch (error) {
      console.log("Error fetching users:", error);
      setAllUser([]);
      setTotalRecords(0);
    }
  };

  useEffect(() => {
    fetchRolesForBranch();
    // fetchRole();
    fetchCountries();
    fetchAllBranches();

    if (canRead) {
      let showAll = false;
      let branchId = userRole === "Branch" ? branchID : selectedBranch;

      if (selectedBranch === "all") {
        showAll = true;
        branchId = "";
      } else if (selectedBranch === "") {
        showAll = false;
        branchId = "";
      }

      fetchAllUser(search, role, branchId, showAll);
    }
  }, [currentPage, canRead]);
  // useEffect(() => {
  //   fetchRole();
  //   fetchCountries();
  //   fetchAllBranches();
  //   if (canRead) {
  //     fetchAllUser(search, role, userRole === "Branch" ? branchID : "", false);
  //   }
  // }, [currentPage, search, role, branchID, userRole, canRead]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      branchId: userRole === "Branch" ? branchID : null,
      role: "",
      status: "",
      password: "",
      country: [],
      assignedB2B: [],
      viewB2BStudentApplication: false,
      whichB2BStudentApplication: "countrywise",
      viewSpecificB2B: false,
      b2bCountry: [],
      b2bState: [],
      restrictByIp: false,
      allowedIps: [""],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().required("Email is required"),
      phone: Yup.string().required("Phone is required"),
      branchId: Yup.string().test(
        "branch-required",
        "Please select a branch or Head Office",
        function (value) {
          const { userRole } = this.options.context || {};
          if (userRole !== "Super Admin") return true;
          return value != undefined;
        }
      ),
      role: Yup.string().required("Role is required"),
      status: Yup.string().required("Status is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .max(15, "Password must be at most 15 characters"),
      country: Yup.array().of(Yup.string()),
      assignedB2B: Yup.array().of(Yup.string()),
      b2bCountry: Yup.array()
        .of(Yup.string())
        .when("viewSpecificB2B", {
          is: true,
          then: (schema) =>
            schema
              .min(1, "At least one B2B country is required")
              .required("B2B country is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
      b2bState: Yup.array()
        .of(Yup.string())
        .when("viewSpecificB2B", {
          is: true,
          then: (schema) =>
            schema
              .min(1, "At least one B2B state is required")
              .required("B2B state is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        toast.dismiss();
        const payload = {
          name: values.name,
          email: values.email,
          phone: values.phone,
          ...(values.branchId && { branchId: values.branchId }),
          ...(userRole === "Branch" && { branchId: branchID }),
          role: values.role,
          status: values.status,
          country: values.country || [],
          assignedB2B: values.assignedB2B || [],
          viewB2BStudentApplication: values.viewB2BStudentApplication,
          whichB2BStudentApplication: values.whichB2BStudentApplication,
          viewSpecificB2B: values.viewSpecificB2B,
          b2bCountry: values.b2bCountry || [],
          b2bState: values.b2bState || [],
          birthdayDate: values.birthdayDate,
          joiningDate: values.joiningDate,
          restrictByIp: values.restrictByIp,
          allowedIps: values.restrictByIp
            ? values.allowedIps.filter((ip) => ip.trim() !== "")
            : [],
          ...(userRole === "Branch" && { branchId: branchID }),
        };
        if (values.password && values.password.trim()) {
          payload.password = values.password;
        }
        if (values.id && canUpdate) {
          const res = await dispatch(adminUpdate(payload, values.id));
          if (res?.data?.code === 200) {
            toast.success("User updated successfully");
          }
        } else if (canCreate) {
          const res = await dispatch(adminRegister(payload));
          if (res?.data?.code === 201) {
            toast.success("User added successfully");
          }
        }
        handleClose();
        resetForm();
        if (canRead) {
          let showAll = false;
          let branchId = userRole === "Branch" ? branchID : selectedBranch;
          if (selectedBranch === "all") {
            showAll = true;
            branchId = "";
          } else if (selectedBranch === "") {
            showAll = false;
            branchId = "";
          }
          fetchAllUser(search, role, branchId, showAll);
        }
        // if (canRead) {
        //   fetchAllUser(
        //     search,
        //     role,
        //     userRole === "Branch" ? branchID : selectedBranch
        //   );
        // }
      } catch (error) {
        toast.dismiss();
        toast.error(error?.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleEdit = (item) => {
    if (canUpdate) {
      try {
        formik.setValues({
          id: item._id,
          name: item?.name,
          email: item?.email,
          phone: item?.phone,
          branchId: item?.branchId?._id || "",
          role: item?.role?._id,
          status: item?.status,
          country: item?.country || [],
          assignedB2B: item?.assignedB2B || [],
          password: "",
          viewB2BStudentApplication: item?.viewB2BStudentApplication || false,
          whichB2BStudentApplication:
            item?.whichB2BStudentApplication || "countrywise",
          viewSpecificB2B: item?.viewSpecificB2B || false,
          b2bCountry: item?.b2bCountry || [],
          b2bState: item?.b2bState || [],
          birthdayDate: item?.birthdayDate,
          joiningDate: item?.joiningDate,
          restrictByIp: item?.restrictByIp || false,
          allowedIps: item?.allowedIps?.length > 0 ? item.allowedIps : [""],
        });

        if (userRole === "Super Admin" && item?.branchId?._id) {
          fetchRolesForBranch(item.branchId._id, false);
        }

        setShow(true);
      } catch (error) {
        console.log("Edit error:", error);
      }
    }
  };

  const handleDelete = async (item) => {
    try {
      toast.dismiss();
      const res = await dispatch(adminDelete(item._id));
      if (res?.data?.code === 200) {
        toast.success("User deleted successfully");
      }
      if (canRead) {
        let showAll = false;
        let branchId = userRole === "Branch" ? branchID : selectedBranch;
        if (selectedBranch === "all") {
          showAll = true;
          branchId = "";
        } else if (selectedBranch === "") {
          showAll = false;
          branchId = "";
        }
        fetchAllUser(search, role, branchId, showAll);
      }
      // if (canRead) {
      //   fetchAllUser(
      //     search,
      //     role,
      //     userRole === "Branch" ? branchID : selectedBranch
      //   );
      // }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showBirthdayDateCalendar &&
        birthdayDateInputRef.current &&
        !birthdayDateInputRef.current.contains(event.target) &&
        birthdayDateCalenderRef.current &&
        !birthdayDateCalenderRef.current.contains(event.target)
      ) {
        setShowBirthdayDateCalendar(false);
      }
      if (
        showJoiningDateCalendar &&
        joiningDateInputRef.current &&
        !joiningDateInputRef.current.contains(event.target) &&
        joiningDateCalenderRef.current &&
        !joiningDateCalenderRef.current.contains(event.target)
      ) {
        setShowJoiningDateCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showBirthdayDateCalendar, showJoiningDateCalendar]);

  const [filters, setFilters] = useState({
    birthdayDate: "",
    joiningDate: "",
  });

  const formatDate = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      return new Date(`${year}-${month}-${day}`);
    }
    if (dateStr.includes("-")) {
      return new Date(dateStr);
    }
    return null;
  };

  // Helper to get yyyy-mm-dd for API/backend
  const toISODate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleCountryChange = async (countryIsoCode) => {
    try {
      formik.setFieldValue("country", [countryIsoCode]);
      formik.setFieldValue("state", "");
      setStateDropDown([]);
      const selectedCountry = countries.find((c) => c.name === countryIsoCode);
      const res = await dispatch(stateDropdown(selectedCountry?.isoCode));
      const data = res?.data?.data;
      setStateDropDown(data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleB2BCountryChange = async (countryIsoCodes) => {
    try {
      setStateDropDown([]); // Clear existing states
      if (!countryIsoCodes || countryIsoCodes.length === 0) {
        return;
      }

      // Fetch states for all selected countries
      const statePromises = countryIsoCodes.map(async (countryName) => {
        const selectedCountry = countries.find((c) => c.name === countryName);
        if (selectedCountry?.isoCode) {
          const res = await dispatch(stateDropdown(selectedCountry.isoCode));
          return res?.data?.data || [];
        }
        return [];
      });

      // Wait for all state API calls to resolve
      const statesArray = await Promise.all(statePromises);
      // Flatten and deduplicate states (if needed)
      const combinedStates = statesArray.flat();
      setStateDropDown(combinedStates);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      setStateDropDown([]);
    }
  };
  const handleApplicationCountryChange = async (countryIsoCode) => {
    try {
      formik.setFieldValue("country", [countryIsoCode]);
      formik.setFieldValue("state", []);
      setStateDropDown([]);
      const selectedCountry = countries.find((c) => c.name === countryIsoCode);
      const res = await dispatch(stateDropdown(selectedCountry?.isoCode));
      const data = res?.data?.data;
      setStateDropDown(data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const addIpField = () => {
    formik.setFieldValue("allowedIps", [...formik.values.allowedIps, ""]);
  };

  const removeIpField = (index) => {
    const newIps = formik.values.allowedIps.filter((_, i) => i !== index);
    formik.setFieldValue("allowedIps", newIps.length > 0 ? newIps : [""]);
  };

  useEffect(() => {
    if (
      show &&
      formik.values.viewSpecificB2B &&
      Array.isArray(formik.values.b2bCountry)
    ) {
      handleB2BCountryChange(formik.values.b2bCountry);
    } else {
      setStateDropDown([]);
      formik.setFieldValue("b2bState", []);
    }
  }, [show, formik.values.viewSpecificB2B, formik.values.b2bCountry]);

  return (
    <>
      <Pageheader mainheading="User" parentfolder="Home" activepage="User" />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div className="w-100 d-flex justify-content-end">
                {/* <div className="card-title">User Management</div> */}
                <div className="d-flex flex-wrap align-items-center gap-2">
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
                      placeholder="Search here..."
                      autoComplete="off"
                      value={search}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSearch(value);
                        setCurrentPage(1);

                        let showAll = false;
                        let branchId =
                          userRole === "Branch" ? branchID : selectedBranch;
                        if (selectedBranch === "all") {
                          showAll = true;
                          branchId = "";
                        } else if (selectedBranch === "") {
                          showAll = false;
                          branchId = "";
                        }

                        if (canRead) {
                          fetchAllUser(value, role, branchId, showAll);
                        }
                      }}
                      // onChange={(e) => {
                      //   setSearch(e.target.value);
                      //   setCurrentPage(1);
                      // }}
                    />
                  </div>
                  {(canCreate || canUpdate) && (
                    <div>
                      <Button
                        variant="primary"
                        className="custom-select-height"
                        onClick={handleShow}
                      >
                        Add User
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3 d-flex justify-content-between">
                <Col className="d-flex align-items-end gap-2">
                  {canRead && (
                    <div className="d-flex gap-2">
                      {userRole === "Super Admin" && (
                        <div className="filter-item">
                          <Form.Label>Branch Filter</Form.Label>
                          <Select
                            className="filter-height"
                            styles={{
                              control: (base) => ({
                                ...base,
                                fontSize: "13px",
                                minHeight: "38px",
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
                                        return branch._id === branchID;
                                      }
                                      return (
                                        branch.name && branch.name.trim() !== ""
                                      );
                                    })
                                    .sort((a, b) =>
                                      a.name.localeCompare(b.name)
                                    )
                                    .map((branch) => ({
                                      value: branch._id,
                                      label: branch.name,
                                    }))
                                : []),
                            ]}
                            value={
                              selectedBranch !== null &&
                              selectedBranch !== undefined
                                ? {
                                    value: selectedBranch,
                                    label:
                                      selectedBranch === "all"
                                        ? "All"
                                        : selectedBranch === ""
                                        ? "Head Office"
                                        : branchList.find(
                                            (branch) =>
                                              branch._id === selectedBranch
                                          )?.name || "Select Branch",
                                  }
                                : null
                            }
                            onChange={(selectedOption) => {
                              const branchValue = selectedOption?.value || "";
                              setSelectedBranch(branchValue);
                              let showAll = false;
                              let branchId = "";
                              if (branchValue === "all") {
                                showAll = true;
                                branchId = "";
                              } else if (branchValue === "") {
                                showAll = false;
                                branchId = "";
                              } else {
                                showAll = false;
                                branchId = branchValue;
                              }
                              if (canRead) {
                                fetchAllUser(search, role, branchId, showAll);
                              }
                              fetchRolesForBranch(branchId, showAll);
                            }}
                          />
                        </div>
                      )}
                      <div>
                        <Form.Label>Filter Role</Form.Label>
                        <Select
                          name="role"
                          className="filter-height"
                          classNamePrefix="custom-select"
                          value={
                            filteredOptions.find(
                              (option) => option.value === role
                            ) || null
                          }
                          onChange={(option) => {
                            const newRole = option ? option.value : "";
                            setRole(newRole);

                            let showAll = false;
                            let branchId =
                              userRole === "Branch" ? branchID : selectedBranch;
                            if (selectedBranch === "all") {
                              showAll = true;
                              branchId = "";
                            } else if (selectedBranch === "") {
                              showAll = false;
                              branchId = "";
                            }

                            if (canRead) {
                              fetchAllUser(search, newRole, branchId, showAll);
                            }
                          }}
                          // onChange={(option) =>
                          //   setRole(option ? option.value : "")
                          // }
                          options={filteredOptions}
                          placeholder="Select Role"
                          isClearable
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              width: "200px",
                              height: "38px",
                              fontSize: "13px",
                              borderRadius: "20px",
                            }),
                            menu: (provided) => ({
                              ...provided,
                              width: "200px",
                            }),
                          }}
                        />
                      </div>
                      <div className="filter-item">
                        <Form.Label>Date of Birth</Form.Label>
                        <div style={{ position: "relative" }}>
                          <Form.Control
                            type="text"
                            className="filter-height"
                            placeholder="dd/mm/yyyy"
                            value={
                              filters.birthdayDate
                                ? formatDate(parseDate(filters.birthdayDate))
                                : ""
                            }
                            readOnly
                            ref={birthdayDateInputRef}
                            onClick={() => {
                              if (filters.birthdayDate) {
                                setBirthdayDateValue(
                                  parseDate(filters.birthdayDate)
                                );
                              }
                              setShowBirthdayDateCalendar((show) => !show);
                            }}
                            style={{
                              cursor: "pointer",
                              backgroundColor: "#fff",
                            }}
                          />
                          {filters.birthdayDate ? (
                            <button
                              type="button"
                              onClick={() => {
                                setFilters({ ...filters, birthdayDate: "" });
                                setBirthdayDateValue(null);
                                setShowBirthdayDateCalendar(false);
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
                                zIndex: 10000,
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
                          {showBirthdayDateCalendar && (
                            <div
                              ref={birthdayDateCalenderRef}
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
                                  setBirthdayDateValue(selectedDate);
                                  setFilters({
                                    ...filters,
                                    birthdayDate: toISODate(selectedDate),
                                  });
                                  setShowBirthdayDateCalendar(false);
                                  setCurrentPage(1);
                                }}
                                value={birthdayDateValue}
                                locale="en-GB"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="filter-item">
                        <Form.Label>Joining Date</Form.Label>
                        <div style={{ position: "relative" }}>
                          <Form.Control
                            type="text"
                            className="filter-height"
                            placeholder="dd/mm/yyyy"
                            value={
                              filters.joiningDate
                                ? formatDate(parseDate(filters.joiningDate))
                                : ""
                            }
                            readOnly
                            ref={joiningDateInputRef}
                            onClick={() => {
                              if (filters.joiningDate) {
                                setJoiningDateValue(
                                  parseDate(filters.joiningDate)
                                );
                              }
                              setShowJoiningDateCalendar((show) => !show);
                            }}
                            style={{
                              cursor: "pointer",
                              backgroundColor: "#fff",
                            }}
                          />
                          {filters.joiningDate ? (
                            <button
                              type="button"
                              onClick={() => {
                                setFilters({ ...filters, joiningDate: "" });
                                setJoiningDateValue(null);
                                setShowJoiningDateCalendar(false);
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
                                zIndex: 10000,
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
                          {showJoiningDateCalendar && (
                            <div
                              ref={joiningDateCalenderRef}
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
                                  setJoiningDateValue(selectedDate);
                                  setFilters({
                                    ...filters,
                                    joiningDate: toISODate(selectedDate),
                                  });
                                  setShowJoiningDateCalendar(false);
                                  setCurrentPage(1);
                                }}
                                value={joiningDateValue}
                                locale="en-GB"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Col>
                <Col className="d-flex align-items-end justify-content-end gap-2">
                  {canRead && (
                    <div className="custom-select-height total-records px-3 mt-2 mt-md-0 d-flex align-items-center h-6">
                      <span>
                        Total Records :<strong> {totalRecords}</strong>
                      </span>
                    </div>
                  )}
                </Col>
              </Row>
              <Modal show={show} onHide={handleClose} size="lg" centered>
                <Modal.Header className="form-main-heading">
                  <Modal.Title>
                    {formik.values.id ? "Update User" : "Add User"}
                  </Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={handleClose}
                  />
                </Modal.Header>
                {isLoading && (
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 2000,
                    }}
                  >
                    <LoadMoreButton isLoading={isLoading} />
                  </div>
                )}
                <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
                  <Form onSubmit={formik.handleSubmit}>
                    <Row className="mb-3">
                      <Col md={6} className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter Name"
                          name="name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.name && formik.errors.name && (
                          <div className="text-danger">
                            {formik.errors.name}
                          </div>
                        )}
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter Email"
                          name="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.email && formik.errors.email && (
                          <div className="text-danger">
                            {formik.errors.email}
                          </div>
                        )}
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <PhoneInput
                          country={countryCodeISO()}
                          value={formik.values.phone}
                          onChange={(phone, data) => {
                            const dialCode = data.dialCode
                              ? `+${data.dialCode}`
                              : "";
                            const formattedPhone = `${dialCode} ${phone.replace(
                              data.dialCode,
                              ""
                            )}`.trim();
                            formik.setFieldValue("phone", formattedPhone);
                          }}
                          onBlur={formik.handleBlur}
                          inputProps={{
                            name: "phone",
                            required: true,
                            className: "form-control custom-select-height",
                          }}
                          inputStyle={{
                            width: "100%",
                            paddingLeft: "65px",
                            borderRadius: "4px",
                          }}
                          buttonStyle={{
                            marginRight: "10px",
                          }}
                        />
                        {formik.touched.phone && formik.errors.phone && (
                          <div className="text-danger">
                            {formik.errors.phone}
                          </div>
                        )}
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            className="custom-select-height"
                            placeholder="Enter Password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="position-absolute top-50 end-0 translate-middle-y pe-3"
                            style={{ cursor: "pointer" }}
                          >
                            {showPassword ? (
                              <VisibilityOff sx={{ fontSize: 18 }} />
                            ) : (
                              <Visibility sx={{ fontSize: 18 }} />
                            )}
                          </span>
                        </div>
                        {formik.touched.password && formik.errors.password && (
                          <div className="text-danger">
                            {formik.errors.password}
                          </div>
                        )}
                      </Col>
                      {userRole === "Super Admin" && (
                        <Col md={6} className="mb-3">
                          <Form.Label>Branch</Form.Label>
                          <Select
                            name="branchId"
                            classNamePrefix="custom-select"
                            styles={{
                              control: (base) => ({
                                ...base,
                                fontSize: "13px",
                              }),
                            }}
                            value={
                              formik.values.branchId === ""
                                ? { value: "", label: "Head Office" } 
                                : formik.values.branchId
                                ? {
                                    value: formik.values.branchId,
                                    label:
                                      branchList.find(
                                        (b) => b._id === formik.values.branchId
                                      )?.name || "Select Branch",
                                  }
                                : { value: "", label: "Head Office" }
                            }
                            onChange={handleBranchChangeInForm}
                            // onChange={(option) =>
                            //   formik.setFieldValue("branchId", option ? option.value : "")
                            // }
                            onBlur={() =>
                              formik.setFieldTouched("branchId", true)
                            }
                            options={[
                              // { value: "all", label: "All" },
                              { value: "", label: "Head Office" },
                              ...branchList
                                ?.filter(
                                  (branch) =>
                                    branch.name && branch.name.trim() !== ""
                                )
                                ?.sort((a, b) => a.name.localeCompare(b.name))
                                ?.map((branch) => ({
                                  value: branch._id,
                                  label: branch.name,
                                })),
                            ]}
                            placeholder="Select Branch"
                            isClearable
                          />
                          {formik.touched.branchId &&
                            formik.errors.branchId && (
                              <div className="text-danger">
                                {formik.errors.branchId}
                              </div>
                            )}
                        </Col>
                      )}
                      <Col md={6} className="mb-3">
                        <Form.Label>Role</Form.Label>
                        <Select
                          name="role"
                          classNamePrefix="custom-select"
                          styles={{
                            control: (base) => ({
                              ...base,
                              fontSize: "13px",
                            }),
                          }}
                          value={
                            formik.values.role
                              ? {
                                  value: formik.values.role,
                                  label:
                                    roleDropDown?.find(
                                      (role) => role._id === formik.values.role
                                    )?.name || "Select Role",
                                }
                              : null
                          }
                          onChange={(option) =>
                            formik.setFieldValue(
                              "role",
                              option ? option.value : ""
                            )
                          }
                          onBlur={() => formik.setFieldTouched("role", true)}
                          options={roleDropDown
                            ?.filter(
                              (role) =>
                                role.name !== "B2B Admin" &&
                                role.name !== "B2B Member"
                            )
                            ?.sort((a, b) => a.name?.localeCompare(b.name))
                            ?.map((role) => ({
                              value: role._id,
                              label: role.name,
                            }))}
                          placeholder="Select Role"
                          isClearable
                        />
                        {formik.touched.role && formik.errors.role && (
                          <div className="text-danger">
                            {formik.errors.role}
                          </div>
                        )}
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Select
                          name="status"
                          classNamePrefix="custom-select"
                          styles={{
                            control: (base) => ({
                              ...base,
                              fontSize: "13px",
                            }),
                          }}
                          value={
                            formik.values.status
                              ? {
                                  value: formik.values.status,
                                  label: formik.values.status,
                                }
                              : null
                          }
                          onChange={(option) =>
                            formik.setFieldValue(
                              "status",
                              option ? option.value : ""
                            )
                          }
                          onBlur={() => formik.setFieldTouched("status", true)}
                          options={statusOptions}
                          placeholder="Select Status"
                          isClearable
                        />
                        {formik.touched.status && formik.errors.status && (
                          <div className="text-danger">
                            {formik.errors.status}
                          </div>
                        )}
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control
                          type="date"
                          className="custom-select-height"
                          name="birthdayDate"
                          value={formik.values.birthdayDate}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.birthdayDate &&
                          formik.errors.birthdayDate && (
                            <div className="text-danger">
                              {formik.errors.birthdayDate}
                            </div>
                          )}
                      </Col>

                      <Col md={6} className="mb-3">
                        <Form.Label>Joining Date</Form.Label>
                        <Form.Control
                          type="date"
                          className="custom-select-height"
                          name="joiningDate"
                          value={formik.values.joiningDate}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.joiningDate &&
                          formik.errors.joiningDate && (
                            <div className="text-danger">
                              {formik.errors.joiningDate}
                            </div>
                          )}
                      </Col>
                      {userRole !== "Branch" && (
                        <>
                          <div
                            className="mb-3"
                            style={{
                              width: "100%",
                              height: "1px",
                              backgroundColor: "lightGray",
                            }}
                          ></div>
                          <Col md={12} className="mb-3">
                            <Form.Check
                              type="checkbox"
                              label="View Specific B2B"
                              id="viewSpecificB2Bcheck"
                              name="viewSpecificB2B"
                              className="custom-checkbox"
                              checked={formik.values.viewSpecificB2B}
                              onChange={(e) => {
                                formik.setFieldValue(
                                  "viewSpecificB2B",
                                  e.target.checked
                                );
                                if (!e.target.checked) {
                                  formik.setFieldValue("b2bCountry", "");
                                  formik.setFieldValue("b2bState", "");
                                }
                              }}
                            />
                          </Col>
                        </>
                      )}

                      {/* {formik.values.viewSpecificB2B && (
                        <>
                          <Col md={6} className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <Select
                              className="custom-select-height"
                              options={countries?.map((c) => ({
                                value: c.name,
                                label: c.name,
                              }))}
                              value={countries
                                ?.map((c) => ({ value: c.name, label: c.name }))
                                .filter((option) =>
                                  formik.values.b2bCountry?.includes(option.value)
                                )}
                              onChange={(selectedOptions) => {
                                const selected = selectedOptions || [];
                                const selectedIsoCodes = selected.map(
                                  (opt) => opt.value
                                );
                                formik.setFieldValue(
                                  "b2bCountry",
                                  selectedIsoCodes
                                );
                                if (selectedIsoCodes.length === 1) {
                                  handleCountryChange(selectedIsoCodes[0]);
                                } else {
                                  setStateDropDown([]);
                                  formik.setFieldValue("b2bState", "");
                                }
                              }}
                              placeholder="Select Country"
                              isClearable
                              isSearchable
                              isMulti
                              classNamePrefix="custom-select"
                              noOptionsMessage={() => "No countries available"}
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  borderRadius: " 30px",
                                  color: "black",
                                }),
                                placeholder: (base) => ({
                                  ...base,
                                  color: "black",
                                  fontSize: "13px",
                                }),
                              }}
                            />
                          </Col>
                          <Col md={6} className="mb-3">
                            <Form.Label>State</Form.Label>
                            <Select
                              className="custom-select-height"
                              options={stateDropDown?.map((state) => ({
                                value: state.isoCode,
                                label: state.name,
                              }))}
                              value={(formik.values.state || [])
                                .map((stateIsoCode) => {
                                  const found = stateDropDown.find(
                                    (s) => s.isoCode === stateIsoCode
                                  );
                                  return found
                                    ? {
                                        value: found.isoCode,
                                        label: found.name,
                                      }
                                    : null;
                                })
                                .filter(Boolean)}
                              onChange={(selectedOptions) => {
                                const selected = selectedOptions || [];
                                const selectedValues = selected.map(
                                  (opt) => opt.value
                                );
                                formik.setFieldValue("state", selectedValues);
                              }}
                              classNamePrefix="custom-select"
                              placeholder="Select State"
                              isClearable
                              isSearchable
                              isMulti
                              isDisabled={
                                !formik.values.country ||
                                formik.values.country.length !== 1
                              }
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  borderRadius: " 30px",
                                  color: "black",
                                }),
                                placeholder: (base) => ({
                                  ...base,
                                  color: "black",
                                  fontSize: "13px",
                                }),
                              }}
                            />
                          </Col>
                        </>
                      )} */}
                      {formik.values.viewSpecificB2B && (
                        <>
                          <Col md={6} className="mb-3">
                            <Form.Label>B2B Country</Form.Label>
                            <Select
                              className="custom-select-height"
                              options={countries?.map((c) => ({
                                value: c.name,
                                label: c.name,
                              }))}
                              value={countries
                                ?.map((c) => ({ value: c.name, label: c.name }))
                                .filter((option) =>
                                  formik.values.b2bCountry?.includes(
                                    option.value
                                  )
                                )}
                              onChange={(selectedOptions) => {
                                const selected = selectedOptions || [];
                                const selectedIsoCodes = selected.map(
                                  (opt) => opt.value
                                );
                                formik.setFieldValue(
                                  "b2bCountry",
                                  selectedIsoCodes
                                );
                                handleB2BCountryChange(selectedIsoCodes);
                              }}
                              placeholder="Select B2B Country"
                              isClearable
                              isSearchable
                              isMulti
                              classNamePrefix="custom-select"
                              noOptionsMessage={() => "No countries available"}
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  borderRadius: "30px",
                                  color: "black",
                                }),
                                placeholder: (base) => ({
                                  ...base,
                                  color: "black",
                                  fontSize: "13px",
                                }),
                              }}
                            />
                            {formik.touched.b2bCountry &&
                              formik.errors.b2bCountry && (
                                <div className="text-danger">
                                  {formik.errors.b2bCountry}
                                </div>
                              )}
                          </Col>
                          <Col md={6} className="mb-3">
                            <Form.Label>B2B State</Form.Label>
                            <Select
                              className="custom-select-height"
                              options={stateDropDown?.map((state) => ({
                                value: state.isoCode,
                                label: state.name,
                              }))}
                              value={(formik.values.b2bState || [])
                                .map((stateName) => {
                                  const found = stateDropDown.find(
                                    (s) => s.name === stateName
                                  );
                                  return found
                                    ? {
                                        value: found.isoCode,
                                        label: found.name,
                                      }
                                    : null;
                                })
                                .filter(Boolean)}
                              onChange={(selectedOptions) => {
                                const selected = selectedOptions || [];
                                const selectedNames = selected.map((opt) => {
                                  const found = stateDropDown.find(
                                    (s) => s.isoCode === opt.value
                                  );
                                  return found ? found.name : opt.value;
                                });
                                formik.setFieldValue("b2bState", selectedNames);
                              }}
                              classNamePrefix="custom-select"
                              placeholder="Select B2B State"
                              isClearable
                              isSearchable
                              isMulti
                              // isDisabled={
                              //   !formik.values.b2bCountry ||
                              //   formik.values.b2bCountry.length !== 1
                              // }
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  borderRadius: "30px",
                                  color: "black",
                                }),
                                placeholder: (base) => ({
                                  ...base,
                                  color: "black",
                                  fontSize: "13px",
                                }),
                              }}
                            />
                            {formik.touched.b2bState &&
                              formik.errors.b2bState && (
                                <div className="text-danger">
                                  {formik.errors.b2bState}
                                </div>
                              )}
                          </Col>
                          <Col md={6} className="mb-3">
                            <Form.Label>Assigned B2B</Form.Label>
                            <Select
                              isMulti
                              name="assignedB2B"
                              classNamePrefix="custom-select"
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  fontSize: "13px",
                                }),
                              }}
                              options={B2BAdminList.map((b2b) => ({
                                value: b2b._id,
                                label: b2b.companyName,
                              }))}
                              value={B2BAdminList.filter((b2b) =>
                                formik.values.assignedB2B?.includes(b2b._id)
                              ).map((b2b) => ({
                                value: b2b._id,
                                label: b2b.companyName,
                              }))}
                              onChange={(selectedOptions) => {
                                const selectedIds = selectedOptions.map(
                                  (opt) => opt.value
                                );
                                formik.setFieldValue(
                                  "assignedB2B",
                                  selectedIds
                                );
                              }}
                              placeholder="Select B2B Admin"
                              isSearchable
                            />
                          </Col>
                        </>
                      )}
                      <div
                        className="mb-3"
                        style={{
                          width: "100%",
                          height: "1px",
                          backgroundColor: "lightGray",
                        }}
                      ></div>
                      <Col md={12} className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="Restrict By IP"
                          id="restrictByIpCheck"
                          name="restrictByIp"
                          className="custom-checkbox"
                          checked={formik.values.restrictByIp}
                          onChange={(e) => {
                            formik.setFieldValue(
                              "restrictByIp",
                              e.target.checked
                            );
                            if (!e.target.checked) {
                              formik.setFieldValue("allowedIps", [""]);
                            }
                          }}
                        />
                      </Col>
                      {formik.values.restrictByIp && (
                        <Col md={7} className="mb-3">
                          <Form.Label>Allowed IPs</Form.Label>
                          {formik.values.allowedIps?.map((ip, index) => (
                            <Row
                              key={index}
                              className="mb-2 align-items-center"
                            >
                              <Col md={10}>
                                <Form.Control
                                  type="text"
                                  className="custom-select-height"
                                  placeholder="Enter IP Address (e.g., 192.168.1.1)"
                                  value={ip}
                                  onChange={(e) => {
                                    const newIps = [
                                      ...formik.values.allowedIps,
                                    ];
                                    newIps[index] = e.target.value;
                                    formik.setFieldValue("allowedIps", newIps);
                                  }}
                                  onBlur={() =>
                                    formik.setFieldTouched(
                                      `allowedIps[${index}]`,
                                      true
                                    )
                                  }
                                />
                                {formik.touched.allowedIps?.[index] &&
                                  formik.errors.allowedIps?.[index] && (
                                    <div className="text-danger">
                                      {formik.errors.allowedIps[index]}
                                    </div>
                                  )}
                              </Col>
                              <Col md={2} className="d-flex align-items-center">
                                {index > 0 && (
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => removeIpField(index)}
                                    className="me-2"
                                  >
                                    <FaMinus />
                                  </Button>
                                )}
                                {index ===
                                  formik.values.allowedIps.length - 1 && (
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={addIpField}
                                  >
                                    <FaPlus />
                                  </Button>
                                )}
                              </Col>
                            </Row>
                          ))}
                        </Col>
                      )}
                      {userRole !== "Branch" && (
                        <Col md={6} className="mb-3">
                          <Form.Label>Application Country</Form.Label>
                          <Select
                            className="custom-select-height"
                            options={countries?.map((c) => ({
                              value: c.name,
                              label: c.name,
                            }))}
                            value={countries
                              ?.map((c) => ({ value: c.name, label: c.name }))
                              .filter((option) =>
                                formik.values.country?.includes(option.value)
                              )}
                            onChange={(selectedOptions) => {
                              const selected = selectedOptions || [];
                              const selectedValues = selected?.map(
                                (opt) => opt.value
                              );
                              const validCountries = countries?.map(
                                (c) => c.name
                              );
                              const filteredValues = selectedValues?.filter(
                                (val) => validCountries?.includes(val)
                              );
                              if (filteredValues) {
                                formik.setFieldValue("country", filteredValues);
                                formik.setFieldError("country", "");
                              } else {
                                formik.setFieldValue("country", []);
                              }
                              // if (filteredValues.length === 1) {
                              //   handleApplicationCountryChange(
                              //     filteredValues[0]
                              //   );
                              // } else {
                              //   setStateDropDown([]);
                              //   formik.setFieldValue("state", []);
                              // }
                            }}
                            placeholder="Select Country"
                            isClearable
                            isSearchable
                            isMulti
                            classNamePrefix="custom-select"
                            noOptionsMessage={() => "No countries available"}
                            styles={{
                              control: (base) => ({
                                ...base,
                                borderRadius: "30px",
                                color: "black",
                              }),
                              placeholder: (base) => ({
                                ...base,
                                color: "black",
                                fontSize: "13px",
                              }),
                            }}
                          />
                        </Col>
                      )}
                      {/* {userRole !== "Branch" && (
                        <Col md={6} className="mb-3">
                          <Form.Label>Application Country</Form.Label>
                          <Select
                            className="custom-select-height"
                            options={countries?.map((c) => ({
                              value: c.name,
                              label: c.name,
                            }))}
                            value={countries
                              ?.map((c) => ({ value: c.name, label: c.name }))
                              .filter((option) =>
                                formik.values.country?.includes(option.value)
                              )}
                            onChange={(selectedOptions) => {
                              const selected = selectedOptions || [];
                              const selectedValues = selected?.map(
                                (opt) => opt.value
                              );
                              const validCountries = countries?.map(
                                (c) => c.name
                              );

                              const filteredValues = selectedValues?.filter(
                                (val) => validCountries?.includes(val)
                              );
                              if (filteredValues) {
                                formik.setFieldValue("country", filteredValues);

                                formik.setFieldError("country", "");
                              } else {
                                formik.setFieldValue("country", "");
                              }
                            }}
                            placeholder="Select Country"
                            isClearable
                            isSearchable
                            isMulti
                            classNamePrefix="custom-select"
                            noOptionsMessage={() => "No countries available"}
                            styles={{
                              control: (base) => ({
                                ...base,
                                borderRadius: " 30px",
                                color: "black",
                              }),
                              placeholder: (base) => ({
                                ...base,
                                color: "black",
                                fontSize: "13px",
                              }),
                            }}
                          />
                        </Col>
                      )} */}
                      {userRole !== "Branch" && (
                        <Row className="mb-3">
                          <Col md={6}>
                            <Form.Label>
                              View B2B Student Application
                            </Form.Label>
                            <div>
                              <Form.Check
                                inline
                                type="radio"
                                label="Yes"
                                name="viewB2BStudentApplication"
                                value={true}
                                checked={
                                  formik.values.viewB2BStudentApplication ===
                                  true
                                }
                                onChange={() =>
                                  formik.setFieldValue(
                                    "viewB2BStudentApplication",
                                    true
                                  )
                                }
                                className="custom-radio-border"
                              />
                              <Form.Check
                                inline
                                type="radio"
                                label="No"
                                name="viewB2BStudentApplication"
                                value={false}
                                checked={
                                  formik.values.viewB2BStudentApplication ===
                                  false
                                }
                                onChange={() =>
                                  formik.setFieldValue(
                                    "viewB2BStudentApplication",
                                    false
                                  )
                                }
                                className="custom-radio-border"
                              />
                            </div>
                          </Col>
                          <Col md={6}>
                            <Form.Label>
                              Which B2B Student Application
                            </Form.Label>
                            <div>
                              <Form.Check
                                inline
                                type="radio"
                                label="All"
                                name="whichB2BStudentApplication"
                                value="all"
                                checked={
                                  formik.values.whichB2BStudentApplication ===
                                  "all"
                                }
                                onChange={() =>
                                  formik.setFieldValue(
                                    "whichB2BStudentApplication",
                                    "all"
                                  )
                                }
                                className="custom-radio-border"
                              />
                              <Form.Check
                                inline
                                type="radio"
                                label="Countrywise"
                                name="whichB2BStudentApplication"
                                value="countrywise"
                                checked={
                                  formik.values.whichB2BStudentApplication ===
                                  "countrywise"
                                }
                                onChange={() =>
                                  formik.setFieldValue(
                                    "whichB2BStudentApplication",
                                    "countrywise"
                                  )
                                }
                                className="custom-radio-border"
                              />
                            </div>
                          </Col>
                        </Row>
                      )}
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
              <DataTable
                columns={columns}
                data={allUser}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={canUpdate}
                canDelete={canDelete}
                canRead={canRead}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default UserManagement;
