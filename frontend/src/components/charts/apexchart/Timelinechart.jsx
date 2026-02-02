import { Fragment } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Advancedmultirange, Basictimeline, Multiplecolored, Timelinegrouped, Timelinegrouped1 } from '../../../common/Chartfunction';
import Pageheader from '../../../layouts/Pageheader';


const Timelinechart = () => {
    return (
        <Fragment>
            <Pageheader mainheading='Apex Timeline Charts' parentfolder='Apex Charts' activepage='Apex Timeline Charts' />

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Basic TImeline Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="timeline-basic">
                                <Basictimeline />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Multiple Colored TImeline Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="timeline-colors">
                                <Multiplecolored />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Multi Series Timeline Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="timeline-multi">
                                <Timelinegrouped1 />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Advanced Timeline Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="timeline-advanced">
                                <Advancedmultirange />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Timeline-Grouped Rows</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="timeline-grouped">
                                <Timelinegrouped />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};

export default Timelinechart;