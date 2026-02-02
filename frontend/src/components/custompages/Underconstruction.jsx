import React, { Fragment } from 'react'
import ALLImages from '../../common/Imagedata'
import { Link } from "react-router-dom";
import { useTimer } from 'react-timer-hook';
import { Col, Container, Row } from "react-bootstrap";


function MyTimer({ expiryTimestamp }) {
    const { seconds, minutes, hours, days } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });
    return (
        <div id="launch_date" className="is-countdown">
            <Row className='mt-4 gy-xxl-0 gy-3 mb-5 justify-content-center'>
                <Col xxl={2} xl={3} lg={3} md={3} sm={3} className='col-6'><div className="p-3 under-maintenance-time rounded"><p className="mb-1 fs-12 op-5">DAYS</p><h4 className="fw-semibold mb-0">{days}</h4></div></Col>
                <Col xxl={2} xl={3} lg={3} md={3} sm={3} className='col-6'><div className="p-3 under-maintenance-time rounded"><p className="mb-1 fs-12 op-5">HOURS</p><h4 className="fw-semibold mb-0">{hours}</h4></div></Col>
                <Col xxl={2} xl={3} lg={3} md={3} sm={3} className='col-6'><div className="p-3 under-maintenance-time rounded"><p className="mb-1 fs-12 op-5">MINUTES</p><h4 className="fw-semibold mb-0">{minutes}</h4></div></Col>
                <Col xxl={2} xl={3} lg={3} md={3} sm={3} className='col-6'><div className="p-3 under-maintenance-time rounded"><p className="mb-1 fs-12 op-5">SECONDS</p><h4 className="fw-semibold mb-0">{seconds}</h4></div></Col>
            </Row>
        </div>
    );
}

const Underconstruction = () => {

    const time = new Date();
    time.setSeconds(time.getSeconds() + 40000000);
    return (
        <Fragment>
            <div className="page main-signin-wrapper bg-primary construction">

                <Container>
                    <div className="construction1 text-center details text-fixed-white">
                        <div className="">
                            <Link to={`${import.meta.env.BASE_URL}dashboard/dashboard/`}><img src={ALLImages('logo3')} className="header-brand-img mb-5" alt="logo" /></Link>
                            <h4 className="text-center text-fixed-white fs-30 fw-semibold ">We are Coming soon</h4>
                            <p className="text-white-6 fs-15">We're making the system more awesome.we'll be back shortly.</p>
                            <MyTimer expiryTimestamp={time} />
                        </div>
                        <div className="text-center">© 2024  <Link to="https://www.spruko.com/" className="text-white-6">Spruko</Link> All rights reserved.</div>
                    </div>
                </Container>

            </div>
        </Fragment>
    )
}

export default Underconstruction
