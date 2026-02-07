import { Fragment, useEffect, useRef, useState } from "react";
import {
  Card,
  Row,
  Col,
  Form,
  Modal,
  Button,
  Dropdown,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import Pageheader from "../../../layouts/Pageheader";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaCode,
  FaCalculator,
  FaBook,
  FaChartBar,
  FaCogs,
  FaGlobe,
  FaBolt,
  FaCamera,
  FaMusic,
  FaRocket,
  FaPlus,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { BiImageAlt } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  bulkUpload,
  countryDropDownCourse,
  courseDownloadExcel,
  createCourseFinder,
  currencyCode,
  deleteCourseFinder,
  durationDropDown,
  getAllCourseFinder,
  getDependentFilter,
  updateCourseFinder,
  getStudyArea,
} from "../../../redux/actions/CourseFinder.action";
import {
  getAllInstitute,
  instituteWiseCampusDropdown,
  stateDropdown,
  universityCountryDropdown,
} from "../../../redux/actions/Master/Institute.action";
import { getAllProgramLevel } from "../../../redux/actions/Master/ProgramLevel.action";
import { getAllRequirement } from "../../../redux/actions/Master/Requirement.action";
import Select from "react-select";
import { BASEURL, REACT_APP_API_URL } from "../../../baseUrl";
import { IconButton, Menu, MenuItem, Slider, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useLocation, useNavigate } from "react-router-dom";
import PublicIcon from "@mui/icons-material/Public";
import { FaUndo } from "react-icons/fa";
import getSymbolFromCurrency from "currency-symbol-map";
import { getAllTag } from "../../../redux/actions/Master/Tag.action";
import usePermissions from "../../commonComponents/usePermissions";
import LoadMoreButton from "../../commonComponents/LoadMoreButton";
import { decryptData } from "../../../utils/encryptionUtils";
import { getAllCurrencyRate } from "../../../redux/actions/Master/CurrencyRate.action";
import ALLImages from "../../../common/Imagedata";
import Paginations from "../../elements/Paginations";
import DeleteConfirmModal from "../../bulkMessage/commonDeleteModal/DeleteConfirmModal";

