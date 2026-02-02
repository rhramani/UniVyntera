import { Fragment } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Basicradar, Multipleradar, Polygonradar } from '../../../common/Chartfunction';
import Pageheader from '../../../layouts/Pageheader';

const Radarchart = () => {
    return (
        <Fragment>
            <Pageheader mainheading='Apex Radar Charts' parentfolder='Apex Charts' activepage='Apex Radar Charts' />

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Basic Radar Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="radar-basic">
                                <Basicradar />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Radar Chart-Multiple Series</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="radar-multiple">
                                <Multipleradar />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Radar Chart Polygon Fill</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="radar-polygon">
                                <Polygonradar />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};

export default Radarchart;