import { Fragment } from "react";
import { ProgressBar, Badge, Row, Col, Card, Table, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Visitors } from "../../common/Comondata";
import Pageheader from "../../layouts/Pageheader";
import ALLImages from "../../common/Imagedata";


const Widgets = () => {
  return (
    <Fragment>
      <Pageheader mainheading='Widgets' parentfolder='Apps' activepage='Widgets' />

      {/* <!-- Row --> */}
      <Row className="row-sm">
        <Col sm={6} md={6} xl={3}>
          <Card className="custom-card">
            <Card.Body>
              <p className="mb-1 ">Number Of Sales</p>
              <div>
                <h4 className="dash-25 mb-2">568</h4>
              </div>
              <div className="expansion-value d-flex ">
                <strong>
                  <i className="fas fa-caret-down me-1 text-danger"></i> 0.5%
                </strong>
                <strong className="ms-auto">
                  <i className="fas fa-caret-up me-1 text-success"></i>0.7%
                </strong>
              </div>
              <div className="progress ht-8">
                <ProgressBar
                  now={70}
                  className="xs wd-100p"
                  role="progressbar"
                ></ProgressBar>
              </div>
              <div className="expansion-label d-flex text-muted">
                <span>Target</span>
                <span className="ms-auto">Last Month</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} sm={6} xl={3}>
          <Card className="custom-card">
            <Card.Body>
              <p className="mb-1 ">New Revenue</p>
              <div>
                <h4 className="dash-25 mb-2">$12,897</h4>
              </div>
              <div className="expansion-value d-flex ">
                <strong>
                  <i className="fas fa-caret-up me-1 text-success"></i> 0.72%
                </strong>
                <strong className="ms-auto">
                  <i className="fas fa-caret-down me-1 text-danger"></i>0.43%
                </strong>
              </div>
              <div className="progress ht-8">
                <ProgressBar
                  now={60}
                  className="xs  wd-100p"
                  variant="secondary"
                  role="progressbar"
                ></ProgressBar>
              </div>
              <div className="expansion-label d-flex text-muted">
                <span>Target</span>
                <span className="ms-auto">Last Month</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} sm={6} xl={3}>
          <Card className="custom-card">
            <Card.Body>
              <p className="mb-1 ">Total Cost</p>
              <div>
                <h4 className="dash-25 mb-2">$11,234</h4>
              </div>
              <div className="expansion-value d-flex ">
                <strong>
                  <i className="fas fa-caret-down me-1 text-danger"></i> 1.4%
                </strong>
                <strong className="ms-auto">
                  <i className="fas fa-caret-down me-1 text-danger"></i>1.44%
                </strong>
              </div>
              <div className="progress ht-8">
                <ProgressBar
                  now={50}
                  className="xs wd-100p "
                  variant="success"
                  role="progressbar"
                ></ProgressBar>
              </div>
              <div className="expansion-label d-flex text-muted">
                <span>Target</span>
                <span className="ms-auto">Last Month</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} sm={6} xl={3}>
          <Card className="custom-card">
            <Card.Body>
              <p className="mb-1 ">Profit By Sale</p>
              <div>
                <h4 className="dash-25 mb-2">$789</h4>
              </div>
              <div className="expansion-value d-flex ">
                <strong>
                  <i className="fas fa-caret-down me-1 text-danger"></i> 0.4%
                </strong>
                <strong className="ms-auto">
                  <i className="fas fa-caret-up me-1 text-success"></i>0.9%
                </strong>
              </div>
              <div className="progress ht-8">
                <ProgressBar
                  now={40}
                  className="xs wd-100p "
                  role="progressbar"
                  variant="info"
                ></ProgressBar>
              </div>
              <div className="expansion-label d-flex text-muted">
                <span>Target</span>
                <span className="ms-auto">Last Month</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <!-- End Row --> */}

      {/* <!-- Row --> */}
      <Row className="row-sm">
        <Col md={6} sm={6} xl={3}>
          <Card className="custom-card">
            <Card.Body className="text-center">
              <div className="icon-service bg-primary-transparent rounded-circle text-primary">
                <i className="fe fe-user"></i>
              </div>
              <p className="mb-1 text-muted">Total Users</p>
              <h3 className="mb-0">34,789</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} sm={6} xl={3}>
          <Card className="custom-card">
            <Card.Body className="text-center">
              <div className="icon-service bg-secondary-transparent rounded-circle text-secondary">
                <i className="fe fe-trending-up"></i>
              </div>
              <p className="mb-1 text-muted">Total Sales</p>
              <h3 className="mb-0">98,674</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} sm={6} xl={3}>
          <Card className="custom-card">
            <Card.Body className="text-center">
              <div className="icon-service bg-info-transparent rounded-circle text-info">
                <i className="fe fe-dollar-sign"></i>
              </div>
              <p className="mb-1 text-muted">Total Profits</p>
              <h3 className="mb-0">
                <span>$</span>45,078
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} sm={6} xl={3}>
          <Card className="custom-card">
            <Card.Body className="text-center">
              <div className="icon-service bg-success-transparent rounded-circle text-success">
                <i className="fe fe-shopping-cart"></i>
              </div>
              <p className="mb-1 text-muted">Total Orders</p>
              <h3 className="mb-0">35,897</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <!-- End Row --> */}

      {/* <!-- Row --> */}
      <Row className="row-sm">
        <Col md={12} className="col-md-12">
          <Card className="custom-card">
            <Row className="row-sm">
              <Col xl={3} lg={6} sm={6} className="pe-0 ps-0 border-end">
                <Card.Body className="text-center">
                  <h6 className="mb-0">Gross profit Margin</h6>
                  <h2 className="mb-1 mt-2 number-font">
                    <span className="counter">77</span>%
                  </h2>
                  <p className="mb-0 text-muted">
                    <span className="mb-0 text-danger fs-13 ms-1 d-inline-flex">
                      <i className="fe fe-arrow-down me-1"></i> 1.68%
                    </span> for Last month </p>
                </Card.Body>
              </Col>
              <Col xl={3} lg={6} sm={6} className="pe-0 ps-0 border-end">
                <Card.Body className="text-center">
                  <h6 className="mb-0">Opex Ratio</h6>
                  <h2 className="mb-1 mt-2 number-font">
                    <span className="counter">60</span>%
                  </h2>
                  <p className="mb-0 text-muted">
                    <span className="mb-0 text-success fs-13 ms-1 d-inline-flex">
                      <i className="fe fe-arrow-up me-1"></i> 0.27%
                    </span> for Last month </p>
                </Card.Body>
              </Col>
              <Col xl={3} lg={6} sm={6} className="pe-0 ps-0 border-end">
                <Card.Body className="text-center">
                  <h6 className="mb-0">Operating Profit Margin</h6>
                  <h2 className="mb-1 mt-2 number-font">
                    <span className="counter">57</span>%
                  </h2>
                  <p className="mb-0 text-muted">
                    <span className="mb-0 text-danger fs-13 ms-1 d-inline-flex">
                      <i className="fe fe-arrow-down me-1"></i> 0.87%
                    </span> for Last month </p>
                </Card.Body>
              </Col>
              <Col xl={3} lg={6} sm={6} className="pe-0 ps-0">
                <Card.Body className="text-center">
                  <h6 className="mb-0">Net Profit Margin</h6>
                  <h2 className="mb-1 mt-2 number-font">
                    <span className="counter">35</span>%
                  </h2>
                  <p className="mb-0 text-muted">
                    <span className="mb-0 text-success fs-13 ms-1 d-inline-flex">
                      <i className="fe fe-arrow-up me-1"></i> 22%
                    </span> for Last month </p>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      {/* <!-- End Row --> */}

      {/* <!-- Row --> */}
      <Row className="row-sm">
        <Col md={6} sm={6} xl={3}>
          <Card className="custom-card">
            <Card.Body className="user-card text-center">
              <div className="main-img-user avatar avatar-lg text-center">
                <img alt="avatar" className="rounded-circle" src={ALLImages('face5')} />
              </div>
              <div className="mt-2">
                <h5 className="mb-1">Reynante</h5>
                <p className="mb-1 ">Web Developer</p>
                <span className="text-muted">
                  <i className="far fa-check-circle text-success me-1"></i>
                  Verified
                </span>
              </div>
              <Link to="#" className="btn ripple btn-primary mt-3">
                View Profile
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} sm={6} xl={3}>
          <Card className="custom-card">
            <Card.Body className="user-card text-center">
              <div className="main-img-user avatar avatar-lg text-center">
                <img alt="avatar" className="rounded-circle" src={ALLImages('face4')} />
              </div>
              <div className="mt-2">
                <h5 className="mb-1">Joyce Chua</h5>
                <p className="mb-1 ">Team Leader</p>
                <span className="text-muted">
                  <i className="far fa-check-circle text-success me-1"></i>
                  Verified
                </span>
              </div>
              <Link to="#" className="btn ripple btn-primary mt-3">
                View Profile
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} sm={6} xl={3}>
          <Card className="custom-card">
            <Card.Body className="user-card text-center">
              <div className="main-img-user avatar avatar-lg text-center">
                <img alt="avatar" className="rounded-circle" src={ALLImages('face6')} />
              </div>
              <div className="mt-2">
                <h5 className="mb-1">Owen Bongcaras</h5>
                <p className="mb-1 ">Web Designer</p>
                <span className="text-muted">
                  <i className="far fa-check-circle text-success me-1"></i>
                  Verified
                </span>
              </div>
              <Link to="#" className="btn ripple btn-primary mt-3">
                View Profile
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} sm={6} xl={3}>
          <Card className="custom-card">
            <Card.Body className="user-card text-center">
              <div className="main-img-user avatar avatar-lg text-center">
                <img alt="avatar" className="rounded-circle" src={ALLImages('face7')} />
              </div>
              <div className="mt-2">
                <h5 className="mb-1">Mariane Galeon</h5>
                <p className="mb-1 ">Php Developer</p>
                <span className="text-muted">
                  <i className="far fa-check-circle text-success me-1"></i>
                  Verified
                </span>
              </div>
              <Link to="#" className="btn ripple btn-primary mt-3">
                View Profile
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <!--End Row --> */}

      {/* <!-- Row --> */}
      <Row className="row-sm">
        <Col sm={12} md={4}>
          <Card className="custom-card">
            <Card.Body>
              <div>
                <h6>Click Through Conversions</h6>
                <h6>
                  <span className="fs-30 me-2">14,678</span>
                  <Badge bg="success">1.5%</Badge>
                </h6>
                <span className="text-muted">
                  The number of clicks to the ad that consist of a single
                  impression.
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={12} md={4}>
          <Card className="custom-card">
            <Card.Body>
              <div>
                <h6>View Through Conversions</h6>
                <h6>
                  <span className="fs-30 me-2">2,971</span>
                  <Badge bg="danger">0.55%</Badge>
                </h6>
                <span className="text-muted">
                  Estimated daily unique views through conversions per visitor
                  on the ads.
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={12} md={4}>
          <Card className="custom-card">
            <Card.Body>
              <div>
                <h6>Total Conversions</h6>
                <h6>
                  <span className="fs-30 me-2">1,896</span>
                  <Badge bg="success">1.8%</Badge>
                </h6>
                <span className="text-muted">
                  Estimated total conversions on ads per impressions to the ads.
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <!--End Row --> */}

      <Row className="row-sm">
        <Col sm={12} md={6} lg={6} xl={3}>
          <Card className="custom-card">
            <Card.Body>
              <div className="card-order ">
                <label className="main-content-label mb-3 pt-1">
                  New Users
                </label>
                <h2 className="text-end card-item-icon card-icon">
                  <i className="mdi mdi-account-multiple icon-size float-start text-primary"></i>
                  <span className="font-weight-bold">3,672</span>
                </h2>
                <p className="mb-0 text-muted">
                  Monthly users<span className="float-end">50%</span>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        {/* <!-- COL END --> */}
        <Col sm={12} md={6} lg={6} xl={3}>
          <Card className="custom-card">
            <Card.Body>
              <div className="card-widget">
                <label className="main-content-label mb-3 pt-1">
                  Total tax
                </label>
                <h2 className="text-end">
                  <i className="mdi mdi-cube icon-size float-start text-primary fs-27"></i>
                  <span className="font-weight-bold">$89,265</span>
                </h2>
                <p className="mb-0 text-muted">
                  Monthly Income<span className="float-end">$7,893</span>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        {/* <!-- COL END --> */}
        <Col sm={12} md={6} lg={6} xl={3}>
          <Card className="custom-card">
            <Card.Body>
              <div className="card-widget">
                <label className="main-content-label mb-3 pt-1">
                  Total Profit
                </label>
                <h2 className="text-end">
                  <i className="icon-size mdi mdi-poll-box   float-start text-primary fs-27"></i>
                  <span className="font-weight-bold">$23,987</span>
                </h2>
                <p className="mb-0 text-muted">
                  Monthly Profit<span className="float-end">$4,678</span>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        {/* <!-- COL END --> */}
        <Col sm={12} md={6} lg={6} xl={3}>
          <Card className="custom-card">
            <Card.Body>
              <div className="card-widget">
                <label className="main-content-label mb-3 pt-1">
                  Total Sales
                </label>
                <h2 className="text-end">
                  <i className="mdi mdi-cart icon-size float-start text-primary fs-27"></i>
                  <span className="font-weight-bold">46,486</span>
                </h2>
                <p className="mb-0 text-muted">
                  Monthly Sales<span className="float-end">3,756</span>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        {/* <!-- COL END --> */}
      </Row>

      {/* <!-- Row --> */}
      <Row className="row-sm">
        <Col sm={12} md={4}>
          <Card className="custom-card">
            <div className="card-header border-bottom-0 pt-4">
              <h6 className="main-content-label mb-0">Projects Overview</h6>
            </div>
            <Card.Body>
              <div className="border">
                <div className="p-3 ">
                  <h6>HTML Project</h6>
                  <div className="main-traffic-detail-item">
                    <div>
                      <span>Project status</span> <span>35%</span>
                    </div>
                    <div className="progress-bar-xs">
                      <ProgressBar
                        now={35}
                        className="wd-100p progress-sm"
                        variant="primary"
                      ></ProgressBar>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-top">
                  <h6>Wordpress Project</h6>
                  <div className="main-traffic-detail-item">
                    <div>
                      <span>Project status</span> <span>50%</span>
                    </div>
                    <div className="progress-bar-xs">
                      <ProgressBar
                        now={50}
                        className="wd-100p progress-sm"
                        role="progressbar"
                        variant="secondary"
                      ></ProgressBar>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-top">
                  <h6>Angular Project</h6>
                  <div className="main-traffic-detail-item">
                    <div>
                      <span>Project status</span> <span>40%</span>
                    </div>
                    <div className="progress-bar-xs">
                      <ProgressBar
                        now={40}
                        className="wd-100p progress-sm"
                        variant="info"
                      ></ProgressBar>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-top">
                  <h6>React Project</h6>
                  <div className="main-traffic-detail-item">
                    <div>
                      <span>Project status</span> <span>10%</span>
                    </div>
                    <div className="progress-bar-xs">
                      <ProgressBar
                        now={10}
                        className="wd-100p progress-sm"
                        variant="danger"
                      ></ProgressBar>
                    </div>
                  </div>
                </div>

              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={12} md={8} >
          <Row className="row-sm">
            <Col sm={12} md={6}>
              <Card className="card custom-card our-team">
                <Card.Body>
                  <div className="picture avatar-lg online text-center">
                    <img alt="avatar" className="rounded-circle" src={ALLImages('face5')} />
                  </div>
                  <div className="text-center mt-3">
                    <h5 className="pro-user-username text-dark mt-2 mb-0">
                      Mariane Galeon
                    </h5>
                    <p className="pro-user-desc text-muted mb-1">
                      Web Developer
                    </p>
                    <p className="user-info-rating">
                      <Link to="#" className="me-1">
                        <i className="fa fa-star text-warning"> </i>
                      </Link>
                      <Link to="#" className="me-1">
                        <i className="fa fa-star text-warning"> </i>
                      </Link>
                      <Link to="#" className="me-1">
                        <i className="fa fa-star text-warning"> </i>
                      </Link>
                      <Link to="#" className="me-1">
                        <i className="fa fa-star text-warning"> </i>
                      </Link>
                      <Link to="#" className="me-1">
                        <i className="far fa-star text-warning"> </i>
                      </Link>
                    </p>
                  </div>
                  <div className="contact-info mb-0 text-center">
                    <Link to="#" className="contact-icon border text-primary me-2 my-1">
                      <i className="fab fa-facebook-f"></i>
                    </Link>
                    <Link to="#" className="contact-icon border text-primary me-2 my-1">
                      <i className="ri-twitter-x-fill"></i>
                    </Link>
                    <Link to="#" className="contact-icon border text-primary me-2 my-1">
                      <i className="fab fa-google"></i>
                    </Link>
                    <Link to="#" className="contact-icon border text-primary me-2 my-1">
                      <i className="fab fa-dribbble"></i>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={6}>
              <Card className="custom-card our-team">
                <Card.Body>
                  <div className="picture avatar-lg online text-center">
                    <img alt="avatar" className="rounded-circle" src={ALLImages('face6')} />
                  </div>
                  <div className="text-center mt-3">
                    <h5 className="pro-user-username text-dark mt-2 mb-0">
                      Joyce Chua
                    </h5>
                    <p className="pro-user-desc text-muted mb-1">
                      App Developer
                    </p>
                    <p className="user-info-rating">
                      <Link to="#">
                        <i className="fa fa-star text-warning me-1"> </i>
                      </Link>
                      <Link to="#">
                        <i className="fa fa-star text-warning me-1"> </i>
                      </Link>
                      <Link to="#">
                        <i className="fa fa-star text-warning me-1"> </i>
                      </Link>
                      <Link to="#">
                        <i className="fa fa-star text-warning me-1"> </i>
                      </Link>
                      <Link to="#">
                        <i className="far fa-star text-warning"> </i>
                      </Link>
                    </p>
                  </div>
                  <div className="contact-info mb-0 text-center">
                    <Link to="#" className="contact-icon border text-primary me-2 my-1">
                      <i className="fab fa-facebook-f"></i>
                    </Link>
                    <Link to="#" className="contact-icon border text-primary me-2 my-1">
                      <i className="ri-twitter-x-fill"></i>
                    </Link>
                    <Link to="#" className="contact-icon border text-primary me-2 my-1">
                      <i className="fab fa-google"></i>
                    </Link>
                    <Link to="#" className="contact-icon border text-primary me-2 my-1">
                      <i className="fab fa-dribbble"></i>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="row-sm">
            <Col lg={12}>
              <Card className="custom-card">
                <Row className="row-sm">
                  <Col sm={6} lg={6} className="border-end">
                    <Card.Body className="iconfont text-center">
                      <h6 className="">Total Cost Reduction</h6>
                      <h3 className="mt-1">$23,567</h3>
                      <p className="text-muted">
                        <span className="text-purple">
                          <i className="fa fa-arrow-up text-success me-1"> </i>
                          23%
                        </span>
                        in this year
                      </p>
                      <div className="progress progress-sm mb-0">
                        <ProgressBar
                        animated
                          className="wd-100p"
                          striped
                          variant="success"
                          now={60}
                        ></ProgressBar>
                      </div>
                    </Card.Body>
                  </Col>
                  <Col sm={6} lg={6}>
                    <Card.Body className="iconfont text-center">
                      <h6>Total Cost Savings</h6>
                      <h3 className="mt-1">15.2%</h3>
                      <p className="text-muted">
                        <span>
                          <i className="fa fa-arrow-down text-danger me-1"> </i>
                          12%
                        </span>
                        in this year
                      </p>
                      <div className="progress progress-sm mb-0">
                        <ProgressBar
                        animated
                          className=" wd-100p"
                          striped
                          variant="danger"
                          now={80}
                        ></ProgressBar>
                      </div>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      {/* <!--End Row --> */}

      {/* <!-- Row --> */}
      <Row className="row-sm">
        <Col sm={12} md={12} xl={4}>
          <Card className=" custom-card">
            <Card.Body >
              <div className="card-block">
                <div className="row align-items-center justify-content-center">
                  <div className="col-auto user-lock">
                    <img
                      className="img-fluid rounded-circle"
                      src={ALLImages('face8')}
                      alt="avatar"
                    />
                  </div>
                  <div className="col">
                    <h5>Joyce Chua</h5>
                    <span>UX Designer</span>
                  </div>
                </div>
                <ul className="task-list">
                  <li>
                    <i className="task-icon bg-primary"></i>
                    <h6 className="text-dark">
                      Task Finished
                      <span className="float-end text-muted fs-11">
                        29 Oct 2020
                      </span>
                    </h6>
                    <p className="text-muted fs-12">
                      Adam Berry finished task on
                      <Link to="#" className="fw-semibold"> Project Management </Link>
                    </p>
                  </li>
                  <li>
                    <i className="task-icon bg-secondary"></i>
                    <h6 className="text-dark">
                      New Comment
                      <span className="float-end text-muted fs-11">
                        25 Oct 2020
                      </span>
                    </h6>
                    <p className="text-muted fs-12">
                      Victoria commented on Project
                      <Link to="#" className="fw-semibold"> AngularJS Template </Link>
                    </p>
                  </li>
                  <li> <i className="task-icon bg-secondary"></i>
                    <h6 className="text-dark">Project Completed<span className="float-end text-muted fs-11">22 Aug 2020</span></h6>
                    <p className="text-muted fs-12">Victoria commented on Project <Link to="#" className="fw-medium"> AngularJS Template</Link></p></li>
                  <li>
                    <i className="task-icon bg-secondary"></i>
                    <h6 className="text-dark">
                      New Request
                      <span className="float-end text-muted fs-11">
                        25 Oct 2020
                      </span>
                    </h6>
                    <p className="text-muted fs-12">
                      Victoria commented on Project
                      <Link to="#" className="fw-semibold"> AngularJS Template </Link>
                    </p>
                  </li>
                  <li>
                    <i className="task-icon bg-danger"></i>
                    <h6 className="text-dark">
                      Task Overdue
                      <span className="float-end text-muted fs-11">
                        14 Oct 2020
                      </span>
                    </h6>
                    <p className="text-muted mb-0 fs-12">
                      Petey Cruiser finished task
                      <Link to="#" className="fw-semibold"> Integrated management </Link>
                    </p>
                  </li>
                </ul>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} sm={12} xl={4} >
          <Card className="custom-card">
            <Card.Header className="border-bottom-0">
              <div>
                <label className="main-content-label mb-2">
                  Top Ongoing Projects
                </label>
                <span className="d-block fs-12 mb-2 text-muted">
                  Projects where development work is on completion
                </span>
              </div>
            </Card.Header>
            <Card.Body className="pt-2 mt-0">
              <ListGroup className="border projects-list" >
                <ListGroup.Item as='a' action className="flex-column border-end-0 border-start-0 align-items-start border-top-0" >
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1 fw-medium ">PSD Projects</h6>
                    <small className="text-danger"><i className="fa fa-caret-down me-1"></i>5 days ago</small>
                  </div>
                  <p className="mb-0 text-muted mb-0 fs-12">Started:17-02-2020</p>
                  <small className="text-muted">Lorem ipsum dolor sit amet, consectetuer adipiscing elit...</small>
                </ListGroup.Item>
                <ListGroup.Item as='a' action className="flex-column border-end-0 border-start-0 align-items-start" >
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1 fw-medium">Wordpress Projects</h6>
                    <small className="text-success"><i className="fa fa-caret-up me-1"></i>2 days ago</small> </div>
                  <p className="mb-0 text-muted mb-0 fs-12">Started:15-02-2020</p>
                  <small className="text-muted">Lorem ipsum dolor sit amet, consectetuer adipiscing elit..</small>
                </ListGroup.Item>
                <ListGroup.Item as='a' action className="border-end-0 border-start-0 flex-column align-items-start" >
                  <div className="d-flex w-100 justify-content-between"> <h6 className="mb-1 fw-medium">HTML &amp; CSS3 Projects</h6>
                    <small className="text-danger"><i className="fa fa-caret-down me-1"></i>1 days ago</small> </div>
                  <p className="mb-0 text-muted mb-0 fs-12">Started:26-02-2020</p>
                  <small className="text-muted">Lorem ipsum dolor sit amet, consectetuer adipiscing elit..</small>
                </ListGroup.Item>
                <ListGroup.Item as='a' action className="flex-column border-end-0 border-bottom-0 border-start-0 align-items-start" >
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1 fw-medium">Excel Projects</h6>
                    <small className="text-success"><i className="fa fa-caret-up me-1"></i>2 days ago</small> </div>
                  <p className="mb-0 text-muted mb-0 fs-12">Started:15-02-2020</p>
                  <small className="text-muted">Lorem ipsum dolor sit amet, consectetuer adipiscing elit..</small>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} sm={12} xl={4} >
          <Card className="custom-card">
            <Card.Header className=" border-bottom-0 custom-card-header">
              <h6 className="main-content-label mb-0">Visitors</h6>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table className="table table-bordered mg-b-0" responsive>
                  <tbody>
                    {Visitors.map((items, index) => (
                      <tr key={index} data-index={index}>
                        <td className="bd-t-0 bd-l-0">
                          <div className="main-img-user">
                            <img alt="avatar" src={items.VisitorsId} />
                          </div>
                        </td>
                        <td className="bd-t-0 bd-l-0">
                          <h6 className="mg-b-0">{items.VisitorsName}</h6>
                          <small className="fs-11 tx-gray-500">
                            {items.Visitorsrole}
                          </small>
                        </td>
                        <td className="bd-t-0 bd-l-0">
                          <Link to="#"
                            className={`${items.VisitorBtn} ripple btn-${items.Visitorsfollowtext} btn-sm`}
                          >
                            {items.Visitorsfollow}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <!--End Row --> */}
    </Fragment>
  );
};

export default Widgets;
