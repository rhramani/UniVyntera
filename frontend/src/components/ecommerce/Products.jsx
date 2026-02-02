import { Fragment } from "react";
import { Badge, Button, Card, Col, Form, Pagination, Row, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Productdetails } from "../../common/Comondata";
import Select from 'react-select'
import { BabyCare, Electonics, Mens, Stationary, Womens } from "../../common/Select2data";
import Pageheader from "../../layouts/Pageheader";

const Products = () => {
  return (
    <Fragment>
      <Pageheader mainheading='Products' parentfolder='ECommerce' activepage='Products' />
      <Row className="row-sm">
        <Col md={8} xl={9}>
          <Row className="row-sm">
            {Productdetails.map((items, index) => (
              <Col md={6} lg={6} xl={4} sm={6} key={index} data-index={index}>
                <Card className="custom-card">
                  <div className="p-0 ht-100p">
                    <div className="product-grid">
                      <div className="product-image">
                        <Link to={`${import.meta.env.BASE_URL}ecommerce/products`} className="image">
                          <img className="pic-1" alt="product1" src={items.Product1} />
                          <img className="pic-2" alt="product2" src={items.Product2} />  
                        </Link>
                        <Link to="#" className="product-like-icon"><i className={`far fa-${items.Favorite}`}></i></Link>
                        <span className={`product-${items.discountoffer}-label bg-${items.Productdiscounttext}`}>{items.Productdiscount}</span>
                        <div className="product-link">
                          <Link to={`${import.meta.env.BASE_URL}ecommerce/ecart`}><i className="fa fa-shopping-cart"></i><span>{items.Addtocart}</span></Link>
                          <Link to={`${import.meta.env.BASE_URL}ecommerce/productdeatils/`}><i className="fas fa-eye"></i><span>{items.Quickview}</span></Link>
                        </div>
                      </div>
                      <div className="product-content">
                        <h3 className="title"><Link to="#">{items.ProductId}</Link></h3>
                        <div className="price"><span className="old-price">{items.Productpriceold}</span>
                          <span className="text-danger">{items.Productdiscountnew}</span>
                        </div>
                        <ul className="rating">
                          <li className="fas fa-star me-1"></li>
                          <li className="fas fa-star me-1"></li>
                          <li className="fas fa-star me-1"></li>
                          <li className="fas fa-star me-1"></li>
                          <li className="far fa-star"></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <nav>
            <Pagination className="pagination justify-content-end ">
              <Pagination.Item>Prev</Pagination.Item>
              <Pagination.Item>{1}</Pagination.Item>
              <Pagination.Item className="page-item active">{2}</Pagination.Item>
              <Pagination.Item >{3}</Pagination.Item>
              <Pagination.Item>{4}</Pagination.Item>
              <Pagination.Item>{5}</Pagination.Item>
              <Pagination.Item>Next</Pagination.Item>
            </Pagination>
          </nav>
        </Col>

        <Col md={4} xl={3}>
          <Card className="custom-card">
            <Card.Body>
              <Row className="row-sm">
                <Col sm={12}>
                  <InputGroup >
                    <Form.Control
                      type="text"
                      className="form-control"
                      placeholder="Search ..."
                    />
                    <Button
                      variant="primary" className="btn ripple" type="button">
                      Search
                    </Button>
                  </InputGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Row className="row-sm">
            <Col md={12} lg={12}>
              <Card className="custom-card">
                <Card.Header className="custom-card-header">
                  <h6 className="main-content-label mb-3">Categories</h6>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="form-group">
                    <Form.Label>Mens</Form.Label>
                    <Select options={Mens} classNamePrefix="Select2" placeholder="Foot wear" />
                  </Form.Group>
                  <Form.Group className="form-group">
                    <Form.Label>Women</Form.Label>
                    <Select options={Womens} classNamePrefix="Select2" placeholder="Western wear" />
                  </Form.Group>
                  <Form.Group className="form-group">
                    <Form.Label>Baby & Kids</Form.Label>
                    <Select options={BabyCare} classNamePrefix="Select2" placeholder="Boy's Clothing" />
                  </Form.Group>
                  <Form.Group className="form-group">
                    <Form.Label>Electronics</Form.Label>
                    <Select options={Electonics} classNamePrefix="Select2" placeholder="Mobiles" />
                  </Form.Group>
                  <Form.Group className="form-group">
                    <Form.Label>Sport,Books & ore </Form.Label>
                    <Select options={Stationary} classNamePrefix="Select2" placeholder="Stationary" />
                  </Form.Group>
                  <Form.Group className="form-group">
                    <Form.Label>Price</Form.Label>
                    <Form.Check className="form-check-md" type="radio" name="example-radios" defaultValue="option1" label="Under $25" defaultChecked />
                    <Form.Check className="form-check-md" type="radio" name="example-radios" defaultValue="option2" label="$25 to $50" />
                    <Form.Check className="form-check-md" type="radio" name="example-radios" defaultValue="option2" label="$50to $100" />
                    <Form.Check className="form-check-md" type="radio" name="example-radios" defaultValue="option2" label="Other (specify)" />
                  </Form.Group>
                  <Link className="btn ripple btn-primary w-100" to="#">
                    Apply Filter
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      {/* <!-- End Row --> */}
    </Fragment>
  );
};

export default Products;
