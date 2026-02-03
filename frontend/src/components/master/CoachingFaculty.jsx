import { useEffect, useState } from "react";
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
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import DataTable from "../commonComponents/DataTable";
import usePermissions from "../commonComponents/usePermissions";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import Paginations from "../elements/Paginations";
import { List, Space, TimePicker } from "antd";
import { AiOutlineClose } from "react-icons/ai";
import {
  createCoachingFaculty,
  updateCoachingFaculty,
  getAllCoachingFaculty,
  deleteCoachingFaculty,
} from "../../redux/actions/Master/CoachingFaculty.action";
import Select from "react-select";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import dayjs from "dayjs";
import { getAllRole } from "../../redux/actions/Master/Role.action";
import { decryptData } from "../../utils/encryptionUtils";
import { getAllBranch } from "../../redux/actions/Branch.action";

const CoachingFaculty = () => {
  const dispatch = useDispatch();
  const [coachingFaculties, setCoachingFaculties] = useState([]);
  const [search, setSearch] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [timeInputs, setTimeInputs] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("all");

  const branchOptions = [
    { value: "", label: "Head Office" },
    ...branchList
      .filter((branch) => branch && branch.name && branch.name.trim() !== "")
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((branch) => ({
        value: branch._id,
        label: branch.name,
      })),
  ];

  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Coaching Faculty");

  const branchID = decryptData(localStorage.getItem("userId"));
  const userRole = decryptData(localStorage.getItem("role"));
  const userType = decryptData(localStorage.getItem("userType"));

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

  useEffect(() => {
    if (canRead) {
      fetchCoachingFaculties(
        currentPage,
        itemsPerPage,
        search,
        true,
        userRole === "Branch" || userType === "Branch User"
          ? branchID
          : selectedBranch === "all"
          ? ""
          : selectedBranch
      );
    }
    fetchAllBranches();
  }, [canRead, currentPage, itemsPerPage, search, dispatch]);

  const fetchCoachingFaculties = async (
    page = 1,
    limit = itemsPerPage,
    searchTerm = "",
    showAll = false,
    branchId = userRole === "Branch" || userType === "Branch User"
      ? branchID
      : selectedBranch
  ) => {
    setIsLoading(true);
    try {
      const res = await dispatch(
        getAllCoachingFaculty(page, limit, searchTerm, "", showAll, branchId)
      );
      const responseData = res?.data?.data || {};
      setCoachingFaculties(responseData?.data || []);
      setTotalRecords(responseData?.totalRecords || 0);
      setTotalPages(responseData?.totalPages || 0);
    } catch (error) {
      console.error("Error fetching coaching faculties:", error);
      setCoachingFaculties([]);
      setTotalRecords(0);
      setTotalPages(0);
      toast.error("Failed to fetch coaching faculties.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      const isAllSelected = selectedBranch === "all";
      const branchToUse =
        userRole === "Branch" || userType === "Branch User"
          ? branchID
          : isAllSelected
          ? ""
          : selectedBranch || "";
      fetchCoachingFaculties(
        1,
        newItemsPerPage,
        search,
        isAllSelected,
        branchToUse
      );
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      branchId:
        userRole === "Branch" || userType === "Branch User" ? branchID : null,
      batchDetails: [],
      id: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .max(15, "Password must be at most 15 characters"),
      branchId: Yup.string().test(
        "branch-required",
        "Please select a branch or Head Office",
        function (value) {
          const { userRole } = this.options.context || {};
          if (userRole !== "Super Admin") return true;
          return value != undefined;
        }
      ),
      phone: Yup.string().required("Phone number is required"),
      batchDetails: Yup.array()
        .of(
          Yup.object({
            status: Yup.string().required("Status is required"),
            times: Yup.array()
              .of(Yup.string())
              .min(1, "At least one time is required for each status")
              .required("Times are required"),
          })
        )
        .min(1, "At least one batch status with times is required")
        .required("Batch details are required"),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        toast.dismiss();
        let res;
        const payload = {
          ...values,
          ...(values.branchId !== undefined && {
            branchId:
              values.branchId === "" || values.branchId === null
                ? null
                : values.branchId,
          }),
          ...(userRole === "Branch" ||
            (userType === "Branch User" && { branchId: branchID })),
        };

        if (values.id && !values.password) {
          delete payload.password;
        }
        if (values.id && canUpdate) {
          res = await dispatch(updateCoachingFaculty(payload, values.id));
          if (res?.data?.code === 200) {
            toast.success("Coaching Faculty updated successfully");
          }
        } else if (!values.id && canCreate) {
          res = await dispatch(createCoachingFaculty(payload));
          if (res?.data?.code === 201) {
            toast.success("Coaching Faculty added successfully");
          }
        } else {
          toast.error("You do not have permission to perform this action.");
          return;
        }
        resetForm();
        setShowModal(false);
        setSelectedStatus(null);
        setSelectedTime([]);
        if (canRead) {
          setCurrentPage(1);
          const isAllSelected = selectedBranch === "all";
          const branchToUse =
            userRole === "Branch" || userType === "Branch User"
              ? branchID
              : isAllSelected
              ? ""
              : selectedBranch || "";
          fetchCoachingFaculties(
            1,
            itemsPerPage,
            search,
            isAllSelected,
            branchToUse
          );
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error(
          error?.response?.data?.message || "Failed to save Coaching Faculty."
        );
      }
    },
  });

  const handleEdit = (item) => {
    if (canUpdate) {
      const batchDetails = item.batchDetails || [];

      const preSelectedStatuses = batchDetails.map((b) => ({
        value: b.status,
        label: b.status,
      }));

      formik.setValues({
        id: item._id,
        name: item.name,
        email: item.email,
        password: "",
        phone: item.phone,
        branchId: item?.branchId?._id || null,
        batchDetails: batchDetails,
      });

      setSelectedStatus(preSelectedStatuses);
      setTimeInputs({});
      setShowModal(true);
    } else {
      toast.error("You do not have permission to edit.");
    }
  };

  const handleDelete = async (item) => {
    if (canDelete) {
      try {
        toast.dismiss();
        const res = await dispatch(deleteCoachingFaculty(item._id));
        if (res?.data?.code === 200) {
          toast.success("Coaching Faculty deleted successfully");
          const updatedPage =
            coachingFaculties.length === 1 && currentPage > 1
              ? currentPage - 1
              : currentPage;

          setCurrentPage(updatedPage);

          const isAllSelected = selectedBranch === "all";
          const branchToUse =
            userRole === "Branch" || userType === "Branch User"
              ? branchID
              : isAllSelected
              ? ""
              : selectedBranch || "";

          fetchCoachingFaculties(
            updatedPage,
            itemsPerPage,
            search,
            isAllSelected,
            branchToUse
          );
        }
      } catch (error) {
        console.error("Error deleting coaching faculty:", error);
        toast.error("Failed to delete the coaching faculty.");
      }
    } else {
      toast.error("You do not have permission to delete.");
    }
  };

  const handleOpenModal = () => {
    if (canCreate) {
      formik.resetForm();
      setSelectedStatus(null);
      setSelectedTime([]);
      setShowModal(true);
    } else {
      toast.error("You do not have permission to create.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    formik.resetForm();
    setSelectedStatus(null);
    setSelectedTime([]);
  };

  const batchStatusOptions = [
    { value: "Online", label: "Online" },
    { value: "Offline", label: "Offline" },
  ];

  const columns = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    {
      label: "branch",
      key: "branch",
      render: (item) => item?.branchId?.name || "-",
    },
    {
      label: "Batch Details",
      key: "batchDetails",
      render: (item) => {
        const details =
          item?.batchDetails
            ?.map((detail) => `${detail.status}: ${detail.times.join(", ")}`)
            ?.join("; ") || "-";
        return (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{details}</Tooltip>}
          >
            <span style={{ cursor: "pointer" }}>{details}</span>
          </OverlayTrigger>
        );
      },
    },
    {
      label: "Created By",
      render: (item) => (item?.createdByName ? item?.createdByName : "-"),
    },
    {
      label: "Updated By",
      render: (item) => (item?.updatedByName ? item?.updatedByName : "-"),
    },
  ];

  const addBatchTime = () => {
    if (!selectedStatus) {
      toast.error("Please select a batch status first.");
      return;
    }
    if (!selectedTime[0] || !selectedTime[1]) {
      toast.error("Please select a time range first.");
      return;
    }
    const newTime = `${selectedTime[0].format(
      "h:mm A"
    )} to ${selectedTime[1].format("h:mm A")}`;
    const updatedBatchDetails = [...formik.values.batchDetails];
    const existingStatusIndex = updatedBatchDetails.findIndex(
      (detail) => detail.status === selectedStatus.value
    );

    if (existingStatusIndex >= 0) {
      updatedBatchDetails[existingStatusIndex].times = [
        ...updatedBatchDetails[existingStatusIndex].times,
        newTime,
      ];
    } else {
      updatedBatchDetails.push({
        status: selectedStatus.value,
        times: [newTime],
      });
    }

    formik.setFieldValue("batchDetails", updatedBatchDetails);
    setSelectedTime([]);
  };

  const removeBatchTime = (status, timeIndex) => {
    const updatedBatchDetails = [...formik.values.batchDetails];
    const statusIndex = updatedBatchDetails.findIndex(
      (detail) => detail.status === status
    );
    if (statusIndex >= 0) {
      updatedBatchDetails[statusIndex].times = updatedBatchDetails[
        statusIndex
      ].times.filter((_, i) => i !== timeIndex);
      if (updatedBatchDetails[statusIndex].times.length === 0) {
        updatedBatchDetails.splice(statusIndex, 1);
      }
      formik.setFieldValue("batchDetails", updatedBatchDetails);
    }
  };

  return (
    <Row className="mt-5 row-sm">
      <Col md={12} lg={12} xl={12}>
        <Card className="custom-card transcation-crypto">
          <Card.Header className="border-bottom-0">
            <div className="w-100 d-flex justify-content-between">
              <div className="card-title">
                {formik.values.id
                  ? "Update Coaching Faculty"
                  : "Add Coaching Faculty"}
              </div>
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
                    id="typehead1"
                    placeholder="Search here..."
                    autoComplete="off"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    disabled={isLoading}
                  />
                </div>
                {canCreate && (
                  <Button
                    variant="primary"
                    className="custom-select-height"
                    onClick={handleOpenModal}
                  >
                    {formik.values.id
                      ? "Update Coaching Faculty"
                      : "Add Coaching Faculty"}
                  </Button>
                )}
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
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
                              if (
                                userRole === "Branch" ||
                                userType === "Branch User"
                              ) {
                                return branch._id === branchID;
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
                        fetchCoachingFaculties(
                          1,
                          itemsPerPage,
                          search,
                          showAll,
                          userRole === "Branch" || userType === "Branch User"
                            ? branchID
                            : branchId
                        );
                      }
                    }}
                  />
                </div>
              )}
              <div className="flex-grow-1"></div>
              <div className="filter-item-rows">
                <ItemsPerPageSelect
                  itemsPerPage={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                />
              </div>
              <div className="d-flex align-items-center">
                <div className="filter-item filter-height total-records px-3 d-flex align-items-center">
                  <span>
                    Total Records: <strong>{totalRecords}</strong>
                  </span>
                </div>
              </div>
            </div>
            <Modal
              show={showModal}
              onHide={handleCloseModal}
              size="lg"
              centered
            >
              <Modal.Header className="form-main-heading">
                <Modal.Title>
                  {formik.values.id
                    ? "Update Coaching Faculty"
                    : "Add Coaching Faculty"}
                </Modal.Title>
                <AiOutlineClose
                  size={20}
                  style={{ cursor: "pointer", color: "white" }}
                  onClick={handleCloseModal}
                />
              </Modal.Header>
              <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
                {(canCreate || (canUpdate && formik.values.id)) && (
                  <Form onSubmit={formik.handleSubmit}>
                    <Row className="mb-3 mt-0">
                      <Col md={6} className="mb-3">
                        <Form.Label className="fw-semibold">Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          className="custom-select-height"
                          placeholder="Enter Name"
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
                        <Form.Label className="fw-semibold">Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          className="custom-select-height"
                          placeholder="Enter Email"
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
                        <Form.Label className="fw-semibold">
                          {formik.values.id
                            ? "New Password (Optional)"
                            : "Password"}
                        </Form.Label>
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
                      <Col md={6} className="mb-3">
                        <Form.Label className="fw-semibold">Phone</Form.Label>
                        <Form.Control
                          type="text"
                          name="phone"
                          className="custom-select-height"
                          placeholder="Enter Phone Number"
                          value={formik.values.phone}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.phone && formik.errors.phone && (
                          <div className="text-danger">
                            {formik.errors.phone}
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
                                ? { value: null, label: "Head Office" }
                                : formik.values.branchId
                                ? {
                                    value: formik.values.branchId,
                                    label:
                                      branchList.find(
                                        (b) => b._id === formik.values.branchId
                                      )?.name || "Select Branch",
                                  }
                                : null
                            }
                            onChange={(option) =>
                              formik.setFieldValue(
                                "branchId",
                                option ? option.value : ""
                              )
                            }
                            onBlur={() =>
                              formik.setFieldTouched("branchId", true)
                            }
                            options={branchOptions}
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
                        <Form.Label className="fw-semibold">
                          Batch Status
                        </Form.Label>
                        <Select
                          options={batchStatusOptions}
                          value={selectedStatus}
                          classNamePrefix="custom-select"
                          placeholder
                          isMulti
                          onChange={(options) => {
                            const selected = options || [];
                            setSelectedStatus(selected);

                            const selectedValues = selected.map((o) => o.value);

                            // formik.batchDetails maintain
                            let updated = [...formik.values.batchDetails];

                            // add newly selected statuses if missing
                            selectedValues.forEach((v) => {
                              if (!updated.find((d) => d.status === v)) {
                                updated.push({ status: v, times: [] });
                              }
                            });

                            // remove unselected statuses
                            updated = updated.filter((d) =>
                              selectedValues.includes(d.status)
                            );
                            formik.setFieldValue("batchDetails", updated);

                            // timeInputs clean for unselected
                            setTimeInputs((prev) => {
                              const next = { ...prev };
                              Object.keys(next).forEach((k) => {
                                if (!selectedValues.includes(k)) delete next[k];
                              });
                              return next;
                            });
                          }}
                        />
                      </Col>
                      <Col md={12} className="mb-3">
                        {formik.values.batchDetails.length > 0 &&
                          formik.values.batchDetails.map((detail, idx) => {
                            const statusValue = detail.status;

                            const handleTimeChange = (time) => {
                              // Always store the picker value for controlled UI
                              setTimeInputs((prev) => ({
                                ...prev,
                                [statusValue]: time || null,
                              }));

                              // Proceed only when both start & end times are selected
                              if (!time || !time[0] || !time[1]) return;

                              // Format selected range
                              const newTime = `${time[0].format(
                                "h:mm A"
                              )} to ${time[1].format("h:mm A")}`;

                              // Prevent duplicate add for same status & same range
                              const updated = [...formik.values.batchDetails];
                              const currentTimes = updated[idx].times || [];

                              // Check if already exists (avoid double-add)
                              if (!currentTimes.includes(newTime)) {
                                updated[idx].times = [...currentTimes, newTime];
                                formik.setFieldValue("batchDetails", updated);
                              }

                              // Clear the picker after adding
                              setTimeout(() => {
                                setTimeInputs((prev) => ({
                                  ...prev,
                                  [statusValue]: null,
                                }));
                              }, 100); // slight delay ensures UI reset after antd internal update
                            };

                            return (
                              <div
                                key={statusValue}
                                className="mb-4 border rounded p-3 shadow-sm"
                                style={{ background: "#fff" }}
                              >
                                <h6 className="fw-semibold mb-3">
                                  {statusValue}
                                </h6>

                                <TimePicker.RangePicker
                                  use12Hours
                                  format="h:mm A"
                                  className="custom-select-height"
                                  placeholder={["Start Time", "End Time"]}
                                  style={{ width: "100%" }}
                                  value={timeInputs[statusValue] || null} // controlled value
                                  onChange={handleTimeChange} // add & clear here
                                  allowClear
                                />

                                {/* {detail.times.length > 0 && (
          <List
            bordered
            dataSource={detail.times}
            renderItem={(time, timeIndex) => (
              <List.Item
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  marginTop: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#f8f9fa",
                }}
                actions={[
                  <Button
                    key="delete"
                    variant="link"
                    style={{ padding: 0, color: "#dc3545", fontSize: "18px" }}
                    onClick={() => {
                      const updated = [...formik.values.batchDetails];
                      updated[idx].times = updated[idx].times.filter((_, i) => i !== timeIndex);
                      formik.setFieldValue("batchDetails", updated);
                    }}
                  >
                    <AiOutlineClose />
                  </Button>,
                ]}
              >
                <span style={{ fontSize: "14px", color: "#495057" }}>{time}</span>
              </List.Item>
            )}
          />
        )} */}
                              </div>
                            );
                          })}
                      </Col>
                    </Row>
                    {formik.values.batchDetails.length > 0 && (
                      <List
                        bordered
                        dataSource={formik.values.batchDetails}
                        renderItem={(detail) => (
                          <List.Item
                            style={{
                              backgroundColor: "#ffffff",
                              marginBottom: "12px",
                              borderRadius: "8px",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                              padding: "12px",
                              border: "1px solid #e9ecef",
                            }}
                          >
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <strong
                                style={{
                                  fontSize: "16px",
                                  color: "#343a40",
                                  marginBottom: "8px",
                                }}
                              >
                                {detail.status}
                              </strong>
                              <List
                                dataSource={detail.times}
                                renderItem={(time, timeIndex) => (
                                  <List.Item
                                    style={{
                                      padding: "8px 12px",
                                      border: "1px solid #dee2e6",
                                      borderRadius: "6px",
                                      marginBottom: "6px",
                                      backgroundColor: "#f8f9fa",
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                    actions={[
                                      <Button
                                        key="delete"
                                        variant="link"
                                        style={{
                                          padding: 0,
                                          color: "#dc3545",
                                          fontSize: "18px",
                                        }}
                                        onClick={() =>
                                          removeBatchTime(
                                            detail.status,
                                            timeIndex
                                          )
                                        }
                                      >
                                        <AiOutlineClose />
                                      </Button>,
                                    ]}
                                  >
                                    <span
                                      style={{
                                        fontSize: "14px",
                                        color: "#495057",
                                      }}
                                    >
                                      {time}
                                    </span>
                                  </List.Item>
                                )}
                              />
                            </div>
                          </List.Item>
                        )}
                        style={{
                          marginTop: "16px",
                          backgroundColor: "#fff",
                          borderRadius: "8px",
                          border: "none",
                        }}
                      />
                    )}
                    {formik.touched.batchDetails &&
                      formik.errors.batchDetails && (
                        <div className="text-danger mt-2">
                          {typeof formik.errors.batchDetails === "string"
                            ? formik.errors.batchDetails
                            : "Invalid batch details"}
                        </div>
                      )}
                    <div className="text-end mt-3">
                      <Button
                        variant="primary"
                        className="custom-select-height"
                        type="submit"
                        disabled={formik.values.id ? !canUpdate : !canCreate}
                      >
                        {formik.values.id ? "Update" : "Add"}
                      </Button>
                    </div>
                  </Form>
                )}
              </Modal.Body>
            </Modal>
            {isLoading ? (
              <div className="d-flex justify-content-center my-4">
                <div
                  className="spinner-border text-primary"
                  role="status"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <DataTable
                  columns={columns}
                  data={coachingFaculties}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  canEdit={canUpdate}
                  canDelete={canDelete}
                  canRead={canRead}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
                {totalPages > 1 && coachingFaculties.length > 0 && (
                  <Paginations
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default CoachingFaculty;
