import { Fragment } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import Slider from 'rc-slider';
import RangeSlider from "react-range-slider-input";
import { LabeledTwoThumbs, MinMaxSlider, ProgrameticSlider, StepSlider, UpdatingMarks } from './Sliderfunctionality';
import Pageheader from '../../../../layouts/Pageheader';

const RangeSliders = ({ local_varaiable }) => {
  return (
    <Fragment>
      <Pageheader mainheading='Range Slider' parentfolder='Form Elements' activepage='Range Slider' />


      <Row className='row-sm'>
        <h6 className="mb-3">Basic - Slider:</h6>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'> Default Range </div>
            </Card.Header>
            <Card.Body>
              <input type="range" className="form-range" id="customRange1" />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'> Disabled Range </div>
            </Card.Header>
            <Card.Body>
              <input type="range" className="form-range" id="disabledRange" disabled />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">

        <h6 className="mb-3">Mui - Slider:</h6>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'> Range With Min and Max Values </div>
            </Card.Header>
            <Card.Body>
              <MinMaxSlider />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'> Range With Steps </div>
            </Card.Header>
            <Card.Body>
              <StepSlider />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h6 className="mb-3">rc - Slider:</h6>
      <Row className="row-sm">
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> Default-Styling </div>
            </Card.Header>
            <Card.Body>
              <Slider min={0} max={20} defaultValue={3} />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> Basic Rangeslider With Reverse value </div>
            </Card.Header>
            <Card.Body>
              <Slider min={0} max={20} reverse defaultValue={3} />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> Multiple Rangesliders with fixed value </div>
            </Card.Header>
            <Card.Body>
              <Slider min={20} defaultValue={20} marks={{ 20: 20, 40: 40, 100: 100 }} step={null} />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card ProgrameticSliderchange">
            <Card.Header>
              <div className='card-title'> Programmatic change </div>
            </Card.Header>
            <Card.Body>
              <ProgrameticSlider />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'>Basic Slider</div>
            </Card.Header>
            <Card.Body>
              <RangeSlider />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'>Fit Handles</div>
            </Card.Header>
            <Card.Body>
              <RangeSlider />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'>Rounded Styling</div>
            </Card.Header>
            <Card.Body>
              <RangeSlider id="range-slider-yellow" />
            </Card.Body>
          </Card>
        </Col>

        {/* <Row> */}
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'>Square Styling</div>
            </Card.Header>
            <Card.Body>
              <RangeSlider id="range-slider-ab" className="margin-lg" step={"any"} rangeSlideDisabled={true} />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'>Labeled with Two thumbs</div>
            </Card.Header>
            <Card.Body>
              <LabeledTwoThumbs rtl={local_varaiable.dir == 'rtl'} />
            </Card.Body>
          </Card>
        </Col>
        {/* </Row> */}
      </Row>

      <Row className="row-sm">
   
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'>Dynamic Range Slider</div>
            </Card.Header>
            <Card.Body>
              <UpdatingMarks rtl={local_varaiable.dir == 'rtl'} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Fragment>
  )
}

const mapStateToProps = (state) => ({
  local_varaiable: state
})
export default connect(mapStateToProps, {})(RangeSliders);
