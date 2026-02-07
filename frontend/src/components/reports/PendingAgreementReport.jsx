import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import Paginations from "../elements/Paginations";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import Pageheader from "../../layouts/Pageheader";
import LoadMoreButton from "../commonComponents/LoadMoreButton";
import usePermissions from "../commonComponents/usePermissions";
import {
  exportPendingAgreementReports,
  getAllPendingAgreement,
} from "../../redux/actions/Report/StudentApplicationReport.action";
import { toast } from "react-toastify";
import { BASEURL } from "../../baseUrl";
import Select from "react-select";
import { getAllStudentStatus } from "../../redux/actions/Student/StudentStatus.action";

const PendingAgreementReport = () => {
  const dispatch = useDispatch();
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [agreementReports, setAgreementReports] = useState([]);
  const [studentStatuses, setStudentStatuses] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { canRead, canDownload } = usePermissions("Pending Agreement");
  const [filters, setFilters] = useState({
    status: "",
  });
  const columns = [
    {
      label: "Student Id",
      key: "studentId",
    },
    {
      label: "Student Name",
      key: "name",
    },
    {
      label: "Type",
      key: "created_by_type",
    },
    {
      label: "Preferred Country",
      render: (item) => item?.preferredCountry.join(", ") || "-",
    },
    {
      label: "Institute Name",
      key: "instituteName",
      render: (item) => {
        const instituteName = item.instituteName || "-";

        return (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{instituteName}</Tooltip>}
          >
            <span style={{ cursor: "pointer" }}>{instituteName}</span>
          </OverlayTrigger>
        );
      },
    },
    {
      label: "Course Name",
      key: "courseName",
      render: (item) => {
        const courseName = item.courseName || "-";

        return (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{courseName}</Tooltip>}
          >
            <span style={{ cursor: "pointer" }}>{courseName}</span>
          </OverlayTrigger>
        );
      },
    },
    {
      label: "Status",
      key: "status",
      render: (item) => {
        return (
          <span
            style={{
              backgroundColor: item?.color,
              padding: "4px 8px",
              color: item?.status ? "#FFF" : "#000",
              borderRadius: "12px",
            }}
          >
            {item?.status || "-"}
          </span>
        );
      },
    },
    {
      label: "Intake Year",
      key: "intakeYear",
    },
    {
      label: "Email Id",
      key: "email",
    },
    {
      label: "Phone Number",
      key: "contact",
    },
  ];

  const applicationStatusOptions = studentStatuses.map((status) => ({
    value: status._id,
    label: status.name,
  }));

  const fetchAgreementReports = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    status = filters.status,
  ) => {
    try {
      const res = await dispatch(
        getAllPendingAgreement(page, limit, search, status),
      );
      setAgreementReports(res?.data?.data?.data || []);
      setTotalRecords(res?.data?.data?.totalRecords || 0);
      setTotalPages(res?.data?.data?.totalPages || 0);
    } catch (error) {
      console.error("Error fetching pending agreement reports:", error);
      setAgreementReports([]);
    }
  };

  const fetchStudentStatuses = async () => {
    try {
      const res = await dispatch(getAllStudentStatus());
      if (res?.status === 200) {
        setStudentStatuses(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching student statuses:", error);
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchAgreementReports(currentPage, itemsPerPage, search, filters.status);
    }
  }, [currentPage, itemsPerPage, search, canRead, filters]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchStudentStatuses();
  }, []);

  // const handleExport = async () => {
  //   try {
  //     const response = await dispatch(
  //       exportPendingAgreementReports(search, filters.status)
  //     );
  //     if (response?.status === 200 && response?.data?.fileUrl) {
  //       const fileUrl = `${BASEURL}${response.data.fileUrl}`;
  //       const link = document.createElement("a");
  //       link.href = fileUrl;
  //       link.setAttribute("download", "pending_agreement.csv");
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //       toast.success("Pending Agreement report downloaded successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Error exporting reports:", error);
  //   }
  // };

  const handleExport = async () => {
    try {
      setIsLoading(true);

      const res = await dispatch(
        getAllPendingAgreement(
          1,
          Number.MAX_SAFE_INTEGER,
          search,
          filters.status,
        ),
      );

      const allAgreementReports = res?.data?.data?.data || [];

      if (!allAgreementReports || allAgreementReports.length === 0) {
        toast.error("No data available to export.");
        setIsLoading(false);
        return;
      }

      const headers = columns.map((col) => col.label);

      const rows = allAgreementReports.map((item) => {
        return columns.map((col) => {
          let value = col.render ? col.render(item) : item[col.key] || "-";
          if (
            (col.key === "instituteName" || col.key === "courseName") &&
            React.isValidElement(value)
          ) {
            value = value.props.children.props.children || "-";
          }
          if (col.key === "status" && React.isValidElement(value)) {
            value = value.props.children || "-";
          }
          return String(value).replace(/"/g, '""');
        });
      });

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", "pending_agreement_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Pending Agreement report downloaded successfully!");
    } catch (error) {
      console.error("Error exporting reports:", error);
      toast.error("Something went wrong while exporting the report.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Pageheader
        mainheading="Pending Agreements"
        parentfolder="Reports"
        activepage="Pending Agreements"
      />

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

      <Row className="mt-2">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div className="w-100 d-flex flex-wrap justify-content-between">
                <div className="card-title">Pending Agreements Report</div>
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
                      placeholder="Search here..."
                      autoComplete="off"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                  {agreementReports?.length > 0 && canDownload && (
                    <Button
                      variant="primary"
                      className="custom-select-height px-3"
                      onClick={() => handleExport()}
                    >
                      Export Report
                    </Button>
                  )}
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap align-items-end gap-2 mb-3">
                <div className="filter-item">
                  <Form.Label>Application Status</Form.Label>
                  <Select
                    className="filter-height"
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: "13px",
                        minHeight: "38px",
                      }),
                    }}
                    options={applicationStatusOptions}
                    value={
                      applicationStatusOptions.find(
                        (option) => option.value === filters.status,
                      ) || null
                    }
                    onChange={(selectedOption) => {
                      setFilters({
                        ...filters,
                        status: selectedOption ? selectedOption.value : "",
                      });
                      setCurrentPage(1);
                    }}
                    placeholder="Select Status"
                    isClearable
                    isSearchable
                    classNamePrefix="custom-select"
                    noOptionsMessage={() => "No statuses available"}
                  />
                </div>
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

              <div
                className="table-responsive modern-table-wrapper"
                style={{
                  borderRadius: "12px",
                  border: "1px solid #dee2e6",
                }}
              >
                <table
                  className="table table-hover modern-table table-nowrap"
                  style={{ tableLayout: "auto" }}
                >
                  <thead className="text-uppercase">
                    <tr>
                      {columns?.map((col, index) => (
                        <th key={index} scope="col" className="dynamic-width">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {agreementReports?.length > 0 ? (
                      agreementReports?.filter(Boolean)?.map((item, index) => (
                        <tr
                          key={`${item._id}-${index}`}
                          className={`${
                            index % 2 === 0 ? "table-row-even" : "table-row-odd"
                          }`}
                        >
                          {columns?.map((col, colIndex) => (
                            <td key={colIndex} className="dynamic-width-data">
                              {col.render
                                ? col?.render(item, index)
                                : item[col?.key] || "-"}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr className="no-data-row">
                        <td colSpan={columns.length}>
                          <div className="no-data-text">
                            {!canRead
                              ? "You do not have permission to view this Data"
                              : "No data available"}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && agreementReports.length > 0 && (
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

export default PendingAgreementReport;
