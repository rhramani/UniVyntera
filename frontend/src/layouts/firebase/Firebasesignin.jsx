import React, { Fragment, useState } from 'react';
import { auth } from '../firebase/Firebaseapi';
import { Alert, Card, Col, Form, Nav, OverlayTrigger, Row, Tab, Tooltip } from 'react-bootstrap';
import ALLImages from '../../common/Imagedata';
import { Link, useNavigate } from 'react-router-dom';

const Firebasesignin = () => {

//react validation

const [email1, setEmail1] = useState('Adminreact@domain.com');
const [password1, setPassword1] = useState('spruko@123');
const [error1, setError1] = useState(null);

const handleSignIn = () => {
    if (!email1.trim()) {
        setError1('Please enter your email or username.');
        return;
    }

    if (!password1.trim()) {
        setError1('Please enter your password.');
        return;
    }

    if (email1 !== 'Adminreact@domain.com' || password1 !== 'spruko@123') {
        setError1('Invalid email or password.');
        return;
    }

    window.location.href = `${import.meta.env.BASE_URL}dashboard/dashboard`;
};

//firebase validation
    const [err, setError] = useState("");
    const [loading, setLoader] = useState(false);
    const [data, setData] = useState({
        email: "adminreact@gmail.com",
        password: "1234567890",
    });

    const { email, password } = data;

    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        setError("");
    }

    const Login = (e) => {
        setLoader(true);
        e.preventDefault();
        // Replace 'auth.signInWithEmailAndPassword' with the actual authentication method
        auth.signInWithEmailAndPassword(email, password).then(
            _user => {
                RouteChange();
                setLoader(false);
            }
        ).catch(err => {
            setError(err.message);
            setLoader(true);
        });
    }

    const navigate = useNavigate();

    const RouteChange = () => {
        let path = `${import.meta.env.BASE_URL}dashboard/dashboard`;
        navigate(path);
    }
    return (
        <Fragment>
            <div className="page main-signin-wrapper">

                <Row className="signpages text-center">
                    <Col md={12}>
                        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                            <Nav variant="pills" className='d-inline-flex bg-white p-2 rounded-2'>
                                <Nav.Item><OverlayTrigger overlay={<Tooltip>React</Tooltip>}><Nav.Link eventKey="first"><img src={ALLImages('logo9')} /></Nav.Link></OverlayTrigger></Nav.Item>
                                <Nav.Item><OverlayTrigger overlay={<Tooltip>Firebase</Tooltip>}><Nav.Link eventKey="second"><img src={ALLImages('logo8')} /></Nav.Link></OverlayTrigger></Nav.Item>
                            </Nav>
                            <Tab.Content>
                                <Tab.Pane eventKey="first">
                                    <Card className="mb-0">
                                        <Row className="row-sm">
                                            <Col lg={6} xl={5} className="d-none d-lg-block text-center bg-primary details">
                                                <div className="mt-5 pt-4 p-2 position-absolute">
                                                    <img src={ALLImages('logo3')} className="header-brand-img mb-4" alt="logo" />
                                                    <div className="clearfix"></div>
                                                    <img src={ALLImages('svg12')} className="ht-100 mb-0" alt="user" />
                                                    <h5 className="mt-4">Create Your Account</h5>
                                                    <span className="text-white-6 fs-13 mb-5 mt-xl-0">Signup to create, discover and connect with the global community</span>
                                                </div>
                                            </Col>
                                            <Col lg={6} xl={7} xs={12} sm={12} className="login_form ">
                                                <div className="main-container container-fluid">
                                                    <Row className="row-sm">
                                                        <Card.Body className="mt-2 mb-2">
                                                            <img src={ALLImages('logo3')} className="d-lg-none header-brand-img text-start float-start mb-4 error-logo-light" alt="logo" />
                                                            <img src={ALLImages('logo2')} className="d-lg-none header-brand-img text-start float-start mb-4 error-logo" alt="logo" />
                                                            <div className="clearfix"></div>
                                                            <form>
                                                                <h5 className="text-start mb-2">Signin to Your Account</h5>
                                                                <p className="mb-4 text-muted fs-13 ms-0 text-start">Signin to create, discover and connect with the global community</p>

                                                                {error1 && (<Alert variant="danger" onClose={() => setError1(null)} dismissible>{error1}</Alert>)}

                                                                <Form.Group className="text-start my-2">
                                                                    <Form.Label>Email</Form.Label>
                                                                    <Form.Control placeholder="Enter your email" type="text" value={email1} onChange={(e) => setEmail1(e.target.value)} />
                                                                </Form.Group>
                                                                <div className="text-start my-2">
                                                                    <Form.Label>Password</Form.Label>
                                                                    <Form.Control placeholder="Enter your password" type="password" value={password1} onChange={(e) => setPassword1(e.target.value)} />
                                                                </div>
                                                                <div className="d-grid my-3">
                                                                    <Link to='#' className="btn btn-primary" onClick={handleSignIn}>Sign In</Link>
                                                                </div>
                                                            </form>
                                                            <div className="text-start mt-5 ms-0">
                                                                <div className="mb-1"><Link to={`${import.meta.env.BASE_URL}custompages/forgetpassword`}>Forgot password?</Link></div>
                                                                <div>Don't have an account? <Link to={`${import.meta.env.BASE_URL}custompages/signup`}>Register Here</Link></div>
                                                            </div>
                                                        </Card.Body>
                                                    </Row>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                    <Card className="mb-0">
                                        <Row className="row-sm">
                                            <Col lg={6} xl={5} className="d-none d-lg-block text-center bg-primary details">
                                                <div className="mt-5 pt-4 p-2 position-absolute">
                                                    <img src={ALLImages('logo3')} className="header-brand-img mb-4" alt="logo" />
                                                    <div className="clearfix"></div>
                                                    <img src={ALLImages('svg12')} className="ht-100 mb-0" alt="user" />
                                                    <h5 className="mt-4">Create Your Account</h5>
                                                    <span className="text-white-6 fs-13 mb-5 mt-xl-0">Signup to create, discover and connect with the global community</span>
                                                </div>
                                            </Col>
                                            <Col lg={6} xl={7} xs={12} sm={12} className="login_form ">
                                                <div className="main-container container-fluid">
                                                    <Row className="row-sm">
                                                        <Card.Body className="mt-2 mb-2">
                                                            <img src={ALLImages('logo3')} className="d-lg-none header-brand-img text-start float-start mb-4 error-logo-light" alt="logo" />
                                                            <img src={ALLImages('logo2')} className="d-lg-none header-brand-img text-start float-start mb-4 error-logo" alt="logo" />
                                                            <div className="clearfix"></div>
                                                            <form>
                                                                <h5 className="text-start mb-2">Signin to Your Firebase Account</h5>
                                                                <p className="mb-4 text-muted fs-13 ms-0 text-start">Signin to create, discover and connect with the global community</p>
                                                                {err && <Alert variant='danger'>{err}</Alert>}
                                                                <Form.Group className="text-start my-2">
                                                                    <Form.Label>Email</Form.Label>
                                                                    <Form.Control placeholder="Enter your email" type="text" name="email" onChange={changeHandler} value={email} />
                                                                </Form.Group>
                                                                <div className="text-start my-2">
                                                                    <Form.Label>Password</Form.Label>
                                                                    <Form.Control placeholder="Enter your password" type="password" name="password" value={password} onChange={changeHandler} />
                                                                </div>
                                                                <div className="d-grid my-3">
                                                                    <Link to={`${import.meta.env.BASE_URL}dashboard/dashboard`} className="btn btn-primary" onClick={Login}>Sign In {loading ? <div className="spinner-border spinner-border-sm"></div> : ''}</Link>
                                                                </div>
                                                            </form>
                                                            <div className="text-start mt-5 ms-0">
                                                                <div className="mb-1"><Link to={`${import.meta.env.BASE_URL}Firebase/Reset`}>Forgot password?</Link></div>
                                                                <div>Don't have an account? <Link to={`${import.meta.env.BASE_URL}Firebase/Signup`}>Register Here</Link></div>
                                                            </div>
                                                        </Card.Body>
                                                    </Row>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </Col>
                </Row>

            </div>
        </Fragment>
    )
}

export default Firebasesignin;

