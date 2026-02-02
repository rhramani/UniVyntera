import { Fragment, useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import Select from 'react-select'
import { BasicSelect, MaxData, MultipleSelect, TemptingData } from '../../common/Select2data';
import Pageheader from '../../layouts/Pageheader'

const Select2 = () => {

  const [isEnabled, setIsEnabled] = useState(true);

  const handleEnableClick = () => {
    setIsEnabled(true);
  };

  const handleDisableClick = () => {
    setIsEnabled(false);
  };

  return (
    <Fragment>
      <Pageheader mainheading='Select2' parentfolder='Forms' activepage='Select2' />

      {/* <!-- Start::row-1 --> */}
      <Row className="row-sm">
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> Basic Select2 </div>
            </Card.Header>
            <Card.Body>
              <Select options={BasicSelect} classNamePrefix="Select2" placeholder='Selection 1' />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> Multiple Select </div>
            </Card.Header>
            <Card.Body>
              <Select options={MultipleSelect} classNamePrefix="Select2" placeholder='Multiple 1' isMulti />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> Single Select With Placeholder </div>
            </Card.Header>
            <Card.Body>
              <Select options={BasicSelect} classNamePrefix="Select2" placeholder='Selection 1 is placeholder' />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> Multiple Select With Placeholder </div>
            </Card.Header>
            <Card.Body>
              <Select options={MultipleSelect} classNamePrefix="Select2" placeholder='Multiple 1 is placeholder' isMulti />
            </Card.Body>
          </Card>
        </Col><Col xl={4}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> Templating </div>
            </Card.Header>
            <Card.Body>
              <Select options={TemptingData} classNamePrefix="Select2" placeholder='Andrew' />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> Templating Selection </div>
            </Card.Header>
            <Card.Body>
              <Select options={TemptingData} classNamePrefix="Select2" placeholder='Andrew' />

            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="row-sm">
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> Max Selections Limiting </div>
            </Card.Header>
            <Card.Body>
              <Select defaultValue={[MaxData[2], MaxData[3]]} isMulti options={MaxData} classNamePrefix="Select2" />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> Disabling a Select2 control </div>
            </Card.Header>
            <Card.Body className="vstack gap-3">
              {isEnabled ? (
                <>
                  <Select isMulti options={BasicSelect} classNamePrefix="Select2" placeholder="Selection 1" />
                  <Select isMulti options={BasicSelect} classNamePrefix="Select2" placeholder="Selection 1" />
                </>
              ) : (
                <>
                  <Select isMulti options={BasicSelect} classNamePrefix="Select2" placeholder="Selection 1" isDisabled />
                  <Select isMulti options={BasicSelect} classNamePrefix="Select2" placeholder="Selection 1" isDisabled />
                </>
              )}
              <div className="btn-list">
                <Button variant='primary-light' onClick={handleEnableClick}>Enable</Button>
                <Button onClick={handleDisableClick}>Disable</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <!-- End:: row-2 --> */}
    </Fragment>
  )
}

export default Select2
