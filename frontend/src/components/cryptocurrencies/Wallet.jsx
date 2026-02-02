import { Fragment, useRef } from "react";
import { Card, Col, ListGroup, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { walletinfo } from "../../common/Comondata";
import ALLImages from "../../common/Imagedata";
import Pageheader from "../../layouts/Pageheader";


const Wallet = () => {
  const inputRef = useRef(null);

  const copyToClipboard = () => {
    if (inputRef.current && navigator.clipboard) {
      const textToCopy = inputRef.current.value;

      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          // Clipboard write was successful
          alert('Text copied to clipboard!');
        })
        .catch((error) => {
          // Handle any errors
          console.error('Error copying to clipboard:', error);
        });
    }
  };

  return (
    <Fragment>

      <Pageheader mainheading='Wallet' parentfolder='Crypto-Currencies' activepage='Wallet' />

      {/* <!-- row --> */}
      <Row className="row-sm">
        <Col xxl={4} xl={12} lg={12} md={12}>
          <Card className="custom-card">
            <Card.Header className=" border-bottom-0 mb-0">
              <label className="main-content-label mb-0">Wallet</label>
            </Card.Header>
            <Card.Body className=" pt-1">
              <div className="d-flex">
                <img src={ALLImages("svg3")} className="wd-40 ht-40 my-auto" alt="btc " />
                <div className="ms-3">
                  <span className="text-uppercase tx-14 mt-4 text-muted"> Available BTC </span>
                  <div className="d-flex my-auto">
                    <h2 className="mt-1 mb-0">0.0245465</h2>
                    <span className="mt-auto ms-2">BTC</span>
                  </div>
                </div>
              </div>
              <div className="d-sm-flex mt-4 justify-content-between">
                <div>
                  <p className="text-uppercase fs-13 text-muted mb-1"> Buy this month </p>
                  <div className="d-flex my-auto">
                    <h5 className="mt-1 mb-0">0.0324354</h5>
                    <span className="mt-auto ms-2">BTC</span>
                  </div>
                </div>
                <div className="mt-2 mt-sm-0">
                  <p className="text-uppercase fs-13 text-muted mb-1"> Sell this month </p>
                  <div className="d-flex my-auto">
                    <h5 className="mt-1 mb-0">0.02434566</h5>
                    <span className="mt-auto ms-2">BTC</span>
                  </div>
                </div>
              </div>
              <Row className=" mt-4">
                <div className="col-6 d-grid d-grid">
                  <button className="btn btn-block btn-primary">Deposit</button>
                </div>
                <div className="col-6 d-grid d-grid">
                  <button className="btn btn-block btn-success"> Withdraw </button>
                </div>
              </Row>
              <ListGroup className="mt-4 tx-13">
                <ListGroup.Item className=" pd-x-0 d-sm-flex justify-content-between">
                  <div className="d-sm-flex">
                    <span className="crypto-icon bg-primary-transparent me-3">
                      <i className="fe fe-arrow-down-left text-primary"></i>
                    </span>
                    <span className="my-auto fw-medium fs-15"> Received Bitcoin
                    </span>
                  </div>
                  <span className="fw-semibold my-auto text-success fs-15">
                    +0.00004564
                    <span className="mt-auto ms-2 text-muted fw-normal"> BTC </span>
                  </span>
                </ListGroup.Item>
                <ListGroup.Item className=" pd-x-0 d-sm-flex justify-content-between">
                  <div className="d-sm-flex">
                    <span className="crypto-icon bg-primary-transparent me-3">
                      <i className="fe fe-arrow-up-right text-primary"></i>
                    </span>
                    <span className="my-auto fw-medium fs-15"> Sent Bitcoin</span>
                  </div>
                  <span className="fw-semibold my-auto text-danger fs-15">
                    -0.03445436
                    <span className="mt-auto ms-2 text-muted fw-normal"> BTC </span>
                  </span>
                </ListGroup.Item>
                <ListGroup.Item className=" pd-x-0 d-sm-flex justify-content-between">
                  <div className="d-sm-flex">
                    <span className="crypto-icon bg-primary-transparent me-3">
                      <i className="fe fe-arrow-down-left text-primary"></i>
                    </span>
                    <span className="my-auto fw-medium fs-15"> Received Ethereum
                    </span>
                  </div>
                  <span className="fw-semibold my-auto text-success fs-15">
                    +4.2543
                    <span className="mt-auto ms-2 text-muted fw-normal"> ETH </span>
                  </span>
                </ListGroup.Item>
                <ListGroup.Item className=" pd-x-0 d-sm-flex justify-content-between">
                  <div className="d-sm-flex">
                    <span className="crypto-icon bg-primary-transparent me-3">
                      <i className="fe fe-arrow-up-right text-primary"></i>
                    </span>
                    <span className="my-auto fw-medium fs-15"> Sent Bitcoin</span>
                  </div>
                  <span className="fw-semibold my-auto text-danger fs-15">
                    +0.00255423
                    <span className="mt-auto ms-2 text-muted fw-normal"> BTC </span>
                  </span>
                </ListGroup.Item>
                <ListGroup.Item className=" pd-x-0 d-sm-flex justify-content-between">
                  <div className="d-sm-flex">
                    <span className="crypto-icon bg-primary-transparent me-3">
                      <i className="fe fe-arrow-down-left text-primary"></i>
                    </span>
                    <span className="my-auto fw-medium fs-15"> Received Litecoin </span>
                  </div>
                  <span className="fw-semibold my-auto text-success fs-15">
                    -0.02434525
                    <span className="mt-auto ms-2 text-muted fw-normal"> LTC </span>
                  </span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
          <Card className="custom-card">
            <Card.Header className=" border-bottom-0 justify-content-between">
              <div className="card-title">My Wallet</div>
              <div className="my-auto">
                <Link to="#" className="btn btn-light mt-1 border-0" >
                  <i className="fa fa-plus"></i>
                </Link>
              </div>
            </Card.Header>
            <Card.Body className="p-3">
              <div className="d-flex">
                <img src={ALLImages("svg3")} className="wd-30 ht-30 my-auto" alt="img" />
                <div className="mt-1 ms-3">
                  <h5 className="mb-2 fs-16">Bitcoin Account</h5>
                  <span className="mb-0 fs-18 text-dark fw-normal"> 2.2546854 BTC = $6,334.89 
                  </span>
                </div>
              </div>
              <Row className="mt-3">
                <Col> <Link to="#" className="btn d-grid btn-light btn-square" > Transfer </Link> </Col>
                <Col> <Link to="#" className="btn text-nowrap d-grid btn-white border btn-square" > Network Transfer </Link></Col>
              </Row>
            </Card.Body>
            <Card.Body className=" p-3">
              <div className="d-flex">
                <img
                  src={ALLImages('svg5')}
                  className="wd-30 ht-30 my-auto"
                  alt="img"
                />
                <div className="mt-1 ms-3">
                  <h5 className="mb-2 fs-16">Dash</h5>
                  <span className="mb-0 fs-18 text-dark fw-normal">
                    3.3454545 DASH = $5,232.23
                  </span>
                </div>
              </div>
              <Row className="mt-3">
                <Col>

                  <Link to="#" className="btn d-grid btn-light btn-square" >
                    Transfer
                  </Link>
                </Col>
                <Col>

                  <Link to="#"
                    className="btn text-nowrap d-grid btn-white border btn-square"

                  >
                    Network Transfer
                  </Link>
                </Col>
              </Row>
            </Card.Body>
            <Card.Body className=" p-3">
              <div className="d-flex">
                <img
                  src={ALLImages('svg6')}
                  className="wd-30 ht-30 my-auto"
                  alt="img"
                />
                <div className="mt-1 ms-3">
                  <h5 className="mb-2 fs-16">IOTA</h5>
                  <span className="mb-0 fs-18 text-dark fw-normal">
                    1.3455672 IOTA = $2,434.32
                  </span>
                </div>
              </div>
              <Row className="mt-3">
                <Col>

                  <Link to="#" className="btn d-grid btn-light btn-square" >
                    Transfer
                  </Link>
                </Col>
                <Col>

                  <Link to="#"
                    className="btn text-nowrap d-grid btn-white border btn-square"

                  >
                    Network Transfer
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xxl={8} xl={12} lg={12} md={12}>
          <Card className="custom-card">
            <Card.Body>
              <label className="main-content-label mb-0">
                BTC Wallet Address
              </label>
              <Row className="row mt-3 crypto-wallet">
                <Col md={10}>
                  <p>Wallet Address .</p>
                  <div className="input-group">
                    <input
                    ref={inputRef}
                      type="text"
                      className="form-control input-lg"
                      id="wallet-address"
                      defaultValue="afb0dc8bc84625587b85415c86ef43ed8df"
                    />
                    <div className="input-group-prepend">
                      <button
                        className="btn btn-primary clipboard-icon clipboard-box"
                        data-clipboard-target="#wallet-address"
                        onClick={copyToClipboard}
                      >
                        COPY
                      </button>
                    </div>
                  </div>
                </Col>
                <Col md={2} className="col-md-2">
                  <img
                    src={ALLImages('png22')}
                    alt="qrcode"
                    className="ht-100 float-end mb-2 mt-2"
                  />
                </Col>
              </Row>
            </Card.Body>
            <Row className=" row-sm px-4">
              <Col lg={4} xl={4}>
                <Card className="border custom-card">
                  <Card.Body>
                    <div className="d-flex">
                      <span className="crypto-icon bg-primary-transparent me-3 my-auto">
                        <i className="fe fe-arrow-down-left text-primary"></i>
                      </span>
                      <div>
                        <p className="text-uppercase fs-13 text-muted mb-1">
                          Received
                        </p>
                        <h5>
                          4,342.4545
                          <span className="fs-14 text-muted fw-normal ms-2 d-inline-block">
                            BTC
                          </span>
                        </h5>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4} xl={4}>
                <Card className="card border custom-card">
                  <Card.Body>
                    <div className="d-flex">
                      <span className="crypto-icon bg-primary-transparent me-3 my-auto">
                        <i className="fe fe-arrow-up-right text-primary"></i>
                      </span>
                      <div>
                        <p className="text-uppercase fs-13 text-muted mb-1"> Sent </p>
                        <h5>
                          5,194.246
                          <span className="fs-14 text-muted fw-normal ms-2 d-inline-block"> BTC </span>
                        </h5>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4} xl={4}>
                <Card className=" border custom-card">
                  <Card.Body >
                    <div className="d-flex">
                      <span className="crypto-icon bg-primary-transparent me-3 my-auto">
                        <i className="fas fa-wallet text-primary"></i>
                      </span>
                      <div>
                        <p className="text-uppercase fs-13 text-muted mb-1"> Balance </p>
                        <h5>
                          2.33823
                          <span className="fs-14 text-muted fw-normal ms-2 d-inline-block"> BTC </span>
                        </h5>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card>

          {/* <!-- row --> */}

          <Row className=" row-sm">
            {walletinfo.map((items, index) => (
              <Col xl={6} lg={12} md={12} key={index} data-index={index} >
                <Card className="custom-card wallet">
                  <Card.Body>
                    <label className="main-content-label mb-2"> {items.Wallet} </label>
                    <br />
                    <span className="text-muted">{items.Walletaddress}</span>
                    <div className="d-flex mt-4">
                      <img src={items.Currencies} className="wd-40 ht-40 me-3 my-auto" alt="cureency" />
                      <div>
                        <span className="text-uppercase tx-14 mt-4 text-muted"> {items.ETHINFO} </span>
                        <div className="d-flex my-auto">
                          <h4 className="mt-1 mb-0">
                            {items.VAlueofETH}</h4>
                          <span className="mt-auto mx-2"> {items.Ethshortcut} </span>
                        </div>
                      </div>
                      <img src={items.EthQRcode} className="wd-50 ht-50  my-auto ms-auto float-end" alt="rth" />
                    </div>
                    <div className="input-group my-4">
                      <span className="input-group-addon-left bg-light">
                        <i className={`cf cf-${items.bitcoin}`}></i>
                      </span>
                      <input type="text" className="form-control input-lg" defaultValue={items.dValue} id="ethereum-wallet"  />
                      <span className="input-group-addon-right bg-light clipboard-icon" data-clipboard-target="#ethereum-wallet">
                        <OverlayTrigger overlay={<Tooltip>Copy clipboard</Tooltip>}><i className="fe fe-copy"></i></OverlayTrigger>
                      </span>
                    </div>
                    <Row>
                      <Col md={6}>
                        <p className="text-uppercase fs-13 text-muted mb-1"> {items.EthoReceived} </p>
                        <div className="d-flex my-auto flex-wrap">
                          <span className="crypto-icon bg-primary-transparent me-3">
                            <i className={`fe fe-arrow-down-${items.Ethohigh} text-primary`} ></i>
                          </span>
                          <h5 className="my-auto">{items.EthoReceivedmoney}</h5>
                          <span className="my-auto ms-2">
                            {items.EthCurrencies}
                          </span>
                        </div>
                      </Col>
                      <Col md={6} className=" mt-3 mt-md-0">
                        <p className="text-uppercase fs-13 text-muted mb-1"> {items.EthoSent} </p>
                        <div className="d-flex my-auto flex-wrap">
                          <span className="crypto-icon bg-primary-transparent me-3">
                            <i className="fe fe-arrow-up-right text-primary"></i>
                          </span>
                          <h5 className="my-auto">{items.EthoSentmoney}</h5>
                          <span className="my-auto ms-2"> {items.EthCurrencies} </span>
                        </div>
                      </Col>
                    </Row>
                    <Row className=" mt-4">
                      <div className="col-6 d-grid">
                        <button className="btn btn-block btn-primary"> {items.EthoDeposit} </button>
                      </div>
                      <div className="col-6 d-grid">
                        <button className="btn btn-block btn-outline-primary"> {items.EthoWithdraw} </button>
                      </div>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Fragment>
  );
}

export default Wallet;
