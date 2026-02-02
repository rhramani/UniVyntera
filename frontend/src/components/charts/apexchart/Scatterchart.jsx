import { Fragment } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Basicscatter } from '../../../common/Chartfunction';
import { Datetimescatter, Imagefillescatter } from '../../../common/Chartfunction';
import Pageheader from '../../../layouts/Pageheader';

const Scatterchart = () => {
    return (
        <Fragment>
            <Pageheader mainheading='Apex Scatter Charts' parentfolder='Apex Charts' activepage='Apex Scatter Charts' />

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Basic Scatter Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="scatter-basic">
                                <Basicscatter />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Datetime Scatter Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="scatter-datetime">
                                <Datetimescatter />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Image Fill Scatter Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="scatter-image">
                                <Imagefillescatter />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};

export default Scatterchart;