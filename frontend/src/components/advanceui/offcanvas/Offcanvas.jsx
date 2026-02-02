import { Fragment, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { BackDrop, BodyScroll, BodyScrollandBackDrop, LiveDemo, Placement } from './Offcanvasfunctionality'
import Pageheader from '../../../layouts/Pageheader'

const OffcanvasComponent = () => {

  //showcode

  const [isHidden, setIsHidden] = useState([false]);
  const toggleHidden = (index) => {
    const updatedHidden = [...isHidden];
    updatedHidden[index] = !updatedHidden[index];
    setIsHidden(updatedHidden);
  };

  return (
    <Fragment>
      <Pageheader mainheading='Offcanvas' parentfolder='Advanced Ui' activepage='Offcanvas' />

      <Row className="row-sm">
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Live demo
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(0)}>Show Code<i className={`${isHidden[0] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>
              <LiveDemo />
            </Card.Body>
            <div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        function LiveDemo() {
          const [show, setShow] = useState(false);
      
          const handleClose = () => setShow(false);
          const handleShow = () => setShow(true);
          return (
              <Fragment>
                  <Button variant="primary" className="me-2 mb-1" onClick={handleShow}>
                      Link with href
                  </Button>
                  <Button variant="primary" className="me-2 mb-1" onClick={handleShow}>
                      Button with data-bs-target
                  </Button>
      
                  <Offcanvas show={show} onHide={handleClose}>
                      <Offcanvas.Header closeButton className="border-bottom">
                          <Offcanvas.Title>Notifications</Offcanvas.Title>
                      </Offcanvas.Header>
                      <Offcanvas.Body className="p-0">
                          <div>
                              <ListGroup variant="flush" className="mb-0">
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-primary avatar-rounded">
                                                  NW
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">New Website Created<span className="badge bg-light text-muted float-end">20 Nov 2022</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>30 mins ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-danger avatar-rounded">
                                                  CH
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Prepare for the new project<span className="badge bg-light text-muted float-end">3 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>2 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-info avatar-rounded">
                                                  S
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Decide the live discussion<span className="badge bg-light text-muted float-end">17 Feb 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>3 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md avatar-rounded">
                                                  <img src={ALLImages('face12')} alt="" />
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Meeting at 3:00 pm<span className="badge bg-light text-muted float-end">29 Dec 2022</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>4 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-success avatar-rounded">
                                                  RC
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Prepare for presentation<span className="badge bg-light text-muted float-end">31 Dec 2022</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>4 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md avatar-rounded">
                                                  <img src={ALLImages('face1')} alt="" />
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Brenda New product launching<span className="badge bg-light text-muted float-end">1 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>7 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-secondary avatar-rounded">
                                                  M
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Medeleine Hey! there i'm available<span className="badge bg-light text-muted float-end">5 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>3 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-info avatar-rounded">
                                                  OL
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Olivia New schedule release<span className="badge bg-light text-muted float-end">6 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>45 mins ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-warning avatar-rounded">
                                                  A
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Kamala Preparing for new admin launch<span className="badge bg-light text-muted float-end">7 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>28 mins ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md avatar-rounded">
                                                  <img src={ALLImages('face6')} alt="" />
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Oisha Meeting with clinet for dinner<span className="badge bg-light text-muted float-end">10 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>14 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-danger avatar-rounded">
                                                  CH
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Prepare for the new project<span className="badge bg-light text-muted float-end">3 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>2 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-info avatar-rounded">
                                                  S
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Decide the live discussion<span className="badge bg-light text-muted float-end">17 Feb 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>3 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md avatar-rounded">
                                                  <img src={ALLImages('face14')} alt="" />
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Meeting at 3:00 pm<span className="badge bg-light text-muted float-end">29 Dec 2022</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>4 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-success avatar-rounded">
                                                  RC
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Prepare for presentation<span className="badge bg-light text-muted float-end">31 Dec 2022</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>4 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                              </ListGroup>
                          </div>
                      </Offcanvas.Body>
                  </Offcanvas>
              </Fragment>
          )
      }
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Body scrolling
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(1)}>Show Code<i className={`${isHidden[1] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[1] ? 'd-none' : ''}`}>
              <BodyScroll />
            </Card.Body>
            <div className={`${isHidden[1] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        function BodyScroll() {
          const [show, setShow] = useState(false);
      
          const handleClose = () => setShow(false);
          const handleShow = () => setShow(true);
          return (
              <Fragment>
                  <Button variant="primary" className="me-2" onClick={handleShow}>
                      Enabled Body Scrolling
                  </Button>
      
                  <Offcanvas show={show} onHide={handleClose} scroll={true}>
                      <Offcanvas.Header closeButton className="border-bottom">
                          <Offcanvas.Title>Notifications</Offcanvas.Title>
                      </Offcanvas.Header>
                      <Offcanvas.Body className="p-0">
                          <div>
                              <ListGroup variant="flush" className="mb-0">
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-primary avatar-rounded">
                                                  NW
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">New Website Created<span className="badge bg-light text-muted float-end">20 Nov 2022</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>30 mins ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-danger avatar-rounded">
                                                  CH
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Prepare for the new project<span className="badge bg-light text-muted float-end">3 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>2 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-info avatar-rounded">
                                                  S
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Decide the live discussion<span className="badge bg-light text-muted float-end">17 Feb 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>3 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md avatar-rounded">
                                                  <img src={ALLImages('face12')} alt="" />
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Meeting at 3:00 pm<span className="badge bg-light text-muted float-end">29 Dec 2022</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>4 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-success avatar-rounded">
                                                  RC
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Prepare for presentation<span className="badge bg-light text-muted float-end">31 Dec 2022</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>4 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md avatar-rounded">
                                                  <img src={ALLImages('face1')} alt="" />
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Brenda New product launching<span className="badge bg-light text-muted float-end">1 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>7 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-secondary avatar-rounded">
                                                  M
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Medeleine Hey! there i'm available<span className="badge bg-light text-muted float-end">5 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>3 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-info avatar-rounded">
                                                  OL
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Olivia New schedule release<span className="badge bg-light text-muted float-end">6 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>45 mins ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-warning avatar-rounded">
                                                  A
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Kamala Preparing for new admin launch<span className="badge bg-light text-muted float-end">7 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>28 mins ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md avatar-rounded">
                                                  <img src={ALLImages('face6')} alt="" />
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Oisha Meeting with clinet for dinner<span className="badge bg-light text-muted float-end">10 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>14 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-danger avatar-rounded">
                                                  CH
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Prepare for the new project<span className="badge bg-light text-muted float-end">3 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>2 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-info avatar-rounded">
                                                  S
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Decide the live discussion<span className="badge bg-light text-muted float-end">17 Feb 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>3 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md avatar-rounded">
                                                  <img src={ALLImages('face14')} alt="" />
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Meeting at 3:00 pm<span className="badge bg-light text-muted float-end">29 Dec 2022</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>4 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-success avatar-rounded">
                                                  RC
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Prepare for presentation<span className="badge bg-light text-muted float-end">31 Dec 2022</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>4 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                              </ListGroup>
                          </div>
                      </Offcanvas.Body>
                  </Offcanvas>
              </Fragment>
          )
      }
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Static backdrop
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(2)}>Show Code<i className={`${isHidden[2] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[2] ? 'd-none' : ''}`}>
              <BackDrop />
            </Card.Body>
            <div className={`${isHidden[2] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        function BackDrop() {
          const [show, setShow] = useState(false);
      
          const handleClose = () => setShow(false);
          const handleShow = () => setShow(true);
          return (
              <Fragment>
                  <Button variant="primary" className="me-2" onClick={handleShow}>
                      Toggle Static Offcanvas
                  </Button>
      
                  <Offcanvas show={show} onHide={handleClose} backdrop='true'>
                      <Offcanvas.Header closeButton className="border-bottom">
                          <Offcanvas.Title>Notifications</Offcanvas.Title>
                      </Offcanvas.Header>
                      <Offcanvas.Body className="p-0">
                          <div>
                              <ListGroup variant="flush" className="mb-0">
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-primary avatar-rounded">
                                                  NW
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">New Website Created<span className="badge bg-light text-muted float-end">20 Nov 2022</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>30 mins ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-danger avatar-rounded">
                                                  CH
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Prepare for the new project<span className="badge bg-light text-muted float-end">3 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>2 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-info avatar-rounded">
                                                  S
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Decide the live discussion<span className="badge bg-light text-muted float-end">17 Feb 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>3 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md avatar-rounded">
                                                  <img src={ALLImages('face12')} alt="" />
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Meeting at 3:00 pm<span className="badge bg-light text-muted float-end">29 Dec 2022</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>4 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-success avatar-rounded">
                                                  RC
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Prepare for presentation<span className="badge bg-light text-muted float-end">31 Dec 2022</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>4 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md avatar-rounded">
                                                  <img src={ALLImages('face1')} alt="" />
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Brenda New product launching<span className="badge bg-light text-muted float-end">1 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>7 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-secondary avatar-rounded">
                                                  M
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Medeleine Hey! there i'm available<span className="badge bg-light text-muted float-end">5 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>3 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-info avatar-rounded">
                                                  OL
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Olivia New schedule release<span className="badge bg-light text-muted float-end">6 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>45 mins ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-warning avatar-rounded">
                                                  A
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Kamala Preparing for new admin launch<span className="badge bg-light text-muted float-end">7 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>28 mins ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md avatar-rounded">
                                                  <img src={ALLImages('face6')} alt="" />
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Oisha Meeting with clinet for dinner<span className="badge bg-light text-muted float-end">10 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>14 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-danger avatar-rounded">
                                                  CH
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Prepare for the new project<span className="badge bg-light text-muted float-end">3 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>2 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-info avatar-rounded">
                                                  S
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Decide the live discussion<span className="badge bg-light text-muted float-end">17 Feb 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>3 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md avatar-rounded">
                                                  <img src={ALLImages('face14')} alt="" />
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Meeting at 3:00 pm<span className="badge bg-light text-muted float-end">29 Dec 2022</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>4 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-success avatar-rounded">
                                                  RC
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Prepare for presentation<span className="badge bg-light text-muted float-end">31 Dec 2022</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>4 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                              </ListGroup>
                          </div>
                      </Offcanvas.Body>
                  </Offcanvas>
              </Fragment>
          )
      }
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <div className="col-xl-3">
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Body scrolling and backdrop
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(3)}>Show Code<i className={`${isHidden[3] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[3] ? 'd-none' : ''}`}>
              <BodyScrollandBackDrop />
            </Card.Body>
            <div className={`${isHidden[3] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        function BodyScrollandBackDrop() {
          const [show, setShow] = useState(false);
      
          const handleClose = () => setShow(false);
          const handleShow = () => setShow(true);
          return (
              <Fragment>
                  <Button variant="primary" className="me-2" onClick={handleShow}>
                      Enable both Scrolling and backdrop
                  </Button>
      
                  <Offcanvas show={show} onHide={handleClose} backdrop='true' scroll={true}>
                      <Offcanvas.Header closeButton className="border-bottom">
                          <Offcanvas.Title>Notifications</Offcanvas.Title>
                      </Offcanvas.Header>
                      <Offcanvas.Body className="p-0">
                          <div>
                              <ListGroup variant="flush" className="mb-0">
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-primary avatar-rounded">
                                                  NW
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">New Website Created<span className="badge bg-light text-muted float-end">20 Nov 2022</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>30 mins ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-danger avatar-rounded">
                                                  CH
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Prepare for the new project<span className="badge bg-light text-muted float-end">3 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>2 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-info avatar-rounded">
                                                  S
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Decide the live discussion<span className="badge bg-light text-muted float-end">17 Feb 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>3 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md avatar-rounded">
                                                  <img src={ALLImages('face12')} alt="" />
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Meeting at 3:00 pm<span className="badge bg-light text-muted float-end">29 Dec 2022</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>4 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-success avatar-rounded">
                                                  RC
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Prepare for presentation<span className="badge bg-light text-muted float-end">31 Dec 2022</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>4 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md avatar-rounded">
                                                  <img src={ALLImages('face1')} alt="" />
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Brenda New product launching<span className="badge bg-light text-muted float-end">1 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>7 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-secondary avatar-rounded">
                                                  M
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Medeleine Hey! there i'm available<span className="badge bg-light text-muted float-end">5 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>3 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-info avatar-rounded">
                                                  OL
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Olivia New schedule release<span className="badge bg-light text-muted float-end">6 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>45 mins ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-warning avatar-rounded">
                                                  A
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Kamala Preparing for new admin launch<span className="badge bg-light text-muted float-end">7 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>28 mins ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md avatar-rounded">
                                                  <img src={ALLImages('face6')} alt="" />
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Oisha Meeting with clinet for dinner<span className="badge bg-light text-muted float-end">10 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>14 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-danger avatar-rounded">
                                                  CH
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Prepare for the new project<span className="badge bg-light text-muted float-end">3 Jan 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>2 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-info avatar-rounded">
                                                  S
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Decide the live discussion<span className="badge bg-light text-muted float-end">17 Feb 2023</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>3 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md avatar-rounded">
                                                  <img src={ALLImages('face14')} alt="" />
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Meeting at 3:00 pm<span className="badge bg-light text-muted float-end">29 Dec 2022</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>4 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                      <div className="d-flex align-items-center">
                                          <div className="me-2">
                                              <span className="avatar avatar-md bg-success avatar-rounded">
                                                  RC
                                              </span>
                                          </div>
                                          <div className="flex-fill">
                                              <p className="fw-semibold mb-0">Prepare for presentation<span className="badge bg-light text-muted float-end">31 Dec 2022</span></p>
                                              <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>4 hrs ago</span>
                                          </div>
                                      </div>
                                  </ListGroup.Item>
                              </ListGroup>
                          </div>
                      </Offcanvas.Body>
                  </Offcanvas>
              </Fragment>
          )
      }
                `}
              </code></pre>
            </div>
          </Card>
        </div>
        <div className="col-xl-5">
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Placement
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(4)}>Show Code<i className={`${isHidden[4] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[4] ? 'd-none' : ''}`}>
              <Placement />
            </Card.Body>
            <div className={`${isHidden[4] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
       const Placement = () => {
        const placements = ['top', 'end', 'bottom'];
        const [show, setShow] = useState(false);
        const [selectedPlacement, setSelectedPlacement] = useState('');
    
    
    
        const handleShow = (placement) => {
            setShow(true);
            setSelectedPlacement(placement);
        };
    
        const handleClose = () => setShow(false);
    
        return (
            <>
                {placements.map((placement, idx) => (
                    <Button key={idx} variant="primary" onClick={() => handleShow(placement)} className="me-2 mb-1" >
                        Toggle {placement === 'end' ? 'right' : placement} Offcanvas
                    </Button>
                ))}
    
                <Offcanvas show={show} onHide={handleClose} placement={selectedPlacement}>
                    <Offcanvas.Header closeButton className="border-bottom">
                        <Offcanvas.Title>Offcanvas</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body className={selectedPlacement === 'end' ? 'p-0' : ''}>
                        {selectedPlacement === 'end' ? (
                            <div>
                                <ListGroup variant="flush" className="mb-0">
                                    <ListGroup.Item>
                                        <div className="d-flex align-items-center">
                                            <div className="me-2">
                                                <span className="avatar avatar-md bg-primary avatar-rounded">
                                                    NW
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <p className="fw-semibold mb-0">New Website Created<span className="badge bg-light text-muted float-end">20 Nov 2022</span></p>
                                                <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>30 mins ago</span>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <div className="d-flex align-items-center">
                                            <div className="me-2">
                                                <span className="avatar avatar-md bg-danger avatar-rounded">
                                                    CH
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <p className="fw-semibold mb-0">Prepare for the new project<span className="badge bg-light text-muted float-end">3 Jan 2023</span></p>
                                                <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>2 hrs ago</span>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <div className="d-flex align-items-center">
                                            <div className="me-2">
                                                <span className="avatar avatar-md bg-info avatar-rounded">
                                                    S
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <p className="fw-semibold mb-0">Decide the live discussion<span className="badge bg-light text-muted float-end">17 Feb 2023</span></p>
                                                <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>3 hrs ago</span>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <div className="d-flex align-items-center">
                                            <div className="me-2">
                                                <span className="avatar avatar-md avatar-rounded">
                                                    <img src={ALLImages('face12')} alt="" />
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <p className="fw-semibold mb-0">Meeting at 3:00 pm<span className="badge bg-light text-muted float-end">29 Dec 2022</span></p>
                                                <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>4 hrs ago</span>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <div className="d-flex align-items-center">
                                            <div className="me-2">
                                                <span className="avatar avatar-md bg-success avatar-rounded">
                                                    RC
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <p className="fw-semibold mb-0">Prepare for presentation<span className="badge bg-light text-muted float-end">31 Dec 2022</span></p>
                                                <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>4 hrs ago</span>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <div className="d-flex align-items-center">
                                            <div className="me-2">
                                                <span className="avatar avatar-md avatar-rounded">
                                                    <img src={ALLImages('face1')} alt="" />
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <p className="fw-semibold mb-0">Brenda New product launching<span className="badge bg-light text-muted float-end">1 Jan 2023</span></p>
                                                <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>7 hrs ago</span>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <div className="d-flex align-items-center">
                                            <div className="me-2">
                                                <span className="avatar avatar-md bg-secondary avatar-rounded">
                                                    M
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <p className="fw-semibold mb-0">Medeleine Hey! there i'm available<span className="badge bg-light text-muted float-end">5 Jan 2023</span></p>
                                                <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>3 hrs ago</span>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <div className="d-flex align-items-center">
                                            <div className="me-2">
                                                <span className="avatar avatar-md bg-info avatar-rounded">
                                                    OL
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <p className="fw-semibold mb-0">Olivia New schedule release<span className="badge bg-light text-muted float-end">6 Jan 2023</span></p>
                                                <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>45 mins ago</span>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <div className="d-flex align-items-center">
                                            <div className="me-2">
                                                <span className="avatar avatar-md bg-warning avatar-rounded">
                                                    A
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <p className="fw-semibold mb-0">Kamala Preparing for new admin launch<span className="badge bg-light text-muted float-end">7 Jan 2023</span></p>
                                                <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>28 mins ago</span>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <div className="d-flex align-items-center">
                                            <div className="me-2">
                                                <span className="avatar avatar-md avatar-rounded">
                                                    <img src={ALLImages('face6')} alt="" />
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <p className="fw-semibold mb-0">Oisha Meeting with clinet for dinner<span className="badge bg-light text-muted float-end">10 Jan 2023</span></p>
                                                <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>14 hrs ago</span>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <div className="d-flex align-items-center">
                                            <div className="me-2">
                                                <span className="avatar avatar-md bg-danger avatar-rounded">
                                                    CH
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <p className="fw-semibold mb-0">Prepare for the new project<span className="badge bg-light text-muted float-end">3 Jan 2023</span></p>
                                                <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>2 hrs ago</span>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <div className="d-flex align-items-center">
                                            <div className="me-2">
                                                <span className="avatar avatar-md bg-info avatar-rounded">
                                                    S
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <p className="fw-semibold mb-0">Decide the live discussion<span className="badge bg-light text-muted float-end">17 Feb 2023</span></p>
                                                <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>3 hrs ago</span>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <div className="d-flex align-items-center">
                                            <div className="me-2">
                                                <span className="avatar avatar-md avatar-rounded">
                                                    <img src={ALLImages('face14')} alt="" />
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <p className="fw-semibold mb-0">Meeting at 3:00 pm<span className="badge bg-light text-muted float-end">29 Dec 2022</span></p>
                                                <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>4 hrs ago</span>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <div className="d-flex align-items-center">
                                            <div className="me-2">
                                                <span className="avatar avatar-md bg-success avatar-rounded">
                                                    RC
                                                </span>
                                            </div>
                                            <div className="flex-fill">
                                                <p className="fw-semibold mb-0">Prepare for presentation<span className="badge bg-light text-muted float-end">31 Dec 2022</span></p>
                                                <span className="fs-12 text-muted"><i className="ri-time-line align-middle me-1 d-inline-block"></i>4 hrs ago</span>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                </ListGroup>
                            </div>
                        ) : 'Some text as a placeholder. In real life, you can have the elements you have chosen, such as text, images, lists, etc.'}
    
                    </Offcanvas.Body>
                </Offcanvas>
            </>
        );
    };
                `}
              </code></pre>
            </div>
          </Card>
        </div>
      </Row>
    </Fragment>
  )
}

export default OffcanvasComponent;
