import { useState } from "react";
import { Button, Container, Row, Col, Form, Modal } from "react-bootstrap";
import CallIcon from "@mui/icons-material/Call";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import { createCtcCallingForDashboard } from "../../../redux/actions/Dashboard.action";
import { useDispatch } from "react-redux";

const SmallDialpad = () => {
  const dispatch = useDispatch();
  const [number, setNumber] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleClick = (value) => {
    setNumber((prev) => prev + value);
  };

  const handleBackspace = () => {
    setNumber((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setNumber("");
  };

  const handleCall = async () => {
    if (number) {
      const payload = {
        number: number,
      };

      const res = await dispatch(createCtcCallingForDashboard(payload));
      if (res?.data?.code) {
        toast.success("Call placed successfully");
      }

      // setShowModal(true);
      handleClear();
    } else {
      toast.error("Enter a number to call");
    }
  };

  return (
    <Container
      className="p-3 rounded text-center"
      style={{
        background: "#1f2b34",
        color: "white",
        height: "388px",
      }}
    >
      <Form.Control
        type="text"
        value={number}
        maxLength={10}
        onChange={(e) => {
          const val = e.target.value;
          if (/^[0-9*#]*$/.test(val)) {
            setNumber(val);
          }
        }}
        className="mb-3 text-center"
        style={{ fontSize: "18px", height: "40px" }}
      />

      <Row className="g-2">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map(
          (digit) => (
            <Col xs={4} key={digit}>
              <Button
                variant="dark"
                onClick={() => handleClick(digit)}
                className="w-100 fs-6"
                style={{ height: "41px" }}
              >
                {digit}
              </Button>
            </Col>
          ),
        )}
      </Row>

      <Button
        variant="success"
        onClick={handleCall}
        className="w-100 mt-3 fw-bold rounded-pill"
      >
        <CallIcon style={{ fontSize: "24px" }} />
      </Button>

      <Row className="mt-2 g-2">
        <Col xs={6} sm={6} md={6}>
          <Button
            variant="warning"
            onClick={handleBackspace}
            className="w-100 custom-select-height"
          >
            ⌫
          </Button>
        </Col>
        <Col xs={6} sm={6} md={6}>
          <Button
            variant="danger"
            onClick={handleClear}
            className="w-100 custom-select-height"
          >
            Clear
          </Button>
        </Col>
      </Row>

      <Modal size="md" show={showModal} onHide={() => setShowModal(false)} top>
        <Modal.Header className="form-main-heading">
          <Modal.Title>On Call</Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={() => setShowModal(false)}
          />
        </Modal.Header>
        <Modal.Body className="text-center">
          <p style={{ fontSize: "20px", fontWeight: "bold", color: "#000" }}>
            📢 Please connect IVR to enable direct calling from the CRM.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            className="custom-select-height"
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SmallDialpad;
