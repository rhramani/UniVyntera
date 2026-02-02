import { Fragment } from "react";
import { Row, Col, Card, Form, Button, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BitCoinsell } from "../../common/Chartdata";
import Select from 'react-select'
import { BuyCurrencyselectoption, selectoptionsdata, selectoptionsdata2 } from "../../common/Select2data";
import { BuyingsellingOrders } from "../../common/Comondata";
import Pageheader from "../../layouts/Pageheader";
import ALLImages from "../../common/Imagedata";

function Buysell() {

  return (
    <Fragment>
      <Pageheader mainheading='Buy & Sell' parentfolder='Crypto-Currencies' activepage='Buy & Sell' />
      {/* <!-- Row--> */}
      <Row className="row-sm">
        <Col md={12}>
          <Card className="custom-card overflow-hidden">
            <div className="card-header d-flex justify-content-between pb-3 border-bottom">
              <div className="align-items-center">
                <h4 className="d-flex mb-0">
                  Bitcoin
                  <span className="text-muted fs-13 ms-2 my-auto">BTC</span>
                </h4>
              </div>
              <Button
                variant="primary" className="btn ms-auto">Buy Bitcoin</Button>
            </div>
            <BitCoinsell />
          </Card>
        </Col>
        <Col lg={12} xl={12} xxl={6} md={12}>
          <Card className="custom-card overflow-hidden crypto-buysell-card">
            <Card.Body>
              <Card.Header className=" border-bottom-0 ps-0 pt-0">
                <label className="main-content-label my-auto">
                  Buy Currency
                </label>
              </Card.Header>
              <div className="d-flex mt-3 mb-3">
                <div className="">
                  <p className="fs-16 text-muted mb-2">1 USDT is roughly</p>
                  <h3>
                    5.47<span className="text-success fs-15 ms-2">CNY</span>
                  </h3>
                </div>
                <div className="ms-auto my-auto">
                  <span className="claim me-2">
                    Claim
                    <span className="font-weight-bold text-success mx-2">20</span>
                    Free Bitcoin
                  </span>
                </div>
              </div>
              <Form.Group className="form-group">
                <InputGroup className="mb-3">
                  <Form.Control placeholder="Spend 32 - 6500" aria-label="Spend 32 - 6500" aria-describedby="basic-addon2" />
                  <div className="wd-xl-30p p-0 input-group-btn">
                    <Select options={selectoptionsdata} placeholder='BTC' classNamePrefix="Select2" />
                  </div>
                </InputGroup>
              </Form.Group>
              <Form.Group className="form-group">
                <InputGroup>
                  <Form.Control type="text" className="input-lg wd-80p" defaultValue="Buy" />
                  <div className="p-0 wd-xl-30p input-group-btn">
                    <Select options={selectoptionsdata2} placeholder='USD' classNamePrefix="Select2" />
                  </div>
                </InputGroup>
              </Form.Group>
              <Form.Group className="fs-14">
                <Form.Control className="input-lg" type="text" placeholder="498fd7c42932070ff3ec30" />
              </Form.Group>
              <Form.Label className="main-content-label mt-4 mb-4">
                Select payment method
              </Form.Label>
              <Form className="payment-form form">
                <div className="payment-type d-flex">
                  <Form.Control name="radio3" type="radio" id="credit" className="form-check-input" value="credit" defaultChecked />
                  <Form.Label className="credit-label payment-cards four ms-0 col" htmlFor="credit" >
                    <span className="d-none d-md-block">New card</span>
                    <img src={ALLImages("payment4")} alt="visa" />
                  </Form.Label>
                  <Form.Control type="radio" name="radio3" id="debit" className="form-check-input" defaultValue="debit" />
                  <label className="debit-label payment-cards four col" htmlFor="debit" >
                    <span className="d-none d-md-block">Debit Card</span>
                    <img src={ALLImages("payment2")} alt="Debitcard" />
                  </label>
                  <Form.Control type="radio" name="radio3" id="paypal" defaultValue="paypal" />
                  <label className="paypal-label payment-cards four col" htmlFor="paypal" >
                    <span className="d-none d-md-block">Paypal</span>
                    <img src={ALLImages("payment3")} alt="paypal" />
                  </label>
                  <Form.Control type="radio" name="radio3" id="amex" defaultValue="amex" />
                  <label className="amex-label payment-cards four col" htmlFor="amex">
                    <span className="d-none d-md-block">Amex</span>
                    <img src={ALLImages("payment1")} alt="amexg1096" />
                  </label>
                </div>
                <div className="d-grid">
                  <Link to="#" className="btn btn-primary btn-lg mt-4"> Buy Now </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={12} xl={12} xxl={6} md={12}>
          <Card className=" custom-card  crypto-buysell-card">
            <Card.Body>
              <div className="card-header border-bottom-0 ps-0 pt-0">
                <label className="main-content-label my-auto"> Sell Currency </label>
              </div>
              <div className="form-group">
                <label className="fw-medium fs-16 mt-3 mb-2"> Sell From </label>
                <div className="p-3 border d-flex rounded-2">
                  <div className="d-flex">
                    <span className="crypto-icon bg-primary-transparent me-3">
                      <i className="cf cf-btc text-primary"></i>
                    </span>
                    <span className="my-auto fs-18 fw-medium"> Bitcoin BTC </span>
                  </div>
                  <div className="d-flex ms-auto">
                    <div className="card-item-stat d-none d-md-block">
                      <h4 className="fw-semibold mb-0 fs-15"> 0.374648545 BTC </h4>
                      <small className="fs-13 float-end text-end text-muted"> $5,634.65  </small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="fw-medium fs-16 mt-2 mb-2"> Deposit to </label>
                <div className="p-3 border d-flex rounded-2">
                  <span className="crypto-icon bg-primary-transparent">
                    <i className="fa fa-bank text-primary"></i>
                  </span>
                  <div className="my-auto ms-3">
                    <div className="d-flex my-auto fs-16 fw-medium"> Banking </div>
                    <small className="fs-13 text-muted">Checking</small>
                  </div>
                </div>
              </div>
              <label className="fw-medium fs-16 mt-2 mb-2 pb-1"> Amount </label>
              <hr className="my-0" />
              <div className="d-flex my-2">
                <p className="fs-16 mb-1 text-muted">Weekly bank limit</p>
                <div className="ms-auto my-auto">
                  <span className="fs-16 text-muted">$10,000.00 remaining</span>
                </div>
              </div>
              <div className="row">
                <div className="form-group col-xl-5 col-lg-12 col-md-12 mb-0">
                  <div className="input-group">
                    <input type="text" className="form-control input-lg wd-80p" defaultValue="0.041323" />
                    <div className="input-group-btn p-0 wd-xl-40p">
                      <Select options={BuyCurrencyselectoption} placeholder='USD' classNamePrefix="Select2" />
                    </div>
                  </div>
                </div>
                <Col xl={2} lg={12} md={12} className="form-group text-center my-auto">
                  <i className="pe-7s-repeat my-3 mt-xl-0 mb-xl-0 fs-26"></i>
                </Col>
                <Col xl={5} lg={12} md={12} className="form-group mb-0">
                  <InputGroup className="input-group">
                    <input type="text" className="form-control input-lg wd-80p" defaultValue="500" />
                    <div className=" input-group-btn p-0  wd-xl-40p">
                      <Select options={BuyCurrencyselectoption} placeholder='BTC' classNamePrefix="Select2" />
                    </div>
                  </InputGroup>
                </Col>
              </div>
              <div className="d-grid">
                <Link to="#" className="btn btn-primary btn-lg mt-4"> Sell Bitcoin </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <!-- Row End --> */}

      {/* <!-- Row--> */}
      <div className="row row-sm">
        <div className="col-xl-12">
          <div className="card custom-card">
            <div className="card-header border-bottom-0">
              <label className="main-content-label my-auto pt-2">
                Recent Buying & selling Orders
              </label>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table card-table text-nowrap table-bordered border-top">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Remaining</th>
                      <th>Price</th>
                      <th>USD</th>
                      <th>Fee (%)</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BuyingsellingOrders.map((list, index) => (
                      <tr key={index} data-index={index}>
                        <td>{list.ID}</td>
                        <td>
                          <span className={`text-${list.typeinfo}`}>
                            {list.Type}
                          </span>
                        </td>
                        <td>{list.Amount}</td>
                        <td>{list.Remaining}</td>
                        <td>{list.Price}</td>
                        <td>{list.Usd}</td>
                        <td>{list.Fee}</td>
                        <td>
                          <span
                            className={`badge bg-${list.Status}-transparent bg-pill`}
                          >
                            {list.statustext}
                          </span>
                        </td>
                        <td>{list.Date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Row End --> */}
    </Fragment>
  );
};

export default Buysell;
