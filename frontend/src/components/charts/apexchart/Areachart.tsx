import React, { Fragment } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Basicarea, Datetimexaxis, Github, Negative, Nullarea, Spiline, Stacked } from '../../../common/Chartfunction';
import Pageheader from '../../../layouts/Pageheader';




const Areachart = () => {
    return (
        <Fragment>
            <Pageheader mainheading='Apex Area Charts' parentfolder='Apex Charts' activepage='Apex Area Charts' />
            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Basic Area Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="area-basic">
                                <Basicarea />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Spline Area Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="area-spline">
                                <Spiline />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Area Chart With Negative Values</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="area-negative">
                                <Negative />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Stacked Area Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="area-stacked">
                                <Stacked />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Area Chart With Null Values</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="area-null">
                                <Nullarea />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Datetimexaxis />
                    </Card>
                </Col>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Selection-Github Style Chart</Card.Title>
                        </Card.Header>
                        <Card.Body className='Github_style pt-1'>
                            <Github />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};

export default Areachart;