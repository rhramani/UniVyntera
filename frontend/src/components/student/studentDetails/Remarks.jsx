import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import DataTable from "../../commonComponents/DataTable";
import usePermissions from "../../commonComponents/usePermissions";
import { AiOutlineClose } from "react-icons/ai";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import LoadMoreButton from "../../commonComponents/LoadMoreButton";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
    updateStudentApplication,
    deleteStudentApplication,
} from "../../../redux/actions/Student/StudentApplication.action";
import {
    updateVisitorApplication,
    deleteVisitorApplication,
} from "../../../redux/actions/Visitor/VisitorApplication.action";

/* ================= VALIDATION ================= */
const remarkValidationSchema = Yup.object({
    remark: Yup.string().trim().required("Remark is required"),
});

const Remarks = ({
    formData,
    edit,
    setEdit,
    setFormData,
    fetchOneStudentDetails,
    id,
    mode,
    fetchOneVisitorDetails,
    userRole,
}) => {
    const dispatch = useDispatch();
    const {canRead, canCreate, canUpdate, canDelete } = usePermissions("Student Applications",
        "Personal Details");

    const [isLoading, setIsLoading] = useState(false);
    const [showRemarkModal, setShowRemarkModal] = useState(false);

    /* ================= FORMIK ================= */
    const remarkFormik = useFormik({
        initialValues: {
            remark: "",
        },
        validationSchema: remarkValidationSchema,
        validateOnBlur: false,
        validateOnChange: true,
        onSubmit: (values) => {
            if (edit.personalDetailsRemarks) {
                handleEditRemark(values);
            } else {
                handleAddRemark(values);
            }
        },
    });

    /* ================= ADD REMARK ================= */
    const handleAddRemark = async (values) => {
        setIsLoading(true);

        try {
            const payload = {
                personalDetailsRemarks: [{ remark: values.remark.trim() }],
            };

            const res = await dispatch(
                mode === "student"
                    ? updateStudentApplication(payload, id)
                    : updateVisitorApplication(payload, id)
            );

            if (res?.status === 200) {
                if (res?.data?.data?.message) {
                    toast.error(res.data.data.message);
                    return;
                }
                toast.success("Remark added successfully");

                const newRemark = res.data.data.personalDetailsRemarks.slice(-1)[0];

                setFormData((prev) => ({
                    ...prev,
                    personalDetailsRemarks: [
                        ...(prev.personalDetailsRemarks || []),
                        newRemark,
                    ],
                }));

                setShowRemarkModal(false);
                remarkFormik.resetForm();

                if (mode === "student") fetchOneStudentDetails();
                else fetchOneVisitorDetails();
            } else {
                toast.error(res?.data?.message || "Error adding remark");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error adding remark");
        } finally {
            setIsLoading(false);
        }
    };

    /* ================= EDIT REMARK ================= */
    const handleEditRemark = async (values) => {
        setIsLoading(true);

        const updatedIndex = edit.personalDetailsRemarksIndex;
        const remarkId = formData.personalDetailsRemarks[updatedIndex]?._id;

        try {
            const payload = {
                personalDetailsRemarkId: remarkId,
                personalDetailsRemarksUpdate: { remark: values.remark.trim() },
            };

            const res = await dispatch(
                mode === "student"
                    ? updateStudentApplication(payload, id)
                    : updateVisitorApplication(payload, id)
            );

            if (res?.status === 200) {
                if (res?.data?.data?.message) {
                    toast.error(res.data.data.message);
                    return;
                }
                toast.success("Remark updated successfully");

                setFormData((prev) => {
                    const updated = [...prev.personalDetailsRemarks];
                    updated[updatedIndex] = {
                        ...updated[updatedIndex],
                        remark: values.remark.trim(),
                    };
                    return { ...prev, personalDetailsRemarks: updated };
                });

                setEdit((prev) => ({
                    ...prev,
                    personalDetailsRemarks: false,
                    personalDetailsRemarksIndex: 0,
                }));

                setShowRemarkModal(false);
                remarkFormik.resetForm();

                if (mode === "student") fetchOneStudentDetails();
                else fetchOneVisitorDetails();
            } else {
                toast.error(res?.data?.message || "Error updating remark");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error updating remark");
        } finally {
            setIsLoading(false);
        }
    };

    /* ================= DELETE REMARK ================= */
    const handleDeleteRemark = async (indexToDelete) => {
        const personalDetailsRemarksId = formData.personalDetailsRemarks[indexToDelete]?._id;
        if (!personalDetailsRemarksId) {
            toast.error("Invalid remark. Cannot delete.");
            return;
        }

        const payload = { personalDetailsRemarksId };

        try {
            const res = await dispatch(
                mode === "student"
                    ? deleteStudentApplication(payload, id)
                    : deleteVisitorApplication(payload, id)
            );

            if (res?.status === 200) {
                if (res?.data?.data?.message) {
                    toast.error(res.data.data.message);
                    return;
                }
                toast.success("Remark deleted successfully");

                setFormData((prev) => ({
                    ...prev,
                    personalDetailsRemarks: prev.personalDetailsRemarks.filter(
                        (_, i) => i !== indexToDelete
                    ),
                }));

                if (
                    edit.personalDetailsRemarks &&
                    edit.personalDetailsRemarksIndex === indexToDelete
                ) {
                    setEdit((prev) => ({
                        ...prev,
                        personalDetailsRemarks: false,
                        personalDetailsRemarksIndex: 0,
                    }));
                }

                if (mode === "student") {
                    fetchOneStudentDetails();
                } else if (mode === "visitor") {
                    fetchOneVisitorDetails();
                }
            } else {
                toast.error(res?.data?.message || "Error deleting remark");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error deleting remark");
        }
    };

    /* ================= COLUMNS ================= */
    const remarkColumns = [
        { label: "Remark", render: (item) => item?.remark || "-" },
        { label: "Created By", render: (item) => item?.createdByName || "-" },
        { label: "Updated By", render: (item) => item?.updatedByName || "-" },
    ];

    return (
        <>
            {/* ================= LOADER ================= */}
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
                    <h5>Personal Details Remarks</h5>
                    {userRole !== "Student" && userRole !== "LeadStudent" && canCreate && (
                        <Button
                            variant="primary"
                            className="custom-select-height"
                            onClick={() => {
                                remarkFormik.resetForm();
                                setEdit((prev) => ({
                                    ...prev,
                                    personalDetailsRemarks: false,
                                    personalDetailsRemarksIndex: 0,
                                }));
                                setShowRemarkModal(true);
                            }}
                        >
                            Add New
                        </Button>
                    )}
                </div>

                {/* ================= MODAL ================= */}
                <Modal
                    show={showRemarkModal}
                    onHide={() => {
                        setShowRemarkModal(false);
                        remarkFormik.resetForm();
                        setEdit((prev) => ({
                            ...prev,
                            personalDetailsRemarks: false,
                            personalDetailsRemarksIndex: 0,
                        }));
                    }}
                    size="lg"
                    centered
                >
                    <Modal.Header className="form-main-heading">
                        <Modal.Title>
                            {edit.personalDetailsRemarks ? "Update Remark" : "Add Remark"}
                        </Modal.Title>
                        <AiOutlineClose
                            size={20}
                            style={{ cursor: "pointer", color: "white" }}
                            onClick={() => {
                                setShowRemarkModal(false);
                                remarkFormik.resetForm();
                                setEdit((prev) => ({
                                    ...prev,
                                    personalDetailsRemarks: false,
                                    personalDetailsRemarksIndex: 0,
                                }));
                            }}
                        />
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={remarkFormik.handleSubmit}>
                            <Row>
                                <Col md={12} className="mb-3">
                                    <Form.Label>Remark</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="remark"
                                        className="rounded-4"
                                        placeholder="Enter your remark here..."
                                        value={remarkFormik.values.remark}
                                        onChange={remarkFormik.handleChange}
                                        onBlur={remarkFormik.handleBlur}
                                    />
                                    {remarkFormik.touched.remark && remarkFormik.errors.remark && (
                                        <div className="text-danger mt-1">
                                            {remarkFormik.errors.remark}
                                        </div>
                                    )}
                                </Col>
                            </Row>

                            <div className="text-end mt-3">
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="custom-select-height"
                                >
                                    {edit.personalDetailsRemarks ? "Update" : "Add"}
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* ================= TABLE ================= */}
                <DataTable
                    columns={remarkColumns}
                    data={canRead ? formData.personalDetailsRemarks || [] : []}
                    currentPage={1}
                    totalPages={1}
                    itemsPerPage={10}
                    onEdit={(item) => {
                        remarkFormik.setValues({ remark: item.remark || "" });
                        const index = formData.personalDetailsRemarks.indexOf(item);
                        setEdit((prev) => ({
                            ...prev,
                            personalDetailsRemarks: true,
                            personalDetailsRemarksIndex: index,
                        }));
                        setShowRemarkModal(true);
                    }}
                    onDelete={(item) => {
                        const index = formData.personalDetailsRemarks.indexOf(item);
                        handleDeleteRemark(index);
                    }}
                              canEdit={canUpdate}
                              canDelete={canDelete}
                              canRead={canRead}
                />
            </div>
        </>
    );
};

export default Remarks;