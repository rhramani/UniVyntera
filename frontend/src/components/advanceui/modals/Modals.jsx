import { Fragment, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { AnimatedModal, BasicModal, Fullscreen, ModalGrid, ModalInsideModal, OptionalSize, ScrollingContent, StaticBackdrop, TooltipModal, VARYINGMODAL, VerticallyCentered, VerticallyScrollCentered } from "./Modalfunctionality";
import Pageheader from "../../../layouts/Pageheader";


const Modals = () => {

  //showcode

  const [isHidden, setIsHidden] = useState([false]);
  const toggleHidden = (index) => {
    const updatedHidden = [...isHidden];
    updatedHidden[index] = !updatedHidden[index];
    setIsHidden(updatedHidden);
  };

  return (
    <Fragment>
      <Pageheader mainheading='Modal & Closes' parentfolder='Advanced Ui' activepage='Modal & Closes' />


      <Row className="row-sm">
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title"> Basic Modal </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(0)}>Show Code<i className={`${isHidden[0] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>
              <BasicModal />
            </Card.Body>
            <div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        function BasicModal() {
          const [show, setShow] = useState(false);
      
          const handleClose = () => setShow(false);
          const handleShow = () => setShow(true);
          return (
              <div>
                  <Button variant="primary" onClick={handleShow}>
                      Launch demo modal
                  </Button>
      
                  <Modal show={show} onHide={handleClose}>
                      <Modal.Header closeButton>
                          <Modal.Title as="h6">Modal Title</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>...</Modal.Body>
                      <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                              Close
                          </Button>
                          <Button variant="primary">
                              Save Changes
                          </Button>
                      </Modal.Footer>
                  </Modal>
              </div>
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
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(1)}>Show Code<i className={`${isHidden[1] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[1] ? 'd-none' : ''}`}>
              <StaticBackdrop />
            </Card.Body>
            <div className={`${isHidden[1] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        function StaticBackdrop() {
          const [show, setShow] = useState(false);
      
          const handleClose = () => setShow(false);
          const handleShow = () => setShow(true);
          return (
              <div>
                  <Button variant="primary" onClick={handleShow}>
                      Launch static backdrop modal
                  </Button>
      
                  <Modal
                      show={show}
                      onHide={handleClose}
                      backdrop="static"
                      keyboard={false}
                  >
                      <Modal.Header closeButton>
                          <Modal.Title as="h6">Modal title</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                          I will not close if you click outside me. Don not even try to press
                          escape key.
                      </Modal.Body>
                      <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                              Close
                          </Button>
                          <Button variant="primary">Understood</Button>
                      </Modal.Footer>
                  </Modal>
              </div>
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
                Scrolling long content
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(2)}>Show Code<i className={`${isHidden[2] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[2] ? 'd-none' : ''}`}>
              <ScrollingContent />
            </Card.Body>
            <div className={`${isHidden[2] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        function ScrollingContent() {
          const [show, setShow] = useState(false);
      
          const handleClose = () => setShow(false);
          const handleShow = () => setShow(true);
          return (
              <div>
                  <Button variant="primary" onClick={handleShow}>
                      Launch demo modal
                  </Button>
      
                  <Modal show={show} onHide={handleClose}>
                      <Modal.Header closeButton>
                          <Modal.Title as="h6">Modal heading</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                              Libero
                              ipsum quasi, error quibusdam debitis maiores hic eum? Vitae
                              nisi
                              ipsa maiores fugiat deleniti quis reiciendis veritatis.</p>
                          <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea
                              voluptatibus, ipsam quo est rerum modi quos expedita facere,
                              ex
                              tempore fuga similique ipsa blanditiis et accusamus
                              temporibus
                              commodi voluptas! Nobis veniam illo architecto expedita quam
                              ratione quaerat omnis. In, recusandae eos! Pariatur,
                              deleniti
                              quis ad nemo ipsam officia temporibus, doloribus fuga
                              asperiores
                              ratione distinctio velit alias hic modi praesentium aperiam
                              officiis eaque, accusamus aut. Accusantium assumenda,
                              commodi
                              nulla provident asperiores fugit inventore iste amet aut
                              placeat
                              consequatur reprehenderit. Ratione tenetur eligendi, quis
                              aperiam dolores magni iusto distinctio voluptatibus minus a
                              unde
                              at! Consequatur voluptatum in eaque obcaecati, impedit
                              accusantium ea soluta, excepturi, quasi quia commodi
                              blanditiis?
                              Qui blanditiis iusto corrupti necessitatibus dolorem fugiat
                              consequuntur quod quo veniam? Labore dignissimos reiciendis
                              accusamus recusandae est consequuntur iure.</p>
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <p>Lorem ipsum dolor sit amet.</p>
                      </Modal.Body>
                      <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                              Close
                          </Button>
                          <Button variant="primary">
                              Save Changes
                          </Button>
                      </Modal.Footer>
                  </Modal>
              </div>
          )
      }
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>
      <Row className="row-sm">
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Vertically centered modal
              </div>

              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(3)}>Show Code<i className={`${isHidden[3] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[3] ? 'd-none' : ''}`}>
              <VerticallyCentered />
            </Card.Body>
            <div className={`${isHidden[3] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        function MyVerticallyCenteredModal(props) {
          return (
              <Modal
                  {...props}
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
              >
                  <Modal.Header closeButton>
                      <Modal.Title id="contained-modal-title-vcenter" as="h6">
                          Modal heading
                      </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      <h4>Centered Modal</h4>
                      <p>
                          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
                          consectetur ac, vestibulum at eros.
                      </p>
                  </Modal.Body>
                  <Modal.Footer>
                      <Button onClick={props.onHide}>Close</Button>
                  </Modal.Footer>
              </Modal>
          );
      }
      
      function VerticallyCentered() {
          const [modalShow, setModalShow] = useState(false);
          return (
              <div>
                  <Button variant="primary" onClick={() => setModalShow(true)}>
                      vertically centered modal
                  </Button>
                  <MyVerticallyCenteredModal
                      show={modalShow}
                      onHide={() => setModalShow(false)}
                  />
              </div>
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
                Vertical Centered Scrollable
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(4)}>Show Code<i className={`${isHidden[4] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[4] ? 'd-none' : ''}`}>
              <VerticallyScrollCentered />
            </Card.Body>
            <div className={`${isHidden[4] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        function MyVerticallyCenteredScrollingModal(props) {
          return (
              <Modal
                  {...props}
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
              >
                  <Modal.Header closeButton>
                      <Modal.Title id="contained-modal-title-vcenter" as="h6">
                          Modal heading
                      </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea
                          voluptatibus, ipsam quo est rerum modi quos expedita facere,
                          ex
                          tempore fuga similique ipsa blanditiis et accusamus
                          temporibus
                          commodi voluptas! Nobis veniam illo architecto expedita quam
                          ratione quaerat omnis. In, recusandae eos! Pariatur,
                          deleniti
                          quis ad nemo ipsam officia temporibus, doloribus fuga
                          asperiores
                          ratione distinctio velit alias hic modi praesentium aperiam
                          officiis eaque, accusamus aut. Accusantium assumenda,
                          commodi
                          nulla provident asperiores fugit inventore iste amet aut
                          placeat
                          consequatur reprehenderit. Ratione tenetur eligendi, quis
                          aperiam dolores magni iusto distinctio voluptatibus minus a
                          unde
                          at! Consequatur voluptatum in eaque obcaecati, impedit
                          accusantium ea soluta, excepturi, quasi quia commodi
                          blanditiis?
                          Qui blanditiis iusto corrupti necessitatibus dolorem fugiat
                          consequuntur quod quo veniam? Labore dignissimos reiciendis
                          accusamus recusandae est consequuntur iure.</p>
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <p>Lorem ipsum dolor sit amet.</p>
                  </Modal.Body>
                  <Modal.Footer>
                      <Button onClick={props.onHide}>Close</Button>
                  </Modal.Footer>
              </Modal>
          );
      }
      
      export function VerticallyScrollCentered() {
          const [modalShow, setModalShow] = useState(false);
          return (
              <div>
                  <Button variant="primary" onClick={() => setModalShow(true)}>
                      vertically centered modal
                  </Button>
                  <MyVerticallyCenteredScrollingModal
                      show={modalShow}
                      onHide={() => setModalShow(false)}
                  />
              </div>
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
                Tooltips and popovers
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(5)}>Show Code<i className={`${isHidden[5] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[5] ? 'd-none' : ''}`}>
              <TooltipModal />
            </Card.Body>
            <div className={`${isHidden[5] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        function TooltipModal() {
          const [show, setShow] = useState(false);
      
          const handleClose = () => setShow(false);
          const handleShow = () => setShow(true);
      
          const popover = (
              <Popover>
                  <Popover.Header as="h3">Popover right</Popover.Header>
                  <Popover.Body>
                      And here's some <strong>amazing</strong> content. It's very engaging.
                      right?
                  </Popover.Body>
              </Popover>
          );
          return (
              <div>
                  <Button variant="primary" onClick={handleShow}>
                      Launch demo modal
                  </Button>
      
                  <Modal show={show} onHide={handleClose}>
                      <Modal.Header closeButton>
                          <Modal.Title as="h6">Modal Title</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                          <h5>Popover in a modal</h5>
                          <p>This <OverlayTrigger trigger="click" placement="right" overlay={popover}>
                              <Button variant="success">Click me to see</Button>
                          </OverlayTrigger> triggers a popover on click.</p>
                          <hr />
                          <h5>Tooltips in a modal</h5>
                          <p><OverlayTrigger overlay={<Tooltip>tooltip</Tooltip>}><Link to="#" className="text-primary">This
                              link</Link></OverlayTrigger> and <OverlayTrigger overlay={<Tooltip>tooltip</Tooltip>}><Link to="#" className="text-primary">that
                                  link</Link></OverlayTrigger> have tooltips on hover.
                          </p>
                      </Modal.Body>
                      <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                              Close
                          </Button>
                          <Button variant="primary">
                              Save Changes
                          </Button>
                      </Modal.Footer>
                  </Modal>
              </div>
          )
      }
                `}
              </code></pre>
            </div>

          </Card>
        </Col>

      </Row>

      <Row className="row-sm">
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Using the grid
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(6)}>Show Code<i className={`${isHidden[6] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[6] ? 'd-none' : ''}`}>
              <ModalGrid />
            </Card.Body>
            <div className={`${isHidden[6] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        function MydModalWithGrid(props) {
          return (
              <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
                  <Modal.Header closeButton>
                      <Modal.Title id="contained-modal-title-vcenter" as="h6">
                          Using Grid in Modal
                      </Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="grid-example">
                      <div className="container-fluid">
                          <Row>
                              <div className="col-md-4 bg-light border">.col-md-4</div>
                              <div className="col-md-4 ms-auto bg-light border">.col-md-4
                                  .ms-auto</div>
                          </Row>
                          <Row className="mt-3">
                              <div className="col-md-3 ms-auto bg-light border">.col-md-3
                                  .ms-auto</div>
                              <div className="col-md-2 ms-auto bg-light border">.col-md-2
                                  .ms-auto</div>
                          </Row>
                          <Row className="mt-3">
                              <div className="col-md-6 ms-auto bg-light border">.col-md-6
                                  .ms-auto</div>
                          </Row>
                          <Row className="mt-3">
                              <Col sm={9} className="bg-light border">
                                  Level 1: .col-sm-9
                                  <Row>
                                      <Col sm={6} className="col-8 bg-light border">
                                          Level 2: .col-8 .col-sm-6
                                      </Col>
                                      <Col sm={6} className="col-4 bg-light border">
                                          Level 2: .col-4 .col-sm-6
                                      </Col>
                                  </Row>
                              </Col>
                          </Row>
                      </div>
                  </Modal.Body>
                  <Modal.Footer>
                      <Button onClick={props.onHide}>Close</Button>
                  </Modal.Footer>
              </Modal>
          );
      }
      
      function ModalGrid() {
          const [modalShow, setModalShow] = useState(false);
      
          return (
              <Fragment>
                  <Button variant="primary" onClick={() => setModalShow(true)}>
                      Launch demo modal
                  </Button>
      
                  <MydModalWithGrid show={modalShow} onHide={() => setModalShow(false)} />
              </Fragment>
          );
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
                Toggle between modals
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(7)}>Show Code<i className={`${isHidden[7] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[7] ? 'd-none' : ''}`}>
              <ModalInsideModal />
            </Card.Body>
            <div className={`${isHidden[7] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        function ModalInsideModal() {
          const [show, setShow] = useState(false);
      
          const handleClose = () => setShow(false);
          const handleShow = () => setShow(true);
          return (
              <div>
                  <Button variant="primary" onClick={handleShow}>
                      Launch demo modal
                  </Button>
      
                  <Modal show={show} onHide={handleClose}>
                      <Modal.Header closeButton>
                          <Modal.Title as="h6">Modal Title</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                          <BasicModal />
                      </Modal.Body>
                      <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                              Close
                          </Button>
                          <Button variant="primary">
                              Save Changes
                          </Button>
                      </Modal.Footer>
                  </Modal>
              </div>
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
                Optional sizes
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(8)}>Show Code<i className={`${isHidden[8] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[8] ? 'd-none' : ''}`}>
              <OptionalSize />
            </Card.Body>
            <div className={`${isHidden[8] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
       function OptionalSize() {
        const sizes = ['xl', 'lg', 'sm'];
        const [showXlModal, setShowXlModal] = useState(false);
        const [showLgModal, setShowLgModal] = useState(false);
        const [showSmModal, setShowSmModal] = useState(false);
        const [selectedSize, setSelectedSize] = useState('');
    
        const handleShowModal = (size) => {
            switch (size) {
                case 'xl':
                    setShowXlModal(true);
                    break;
                case 'lg':
                    setShowLgModal(true);
                    break;
                case 'sm':
                    setShowSmModal(true);
                    break;
                default:
                    break;
            }
            setSelectedSize(size);
        };
    
        const handleCloseModal = () => {
            setShowXlModal(false);
            setShowLgModal(false);
            setShowSmModal(false);
            setSelectedSize('');
        };
        return (
    
            <div>
               {sizes.map((size) => (
                    <Button variant={size == 'xl' ? "primary" : "primary-light"} className='m-1' key={size} onClick={() => handleShowModal(size)}>
                    {size === 'xl' ? 'Extra Large' : size === 'lg' ? 'Large' : 'Small'} Modal
                </Button>
                ))}
    
                <Modal show={showXlModal} onHide={handleCloseModal} size="xl">
                    <Modal.Header closeButton>
                        <Modal.Title as="h6">{selectedSize.toUpperCase()} Modal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Modal body content for {selectedSize.toUpperCase()} size</Modal.Body>
                </Modal>
    
                <Modal show={showLgModal} onHide={handleCloseModal} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title as="h6">{selectedSize.toUpperCase()} Modal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Modal body content for {selectedSize.toUpperCase()} size</Modal.Body>
                </Modal>
    
                <Modal show={showSmModal} onHide={handleCloseModal} size="sm">
                    <Modal.Header closeButton>
                        <Modal.Title as="h6">{selectedSize.toUpperCase()} Modal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Modal body content for {selectedSize.toUpperCase()} size</Modal.Body>
                </Modal>
            </div>
    
        );
    }
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Fullscreen modal
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(9)}>Show Code<i className={`${isHidden[9] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[9] ? 'd-none' : ''}`}>
              <Fullscreen />
            </Card.Body>
            <div className={`${isHidden[9] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        function Fullscreen() {
          const values = [true, 'sm-down', 'md-down', 'lg-down', 'xl-down', 'xxl-down'];
          const vari = ['primary', 'secondary', 'warning', 'info', 'success', 'danger'];
          const [fullscreen, setFullscreen] = useState(true);
          const [show, setShow] = useState(false);
      
          function handleShow(breakpoint) {
              setFullscreen(breakpoint);
              setShow(true);
          }
      
          return (
              <>
                  {values.map((v, idx) => (
                      <Button
                          key={idx}
                          className={\`me-2 mb-2 btn-\${vari[idx]}\`} // Dynamically assign color
                          onClick={() => handleShow(v)}
                      >
                          Full screen
                          {typeof v === 'string' && \` below \${v.split('-')[0]}\`}
                      </Button>
                  ))}
                  <Modal show={show} fullscreen={fullscreen} onHide={() => setShow(false)}>
                      <Modal.Header closeButton>
                          <Modal.Title as="h6">Modal</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>Modal body content</Modal.Body>
                      <Modal.Footer>
                          <Button variant='secondary' onClick={() => setShow(false)}>close</Button>
                      </Modal.Footer>
                  </Modal>
              </>
          );
      }
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Varying modal content
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(10)}>Show Code<i className={`${isHidden[10] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[10] ? 'd-none' : ''}`}>
              <VARYINGMODAL />
            </Card.Body>
            <div className={`${isHidden[10] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        function VARYINGMODAL() {
          const modals = [
              { id: 1, title: 'Open modal for @mdo', color: 'primary', inputfield: '@mdo' },
              { id: 2, title: 'Open modal for @fat', color: 'secondary', inputfield: ' @fat' },
              { id: 3, title: 'Open modal for @getbootstrap', color: 'light', inputfield: '@getbootstrap' },
          ];
      
          const [show, setShow] = useState(false);
          const [selectedModal, setSelectedModal] = useState({ id: 0, title: '', color: '', inputfield: '' });
      
          const handleClose = () => setShow(false);
          const handleShow = (modal) => {
              setSelectedModal(modal);
              setShow(true);
          };
          return (
              <div>
                  {modals.map((modal) => (
                      <Button key={modal.id} className='m-1' variant={modal.color} onClick={() => handleShow(modal)}>
                          {modal.title}
                      </Button>
                  ))}
      
                  <Modal show={show} onHide={handleClose}>
                      <Modal.Header closeButton>
                          <div className='modal-title'>{selectedModal.title}</div>
                      </Modal.Header>
                      <Modal.Body>
                          <Form>
                              <div className="mb-3">
                                  <label htmlFor="recipient-name" className="col-form-label">
                                      Recipient:
                                  </label>
                                  <input type="text" className="form-control" id="recipient-name" placeholder={selectedModal.inputfield} />
                              </div>
                              <div className="mb-3">
                                  <label htmlFor="message-text" className="col-form-label">
                                      Message:
                                  </label>
                                  <textarea className="form-control" id="message-text"></textarea>
                              </div>
                          </Form>
                      </Modal.Body>
                      <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                              Close
                          </Button>
                          <Button variant="primary">
                              Save Changes
                          </Button>
                      </Modal.Footer>
                  </Modal>
              </div>
          )
      }
                `}
              </code></pre>
            </div>

          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title"> Modal Animation Effects </div>

            </Card.Header>
            <Card.Body>
              <AnimatedModal />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h6 className="mb-3">Close Buttons:</h6>
      <Row className="row-sm">
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between pb-2">
              <div className="card-title">
                Basic Close in React bootstrap
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(11)}>Show Code<i className={`${isHidden[11] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[11] ? 'd-none' : ''}`}>

              <button type="button" className="btn-close" aria-label="Close"></button>

            </Card.Body>
            <div className={`${isHidden[11] ? '' : 'd-none'} card-footer border-top-0`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <button type="button" className="btn-close" aria-label="Close"></button>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between pb-2">
              <div className="card-title">
                Disabel state
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(12)}>Show Code<i className={`${isHidden[12] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[12] ? 'd-none' : ''}`}>
              <button type="button" className="btn-close" disabled aria-label="Close"></button>
            </Card.Body>
            <div className={`${isHidden[12] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <button type="button" className="btn-close" disabled aria-label="Close"></button>
        </Card.Body>
                `}
              </code></pre>
            </div>

          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card overflow-hidden">
            <Card.Header className="justify-content-between pb-2">
              <div className="card-title">
                White variant
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(13)}>Show Code<i className={`${isHidden[13] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[13] ? 'd-none' : ''} bg-black`}>
              <button type="button" className="btn-close btn-close-white" aria-label="Close"></button>
              <button type="button" className="btn-close btn-close-white" disabled aria-label="Close"></button>
            </Card.Body>
            <div className={`${isHidden[13] ? '' : 'd-none'} card-footer border-top-0`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <button type="button" className="btn-close btn-close-white" aria-label="Close"></button>
              <button type="button" className="btn-close btn-close-white" disabled aria-label="Close"></button>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

    </Fragment>
  );
};

export default Modals;
