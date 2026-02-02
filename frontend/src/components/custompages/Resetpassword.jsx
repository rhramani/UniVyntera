import { Fragment } from "react";
import { Card, Col, Row, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import ALLImages from "../../common/Imagedata";

const Resetpassword = () => {
  return (
    <Fragment>
      <div className="page main-signin-wrapper">

        <Row className="signpages text-center">
          <Col md={12}>
            <Card>
              <Row className="row-sm">
                <Col lg={6} xl={5} className="d-none d-lg-block text-center bg-primary details">
                  <div className="mt-4 pt-5 p-2 position-absolute">
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
                        <img src={ALLImages("logo2")} className=" d-lg-none header-brand-img text-start float-start mb-4 error-logo" alt="logo" />
                        <div className="clearfix"></div>
                        <h5 className="text-start mb-2">Reset Your Password</h5>
                        <p className="mb-4 text-muted fs-13 ms-0 text-start">It's free to signup and only takes a minute.</p>
                        <form>
                          <Form.Group className="text-start form-group">
                            <label className="form-label">Email</label>
                            <input className="form-control" placeholder="Enter your email" type="text" />
                          </Form.Group>
                          <Form.Group className="text-start form-group">
                            <label className="form-label">New Password</label>
                            <input className="form-control" placeholder="Enter your password" type="password" />
                          </Form.Group>
                          <Form.Group className="text-start form-group">
                            <label className="form-label">Confirm Password</label>
                            <input className="form-control" placeholder="Enter your password" type="password" />
                          </Form.Group>
                          <div className="d-grid">
                            <Link to={`${import.meta.env.BASE_URL}Custompages/Signin/`} className="btn btn-primary">Create</Link>
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

      </div>
    </Fragment>
  )
};

export default Resetpassword;