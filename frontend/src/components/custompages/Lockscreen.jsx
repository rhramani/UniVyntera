import { Fragment, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import ALLImages from "../../common/Imagedata";

const Lockscreen = () => {

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');

  const handleTogglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };
  return (
    <Fragment>
      <div className="page main-signin-wrapper">

        {/* <!-- Start::row-1 --> */}
        <Row className="signpages text-center">
          <Col md={12}>
            <Card>
              <Row className="row-sm">
                <Col lg={6} xl={5} className="d-none d-lg-block bg-primary details">
                  <div className="mt-4 pt-4 ps-5 ms-3 pe-5 position-absolute">
                  <Link to={`${import.meta.env.BASE_URL}dashboard/dashboard/`}><img src={ALLImages('logo3')} className="header-brand-img mb-4" alt="logo" /></Link>
                    <div className="clearfix"></div>
                    <img src={ALLImages('svg12')} className="ht-100 mb-0" alt="user" />
                    <h5 className="mt-4 text-fixed-white">Unlock</h5>
                    <span className="text-white-6 tx-13 mb-5 mt-xl-0">Enter your password to access the admin.</span>
                  </div>
                </Col>
                <Col lg={6} xl={7} xs={12} sm={12} className="login_form ">
                  <div className="main-container container-fluid">
                    <Row className="row-sm">
                      <Card.Body className="main-profile-overview mt-3 mb-3">
                        <img src={ALLImages('logo3')} className="d-lg-none header-brand-img text-start float-start mb-4 error-logo-light" alt="logo" />
                        <img src={ALLImages('logo2')} className=" d-lg-none header-brand-img text-start float-start mb-4 error-logo" alt="logo" />
                        <div className="clearfix"></div>
                        <h5 className="text-start mb-2">Lockscreen</h5>
                        <p className="mb-4 text-muted tx-13 ms-0 text-start">Unlock your screen by entering password</p>
                        <form action={`${import.meta.env.BASE_URL}dashboard/dashboard`}>
                          <div className="text-start d-flex float-start mb-4 user-lock">
                            <img alt="avatar avatar-sm" className="rounded-circle mb-0" src={ALLImages('face1')} />
                            <div className="my-auto">
                              <p className="fw-medium my-auto ms-2 text-uppercase ">User logout</p>
                            </div>
                          </div>
                          <Form.Group >
                            <Form.Control placeholder="Enter your password" type={passwordVisible ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
                          </Form.Group>
                          <Form.Check className="text-start my-2 ms-2" type="checkbox" label='show password' onChange={handleTogglePassword}/>
                          <div className="d-grid">
                            <button className="btn btn-primary">Unlock</button>
                          </div>
                        </form>
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
};

export default Lockscreen;
