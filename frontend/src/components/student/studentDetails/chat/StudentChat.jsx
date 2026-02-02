import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Col, Row } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import ChatComponent from "./ChatComponent";
import { decryptData } from "../../../../utils/encryptionUtils";
import { getOneStudentApplication } from "../../../../redux/actions/Student/StudentApplication.action";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Chat from "../../../advanceui/Chat";

const StudentChat = () => {
  const dispatch = useDispatch();
  const { studentId } = useParams();
  const userRole = decryptData(localStorage.getItem("role"));
  const userId = decryptData(localStorage.getItem("userId"));
  const [studentData, setStudentData] = useState({});

  const fetchStudentData = async () => {
    try {
      const res = await dispatch(getOneStudentApplication(studentId));
      setStudentData(res?.data?.data || {});
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  return (
    <div className="mx-5 mt-5">
      <Row>
        <Col lg={6} className="mx-auto">
          {/* <Chat /> */}
          <ChatComponent
            studentId={studentId}
            senderId={userId}
            role={userRole}
            studentData={studentData}
          />
        </Col>
      </Row>
    </div>
  );
};

export default StudentChat;
