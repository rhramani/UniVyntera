import { Fragment } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Basicolumn, Columnwithlabels, Distributed, Loaded, Markers, Negativecolumn, Rangecolumn, Rotated, Stacked100column, Stackedcolumn } from '../../../common/Chartfunction';
import Pageheader from '../../../layouts/Pageheader';


const Columnchart = () => {
  return (
    <Fragment>
            <Pageheader mainheading='Apex Column Charts' parentfolder='Apex Charts' activepage='Apex Column Charts' />

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Basic Column Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="column-basic">
                                <Basicolumn />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Column Chart With Datalabels</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="column-datalabels">
                                <Columnwithlabels />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Stacked Column Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="column-stacked">
                                <Stackedcolumn />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">100% Stacked Column Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="column-stacked-full">
                                <Stacked100column />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Column Chart With Markers</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="column-markers">
                                <Markers />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Column Chart With Rotated Labels</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="column-rotated-labels">
                                <Rotated />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Column Chart With Negative Values</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="column-negative">
                                <Negativecolumn />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Range Column Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="column-range">
                                <Rangecolumn />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card dynamic-loaded-charts-card">
                        <Card.Header>
                            <Card.Title as="h6">Dynamic Loaded Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Loaded />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Distributed Columns Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="columns-distributed">
                                <Distributed />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
    </Fragment>
  );
};

export default Columnchart;