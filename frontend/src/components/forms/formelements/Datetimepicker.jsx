import { Fragment, useState } from 'react'
import { Card, Col, Form, InputGroup, Row } from 'react-bootstrap'
import DatePicker, { registerLocale } from 'react-datepicker';
import Calendar from 'react-calendar';
import { enGB } from 'date-fns/locale';
import Pageheader from '../../../layouts/Pageheader';





registerLocale('en-GB', enGB);


const DateTimePicker = () => {
  const [startDate1, setStartDate1] = useState(new Date());
  const [startDate2, setStartDate2] = useState(new Date());
  const [startDate3, setStartDate3] = useState(new Date());
  const [startDate4, setStartDate4] = useState(new Date());
  const [startDate5, setStartDate5] = useState(new Date());
  const [startDate6, setStartDate6] = useState(new Date());
  const [startDate7, setStartDate7] = useState(new Date());
  const [startDate8, setStartDate8] = useState(new Date());

  //range data picker

  const [dateRange, setDateRange] = useState([null, null]);
  const [startsDate, endDate] = dateRange;


  //React Calender 

  const [value, setValue] = useState(new Date());
  const [show, setShow] = useState(false);

  const handleDateChange = (selectedDate) => {
    if (selectedDate !== null) {
      setValue(selectedDate);
      setShow(false);
    }
  };

  return (
    <Fragment>
      <Pageheader mainheading='Date & Time Pickers' parentfolder='Form Elements' activepage='Date & Time Pickers' />

      {/* <!-- Start:: row-1 --> */}
      <Row className="row-sm">
        <Col xxl={3}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> Basic Date picker </div>
            </Card.Header>
            <Card.Body>
              <div className='form-group'>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon1" className='text-muted'><i className="ri-calendar-line"></i></InputGroup.Text>
                  <div className="form-control">
                    <DatePicker className='border-0' selected={startDate1} onChange={(date) => setStartDate1(date)} />
                  </div>
                </InputGroup>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xxl={3}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> Date picker With Time </div>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon1" className='text-muted'><i className="ri-calendar-line"></i></InputGroup.Text>
                  <div className="form-control">
                    <DatePicker className='border-0' selected={startDate2} onChange={(date) => setStartDate2(date)} timeInputLabel="Time:" dateFormat="MM/dd/yyyy h:mm aa" showTimeInput />
                  </div>
                </InputGroup>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
        <Col xxl={3}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> Human Friendly dates </div>
            </Card.Header>
            <Card.Body className="human-freindly-dates">
              <Form.Group>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon1" className='text-muted'><i className="ri-calendar-line"></i></InputGroup.Text>
                  <div className="form-control"  id="date-time">
                    <DatePicker className="border-0" selected={startDate3} onChange={(date) => setStartDate3(date)} locale="en-GB" showTimeSelect timeFormat="p" timeIntervals={15} dateFormat="Pp" />
                  </div>
                </InputGroup>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
        <Col xxl={3}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> Date range picker </div>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon1" className='text-muted'><i className="ri-calendar-line"></i></InputGroup.Text>
                  <div className="form-control">
                    <DatePicker className="border-0" placeholderText="Choose Date" selectsRange={true} startDate={startsDate} endDate={endDate} onChange={(update) => { setDateRange(update) }} isClearable={true} />
                  </div>
                </InputGroup>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <!-- End:: row-1 --> */}

      {/* <!-- Start:: row-2 --> */}
      <Row className="row-sm">
        <Col xxl={3}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> Inline Time Picker </div>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon1" className='text-muted'><i className="ri-calendar-line"></i></InputGroup.Text>
                  <div className="form-control">
                    <DatePicker className="border-0" selected={startDate4} onChange={(date) => setStartDate4(date)} showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time" dateFormat="h:mm aa" />
                  </div>
                </InputGroup>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        <Col xxl={3}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> Multiple Month Picker </div>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon1" className='text-muted'><i className="ri-calendar-line"></i></InputGroup.Text>
                  <div className="form-control" id="multi-datepicker">
                    <DatePicker className="border-0" selected={startDate5} onChange={(date) => setStartDate5(date)} monthsShown={2} />
                  </div>
                </InputGroup>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
        <Col xxl={3}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> Basic Time Picker </div>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon1" className='text-muted'><i className="ri-calendar-line"></i></InputGroup.Text>
                  <div className="form-control">
                    <DatePicker className="border-0" selected={startDate6} onChange={(date) => setStartDate6(date)} showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time" dateFormat="h:mm aa" />
                  </div>
                </InputGroup>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <!-- End:: row-2 --> */}

      {/* <!-- Start:: row-3 --> */}
      <Row className="row-sm">
        <Col xl={6}>
          <Row>
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header>
                  <div className='card-title'>  Month with Year Picker </div>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-0">
                    <InputGroup className="mb-3 flex-nowrap">
                      <InputGroup.Text id="basic-addon1" className='text-muted'><i className="ri-calendar-line"></i></InputGroup.Text>
                      <div className="form-control">
                        <DatePicker className="border-0" selected={startDate7} onChange={(date) => setStartDate7(date)} dateFormat="MM/yyyy" showMonthYearPicker showFullMonthYearPicker />
                      </div>
                    </InputGroup>
                    <div className="form-control">
                      <DatePicker className="border-0" selected={startDate8} onChange={(date) => setStartDate8(date)} showYearPicker dateFormat="yyyy" /></div>
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xl={6}>
       
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'>Inline Calendar</div>
            </Card.Header>
            <Card.Body>
              <Form.Group className="overflow-auto">
                <Form.Control type="text" onClick={() => setShow(show => !show)} defaultValue={value.toDateString()} placeholder='Inline Calender' />
                {show && (<Calendar className="form-control" onChange={(selectedDate, _event) => handleDateChange(selectedDate)} value={value} locale="en-GB" />)}
              </Form.Group>
            </Card.Body>
          </Card> 
        </Col>
      </Row>
      {/* <!-- End:: row-3 --> */}
    </Fragment>
  )
}

export default DateTimePicker;
