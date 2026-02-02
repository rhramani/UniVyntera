import { Fragment } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Basicpolararea, Monochromepolar } from '../../../common/Chartfunction';
import Pageheader from '../../../layouts/Pageheader';


const Polarareachart = () => {
    return (
        <Fragment>
            <Pageheader mainheading='Apex Polar Area Charts' parentfolder='Apex Charts' activepage='Apex Polar Area Charts' />

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Basic Polar Area Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="polararea-basic">
                                <Basicpolararea />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Polar Area Monochrome Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="polararea-monochrome">
                                <Monochromepolar />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};

export default Polarareachart;