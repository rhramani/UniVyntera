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
    localStorage.getItem("crmCurrency")
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
      })
    )
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
        .filter((word) => word.toLowerCase().includes(inputValue))
    );

    const phraseSuggestions = concentrations.filter((item) =>
      item.toLowerCase().includes(inputValue)
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
    (_, index) => new Date().getFullYear() + index
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
        selectedStudyArea
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
        getAllCourseFinder(page, limit, filterPayload)
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
          (inst) => inst.label
        );
        fetchAllCampusByInstitute(instituteNames, "");
      }

      fetchAllCourseFinder(
        filters.currentPage,
        itemsPerPage,
        filters.appliedFilters || {}
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
      selectedState?.label
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
        new Map(allStates.map((state) => [state.isoCode, state])).values()
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
      stateLabels
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
      getAllInstitute(1, 5000, "", country, state)
    );
    const responseData = response?.data?.data?.data;
    setInstituteDataByCountry(responseData);
  };

  const fetchAllCampusByInstitute = async (instituteNames) => {
    try {
      let allCampuses = [];
      for (const instituteName of instituteNames) {
        const response = await dispatch(
          instituteWiseCampusDropdown(instituteName, "")
        );
        const responseData = response?.data?.data || [];
        allCampuses = [...allCampuses, ...responseData];
      }
      // Remove duplicates based on campus ID
      const uniqueCampuses = Array.from(
        new Map(allCampuses.map((campus) => [campus._id, campus])).values()
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
          (req) => req._id
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
            selectedIntake.includes(item.month)
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
        formik.values.duration.includes(option.value)
      );
      setSelectedDuration(preSelected);
    }
  }, [durationData, formik.values.duration]);

  const handleEdit = (item) => {
    const universities = item.university ? [item.university._id] : [];

    setSelectedUniversities(
      item.university
        ? [{ _id: item.university._id, name: item.university.instituteName }]
        : []
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
            : []
        )
        .map((item) => item.trim())
        .filter(Boolean)
    )
  ).map((option) => ({
    value: option,
    label: option,
  }));

  const studyAreaOptions = Array.from(
    new Set(
      (studyAreaOption || []).map((option) => option.trim()).filter(Boolean)
    )
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
      (rate) => rate.currencyCode === currencyCode
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

  return (
    <Fragment>
      <div className="mx-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Pageheader
              mainheading="Course"
              parentfolder="Home"
              activepage="Course"
            />
          </div>
        </div>

        {/* {canRead && ( */}
        <div
          className="small-device-adjust p-3 mb-4 bg-light rounded"
          style={{ border: "1px solid #053880", overflow: "visible" }}
        >
          {/* Combined input and buttons in a single flex row */}
          <Row className="align-items-end g-2 px-2 mb-2">
            {/* <Col> */}
            <div className="filter-section gap-2">
              <Form.Group
                controlId="studyArea"
                style={{ flex: 1, position: "relative" }}
              >
                <Form.Control
                  type="text"
                  placeholder="What would you like to study?"
                  name="studyArea"
                  className="w-100 rounded-5 search-input-light text-capitalize"
                  autoComplete="off"
                  style={{
                    height: "45px",
                    borderColor: "#b5bcc4",
                    padding: "10px",
                    minWidth: "230px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#007BFF";
                    handleInputFocus();
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#b5bcc4";
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
                      background: "#fff",
                      border: "0.5px solid #b5bcc4",
                      borderRadius: "10px",
                      maxHeight: "150px",
                      overflowY: "auto",
                      zIndex: 1000,
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      marginTop: "5px",
                    }}
                  >
                    {suggestions.map((word, index) => (
                      <div
                        key={`${word}-${index}`}
                        className="suggestion-item"
                        style={{
                          padding: "8px 12px",
                          cursor: "pointer",
                          backgroundColor: "#fff",
                          // borderBottom: "1px solid #f0f0f0",
                        }}
                        onMouseDown={() => handleSuggestionClick(word)}
                        onMouseEnter={(e) =>
                          (e.target.style.backgroundColor = "#DEEBFF")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.backgroundColor = "#fff")
                        }
                      >
                        {word}
                      </div>
                    ))}
                  </div>
                )}
              </Form.Group>
              <div className="d-flex flex-wrap justify-content-end gap-2">
                <Button
                  variant="primary"
                  className="rounded-5 d-flex justify-content-center align-items-center gap-2 px-5"
                  style={{ height: "45px", fontSize: "16px" }}
                  onClick={() => {
                    setShowFilterModal(false);
                    const hasValidFilters = handleCourseSearch();
                    if (hasValidFilters) {
                      setShowSlider(true);
                    }
                    setTimeout(() => {
                      setShowButton(true);
                    }, 300);
                  }}
                >
                  <FaSearch fontSize={14} />
                  <span>Search</span>
                </Button>
                <Button
                  variant="link"
                  className="border-primary text-primary text-decoration-none rounded-5 d-flex justify-content-center align-items-center gap-2 px-5"
                  style={{ height: "45px", fontSize: "16px" }}
                  onClick={() => {
                    resetFilters();
                    setShowSlider(false);
                  }}
                >
                  <FaUndo fontSize={14} />
                  Reset
                </Button>
              </div>
            </div>
            {/* </Col> */}
          </Row>

          <Row className="align-items-end g-2 px-2">
            <Col xs={12} sm={3} md={3}>
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
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "45px",
                    padding: "0 10px",
                    borderRadius: "30px",
                    borderColor: "#b5bcc4",
                    fontSize: "15px",
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: "#000",
                    fontSize: "15px",
                  }),
                  multiValue: (base) => ({
                    ...base,
                    fontSize: "16px",
                    margin: "4px 2px",
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    flexWrap: "wrap",
                    padding: "2px",
                  }),
                  menu: (base) => ({
                    ...base,
                    fontSize: "16px",
                    marginTop: "2px",
                    width: "100%",
                    position: "absolute",
                    zIndex: 9999,
                  }),
                  menuList: (base) => ({
                    ...base,
                    maxHeight: "200px",
                    overflowY: "auto",
                  }),
                }}
              />
            </Col>
            <Col xs={12} sm={3} md={3}>
              <Form.Label className="course_finder_filter">State</Form.Label>
              <Select
                id="state-select"
                options={states
                  ?.sort((a, b) => a.name.localeCompare(b.name))
                  ?.map((state) => ({
                    value: state.isoCode,
                    label: state.name,
                  }))}
                // onChange={(selectedOptions) => {
                //   setSelectedState(selectedOptions || []);
                //   fetchAllInstituteByCountry(
                //     selectedCountry?.map((c) => c.label),
                //     selectedOptions?.map((s) => s.label) || []
                //   );
                //   setLoadedRecords(12);
                // }}
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
                styles={{
                  control: (base) => ({
                    ...base,
                    height: 50,
                    minHeight: 50,
                    padding: "0 10px",
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    minHeight: 48,
                    paddingTop: 6,
                    paddingBottom: 6,
                    paddingLeft: 8,
                    paddingRight: 8,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: "#f0f0f0",
                    borderRadius: 12,
                    padding: "2px 8px",
                    margin: "2px 4px",
                    fontSize: 14,
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "#333",
                    fontWeight: 500,
                    padding: 0,
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: "#888",
                    ":hover": {
                      backgroundColor: "#e0e0e0",
                      color: "#222",
                    },
                  }),
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
            </Col>
            <Col xs={12} sm={3} md={3}>
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
                        a.instituteName.localeCompare(b.instituteName)
                      )
                      ?.map((institute) => [institute.instituteName, institute]) // use name as key
                  ).values()
                ).map((institute) => ({
                  value: institute._id,
                  label: institute.instituteName,
                }))}
                onChange={(selectedOptions) => {
                  setSelectedInstitute(selectedOptions || []);
                  setCampus([]); // Clear campus selection when institute changes
                  if (selectedOptions && selectedOptions.length > 0) {
                    // Fetch campuses for all selected institutes
                    const instituteNames = selectedOptions.map(
                      (option) => option.label
                    );
                    fetchAllCampusByInstitute(instituteNames, "");
                  } else {
                    setCampusDataByInstitute([]);
                  }
                  // setLoadedRecords(12);
                  setCurrentPage(1);
                }}
                // onChange={handleInstituteChange}
                isMulti
                value={selectedInstitute}
                isClearable
                classNamePrefix="custom-select"
                placeholder="Select Institute"
                styles={{
                  control: (base) => ({
                    ...base,
                    height: "45px",
                    minHeight: "45px",
                    padding: "0 0 0 5px",
                    borderRadius: "25px",
                    borderColor: "#b5bcc4",
                    fontSize: "15px",
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: "#000000",
                  }),
                }}
              />
            </Col>
            <Col xs={12} sm={3} md={3}>
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
                  // setLoadedRecords(12);
                  setCurrentPage(1);
                }}
                // onChange={handleCampusChange}
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
                styles={{
                  control: (base) => ({
                    ...base,
                    height: "45px",
                    minHeight: "45px",
                    padding: "0 0 0 5px",
                    borderRadius: "25px",
                    borderColor: "#b5bcc4",
                    fontSize: "15px",
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: "#000000",
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 10000,
                  }),
                }}
              />
            </Col>
          </Row>

          {showButton && (
            <div className="d-flex justify-content-center mt-3">
              <Button
                variant="primary"
                className="rounded-5"
                style={{
                  width: "200px",
                  height: "45px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                }}
                onClick={() => {
                  setShowFilterModal(true);
                  setShowButton(false);
                }}
              >
                Advance Search
                <FaChevronDown size={20} style={{ marginLeft: "12px" }} />
              </Button>
            </div>
          )}
          {showFilterModal && (
            <hr style={{ margin: "16px 0", borderTop: "1px solid #053880" }} />
          )}
          <div
            className={`transition-container ${showFilterModal ? "show" : ""} ${
              isDropdownOpen ? "drop" : ""
            }`}
          >
            {/* Row 1 */}
            <Row
              className="g-2 px-2 mt-1 w-100 rounded"
              style={{ transition: "min-height 0.2s" }}
            >
              <Col md={3}>
                <Form.Label className="course_finder_filter">
                  Program Level
                </Form.Label>
                <Select
                  isMulti
                  options={studyLevelData
                    ?.sort((a, b) => a.name.localeCompare(b.name))
                    ?.map((level) => ({ value: level._id, label: level.name }))}
                  value={studyLevelData
                    ?.sort((a, b) => a.name.localeCompare(b.name))
                    ?.map((level) => ({ value: level._id, label: level.name }))
                    .filter((opt) => selectedProgramLevel.includes(opt.value))}
                  onChange={(selectedOptions) => {
                    setSelectedProgramLevel(
                      selectedOptions
                        ? selectedOptions.map((opt) => opt.value)
                        : []
                    );
                  }}
                  classNamePrefix="custom-select"
                  placeholder="Select Program Level"
                  menuPortalTarget={
                    typeof window !== "undefined" ? document.body : null
                  }
                  menuPosition="fixed"
                  styles={{
                    control: (base) => ({
                      ...base,
                      height: 50,
                      minHeight: 50,
                      padding: "0 10px",
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      minHeight: 48,
                      paddingTop: 6,
                      paddingBottom: 6,
                      paddingLeft: 8,
                      paddingRight: 8,
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "#f0f0f0",
                      borderRadius: 12,
                      padding: "2px 8px",
                      margin: "2px 4px",
                      fontSize: 14,
                      color: "#333",
                      display: "flex",
                      alignItems: "center",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: "#333",
                      fontWeight: 500,
                      padding: 0,
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: "#888",
                      ":hover": {
                        backgroundColor: "#e0e0e0",
                        color: "#222",
                      },
                    }),
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              </Col>
              <Col md={3}>
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
                    // setLoadedRecords(12);
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
                  styles={{
                    control: (base) => ({
                      ...base,
                      height: 50,
                      minHeight: 50,
                      padding: "0 10px",
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      minHeight: 48,
                      paddingTop: 6,
                      paddingBottom: 6,
                      paddingLeft: 8,
                      paddingRight: 8,
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "#f0f0f0",
                      borderRadius: 12,
                      padding: "2px 8px",
                      margin: "2px 4px",
                      fontSize: 14,
                      color: "#333",
                      display: "flex",
                      alignItems: "center",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: "#333",
                      fontWeight: 500,
                      padding: 0,
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: "#888",
                      ":hover": {
                        backgroundColor: "#e0e0e0",
                        color: "#222",
                      },
                    }),
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              </Col>
              <Col md={3}>
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
                        : []
                    );
                    // setLoadedRecords(12);
                    setCurrentPage(1);
                  }}
                  value={disciplineAreaOptions.filter((opt) =>
                    selectedDisciplineArea.includes(opt.value)
                  )}
                  classNamePrefix="custom-select"
                  placeholder="Select Discipline Area"
                  isClearable
                  menuPortalTarget={
                    typeof window !== "undefined" ? document.body : null
                  }
                  menuPosition="fixed"
                  styles={{
                    control: (base) => ({
                      ...base,
                      height: 50,
                      minHeight: 50,
                      padding: "0 10px",
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      minHeight: 48,
                      paddingTop: 6,
                      paddingBottom: 6,
                      paddingLeft: 8,
                      paddingRight: 8,
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "#f0f0f0",
                      borderRadius: 12,
                      padding: "2px 8px",
                      margin: "2px 4px",
                      fontSize: 14,
                      color: "#333",
                      display: "flex",
                      alignItems: "center",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: "#333",
                      fontWeight: 500,
                      padding: 0,
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: "#888",
                      ":hover": {
                        backgroundColor: "#e0e0e0",
                        color: "#222",
                      },
                    }),
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              </Col>
              <Col md={3}>
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
                        : []
                    );
                    // setLoadedRecords(12);
                    setCurrentPage(1);
                  }}
                  classNamePrefix="custom-select"
                  placeholder="Select Requirements"
                  menuPortalTarget={
                    typeof window !== "undefined" ? document.body : null
                  }
                  menuPosition="fixed"
                  styles={{
                    control: (base) => ({
                      ...base,
                      height: 50,
                      minHeight: 50,
                      padding: "0 10px",
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      minHeight: 48,
                      paddingTop: 6,
                      paddingBottom: 6,
                      paddingLeft: 8,
                      paddingRight: 8,
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "#f0f0f0",
                      borderRadius: 12,
                      padding: "2px 8px",
                      margin: "2px 4px",
                      fontSize: 14,
                      color: "#333",
                      display: "flex",
                      alignItems: "center",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: "#333",
                      fontWeight: 500,
                      padding: 0,
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: "#888",
                      ":hover": {
                        backgroundColor: "#e0e0e0",
                        color: "#222",
                      },
                    }),
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              </Col>
            </Row>
            {/* Row 2 */}
            <Row
              className="g-2 px-2 mt-1 w-100 rounded"
              style={{ transition: "min-height 0.2s" }}
            >
              <Col md={3}>
                <Form.Label className="course_finder_filter">Year</Form.Label>
                <Select
                  id="year-select"
                  className="custom-select-height"
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
                  styles={{
                    control: (base) => ({
                      ...base,
                      height: 50,
                      minHeight: 50,
                      padding: "0 10px",
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      minHeight: 48,
                      paddingTop: 6,
                      paddingBottom: 6,
                      paddingLeft: 8,
                      paddingRight: 8,
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "#f0f0f0",
                      borderRadius: 12,
                      padding: "2px 8px",
                      margin: "2px 4px",
                      fontSize: 14,
                      color: "#333",
                      display: "flex",
                      alignItems: "center",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: "#333",
                      fontWeight: 500,
                      padding: 0,
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: "#888",
                      ":hover": {
                        backgroundColor: "#e0e0e0",
                        color: "#222",
                      },
                    }),
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              </Col>
              <Col md={3}>
                <Form.Label className="course_finder_filter">Months</Form.Label>
                <Select
                  id="months-select"
                  className="custom-select-height"
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
                  styles={{
                    control: (base) => ({
                      ...base,
                      height: 50,
                      minHeight: 50,
                      padding: "0 10px",
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      minHeight: 48,
                      paddingTop: 6,
                      paddingBottom: 6,
                      paddingLeft: 8,
                      paddingRight: 8,
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "#f0f0f0",
                      borderRadius: 12,
                      padding: "2px 8px",
                      margin: "2px 4px",
                      fontSize: 14,
                      color: "#333",
                      display: "flex",
                      alignItems: "center",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: "#333",
                      fontWeight: 500,
                      padding: 0,
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: "#888",
                      ":hover": {
                        backgroundColor: "#e0e0e0",
                        color: "#222",
                      },
                    }),
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              </Col>
              <Col md={3}>
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
                  styles={{
                    control: (base) => ({
                      ...base,
                      height: 50,
                      minHeight: 50,
                      padding: "0 10px",
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      minHeight: 48,
                      paddingTop: 6,
                      paddingBottom: 6,
                      paddingLeft: 8,
                      paddingRight: 8,
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "#f0f0f0",
                      borderRadius: 12,
                      padding: "2px 8px",
                      margin: "2px 4px",
                      fontSize: 14,
                      color: "#333",
                      display: "flex",
                      alignItems: "center",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: "#333",
                      fontWeight: 500,
                      padding: 0,
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: "#888",
                      ":hover": {
                        backgroundColor: "#e0e0e0",
                        color: "#222",
                      },
                    }),
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              </Col>
              <Col md={3}>
                <Form.Label className="course_finder_filter">
                  Backlog
                </Form.Label>
                <Form.Control
                  type="text"
                  value={backlog}
                  onChange={(e) => {
                    setBacklog(e.target.value);
                    // setLoadedRecords(12);
                    setCurrentPage(1);
                  }}
                  name="backlog"
                  placeholder="Search Backlog"
                  className="w-100 rounded-5 search-input-light"
                  style={{ height: 50, minHeight: 50, padding: "0 10px" }}
                />
              </Col>
              <Col md={6}>
                <Form.Label className="course_finder_filter">
                  Score Out Of
                </Form.Label>
                <Select
                  id="duration-select"
                  options={scoreOutOfOptions}
                  onChange={(selected) => {
                    setScoreOutOf(selected?.value);
                  }}
                  value={scoreOutOfOptions.filter(
                    (score) => score.value === scoreOutOf
                  )}
                  classNamePrefix="custom-select"
                  placeholder="Select Duration"
                  menuPortalTarget={
                    typeof window !== "undefined" ? document.body : null
                  }
                  menuPosition="fixed"
                  styles={{
                    control: (base) => ({
                      ...base,
                      height: 50,
                      minHeight: 50,
                      padding: "0 10px",
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      minHeight: 48,
                      paddingTop: 6,
                      paddingBottom: 6,
                      paddingLeft: 8,
                      paddingRight: 8,
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "#f0f0f0",
                      borderRadius: 12,
                      padding: "2px 8px",
                      margin: "2px 4px",
                      fontSize: 14,
                      color: "#333",
                      display: "flex",
                      alignItems: "center",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: "#333",
                      fontWeight: 500,
                      padding: 0,
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: "#888",
                      ":hover": {
                        backgroundColor: "#e0e0e0",
                        color: "#222",
                      },
                    }),
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              </Col>
              <Col md={6}>
                <Form.Label className="course_finder_filter">Score</Form.Label>
                <Form.Control
                  type="text"
                  value={score}
                  onChange={(e) => {
                    setScore(e.target.value);
                    // setLoadedRecords(12);
                    setCurrentPage(1);
                  }}
                  name="score"
                  placeholder="Search Score"
                  className="w-100 rounded-5 search-input-light"
                  style={{ height: 50, minHeight: 50, padding: "0 10px" }}
                />
              </Col>
              {/* <Col md={3}>
                <Form.Label className="course_finder_filter">ESL/ELP Available</Form.Label>
                <Select
                  id="esl-elp-select"
                  options={options}
                  onChange={(selectedOption) => {
                    setEslElpAvailable(
                      selectedOption ? selectedOption.value : ""
                    );
                  }}
                  value={
                    options.find((opt) => opt.value === eslElpAvailable) ||
                    null
                  }
                  classNamePrefix="custom-select"
                  placeholder="Select available ESL/ELP"
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      height: 50,
                      minHeight: 50,
                      padding: "0 10px",
                    }),
                  }}
                />
              </Col> */}
            </Row>
            {/* Row 3 */}
            <Row
              className="g-2 px-2 mt-1 w-100 rounded"
              style={{ transition: "min-height 0.2s" }}
            ></Row>
            <div className="d-flex justify-content-center">
              <Button
                variant="link"
                className="text-primary"
                onClick={() => {
                  setShowFilterModal(false);
                  setTimeout(() => {
                    setShowButton(true);
                  }, 300);
                }}
              >
                <FaChevronUp
                  size={24}
                  className={`${isDropdownOpen ? "chevron" : ""}`}
                />
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
                          selected.map((item) => item._id)
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
                        (opt) => opt.value === formik.values.scoreOutOf
                      )}
                      onChange={(selectedOption) => {
                        formik.setFieldValue(
                          "scoreOutOf",
                          selectedOption ? selectedOption.value : ""
                        );
                      }}
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
                          selected.map((item) => item._id)
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
                          selected.map((item) => item._id)
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
                          selected.map((item) => item._id)
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
                                    selectedIntake.includes(item.month)
                                  )
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
                                    (item) => item !== intake
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
                                    updated.includes(item.month)
                                  )
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
                            option.value === formik.values.currencyCode
                        )}
                      onChange={(selectedOption) =>
                        formik.setFieldValue(
                          "currencyCode",
                          selectedOption ? selectedOption.value : ""
                        )
                      }
                      placeholder="Select Currency"
                      isClearable
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderRadius: "30px",
                          color: "black",
                          minWidth: "160px",
                          border: state.isFocused ? "1px" : base.border,
                          borderColor: state.isFocused
                            ? "#3B3665"
                            : base.borderColor,
                          boxShadow: state.isFocused
                            ? "0 0 0 1px #053880"
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
                          value
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
          {userRole !== "Student" && userRole !== "LeadStudent" && canDownload && (
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
            <Card className="custom-card transcation-crypto">
              <Card.Header className="border-bottom-0">
                <div className="w-100 d-flex justify-content-between align-items-center">
                  <div className="card-title w-50">Course Finder</div>
                  <div className="d-flex align-items-center justify-content-between gap-4">
                    {showSlider && (
                      <div>
                        <Box sx={{ width: 300 }}>
                          <Slider
                            getAriaLabel={() => "Range"}
                            value={[minPrice, maxPrice]}
                            onChange={handleChange}
                            valueLabelDisplay="auto"
                            getAriaValueText={valuetext}
                            max={100000}
                          />
                          <div className="d-flex gap-2">
                            <TextField
                              label="Min"
                              type="number"
                              value={minPrice}
                              onChange={handleMinChange}
                              size="small"
                              sx={{ width: 100 }}
                            />
                            <TextField
                              label="Max"
                              type="number"
                              value={maxPrice}
                              onChange={handleMaxChange}
                              size="small"
                              sx={{ width: 100 }}
                            />
                          </div>
                        </Box>
                      </div>
                    )}
                    <div className="custom-select-height total-records px-3 mt-2 mt-md-0 d-flex align-items-center h-6 w-15">
                      <span style={{ whiteSpace: "nowrap" }}>
                        Total Records: <strong>{totalRecords}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <div>
                  {hasSearched &&
                    relexFilterMsg &&
                    relexFilterMsg !== "Courses fetched successfully" &&
                    relexFilterMsg !== "No matching courses found." && (
                      // <div
                      //   className="text-muted mt-1 update-warning mb-3"
                      //   style={{ fontSize: "14px" }}
                      // >
                      //   {relexFilterMsg}
                      // </div>
                      <div
                        style={{
                          padding: "10px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <div
                          className="card"
                          style={{
                            border: "1px solid #FFD600",
                            borderRadius: "10px",
                            padding: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: "#FFF9C4",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <div
                              style={{
                                backgroundColor: "#FFD600",
                                color: "#333",
                                borderRadius: "50%",
                                width: "18px",
                                height: "18px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginRight: "10px",
                                fontSize: "14px",
                                fontWeight: "bold",
                              }}
                            >
                              !
                            </div>
                            <div>
                              <h5
                                style={{
                                  margin: 0,
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                }}
                              >
                                {relexFilterMsg}
                              </h5>
                            </div>
                          </div>
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
                              style={{ position: "relative" }}
                            >
                              <div className="card-body">
                                {item?.status === "Inactive" && (
                                  <div className="notification-unavailable">
                                    Course Unavailable
                                  </div>
                                )}
                                <div className="d-flex justify-content-between align-items-center mb-2 gap-2">
                                  <div className="d-flex align-items-center gap-3">
                                    <div className="university-logo-main">
                                      <img
                                        src={`${REACT_APP_API_URL}/${item?.university?.profile?.replace(
                                          /\\/g,
                                          "/"
                                        )}`}
                                        alt="University Logo"
                                        className="university-logo"
                                      />
                                    </div>
                                    <div className="tooltip-wrapper">
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>
                                            {item?.university?.instituteName ||
                                              "-"}
                                          </Tooltip>
                                        }
                                      >
                                        <span
                                          className="institute_name text-dark"
                                          style={{
                                            fontSize: "17px",
                                            cursor: "pointer",
                                          }}
                                        >
                                          <strong>
                                            {item?.university?.instituteName ||
                                              "-"}
                                          </strong>
                                        </span>
                                      </OverlayTrigger>
                                    </div>
                                  </div>
                                  <div className="d-flex align-items-center">
                                    {userRole !== "Student" && userRole !== "LeadStudent" && (
                                      <div className="form-check form-switch custom-toggle-button me-0">
                                        <input
                                          className="form-check-input three-dots-icon"
                                          type="checkbox"
                                          id={`toggle-${index}`}
                                          checked={selectedIds.includes(
                                            item._id
                                          )}
                                          onChange={() =>
                                            handleCheckboxChangeId(item?._id)
                                          }
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="program-name-wrapper">
                                  <span
                                    className="text-primary"
                                    style={{
                                      fontSize: "18px",
                                      color: "#053880",
                                    }}
                                  >
                                    {item?.studyLevel[0]?.name || "-"}
                                  </span>
                                  <h5
                                    className="course_program_title text-primary mb-3"
                                    onClick={() => handleView(item)}
                                  >
                                    {item?.programName || "-"}
                                  </h5>
                                </div>
                                <div className="d-flex flex-wrap justify-content-between mb-3">
                                  <div className="d-flex">
                                    <span className="me-1">
                                      <PublicIcon className="course_icon_1" />
                                    </span>
                                    <span
                                      className="text-muted"
                                      style={{ fontSize: "18px" }}
                                    >
                                      {item?.university?.country || "-"}
                                      {item?.university?.state
                                        ? `, ${item?.university?.state}`
                                        : ""}
                                      {item?.university?.city
                                        ? `, ${item?.university?.city}`
                                        : ""}
                                    </span>
                                  </div>
                                </div>

                                <div className="tag-pill-container">
                                  {item?.tags?.length > 0 &&
                                    item?.tags?.map((tag) => (
                                      <span
                                        key={tag._id}
                                        className="tag-pill d-inline-flex align-items-center me-2 mb-2 gap-1"
                                        style={{
                                          backgroundColor: hexToRgba(
                                            tag.color || "#d0e2ff",
                                            0.2
                                          ),
                                          borderRadius: "20px",
                                          padding: "2px 8px",
                                          fontSize: "13px",
                                          fontWeight: 500,
                                          color: tag.color || "#000",
                                        }}
                                      >
                                        {getIconForTag(tag)}
                                        {tag.name}
                                      </span>
                                    ))}
                                </div>

                                <div className="horizontal_line mb-3"></div>
                                <p className="course_card_main">
                                  <span className="span-1">
                                    Application Fee&nbsp;:&nbsp;
                                  </span>
                                  <span className="span-2">
                                    {item.applicationFee &&
                                    item.currencyCode ? (
                                      <>
                                        {getSymbolFromCurrency(
                                          item.currencyCode
                                        ) || item.currencyCode}
                                        &nbsp;
                                        {new Intl.NumberFormat().format(
                                          Number(
                                            String(item.applicationFee).replace(
                                              /,/g,
                                              ""
                                            )
                                          )
                                        )}
                                      </>
                                    ) : item.applicationFee ? (
                                      new Intl.NumberFormat().format(
                                        Number(
                                          String(item.applicationFee).replace(
                                            /,/g,
                                            ""
                                          )
                                        )
                                      )
                                    ) : (
                                      "N/A"
                                    )}
                                  </span>
                                </p>

                                <p className="course_card_main">
                                  <span className="span-1">
                                    Yearly Tuition Fee :{" "}
                                  </span>
                                  <span
                                    className="span-2"
                                    style={{
                                      position: "relative",
                                      display: "inline-block",
                                    }}
                                  >
                                    {item.yearlyTuitionFee &&
                                    item.currencyCode ? (
                                      <>
                                        {getSymbolFromCurrency(
                                          item.currencyCode
                                        ) || item.currencyCode}
                                        &nbsp;
                                        {new Intl.NumberFormat().format(
                                          Number(
                                            String(
                                              item.yearlyTuitionFee
                                            ).replace(/,/g, "")
                                          )
                                        )}
                                        <OverlayTrigger
                                          placement="top"
                                          overlay={
                                            <Tooltip>
                                              {getINRValue(
                                                item.yearlyTuitionFee,
                                                item.currencyCode
                                              )}
                                            </Tooltip>
                                          }
                                        >
                                          <span
                                            style={{
                                              position: "absolute",
                                              top: "-11px",
                                              right: "-5px",
                                              cursor: "pointer",
                                            }}
                                          >
                                            <img
                                              src={ALLImages("course1")}
                                              height="15px"
                                              width="15px"
                                              style={{ marginBottom: "15px" }}
                                              alt=""
                                            />
                                          </span>
                                        </OverlayTrigger>
                                      </>
                                    ) : item.yearlyTuitionFee ? (
                                      <>
                                        {new Intl.NumberFormat().format(
                                          Number(
                                            String(
                                              item.yearlyTuitionFee
                                            ).replace(/,/g, "")
                                          )
                                        )}
                                      </>
                                    ) : (
                                      "N/A"
                                    )}
                                  </span>
                                </p>

                                <p className="course_card_main">
                                  <span className="span-1">
                                    Duration&nbsp;:&nbsp;
                                  </span>
                                  <span className="span-2">
                                    {item?.duration || "N/A"}
                                  </span>
                                </p>
                                <p className="course_card_main">
                                  <span className="span-1">
                                    Intake Months&nbsp;:&nbsp;
                                  </span>
                                  <span className="span-2">
                                    {item?.intakes && item.intakes.length > 0
                                      ? item.intakes
                                          .map((intake) => intake.month)
                                          .join(", ")
                                      : "N/A"}
                                  </span>
                                </p>
                                <p className="course_card_main">
                                  <span className="span-1">
                                    Intake Years&nbsp;:&nbsp;
                                  </span>
                                  <span className="span-2">
                                    {item?.intakeYear &&
                                    item.intakeYear.length > 0
                                      ? item.intakeYear.join(", ")
                                      : "N/A"}
                                  </span>
                                </p>
                                <p className="course_card_main text-gray-6 bg-light-purple text-dark px-2 py-1 rounded">
                                  <span className="span-1">
                                    Level&nbsp;:&nbsp;
                                  </span>
                                  <span className="span-2">
                                    {item?.studyLevel?.length > 0
                                      ? item.studyLevel
                                          .map((level) => level.name)
                                          .join(", ")
                                      : "N/A"}
                                  </span>
                                </p>
                                <p className="course_card_main text-gray-6 mb-3 text-dark px-2 py-1 rounded">
                                  <span className="span-1">
                                    Requirements&nbsp;:&nbsp;
                                  </span>
                                  <span className="span-2 d-flex flex-wrap gap-2">
                                    {item?.requirements?.length > 0
                                      ? item.requirements.map((req, idx) => {
                                          const name = req?.name || "N/A";
                                          const { bg, text } =
                                            getColorForRequirement(name);
                                          return (
                                            <span
                                              key={idx}
                                              className="px-2 py-1 rounded"
                                              style={{
                                                backgroundColor: bg,
                                                color: text,
                                                fontSize: "13px",
                                                fontWeight: 500,
                                              }}
                                            >
                                              {name}
                                            </span>
                                          );
                                        })
                                      : "N/A"}
                                  </span>
                                </p>
                                <div className="horizontal_line"></div>
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "20px",
                                    }}
                                  >
                                    {item.websiteUrl && (
                                      <a
                                        href={item.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <FaGlobe
                                          style={{
                                            fontSize: "24px",
                                            color: "#00b2c5",
                                          }}
                                        />
                                      </a>
                                    )}
                                    {item.university?.youtubeLink && (
                                      <a
                                        href={item.university?.youtubeLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <FaYoutube
                                          style={{
                                            fontSize: "26px",
                                            color: "white",
                                            background: "#FF0033",
                                            borderRadius: "50%",
                                            padding: "5px",
                                          }}
                                        />
                                      </a>
                                    )}
                                    {item.university?.galleryLink && (
                                      <a
                                        href={item.university?.galleryLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <FaInstagram
                                          className="instagram-icon"
                                          style={{
                                            fontSize: "26px",
                                            color: "#E1306C",
                                          }}
                                        />
                                      </a>
                                    )}
                                  </div>
                                  <div>
                                    <button
                                      className="btn btn-outline-primary rounded_button"
                                      onClick={() => handleView(item)}
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
                          <div className="w-100 d-flex justify-content-center">
                            No data available
                          </div>
                        )}
                  </div>
                </div>

                <Modal
                  show={showDeleteModal}
                  onHide={() => setShowDeleteModal(false)}
                  centered
                >
                  <Modal.Header className="form-main-heading">
                    <Modal.Title className="fw-semibold">
                      Confirm Deletion
                    </Modal.Title>
                    <AiOutlineClose
                      size={20}
                      style={{ cursor: "pointer", color: "white" }}
                      onClick={() => setShowDeleteModal(false)}
                    />
                  </Modal.Header>
                  <Modal.Body className="text-center py-4">
                    <div className="text-danger text-primary fs-1 mb-3">
                      <i className="bi bi-exclamation-triangle-fill"></i>
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
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="btn-delete-confirm"
                      onClick={() => {
                        handleDelete(selectedItem);
                      }}
                    >
                      <i className="bi bi-trash-fill me-2"></i>Delete
                    </Button>
                  </Modal.Footer>
                </Modal>

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
