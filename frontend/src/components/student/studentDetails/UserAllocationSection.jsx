import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import DataTable from "../../commonComponents/DataTable";
import usePermissions from "../../commonComponents/usePermissions";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useState } from "react";
import { useDispatch } from "react-redux";
import LoadMoreButton from "../../commonComponents/LoadMoreButton";
import {
  deleteStudentApplication,
  updateStudentApplication,
} from "../../../redux/actions/Student/StudentApplication.action";

const userAllocationValidationSchema = Yup.object({
  role: Yup.string().nullable(),
  user: Yup.string().nullable(),
});

const UserAllocationSection = ({
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
  userRole,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showUserAllocationModal, setShowUserAllocationModal] = useState(false);
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions(
    "Student Applications",
    "Course Selection",
  );

  const userAllocationFormik = useFormik({
    initialValues: {
      userAllocationDetails: [
        {
          role: null,
          user: null,
        },
      ],
    },
    validationSchema: Yup.object({
      userAllocationDetails: Yup.array().of(userAllocationValidationSchema),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: (values) => {
      if (edit.userAllocationDetails) {
        handleEditUserAllocation(values);
      } else {
        handleUserAllocationSubmit(values);
      }
    },
  });

  const handleUserAllocationSubmit = async (values) => {
    setIsLoading(true);
    const currentIndex = 0;
    const newUserAllocation = {
      role: values.userAllocationDetails[currentIndex].role || null,
      user: values.userAllocationDetails[currentIndex].user || null,
    };

    if (!newUserAllocation.role && !newUserAllocation.user) {
      toast.error("Please select at least one field before submitting.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        userAllocationDetails: [newUserAllocation],
      };
      const res = await dispatch(updateStudentApplication(payload, id));
      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("User Allocation added successfully");
        setFormData((prev) => ({
          ...prev,
          userAllocationDetails: [
            ...prev.userAllocationDetails,
            res.data.data.userAllocationDetails[0],
          ],
        }));
        setShowUserAllocationModal(false);
        userAllocationFormik.resetForm();
        fetchOneStudentDetails();
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

  const handleEditUserAllocation = async (values) => {
    setIsLoading(true);
    const updatedIndex = edit.userAllocationIndex;
    const updatedEntry = {
      role: values.userAllocationDetails[0].role || null,
      user: values.userAllocationDetails[0].user || null,
    };
    const serviceId = formData.userAllocationDetails?.[updatedIndex]?._id;

    try {
      const payload = {
        userAllocationId: serviceId,
        userAllocationUpdate: updatedEntry,
      };
      const res = await dispatch(updateStudentApplication(payload, id));

      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("User Allocation updated successfully");
        setFormData((prev) => {
          const updatedData = [...prev.userAllocationDetails];
          updatedData[updatedIndex] = {
            ...updatedData[updatedIndex],
            ...res.data.data.userAllocationDetails[0],
          };
          return { ...prev, userAllocationDetails: updatedData };
        });
        setEdit((prev) => ({
          ...prev,
          userAllocationDetails: false,
          userAllocationIndex: 0,
        }));
        setShowUserAllocationModal(false);
        userAllocationFormik.resetForm();
        fetchOneStudentDetails();
      } else {
        toast.error(
          res?.data?.message || "Error updating User Allocation service",
        );
      }
    } catch (error) {
      console.error("Error updating User Allocation service:", error);
      toast.error(
        error?.response?.data?.message ||
          "Error updating User Allocation service",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUserAllocation = async (indexToDelete) => {
    const userAllocationId = formData.userAllocationDetails[indexToDelete]?._id;

    if (!userAllocationId) {
      toast.error("Invalid service detail. Cannot delete.");
      return;
    }

    const payload = { userAllocationId };

    try {
      const res = await dispatch(deleteStudentApplication(payload, id));
      if (res?.status === 200) {
        if (res?.data?.data?.message) {
          toast.error(res.data.data.message);
          return;
        }
        toast.success("User Allocation deleted successfully");
        setFormData((prev) => ({
          ...prev,
          userAllocationDetails: prev.userAllocationDetails.filter(
            (_, i) => i !== indexToDelete,
          ),
        }));
        if (
          edit.userAllocationDetails &&
          edit.userAllocationIndex === indexToDelete
        ) {
          setEdit((prev) => ({
            ...prev,
            userAllocationDetails: false,
            userAllocationIndex: 0,
          }));
        }
        fetchOneStudentDetails();
      } else {
        toast.error(
          res?.data?.message || "Error deleting User Allocation service",
        );
      }
    } catch (error) {
      console.error("Error deleting User Allocation service:", error);
      toast.error(
        error?.response?.data?.message ||
          "Error deleting User Allocation service",
      );
    }
  };

  const userAllocation = [
    {
      label: "Role",
      render: (item) => (item.role ? item.role?.name : "-"),
    },
    {
      label: "User",
      render: (item) => (item.user ? item.user?.name : "-"),
    },
    {
      label: "Created by",
      render: (item) => {
        return item ? item.createdByName || "-" : "-";
      },
    },
    {
      label: "Updated by",
      render: (item) => {
        return item ? item.updatedByName || "-" : "-";
      },
    },
  ];

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
      <div className="">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>User Allocation</h5>
          {userRole !== "Student" &&
            userRole !== "LeadStudent" &&
            canCreate && (
              <Button
                variant="primary"
                className="custom-select-height"
                onClick={() => {
                  userAllocationFormik.resetForm();
                  setEdit((prev) => ({
                    ...prev,
                    userAllocationDetails: false,
                    userAllocationIndex: 0,
                  }));
                  setShowUserAllocationModal(true);
                }}
              >
                Add New
              </Button>
            )}
        </div>
        <DataTable
          columns={userAllocation}
          data={canRead ? formData.userAllocationDetails || [] : []}
          currentPage={1}
          totalPages={1}
          itemsPerPage={10}
          onEdit={(item) => {
            const values = {
              userAllocationDetails: [
                {
                  role: item.role?._id || null,
                  user: item.user?._id || null,
                },
              ],
            };
            userAllocationFormik.setValues(values);
            setEdit((prev) => ({
              ...prev,
              userAllocationDetails: true,
              userAllocationIndex: formData.userAllocationDetails.indexOf(item),
            }));
            if (item.role?._id) {
              const selectedRole = getAllRollList?.data?.find(
                (role) => role._id === item.role._id,
              );
              if (selectedRole) {
                fetchAllUser(selectedRole.name);
              }
            }
            setShowUserAllocationModal(true);
          }}
          onDelete={(item) => {
            const index = formData.userAllocationDetails.indexOf(item);
            handleDeleteUserAllocation(index);
          }}
          canEdit={canUpdate}
          canDelete={canDelete}
          canRead={canRead}
        />
      </div>
      <Modal
        show={showUserAllocationModal}
        onHide={() => {
          setShowUserAllocationModal(false);
          userAllocationFormik.resetForm();
          setEdit((prev) => ({
            ...prev,
            userAllocationDetails: false,
            userAllocationIndex: 0,
          }));
          setAllUser([]);
        }}
        size="lg"
        centered
      >
        <Modal.Header className="form-main-heading">
          <Modal.Title>
            {edit.userAllocationDetails
              ? "Update User Allocation"
              : "Add User Allocation"}
          </Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={() => {
              setShowUserAllocationModal(false);
              userAllocationFormik.resetForm();
              setEdit((prev) => ({
                ...prev,
                userAllocationDetails: false,
                userAllocationIndex: 0,
              }));
              setAllUser([]);
            }}
          />
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={userAllocationFormik.handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Role</Form.Label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="userAllocationDetails[0].role"
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
                    userAllocationFormik.values.userAllocationDetails?.[0]?.role
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
                              userAllocationFormik.values
                                .userAllocationDetails[0].role,
                          )
                      : null
                  }
                  onChange={(selectedOption) => {
                    const roleValue = selectedOption
                      ? selectedOption.value
                      : null;
                    userAllocationFormik.setFieldValue(
                      "userAllocationDetails[0].role",
                      roleValue,
                    );
                    userAllocationFormik.setFieldValue(
                      "userAllocationDetails[0].user",
                      null,
                    );
                    setAllUser([]);
                    if (roleValue) {
                      const selectedRole = getAllRollList?.data?.find(
                        (role) => role?._id === roleValue,
                      );
                      if (selectedRole) {
                        fetchAllUser(selectedRole.name, roleValue);
                      }
                    }
                  }}
                  onBlur={() =>
                    userAllocationFormik.setFieldTouched(
                      "userAllocationDetails[0].role",
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
                  name="userAllocationDetails[0].user"
                  options={allUser
                    ?.sort((a, b) => a.name?.localeCompare(b.name))
                    ?.map((user) => ({
                      value: user._id,
                      label: user.name || user.companyName,
                    }))}
                  value={
                    userAllocationFormik.values.userAllocationDetails?.[0]?.user
                      ? allUser
                          ?.map((user) => ({
                            value: user._id,
                            label: user.name || user.companyName,
                          }))
                          ?.find(
                            (option) =>
                              option.value ===
                              userAllocationFormik.values
                                .userAllocationDetails[0].user,
                          )
                      : null
                  }
                  onChange={(selectedOption) => {
                    userAllocationFormik.setFieldValue(
                      "userAllocationDetails[0].user",
                      selectedOption ? selectedOption.value : null,
                    );
                  }}
                  onBlur={() =>
                    userAllocationFormik.setFieldTouched(
                      "userAllocationDetails[0].user",
                      true,
                    )
                  }
                  isClearable
                  placeholder="Select User"
                  isDisabled={
                    !userAllocationFormik.values.userAllocationDetails?.[0]
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
                {edit.userAllocationDetails ? "Update" : "Add"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UserAllocationSection;
