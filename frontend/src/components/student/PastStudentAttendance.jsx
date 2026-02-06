import React, { useEffect, useRef, useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Table,
  Form,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { Check, Close } from "@mui/icons-material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Pageheader from "../../layouts/Pageheader";
import Paginations from "../elements/Paginations";
import usePermissions from "../commonComponents/usePermissions";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import { AiOutlineClose } from "react-icons/ai";
import {
  getAllPastStudentAttendance,
  createAndUpdateAttendance,
  getCoachingStudent,
  deleteAttendance,
} from "../../redux/actions/Student/StudentApplication.action";
import { useDispatch } from "react-redux";
import { MdCalendarToday } from "react-icons/md";
import Select from "react-select";
import { useFormik } from "formik";
import { toast } from "react-toastify";
// Utility to get Monday of the week for a given date
const getMondayOfWeek = (date) => {
  const newDate = new Date(date);
  const day = newDate.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Adjust to Monday
  newDate.setDate(newDate.getDate() + diff);
  return newDate;
};

const PastStudentAttendance = () => {
  const dispatch = useDispatch();
  const [pastAttendance, setPastAttendance] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [coachingStudents, setCoachingStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [startDate, setStartDate] = useState(getMondayOfWeek(new Date())); // Start from Monday
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const { canRead } = usePermissions("Past Attendance");

  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [pendingAbsent, setPendingAbsent] = useState(null);
  const [remarkInput, setRemarkInput] = useState("");

  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const startDateInputRef = useRef(null);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [endDateValue, setEndDateValue] = useState(null);
  const endDateInputRef = useRef(null);
  const startDateCalendarRef = useRef(null);
  const endDateCalendarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        startDateInputRef.current &&
        !startDateInputRef.current.contains(event.target) &&
        startDateCalendarRef.current &&
        !startDateCalendarRef.current.contains(event.target)
      ) {
        setShowStartDateCalendar(false);
      }
      if (
        endDateInputRef.current &&
        !endDateInputRef.current.contains(event.target) &&
        endDateCalendarRef.current &&
        !endDateCalendarRef.current.contains(event.target)
      ) {
        setShowEndDateCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    studentId: "",
  });

  const attendanceFormik = useFormik({
    initialValues: {
      student: "",
      date: "",
      status: null,
      remarks: "",
    },
    onSubmit: async (values) => {
      try {
        toast.dismiss();
        const student = coachingStudents?.find(
          (s) => s?._id === values?.student
        );
        const studentName = student ? student?.name : "Unknown Student";
        const attendanceStatus = values?.status ? "present" : "absent";
        const res = await dispatch(createAndUpdateAttendance(values));
        if (res?.status === 200) {
          toast.success(`${studentName} is ${attendanceStatus}`);
          if (canRead) {
            fetchAllAttendanceStudents(
              filters.startDate,
              filters.endDate,
              filters.studentId,
              currentPage,
              itemsPerPage
            );
          }
        }
      } catch (error) {
        toast.error("Error updating pastAttendance");
        console.error("Error updating pastAttendance:", error);
      }
    },
  });

  const formatShort = (date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const generateDates = () => {
    const dates = [];
    const monday = getMondayOfWeek(startDate);
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

  const getAttendanceStatus = (student, date) => {
    const record = pastAttendance?.find(
      (r) => r?.student === student && r?.date === date
    );
    return record || { status: null, remarks: "" };
  };

  const setLocalStatus = (student, date, nextStatus, remarks = "") => {
    setPastAttendance((prev) => {
      const filtered = prev.filter(
        (r) => !(r.student === student && r.date === date)
      );
      if (nextStatus === null) return filtered;
      return [...filtered, { student, date, status: nextStatus, remarks }];
    });
  };

  const submitAttendance = (student, date, statusBool, remarks) => {
    attendanceFormik.setValues({
      student,
      date,
      status: statusBool,
      remarks: remarks || "",
    });
    attendanceFormik.submitForm();
  };

  const clearAttendanceOnServer = async (student, date) => {
    try {
      const res = await dispatch(deleteAttendance(student, date));
      if (res?.status === 200 && canRead) {
        fetchAllAttendanceStudents(
          filters.startDate,
          filters.endDate,
          filters.studentId,
          currentPage,
          itemsPerPage
        );
      }
    } catch (err) {
      toast.error("Failed to clear pastAttendance");
      console.error("Clear pastAttendance failed:", err);
    }
  };

  const toggleAttendance = (student, date) => {
    const currentStatus = getAttendanceStatus(student, date).status;
    if (currentStatus === null) {
      setLocalStatus(student, date, "present", "");
      submitAttendance(student, date, true, "");
    } else if (currentStatus === "present") {
      setPendingAbsent({ student, date });
      setRemarkInput("");
      setShowRemarkModal(true);
    } else if (currentStatus === "absent") {
      setLocalStatus(student, date, null);
      clearAttendanceOnServer(student, date);
    }
  };

  const confirmAbsentWithRemark = () => {
    if (!pendingAbsent) return;
    const { student, date } = pendingAbsent;
    setLocalStatus(student, date, "absent", remarkInput);
    submitAttendance(student, date, false, remarkInput);
    setShowRemarkModal(false);
    setPendingAbsent(null);
    setRemarkInput("");
  };

  const prevWeek = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() - 7);
    setStartDate(getMondayOfWeek(newDate));
  };

  const nextWeek = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + 7);
    setStartDate(getMondayOfWeek(newDate));
  };

  const goToCurrentWeek = () => {
    setStartDate(getMondayOfWeek(new Date()));
  };

  const fetchAllAttendanceStudents = async (
    startDate = filters.startDate,
    endDate = filters.endDate,
    studentId = filters.studentId,
    page = 1,
    limit = itemsPerPage
  ) => {
    try {
      setLoading(true);
      const response = await dispatch(
        getAllPastStudentAttendance(startDate, endDate, studentId, page, limit)
      );
      const students = response?.data?.data?.data || [];
      setStudentsData(students);
      setTotalRecords(response?.data?.data?.totalRecords || 0);
      setTotalPages(response?.data?.data?.totalPages || 0);

      const apiAttendance = [];
      students?.forEach((student) => {
        student?.attendenceRecords?.forEach((att) => {
          apiAttendance.push({
            student: student._id || student.id,
            date: att.date.includes("T") ? att.date.split("T")[0] : att.date,
            status: att.status === true ? "present" : "absent",
            remarks: att.remarks || "",
          });
        });
      });
      setPastAttendance(apiAttendance);
    } catch (error) {
      toast.error("Error fetching pastAttendance data");
      console.error("Error fetching pastAttendance students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchAllAttendanceStudents(
        filters.startDate,
        filters.endDate,
        filters.studentId,
        currentPage,
        itemsPerPage
      );
    }
  }, [canRead, filters, itemsPerPage, currentPage]);

  const fetchAllCoachingStudents = async () => {
    try {
      setLoading(true);
      const response = await dispatch(
        getCoachingStudent(1, 10000000, "", "", "", "", "", "")
      );
      setCoachingStudents(response?.data?.data?.data || []);
    } catch (error) {
      toast.error("Error fetching students");
      console.error("Error fetching coaching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCoachingStudents();
  }, []);

  const getButtonStyle = (status, buttonType) => {
    const baseStyle = {
      width: 32,
      height: 32,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      //   cursor: "pointer",
    };
    if (status === buttonType) {
      if (buttonType === "present") {
        return {
          ...baseStyle,
          backgroundColor: "#d4f5d4",
          color: "green",
          border: "2px solid green",
        };
      }
      if (buttonType === "absent") {
        return {
          ...baseStyle,
          backgroundColor: "#fddddd",
          color: "red",
          border: "2px solid red",
        };
      }
    }
    return { ...baseStyle, backgroundColor: "#E8E8F7", color: "#555" };
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const formatDate = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      return new Date(`${year}-${month}-${day}`);
    }
    if (dateStr.includes("-")) {
      return new Date(dateStr);
    }
    return null;
  };

  const toISODate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const studentsOptions = coachingStudents?.map((student) => ({
    value: student._id,
    label: student.name,
  }));

  const selectStyles = {
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
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <>
      <Pageheader
        mainheading="Past Attendance"
        parentfolder="Applications"
        activepage="Past Attendance"
      />

      <Row className="mt-5 row-sm">
        <Col md={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0 d-flex justify-content-end align-items-center">
              {/* <div className="card-title">Past Attendance</div> */}
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <Button
                  variant="light"
                  onClick={prevWeek}
                  aria-label="Previous Week"
                >
                  <BiChevronLeft size={20} />
                </Button>
                <Button
                  variant="light"
                  onClick={goToCurrentWeek}
                  aria-label="Current Week"
                >
                  Current Week
                </Button>
                <h6
                  className="mb-0"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  {formatShort(dates[0])} - {formatShort(dates[6])}
                </h6>
                <Button
                  variant="light"
                  onClick={nextWeek}
                  aria-label="Next Week"
                >
                  <BiChevronRight size={20} />
                </Button>
                {showCalendar && (
                  <div
                    style={{
                      position: "absolute",
                      top: "70px",
                      right: "20px",
                      zIndex: 10,
                      background: "rgba(255, 255, 255, 0.8)",
                      backdropFilter: "blur(5px)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                      borderRadius: "8px",
                      padding: "10px",
                      width: 300,
                      minWidth: 300,
                      maxWidth: 300,
                    }}
                  >
                    <Calendar
                      className="form-control m-0 p-0 border-0"
                      onChange={(date) => {
                        setStartDate(getMondayOfWeek(date));
                        setShowCalendar(false);
                      }}
                      value={startDate}
                      tileClassName={({ date }) => {
                        const monday = getMondayOfWeek(startDate);
                        const sunday = new Date(monday);
                        sunday.setDate(monday.getDate() + 6);
                        if (
                          date >= monday &&
                          date <= sunday &&
                          date.getDay() !== 0 &&
                          date.getDay() !== 6
                        ) {
                          return "highlight-week";
                        }
                        return null;
                      }}
                    />
                  </div>
                )}
              </div>
            </Card.Header>

            <Card.Body>
              {loading && <div className="text-center py-3">Loading...</div>}
              {canRead && !loading && (
                <div className="d-flex flex-column flex-md-row flex-wrap align-items-start align-items-md-end gap-3 mb-3">
                  <div className="filter-item">
                    <Form.Label>Start Date</Form.Label>
                    <div style={{ position: "relative" }}>
                      <Form.Control
                        type="text"
                        className="filter-height"
                        placeholder="dd/mm/yyyy"
                        value={
                          filters.startDate
                            ? formatDate(parseDate(filters.startDate))
                            : ""
                        }
                        readOnly
                        ref={startDateInputRef}
                        onClick={() => {
                          if (filters.startDate) {
                            setStartDateValue(parseDate(filters.startDate));
                          }
                          setShowStartDateCalendar((show) => !show);
                        }}
                        style={{ cursor: "pointer", backgroundColor: "#fff" }}
                        aria-label="Select Start Date"
                      />
                      {filters.startDate ? (
                        <button
                          type="button"
                          onClick={() => {
                            setFilters({ ...filters, startDate: "" });
                            setStartDateValue(null);
                            setShowStartDateCalendar(false);
                          }}
                          style={{
                            position: "absolute",
                            right: 8,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 16,
                            color: "#888",
                            padding: 0,
                            zIndex: 10000,
                          }}
                          aria-label="Clear start date"
                        >
                          ×
                        </button>
                      ) : (
                        <MdCalendarToday
                          style={{
                            position: "absolute",
                            right: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#888",
                            pointerEvents: "none",
                          }}
                          size={20}
                        />
                      )}
                      {showStartDateCalendar && (
                        <div
                          ref={startDateCalendarRef}
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: "0",
                            zIndex: 9999,
                            background: "#fff",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                            borderRadius: "8px",
                            marginTop: "4px",
                            width: 300,
                            minWidth: 300,
                            maxWidth: 300,
                          }}
                        >
                          <Calendar
                            className="form-control m-0 p-0 border-0"
                            onChange={(selectedDate) => {
                              setStartDateValue(selectedDate);
                              setFilters({
                                ...filters,
                                startDate: toISODate(selectedDate),
                              });
                              setShowStartDateCalendar(false);
                              setCurrentPage(1);
                            }}
                            value={startDateValue}
                            locale="en-GB"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="filter-item">
                    <Form.Label>End Date</Form.Label>
                    <div style={{ position: "relative" }}>
                      <Form.Control
                        type="text"
                        className="filter-height"
                        placeholder="dd/mm/yyyy"
                        value={
                          filters.endDate
                            ? formatDate(parseDate(filters.endDate))
                            : ""
                        }
                        readOnly
                        ref={endDateInputRef}
                        onClick={() => {
                          if (filters.endDate) {
                            setEndDateValue(parseDate(filters.endDate));
                          }
                          setShowEndDateCalendar((show) => !show);
                        }}
                        style={{ cursor: "pointer", backgroundColor: "#fff" }}
                        aria-label="Select End Date"
                      />
                      {filters.endDate ? (
                        <button
                          type="button"
                          onClick={() => {
                            setFilters({ ...filters, endDate: "" });
                            setEndDateValue(null);
                            setShowEndDateCalendar(false);
                          }}
                          style={{
                            position: "absolute",
                            right: 8,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 16,
                            color: "#888",
                            padding: 0,
                            zIndex: 10000,
                          }}
                          aria-label="Clear end date"
                        >
                          ×
                        </button>
                      ) : (
                        <MdCalendarToday
                          style={{
                            position: "absolute",
                            right: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#888",
                            pointerEvents: "none",
                          }}
                          size={20}
                        />
                      )}
                      {showEndDateCalendar && (
                        <div
                          ref={endDateCalendarRef}
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: "0",
                            zIndex: 9999,
                            background: "#fff",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                            borderRadius: "8px",
                            marginTop: "4px",
                            width: 300,
                            minWidth: 300,
                            maxWidth: 300,
                          }}
                        >
                          <Calendar
                            className="form-control m-0 p-0 border-0"
                            onChange={(selectedDate) => {
                              setEndDateValue(selectedDate);
                              setFilters({
                                ...filters,
                                endDate: toISODate(selectedDate),
                              });
                              setShowEndDateCalendar(false);
                              setCurrentPage(1);
                            }}
                            value={endDateValue}
                            locale="en-GB"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="filter-item">
                    <Form.Label>Student</Form.Label>
                    <Select
                      className="filter-height"
                      options={studentsOptions}
                      placeholder="Select Student"
                      isClearable
                      styles={selectStyles}
                      value={
                        studentsOptions.find(
                          (option) => option.value === filters.studentId
                        ) || null
                      }
                      onChange={(selected) => {
                        setFilters((prev) => ({
                          ...prev,
                          studentId: selected ? selected.value : "",
                        }));
                        setCurrentPage(1);
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
                        Total Records: <strong>{totalRecords}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ overflowX: "auto" }}>
                {studentsData?.length > 0 && !loading ? (
                  <Table bordered hover responsive>
                    <thead>
                      <tr>
                        <th
                          style={{
                            position: "sticky",
                            left: 0,
                            background: "#fff",
                            zIndex: 1,
                          }}
                        >
                          Student
                        </th>
                        {dates.map((date) => {
                          const isToday =
                            date.toDateString() === new Date().toDateString();
                          const isCurrentWeek =
                            date >= getMondayOfWeek(new Date()) &&
                            date <=
                              new Date(
                                getMondayOfWeek(new Date()).setDate(
                                  getMondayOfWeek(new Date()).getDate() + 6
                                )
                              );
                          return (
                            <th key={date} className="text-center">
                              <div style={{ fontWeight: "bold" }}>
                                {isToday
                                  ? "Today"
                                  : date
                                      .toLocaleDateString("en-US", {
                                        weekday: "short",
                                      })
                                      .toUpperCase()}
                              </div>
                              <small>{formatDate(date).toUpperCase()}</small>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {studentsData?.map((student) => {
                        const sid = student._id || student.id;
                        return (
                          <tr key={sid}>
                            <td
                              style={{
                                position: "sticky",
                                left: 0,
                                background: "#fff",
                                zIndex: 1,
                              }}
                            >
                              {student?.studentName}
                            </td>
                            {dates.map((date) => {
                              const dateString = date
                                .toISOString()
                                .split("T")[0];
                              const { status, remarks } = getAttendanceStatus(
                                sid,
                                dateString
                              );
                              const today = new Date();
                              const todayStr = today
                                .toISOString()
                                .split("T")[0];
                              const isToday = dateString === todayStr;
                              const isFuture = date > today;

                              return (
                                <td
                                  key={dateString}
                                  className="text-center"
                                  style={{
                                    backgroundColor: isToday
                                      ? "#f9f9f9"
                                      : "transparent",
                                    padding: "8px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      gap: "10px",
                                    }}
                                  >
                                    {!status && (
                                      <>
                                        <div
                                          style={getButtonStyle(
                                            null,
                                            "present"
                                          )}
                                          //   onClick={() => {
                                          //     setLocalStatus(
                                          //       sid,
                                          //       dateString,
                                          //       "present",
                                          //       ""
                                          //     );
                                          //     submitAttendance(
                                          //       sid,
                                          //       dateString,
                                          //       true,
                                          //       ""
                                          //     );
                                          //   }}
                                          aria-label={`Mark ${
                                            student.studentName
                                          } present on ${formatDate(date)}`}
                                        >
                                          <Check fontSize="small" />
                                        </div>
                                        <div
                                          style={getButtonStyle(null, "absent")}
                                          //   onClick={() => {
                                          //     setPendingAbsent({
                                          //       student: sid,
                                          //       date: dateString,
                                          //     });
                                          //     setRemarkInput("");
                                          //     setShowRemarkModal(true);
                                          //   }}
                                          aria-label={`Mark ${
                                            student.studentName
                                          } absent on ${formatDate(date)}`}
                                        >
                                          <Close fontSize="small" />
                                        </div>
                                      </>
                                    )}
                                    {status === "present" && (
                                      <div
                                        style={getButtonStyle(
                                          status,
                                          "present"
                                        )}
                                        onClick={() => {
                                          setPendingAbsent({
                                            student: sid,
                                            date: dateString,
                                          });
                                          setRemarkInput("");
                                          setShowRemarkModal(true);
                                        }}
                                        aria-label={`Change ${
                                          student.studentName
                                        } to absent on ${formatDate(date)}`}
                                      >
                                        <Check fontSize="small" />
                                      </div>
                                    )}
                                    {status === "absent" && (
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          remarks ? (
                                            <Tooltip
                                              id={`tooltip-absent-${sid}-${dateString}`}
                                            >
                                              {remarks}
                                            </Tooltip>
                                          ) : (
                                            <></>
                                          )
                                        }
                                      >
                                        <div
                                          style={getButtonStyle(
                                            status,
                                            "absent"
                                          )}
                                          onClick={() => {
                                            setLocalStatus(
                                              sid,
                                              dateString,
                                              "present",
                                              ""
                                            );
                                            submitAttendance(
                                              sid,
                                              dateString,
                                              true,
                                              ""
                                            );
                                          }}
                                          aria-label={`Change ${
                                            student.studentName
                                          } to present on ${formatDate(date)}`}
                                        >
                                          <Close fontSize="small" />
                                        </div>
                                      </OverlayTrigger>
                                    )}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center py-5">
                    {!canRead
                      ? "You do not have permission to view this Data"
                      : loading
                      ? "Loading..."
                      : "No data available"}
                  </div>
                )}
                <div className="d-flex gap-4 mt-3 flex-wrap justify-content-center">
                  {["present", "absent", "notMarked"].map((type) => {
                    let bgColor, icon, textColor, label;
                    if (type === "present") {
                      bgColor = "#d4f5d4";
                      icon = <Check fontSize="small" />;
                      label = "Present";
                      textColor = "green";
                    } else if (type === "absent") {
                      bgColor = "#fddddd";
                      icon = <Close fontSize="small" />;
                      label = "Absent";
                      textColor = "red";
                    } else if (type === "notMarked") {
                      label = "Not Marked";
                      icon = (
                        <div className="d-flex gap-2">
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#E8E8F7",
                              color: "#555",
                            }}
                          >
                            <Check fontSize="small" />
                          </div>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#E8E8F7",
                              color: "#555",
                            }}
                          >
                            <Close fontSize="small" />
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div
                        key={type}
                        className="d-flex align-items-center gap-2"
                      >
                        {type === "notMarked" ? (
                          <>
                            {icon}
                            <span>{label}</span>
                          </>
                        ) : (
                          <>
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: bgColor,
                                color: textColor,
                              }}
                            >
                              {icon}
                            </div>
                            <span>{label}</span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
                {totalPages > 1 && studentsData?.length > 0 && (
                  <div className="d-flex justify-content-end mt-3">
                    <Paginations
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(page) => setCurrentPage(page)}
                    />
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={showRemarkModal}
        onHide={() => setShowRemarkModal(false)}
        centered
      >
        <Modal.Header className="form-main-heading">
          <Modal.Title>Remark for Absent</Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => setShowRemarkModal(false)}
            aria-label="Close modal"
          />
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Remark</Form.Label>
            <Form.Control
              type="text"
              className="custom-select-height"
              placeholder="Enter remark"
              value={remarkInput}
              onChange={(e) => setRemarkInput(e.target.value)}
              aria-label="Enter remark for absence"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="link"
            className="custom-select-height btn border-primary text-primary text-decoration-none"
            onClick={() => setShowRemarkModal(false)}
            aria-label="Cancel"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="custom-select-height"
            onClick={confirmAbsentWithRemark}
            aria-label="Save remark"
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .react-calendar__tile--highlight-week {
          background-color: #e0f7fa !important;
        }
      `}</style>
    </>
  );
};
export default PastStudentAttendance;
