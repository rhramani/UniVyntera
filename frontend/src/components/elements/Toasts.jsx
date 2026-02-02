import { Fragment, useState } from 'react'
import { Button, Card, Col, Row, Toast, ToastContainer } from 'react-bootstrap'
import Pageheader from '../../layouts/Pageheader';
import ALLImages from '../../common/Imagedata';

const Toasts = () => {
    // **************************************************************************************************************************************************************************

    const toastVariants = ['primary-light', 'secondary-light', 'warning-light', 'info-light', 'success-light', 'danger-light'];

    const [showToast, setShowToast] = useState({});
    const handleClose = (variant) => setShowToast({ ...showToast, [variant]: false });
    const handleShow = (variant) => setShowToast({ ...showToast, [variant]: true });

    const [showToast2, setShowToast2] = useState({});
    const handleClose3 = (variant) => setShowToast2({ ...showToast2, [variant]: false });
    const handleShow2 = (variant) => setShowToast2({ ...showToast2, [variant]: true });

    // **************************************************************************************************************************************************************************
    const positions = ['top-start', 'top-center', 'top-end', 'middle-start', 'middle-center', 'middle-end', 'bottom-start', 'bottom-center', 'bottom-end'];

    const [showToast1, setShowToast1] = useState({});

    const handleClose1 = (variant) => {
        setShowToast1((prevState) => ({ ...prevState, [variant]: false }));
    };
    // **************************************************************************************************************************************************************************

    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(true);
    const [show2, setShow2] = useState(true);
    const [show3, setShow3] = useState(true);
    const [show4, setShow4] = useState(true);
    const [show5, setShow5] = useState(true);
    const [show6, setShow6] = useState(true);
    const [show7, setShow7] = useState(true);

    // ***********************************************************************************************************************************************************************************

    const [show8, setShow8] = useState(Array(4).fill(true));

    const handleClose2 = (index) => {
        const updatedShow = [...show8];
        updatedShow[index] = !updatedShow[index];
        setShow8(updatedShow);
    };


    //showcode

    const [isHidden, setIsHidden] = useState([false]);
    const toggleHidden = (index) => {
        const updatedHidden = [...isHidden];
        updatedHidden[index] = !updatedHidden[index];
        setIsHidden(updatedHidden);
    };

    return (
        <Fragment>
            <Pageheader mainheading='Toasts' parentfolder='Elements' activepage='Toasts' />

            <Row className="row-sm">
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Color Variants Live
                            </div>
                            <div className="prism-toggle">
                                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(0)}>Show Code<i className={`${isHidden[0] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                            </div>
                        </Card.Header>
                        <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>
                            <div className="btn-list">
                                {toastVariants.map((variant, index) => (
                                    <Button key={index} variant={variant} className="me-2 btn-wave" onClick={() => handleShow2(variant)}>{variant.replace('-light', '')}</Button>
                                ))}
                                <ToastContainer className='top-0 end-0 p-3' position='top-end' style={{ position: 'fixed' }}>
                                    {toastVariants.map((variant, index) => (
                                        <Toast key={index} className='colored-toast' bg={`${variant.replace('-light', '')}-transparent`}
                                            onClose={() => handleClose3(variant)} show={showToast2[variant] || false} delay={10000} autohide >
                                            <Toast.Header className={`bg-${variant.replace('-light', '')} text-fixed-white`} closeButton={true}>
                                                <img src={ALLImages('logo6')} className="rounded me-2" alt="bvcb" />
                                                <strong className="me-auto">Spruha</strong>
                                            </Toast.Header>
                                            <Toast.Body>This is a toast message.</Toast.Body>
                                        </Toast>
                                    ))}
                                </ToastContainer>
                            </div>
                        </Card.Body>
                        <div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0 `}>
                            <pre><code className='language-javascript'>
                                {`
        <Card.Body>
        <div className="btn-list">
                                {toastVariants.map((variant, index) => (
                                    <Button key={index} variant={variant} className="me-2 btn-wave" onClick={() => handleShow2(variant)}>{variant.replace('-light', '')}</Button>
                                ))}
                                <ToastContainer className='top-0 end-0 p-3' position='top-end' style={{ position: 'fixed' }}>
                                    {toastVariants.map((variant, index) => (
                                        <Toast key={index} className='colored-toast' bg={\`\${variant.replace('-light', '')}-transparent\`}
                                            onClose={() => handleClose3(variant)} show={showToast2[variant] || false} delay={10000} autohide >
                                            <Toast.Header className={\`bg-\${variant.replace('-light', '')} text-fixed-white\`} closeButton={true}>
                                                <img src={ALLImages('logo6')} className="rounded me-2" alt="bvcb" />
                                                <strong className="me-auto">Spruha</strong>
                                            </Toast.Header>
                                            <Toast.Body>This is a toast message.</Toast.Body>
                                        </Toast>
                                    ))}
                                </ToastContainer>
                            </div>
        </Card.Body>
                `}
                            </code></pre>
                        </div>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Solid Background Toasts
                            </div>
                            <div className="prism-toggle">
                                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(1)}>Show Code<i className={`${isHidden[1] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                            </div>
                        </Card.Header>
                        <Card.Body className={`${isHidden[1] ? 'd-none' : ''}`}>
                            <div className="btn-list">
                                {toastVariants.map((variant, index) => (
                                    <Button key={index} variant={variant.replace('-light', '')} className="me-2 btn-wave" onClick={() => handleShow(variant)}>{variant.replace('-light', '')}</Button>
                                ))}
                                <ToastContainer className='top-0 end-0 p-3' position='top-end' style={{ position: 'fixed' }}>
                                    {toastVariants.map((variant, index) => (
                                        <Toast key={index} className='colored-toast' bg={`${variant.replace('-light', '')}`}
                                            onClose={() => handleClose(variant)} show={showToast[variant] || false} delay={10000} autohide >
                                            <Toast.Header className={`bg-${variant.replace('-light', '')} text-fixed-white`} closeButton={true}>
                                                <img src={ALLImages('logo6')} className="rounded me-2" alt="toastjhjk" />
                                                <strong className="me-auto">Spruha</strong>

                                            </Toast.Header>
                                            <Toast.Body>This is a toast message.</Toast.Body>
                                        </Toast>
                                    ))}
                                </ToastContainer>
                            </div>
                        </Card.Body>
                        <div className={`${isHidden[1] ? '' : 'd-none'} card-footer border-top-0 `}>
                            <pre><code className='language-javascript'>
                                {`
        <Card.Body>
        <div className="btn-list">
                                {toastVariants.map((variant, index) => (
                                    <Button key={index} variant={variant.replace('-light', '')} className="me-2 btn-wave" onClick={() => handleShow(variant)}>{variant.replace('-light', '')}</Button>
                                ))}
                                <ToastContainer className='top-0 end-0 p-3' position='top-end' style={{ position: 'fixed' }}>
                                    {toastVariants.map((variant, index) => (
                                        <Toast key={index} className='colored-toast' bg={\`\${variant.replace('-light', '')}\`}
                                            onClose={() => handleClose(variant)} show={showToast[variant] || false} delay={10000} autohide >
                                            <Toast.Header className={\`bg-\${variant.replace('-light', '')} text-fixed-white\`} closeButton={true}>
                                                <img src={ALLImages('logo6')} className="rounded me-2" alt="toastjhjk" />
                                                <strong className="me-auto">Spruha</strong>

                                            </Toast.Header>
                                            <Toast.Body>This is a toast message.</Toast.Body>
                                        </Toast>
                                    ))}
                                </ToastContainer>
                            </div>
        </Card.Body>
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
                                Toast Placements
                            </div>
                            <div className="prism-toggle">
                                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(2)}>Show Code<i className={`${isHidden[2] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                            </div>
                        </Card.Header>
                        <Card.Body className={`${isHidden[2] ? 'd-none' : ''}`}>
                            {positions.map((position, index) => (
                                <Fragment key={index}>
                                    <Button variant='outline-primary' className="me-2 my-2 btn-wave" onClick={() => setShowToast1((prevState) => ({ ...prevState, [position]: true }))}>{position.charAt(0).toUpperCase() + position.slice(1)}</Button>
                                    <ToastContainer key={index} className={`p-3 position-${position.replace('-', ' ')}`} position={position} style={{ position: 'fixed' }} >
                                        <Toast className="colored-toast" bg='primary-transparent' onClose={() => handleClose1(position)} show={showToast1[position] || false} delay={10000} autohide >
                                            <Toast.Header className="bg-primary text-fixed-white" closeButton={true}>
                                                <img src={ALLImages('logo6')} className="rounded me-2" alt="bvcb" />
                                                <strong className="me-auto">Spruha</strong>

                                            </Toast.Header>
                                            <Toast.Body>This is a toast message.</Toast.Body>
                                        </Toast>
                                    </ToastContainer>
                                </Fragment>
                            ))}
                        </Card.Body>
                        <div className={`${isHidden[2] ? '' : 'd-none'} card-footer border-top-0 `}>
                            <pre><code className='language-javascript'>
                                {`
        <Card.Body>
        {positions.map((position, index) => (
            <Fragment key={index}>
                <Button variant='outline-primary' className="me-2 my-2 btn-wave" onClick={() => setShowToast1((prevState) => ({ ...prevState, [position]: true }))}>{position.charAt(0).toUpperCase() + position.slice(1)}</Button>
                <ToastContainer key={index} className={\`p-3 position-\${position.replace('-', ' ')}\`} position={position} style={{ position: 'fixed' }} >
                    <Toast className="colored-toast" bg='primary-transparent' onClose={() => handleClose1(position)} show={showToast1[position] || false} delay={10000} autohide >
                        <Toast.Header className="bg-primary text-fixed-white" closeButton={true}>
                            <img src={ALLImages('logo6')} className="rounded me-2" alt="bvcb" />
                            <strong className="me-auto">Spruha</strong>

                        </Toast.Header>
                        <Toast.Body>This is a toast message.</Toast.Body>
                    </Toast>
                </ToastContainer>
            </Fragment>
        ))}
        </Card.Body>
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
                            <div className="card-title"> Live example </div>
                            <div className="prism-toggle">
                                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(3)}>Show Code<i className={`${isHidden[3] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                            </div>
                        </Card.Header>
                        <Card.Body className={`${isHidden[3] ? 'd-none' : ''}`}>
                            <Button className="btn-wave" onClick={() => setShow(true)}>Show live toast</Button>
                            <ToastContainer className='top-0 end-0 me-4 mt-4' style={{ position: 'fixed' }} >
                                <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
                                    <Toast.Header className="text-default mb-0" closeButton={true}>
                                        <img className="bd-placeholder-img rounded me-2" src={ALLImages('logo4')} alt="..." />
                                        <strong className="me-auto">Spruha</strong>
                                        <small>11 mins ago</small>
                                    </Toast.Header>
                                    <Toast.Body> This is a toast message. </Toast.Body>
                                </Toast>
                            </ToastContainer>
                        </Card.Body>
                        <div className={`${isHidden[3] ? '' : 'd-none'} card-footer border-top-0 `}>
                            <pre><code className='language-javascript'>
                                {`
        <Card.Body>
        <Button className="btn-wave" onClick={() => setShow(true)}>Show live toast</Button>
        <ToastContainer className='top-0 end-0 me-4 mt-4' style={{ position: 'fixed' }} >
            <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
                <Toast.Header className="text-default mb-0" closeButton={true}>
                    <img className="bd-placeholder-img rounded me-2" src={ALLImages('logo4')} alt="..." />
                    <strong className="me-auto">Spruha</strong>
                    <small>11 mins ago</small>
                </Toast.Header>
                <Toast.Body> This is a toast message. </Toast.Body>
            </Toast>
        </ToastContainer>
        </Card.Body>
                `}
                            </code></pre>
                        </div>
                    </Card>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Color schemes
                            </div>
                            <div className="prism-toggle">
                                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(4)}>Show Code<i className={`${isHidden[4] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                            </div>
                        </Card.Header>
                        <Card.Body className={`${isHidden[4] ? 'd-none' : ''}`}>
                            {['primary', 'secondary', 'success', 'info'].map((color, index) => (
                                <Toast key={index} className={`d-flex text-bg-${color} border-0 fade mb-4`} show={show8[index]}>
                                    <Toast.Body>Hello, world! This is a {color} toast message.</Toast.Body>
                                    <Button className="btn-close btn-close-white text-white me-2 m-auto" variant="" onClick={() => handleClose2(index)}></Button>
                                </Toast>
                            ))}
                        </Card.Body>
                        <div className={`${isHidden[4] ? '' : 'd-none'} card-footer border-top-0 `}>
                            <pre><code className='language-javascript'>
                                {`
        <Card.Body>
        {['primary', 'secondary', 'success', 'info'].map((color, index) => (
            <Toast key={index} className={\`d-flex text-bg-\${color} border-0 fade mb-4\`} show={show8[index]}>
                <Toast.Body>Hello, world! This is a {color} toast message.</Toast.Body>
                <Button className="btn-close btn-close-white text-white me-2 m-auto" variant="" onClick={() => handleClose2(index)}></Button>
            </Toast>
        ))}
        </Card.Body>
                `}
                            </code></pre>
                        </div>
                    </Card>
                </Col>
                <Col xl={4}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Basic example
                            </div>
                            <div className="prism-toggle">
                                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(5)}>Show Code<i className={`${isHidden[5] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                            </div>
                        </Card.Header>
                        <Card.Body className={`${isHidden[5] ? 'd-none' : ''}`}>
                            <Toast show={show1}>
                                <Toast.Header closeButton={false}>
                                    <img src={ALLImages('logo4')} className="rounded me-2" alt="" />
                                    <strong className="me-auto text-dark">Spruha</strong>
                                    <small className='text-muted'>11 mins ago</small>
                                    <button type="button" className="btn-close" onClick={() => setShow1(!show1)}></button>
                                </Toast.Header>
                                <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
                            </Toast>
                        </Card.Body>
                        <div className={`${isHidden[5] ? '' : 'd-none'} card-footer border-top-0 `}>
                            <pre><code className='language-javascript'>
                                {`
        <Card.Body>
        <Toast show={show1}>
        <Toast.Header closeButton={false}>
            <img src={ALLImages('logo4')} className="rounded me-2" alt="" />
            <strong className="me-auto text-dark">Spruha</strong>
            <small className='text-muted'>11 mins ago</small>
            <button type="button" className="btn-close" onClick={() => setShow1(!show1)}></button>
        </Toast.Header>
        <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
    </Toast>
        </Card.Body>
                `}
                            </code></pre>
                        </div>
                    </Card>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Stacking
                            </div>
                            <div className="prism-toggle">
                                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(6)}>Show Code<i className={`${isHidden[6] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                            </div>
                        </Card.Header>
                        <Card.Body className={`${isHidden[6] ? 'd-none' : ''}`}>
                            <ToastContainer className="position-static">
                                <Toast show={show2}>
                                    <Toast.Header closeButton={false}>
                                        <img src={ALLImages('logo7')} className="rounded me-2" alt="" />
                                        <strong className="me-auto text-dark">Spruha</strong>
                                        <small className="text-muted">just now</small>
                                        <button type="button" className="btn-close" onClick={() => setShow2(!show2)}></button>
                                    </Toast.Header>
                                    <Toast.Body>See? Just like this.</Toast.Body>
                                </Toast>
                                <Toast show={show3}>
                                    <Toast.Header closeButton={false}>
                                        <img src={ALLImages('logo7')} className="rounded me-2" alt="" />
                                        <strong className="me-auto text-dark">Spruha</strong>
                                        <small className="text-muted">2 seconds ago</small>
                                        <button type="button" className="btn-close" onClick={() => setShow3(!show3)}></button>
                                    </Toast.Header>
                                    <Toast.Body>Heads up, toasts will stack automatically</Toast.Body>
                                </Toast>
                            </ToastContainer>
                        </Card.Body>
                        <div className={`${isHidden[6] ? '' : 'd-none'} card-footer border-top-0 `}>
                            <pre><code className='language-javascript'>
                                {`
        <Card.Body>
        <ToastContainer className="position-static">
        <Toast show={show2}>
            <Toast.Header closeButton={false}>
                <img src={ALLImages('logo7')} className="rounded me-2" alt="" />
                <strong className="me-auto text-dark">Spruha</strong>
                <small className="text-muted">just now</small>
                <button type="button" className="btn-close" onClick={() => setShow2(!show2)}></button>
            </Toast.Header>
            <Toast.Body>See? Just like this.</Toast.Body>
        </Toast>
        <Toast show={show3}>
            <Toast.Header closeButton={false}>
                <img src={ALLImages('logo7')} className="rounded me-2" alt="" />
                <strong className="me-auto text-dark">Spruha</strong>
                <small className="text-muted">2 seconds ago</small>
                <button type="button" className="btn-close" onClick={() => setShow3(!show3)}></button>
            </Toast.Header>
            <Toast.Body>Heads up, toasts will stack automatically</Toast.Body>
        </Toast>
    </ToastContainer>
        </Card.Body>
                `}
                            </code></pre>
                        </div>
                    </Card>
                </Col>
                <Col xl={4}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Translucent
                            </div>
                            <div className="prism-toggle">
                                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(7)}>Show Code<i className={`${isHidden[7] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                            </div>
                        </Card.Header>
                        <Card.Body className={`${isHidden[7] ? 'd-none' : ''}`}>
                            <Toast show={show4}>
                                <Toast.Header closeButton={false}>
                                    <img src={ALLImages('logo7')} className="rounded me-2" alt="" />
                                    <strong className="me-auto text-dark">Spruha</strong>
                                    <small className="text-muted">11 mins ago</small>
                                    <button type="button" className="btn-close" onClick={() => setShow4(!show4)}></button>
                                </Toast.Header>
                                <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
                            </Toast>
                        </Card.Body>
                        <div className={`${isHidden[7] ? '' : 'd-none'} card-footer border-top-0 `}>
                            <pre><code className='language-javascript'>
                                {`
        <Card.Body>
        <Toast show={show4}>
                                <Toast.Header closeButton={false}>
                                    <img src={ALLImages('logo7')} className="rounded me-2" alt="" />
                                    <strong className="me-auto text-dark">Spruha</strong>
                                    <small className="text-muted">11 mins ago</small>
                                    <button type="button" className="btn-close" onClick={() => setShow4(!show4)}></button>
                                </Toast.Header>
                                <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
                            </Toast>
        </Card.Body>
                `}
                            </code></pre>
                        </div>
                    </Card>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className="card-title">
                                Custom content
                            </div>
                            <div className="prism-toggle">
                                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(8)}>Show Code<i className={`${isHidden[8] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                            </div>
                        </Card.Header>
                        <Card.Body className={`${isHidden[8] ? 'd-none' : ''}`}>
                            <Toast show={show5} className='d-flex fade mb-3'>
                                <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
                                <Button className="btn-close me-2 m-auto" variant='' onClick={() => setShow5(!show5)}> </Button>
                            </Toast>
                            <div className="my-2"> <span className="text-muted"> Alternatively, you can also add additional controls and components to toasts. </span> </div>
                            <Toast show={show6}>
                                <Toast.Body>Hello, world! This is a toast message.
                                    <div className="mt-2 pt-2 border-top">
                                        <Button size='sm' className="btn-wave me-2">Take action</Button>
                                        <Button size='sm' variant='secondary' className="btn-wave" onClick={() => setShow6(!show6)}>Close</Button>
                                    </div>
                                </Toast.Body>
                            </Toast>
                        </Card.Body>
                        <div className={`${isHidden[8] ? '' : 'd-none'} card-footer border-top-0 `}>
                            <pre><code className='language-javascript'>
                                {`
        <Card.Body>
        <Toast show={show5} className='d-flex fade mb-3'>
                                <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
                                <Button className="btn-close me-2 m-auto" variant='' onClick={() => setShow5(!show5)}> </Button>
                            </Toast>
                            <div className="my-2"> <span className="text-muted"> Alternatively, you can also add additional controls and components to toasts. </span> </div>
                            <Toast show={show6}>
                                <Toast.Body>Hello, world! This is a toast message.
                                    <div className="mt-2 pt-2 border-top">
                                        <Button size='sm' className="btn-wave me-2">Take action</Button>
                                        <Button size='sm' variant='secondary' className="btn-wave" onClick={() => setShow6(!show6)}>Close</Button>
                                    </div>
                                </Toast.Body>
                            </Toast>
        </Card.Body>
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
                                Aligning Toast Using Flexbox
                            </div>
                            <div className="prism-toggle">
                                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(9)}>Show Code<i className={`${isHidden[9] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                            </div>
                        </Card.Header>
                        <Card.Body className={`${isHidden[9] ? 'd-none' : ''}`}>
                            <div className="bd-example bg-light bd-example-toasts d-flex p-0 px-1">
                                <div aria-live="polite" aria-atomic="true"
                                    className="d-flex justify-content-center align-items-center w-100">
                                    <Toast show={show7} className="shadow-lg fade">
                                        <Toast.Header className='text-default' closeButton={false}>
                                            <img src={ALLImages('logo7')} className="rounded me-2" alt="" />
                                            <strong className="me-auto">Spruha</strong>
                                            <small className="text-muted">11 mins ago</small>
                                            <button type="button" className="btn-close" onClick={() => setShow7(!show7)}></button>
                                        </Toast.Header>
                                        <Toast.Body> Hello, world! This is a toast message.</Toast.Body>
                                    </Toast>
                                </div>
                            </div>
                        </Card.Body>
                        <div className={`${isHidden[9] ? '' : 'd-none'} card-footer border-top-0 `}>
                            <pre><code className='language-javascript'>
                                {`
        <Card.Body>
        <div className="bd-example bg-light bd-example-toasts d-flex p-0 px-1">
                                <div aria-live="polite" aria-atomic="true"
                                    className="d-flex justify-content-center align-items-center w-100">
                                    <Toast show={show7} className="shadow-lg fade">
                                        <Toast.Header className='text-default' closeButton={false}>
                                            <img src={ALLImages('logo7')} className="rounded me-2" alt="" />
                                            <strong className="me-auto">Spruha</strong>
                                            <small className="text-muted">11 mins ago</small>
                                            <button type="button" className="btn-close" onClick={() => setShow7(!show7)}></button>
                                        </Toast.Header>
                                        <Toast.Body> Hello, world! This is a toast message.</Toast.Body>
                                    </Toast>
                                </div>
                            </div>
        </Card.Body>
                `}
                            </code></pre>
                        </div>
                    </Card>
                </Col>
            </Row>

        </Fragment>
    )
}

export default Toasts
