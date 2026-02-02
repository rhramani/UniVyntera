import { Fragment } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Candlebrush, Candleline, Candlexaxis } from '../../../common/Chartfunction';
import Pageheader from '../../../layouts/Pageheader';

const Candlestickchart = () => {
    return (
        <Fragment>
            <Pageheader mainheading='Apex Candlestick Charts' parentfolder='Apex Charts' activepage='Apex Candlestick Charts' />
            <Row>
                {/* <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Basic Candlestick Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="candlestick-basic">
                                <Basiccandlestick />
                            </div>
                        </Card.Body>
                    </Card>
                </Col> */}
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Candlestick Synced With Brush Chart</Card.Title>
                        </Card.Header>
                        <Card.Body className='pt-1'>
                            <Candlebrush />
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Candlestick With Cateory X-axis</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="candlestick-categoryx">
                                <Candlexaxis />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title as="h6">Candlestick With Line Chart</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id="candlestick-line">
                                <Candleline />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </Fragment>
    );
};

export default Candlestickchart;