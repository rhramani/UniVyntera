import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import { Shoppingcart } from "../../common/Comondata";
import Pageheader from "../../layouts/Pageheader";

const ECCart = () => {

  const [cart, setCart] = useState(Shoppingcart.map(item => ({ ...item, quantity: 0, total: 0 })));

  function dec(id) {
    setCart(prevCart => {
      const updatedCart = prevCart.map(item => {
        if (item.id === id && item.quantity > 0) {
          const newQuantity = item.quantity - 1;
          const newTotal = newQuantity * (item.Price); // Convert to number
          return { ...item, quantity: newQuantity, total: newTotal };
        }
        return item;
      });
      return updatedCart;
    });
  }

  function inc(id) {
    setCart(prevCart => {
      const updatedCart = prevCart.map(item => {
        if (item.id === id && item.quantity < 10) {
          const newQuantity = item.quantity + 1;
          const newTotal = newQuantity * (item.Price); // Convert to number
          return { ...item, quantity: newQuantity, total: newTotal };
        }
        return item;
      });
      return updatedCart;
    });
  }
  function removeItem(id) {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  }

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.total, 0);
  };
  const calculateDiscount = () => {
    return 20;
  };

  const calculateFinalTotal = () => {
    const totalPrice = calculateTotalPrice();
    const discount = calculateDiscount();
    return totalPrice - discount;
  };

  useEffect(() => {
  }, [cart]);

  return (
    <Fragment>
      <Pageheader mainheading='Cart' parentfolder='ECommerce' activepage='Cart' />

      <Row className="row-sm">
        <Col lg={12} xl={9} md={12}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">Shopping cart</div>
            </Card.Header>
            <Card.Body className="pt-2">
              <div className="table-responsive">
                <Table className="border table-hover text-nowrap table-shopping-cart mb-0">
                  <thead className="text-muted">
                    <tr className="small text-uppercase">
                      <th scope="col">Product</th>
                      <th scope="col"></th>
                      <th scope="col" className="wd-120">Quantity</th>
                      <th scope="col" className="wd-120">Price</th>
                      <th scope="col" className="text-center " >Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((idx) => (
                      <tr key={idx.id}>
                        <td>
                          <div className="media align-items-center">
                            <div className="card-aside-img">
                              <img src={idx.Product} alt="img" className="img-sm" />
                            </div>
                            <div className="media-body mt-2">
                              <div className="card-item-desc mt-0">
                                <h6 className="fw-medium mt-0 text-uppercase">{idx.ProductName}</h6>
                                <dl className="card-item-desc-1 mb-0">
                                  <dt>Color: </dt>
                                  <dd>{idx.Colorpicker}</dd>
                                </dl>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className={`text-${idx.Qtytext} small mb-0 mt-1 fs-12`}>{idx.Qty}</p>
                        </td>
                        <td className="product-quantity-container">
                          <InputGroup className="br-3 border flex-nowrap align-items-center">
                            <Link to='#' className="btn btn-icon btn-light rounded-start-0 input-group-text flex-fill product-quantity-minus" onClick={() => dec(idx.id)}>
                              <i className="ri-subtract-line"></i>
                            </Link>
                            <span className="my-2 text-center w-100" aria-label="quantity">{idx.quantity}</span>
                            <Link to='#' className="btn btn-icon btn-light rounded-end-0 input-group-text flex-fill product-quantity-plus" onClick={() => inc(idx.id)}>
                              <i className="ri-add-line"></i>
                            </Link>
                          </InputGroup>
                        </td>
                        <td>
                          <div className="price-wrap"><span className="price fw-semibold fs-16">${idx.total}.00</span></div>
                        </td>
                        <td className="text-center">
                          <Link to="#" className="remove-list text-danger fs-20 remove-button" data-abc="true" onClick={() => removeItem(idx.id)}><i className="fa fa-trash"></i></Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={12} xl={3} md={12}>
          <Card className="custom-card">
            <Card.Body>
              <Form>
                <Form.Group className="mb-0"> <Form.Label className="form-label fw-medium">Have coupon?</Form.Label>
                  <div className="input-group"> 
                    <input type="text" className="form-control coupon" placeholder="Coupon code" />  
                     <button className="btn btn-primary btn-apply coupon">Apply</button>
                  </div>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
          <Card className="custom-card cart-details">
            <Card.Body>
              <h5 className="mb-3 fw-semibold fs-14">PRICE DETAIL</h5>
              <dl className="dlist-align mb-1">
                <dt className="">ITEMS</dt>
                <dd className="text-end ms-auto">${calculateTotalPrice().toFixed(2)}</dd>
              </dl>
              <dl className="dlist-align mb-1">
                <dt>Discount:</dt>
                <dd className="text-end text-danger ms-auto">- ${calculateDiscount().toFixed(2)}</dd>
              </dl>
              <dl className="dlist-align mb-1">
                <dt>Total price:</dt>
                <dd className="text-end ms-auto">{calculateTotalPrice() > 0 ? `$${calculateFinalTotal().toFixed(2)}` : "Add items to your cart"}</dd>
              </dl>
              <dl className="dlist-align mb-0">
                <dt>Delivery:</dt>
                <dd className="text-end text-success ms-auto">Free</dd>
              </dl>
              <hr />
              <dl className="dlist-align">
                <dt>Total:</dt>
                <dd className="text-end  ms-auto"><strong>{calculateTotalPrice() > 0 ? `$${calculateFinalTotal().toFixed(2)}` : "Add items to your cart"} </strong></dd>
              </dl>
              <div className="d-grid">
                <Link className="btn btn-primary" to={`${import.meta.env.BASE_URL}ecommerce/productdeatils/`}>Continue Shopping</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Fragment>
  );
};

export default ECCart;
