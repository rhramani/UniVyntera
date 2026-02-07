import { useDispatch } from "react-redux";
import usePermissions from "../commonComponents/usePermissions";
import { useEffect, useState } from "react";
import {
  partnerConversionReportExport,
  partnerConversionReportGetAll,
} from "../../redux/actions/Report/StudentApplicationReport.action";
import LoadMoreButton from "../commonComponents/LoadMoreButton";
import Pageheader from "../../layouts/Pageheader";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import Paginations from "../elements/Paginations";
import Select from "react-select";
import { BASEURL } from "../../baseUrl";
import { toast } from "react-toastify";

const PartnerConversion = () => {
  const dispatch = useDispatch();
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [b2BPartnerConversion, setB2BPartnerConversion] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { canRead, canCreate, canUpdate, canDelete, canDownload } =
    usePermissions("Partner Conversion");

  const [filters, setFilters] = useState({
    type: "",
  });

  const b2bPartnerOptions = [
    { value: "b2b", label: "B2B Partner" },
    { value: "branch", label: "Branch" },
  ];

  const columns = [
    {
      label: "Type",
      key: "type",
    },
    {
      label: "Name",
      key: "name",
    },
    {
      label: "Total Students",
      key: "totalStudents",
    },
    {
      label: "Enrolled Students",
      key: "enrolledStudents",
    },
  ];

  const fetchB2BPartnerConversion = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    type = filters.type?.value || ""
  ) => {
    try {
      const res = await dispatch(
        partnerConversionReportGetAll(page, limit, search, type)
      );
      setB2BPartnerConversion(res?.data?.data?.data || []);
      setTotalRecords(res?.data?.data?.totalRecords || 0);
      setTotalPages(res?.data?.data?.totalPages || 0);
    } catch (error) {
      console.error("Error fetching b2b partner conversion:", error);
      setB2BPartnerConversion([]);
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchB2BPartnerConversion(
        currentPage,
        itemsPerPage,
        search,
        filters.type?.value
      );
    }
  }, [currentPage, itemsPerPage, search, canRead, filters]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };
  // const handleExport = async () => {
  //   try {
  //     const response = await dispatch(partnerConversionReportExport(selectedType || ""));
  //     if (response?.status === 200 && response?.data?.fileUrl) {
  //       const fileUrl = `${BASEURL}${response.data.fileUrl}`;
  //       const link = document.createElement("a");
  //       link.href = fileUrl;
  //       link.setAttribute("download", "partner_conversion.csv");
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //       toast.success("Partner Conversion report downloaded successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Error exporting reports:", error);
  //   }
  // };

  const handleExport = async (
    page = 1,
    limit = 10000,
    search = "",
    type = filters.type?.value || ""
  ) => {
    try {
      setIsLoading(true);
      const res = await dispatch(
        partnerConversionReportGetAll(page, limit, search, type)
      );
      const dataToExport = res?.data?.data?.data || [];

      if (!dataToExport || dataToExport.length === 0) {
        toast.error("No data available to export.");
        return;
      }

      const headers = columns.map((col) => col.label);

      const rows = dataToExport.map((item) => {
        return columns.map((col) => {
          const value = col.render ? col.render(item) : item[col.key] || "-";
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
      link.setAttribute("download", "partner_conversion.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Partner Conversion report downloaded successfully!");
    } catch (error) {
      console.error("Error exporting report:", error);
      toast.error("Something went wrong while exporting the report.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Pageheader
        mainheading="Partner Conversion"
        parentfolder="Reports"
        activepage="Partner Conversion"
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
              <div className="w-100 d-flex flex-wrap justify-content-end">
                {/* <div className="card-title">Partner Conversion Report</div> */}
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
                {b2BPartnerConversion?.length > 0 && canDownload && (
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
              {canRead && (
                <>
                  <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
                    <div className="filter-item">
                      <Form.Label>Type</Form.Label>
                      <Select
                        options={b2bPartnerOptions}
                        value={filters.type}
                        onChange={(option) => {
                          setSelectedType(option?.value);
                          setFilters({ ...filters, type: option });
                          setCurrentPage(1);
                        }}
                        placeholder="Select Type"
                        className="filter-height"
                        classNamePrefix="custom-select"
                        isClearable
                        styles={{
                          control: (base) => ({
                            ...base,
                            fontSize: "13px",
                            minHeight: "38px",
                          }),
                        }}
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
                          Total Records :<strong> {totalRecords}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="table-responsive modern-table-wrapper"
                style={{
                  borderRadius: "12px",
                  border: "1px solid #dee2e6",
                }}>
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
                    {b2BPartnerConversion?.length > 0 ? (
                      b2BPartnerConversion
                        .filter(Boolean)
                        .map((item, index) => (
                          <tr
                            key={item._id || index}
                            className={`${
                              index % 2 === 0
                                ? "table-row-even"
                                : "table-row-odd"
                            }`}
                          >
                            {columns?.map((col, colIndex) => (
                              <td key={colIndex} className="dynamic-width-data">
                                {col.render
                                  ? col.render(item, index)
                                  : item[col.key] || "-"}
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

              {totalPages > 1 && b2BPartnerConversion.length > 0 && (
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
export default PartnerConversion;
