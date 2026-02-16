import { Fragment } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Fragment>
      <footer className="footer mt-auto py-3 bg-white text-center">
        <Container>
          <span className="text-muted">
            {" "}
            Copyright © <span id="year">{new Date().getFullYear()}</span>{" "}
            <a
              // href="https://zokepcrm.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark fw-semibold"
            >
              Zokep CRM
            </a>
            . Designed with by
            <span> </span>
            {/* <span className="bi bi-heart-fill text-danger"></span> */}
            <a
              // href="https://zokepcrm.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="fw-semibold text-primary"
            >
              Zokep CRM
            </a>{" "}
            All rights reserved
          </span>
        </Container>
      </footer>
    </Fragment>
  );
};

export default Footer;
