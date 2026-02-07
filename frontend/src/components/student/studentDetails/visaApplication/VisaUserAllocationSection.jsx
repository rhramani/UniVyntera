import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import usePermissions from "../../../commonComponents/usePermissions";
import DataTable from "../../../commonComponents/DataTable";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useState } from "react";
import { useDispatch } from "react-redux";
import LoadMoreButton from "../../../commonComponents/LoadMoreButton";
import {
  deleteStudentApplication,
  updateStudentApplication,
} from "../../../../redux/actions/Student/StudentApplication.action";
import {
  deleteVisitorApplication,
  updateVisitorApplication,
} from "../../../../redux/actions/Visitor/VisitorApplication.action";

const VisaAllocationValidationSchema = Yup.object({
  role: Yup.string().nullable(),
  user: Yup.string().nullable(),
});

const VisaUserAllocationSection = ({
  visaUserAllocation,
  formData,
  edit,
  setEdit,
  getAllRollList,
  allUser,
  setAllUser,
  fetchAllUser,
  setFormData,
  fetchOneStudentDetails,
  id,
  mode,
  fetchOneVisitorDetails,
  userRole,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showVisaAllocationModal, setShowVisaAllocationModal] = useState(false);
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions(
    "Student Applications",
    "Visa Application",
  );
  const VisaAllocationFormik = useFormik({
    initialValues: {
      visaAllocationDetails: [
        {
          role: null,
          user: null,
        },
      ],
    },
    validationSchema: Yup.object({
      visaAllocationDetails: Yup.array().of(VisaAllocationValidationSchema),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: (values) => {
      if (edit.visaAllocationDetails) {
        handleEditVisaUserAllocation(values);
      } else {
        handleVisaUserAllocationSubmit(values);
      }
    },
  });
  const handleVisaUserAllocationSubmit = async (values) => {
    setIsLoading(true);
    const currentIndex = 0;
    const newVisaAllocation = {
      role: values.visaAllocationDetails[currentIndex].role || null,
      user: values.visaAllocationDetails[currentIndex].user || null,
    };

    if (!newVisaAllocation.role && !newVisaAllocation.user) {
      toast.error("Please select at least one field before submitting.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        visaAllocationDetails: [newVisaAllocation],
      };
      const res = await dispatch(
        mode === "student"
          ? updateStudentApplication(payload, id)
          : updateVisitorApplication(payload, id),
      );
      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("Visa Allocation added successfully");
        setFormData((prev) => ({
          ...prev,
          visaAllocationDetails: [
            ...prev.visaAllocationDetails,
            res.data.data.visaAllocationDetails?.[0],
          ],
        }));
        setShowVisaAllocationModal(false);
        VisaAllocationFormik.resetForm();
        if (mode === "student") {
          fetchOneStudentDetails();
        } else if (mode === "visitor") {
          fetchOneVisitorDetails();
        }
      } else {
        toast.error(
          res?.data?.message || "Error adding User Allocation service",
        );
      }
    } catch (error) {
      console.error("Error adding User Allocation service:", error);
      toast.error(
        error?.response?.data?.message ||
          "Error adding User Allocation service",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditVisaUserAllocation = async (values) => {
    setIsLoading(true);
    const updatedIndex = edit.visaVisaAllocationIndex;
    const updatedEntry = {
      role: values.visaAllocationDetails[0].role || null,
      user: values.visaAllocationDetails[0].user || null,
    };
    const serviceId = formData.visaAllocationDetails?.[updatedIndex]?._id;
    try {
      const payload = {
        visaAllocationId: serviceId,
        visaAllocationUpdate: updatedEntry,
      };
      const res = await dispatch(
        mode === "student"
          ? updateStudentApplication(payload, id)
          : updateVisitorApplication(payload, id),
      );
      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("Visa Allocation updated successfully");
        setFormData((prev) => {
          const updatedData = [...prev.visaAllocationDetails];
          updatedData[updatedIndex] = {
            ...updatedData[updatedIndex],
            ...res.data.data.visaAllocationDetails[0],
          };
          return { ...prev, visaAllocationDetails: updatedData };
        });
        setEdit((prev) => ({
          ...prev,
          visaAllocationDetails: false,
          visaVisaAllocationIndex: 0,
        }));
        setShowVisaAllocationModal(false);
        VisaAllocationFormik.resetForm();
        if (mode === "student") {
          fetchOneStudentDetails();
        } else if (mode === "visitor") {
          fetchOneVisitorDetails();
        }
      } else {
        toast.error(
          res?.data?.message || "Error adding User Allocation service",
        );
      }
    } catch (error) {
      console.error("Error adding User Allocation service:", error);
      toast.error(
        error?.response?.data?.message ||
          "Error adding User Allocation service",
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteVisaAllocation = async (indexToDelete) => {
    const visaAllocationId = formData.visaAllocationDetails[indexToDelete]?._id;

    if (!visaAllocationId) {
      toast.error("Invalid service detail. Cannot delete.");
      return;
    }

    const payload = { visaAllocationId };

    try {
      const res = await dispatch(
        mode === "student"
          ? deleteStudentApplication(payload, id)
          : deleteVisitorApplication(payload, id),
      );
      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("Visa Allocation deleted successfully");
        setFormData((prev) => ({
          ...prev,
          visaAllocationDetails: prev.visaAllocationDetails.filter(
            (_, i) => i !== indexToDelete,
          ),
        }));
        if (mode === "student") {
          fetchOneStudentDetails();
        } else if (mode === "visitor") {
          fetchOneVisitorDetails();
        }
      } else {
        toast.error(
          res?.data?.message || "Error deleting Visa Allocation service",
        );
      }
    } catch (error) {
      console.error("Error deleting Visa Allocation service:", error);
      toast.error(
        error?.response?.data?.message ||
          "Error deleting Visa Allocation service",
      );
    }
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
      <div className="my-5 p-4 bg-light rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Visa Allocation</h5>
          {userRole !== "Student" &&
            userRole !== "LeadStudent" &&
            canCreate && (
              <Button
                variant="primary"
                className="custom-select-height"
                onClick={() => {
                  VisaAllocationFormik.resetForm();
                  setEdit((prev) => ({
                    ...prev,
                    visaAllocationDetails: false,
                    visaVisaAllocationIndex: 0,
                  }));
                  setShowVisaAllocationModal(true);
                }}
              >
                Add New
              </Button>
            )}
        </div>
        <DataTable
          columns={visaUserAllocation}
          data={canRead ? formData.visaAllocationDetails || [] : []}
          currentPage={1}
          totalPages={1}
          itemsPerPage={10}
          onEdit={(item) => {
            const values = {
              visaAllocationDetails: [
                {
                  role: item.role?._id || null,
                  user: item.user?._id || null,
                },
              ],
            };
            VisaAllocationFormik.setValues(values);
            setEdit((prev) => ({
              ...prev,
              visaAllocationDetails: true,
              visaVisaAllocationIndex:
                formData.visaAllocationDetails.indexOf(item),
            }));
            if (item.role?._id) {
              const selectedRole = getAllRollList?.data?.find(
                (role) => role._id === item.role._id,
              );
              if (selectedRole) {
                fetchAllUser(selectedRole.name);
              }
            }
            setShowVisaAllocationModal(true);
          }}
          onDelete={(item) => {
            const index = formData.visaAllocationDetails.indexOf(item);
            handleDeleteVisaAllocation(index);
          }}
          canEdit={canUpdate}
          canDelete={canDelete}
          canRead={canRead}
        />
      </div>
      <Modal
        show={showVisaAllocationModal}
        onHide={() => {
          setShowVisaAllocationModal(false);
          VisaAllocationFormik.resetForm();
          setEdit((prev) => ({
            ...prev,
            visaAllocationDetails: false,
            visaVisaAllocationIndex: 0,
          }));
          setAllUser([]);
        }}
        size="lg"
        centered
      >
        <Modal.Header className="form-main-heading">
          <Modal.Title>
            {edit.visaAllocationDetails
              ? "Update Visa Allocation"
              : "Add Visa Allocation"}
          </Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={() => {
              setShowVisaAllocationModal(false);
              VisaAllocationFormik.resetForm();
              setEdit((prev) => ({
                ...prev,
                visaAllocationDetails: false,
                visaVisaAllocationIndex: 0,
              }));
              setAllUser([]);
            }}
          />
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={VisaAllocationFormik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Role</Form.Label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="visaAllocationDetails[0].role"
                  options={getAllRollList?.data
                    ?.filter(
                      (role) =>
                        ![
                          "Super Admin",
                          "B2B Admin",
                          "B2B Member",
                          "Branch Member",
                          "Branch",
                        ].includes(role.name),
                    )
                    ?.sort((a, b) => a.name?.localeCompare(b.name))
                    ?.map((data) => ({
                      value: data._id,
                      label: data.name,
                    }))}
                  value={
                    VisaAllocationFormik.values.visaAllocationDetails?.[0]?.role
                      ? getAllRollList?.data
                          ?.filter(
                            (role) =>
                              ![
                                "Super Admin",
                                "B2B Admin",
                                "B2B Member",
                                "Branch Member",
                                "Branch",
                              ].includes(role.name),
                          )
                          ?.map((data) => ({
                            value: data._id,
                            label: data.name,
                          }))
                          ?.find(
                            (option) =>
                              option.value ===
                              VisaAllocationFormik.values
                                .visaAllocationDetails[0].role,
                          )
                      : null
                  }
                  onChange={(selectedOption) => {
                    const roleValue = selectedOption
                      ? selectedOption.value
                      : null;
                    VisaAllocationFormik.setFieldValue(
                      "visaAllocationDetails[0].role",
                      roleValue,
                    );
                    VisaAllocationFormik.setFieldValue(
                      "visaAllocationDetails[0].user",
                      null,
                    );
                    setAllUser([]);
                    if (roleValue) {
                      const selectedRole = getAllRollList?.data?.find(
                        (role) => role?._id === roleValue,
                      );
                      if (selectedRole) {
                        fetchAllUser(selectedRole.name);
                      }
                    }
                  }}
                  onBlur={() =>
                    VisaAllocationFormik.setFieldTouched(
                      "visaAllocationDetails[0].role",
                      true,
                    )
                  }
                  isClearable
                  placeholder="Select Role"
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
                />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>User</Form.Label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="visaAllocationDetails[0].user"
                  options={allUser
                    ?.sort((a, b) => a.name?.localeCompare(b.name))
                    ?.map((user) => ({
                      value: user._id,
                      label: user.name || user.companyName,
                    }))}
                  value={
                    VisaAllocationFormik.values.visaAllocationDetails?.[0]?.user
                      ? allUser
                          ?.map((user) => ({
                            value: user._id,
                            label: user.name || user.companyName,
                          }))
                          ?.find(
                            (option) =>
                              option.value ===
                              VisaAllocationFormik.values
                                .visaAllocationDetails[0].user,
                          )
                      : null
                  }
                  onChange={(selectedOption) => {
                    VisaAllocationFormik.setFieldValue(
                      "visaAllocationDetails[0].user",
                      selectedOption ? selectedOption.value : null,
                    );
                  }}
                  onBlur={() =>
                    VisaAllocationFormik.setFieldTouched(
                      "visaAllocationDetails[0].user",
                      true,
                    )
                  }
                  isClearable
                  placeholder="Select User"
                  isDisabled={
                    !VisaAllocationFormik.values.visaAllocationDetails?.[0]
                      ?.role
                  }
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
                />
              </Col>
            </Row>
            <div className="text-end mt-3">
              <Button
                variant="primary"
                className="custom-select-height"
                type="submit"
              >
                {edit.visaAllocationDetails ? "Update" : "Add"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default VisaUserAllocationSection;
