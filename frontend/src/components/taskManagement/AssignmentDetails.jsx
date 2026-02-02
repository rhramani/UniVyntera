import { useEffect, useState } from "react";
import { Button, Form, Row, Col, Card, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import DataTable from "../commonComponents/DataTable";
import Select from "react-select";
import { AiOutlineClose } from "react-icons/ai";
import usePermissions from "../commonComponents/usePermissions";
import Paginations from "../elements/Paginations";
import {
  createLoan,
  deleteLoan,
  getAllLoan,
  updateLoan,
} from "../../redux/actions/LoanInquiry.action";
import Pageheader from "../../layouts/Pageheader";
import { getAllLoanStatus } from "../../redux/actions/Master/EducationLoanStatus.action";
import LoadMoreButton from "../commonComponents/LoadMoreButton";

const AssignmentDetails = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [allLoans, setAllLoans] = useState([]);
  const [loanStatuses, setLoanStatuses] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [show, setShow] = useState(false);

  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Assignment Details");

  const formatDate = (date) => {
    if (!date) return "";
    if (typeof date === "string") {
      const d = new Date(date);
      if (!isNaN(d)) date = d;
      else return "";
    }
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    let d = new Date(dateStr);
    if (!isNaN(d)) return d;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split("/");
      d = new Date(`${year}-${month}-${day}`);
      if (!isNaN(d)) return d;
    }
    return null;
  };

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
  };

  const fetchLoans = async (page = 1, limit = itemsPerPage, search = "") => {
    try {
      const res = await dispatch(getAllLoan(page, limit, search));
      const responseData = res?.data?.data;
      setAllLoans(responseData?.data || []);
      setTotalPages(responseData?.totalPages || 0);
      setTotalRecords(responseData?.totalRecords || 0);
    } catch (error) {
      console.error("Error fetching loans:", error);
      setAllLoans([]);
      setTotalPages(0);
      setTotalRecords(0);
    }
  };

  const fetchLoanStatuses = async () => {
    try {
      const res = await dispatch(getAllLoanStatus());
      if (res?.status === 200) {
        setLoanStatuses(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching loan statuses:", error);
    }
  };

  useEffect(() => {
    fetchLoanStatuses();
    if (canRead) {
      fetchLoans(currentPage, itemsPerPage, search);
    }
  }, [currentPage, search]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      fetchLoans(1, newItemsPerPage, search);
    }
  };

  const formik = useFormik({
    initialValues: {
      createdBy: "",
      assignedTo: "",
      team: "",
      collaborators: [],
      id: "",
    },
    validationSchema: Yup.object({
      createdBy: Yup.string().required("Created By is required"),
      assignedTo: Yup.string().required("Assigned To is required"),
      team: Yup.string().required("Team is required"),
      collaborators: Yup.array(),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);

      try {
        toast.dismiss();

        const payload = {
          createdBy: values.createdBy,
          assignedTo: values.assignedTo,
          team: values.team,
          collaborators: values.collaborators?.map((c) => c.value),
        };

        if (values.id && canUpdate) {
          const res = await dispatch(updateLoan(payload, values.id));
          if (res?.data?.code === 200) {
            toast.success("Assignment details updated successfully");
          }
        } else if (canCreate) {
          const res = await dispatch(createLoan(payload));
          if (res?.data?.code === 201) {
            toast.success("Assignment details added successfully");
          }
        }
        resetForm();
        if (canRead) {
          fetchLoans(currentPage, itemsPerPage, search);
        }
        handleClose();
      } catch (error) {
        toast.dismiss();
        console.error("Error submitting form:", error);
        toast.error(
          error?.response?.data?.message ||
            "Failed to submit Assignment details."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleEdit = (loan) => {
    if (canUpdate) {
      formik.setValues({
        studentName: loan.studentName || "",
        course: loan.course || "",
        country: loan.country || "",
        requiredLoan: loan.requiredLoan || "",
        contact: loan.contact || "",
        email: loan.email || "",
        parentName: loan.parentName || "",
        parentContact: loan.parentContact || "",
        occupation: loan.occupation || "",
        income: loan.income || "",
        approvedBank: loan.approvedBank || "",
        approvedAmount: loan.approvedAmount || "",
        interestAmount: loan.interestAmount || "",
        loanType: loan.loanType || "",
        remarks: loan.remarks || "",
        loanStartDate: loan.loanStartDate || "",
        loanEndDate: loan.loanEndDate || "",
        status: loan.status || "",
        id: loan._id || "",
      });
      setShow(true);
    }
  };

  const handleDelete = async (loan) => {
    try {
      setIsLoading(true);
      toast.dismiss();
      const res = await dispatch(deleteLoan(loan._id));
      if (res?.data?.code === 200) {
        toast.success("Assignment details deleted successfully");
      }
      const updatedPage =
        allLoans.length === 1 && currentPage > 1
          ? currentPage - 1
          : currentPage;
      setCurrentPage(updatedPage);
      if (canRead) {
        fetchLoans(updatedPage, itemsPerPage, search);
      }
    } catch (error) {
      console.error("Error deleting loan:", error);
      toast.error("Failed to delete the Assignment details.");
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      label: "Created By",
      key: "createdByName",
    },
    {
      label: "Assigned To",
      key: "assignedToName",
    },
    {
      label: "Team",
      key: "team",
    },
    {
      label: "Collaborators",
      key: "collaborators",
      render: (item) =>
        item?.collaborators?.length
          ? item.collaborators.map((c) => c.name).join(", ")
          : "-",
    },
    {
      label: "Created At",
      key: "createdAt",
      render: (i) => (i.createdAt ? formatDate(parseDate(i.createdAt)) : "-"),
    },
  ];

  const customStyle = {
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
  };

  return (
    <>
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
      <Pageheader
        mainheading="Assignment Details"
        parentfolder="Home"
        activepage="Assignment Details"
      />
      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div>
                <div className="card-title">Assignment Details</div>
              </div>
            </Card.Header>
            <Card.Body>
              <form onSubmit={formik.handleSubmit}>
                <Row className="mb-3">
                  <Col md={4} className="d-flex align-items-end">
                    {canCreate && (
                      <Button
                        variant="primary"
                        className="custom-select-height"
                        onClick={handleShow}
                      >
                        {formik.values.id
                          ? "Update Assignment Details"
                          : "Add Assignment Details"}
                      </Button>
                    )}
                  </Col>
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
                    <div className="custom-select-height border px-3 mt-2 mt-md-0 d-flex align-items-center h-6">
                      <span>
                        Total Records: <strong>{totalRecords}</strong>
                      </span>
                    </div>
                  </Col>
                </Row>
              </form>

              <Modal show={show} onHide={handleClose} size="md" centered>
                <Modal.Header className="form-main-heading">
                  <Modal.Title>
                    {formik.values.id
                      ? "Update Assignment Details"
                      : "Add Assignment Details"}
                  </Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={handleClose}
                  />
                </Modal.Header>
                <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
                  <Form onSubmit={formik.handleSubmit}>
                    <Row className="mb-3 mt-0">
                      <Col md={12} className="mb-3">
                        <Form.Group controlId="createdBy">
                          <Form.Label className="fw-semibold">
                            Created By
                          </Form.Label>
                          <Select
                            // options={userList?.map((u) => ({
                            //   value: u._id,
                            //   label: u.name,
                            // }))}
                            value={
                              formik.values.createdBy
                                ? {
                                    value: formik.values.createdBy,
                                    label: formik.values.createdByName,
                                  }
                                : null
                            }
                            onChange={(selected) =>
                              formik.setFieldValue(
                                "createdBy",
                                selected?.value || ""
                              )
                            }
                            placeholder="Select User"
                            styles={customStyle}
                            isSearchable
                          />
                          {formik.touched.createdBy &&
                            formik.errors.createdBy && (
                              <div className="text-danger">
                                {formik.errors.createdBy}
                              </div>
                            )}
                        </Form.Group>
                      </Col>

                      <Col md={12} className="mb-3">
                        <Form.Group controlId="assignedTo">
                          <Form.Label className="fw-semibold">
                            Assigned To
                          </Form.Label>
                          <Select
                            // options={userList?.map((u) => ({
                            //   value: u._id,
                            //   label: u.name,
                            // }))}
                            value={
                              formik.values.assignedTo
                                ? {
                                    value: formik.values.assignedTo,
                                    label: formik.values.assignedToName,
                                  }
                                : null
                            }
                            onChange={(selected) =>
                              formik.setFieldValue(
                                "assignedTo",
                                selected?.value || ""
                              )
                            }
                            placeholder="Select User"
                            styles={customStyle}
                            isSearchable
                          />
                          {formik.touched.assignedTo &&
                            formik.errors.assignedTo && (
                              <div className="text-danger">
                                {formik.errors.assignedTo}
                              </div>
                            )}
                        </Form.Group>
                      </Col>

                      <Col md={12} className="mb-3">
                        <Form.Group controlId="team">
                          <Form.Label className="fw-semibold">
                            Team / Department
                          </Form.Label>
                          <Select
                            options={[
                              { value: "Development", label: "Development" },
                              { value: "Design", label: "Design" },
                              { value: "Sales", label: "Sales" },
                              { value: "Support", label: "Support" },
                            ]}
                            value={
                              formik.values.team
                                ? {
                                    value: formik.values.team,
                                    label: formik.values.team,
                                  }
                                : null
                            }
                            onChange={(selected) =>
                              formik.setFieldValue(
                                "team",
                                selected?.value || ""
                              )
                            }
                            placeholder="Select Team"
                            styles={customStyle}
                            isSearchable
                          />
                          {formik.touched.team && formik.errors.team && (
                            <div className="text-danger">
                              {formik.errors.team}
                            </div>
                          )}
                        </Form.Group>
                      </Col>

                      <Col md={12} className="mb-3">
                        <Form.Group controlId="collaborators">
                          <Form.Label className="fw-semibold">
                            Additional Collaborators
                          </Form.Label>
                          <Select
                            // options={userList?.map((u) => ({
                            //   value: u._id,
                            //   label: u.name,
                            // }))}
                            value={formik.values.collaborators}
                            onChange={(selected) =>
                              formik.setFieldValue("collaborators", selected)
                            }
                            placeholder="Select Multiple Users"
                            styles={customStyle}
                            isMulti
                            isSearchable
                          />
                          {formik.touched.collaborators &&
                            formik.errors.collaborators && (
                              <div className="text-danger">
                                {formik.errors.collaborators}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="text-end">
                      <Button
                        variant="primary"
                        className="custom-select-height"
                        type="submit"
                      >
                        {formik.values.id ? "Update" : "Add"}
                      </Button>
                    </div>
                  </Form>
                </Modal.Body>
              </Modal>

              <DataTable
                columns={columns}
                data={allLoans}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={canUpdate}
                canDelete={canDelete}
                canRead={canRead}
              />

              {totalPages > 1 && allLoans.length > 0 && (
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
    </>
  );
};

export default AssignmentDetails;
