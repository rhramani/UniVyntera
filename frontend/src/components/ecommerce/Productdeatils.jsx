
import { Fragment, useState } from "react";
import { Button, Card, Col, Form, Row, Table, } from "react-bootstrap";
import { Link } from "react-router-dom";
import Select from 'react-select';
import { QuantitySelect } from "../../common/Select2data";
import Pageheader from "../../layouts/Pageheader";
import ALLImages from "../../common/Imagedata";


const Productdeatils = () => {

  let [img, setimg] = useState(ALLImages('png24'));

  let click = (id) => {
    if ((id) === "png24") {
      setimg(ALLImages('png24'))
    }
    else if ((id) === "png26") {
      setimg(ALLImages('png26'))
    }
    else if ((id) === "png25") {
      setimg(ALLImages('png25'))
    }
    else if ((id) === "png23") {
      setimg(ALLImages('png23'))
    }
  }

  return (
    <Fragment>
      <Pageheader mainheading='Product-Details' parentfolder='ECommerce' activepage='Product-Details' />

      {/* <!-- Row --> */}
      <Row className="row-sm">
        <Col md={12} lg={12}>
          <Card className=" custom-card productdesc">
            <Card.Body className="h-100">
              <Row>
                <Col xl={6} lg={12} md={12}>
                  <Row>
                    <div className="col-2">
                      <div className="clearfix carousel-slider">
                        <div className="carousel slide">
                          <div className="carousel-inner">
                            <div>
                              <div className="thumb my-2">
                                <img src={ALLImages('png24')} alt="img" onClick={() => { click("png24") }} />
                              </div>
                              <div data-bs-slide-to="1" className="thumb my-2">
                                <img src={ALLImages('png26')} alt="img" onClick={() => { click("png26") }} />
                              </div>
                              <div data-bs-slide-to="2" className="thumb my-2">
                                <img src={ALLImages('png25')} alt="img" onClick={() => { click("png25") }} />
                              </div>
                              <div data-bs-slide-to="3" className="thumb my-2">
                                <img src={ALLImages('png23')} alt="img" onClick={() => { click("png23") }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-7 offset-md-1 col-sm-9 col-8">
                      <div className="product-carousel">
                        <div
                          id="carousel"
                          className="carousel slide"
                          data-bs-ride="false"
                        >
                          <div className="carousel-inner">
                            <div>
                              <img src={img} alt="img" className="img-fluid mx-auto d-block" />
                            </div>
                            <div className="carousel-item">
                              <img src={ALLImages('png24')} alt="img" className="img-fluid mx-auto d-block"
                              />
                            </div>
                            <div className="carousel-item">

                              <img src={ALLImages('png26')} alt="img" className="img-fluid mx-auto d-block" />
                            </div>
                            <div className="carousel-item">

                              <img src={ALLImages('png22')} alt="img" className="img-fluid mx-auto d-block" />
                            </div>
                          </div>
                          <div className="text-center mt-4 mb-4 btn-list">
                            <Link to={`${import.meta.env.BASE_URL}ecommerce/ecart`} className="btn ripple btn-primary d-inline-flex align-items-center" >
                              <i className="fe fe-shopping-cart me-1"> </i> Add to cart
                            </Link>
                            <Link to={`${import.meta.env.BASE_URL}ecommerce/checkout`} className="btn ripple btn-secondary d-inline-flex align-items-center">
                              <i className="fe fe-credit-card me-1"> </i> Buy Now
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Row>
                </Col>
                <Col xl={6} lg={12} md={12}>
                  <div className="mt-4 mb-4">
                    <h4 className="mt-1 mb-3">
                      Touch Screen Waterproof Smartwatch
                    </h4>

                    <p className="text-muted float-start me-3">
                      <span className="fe fe-star text-warning me-1"></span>
                      <span className="fe fe-star text-warning me-1"></span>
                      <span className="fe fe-star text-warning me-1"></span>
                      <span className="fe fe-star text-warning me-1"></span>
                      <span className="fe fe-star me-1"></span>
                    </p>
                    <p className="text-muted mb-4">( 135 Customers Review )</p>
                    <h6 className="text-success text-uppercase">20 % Off</h6>
                    <h5 className="mb-2">
                      Price :
                      <span className="text-muted me-2">
                        <del>  $499 USD </del>
                      </span>
                      <b>$299 USD</b>
                    </h5>
                    <p className="fs-13 text-muted">
                      FREE SHIPPING on above Purchase of <b>$359</b>
                    </p>
                    <h6 className="mt-4 fs-16">Description</h6>
                    <p>
                      At vero eos et accusamus et iusto odio dignissimos ducimus
                      qui blanditiis praesentium voluptatum deleniti atque
                      corrupti quos dolores et quas molestias excepturi sint
                      occaecati cupiditate non provident, similique sunt in culpa
                      qui officia deserunt mollitia animi, id est laborum et
                      dolorum fuga.
                    </p>
                    <p>
                      On the other hand, we denounce with righteous indignation
                      and dislike men who are so beguiled and demoralized .
                    </p>
                    <p>
                      But I must explain to you how all this mistaken idea of
                      denouncing pleasure and praising pain was born and I will
                      give you a complete account of the system.
                    </p>
                  </div>
                  <div className="d-flex  mt-2">
                    <div className="mt-2 sizes">Quantity:</div>
                    <div className="d-flex ms-2">
                      <Form.Group>
                        <Select options={QuantitySelect} classNamePrefix="Select2" placeholder="1" menuPlacement="top"/>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="colors d-flex me-3 mt-3">
                    <span className="mt-2">colors:</span>
                    <div className="d-flex gutters-xs ms-4">
                      <div className="me-2">
                        <label className="colorinput">
                          <input
                            name="color"
                            type="radio"
                            defaultValue="azure"
                            className="colorinput-input" defaultChecked
                          />
                          <span className="colorinput-color bg-info"></span>
                        </label>
                      </div>
                      <div className="me-2">
                        <label className="colorinput">
                          <input
                            name="color"
                            type="radio"
                            defaultValue="indigo"
                            className="colorinput-input"
                          />
                          <span className="colorinput-color bg-secondary"></span>
                        </label>
                      </div>
                      <div className="me-2">
                        <label className="colorinput">
                          <input
                            name="color"
                            type="radio"
                            defaultValue="purple"
                            className="colorinput-input"
                          />
                          <span className="colorinput-color bg-danger"></span>
                        </label>
                      </div>
                      <div className="me-2">
                        <label className="colorinput">
                          <input
                            name="color"
                            type="radio"
                            defaultValue="pink"
                            className="colorinput-input"
                          />
                          <span className="colorinput-color bg-pink"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <div className="mt-4">
                <h5 className="mb-3">Specifications :</h5>
                <div>
                  <Row>
                    <Col xl={12}>
                      <div className="table-responsive">
                        <Table className="mb-0 border-top table-bordered text-nowrap">
                          <tbody>
                            <tr>
                              <th scope="row">Category</th>
                              <td>Watches</td>
                            </tr>
                            <tr>
                              <th scope="row">Brand</th>
                              <td>Willful</td>
                            </tr>
                            <tr>
                              <th scope="row">Color</th>
                              <td>White</td>
                            </tr>
                            <tr>
                              <th scope="row">Connections</th>
                              <td>Bluetooth</td>
                            </tr>
                            <tr>
                              <th scope="row">Application</th>
                              <td>
                                Messages, Phone, Pedometer, Heart Rate Monitor
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">Supported </th>
                              <td>Fitness Tracker, Sleep Monitor, Reminders</td>
                            </tr>
                            <tr>
                              <th scope="row">Warranty Summary</th>
                              <td>1 Year</td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                    <Col xl={12} className="mt-4">
                      <div className="card">
                        <Card.Body className="p-0">
                          <div className="d-flex p-3">
                            <h5 className="float-start main-content-label mb-0 mt-2">
                              All Ratings and Reviews
                            </h5>
                            <Link to="#" className="btn btn-outline-primary btn-sm float-end ms-auto" >
                              Top Rated
                            </Link>
                          </div>
                          <div className="media mt-0 p-4 border-bottom border-top">
                            <div className="d-flex me-3 flex-none">
                              <Link to="#">
                                <img
                                  className="media-image avatar avatar-md rounded-circle"
                                  alt="64x64"
                                  src={ALLImages("face8")}
                                />
                              </Link>
                            </div>
                            <div className="media-body">
                              <h5 className="mt-0 mb-1 fw-medium fs-16">
                                Bruce Tran

                              </h5>
                              <span className="text-muted fs-13">
                                Tue, 20 Mar 2020
                              </span>
                              <div className="text-warning mt-1">
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                              </div>
                              <p className="font-13  mb-2 mt-2">
                                Lorem Ipsum available, quis Neque porro quisquam
                                est, qui dolorem ipsum quia dolor sit amet,
                                consectetur, adipisci velit, sed quia non numquam
                                eius modi tempora incidunt ut labore et nostrud
                                exercitation ullamco laboris commodo consequat.
                              </p>
                              <Link to="#" className="me-2">
                                <span className="badge bg-primary">Helpful</span>
                              </Link>
                              <Link to="#" className="me-2">
                                <span>Comment</span>
                              </Link>
                              <Link to="#" className="me-2">
                                <span>Report</span>
                              </Link>
                            </div>
                          </div>
                          <div className="media mt-0  p-4 border-bottom">
                            <div className="d-flex me-3 flex-none">
                              <Link to="#">
                                <img
                                  className="media-image avatar avatar-md rounded-circle"
                                  alt="64x64"
                                  src={ALLImages("face3")}
                                />
                              </Link>
                            </div>
                            <div className="media-body">
                              <h5 className="mt-0 mb-1 fw-medium fs-16">
                                Mina Harpe
                                <span
                                  className="fs-14 ms-0"
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="top"
                                  title=""
                                  data-bs-original-title="verified"
                                >

                                </span>
                              </h5>
                              <span className="text-muted fs-13">
                                Tue, 20 Mar 2020
                              </span>
                              <div className="text-warning mt-1">
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                              </div>
                              <p className="font-13  mb-2 mt-2">
                                Lorem Ipsum available, quis Neque porro quisquam
                                est, qui dolorem ipsum quia dolor sit amet,
                                consectetur, adipisci velit, sed quia non numquam
                                eius modi tempora incidunt ut labore et nostrud
                                exercitation ullamco laboris commodo consequat.
                              </p>
                              <Link to="#" className="me-2">
                                <span className="badge bg-primary">Helpful</span>
                              </Link>
                              <Link to="#" className="me-2">
                                <span>Comment</span>
                              </Link>
                              <Link to="#" className="me-2">
                                <span>Report</span>
                              </Link>
                            </div>
                          </div>
                          <div className="media mt-0 p-4 border-bottom">
                            <div className="d-flex me-3 flex-none">
                              <Link to="#">
                                <img
                                  className="media-image avatar avatar-md rounded-circle"
                                  alt="64x64"
                                  src={ALLImages("face4")}
                                />
                              </Link>
                            </div>
                            <div className="media-body">
                              <h5 className="mt-0 mb-1 fw-medium fs-16">
                                Maria Quinn
                                <span
                                  className="fs-14 ms-0"

                                >
                                </span>
                              </h5>
                              <span className="text-muted fs-13">
                                Tue, 20 Mar 2020
                              </span>
                              <div className="text-warning mt-1">
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star"></i>
                                <i className="bx bxs-star text-light"></i>
                              </div>
                              <p className="font-13  mb-2 mt-2">
                                Lorem Ipsum available, quis Neque porro quisquam
                                est, qui dolorem ipsum quia dolor sit amet,
                                consectetur, adipisci velit, sed quia non numquam
                                eius modi tempora incidunt ut labore et nostrud
                                exercitation ullamco laboris commodo consequat.
                              </p>
                              <Link to="#" className="me-2">
                                <span className="badge bg-primary">Helpful</span>
                              </Link>
                              <Link to="#" className="me-2">
                                <span>Comment</span>
                              </Link>
                              <Link to="#" className="me-2">
                                <span>Report</span>
                              </Link>
                            </div>
                          </div>
                          <Link to="#"
                            className="text-center w-100 d-block p-3 font-weight-bold"

                          >
                            See All Reviews
                          </Link>
                        </Card.Body>
                        <div className="border-top px-4 pb-2 pt-4">
                          <h5 className="mb-4">Leave Comment</h5>
                          <div className="mb-1">
                            <Row>
                              <Form.Group className=" col-md-6">
                                <div className="mb-3 fw-medium">
                                  Your Name
                                </div>
                                <Form.Control
                                  placeholder="Your Name"
                                  className="mb-3"
                                  type="text"
                                />
                              </Form.Group>
                              <Form.Group className=" col-md-6">
                                <div className="mb-3 fw-medium">
                                  Email Address
                                </div>
                                <Form.Control
                                  placeholder="Email Address"
                                  className="mb-3"
                                  type="text"
                                />
                              </Form.Group>
                            </Row>
                          </div>
                          <span className="star-rating">
                            <Link to="#">
                              <i className="icofont-ui-rating icofont-2x"></i>
                            </Link>
                            <Link to="#">
                              <i className="icofont-ui-rating icofont-2x"></i>
                            </Link>
                            <Link to="#">
                              <i className="icofont-ui-rating icofont-2x"></i>
                            </Link>
                            <Link to="#">
                              <i className="icofont-ui-rating icofont-2x"></i>
                            </Link>
                            <Link to="#">
                              <i className="icofont-ui-rating icofont-2x"></i>
                            </Link>
                          </span>
                          <form>
                            <Form.Group>
                              <div className="mb-3 fw-medium">
                                Your Comment
                              </div>
                              <Form.Control as="textarea" aria-label="With textarea"></Form.Control>
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Button variant="primary"
                                className=" mt-3 mb-0"
                                type="button"
                              >
                                Post your review
                              </Button>
                            </Form.Group>
                          </form>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <!-- End Row --> */}
    </Fragment >
  )
};

export default Productdeatils;
