import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import usePermissions from "../commonComponents/usePermissions";
import { decryptData } from "../../utils/encryptionUtils";
import {
  getUniversityPaymentCollectionReport,
  universityPaymentCollectionReportsExport,
} from "../../redux/actions/Report/StudentApplicationReport.action";
import LoadMoreButton from "../commonComponents/LoadMoreButton";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import Pageheader from "../../layouts/Pageheader";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import Paginations from "../elements/Paginations";
import { BASEURL } from "../../baseUrl";
import { toast } from "react-toastify";
import getSymbolFromCurrency from "currency-symbol-map";

const UniversityPaymentReports = () => {
  const dispatch = useDispatch();
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [universityPaymentData, setUniversityPaymentData] = useState([]);
  const [search, setSearch] = useState("");
  const { canRead, canDownload } = usePermissions("University Payment");
  const [isLoading, setIsLoading] = useState(false);
  const [totalCommission, setTotalCommission] = useState(0);

  const userRole = decryptData(localStorage.getItem("role"));
  const storedEncryptedCurrency = decryptData(
    localStorage.getItem("crmCurrency")
  );

  const columns = [
    { label: "Country", render: (item) => (item ? item?.country : "-") },
    { label: "Campus", render: (item) => (item ? item?.campusName : "-") },
    {
      label: "Institute Name",
      render: (item) => (item ? item?.instituteName : "-"),
    },
    {
      label: "Total Students",
      render: (item) => (item ? item?.totalStudents : "-"),
    },
    {
      label: "Total Commission",
      render: (item) => (item ? item?.totalCommission : "-"),
    },
  ];

  const fetchUniversityPaymentCollection = async (
    page = 1,
    limit = itemsPerPage,
    search = ""
  ) => {
    try {
      const res = await dispatch(
        getUniversityPaymentCollectionReport(page, limit, search)
      );
      const data = res?.data?.data?.data?.data || [];
      setUniversityPaymentData(data);
      setTotalRecords(res?.data?.data?.data?.totalRecords || 0);
      setTotalPages(res?.data?.data?.data?.totalPages || 0);

      // Calculate total commission
      const total = data?.reduce((sum, item) => {
        const commission = item?.totalCommission
          ? parseFloat(item.totalCommission)
          : 0;
        return sum + (isNaN(commission) ? 0 : commission);
      }, 0);
      setTotalCommission(total);
    } catch (error) {
      console.error("Error fetching university payment reports:", error);
      setUniversityPaymentData([]);
      setTotalCommission(0);
    }
  };

  // const handleExport = async () => {
  //   try {
  //     const response = await dispatch(
  //       universityPaymentCollectionReportsExport()
  //     );
  //     if (response?.status === 200 && response?.data?.fileUrl) {
  //       const fileUrl = `${BASEURL}${response.data.fileUrl}`;
  //       const link = document.createElement("a");
  //       link.href = fileUrl;
  //       link.setAttribute("download", "finance_summary.csv");
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //       toast.success("Finance Summary report downloaded successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Error exporting reports:", error);
  //   }
  // };

  const handleExport = async (page = 1, limit = 10000, search = "") => {
    try {
      setIsLoading(true);
      const res = await dispatch(
        getUniversityPaymentCollectionReport(page, limit, search)
      );
      const dataToExport = res?.data?.data?.data?.data || [];

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
      link.setAttribute("download", "university_payment.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("University Payment report downloaded successfully!");
    } catch (error) {
      console.error("Error exporting report:", error);
      toast.error("Something went wrong while exporting the report.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchUniversityPaymentCollection(currentPage, itemsPerPage, search);
    }
  }, [currentPage, itemsPerPage, search]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <>
      <Pageheader
        mainheading="University Payment"
        parentfolder="Reports"
        activepage="University Payment"
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
                <div className="card-title">University Payment report</div>
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
                  />
                </div>
                  {universityPaymentData?.length > 0 && canDownload && (
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
                <div className="flex-grow-1"></div>
                <div className="custom-select-height px-3 mt-2 mt-md-0 d-flex align-items-center bg-success bg-opacity-10 border border-success rounded">
                  <span className="text-success fw-semibold">
                    <i className="bi bi-check-circle me-2"></i>
                    Total Commission:{" "}
                    <strong>
                      {storedEncryptedCurrency
                        ? getSymbolFromCurrency(storedEncryptedCurrency)
                        : "₹"}{" "}
                      {universityPaymentData?.length > 0
                        ? totalCommission?.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })
                        : "-"}
                    </strong>
                  </span>
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

              <div className="table-responsive">
                <table
                  className="text-nowrap border"
                  style={{ tableLayout: "auto" }}
                >
                  <thead className="text-uppercase">
                    <tr>
                      {columns?.map((col, index) => (
                        <th
                          key={index}
                          scope="col"
                          className={`dynamic-width ${
                            col.label === "Age" ? "center-align" : ""
                          }`}
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {universityPaymentData?.length > 0 ? (
                      universityPaymentData
                        .filter(Boolean)
                        .map((item, index) => (
                          <tr
                            key={index}
                            className={`${
                              index % 2 === 0
                                ? "table-row-even"
                                : "table-row-odd"
                            }`}
                          >
                            {columns?.map((col, colIndex) => (
                              <td
                                key={colIndex}
                                className={`dynamic-width-data ${
                                  col.isLongText ? "long-text" : ""
                                } ${col.label === "Age" ? "center-align" : ""}`}
                              >
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

              {totalPages > 1 && universityPaymentData.length > 0 && (
                <div className="mt-4 d-flex">
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

export default UniversityPaymentReports;
