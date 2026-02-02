import { Fragment } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { BarChartJS, LineChartJS, MixedChartJS, PieChartJS, PolarChartJS, RadialChartJS } from "../../common/Chartdata";
import Pageheader from "../../layouts/Pageheader";

const ChartJs = () => (
  <Fragment>
    <Pageheader mainheading='ChartJs' parentfolder='Charts' activepage='ChartJs' />

    <Row className=" row-sm">
      <Col md={12} lg={6}>
        <Card className="custom-card overflow-hidden">
          <Card.Body className="card-body">
            <div>
              <h6 className="main-content-label mb-1">Line Chart</h6>
              <p className="text-muted  card-sub-title">
                Below is the basic line chart example.
              </p>
            </div>
            <div className="chartjs-wrapper-demo">
              <LineChartJS />
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={12} lg={6}>
        <Card className="custom-card overflow-hidden">
          <Card.Body>
            <div>
              <h6 className="main-content-label mb-1">Bar Chart1</h6>
              <p className="text-muted  card-sub-title">
                Below is the basic bar chart example.
              </p>
            </div>
            <div className="chartjs-wrapper-demo">
              <BarChartJS />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>

    <Row className="row-sm">
      <Col md={12} lg={6}>
        <Card className="custom-card overflow-hidden">
          <Card.Body>
            <div>
              <h6 className="main-content-label mb-1">Bar Chart2</h6>
              <p className="text-muted  card-sub-title">
                Below is the basic bar chart example.
              </p>
            </div>
            <div className="chartjs-wrapper-demo">
              <MixedChartJS />
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={12} lg={6}>
        <Card className="custom-card overflow-hidden">
          <Card.Body>
            <div>
              <h6 className="main-content-label mb-1">Area Chart</h6>
              <p className="text-muted  card-sub-title">
                Below is the basic area chart example.
              </p>
            </div>
            <div className="chartjs-wrapper-demo">
              <PolarChartJS />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    {/* <!-- End Row --> */}

    {/* <!-ARCardow --> */}
    <Row className="row-sm">
      <Col md={12} lg={6}>
        <Card className="custom-card overflow-hidden">
          <Card.Body>
            <div>
              <h6 className="main-content-label mb-1">Donut Chart</h6>
              <p className="text-muted  card-sub-title">
                Below are an example of data in a donut chart.
              </p>
            </div>
            <div className="chartjs-wrapper-demo">
              <PieChartJS />
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={12} lg={6}>
        <Card className="custom-card overflow-hidden">
          <Card.Body>
            <div>
              <h6 className="main-content-label mb-1">Pie Chart</h6>
              <p className="text-muted  card-sub-title">
                Below are an example of data in a pie chart.
              </p>
            </div>
            <div className="chartjs-wrapper-demo">
              <RadialChartJS />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    {/* <!-- End Row --> */}

  </Fragment>
);

export default ChartJs;
