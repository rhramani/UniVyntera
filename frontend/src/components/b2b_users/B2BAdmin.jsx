import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import Pageheader from "../../layouts/Pageheader";
import { Link } from "react-router-dom";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  cityDropdown,
  countryDropdown,
  stateDropdown,
} from "../../redux/actions/Master/Institute.action";
import {
  b2bAdminCountryList,
  b2bBulkUpload,
  createB2BAdmin,
  deleteB2BAdmin,
  getAllB2BAdmin,
  updateB2BAdmin,
  downloadB2bAdmin,
} from "../../redux/actions/B2BAdmin.action";
import { REACT_APP_API_URL, BASEURL } from "../../baseUrl";
import Paginations from "../elements/Paginations";
import DataTable from "../commonComponents/DataTable";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { getAllRole } from "../../redux/actions/Master/Role.action";
import { adminGetAll } from "../../redux/actions/Admin.action";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "react-phone-input-2/lib/bootstrap.css";
import PhoneInput from "react-phone-input-2";
import usePermissions from "../commonComponents/usePermissions";
import ViewModal from "../commonComponents/ViewModal";
import LoadMoreButton from "../commonComponents/LoadMoreButton";
import CreatableSelect from "react-select/creatable";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  MdCalendarToday,
  MdCall,
  MdOutlinePlayCircleFilled,
} from "react-icons/md";
import { countryCodeISO } from "../../utils/countryISOCode";
import CallIcon from "@mui/icons-material/Call";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import { addCtcCalling } from "../../redux/actions/Lead.action";
import { decryptData } from "../../utils/encryptionUtils";
import DeleteConfirmModal from "../bulkMessage/commonDeleteModal/DeleteConfirmModal";

const convertToDDMMYYYY = (dateStr) => {
  if (!dateStr) return "";
  if (dateStr.includes("/")) return dateStr;
  if (dateStr.includes("-")) {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  }
  return dateStr;
};

