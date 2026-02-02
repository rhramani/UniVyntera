import { Fragment } from "react";
import { Col, Button, Nav, Card, Row, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Pageheader from './../../layouts/Pageheader';

const Settings = () => {
  return (
    <Fragment>
      <Pageheader mainheading='Settings' parentfolder='Pages' activepage='Settings' />
      <Row className="row-sm">
        <Col lg={4} xl={3}>
          <Card className="custom-card">
            <Card.Header>
              <div>
                <h3 className="card-title fx-18">
                  <label className="main-content-label fx-15">Settings</label>
                </h3>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="main-content-left main-content-left-mail">
                <div className="main-mail-menu">
                  <Nav className="nav main-nav-column" defaultActiveKey="/home">
                    <Nav.Item> <Nav.Link active eventKey="home" className="thumb"> <i className="fe fe-user"></i> Account </Nav.Link> </Nav.Item>
                    <Nav.Item> <Nav.Link eventKey="Privacy&Security" className="thumb"> <i className="fe fe-lock"></i> Privacy & Security </Nav.Link></Nav.Item>
                    <Nav.Item> <Nav.Link className="thumb" eventKey="General"> <i className="fe fe-edit-2"></i> General </Nav.Link> </Nav.Item>
                    <Nav.Item> <Nav.Link className="thumb" eventKey="Help" > <i className="fe fe-info"></i> Help & Support </Nav.Link> </Nav.Item>
                    <Nav.Item> <Nav.Link className="thumb" eventKey="Emails" > <i className="fe fe-mail"></i> Emails </Nav.Link> </Nav.Item>
                    <Nav.Item> <Nav.Link className="thumb" eventKey="Language" > <i className="fe fe-flag"></i> Language & Region </Nav.Link> </Nav.Item>
                    <Nav.Item> <Nav.Link className="thumb" eventKey="Notifications" > <i className="fe fe-bell"></i> Notifications </Nav.Link> </Nav.Item>
                    <Nav.Item> <Nav.Link className="thumb" eventKey="Blog" > <i className="fe fe-settings"></i> Blog </Nav.Link> </Nav.Item>
                  </Nav>
                </div>
              </div>
            </Card.Body>
            <Card.Footer className="px-4 rounded-0 d-grid">
              <Button variant="primary">Save Changes</Button>
            </Card.Footer>
          </Card>
        </Col>
        <Col lg={8} xl={9}>
          <Row className="row-sm">
            <Col xl={6}>
              <Card className="custom-card">
                <Card.Body>
                  <Row>
                    <Col lg={12}>
                      <div className="d-flex">
                        <div className="settings-main-icon me-4 mt-1">
                          <div className="avatar avatar-md bg-primary-transparent text-primary">
                            <i className="ti-home fs-18"></i>
                          </div>
                        </div>
                        <div>
                          <h5 className="fs-14 d-flex text-dark text-uppercase"> Dashboard </h5>
                          <p className="fx-13 text-muted mb-0">
                            Dashboard Settings such as sidemenu,header and main
                            page can be Controlled.
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="rounded-0">
                  <Link to="#" className="fx-14 mb-0"> Go to Settings </Link>
                  <Form.Check className="form-check-md float-end mb-0" type="switch" id="custom-switch" label="Restore default" />
                </Card.Footer>
              </Card>
            </Col>
            <Col xl={6}>
              <Card className="custom-card">
                <Card.Body>
                  <Row>
                    <Col lg={12}>
                      <div className="d-flex">
                        <div className="settings-main-icon me-4 mt-1">
                          <div className="avatar avatar-md bg-primary-transparent text-primary">
                            <i className="ti-layout-grid2 fs-18"></i>
                          </div>
                        </div>
                        <div>
                          <h5 className="fs-14 d-flex text-dark text-uppercase"> Web Apps </h5>
                          <p className="fx-13 text-muted mb-0">
                            Web apps settings such as Apps,Elements,Advanced Ui &
                            Mail can be Controlled.
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="rounded-0">
                  <Link to="#" className="fx-14 mb-0"> Go to Settings </Link>
                  <Form.Check className="form-check-md float-end mb-0" type="switch" id="custom-switch1" label="Restore default" defaultChecked/>
                </Card.Footer>
              </Card>
            </Col>
            <Col xl={6}>
              <Card className="custom-card">
                <Card.Body>
                  <Row>
                    <Col lg={12}>
                      <div className="d-flex">
                        <div className="settings-main-icon me-4 mt-1">
                          <div className="avatar avatar-md bg-primary-transparent text-primary">
                            <i className="ti-pencil fs-18"></i>
                          </div>
                        </div>
                        <div>
                          <h5 className="fs-14 d-flex text-dark text-uppercase"> General </h5>
                          <p className="fx-13 text-muted mb-0">
                            General settings such as Icons,Charts,Ecommerce can be
                            Controlled.
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="rounded-0">
                  <Link to="#" className="fx-14 mb-0"> Go to Settings </Link>
                  <Form.Check className="form-check-md float-end mb-0" type="switch" id="custom-switch2" label="Restore default"  defaultChecked/>
                </Card.Footer>
              </Card>
            </Col>
            <Col xl={6}>
              <Card className="custom-card">
                <Card.Body>
                  <Row>
                    <Col lg={12}>
                      <div className="d-flex">
                        <div className="settings-main-icon me-4 mt-1">
                          <div className="avatar avatar-md bg-primary-transparent text-primary">
                            <i className="ti-flag-alt-2 fs-18"></i>
                          </div>
                        </div>
                        <div>
                          <h5 className="fs-14 d-flex text-dark text-uppercase"> Language & Region </h5>
                          <p className="fx-13 text-muted mb-0">
                            In this settings we can change the region and language
                            manually.
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="">
                  <Link to="#" className="fx-14 mb-0" > Go to Settings </Link>
                  <Form.Check className="form-check-md float-end mb-0" type="switch" id="custom-switch3" label="Restore default"/>
                </Card.Footer>
              </Card>
            </Col>
            <Col xl={6}>
              <Card className="custom-card">
                <Card.Body>
                  <Row>
                    <Col lg={12}>
                      <div className="d-flex">
                        <div className="settings-main-icon me-4 mt-1">
                          <div className="avatar avatar-md bg-primary-transparent text-primary">
                            <i className="ti-bell fs-18"></i>
                          </div>
                        </div>
                        <div>
                          <h5 className="fs-14 d-flex text-dark text-uppercase"> Notification </h5>
                          <p className="fx-13 text-muted mb-0">
                            Notification settings we can control the notification
                            privacy and security.
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="rounded-0">
                  <Link to="#" className="fx-14 mb-0"> Go to Settings </Link>
                  <Form.Check className="form-check-md float-end mb-0" type="switch" id="custom-switch4" label="Restore default" defaultChecked/>
                </Card.Footer>
              </Card>
            </Col>
            <Col xl={6}>
              <Card className="custom-card">
                <Card.Body>
                  <Row>
                    <Col lg={12}>
                      <div className="d-flex">
                        <div className="settings-main-icon me-4 mt-1">
                          <div className="avatar avatar-md bg-primary-transparent text-primary">
                            <i className="ti-settings fs-18"></i>
                          </div>
                        </div>
                        <div>
                          <h5 className="fs-14 d-flex text-dark text-uppercase"> Blog </h5>
                          <p className="fx-13 text-muted mb-0">
                            In this settings we can modify all Blog related
                            settings in this template.
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="rounded-0">
                  <Link to="#" className="fx-14 mb-0"> Go to Settings </Link>
                  <Form.Check className="form-check-md float-end mb-0" type="switch" id="custom-switch5" label="Restore default" />
                </Card.Footer>
              </Card>
            </Col>
            <Col xl={6}>
              <Card className="custom-card">
                <Card.Body>
                  <Row>
                    <Col lg={12}>
                      <div className="d-flex">
                        <div className="settings-main-icon me-4 mt-1">
                          <div className="avatar avatar-md bg-primary-transparent text-primary">
                            <i className="ti-lock fs-18"></i>
                          </div>
                        </div>
                        <div>
                          <h5 className="fs-14 d-flex text-dark text-uppercase"> Privacy & Security </h5>
                          <p className="fx-13 text-muted mb-0"> In this we can control the privacy related settings. </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="rounded-0">
                  <Link to="#" className="fx-14 mb-0"> Go to Settings </Link>
                  <Form.Check className="form-check-md float-end mb-0" type="switch" id="custom-switch6" label="Restore default" />
                </Card.Footer>
              </Card>
            </Col>
            <Col xl={6}>
              <Card className="custom-card">
                <Card.Body>
                  <Row>
                    <Col lg={12}>
                      <div className="d-flex">
                        <div className="settings-main-icon me-4 mt-1">
                          <div className="avatar avatar-md bg-primary-transparent text-primary">
                            <i className="ti-info-alt fs-18"></i>
                          </div>
                        </div>
                        <div>
                          <h5 className="fs-14 d-flex text-dark text-uppercase"> Help & Support </h5>
                          <p className="fx-13 text-muted mb-0"> In this we can know about how to change settings. </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="rounded-0">
                  <Link to="#" className="fx-14 mb-0"> Go to Settings </Link>
                  <Form.Check className="form-check-md float-end mb-0" type="switch" id="custom-switch7" label="Restore default" defaultChecked/>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Fragment>
  )
};

export default Settings;
