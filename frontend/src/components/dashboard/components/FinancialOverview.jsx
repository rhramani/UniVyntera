import { Card, Col, Row } from "react-bootstrap";

const FinancialOverview = () => {
  return (
    <>
      <Row className="row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card.Header>
            <h4 className="card-title mb-3">Financial Overview Content</h4>
          </Card.Header>
        </Col>
      </Row>
    </>
  );
};

export default FinancialOverview;
