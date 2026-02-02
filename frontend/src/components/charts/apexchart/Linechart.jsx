import { Fragment } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Annotations, Basicline, Brushchart, Dashed, Gradientline, Linechartwithlabels, Missingnullvalues, Stepline, Syncing, Zoomabletime } from '../../../common/Chartfunction';
import Pageheader from '../../../layouts/Pageheader';


const Linechart = () => {
    return (
        <Fragment>
            <Pageheader mainheading='Apex Line Charts' parentfolder='Apex Charts' activepage='Apex Line Charts' />

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Basic Line Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="line-chart">
                                <Basicline />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Line Chart With Data Labels</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="line-chart-datalabels">
                                <Linechartwithlabels />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Zoomable Time Series</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="zoom-chart">
                                <Zoomabletime />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Line With Annotations</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="annotation-chart">
                                <Annotations />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Brush Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Brushchart />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">StepLine Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="stepline-chart">
                                <Stepline />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Gradient Line Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="gradient-chart">
                                <Gradientline />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Missing/Null Values Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="null-chart">
                                <Missingnullvalues />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Dashed Line Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="dashed-chart">
                                <Dashed />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Syncing Charts</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Syncing />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};

export default Linechart;