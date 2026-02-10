import { Table, Button, Form, Row, Col, Card } from "react-bootstrap";
import Paginations from "../elements/Paginations";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  updateRole,
  createRole,
  getAllRole,
  deleteRole,
} from "../../redux/actions/Master/Role.action";
import DataTable from "../commonComponents/DataTable";
import usePermissions from "../commonComponents/usePermissions";
import Pageheader from "../../layouts/Pageheader";
import { decryptData } from "../../utils/encryptionUtils";
import Select from "react-select";
import { getAllBranch } from "../../redux/actions/Branch.action";

const Role = () => {
  const dispatch = useDispatch();
  const [role, setRole] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [highlightForm, setHighlightForm] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedFormBranch, setSelectedFormBranch] = useState(null);
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions("Role");

  const userRole = decryptData(localStorage.getItem("role"));
  const branchId =
    userRole === "Branch" ? decryptData(localStorage.getItem("userId")) : "";
  const branchID =
    userRole === "Branch" ? decryptData(localStorage.getItem("userId")) : "";

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const fetchRole = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    branchId = "",
    showAll = false
  ) => {
    try {
      const res = await dispatch(
        getAllRole(
          page,
          limit,
          search,
          userRole === "Branch" ? branchID : branchId,
          showAll
        )
      );
      const responseData = res?.data?.data;
      setRole(responseData?.data || []);
      setTotalPages(responseData?.totalPages || 0);
      setTotalRecords(responseData?.totalRecords || 0);
    } catch (error) {
      console.log("Error fetching role:", error);
      setRole([]);
      setTotalPages(0);
    }
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

  useEffect(() => {
    fetchAllBranches();
  }, []);

  useEffect(() => {
    if (canRead) {
      let showAll = false;
      let computedBranchId = userRole === "Branch" ? branchId : selectedBranch;
      if (selectedBranch === "all") {
        if (userRole === "Branch") {
          showAll = false;
          computedBranchId = branchId;
        } else {
          showAll = true;
          computedBranchId = "";
        }
      } else if (selectedBranch === "") {
        showAll = false;
        computedBranchId = userRole === "Branch" ? branchId : "";
      }
      fetchRole(
        currentPage,
        itemsPerPage,
        search,
        userRole === "Branch" ? branchId : computedBranchId,
        showAll
      );
    }
  }, [
    currentPage,
    itemsPerPage,
    search,
    branchId,
    userRole,
    canRead,
    selectedBranch,
  ]);

  const formik = useFormik({
    initialValues: {
      name: "",
      branchId: userRole === "Branch" ? branchId : "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Role is required"),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        toast.dismiss();
        const payload = {
          name: values.name,
        };
        if (values.id) {
          const res = await dispatch(
            updateRole(
              payload,
              values.id,
              userRole === "Branch" ? branchId : selectedFormBranch ?? ""
            )
          );
          if (res?.data?.code === 200) {
            toast.success("Role updated successfully");
          }
        } else {
          const res = await dispatch(
            createRole(
              payload,
              userRole === "Branch" ? branchId : selectedFormBranch ?? ""
            )
          );
          if (res?.data?.code === 201) {
            toast.success(
              res?.data?.data?.message || "Role added successfully"
            );
          }
        }
        resetForm();
        setSelectedFormBranch(null);
        if (canRead) {
          let showAll = false;
          let computedBranchId =
            userRole === "Branch" ? branchId : selectedBranch;
          if (selectedBranch === "all") {
            showAll = true;
            computedBranchId = "";
          } else if (selectedBranch === "") {
            showAll = false;
            computedBranchId = "";
          }
          fetchRole(
            currentPage,
            itemsPerPage,
            search,
            computedBranchId,
            showAll
          );
        }
        // if (canRead) {
        //   fetchRole(
        //     currentPage,
        //     itemsPerPage,
        //     search,
        //     userRole === "Branch" ? branchId : selectedBranch
        //   );
        // }
      } catch (error) {
        toast.dismiss();
        console.log("Error submitting form:", error);
        toast.error(error?.response?.data?.message);
        resetForm();
      }
    },
  });

  const handleEdit = (item) => {
    if (canUpdate) {
      formik.setValues({
        name: item.name,
        id: item._id,
        branchId: userRole === "Branch" ? item?.branchId?._id : "",
      });
      if (userRole !== "Branch") {
        setSelectedFormBranch(item?.branchId?._id ?? null);
      }
      setHighlightForm(true);
    }
  };

  const handleDelete = async (item) => {
    try {
      toast.dismiss();
      const res = await dispatch(deleteRole(item._id));
      if (res?.data?.code === 200) {
        toast.success("Role deleted successfully");
      }
      const updatedPage =
        role.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      setCurrentPage(updatedPage);
      if (canRead) {
        let showAll = false;
        let computedBranchId =
          userRole === "Branch" ? branchId : selectedBranch;
        if (selectedBranch === "all") {
          showAll = true;
          computedBranchId = "";
        } else if (selectedBranch === "") {
          showAll = false;
          computedBranchId = "";
        }
        fetchRole(currentPage, itemsPerPage, search, computedBranchId, showAll);
      }
      // if (canRead) {
      //   fetchRole(
      //     currentPage,
      //     itemsPerPage,
      //     search,
      //     userRole === "Branch" ? branchId : selectedBranch
      //   );
      // }
    } catch (error) {
      console.log("Error deleting role:", error);
    }
  };

  const columns = [
    {
      label: "Role",
      key: "name",
    },
    // ...(userRole === "Super Admin"
    //   ? [
    //       {
    //         label: "Branch",
    //         render: (item) => (item?.branchId ? item?.branchId?.name : "-"),
    //       },
    //     ]
    //   : []),
    {
      label: "Branch",
      render: (item) =>
        item?.branchId?._id
          ? branchList.find((branch) => branch._id === item.branchId._id)
              ?.name || "-"
          : "-",
    },
    {
      label: "CREATED BY",
      render: (item) => (item?.createdByName ? item?.createdByName : "-"),
    },
    {
      label: "UPDATED BY",
      render: (item) => (item?.updatedByName ? item?.updatedByName : "-"),
    },
  ];

  return (
    <>
      <Pageheader
        mainheading="Role"
        parentfolder="Settings"
        activepage="Role"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              {/* <div>
                <div className="card-title">Role</div>
              </div> */}
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit} className="mb-3">
                <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
                  {(canCreate || (canUpdate && formik.values.id)) && (
                    <>
                      {userRole === "Super Admin" && (
                        <div className="filter-item">
                          <Form.Label>Branch</Form.Label>
                          <Select
                            className="filter-height"
                            styles={{
                              control: (base) => ({
                                ...base,
                                fontSize: "13px",
                              }),
                            }}
                            placeholder="Select Branch"
                            classNamePrefix="custom-select"
                            options={[
                              { value: "", label: "Head Office" },
                              ...(Array.isArray(branchList)
                                ? branchList
                                    .filter(
                                      (branch) =>
                                        branch.name && branch.name.trim() !== ""
                                    )
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
                              selectedFormBranch === null ||
                              selectedFormBranch === undefined
                                ? null
                                : {
                                    value: selectedFormBranch,
                                    label:
                                      selectedFormBranch === ""
                                        ? "Head Office"
                                        : branchList.find(
                                            (branch) =>
                                              branch._id === selectedFormBranch
                                          )?.name || "Select Branch",
                                  }
                            }
                            onChange={(selectedOption) => {
                              setSelectedFormBranch(
                                selectedOption ? selectedOption.value : null
                              );
                            }}
                            isClearable
                          />
                        </div>
                      )}
                      <div className="filter-item">
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                          type="text"
                          className="custom-select-height"
                          placeholder="Enter role"
                          name="name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.name && formik.errors.name && (
                          <div className="custom-text-danger">
                            {formik.errors.name}
                          </div>
                        )}
                      </div>
                      <div className="pt-md-2 mt-2 mt-md-0">
                        <Button
                          variant="primary"
                          className="custom-select-height"
                          type="submit"
                          onClick={() => setHighlightForm(false)}
                        >
                          {formik.values.id ? "Update" : "Add"}
                        </Button>
                      </div>
                    </>
                  )}

                  <div className="flex-grow-1"></div>

                  {canRead && (
                    <>
                      {userRole === "Super Admin" && (
                        <div className="filter-item">
                          <Form.Label>Branch Filter</Form.Label>
                          <Select
                            className="filter-height"
                            styles={{
                              control: (base) => ({
                                ...base,
                                fontSize: "13px",
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
                                        return branch._id === branchId;
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
                              // selectedBranch
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
                              setCurrentPage(1);
                            }}
                            isClearable
                          />
                        </div>
                      )}

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
                            Total Records :<strong> {totalRecords}</strong>
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Form>

              <div className={highlightForm ? "update-warning mb-3" : ""}>
                {highlightForm ? "Update your information" : ""}
              </div>

              <DataTable
                columns={columns}
                data={role}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerpageChange={handleItemsPerPageChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
                renderActions={false}
                ItemsPerPageOptions={true}
                canEdit={canUpdate}
                canDelete={canDelete}
                canRead={canRead}
              />

              {totalPages > 1 && role.length > 0 && (
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

export default Role;
