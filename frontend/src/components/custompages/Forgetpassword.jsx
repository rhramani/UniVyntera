import { Fragment } from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ALLImages from '../../common/Imagedata'

const Forgetpassword = () => {
    return (
        <Fragment>
            <div className="page main-signin-wrapper">

                <Row className="signpages text-center">
                    <Col md={12}>
                        <Card>
                            <Row className="row-sm">
                                <Col lg={6} xl={5} className="d-none d-lg-block text-center bg-primary details">
                                    <div className="mt-3 pt-3 p-2 position-absolute">
                                    <Link to={`${import.meta.env.BASE_URL}dashboard/dashboard/`}><img src={ALLImages('logo3')} className="header-brand-img mb-4" alt="logo" /></Link>
                                        <div className="clearfix"></div>
                                        <img src={ALLImages('svg12')} className="ht-100 mb-0" alt="user" />
                                        <h5 className="mt-4">Reset Your Password</h5>
                                        <span className="text-white-6 fs-13 mb-5 mt-xl-0">Signup to create, discover and connect with the global community</span>
                                    </div>
                                </Col>
                                <Col lg={6} xl={7} xs={12} sm={12} className="login_form ">
                                    <div className="main-container container-fluid">
                                        <Row className="row-sm">
                                            <Card.Body className="mt-2 mb-2">
                                                <img src={ALLImages('logo3')} className="d-lg-none header-brand-img text-start float-start mb-4 error-logo-light" alt="logo" />
                                                <img src={ALLImages('logo2')} className=" d-lg-none header-brand-img text-start float-start mb-4 error-logo" alt="logo" />
                                                <div className="clearfix"></div>
                                                <h5 className="text-start mb-2">Forgot Password</h5>
                                                <p className="mb-4 text-muted fs-13 ms-0 text-start">It's free to signup and only takes a minute.</p>
                                                <form>
                                                    <Form.Group className="text-start form-group">
                                                        <Form.Label>Email</Form.Label>
                                                        <Form.Control placeholder="Enter your email" type="text" />
                                                    </Form.Group>
                                                    <div className="d-grid">
                                                        <button className="btn btn-primary">Request reset link</button>
                                                    </div>
                                                </form>
                                                <div className="card-footer border-top-0 ps-0 mt-3 text-start ">
                                                    <p className="mb-1">Did you remembered your password?</p>
                                                    <p className="mb-0">Try to <Link to={`${import.meta.env.BASE_URL}Custompages/Signin/`}>Signin</Link></p>
                                                </div>
                                            </Card.Body>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>

            </div>
        </Fragment>
    )
}

export default Forgetpassword
