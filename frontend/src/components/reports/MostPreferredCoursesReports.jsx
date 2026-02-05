import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import Paginations from "../elements/Paginations";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import Pageheader from "../../layouts/Pageheader";
import LoadMoreButton from "../commonComponents/LoadMoreButton";
import usePermissions from "../commonComponents/usePermissions";
import {
  exportMostPreferredCourseReports,
  getAllMostPreferredCourse,
  getFilterMostPreferredCourse,
} from "../../redux/actions/Report/StudentApplicationReport.action";
import { BASEURL } from "../../baseUrl";
import { toast } from "react-toastify";
import Select from "react-select";

const MostPreferredCoursesReports = () => {
  const dispatch = useDispatch();
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [countryOptions, setCountryOptions] = useState([]);
  const [instituteOptions, setInstituteOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [courseReports, setCourseReports] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { canRead, canDownload } = usePermissions("Most Preferred Courses");

  const [filters, setFilters] = useState({
    institute: "",
    country: "",
    course: "",
  });

  const fetchFilterOptions = async () => {
    try {
      const res = await dispatch(getFilterMostPreferredCourse());
      const data = res?.data?.data || {};

      setCountryOptions(
        (data.country || []).map((country) => ({
          label: country,
          value: country,
        }))
      );

      setInstituteOptions(
        (data.institute || []).map((inst) => ({
          label: inst,
          value: inst,
        }))
      );

      setCourseOptions(
        (data.courseName || []).map((course) => ({
          label: course,
          value: course,
        }))
      );
    } catch (err) {
      console.log("Error fetching filter data", err);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const columns = [
    {
      label: "Institute Name",
      key: "instituteName",
      render: (item) => item?.course?.universityName || "-",
    },
    {
      label: "Course Name",
      key: "programName",
      render: (item) => item?.course?.programName || "-",
    },
    {
      label: "Preferred Country",
      key: "country",
      render: (item) => item?.course?.country || "-",
    },
    {
      label: "Total Applications",
      key: "count",
      render: (item) => item?.count || "-",
    },
  ];

  const fetchCourseReports = async (
    page = 1,
    limit = itemsPerPage,
    search = ""
  ) => {
    try {
      const res = await dispatch(
        getAllMostPreferredCourse(
          page,
          limit,
          search,
          filters.institute,
          filters.country,
          filters.course
        )
      );
      setCourseReports(res?.data?.data?.data || []);
      setTotalRecords(res?.data?.data?.totalCount || 0);
      setTotalPages(res?.data?.data?.totalPages || 0);
    } catch (error) {
      console.error("Error fetching course reports:", error);
      setCourseReports([]);
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchCourseReports(currentPage, itemsPerPage, search, filters);
    }
  }, [currentPage, itemsPerPage, search, canRead, filters]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // const handleExport = async () => {
  //   try {
  //     const response = await dispatch(exportMostPreferredCourseReports(search, filters.institute, filters.country, filters.course));
  //     if (response?.status === 200 && response?.data?.fileUrl) {
  //       const fileUrl = `${BASEURL}${response.data.fileUrl}`;
  //       const link = document.createElement("a");
  //       link.href = fileUrl;
  //       link.setAttribute("download", "lead_report.csv");
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //       toast.success("Most Preferred Course report downloaded successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Error exporting reports:", error);
  //   }
  // };

  const handleExport = async () => {
    try {
      setIsLoading(true);

      const res = await dispatch(
        getAllMostPreferredCourse(
          1,
          Number.MAX_SAFE_INTEGER,
          search,
          filters.institute,
          filters.country,
          filters.course
        )
      );

      const allCourseReports = res?.data?.data?.data || [];

      if (!allCourseReports || allCourseReports.length === 0) {
        toast.error("No data available to export.");
        setIsLoading(false);
        return;
      }

      const headers = columns.map((col) => col.label);

      const rows = allCourseReports.map((item) => {
        return columns.map((col) => {
          let value = col.render ? col.render(item) : item[col.key] || "-";
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
      link.setAttribute("download", "most_preferred_courses_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Most Preferred Courses report downloaded successfully!");
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
        mainheading="Most Preferred Courses"
        parentfolder="Reports"
        activepage="Most Preferred Courses"
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
                <div className="d-flex justify-content-between">
                  <div className="card-title">
                    Most Preferred Courses Report
                  </div>
                </div>
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
                {courseReports?.length > 0 && canDownload && (
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
                  <Form.Label>Country</Form.Label>
                  <Select
                    className="filter-height"
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: "13px",
                        minHeight: "38px",
                      }),
                    }}
                    options={countryOptions}
                    value={
                      countryOptions.find((c) => c.value === filters.country) ||
                      null
                    }
                    onChange={(selected) => {
                      setFilters((prev) => ({
                        ...prev,
                        country: selected ? selected.value : "",
                      }));
                      setCurrentPage(1);
                    }}
                    isClearable
                    isSearchable
                    classNamePrefix="custom-select"
                    placeholder="Select Country"
                    noOptionsMessage={() => "No country available"}
                  />
                </div>

                <div className="filter-item">
                  <Form.Label>Institute</Form.Label>
                  <Select
                    className="filter-height"
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: "13px",
                        minHeight: "38px",
                      }),
                    }}
                    options={instituteOptions}
                    value={
                      instituteOptions.find(
                        (i) => i.value === filters.institute
                      ) || null
                    }
                    onChange={(selected) => {
                      setFilters((prev) => ({
                        ...prev,
                        institute: selected ? selected.value : "",
                      }));
                      setCurrentPage(1);
                    }}
                    isClearable
                    isSearchable
                    classNamePrefix="custom-select"
                    placeholder="Select Institute"
                    noOptionsMessage={() => "No Institute available"}
                  />
                </div>

                <div className="filter-item">
                  <Form.Label>Course</Form.Label>
                  <Select
                    className="filter-height"
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: "13px",
                        minHeight: "38px",
                      }),
                    }}
                    options={courseOptions}
                    value={
                      courseOptions.find((c) => c.value === filters.course) ||
                      null
                    }
                    onChange={(selected) => {
                      setFilters((prev) => ({
                        ...prev,
                        course: selected ? selected.value : "",
                      }));
                      setCurrentPage(1);
                    }}
                    isClearable
                    isSearchable
                    classNamePrefix="custom-select"
                    placeholder="Select Course"
                    noOptionsMessage={() => "No course available"}
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
                    {courseReports?.length > 0 ? (
                      courseReports.filter(Boolean).map((item, index) => (
                        <tr
                          key={item._id || index}
                          className={`${
                            index % 2 === 0 ? "table-row-even" : "table-row-odd"
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

              {totalPages > 1 && courseReports.length > 0 && (
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

export default MostPreferredCoursesReports;
