import { Fragment, useState } from 'react'
import { Card, Col, Row, Form, Alert } from 'react-bootstrap'
import ALLImages from '../../common/Imagedata';
import { Link, useNavigate } from 'react-router-dom'
import { auth } from './Firebaseapi'

const Firebaseregistration = () => {

    const [err, setError] = useState("");
    const [_loading, setLoader] = useState(false);
    const [data, setData] = useState({
        fullname: "",
        email: "",
        password: ""
    });

    const { fullname, email, password } = data;

    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const Signup = (e) => {
        e.preventDefault();
        // Replace 'auth' with your authentication logic
        auth.createUserWithEmailAndPassword(email, password).then(
          _user => { RouteChange(); setLoader(false) }
        ).catch(err => { setError(err.message); setLoader(false) });
      }

    const navigate = useNavigate();

    const RouteChange = () => {
        let path = `${import.meta.env.BASE_URL}dashboard/dashboard`;
        navigate(path);
    }


    return (
        <Fragment>
            <div className="page main-signin-wrapper">

                {/* <!-- Start::row-1 --> */}
                <Row className="signpages text-center">
                    <Col md={12}>
                        <Card>
                            <Row className="row-sm">
                                <Col lg={6} xl={6} className="d-none d-lg-block text-center bg-primary details">
                                    <div className="mt-5 pt-5 p-2 position-absolute">
                                        <img src={ALLImages('logo3')} className="header-brand-img mb-4" alt="logo" />
                                        <div className="clearfix"></div>
                                        <img src={ALLImages('svg12')} className="ht-100 mb-0" alt="user" />
                                        <h5 className="mt-4">Create Your Account</h5>
                                        <span className="text-white-6 fs-13 mb-5 mt-xl-0">Signup to create, discover and connect with the global community</span>
                                    </div>
                                </Col>
                                <Col lg={6} xl={6} xs={12} sm={12} className="login_form ">
                                    <div className="main-container container-fluid">
                                        <Row className="row-sm">
                                            <Card.Body className="mt-2 mb-2">
                                                <img src={ALLImages('logo3')} className="d-lg-none header-brand-img text-start float-start mb-4 error-logo-light" alt="logo" />
                                                <img src={ALLImages('logo2')} className=" d-lg-none header-brand-img text-start float-start mb-4 error-logo" alt="logo" />
                                                <div className="clearfix"></div>
                                                <h5 className="text-start mb-2">Signup for Free</h5>
                                                <p className="mb-4 text-muted fs-13 ms-0 text-start">It's free to signup and only takes a minute.</p>
                                                {err && <Alert variant='danger'>{err}</Alert>}
                                                <form>
                                                    <Form.Group className="text-start my-2">
                                                        <Form.Label>Name</Form.Label>
                                                        <Form.Control placeholder="Enter your Name" type="text" name="fullname" value={fullname} onChange={changeHandler} />
                                                    </Form.Group>
                                                    <Form.Group className="text-start my-2">
                                                        <Form.Label className="form-label">Email</Form.Label>
                                                        <Form.Control placeholder="Enter your email" type="text" name="email" value={email} onChange={changeHandler} />
                                                    </Form.Group>
                                                    <Form.Group className="text-start my-2">
                                                        <Form.Label className="form-label">Password</Form.Label>
                                                        <Form.Control placeholder="Enter your password" type="password" name="password" value={password} onChange={changeHandler} />
                                                    </Form.Group>
                                                    <div className="d-grid">
                                                        <button className="btn btn-primary" onClick={Signup}>Create Account</button>
                                                    </div>
                                                </form>
                                                <div className="text-start mt-5 ms-0">
                                                    <p className="mb-0">Already have an account? <Link to={`${import.meta.env.BASE_URL}Firebase/Signin/`}>Sign In</Link></p>
                                                </div>
                                            </Card.Body>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                {/* <!-- End::row-1 --> */}

            </div>
        </Fragment>
    )
}

export default Firebaseregistration