const B2BAdmin = () => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const [adminList, setAdminList] = useState([]);
  const [countries, setCountries] = useState([]);
  const [b2bAdminCountries, setB2bAdminCountries] = useState([]);
  const [stateDropDown, setStateDropDown] = useState([]);
  const [cityDropDownList, setCityDropDownList] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [roleDropDown, setRoleDropDown] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [profilePreview, setProfilePreview] = useState(null);
  const [checkPreview, setCheckPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItemData, setSelectedItemData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countryFilter, setCountryFilter] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);

  const [showAgreementStartCalendar, setShowAgreementStartCalendar] =
    useState(false);
  const [showAgreementEndCalendar, setShowAgreementEndCalendar] =
    useState(false);
  const [agreementStartValue, setAgreementStartValue] = useState(null);
  const [agreementEndValue, setAgreementEndValue] = useState(null);
  const agreementStartInputRef = useRef(null);
  const agreementEndInputRef = useRef(null);
  const agreementStartCalendarRef = useRef(null);
  const agreementEndCalendarRef = useRef(null);
  const userRole = decryptData(localStorage.getItem("role"));

  const handleShowUploadModal = () => setShowUploadModal(true);
  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setUploadFile(null);
  };

  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("B2B Admin");

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
    setProfilePreview(null);
    setCheckPreview(null);
  };

  const formStatusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  const subscriptionOptions = [
    { value: "", label: "All Subscriptions" },
    { value: "true", label: "Subscribed" },
    { value: "false", label: "Not Subscribed" },
  ];

  const fetchCountries = async () => {
    const res = await dispatch(countryDropdown());
    setCountries(res?.data?.data || []);
  };

  const fetchB2BAdminCountries = async () => {
    const res = await dispatch(b2bAdminCountryList());
    setB2bAdminCountries(res?.data?.data || []);
  };

  const handleCountryChange = async (countryIsoCode) => {
    try {
      formik.setFieldValue("country", countryIsoCode);
      formik.setFieldValue("state", "");
      formik.setFieldValue("city", "");
      setStateDropDown([]);
      setCityDropDownList([]);

      const res = await dispatch(stateDropdown(countryIsoCode));
      const data = res?.data?.data;
      setStateDropDown(data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleStateChange = async (countryIsoCode, stateIsoCode) => {
    try {
      formik.setFieldValue("state", stateIsoCode);
      formik.setFieldValue("city", "");
      setCityDropDownList([]);

      const res = await dispatch(cityDropdown(countryIsoCode, stateIsoCode));
      const data = res?.data?.data;
      setCityDropDownList(data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };
  useEffect(() => {
    fetchCountries();
    fetchB2BAdminCountries();
  }, []);

  useEffect(() => {
    if (showViewModal || showDeleteModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showViewModal, showDeleteModal]);

  const fetchAllAdmin = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    status = "",
    country = "",
    subscription = false,
  ) => {
    try {
      const res = await dispatch(
        getAllB2BAdmin(page, limit, search, status, country, subscription),
      );
      const responseData = res?.data?.data;
      if (responseData?.data?.length === 0) {
        setAdminList([]);
        setTotalPages(0);
      } else {
        setAdminList(responseData?.data || []);
        setTotalPages(responseData?.totalPages || 0);
        setTotalRecords(responseData?.totalRecords || 0);
      }
    } catch (error) {
      console.error("Error fetching institute:", error);
      setAdminList([]);
      setTotalPages(0);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      fetchAllAdmin(
        1,
        newItemsPerPage,
        search,
        statusFilter,
        countryFilter,
        subscriptionFilter,
      );
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchAllAdmin(
        currentPage,
        itemsPerPage,
        search,
        statusFilter,
        countryFilter,
        subscriptionFilter,
      );
    }
  }, [currentPage, search, statusFilter, countryFilter, subscriptionFilter]);

  const formik = useFormik({
    initialValues: {
      companyName: "",
      contactPerson: "",
      phone: "",
      email: "",
      // username: "",
      password: "",
      country: "",
      state: "",
      city: "",
      // commissionPercentage: "",
      memberLimit: 5,
      status: "",
      logo: "",
      websiteUrl: "",
      // assignTeam: "",
      // b2bAssignRole: "",
      bankName: "",
      branch: "",
      accountNumber: "",
      ifscCode: "",
      cancelCheque: "",
      agreementStartDate: "",
      agreementEndDate: "",
      GST_VAT: "",
      subscription: false,
    },
    validationSchema: Yup.object({
      companyName: Yup.string().required("Company Name is required"),
      contactPerson: Yup.string(),
      phone: Yup.string().required("Phone is required"),
      email: Yup.string().required("Email is required"),
      // username: Yup.string().required("Name is required"),
      country: Yup.string(),
      state: Yup.string(),
      city: Yup.string().required("City is required"),
      // commissionPercentage: Yup.number().max(
      //   100,
      //   "Commission Percentage cannot be more than 100"
      // ),
      memberLimit: Yup.number(),
      status: Yup.string().required("Status is required"),
      logo: Yup.string(),
      websiteUrl: Yup.string(),
      // assignTeam: Yup.string().required("Assign Team is required"),
      // b2bAssignRole: Yup.string(),
      password: Yup.string(),
      bankName: Yup.string(),
      branch: Yup.string(),
      accountNumber: Yup.string(),
      ifscCode: Yup.string(),
      cancelCheque: Yup.string(),
      agreementStartDate: Yup.string(),
      agreementEndDate: Yup.string(),
      GST_VAT: Yup.string().required("GST/VAT is required"),
      subscription: Yup.boolean(),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);

      try {
        toast.dismiss();
        const selectedCountry = countries.find(
          (c) => c.isoCode === values.country,
        );
        const selectedState = stateDropDown.find(
          (s) => s.isoCode === values.state,
        );

        const formattedValues = {
          ...values,
          country: selectedCountry?.name || values.country,
          state: selectedState?.name || values.state,
          city: values.city,
          // b2bAssignRole: values.b2bAssignRole || null,
          // assignTeam: values.assignTeam || null,
        };

        const payload = new FormData();
        Object.entries(formattedValues).forEach(([key, value]) => {
          if (
            value !== undefined &&
            value !== null &&
            key !== "logo" &&
            key !== "cancelCheque"
          ) {
            if (key === "password" && !value) return;
            payload.append(key, value);
          }
        });

        if (formattedValues.logo && typeof formattedValues.logo === "object") {
          payload.append("logo", formattedValues.logo);
        }
        if (
          formattedValues.cancelCheque &&
          typeof formattedValues.cancelCheque === "object"
        ) {
          payload.append("cancelCheque", formattedValues.cancelCheque);
        }

        if (values.id && canUpdate) {
          const res = await dispatch(updateB2BAdmin(payload, values.id));
          if (res?.status === 200) {
            toast.success("B2B Admin updated successfully");
            handleClose();
          }
        } else if (canCreate) {
          const res = await dispatch(createB2BAdmin(payload));
          if (res?.data?.code === 201) {
            toast.success("B2B Admin added successfully");
            handleClose();
          }
        }

        handleClose();
        resetForm();

        if (canRead) {
          fetchAllAdmin(
            currentPage,
            itemsPerPage,
            search,
            statusFilter,
            countryFilter,
            subscriptionFilter,
          );
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showAgreementStartCalendar &&
        agreementStartCalendarRef.current &&
        !agreementStartCalendarRef.current.contains(event.target) &&
        agreementStartInputRef.current &&
        !agreementStartInputRef.current.contains(event.target)
      ) {
        setShowAgreementStartCalendar(false);
      }
      if (
        showAgreementEndCalendar &&
        agreementEndCalendarRef.current &&
        !agreementEndCalendarRef.current.contains(event.target) &&
        agreementEndInputRef.current &&
        !agreementEndInputRef.current.contains(event.target)
      ) {
        setShowAgreementEndCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAgreementStartCalendar, showAgreementEndCalendar]);

  const handleDelete = async (item) => {
    if (canDelete) {
      try {
        toast.dismiss();
        const res = await dispatch(deleteB2BAdmin(item?._id));
        if (res?.status === 200) {
          toast.success("B2B Admin deleted successfully");
        }
        const updatedPage =
          adminList?.length === 1 && currentPage > 1
            ? currentPage - 1
            : currentPage;
        setCurrentPage(updatedPage);
        setShowDeleteModal(false);
        if (canRead) {
          fetchAllAdmin(
            currentPage,
            itemsPerPage,
            search,
            statusFilter,
            countryFilter,
            subscriptionFilter,
          );
        }
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const fetchRole = async () => {
    const res = await dispatch(getAllRole(1, 100, "", ""));
    setRoleDropDown(res?.data?.data?.data || []);
  };

  const fetchAllUser = async (roleName) => {
    try {
      const res = await dispatch(adminGetAll(1, 100, "", roleName, "", false));
      const responseData = res?.data?.data;
      setAllUser(responseData?.data || []);
    } catch (error) {
      console.log("Error fetching camouses:", error);
      setAllUser([]);
    }
  };

  useEffect(() => {
    fetchRole();
    fetchAllUser();
  }, []);

  const getValidLogoUrl = (logoPath) => {
    if (!logoPath) return "";

    // agar already full URL hai (Cloudinary etc.)
    if (logoPath.startsWith("http://") || logoPath.startsWith("https://")) {
      return logoPath;
    }

    // agar relative path hai
    return `${BASEURL}${logoPath}`;
  };

  const b2bAdminFields = [
    { label: "COMPANY NAME", key: "companyName" },
    { label: "CONTACT PERSON", key: "contactPerson" },
    { label: "PHONE", key: "phone" },
    { label: "EMAIL", key: "email" },
    { label: "COUNTRY", key: "country" },
    { label: "STATE", key: "state" },
    { label: "CITY", key: "city" },
    { label: "STATUS", key: "status" },
    {
      label: "SUBSCRIPTION",
      key: "subscription",
      render: (item) => (item.subscription ? "Subscribed" : "Not Subscribed"),
    },
    {
      label: "WEBSITE URL",
      key: "websiteUrl",
      render: (item) => (
        <a
          href={item?.websiteUrl || "#"}
          target={item?.websiteUrl && "_blank"}
          rel="noopener noreferrer"
          className="text-primary text-decoration-underline"
        >
          {item?.websiteUrl || "NA"}
        </a>
      ),
    },
    {
      label: "COMPANY LOGO",
      key: "companyLogo",
      render: (item) =>
        item?.companyLogo ? (
          <img
            src={getValidLogoUrl(item.companyLogo)}
            alt="Company Logo"
            className="img-fluid"
            style={{ maxWidth: "70px", maxHeight: "70px" }}
          />
        ) : (
          "NA"
        ),
    },
    { label: "GST/VAT", key: "GST_VAT" },
    { label: "Bank Name", key: "bankName" },
    { label: "Account Number", key: "accountNumber" },
    { label: "Branch", key: "branch" },
    { label: "Ifsc Code", key: "ifscCode" },
    {
      label: "CANCEL CHEQUE",
      key: "cancelChequeImage",
      render: (item) =>
        item?.cancelChequeImage ? (
          <img
            src={`${BASEURL}${item.cancelChequeImage}`}
            alt="Company Logo"
            className="img-fluid"
            style={{ maxWidth: "70px", maxHeight: "70px" }}
          />
        ) : (
          "NA"
        ),
    },
  ];

  const b2bSections = [
    {
      title: "",
      fields: b2bAdminFields,
    },
  ];

  const handleViewModal = (item) => {
    setSelectedItemData(item);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
  };

  const handleStatusToggle = async (item) => {
    if (!canUpdate) return;
    try {
      const newStatus = item.status === "Active" ? "Inactive" : "Active";
      const payload = new FormData();
      payload.append("status", newStatus);
      const res = await dispatch(updateB2BAdmin(payload, item._id));
      if (res?.status === 200) {
        toast.success(`Status updated to ${newStatus} successfully`);
        fetchAllAdmin(
          currentPage,
          itemsPerPage,
          search,
          statusFilter,
          countryFilter,
          subscriptionFilter,
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    }
  };

  const hasAnyRecording = adminList?.some(
    (item) => item?.CTCCallRecording && item?.CTCCallRecording !== "",
  );

  const columns = [
    {
      label: "Company Logo",
      // key: "companyLogo",
      render: (item) => {
        return (
          <img
            src={
              item.companyLogo
                ? getValidLogoUrl(item.companyLogo)
                : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQQAAACUCAMAAABCx6fPAAAARVBMVEX///+IiIiEhITm5ub8/Pyjo6OMjIyRkZGBgYHp6el+fn7Y2Nj29vbV1dW8vLzv7++zs7PMzMx3d3eamprFxcXe3t6tra0ZNdg1AAAItElEQVR4nO2ci5aiOBCGIYQkArkgkPd/1K2qBImKPd27tM5q/XPOtiJg+KhbKrhVxWKxWCwWi8VisVgsFovFYrFYLBaLxWKxWCwWi8VisVgsFuv/Jd/342ytf/U4XiY/RtUlnUU7e/nqAT1fi1OdEXWWMJ0Ky4dh8E5vBOpa6Ta2LVjDq8f1RMmlRKBb15MvDP6DXMK7ekOg4keGRR/U5gjT+IkIqsEVDNpPC4ZJw7wxEG3z6uG8RHLUWzyYllcP5zVq2iItjNt26U8fkxqGUFQHYVg3n1ycpql1n+EdjdpxBjnrOiVNPQ9fHv4WGpwpDCGbv3QbGBHe3yeGqfCGHBHkXJeaXzvC35ccixJB5SppUSUDUb97xpBlWJx2toE699ox/rp8kR9FzNumawhCv3lUOE1lCEzbFn0NoT6/eYJoigsW2ewXXd9AOL12kL+tMgauEPpbCF2qmOQXBSSUl03TFCWmb4r38oQaLruC8BN6ga+H9TA4ybrbQJ+sryT9dz3D9vIQLfUPIIwPy8dhDC0q5Gn4YCO9j+l9Q2/GNPCBdnUeqpE2Ka6HVe0Eu+WRTdjYwkNs206nqsczJFgLvLQvglA594A/9SOEEaJWAS9ncLoWwhh4H/HYBbtWIqYr9ViKdi1AaA3sBarzYZXv4F0u3e0ZDpnw6LEW5wYc15h8hmiE7o+EsBMTHkPQdtchoLgS8E8puCiFNzK911iQ0zU1+CXrLL3HEtUQBLz8OtXnxLfv4FW+Uouv6WxQygCEAS+dKhYPY45HusNeYHwMYb2ZNzrh1cTR2pjuN6YcEcd+DHAmBQNfCEK+e7MhIgmCsdaOUeV7jh+trAgC1ewJghwBMbmKNQnOYSprgm9AEHuuKK0WcO1SSrhHAiZhMGqoLfB9gHs+y2QJMHK0IxlLS+hwtxPsppBQMBurBKE9rRBgplcbNCsJex3b9iirwz9DAGvfMQXqTBEdCbMxbWG/uksTDsi2OPAm2f1MECZ8vUI4pwuGEAKEJN2RxCpBqJW9QBgC+AP+BcTx0PJNjj8JjPsl9IBwerrAmSwV5qBdulXNJERLENSkkjN54DRtEGRm1QEhT76p0uQ9QRBOrhDkCJ8CICsuM72jVASF70CoxX3hhBBSyJLzuRMzWtc5HQLRQkyeILQqebsFLK24hgDf2MHVLnAesJOUKRCCohCTISBRjJ8YgA7uhw/xzxDOBQQTdyBQJEAtYey9jFcQwBIgMGqnDZGaIQnGfQgQ8VqnKA4QBASXQgydbgjwPQ14wzrTO072EQQ1rVoDAUKAeH4PYbWErLhjCdrBJeOhsGWMQtxAEBg/IeJFqw0lCoQAxxjwrhUCTPvB7Wydk8SR2uaRNxDcCSthkiwg4J39GQSKCXoOBu82xEWz3EPAJIJ5w4HNK7tCmB3WTisEKCJFHSAN68MndNKqXQj63vld2u+204QQpj9agp07rPgwBvkiJtAQMKeOEptcI+RsQVkE3WEc0TnsCgEzrlZ1F45mgK62D+E++GQIt598bQl1DoyjNQKnAMpMQ3uxhG7w3i94dxfgAxkRYhRVAwTBgl3o/gIht8HEkSXzqiUXTN+1hPqm9fqtmKDGRuFeM4RWuUEQLoQ4pUITopNeIMviZxnCEGsxzyuEtESC/nW8BvdNS1j7r3q5PT5VvV9DwGLayoDev7kDhVqonnFW4shqxlQSJQg4K4nuAoHWSMwveEOVEvBPIORMXkL4hiV4iHszhgNbWAJ+LZRaLc7MMFzKqoeN/QoBJ3hTvECoyB+OnEWXV6fuIUD1OlzrFFcI+ipHfTMmSAz16HpNAcE458ZxoebLRCOAyNBh4Zwg0Ak2CHC4OD43JHmqmG5SpA43ai9dqOvZ5J/cgYolyPcQDtoZyoChcIcO4MoUYk6KCgC0FZxXJwh5GWiFkM/3Oxr1VxXjva6msskSimC57w4wTULTNq0kSzgVEygSVEFQMIYAhRMyThCqNLd5CgQZfgbBlE2Nok7wbran27nDkCGgKyjsacvbuQMplWJkktMGgXoVz4FAHeYfQKjL9lYRE3rTgS0/gJCczoz7EHDGURuDPTmBzYUMIVUxz4FQBfEjCKk3sEFIU2lq+sx4T89XU+kUEzxdj1iq0h02CC1MjGYQJAOaMScIkoL2kyAM+mcQiixJ47RrPwEyx15TBSAMlGKV37eE05QrAGx7QmTMEMCJngcBe7oPIegAmczFYnv5bBO21xIUbNbl9hpk/Kpsr2EoxSwvpmofAk6niRyUhSJuEMgfngVBtt3DpkrKBZdJBkKYiqCAxZYI/dI7c2m0mrAsNugULTKEhbY/gACEzJK+hpxlhUB29iwI4LgPIeRpRPnYQtl9p7pbKI03mgbuqAzcWu4pJlDpj3d7D4K8NDApzjYXCDScp0GoYngEoegsrcrt0CQwe1xrMdg7wSF6XHwxefFFpsUXrIOiERgxh8nkxRdxgQCpo5voDcwXDFRN9pwbC1A9iQuEyZjfhbB8p8e4C6Hyc1p2CzYvtd0vw1Gkh78eq5K0DAd/pgsE3EavZB9x72VqY0oxMy3DXfb63ceHZPOvIawLsttNulqgXVdQ09IqrcSuC7JyO8EpJ5zB497bAuyw7Vbs9VvK3/Rwab6AIB6syL2N7h7S6PL9LC3hasb0hnr0uE6ZIuv9Vcn3kQxXDC6tHB+LjeHNITx6hK8pLOTYZeG/UQ8e5rRbwBTvHhKqB4/1liHBvPujjaj8gLcQxQPepTcc+rTM36u7R/2HwjpuVx7eVzc/+rDl76TePyLs6rNSw76aWD7W8+aP+e5LLm0ZED6SwTAWvmA+0g68DdvPpMRHMWgavFg59K4tCkWh+w9iUHnXTjG2upxGGO3efdp0I7kEde6KWGBUaD6lRirkbVvn/7lIJ1r7Mb+XvZVs+nEe7fJJkYDFYrFYLBaLxWKxWCwWi8VisVgsFovFYrFYLBaLxWKxWCzWf9I/w6ly8mpBOZ8AAAAASUVORK5CYII="
            }
            alt="Company Logo"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "contain",
              borderRadius: "100px",
              border: "1px solid lightgray",
              padding: "2px",
            }}
          />
        );
      },
    },
    {
      label: "Company Name",
      key: "companyName",
    },
    {
      label: "Contact person",
      key: "contactPerson",
    },
    {
      label: "Country",
      key: "country",
    },
    {
      label: "State",
      key: "state",
    },
    {
      label: "City",
      key: "city",
    },
    {
      label: "Phone",
      key: "phone",
    },
    {
      label: "Email",
      key: "email",
    },
    {
      label: "Country",
      key: "country",
    },
    {
      label: "State",
      key: "state",
    },
    {
      label: "City",
      key: "city",
    },
    {
      label: "Subscription",
      key: "subscription",
      render: (item) => (
        <div className=".">
          {item.subscription ? (
            <CheckCircleIcon style={{ color: "#28a745" }} fontSize="small" />
          ) : (
            "-"
          )}
        </div>
      ),
    },
    {
      label: "Status",
      render: (item) => (
        <Button
          className={`d-flex justify-content-center align-items-center gap-2 rounded-4 ${
            item.status === "Active" ? "active-status" : "inactive-status"
          }`}
          size="sm"
          onClick={() => handleStatusToggle(item)}
          style={{ minWidth: "80px" }}
        >
          <SyncAltIcon style={{ fontSize: "16px" }} />
          {item.status}
        </Button>
      ),
    },
    // {
    //   label: "Assign Team",
    //   render: (item) => (item?.b2bAssignRole ? item?.b2bAssignRole?.name : "-"),
    // },
    // {
    //   label: "Assign Team Member",
    //   // key: "assignTeam",
    //   render: (item) => (item?.assignTeam ? item?.assignTeam?.name : "-"),
    // },
    // {
    //   label: "Commission Percentage",
    //   key: "commissionPercentage",
    // },
    {
      label: "Member Limit",
      key: "memberLimit",
    },
    {
      label: "CREATED DATE",
      render: (item) =>
        item.createdAt ? formatDate(parseDate(item?.createdAt)) : "-",
    },
    {
      label: "CREATED BY",
      render: (item) => (item.created_by ? item?.created_by?.name : "-"),
    },
    {
      label: "UPDATED BY",
      render: (item) => (item.updatedByName ? item?.updatedByName : "-"),
    },
    ...(userRole !== "B2B Member"
      ? [
          ...(hasAnyRecording
            ? [
                {
                  label: "Recording",
                  key: "ctcRecording",
                  className: "sticky-col-right-1",
                  headerClassName: "sticky-col-right-1",
                  render: (item) =>
                    item?.CTCCallRecording ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(item.CTCCallRecording, "_blank");
                        }}
                        className="recording-pill-btn"
                      >
                        <MdOutlinePlayCircleFilled size={16} />
                        <span>RECORDING</span>
                      </button>
                    ) : (
                      "-"
                    ),
                },
              ]
            : []),
          {
            label: "CTC Call",
            key: "ctcCall",
            className: "sticky-col-right-2",
            headerClassName: "sticky-col-right-2",
            render: (item) => (
              <button
                type="button"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    setIsLoading(true);
                    const payload = { entityType: "b2b" };
                    await dispatch(addCtcCalling(item?._id, payload));
                    toast.success("CTC calling initiated");
                  } catch (error) {
                    toast.error(
                      error?.response?.data?.message ||
                        "Failed to initiate CTC call",
                    );
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="call-pill-btn"
              >
                <MdCall size={16} />
                <span>CALL</span>
              </button>
            ),
          },
        ]
      : []),
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
              setSelectedItemData(item);
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
            handleViewModal(item);
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
        {/* <MenuItem
          onClick={async () => {
            try {
              setIsLoading(true);
              const payload = { entityType: "b2b" };
              await dispatch(addCtcCalling(item?._id, payload));
              toast.success("CTC calling initiated");

              setOpenDropdown(null);
            } catch (error) {
              toast.error(
                error?.response?.data?.message || "Failed to initiate CTC call"
              );

              setOpenDropdown(null);
            } finally {
              setIsLoading(false);
            }
          }}
        >
          <CallIcon fontSize="small" sx={{ mr: 1 }} className="call-icon" />
          <span className="call-action-text">CTC Call</span>
        </MenuItem>
        {item?.CTCCallRecording && (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              window.open(item?.CTCCallRecording, "_blank");
              setOpenDropdown(null);
            }}
          >
            <PlayCircleFilledIcon
              fontSize="small"
              sx={{ mr: 1 }}
              className="recording-icon"
            />
            <span className="recording-action-text">Recording</span>
          </MenuItem>
        )} */}
      </Menu>
    </div>
  );

  const handleEdit = async (item) => {
    try {
      const countryName = item.country;
      const stateName = item.state;
      const cityName = item.city;

      const selectedCountry = countries.find(
        (c) => c.name.trim() === countryName,
      );
      const countryIsoCode = selectedCountry?.isoCode;

      if (!countryIsoCode) {
        formik.setFieldValue("country", countryName);
      }

      let fetchedStates = [];
      if (countryIsoCode) {
        const stateRes = await dispatch(stateDropdown(countryIsoCode));
        fetchedStates = stateRes?.data?.data || [];
        setStateDropDown(fetchedStates);
      }

      const selectedState = fetchedStates.find(
        (s) => s.name.trim() === stateName,
      );
      const stateIsoCode = selectedState?.isoCode;

      if (!stateIsoCode) {
        formik.setFieldValue("state", stateName);
      }

      let fetchedCities = [];
      if (stateIsoCode) {
        const cityRes = await dispatch(
          cityDropdown(countryIsoCode, stateIsoCode),
        );
        fetchedCities = cityRes?.data?.data || [];
        setCityDropDownList(fetchedCities);
      }

      if (!cityName) {
        formik.setFieldValue("city", cityName);
      }

      formik.setValues({
        ...formik.initialValues,
        ...item,
        id: item._id,
        country: countryIsoCode || countryName,
        state: stateIsoCode || stateName,
        city: cityName || "",
        logo: item?.companyLogo?.replace("uploads\\", ""),
        cancelCheque: item?.cancelChequeImage?.replace("uploads\\", ""),
        memberLimit: item.memberLimit || 5,
        agreementStartDate: convertToDDMMYYYY(item.agreementStartDate) || "",
        agreementEndDate: convertToDDMMYYYY(item.agreementEndDate) || "",
        GST_VAT: item.GST_VAT || "",
        password: "",
        created_by: item.created_by?._id || null,
        subscription: item.subscription || false,
      });
      if (item.companyLogo) {
        if (item.companyLogo?.startsWith("uploads")) {
          const imageUrl = `${BASEURL}${item.companyLogo}`;
          setProfilePreview(imageUrl);
        } else {
          const imageUrl = `${BASEURL}${item.companyLogo}`;
          setProfilePreview(imageUrl);
        }
      }
      if (item.cancelChequeImage) {
        const cancleCheckUrl = `${BASEURL}${item.cancelChequeImage}`;
        setCheckPreview(cancleCheckUrl);
      }

      setShow(true);
    } catch (error) {
      console.log("Edit error:", error);
    }
  };

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  useEffect(() => {
    if (formik.values.agreementStartDate) {
      const value = formik.values.agreementStartDate;
      if (value.includes("/")) {
        const [day, month, year] = value.split("/");
        setAgreementStartValue(new Date(`${year}-${month}-${day}`));
      } else if (value.includes("-")) {
        setAgreementStartValue(new Date(value));
      }
    }
    if (formik.values.agreementEndDate) {
      const value = formik.values.agreementEndDate;
      if (value.includes("/")) {
        const [day, month, year] = value.split("/");
        setAgreementEndValue(new Date(`${year}-${month}-${day}`));
      } else if (value.includes("-")) {
        setAgreementEndValue(new Date(value));
      }
    }
  }, [formik.values.agreementStartDate, formik.values.agreementEndDate]);

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

  const handleSampleFileDownload = () => {
    const link = document.createElement("a");
    link.href = `https://zokepconsultant.com/api/public/sampleB2BAdminBulkUpload/b2b_admin_bulkUpload.xlsx`;
    link.setAttribute("download", "b2bAdmin_upload.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkUpload = async () => {
    if (!uploadFile) {
      toast.error("Please upload an Excel file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("excelFile", uploadFile);

      const res = await dispatch(b2bBulkUpload(formData));

      if (res?.status === 200 || res?.data?.code === 200) {
        toast.success("Bulk upload successful");
        handleCloseUploadModal();

        fetchAllAdmin(
          currentPage,
          itemsPerPage,
          search,
          statusFilter,
          countryFilter,
          subscriptionFilter,
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Upload failed");
    }
  };

  const handleDownloadB2BAdmin = async () => {
    try {
      const res = await dispatch(
        downloadB2bAdmin(
          search,
          statusFilter,
          countryFilter,
          subscriptionFilter,
        ),
      );

      if (res?.data?.status && res?.data?.fileUrl) {
        const fileUrl = res.data.fileUrl;

        const downloadUrl = `${REACT_APP_API_URL}${fileUrl}`;

        const link = document.createElement("a");
        link.href = downloadUrl;

        link.download = fileUrl.split("/").pop();

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error("Download file not found");
      }
    } catch (error) {
      toast.error("Download failed");
      console.error(error);
    }
  };

  return (
    <>
      <Pageheader mainheading="Admin" parentfolder="Home" activepage="Admin" />

      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0 d-flex justify-content-between">
              <div className="card-title mb-0"></div>
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
                      id="typehead1"
                      placeholder="Search here..."
                      autoComplete="off"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>
                <Button
                  variant="primary"
                  className="custom-select-height px-3"
                  onClick={handleDownloadB2BAdmin}
                >
                  Download
                </Button>
                <div className="d-flex flex-column">
                  <Button
                    variant="primary"
                    className="custom-select-height px-3 mt-4"
                    onClick={handleShowUploadModal}
                  >
                    Bulk Upload
                  </Button>

                  <Link
                    href="#"
                    className="mt-1 text-decoration-underline"
                    onClick={handleSampleFileDownload}
                  >
                    Get Sample File
                  </Link>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
                {canCreate && (
                  <div>
                    <Button
                      variant="primary"
                      className="filter-height"
                      onClick={handleShow}
                    >
                      Add Admin
                    </Button>
                  </div>
                )}

                <div className="filter-item">
                  <Form.Label>Status</Form.Label>
                  <Select
                    options={statusOptions}
                    value={statusOptions.find(
                      (option) => option.value === statusFilter,
                    )}
                    onChange={(selectedOption) => {
                      setStatusFilter(
                        selectedOption ? selectedOption.value : "",
                      );
                      setCurrentPage(1);
                    }}
                    placeholder="Select Status"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "12px",
                        color: "black",
                        minWidth: "150px",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "black",
                        fontSize: "13px",
                      }),
                    }}
                  />
                </div>
                <div className="filter-item">
                  <Form.Label>Country</Form.Label>
                  <Select
                    id="country-select"
                    options={b2bAdminCountries?.map((country) => ({
                      value: country,
                      label: country,
                    }))}
                    onChange={(selectedOption) => {
                      setCountryFilter(
                        selectedOption ? selectedOption.value : "",
                      );
                      setCurrentPage(1);
                    }}
                    value={
                      countryFilter
                        ? { value: countryFilter, label: countryFilter }
                        : null
                    }
                    placeholder="Select Country"
                    isClearable
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "12px",
                        color: "black",
                        minWidth: "150px",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "black",
                        fontSize: "13px",
                      }),
                    }}
                  />
                </div>
                <div className="filter-item">
                  <Form.Label>Subscription</Form.Label>
                  <Select
                    options={subscriptionOptions}
                    value={subscriptionOptions.find(
                      (option) => option.value === subscriptionFilter,
                    )}
                    onChange={(selectedOption) => {
                      setSubscriptionFilter(
                        selectedOption ? selectedOption.value : "",
                      );
                      setCurrentPage(1);
                    }}
                    placeholder="Select Subscription"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "12px",
                        color: "black",
                        minWidth: "150px",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "black",
                        fontSize: "13px",
                      }),
                    }}
                  />
                </div>

                <div className="flex-grow-1"></div>

                {canRead && (
                  <>
                    <div>
                      <ItemsPerPageSelect
                        itemsPerPage={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                      />
                    </div>

                    <div className="filter-height total-records px-3 d-flex align-items-center">
                      <span>
                        Total Records: <strong>{totalRecords}</strong>
                      </span>
                    </div>
                  </>
                )}
              </div>

              <Modal show={showUploadModal} onHide={handleCloseUploadModal}>
                <Modal.Header className="form-main-heading">
                  <Modal.Title>B2B Bulk Upload</Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={handleCloseUploadModal}
                  />
                </Modal.Header>

                <Modal.Body>
                  <Form>
                    <Form.Group>
                      <Form.Label>Select a file to upload</Form.Label>
                      <Form.Control
                        type="file"
                        name="excelFile"
                        className="custom-select-height"
                        onChange={(e) => setUploadFile(e.target.files[0])}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>

                <Modal.Footer>
                  <Button
                    variant="outline-primary"
                    className="custom-select-height"
                    onClick={handleCloseUploadModal}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="primary"
                    className="custom-select-height"
                    onClick={handleBulkUpload}
                  >
                    Upload
                  </Button>
                </Modal.Footer>
              </Modal>

              <Modal show={show} onHide={handleClose} size="xl" centered>
                <Modal.Header className="form-main-heading">
                  <Modal.Title>
                    {formik?.values?.id ? "Update Admin" : "Add Admin"}
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
                      <Col md={4} className="mb-3">
                        <Form.Label>Company Name</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter Company Name"
                          name="companyName"
                          value={formik.values.companyName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik?.touched?.companyName &&
                          formik.errors.companyName && (
                            <div className="text-danger">
                              {formik.errors.companyName}
                            </div>
                          )}
                      </Col>
                      <Col md={4} className="mb-3">
                        <Form.Label>Contact Person</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter Contact Person"
                          name="contactPerson"
                          value={formik.values.contactPerson}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik?.touched?.contactPerson &&
                          formik.errors.contactPerson && (
                            <div className="text-danger">
                              {formik.errors.contactPerson}
                            </div>
                          )}
                      </Col>
                      <Col md={4} className="mb-3">
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
                              "",
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

                      <Col md={4} className="mb-3">
                        <Form.Label>Company Logo</Form.Label>
                        <Form.Control
                          type="file"
                          name="logo"
                          className="custom-select-height"
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.currentTarget.files[0];
                            formik.setFieldValue("logo", file);
                            setProfilePreview(URL.createObjectURL(file));
                          }}
                        />

                        {formik?.touched?.logo && formik.errors.logo && (
                          <div className="text-danger">
                            {formik.errors.logo}
                          </div>
                        )}
                        {profilePreview && (
                          <div
                            className="mb-2"
                            style={{
                              width: "100px",
                              height: "100px",
                              overflow: "hidden",
                              border: "1px solid #ccc",
                              borderRadius: "5px",
                              backgroundColor: "#f9f9f9",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <img
                              src={profilePreview}
                              alt="Profile Preview"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                            />
                          </div>
                        )}
                      </Col>
                      <Col md={4} className="mb-3">
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
                        {formik?.touched?.email && formik.errors.email && (
                          <div className="text-danger">
                            {formik.errors.email}
                          </div>
                        )}
                      </Col>
                      <Col md={4} className="mb-3">
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
                      <Col md={4} className="mb-3">
                        <Form.Label>Website URL</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter Website URL"
                          name="websiteUrl"
                          value={formik.values.websiteUrl}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik?.touched?.websiteUrl &&
                          formik.errors.websiteUrl && (
                            <div className="text-danger">
                              {formik.errors.websiteUrl}
                            </div>
                          )}
                      </Col>
                      <Col md={4} className="mb-3">
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
                              option ? option.value : "",
                            )
                          }
                          onBlur={() => formik.setFieldTouched("status", true)}
                          options={formStatusOptions}
                          placeholder="Select Status"
                          isClearable
                        />
                        {formik?.touched?.status && formik.errors.status && (
                          <div className="text-danger">
                            {formik.errors.status}
                          </div>
                        )}
                      </Col>
                      <Col md={4} className="mb-3">
                        <Form.Label>Member Limit</Form.Label>
                        <Form.Control
                          type="number"
                          className="custom-select-height"
                          placeholder="Enter Member Limit"
                          name="memberLimit"
                          value={formik.values.memberLimit}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik?.touched?.memberLimit &&
                          formik.errors.memberLimit && (
                            <div className="text-danger">
                              {formik.errors.memberLimit}
                            </div>
                          )}
                      </Col>
                      {/* <Col md={4} className="mb-3">
                        <Form.Label>Assign Team</Form.Label>
                        <Form.Select
                          name="b2bAssignRole"
                          className="custom-select-height"
                          value={formik.values.b2bAssignRole}
                          style={{ fontSize: "13px" }}
                          onChange={(e) => {
                            const selectedRoleId = e.target.value;
                            const selectedRole = roleDropDown.find(
                              (role) => role._id === selectedRoleId
                            );

                            formik.setFieldValue(
                              "b2bAssignRole",
                              selectedRoleId
                            );

                            if (selectedRole) {
                              fetchAllUser(selectedRole.name);
                            }
                          }}
                          onBlur={formik.handleBlur}
                        >
                          <option value="">Select Role</option>
                          {roleDropDown.map((role) => (
                            <option key={role._id} value={role._id}>
                              {role.name}
                            </option>
                          ))}
                        </Form.Select>

                        {formik.touched.b2bAssignRole &&
                          formik.errors.b2bAssignRole && (
                            <div className="text-danger">
                              {formik.errors.b2bAssignRole}
                            </div>
                          )}
                      </Col>

                      <Col md={4} className="mb-3">
                        <Form.Label>Assign Team Member</Form.Label>
                        <Form.Select
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter Assign Team"
                          name="assignTeam"
                          style={{ fontSize: "13px" }}
                          value={formik.values.assignTeam}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          disabled={!formik.values.b2bAssignRole}
                        >
                          <option value="">Select Assign Team</option>
                          {allUser.map((user) => (
                            <option key={user._id} value={user._id}>
                              {user.name}
                            </option>
                          ))}
                        </Form.Select>
                        {formik?.touched?.assignTeam &&
                          formik.errors.assignTeam && (
                            <div className="text-danger">
                              {formik.errors.assignTeam}
                            </div>
                          )}
                      </Col>
                      <Col md={4} className="mb-3">
                        <Form.Label>Commission Percentage</Form.Label>
                        <Form.Control
                          type="number"
                          className="custom-select-height"
                          placeholder="Enter Commission Percentage"
                          name="commissionPercentage"
                          value={formik.values.commissionPercentage}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          max={100}
                        />
                        {formik?.touched?.commissionPercentage &&
                          formik.errors.commissionPercentage && (
                            <div className="text-danger">
                              {formik.errors.commissionPercentage}
                            </div>
                          )}
                      </Col> */}
                      <Col md={4} className="mb-3">
                        <Form.Label>Subscription</Form.Label>
                        <Form.Check
                          type="checkbox"
                          label="Subscribed"
                          name="subscription"
                          className="custom-checkbox"
                          id="subscription"
                          checked={formik.values.subscription}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik?.touched?.subscription &&
                          formik.errors.subscription && (
                            <div className="text-danger">
                              {formik.errors.subscription}
                            </div>
                          )}
                      </Col>
                      <Col md={4} className="mb-3">
                        <Form.Label>Country</Form.Label>
                        <Select
                          className="custom-select-height"
                          options={countries?.map((c) => ({
                            value: c.isoCode,
                            label: c.name,
                          }))}
                          value={countries
                            ?.map((c) => ({ value: c.isoCode, label: c.name }))
                            .filter((o) => o.value === formik.values.country)}
                          onChange={(option) => {
                            const selectedOption = Array.isArray(option)
                              ? option[0]
                              : option;

                            const isValid = countries?.some(
                              (c) => c.isoCode === selectedOption?.value,
                            );
                            if (isValid) {
                              handleCountryChange(selectedOption.value);
                              formik.setFieldValue(
                                "country",
                                selectedOption.value,
                              );
                              formik.setFieldError("country", "");
                            } else {
                              formik.setFieldValue("country", "");
                            }
                          }}
                          onMenuOpen={() => setIsDropdownOpen(true)}
                          onMenuClose={() => setIsDropdownOpen(false)}
                          placeholder="Select Country"
                          isClearable
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderRadius: " 12px",
                              color: "black",
                            }),
                            placeholder: (base) => ({
                              ...base,
                              color: "black",
                              fontSize: "13px",
                            }),
                          }}
                        />
                        {formik?.touched?.country && formik.errors.country && (
                          <div className="text-danger">
                            {formik.errors.country}
                          </div>
                        )}
                      </Col>
                      <Col md={4} className="mb-3">
                        <Form.Label>State</Form.Label>
                        <Select
                          className="custom-select-height"
                          options={stateDropDown?.map((state) => ({
                            value: state.isoCode,
                            label: state.name,
                          }))}
                          value={
                            formik.values.state
                              ? stateDropDown
                                  ?.map((state) => ({
                                    value: state.isoCode,
                                    label: state.name,
                                  }))
                                  .filter(
                                    (s) => s.value === formik.values.state,
                                  )
                              : []
                          }
                          onChange={(option) => {
                            const selectedOption = Array.isArray(option)
                              ? option[0]
                              : option;

                            const isValid = stateDropDown?.some(
                              (s) => s.isoCode === selectedOption?.value,
                            );

                            if (isValid) {
                              formik.setFieldValue(
                                "state",
                                selectedOption.value,
                              );
                              handleStateChange(
                                formik.values.country,
                                selectedOption.value,
                              );
                              formik.setFieldError("state", "");
                            } else {
                              formik.setFieldValue("state", "");
                            }
                          }}
                          onMenuOpen={() => setIsDropdownOpen(true)}
                          onMenuClose={() => setIsDropdownOpen(false)}
                          placeholder="Select State"
                          isClearable
                          isDisabled={!formik.values.country}
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderRadius: " 12px",
                              color: "black",
                            }),
                            placeholder: (base) => ({
                              ...base,
                              color: "black",
                              fontSize: "13px",
                            }),
                          }}
                        />
                        {formik?.touched?.state && formik.errors.state && (
                          <div className="text-danger">
                            {formik.errors.state}
                          </div>
                        )}
                      </Col>
                      <Col md={4} className="mb-3">
                        <Form.Label>City</Form.Label>
                        <CreatableSelect
                          className="custom-select-height"
                          options={cityDropDownList?.map((city) => ({
                            value: typeof city === "string" ? city : city.name,
                            label: typeof city === "string" ? city : city.name,
                          }))}
                          value={
                            formik.values.city
                              ? [
                                  {
                                    value: formik.values.city,
                                    label: formik.values.city,
                                  },
                                ]
                              : []
                          }
                          onChange={(selectedOption) => {
                            const selected = Array.isArray(selectedOption)
                              ? selectedOption[0]
                              : selectedOption;
                            const cityName = selected?.value || "";
                            formik.setFieldValue("city", cityName);
                            formik.setFieldError("city", "");
                          }}
                          onCreateOption={(inputValue) => {
                            formik.setFieldValue("city", inputValue);
                            formik.setFieldError("city", "");
                          }}
                          onMenuOpen={() => setIsDropdownOpen(true)}
                          onMenuClose={() => setIsDropdownOpen(false)}
                          placeholder="Select City"
                          isClearable
                          isSearchable
                          isDisabled={!formik.values.state}
                          noOptionsMessage={() => "No cities available"}
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderRadius: " 12px",
                              color: "black",
                            }),
                            placeholder: (base) => ({
                              ...base,
                              color: "black",
                              fontSize: "13px",
                            }),
                          }}
                        />
                        {formik?.touched?.city && formik.errors.city && (
                          <div className="text-danger">
                            {formik.errors.city}
                          </div>
                        )}
                      </Col>
                      <Col md={4} className="mb-3">
                        <Form.Label>Agreement Starting Date</Form.Label>
                        <div style={{ position: "relative" }}>
                          <Form.Control
                            type="text"
                            readOnly
                            ref={agreementStartInputRef}
                            onClick={() => {
                              if (formik.values.agreementStartDate) {
                                setAgreementStartValue(
                                  formik.values.agreementStartDate.includes("/")
                                    ? (() => {
                                        const [day, month, year] =
                                          formik.values.agreementStartDate.split(
                                            "/",
                                          );
                                        return new Date(
                                          `${year}-${month}-${day}`,
                                        );
                                      })()
                                    : new Date(
                                        formik.values.agreementStartDate,
                                      ),
                                );
                              }
                              setShowAgreementEndCalendar(false);
                              setShowAgreementStartCalendar((show) => !show);
                            }}
                            value={formik.values.agreementStartDate || ""}
                            placeholder="dd/mm/yyyy"
                            className="custom-select-height"
                            style={{
                              cursor: "pointer",
                              backgroundColor: "#fff",
                              paddingRight: 36,
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
                          {showAgreementStartCalendar && (
                            <div
                              ref={agreementStartCalendarRef}
                              style={{
                                position: "absolute",
                                top: "100%",
                                left: "0",
                                zIndex: 9999,
                                background: "#fff",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                                borderRadius: "8px",
                                marginTop: "10px",
                                marginBottom: "100px",
                                width: 300,
                                minWidth: 300,
                                maxWidth: 300,
                              }}
                            >
                              <Calendar
                                className="form-control m-0 p-0 border-0"
                                onChange={(selectedDate) => {
                                  setAgreementStartValue(selectedDate);
                                  formik.setFieldValue(
                                    "agreementStartDate",
                                    formatDate(selectedDate),
                                  );
                                  setShowAgreementStartCalendar(false);
                                }}
                                value={agreementStartValue}
                                locale="en-GB"
                              />
                            </div>
                          )}
                        </div>
                        {formik.touched.agreementStartDate &&
                          formik.errors.agreementStartDate && (
                            <div className="text-danger">
                              {formik.errors.agreementStartDate}
                            </div>
                          )}
                      </Col>
                      <Col md={4} className="mb-3">
                        <Form.Label>Agreement Ending Date</Form.Label>
                        <div style={{ position: "relative" }}>
                          <Form.Control
                            type="text"
                            readOnly
                            ref={agreementEndInputRef}
                            onClick={() => {
                              if (formik.values.agreementEndDate) {
                                setAgreementEndValue(
                                  formik.values.agreementEndDate.includes("/")
                                    ? (() => {
                                        const [day, month, year] =
                                          formik.values.agreementEndDate.split(
                                            "/",
                                          );
                                        return new Date(
                                          `${year}-${month}-${day}`,
                                        );
                                      })()
                                    : new Date(formik.values.agreementEndDate),
                                );
                              }
                              setShowAgreementStartCalendar(false);
                              setShowAgreementEndCalendar((show) => !show);
                            }}
                            value={formik.values.agreementEndDate || ""}
                            placeholder="dd/mm/yyyy"
                            className="custom-select-height"
                            style={{
                              cursor: "pointer",
                              backgroundColor: "#fff",
                              paddingRight: 36,
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
                          {showAgreementEndCalendar && (
                            <div
                              ref={agreementEndCalendarRef}
                              style={{
                                position: "absolute",
                                top: "100%",
                                left: "0",
                                zIndex: 9999,
                                background: "#fff",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                                borderRadius: "8px",
                                marginTop: "16px",
                                width: 300,
                                minWidth: 300,
                                maxWidth: 300,
                              }}
                            >
                              <Calendar
                                className="form-control m-0 p-0 border-0"
                                onChange={(selectedDate) => {
                                  setAgreementEndValue(selectedDate);
                                  formik.setFieldValue(
                                    "agreementEndDate",
                                    formatDate(selectedDate),
                                  );
                                  setShowAgreementEndCalendar(false);
                                }}
                                value={agreementEndValue}
                                locale="en-GB"
                              />
                            </div>
                          )}
                        </div>
                        {formik.touched.agreementEndDate &&
                          formik.errors.agreementEndDate && (
                            <div className="text-danger">
                              {formik.errors.agreementEndDate}
                            </div>
                          )}
                      </Col>
                      <Col md={4} className="mb-3">
                        <Form.Label>GST/VAT</Form.Label>
                        <Form.Control
                          type="text"
                          name="GST_VAT"
                          className="custom-select-height"
                          placeholder="Enter GST/VAT"
                          value={formik.values.GST_VAT}
                          onChange={(e) =>
                            formik.setFieldValue("GST_VAT", e.target.value)
                          }
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.GST_VAT && formik.errors.GST_VAT && (
                          <div className="text-danger">
                            {formik.errors.GST_VAT}
                          </div>
                        )}
                      </Col>
                    </Row>

                    <div
                      className={`section-wrapper ${
                        isDropdownOpen ? "dropdown-open" : ""
                      }`}
                    >
                      <h5
                        className="form-heading p-2 d-flex justify-content-between"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setShowAccountDetails(!showAccountDetails)
                        }
                      >
                        Account Details
                        {showAccountDetails ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </h5>
                      {showAccountDetails && (
                        <div className="section-content mt-4 mb-5">
                          <Row className="mb-3">
                            <Col md={4} className="mb-3">
                              <Form.Label>Bank Name</Form.Label>
                              <Form.Control
                                name="bankName"
                                placeholder="Enter Bank Name"
                                type="text"
                                className="custom-select-height"
                                value={formik.values.bankName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              {formik.touched.bankName &&
                                formik.errors.bankName && (
                                  <div className="text-danger">
                                    {formik.errors.bankName}
                                  </div>
                                )}
                            </Col>
                            <Col md={4} className="mb-3">
                              <Form.Label>Account Number</Form.Label>
                              <Form.Control
                                name="accountNumber"
                                placeholder="Enter Account Number"
                                type="text"
                                className="custom-select-height"
                                value={formik.values.accountNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              {formik.touched.accountNumber &&
                                formik.errors.accountNumber && (
                                  <div className="text-danger">
                                    {formik.errors.accountNumber}
                                  </div>
                                )}
                            </Col>
                            <Col md={4} className="mb-3">
                              <Form.Label>Branch Address</Form.Label>
                              <Form.Control
                                name="branch"
                                placeholder="Enter Branch Address"
                                type="text"
                                className="custom-select-height"
                                value={formik.values.branch}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              {formik.touched.branch &&
                                formik.errors.branch && (
                                  <div className="text-danger">
                                    {formik.errors.branch}
                                  </div>
                                )}
                            </Col>
                            <Col md={4} className="mb-3">
                              <Form.Label>IFSC CODE</Form.Label>
                              <Form.Control
                                name="ifscCode"
                                placeholder="Enter IFSC CODE"
                                type="text"
                                className="custom-select-height"
                                value={formik.values.ifscCode}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              {formik.touched.ifscCode &&
                                formik.errors.ifscCode && (
                                  <div className="text-danger">
                                    {formik.errors.ifscCode}
                                  </div>
                                )}
                            </Col>
                            <Col md={4} className="mb-3">
                              <Form.Label>Cancel Cheque Photo</Form.Label>
                              <Form.Control
                                type="file"
                                name="cancelCheque"
                                className="custom-select-height"
                                accept="image/*"
                                onChange={(event) => {
                                  const file = event.currentTarget.files[0];
                                  formik.setFieldValue("cancelCheque", file);
                                  setCheckPreview(URL.createObjectURL(file));
                                }}
                                onBlur={formik.handleBlur}
                              />
                              {formik.touched.cancelCheque &&
                                formik.errors.cancelCheque && (
                                  <div className="text-danger">
                                    {formik.errors.cancelCheque}
                                  </div>
                                )}
                              {checkPreview && (
                                <div
                                  className="mb-2"
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    overflow: "hidden",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    backgroundColor: "#f9f9f9",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <img
                                    src={checkPreview}
                                    alt="Profile Preview"
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "contain",
                                    }}
                                  />
                                </div>
                              )}
                            </Col>
                          </Row>
                        </div>
                      )}
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-3">
                      <Button
                        variant="link"
                        className="custom-select-height btn border-primary text-primary text-decoration-none"
                        onClick={handleClose}
                      >
                        Close
                      </Button>
                      <Button
                        variant="primary"
                        className="custom-select-height"
                        type="submit"
                      >
                        Save
                      </Button>
                    </div>
                  </Form>
                </Modal.Body>
              </Modal>

              <ViewModal
                show={showViewModal}
                onHide={closeViewModal}
                title="B2B Admin Details"
                data={selectedItemData}
                fields={b2bSections}
              />
              <DeleteConfirmModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={() => {
                  handleDelete(selectedItemData);
                  setShowDeleteModal(false);
                }}
              />

              <DataTable
                columns={columns}
                data={adminList}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={handleItemsPerPageChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
                renderActions={renderActions}
                itemsPerPageOptions={true}
                canEdit={canUpdate}
                canDelete={canDelete}
                canRead={canRead}
              />

              {totalPages > 1 && adminList.length > 0 && (
                <div className="mt-4 d-flex justify-content-end align-items-end">
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
    </>
  );
};

export default B2BAdmin;