const PublicCourseFinder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { canCreate, canUpdate, canDelete, canDownload } =
    usePermissions("Course Finder");

  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedYear, setSelectedYear] = useState([]);
  const [filterRequirements, setFilterRequirements] = useState([]);
  const [selectedRequirements, setSelectedRequirements] = useState([]);
  const [textboxValues, setTextboxValues] = useState({});
  const [selectedUniversities, setSelectedUniversities] = useState([]);
  const [selectedStudyLevel, setSelectedStudyLevel] = useState([]);
  const [selectedIntake, setSelectedIntake] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagsData, setTagsData] = useState([]);
  const [selectedIntakeYear, setSelectedIntakeYear] = useState([]);
  const [selectedStudyArea, setSelectedStudyArea] = useState([]);
  const [selectedDisciplineArea, setSelectedDisciplineArea] = useState([]);
  const [instituteData, setInstituteData] = useState([]);
  const [instituteDataByCountry, setInstituteDataByCountry] = useState([]);
  const [campusDataByInstitute, setCampusDataByInstitute] = useState([]);
  const [studyLevelData, setStudyLevelData] = useState([]);
  const [selectedProgramLevel, setSelectedProgramLevel] = useState([]);
  const [requirementsData, setRequirementsData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [durationData, setDurationData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [eslElpAvailable, setEslElpAvailable] = useState([]);
  const [backlog, setBacklog] = useState("");
  const [score, setScore] = useState("");
  const [scoreOutOf, setScoreOutOf] = useState("");
  const [courseFinderData, setCourseFinderData] = useState([]);
  const [relexFilterMsg, setRelexFilterMsg] = useState("");
  // const [search, setSearch] = useState("");
  const [selectedInstitute, setSelectedInstitute] = useState([]);
  const [campus, setCampus] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const userRole = decryptData(localStorage.getItem("role"));
  const [appliedFilters, setAppliedFilters] = useState({});
  const [hasSearched, setHasSearched] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currencyCodeData, setCurrencyCodeData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [currencyRate, setCurrencyRate] = useState([]);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, text: "" });

  const [studyAreaInput, setStudyAreaInput] = useState();
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const inputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadedRecords, setLoadedRecords] = useState(12);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [showSlider, setShowSlider] = useState(false);
  const [checkboxStatus, setCheckboxStatus] = useState({});
  const [studyAreaOption, setStudyArea] = useState([]);
  const [disciplineAreasOption, setDisciplineArea] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(0);

  const storedEncryptedCurrency = decryptData(
    localStorage.getItem("crmCurrency"),
  );

  const concentrations = Array.from(
    new Set(
      courseFinderData.flatMap((item) => {
        const values = [];
        if (item.concentration && item.concentration.trim() !== "") {
          values.push(item.concentration.trim());
        }
        if (item.programName && item.programName.trim() !== "") {
          values.push(item.programName.trim());
        }
        return values;
      }),
    ),
  );

  const scoreOutOfOptions = [
    { value: "100", label: "Out of 100" },
    { value: "10", label: "Out of 10" },
    { value: "7", label: "Out of 7" },
    { value: "5", label: "Out of 5" },
    { value: "4", label: "Out of 4" },
  ];

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    if (inputLength === 0) {
      return [];
    }
    const wordSuggestions = concentrations.flatMap((item) =>
      item
        .split(/\s+/)
        .map((word) => word.trim())
        .filter((word) => word.toLowerCase().includes(inputValue)),
    );

    const phraseSuggestions = concentrations.filter((item) =>
      item.toLowerCase().includes(inputValue),
    );

    const allSuggestions = [
      ...new Set([...wordSuggestions, ...phraseSuggestions]),
    ];

    return allSuggestions;
  };

  const handleStudyAreaInputChange = (e) => {
    const value = e.target.value;
    setStudyAreaInput(value);
    setSearchText(value);
    // setLoadedRecords(12);
    setCurrentPage(1);
    const filteredSuggestions = getSuggestions(value);
    setSuggestions(filteredSuggestions);
    setIsSuggestionsVisible(filteredSuggestions.length > 0);
  };

  const handleSuggestionClick = (word) => {
    setStudyAreaInput(word);
    setSearchText(word);
    // setLoadedRecords(12);
    setCurrentPage(1);
    setSuggestions([]);
    setIsSuggestionsVisible(false);
  };

  const handleInputFocus = () => {
    const filteredSuggestions = getSuggestions(studyAreaInput);
    setSuggestions(filteredSuggestions);
    setIsSuggestionsVisible(filteredSuggestions.length > 0);
  };
  const handleInputBlur = () => {
    setTimeout(() => {
      setIsSuggestionsVisible(false);
    }, 200);
  };
  const hexToRgba = (hex, alpha = 0.2) => {
    let r = 0,
      g = 0,
      b = 0;
    hex = hex.replace("#", "");
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  const icons = [
    FaCode,
    FaCalculator,
    FaBook,
    FaChartBar,
    FaCogs,
    FaGlobe,
    FaBolt,
    FaCamera,
    FaMusic,
    FaRocket,
  ];
  const getIconForTag = (tag) => {
    const idValue = tag._id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = idValue % icons.length;
    const Icon = icons[index];
    return <Icon />;
  };

  const tagColors = [
    { bg: "#D1FAE5", text: "#047857" }, // green
    { bg: "#DBEAFE", text: "#1D4ED8" }, // blue
    { bg: "#EDE9FE", text: "#6D28D9" }, // purple
    { bg: "#FEF3C7", text: "#B45309" }, // yellow
    { bg: "#FECACA", text: "#B91C1C" }, // red
    { bg: "#F5D0FE", text: "#A21CAF" }, // pink
    { bg: "#C7D2FE", text: "#3730A3" }, // indigo
  ];

  const getColorForRequirement = (name) => {
    const index =
      [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      tagColors.length;
    return tagColors[index];
  };

  const handleView = (item) => {
    setSelectedItem(item);
    navigate(`/course-finder/view/${item._id}`, {
      state: {
        data: item,
        filters: {
          appliedFilters,
          selectedMonths,
          selectedYear,
          selectedCountry,
          selectedState,
          selectedStudyArea,
          selectedDisciplineArea,
          selectedDuration,
          eslElpAvailable,
          selectedProgramLevel,
          filterRequirements,
          campus,
          hasSearched,
          selectedInstitute,
          minPrice,
          maxPrice,
          searchText,
          backlog,
          score,
          scoreOutOf,
          showSlider,
          currentPage,
        },
      },
    });
    window.scrollTo(0, 0);
  };

  const handleClose = () => {
    setShowViewModal(false);
    setSelectedItem(null);

    document.body.style.overflow = "auto";
  };

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

  const handleEslElpChange = (e) => {
    const isChecked = e.target.checked;
    setShowInput(isChecked);
    formik.setFieldValue("eslElpAvailable", isChecked ? "Yes" : "No");
  };

  const monthList = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = monthList.map((month) => ({
    value: month,
    label: month,
  }));

  const handleCheckboxChange = (selected) => {
    setSelectedMonths(selected);
    // setLoadedRecords(12);
    setCurrentPage(1);
  };

  const yearOptions = Array.from({ length: 20 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    return { value: year, label: year.toString() };
  });

  const handleYearChange = (selectedOptions) => {
    if (selectedOptions) {
      const selectedYears = selectedOptions.map((option) => option.value);
      setSelectedYear(selectedYears);
      // setLoadedRecords(12);
      setCurrentPage(1);
    } else {
      setSelectedYear([]);
    }
  };

  const handleRequirementChange = (e) => {
    const { value, checked } = e.target;
    const selectedObj = requirementsData.find((req) => req.name === value);

    setFilterRequirements((prev) => {
      if (checked) {
        return [...prev, selectedObj._id];
      } else {
        return prev.filter((id) => id !== selectedObj._id);
      }
    });
    // setLoadedRecords(12);
    setCurrentPage(1);
  };

  const handleChange = (event, newValue) => {
    const [newMin, newMax] = newValue;
    setMinPrice(newMin);
    setMaxPrice(newMax);
    handleCourseSearch(newMin, newMax);
  };

  const handleMinChange = (event) => {
    const inputValue = event.target.value;

    if (inputValue === "") {
      setMinPrice("");
      return;
    }

    const newMin = Number(inputValue);

    if (newMin <= maxPrice) {
      setMinPrice(newMin);
      handleCourseSearch(newMin, maxPrice);
    } else {
      setMinPrice(newMin);
      handleCourseSearch(newMin, newMin);
    }
  };

  const handleMaxChange = (event) => {
    const inputValue = event.target.value;

    if (inputValue === "") {
      setMaxPrice("");
      return;
    }

    const newMax = event.target.value === "" ? 0 : Number(event.target.value);
    if (newMax >= minPrice) {
      setMaxPrice(newMax);
      handleCourseSearch(minPrice, newMax);
    } else {
      setMaxPrice(newMax);
      handleCourseSearch(newMax, newMax);
    }
  };

  const valuetext = (value) => `${value}`;

  const intakeList = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const intakeYearList = Array.from(
    { length: 20 },
    (_, index) => new Date().getFullYear() + index,
  );

  const closeModal = () => {
    setShowModal(false);
    formik.resetForm();
    setSelectedIntake([]);
    setSelectedIntakeYear([]);
    setTextboxValues({});
    setSelectedRequirements([]);
    setSelectedUniversities([]);
    setSelectedStudyLevel([]);
    setSelectedTags([]);

    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  const fetchDependentFilter = async (country, studyArea) => {
    try {
      const res = await dispatch(getDependentFilter(country, studyArea || ""));
      // setStudyArea(res?.data?.data?.studyAreas);
      setDisciplineArea(res?.data?.data?.disciplineAreas);
    } catch (error) {
      console.log("Error fetching Study area and Discipline Area");
    }
  };

  const fetchStudyArea = async (country) => {
    try {
      const res = await dispatch(getStudyArea(country));
      setStudyArea(res?.data?.data?.studyAreas);
    } catch (error) {
      console.log("Error fetching Study area and Discipline Area");
    }
  };

  useEffect(() => {
    if (selectedStudyArea) {
      fetchDependentFilter(
        selectedCountry?.map((option) => option.label) || [],
        selectedStudyArea,
      );
    }
  }, [selectedStudyArea]);
  useEffect(() => {
    if (selectedCountry) {
      fetchStudyArea(selectedCountry?.map((option) => option.label) || []);
    }
  }, [selectedCountry]);

  const fetchAllCourseFinder = async (page = 1, limit = 12, filters = {}) => {
    setIsLoading(true);
    try {
      const filterPayload = {
        ...filters,
        requirements:
          !showModal && filters.requirements ? filters.requirements : [],
      };
      const res = await dispatch(
        getAllCourseFinder(page, limit, filterPayload),
      );
      const responseData = res?.data?.data;
      setRelexFilterMsg(responseData?.message);
      if (responseData?.data?.length === 0) {
        setCourseFinderData([]);
        setTotalRecords(0);
      } else {
        setCourseFinderData(responseData?.data || []);
        setTotalRecords(responseData?.totalRecords || 0);
        setTotalPages(responseData?.totalPages || 0);
      }
    } catch (error) {
      console.error("Error fetching institute:", error);
      setCourseFinderData([]);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // if (
    //   userRole === "Super Admin" &&
    //   !hasSearched &&
    //   !location.state?.filters
    // ) {
    fetchAllCourseFinder(currentPage, itemsPerPage, appliedFilters);
    // }
  }, [currentPage, itemsPerPage, appliedFilters]);

  useEffect(() => {
    if (location.state?.filters) {
      const filters = location.state.filters;

      setAppliedFilters(filters.appliedFilters || {});
      setSelectedMonths(filters.selectedMonths || []);
      setSelectedYear(filters.selectedYear || []);
      setSelectedCountry(filters.selectedCountry || null);
      setSelectedState(filters.selectedState || []);
      setSelectedStudyArea(filters.selectedStudyArea || []);
      setSelectedDisciplineArea(filters.selectedDisciplineArea || []);
      setSelectedDuration(filters.selectedDuration || []);
      setEslElpAvailable(filters.eslElpAvailable || "");
      setSelectedInstitute(filters.selectedInstitute || []);
      setCampus(filters.campus || []);
      setBacklog(filters.backlog || "");
      setScore(filters.score || "");
      setScoreOutOf(filters.scoreOutOf || "");
      setSearchText(filters.searchText || "");
      setSelectedProgramLevel(filters.selectedProgramLevel || []);
      setFilterRequirements(filters.filterRequirements || []);
      setMinPrice(filters.minPrice || 0);
      setMaxPrice(filters.maxPrice || 100000);
      setHasSearched(true);
      setStudyAreaInput(filters.studyAreaInput || "");
      setShowSlider(filters.showSlider || false);
      setCurrentPage(filters.currentPage || 1);

      if (filters.selectedInstitute?.length > 0) {
        const instituteNames = filters.selectedInstitute.map(
          (inst) => inst.label,
        );
        fetchAllCampusByInstitute(instituteNames, "");
      }

      fetchAllCourseFinder(
        filters.currentPage,
        itemsPerPage,
        filters.appliedFilters || {},
      );

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.filters, loadedRecords, navigate]);

  useEffect(() => {
    if (hasSearched && Object.keys(appliedFilters).length > 0) {
      fetchAllCourseFinder(currentPage, itemsPerPage, appliedFilters);
    }
  }, [currentPage, itemsPerPage, appliedFilters, hasSearched]);

  useEffect(() => {}, [courseFinderData]);

  useEffect(() => {
    fetchAllInstitute();
    // fetchAllInstituteByCountry(
    //   selectedCountry?.map((option) => option.label),
    //   selectedState?.label
    // );
    // fetchAllStates(selectedCountry?.map((option) => option.value));
    fetchAllProgramLevel();
    fetchAllRequirements();
    fetchAllTags();
    fetchAllCurrencyCode();
    fetchAllDuration();
    fetchCurrencyRate();
    fetchCountries();
  }, []);

  useEffect(() => {
    const countryLabels = selectedCountry?.map((option) => option.label) || [];
    const stateLabels = selectedState?.map((option) => option.label) || [];

    if (countryLabels.length > 0 || stateLabels.length > 0) {
      fetchAllInstituteByCountry(countryLabels, stateLabels);
    }
    if (countryLabels.length > 0) {
      fetchAllStates(selectedCountry?.map((option) => option.value) || []);
    }
  }, [selectedCountry, selectedState]);

  const handleProgramLevelChange = (event) => {
    const { value, checked } = event.target;
    const selectedObj = studyLevelData.find((level) => level.name === value);
    setSelectedProgramLevel((prevSelected) => {
      if (checked) {
        return [...prevSelected, selectedObj._id];
      } else {
        return prevSelected.filter((id) => id !== selectedObj._id);
      }
    });
    // setLoadedRecords(12);
    setCurrentPage(1);
  };

  const fetchCountries = async () => {
    const res = await dispatch(countryDropDownCourse());
    setCountries(res?.data?.data || []);
  };

  const fetchAllDuration = async () => {
    const res = await dispatch(durationDropDown());
    const responseData = res?.data?.data;
    const formattedOptions = (responseData || []).map((item) => ({
      value: item,
      label: item.charAt(0).toUpperCase() + item.slice(1),
    }));
    setDurationData(formattedOptions);
  };

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    const countryCodes = selectedOption?.map((option) => option.value);
    const countryNames = selectedOption?.map((option) => option.label);
    fetchAllStates(countryCodes);
    fetchAllInstituteByCountry(
      countryNames || selectedCountry?.map((option) => option.label),
      selectedState?.label,
    );
    fetchDependentFilter(countryNames);
    // setLoadedRecords(12);
    setCurrentPage(1);
  };

  const handleInstituteChange = (selectedOption) => {
    setSelectedInstitute(selectedOption);
    setCampus("");
    // setLoadedRecords(12);
    setCurrentPage(1);
    if (selectedOption) {
      fetchAllCampusByInstitute(selectedOption.value.instituteName, "");
    } else {
      setCampusDataByInstitute([]);
    }
  };

  const handleCampusChange = (selectedOption) => {
    const campusId = selectedOption ? selectedOption.value : "";
    setCampus(campusId);
    // setLoadedRecords(12);
    setCurrentPage(1);
  };

  const fetchAllStates = async (countryIsoCodes) => {
    try {
      let allStates = [];
      for (const countryIsoCode of countryIsoCodes || []) {
        const res = await dispatch(stateDropdown([countryIsoCode]));
        const data = res?.data?.data || [];
        allStates = [...allStates, ...data];
      }
      // Remove duplicates based on state isoCode
      const uniqueStates = Array.from(
        new Map(allStates.map((state) => [state.isoCode, state])).values(),
      );
      setStates(uniqueStates);
    } catch (err) {
      console.error("Error fetching states:", err);
      setStates([]);
    }
  };

  const handleStateChange = (selectedOptions) => {
    setSelectedState(selectedOptions || []);
    const stateLabels = selectedOptions
      ? selectedOptions.map((s) => s.label)
      : [];

    fetchAllInstituteByCountry(
      selectedCountry?.map((c) => c.label) || [],
      stateLabels,
    );
    // setLoadedRecords(12);
    setCurrentPage(1);
  };
  const fetchAllInstitute = async () => {
    const response = await dispatch(universityCountryDropdown());
    const responseData = response?.data?.data;
    setInstituteData(responseData || []);
  };

  const fetchAllInstituteByCountry = async (country, state) => {
    const response = await dispatch(
      getAllInstitute(1, 5000, "", country, state),
    );
    const responseData = response?.data?.data?.data;
    setInstituteDataByCountry(responseData);
  };

  const fetchAllCampusByInstitute = async (instituteNames) => {
    try {
      let allCampuses = [];
      for (const instituteName of instituteNames) {
        const response = await dispatch(
          instituteWiseCampusDropdown(instituteName, ""),
        );
        const responseData = response?.data?.data || [];
        allCampuses = [...allCampuses, ...responseData];
      }
      // Remove duplicates based on campus ID
      const uniqueCampuses = Array.from(
        new Map(allCampuses.map((campus) => [campus._id, campus])).values(),
      );
      setCampusDataByInstitute(uniqueCampuses);
    } catch (error) {
      console.error("Error fetching campuses:", error);
      setCampusDataByInstitute([]);
    }
  };

  const fetchAllProgramLevel = async () => {
    const response = await dispatch(getAllProgramLevel(1, 1000));
    const responseData = response?.data?.data;
    setStudyLevelData(responseData?.data || []);
  };

  const fetchAllRequirements = async () => {
    const response = await dispatch(getAllRequirement(1, 1000));
    const responseData = response?.data?.data;
    setRequirementsData(responseData?.data || []);
  };

  const fetchAllTags = async () => {
    const response = await dispatch(getAllTag(""));
    const responseData = response?.data?.data;
    setTagsData(responseData || []);
  };

  const fetchAllCurrencyCode = async () => {
    const response = await dispatch(currencyCode(1, 1000));
    const responseData = response?.data?.data;
    setCurrencyCodeData(responseData || []);
  };

  const fetchCurrencyRate = async () => {
    try {
      const res = await dispatch(getAllCurrencyRate());
      if (res?.status === 200) {
        setCurrencyRate(res?.data?.message || []);
      }
    } catch (error) {
      console.error("Error fetching student statuses:", error);
    }
  };

  const handleLoadMore = () => {
    const newLoadedRecords = loadedRecords + 12;
    setLoadedRecords(newLoadedRecords);
    setItemsPerPage(newLoadedRecords);
    fetchAllCourseFinder(1, newLoadedRecords, appliedFilters);
  };

  const handleCourseSearch = (minTuitionFee, maxTuitionFee) => {
    const filters = {
      months: selectedMonths?.map((m) => m.value) || [],
      year: selectedYear.length > 0 ? selectedYear : [],
      country: selectedCountry?.map((country) => country.label) || [],
      state: selectedState?.map((state) => state.label) || [],
      programLevel: selectedProgramLevel,
      studyArea: selectedStudyArea.length > 0 ? selectedStudyArea : [],
      disciplineArea: selectedDisciplineArea,
      duration: selectedDuration?.map((option) => option.value) || [],
      eslElpAvailable: eslElpAvailable,
      requirements: !showModal ? filterRequirements : [],
      searchText: searchText,
      institute: selectedInstitute?.map((institute) => institute.value) || [],
      campus: campus || "",
      backlog: backlog || "",
      score: score || "",
      scoreOutOf: scoreOutOf || "",
      minTuitionFee: minTuitionFee !== undefined ? minTuitionFee : "",
      maxTuitionFee: maxTuitionFee !== undefined ? maxTuitionFee : "",
    };

    const hasValidFilters = Object.values(filters).some((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === "string") {
        return value.trim() !== "";
      }
      if (typeof value === "number") {
        return true;
      }
      return value;
    });

    if (!hasValidFilters) {
      toast.error("Please apply at least one filter");
      return;
    }

    setAppliedFilters(filters);
    setHasSearched(true);
    // setLoadedRecords(12);
    setCurrentPage(1);
    if (filters) {
      fetchAllCourseFinder(1, itemsPerPage, filters);
    }
    return true;
  };

  const formik = useFormik({
    initialValues: {
      university: [],
      programName: "",
      concentration: "",
      studyArea: "",
      career: "",
      disciplineArea: "",
      score: "",
      scoreOutOf: "",
      websiteUrl: "",
      country: "",
      studyLevel: [],
      duration: "",
      intakes: [],
      intakeYear: [],
      tags: [],
      applicationStartDate: [],
      applicationEndDate: [],
      entryRequirements: "",
      applicationFee: "",
      currencyCode: "",
      yearlyTuitionFee: "",
      scholarshipAvailable: "",
      scholarshipDetails: "",
      remarks: "",
      eslElpAvailable: "No",
      eslElpDetails: "",
      applicationMode: "",
      englishProficiencyExamWaiver: "",
      status: "",
      requirements: [],
      criteria: "",
    },
    validationSchema: Yup.object({
      university: Yup.array().min(1, "University is required"),
      programName: Yup.string().required("Program Name is required"),
      concentration: Yup.string(),
      studyArea: Yup.string(),
      career: Yup.string(),
      disciplineArea: Yup.string(),
      score: Yup.string(),
      scoreOutOf: Yup.string(),
      websiteUrl: Yup.string(),
      studyLevel: Yup.array(),
      duration: Yup.string(),
      intakes: Yup.array().min(1, "At least one intake is required"),
      intakeYear: Yup.array(),
      tags: Yup.array(),
      applicationStartDate: Yup.array().of(Yup.string()),
      applicationEndDate: Yup.array().of(Yup.string()),
      entryRequirements: Yup.string(),
      applicationFee: Yup.string(),
      currencyCode: Yup.string().required("Currency Code is required"),
      yearlyTuitionFee: Yup.string(),
      scholarshipAvailable: Yup.string(),
      scholarshipDetails: Yup.string(),
      remarks: Yup.string(),
      applicationMode: Yup.string(),
      englishProficiencyExamWaiver: Yup.string(),
      status: Yup.string(),
      criteria: Yup.string(),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        toast.dismiss();
        const formattedRequirements = selectedRequirements.map(
          (req) => req._id,
        );

        const formattedIntakes = intakeList.map((intake) => ({
          month: intake,
          status: checkboxStatus[intake] ? "Active" : "Inactive",
        }));

        // Convert comma-separated disciplineArea to array
        const formattedDisciplineArea = values.disciplineArea
          ? values.disciplineArea
              .split(",")
              .map((item) => item.trim())
              .filter((item) => item.length > 0)
          : [];

        const submitData = {
          ...values,
          status: values.status || "Active",
          requirements: formattedRequirements,
          intakes: formattedIntakes.filter((item) =>
            selectedIntake.includes(item.month),
          ),
          tags: selectedTags.map((tag) => tag._id),
          disciplineArea: formattedDisciplineArea,
          career: values.career,
        };

        if (values.id) {
          const res = await dispatch(updateCourseFinder(submitData, values.id));
          if (res?.data?.code === 200) {
            toast.success("Course updated successfully");
            closeModal();
            resetForm();
            setSelectedRequirements([]);
            setTextboxValues({});
            setSelectedTags([]);
            // setLoadedRecords(12);
            setCurrentPage(1);
          }
        } else {
          values.requirements = selectedRequirements
            .filter((r) => r._id)
            .map((r) => ({
              name: r._id,
              value: textboxValues[r._id] || "",
            }));

          values.intakes = selectedIntake;
          values.intakeYear = selectedIntakeYear;
          values.tags = selectedTags.map((tag) => tag._id);

          const res = await dispatch(createCourseFinder(submitData));
          if (res?.data?.code === 201) {
            toast.success("Course added successfully");
            closeModal();
            resetForm();
            setSelectedIntake([]);
            setSelectedIntakeYear([]);
            setTextboxValues({});
            setSelectedRequirements([]);
            setSelectedTags([]);
            // setLoadedRecords(12);
            setCurrentPage(1);
          }
        }
        fetchAllCourseFinder(1, itemsPerPage, appliedFilters);
      } catch (error) {
        toast.error(error?.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    },
  });
  const handleDurationChange = (selectedOptions) => {
    setSelectedDuration(selectedOptions);
    // setLoadedRecords(12);
    setCurrentPage(1);
  };
  useEffect(() => {
    if (durationData.length > 0 && formik.values.duration?.length > 0) {
      const preSelected = durationData.filter((option) =>
        formik.values.duration.includes(option.value),
      );
      setSelectedDuration(preSelected);
    }
  }, [durationData, formik.values.duration]);

  const handleEdit = (item) => {
    const universities = item.university ? [item.university._id] : [];

    setSelectedUniversities(
      item.university
        ? [{ _id: item.university._id, name: item.university.instituteName }]
        : [],
    );

    const intakes = item.intakes || [];
    const selected = intakes.map((i) => i.month);
    const checkboxStates = {};
    intakes.forEach((i) => {
      checkboxStates[i.month] = i.status === "Active";
    });

    setSelectedIntake(selected);
    setCheckboxStatus(checkboxStates);
    setSelectedIntakeYear(item.intakeYear || []);
    setShowInput(item.eslElpAvailable === "Yes");

    const reqList = item.requirements || [];
    const textBoxObj = {};
    reqList.forEach((req) => {
      if (req?.name?._id) {
        textBoxObj[req.name._id] = req.value || "";
      } else if (req?.name) {
        textBoxObj[req.name] = req.value || "";
      }
    });
    setTextboxValues(textBoxObj);

    const formattedRequirements =
      reqList?.map((req) => ({
        _id: req?._id,
        name: req.name?.name || req.name,
      })) || [];
    setSelectedRequirements(formattedRequirements);
    setSelectedStudyLevel(item.studyLevel || []);

    const formattedTags =
      item.tags?.map((tag) => ({
        _id: tag._id,
        name: tag.name,
      })) || [];
    setSelectedTags(formattedTags);

    formik.setValues({
      ...formik.initialValues,
      id: item._id,
      university: universities,
      programName: item.programName || "",
      concentration: item.concentration || "",
      studyArea: item.studyArea || "",
      career: item.career || "",
      disciplineArea: Array.isArray(item.disciplineArea)
        ? item.disciplineArea.join(", ")
        : item.disciplineArea || "",
      score: item.score || "",
      scoreOutOf: item.scoreOutOf || "",
      websiteUrl: item.websiteUrl || "",
      country: item.university?.country || "",
      studyLevel: item.studyLevel || [],
      duration: item.duration || "",
      intakes: intakes || [],
      intakeYear: item.intakeYear || [],
      tags: formattedTags.map((t) => t._id) || [],
      applicationStartDate: item.applicationStartDate || "",
      applicationEndDate: item.applicationEndDate || "",
      entryRequirements: item.entryRequirements || "",
      applicationFee: item.applicationFee || "",
      currencyCode: item.currencyCode || "",
      yearlyTuitionFee: item.yearlyTuitionFee || "",
      scholarshipAvailable: item.scholarshipAvailable || "",
      scholarshipDetails: item.scholarshipDetails || "",
      remarks: item.remarks || "",
      eslElpAvailable: item.eslElpAvailable || "No",
      eslElpDetails: item.eslElpDetails || "",
      applicationMode: item.applicationMode || "",
      englishProficiencyExamWaiver: item.englishProficiencyExamWaiver || "",
      status: item.status || "",
      requirements: formattedRequirements || [],
      criteria: item.criteria || "",
    });

    openModal();
  };
  const resetFilters = () => {
    setStudyAreaInput("");
    setSelectedMonths([]);
    setSelectedYear([]);
    setSelectedCountry(null);
    setSelectedState([]);
    setSelectedStudyArea([]);
    setSelectedDisciplineArea([]);
    setSelectedDuration([]);
    setEslElpAvailable("");
    setSelectedInstitute([]);
    setCampus([]);
    setBacklog("");
    setScore("");
    setScoreOutOf("");
    setSearchText("");
    setSelectedProgramLevel([]);
    setFilterRequirements([]);
    setAppliedFilters({});
    setMinPrice(0);
    setMaxPrice(100000);

    // if (userRole === "Super Admin") {
    fetchAllCourseFinder(1, itemsPerPage, {});
    // } else {
    //   setHasSearched(false);
    //   setCourseFinderData([]);
    //   setTotalRecords(0);
    //   setShowFilterModal(false);
    // }
  };

  const handleDelete = async (item) => {
    try {
      toast.dismiss();
      const res = await dispatch(deleteCourseFinder(item._id));
      if (res?.data?.code === 200) {
        toast.success("Course deleted successfully");
        // setLoadedRecords(12);
        setCurrentPage(1);
        fetchAllCourseFinder(1, itemsPerPage, appliedFilters);
        setFilterRequirements([]);
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleCheckboxChangeId = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length < 20) {
        setSelectedIds([...selectedIds, id]);
      } else {
        toast.error("You can only select up to 20 items.");
      }
    }
  };

  const courseDownload = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one course to download");
      return;
    }
    try {
      const ids = selectedIds.join(",");
      const res = await dispatch(courseDownloadExcel(ids));
      if (res?.data?.code === 200) {
        const filePath = res.data.data.replace("/api", "");
        const downloadUrl = `${REACT_APP_API_URL}${filePath}`;

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", "course_list.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Course download successfully");
        setSelectedIds([]);
      }
    } catch (error) {
      console.error("Error downloading course:", error);
    }
  };
  const handleAllDownload = async () => {
    if (courseFinderData.length === 0) {
      toast.error("No courses available to download");
      return;
    }

    try {
      const ids = courseFinderData.map((item) => item._id).join(",");
      const res = await dispatch(courseDownloadExcel(ids));
      if (res?.data?.code === 200) {
        const filePath = res.data.data.replace("/api", "");
        const downloadUrl = `${REACT_APP_API_URL}${filePath}`;

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", "course_list.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Course download successfully");
      }
    } catch (error) {
      console.error("Error downloading all courses:", error);
    }
  };

  const [fileKey, setFileKey] = useState(Date.now());

  const options = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  // Flatten and split all discipline areas into individual, unique options
  const disciplineAreaOptions = Array.from(
    new Set(
      (disciplineAreasOption || [])
        .flatMap((option) =>
          Array.isArray(option)
            ? option
            : typeof option === "string"
              ? option.split(",")
              : [],
        )
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ).map((option) => ({
    value: option,
    label: option,
  }));

  const studyAreaOptions = Array.from(
    new Set(
      (studyAreaOption || []).map((option) => option.trim()).filter(Boolean),
    ),
  ).map((option) => ({
    value: option,
    label: option,
  }));

  // const getINRValue = (amount, currencyCode) => {
  //   if (!currencyRate || !currencyRate.length) return null;
  //   const rateObj = currencyRate.find(
  //     (rate) => rate.currencyCode === currencyCode
  //   );
  //   if (rateObj && rateObj.INRvalue) {
  //     const inrValue =
  //       parseFloat(amount?.replace(/,/g, "")) * parseFloat(rateObj.INRvalue);
  //     return `INR Value: ₹${inrValue.toLocaleString("en-IN")}`;
  //   }
  //   return "Conversion rate not found!";
  // };

  const getINRValue = (amount, currencyCode) => {
    if (!currencyRate || !currencyRate.length)
      return "Conversion rate not found!";
    const rateObj = currencyRate.find(
      (rate) => rate.currencyCode === currencyCode,
    );
    if (!rateObj || !rateObj.INRvalue) return "Conversion rate not found!";

    // Handle null, undefined, or invalid amount
    if (amount == null || amount === "") return "Invalid amount";

    // Convert amount to string and remove commas
    const amountStr = String(amount).replace(/,/g, "");

    // Convert to number and validate
    const amountNum = parseFloat(amountStr);
    if (isNaN(amountNum)) return "Invalid amount";

    // Calculate INR value
    const inrValue = amountNum * parseFloat(rateObj.INRvalue);

    // Check if inrValue is valid
    if (isNaN(inrValue)) return "Invalid conversion";

    return `${
      storedEncryptedCurrency ? storedEncryptedCurrency : "INR"
    } Value: ${
      storedEncryptedCurrency
        ? getSymbolFromCurrency(storedEncryptedCurrency)
        : "₹"
    }${inrValue.toLocaleString("en-IN")}`;
  };

  const customStyle = {
    control: (base) => ({
      ...base,
      height: "45px",
      minHeight: "45px",
      padding: "0 0 0 5px",
      // borderColor: '#b5bcc4',
      fontSize: "15px",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#000000",
    }),
  };

  const customStyle2 = {
    height: 45,
    minHeight: 45,
    padding: "0 10px",
    borderRadius: "12px",
  };

  return (
    <Fragment>
      <div className="mx-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Pageheader
              mainheading="Course Finder"
              parentfolder="Home"
              activepage="Course Finder"
            />
          </div>
        </div>

        {/* {canRead && ( */}
        <div
          className="mb-4"
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.05)",
            border: "1px solid #f1f5f9",
          }}
        >
          {/* Header Section */}
          <div className="mb-6">
            <h2
              className="mb-2"
              style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b" }}
            >
              Find Your Perfect Course
            </h2>
          </div>

          {/* Search Bar with Gradient Background */}
          <div className="mb-6" style={{ position: "relative" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                borderRadius: "16px",
                padding: "16px",
                border: "2px solid #dbeafe",
              }}
            >
              <Row className="align-items-center g-2">
                <Col xs={12} lg={9} className="mb-2 mb-lg-0">
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      placeholder="What course are you interested in?"
                      name="studyArea"
                      className="custom-select-height2 w-100 search-input-light text-capitalize"
                      autoComplete="off"
                      style={{
                        height: "45px",
                        border: "2px solid #dbeafe",
                        padding: "0 24px",
                        fontSize: "16px",
                        borderRadius: "12px",
                        backgroundColor: "#ffffff",
                        fontWeight: 500,
                        boxShadow: "0 2px 8px rgba(219, 234, 254, 0.2)",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#3b82f6";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(59, 130, 246, 0.1)";
                        handleInputFocus();
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#dbeafe";
                        e.target.style.boxShadow =
                          "0 2px 8px rgba(219, 234, 254, 0.2)";
                        handleInputBlur();
                      }}
                      value={searchText}
                      onChange={handleStudyAreaInputChange}
                      ref={inputRef}
                    />
                    {isSuggestionsVisible && suggestions.length > 0 && (
                      <div
                        className="suggestions-container"
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          background: "#ffffff",
                          border: "1px solid #dbeafe",
                          borderRadius: "12px",
                          maxHeight: "280px",
                          overflowY: "auto",
                          zIndex: 1000,
                          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                          marginTop: "8px",
                        }}
                      >
                        {suggestions.map((word, index) => (
                          <div
                            key={`${word}-${index}`}
                            className="suggestion-item"
                            style={{
                              padding: "14px 20px",
                              cursor: "pointer",
                              backgroundColor: "#ffffff",
                              borderBottom:
                                index < suggestions.length - 1
                                  ? "1px solid #f1f5f9"
                                  : "none",
                              fontSize: "15px",
                              color: "#1e293b",
                              fontWeight: 500,
                            }}
                            onMouseDown={() => handleSuggestionClick(word)}
                            onMouseEnter={(e) =>
                              (e.target.style.backgroundColor = "#eff6ff")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.backgroundColor = "#ffffff")
                            }
                          >
                            {word}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Col>
                <Col xs={12} lg={3}>
                  <div className="d-flex flex-column flex-lg-row gap-2 w-100">
                    <Button
                      variant="primary"
                      className="custom-select-height2 d-flex justify-content-center align-items-center gap-2 w-100"
                      style={{
                        height: "45px",
                        borderRadius: "12px",
                        border: "none",
                        fontWeight: 600,
                        fontSize: "16px",
                        boxShadow: "0 4px 16px rgba(59, 130, 246, 0.3)",
                        transition: "all 0.2s ease-in-out",
                      }}
                      onClick={() => {
                        setShowFilterModal(false);
                        const hasValidFilters = handleCourseSearch();
                        if (hasValidFilters) {
                          setShowSlider(true);
                        }
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow =
                          "0 6px 20px rgba(59, 130, 246, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow =
                          "0 4px 16px rgba(59, 130, 246, 0.3)";
                      }}
                    >
                      <FaSearch fontSize={16} style={{ color: "#ffffff" }} />
                      <span style={{ color: "#ffffff" }}>Search</span>
                    </Button>
                    <Button
                      variant="light"
                      className="custom-select-height2 d-flex justify-content-center align-items-center gap-2 w-100"
                      style={{
                        height: "60px",
                        borderRadius: "12px",
                        border: "2px solid #030303d3",
                        color: "#64748b",
                        fontWeight: 600,
                        fontSize: "16px",
                        backgroundColor: "#ffffff",
                        transition: "all 0.2s ease-in-out",
                      }}
                      onClick={() => {
                        resetFilters();
                        setShowSlider(false);
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = "#cbd5e1";
                        e.target.style.color = "#475569";
                        e.target.style.boxShadow =
                          "0 4px 12px rgba(0, 0, 0, 0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = "#e2e8f0";
                        e.target.style.color = "#64748b";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      <FaUndo fontSize={16} />
                      <span>Reset</span>
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          </div>

          {/* Basic filters - Country, State, Institute, Campus */}
          {showFilterModal && (
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "12px",
                padding: "1.5rem",
                border: "1px solid #e2e8f0",
                marginBottom: "1.5rem",
                marginTop: "1.5rem",
              }}
            >
              <div className="mb-3">
                <h5
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#1e293b",
                    marginBottom: "1rem",
                  }}
                >
                  Location & Institution Filters
                </h5>
              </div>
              <Row className="g-3 g-lg-4">
                <Col xs={12} sm={6} md={6} lg={3}>
                  <Form.Label
                    className="course_finder_filter mb-1"
                    style={{ fontWeight: 500 }}
                  >
                    Country
                  </Form.Label>
                  <Select
                    id="country-select"
                    options={countries
                      ?.sort((a, b) => a.name.localeCompare(b.name))
                      ?.map((country) => ({
                        value: country.isoCode,
                        label: country.name,
                      }))}
                    onChange={handleCountryChange}
                    isMulti
                    value={selectedCountry}
                    placeholder="Select Country"
                    isClearable
                    classNamePrefix="custom-select"
                    styles={customStyle}
                  />
                </Col>
                <Col xs={12} sm={6} md={6} lg={3}>
                  <Form.Label className="course_finder_filter">
                    State
                  </Form.Label>
                  <Select
                    id="state-select"
                    options={states
                      ?.sort((a, b) => a.name.localeCompare(b.name))
                      ?.map((state) => ({
                        value: state.isoCode,
                        label: state.name,
                      }))}
                    onChange={handleStateChange}
                    isMulti
                    value={selectedState}
                    classNamePrefix="custom-select"
                    placeholder="Select State"
                    isClearable
                    menuPortalTarget={
                      typeof window !== "undefined" ? document.body : null
                    }
                    menuPosition="fixed"
                    styles={customStyle}
                  />
                </Col>
                <Col xs={12} sm={6} md={6} lg={3}>
                  <Form.Label
                    className="course_finder_filter mb-1"
                    style={{ fontWeight: 500 }}
                  >
                    Institute
                  </Form.Label>
                  <Select
                    id="institute-select"
                    options={Array.from(
                      new Map(
                        instituteDataByCountry
                          ?.sort((a, b) =>
                            a.instituteName.localeCompare(b.instituteName),
                          )
                          ?.map((institute) => [
                            institute.instituteName,
                            institute,
                          ]),
                      ).values(),
                    ).map((institute) => ({
                      value: institute._id,
                      label: institute.instituteName,
                    }))}
                    onChange={(selectedOptions) => {
                      setSelectedInstitute(selectedOptions || []);
                      setCampus([]);
                      if (selectedOptions && selectedOptions.length > 0) {
                        const instituteNames = selectedOptions.map(
                          (option) => option.label,
                        );
                        fetchAllCampusByInstitute(instituteNames, "");
                      } else {
                        setCampusDataByInstitute([]);
                      }
                      setCurrentPage(1);
                    }}
                    isMulti
                    value={selectedInstitute}
                    isClearable
                    classNamePrefix="custom-select"
                    placeholder="Select Institute"
                    styles={customStyle}
                  />
                </Col>
                <Col xs={12} sm={6} md={6} lg={3}>
                  <Form.Label
                    className="course_finder_filter mb-1"
                    style={{ fontWeight: 500 }}
                  >
                    Campus
                  </Form.Label>
                  <Select
                    id="campus-select"
                    options={campusDataByInstitute
                      ?.sort((a, b) => a.campus.localeCompare(b.campus))
                      ?.map((campus) => ({
                        value: campus._id,
                        label: campus.campus,
                      }))}
                    onChange={(selectedOptions) => {
                      const campusIds = selectedOptions
                        ? selectedOptions.map((option) => option.value)
                        : [];
                      setCampus(campusIds);
                      setCurrentPage(1);
                    }}
                    isMulti
                    value={campusDataByInstitute
                      ?.map((c) => ({
                        value: c._id,
                        label: c.campus,
                      }))
                      .filter((c) => campus.includes(c.value))}
                    placeholder="Select Campus"
                    isClearable
                    classNamePrefix="custom-select"
                    styles={customStyle}
                  />
                </Col>
              </Row>
            </div>
          )}

          {/* Advanced filters section - Same UI as Location & Institution Filters */}
          {showFilterModal && (
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "12px",
                padding: "1.5rem",
                border: "1px solid #cbd5e1",
                marginTop: "1.5rem",
              }}
            >
              <div className="mb-3">
                <h5
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#1e293b",
                    marginBottom: "1rem",
                  }}
                >
                  Advanced Course Filters
                </h5>
              </div>
              <Row className="g-3 g-lg-4">
                <Col xs={12} sm={6} md={6} lg={3}>
                  <Form.Label className="course_finder_filter">
                    Program Level
                  </Form.Label>
                  <Select
                    isMulti
                    options={studyLevelData
                      ?.sort((a, b) => a.name.localeCompare(b.name))
                      ?.map((level) => ({
                        value: level._id,
                        label: level.name,
                      }))}
                    value={studyLevelData
                      ?.sort((a, b) => a.name.localeCompare(b.name))
                      ?.map((level) => ({
                        value: level._id,
                        label: level.name,
                      }))
                      .filter((opt) =>
                        selectedProgramLevel.includes(opt.value),
                      )}
                    onChange={(selectedOptions) => {
                      setSelectedProgramLevel(
                        selectedOptions
                          ? selectedOptions.map((opt) => opt.value)
                          : [],
                      );
                    }}
                    classNamePrefix="custom-select"
                    placeholder="Select Program Level"
                    menuPortalTarget={
                      typeof window !== "undefined" ? document.body : null
                    }
                    menuPosition="fixed"
                    styles={customStyle}
                  />
                </Col>
                <Col xs={12} sm={6} md={6} lg={3}>
                  <Form.Label className="course_finder_filter">
                    Study Area
                  </Form.Label>
                  <Select
                    id="study-area-select"
                    options={studyAreaOption?.map((option) => ({
                      value: option,
                      label: option,
                    }))}
                    isMulti
                    onChange={(selectedOptions) => {
                      const values = selectedOptions
                        ? selectedOptions.map((opt) => opt.value)
                        : [];
                      setSelectedStudyArea(values);
                      setCurrentPage(1);
                    }}
                    value={selectedStudyArea.map((area) => ({
                      value: area,
                      label: area,
                    }))}
                    classNamePrefix="custom-select"
                    placeholder="Select Study Area"
                    isClearable
                    menuPortalTarget={
                      typeof window !== "undefined" ? document.body : null
                    }
                    menuPosition="fixed"
                    styles={customStyle}
                  />
                </Col>
                <Col xs={12} sm={6} md={6} lg={3}>
                  <Form.Label className="course_finder_filter">
                    Discipline Area
                  </Form.Label>
                  <Select
                    id="descilline-area-select"
                    options={disciplineAreaOptions}
                    isMulti
                    onChange={(selectedOptions) => {
                      setSelectedDisciplineArea(
                        selectedOptions
                          ? selectedOptions.map((opt) => opt.value)
                          : [],
                      );
                      setCurrentPage(1);
                    }}
                    value={disciplineAreaOptions.filter((opt) =>
                      selectedDisciplineArea.includes(opt.value),
                    )}
                    classNamePrefix="custom-select"
                    placeholder="Select Discipline Area"
                    isClearable
                    menuPortalTarget={
                      typeof window !== "undefined" ? document.body : null
                    }
                    menuPosition="fixed"
                    styles={customStyle}
                  />
                </Col>
                <Col xs={12} sm={6} md={6} lg={3}>
                  <Form.Label className="course_finder_filter">
                    Requirements
                  </Form.Label>
                  <Select
                    isMulti
                    options={requirementsData?.map((req) => ({
                      value: req._id,
                      label: req.name,
                    }))}
                    value={requirementsData
                      ?.map((req) => ({ value: req._id, label: req.name }))
                      .filter((opt) => filterRequirements.includes(opt.value))}
                    onChange={(selectedOptions) => {
                      setFilterRequirements(
                        selectedOptions
                          ? selectedOptions.map((opt) => opt.value)
                          : [],
                      );
                      setCurrentPage(1);
                    }}
                    classNamePrefix="custom-select"
                    placeholder="Select Requirements"
                    menuPortalTarget={
                      typeof window !== "undefined" ? document.body : null
                    }
                    menuPosition="fixed"
                    styles={customStyle}
                  />
                </Col>
                <Col xs={12} sm={6} md={6} lg={3}>
                  <Form.Label className="course_finder_filter">Year</Form.Label>
                  <Select
                    id="year-select"
                    options={yearOptions}
                    onChange={handleYearChange}
                    isMulti
                    value={
                      selectedYear && selectedYear.length > 0
                        ? selectedYear.map((year) => ({
                            value: year,
                            label: year.toString(),
                          }))
                        : []
                    }
                    classNamePrefix="custom-select"
                    placeholder="Select Year"
                    menuPortalTarget={
                      typeof window !== "undefined" ? document.body : null
                    }
                    menuPosition="fixed"
                    styles={customStyle}
                  />
                </Col>
                <Col xs={12} sm={6} md={6} lg={3}>
                  <Form.Label className="course_finder_filter">
                    Months
                  </Form.Label>
                  <Select
                    id="months-select"
                    options={month}
                    isMulti
                    onChange={handleCheckboxChange}
                    value={selectedMonths}
                    classNamePrefix="custom-select"
                    placeholder="Select Months"
                    menuPortalTarget={
                      typeof window !== "undefined" ? document.body : null
                    }
                    menuPosition="fixed"
                    styles={customStyle}
                  />
                </Col>
                <Col xs={12} sm={6} md={6} lg={3}>
                  <Form.Label className="course_finder_filter">
                    Duration
                  </Form.Label>
                  <Select
                    id="duration-select"
                    options={durationData}
                    isMulti
                    onChange={handleDurationChange}
                    value={selectedDuration}
                    classNamePrefix="custom-select"
                    placeholder="Select Duration"
                    menuPortalTarget={
                      typeof window !== "undefined" ? document.body : null
                    }
                    menuPosition="fixed"
                    styles={customStyle}
                  />
                </Col>
                <Col xs={12} sm={6} md={6} lg={3}>
                  <Form.Label
                    className="course_finder_filter"
                    style={{ fontWeight: 500 }}
                  >
                    Backlog
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={backlog}
                    onChange={(e) => {
                      setBacklog(e.target.value);
                      setCurrentPage(1);
                    }}
                    name="backlog"
                    placeholder="Search Backlog"
                    className="w-100"
                    style={customStyle2}
                  />
                </Col>
                <Col xs={12} sm={6} md={6} lg={6}>
                  <Form.Label className="course_finder_filter">
                    Score Out Of
                  </Form.Label>
                  <Select
                    id="score-out-of-select"
                    options={scoreOutOfOptions}
                    onChange={(selected) => {
                      setScoreOutOf(selected?.value);
                    }}
                    value={scoreOutOfOptions.filter(
                      (score) => score.value === scoreOutOf,
                    )}
                    classNamePrefix="custom-select"
                    placeholder="Select Duration"
                    menuPortalTarget={
                      typeof window !== "undefined" ? document.body : null
                    }
                    menuPosition="fixed"
                    styles={customStyle}
                  />
                </Col>
                <Col xs={12} sm={6} md={6} lg={6}>
                  <Form.Label className="course_finder_filter">
                    Score
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={score}
                    onChange={(e) => {
                      setScore(e.target.value);
                      setCurrentPage(1);
                    }}
                    name="score"
                    placeholder="Search Score"
                    className="w-100"
                    style={customStyle2}
                  />
                </Col>
              </Row>
            </div>
          )}

          {/* Filter Toggle at bottom */}
          <div className="mt-4 align-items-center">
            <div className="d-flex justify-content-center">
              <Button
                variant={showFilterModal ? "danger" : "primary"}
                className="px-3 py-2"
                style={{
                  borderRadius: "12px",
                  fontWeight: 600,
                  fontSize: "16px",
                  border: "none",
                  boxShadow: "0 4px 16px rgba(59, 130, 246, 0.3)",
                  transition: "all 0.2s ease-in-out",
                }}
                onClick={() => {
                  setShowFilterModal(!showFilterModal);
                }}
              >
                {showFilterModal ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
          </div>
        </div>
        {/* )} */}

        <Modal show={showModal} onHide={closeModal} size="xl" centered>
          <Modal.Header className="form-main-heading">
            <Modal.Title>
              {formik.values.id ? "Update Course" : "Add Course"}
            </Modal.Title>
            <AiOutlineClose
              size={20}
              style={{ cursor: "pointer", color: "white" }}
              onClick={closeModal}
            />
          </Modal.Header>
          <Form onSubmit={formik.handleSubmit}>
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
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="university">
                    <Form.Label>University</Form.Label>
                    <Select
                      id="university-select"
                      options={instituteData
                        ?.sort((a, b) => a.name?.localeCompare(b.name))
                        ?.map((institute) => ({
                          value: institute._id,
                          label: institute.name,
                        }))}
                      isMulti={!formik.values.id}
                      onChange={(selectedOption) => {
                        let selected = [];
                        if (formik.values.id) {
                          selected = selectedOption
                            ? [
                                {
                                  _id: selectedOption.value,
                                  name: selectedOption.label,
                                },
                              ]
                            : [];
                        } else {
                          selected = selectedOption
                            ? selectedOption.map((option) => ({
                                _id: option.value,
                                name: option.label,
                              }))
                            : [];
                        }
                        setSelectedUniversities(selected);
                        formik.setFieldValue(
                          "university",
                          selected.map((item) => item._id),
                        );
                      }}
                      value={
                        formik.values.id
                          ? selectedUniversities.length > 0
                            ? {
                                value: selectedUniversities[0]._id,
                                label: selectedUniversities[0].name,
                              }
                            : null
                          : selectedUniversities.map((uni) => ({
                              value: uni._id,
                              label: uni.name,
                            }))
                      }
                      classNamePrefix="custom-select"
                      placeholder="Select University"
                      isClearable
                    />
                    {formik?.touched?.university &&
                      formik.errors.university && (
                        <div className="text-danger">
                          {formik.errors.university}
                        </div>
                      )}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Program Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="programName"
                      className="custom-select-height"
                      placeholder="Enter Program Name"
                      value={formik.values.programName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik?.touched?.programName &&
                      formik.errors.programName && (
                        <div className="text-danger">
                          {formik.errors.programName}
                        </div>
                      )}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Application Starting Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="applicationStartDate"
                      className="custom-select-height"
                      placeholder="Select Application Starting Date"
                      value={formik.values.applicationStartDate}
                      onChange={(e) =>
                        formik.setFieldValue("applicationStartDate", [
                          e.target.value,
                        ])
                      }
                      onBlur={formik.handleBlur}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Application Ending Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="applicationEndDate"
                      className="custom-select-height"
                      placeholder="Select Application Ending Date"
                      value={formik.values.applicationEndDate}
                      onChange={(e) =>
                        formik.setFieldValue("applicationEndDate", [
                          e.target.value,
                        ])
                      }
                      onBlur={formik.handleBlur}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Career Details</Form.Label>
                    <Form.Control
                      name="career"
                      className="custom-select-height"
                      placeholder="Enter career prospects / outcomes"
                      value={formik.values.career}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.career && formik.errors.career && (
                      <div className="text-danger">{formik.errors.career}</div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Duration</Form.Label>
                    <Form.Control
                      type="text"
                      name="duration"
                      className="custom-select-height"
                      placeholder="Enter Duration"
                      value={formik.values.duration}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Concentration</Form.Label>
                    <Form.Control
                      type="text"
                      name="concentration"
                      className="custom-select-height"
                      placeholder="Enter Concentration"
                      value={formik.values.concentration}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Study Area</Form.Label>
                    <Form.Control
                      type="text"
                      name="studyArea"
                      className="custom-select-height"
                      placeholder="Enter Study Area"
                      value={formik.values.studyArea}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik?.touched?.studyArea && formik.errors.studyArea && (
                      <div className="text-danger">
                        {formik.errors.studyArea}
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Discipline Area</Form.Label>
                    <Form.Control
                      type="text"
                      name="disciplineArea"
                      className="custom-select-height"
                      placeholder="Enter Discipline Area (comma-separated values)"
                      value={formik.values.disciplineArea}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik?.touched?.disciplineArea &&
                      formik.errors.disciplineArea && (
                        <div className="text-danger">
                          {formik.errors.disciplineArea}
                        </div>
                      )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Score</Form.Label>
                    <Form.Control
                      type="text"
                      className="custom-select-height"
                      name="score"
                      placeholder="Enter Score"
                      value={formik.values.score}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.score && formik.errors.score && (
                      <div className="text-danger">{formik.errors.score}</div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Score Out Of</Form.Label>
                    <Select
                      options={scoreOutOfOptions}
                      name="scoreOutOf"
                      placeholder="Select Score Out Of"
                      className="custom-select-height"
                      value={scoreOutOfOptions.find(
                        (opt) => opt.value === formik.values.scoreOutOf,
                      )}
                      onChange={(selectedOption) => {
                        formik.setFieldValue(
                          "scoreOutOf",
                          selectedOption ? selectedOption.value : "",
                        );
                      }}
                      styles={{
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
                      }}
                      isClearable
                    />
                    {formik.touched.scoreOutOf && formik.errors.scoreOutOf && (
                      <div className="text-danger">
                        {formik.errors.scoreOutOf}
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="studyLevel">
                    <Form.Label>Study Level</Form.Label>
                    <Select
                      id="study-level-select"
                      options={studyLevelData?.map((level) => ({
                        value: level._id,
                        label: level.name,
                      }))}
                      isMulti
                      onChange={(selectedOptions) => {
                        const selected = selectedOptions
                          ? selectedOptions.map((option) => ({
                              _id: option.value,
                              name: option.label,
                            }))
                          : [];
                        setSelectedStudyLevel(selected);
                        formik.setFieldValue(
                          "studyLevel",
                          selected.map((item) => item._id),
                        );
                      }}
                      value={selectedStudyLevel.map((level) => ({
                        value: level._id,
                        label: level.name,
                      }))}
                      placeholder="Select study level"
                      isClearable
                      noOptionsMessage={() => "No study levels available"}
                      classNamePrefix="custom-select"
                    />
                    {formik?.touched?.studyLevel &&
                      formik.errors.studyLevel && (
                        <div className="text-danger">
                          {formik.errors.studyLevel}
                        </div>
                      )}
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="requirements">
                    <Form.Label>Requirements</Form.Label>
                    <Select
                      id="requirements-select"
                      options={requirementsData?.map((requirement) => ({
                        value: requirement._id,
                        label: requirement.name,
                      }))}
                      isMulti
                      onChange={(selectedOptions) => {
                        const selected = selectedOptions
                          ? selectedOptions.map((option) => ({
                              _id: option.value,
                              name: option.label,
                            }))
                          : [];
                        setSelectedRequirements(selected);
                        formik.setFieldValue(
                          "requirements",
                          selected.map((item) => item._id),
                        );
                      }}
                      value={selectedRequirements.map((req) => ({
                        value: req._id,
                        label: req.name,
                      }))}
                      placeholder="Select Requirements"
                      isClearable
                      noOptionsMessage={() => "No requirements available"}
                      classNamePrefix="custom-select"
                    />
                    {formik?.touched?.requirements &&
                      formik.errors.requirements && (
                        <div className="text-danger">
                          {formik.errors.requirements}
                        </div>
                      )}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Entry Requirement</Form.Label>
                    <Form.Control
                      type="text"
                      name="entryRequirements"
                      className="custom-select-height"
                      placeholder="Enter Entry Requirement"
                      value={formik.values.entryRequirements}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="tags">
                    <Form.Label>Tags</Form.Label>
                    <Select
                      id="tags-select"
                      options={
                        Array.isArray(tagsData) && tagsData.length > 0
                          ? tagsData
                              .sort((a, b) => a.name?.localeCompare(b.name))
                              .map((tag) => ({
                                value: tag._id,
                                label: tag.name,
                              }))
                          : []
                      }
                      isMulti
                      onChange={(selectedOptions) => {
                        const selected = selectedOptions
                          ? selectedOptions.map((option) => ({
                              _id: option.value,
                              name: option.label,
                            }))
                          : [];
                        setSelectedTags(selected);
                        formik.setFieldValue(
                          "tags",
                          selected.map((item) => item._id),
                        );
                      }}
                      value={selectedTags.map((tag) => ({
                        value: tag._id,
                        label: tag.name,
                      }))}
                      placeholder="Select Tags"
                      isClearable
                      noOptionsMessage={() => "No tags available"}
                      classNamePrefix="custom-select"
                    />
                    {formik?.touched?.tags && formik.errors.tags && (
                      <div className="text-danger">{formik.errors.tags}</div>
                    )}
                  </Form.Group>
                </Col>

                {/* Right Column */}
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="intakeYear">
                    <Form.Label>Intake year</Form.Label>
                    <Select
                      id="intake-year-select"
                      options={intakeYearList.map((year) => ({
                        value: year,
                        label: year.toString(),
                      }))}
                      isMulti
                      onChange={(selectedOptions) => {
                        const selectedYears = selectedOptions
                          ? selectedOptions.map((option) => option.value)
                          : [];
                        setSelectedIntakeYear(selectedYears);
                        formik.setFieldValue("intakeYear", selectedYears);
                      }}
                      value={selectedIntakeYear.map((year) => ({
                        value: year,
                        label: year.toString(),
                      }))}
                      placeholder="Select Intake year"
                      classNamePrefix="custom-select"
                      isClearable
                    />
                    {formik?.touched?.intakeYear &&
                      formik.errors.intakeYear && (
                        <div className="text-danger">
                          {formik.errors.intakeYear}
                        </div>
                      )}
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="intake">
                    <Form.Label>Intake</Form.Label>
                    <Dropdown>
                      <Dropdown.Toggle
                        className={`month-dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center border ${
                          !selectedIntake.length ? "text-muted" : ""
                        }`}
                        style={{
                          height: "38px",
                          fontSize: "13px",
                          padding: "8px 12px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            flexGrow: 1,
                            overflowX: "auto",
                            overflowY: "hidden",
                            whiteSpace: "nowrap",
                            marginRight: "8px",
                          }}
                          className="d-flex align-items-center gap-2"
                        >
                          {selectedIntake.length > 0 ? (
                            selectedIntake.map((intake, index) => (
                              <span
                                key={`${intake}-${index}`}
                                className="text-black rounded-4 px-2 py-1"
                                style={{
                                  fontSize: "12px",
                                  backgroundColor: "#E9ECEF",
                                  flexShrink: 0,
                                }}
                              >
                                {intake} (
                                {checkboxStatus[intake] ? "Active" : "Inactive"}
                                )
                              </span>
                            ))
                          ) : (
                            <span
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Select Intake
                            </span>
                          )}
                        </div>
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        className="month-dropdown-menu w-100"
                        style={{
                          borderRadius: "8px",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          maxHeight: "200px",
                          overflowY: "auto",
                        }}
                      >
                        {intakeList.map((intake, index) => (
                          <div
                            key={`${intake}-${index}`}
                            className="d-flex align-items-center px-2 py-1"
                            style={{
                              transition: "background-color 0.2s",
                            }}
                          >
                            <Form.Check
                              name="intake"
                              type="checkbox"
                              id={`checkbox-${intake}`}
                              checked={checkboxStatus[intake] || false}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setCheckboxStatus((prev) => ({
                                  ...prev,
                                  [intake]: checked,
                                }));
                                const updatedIntakes = intakeList.map((i) => ({
                                  month: i,
                                  status:
                                    checkboxStatus[i] || false
                                      ? "Active"
                                      : "Inactive",
                                }));
                                formik.setFieldValue(
                                  "intakes",
                                  updatedIntakes.filter((item) =>
                                    selectedIntake.includes(item.month),
                                  ),
                                );
                              }}
                              className="me-2"
                              style={{ flexShrink: 0 }}
                            />
                            <span
                              style={{
                                fontSize: "14px",
                                color: selectedIntake.includes(intake)
                                  ? "#007bff"
                                  : "#333",
                                flexGrow: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                cursor: "pointer",
                                fontWeight: selectedIntake.includes(intake)
                                  ? "bold"
                                  : "normal",
                              }}
                              onClick={() => {
                                let updated = [];
                                if (selectedIntake.includes(intake)) {
                                  updated = selectedIntake.filter(
                                    (item) => item !== intake,
                                  );
                                } else {
                                  updated = [...selectedIntake, intake];
                                }
                                setSelectedIntake(updated);
                                const updatedIntakes = intakeList.map((i) => ({
                                  month: i,
                                  status:
                                    checkboxStatus[i] || false
                                      ? "Active"
                                      : "Inactive",
                                }));
                                formik.setFieldValue(
                                  "intakes",
                                  updatedIntakes.filter((item) =>
                                    updated.includes(item.month),
                                  ),
                                );
                              }}
                            >
                              {intake}
                            </span>
                          </div>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                    {formik?.touched?.intakes && formik.errors.intakes && (
                      <div className="text-danger">{formik.errors.intakes}</div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Currency</Form.Label>
                    <Select
                      className="custom-select-height"
                      name="currencyCode"
                      options={currencyCodeData?.map((code) => ({
                        value: code.code,
                        label: code.code,
                      }))}
                      value={currencyCodeData
                        ?.map((code) => ({
                          value: code.code,
                          label: code.code,
                        }))
                        .find(
                          (option) =>
                            option.value === formik.values.currencyCode,
                        )}
                      onChange={(selectedOption) =>
                        formik.setFieldValue(
                          "currencyCode",
                          selectedOption ? selectedOption.value : "",
                        )
                      }
                      placeholder="Select Currency"
                      isClearable
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderRadius: "12px",
                          color: "black",
                          minWidth: "160px",
                          border: state.isFocused ? "1px" : base.border,
                          borderColor: state.isFocused
                            ? "#3B3665"
                            : base.borderColor,
                          boxShadow: state.isFocused
                            ? "0 0 0 1px #5D54BE"
                            : base.boxShadow,
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: "black",
                          fontSize: "13px",
                        }),
                      }}
                    />

                    {formik?.touched?.currencyCode &&
                      formik.errors.currencyCode && (
                        <div className="text-danger">
                          {formik.errors.currencyCode}
                        </div>
                      )}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Application Fee</Form.Label>
                    <Form.Control
                      type="text"
                      name="applicationFee"
                      className="custom-select-height"
                      placeholder="Enter Application Fee"
                      value={formik.values.applicationFee}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik?.touched?.applicationFee &&
                      formik.errors.applicationFee && (
                        <div className="text-danger">
                          {formik.errors.applicationFee}
                        </div>
                      )}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Yearly Tuition Fees</Form.Label>
                    <Form.Control
                      type="text"
                      name="yearlyTuitionFee"
                      className="custom-select-height"
                      placeholder="Enter Yearly Tuition Fees"
                      value={formik.values.yearlyTuitionFee}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik?.touched?.yearlyTuitionFee &&
                      formik.errors.yearlyTuitionFee && (
                        <div className="text-danger">
                          {formik.errors.yearlyTuitionFee}
                        </div>
                      )}
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="scholarshipAvailable">
                    <Form.Label>Scholarship Available</Form.Label>
                    <Select
                      id="scholarship-available-select"
                      options={[
                        { value: "Yes", label: "Yes" },
                        { value: "No", label: "No" },
                      ]}
                      onChange={(selectedOption) => {
                        const value = selectedOption
                          ? selectedOption.value
                          : "";
                        formik.setFieldValue("scholarshipAvailable", value);
                      }}
                      value={
                        formik.values.scholarshipAvailable
                          ? {
                              value: formik.values.scholarshipAvailable,
                              label: formik.values.scholarshipAvailable,
                            }
                          : null
                      }
                      placeholder="Select Option"
                      isClearable
                      noOptionsMessage={() => "No options available"}
                      classNamePrefix="custom-select"
                    />
                    {formik?.touched?.scholarshipAvailable &&
                      formik.errors.scholarshipAvailable && (
                        <div className="text-danger">
                          {formik.errors.scholarshipAvailable}
                        </div>
                      )}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Scholarship Detail</Form.Label>
                    <Form.Control
                      type="text"
                      name="scholarshipDetails"
                      className="custom-select-height"
                      placeholder="Enter Scholarship Detail"
                      value={formik.values.scholarshipDetails}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Website URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="websiteUrl"
                      className="custom-select-height"
                      placeholder="Enter Website URL"
                      value={formik.values.websiteUrl}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Remarks</Form.Label>
                    <Form.Control
                      type="text"
                      name="remarks"
                      className="custom-select-height"
                      placeholder="Enter Remarks"
                      value={formik.values.remarks}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="applicationMode">
                    <Form.Label>Application Mode</Form.Label>
                    <Select
                      id="application-mode-select"
                      options={[
                        { value: "Online", label: "Online" },
                        { value: "Offline", label: "Offline" },
                      ]}
                      onChange={(selectedOption) => {
                        const value = selectedOption
                          ? selectedOption.value
                          : "";
                        formik.setFieldValue("applicationMode", value);
                      }}
                      value={
                        formik.values.applicationMode
                          ? {
                              value: formik.values.applicationMode,
                              label: formik.values.applicationMode,
                            }
                          : null
                      }
                      placeholder="Select Option"
                      isClearable
                      noOptionsMessage={() => "No options available"}
                      classNamePrefix="custom-select"
                    />
                    {formik?.touched?.applicationMode &&
                      formik.errors.applicationMode && (
                        <div className="text-danger">
                          {formik.errors.applicationMode}
                        </div>
                      )}
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="englishProficiencyExamWaiver"
                  >
                    <Form.Label>English Proficiency Exam Waiver</Form.Label>
                    <Select
                      id="english-proficiency-exam-waiver-select"
                      options={[
                        { value: "Yes", label: "Yes" },
                        { value: "No", label: "No" },
                      ]}
                      onChange={(selectedOption) => {
                        const value = selectedOption
                          ? selectedOption.value
                          : "";
                        formik.setFieldValue(
                          "englishProficiencyExamWaiver",
                          value,
                        );
                      }}
                      value={
                        formik.values.englishProficiencyExamWaiver
                          ? {
                              value: formik.values.englishProficiencyExamWaiver,
                              label: formik.values.englishProficiencyExamWaiver,
                            }
                          : null
                      }
                      placeholder="Select Option"
                      isClearable
                      noOptionsMessage={() => "No options available"}
                      classNamePrefix="custom-select"
                    />
                    {formik?.touched?.englishProficiencyExamWaiver &&
                      formik.errors.englishProficiencyExamWaiver && (
                        <div className="text-danger">
                          {formik.errors.englishProficiencyExamWaiver}
                        </div>
                      )}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Criteria</Form.Label>
                    <Form.Control
                      type="text"
                      name="criteria"
                      className="custom-select-height"
                      placeholder="Enter Criteria Detail"
                      value={formik.values.criteria}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="eslElpAvailable">
                      ESL/ELP Available
                    </Form.Label>
                    <Form.Check
                      type="checkbox"
                      label="Yes"
                      id="eslElpAvailable"
                      name="eslElpAvailable"
                      checked={formik.values.eslElpAvailable === "Yes"}
                      onChange={handleEslElpChange}
                    />
                    <Form.Control
                      type="text"
                      name="eslElpDetails"
                      value={formik.values.eslElpDetails}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="custom-select-height"
                      placeholder="Enter Details (if applicable)"
                      style={{ marginTop: "10px" }}
                      disabled={!showInput}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="status">
                    <Form.Label>Status</Form.Label>
                    <Select
                      id="status-select"
                      options={[
                        { value: "Active", label: "Active" },
                        { value: "Inactive", label: "Inactive" },
                      ]}
                      onChange={(selectedOption) => {
                        const value = selectedOption
                          ? selectedOption.value
                          : "";
                        formik.setFieldValue("status", value);
                      }}
                      value={
                        formik.values.status
                          ? {
                              value: formik.values.status,
                              label: formik.values.status,
                            }
                          : null
                      }
                      placeholder="Select Status"
                      isClearable
                      noOptionsMessage={() => "No options available"}
                      classNamePrefix="custom-select"
                    />
                    {formik?.touched?.status && formik.errors.status && (
                      <div className="text-danger">{formik.errors.status}</div>
                    )}
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="link"
                className="custom-select-height btn border-primary text-primary text-decoration-none"
                onClick={closeModal}
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
            </Modal.Footer>
          </Form>
        </Modal>

        <div className="d-flex flex-wrap justify-content-end gap-2">
          {userRole !== "Student" &&
            userRole !== "LeadStudent" &&
            canDownload && (
              <button
                type="button"
                className="custom-select-height btn btn-primary btn-icon-text d-inline-flex align-items-center mb-2"
                style={{
                  pointerEvents: "auto",
                  position: "relative",
                  whiteSpace: "nowrap",
                }}
                onClick={courseDownload}
              >
                <i className="fe fe-download-cloud me-2 fs-14"></i> Download
                Report
              </button>
            )}
          {userRole === "Super Admin" && (
            <button
              type="button"
              className="custom-select-height btn btn-primary btn-icon-text d-inline-flex align-items-center mb-2"
              style={{
                pointerEvents: "auto",
                position: "relative",
                whiteSpace: "nowrap",
              }}
              onClick={handleAllDownload}
            >
              <i className="fe fe-download-cloud me-2 fs-14"></i> All Download
            </button>
          )}
        </div>

        <Row className="row-sm">
          <Col md={12} lg={12} xl={12}>
            <Card
              className="custom-card transcation-crypto"
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                boxShadow: "0 8px 32px rgba(107, 92, 231, 0.1)",
                borderRadius: "16px",
                overflow: "hidden",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              <Card.Header
                className="border-bottom-0"
                style={{
                  background: "transparent",
                  borderRadius: "16px 16px 0 0",
                  borderBottom: "1px solid #e2e8f0",
                  padding: "20px",
                }}
              >
                <div className="w-100">
                  {showSlider && (
                    <div className="mb-4 mb-md-3">
                      <div
                        className="bg-white p-3 p-md-4"
                        style={{
                          borderRadius: "12px",
                          maxWidth: "100%",
                          boxShadow: "0 4px 12px rgba(107, 92, 231, 0.15)",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <Box sx={{ width: "100%" }}>
                          <Slider
                            getAriaLabel={() => "Range"}
                            value={[minPrice, maxPrice]}
                            onChange={handleChange}
                            valueLabelDisplay="auto"
                            getAriaValueText={valuetext}
                            max={100000}
                            sx={{
                              "& .MuiSlider-track": {
                                background:
                                  "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                              },
                              "& .MuiSlider-thumb": {
                                background:
                                  "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                              },
                            }}
                          />
                          <div className="d-flex flex-row flex-sm-row gap-2 mt-2">
                            <TextField
                              label="Min"
                              type="number"
                              value={minPrice}
                              onChange={handleMinChange}
                              size="small"
                              sx={{
                                width: "100%",
                                maxWidth: "120px",
                                "& .MuiOutlinedInput-root": {
                                  background: "#f8fafc",
                                },
                              }}
                            />
                            <TextField
                              label="Max"
                              type="number"
                              value={maxPrice}
                              onChange={handleMaxChange}
                              size="small"
                              sx={{
                                width: "100%",
                                maxWidth: "120px",
                                "& .MuiOutlinedInput-root": {
                                  background: "#f8fafc",
                                },
                              }}
                            />
                          </div>
                        </Box>
                      </div>
                    </div>
                  )}

                  <div className="d-flex flex-column flex-lg-row justify-content-between align-items-stretch gap-3">
                    <div className="d-flex flex-wrap justify-content-start justify-content-lg-start gap-2 w-100 w-lg-auto"></div>
                    {/* Total Records - Left aligned on large screens, full width on mobile */}
                    <div className="d-flex justify-content-end justify-content-lg-end">
                      <div
                        className="custom-select-height total-records px-4 py-2 d-flex align-items-center"
                        style={{
                          background: "#e0e7ff",
                          borderRadius: "20px",
                          color: "#6B5CE7",
                          fontWeight: "500",
                          minWidth: "fit-content",
                          height: "fit-content",
                        }}
                      >
                        <span style={{ whiteSpace: "nowrap" }}>
                          Total Records: <strong>{totalRecords}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Header>
              <Card.Body style={{ padding: "25px" }}>
                <div className="mb-4">
                  {hasSearched &&
                    relexFilterMsg &&
                    relexFilterMsg !== "Courses fetched successfully" &&
                    relexFilterMsg !== "No matching courses found." && (
                      <div
                        className="alert alert-info d-flex align-items-center"
                        role="alert"
                        style={{
                          background:
                            "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
                          border: "1px solid #fbbf24",
                          borderRadius: "12px",
                          padding: "15px 20px",
                        }}
                      >
                        <div
                          className="d-flex align-items-center"
                          style={{
                            width: "24px",
                            height: "24px",
                            background: "#f59e0b",
                            color: "white",
                            borderRadius: "50%",
                            fontSize: "14px",
                            fontWeight: "bold",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: "12px",
                          }}
                        >
                          !
                        </div>
                        <div>
                          <strong>{relexFilterMsg}</strong>
                        </div>
                      </div>
                    )}
                </div>
                <div className="my-4">
                  <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-xl-3 row-cols-xxl-4 g-4">
                    {courseFinderData?.length > 0
                      ? courseFinderData?.map((item, index) => (
                          <div key={index} className="col">
                            <div
                              className="card h-100 border-0 course_card"
                              style={{
                                position: "relative",
                                background: "#fff",
                                borderRadius: "16px",
                                overflow: "hidden",
                                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
                                transition:
                                  "transform 0.3s ease, box-shadow 0.3s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform =
                                  "translateY(-5px)";
                                e.currentTarget.style.boxShadow =
                                  "0 20px 40px rgba(0, 0, 0, 0.1)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform =
                                  "translateY(0)";
                                e.currentTarget.style.boxShadow =
                                  "0 10px 25px rgba(0, 0, 0, 0.15)";
                              }}
                            >
                              {item?.status === "Inactive" && (
                                <div
                                  className="position-absolute top-0 start-0 bg-danger text-white px-3 py-1 rounded-end rounded-bottom"
                                  style={{ zIndex: 10 }}
                                >
                                  Course Unavailable
                                </div>
                              )}
                              <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-3 gap-2">
                                  <div className="d-flex align-items-center gap-3 flex-grow-1">
                                    <div
                                      className="university-logo-main"
                                      style={{
                                        minWidth: "60px",
                                        minHeight: "60px",
                                      }}
                                    >
                                      <img
                                        src={`${REACT_APP_API_URL}/${item?.university?.profile?.replace(
                                          /\\/g,
                                          "/",
                                        )}`}
                                        alt="University Logo"
                                        className="university-logo rounded-circle"
                                        style={{
                                          width: "60px",
                                          height: "60px",
                                          objectFit: "cover",
                                          // border: "2px solid #e2e8f0",
                                        }}
                                      />
                                    </div>
                                    <div className="flex-grow-1">
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>
                                            {item?.university?.instituteName ||
                                              "-"}
                                          </Tooltip>
                                        }
                                      >
                                        <h6
                                          className="institute_name text-dark mb-1"
                                          style={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            cursor: "pointer",
                                            lineHeight: 1.3,
                                          }}
                                        >
                                          {item?.university?.instituteName ||
                                            "-"}
                                        </h6>
                                      </OverlayTrigger>
                                      <span className="text-muted small">
                                        {item?.studyLevel[0]?.name || "-"}
                                      </span>
                                    </div>
                                  </div>
                                  {/* <div className="d-flex align-items-center gap-2">
                                    {userRole !== "Student" &&
                                      userRole !== "LeadStudent" && (
                                        <div className="form-check form-switch custom-toggle-button me-0">
                                          <input
                                            className="form-check-input three-dots-icon"
                                            type="checkbox"
                                            id={`toggle-${index}`}
                                            checked={selectedIds.includes(
                                              item._id,
                                            )}
                                            onChange={() =>
                                              handleCheckboxChangeId(item?._id)
                                            }
                                          />
                                        </div>
                                      )}
                                  </div> */}
                                </div>
                                <h5
                                  className="course_program_title text-primary mb-3"
                                  onClick={() => handleView(item)}
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    color: "#6B5CE7",
                                    transition: "color 0.2s ease",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.target.style.color = "#7B68EE")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.target.style.color = "#6B5CE7")
                                  }
                                >
                                  {item?.programName || "-"}
                                </h5>
                                <div className="d-flex align-items-center mb-3 text-muted small">
                                  <span className="me-1">
                                    <PublicIcon
                                      className="course_icon_1"
                                      style={{
                                        fontSize: "16px",
                                        verticalAlign: "middle",
                                      }}
                                    />
                                  </span>
                                  <span className="text-capitalize">
                                    {item?.university?.country || "-"}
                                    {item?.university?.state
                                      ? `, ${item?.university?.state}`
                                      : ""}
                                    {item?.university?.city
                                      ? `, ${item?.university?.city}`
                                      : ""}
                                  </span>
                                </div>

                                <div className="tag-pill-container mb-3">
                                  {item?.tags?.length > 0 &&
                                    item?.tags?.map((tag) => (
                                      <span
                                        key={tag._id}
                                        className="tag-pill d-inline-flex align-items-center me-2 mb-2 gap-1 px-3 py-1"
                                        style={{
                                          backgroundColor: hexToRgba(
                                            tag.color || "#667eea",
                                            0.1,
                                          ),
                                          borderRadius: "20px",
                                          fontSize: "12px",
                                          fontWeight: 500,
                                          color: tag.color || "#667eea",
                                          border: `1px solid ${hexToRgba(tag.color || "#667eea", 0.3)}`,
                                        }}
                                      >
                                        {getIconForTag(tag)}
                                        {tag.name}
                                      </span>
                                    ))}
                                </div>

                                <div className="mb-3">
                                  <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span
                                      className="fw-bold"
                                      // style={{ fontWeight: "500" }}
                                    >
                                      Application Fee:
                                    </span>
                                    <span
                                      className="text-muted"
                                      style={{ fontSize: "14px" }}
                                    >
                                      {item.applicationFee &&
                                      item.currencyCode ? (
                                        <>
                                          {getSymbolFromCurrency(
                                            item.currencyCode,
                                          ) || item.currencyCode}
                                          &nbsp;
                                          {new Intl.NumberFormat().format(
                                            Number(
                                              String(
                                                item.applicationFee,
                                              ).replace(/,/g, ""),
                                            ),
                                          )}
                                        </>
                                      ) : item.applicationFee ? (
                                        new Intl.NumberFormat().format(
                                          Number(
                                            String(item.applicationFee).replace(
                                              /,/g,
                                              "",
                                            ),
                                          ),
                                        )
                                      ) : (
                                        "N/A"
                                      )}
                                    </span>
                                  </div>

                                  <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span
                                      className="fw-bold"
                                      // style={{ fontWeight: "500" }}
                                    >
                                      Yearly Tuition Fee:
                                    </span>
                                    <span
                                      className="text-muted"
                                      style={{ fontSize: "14px" }}
                                    >
                                      {item.yearlyTuitionFee &&
                                      item.currencyCode ? (
                                        <>
                                          {getSymbolFromCurrency(
                                            item.currencyCode,
                                          ) || item.currencyCode}
                                          &nbsp;
                                          {new Intl.NumberFormat().format(
                                            Number(
                                              String(
                                                item.yearlyTuitionFee,
                                              ).replace(/,/g, ""),
                                            ),
                                          )}
                                          <OverlayTrigger
                                            placement="top"
                                            overlay={
                                              <Tooltip>
                                                {getINRValue(
                                                  item.yearlyTuitionFee,
                                                  item.currencyCode,
                                                )}
                                              </Tooltip>
                                            }
                                          >
                                            <span
                                              style={{
                                                position: "relative",
                                                display: "inline-block",
                                                marginLeft: "8px",
                                                cursor: "pointer",
                                              }}
                                            >
                                              <img
                                                src={ALLImages("course1")}
                                                height="16px"
                                                width="16px"
                                                alt="INR"
                                                style={{ opacity: 0.7 }}
                                              />
                                            </span>
                                          </OverlayTrigger>
                                        </>
                                      ) : item.yearlyTuitionFee ? (
                                        <>
                                          {new Intl.NumberFormat().format(
                                            Number(
                                              String(
                                                item.yearlyTuitionFee,
                                              ).replace(/,/g, ""),
                                            ),
                                          )}
                                        </>
                                      ) : (
                                        "N/A"
                                      )}
                                    </span>
                                  </div>

                                  <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span
                                      className="fw-bold"
                                      // style={{ fontWeight: "500" }}
                                    >
                                      Duration:
                                    </span>
                                    <span
                                      className="text-muted"
                                      style={{ fontSize: "14px" }}
                                    >
                                      {item?.duration || "N/A"}
                                    </span>
                                  </div>

                                  <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span
                                      className="fw-bold"
                                      // style={{ fontWeight: "500" }}
                                    >
                                      Intake Months:
                                    </span>
                                    <span
                                      className="text-muted"
                                      style={{ fontSize: "14px" }}
                                    >
                                      {item?.intakes && item.intakes.length > 0
                                        ? item.intakes
                                            .map((intake) => intake.month)
                                            .join(", ")
                                        : "N/A"}
                                    </span>
                                  </div>

                                  <div className="d-flex justify-content-between align-items-center">
                                    <span
                                      className="fw-bold"
                                      // style={{ fontWeight: "500" }}
                                    >
                                      Intake Years:
                                    </span>
                                    <span
                                      className="text-muted"
                                      style={{ fontSize: "14px" }}
                                    >
                                      {item?.intakeYear &&
                                      item.intakeYear.length > 0
                                        ? item.intakeYear.join(", ")
                                        : "N/A"}
                                    </span>
                                  </div>
                                </div>

                                <div
                                  className="mb-3 p-3 rounded-lg"
                                  style={{ background: "#f8fafc" }}
                                >
                                  <div className="d-flex justify-content-between align-items-center mb-2 gap-3">
                                    <span
                                      className="fw-bold"
                                      style={{
                                        minWidth: "70px",
                                        fontSize: "14px",
                                      }}
                                    >
                                      Level:
                                    </span>
                                    <span
                                      className="text-muted"
                                      style={{
                                        fontSize: "14px",
                                        lineHeight: "1.5",
                                        textAlign: "right",
                                        flex: 1,
                                      }}
                                    >
                                      {item?.studyLevel?.length > 0
                                        ? item.studyLevel
                                            .map((level) => level.name)
                                            .join(", ")
                                        : "N/A"}
                                    </span>
                                  </div>

                                  <div>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                      <span
                                        className="fw-bold"
                                        // style={{ fontWeight: "500" }}
                                      >
                                        Requirements:
                                      </span>
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                      {item?.requirements?.length > 0 ? (
                                        item.requirements.map((req, idx) => {
                                          const name = req?.name || "N/A";
                                          const { bg, text } =
                                            getColorForRequirement(name);
                                          return (
                                            <span
                                              key={idx}
                                              className="px-3 py-1 rounded"
                                              style={{
                                                backgroundColor: bg,
                                                color: text,
                                                fontSize: "14px",
                                                fontWeight: 500,
                                              }}
                                            >
                                              {name}
                                            </span>
                                          );
                                        })
                                      ) : (
                                        <span className="text-muted small">
                                          N/A
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 gap-2">
                                  <div className="d-flex align-items-center gap-3">
                                    {item.websiteUrl && (
                                      <a
                                        href={item.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-decoration-none"
                                        style={{ color: "#00b2c5" }}
                                      >
                                        <FaGlobe
                                          style={{
                                            fontSize: "20px",
                                          }}
                                        />
                                      </a>
                                    )}
                                    {item.university?.youtubeLink && (
                                      <a
                                        href={item.university?.youtubeLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-decoration-none"
                                        style={{ color: "#FF0033" }}
                                      >
                                        <FaYoutube
                                          style={{
                                            fontSize: "22px",
                                          }}
                                        />
                                      </a>
                                    )}
                                    {item.university?.galleryLink && (
                                      <a
                                        href={item.university?.galleryLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-decoration-none"
                                        style={{ color: "#E1306C" }}
                                      >
                                        <FaInstagram
                                          className="instagram-icon"
                                          style={{
                                            fontSize: "22px",
                                          }}
                                        />
                                      </a>
                                    )}
                                  </div>
                                  <div className="d-flex flex-wrap gap-2">
                                    <button
                                      className="btn btn-outline-primary rounded_button"
                                      onClick={() => handleView(item)}
                                      style={{
                                        border: "1px solid #6B5CE7",
                                        color: "#6B5CE7",
                                        borderRadius: "8px",
                                        padding: "8px 16px",
                                        fontWeight: "500",
                                        transition: "all 0.2s ease",
                                      }}
                                      onMouseEnter={(e) => {
                                        e.target.style.background = "#4f46e5";
                                        e.target.style.color = "white";
                                      }}
                                      onMouseLeave={(e) => {
                                        e.target.style.background =
                                          "transparent";
                                        e.target.style.color = "#4f46e5";
                                      }}
                                    >
                                      Details
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      : !isLoading && (
                          <div className="w-100 d-flex justify-content-center align-items-center py-5">
                            <div className="text-center">
                              <div
                                className="mb-3"
                                style={{ fontSize: "3rem", color: "#cbd5e1" }}
                              >
                                📚
                              </div>
                              <h5 className="text-muted">No courses found</h5>
                              <p className="text-muted">
                                Try adjusting your search criteria
                              </p>
                            </div>
                          </div>
                        )}
                  </div>
                </div>

                <DeleteConfirmModal
                  show={showDeleteModal}
                  onHide={() => setShowDeleteModal(false)}
                  onConfirm={() => handleDelete(selectedItem)}
                />

                <LoadMoreButton
                  isLoading={isLoading}
                  loadedRecords={loadedRecords}
                  totalRecords={totalRecords}
                  onLoadMore={handleLoadMore}
                />
                {/* {totalPages > 1 && courseFinderData.length > 0 && (
                <Paginations
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              )} */}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {tooltip.show && (
          <div
            style={{
              position: "fixed",
              top: tooltip.y - 40,
              left: tooltip.x - 175,
              background: "#fff",
              color: "#333",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "4px 12px",
              fontSize: "14px",
              whiteSpace: "nowrap",
              zIndex: 9999,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              pointerEvents: "none",
            }}
          >
            {tooltip.text}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default PublicCourseFinder;
