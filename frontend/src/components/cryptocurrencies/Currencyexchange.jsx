import { Fragment } from "react";
import { Link } from "react-router-dom";
import Select from 'react-select'
import { Card, Col, Container, Row } from "react-bootstrap";
import { Singleselectdata1, Singleselectdata2 } from "../../common/Select2data.jsx";
import { BTC, Dash, ETH, Litecoin, NEO, Ripple } from "../../common/Chartdata.jsx";
import Pageheader from "../../layouts/Pageheader.jsx";


const CurrencyExchange = () => {

  return (
    <Fragment>
      <Pageheader mainheading='Currency exchange' parentfolder='Crypto-Currencies' activepage='Currency exchange'/>
      <Row>
        <Col md={12}>
          <Card className="pt-0  custom-card pt-7 bg-background2 card pb-7 border-0 overflow-hidden">
            <div className="header-text mb-0">
              <Container fluid className="p-5">
                <div className="text-start text-white background-text">
                  <h1 className="mb-3 fs-50 fw-semibold text-fixed-white">
                    Buy and sell Coins without additional fees
                  </h1>
                  <p className="fs-18 mb-5 text-white-50">
                    Buy now and get +50% extra bonus Minimum pre-sale amount 100
                    Crypto Coin. We accept BTC crypto-currency..
                  </p>
                </div>
                <Row>
                  <Col xl={12} lg={12} md={12} className="d-block mx-auto">
                    <div className="item-search-tabs mb-6 background-text">
                      <div className="buy-sell">
                        <div className="form row mx-auto justify-content-center d-flex p-3 p-sm-4 py-4">
                          <div className="form-group col-xl-6 col-lg-6 col-md-12 mb-0">
                            <input type="text" className="form-control mb-4 mb-lg-0" id="text7" placeholder="13.2458" />
                          </div>
                          <div className="form-group col-xl-6 col-lg-6 col-md-12 mb-0">
                            <Select options={Singleselectdata1} classNamePrefix="Select2" placeholder="Choose one" />
                          </div>
                          <div className="col-xl-12 col-lg-12 col-md-12 my-3 text-start position-relative">
                            <i className=" pe-7s-repeat exchange-icon fs-30 inline-block"></i>
                          </div>
                          <div className="form-group  col-xl-6 col-lg-6 col-md-12 mb-0">
                            <input type="text" className="form-control mb-4 mb-lg-0" id="text6" placeholder="02.24" />
                          </div>
                          <div className="form-group col-xl-6 col-lg-6 col-md-12 mb-0">
                            <Select options={Singleselectdata2} classNamePrefix="Select2" placeholder="Choose one" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center background-text">
                      <Link
                        to="#"
                        className="btn btn-warning ps-6 pe-6 pt-2 pb-2 mx-auto float-start mt-5"
                      >
                        EXCHANGE NOW
                      </Link>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </Card>
        </Col>
        <Col md={12}>
          <Row className="row-sm">
            <Col xl={4} md={12} lg={6}>
              <Card className="custom-card crypto-card overflow-hidden shadow-sm">
                <Card.Body className="pb-0">
                  <div className="mb-0 d-flex">
                    <h5 className="d-flex mb-0 align-items-center">
                      <span className="cryp-icon bg-primary me-2">
                        <i className="cf cf-btc"></i>
                      </span>
                      Bitcoin BTC
                    </h5>
                    <span className="float-end ms-auto btn btn-success btn-sm">
                      24h
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <h5 className="d-flex my-auto fw-normal">
                      0.00000434
                      <span className="text-info fs-14 mt-auto ms-2">$0.04</span>
                    </h5>
                    <div className="text-danger">
                      <i className="me-1 text-success"></i> +4.16%
                    </div>
                  </div>
                  <div className="chart-wrapper">
                    <BTC />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={4} md={12} lg={6}>
              <Card className="custom-card crypto-card overflow-hidden shadow-sm">
                <Card.Body className="card-body pb-0">
                  <div className="mb-0 d-flex">
                    <h5 className="d-flex mb-0 align-items-center">
                      <span className="cryp-icon bg-primary me-2">
                        <i className="cf cf-eth"></i>
                      </span>
                      Ethereum ETH
                    </h5>
                    <span className="float-end ms-auto btn btn-success btn-sm">
                      24h
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <h5 className="d-flex my-auto fw-normal">
                      0.00000235
                      <span className="text-info fs-14 mt-auto ms-2">$0.12</span>
                    </h5>
                    <div className="text-danger">
                      <i className="me-1 text-success"></i> +2.12%
                    </div>
                  </div>
                  <div className="chart-wrapper">
                    <ETH />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={4} md={12} lg={6}>
              <Card className=" custom-card crypto-card overflow-hidden shadow-sm">
                <Card.Body className=" pb-0">
                  <div className="mb-0 d-flex">
                    <h5 className="d-flex mb-0 align-items-center">
                      <span className="cryp-icon bg-primary me-2">
                        <i className="cf cf-xrp"></i>
                      </span>
                      Ripple XRP
                    </h5>
                    <span className="float-end ms-auto btn btn-success btn-sm">
                      24h
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <h5 className="d-flex my-auto fw-normal">
                      0.00000434
                      <span className="text-info fs-14 mt-auto ms-2">$0.03</span>
                    </h5>
                    <div className="text-danger">
                      <i className="me-1 text-success"></i> +3.12%
                    </div>
                  </div>
                  <div className="chart-wrapper">
                    <Ripple />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={4} md={12} lg={6}>
              <Card className="custom-card crypto-card overflow-hidden shadow-sm">
                <Card.Body className="pb-0">
                  <div className="mb-0 d-flex">
                    <h5 className="d-flex mb-0 align-items-center">
                      <span className="cryp-icon bg-primary me-2">
                        <i className="cf cf-dash"></i>
                      </span>
                      Dash DASH
                    </h5>
                    <span className="float-end ms-auto btn btn-success btn-sm">
                      24h
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <h5 className="d-flex my-auto fw-normal">
                      0.00000372
                      <span className="text-info fs-14 mt-auto ms-2">$0.12</span>
                    </h5>
                    <div className="text-danger">
                      <i className="me-1 text-success"></i> +4.23%
                    </div>
                  </div>
                  <div className="chart-wrapper">
                    <Dash />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={4} md={12} lg={6}>
              <Card className=" custom-card crypto-card overflow-hidden shadow-sm">
                <Card.Body className="card-body pb-0">
                  <div className="mb-0 d-flex">
                    <h5 className="d-flex mb-0 align-items-center">
                      <span className="cryp-icon bg-primary me-2">
                        <i className="cf cf-neos"></i>
                      </span>
                      Neo NEO
                    </h5>
                    <span className="float-end ms-auto btn btn-success btn-sm">
                      24h
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <h5 className="d-flex my-auto fw-normal">
                      0.00000257
                      <span className="text-info fs-14 mt-auto ms-2">$0.07</span>
                    </h5>
                    <div className="text-danger">
                      <i className="me-1 text-success"></i> +2.17%
                    </div>
                  </div>
                  <div className="chart-wrapper">
                    <NEO />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={4} md={12} lg={6}>
              <Card className=" custom-card crypto-card overflow-hidden shadow-sm">
                <Card.Body className="pb-0">
                  <div className="mb-0 d-flex">
                    <h5 className="d-flex mb-0 align-items-center">
                      <span className="cryp-icon bg-primary me-2">
                        <i className="cf cf-ltc"></i>
                      </span>
                      Litecoin LTC
                    </h5>
                    <span className="float-end ms-auto btn btn-success btn-sm">
                      24h
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <h5 className="d-flex my-auto fw-normal">
                      0.00000534
                      <span className="text-info fs-14 mt-auto ms-2">$0.32</span>
                    </h5>
                    <div className="text-danger">
                      <i className="me-1 text-success"></i> +2.12%
                    </div>
                  </div>
                  <div className="chart-wrapper">
                    <Litecoin />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

    </Fragment>
  );
};

export default CurrencyExchange;
