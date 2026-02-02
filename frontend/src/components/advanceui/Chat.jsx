import { Fragment } from "react";
import { Card, Col, Dropdown, Form, InputGroup, Nav, OverlayTrigger, Row, Tab, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Scrollbar } from 'react-scrollbars-custom';
import Pageheader from "../../layouts/Pageheader";
import ALLImages from "../../common/Imagedata";

const Chat = () => (
  <Fragment>

    <Pageheader mainheading='Chat' parentfolder='Advanced UI' activepage='Chat' />

    <Row className="main-chart-wrapper row-sm">

      <Col sm={12} md={12} lg={12} xxl={3} xl={6}>
        <Card className="custom-card">
          <div className="main-content-app pt-0">
            <div className="main-content-left main-content-left-chat">
              <Card.Body className="">
                <InputGroup className="mb-0">
                  <Form.Control type="text" placeholder="Search ..." aria-label="Search..." aria-describedby="basic-addon1" />
                  <InputGroup.Text id="basic-addon1" className="btn ripple btn-primary">Search</InputGroup.Text>
                </InputGroup>
              </Card.Body>
              <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <Nav variant="pills" className="main-nav-line main-nav-line-chat card-body border-bottom">
                  <Nav.Item><Nav.Link eventKey="first">Recent Chat</Nav.Link></Nav.Item>
                  <Nav.Item><Nav.Link eventKey="second">Calls</Nav.Link></Nav.Item>
                  <Nav.Item><Nav.Link eventKey="third">Contacts</Nav.Link></Nav.Item>
                </Nav>

                <Tab.Content className="main-chat-list">

                  <Tab.Pane className="p-0" eventKey="first">
                    <Scrollbar>
                      <div className="chat-users-tab" id="chat-msg-scroll">
                        <div className="main-chat-list tab-pane p-0">
                          <Link className="media new" to="#">
                            <div className="main-img-user online">
                              <img alt="" src={ALLImages("face5")} /> <span>2</span>
                            </div>
                            <div className="media-body">
                              <div className="media-contact-name">
                                <span>Socrates Itumay</span> <span>2 hours</span>
                              </div>
                              <p>Nam quam nunc, blandit vel aecenas et ante tincid</p>
                            </div>
                          </Link>
                          <Link className="media new" to="#">
                            <div className="main-img-user">
                              <img alt="" src={ALLImages("face6")} /> <span>1</span>
                            </div>
                            <div className="media-body">
                              <div className="media-contact-name">
                                <span>Dexter dela Cruz</span> <span>3 hours</span>
                              </div>
                              <p>Maec enas tempus, tellus eget con dime ntum rhoncus, sem quam</p>
                            </div>
                          </Link>
                          <Link className="media selected" to="#">
                            <div className="main-img-user online"><img alt="" src={ALLImages("face9")} /></div>
                            <div className="media-body">
                              <div className="media-contact-name">
                                <span>Reynante Labares</span> <span>10 hours</span>
                              </div>
                              <p>Nam quam nunc, bl ndit vel aecenas et ante tincid</p>
                            </div>
                          </Link>
                          <Link className="media new" to="#">
                            <div className="main-img-user"><img alt="" src={ALLImages("face11")} /></div>
                            <div className="media-body">
                              <div className="media-contact-name">
                                <span>Joyce Chua</span> <span>2 days</span>
                              </div>
                              <p>Ma ecenas tempus, tellus eget con dimen tum rhoncus, sem quam</p>
                            </div>
                          </Link>
                          <Link className="media new" to="#">
                            <div className="main-img-user"><img alt="" src={ALLImages("face4")} /></div>
                            <div className="media-body">
                              <div className="media-contact-name">
                                <span>Rolando Paloso</span> <span>2 days</span>
                              </div>
                              <p>Nam quam nunc, blandit vel aecenas et ante tincid</p>
                            </div>
                          </Link>
                          <Link className="media new" to="#">
                            <div className="main-img-user">
                              <img alt="" src={ALLImages("face7")} /> <span>1</span>
                            </div>
                            <div className="media-body">
                              <div className="media-contact-name">
                                <span>Ariana Monino</span> <span>3 days</span>
                              </div>
                              <p>Maece nas tempus, tellus eget cond imentum rhoncus, sem quam</p>
                            </div>
                          </Link>
                          <Link className="media new" to="#">
                            <div className="main-img-user"><img alt="" src={ALLImages("face8")} /></div>
                            <div className="media-body">
                              <div className="media-contact-name">
                                <span>Maricel Villalon</span> <span>4 days</span>
                              </div>
                              <p>Nam quam nunc, blandit vel aecenas et ante tincid</p>
                            </div>
                          </Link>
                          <Link className="media new" to="#">
                            <div className="main-img-user"><img alt="" src={ALLImages("face12")} /></div>
                            <div className="media-body">
                              <div className="media-contact-name">
                                <span>Maryjane Pechon</span> <span>5 days</span>
                              </div>
                              <p>Mae cenas tempus, tellus eget co ndimen tum rhoncus, sem quam</p>
                            </div>
                          </Link>
                          <Link className="media new" to="#">
                            <div className="main-img-user"><img alt="" src={ALLImages("face5")} /></div>
                            <div className="media-body">
                              <div className="media-contact-name">
                                <span>Lovely Dela Cruz</span> <span>5 days</span>
                              </div>
                              <p>Mae cenas tempus, tellus eget co ndimen tum rhoncus, sem quam</p>
                            </div>
                          </Link>
                          <Link className="media new" to="#">
                            <div className="main-img-user"><img alt="" src={ALLImages("face10")} /></div>
                            <div className="media-body">
                              <div className="media-contact-name">
                                <span>Daniel Padilla</span> <span>5 days</span>
                              </div>
                              <p>Mae cenas tempus, tellus eget co ndimen tum rhoncus, sem quam</p>
                            </div>
                          </Link>
                          <Link className="media new" to="#">
                            <div className="main-img-user"><img alt="" src={ALLImages("face3")} /></div>
                            <div className="media-body">
                              <div className="media-contact-name">
                                <span>John Pratts</span> <span>6 days</span>
                              </div>
                              <p>Mae cenas tempus, tellus eget co ndimen tum rhoncus, sem quam</p>
                            </div>
                          </Link>
                          <Link className="media new" to="#">
                            <div className="main-img-user"><img alt="" src={ALLImages("face7")} /></div>
                            <div className="media-body">
                              <div className="media-contact-name">
                                <span>Raymart Santiago</span> <span>6 days</span>
                              </div>
                              <p>Nam quam nunc, blandit vel aecenas et ante tincid</p>
                            </div>
                          </Link>
                          <Link className="media border-bottom-0" to="#">
                            <div className="main-img-user"><img alt="" src={ALLImages("face6")} /></div>
                            <div className="media-body">
                              <div className="media-contact-name">
                                <span>Samuel Lerin</span> <span>7 days</span>
                              </div>
                              <p>Nam quam nunc, blandit vel aecenas et ante tincid</p>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </Scrollbar>
                  </Tab.Pane>
                  <Tab.Pane className="p-0" eventKey="second">
                    <Scrollbar>
                      <div className="chat-groups-tab" id="groups-tab-pane">
                        <Link to="#" className="d-flex align-items-center media">
                          <div className="mb-0 me-2">
                            <div className="main-img-user online">
                              <img alt="" src={ALLImages("face5")} /> <span>2</span>
                            </div>
                          </div>
                          <div className="align-items-center justify-content-between">
                            <div className="media-body ms-2">
                              <div className="media-contact-name">
                                <span>Amelia Taylor</span>
                                <span></span>
                              </div>
                              <div className="d-flex align-items-center">
                                <i className="fe fe-arrow-up-right text-success me-2"></i>
                                <p className="text-muted tx-13">Today, 05:30 AM</p>
                              </div>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <i className="contact-status text-success fe fe-phone-outgoing"></i>
                          </div>
                        </Link>
                        <Link to="#" className="d-flex align-items-center media">
                          <div className="mb-0 me-2">
                            <div className="main-img-user online">
                              <img alt="" src={ALLImages("face4")} /> <span>2</span>
                            </div>
                          </div>
                          <div className="align-items-center justify-content-between">
                            <div className="media-body ms-2">
                              <div className="media-contact-name">
                                <span>Grace Russell</span>
                                <span></span>
                              </div>
                              <div className="d-flex align-items-center">
                                <i className="fe fe-arrow-up-right text-success me-2"></i>
                                <p className="text-muted tx-13">Today, 12:15 PM</p>
                              </div>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <i className="contact-status text-success fe fe-phone-outgoing"></i>
                          </div>
                        </Link>
                        <Link to="#" className="d-flex align-items-center media">
                          <div className="mb-0 me-2">
                            <div className="main-img-user online">
                              <img alt="" src={ALLImages("face9")} /> <span>2</span>
                            </div>
                          </div>
                          <div className="align-items-center justify-content-between">
                            <div className="media-body ms-2">
                              <div className="media-contact-name">
                                <span>Joanne Miller</span>
                                <span></span>
                              </div>
                              <div className="d-flex align-items-center">
                                <i className="fe fe-arrow-up-right text-success me-2"></i>
                                <p className="text-muted tx-13">Yesterday, 02:15 PM</p>
                              </div>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <i className="contact-status text-success fe fe-phone-incoming"></i>
                          </div>
                        </Link>
                        <Link to="#" className="d-flex align-items-center media">
                          <div className="mb-0 me-2">
                            <div className="main-img-user online">
                              <img alt="" src={ALLImages("face12")} /> <span>2</span>
                            </div>
                          </div>
                          <div className="align-items-center justify-content-between">
                            <div className="media-body ms-2">
                              <div className="media-contact-name">
                                <span>Kimberly Nolan</span>
                                <span></span>
                              </div>
                              <div className="d-flex align-items-center">
                                <i className="fe fe-arrow-down-left text-danger me-2"></i>
                                <p className="text-muted tx-13">Yesterday, 05:39 PM</p>
                              </div>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <i className="contact-status text-danger fe fe-video"></i>
                          </div>
                        </Link>
                        <Link to="#" className="d-flex align-items-center media">
                          <div className="mb-0 me-2">
                            <div className="main-img-user online">
                              <img alt="" src={ALLImages("face6")} /> <span>2</span>
                            </div>
                          </div>
                          <div className="align-items-center justify-content-between">
                            <div className="media-body ms-2">
                              <div className="media-contact-name">
                                <span>Andrea Mackay</span>
                                <span></span>
                              </div>
                              <div className="d-flex align-items-center">
                                <i className="fe fe-arrow-down-left text-danger me-2"></i>
                                <p className="text-muted tx-13">29 june 2020, 03:21 AM</p>
                              </div>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <i className="contact-status text-danger fe fe-phone-call"></i>
                          </div>
                        </Link>
                        <Link to="#" className="d-flex align-items-center media">
                          <div className="mb-0 me-2">
                            <div className="main-img-user online">
                              <img alt="" src={ALLImages("face1")} /> <span>2</span>
                            </div>
                          </div>
                          <div className="align-items-center justify-content-between">
                            <div className="media-body ms-2">
                              <div className="media-contact-name">
                                <span>Samantha Lewis</span>
                                <span></span>
                              </div>
                              <div className="d-flex align-items-center">
                                <i className="fe fe-arrow-up-right text-success me-2"></i>
                                <p className="text-muted tx-13">1 july 2020, 10:23 AM</p>
                              </div>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <i className="contact-status text-success fe fe-phone-incoming"></i>
                          </div>
                        </Link>
                        <Link to="#" className="d-flex align-items-center media">
                          <div className="mb-0 me-2">
                            <div className="main-img-user online">
                              <img alt="" src={ALLImages("face2")} /> <span>2</span>
                            </div>
                          </div>
                          <div className="align-items-center justify-content-between">
                            <div className="media-body ms-2">
                              <div className="media-contact-name">
                                <span>Victoria Kerr</span>
                                <span></span>
                              </div>
                              <div className="d-flex align-items-center">
                                <i className="fe fe-arrow-down-left text-danger me-2"></i>
                                <p className="text-muted tx-13">1 july 2020, 4:45 PM</p>
                              </div>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <i className="contact-status text-danger fe fe-phone-call"></i>
                          </div>
                        </Link>
                        <Link to="#" className="d-flex align-items-center media">
                          <div className="mb-0 me-2">
                            <div className="main-img-user online">
                              <img alt="" src={ALLImages("face7")} /> <span>2</span>
                            </div>
                          </div>
                          <div className="align-items-center justify-content-between">
                            <div className="media-body ms-2">
                              <div className="media-contact-name">
                                <span>Socrates Itumay</span>
                                <span></span>
                              </div>
                              <div className="d-flex align-items-center">
                                <i className="fe fe-arrow-up-right text-success me-2"></i>
                                <p className="text-muted tx-13">2 july 2020, 11:14 PM</p>
                              </div>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <i className="contact-status text-success fe fe-phone-outgoing"></i>
                          </div>
                        </Link>
                        <Link to="#" className="d-flex align-items-center media">
                          <div className="mb-0 me-2">
                            <div className="main-img-user online">
                              <img alt="" src={ALLImages("face8")} /> <span>2</span>
                            </div>
                          </div>
                          <div className="align-items-center justify-content-between">
                            <div className="media-body ms-2">
                              <div className="media-contact-name">
                                <span>Rebecca Johnston</span>
                                <span></span>
                              </div>
                              <div className="d-flex align-items-center">
                                <i className="fe fe-arrow-down-left text-danger me-2"></i>
                                <p className="text-muted tx-13">3 july 2020, 06:14 PM</p>
                              </div>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <i className="contact-status text-danger fe fe-phone-incoming"></i>
                          </div>
                        </Link>
                        <Link to="#" className="d-flex align-items-center media">
                          <div className="mb-0 me-2">
                            <div className="main-img-user online">
                              <img alt="" src={ALLImages("face3")} /> <span>2</span>
                            </div>
                          </div>
                          <div className="align-items-center justify-content-between">
                            <div className="media-body ms-2">
                              <div className="media-contact-name">
                                <span>Madeleine James</span>
                                <span></span>
                              </div>
                              <div className="d-flex align-items-center">
                                <i className="fe fe-arrow-up-right text-success me-2"></i>
                                <p className="text-muted tx-13">4 july 2020, 5:12 PM</p>
                              </div>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <i className="contact-status text-success fe fe-phone-outgoing"></i>
                          </div>
                        </Link>
                        <Link to="#" className="d-flex align-items-center media">
                          <div className="mb-0 me-2">
                            <div className="main-img-user online">
                              <img alt="" src={ALLImages("face5")} /> <span>2</span>
                            </div>
                          </div>
                          <div className="align-items-center justify-content-between">
                            <div className="media-body ms-2">
                              <div className="media-contact-name">
                                <span>Socrates Itumay</span>
                                <span></span>
                              </div>
                              <div className="d-flex align-items-center">
                                <i className="fe fe-arrow-up-right text-success me-2"></i>
                                <p className="text-muted tx-13">4 july 2020, 5:12 PM</p>
                              </div>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <i className="contact-status text-success fe fe-phone-outgoing"></i>
                          </div>
                        </Link>
                        <Link to="#" className="d-flex align-items-center media">
                          <div className="mb-0 me-2">
                            <div className="main-img-user online">
                              <img alt="" src={ALLImages("face7")} /> <span>2</span>
                            </div>
                          </div>
                          <div className="align-items-center justify-content-between">
                            <div className="media-body ms-2">
                              <div className="media-contact-name">
                                <span>Raymart Santiago</span>
                                <span></span>
                              </div>
                              <div className="d-flex align-items-center">
                                <i className="fe fe-arrow-up-right text-success me-2"></i>
                                <p className="text-muted tx-13">4 july 2020, 5:12 PM</p>
                              </div>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <i className="contact-status text-success fe fe-phone-outgoing"></i>
                          </div>
                        </Link>
                      </div>
                    </Scrollbar>
                  </Tab.Pane>
                  <Tab.Pane className="p-0" eventKey="third">
                    <Scrollbar>
                      <div id="calls-tab-pane" className="chat-calls-tab">
                        <Link to="#" className="d-flex align-items-center media">
                          <div className="mb-0 me-2">
                            <div className="main-img-user online">
                              <img alt="" src={ALLImages("face3")} /> <span>2</span>
                            </div>
                          </div>
                          <div className="align-items-center justify-content-between">
                            <div className="media-body ms-2">
                              <div className="media-contact-name">
                                <span>Lillian Ross</span>
                                <span></span>
                              </div>
                              <div className="d-flex align-items-center">
                                <p className="text-muted tx-13">Home</p>
                              </div>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <i className="contact-status text-primary fe fe-message-square  me-2"></i>
                            <i className="contact-status text-success fe fe-phone-call me-2"></i>
                            <i className="contact-status text-danger fe fe-video"></i>
                          </div>
                        </Link>
                        <Link to="#" className="d-flex align-items-center media">
                          <div className="mb-0 me-2">
                            <div className="main-img-user online">
                              <img alt="" src={ALLImages("face5")} /> <span>2</span>
                            </div>
                          </div>
                          <div className="align-items-center justify-content-between">
                            <div className="media-body ms-2">
                              <div className="media-contact-name">
                                <span>Socrates Itumay</span>
                                <span></span>
                              </div>
                              <div className="d-flex align-items-center">
                                <p className="text-muted tx-13">Mobile</p>
                              </div>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <i className="contact-status text-primary fe fe-message-square  me-2"></i>
                            <i className="contact-status text-success fe fe-phone-call me-2"></i>
                            <i className="contact-status text-danger fe fe-video"></i>
                          </div>
                        </Link>
                        <Link to="#" className="d-flex align-items-center media">
                          <div className="mb-0 me-2">
                            <div className="main-img-user online">
                              <img alt="" src={ALLImages("face4")} /> <span>2</span>
                            </div>
                          </div>
                          <div className="align-items-center justify-content-between">
                            <div className="media-body ms-2">
                              <div className="media-contact-name">
                                <span>Elizabeth Scott</span>
                                <span></span>
                              </div>
                              <div className="d-flex align-items-center">
                                <p className="text-muted tx-13">Office</p>
                              </div>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <i className="contact-status text-primary fe fe-message-square  me-2"></i>
                            <i className="contact-status text-success fe fe-phone-call me-2"></i>
                            <i className="contact-status text-danger fe fe-video"></i>
                          </div>
                        </Link>
                        <Link to="#" className="d-flex align-items-center media">
                          <div className="mb-0 me-2">
                            <div className="main-img-user online">
                              <img alt="" src={ALLImages("face5")} /> <span>2</span>
                            </div>
                          </div>
                          <div className="align-items-center justify-content-between">
                            <div className="media-body ms-2">
                              <div className="media-contact-name">
                                <span>Cameron Watson</span>
                                <span></span>
                              </div>
                              <div className="d-flex align-items-center">
                                <p className="text-muted tx-13">Home</p>
                              </div>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <i className="contact-status text-primary fe fe-message-square  me-2"></i>
                            <i className="contact-status text-success fe fe-phone-call me-2"></i>
                            <i className="contact-status text-danger fe fe-video"></i>
                          </div>
                        </Link>
                        <Link to="#" className="d-flex align-items-center media">
                          <div className="mb-0 me-2">
                            <div className="main-img-user online">
                              <img alt="" src={ALLImages("face8")} /> <span>2</span>
                            </div>
                          </div>
                          <div className="align-items-center justify-content-between">
                            <div className="media-body ms-2">
                              <div className="media-contact-name">
                                <span>Christopher Arnold</span>
                                <span></span>
                              </div>
                              <div className="d-flex align-items-center">
                                <p className="text-muted tx-13">Mobile</p>
                              </div>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <i className="contact-status text-primary fe fe-message-square  me-2"></i>
                            <i className="contact-status text-success fe fe-phone-call me-2"></i>
                            <i className="contact-status text-danger fe fe-video"></i>
                          </div>
                        </Link>
                        <Link to="#" className="d-flex align-items-center media">
                          <div className="mb-0 me-2">
                            <div className="main-img-user online">
                              <img alt="" src={ALLImages("face4")} /> <span>2</span>
                            </div>
                          </div>
                          <div className="align-items-center justify-content-between">
                            <div className="media-body ms-2">
                              <div className="media-contact-name">
                                <span>Justin Bailey</span>
                                <span></span>
                              </div>
                              <div className="d-flex align-items-center">
                                <p className="text-muted tx-13">Office</p>
                              </div>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <i className="contact-status text-primary fe fe-message-square  me-2"></i>
                            <i className="contact-status text-success fe fe-phone-call me-2"></i>
                            <i className="contact-status text-danger fe fe-video"></i>
                          </div>
                        </Link>
                        <Link to="#" className="d-flex align-items-center media">
                          <div className="mb-0 me-2">
                            <div className="main-img-user online">
                              <img alt="" src={ALLImages("face7")} /> <span>2</span>
                            </div>
                          </div>
                          <div className="align-items-center justify-content-between">
                            <div className="media-body ms-2">
                              <div className="media-contact-name">
                                <span>Richard Berry</span>
                                <span></span>
                              </div>
                              <div className="d-flex align-items-center">
                                <p className="text-muted tx-13">Home</p>
                              </div>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <i className="contact-status text-primary fe fe-message-square  me-2"></i>
                            <i className="contact-status text-success fe fe-phone-call me-2"></i>
                            <i className="contact-status text-danger fe fe-video"></i>
                          </div>
                        </Link>
                        <Link to="#" className="d-flex align-items-center media">
                          <div className="mb-0 me-2">
                            <div className="main-img-user online">
                              <img alt="" src={ALLImages("face9")} /> <span>2</span>
                            </div>
                          </div>
                          <div className="align-items-center justify-content-between">
                            <div className="media-body ms-2">
                              <div className="media-contact-name">
                                <span>Abraham Clark</span>
                                <span></span>
                              </div>
                              <div className="d-flex align-items-center">
                                <p className="text-muted tx-13">Mobile</p>
                              </div>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <i className="contact-status text-primary fe fe-message-square  me-2"></i>
                            <i className="contact-status text-success fe fe-phone-call me-2"></i>
                            <i className="contact-status text-danger fe fe-video"></i>
                          </div>
                        </Link>
                        <Link to="#" className="d-flex align-items-center media">
                          <div className="mb-0 me-2">
                            <div className="main-img-user online">
                              <img alt="" src={ALLImages("face4")} /> <span>2</span>
                            </div>
                          </div>
                          <div className="align-items-center justify-content-between">
                            <div className="media-body ms-2">
                              <div className="media-contact-name">
                                <span>Anderson</span>
                                <span></span>
                              </div>
                              <div className="d-flex align-items-center">
                                <p className="text-muted tx-13">Office</p>
                              </div>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <i className="contact-status text-primary fe fe-message-square  me-2"></i>
                            <i className="contact-status text-success fe fe-phone-call me-2"></i>
                            <i className="contact-status text-danger fe fe-video"></i>
                          </div>
                        </Link>
                        <Link to="#" className="d-flex align-items-center media">
                          <div className="mb-0 me-2">
                            <div className="main-img-user online">
                              <img alt="" src={ALLImages("face2")} /> <span>2</span>
                            </div>
                          </div>
                          <div className="align-items-center justify-content-between">
                            <div className="media-body ms-2">
                              <div className="media-contact-name">
                                <span>Clarkson Gray</span>
                                <span></span>
                              </div>
                              <div className="d-flex align-items-center">
                                <p className="text-muted tx-13">Home</p>
                              </div>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <i className="contact-status text-primary fe fe-message-square  me-2"></i>
                            <i className="contact-status text-success fe fe-phone-call me-2"></i>
                            <i className="contact-status text-danger fe fe-video"></i>
                          </div>
                        </Link>
                        <Link to="#" className="d-flex align-items-center media">
                          <div className="mb-0 me-2">
                            <div className="main-img-user online">
                              <img alt="" src={ALLImages("face12")} /> <span>2</span>
                            </div>
                          </div>
                          <div className="align-items-center justify-content-between">
                            <div className="media-body ms-2">
                              <div className="media-contact-name">
                                <span>Henderson Dyer</span>
                                <span></span>
                              </div>
                              <div className="d-flex align-items-center">
                                <p className="text-muted tx-13">Mobile</p>
                              </div>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <i className="contact-status text-primary fe fe-message-square  me-2"></i>
                            <i className="contact-status text-success fe fe-phone-call me-2"></i>
                            <i className="contact-status text-danger fe fe-video"></i>
                          </div>
                        </Link>
                        <Link to="#" className="d-flex align-items-center media">
                          <div className="mb-0 me-2">
                            <div className="main-img-user online">
                              <img alt="" src={ALLImages("face1")} /> <span>2</span>
                            </div>
                          </div>
                          <div className="align-items-center justify-content-between">
                            <div className="media-body ms-2">
                              <div className="media-contact-name">
                                <span>Marshall Fisher</span>
                                <span></span>
                              </div>
                              <div className="d-flex align-items-center">
                                <p className="text-muted tx-13">Office</p>
                              </div>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <i className="contact-status text-primary fe fe-message-square  me-2"></i>
                            <i className="contact-status text-success fe fe-phone-call me-2"></i>
                            <i className="contact-status text-danger fe fe-video"></i>
                          </div>
                        </Link>
                      </div>
                    </Scrollbar>
                  </Tab.Pane>

                </Tab.Content>

              </Tab.Container>
            </div>
          </div>
        </Card>
      </Col>

      <Col sm={12} md={12} lg={12} xl={6}>
        <Card className="custom-card">
          <div className="main-content-app pt-0">
            <div className="main-content-body main-content-body-chat">
              <div className="main-chat-header pt-3">
                <div className="main-img-user online"><img alt="avatar" src={ALLImages("face1")} /></div>
                <div className="main-chat-msg-name">
                  <h6>User logout</h6>
                  <span className="dot-label bg-success"></span><small className="me-3">online</small>
                </div>
                <div className="nav">

                  <OverlayTrigger overlay={<Tooltip>Audio Call</Tooltip>}><Link className="nav-link" to='#'><i className="fe fe-phone-call"></i></Link></OverlayTrigger>
                  <OverlayTrigger overlay={<Tooltip>Video Call</Tooltip>}><Link className="nav-link" to='#'><i className="fe fe-video"></i></Link></OverlayTrigger>
                  <OverlayTrigger overlay={<Tooltip>Add Contact</Tooltip>}><Link className="nav-link" to='#'><i className="fe fe-user-plus"></i></Link></OverlayTrigger>
                  <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}><Link className="nav-link" to='#'><i className="fe fe-trash-2"></i></Link></OverlayTrigger>
                </div>
              </div>
              <div className="main-chat-body" id="ChatBody">
                <Scrollbar style={{ height: 625 }}>
                  <div className="content-inner chat-content" id="main-chat-content">
                    <label className="main-chat-time"><span>3 days ago</span></label>
                    <div className="media flex-row-reverse">
                      <div className="main-img-user online"><img alt="avatar" src={ALLImages("face2")} /></div>
                      <div className="media-body">
                        <div className="main-msg-wrapper">
                          Nulla consequat massa quis enim. Donec pede justo, fringilla vel...
                        </div>
                        <div className="main-msg-wrapper2">
                          rhoncus ut, imperdiet a, venenatis vitae, justo...
                        </div>
                        <div>
                          <span>9:48 am</span> <Link to=""><i className="icon ion-android-more-horizontal"></i></Link>
                        </div>
                      </div>
                    </div>
                    <div className="media">
                      <div className="main-img-user online"><img alt="avatar" src={ALLImages("face1")} /></div>
                      <div className="media-body">
                        <div className="main-msg-wrapper">
                          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
                        </div>
                        <div>
                          <span>9:32 am</span> <Link to=""><i className="icon ion-android-more-horizontal"></i></Link>
                        </div>
                      </div>
                    </div>
                    <div className="media flex-row-reverse">
                      <div className="main-img-user online"><img alt="avatar" src={ALLImages("face2")} /></div>
                      <div className="media-body">
                        <div className="main-msg-wrapper">
                          Nullam dictum felis eu pede mollis pretium
                        </div>
                        <div>
                          <span>11:22 am</span> <Link to=""><i className="icon ion-android-more-horizontal"></i></Link>
                        </div>
                      </div>
                    </div><label className="main-chat-time"><span>Yesterday</span></label>
                    <div className="media">
                      <div className="main-img-user online"><img alt="avatar" src={ALLImages("face1")} /></div>
                      <div className="media-body">
                        <div className="main-msg-wrapper">
                          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
                        </div>
                        <div>
                          <span>9:32 am</span> <Link to=""><i className="icon ion-android-more-horizontal"></i></Link>
                        </div>
                      </div>
                    </div>
                    <div className="media flex-row-reverse">
                      <div className="main-img-user online"><img alt="avatar" src={ALLImages("face2")} /></div>
                      <div className="media-body">
                        <div className="main-msg-wrapper">
                          Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
                        </div>
                        <div className="main-msg-wrapper2">
                          Nullam dictum felis eu pede mollis pretium
                        </div>
                        <div>
                          <span>9:48 am</span> <Link to=""><i className="icon ion-android-more-horizontal"></i></Link>
                        </div>
                      </div>
                    </div><label className="main-chat-time"><span>Today</span></label>
                    <div className="media">
                      <div className="main-img-user online"><img alt="avatar" src={ALLImages("face1")} /></div>
                      <div className="media-body">
                        <div className="main-msg-wrapper">
                          Maecenas tempus, tellus eget condimentum rhoncus
                        </div>
                        <div className="pd-0">
                          <img alt="avatar" className="wd-150 mb-1 me-2" src={ALLImages("media69")} />
                          <img alt="avatar" className="wd-150 mb-1 me-2" src={ALLImages("media70")} />
                          <img alt="avatar" className="wd-150 mb-1 me-2" src={ALLImages("media71")} />
                        </div>
                        <div>
                          <span>10:12 am</span> <Link to=""><i className="icon ion-android-more-horizontal"></i></Link>
                        </div>
                      </div>
                    </div>
                    <div className="media flex-row-reverse">
                      <div className="main-img-user online"><img alt="avatar" src={ALLImages("face2")} /></div>
                      <div className="media-body">
                        <div className="main-msg-wrapper">
                          Maecenas tempus, tellus eget condimentum rhoncus
                        </div>
                        <div className="main-msg-wrapper2">
                          Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus.
                        </div>
                        <div>
                          <span>09:40 am</span> <Link to=""><i className="icon ion-android-more-horizontal"></i></Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Scrollbar>
              </div>
              <div className="main-chat-footer">
                <Nav>
                  <OverlayTrigger overlay={<Tooltip>Add Photo</Tooltip>}><Nav.Link><i className="fe fe-image"></i></Nav.Link></OverlayTrigger>
                  <OverlayTrigger overlay={<Tooltip>Attach a File</Tooltip>}><Nav.Link><i className="fe fe-paperclip"></i></Nav.Link></OverlayTrigger>
                  <OverlayTrigger overlay={<Tooltip>Emoji</Tooltip>}><Nav.Link ><i className="far fa-smile"></i></Nav.Link></OverlayTrigger>
                  <OverlayTrigger overlay={<Tooltip>Record Voice</Tooltip>}><Nav.Link><i className="fe fe-mic"></i></Nav.Link></OverlayTrigger>
                </Nav>
                <Form.Control placeholder="Type your message here..." type="text" />
                <Link className="main-msg-send" to="#"><i className="far fa-paper-plane"></i></Link>
              </div>
            </div>
          </div>
        </Card>
      </Col>

      <Col sm={12} md={12} lg={12} xxl={3} xl={6}>
        <Card className="custom-card chat-account">
          <div className="main-content-app d-block pt-0">

            <div className="chat-user-details" id="chat-user-details">
              <Card.Body className="text-center">
                <div className="user-lock text-center">
                  <Dropdown className="text-end">
                    <Dropdown.Toggle className="option-dots text-muted no-caret" variant="" id="dropdown-basic"><i className="fe fe-more-vertical fs-16"></i></Dropdown.Toggle>
                    <Dropdown.Menu align='end'>
                      <Dropdown.Item><i className="fe fe-message-square me-2"></i> Message</Dropdown.Item>
                      <Dropdown.Item><i className="fe fe-edit-2 me-2"></i> Edit</Dropdown.Item>
                      <Dropdown.Item><i className="fe fe-eye me-2"></i> View</Dropdown.Item>
                      <Dropdown.Item><i className="fe fe-trash-2 me-2"></i> Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Link to={`${import.meta.env.BASE_URL}pages/profile`}><img alt="avatar" className="rounded-4" src={ALLImages("face1")} /></Link>
                </div>
                <Link to={`${import.meta.env.BASE_URL}pages/profile`}><h5 className=" mb-1 mt-3 fs-13 main-content-label">User logout</h5></Link>
                <p className="mb-0 mt-1 text-muted">Web Designer</p>
              </Card.Body>
              <Card.Body>
                <h6 className="mb-3 tx-semibold">Contact Details</h6>
                <div className="d-flex">
                  <div>
                    <p className="contact-icon text-primary m-0"><i className="fe fe-phone"></i></p>
                  </div>
                  <div className="ms-3">
                    <p className="tx-13 mb-0 tx-semibold">Phone</p>
                    <p className="fs-12 text-muted">+1 135792468</p>
                  </div>
                </div>
                <div className="d-flex">
                  <div>
                    <p className="contact-icon text-primary m-0"><i className="fe fe-mail"></i></p>
                  </div>
                  <div className="ms-3">
                    <p className="tx-13 mb-0 tx-semibold">Email</p>
                    <p className="fs-12 text-muted">harvey@gmail.com.</p>
                  </div>
                </div>
                <div className="d-flex">
                  <div>
                    <p className="contact-icon text-primary m-0"><i className="fe fe-map-pin"></i></p>
                  </div>
                  <div className="ms-3">
                    <p className="tx-13 mb-0 tx-semibold">Address</p>
                    <p className="fs-12 text-muted mb-0">California.</p>
                  </div>
                </div>
              </Card.Body>
              <Card.Body>
                <h6 className="mb-3 tx-semibold">Shared Files</h6>
                <div className="media mb-3">
                  <p className="contact-icon text-primary m-0"><i className="mdi mdi-file-image"></i></p>
                  <div className="media-body ms-3 d-flex">
                    <div className="">
                      <p className="tx-13 text-dark mb-0 tx-semibold">Image1.jpg</p>
                      <span className="fs-12 text-muted">200 KB</span>
                    </div>
                    <div className="ms-auto my-auto">
                      <Link to="#" className="btn px-0"><i className="fe fe-download my-auto text-muted tx-18"></i></Link>
                    </div>
                  </div>
                </div>
                <div className="media mb-3">
                  <p className="contact-icon text-danger m-0"><i className="mdi mdi-file-pdf"></i></p>
                  <div className="media-body ms-3 d-flex">
                    <div className="">
                      <p className="tx-13 text-dark mb-0 tx-semibold">Doc1.pdf</p>
                      <span className="fs-12 text-muted">48 KB</span>
                    </div>
                    <div className="ms-auto my-auto">
                      <Link to="#" className="btn px-0"><i className="fe fe-download my-auto text-muted tx-18"></i></Link>
                    </div>
                  </div>
                </div>
                <div className="media mb-3">
                  <p className="contact-icon text-info m-0"><i className="mdi mdi-file-word"></i></p>
                  <div className="media-body ms-3 d-flex">
                    <div className="">
                      <p className="tx-13 text-dark mb-0 tx-semibold">Word1.doc</p>
                      <span className="fs-12 text-muted">35 KB</span>
                    </div>
                    <div className="ms-auto my-auto">
                      <Link to="#" className="btn px-0"><i className="fe fe-download my-auto text-muted tx-18"></i></Link>
                    </div>
                  </div>
                </div>
                <div className="media">
                  <p className="contact-icon text-warning m-0"><i className="mdi mdi-file-powerpoint"></i></p>
                  <div className="media-body ms-3 d-flex">
                    <div className="">
                      <p className="tx-13 text-dark mb-0 tx-semibold">Example1.ppt</p>
                      <span className="fs-12 text-muted">54 KB</span>
                    </div>
                    <div className="ms-auto my-auto">
                      <Link to="#" className="btn px-0"><i className="fe fe-download my-auto text-muted tx-18"></i></Link>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </div>

          </div>
        </Card>
      </Col>
    </Row>
  </Fragment>
);

export default Chat;
