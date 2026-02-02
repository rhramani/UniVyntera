import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Card,
  Modal,
  Dropdown,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Paginations from "../elements/Paginations";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import DataTable from "../commonComponents/DataTable";
import Select from "react-select";
import { AiOutlineClose } from "react-icons/ai";
import { getAllDocumentList } from "../../redux/actions/Document/DocumentList.action";
import { getAllDocumentType } from "../../redux/actions/Document/DocumentType.action";
import { countryDropdown } from "../../redux/actions/Master/Institute.action";
import usePermissions from "../commonComponents/usePermissions";
import {
  createWorkPermitDocument,
  deleteWorkPermitDocument,
  getAllWorkPermitDocument,
  updateWorkPermitDocument,
} from "../../redux/actions/Document/WorkPermitDocument.action";

const WorkPermitDocument = () => {
  const dispatch = useDispatch();
  const [allWorkPermitDocument, setAllWorkPermitDocument] = useState([]);
  const [allDocumentTypes, setAllDocumentTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [highlightForm, setHighlightForm] = useState(false);
  const [show, setShow] = useState(false);
  const [allDocumentListByType, setAllDocumentListByType] = useState({});
  const [countries, setCountries] = useState([]);
  const [showDocumentDropdown, setShowDocumentDropdown] = useState({});
  const [selectedDocuments, setSelectedDocuments] = useState({});
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
  const [assignedDocumentIds, setAssignedDocumentIds] = useState({});
  const { canCreate, canRead, canUpdate, canDelete } =
    usePermissions("Work Document");

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setSelectedDocuments({});
    setSelectedCheckboxes({});
    setShowDocumentDropdown({});
    formik.resetForm();
  };

  useEffect(() => {
    if (canRead) {
      fetchWorkPermitDocuments(currentPage, itemsPerPage, search);
    }
  }, [currentPage, search]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      fetchWorkPermitDocuments(1, newItemsPerPage, search);
    }
  };

  const fetchWorkPermitDocuments = async (
    page = 1,
    limit = itemsPerPage,
    search = ""
  ) => {
    try {
      const res = await dispatch(getAllWorkPermitDocument(page, limit, search));
      const responseData = res?.data?.data;
      setAllWorkPermitDocument(responseData?.data || []);
      setTotalPages(responseData?.totalPages || 0);
      setTotalRecords(responseData?.totalRecords || 0);

      const assignedDocs = {};
      responseData?.data?.forEach((workPermitDoc) => {
        workPermitDoc.documents.forEach(({ type, documentList }) => {
          if (type?._id) {
            assignedDocs[type._id] = assignedDocs[type._id] || new Set();
            documentList.forEach((doc) => {
              assignedDocs[type._id].add(doc.document._id);
            });
          }
        });
      });
      setAssignedDocumentIds(assignedDocs);
    } catch (error) {
      console.error("Error fetching Exam:", error);
      setAllWorkPermitDocument([]);
      setTotalPages(0);
      setAssignedDocumentIds({});
    }
  };

  const fetchDocumentTypes = async (page = 1, limit = 100, search = "") => {
    try {
      const res = await dispatch(getAllDocumentType(page, limit, search));
      const responseData = res?.data?.data;
      setAllDocumentTypes(responseData?.data || []);
    } catch (error) {
      console.error("Error fetching Document Types:", error);
      setAllDocumentTypes([]);
    }
  };

  const fetchDocumentLists = async () => {
    try {
      const dataByType = {};
      for (const type of allDocumentTypes) {
        const res = await dispatch(getAllDocumentList(1, 100, "", type._id));
        const docs = res?.data?.data?.data || [];
        dataByType[type._id] = docs.map((doc) => ({
          label: doc.name,
          value: doc._id,
          typeId: type._id,
        }));
      }
      setAllDocumentListByType(dataByType);
    } catch (error) {
      console.error("Error fetching Document Lists:", error);
      setAllDocumentListByType({});
    }
  };

  const fetchCountries = async () => {
    const res = await dispatch(countryDropdown());
    setCountries(res?.data?.data || []);
  };

  useEffect(() => {
    fetchDocumentTypes();
    fetchCountries();
  }, []);

  useEffect(() => {
    if (allDocumentTypes.length > 0) {
      fetchDocumentLists();
    }
  }, [allDocumentTypes]);

  const handleCheckboxDocumentChange = (document, typeId, e) => {
    e.stopPropagation();

    setSelectedCheckboxes((prev) => {
      const currentCheckboxes = prev[typeId] || [];
      const isChecked = currentCheckboxes.some(
        (item) => item.value === document.value
      );
      let newCheckboxes;
      if (isChecked) {
        newCheckboxes = currentCheckboxes.filter(
          (item) => item.value !== document.value
        );
      } else {
        newCheckboxes = [...currentCheckboxes, document];
      }
      return { ...prev, [typeId]: newCheckboxes };
    });
  };

  const handleDocumentNameClick = (document, typeId, e) => {
    e.stopPropagation();

    setSelectedDocuments((prev) => {
      const currentDocs = prev[typeId] || [];
      const isSelected = currentDocs.some(
        (item) => item.value === document.value
      );
      let newDocs;
      if (isSelected) {
        newDocs = currentDocs.filter((item) => item.value !== document.value);
        setSelectedCheckboxes((prevCheckboxes) => {
          const currentCheckboxes = prevCheckboxes[typeId] || [];
          const updatedCheckboxes = currentCheckboxes.filter(
            (item) => item.value !== document.value
          );
          return { ...prevCheckboxes, [typeId]: updatedCheckboxes };
        });
      } else {
        newDocs = [...currentDocs, document];
      }
      const updatedDocs = { ...prev, [typeId]: newDocs };
      formik.setFieldValue("documents", updatedDocs);
      return updatedDocs;
    });
  };

  const formik = useFormik({
    initialValues: {
      country: "",
      documents: [],
      id: "",
    },
    validationSchema: Yup.object({
      country: Yup.string().required("Country is required"),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        toast.dismiss();

        const documentsPayload = [];
        Object.keys(selectedDocuments).forEach((typeId) => {
          const selectedDocsForType = selectedDocuments[typeId] || [];
          const selectedCheckboxesForType = selectedCheckboxes[typeId] || [];

          if (selectedDocsForType.length > 0) {
            documentsPayload.push({
              type: typeId,
              documentList: selectedDocsForType.map((doc) => ({
                document: doc.value,
                required: selectedCheckboxesForType.some(
                  (selectedDoc) => selectedDoc.value === doc.value
                ),
              })),
            });
          }
        });

        if (documentsPayload.length === 0) {
          toast.error("Please select at least one document.");
          return;
        }

        const payload = {
          country: values.country,
          documents: documentsPayload,
        };

        if (values.id && canUpdate) {
          const res = await dispatch(
            updateWorkPermitDocument(payload, values?.id)
          );
          if (res?.data?.code === 200) {
            toast.success("Work document updated successfully");
          }
        } else if (canCreate) {
          const res = await dispatch(createWorkPermitDocument(payload));
          if (res?.data?.code === 201) {
            toast.success("Work document added successfully");
          }
        }
        resetForm();
        setSelectedDocuments({});
        setSelectedCheckboxes({});
        if (canRead) {
          fetchWorkPermitDocuments(currentPage, itemsPerPage, search);
        }
        handleClose();
      } catch (error) {
        toast.dismiss();
        console.log("Error submitting form:", error);
        toast.error(error?.response?.data?.message);
      }
    },
  });

  const handleEdit = (countryDocument) => {
    if (canUpdate) {
      formik.setFieldValue("country", countryDocument?.country || "");
      formik.setFieldValue("id", countryDocument?._id || "");

      const documents = {};
      const checkboxes = {};

      countryDocument.documents?.forEach(({ type, documentList }) => {
        if (type?._id && allDocumentListByType[type._id]) {
          documents[type._id] = documentList.map((doc) => {
            const docOption = allDocumentListByType[type._id].find(
              (d) => d.value === doc.document._id
            );
            return (
              docOption || {
                label: doc.document?.name || "Unknown",
                value: doc.document._id,
                typeId: type._id,
              }
            );
          });

          checkboxes[type._id] = documentList
            .filter((doc) => doc.required)
            .map((doc) => {
              const docOption = allDocumentListByType[type._id].find(
                (d) => d.value === doc.document._id
              );
              return (
                docOption || {
                  label: doc.document?.name || "Unknown",
                  value: doc.document._id,
                  typeId: type._id,
                }
              );
            });
        }
      });

      setSelectedDocuments(documents);
      setSelectedCheckboxes(checkboxes);
      formik.setFieldValue("documents", documents);
      setHighlightForm(true);
      setShow(true);
    }
  };

  const handleDelete = async (countryDocument) => {
    try {
      toast.dismiss();
      const res = await dispatch(
        deleteWorkPermitDocument(countryDocument?._id)
      );
      if (res?.data?.code === 200) {
        toast.success("Work document deleted successfully");
      }
      const updatedPage =
        allWorkPermitDocument.length === 1 && currentPage > 1
          ? currentPage - 1
          : currentPage;
      setCurrentPage(updatedPage);
      if (canRead) {
        fetchWorkPermitDocuments(updatedPage, itemsPerPage, search);
      }
    } catch (error) {
      console.log("Error", error);
      toast.error("Failed to delete the Work document.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.name !== "name") {
        formik.setFieldTouched("name", false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [formik]);

  const columns = [
    {
      label: "Country",
      key: "country",
    },
    ...allDocumentTypes.map((type) => ({
      label: type.name,
      render: (item) => {
        const docEntry = item?.documents?.find(
          (doc) => doc?.type?._id.toString() === type?._id
        );
        const docNames =
          docEntry?.documentList
            ?.map((doc) => doc?.document?.name || "Unknown")
            .join(", ") || "-";
        return (
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-${type?._id}`} className="custom-tooltip">
                {docNames}
              </Tooltip>
            }
            popperConfig={{
              modifiers: [
                {
                  name: "preventOverflow",
                  options: {
                    boundary: "window",
                  },
                },
              ],
            }}
          >
            <span
              style={{
                cursor: "pointer",
                maxWidth: "200px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                display: "inline-block",
              }}
            >
              {docNames}
            </span>
          </OverlayTrigger>
        );
      },
    })),
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
    <Row className="mt-5 row-sm">
      <Col md={12} lg={12} xl={12}>
        <Card className="custom-card transcation-crypto">
          <Card.Header className="border-bottom-0">
            <div>
              <div className="card-title">
                {formik.values.id
                  ? "Update Work document"
                  : "Add Work document"}
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <form onSubmit={formik.handleSubmit}>
              <Row className="mb-3">
                <Col md={4} className="d-flex align-items-end">
                  {(canCreate || canUpdate) && (
                    <Button
                      variant="primary"
                      className="custom-select-height"
                      onClick={handleShow}
                    >
                      {formik.values.id
                        ? "Update Work document"
                        : "Add Work document"}
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
                      Total Records :<strong> {totalRecords}</strong>
                    </span>
                  </div>
                </Col>
              </Row>
            </form>

            <Modal show={show} onHide={handleClose} size="xl" centered>
              <Modal.Header className="form-main-heading">
                <Modal.Title>
                  {formik.values.id
                    ? "Update Work document"
                    : "Add Work document"}
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
                    <Col md={6} className="mb-3">
                      <Form.Label className="fw-semibold">Country</Form.Label>
                      <Select
                        options={[
                          { value: "All", label: "All" },
                          ...(countries?.map((c) => ({
                            value: c.name,
                            label: c.name,
                          })) || []),
                        ]}
                        value={
                          formik.values.country
                            ? {
                                value: formik.values.country,
                                label: formik.values.country,
                              }
                            : null
                        }
                        onChange={(selectedOptions) => {
                          formik.setFieldValue(
                            "country",
                            selectedOptions?.value || ""
                          );
                        }}
                        placeholder="Select Country"
                        classNamePrefix="custom-select"
                        isClearable
                        isSearchable
                        noOptionsMessage={() => "No countries available"}
                      />
                      {formik.touched.country && formik.errors.country && (
                        <div className="text-danger">
                          {formik.errors.country}
                        </div>
                      )}
                    </Col>
                    {allDocumentTypes?.map((type) => (
                      <Col md={6} key={type._id}>
                        <Form.Group
                          className="mb-3"
                          controlId={`document-${type._id}`}
                        >
                          <Form.Label className="fw-semibold">
                            {type?.name}
                          </Form.Label>
                          <Dropdown
                            show={showDocumentDropdown[type._id] || false}
                            onToggle={(isOpen) =>
                              setShowDocumentDropdown((prev) => ({
                                ...prev,
                                [type._id]: isOpen,
                              }))
                            }
                          >
                            <Dropdown.Toggle
                              className={`month-dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center border${
                                !selectedDocuments[type._id]?.length
                                  ? "text-muted"
                                  : ""
                              }`}
                              style={{
                                height: "38px",
                                fontSize: "13px",
                                padding: "8px 12px",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  flexGrow: 1,
                                  overflowX: "auto",
                                  overflowY: "hidden",
                                  whiteSpace: "nowrap",
                                  marginRight: "8px",
                                }}
                                className="d-flex align-items-center gap-2"
                              >
                                {selectedDocuments[type._id]?.length > 0 ? (
                                  selectedDocuments[type._id].map((doc) => (
                                    <span
                                      key={doc.value}
                                      className="text-black rounded-4 px-2 py-1"
                                      style={{
                                        fontSize: "12px",
                                        backgroundColor: "#E9ECEF",
                                        flexShrink: 0,
                                      }}
                                    >
                                      {doc.label}
                                    </span>
                                  ))
                                ) : (
                                  <span
                                    style={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    Select {type.name}
                                  </span>
                                )}
                              </div>
                            </Dropdown.Toggle>
                            <Dropdown.Menu
                              className="month-dropdown-menu w-100"
                              style={{
                                borderRadius: "8px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                maxHeight: "200px",
                                overflowY: "auto",
                              }}
                            >
                              {allDocumentListByType[type._id]
                                ?.sort((a, b) =>
                                  a.label?.localeCompare(b.label)
                                )
                                ?.map((document) => (
                                  <div
                                    key={document.value}
                                    className="d-flex align-items-center px-2 py-1"
                                    style={{
                                      transition: "background-color 0.2s",
                                      ":hover": { backgroundColor: "#f1f1f1" },
                                    }}
                                  >
                                    <Form.Check
                                      name={`document-${type._id}`}
                                      type="checkbox"
                                      id={`checkbox-${document.value}`}
                                      checked={(
                                        selectedCheckboxes[type._id] || []
                                      ).some(
                                        (item) => item.value === document.value
                                      )}
                                      onChange={(e) =>
                                        handleCheckboxDocumentChange(
                                          document,
                                          type._id,
                                          e
                                        )
                                      }
                                      className="me-2 custom-checkbox"
                                      style={{ flexShrink: 0 }}
                                    />
                                    <span
                                      onClick={(e) =>
                                        handleDocumentNameClick(
                                          document,
                                          type._id,
                                          e
                                        )
                                      }
                                      style={{
                                        fontSize: "14px",
                                        color: selectedDocuments[
                                          type._id
                                        ]?.some(
                                          (item) =>
                                            item.value === document.value
                                        )
                                          ? "#007bff"
                                          : "#333",
                                        flexGrow: 1,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        cursor: "pointer",
                                        fontWeight: selectedDocuments[
                                          type._id
                                        ]?.some(
                                          (item) =>
                                            item.value === document.value
                                        )
                                          ? "bold"
                                          : "normal",
                                      }}
                                    >
                                      {document.label}
                                    </span>
                                  </div>
                                ))}
                            </Dropdown.Menu>
                          </Dropdown>
                        </Form.Group>
                      </Col>
                    ))}
                  </Row>
                  {formik.touched.documents && formik.errors.documents && (
                    <div className="text-danger">{formik.errors.documents}</div>
                  )}
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
              data={allWorkPermitDocument}
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

            {totalPages > 1 && allWorkPermitDocument.length > 0 && (
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
  );
};

export default WorkPermitDocument;
