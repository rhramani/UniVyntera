import { Fragment } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Basicrangearea, Comborangearea } from '../../../common/Chartfunction';
import Pageheader from '../../../layouts/Pageheader';

const Rangeareachart = () => {
    return (
        <Fragment>
            <Pageheader mainheading='Apex Range Area Charts' parentfolder='Apex Charts' activepage='Apex Range Area Charts' />

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">
                                Basic Range Area Chart
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="rangearea-basic">
                                <Basicrangearea />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">
                                Combo Range Area Chart
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="rangearea-combo">
                                <Comborangearea />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};

export default Rangeareachart;