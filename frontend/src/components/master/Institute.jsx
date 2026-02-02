import { useEffect, useRef, useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Card,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  cityDropdown,
  countryDropdown,
  createInstitute,
  deleteInstitute,
  getAllInstitute,
  stateDropdown,
  updateInstitute,
} from "../../redux/actions/Master/Institute.action";
import Paginations from "../elements/Paginations";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import {
  getAllCampus,
  getCampus,
} from "../../redux/actions/Master/Campus.action";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import DataTable from "../commonComponents/DataTable";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { REACT_APP_API_URL } from "../../baseUrl";
import "react-phone-input-2/lib/bootstrap.css";
import PhoneInput from "react-phone-input-2";
import usePermissions from "../commonComponents/usePermissions";
import ViewModal from "../commonComponents/ViewModal";
import LoadMoreButton from "../commonComponents/LoadMoreButton";
import { MdCalendarToday } from "react-icons/md";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { countryCodeISO } from "../../utils/countryISOCode";
import { getAllProgramLevel } from "../../redux/actions/Master/ProgramLevel.action";

const Institute = () => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const [countries, setCountries] = useState([]);
  const [stateDropDown, setStateDropDown] = useState([]);
  const [cityDropDownList, setCityDropDownList] = useState([]);
  const [campus, setCampus] = useState([]);
  const [campusByCountry, setCampusByCountry] = useState([]);
  const [instituteList, setInstituteList] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [programLevel, setProgramLevel] = useState([]);
  const handleCloseUploadModal = () => {
    setShowDeleteModal(false);
    setSelectedItem(null);
  };
  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Institute");

  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const startDateInputRef = useRef(null);
  const endDateInputRef = useRef(null);
  const startDateCalendarRef = useRef(null);
  const endDateCalendarRef = useRef(null);

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
    if (dateStr.includes("-")) return new Date(dateStr);
    return null;
  };
  const toISODate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        startDateInputRef.current &&
        !startDateInputRef.current.contains(event.target) &&
        startDateCalendarRef.current &&
        !startDateCalendarRef.current.contains(event.target)
      ) {
        setShowStartDateCalendar(false);
      }
      if (
        endDateInputRef.current &&
        !endDateInputRef.current.contains(event.target) &&
        endDateCalendarRef.current &&
        !endDateCalendarRef.current.contains(event.target)
      ) {
        setShowEndDateCalendar(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (show || showViewModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show, showViewModal]);
  const toggleDropdown = (index) => {
    setOpenDropdown((prev) => (prev === index ? null : index));
  };

  const instituteSections = [
    {
      title: "Basic Details",
      fields: [
        { label: "Country", key: "country" },
        { label: "State", key: "state" },
        { label: "City", key: "city" },
        { label: "Institute Name", key: "instituteName" },
        {
          label: "Campus",
          key: "campus",
          render: (item) => item?.campus?.campus || "N/A",
        },
      ],
    },

    {
      title: "Contact Information",
      fields: [
        { label: "Fax", key: "fax" },
        { label: "Contact 1", key: "contact1" },
        { label: "Contact 2", key: "contact2" },
        {
          label: "Contact Person",
          key: "contactPerson",
          fullRow: true,
          render: (item) => {
            const list = item?.contactPerson;

            if (!Array.isArray(list) || list.length === 0) return "N/A";

            return (
              <div style={{ overflowX: "auto", marginTop: "8px" }}>
                <table
                  style={{
                    minWidth: "650px",
                    borderCollapse: "collapse",
                    fontSize: "13px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          padding: "6px",
                          borderBottom: "1px solid #ccc",
                        }}
                      >
                        Name
                      </th>
                      <th
                        style={{
                          padding: "6px",
                          borderBottom: "1px solid #ccc",
                        }}
                      >
                        Designation
                      </th>
                      <th
                        style={{
                          padding: "6px",
                          borderBottom: "1px solid #ccc",
                        }}
                      >
                        Email
                      </th>
                      <th
                        style={{
                          padding: "6px",
                          borderBottom: "1px solid #ccc",
                        }}
                      >
                        Phone
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((p, i) => (
                      <tr key={i}>
                        <td style={{ padding: "6px" }}>{p.name || "-"}</td>
                        <td style={{ padding: "6px" }}>
                          {p.designation || "-"}
                        </td>
                        <td style={{ padding: "6px" }}>{p.email || "-"}</td>
                        <td style={{ padding: "6px" }}>{p.phone || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          },
        },
      ],
    },

    {
      title: "Email Information",
      fields: [
        { label: "Offer Letter Email", key: "offerLetterEmail" },
        { label: "Offer Letter Email CC", key: "offerLetterEmailCC" },
        { label: "Refund Email", key: "refundEmail" },
        { label: "Refund Email CC", key: "refundEmailCC" },
        { label: "TT Email", key: "ttEmail" },
        { label: "TT Email CC", key: "ttEmailCC" },
      ],
    },

    {
      title: "Commission Details",
      fields: [
        { label: "Admission Type", key: "admissionType" },
        // {
        //   label: "Commission Percentage",
        //   key: "commissionPercentage",
        //   render: (item) =>
        //     item?.commissionPercentage
        //       ? `${item.commissionPercentage}%`
        //       : "N/A",
        // },
        // { label: "Commission Period", key: "commissionPeriod" },
      ],
    },
    {
      title: "Program Level Commissions",
      fields: [
        {
          label: "Program Level Commissions",
          key: "programLevelCommissions",
          fullRow: true,
          render: (item) => {
            const list = item?.programLevelCommissions;

            if (!Array.isArray(list) || list.length === 0) return "N/A";

            return (
              <div style={{ overflowX: "auto", marginTop: "8px" }}>
                <table
                  style={{
                    minWidth: "650px",
                    borderCollapse: "collapse",
                    fontSize: "13px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          padding: "6px",
                          borderBottom: "1px solid #ccc",
                        }}
                      >
                        Program Level
                      </th>
                      <th
                        style={{
                          padding: "6px",
                          borderBottom: "1px solid #ccc",
                        }}
                      >
                        Commission Period
                      </th>
                      <th
                        style={{
                          padding: "6px",
                          borderBottom: "1px solid #ccc",
                        }}
                      >
                        Commission Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((pl, i) => (
                      <tr key={i}>
                        <td style={{ padding: "6px" }}>
                          {pl?.programLevel?.name || "-"}
                        </td>
                        <td style={{ padding: "6px" }}>
                          {pl?.commissionPeriod || "-"}
                        </td>
                        <td style={{ padding: "6px" }}>
                          {pl?.commissionPercentage
                            ? `${pl.commissionPercentage}%`
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          },
        },
      ],
    },

    {
      title: "Links",
      fields: [
        {
          label: "Web Address",
          key: "webAddress",
          render: (item) =>
            item?.webAddress ? (
              <a
                href={item.webAddress}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-decoration-underline"
              >
                {item.webAddress}
              </a>
            ) : (
              "N/A"
            ),
        },
        {
          label: "Portal",
          key: "portal",
          render: (item) =>
            item?.portal ? (
              <a
                href={item.portal}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-decoration-underline"
              >
                {item.portal}
              </a>
            ) : (
              "N/A"
            ),
        },
        { label: "YouTube Link", key: "youtubeLink" },
        { label: "Gallery Link", key: "galleryLink" },
      ],
    },

    {
      title: "Other Information",
      fields: [
        { label: "Other Info", key: "otherInfo" },
        { label: "Backlog", key: "backlog" },
      ],
    },

    {
      title: "Profile Image",
      fields: [
        {
          label: "Profile Image",
          key: "profile",
          fullRow: true,
          render: (item) =>
            item?.profile ? (
              <img
                src={`${REACT_APP_API_URL}/${item.profile}`}
                alt="Profile"
                style={{ maxWidth: "90px", maxHeight: "90px" }}
              />
            ) : (
              "N/A"
            ),
        },
      ],
    },
  ];

  // const instituteSections = [
  //   {
  //     title: "",
  //     fields: instituteFields,
  //   },
  // ];

  const admissionTypeOptions = [
    { value: "days", label: "Online" },
    { value: "weeks", label: "Offline" },
  ];

  const commissionPeriodOptions = [
    { value: "Per Semester", label: "Per Semester" },
    { value: "Per Year", label: "Per Year" },
    { value: "Per Quarter", label: "Per Quarter" },
  ];

  const agreementStatusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Expired", label: "Expired" },
    { value: "In Renewal Process", label: "In Renewal Process" },
    { value: "Pending", label: "Pending" },
    { value: "Pre-Requirement", label: "Pre-Requirement" },
    { value: "Terminated", label: "Terminated" },
  ];

  const valueOptions = [...Array(12)].map((_, i) => ({
    value: i + 1,
    label: `${i + 1}`,
  }));
  const unitOptions = [
    { value: "days", label: "Days" },
    { value: "weeks", label: "Weeks" },
    { value: "months", label: "Months" },
  ];
  const handleView = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
    setProfilePreview(null);

    setShowViewModal(false);
    setSelectedItem(null);
  };
  const handleShow = () => {
    if (canCreate) {
      setShow(true);
    } else {
      toast.error("You do not have permission to create.");
    }
  };

  const fetchCampuses = async () => {
    const res = await dispatch(getAllCampus(1, 100));
    setCampus(res?.data?.data?.data || []);
  };

  const fetchCountries = async () => {
    const res = await dispatch(countryDropdown());
    setCountries(res?.data?.data || []);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      fetchAllInstitute(1, newItemsPerPage, search);
    }
  };

  const fetchAllInstitute = async (
    page = 1,
    limit = itemsPerPage,
    search = ""
  ) => {
    try {
      const res = await dispatch(getAllInstitute(page, limit, search));
      const responseData = res?.data?.data;

      if (responseData?.data?.length === 0) {
        setInstituteList([]);
        setTotalPages(0);
      } else {
        setInstituteList(responseData?.data || []);
        setTotalPages(responseData?.totalPages || 0);
        setTotalRecords(responseData?.totalRecords || 0);
      }
    } catch (error) {
      console.error("Error fetching institute:", error);
      setInstituteList([]);
      setTotalPages(0);
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchAllInstitute(currentPage, itemsPerPage, search);
      fetchCountries();
      fetchCampuses();
    } else {
      setInstituteList([]);
      setCountries([]);
      setCampus([]);
      setCampusByCountry([]);
      setTotalPages(0);
      setTotalRecords(0);
    }
  }, [currentPage, search, canRead]);

  const handleCountryChange = async (countryIsoCode) => {
    try {
      formik.setFieldValue("country", countryIsoCode);
      formik.setFieldValue("state", "");
      formik.setFieldValue("city", "");
      setStateDropDown([]);
      setCityDropDownList([]);
      const selectedCountry = countries.find(
        (c) => c.isoCode === countryIsoCode
      );
      const countryName = selectedCountry?.name;

      if (countryName) {
        fetchAllCampusByCountry(countryName);
      }
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

  const fetchAllCampusByCountry = async (countryName) => {
    try {
      const res = await dispatch(getCampus(countryName));
      const responseData = res?.data?.data;
      setCampusByCountry(responseData || []);
    } catch (error) {
      console.log(error?.response?.data?.message || error.message);
    }
  };

  const fetchProgramLevel = async () => {
    try {
      const res = await dispatch(getAllProgramLevel(1, 1000, ""));
      setProgramLevel(res?.data?.data?.data || []);
    } catch (error) {
      console.log(error?.response?.data?.message || error.message);
      setProgramLevel([]);
    }
  };

  useEffect(() => {
    fetchProgramLevel();
  }, []);

  const formik = useFormik({
    initialValues: {
      country: "",
      state: "",
      city: "",
      instituteName: "",
      campus: "",
      offerLetterEmail: "",
      offerLetterEmailCC: "",
      refundEmail: "",
      refundEmailCC: "",
      ttEmail: "",
      ttEmailCC: "",
      contact1: "",
      contact2: "",
      // contactPerson: "",
      contactPerson: [{ name: "", designation: "", email: "", phone: "" }],
      recruitmentTerritoryRights: "",
      agreementStartDate: "",
      agreementEndDate: "",
      agreementStatus: "",
      typeOfAssociation: "",
      agreementDoc: "",
      admissionType: "",
      portal: "",
      webAddress: "",
      postalAddress: "",
      fax: "",
      // commissionPeriod: "",
      // commissionPercentage: "",
      programLevelCommissions: [
        { programLevel: "", commissionPeriod: "", commissionPercentage: "" },
      ],

      olTATPeriod: {
        value: "",
        unit: "",
      },
      profile: "",
      brochure: "",
      otherInfo: "",
      backlog: "",
      youtubeLink: "",
      galleryLink: "",
    },
    validationSchema: Yup.object({
      country: Yup.string().required("Country is required"),
      state: Yup.string(),
      city: Yup.string(),
      instituteName: Yup.string().required("Institute Name is required"),
      offerLetterEmail: Yup.string(),
      offerLetterEmailCC: Yup.string(),
      refundEmail: Yup.string(),
      refundEmailCC: Yup.string(),
      ttEmail: Yup.string(),
      ttEmailCC: Yup.string(),
      contact1: Yup.string(),
      contact2: Yup.string(),
      // contactPerson: Yup.string(),
      contactPerson: Yup.array().of(
        Yup.object().shape({
          name: Yup.string(),
          designation: Yup.string(),
          email: Yup.string().email("Invalid email"),
          phone: Yup.string(),
        })
      ),
      recruitmentTerritoryRights: Yup.string(),
      agreementStartDate: Yup.date(),
      agreementEndDate: Yup.date(),
      agreementStatus: Yup.string(),
      typeOfAssociation: Yup.string(),
      agreementDoc: Yup.mixed(),
      admissionType: Yup.string(),
      portal: Yup.string(),
      webAddress: Yup.string(),
      postalAddress: Yup.string(),
      fax: Yup.string(),
      // commissionPeriod: Yup.string(),
      // commissionPercentage: Yup.number(),
      programLevelCommissions: Yup.array().of(
        Yup.object().shape({
          programLevel: Yup.string(),
          commissionPeriod: Yup.string(),
          commissionPercentage: Yup.number(),
        })
      ),
      olTATPeriod: Yup.object().shape({
        value: Yup.number(),
        unit: Yup.string(),
      }),
      profile: Yup.string(),
      otherInfo: Yup.string(),
      backlog: Yup.string(),
      youtubeLink: Yup.string(),
      galleryLink: Yup.string(),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        toast.dismiss();
        const selectedCountry = countries.find(
          (c) => c.isoCode === values.country
        );
        const selectedState = stateDropDown.find(
          (s) => s.isoCode === values.state
        );

        const formattedValues = {
          ...values,
          country: selectedCountry?.name || values.country,
          state: selectedState?.name || values.state,
          city: values.city,
        };

        const payload = new FormData();

        // Append existing fields
        Object.keys(formattedValues).forEach((key) => {
          if (
            formattedValues[key] !== undefined &&
            formattedValues[key] !== null &&
            formattedValues[key] !== ""
          ) {
            if (key === "olTATPeriod") {
              payload.append(key, JSON.stringify(formattedValues[key]));
            } else if (
              key !== "contactPerson" &&
              key !== "programLevelCommissions" &&
              key !== "brochure" &&
              key !== "logo" &&
              key !== "profile" &&
              key !== "agreementDoc" &&
              key !== "olTATPeriod"
            ) {
              payload.append(key, formattedValues[key]);
            }
          }
        });

        if (
          formattedValues.contactPerson &&
          formattedValues.contactPerson.length > 0
        ) {
          formattedValues.contactPerson.forEach((person, index) => {
            if (
              person.name ||
              person.designation ||
              person.email ||
              person.phone
            ) {
              payload.append(
                `contactPerson[${index}][name]`,
                person.name || ""
              );
              payload.append(
                `contactPerson[${index}][designation]`,
                person.designation || ""
              );
              payload.append(
                `contactPerson[${index}][email]`,
                person.email || ""
              );
              payload.append(
                `contactPerson[${index}][phone]`,
                person.phone || ""
              );
            }
          });
        }
        if (
          Array.isArray(formattedValues.programLevelCommissions) &&
          formattedValues.programLevelCommissions.length > 0
        ) {
          formattedValues.programLevelCommissions.forEach((item, index) => {
            if (
              item.programLevel &&
              item.commissionPeriod &&
              item.commissionPercentage
            ) {
              payload.append(
                `programLevelCommissions[${index}][programLevel]`,
                item.programLevel
              );
              payload.append(
                `programLevelCommissions[${index}][commissionPeriod]`,
                item.commissionPeriod
              );
              payload.append(
                `programLevelCommissions[${index}][commissionPercentage]`,
                item.commissionPercentage
              );
            }
          });
        }

        if (formattedValues.olTATPeriod) {
          payload.append(
            "olTATPeriod[value]",
            formattedValues.olTATPeriod.value || ""
          );
          payload.append(
            "olTATPeriod[unit]",
            formattedValues.olTATPeriod.unit || ""
          );
        }

        if (
          formattedValues.profile &&
          typeof formattedValues.profile === "object"
        ) {
          payload.append("profile", formattedValues.profile);
        }
        if (
          formattedValues.brochure &&
          typeof formattedValues.brochure === "object"
        ) {
          payload.append("brochure", formattedValues.brochure);
        }
        if (
          formattedValues.agreementDoc &&
          typeof formattedValues.agreementDoc === "object"
        ) {
          payload.append("agreementDoc", formattedValues.agreementDoc);
        }

        if (values.id && canUpdate) {
          const res = await dispatch(updateInstitute(payload, values.id));
          if (res?.data?.code === 200) {
            toast.success("Institute updated successfully");
            handleClose();
          }
        } else if (canCreate) {
          const res = await dispatch(createInstitute(payload));
          if (res?.data?.code === 201) {
            toast.success("Institute added successfully");
            handleClose();
          }
        }
        resetForm();
        if (canRead) {
          fetchAllInstitute(currentPage, itemsPerPage, search);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    },
  });
  const handleEdit = async (item) => {
    if (canUpdate) {
      try {
        const countryName = item.country;
        const stateName = item.state;
        const cityName = item.city;

        const selectedCountry = countries.find(
          (c) => c.name.trim() === countryName
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
          (s) => s.name.trim() === stateName
        );
        const stateIsoCode = selectedState?.isoCode;

        if (!stateIsoCode) {
          formik.setFieldValue("state", stateName);
        }

        let fetchedCities = [];
        if (stateIsoCode) {
          const cityRes = await dispatch(
            cityDropdown(countryIsoCode, stateIsoCode)
          );
          fetchedCities = cityRes?.data?.data || [];
          setCityDropDownList(fetchedCities);
        }

        if (countryName) {
          await fetchAllCampusByCountry(countryName);
        }

        if (!cityName) {
          formik.setFieldValue("city", cityName);
        }
        let contactPersons = Array.isArray(item.contactPerson)
          ? item.contactPerson.map((cp) => ({
              name: cp.name || "",
              designation: cp.designation || "",
              email: cp.email || "",
              phone: cp.phone || "",
            }))
          : item.contactPerson
          ? [
              {
                name: item.contactPerson.name || "",
                designation: item.contactPerson.designation || "",
                email: item.contactPerson.email || "",
                phone: item.contactPerson.phone || "",
              },
            ]
          : [{ name: "", designation: "", email: "", phone: "" }];

        formik.setValues({
          ...formik.initialValues,
          ...item,
          id: item._id,
          olTATPeriod:
            typeof item?.olTATPeriod === "string"
              ? JSON.parse(item.olTATPeriod)
              : item.olTATPeriod || { value: "", unit: "" },
          country: countryIsoCode || countryName,
          state: stateIsoCode || stateName,
          city: cityName || "",
          campus: item.campus?._id || item.campus,
          brochure: item.brochure?.replace("uploads\\", ""),
          profile: item.profile?.replace("uploads\\", ""),
          agreementDoc: item.agreementDoc?.replace("uploads\\", ""),
          backlog: item.backlog,
          youtubeLink: item.youtubeLink,
          galleryLink: item.galleryLink,
          created_by: item.created_by?._id || null,
          contactPerson: contactPersons,
          programLevelCommissions:
            item.programLevelCommissions &&
            item.programLevelCommissions.length > 0
              ? item.programLevelCommissions.map((p) => ({
                  programLevel: p.programLevel?._id || p.programLevel || "",
                  commissionPeriod: p.commissionPeriod || "",
                  commissionPercentage: p.commissionPercentage || "",
                }))
              : [
                  {
                    programLevel: "",
                    commissionPeriod: "",
                    commissionPercentage: "",
                  },
                ],
        });
        if (item.profile) {
          const imageUrl = `${REACT_APP_API_URL}/${item?.profile}`;
          setProfilePreview(imageUrl);
        }
        setShow(true);
      } catch (err) {
        console.error("Error in handleEdit:", err);
        toast.error(
          err?.response?.data?.message ||
            "Something went wrong while loading data"
        );
      }
    }
  };

  const handleDelete = async (item) => {
    if (canDelete) {
      try {
        toast.dismiss();
        const res = await dispatch(deleteInstitute(item._id));
        if (res?.data?.code === 200) {
          toast.success("Institute deleted successfully");
        }
        const updatedPage =
          instituteList.length === 1 && currentPage > 1
            ? currentPage - 1
            : currentPage;
        setCurrentPage(updatedPage);
        if (canRead) {
          fetchAllInstitute(currentPage, itemsPerPage, search);
        }
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const addContactPerson = () => {
    formik.setFieldValue("contactPerson", [
      ...formik.values.contactPerson,
      { name: "", designation: "", email: "", phone: "" },
    ]);
  };

  const removeContactPerson = (index) => {
    const updatedPersons = formik.values.contactPerson.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue("contactPerson", updatedPersons);
  };

  const handleAgreementDownload = async (item) => {
    try {
      const docPath = item?.agreementDoc;
      if (!docPath) {
        toast.error("Agreement not available");
        return;
      }
      let normalizedPath = String(docPath).replace(/\\/g, "/");
      if (/^https?:\/\//i.test(normalizedPath)) {
        // absolute URL provided by backend
      } else if (!normalizedPath.startsWith("uploads/")) {
        normalizedPath = `uploads/${normalizedPath}`;
      }
      const url = /^https?:\/\//i.test(normalizedPath)
        ? normalizedPath
        : `${REACT_APP_API_URL}/${normalizedPath}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to download agreement");
      }
      const blob = await response.blob();
      const contentType = blob.type || "";
      let extension = "";
      if (
        contentType.includes("pdf") ||
        docPath.toLowerCase().endsWith(".pdf")
      ) {
        extension = ".pdf";
      } else if (contentType.startsWith("image/")) {
        const subtype = contentType.split("/")[1] || "png";
        extension = `.${subtype}`;
      } else {
        const idx = docPath.lastIndexOf(".");
        extension = idx !== -1 ? docPath.substring(idx) : "";
      }
      const safeBase =
        (item?.instituteName || "agreement")
          .replace(/[^a-z0-9\-_. ]/gi, "_")
          .trim() || "agreement";
      const fileName = `${safeBase}_agreement${extension}`;

      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Error in handleAgreementDownload:", err);
      toast.error(err?.message || "Download failed");
    }
  };

  const columns = [
    {
      label: "Country",
      key: "country",
    },
    {
      label: "City",
      key: "city",
    },
    {
      label: "Institute",
      render: (item) => {
        const instituteName = item?.instituteName || "-";

        return (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{instituteName}</Tooltip>}
          >
            <span style={{ cursor: "pointer" }}>{instituteName}</span>
          </OverlayTrigger>
        );
      },
    },
    {
      label: "Campus",
      // render: (item) => item?.campus?.campus || item?.campus || "-",
      render: (item) => {
        // 1. If campus is an object → use its .campus field
        // 2. If campus is a plain string → use it
        // 3. Fallback to "-"
        const campusObj = item?.campus;
        if (!campusObj) return "-";

        // object → extract the name
        if (typeof campusObj === "object" && campusObj !== null) {
          return campusObj.campus ?? "-";
        }

        // already a string (legacy data)
        return campusObj ?? "-";
      },
    },
    {
      label: "Portal Link",
      render: (item) => {
        const portal = item?.portal || "-";

        return (
          <OverlayTrigger placement="top" overlay={<Tooltip>{portal}</Tooltip>}>
            <span style={{ cursor: "pointer" }}>{portal}</span>
          </OverlayTrigger>
        );
      },
    },
    {
      label: "OL TAT Period",
      render: (item) => {
        try {
          const olTAT =
            typeof item?.olTATPeriod === "string"
              ? JSON.parse(item.olTATPeriod)
              : item?.olTATPeriod;
          return olTAT?.value && olTAT?.unit
            ? `${olTAT.value} ${olTAT.unit}`
            : "-";
        } catch (error) {
          return "-";
        }
      },
    },
    {
      label: "Offer Letter Email",
      key: "offerLetterEmail",
    },
    {
      label: "Offer Letter Email CC",
      key: "offerLetterEmailCC",
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
        {item?.agreementDoc && (
          <MenuItem
            onClick={() => {
              handleAgreementDownload(item);
              setOpenDropdown(null);
            }}
          >
            <DownloadIcon
              fontSize="small"
              sx={{ mr: 1 }}
              className="download-icon"
            />
            <span className="download-action-text">Agreement Download</span>
          </MenuItem>
        )}
      </Menu>
    </div>
  );

  return (
    <Row className="mt-5 row-sm">
      <Col md={12} lg={12} xl={12}>
        <Card className="custom-card transcation-crypto">
          <Card.Header className="border-bottom-0">
            <div>
              <div className="card-title">
                {formik.values.id ? "Update Institute" : "Add Institute"}
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
              {canCreate && (
                <Button
                  variant="primary"
                  className="custom-select-height"
                  onClick={handleShow}
                >
                  {formik.values.id ? "Update Institute" : "Add Institute"}
                </Button>
              )}
              <div className="flex-grow-1"></div>

              <div className="filter-item">
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
            </div>
            <Modal show={show} onHide={handleClose} size="xl" centered>
              <Modal.Header className="form-main-heading">
                <Modal.Title>
                  {formik.values.id ? "Update Institute" : "Add Institute"}
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
                {(canCreate || (canUpdate && formik.values.id)) && (
                  <Form onSubmit={formik.handleSubmit}>
                    <Row className="mb-3 mt-0">
                      <Col md={3} className="mb-3">
                        <Form.Label>Profile</Form.Label>
                        <Form.Control
                          type="file"
                          name="profile"
                          className="custom-select-height"
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.currentTarget.files[0];
                            formik.setFieldValue("profile", file);
                            setProfilePreview(URL.createObjectURL(file));
                          }}
                        />
                        {formik?.touched?.profile && formik.errors.profile && (
                          <div className="text-danger">
                            {formik.errors.profile}
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
                      <Col md={3} className="mb-3">
                        <Form.Label>Select Country</Form.Label>
                        <Select
                          options={countries?.map((c) => ({
                            value: c.isoCode,
                            label: c.name,
                          }))}
                          value={
                            countries
                              ?.map((c) => ({
                                value: c.isoCode,
                                label: c.name,
                              }))
                              .filter(
                                (o) => o.value === formik.values.country
                              )[0]
                          }
                          onChange={(selectedOption) => {
                            if (selectedOption) {
                              handleCountryChange(selectedOption.value);
                              formik.setFieldValue(
                                "country",
                                selectedOption.value
                              );
                              formik.setFieldError("country", "");
                            } else {
                              formik.setFieldValue("country", "");
                            }
                          }}
                          placeholder="Select Country"
                          isClearable
                          isSearchable
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
                        {formik?.touched?.country && formik.errors.country && (
                          <div className="text-danger">
                            {formik.errors.country}
                          </div>
                        )}
                      </Col>
                      <Col md={3} className="mb-3">
                        <Form.Label>Select State</Form.Label>
                        <Select
                          className="custom-select-height"
                          options={stateDropDown?.map((state) => ({
                            value: state.isoCode,
                            label: state.name,
                          }))}
                          value={
                            stateDropDown
                              ?.map((state) => ({
                                value: state.isoCode,
                                label: state.name,
                              }))
                              .filter((s) => s.value === formik.values.state)[0]
                          }
                          onChange={(selectedOption) => {
                            if (selectedOption) {
                              formik.setFieldValue(
                                "state",
                                selectedOption.value
                              );
                              handleStateChange(
                                formik.values.country,
                                selectedOption.value
                              );
                              formik.setFieldError("state", "");
                            } else {
                              formik.setFieldValue("state", "");
                            }
                          }}
                          placeholder="Select State"
                          isClearable
                          isSearchable
                          isDisabled={!formik.values.country}
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              borderRadius: "30px",
                              color: state.isDisabled ? "#6c757d" : "black",
                              backgroundColor: state.isDisabled
                                ? "#e9ecef"
                                : "white",
                              cursor: state.isDisabled
                                ? "not-allowed"
                                : "pointer",
                            }),
                            placeholder: (base, state) => ({
                              ...base,
                              color: state.isDisabled ? "#6c757d" : "black",
                              fontSize: "13px",
                            }),
                            singleValue: (base, state) => ({
                              ...base,
                              color: state.isDisabled ? "#6c757d" : "black",
                            }),
                          }}
                        />
                        {formik?.touched?.state && formik.errors.state && (
                          <div className="text-danger">
                            {formik.errors.state}
                          </div>
                        )}
                      </Col>
                      <Col md={3} className="mb-3">
                        <Form.Label>Select City</Form.Label>
                        <Select
                          className="custom-select-height"
                          options={cityDropDownList?.map((city) => {
                            const name =
                              typeof city === "string" ? city : city.name;
                            return { value: name, label: name };
                          })}
                          value={
                            formik.values.city
                              ? {
                                  value: formik.values.city,
                                  label: formik.values.city,
                                }
                              : null
                          }
                          onChange={(selectedOption) => {
                            if (selectedOption) {
                              formik.setFieldValue(
                                "city",
                                selectedOption.value
                              );
                              formik.setFieldError("city", "");
                            } else {
                              formik.setFieldValue("city", "");
                            }
                          }}
                          placeholder="Select City"
                          isClearable
                          isSearchable
                          isDisabled={!formik.values.state}
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              borderRadius: "30px",
                              color: state.isDisabled ? "#6c757d" : "black",
                              backgroundColor: state.isDisabled
                                ? "#e9ecef"
                                : "white",
                              cursor: state.isDisabled
                                ? "not-allowed"
                                : "pointer",
                            }),
                            placeholder: (base, state) => ({
                              ...base,
                              color: state.isDisabled ? "#6c757d" : "black",
                              fontSize: "13px",
                            }),
                            singleValue: (base, state) => ({
                              ...base,
                              color: state.isDisabled ? "#6c757d" : "black",
                            }),
                          }}
                        />

                        {formik?.touched?.city && formik.errors.city && (
                          <div className="text-danger">
                            {formik.errors.city}
                          </div>
                        )}
                      </Col>
                      <Col md={3} className="mb-3">
                        <Form.Label>Institute</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter institute name"
                          name="instituteName"
                          value={formik.values.instituteName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik?.touched?.instituteName &&
                          formik.errors.instituteName && (
                            <div className="text-danger">
                              {formik.errors.instituteName}
                            </div>
                          )}
                      </Col>

                      <Col md={3} className="mb-3">
                        <Form.Label>Select Campus</Form.Label>
                        <Select
                          options={campusByCountry
                            ?.sort((a, b) => a.campus.localeCompare(b.campus))
                            ?.map((c) => ({
                              value: c._id,
                              label: c.campus,
                            }))}
                          value={
                            formik.values.campus
                              ? {
                                  value: formik.values.campus,
                                  label:
                                    campusByCountry.find(
                                      (c) => c._id === formik.values.campus
                                    )?.campus || "",
                                }
                              : null
                          }
                          onChange={(selectedOption) => {
                            if (selectedOption) {
                              formik.setFieldValue(
                                "campus",
                                selectedOption.value
                              );
                              formik.setFieldError("campus", "");
                            } else {
                              formik.setFieldValue("campus", "");
                            }
                          }}
                          placeholder="Select Campus"
                          isClearable
                          isSearchable
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

                      <Col md={3} className="mb-3">
                        <Form.Label>Offer Letter Email</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter offer letter email"
                          name="offerLetterEmail"
                          value={formik.values.offerLetterEmail}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik?.touched?.offerLetterEmail &&
                          formik.errors.offerLetterEmail && (
                            <div className="text-danger">
                              {formik.errors.offerLetterEmail}
                            </div>
                          )}
                      </Col>
                      <Col md={3} className="mb-3">
                        <Form.Label>Offer Letter Email CC</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter offer letter email cc"
                          name="offerLetterEmailCC"
                          value={formik.values.offerLetterEmailCC}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik?.touched?.offerLetterEmailCC &&
                          formik.errors.offerLetterEmailCC && (
                            <div className="text-danger">
                              {formik.errors.offerLetterEmailCC}
                            </div>
                          )}
                      </Col>
                      <Col md={3} className="mb-3">
                        <Form.Label>TT Email</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter tt email"
                          name="ttEmail"
                          value={formik.values.ttEmail}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik?.touched?.ttEmail && formik.errors.ttEmail && (
                          <div className="text-danger">
                            {formik.errors.ttEmail}
                          </div>
                        )}
                      </Col>
                      <Col md={3} className="mb-3">
                        <Form.Label>TT Email CC</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter tt email cc"
                          name="ttEmailCC"
                          value={formik.values.ttEmailCC}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik?.touched?.ttEmailCC &&
                          formik.errors.ttEmailCC && (
                            <div className="text-danger">
                              {formik.errors.ttEmailCC}
                            </div>
                          )}
                      </Col>
                      <Col md={3} className="mb-3">
                        <Form.Label>Refund Email</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter refund email"
                          name="refundEmail"
                          value={formik.values.refundEmail}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik?.touched?.refundEmail &&
                          formik.errors.refundEmail && (
                            <div className="text-danger">
                              {formik.errors.refundEmail}
                            </div>
                          )}
                      </Col>
                      <Col md={3} className="mb-3">
                        <Form.Label>Refund Email CC</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter refund email cc"
                          name="refundEmailCC"
                          value={formik.values.refundEmailCC}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik?.touched?.refundEmailCC &&
                          formik.errors.refundEmailCC && (
                            <div className="text-danger">
                              {formik.errors.refundEmailCC}
                            </div>
                          )}
                      </Col>
                      <Col md={3} className="mb-3">
                        <Form.Label>Contact 1</Form.Label>
                        <PhoneInput
                          country={countryCodeISO()}
                          value={formik.values.contact1 || ""}
                          onChange={(phone, data) => {
                            const dialCode = data.dialCode
                              ? `+${data.dialCode}`
                              : "";
                            const formattedPhone = `${dialCode} ${phone.replace(
                              data.dialCode,
                              ""
                            )}`.trim();
                            formik.setFieldValue("contact1", formattedPhone);
                          }}
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
                        {formik.touched.contact1 && formik.errors.contact1 && (
                          <div className="text-danger">
                            {formik.errors.contact1}
                          </div>
                        )}
                      </Col>

                      <Col md={3} className="mb-3">
                        <Form.Label>Contact 2</Form.Label>
                        <PhoneInput
                          country={countryCodeISO()}
                          value={formik.values.contact2 || ""}
                          onChange={(phone, data) => {
                            const dialCode = data.dialCode
                              ? `+${data.dialCode}`
                              : "";
                            const formattedPhone = `${dialCode} ${phone.replace(
                              data.dialCode,
                              ""
                            )}`.trim();
                            formik.setFieldValue("contact2", formattedPhone);
                          }}
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
                        {formik.touched.contact2 && formik.errors.contact2 && (
                          <div className="text-danger">
                            {formik.errors.contact2}
                          </div>
                        )}
                      </Col>

                      <Col md={3} className="mb-3">
                        <Form.Label>Admission Type</Form.Label>
                        <Select
                          name="admissionType"
                          classNamePrefix="custom-select"
                          styles={{
                            control: (base) => ({
                              ...base,
                              fontSize: "13px",
                            }),
                          }}
                          value={
                            formik.values.admissionType
                              ? {
                                  value: formik.values.admissionType,
                                  label:
                                    admissionTypeOptions.find(
                                      (option) =>
                                        option.value ===
                                        formik.values.admissionType
                                    )?.label || "Select Admission Type",
                                }
                              : null
                          }
                          onChange={(option) =>
                            formik.setFieldValue(
                              "admissionType",
                              option ? option.value : ""
                            )
                          }
                          onBlur={() =>
                            formik.setFieldTouched("admissionType", true)
                          }
                          options={admissionTypeOptions}
                          placeholder="Select Admission Type"
                          clearable
                        />
                        {formik.touched.admissionType &&
                          formik.errors.admissionType && (
                            <div className="text-danger">
                              {formik.errors.admissionType}
                            </div>
                          )}
                      </Col>
                      <Col md={3} className="mb-3">
                        <Form.Label>Portal</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter portal"
                          name="portal"
                          value={formik.values.portal}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik?.touched?.portal && formik.errors.portal && (
                          <div className="text-danger">
                            {formik.errors.portal}
                          </div>
                        )}
                      </Col>
                      {/* <Col md={3} className="mb-3">
                        <Form.Label>Contact Person</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter person"
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
                      </Col> */}
                      {formik.values.contactPerson.map((person, index) => (
                        <Col md={12} className="mb-3" key={index}>
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <Form.Label>Contact Person {index + 1}</Form.Label>
                            {index > 0 && (
                              <Button
                                variant="outline-danger"
                                className="custom-select-height"
                                onClick={() => removeContactPerson(index)}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                          <Row>
                            <Col md={3}>
                              <Form.Control
                                type="text"
                                placeholder="Name"
                                className="custom-select-height"
                                name={`contactPerson[${index}].name`}
                                value={person.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              {formik.touched.contactPerson?.[index]?.name &&
                                formik.errors.contactPerson?.[index]?.name && (
                                  <div className="text-danger">
                                    {formik.errors.contactPerson[index].name}
                                  </div>
                                )}
                            </Col>
                            <Col md={3}>
                              <Form.Control
                                type="text"
                                placeholder="Designation"
                                className="custom-select-height"
                                name={`contactPerson[${index}].designation`}
                                value={person.designation}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                            </Col>
                            <Col md={3}>
                              <Form.Control
                                type="email"
                                placeholder="Email"
                                className="custom-select-height"
                                name={`contactPerson[${index}].email`}
                                value={person.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              {formik.touched.contactPerson?.[index]?.email &&
                                formik.errors.contactPerson?.[index]?.email && (
                                  <div className="text-danger">
                                    {formik.errors.contactPerson[index].email}
                                  </div>
                                )}
                            </Col>
                            <Col md={3}>
                              <PhoneInput
                                country={countryCodeISO()}
                                value={person.phone || ""}
                                onChange={(phone, data) => {
                                  const dialCode = data.dialCode
                                    ? `+${data.dialCode}`
                                    : "";
                                  const formattedPhone =
                                    `${dialCode} ${phone.replace(
                                      data.dialCode,
                                      ""
                                    )}`.trim();
                                  formik.setFieldValue(
                                    `contactPerson[${index}].phone`,
                                    formattedPhone
                                  );
                                }}
                                inputProps={{
                                  name: `contactPerson[${index}].phone`,
                                  className:
                                    "form-control custom-select-height",
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
                            </Col>
                          </Row>
                        </Col>
                      ))}
                      <Col md={12} className="mb-3">
                        <Button
                          variant="outline-primary"
                          className="custom-select-height"
                          onClick={addContactPerson}
                        >
                          Add Another Contact Person
                        </Button>
                      </Col>
                      <Col md={3} className="mb-3">
                        <Form.Label>Recruitment Territory Rights</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter countries or 'Global Rights'"
                          name="recruitmentTerritoryRights"
                          value={formik.values.recruitmentTerritoryRights}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.recruitmentTerritoryRights &&
                          formik.errors.recruitmentTerritoryRights && (
                            <div className="text-danger">
                              {formik.errors.recruitmentTerritoryRights}
                            </div>
                          )}
                      </Col>
                      <Col md={3} className="mb-3">
                        <Form.Label>Start Date of Agreement</Form.Label>
                        <div style={{ position: "relative" }}>
                          <Form.Control
                            type="text"
                            className="custom-select-height"
                            name="agreementStartDate"
                            placeholder="dd/mm/yyyy"
                            value={
                              formik.values.agreementStartDate
                                ? formatDate(
                                    parseDate(formik.values.agreementStartDate)
                                  )
                                : ""
                            }
                            readOnly
                            ref={startDateInputRef}
                            onClick={() => setShowStartDateCalendar(true)}
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
                          {showStartDateCalendar && (
                            <div
                              ref={startDateCalendarRef}
                              style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                zIndex: 10000,
                                background: "#fff",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                                borderRadius: "8px",
                                marginTop: "4px",
                                width: 350,
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Calendar
                                className="form-control m-0 p-0 border-0"
                                onChange={(selectedDate) => {
                                  formik.setFieldValue(
                                    "agreementStartDate",
                                    toISODate(selectedDate)
                                  );
                                  setShowStartDateCalendar(false);
                                }}
                                value={
                                  parseDate(formik.values.agreementStartDate) ||
                                  new Date()
                                }
                                locale="en-GB"
                              />
                            </div>
                          )}
                        </div>
                        {formik?.touched?.agreementStartDate &&
                          formik.errors.agreementStartDate && (
                            <div className="text-danger">
                              {formik.errors.agreementStartDate}
                            </div>
                          )}
                      </Col>
                      <Col md={3} className="mb-3">
                        <Form.Label>End Date of Agreement</Form.Label>
                        <div style={{ position: "relative" }}>
                          <Form.Control
                            type="text"
                            className="custom-select-height"
                            name="agreementEndDate"
                            placeholder="dd/mm/yyyy"
                            value={
                              formik.values.agreementEndDate
                                ? formatDate(
                                    parseDate(formik.values.agreementEndDate)
                                  )
                                : ""
                            }
                            readOnly
                            ref={endDateInputRef}
                            onClick={() => setShowEndDateCalendar(true)}
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
                          {showEndDateCalendar && (
                            <div
                              ref={endDateCalendarRef}
                              style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                zIndex: 10000,
                                background: "#fff",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                                borderRadius: "8px",
                                marginTop: "4px",
                                width: 350,
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Calendar
                                className="form-control m-0 p-0 border-0"
                                onChange={(selectedDate) => {
                                  formik.setFieldValue(
                                    "agreementEndDate",
                                    toISODate(selectedDate)
                                  );
                                  setShowEndDateCalendar(false);
                                }}
                                value={
                                  parseDate(formik.values.agreementEndDate) ||
                                  new Date()
                                }
                                locale="en-GB"
                              />
                            </div>
                          )}
                        </div>
                        {formik?.touched?.agreementEndDate &&
                          formik.errors.agreementEndDate && (
                            <div className="text-danger">
                              {formik.errors.agreementEndDate}
                            </div>
                          )}
                      </Col>
                      <Col md={3} className="mb-3">
                        <Form.Label>Current Status of Agreement</Form.Label>
                        <Select
                          name="agreementStatus"
                          classNamePrefix="custom-select"
                          styles={{
                            control: (base) => ({
                              ...base,
                              fontSize: "13px",
                            }),
                          }}
                          value={
                            formik.values.agreementStatus
                              ? {
                                  value: formik.values.agreementStatus,
                                  label: formik.values.agreementStatus,
                                }
                              : null
                          }
                          onChange={(option) =>
                            formik.setFieldValue(
                              "agreementStatus",
                              option ? option.value : ""
                            )
                          }
                          onBlur={() =>
                            formik.setFieldTouched("agreementStatus", true)
                          }
                          options={agreementStatusOptions}
                          placeholder="Select Agreement Status"
                          isClearable
                        />
                        {formik.touched.agreementStatus &&
                          formik.errors.agreementStatus && (
                            <div className="text-danger">
                              {formik.errors.agreementStatus}
                            </div>
                          )}
                      </Col>
                      <Col md={3} className="mb-3">
                        <Form.Label>Type of Association</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter association type (e.g., Direct, GUS, SIUK)"
                          name="typeOfAssociation"
                          value={formik.values.typeOfAssociation}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.typeOfAssociation &&
                          formik.errors.typeOfAssociation && (
                            <div className="text-danger">
                              {formik.errors.typeOfAssociation}
                            </div>
                          )}
                      </Col>
                      <Col md={3} className="mb-3">
                        <Form.Label>Upload Agreement</Form.Label>
                        <Form.Control
                          type="file"
                          name="agreementDoc"
                          className="custom-select-height"
                          accept="application/pdf"
                          onChange={(event) => {
                            const file = event.currentTarget.files[0];
                            formik.setFieldValue("agreementDoc", file);
                          }}
                        />
                        {formik.touched.agreementDoc &&
                          formik.errors.agreementDoc && (
                            <div className="text-danger">
                              {formik.errors.agreementDoc}
                            </div>
                          )}
                      </Col>
                      <Col md={3} className="mb-3">
                        <Form.Label>Fax</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter fax"
                          name="fax"
                          value={formik.values.fax}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik?.touched?.fax && formik.errors.fax && (
                          <div className="text-danger">{formik.errors.fax}</div>
                        )}
                      </Col>
                      <Col md={3} className="mb-3">
                        <Form.Label>Web Address</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter web address"
                          name="webAddress"
                          value={formik.values.webAddress}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik?.touched?.webAddress &&
                          formik.errors.webAddress && (
                            <div className="text-danger">
                              {formik.errors.webAddress}
                            </div>
                          )}
                      </Col>

                      {formik.values.programLevelCommissions?.map(
                        (commission, index) => (
                          <Col md={12} className="mb-3" key={index}>
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <Form.Label>
                                Program Level Commission {index + 1}
                              </Form.Label>
                              {index > 0 && (
                                <Button
                                  variant="outline-danger"
                                  className="custom-select-height"
                                  onClick={() => {
                                    const updated =
                                      formik.values.programLevelCommissions.filter(
                                        (_, i) => i !== index
                                      );
                                    formik.setFieldValue(
                                      "programLevelCommissions",
                                      updated
                                    );
                                  }}
                                >
                                  Remove
                                </Button>
                              )}
                            </div>

                            <Row>
                              <Col md={4}>
                                <Form.Label>Program Level</Form.Label>
                                <Select
                                  options={programLevel?.map((p) => ({
                                    value: p._id,
                                    label: p.name,
                                  }))}
                                  value={
                                    commission.programLevel
                                      ? {
                                          value: commission.programLevel,
                                          label:
                                            programLevel.find(
                                              (p) =>
                                                p._id ===
                                                commission.programLevel
                                            )?.name || "",
                                        }
                                      : null
                                  }
                                  onChange={(selectedOption) =>
                                    formik.setFieldValue(
                                      `programLevelCommissions[${index}].programLevel`,
                                      selectedOption ? selectedOption.value : ""
                                    )
                                  }
                                  placeholder="Select Program Level"
                                  isClearable
                                  classNamePrefix="custom-select"
                                  styles={{
                                    control: (base) => ({
                                      ...base,
                                      fontSize: "13px",
                                    }),
                                  }}
                                />
                              </Col>

                              <Col md={4}>
                                <Form.Label>Commission Period</Form.Label>
                                <Select
                                  options={[
                                    {
                                      value: "Per Semester",
                                      label: "Per Semester",
                                    },
                                    { value: "Per Year", label: "Per Year" },
                                    {
                                      value: "Per Quarter",
                                      label: "Per Quarter",
                                    },
                                  ]}
                                  value={
                                    commission.commissionPeriod
                                      ? {
                                          value: commission.commissionPeriod,
                                          label: commission.commissionPeriod,
                                        }
                                      : null
                                  }
                                  onChange={(selectedOption) =>
                                    formik.setFieldValue(
                                      `programLevelCommissions[${index}].commissionPeriod`,
                                      selectedOption ? selectedOption.value : ""
                                    )
                                  }
                                  placeholder="Select Commission Period"
                                  isClearable
                                  classNamePrefix="custom-select"
                                  styles={{
                                    control: (base) => ({
                                      ...base,
                                      fontSize: "13px",
                                    }),
                                  }}
                                />
                              </Col>

                              <Col md={4}>
                                <Form.Label>Commission Percentage</Form.Label>
                                <Form.Control
                                  type="number"
                                  placeholder="Enter commission %"
                                  className="custom-select-height"
                                  name={`programLevelCommissions[${index}].commissionPercentage`}
                                  value={commission.commissionPercentage}
                                  onChange={formik.handleChange}
                                />
                              </Col>
                            </Row>
                          </Col>
                        )
                      )}

                      <Col md={12} className="mb-3">
                        <Button
                          variant="outline-primary"
                          className="custom-select-height"
                          onClick={() =>
                            formik.setFieldValue("programLevelCommissions", [
                              ...formik.values.programLevelCommissions,
                              {
                                programLevel: "",
                                commissionPeriod: "",
                                commissionPercentage: "",
                              },
                            ])
                          }
                        >
                          Add Another Program Level
                        </Button>
                      </Col>
                      <Col md={3} className="mb-3">
                        <Form.Label>Portal Address</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter portal address"
                          name="postalAddress"
                          value={formik.values.postalAddress}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik?.touched?.postalAddress &&
                          formik.errors.postalAddress && (
                            <div className="text-danger">
                              {formik.errors.postalAddress}
                            </div>
                          )}
                      </Col>

                      <Col md={3} className="mb-3">
                        <Form.Label>OL TAT Period</Form.Label>
                        <div className="d-flex gap-2">
                          <Select
                            name="olTATPeriod.value"
                            classNamePrefix="custom-select"
                            styles={{
                              control: (base) => ({
                                ...base,
                                fontSize: "13px",
                                width: "120px",
                              }),
                            }}
                            value={
                              formik.values.olTATPeriod?.value
                                ? {
                                    value: formik.values.olTATPeriod.value,
                                    label: `${formik.values.olTATPeriod.value}`,
                                  }
                                : null
                            }
                            onChange={(option) =>
                              formik.setFieldValue(
                                "olTATPeriod.value",
                                option ? option.value : ""
                              )
                            }
                            onBlur={() =>
                              formik.setFieldTouched("olTATPeriod.value", true)
                            }
                            options={valueOptions}
                            placeholder="Select OL TAT Period"
                            clearable
                          />
                          <Select
                            name="olTATPeriod.unit"
                            classNamePrefix="custom-select"
                            styles={{
                              control: (base) => ({
                                ...base,
                                fontSize: "13px",
                                width: "120px",
                              }),
                            }}
                            value={
                              formik.values.olTATPeriod?.unit
                                ? {
                                    value: formik.values.olTATPeriod.unit,
                                    label: formik.values.olTATPeriod.unit,
                                  }
                                : null
                            }
                            onChange={(option) =>
                              formik.setFieldValue(
                                "olTATPeriod.unit",
                                option ? option.value : ""
                              )
                            }
                            onBlur={() =>
                              formik.setFieldTouched("olTATPeriod.unit", true)
                            }
                            options={unitOptions}
                            placeholder="Select Duration"
                            clearable
                          />
                        </div>
                        {((formik.touched?.olTATPeriod?.value &&
                          formik.errors?.olTATPeriod?.value) ||
                          (formik.touched?.olTATPeriod?.unit &&
                            formik.errors?.olTATPeriod?.unit)) && (
                          <div className="text-danger">
                            OL TAT Period is required
                          </div>
                        )}
                      </Col>
                      <Col md={3} className="mb-3">
                        <Form.Label>Upload Brochure</Form.Label>
                        <Form.Control
                          type="file"
                          name="brochure"
                          className="custom-select-height"
                          accept="application/pdf"
                          onChange={(event) => {
                            const file = event.currentTarget.files[0];
                            formik.setFieldValue("brochure", file);
                          }}
                        />
                      </Col>
                      <Col md={3} className="mb-3">
                        <Form.Label>Other</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter other"
                          name="otherInfo"
                          value={formik.values.otherInfo}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </Col>
                      <Col md={3} className="mb-3">
                        <Form.Label>Backlog</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter backlog"
                          name="backlog"
                          value={formik.values.backlog}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </Col>
                      <Col md={3} className="mb-3">
                        <Form.Label>Youtube Link</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter youtube url"
                          name="youtubeLink"
                          value={formik.values.youtubeLink}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </Col>
                      <Col md={3} className="mb-3">
                        <Form.Label>Gallery Link</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter gallery url"
                          name="galleryLink"
                          value={formik.values.galleryLink}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </Col>
                    </Row>

                    <div className="text-end">
                      <Button
                        variant="primary"
                        className="custom-select-height"
                        type="submit"
                      >
                        {formik.values.id
                          ? "Update Institute"
                          : "Add Institute"}
                      </Button>
                    </div>
                  </Form>
                )}
              </Modal.Body>
            </Modal>
            {/* <InstituteModelForm
              show={show}
              handleClose={handleClose}
              formik={formik}
              isLoading={isLoading}
              countries={countries}
              stateDropDown={stateDropDown}
              removeContactPerson={removeContactPerson}
              addContactPerson={addContactPerson}
              canCreate={canCreate}
              canUpdate={canUpdate}
              setProfilePreview={setProfilePreview}
              profilePreview={profilePreview}
              handleCountryChange={handleCountryChange}
              handleStateChange={handleStateChange}
              cityDropDownList={cityDropDownList}
              campusByCountry={campusByCountry}
              admissionTypeOptions={admissionTypeOptions}
              agreementStatusOptions={agreementStatusOptions}
              commissionPeriodOptions={commissionPeriodOptions}
              valueOptions={valueOptions}
              unitOptions={unitOptions}
            /> */}

            <ViewModal
              show={showViewModal}
              onHide={handleClose}
              title="Institute Details"
              data={selectedItem}
              fields={instituteSections}
            />

            <DataTable
              columns={columns}
              data={instituteList}
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
            <Modal
              show={showDeleteModal}
              onHide={handleCloseUploadModal}
              centered
            >
              <Modal.Header className="form-main-heading">
                <Modal.Title className="fw-semibold">
                  Confirm Deletion
                </Modal.Title>
                <AiOutlineClose
                  size={20}
                  style={{ cursor: "pointer", color: "white" }}
                  onClick={handleCloseUploadModal}
                />
              </Modal.Header>
              <Modal.Body className="text-center py-4">
                <div className="text-danger text-primary fs-1 mb-3">
                  <i className="bi bi-exclamation-triangle-fill"></i>{" "}
                </div>
                <p className="mb-1 fw-semibold">
                  Are you sure you want to delete this item?
                </p>
                <small className="text-muted">
                  This action cannot be undone.
                </small>
              </Modal.Body>

              <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
                <Button
                  variant="light"
                  className="btn-cancel-delete px-4"
                  onClick={handleCloseUploadModal}
                >
                  Cancel
                </Button>
                <Button
                  className="btn-delete-confirm"
                  onClick={() => {
                    handleDelete(selectedItem);
                    setShowDeleteModal(false);
                  }}
                >
                  <i className="bi bi-trash-fill me-2"></i>Delete
                </Button>
              </Modal.Footer>
            </Modal>
            {totalPages > 1 && instituteList.length > 0 && (
              <Paginations
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Institute;
