import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import Pageheader from "../../layouts/Pageheader";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect, useState } from "react";
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
  createBranch,
  deleteBranch,
  getAllBranch,
  updateBranch,
} from "../../redux/actions/Branch.action";
import Paginations from "../elements/Paginations";
import DataTable from "../commonComponents/DataTable";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "react-phone-input-2/lib/bootstrap.css";
import PhoneInput from "react-phone-input-2";
import usePermissions from "../commonComponents/usePermissions";
import ViewModal from "../commonComponents/ViewModal";
import { countryCodeISO } from "../../utils/countryISOCode";

const Branches = () => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const [branchesList, setBranchesList] = useState([]);
  const [countries, setCountries] = useState([]);
  const [stateDropDown, setStateDropDown] = useState([]);
  const [cityDropDownList, setCityDropDownList] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Add Branches");
  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    formik.resetForm();
  };

  const fetchCountries = async () => {
    const res = await dispatch(countryDropdown());
    setCountries(res?.data?.data || []);
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
  }, []);

  const fetchAllBranches = async (
    page = 1,
    limit = itemsPerPage,
    search = ""
  ) => {
    try {
      const res = await dispatch(getAllBranch(page, limit, search));
      const responseData = res?.data?.data;
      if (responseData?.data?.length === 0) {
        setBranchesList([]);
        setTotalPages(0);
      } else {
        setBranchesList(responseData?.data || []);
        setTotalPages(responseData?.totalPages || 0);
        setTotalRecords(responseData?.totalRecords || 0);
      }
    } catch (error) {
      console.error("Error fetching institute:", error);
      setBranchesList([]);
      setTotalPages(0);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      fetchAllBranches(1, newItemsPerPage, search);
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchAllBranches(currentPage, itemsPerPage, search);
    }
  }, [currentPage, search]);

  const formik = useFormik({
    initialValues: {
      name: "",
      contactPerson: "",
      designation: "",
      phone: "",
      email: "",
      password: "",
      country: "",
      state: "",
      city: "",
      address: "",
      status: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      contentPerson: Yup.string(),
      designation: Yup.string(),
      phone: Yup.string().required("Phone is required"),
      email: Yup.string().required("Email is required"),
      country: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      address: Yup.string(),
      status: Yup.string().required("Status is required"),
      password: Yup.string(),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        toast.dismiss();
        const selectedCountry = countries.find(
          (c) => c.isoCode === values.country
        );
        const selectedState = stateDropDown.find(
          (s) => s.isoCode === values.state
        );

        const payload = {
          ...values,
          country: selectedCountry?.name || values.country,
          state: selectedState?.name || values.state,
          city: values.city,
        };

        if (values.password && values.password.trim()) {
          payload.password = values.password;
        }
        if (values.id && canUpdate) {
          const res = await dispatch(updateBranch(payload, values.id));
          if (res?.status === 200) {
            toast.success("Branch updated successfully");
            handleClose();
          }
        } else if (canCreate) {
          const res = await dispatch(createBranch(payload));
          if (res?.data?.code === 201) {
            toast.success("Branch added successfully");
            handleClose();
          }
        }

        handleClose();
        resetForm();
        if (canRead) {
          fetchAllBranches(currentPage, itemsPerPage, search);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
      }
    },
  });
  const handleDelete = async (item) => {
    if (canDelete) {
      try {
        toast.dismiss();
        const res = await dispatch(deleteBranch(item?._id));
        if (res?.status === 200) {
          toast.success("Branch deleted successfully");
        }
        const updatedPage =
          branchesList?.length === 1 && currentPage > 1
            ? currentPage - 1
            : currentPage;
        setCurrentPage(updatedPage);
        setShowDeleteModal(false);
        if (canRead) {
          fetchAllBranches(currentPage, itemsPerPage, search);
        }
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  const branchFields = [
    { label: "NAME", key: "name" },
    { label: "CONTECT PERSON", key: "contactPerson" },
    { label: "Designation", key: "designation" },
    { label: "PHONE", key: "phone" },
    { label: "EMAIL", key: "email" },
    { label: "COUNTRY", key: "country" },
    { label: "STATE", key: "state" },
    { label: "CITY", key: "city" },
    { label: "STATUS", key: "status" },
    { label: "ADDRESS", key: "address" },
  ];

  const branchSections = [
    {
      title: "",
      fields: branchFields,
    },
  ];
  const handleViewModal = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
  };

  const columns = [
    {
      label: "Name",
      key: "name",
    },
    {
      label: "Contact person",
      key: "contactPerson",
    },
    {
      label: "Designation",
      key: "designation",
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
      label: "Address",
      key: "address",
    },
    {
      label: "Status",
      key: "status",
    },
    {
      label: "CREATED BY",
      render: (item) => (item.createdByName ? item?.createdByName : "-"),
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
      </Menu>
    </div>
  );

  const handleEdit = async (item) => {
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
        password: "",
        created_by: item.created_by?._id || null,
      });

      setShow(true);
    } catch (error) {
      console.log("Edit error:", error);
    }
  };

  return (
    <>
      <Pageheader
        mainheading="Branch"
        parentfolder="Branches"
        activepage="Branch"
      />

      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div>
                <div className="card-title">Branch</div>
              </div>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3 d-flex justify-content-between">
                <Col md={2} className="d-flex align-items-end">
                  {canCreate && (
                    <Button
                      variant="primary"
                      className="custom-select-height"
                      onClick={handleShow}
                    >
                      Add Branch
                    </Button>
                  )}
                </Col>
                {canRead && (
                  <Col className="d-flex align-items-end justify-content-end gap-2">
                    <div className="ms-auto">
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
                    <ItemsPerPageSelect
                      itemsPerPage={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                    />
                    <div className="custom-select-height total-records px-3 mt-2 mt-md-0 d-flex align-items-center h-6">
                      <span>
                        Total Records :<strong>&nbsp;{totalRecords}</strong>
                      </span>
                    </div>
                  </Col>
                )}
              </Row>

              <Modal show={show} onHide={handleClose} size="xl" centered>
                <Modal.Header className="form-main-heading">
                  <Modal.Title>
                    {formik?.values?.id ? "Update Branch" : "Add Branch"}
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
                      <Col md={4} className="mb-3">
                        <Form.Label>Branch Name</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter Name"
                          name="name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik?.touched?.name && formik.errors.name && (
                          <div className="text-danger">
                            {formik.errors.name}
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
                        {formik.touched.contactPerson &&
                          formik.errors.contactPerson && (
                            <div className="text-danger">
                              {formik.errors.contactPerson}
                            </div>
                          )}
                      </Col>

                      <Col md={4} className="mb-3">
                        <Form.Label>Designation</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter Designation"
                          name="designation"
                          value={formik.values.designation}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.designation &&
                          formik.errors.designation && (
                            <div className="text-danger">
                              {formik.errors.designation}
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
                        {formik?.touched?.status && formik.errors.status && (
                          <div className="text-danger">
                            {formik.errors.status}
                          </div>
                        )}
                      </Col>
                      <Col md={4} className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter Address"
                          name="address"
                          value={formik.values.address}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik?.touched?.address && formik.errors.address && (
                          <div className="text-danger">
                            {formik.errors.address}
                          </div>
                        )}
                      </Col>
                      <Col md={4} className="mb-3">
                        <Form.Label>Select Country</Form.Label>
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
                              (c) => c.isoCode === selectedOption?.value
                            );
                            if (isValid) {
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
                          onMenuOpen={() => setIsDropdownOpen(true)}
                          onMenuClose={() => setIsDropdownOpen(false)}
                          placeholder="Select Country"
                          isClearable
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
                      <Col md={4} className="mb-3">
                        <Form.Label>Select State</Form.Label>
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
                                  (s) => s.value === formik.values.state
                                )
                              : []
                          }
                          onChange={(option) => {
                            const selectedOption = Array.isArray(option)
                              ? option[0]
                              : option;

                            const isValid = stateDropDown?.some(
                              (s) => s.isoCode === selectedOption?.value
                            );

                            if (isValid) {
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
                          onMenuOpen={() => setIsDropdownOpen(true)}
                          onMenuClose={() => setIsDropdownOpen(false)}
                          placeholder="Select State"
                          isClearable
                          isDisabled={!formik.values.country}
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
                        {formik?.touched?.state && formik.errors.state && (
                          <div className="text-danger">
                            {formik.errors.state}
                          </div>
                        )}
                      </Col>
                      <Col md={4} className="mb-3">
                        <Form.Label>Select City</Form.Label>
                        <Select
                          className="custom-select-height"
                          options={cityDropDownList?.map((city) => ({
                            value: typeof city === "string" ? city : city.name,
                            label: typeof city === "string" ? city : city.name,
                          }))}
                          value={
                            formik.values.city
                              ? cityDropDownList
                                ?.map((city) => {
                                  const name =
                                    typeof city === "string"
                                      ? city
                                      : city.name;
                                  return { value: name, label: name };
                                })
                                .filter((c) => c.value === formik.values.city)
                              : []
                          }
                          onChange={(selectedOption) => {
                            const selected = Array.isArray(selectedOption)
                              ? selectedOption[0]
                              : selectedOption;

                            const cityName = selected?.value || "";

                            const isValid = cityDropDownList?.some((c) => {
                              const name = typeof c === "string" ? c : c.name;
                              return name === cityName;
                            });

                            if (isValid) {
                              formik.setFieldValue("city", cityName);
                              formik.setFieldError("city", "");
                            } else {
                              formik.setFieldValue("city", "");
                            }
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
                        {formik?.touched?.city && formik.errors.city && (
                          <div className="text-danger">
                            {formik.errors.city}
                          </div>
                        )}
                      </Col>
                    </Row>

                    {/* Submit Button */}
                    <div className="text-end mt-3">
                      <Button
                        variant="primary"
                        className="custom-select-height"
                        type="submit"
                      >
                        {formik?.values?.id ? "Update Branch" : "Add Branch"}
                      </Button>
                    </div>
                  </Form>
                </Modal.Body>
              </Modal>

              <ViewModal
                show={showViewModal}
                onHide={closeViewModal}
                title="Branch Details"
                data={selectedItem}
                fields={branchSections}
              />

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

              <DataTable
                columns={columns}
                data={branchesList}
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

              {totalPages > 1 && branchesList.length > 0 && (
                <div className="mt-4 d-flex justify-content-end align-items-end">
                  <Paginations
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  /></div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Branches;
