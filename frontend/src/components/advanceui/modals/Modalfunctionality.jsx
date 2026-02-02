import { Fragment } from 'react';
import { useState } from 'react'
import { Button, Col, Form, Modal, OverlayTrigger, Popover, Row, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rodal from "rodal";

export function BasicModal() {
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

export function StaticBackdrop() {
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

export function ScrollingContent() {
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

export function VerticallyCentered() {
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

export function TooltipModal() {
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

export function ModalGrid() {
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

export function ModalInsideModal() {
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

export function OptionalSize() {
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

export function Fullscreen() {
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
                    className={`me-2 mb-2 btn-${vari[idx]}`} // Dynamically assign color
                    onClick={() => handleShow(v)}
                >
                    Full screen
                    {typeof v === 'string' && ` below ${v.split('-')[0]}`}
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

export function VARYINGMODAL() {
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

export function AnimatedModal() {

    const [_visible, setVisible] = useState(false);
    const [animation1, setAnimation1] = useState(false);
    const [animation2, setAnimation2] = useState(false);
    const [animation3, setAnimation3] = useState(false);
    const [animation4, setAnimation4] = useState(false);
    const [animation5, setAnimation5] = useState(false);
    const [animation6, setAnimation6] = useState(false);
    const [animation7, setAnimation7] = useState(false);
    const [animation8, setAnimation8] = useState(false);
    const [animation9, setAnimation9] = useState(false);

    const hide = () => {
        setVisible(false);
    };

    let viewDemoShow1 = (modal) => {
        switch (modal) {
            case "Basic":
                setAnimation1(true);
                break;
            case "show2":
                setAnimation2(true);
                break;
            case "show3":
                setAnimation3(true);
                break;
            case "show4":
                setAnimation4(true);
                break;
            case "show5":
                setAnimation5(true);
                break;
            case "show6":
                setAnimation6(true);
                break;
            case "show7":
                setAnimation7(true);
                break;
            case "show8":
                setAnimation8(true);
                break;
            case "show9":
                setAnimation9(true);
                break;
        }
    };

    let viewDemoClose1 = (modal) => {
        switch (modal) {
            case "Basic":
                setAnimation1(false);
                break;
            case "show2":
                setAnimation2(false);
                break;
            case "show3":
                setAnimation3(false);
                break;
            case "show4":
                setAnimation4(false);
                break;
            case "show5":
                setAnimation5(false);
                break;
            case "show6":
                setAnimation6(false);
                break;
            case "show7":
                setAnimation7(false);
                break;
            case "show8":
                setAnimation8(false);
                break;
            case "show9":
                setAnimation9(false);
                break;
        }
    };

    return (

        <Row className="">
            <Col sm={6} md={4} xl={3}>
                <Link to="#" className="modal-effect btn btn-primary d-grid mb-3" onClick={() => viewDemoShow1("Basic")}>Zoom</Link>
                <Rodal onClose={() => { hide(); viewDemoClose1("Basic"); }} visible={animation1} animation='Zoom' >
                    <div className="modal-header">
                        <h6 className="modal-title" onClick={() => viewDemoClose1("Basic")}>Message Preview</h6>
                    </div>
                    <div className="modal-body text-start mt-2">
                        <h6>Why We Use Electoral College, Not Popular Vote</h6>
                        <p className="text-muted mb-0">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary me-2">Save changes</button> <button className="btn btn-light" onClick={() => viewDemoClose1("Basic")} >Close</button>
                    </div>
                </Rodal>
            </Col>
            <Col sm={6} md={4} xl={3}>
                <Link to="#" className="modal-effect btn btn-primary d-grid mb-3" onClick={() => viewDemoShow1("show2")}>Fade</Link>
                <Rodal onClose={() => { hide(); viewDemoClose1("show2"); }} visible={animation2} animation='fade' >
                    <div className="modal-header">
                        <h6 className="modal-title" onClick={() => viewDemoClose1("show2")}>Message Preview</h6>
                    </div>
                    <div className="modal-body text-start mt-2">
                        <h6>Why We Use Electoral College, Not Popular Vote</h6>
                        <p className="text-muted mb-0">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary me-2">Save changes</button> <button className="btn btn-light" onClick={() => viewDemoClose1("show2")} >Close</button>
                    </div>
                </Rodal>
            </Col>
            <Col sm={6} md={4} xl={3}>
                <Link to="#" className="modal-effect btn btn-primary d-grid mb-3" onClick={() => viewDemoShow1("show3")}>Flip</Link>
                <Rodal onClose={() => { hide(); viewDemoClose1("show3"); }} visible={animation3} animation='flip' >
                    <div className="modal-header">
                        <h6 className="modal-title" onClick={() => viewDemoClose1("show3")}>Message Preview</h6>
                    </div>
                    <div className="modal-body text-start mt-2">
                        <h6>Why We Use Electoral College, Not Popular Vote</h6>
                        <p className="text-muted mb-0">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary me-2">Save changes</button> <button className="btn btn-light" onClick={() => viewDemoClose1("show3")} >Close</button>
                    </div>
                </Rodal>
            </Col>
            <Col sm={6} md={4} xl={3}>
                <Link to="#" className="modal-effect btn btn-primary d-grid mb-3" onClick={() => viewDemoShow1("show4")}>Door</Link>
                <Rodal onClose={() => { hide(); viewDemoClose1("show4"); }} visible={animation4} animation='door' >
                    <div className="modal-header">
                        <h6 className="modal-title" onClick={() => viewDemoClose1("show4")}>Message Preview</h6>
                    </div>
                    <div className="modal-body text-start mt-2">
                        <h6>Why We Use Electoral College, Not Popular Vote</h6>
                        <p className="text-muted mb-0">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary me-2">Save changes</button> <button className="btn btn-light" onClick={() => viewDemoClose1("show4")} >Close</button>
                    </div>
                </Rodal>
            </Col>
            <Col sm={6} md={4} xl={3}>
                <Link to="#" className="modal-effect btn btn-primary d-grid mb-3" onClick={() => viewDemoShow1("show5")}>Rotate</Link>
                <Rodal onClose={() => { hide(); viewDemoClose1("show5"); }} visible={animation5} animation='rotate' >
                    <div className="modal-header">
                        <h6 className="modal-title" onClick={() => viewDemoClose1("show5")}>Message Preview</h6>
                    </div>
                    <div className="modal-body text-start mt-2">
                        <h6>Why We Use Electoral College, Not Popular Vote</h6>
                        <p className="text-muted mb-0">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary me-2">Save changes</button> <button className="btn btn-light" onClick={() => viewDemoClose1("show5")} >Close</button>
                    </div>
                </Rodal>
            </Col>
            <Col sm={6} md={4} xl={3}>
                <Link to="#" className="modal-effect btn btn-primary d-grid mb-3" onClick={() => viewDemoShow1("show6")}>Slide-Up</Link>
                <Rodal onClose={() => { hide(); viewDemoClose1("show6"); }} visible={animation6} animation='slideUp' >
                    <div className="modal-header">
                        <h6 className="modal-title" onClick={() => viewDemoClose1("show6")}>Message Preview</h6>
                    </div>
                    <div className="modal-body text-start mt-2">
                        <h6>Why We Use Electoral College, Not Popular Vote</h6>
                        <p className="text-muted mb-0">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary me-2">Save changes</button> <button className="btn btn-light" onClick={() => viewDemoClose1("show6")} >Close</button>
                    </div>
                </Rodal>
            </Col>
            <Col sm={6} md={4} xl={3}>
                <Link to="#" className="modal-effect btn btn-primary d-grid mb-3" onClick={() => viewDemoShow1("show7")}>slide-Down</Link>
                <Rodal onClose={() => { hide(); viewDemoClose1("show7"); }} visible={animation7} animation='slideDown' >
                    <div className="modal-header">
                        <h6 className="modal-title" onClick={() => viewDemoClose1("show7")}>Message Preview</h6>
                    </div>
                    <div className="modal-body text-start mt-2">
                        <h6>Why We Use Electoral College, Not Popular Vote</h6>
                        <p className="text-muted mb-0">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary me-2">Save changes</button> <button className="btn btn-light" onClick={() => viewDemoClose1("show7")} >Close</button>
                    </div>
                </Rodal>
            </Col>
            <Col sm={6} md={4} xl={3}>
                <Link to="#" className="modal-effect btn btn-primary d-grid mb-3" onClick={() => viewDemoShow1("show8")}>slide-Left</Link>
                <Rodal onClose={() => { hide(); viewDemoClose1("show8"); }} visible={animation8} animation='slideLeft' >
                    <div className="modal-header">
                        <h6 className="modal-title" onClick={() => viewDemoClose1("show8")}>Message Preview</h6>
                    </div>
                    <div className="modal-body text-start mt-2">
                        <h6>Why We Use Electoral College, Not Popular Vote</h6>
                        <p className="text-muted mb-0">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary me-2">Save changes</button> <button className="btn btn-light" onClick={() => viewDemoClose1("show8")} >Close</button>
                    </div>
                </Rodal>
            </Col>
            <Col sm={6} md={4} xl={3}>
                <Link to="#" className="modal-effect btn btn-primary d-grid mb-3" onClick={() => viewDemoShow1("show9")}>slide-Right</Link>
                <Rodal onClose={() => { hide(); viewDemoClose1("show9"); }} visible={animation9} animation='slideRight' >
                    <div className="modal-header">
                        <h6 className="modal-title" onClick={() => viewDemoClose1("show9")}>Message Preview</h6>
                    </div>
                    <div className="modal-body text-start mt-2">
                        <h6>Why We Use Electoral College, Not Popular Vote</h6>
                        <p className="text-muted mb-0">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary me-2">Save changes</button> <button className="btn btn-light" onClick={() => viewDemoClose1("show9")} >Close</button>
                    </div>
                </Rodal>
            </Col>
        </Row>

    )
}
