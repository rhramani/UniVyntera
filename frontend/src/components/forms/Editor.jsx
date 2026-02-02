import { Fragment, useState } from 'react'
import SunEditor from 'suneditor-react';
import { Card, Col, Row } from 'react-bootstrap';
import Pageheader from '../../layouts/Pageheader';

const Editor = () => {

  return (
    <Fragment>
      <Pageheader mainheading='Sun Editor' parentfolder='Form Editor' activepage='Sun Editor' />

      {/* <!-- Start:: row-1 --> */}
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> Sun Editor </div>
            </Card.Header>
            <div className="card-body">
            <SunEditor />
            </div>
          </Card>
        </Col>
      </Row>
      {/* <!-- End:: row-1 --> */}

    </Fragment>
  )
}

export default Editor;
