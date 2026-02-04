import { useState } from "react";
import { Button, Form, Card } from "react-bootstrap";
import CallIcon from "@mui/icons-material/Call";
import BackspaceIcon from "@mui/icons-material/Backspace";
import DialpadIcon from "@mui/icons-material/Dialpad";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { createCtcCallingForDashboard } from "../../../redux/actions/Dashboard.action";

const Dialpad = () => {
  const dispatch = useDispatch();
  const [number, setNumber] = useState("");

  const keys = [
    { num: "1", sub: "" },
    { num: "2", sub: "ABC" },
    { num: "3", sub: "DEF" },
    { num: "4", sub: "GHI" },
    { num: "5", sub: "JKL" },
    { num: "6", sub: "MNO" },
    { num: "7", sub: "PQRS" },
    { num: "8", sub: "TUV" },
    { num: "9", sub: "WXYZ" },
    { num: "*", sub: "" },
    { num: "0", sub: "+" },
    { num: "#", sub: "" },
  ];

  const handleClick = (value) => {
    if (number.length < 12) setNumber((prev) => prev + value);
  };
  const handleBackspace = () => setNumber((prev) => prev.slice(0, -1));

  const handleCall = async () => {
    if (number) {
      const res = await dispatch(createCtcCallingForDashboard({ number }));
      if (res?.data?.code) toast.success("Connecting call...");
      setNumber("");
    } else {
      toast.error("Please enter a valid number");
    }
  };

  return (
    <Card className="border-0 shadow-sm h-100 rich-dialer-premium overflow-hidden">
      {/* HEADER SECTION */}
      <div className="dialer-header p-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <div className="icon-box-sm bg-primary-transparent me-2">
            <DialpadIcon className="text-primary fs-18" />
          </div>
          <div>
            <h6 className="mb-0 fw-bold fs-13 text-dark text-uppercase letter-spacing-1">
              Dialer
            </h6>
            <div className="d-flex align-items-center mt-1">
              <span className="pulse-indicator me-1"></span>
              <span className="text-success fs-10 fw-bold">SYSTEM ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* DISPLAY SECTION */}
      <div className="dialer-display-area p-3">
        <div className="display-glass shadow-inner">
          <Form.Control
            type="text"
            value={number}
            placeholder="Enter phone number..."
            className="dialer-input-premium border-0 shadow-none text-center"
            readOnly
          />
          <div className="display-actions">
            {number && (
              <span className="clear-btn-text" onClick={() => setNumber("")}>
                Clear
              </span>
            )}
          </div>
        </div>
      </div>

      {/* KEYPAD SECTION */}
      <Card.Body className="p-3 pt-0">
        <div className="dialer-grid">
          {keys.map((key) => (
            <button
              key={key.num}
              type="button"
              className="premium-key-btn"
              onClick={() => handleClick(key.num)}
            >
              <span className="num">{key.num}</span>
              <span className="sub">{key.sub || ""}</span>
            </button>
          ))}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="d-flex align-items-center gap-3 mt-3">
          <Button
            className="call-btn-premium flex-grow-1 shadow-lg border-0"
            onClick={handleCall}
          >
            <div className="d-flex align-items-center justify-content-center">
              <CallIcon className="me-2 fs-20" />
              <span className="fw-bold fs-14">START CALL</span>
            </div>
          </Button>

          <Button
            variant="light"
            className="backspace-btn-premium border shadow-sm"
            onClick={handleBackspace}
            disabled={!number}
          >
            <BackspaceIcon
              className={number ? "text-danger" : "text-muted"}
              fontSize="small"
            />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Dialpad;
