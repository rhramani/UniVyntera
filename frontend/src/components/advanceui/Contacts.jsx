import { Fragment } from "react";
import { Tab, Row, Col, Card, Nav, Tooltip, OverlayTrigger } from "react-bootstrap";
import { Link } from "react-router-dom";
import Pageheader from "../../layouts/Pageheader";
import ALLImages from "../../common/Imagedata";

const Contacts = () => (
  <Fragment>
    <Pageheader mainheading='Contacts' parentfolder='Advanced Ui' activepage='Contacts' />

    <Row className="row-sm">
      <Col sm={12} md={5} xl={4}>
        <Card className="custom-card overflow-hidden">
          <div className="">
            <div className="main-content-app main-content-contacts pt-0">
              <div className=" main-content-left main-content-left-contacts">
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                  <div className="tab-menu-heading">
                    <div className="tabs-menu1 ">
                      <Nav variant="pills" className="panel-tabs main-nav-line main-nav-line-chat d-flex ps-3 border-bottom">
                        <Nav.Item><Nav.Link className="me-3" eventKey="first">All Contacts</Nav.Link></Nav.Item>
                        <Nav.Item><Nav.Link eventKey="second">Favorites</Nav.Link></Nav.Item>
                      </Nav>
                    </div>
                  </div>
                  <div className="panel-body tabs-menu-body p-0">
                    <Tab.Content>
                      <Tab.Pane eventKey="first" className="p-0">
                        <div className="main-contacts-list">
                          <div className="main-contact-label">
                            A
                          </div>
                          <div className="main-contact-item selected">
                            <div className="main-img-user online"><img alt="avatar" src={ALLImages("face2")} /></div>
                            <div className="main-contact-body">
                              <h6>Abigail Johnson</h6><span className="phone">+1-234-567-890</span>
                            </div>
                            <Link className="main-contact-star" to="#">
                              <i className="fe fe-star me-1 text-warning"></i>
                              <i className="fe fe-edit-2 me-1"></i>
                              <i className="fe fe-more-vertical"></i>
                            </Link>
                          </div>
                          <div className="main-contact-item">
                            <div className="main-img-user"><img alt="avatar" src={ALLImages("face3")} /></div>
                            <div className="main-contact-body">
                              <h6>Archie Cantones</h6><span>archie@cantones.com</span>
                            </div>
                            <Link className="main-contact-star" to="#">
                              <i className="fe fe-star me-1"></i>
                              <i className="fe fe-edit-2 me-1"></i>
                              <i className="fe fe-more-vertical"></i>
                            </Link>
                          </div>
                          <div className="main-contact-item">
                            <div className="main-avatar online">
                              A
                            </div>
                            <div className="main-contact-body">
                              <h6>Allan Rey Palban</h6><span>allanr@palban.com</span>
                            </div>
                            <Link className="main-contact-star" to="#">
                              <i className="fe fe-star me-1"></i>
                              <i className="fe fe-edit-2 me-1"></i>
                              <i className="fe fe-more-vertical"></i>
                            </Link>
                          </div>
                          <div className="main-contact-item">
                            <div className="main-avatar bg-secondary">
                              A
                            </div>
                            <div className="main-contact-body">
                              <h6>Aileen Mante</h6><span>+1-234-567-890</span>
                            </div>
                            <Link className="main-contact-star" to="#">
                              <i className="fe fe-star me-1"></i>
                              <i className="fe fe-edit-2 me-1"></i>
                              <i className="fe fe-more-vertical"></i>
                            </Link>
                          </div>
                          <div className="main-contact-label">
                            B
                          </div>
                          <div className="main-contact-item">
                            <div className="main-img-user"><img alt="avatar" src={ALLImages("face4")} /></div>
                            <div className="main-contact-body">
                              <h6>Brandon Dilao</h6><span>+1-234-567-890</span>
                            </div>
                            <Link className="main-contact-star" to="#">
                              <i className="fe fe-star me-1"></i>
                              <i className="fe fe-edit-2 me-1"></i>
                              <i className="fe fe-more-vertical"></i>
                            </Link>
                          </div>
                          <div className="main-contact-item">
                            <div className="main-img-user online"><img alt="avatar" src={ALLImages("face5")} /></div>
                            <div className="main-contact-body">
                              <h6>Britney Labares</h6><span>+1-234-567-890</span>
                            </div>
                            <Link className="main-contact-star" to="#">
                              <i className="fe fe-star me-1"></i>
                              <i className="fe fe-edit-2 me-1"></i>
                              <i className="fe fe-more-vertical"></i>
                            </Link>
                          </div>
                          <div className="main-contact-item">
                            <div className="main-avatar bg-danger">
                              B
                            </div>
                            <div className="main-contact-body">
                              <h6>Brateyley Cruz</h6><span>+1-234-567-890</span>
                            </div>
                            <Link className="main-contact-star" to="#">
                              <i className="fe fe-star me-1"></i>
                              <i className="fe fe-edit-2 me-1"></i>
                              <i className="fe fe-more-vertical"></i>
                            </Link>
                          </div>
                          <div className="main-contact-label">
                            C
                          </div>
                          <div className="main-contact-item">
                            <div className="main-img-user"><img alt="avatar" src={ALLImages("face6")} /></div>
                            <div className="main-contact-body">
                              <h6>Camille Audrey</h6><span>+1-234-567-890</span>
                            </div>
                            <Link className="main-contact-star" to="#">
                              <i className="fe fe-star me-1"></i>
                              <i className="fe fe-edit-2 me-1"></i>
                              <i className="fe fe-more-vertical"></i>
                            </Link>
                          </div>
                          <div className="main-contact-item">
                            <div className="main-img-user online"><img alt="avatar" src={ALLImages("face7")} /></div>
                            <div className="main-contact-body">
                              <h6>Christian Lerio</h6><span>+1-234-567-890</span>
                            </div>
                            <Link className="main-contact-star" to="#">
                              <i className="fe fe-star me-1"></i>
                              <i className="fe fe-edit-2 me-1"></i>
                              <i className="fe fe-more-vertical"></i>
                            </Link>
                          </div>
                          <div className="main-contact-item">
                            <div className="main-img-user online"><img alt="avatar" src={ALLImages("face8")} /></div>
                            <div className="main-contact-body">
                              <h6>Christopher Segovia</h6><span>+1-234-567-890</span>
                            </div>
                            <Link className="main-contact-star" to="#">
                              <i className="fe fe-star me-1"></i>
                              <i className="fe fe-edit-2 me-1"></i>
                              <i className="fe fe-more-vertical"></i>
                            </Link>
                          </div>
                          <div className="main-contact-label">
                            D
                          </div>
                          <div className="main-contact-item">
                            <div className="main-img-user online"><img alt="avatar" src={ALLImages("face9")} /></div>
                            <div className="main-contact-body">
                              <h6>Darius Clayton</h6><span>+1-234-567-890</span>
                            </div>
                            <Link className="main-contact-star" to="#">
                              <i className="fe fe-star me-1"></i>
                              <i className="fe fe-edit-2 me-1"></i>
                              <i className="fe fe-more-vertical"></i>
                            </Link>
                          </div>
                          <div className="main-contact-item">
                            <div className="main-img-user"><img alt="avatar" src={ALLImages("face10")} /></div>
                            <div className="main-contact-body">
                              <h6>Dyanne Aceron</h6><span>+1-234-567-890</span>
                            </div>
                            <Link className="main-contact-star" to="#">
                              <i className="fe fe-star me-1"></i>
                              <i className="fe fe-edit-2 me-1"></i>
                              <i className="fe fe-more-vertical"></i>
                            </Link>
                          </div>
                          <div className="main-contact-item">
                            <div className="main-img-user online"><img alt="avatar" src={ALLImages("face11")} /></div>
                            <div className="main-contact-body">
                              <h6>Divina Gracia</h6><span>+1-234-567-890</span>
                            </div>
                            <Link className="main-contact-star" to="#">
                              <i className="fe fe-star me-1"></i>
                              <i className="fe fe-edit-2 me-1"></i>
                              <i className="fe fe-more-vertical"></i>
                            </Link>
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="second" className="p-0">
                        <div className="main-contacts-list">
                          <div className="main-contact-label">
                            A
                          </div>
                          <div className="main-contact-item selected">
                            <div className="main-img-user online"><img alt="avatar" src={ALLImages("face7")} /></div>
                            <div className="main-contact-body">
                              <h6>Anna Sthesia</h6><span className="phone">+1-534-567-456</span>
                            </div>
                            <Link className="main-contact-star" to="#">
                              <i className="fe fe-star me-1 text-warning"></i>
                              <i className="fe fe-edit-2 me-1"></i>
                              <i className="fe fe-more-vertical"></i>
                            </Link>
                          </div>
                          <div className="main-contact-item">
                            <div className="main-img-user"><img alt="avatar" src={ALLImages("face8")} /></div>
                            <div className="main-contact-body">
                              <h6>Anna Mull</h6><span>annamul@gmail.com</span>
                            </div>
                            <Link className="main-contact-star" to="#">
                              <i className="fe fe-star me-1 text-warning"></i>
                              <i className="fe fe-edit-2 me-1"></i>
                              <i className="fe fe-more-vertical"></i>
                            </Link>
                          </div>
                          <div className="main-contact-item">
                            <div className="main-img-user"><img alt="avatar" src={ALLImages("face4")} /></div>
                            <div className="main-contact-body">
                              <h6>AlFredo</h6><span>alfredo@gmail.com</span>
                            </div>
                            <Link className="main-contact-star" to="#">
                              <i className="fe fe-star me-1 text-warning"></i>
                              <i className="fe fe-edit-2 me-1"></i>
                              <i className="fe fe-more-vertical"></i>
                            </Link>
                          </div>
                          <div className="main-contact-item">
                            <div className="main-img-user"><img alt="avatar" src={ALLImages("face11")} /></div>
                            <div className="main-contact-body">
                              <h6>Aileen Mante</h6><span>+1-234-567-890</span>
                            </div>
                            <Link className="main-contact-star" to="#">
                              <i className="fe fe-star me-1 text-warning"></i>
                              <i className="fe fe-edit-2 me-1"></i>
                              <i className="fe fe-more-vertical"></i>
                            </Link>
                          </div>
                          <div className="main-contact-label">
                            B
                          </div>
                          <div className="main-contact-item">
                            <div className="main-img-user"><img alt="avatar" src={ALLImages("face5")} /></div>
                            <div className="main-contact-body">
                              <h6>Bernadette</h6><span>+1-234-567-890</span>
                            </div>
                            <Link className="main-contact-star" to="#">
                              <i className="fe fe-star me-1 text-warning"></i>
                              <i className="fe fe-edit-2 me-1"></i>
                              <i className="fe fe-more-vertical"></i>
                            </Link>
                          </div>
                          <div className="main-contact-item">
                            <div className="main-img-user online"><img alt="avatar" src={ALLImages("face9")} /></div>
                            <div className="main-contact-body">
                              <h6>Barry Mundy</h6><span>+1-234-567-890</span>
                            </div>
                            <Link className="main-contact-star" to="#">
                              <i className="fe fe-star me-1 text-warning"></i>
                              <i className="fe fe-edit-2 me-1"></i>
                              <i className="fe fe-more-vertical"></i>
                            </Link>
                          </div>
                          <div className="main-contact-item">
                            <div className="main-avatar bg-danger">
                              B
                            </div>
                            <div className="main-contact-body">
                              <h6>Barb Akew</h6><span>+1-234-567-890</span>
                            </div>
                            <Link className="main-contact-star" to="#">
                              <i className="fe fe-star me-1 text-warning"></i>
                              <i className="fe fe-edit-2 me-1"></i>
                              <i className="fe fe-more-vertical"></i>
                            </Link>
                          </div>
                          <div className="main-contact-label">
                            C
                          </div>
                          <div className="main-contact-item">
                            <div className="main-img-user"><img alt="avatar" src={ALLImages("face12")} /></div>
                            <div className="main-contact-body">
                              <h6>Charles</h6><span>+1-234-567-890</span>
                            </div>
                            <Link className="main-contact-star" to="#">
                              <i className="fe fe-star me-1 text-warning"></i>
                              <i className="fe fe-edit-2 me-1"></i>
                              <i className="fe fe-more-vertical"></i>
                            </Link>
                          </div>
                          <div className="main-contact-item">
                            <div className="main-img-user online"><img alt="avatar" src={ALLImages("face8")} /></div>
                            <div className="main-contact-body">
                              <h6>Christopher</h6><span>+1-234-567-890</span>
                            </div>
                            <Link className="main-contact-star" to="#">
                              <i className="fe fe-star me-1 text-warning"></i>
                              <i className="fe fe-edit-2 me-1"></i>
                              <i className="fe fe-more-vertical"></i>
                            </Link>
                          </div>
                          <div className="main-contact-item">
                            <div className="main-img-user online"><img alt="avatar" src={ALLImages("face3")} /></div>
                            <div className="main-contact-body">
                              <h6>Connor</h6><span>+1-234-567-890</span>
                            </div>
                            <Link className="main-contact-star" to="#">
                              <i className="fe fe-star me-1 text-warning"></i>
                              <i className="fe fe-edit-2 me-1"></i>
                              <i className="fe fe-more-vertical"></i>
                            </Link>
                          </div>
                          <div className="main-contact-label">
                            D
                          </div>
                          <div className="main-contact-item">
                            <div className="main-img-user online"><img alt="avatar" src={ALLImages("face1")} /></div>
                            <div className="main-contact-body">
                              <h6>Deirdre</h6><span>+1-234-567-890</span>
                            </div>
                            <Link className="main-contact-star" to="#">
                              <i className="fe fe-star me-1 text-warning"></i>
                              <i className="fe fe-edit-2 me-1"></i>
                              <i className="fe fe-more-vertical"></i>
                            </Link>
                          </div>
                          <div className="main-contact-item">
                            <div className="main-img-user"><img alt="avatar" src={ALLImages("face8")} /></div>
                            <div className="main-contact-body">
                              <h6>Dorothy</h6><span>+1-234-567-890</span>
                            </div>
                            <Link className="main-contact-star" to="#">
                              <i className="fe fe-star me-1 text-warning"></i>
                              <i className="fe fe-edit-2 me-1"></i>
                              <i className="fe fe-more-vertical"></i>
                            </Link>
                          </div>
                          <div className="main-contact-item">
                            <div className="main-img-user online"><img alt="avatar" src={ALLImages("face7")} /></div>
                            <div className="main-contact-body">
                              <h6>Divina Gracia</h6><span>+1-234-567-890</span>
                            </div>
                            <Link className="main-contact-star" to="#">
                              <i className="fe fe-star me-1 text-warning"></i>
                              <i className="fe fe-edit-2 me-1"></i>
                              <i className="fe fe-more-vertical"></i>
                            </Link>
                          </div>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </div>
                </Tab.Container>
              </div>
            </div>
          </div>
        </Card>
      </Col>
      <Col sm={12} md={7} xl={8}>
        <Card className="custom-card">
          <div className="">
            <div className="main-content-body main-content-body-contacts">
              <div className="main-contact-info-header pt-3">
                <div className="media">
                  <div className="main-img-user">
                    <img alt="avatar" src={ALLImages("face1")} /> <Link to="#"><i className="fe fe-camera"></i></Link>
                  </div>
                  <div className="media-body">
                    <h4>User logout</h4>
                    <p>Web Designer</p>
                    <Nav className="contact-info">
                      <OverlayTrigger overlay={<Tooltip>Call</Tooltip>}><Link to='#' className="contact-icon border text-muted me-1"><i className="fe fe-phone"></i></Link></OverlayTrigger>
                      <OverlayTrigger overlay={<Tooltip>Video</Tooltip>}><Link to='#' className="contact-icon border text-muted me-1"><i className="fe fe-video"></i></Link></OverlayTrigger>
                      <OverlayTrigger overlay={<Tooltip>message</Tooltip>}><Link to='#' className="contact-icon border text-muted me-1"><i className="fe fe-message-square"></i></Link></OverlayTrigger>
                      <OverlayTrigger overlay={<Tooltip>Add to Group</Tooltip>}><Link to='#' className="contact-icon border text-muted me-1"><i className="fe fe-user-plus"></i></Link></OverlayTrigger>
                      <OverlayTrigger overlay={<Tooltip>Block</Tooltip>}><Link to='#' className="contact-icon border text-muted me-1"><i className="fe fe-slash"></i></Link></OverlayTrigger>
                    </Nav>
                  </div>
                </div>
                <div className="main-contact-action btn-list pt-3 pe-3">
                  <OverlayTrigger overlay={<Tooltip>Edit Profile</Tooltip>}><Link to='#' className="btn ripple btn-primary text-fixed-white" ><i className="fe fe-edit"></i></Link></OverlayTrigger>
                  <OverlayTrigger overlay={<Tooltip>Delete Profile</Tooltip>}><Link to='#' className="btn ripple btn-secondary text-fixed-white" ><i className="fe fe-trash-2"></i></Link></OverlayTrigger>
                </div>
              </div>
              <div className="main-contact-info-body">
                <div>
                  <h6>Biography</h6>
                  <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
                  <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
                </div>
                <div className="media-list">
                  <div className="media">
                    <div className="media-body">
                      <div>
                        <label>Work</label> <span className="tx-medium">+1 (234) 567 8901</span>
                      </div>
                      <div>
                        <label>Personal</label> <span className="tx-medium">+1 (498) 021 0090</span>
                      </div>
                    </div>
                  </div>
                  <div className="media">
                    <div className="media-body">
                      <div>
                        <label>Gmail Account</label> <span className="tx-medium">sonia.taylor@gmail.com</span>
                      </div>
                      <div>
                        <label>Other Account</label> <span className="tx-medium">me@bootstrapdash.me</span>
                      </div>
                    </div>
                  </div>
                  <div className="media">
                    <div className="media-body">
                      <div>
                        <label>Current Address</label> <span className="tx-medium">012 Dashboard Apartments, San Francisco, California 13245</span>
                      </div>
                    </div>
                  </div>
                  <div className="media mb-0">
                    <div className="media-body">
                      <div>
                        <label>Call History</label> <span className="tx-medium">Duration of last call: 2m 32sec</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Col>
    </Row>

  </Fragment>
);

export default Contacts;
