import { Fragment } from "react";
import { Nav, Col, Row, Card, InputGroup, Form, Tab, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import Pageheader from "../../layouts/Pageheader";
import ALLImages from "../../common/Imagedata";

const Search = () => {
  return (
    <Fragment>
      <Pageheader mainheading='Search' parentfolder='Advanced Ui' activepage='Search' />

      <Row className="row-sm">
        <Col sm={12} md={12}>
          <Card className="custom-card search-page">
            <Card.Body className="pb-2">
              <InputGroup className="mb-2">
                <Form.Control className="border-end-0 ps-3" placeholder="Searching....." aria-label="Username" aria-describedby="basic-addon1" defaultValue="" />
                <InputGroup.Text id="basic-addon1" className="btn ripple btn-primary"><i className="fa fa-search"></i></InputGroup.Text>
              </InputGroup>
            </Card.Body>
            <Tab.Container id="left-tabs-example" defaultActiveKey='first'>
              <Card.Body className="ps-0 pe-0 bd-t-0 pt-0">
                <div className="main-content-body-profile mb-3">
                  <Nav variant="pills" className="main-nav-line">
                    <Nav.Item className="d-flex"><Nav.Link className="d-flex" eventKey="first"><i className="bx bx-search-alt fs-18 t-1 me-2"></i>All</Nav.Link></Nav.Item>
                    <Nav.Item className="d-flex"><Nav.Link className="d-flex" eventKey="second"><i className="bx bx-image-alt fs-18 me-2"></i>Images</Nav.Link></Nav.Item>
                    <Nav.Item className="d-flex"><Nav.Link className="d-flex" eventKey="third"><i className="bx bx-book fs-18  me-2"></i>Books</Nav.Link></Nav.Item>
                    <Nav.Item className="d-flex"><Nav.Link className="d-flex" eventKey="fourth"><i className="bx bx-news fs-18 me-2"></i>News</Nav.Link></Nav.Item>
                    <Nav.Item className="d-flex"><Nav.Link className="d-flex" eventKey="fifth"><i className="bx bx-video fs-18 me-2"></i>Videos</Nav.Link></Nav.Item>
                  </Nav>
                </div>
                <p className="text-muted mb-0 ps-4">About 12,546,90000 results (0.56 Seconds)</p>
              </Card.Body>
            </Tab.Container>
          </Card>
          <Card className="custom-card">
            <Card.Body>
              <div className="mb-2">
                <Link to="https://www.spruko.com/demo/volgh/Volgh/HTML/index.html" className="fs-18 fw-medium text-primary">Volgh - Bootstrap Admin Dashboard HTML Template</Link>
              </div>
              <p className="text-success mb-1">https://www.spruko.com/demo/volgh/Volgh/HTML/index.html</p>
              <p className="mb-0 text-muted">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled.</p>
              <div className="mt-2">
                <span className="fs-14 mt-2">
                  <i className="me-1 fa fa-star text-warning"></i>
                  <i className="me-1 fa fa-star text-warning"></i>
                  <i className="me-1 fa fa-star text-warning"></i>
                  <i className="me-1 fa fa-star text-warning"></i>
                  <i className="me-1 fa fa-star text-warning"></i>
                </span>(5)
                <span className="border-end mx-2 pe-2 fs-14 d-inline-block">  8 reviews </span>
                <span className="me-2 fs-14">  USD - $24.00 - ‎<span className="text-success fs-14"> In stock </span> </span>
              </div>
            </Card.Body>
          </Card>
          <Card className="custom-card">
            <Card.Body>
              <div className="mb-2">
                <Link to="https://laravelui.spruko.com/volgh/index" className="fs-18 fw-medium text-primary">Volgh – Laravel Admin Template Bootstrap5</Link>
              </div>
              <p className="text-success mb-1">https://laravelui.spruko.com/volgh/index</p>
              <p className="mb-0 text-muted">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text..</p>
              <div className="mt-2">
                <span className="fs-14">
                  <i className="me-1 fa fa-star text-warning"></i>
                  <i className="me-1 fa fa-star text-warning"></i>
                  <i className="me-1 fa fa-star text-warning"></i>
                  <i className="me-1 fa fa-star text-warning"></i>
                  <i className="me-1 fa fa-star text-warning"></i>
                </span>(5)
                <span className="border-end mx-2 pe-2 fs-14 d-inline-block">  8 reviews </span>
                <span className="me-2 fs-14">  USD - $29.00 - ‎<span className="text-success fs-14"> In stock </span> </span>
              </div>
            </Card.Body>
          </Card>
          <Card className="custom-card">
            <Card.Body>
              <div className="mb-2">
                <Link to="https://www.spruko.com/demo/eudica/Eudica/Html/index.html" className="fs-18 fw-medium text-primary">Volgh template Images </Link>
              </div>
              <div>
                <span className="fs-18">
                  <span className="tag tag-default me-1">Volgh laravel
                    <Link to="#" className="tag-addon"><i className="fe fe-x"></i></Link>
                  </span>
                  <span className="tag tag-default me-1">Volgh Images
                    <Link to="#" className="tag-addon"><i className="fe fe-x"></i></Link>
                  </span>
                  <span className="tag tag-default me-1">Volgh Landing
                    <Link to="#" className="tag-addon"><i className="fe fe-x"></i></Link>
                  </span>
                  <span className="tag tag-default me-1">Volgh leftmenu
                    <Link to="#" className="tag-addon"><i className="fe fe-x"></i></Link>
                  </span>
                  <span className="tag tag-default me-1">Volgh Horizontalmenu
                    <Link to="#" className="tag-addon"><i className="fe fe-x"></i></Link>
                  </span>
                </span>
              </div>
              <ul className="mt-3 search-imgs ps-0">
                <li><img src={ALLImages('media74')} alt="related-image" className="wd-150 ht-150 border mb-2 mt-2" /></li>
                <li><img src={ALLImages('media75')} alt="related-image" className="wd-150 ht-150 border mb-2 mt-2" /></li>
                <li><img src={ALLImages('media76')} alt="related-image" className="wd-150 ht-150 border mb-2 mt-2" /></li>
                <li><img src={ALLImages('media77')} alt="related-image" className="wd-150 ht-150 border mb-2 mt-2" /></li>
                <li><img src={ALLImages('media78')} alt="related-image" className="wd-150 ht-150 border mb-2 mt-2" /></li>
              </ul>
              <br />
              <Link to="#" className="text-primary fs-15"><i className="fe fe-arrow-right me-2"></i>Related images</Link>
            </Card.Body>
          </Card>
          <Card className="custom-card">
            <Card.Body className="d-lg-flex">
              <div>
                <iframe width="200" height="138" src="https://www.youtube.com/embed/7KlJK1aLk1A" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
              <div className="ms-lg-3 mt-3 mt-lg-0">
                <h3 className="fs-18 fw-medium text-primary"><Link to="https://www.spruko.com/demo/volgh/">Volgh- Admin & Dashboard HTML Template</Link></h3>
                <p className="mb-0 text-success"><Link to="https://www.spruko.com/demo/volgh/Volgh/HTML/index.html" className="text-success" target="_blank">https://www.spruko.com/demo/volgh/Volgh/HTML/index.html</Link></p>
                <ul className="list-inline d-flex mt-2">
                  <li>
                    <i className="fa fa-star text-warning me-1"></i>
                    <i className="fa fa-star text-warning me-1"></i>
                    <i className="fa fa-star text-warning me-1"></i>
                    <i className="fa fa-star text-warning me-1"></i>
                    <i className="fa fa-star text-warning me-1"></i> 3 reviews
                  </li>
                  <li className="mx-3">USD - $24.00</li>
                  <li className="text-success">In Stock</li>
                </ul>
                <p className="text-muted"> <b>Volgh</b> – Bootstrap Admin panel Dashboard HTML Template. This admin template Includes 200+ HTML Pages & 40+ Plugins.
                  It has a Clean creative dashboard design layout and comes with several jQuery Plugins, Awesome cool color, charts, custom Tables and calendars</p>
              </div>
            </Card.Body>
          </Card>
          <Card className="custom-card">
            <Card.Body className="d-lg-flex">
              <div>
                <iframe width="200" height="138" src="https://www.youtube.com/embed/WmpPTEPS5mI" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
              <div className="ms-lg-3 mt-3 mt-lg-0">
                <h3 className="fs-18 fw-medium text-primary"><Link to="https://www.spruko.com/demo/dashlot/">Dashlot - Bootstrap 4 Admin Dashboard HTML Template | Themeforest Templates</Link></h3>
                <p className="mb-0 text-success"><Link to="#" className="text-success" target="_blank">https://www.spruko.com/demo/dashlot/Dashlot/HTML/index.html</Link></p>
                <ul className="list-inline d-flex mt-2">
                  <li>
                    <i className="fa fa-star text-warning me-1"></i>
                    <i className="fa fa-star text-warning me-1"></i>
                    <i className="fa fa-star text-warning me-1"></i>
                    <i className="fa fa-star text-warning me-1"></i>
                    <i className="fa fa-star-half text-warning me-1"></i> 2 reviews
                  </li>
                  <li className="mx-3">USD - $24.00</li>
                  <li className="text-success">In Stock</li>
                </ul>
                <p className="text-muted"> <b>Dashlot </b> – Bootstrap Responsive Admin panel Dashboard Template Ui Kit & Premium Dashboard Design Modern Flat HTML Template. This Template Includes 2000 HTML Pages & 90+ Plugins. No Need to do hard work for this template customization</p>
              </div>
            </Card.Body>
          </Card>
          <Card className="custom-card">
            <Card.Body>
              <div className="mb-2">
                <Link to="https://www.spruko.com/demo/azira/dist/html/index.html" target="_blank" className="fs-18 fw-medium text-primary">Azira - Admin Dashboard HTML Template</Link>
              </div>
              <p className="text-success mb-1">https://www.spruko.com/demo/azira/dist/html/index.html</p>
              <p className="mb-0 text-muted"><b>Azira</b> – is a modern, and creative admin and dashboard template using modern and minimal design. It is fully flexible user-friendly and responsive. Azira admin template is powered with HTML 5, SASS, & Bootstrap 4 which looks great on Desktops, Tablets, and Mobile Devices.</p>
              <div className="mt-2">
                <span className="border-end mx-2 pe-2 fs-14 d-inline-block">  1 reviews </span>
                <span className="me-2 fs-14">  USD - $24.00 - ‎<span className="text-success fs-14"> In stock </span> </span>
              </div>
            </Card.Body>
          </Card>
          <Card className="custom-card">
            <Card.Body>
              <div className="mb-2">
                <Link to="https://www.spruko.com/demo/claylist/Claylist/HTML/index.html" className="fs-18 fw-medium text-primary">Claylist - Bootstrap Responsive Classifieds, Directory, Multipurpose Listing HTML Template</Link>
              </div>
              <p className="text-success mb-1">https://www.spruko.com/demo/claylist/Claylist/HTML/index.html</p>
              <p className="mb-0 text-muted"><b>Claylist</b> is free classified ads website template with awesome responsive webdesign.It is suitable for all kinds of classified ads site .It is easy to customize. It has beautiful Home Pages and useful inner pages, and all the important sections required by a classified website</p>
              <div className="mt-2">
                <span className="border-end mx-2 pe-2 fs-14 d-inline-block">  7 reviews </span>
                <span className="me-2 fs-14">  USD - $24.00 - ‎<span className="text-success fs-14"> In stock </span> </span>
              </div>
            </Card.Body>
          </Card>
          <Card className="custom-card">
            <Card.Body>
              <div className="mb-2">
                <Link to="https://www.spruko.com/demo/autolist/Autolist/Html/index.html" className="fs-18 fw-medium text-primary">Autolist – Car Dealer and Classifieds HTML Template</Link>
              </div>
              <p className="text-success mb-1">https://www.spruko.com/demo/autolist/Autolist/Html/index.html</p>
              <p className="mb-0 text-muted"><b>Autolist</b> – This Template Designed for Autotrader, Car Classifieds, Car dealer, Car rental System and also Multipurpose auto classifieds Template.This Template Includes 80+ HTML Pages & 30+ Plugins Includes.It is suitable for all kinds of auto websites Listing Business. It is especially designed for list of categories specific pages, multiple variations listing pages, car rental page, car auction page, car service page, car booking pages, etc.</p>
              <div className="mt-2">
                <span className="border-end mx-2 pe-2 fs-14 d-inline-block">  5 reviews </span>
                <span className="me-2 fs-14">  USD - $24.00 - ‎<span className="text-success fs-14"> In stock </span> </span>
              </div>
            </Card.Body>
          </Card>
          <Card className="custom-card">
            <Card.Body>
              <div className="mb-2">
                <Link to="https://www.spruko.com/demo/eudica/Eudica/Html/index.html" className="fs-18 fw-medium text-primary">Eudica – Online Education Courses HTML Template</Link>
              </div>
              <p className="text-success mb-1">https://www.spruko.com/demo/eudica/Eudica/Html/index.html</p>
              <p className="mb-0 text-muted"><b>Eudica</b> –  Online Education & Learning Courses HTML CSS Responsive Template. This Template Includes 65+ HTML Pages & 55 Plugins. No Need to do hard work for this template customization. We are design easily understandable code & User Friendly.Advanced Form-Elements like Date pickers,Advanced form elements etc.</p>
              <div className="mt-2">
                <span className="border-end mx-2 pe-2 fs-14 d-inline-block">  3 reviews </span>
                <span className="me-2 fs-14">  USD - $24.00 - ‎<span className="text-success fs-14"> In stock </span> </span>
              </div>
            </Card.Body>
          </Card>
          <div className="text-center ms-3 mb-4">
            <Row className="row-sm">
              <Pagination className="justify-content-end">
                <Pagination.Item disabled>Prev</Pagination.Item>
                <Pagination.Item active>{1}</Pagination.Item>
                <Pagination.Item>{2}</Pagination.Item>
                <Pagination.Item>{3}</Pagination.Item>
                <Pagination.Item>{4}</Pagination.Item>
                <Pagination.Item>{5}</Pagination.Item>
                <Pagination.Item>Next</Pagination.Item>
              </Pagination>
            </Row>
          </div>
        </Col>
      </Row>
    </Fragment>
  )
};

export default Search;
