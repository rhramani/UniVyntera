import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import Pageheader from "../../layouts/Pageheader";
import Paginations from "../elements/Paginations";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import DataTable from "../commonComponents/DataTable";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createB2BMember,
  deleteB2BMember,
  getAllB2BMembers,
  getB2BMemberByB2BAdmin,
  updateB2BMember,
} from "../../redux/actions/B2BMember.action";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import { getAllB2BAdmin } from "../../redux/actions/B2BAdmin.action";
import { getAllRole } from "../../redux/actions/Master/Role.action";
import "react-phone-input-2/lib/bootstrap.css";
import PhoneInput from "react-phone-input-2";
import usePermissions from "../commonComponents/usePermissions";
import LoadMoreButton from "../commonComponents/LoadMoreButton";
import { decryptData } from "../../utils/encryptionUtils";
import { countryCodeISO } from "../../utils/countryISOCode";

const Member = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [memberList, setMemberList] = useState([]);
  const [b2bAdminList, setB2bAdminList] = useState([]);
  const [roleDropDown, setRoleDropDown] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("B2B Team Member");
  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    formik.resetForm();
  };
  const userRole = decryptData(localStorage.getItem("role"));
  const b2bAdminId = decryptData(localStorage.getItem("userId"));

  const fetchAllMember = async (
    page = 1,
    limit = itemsPerPage,
    search = ""
  ) => {
    try {
      const res = await dispatch(getAllB2BMembers(page, limit, search));
      const responseData = res?.data?.data;
      if (responseData?.data?.length === 0) {
        setMemberList([]);
        setTotalPages(0);
      } else {
        setMemberList(responseData?.data || []);
        setTotalPages(responseData?.totalPages || 0);
        setTotalRecords(responseData?.totalRecords || 0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setMemberList([]);
      setTotalPages(0);
    }
  };
  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];
  useEffect(() => {
    if (userRole === "b2bAdmin" || userRole === "B2B Admin") return;
    if (canRead) {
      fetchAllMember(currentPage, itemsPerPage, search);
    }
  }, [currentPage, search]);

  const fetchAllB2BAdmin = async () => {
    try {
      const res = await dispatch(getAllB2BAdmin(1, 100));
      const responseData = res?.data?.data;

      setB2bAdminList(responseData?.data || []);
    } catch (error) {
      console.log("Error fetching camouses:", error);
      setB2bAdminList([]);
    }
  };

  useEffect(() => {
    fetchAllB2BAdmin();
  }, []);

  const fetchAllB2BMemberByAdmin = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    b2bAdminId
  ) => {
    try {
      const res = await dispatch(
        getB2BMemberByB2BAdmin(page, limit, search, b2bAdminId)
      );
      const responseData = res?.data?.data;
      setMemberList(responseData?.data || []);
      setTotalPages(responseData?.totalPages || 0);
      setTotalRecords(responseData?.totalRecords || 0);
    } catch (error) {
      console.log("Error fetching camouses:", error);
      setMemberList([]);
    }
  };

  useEffect(() => {
    if ((userRole === "b2bAdmin" || userRole === "B2B Admin") && canRead) {
      fetchAllB2BMemberByAdmin(currentPage, itemsPerPage, search, b2bAdminId);
    }
  }, [currentPage, search, b2bAdminId]);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      // username: "",
      password: "",
      status: "",
      // role: "",
      b2bAdmin: b2bAdminId ? b2bAdminId : null,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      phone: Yup.string().required("Phone number is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      // username: Yup.string().required("Username is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .max(15, "Password must be at most 15 characters"),
      status: Yup.string().required("Status is required"),
      // role: Yup.string().required("Role is required"),
      // b2bAdmin: Yup.string().required("B2B Admin is required"),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        toast.dismiss();
        let payload = { ...values };
        if (values.id && !values.password) {
          delete payload.password;
        }
        if (values.id && canUpdate) {
          const res = await dispatch(updateB2BMember(payload, values.id));
          if (res?.status === 201) {
            toast.success("B2B Member updated successfully");
            handleClose();
          }
        } else if (canCreate) {
          const res = await dispatch(createB2BMember(payload));
          if (res?.status === 201) {
            toast.success("B2B Member added successfully");
            handleClose();
          }
        }
        handleClose();
        resetForm();
        if ((userRole === "b2bAdmin" || userRole === "B2B Admin") && canRead) {
          fetchAllB2BMemberByAdmin(
            currentPage,
            itemsPerPage,
            search,
            b2bAdminId
          );
        } else {
          if (canRead) {
            fetchAllMember(currentPage, itemsPerPage, search);
          }
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
        console.log("Error submitting form:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleEdit = (item) => {
    if (canUpdate) {
      formik.setValues({
        firstName: item?.firstName,
        lastName: item?.lastName,
        phone: item?.phone,
        email: item?.email,
        // username: item?.username,
        password: "",
        status: item?.status,
        // role: item?.role?._id,
        b2bAdmin: item?.b2bAdmin?._id || b2bAdminId || null,
        id: item?._id,
      });
      setShow(true);
    }
  };

  const handleDelete = async (item) => {
    if (canDelete) {
      try {
        toast.dismiss();
        const res = await dispatch(deleteB2BMember(item?._id));
        if (res?.status === 200) {
          toast.success("B2B Member deleted successfully");
        }
        const updatedPage =
          memberList.length === 1 && currentPage > 1
            ? currentPage - 1
            : currentPage;
        setCurrentPage(updatedPage);
        if ((userRole === "b2bAdmin" || userRole === "B2B Admin") && canRead) {
          fetchAllB2BMemberByAdmin(
            currentPage,
            itemsPerPage,
            search,
            b2bAdminId
          );
        } else {
          if (canRead) {
            fetchAllMember(currentPage, itemsPerPage, search);
          }
        }
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if ((userRole === "b2bAdmin" || userRole === "B2B Admin") && canRead) {
      fetchAllB2BMemberByAdmin(1, newItemsPerPage, search, b2bAdminId);
    } else {
      if (canRead) {
        fetchAllMember(1, newItemsPerPage, search);
      }
    }
  };

  const fetchRole = async () => {
    const res = await dispatch(getAllRole(1, 100, "", ""));
    setRoleDropDown(res?.data?.data?.data || []);
  };
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
  useEffect(() => {
    fetchRole();
  }, []);
  const columns = [
    {
      label: "First Name",
      key: "firstName",
    },
    {
      label: "Last Name",
      key: "lastName",
    },
    // {
    //   label: "Role",
    //   // key: "role",
    //   render: (item) => (item?.role ? item?.role?.name : "-"),
    // },
    {
      label: "Phone",
      key: "phone",
    },
    {
      label: "Email",
      key: "email",
    },
    {
      label: "B2B Admin",
      render: (item) => (item?.b2bAdmin ? item?.b2bAdmin?.companyName : "-"),
    },
    {
      label: "Status",
      key: "status",
    },
    {
      label: "CREATED DATE",
      render: (item) =>
        item.createdAt ? formatDate(parseDate(item?.createdAt)) : "-",
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

  return (
    <>
      <Pageheader
        mainheading="Member"
        parentfolder="Home"
        activepage="Member"
      />

      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div>
                <div className="card-title">B2B Team Member</div>
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
                      Add Member
                    </Button>
                  )}
                </Col>
                <Col className="d-flex align-items-end justify-content-end gap-2">
                  <div className="ms-auto">
                    <div className="contact-search3">
                      <button type="button" className="btn border-0">
                        <i
                          className="fe fe-search fw-semibold text-muted dark_theme"
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
              </Row>
              <Modal show={show} onHide={handleClose} size="xl" centered>
                <Modal.Header className="form-main-heading">
                  <Modal.Title>
                    {formik?.values?.id ? "Update Member" : "Add Member"}
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
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter First Name"
                          name="firstName"
                          value={formik.values.firstName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik?.touched?.firstName &&
                          formik.errors.firstName && (
                            <div className="text-danger">
                              {formik.errors.firstName}
                            </div>
                          )}
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter Last Name"
                          name="lastName"
                          value={formik.values.lastName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik?.touched?.lastName &&
                          formik.errors.lastName && (
                            <div className="text-danger">
                              {formik.errors.lastName}
                            </div>
                          )}
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <PhoneInput
                          country={countryCodeISO()}
                          value={formik.values.phone}
                          onChange={(phone, data) => {
                            // Format: +<dialCode> <rest of the number>
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
                            // border: "1px solid #ced4da",
                            // borderRadius: "30px",
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
                      {/* <Col md={6} className="mb-3">
                        <Form.Label>Role</Form.Label>
                        <Form.Select
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter Role"
                          name="role"
                          value={formik.values.role}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{ fontSize: "13px" }}
                        >
                          <option value="">Select Role</option>
                          {roleDropDown
                            ?.filter((role) => role.name !== "Super Admin")
                            ?.map((role) => (
                              <option key={role._id} value={role._id}>
                                {role.name}
                              </option>
                            ))}
                        </Form.Select>
                        {formik?.touched?.role && formik.errors.role && (
                          <div className="text-danger">
                            {formik.errors.role}
                          </div>
                        )}
                      </Col> */}
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
                        {formik?.touched?.status && formik.errors.status && (
                          <div className="text-danger">
                            {formik.errors.status}
                          </div>
                        )}
                      </Col>
                      {!(
                        userRole === "b2bAdmin" || userRole === "B2B Admin"
                      ) && (
                          <Col md={6} className="mb-3">
                            <Form.Label>B2B Admin</Form.Label>
                            <Select
                              name="b2bAdmin"
                              classNamePrefix="custom-select"
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
                              value={
                                formik.values.b2bAdmin
                                  ? b2bAdminList
                                    ?.map((admin) => ({
                                      value: admin._id,
                                      label: admin.companyName,
                                    }))
                                    .find(
                                      (option) =>
                                        option.value === formik.values.b2bAdmin
                                    ) || null
                                  : null
                              }
                              onChange={(option) =>
                                formik.setFieldValue(
                                  "b2bAdmin",
                                  option ? option.value : ""
                                )
                              }
                              onBlur={() =>
                                formik.setFieldTouched("b2bAdmin", true)
                              }
                              options={b2bAdminList
                                ?.filter((admin) => {
                                  if (userRole === "b2bAdmin") {
                                    return admin._id === b2bAdminId;
                                  }
                                  return admin.companyName?.trim();
                                })
                                ?.sort((a, b) =>
                                  a.companyName.localeCompare(b.companyName)
                                )
                                ?.map((admin) => ({
                                  value: admin._id,
                                  label: admin.companyName,
                                }))}
                              placeholder="Select B2B Admin"
                              isClearable
                            />
                            {formik.touched.b2bAdmin &&
                              formik.errors.b2bAdmin && (
                                <div className="text-danger">
                                  {formik.errors.b2bAdmin}
                                </div>
                              )}
                          </Col>
                        )}
                    </Row>
                    {/* Submit Button */}
                    <div className="text-end">
                      <Button
                        variant="primary"
                        className="custom-select-height"
                        type="submit"
                      >
                        {formik.values.id ? "Update Member" : "Add Member"}
                      </Button>
                    </div>
                  </Form>
                </Modal.Body>
              </Modal>

              <DataTable
                columns={columns}
                data={memberList}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={handleItemsPerPageChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
                renderActions={false}
                itemsPerPageOptions={true}
                canEdit={canUpdate}
                canDelete={canDelete}
                canRead={canRead}
              />

              {totalPages > 1 && memberList.length > 0 && (
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

export default Member;
