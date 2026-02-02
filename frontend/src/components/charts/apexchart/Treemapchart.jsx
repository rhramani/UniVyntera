import { Fragment } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Basictreemap, Colorrangetree, Distributedtree, Multidimensional } from '../../../common/Chartfunction';
import Pageheader from '../../../layouts/Pageheader';


const Treemapchart = () => {
    return (
        <Fragment>
            <Pageheader mainheading='Apex Treemap Charts' parentfolder='Apex Charts' activepage='Apex Treemap Charts' />

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Basic Treemap Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="treemap-basic">
                                <Basictreemap />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Multi Dimensional Treemap Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="treemap-multi">
                                <Multidimensional />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Distributed Treemap Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="treemap-distributed">
                                <Distributedtree />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Treemap with color ranges</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="treemap-colorranges">
                                <Colorrangetree />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};

export default Treemapchart;