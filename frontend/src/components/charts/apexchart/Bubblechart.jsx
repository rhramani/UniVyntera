import { Fragment } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Bubble3D, Simplebubble } from '../../../common/Chartfunction';
import Pageheader from '../../../layouts/Pageheader';

const Bubblechart = () => {
    return (
        <Fragment>
            <Pageheader mainheading='Apex Bubble Charts' parentfolder='Apex Charts' activepage='Apex Bubble Charts' />

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Simple Bubble Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="bubble-simple">
                                <Simplebubble />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">3D Bubble Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="bubble-3d">
                                <Bubble3D />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};

export default Bubblechart;