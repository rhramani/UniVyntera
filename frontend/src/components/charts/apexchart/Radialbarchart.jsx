import { Fragment } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Basicradialbar, Circlechart, Circlegauge, Circlewithimage, Gradientcircle, Multipleradial, Semicirclegauge } from '../../../common/Chartfunction';
import Pageheader from '../../../layouts/Pageheader';

const Radialbarchart = () => {
    return (
        <Fragment>
            <Pageheader mainheading='Apex Radialbar Charts' parentfolder='Apex Charts' activepage='Apex Radialbar Charts' />

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Basic Pie Chart</Card.Title>
                        </Card.Header>
                        <Card.Body className="px-0">
                            <div id="radialbar-basic">
                                <Basicradialbar />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Multiple Radialbar Chart</Card.Title>
                        </Card.Header>
                        <Card.Body className="px-0">
                            <div id="radialbar-multiple">
                                <Multipleradial />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Circle Chart - Custom Angle</Card.Title>
                        </Card.Header>
                        <Card.Body className="px-0">
                            <div id="circle-custom">
                                <Circlechart />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Gradient Circle Chart</Card.Title>
                        </Card.Header>
                        <Card.Body className="px-0">
                            <div id="gradient-circle">
                                <Gradientcircle />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Stroked Circular Gauge</Card.Title>
                        </Card.Header>
                        <Card.Body className="px-0">
                            <div id="circular-stroked">
                                <Circlegauge />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Circle Chart With Image</Card.Title>
                        </Card.Header>
                        <Card.Body className="px-0">
                            <div id="circle-image">
                                <Circlewithimage />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Semi Circular Gauge</Card.Title>
                        </Card.Header>
                        <Card.Body className="px-0">
                            <div id="circular-semi">
                                <Semicirclegauge />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};

export default Radialbarchart;