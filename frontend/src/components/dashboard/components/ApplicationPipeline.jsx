import { Button, Card, Col, Table, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllStudentApplication } from "../../../redux/actions/Student/StudentApplication.action";
import Paginations from "../../elements/Paginations";
import usePermissions from "../../commonComponents/usePermissions";
import { decryptData } from "../../../utils/encryptionUtils";
import Select from "react-select";
import { getAllStudentStatus } from "../../../redux/actions/Student/StudentStatus.action";

const ApplicationPipeline = ({ showAll, selectedBranchId }) => {
  const dispatch = useDispatch();
  const [allStudentApplication, setAllStudentApplication] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState("");
  const [mainStatus, setMainStatus] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [studentStatuses, setStudentStatuses] = useState([]);

  const userRole = decryptData(localStorage.getItem("role"));
  const { canRead } = usePermissions("Student Applications");

  const fetchStudentStatuses = async () => {
    try {
      const res = await dispatch(getAllStudentStatus());
      if (res?.status === 200) {
        setStudentStatuses(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching student statuses:", error);
      setStudentStatuses([]);
    }
  };

  useEffect(() => {
    fetchStudentStatuses();
  }, []);

  const fetchAllStudentApplication = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    mainStatus = "",
    branchId = "",
    showAll = false,
    country = "",
  ) => {
    try {
      if (canRead) {
        const res = await dispatch(
          getAllStudentApplication(
            page,
            limit,
            search,
            mainStatus,
            branchId,
            showAll,
            country,
          ),
        );
        const responseData = res?.data?.data;
        setAllStudentApplication(responseData?.data || []);
        setTotalPages(responseData?.totalPages || 0);
        setTotalRecords(responseData?.totalRecords || 0);
      }
    } catch (error) {
      console.error("Error fetching student applications:", error);
      setAllStudentApplication([]);
      setTotalPages(0);
      setTotalRecords(0);
    }
  };

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    if (canRead) {
      const branchId = selectedBranch === "all" ? "" : selectedBranch || "";
      const newShowAll = selectedBranch === "all" ? true : showAll;
      fetchAllStudentApplication(
        currentPage,
        itemsPerPage,
        search,
        mainStatus?.value || "",
        branchId,
        newShowAll,
        selectedCountry?.value || "",
      );
    }
  }, [
    currentPage,
    itemsPerPage,
    search,
    mainStatus,
    selectedBranch,
    showAll,
    selectedBranchId,
    selectedCountry,
    canRead,
  ]);

  const studentStatusOptions = studentStatuses?.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const handleStudentStatusChange = (selectedOption) => {
    setMainStatus(selectedOption);
    setCurrentPage(1);
    if (canRead) {
      const branchId = selectedBranch === "all" ? "" : selectedBranch || "";
      const newShowAll = selectedBranch === "all" ? true : showAll;
      fetchAllStudentApplication(
        1,
        itemsPerPage,
        search,
        selectedOption?.value || "",
        branchId,
        newShowAll,
        selectedCountry?.value || "",
      );
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const columns = [
    {
      label: "Student Name",
      key: "name",
      render: (item) => item.name || "-",
    },
    {
      label: "Counselor",
      key: "createdByName",
      render: (item) => item.createdByName || "-",
    },
    {
      label: "Country",
      key: "country",
      render: (item) =>
        item.purposeDetails?.preferredCountry?.[0] || item.country || "-",
    },
    {
      label: "University",
      key: "instituteName",
      render: (item) =>
        item.interestedCourseDetails?.[0]?.institute?.instituteName || "-",
    },
    {
      label: "Status",
      key: "mainStatus",
      render: (item) => {
        const statusName = item.mainStatus?.name || "-";
        const statusColor =
          studentStatuses.find((status) => status.name === statusName)?.color ||
          "#6c757d"; // Fallback color if no match
        return (
          <span
            style={{
              backgroundColor: statusColor,
              padding: "4px 8px",
              color: "#FFF",
              borderRadius: "12px",
            }}
          >
            {statusName}
          </span>
        );
      },
    },
    {
      label: "Last Updated",
      key: "updatedAt",
      render: (item) => formatDate(item.updatedAt),
    },
    // {
    //   label: "Actions",
    //   key: "actions",
    //   render: () => (
    //     <Button variant="link" className="text-primary">
    //       View
    //     </Button>
    //   ),
    // },
  ];

  return (
    <>
      <Row className="row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card.Header>
            <div className="w-100 d-flex flex-wrap justify-content-between align-items-center gap-3">
              <h4 className="card-title mb-0">Application Status Summary</h4>
              <div className="d-flex flex-wrap">
                <div className="filter-item me-3">
                  <Select
                    className="filter-height"
                    options={studentStatusOptions}
                    value={mainStatus}
                    onChange={handleStudentStatusChange}
                    placeholder="Select Status"
                    classNamePrefix="custom-select"
                    isClearable
                    styles={{
                      control: (base) => ({
                        ...base,
                        minWidth: "150px",
                        fontSize: "13px",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        fontSize: "13px",
                      }),
                    }}
                  />
                </div>
                <div className="d-flex align-items-center">
                  <div className="filter-item filter-height total-records px-3 d-flex align-items-center">
                    <span>
                      Total Records :<strong>&nbsp;{totalRecords}</strong>
                    </span>
                  </div>
                </div>
              </div>
              {/* <Button variant="link" className="text-primary">
                  Export
                </Button>
                <Button variant="link" className="text-primary ms-2">
                  Filter
                </Button> */}
            </div>
          </Card.Header>
          <Card.Body>
            <div className="m-3">
              <div className="table-responsive">
                <table
                  className="text-nowrap border"
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
                    {allStudentApplication?.length > 0 ? (
                      allStudentApplication
                        ?.filter(Boolean)
                        ?.map((item, index) => (
                          <tr
                            key={`${item._id}-${index}`}
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
                            {canRead
                              ? "No data available"
                              : "You do not have permission to view this data"}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-3">
                {totalPages > 1 && (
                  <Paginations
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                )}
              </div>
            </div>
          </Card.Body>
        </Col>
      </Row>
    </>
  );
};

export default ApplicationPipeline;
