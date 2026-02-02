import { Fragment } from "react";
import { Card, Col, Row, Table } from "react-bootstrap";
import { BtcMarket, EthMarket, ItcMarket, XrpMarket } from "../../common/Chartdata";
import { CryptMarketingValues } from "../../common/Comondata";
import Pageheader from "../../layouts/Pageheader";


const MarketCap = () => {
  return (
    <Fragment>
      <Pageheader mainheading='Crypto-Market' parentfolder='Crypto-Currencies' activepage='Crypto-Market' />
      <Row className="row-sm">
        <Col lg={6} xl={6} xxl={3} md={6} >
          <Card className="custom-card">
            <Card.Body className="pb-3">
              <h5 className="fs-14">BTC / USD</h5>
              <div className="d-flex">
                <div className="volume">
                  <h4 className="mb-2">34.4324 <span className="text-muted fs-12">$29.42</span></h4>
                  <div className="d-flex text-muted fs-13">
                    <span className="text-danger me-2 fw-semibold">-0.22%</span>
                    Volume - 76,434 USDT
                  </div>
                </div>
                <div className="d-flex ms-auto float-end">
                  <BtcMarket/>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} xl={6} xxl={3} md={6}>
          <Card className="custom-card">
            <Card.Body className="pb-3">
              <h5 className="fs-14">ETH / USD</h5>
              <div className="d-flex">
                <div className="volume">
                  <h4 className="mb-2">29.4124 <span className="text-muted fs-12">$23.15</span></h4>
                  <div className="d-flex text-muted fs-13">
                    <span className="text-success me-2 fw-semibold">+0.23%
                    </span>
                    Volume - 23,346 USDT
                  </div>
                </div>
                <div className="d-flex ms-auto float-end">
                  <EthMarket/>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} xl={6} xxl={3} md={6}>
          <Card className="custom-card">
            <Card.Body className="pb-3">
              <h5 className="fs-14">XRP / USD</h5>
              <div className="d-flex">
                <div className="volume">
                  <h4 className="mb-2">34.5674 <span className="text-muted fs-12">$45.24</span></h4>
                  <div className="d-flex text-muted fs-13">
                    <span className="text-danger me-2 fw-semibold">-0.42%</span>
                    Volume - 56,456 USDT
                  </div>
                </div>
                <div className="d-flex ms-auto float-end">
                  <XrpMarket/>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} xl={6} xxl={3} md={6}>
          <Card className="custom-card">
            <Card.Body className="pb-3">
              <h5 className="fs-14">LTC / USD</h5>
              <div className="d-flex">
                <div className="volume">
                  <h4 className="mb-2">45.4542 <span className="text-muted fs-12">$63.34</span></h4>
                  <div className="d-flex text-muted fs-13">
                    <span className="text-success me-2 fw-semibold">-0.12%</span>
                    Volume - 34,462 USDT
                  </div>
                </div>
                <div className="d-flex ms-auto float-end">
                  <ItcMarket/>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xl={12} lg={12} md={12}>
          <Card className="custom-card">
            <Card.Header className=" border-bottom-0"><label className="main-content-label my-auto">Crypt Marketing Values</label></Card.Header>
            <Card.Body>

              <Table hover responsive className="table text-nowrap border">
                <thead className="table border-bottom">
                  <tr>
                    <th className="bg-transparent">No</th>
                    <th className="bg-transparent">Name</th>
                    <th className="bg-transparent">Last Price</th>
                    <th className="bg-transparent">Market Cap</th>
                    <th className="bg-transparent">Change(24h)</th>
                    <th className="bg-transparent"></th>
                  </tr>
                </thead>
                <tbody>
                  {CryptMarketingValues.map((items, index) => (
                    <tr key={index} data-index={index}>
                      <td>{items.ID}</td>
                      <td><img src={items.IMAGES} className="wd-30 ht-30 me-3" alt="img" />{items.Name} <b>{items.crypt}</b></td>
                      <td>{items.MarkerCap}</td>
                      <td>{items.lastprice}</td>
                      <td><span className={`text-${items.Change}`}>+3.49%</span></td>
                      <td><b className="btn btn-outline-primary btn-sm">{items.platform}</b></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default MarketCap;
