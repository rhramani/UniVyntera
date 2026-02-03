import { Fragment, useEffect, useRef, useState } from 'react';
import { Row, Col, Form, Modal, Button, Dropdown } from 'react-bootstrap';
import Pageheader from '../../../layouts/Pageheader';
import { FaChevronDown, FaChevronUp, FaSearch, FaPlus } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
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
} from '../../../redux/actions/CourseFinder.action';
import {
  getAllInstitute,
  instituteWiseCampusDropdown,
  stateDropdown,
  universityCountryDropdown,
} from '../../../redux/actions/Master/Institute.action';
import { getAllProgramLevel } from '../../../redux/actions/Master/ProgramLevel.action';
import { getAllRequirement } from '../../../redux/actions/Master/Requirement.action';
import Select from 'react-select';
import { REACT_APP_API_URL } from '../../../baseUrl';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUndo } from 'react-icons/fa';
import getSymbolFromCurrency from 'currency-symbol-map';
import { getAllTag } from '../../../redux/actions/Master/Tag.action';
import usePermissions from '../../commonComponents/usePermissions';
import LoadMoreButton from '../../commonComponents/LoadMoreButton';
import { decryptData } from '../../../utils/encryptionUtils';
import { getAllCurrencyRate } from '../../../redux/actions/Master/CurrencyRate.action';
import CourseFinderCard from './courseFinder_Components/CourseFinderCard';
import CourseFinderForm from './courseFinder_Components/CourseFinderForm';

