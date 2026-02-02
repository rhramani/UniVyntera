import { Fragment } from "react";
import { Card, Col, Dropdown, Nav, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import Pageheader from "../../../layouts/Pageheader";
import ALLImages from "../../../common/Imagedata";

const ViewMail = () => {
  return (
    <Fragment>
      <Pageheader mainheading='View-Mail' parentfolder='Mail' activepage='View-Mail' />

      <Row className="row-sm">
        <Col lg={4} xl={3} md={12}>
          <Card className="custom-card">
            <Card.Body>
              <div className="d-grid">
                <Link to={`${import.meta.env.BASE_URL}apps/mail/mailcomposed/`} className="btn ripple btn-primary btn-compose" id="btnCompose">Compose </Link>
                <div className="main-mail-menu pd-r-0 mg-t-20">
                  <Nav className="main-nav-column mg-b-20" activeKey="started">
                    <Nav.Item>
                      <Nav.Link active href="#">
                        <i className="fs-18 fe fe-mail"></i> Inbox
                        <span className="badge bg-light">20</span>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link href="#" eventKey="started">
                        <i className="fs-18 fe fe-star"></i> Starred
                        <span className="badge bg-primary">3</span>

                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link href="#" eventKey="important">
                        <i className="fs-18 fe fe-bookmark"></i> Important
                        <span className="badge bg-secondary">10</span>

                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link href="#" eventKey="sendmail">
                        <i className="fs-18 fe fe-send"></i> Sent Mail
                        <span className="badge bg-success">8</span>

                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link href="#" eventKey="drafts">
                        <i className="fs-18 fe fe-edit-2"></i> Drafts
                        <span className="badge bg-danger">15</span>

                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link href="#" eventKey="spam">
                        <i className="fs-18 fe fe-disc"></i> Spam
                        <span className="badge bg-warning">128</span>

                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="me-2">
                      <Nav.Link href="#" eventKey="trash">
                        <i className="fs-18 fe fe-trash-2"></i> Trash
                        <span className="badge bg-info">6</span>

                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <label className="main-content-label main-content-label-sm">
                    Label
                  </label>
                  <Nav className="main-nav-column">

                    <Nav.Item>
                      <Nav.Link href="#" eventKey="social">
                        <i className="fs-18 fe fe-folder"></i> Social
                        <span className="badge bg-primary">10</span>

                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item>
                      <Nav.Link href="#" eventKey="promotions">
                        <i className="fs-18 fe fe-folder"></i> Promotions
                        <span className="badge bg-secondary">22</span>

                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="me-2">
                      <Nav.Link href="#">
                        <i className="fs-18 fe fe-folder"></i> Updates
                        <span className="badge bg-success">17</span>

                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={8} xl={9} md={12}>
          <Card className="custom-card">
            <Card.Body className="h-100">
              <div className="email-media">
                <div className="mb-4 d-lg-flex">
                  <h3>Congratulations on your goal you achieved ! </h3>
                  <div className="ms-auto d-none d-md-flex fs-18">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Print</Tooltip>}
                    >
                      <i
                        className="fe fe-printer"
                        data-bs-toggle="tooltip"
                        title="print"
                        data-bs-original-title="Print"
                      ></i>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="top"

                      overlay={<Tooltip>Undo</Tooltip>}
                    >
                      <i
                        className="fe fe-tag ms-3"
                        data-bs-toggle="tooltip"
                        title="yndo"
                        data-bs-original-title="Undo"
                      ></i>
                    </OverlayTrigger>
                  </div>
                </div>
                <div className="media mt-0">
                  <div className="main-img-user avatar-md me-3 online">
                    <img alt="avatar" className="rounded-circle"
                      src={ALLImages("face1")}
                    />
                  </div>
                  <div className="media-body text-gray">
                    <div className="float-end d-none d-md-flex fs-15 align-items-center">
                      <small className="me-2">Nov 2, 2020 12:45 pm</small>
                      <small className="me-2">
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Rated</Tooltip>}
                        >
                          <i
                            className="fe fe-star"
                            data-bs-toggle="tooltip"
                            title="rated"
                            data-bs-original-title="Rated"
                          ></i>
                        </OverlayTrigger>
                      </small>

                      <small className="me-2">
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Reply</Tooltip>}
                        >
                          <i
                            className="fa fa-reply"
                            data-bs-toggle="tooltip"
                            title="reply"
                            data-bs-original-title="Reply"
                          ></i>
                        </OverlayTrigger>
                      </small>

                      <Dropdown className="dropdown-dots">
                        <Dropdown.Toggle className="no-caret p-0" variant="" id="dropdown-basic">
                          <OverlayTrigger overlay={<Tooltip>View More</Tooltip>}><i className="fe fe-more-horizontal text-dark" ></i></OverlayTrigger>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu-end shadow">
                          <Dropdown.Item href="#/action-1">Reply</Dropdown.Item>
                          <Dropdown.Item href="#/action-2">Report Spam</Dropdown.Item>
                          <Dropdown.Item href="#/action-3">Delete</Dropdown.Item>
                          <Dropdown.Item href="#/action-3">Show Original</Dropdown.Item>
                          <Dropdown.Item href="#/action-3">Print</Dropdown.Item>
                          <Dropdown.Item href="#/action-3">Filter</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <div className="media-title">
                      <span className="fs-18 fw-bold">User logout</span>
                      <p className="mb-0 text-muted">user@gmail.com </p>
                      <small className="me-2 d-md-none">
                        Nov 2, 2020 12:45 pm
                      </small>
                      <small className="me-2 d-md-none">
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Rated</Tooltip>}
                        >
                          <i
                            className="fa fa-reply"
                            data-bs-toggle="tooltip"
                            title="rated"
                          ></i>
                        </OverlayTrigger>
                      </small>
                      <small className=" d-md-none">
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>View More</Tooltip>}
                        >
                          <i
                            className="fe fe-more-horizontal text-dark"

                          ></i>
                        </OverlayTrigger>
                      </small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="eamil-body">
                <h6 className="mb-3">Hi Sir/Madam</h6>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia.
                </p>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                  quae ab illo inventore veritatis et quasi architecto beatae
                  vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
                  voluptas sit aspernatur aut odit aut fugit, sed quia
                  consequuntur magni dolores eos qui ratione voluptatem sequi
                  nesciunt.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia.
                </p>
                <p>
                  Nor again is there anyone who loves or pursues or desires to
                  obtain pain of itself, because it is pain, but because
                  occasionally circumstances occur in which toil and pain can
                  procure him some great pleasure. To take a trivial example,
                  which of us ever undertakes laborious physical exercise, except
                  to obtain some advantage from it?
                </p>
                <p className="mb-0">Thanking you Sir/Madam</p>
                <hr />
                <div className="email-attch">
                  <div className="float-end">

                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>download</Tooltip>}
                    >
                      <i
                        className="fa fa-download text-dark"
                        title="Download"
                      ></i>
                    </OverlayTrigger>
                  </div>
                  <p> 3 Attachments <Link className="d-inline-flex" to="#"> View All Images </Link>
                  </p>
                  <div className="emai-img">
                    <div className="row row-sm">
                      <div className="col-sm-3">
                        <Link to="#">
                          <img
                            className="w-100 rounded-3"
                            src={ALLImages("media69")}
                            alt="Generic placeholder"
                          />
                        </Link>
                        <h6 className="mb-3 mt-3 mb-lg-0">
                          img_01.jpg <small className="text-muted">12kb</small>
                        </h6>
                      </div>
                      <div className="col-sm-3">
                        <Link to="#">
                          <img
                            className="w-100 rounded-3"
                            src={ALLImages("media70")}
                            alt="Generic placeholder "
                          />
                        </Link>
                        <h6 className="mb-3 mt-3 mb-lg-0">
                          img_02.jpg <small className="text-muted">18kb</small>
                        </h6>
                      </div>
                      <div className="col-sm-3">
                        <Link to="#">
                          <img
                            className="w-100 rounded-3"
                            src={ALLImages("media72")}
                            alt="Generic placeholder"
                          />
                        </Link>
                        <h6 className=" mt-3 mb-lg-0">
                          img_03.jpg <small className="text-muted">21kb</small>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
            <Card.Footer>
              <Link className="btn ripple btn-primary mt-1 mb-1 me-1" to="#">
                <i className="fa fa-reply"></i> Reply
              </Link>
              <Link className="btn ripple btn-secondary mt-1 mb-1 me-1" to="#">
                <i className="fa fa-share"></i> Forward
              </Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      {/* <!-- End Row --> */}
    </Fragment >
  )
};

export default ViewMail;
