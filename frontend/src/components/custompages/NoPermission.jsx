import React from "react";
import { Card, Row, Col, Container, Button } from "react-bootstrap";
const NoPermission = () => {
  return (
    <div
      style={{
        backgroundColor: "#EAEDF7", // Light background for the page
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={6} sm={10}>
            <Card
              className="text-center p-4 shadow-sm"
              style={{
                borderRadius: "15px",
                backgroundColor: "#FFFFFF", // Clean white card background
                border: "none",
              }}
            >
              <Card.Body>
                <div className="text-danger text-primary fs-1 mb-3">
                  <i className="bi bi-exclamation-triangle-fill"></i>{" "}
                </div>
                <Card.Title
                  style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    color: "#ff0000ff", // Deep blue for title
                    marginBottom: "15px",
                  }}
                >
                  You have no permission to access this page.
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default NoPermission;
