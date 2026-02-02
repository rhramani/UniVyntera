import { Fragment } from 'react'
import { NumericFormat, PatternFormat } from 'react-number-format';
import { Card, Col, Row } from 'react-bootstrap';
import Pageheader from '../../../layouts/Pageheader';

const InputMasks = () => {

  return (
    <Fragment>
      <Pageheader mainheading='Input Masks' parentfolder='Form Elements' activepage='Input Masks' />


      <Row className="row-sm">
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> Format-1 </div>
            </Card.Header>
            <div className="card-body mask">
            <NumericFormat className='form-control' value="20020220" allowLeadingZeros thousandSeparator="," />
            </div>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> Format-2 </div>
            </Card.Header>
            <div className="card-body">
            <PatternFormat className='form-control' value={123123} format="### ###" />
            </div>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> Format-3 </div>
            </Card.Header>
            <div className="card-body">
            <PatternFormat className='form-control' value="411111" valueIsNumericString format="#### #### #### ####" mask="_" />
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> Number Formatting </div>
            </Card.Header>
            <div className="card-body">
            <NumericFormat className='form-control' type="text" value={1231231} thousandsGroupStyle="lakh" thousandSeparator="," />
            </div>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'>Time Format</div>
            </Card.Header>
            <div className="card-body">
              <PatternFormat className='form-control' format="##:##:##" value="" placeholder='hh:mm:ss' valueIsNumericString={true} />
            </div>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> Phone Number </div>
            </Card.Header>
            <div className="card-body">
            <PatternFormat className='form-control' format="+91- India (###) ###-####" value="" valueIsNumericString={true} placeholder='+91-India' />
            </div>
          </Card>
        </Col>
      </Row>
      {/* <!-- End:: row-2 --> */}

      {/* <!-- Start:: row-3 --> */}
      <Row className="row-sm">
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> With Prefix </div>
            </Card.Header>
            <div className="card-body">
            <PatternFormat className='form-control' value='' prefix="Spruko" format="SPT - ###-##"  placeholder='SPT - Card no.'/>
            </div>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> Delimiter </div>
            </Card.Header>
            <div className="card-body">
            <PatternFormat className='form-control' value='' prefix="Spruko" format="### ### ### ####"  placeholder='1234 567 890 1234'/>
            </div>
          </Card>
        </Col>
      </Row>
      {/* <!-- End:: row-3 --> */}

    </Fragment>
  )
}

export default InputMasks
