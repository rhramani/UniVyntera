import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  adminGetAll,
  adminLoginHistory,
} from "../../redux/actions/Admin.action";
import usePermissions from "../commonComponents/usePermissions";
import Paginations from "../elements/Paginations";
import { Card, Col, Form, Row } from "react-bootstrap";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import { getAllRole } from "../../redux/actions/Master/Role.action";
import Select from "react-select";
import Pageheader from "../../layouts/Pageheader";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const LoginHistory = () => {
  const dispatch = useDispatch();
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loginHistory, setLoginHistory] = useState([]);
  const [roleDropDown, setRoleDropDown] = useState([]);
  const [role, setRole] = useState("");
  const [allUserDropDown, setAllUserDropDown] = useState([]);
  const [user, setUser] = useState("");
  const { canRead } = usePermissions("Login History");
  const [search, setSearch] = useState("");

  const fetchLoginHistory = async (
    page = 1,
    limit = itemsPerPage,
    searchTerm = "",
    roleName = "",
    userId = ""
  ) => {
    try {
      const response = await dispatch(
        adminLoginHistory(page, limit, searchTerm, roleName, userId)
      );
      if (response?.status === 200) {
        setLoginHistory(response?.data?.data?.docs || []);
        setTotalRecords(response?.data?.data?.totalDocs || 0);
        setTotalPages(response?.data?.data?.totalPages || 0);
      }
    } catch (error) {
      console.error("Error fetching Login History:", error);
    }
  };

  const fetchRole = async () => {
    try {
      const res = await dispatch(getAllRole(1, 100, "", ""));
      setRoleDropDown(res?.data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchAllUser = async (roleName) => {
    try {
      const res = await dispatch(adminGetAll(1, 100, "", roleName, "", false));
      setAllUserDropDown(res?.data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setAllUserDropDown([]);
    }
  };

  const roleOptions =
    roleDropDown?.map((data) => ({
      value: data.name,
      label: data.name,
    })) || [];

  const userOptions =
    allUserDropDown?.map((user) => {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
      return {
        value: user._id,
        label: fullName || user.name || user.companyName,
      };
    }) || [];

  useEffect(() => {
    if (canRead) {
      fetchLoginHistory(currentPage, itemsPerPage, search, role, user);
      fetchRole();
    }
  }, [canRead, currentPage, itemsPerPage, search, role, user]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <>
      <Pageheader
        mainheading="Login History"
        parentfolder="Settings"
        activepage="Login History"
      />

      <Row className="mt-2">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div className="card-title">Login History</div>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
                <div className="filter-item">
                  <Form.Label>Filter Role</Form.Label>
                  <Select
                    className="filter-height"
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: "13px",
                      }),
                    }}
                    options={roleOptions}
                    onChange={(selectedOption) => {
                      const selectedRoleName = selectedOption
                        ? selectedOption.value
                        : "";
                      setRole(selectedRoleName);
                      setUser("");
                      fetchAllUser(selectedRoleName);
                      setCurrentPage(1);
                    }}
                    placeholder="Select role"
                    isClearable
                    isSearchable
                    classNamePrefix="custom-select"
                    noOptionsMessage={() => "No roles available"}
                  />
                </div>

                <div className="filter-item">
                  <Form.Label>Filter User</Form.Label>
                  <Select
                    className="filter-height"
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: "13px",
                      }),
                    }}
                    options={userOptions}
                    value={
                      userOptions.find((option) => option.value === user) ||
                      null
                    }
                    onChange={(selectedOption) => {
                      setUser(selectedOption ? selectedOption.value : "");
                      setCurrentPage(1);
                    }}
                    placeholder="Select user"
                    isClearable
                    isSearchable
                    classNamePrefix="custom-select"
                    noOptionsMessage={() => "No users available"}
                  />
                </div>

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
                      Total Records: <strong>{totalRecords}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {canRead && loginHistory.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-bordered mt-3">
                    <thead>
                      <tr>
                        <th style={{ borderRight: "none", borderTop: "none" }}>
                          NO
                        </th>
                        <th
                          style={{
                            borderLeft: "none",
                            borderRight: "none",
                            borderTop: "none",
                          }}
                        >
                          NAME
                        </th>
                        <th
                          style={{
                            borderLeft: "none",
                            borderRight: "none",
                            borderTop: "none",
                          }}
                        >
                          ROLE
                        </th>
                        <th
                          style={{
                            borderLeft: "none",
                            borderRight: "none",
                            borderTop: "none",
                          }}
                        >
                          LOGIN TYPE
                        </th>
                        <th
                          style={{
                            borderLeft: "none",
                            borderRight: "none",
                            borderTop: "none",
                          }}
                        >
                          STATUS
                        </th>
                        <th style={{ 
                            borderLeft: "none",
                            borderRight: "none",
                            borderTop: "none", }}>
                          LOGIN TIME
                        </th>
                        <th style={{ 
                            borderLeft: "none",
                            borderRight: "none",
                            borderTop: "none", }}>
                          IP ADDRESS
                        </th>
                        <th style={{ borderLeft: "none", borderTop: "none" }}>
                          LOCATION
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loginHistory?.map((item, index) => (
                        <tr key={index} className="custom-table-row">
                          <td style={{ borderRight: "none" }}>
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td
                            style={{ borderLeft: "none", borderRight: "none" }}
                          >
                            {item?.user?.name ||
                              item?.user?.companyName ||
                              `${item?.user?.firstName} ${item?.user?.lastName}` ||
                              "-"}
                          </td>
                          <td
                            style={{ borderLeft: "none", borderRight: "none" }}
                          >
                            {item?.role || "-"}
                          </td>
                          <td
                            style={{ borderLeft: "none", borderRight: "none" }}
                          >
                            {item?.loginType || "-"}
                          </td>
                          <td
                            style={{ borderLeft: "none", borderRight: "none" }}
                          >
                            {item?.status || "-"}
                          </td>
                          <td style={{ borderLeft: "none", borderRight: "none" }}>
                            {item?.loginTime
                              ? (() => {
                                  const date = new Date(
                                    item.loginTime
                                  ).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  });
                                  const time = new Date(
                                    item.loginTime
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true,
                                  });
                                  return `${date}, ${time}`;
                                })()
                              : "-"}
                          </td>
                          <td style={{ borderLeft: "none", borderRight: "none" }}>
                            {item?.ipAddress || "-"}
                          </td>
                          <td style={{ borderLeft: "none" }}>
                            {/* {item?.locationName ? (
                              <>
                                {item.locationName}{" "}
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    item.locationName
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: "red",
                                    verticalAlign: "middle",
                                    marginLeft: "5px",
                                  }}
                                  title="View on map"
                                >
                                  <LocationOnOutlinedIcon
                                    fontSize="small"
                                    style={{ color: "blue" }}
                                  />
                                </a>
                              </>
                            ) : (
                              "-"
                            )} */}{item?.locationName || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-3">No login history available.</p>
              )}

              {totalPages > 1 && loginHistory.length > 0 && (
                <Paginations
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                  className="mt-2"
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default LoginHistory;
