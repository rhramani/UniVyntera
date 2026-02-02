import { Fragment, useState } from "react";
import { Button, ListGroup, Offcanvas } from "react-bootstrap";
import ALLImages from "../../../common/Imagedata";

export function LiveDemo() {
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

export function BodyScroll() {
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

export function BackDrop() {
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

export function BodyScrollandBackDrop() {
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

export const Placement = () => {
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
