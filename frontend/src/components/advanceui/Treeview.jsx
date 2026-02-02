import React, { Fragment } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { BasicTreeviewexample1, BasicTreeviewexample2, BasicTreeviewexample3, BasicTreeviewexample4 } from '../../common/Treeviewfunction'
import Pageheader from '../../layouts/Pageheader'

const Treeview = () => {
    return (
        <Fragment>
            <Pageheader mainheading='Treeview' parentfolder='Advanced Ui' activepage='Treeview' />
            <Row className="row-sm">
                <Col md={12}>
                    <Card className="mg-b-20 custom-card">
                        <Card.Header>
                            <div className="card-title">Treeview</div>
                        </Card.Header>
                        <Card.Body className="card-body">
                            <div className="card-content">
                                <Row>
                                    {/* <!-- col --> */}
                                    <Col lg={12}>
                                        <div id="tree" className="font-semibold text-gray-600">

                                            <BasicTreeviewexample1 />
                                            <BasicTreeviewexample2 />
                                            <BasicTreeviewexample3 />
                                            <BasicTreeviewexample4 />
                                        </div>
                                    </Col>

                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}

export default Treeview;
