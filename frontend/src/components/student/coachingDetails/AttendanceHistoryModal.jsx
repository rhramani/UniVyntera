import { Button, Modal, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Check, Close } from "@mui/icons-material";
import { useRef, useState } from "react";

// Utility to get Monday of the week for a given date
const getMondayOfWeek = (date) => {
  const newDate = new Date(date);
  const day = newDate.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Adjust to Monday
  newDate.setDate(newDate.getDate() + diff);
  return newDate;
};

const AttendanceHistoryModal = ({
  showAttendanceModal,
  setShowAttendanceModal,
  setSelectedStudent,
  setAttendanceData,
  attendanceData,
  formatDate,
  selectedStudent,
}) => {
  const [attendanceStartDate, setAttendanceStartDate] = useState(
    getMondayOfWeek(new Date()),
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const dateRangeRef = useRef(null);

  const formatShort = (date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const prevWeek = () => {
    const newDate = new Date(attendanceStartDate);
    newDate.setDate(newDate.getDate() - 7);
    setAttendanceStartDate(getMondayOfWeek(newDate));
    setShowCalendar(false);
  };

  const nextWeek = () => {
    const newDate = new Date(attendanceStartDate);
    newDate.setDate(newDate.getDate() + 7);
    setAttendanceStartDate(getMondayOfWeek(newDate));
    setShowCalendar(false);
  };

  const goToCurrentWeek = () => {
    setAttendanceStartDate(getMondayOfWeek(new Date()));
    setShowCalendar(false);
  };

  const generateDates = () => {
    const dates = [];
    const monday = getMondayOfWeek(attendanceStartDate);
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

  const getAttendanceStatus = (student, date) => {
    const record = attendanceData?.find(
      (r) => r?.student === student && r?.date === date,
    );
    return record || { status: null, remark: "" };
  };

  const getButtonStyle = (status) => {
    const baseStyle = {
      width: 32,
      height: 32,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto",
      cursor: "default",
    };

    if (status === "present") {
      return { ...baseStyle, backgroundColor: "#d4f5d4", color: "green" };
    }
    if (status === "absent") {
      return { ...baseStyle, backgroundColor: "#fddddd", color: "red" };
    }
    return { ...baseStyle, backgroundColor: "#E8E8F7", color: "#555" };
  };

  return (
    <>
      <Modal
        show={showAttendanceModal}
        onHide={() => {
          setShowAttendanceModal(false);
          setSelectedStudent(null);
          setAttendanceData([]);
          setShowCalendar(false);
        }}
        centered
        size="xl"
      >
        <Modal.Header className="form-main-heading">
          <Modal.Title>Attendance History</Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setShowAttendanceModal(false);
              setSelectedStudent(null);
              setAttendanceData([]);
              setShowCalendar(false);
            }}
            aria-label="Close modal"
          />
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center align-items-center mb-3">
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
              className="mb-0 px-3"
              style={{ cursor: "pointer" }}
              onClick={() => setShowCalendar(!showCalendar)}
              ref={dateRangeRef}
            >
              {formatShort(dates[0])} - {formatShort(dates[6])}
            </h6>
            <Button variant="light" onClick={nextWeek} aria-label="Next Week">
              <BiChevronRight size={20} />
            </Button>
          </div>
          {showCalendar && (
            <div
              style={{
                position: "absolute",
                top: dateRangeRef.current
                  ? dateRangeRef.current.getBoundingClientRect().bottom +
                    window.scrollY +
                    4
                  : "70px",
                left: dateRangeRef.current
                  ? dateRangeRef.current.getBoundingClientRect().left +
                    window.scrollX
                  : "auto",
                zIndex: 9999,
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
                  setAttendanceStartDate(getMondayOfWeek(date));
                  setShowCalendar(false);
                }}
                value={attendanceStartDate}
                locale="en-GB"
                tileClassName={({ date }) => {
                  const monday = getMondayOfWeek(attendanceStartDate);
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
          {attendanceData?.length > 0 ? (
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
                <tr>
                  <td
                    style={{
                      position: "sticky",
                      left: 0,
                      background: "#fff",
                      zIndex: 1,
                    }}
                  >
                    {selectedStudent?.name}
                  </td>
                  {dates.map((date) => {
                    const dateString = date.toISOString().split("T")[0];
                    const { status, remark } = getAttendanceStatus(
                      selectedStudent?._id,
                      dateString,
                    );
                    const isToday =
                      date.toDateString() === new Date().toDateString();
                    return (
                      <td
                        key={dateString}
                        className="text-center"
                        style={{
                          backgroundColor: isToday ? "#f9f9f9" : "transparent",
                        }}
                      >
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            remark ? (
                              <Tooltip
                                id={`tooltip-${selectedStudent?._id}-${dateString}`}
                              >
                                {remark}
                              </Tooltip>
                            ) : (
                              <Tooltip
                                id={`tooltip-${selectedStudent?._id}-${dateString}`}
                              >
                                No remark
                              </Tooltip>
                            )
                          }
                        >
                          <div style={getButtonStyle(status)}>
                            {status === "present" && <Check fontSize="small" />}
                            {status === "absent" && <Close fontSize="small" />}
                            {status === null && <span>•</span>}
                          </div>
                        </OverlayTrigger>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-5">
              No att{/* endance data available for this student */}
            </div>
          )}
          {/* Legend */}
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
              } else {
                bgColor = "#E8E8F7";
                icon = <span style={{ fontWeight: "bold" }}>•</span>;
                label = "Not Marked";
                textColor = "#555";
              }
              return (
                <div key={type} className="d-flex align-items-center gap-2">
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
                </div>
              );
            })}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="link"
            className="custom-select-height btn border-primary text-primary text-decoration-none"
            onClick={() => {
              setShowAttendanceModal(false);
              setSelectedStudent(null);
              setAttendanceData([]);
              setShowCalendar(false);
            }}
            aria-label="Close"
          >
            Close
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

export default AttendanceHistoryModal;