const CourseFinder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { canCreate, canRead, canUpdate, canDelete, canDownload, canUpload } = usePermissions('Course Finder');

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
  const [backlog, setBacklog] = useState('');
  const [score, setScore] = useState('');
  const [scoreOutOf, setScoreOutOf] = useState('');
  const [courseFinderData, setCourseFinderData] = useState([]);
  const [relexFilterMsg, setRelexFilterMsg] = useState('');
  // const [search, setSearch] = useState("");
  const [selectedInstitute, setSelectedInstitute] = useState([]);
  const [campus, setCampus] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const userRole = decryptData(localStorage.getItem('role'));
  const [appliedFilters, setAppliedFilters] = useState({});
  const [hasSearched, setHasSearched] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currencyCodeData, setCurrencyCodeData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [currencyRate, setCurrencyRate] = useState([]);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, text: '' });

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

  const storedEncryptedCurrency = decryptData(localStorage.getItem('crmCurrency'));

  const concentrations = Array.from(
    new Set(
      courseFinderData.flatMap((item) => {
        const values = [];
        if (item.concentration && item.concentration.trim() !== '') {
          values.push(item.concentration.trim());
        }
        if (item.programName && item.programName.trim() !== '') {
          values.push(item.programName.trim());
        }
        return values;
      }),
    ),
  );

  const scoreOutOfOptions = [
    { value: '100', label: 'Out of 100' },
    { value: '10', label: 'Out of 10' },
    { value: '7', label: 'Out of 7' },
    { value: '5', label: 'Out of 5' },
    { value: '4', label: 'Out of 4' },
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

    const phraseSuggestions = concentrations.filter((item) => item.toLowerCase().includes(inputValue));

    const allSuggestions = [...new Set([...wordSuggestions, ...phraseSuggestions])];

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

    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    if (showViewModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showViewModal]);

  const handleEslElpChange = (e) => {
    const isChecked = e.target.checked;
    setShowInput(isChecked);
    formik.setFieldValue('eslElpAvailable', isChecked ? 'Yes' : 'No');
  };

  const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

    if (inputValue === '') {
      setMinPrice('');
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

    if (inputValue === '') {
      setMaxPrice('');
      return;
    }

    const newMax = event.target.value === '' ? 0 : Number(event.target.value);
    if (newMax >= minPrice) {
      setMaxPrice(newMax);
      handleCourseSearch(minPrice, newMax);
    } else {
      setMaxPrice(newMax);
      handleCourseSearch(newMax, newMax);
    }
  };

  const valuetext = (value) => `${value}`;

  const intakeList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const intakeYearList = Array.from({ length: 20 }, (_, index) => new Date().getFullYear() + index);

  const openModal = () => setShowModal(true);
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

    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  const handleApplyClick = (course) => {
    navigate(`/student/studentapplication?courseId=${course._id}`);
  };

  const fetchDependentFilter = async (country, studyArea) => {
    try {
      const res = await dispatch(getDependentFilter(country, studyArea || ''));
      // setStudyArea(res?.data?.data?.studyAreas);
      setDisciplineArea(res?.data?.data?.disciplineAreas);
    } catch (error) {
      console.log('Error fetching Study area and Discipline Area');
    }
  };

  const fetchStudyArea = async (country) => {
    try {
      const res = await dispatch(getStudyArea(country));
      setStudyArea(res?.data?.data?.studyAreas);
    } catch (error) {
      console.log('Error fetching Study area and Discipline Area');
    }
  };

  useEffect(() => {
    if (selectedStudyArea) {
      fetchDependentFilter(selectedCountry?.map((option) => option.label) || [], selectedStudyArea);
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
        requirements: !showModal && filters.requirements ? filters.requirements : [],
      };
      const res = await dispatch(getAllCourseFinder(page, limit, filterPayload));
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
      console.error('Error fetching institute:', error);
      setCourseFinderData([]);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    
    fetchAllCourseFinder(currentPage, itemsPerPage, appliedFilters);
    
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
      setEslElpAvailable(filters.eslElpAvailable || '');
      setSelectedInstitute(filters.selectedInstitute || []);
      setCampus(filters.campus || []);
      setBacklog(filters.backlog || '');
      setScore(filters.score || '');
      setScoreOutOf(filters.scoreOutOf || '');
      setSearchText(filters.searchText || '');
      setSelectedProgramLevel(filters.selectedProgramLevel || []);
      setFilterRequirements(filters.filterRequirements || []);
      setMinPrice(filters.minPrice || 0);
      setMaxPrice(filters.maxPrice || 100000);
      setHasSearched(true);
      setStudyAreaInput(filters.studyAreaInput || '');
      setShowSlider(filters.showSlider || false);
      setCurrentPage(filters.currentPage || 1);

      if (filters.selectedInstitute?.length > 0) {
        const instituteNames = filters.selectedInstitute.map((inst) => inst.label);
        fetchAllCampusByInstitute(instituteNames, '');
      }

      fetchAllCourseFinder(filters.currentPage, itemsPerPage, filters.appliedFilters || {});

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
    fetchAllInstituteByCountry(countryNames || selectedCountry?.map((option) => option.label), selectedState?.label);
    fetchDependentFilter(countryNames);
    // setLoadedRecords(12);
    setCurrentPage(1);
  };

  const handleInstituteChange = (selectedOption) => {
    setSelectedInstitute(selectedOption);
    setCampus('');
    // setLoadedRecords(12);
    setCurrentPage(1);
    if (selectedOption) {
      fetchAllCampusByInstitute(selectedOption.value.instituteName, '');
    } else {
      setCampusDataByInstitute([]);
    }
  };

  const handleCampusChange = (selectedOption) => {
    const campusId = selectedOption ? selectedOption.value : '';
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
      const uniqueStates = Array.from(new Map(allStates.map((state) => [state.isoCode, state])).values());
      setStates(uniqueStates);
    } catch (err) {
      console.error('Error fetching states:', err);
      setStates([]);
    }
  };

  const handleStateChange = (selectedOptions) => {
    setSelectedState(selectedOptions || []);
    const stateLabels = selectedOptions ? selectedOptions.map((s) => s.label) : [];

    fetchAllInstituteByCountry(selectedCountry?.map((c) => c.label) || [], stateLabels);
    // setLoadedRecords(12);
    setCurrentPage(1);
  };
  const fetchAllInstitute = async () => {
    const response = await dispatch(universityCountryDropdown());
    const responseData = response?.data?.data;
    setInstituteData(responseData || []);
  };

  const fetchAllInstituteByCountry = async (country, state) => {
    const response = await dispatch(getAllInstitute(1, 5000, '', country, state));
    const responseData = response?.data?.data?.data;
    setInstituteDataByCountry(responseData);
  };

  const fetchAllCampusByInstitute = async (instituteNames) => {
    try {
      let allCampuses = [];
      for (const instituteName of instituteNames) {
        const response = await dispatch(instituteWiseCampusDropdown(instituteName, ''));
        const responseData = response?.data?.data || [];
        allCampuses = [...allCampuses, ...responseData];
      }
      // Remove duplicates based on campus ID
      const uniqueCampuses = Array.from(new Map(allCampuses.map((campus) => [campus._id, campus])).values());
      setCampusDataByInstitute(uniqueCampuses);
    } catch (error) {
      console.error('Error fetching campuses:', error);
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
    const response = await dispatch(getAllTag(''));
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
      console.error('Error fetching student statuses:', error);
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
      campus: campus || '',
      backlog: backlog || '',
      score: score || '',
      scoreOutOf: scoreOutOf || '',
      minTuitionFee: minTuitionFee !== undefined ? minTuitionFee : '',
      maxTuitionFee: maxTuitionFee !== undefined ? maxTuitionFee : '',
    };

    const hasValidFilters = Object.values(filters).some((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === 'string') {
        return value.trim() !== '';
      }
      if (typeof value === 'number') {
        return true;
      }
      return value;
    });

    if (!hasValidFilters) {
      toast.error('Please apply at least one filter');
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
      programName: '',
      concentration: '',
      studyArea: '',
      career: '',
      disciplineArea: '',
      score: '',
      scoreOutOf: '',
      websiteUrl: '',
      country: '',
      studyLevel: [],
      duration: '',
      intakes: [],
      intakeYear: [],
      tags: [],
      applicationStartDate: [],
      applicationEndDate: [],
      entryRequirements: '',
      applicationFee: '',
      currencyCode: '',
      yearlyTuitionFee: '',
      scholarshipAvailable: '',
      scholarshipDetails: '',
      remarks: '',
      eslElpAvailable: 'No',
      eslElpDetails: '',
      applicationMode: '',
      englishProficiencyExamWaiver: '',
      status: '',
      requirements: [],
      criteria: '',
    },
    validationSchema: Yup.object({
      university: Yup.array().min(1, 'University is required'),
      programName: Yup.string().required('Program Name is required'),
      concentration: Yup.string(),
      studyArea: Yup.string(),
      career: Yup.string(),
      disciplineArea: Yup.string(),
      score: Yup.string(),
      scoreOutOf: Yup.string(),
      websiteUrl: Yup.string(),
      studyLevel: Yup.array(),
      duration: Yup.string(),
      intakes: Yup.array().min(1, 'At least one intake is required'),
      intakeYear: Yup.array(),
      tags: Yup.array(),
      applicationStartDate: Yup.array().of(Yup.string()),
      applicationEndDate: Yup.array().of(Yup.string()),
      entryRequirements: Yup.string(),
      applicationFee: Yup.string(),
      currencyCode: Yup.string().required('Currency Code is required'),
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
        const formattedRequirements = selectedRequirements.map((req) => req._id);

        const formattedIntakes = intakeList.map((intake) => ({
          month: intake,
          status: checkboxStatus[intake] ? 'Active' : 'Inactive',
        }));

        // Convert comma-separated disciplineArea to array
        const formattedDisciplineArea = values.disciplineArea
          ? values.disciplineArea
              .split(',')
              .map((item) => item.trim())
              .filter((item) => item.length > 0)
          : [];

        const submitData = {
          ...values,
          status: values.status || 'Active',
          requirements: formattedRequirements,
          intakes: formattedIntakes.filter((item) => selectedIntake.includes(item.month)),
          tags: selectedTags.map((tag) => tag._id),
          disciplineArea: formattedDisciplineArea,
          career: values.career,
        };

        if (values.id) {
          const res = await dispatch(updateCourseFinder(submitData, values.id));
          if (res?.data?.code === 200) {
            toast.success('Course updated successfully');
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
              value: textboxValues[r._id] || '',
            }));

          values.intakes = selectedIntake;
          values.intakeYear = selectedIntakeYear;
          values.tags = selectedTags.map((tag) => tag._id);

          const res = await dispatch(createCourseFinder(submitData));
          if (res?.data?.code === 201) {
            toast.success('Course added successfully');
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
      const preSelected = durationData.filter((option) => formik.values.duration.includes(option.value));
      setSelectedDuration(preSelected);
    }
  }, [durationData, formik.values.duration]);

  const handleEdit = (item) => {
    const universities = item.university ? [item.university._id] : [];

    setSelectedUniversities(item.university ? [{ _id: item.university._id, name: item.university.instituteName }] : []);

    const intakes = item.intakes || [];
    const selected = intakes.map((i) => i.month);
    const checkboxStates = {};
    intakes.forEach((i) => {
      checkboxStates[i.month] = i.status === 'Active';
    });

    setSelectedIntake(selected);
    setCheckboxStatus(checkboxStates);
    setSelectedIntakeYear(item.intakeYear || []);
    setShowInput(item.eslElpAvailable === 'Yes');

    const reqList = item.requirements || [];
    const textBoxObj = {};
    reqList.forEach((req) => {
      if (req?.name?._id) {
        textBoxObj[req.name._id] = req.value || '';
      } else if (req?.name) {
        textBoxObj[req.name] = req.value || '';
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
      programName: item.programName || '',
      concentration: item.concentration || '',
      studyArea: item.studyArea || '',
      career: item.career || '',
      disciplineArea: Array.isArray(item.disciplineArea) ? item.disciplineArea.join(', ') : item.disciplineArea || '',
      score: item.score || '',
      scoreOutOf: item.scoreOutOf || '',
      websiteUrl: item.websiteUrl || '',
      country: item.university?.country || '',
      studyLevel: item.studyLevel || [],
      duration: item.duration || '',
      intakes: intakes || [],
      intakeYear: item.intakeYear || [],
      tags: formattedTags.map((t) => t._id) || [],
      applicationStartDate: item.applicationStartDate || '',
      applicationEndDate: item.applicationEndDate || '',
      entryRequirements: item.entryRequirements || '',
      applicationFee: item.applicationFee || '',
      currencyCode: item.currencyCode || '',
      yearlyTuitionFee: item.yearlyTuitionFee || '',
      scholarshipAvailable: item.scholarshipAvailable || '',
      scholarshipDetails: item.scholarshipDetails || '',
      remarks: item.remarks || '',
      eslElpAvailable: item.eslElpAvailable || 'No',
      eslElpDetails: item.eslElpDetails || '',
      applicationMode: item.applicationMode || '',
      englishProficiencyExamWaiver: item.englishProficiencyExamWaiver || '',
      status: item.status || '',
      requirements: formattedRequirements || [],
      criteria: item.criteria || '',
    });

    openModal();
  };
  const resetFilters = () => {
    setStudyAreaInput('');
    setSelectedMonths([]);
    setSelectedYear([]);
    setSelectedCountry(null);
    setSelectedState([]);
    setSelectedStudyArea([]);
    setSelectedDisciplineArea([]);
    setSelectedDuration([]);
    setEslElpAvailable('');
    setSelectedInstitute([]);
    setCampus([]);
    setBacklog('');
    setScore('');
    setScoreOutOf('');
    setSearchText('');
    setSelectedProgramLevel([]);
    setFilterRequirements([]);
    setAppliedFilters({});
    setMinPrice(0);
    setMaxPrice(100000);

    fetchAllCourseFinder(1, itemsPerPage, {});
    
  };

  const handleDelete = async (item) => {
    try {
      toast.dismiss();
      const res = await dispatch(deleteCourseFinder(item._id));
      if (res?.data?.code === 200) {
        toast.success('Course deleted successfully');
        // setLoadedRecords(12);
        setCurrentPage(1);
        fetchAllCourseFinder(1, itemsPerPage, appliedFilters);
        setFilterRequirements([]);
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleCheckboxChangeId = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length < 20) {
        setSelectedIds([...selectedIds, id]);
      } else {
        toast.error('You can only select up to 20 items.');
      }
    }
  };

  const courseDownload = async () => {
    if (selectedIds.length === 0) {
      toast.error('Please select at least one course to download');
      return;
    }
    try {
      const ids = selectedIds.join(',');
      const res = await dispatch(courseDownloadExcel(ids));
      if (res?.data?.code === 200) {
        const filePath = res.data.data.replace('/api', '');
        const downloadUrl = `${REACT_APP_API_URL}${filePath}`;

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', 'course_list.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Course download successfully');
        setSelectedIds([]);
      }
    } catch (error) {
      console.error('Error downloading course:', error);
    }
  };
  const handleAllDownload = async () => {
    if (courseFinderData.length === 0) {
      toast.error('No courses available to download');
      return;
    }

    try {
      const ids = courseFinderData.map((item) => item._id).join(',');
      const res = await dispatch(courseDownloadExcel(ids));
      if (res?.data?.code === 200) {
        const filePath = res.data.data.replace('/api', '');
        const downloadUrl = `${REACT_APP_API_URL}${filePath}`;

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', 'course_list.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Course download successfully');
      }
    } catch (error) {
      console.error('Error downloading all courses:', error);
    }
  };

  const [fileKey, setFileKey] = useState(Date.now());
  const handleFileChnage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('excelFile', file);

    const toastId = toast.loading('Uploading file...');
    try {
      const res = await dispatch(bulkUpload(formData));

      if (res?.data?.code === 201) {
        toast.update(toastId, {
          render: 'File uploaded successfully',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
        // setLoadedRecords(12);
        setCurrentPage(1);
        fetchAllCourseFinder(1, itemsPerPage, appliedFilters);
      } else {
        toast.update(toastId, {
          render: res?.data?.message || 'Upload failed.',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      }
      fetchCountries();
      fetchAllDuration();
      e.target.value = null;
    } catch (error) {
      console.error('Error uploading file:', error?.response?.data?.message);
      toast.update(toastId, {
        render: error?.response?.data?.message || 'Error uploading file',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setFileKey(Date.now());
    }
  };

  // Flatten and split all discipline areas into individual, unique options
  const disciplineAreaOptions = Array.from(
    new Set(
      (disciplineAreasOption || [])
        .flatMap((option) => (Array.isArray(option) ? option : typeof option === 'string' ? option.split(',') : []))
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ).map((option) => ({
    value: option,
    label: option,
  }));

  const getINRValue = (amount, currencyCode) => {
    if (!currencyRate || !currencyRate.length) return 'Conversion rate not found!';
    const rateObj = currencyRate.find((rate) => rate.currencyCode === currencyCode);
    if (!rateObj || !rateObj.INRvalue) return 'Conversion rate not found!';

    // Handle null, undefined, or invalid amount
    if (amount == null || amount === '') return 'Invalid amount';

    // Convert amount to string and remove commas
    const amountStr = String(amount).replace(/,/g, '');

    // Convert to number and validate
    const amountNum = parseFloat(amountStr);
    if (isNaN(amountNum)) return 'Invalid amount';

    // Calculate INR value
    const inrValue = amountNum * parseFloat(rateObj.INRvalue);

    // Check if inrValue is valid
    if (isNaN(inrValue)) return 'Invalid conversion';

    return `${storedEncryptedCurrency ? storedEncryptedCurrency : 'INR'} Value: ${
      storedEncryptedCurrency ? getSymbolFromCurrency(storedEncryptedCurrency) : '₹'
    }${inrValue.toLocaleString('en-IN')}`;
  };

  const customStyle = {
    control: (base) => ({
      ...base,
      height: '45px',
      minHeight: '45px',
      padding: '0 0 0 5px',
      // borderColor: '#b5bcc4',
      fontSize: '15px',
    }),
    placeholder: (base) => ({
      ...base,
      color: '#000000',
    }),
  };

  const customStyle2 = { height: 45, minHeight: 45, padding: '0 10px', borderRadius: '5px' };

  return (
    <Fragment>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <Pageheader mainheading="Course" parentfolder="Home" activepage="Course" />
        </div>
        <div style={{ minWidth: '100px' }}>
          {canCreate && (
            <Button
              variant="primary"
              className="custom-select-height2 d-flex align-items-center gap-1 w-100"
              style={{ height: '45px' }}
              onClick={openModal}
            >
              <FaPlus fontSize={12} style={{ marginBottom: '2px' }} />
              <span>Add Course</span>
            </Button>
          )}
        </div>
      </div>

      {/* {canRead && ( */}
      <div
        className="small-device-adjust p-3 mb-4 bg-light rounded"
        style={{ border: '1px solid #053880', overflow: 'visible' }}
      >
        {/* Combined input and buttons in a single flex row */}
        <Row className="align-items-end g-2 px-2 mb-2">
          {/* <Col> */}
          <div className="filter-section gap-2">
            <Form.Group controlId="studyArea" style={{ flex: 1, position: 'relative' }}>
              <Form.Control
                type="text"
                placeholder="What would you like to study?"
                name="studyArea"
                className="custom-select-height2 w-100 search-input-light text-capitalize"
                autoComplete="off"
                style={{
                  height: '45px',
                  borderColor: '#b5bcc4',
                  padding: '10px',
                  minWidth: '230px',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#007BFF';
                  handleInputFocus();
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#b5bcc4';
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
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: '#fff',
                    border: '0.5px solid #b5bcc4',
                    borderRadius: '10px',
                    maxHeight: '150px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    marginTop: '5px',
                  }}
                >
                  {suggestions.map((word, index) => (
                    <div
                      key={`${word}-${index}`}
                      className="suggestion-item"
                      style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        backgroundColor: '#fff',
                        // borderBottom: "1px solid #f0f0f0",
                      }}
                      onMouseDown={() => handleSuggestionClick(word)}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = '#DEEBFF')}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = '#fff')}
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
                className="custom-select-height2 d-flex justify-content-center align-items-center gap-2 px-5"
                style={{ fontSize: '16px' }}
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
                className="custom-select-height2 border-primary text-primary text-decoration-none d-flex justify-content-center align-items-center gap-2 px-5"
                style={{ fontSize: '16px' }}
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
            <Form.Label className="course_finder_filter mb-1" style={{ fontWeight: 500 }}>
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
              styles={customStyle}
              
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
              
              onChange={handleStateChange}
              isMulti
              value={selectedState}
              classNamePrefix="custom-select"
              placeholder="Select State"
              isClearable
              menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
              menuPosition="fixed"
              styles={customStyle}
            />
          </Col>
          <Col xs={12} sm={3} md={3}>
            <Form.Label className="course_finder_filter mb-1" style={{ fontWeight: 500 }}>
              Institute
            </Form.Label>
            <Select
              id="institute-select"
              options={Array.from(
                new Map(
                  instituteDataByCountry
                    ?.sort((a, b) => a.instituteName.localeCompare(b.instituteName))
                    ?.map((institute) => [institute.instituteName, institute]), // use name as key
                ).values(),
              ).map((institute) => ({
                value: institute._id,
                label: institute.instituteName,
              }))}
              onChange={(selectedOptions) => {
                setSelectedInstitute(selectedOptions || []);
                setCampus([]); // Clear campus selection when institute changes
                if (selectedOptions && selectedOptions.length > 0) {
                  // Fetch campuses for all selected institutes
                  const instituteNames = selectedOptions.map((option) => option.label);
                  fetchAllCampusByInstitute(instituteNames, '');
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
              styles={customStyle}
            />
          </Col>
          <Col xs={12} sm={3} md={3}>
            <Form.Label className="course_finder_filter mb-1" style={{ fontWeight: 500 }}>
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
                const campusIds = selectedOptions ? selectedOptions.map((option) => option.value) : [];
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
              styles={customStyle}
            />
          </Col>
        </Row>

        {showButton && (
          <div className="d-flex justify-content-center mt-3">
            <Button
              variant="primary"
              className="rounded-1"
              style={{
                width: '200px',
                height: '45px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
              }}
              onClick={() => {
                setShowFilterModal(true);
                setShowButton(false);
              }}
            >
              Advance Search
              <FaChevronDown size={20} style={{ marginLeft: '12px' }} />
            </Button>
          </div>
        )}
        
        <div className={`transition-container ${showFilterModal ? 'show' : ''} ${isDropdownOpen ? 'drop' : ''}`}>
          {/* Row 1 */}
          <hr style={{ margin: '16px 0', borderTop: '1px solid #053880' }} />
          <Row className="g-3 px-2 mt-1 w-100 rounded" style={{ transition: 'min-height 0.7s' }}>
            <Col md={3}>
              <Form.Label className="course_finder_filter">Program Level</Form.Label>
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
                  setSelectedProgramLevel(selectedOptions ? selectedOptions.map((opt) => opt.value) : []);
                }}
                classNamePrefix="custom-select"
                placeholder="Select Program Level"
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                menuPosition="fixed"
                styles={customStyle}
              />
            </Col>
            <Col md={3}>
              <Form.Label className="course_finder_filter">Study Area</Form.Label>
              <Select
                id="study-area-select"
                options={studyAreaOption?.map((option) => ({
                  value: option,
                  label: option,
                }))}
                isMulti
                onChange={(selectedOptions) => {
                  const values = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
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
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                menuPosition="fixed"
                styles={customStyle}
              />
            </Col>
            <Col md={3}>
              <Form.Label className="course_finder_filter">Discipline Area</Form.Label>
              <Select
                id="descilline-area-select"
                options={disciplineAreaOptions}
                isMulti
                onChange={(selectedOptions) => {
                  setSelectedDisciplineArea(selectedOptions ? selectedOptions.map((opt) => opt.value) : []);
                  // setLoadedRecords(12);
                  setCurrentPage(1);
                }}
                value={disciplineAreaOptions.filter((opt) => selectedDisciplineArea.includes(opt.value))}
                classNamePrefix="custom-select"
                placeholder="Select Discipline Area"
                isClearable
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                menuPosition="fixed"
                styles={customStyle}
              />
            </Col>
            <Col md={3}>
              <Form.Label className="course_finder_filter">Requirements</Form.Label>
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
                  setFilterRequirements(selectedOptions ? selectedOptions.map((opt) => opt.value) : []);
                  // setLoadedRecords(12);
                  setCurrentPage(1);
                }}
                classNamePrefix="custom-select"
                placeholder="Select Requirements"
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                menuPosition="fixed"
                styles={customStyle}
              />
            </Col>
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
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                menuPosition="fixed"
                styles={customStyle}
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
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                menuPosition="fixed"
                styles={customStyle}
              />
            </Col>
            <Col md={3}>
              <Form.Label className="course_finder_filter">Duration</Form.Label>
              <Select
                id="duration-select"
                options={durationData}
                isMulti
                onChange={handleDurationChange}
                value={selectedDuration}
                classNamePrefix="custom-select"
                placeholder="Select Duration"
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                menuPosition="fixed"
                styles={customStyle}
              />
            </Col>
            <Col md={3}>
              <Form.Label className="course_finder_filter">Backlog</Form.Label>
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
                className="w-100 search-input-light"
                style={customStyle2}
              />
            </Col>
            <Col md={6}>
              <Form.Label className="course_finder_filter">Score Out Of</Form.Label>
              <Select
                id="duration-select"
                options={scoreOutOfOptions}
                onChange={(selected) => {
                  setScoreOutOf(selected?.value);
                }}
                value={scoreOutOfOptions.filter((score) => score.value === scoreOutOf)}
                classNamePrefix="custom-select"
                placeholder="Select Duration"
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                menuPosition="fixed"
                styles={customStyle}
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
                className="w-100 search-input-light"
                style={customStyle2}
              />
            </Col>
          </Row>
          {/* Row 3 */}
          <Row className="g-2 px-2 mt-1 w-100 rounded" style={{ transition: 'min-height 0.2s' }}></Row>
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
              <FaChevronUp size={24} className={`${isDropdownOpen ? 'chevron' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
      {/* )} */}
      <CourseFinderForm
        showModal={showModal}
        closeModal={closeModal}
        formik={formik}
        isLoading={isLoading}
        instituteData={instituteData}
        selectedUniversities={selectedUniversities}
        setSelectedUniversities={setSelectedUniversities}
        studyLevelData={studyLevelData}
        setSelectedStudyLevel={setSelectedStudyLevel}
        selectedStudyLevel={selectedStudyLevel}
        requirementsData={requirementsData}
        selectedRequirements={selectedRequirements}
        setSelectedRequirements={setSelectedRequirements}
        tagsData={tagsData}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        intakeYearList={intakeYearList}
        selectedIntakeYear={selectedIntakeYear}
        setSelectedIntakeYear={setSelectedIntakeYear}
        selectedIntake={selectedIntake}
        setSelectedIntake={setSelectedIntake}
        intakeList={intakeList}
        checkboxStatus={checkboxStatus}
        setCheckboxStatus={setCheckboxStatus}
        currencyCodeData={currencyCodeData}
        handleEslElpChange={handleEslElpChange}
        showInput={showInput}
        scoreOutOfOptions={scoreOutOfOptions}
      />

      <div className="d-flex flex-wrap justify-content-end gap-2">
        {' '}
        {canUpload && (
          <a
            href={`https://studyvisaconsultant.com/api/public/sampleCourseBulkUpload/sampleCourseBulkUpload.xlsx`}
            download
            className="custom-select-height btn btn-outline-primary btn-icon-text d-inline-flex align-items-center mb-2"
            style={{
              pointerEvents: 'auto',
              position: 'relative',
              whiteSpace: 'nowrap',
              textDecoration: 'none',
            }}
          >
            <i className="fe fe-download me-2 fs-14"></i> Get Sample File
          </a>
        )}
        {canUpload && (
          <>
            <label
              htmlFor="fileUpload"
              className="custom-select-height btn btn-primary btn-icon-text d-inline-flex align-items-center mb-2"
              style={{
                pointerEvents: 'auto',
                position: 'relative',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <i className="fe fe-upload-cloud me-2 fs-14"></i> Bulk Data Upload
            </label>

            <input
              key={fileKey}
              type="file"
              id="fileUpload"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChnage}
              style={{ display: 'none' }}
            />
          </>
        )}
        {userRole !== 'Student' && userRole !== 'LeadStudent' && canDownload && (
          <button
            type="button"
            className="custom-select-height btn btn-primary btn-icon-text d-inline-flex align-items-center mb-2"
            style={{
              pointerEvents: 'auto',
              position: 'relative',
              whiteSpace: 'nowrap',
            }}
            onClick={courseDownload}
          >
            <i className="fe fe-download-cloud me-2 fs-14"></i> Download Report
          </button>
        )}
        {userRole === 'Super Admin' && (
          <button
            type="button"
            className="custom-select-height btn btn-primary btn-icon-text d-inline-flex align-items-center mb-2"
            style={{
              pointerEvents: 'auto',
              position: 'relative',
              whiteSpace: 'nowrap',
            }}
            onClick={handleAllDownload}
          >
            <i className="fe fe-download-cloud me-2 fs-14"></i> All Download
          </button>
        )}
      </div>

      <CourseFinderCard
        showSlider={showSlider}
        totalRecords={totalRecords}
        hasSearched={hasSearched}
        courseFinderData={courseFinderData}
        isLoading={isLoading}
        showDeleteModal={showDeleteModal}
        loadedRecords={loadedRecords}
        handleLoadMore={handleLoadMore}
        selectedIds={selectedIds}
        getINRValue={getINRValue}
        handleCheckboxChangeId={handleCheckboxChangeId}
        handleEdit={handleEdit}
        setSelectedItem={setSelectedItem}
        setShowDeleteModal={setShowDeleteModal}
        handleDelete={handleDelete}
        selectedItem={selectedItem}
        handleView={handleView}
        relexFilterMsg={relexFilterMsg}
        minPrice={minPrice}
        maxPrice={maxPrice}
        handleChange={handleChange}
        valuetext={valuetext}
        handleMinChange={handleMinChange}
        handleMaxChange={handleMaxChange}
        userRole={userRole}
        handleApplyClick={handleApplyClick}
      />
      {tooltip.show && (
        <div
          style={{
            position: 'fixed',
            top: tooltip.y - 40,
            left: tooltip.x - 175,
            background: '#fff',
            color: '#333',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '4px 12px',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            zIndex: 9999,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            pointerEvents: 'none',
          }}
        >
          {tooltip.text}
        </div>
      )}
    </Fragment>
  );
};

export default CourseFinder;
