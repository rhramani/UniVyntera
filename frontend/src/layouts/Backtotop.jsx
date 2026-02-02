import React, { Fragment, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import WhatsAppLightUI from "./WhatsAppLightUI";

const Backtotop = () => {
  const [BacktoTop, setBacktopTop] = useState(false); // Set an initial value, e.g., 'd-none' to hide the button
  const [showWhatsAppUI, setShowWhatsAppUI] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setBacktopTop(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const screenup = () => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Use 'smooth' for a smooth scroll effect
  };

  return (
    <Fragment>
      <div
        style={{
          position: "fixed",
          bottom: "20px", 
          right: "20px",
          display: "flex",
          gap: "10px",
          zIndex: 1051,
          transition: "bottom 0.3s ease",
        }}
      >
        <Button
          variant="primary"
          style={{
            border: "none",
            background: "#0b5ed7",
            color: "white",
            padding: "8px 16px",
            borderRadius: 10,
            fontWeight: "bold",
            height: 40,
            width: 70,
            fontSize: 16,
          }}
          onClick={() => setShowWhatsAppUI(!showWhatsAppUI)}
        >
          Chat
        </Button>
        {BacktoTop && (
          <Button onClick={screenup}>
            <i className="fe fe-arrow-up fs-14 pr-10"></i>
          </Button>
        )}
      </div>

      {showWhatsAppUI && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            right: "20px",
            width: "900px",
            maxWidth: "90vw",
            height: "600px",
            maxHeight: "80vh",
            backgroundColor: "white",
            boxShadow: "0 0 20px rgba(0,0,0,0.3)",
            zIndex: 1050,
            borderRadius: "10px",
            overflow: "hidden",
            display: "flex",
          }}
        >
          <WhatsAppLightUI onClose={() => setShowWhatsAppUI(false)} />
        </div>
      )}
    </Fragment>
  );
};

export default Backtotop;
