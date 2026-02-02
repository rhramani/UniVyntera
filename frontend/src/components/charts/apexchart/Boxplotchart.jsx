import { Fragment } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Basicboxplot, Boxplothorizontal, Boxplotscatter } from '../../../common/Chartfunction';
import Pageheader from '../../../layouts/Pageheader';

const Boxplotchart = () => {
    return (
        <Fragment>
            <Pageheader mainheading='Apex Boxplot Charts' parentfolder='Apex Charts' activepage='Apex Boxplot Charts' />

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Basic Boxplot Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="boxplot-basic">
                                <Basicboxplot />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Boxplot With Scatter Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="boxplot-scatter">
                                <Boxplotscatter />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Horizontal Boxplot Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="boxplot-horizontal">
                                <Boxplothorizontal />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};

export default Boxplotchart;