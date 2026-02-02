import { Fragment, useState } from "react";
import { Col, Pagination, Row } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { WishlistData } from "../../common/Comondata";
import Pageheader from "../../layouts/Pageheader";

const Wishlist = () => {

  const [cart, setCart] = useState(WishlistData);

  function removeItem(id) {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  }

  return (
    <Fragment>

      <Pageheader mainheading='Wishlist' parentfolder='ECommerce' activepage='Wishlist' />

      <Row className="row-sm" id="wishlist">
        <Col md={12} lg={12} xl={12}>
          <Row className="row-sm">

            {cart.map((idx) => (
              <Col md={6} lg={6} sm={6} xl={4} xxl={3} className="alert mb-0" key={idx.id}>
                <div className="card custom-card">
                  <div className="p-0">
                    <div className="product-grid">
                      <div className="product-image">
                        <Link to={`${import.meta.env.BASE_URL}ecommerce/productdeatils/`} className="image">
                          <img className="pic-1" alt="product1" src={idx.Product1} />
                        </Link>
                        <Link to="#" className="wishlist-icon" onClick={() => removeItem(idx.id)}><i className='fe fe-trash'></i></Link>
                      </div>
                      <div className="product-content">
                        <div className="d-flex">
                          <div>
                            <h3 className="title">
                              <Link to="#">{idx.ProductId}</Link>
                            </h3>
                          </div>
                          <div className="price text-end ms-auto">
                            <span className="old-price">{idx.Productpriceold}</span>
                            <span className="fs-18">{idx.Productdiscountnew}</span>
                          </div>
                        </div>
                        <div>
                          <Link to="#"><i className="fa fa-star text-warning me-1"></i></Link>
                          <Link to="#"><i className="fa fa-star text-warning me-1"></i></Link>
                          <Link to="#"><i className="fa fa-star text-warning me-1"></i></Link>
                          <Link to="#"><i className="far fa-star text-warning me-1"></i></Link>
                          <Link to="#"><i className="far fa-star text-warning me-1"></i></Link>
                          <Link to="#" className="me-4 text-muted">{idx.ratingvalue}</Link>
                        </div>
                        <div className="mt-3 d-grid">
                          <Link to={`${import.meta.env.BASE_URL}ecommerce/ecart/`} className="btn btn-block btn-primary">
                            <i className="fe fe-shopping-cart me-2"></i><span>{idx.Addtocart}</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            ))}

          </Row>
            <Pagination className="justify-content-end">
              <Pagination.Item disabled> Prev </Pagination.Item>
              <Pagination.Item active> 1 </Pagination.Item>
              <Pagination.Item className="page-item"> 2 </Pagination.Item>
              <Pagination.Item className="page-item"> 3 </Pagination.Item>
              <Pagination.Item className="page-item"> 4 </Pagination.Item>
              <Pagination.Item className="page-item"> 5 </Pagination.Item>
              <Pagination.Item className="page-item"> Next </Pagination.Item>
            </Pagination>
        </Col>
      </Row>
    </Fragment>
  );
}

export default Wishlist;
