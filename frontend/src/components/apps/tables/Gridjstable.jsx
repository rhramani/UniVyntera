import React, { Fragment } from 'react';
import { Grid } from "gridjs-react";
import Pageheader from '../../../layouts/Pageheader';
import { Card, Col, Row } from 'react-bootstrap';
import { Data, FixedHeaderData } from '../../../common/Comondata';
export function Gridjstable() {
  return (
    <Fragment>
      <Pageheader mainheading='Grid Js' parentfolder='Tables' activepage='Grid Js' />
      <Row>
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">
                Basic Table
              </div>
            </Card.Header>
            <Card.Body>
              <Grid data={Data} columns={['Date', 'Name', 'EMail', 'Id', 'Price', 'Quantity', 'Total']} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">
                Table With Pagination
              </div>
            </Card.Header>
            <Card.Body>
              <Grid data={Data} columns={['Date', 'Name', 'EMail', 'Id', 'Price', 'Quantity', 'Total']} pagination={{ limit: 5 }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">
                Table With Search
              </div>
            </Card.Header>
            <Card.Body>
              <Grid data={Data} search={true} columns={['Date', 'Name', 'EMail', 'Id', 'Price', 'Quantity', 'Total']} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">
                Table Sorting
              </div>
            </Card.Header>
            <Card.Body>
              <Grid data={Data} sort={true} search={false} columns={['Date', 'Name', 'EMail', 'Id', 'Price', 'Quantity', 'Total']} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xl={12}>
          <Card className="custom-card fixed-header-gridjs">
            <Card.Header>
              <div className="card-title">
                Fixed Header
              </div>
            </Card.Header>
            <Card.Body>
              <Grid data={FixedHeaderData} sort={false} search={false} fixedHeader={true} height='350px' columns={['Date', 'Name', 'EMail', 'Id', 'Price', 'Quantity', 'Total']} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}
