import { Fragment, useState } from "react"
import { Alert, Button, Card, Col, Row } from "react-bootstrap"
import { AdditionalContent, AlertCard, AlertwithIcon, AlertwithImage, AlertwithImagesize, ColoredAlert, CustomisedAlertwithIcon, SolidAlert } from "../../common/Comondata";
import { Link } from "react-router-dom";
import Pageheader from "../../layouts/Pageheader";

const Alerts = () => {

  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);

  // ***********************************************************
  const [alerts, setAlerts] = useState([]);

  const handleShowAlert = () => {
    const newAlert = {
      id: new Date().getTime(), // Unique ID for each alert
    };

    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);

    // Automatically remove the alert after 5 seconds
    // setTimeout(() => {
    //   setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== newAlert.id));
    // }, 5000);
  };
  // ****************************************************************

  const [closedAlerts, setClosedAlerts] = useState([]);

  const closeAlert = (id) => {
    if (!closedAlerts.includes(id)) {
      setClosedAlerts((prevClosedAlerts) => [...prevClosedAlerts, id]);
    }
  };
  // ********************************************************************

  const [closedAlerts2, setClosedAlerts2] = useState([]);

  const closeAlert2 = (id) => {
    if (!closedAlerts2.includes(id)) {
      setClosedAlerts2((prevClosedAlerts) => [...prevClosedAlerts, id]);
    }
  };

  // **********************************************************************

  const [closedAlerts3, setClosedAlerts3] = useState([]);

  const closeAlert3 = (id) => {
    if (!closedAlerts3.includes(id)) {
      setClosedAlerts3((prevClosedAlerts) => [...prevClosedAlerts, id]);
    }
  };
  // **************************************************************************

  const [closedAlerts4, setClosedAlerts4] = useState([]);

  const closeAlert4 = (id) => {
    if (!closedAlerts4.includes(id)) {
      setClosedAlerts4((prevClosedAlerts) => [...prevClosedAlerts, id]);
    }
  };

  // ******************************************************************************

  const [visibleAlerts, setVisibleAlerts] = useState(Array(8).fill(true));

  const handleClose2 = (index) => {
    const updatedVisibleAlerts = [...visibleAlerts];
    updatedVisibleAlerts[index] = false;
    setVisibleAlerts(updatedVisibleAlerts);
  };

  // ************************************************************************************

  const [visibleAlerts1, setVisibleAlerts1] = useState(Array(8).fill(true));

  // ************************************************************************************

  const [visibleAlerts2, setVisibleAlerts2] = useState(Array(6).fill(true));

  // ************************************************************************************

  const [visibleAlerts3, setVisibleAlerts3] = useState(Array(4).fill(true));

  // ************************************************************************************

  const [visibleAlerts4, setVisibleAlerts4] = useState(Array(4).fill(true));

  // ************************************************************************************

  const [visibleAlerts5, setVisibleAlerts5] = useState(Array(4).fill(true));

  // ************************************************************************************

  const [visibleAlerts6, setVisibleAlerts6] = useState(Array(4).fill(true));

  // ******************************************************************************

  const [closedAlerts5, setClosedAlerts5] = useState([]);

  const closeAlert5 = (id) => {
    if (!closedAlerts5.includes(id)) {
      setClosedAlerts5((prevClosedAlerts) => [...prevClosedAlerts, id]);
    }
  };

  // ******************************************************************************

  const [closedAlerts6, setClosedAlerts6] = useState([]);

  const closeAlert6 = (id) => {
    if (!closedAlerts6.includes(id)) {
      setClosedAlerts6((prevClosedAlerts) => [...prevClosedAlerts, id]);
    }
  };

  // ******************************************************************************

  const [closedAlerts7, setClosedAlerts7] = useState([]);

  const closeAlert7 = (id) => {
    if (!closedAlerts7.includes(id)) {
      setClosedAlerts7((prevClosedAlerts) => [...prevClosedAlerts, id]);
    }
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
      <Pageheader mainheading='Alerts' parentfolder='Elements' activepage='Alerts' />

      <Row className="row-sm">
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title"> Basic Alert </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(0)}>Show Code<i className={`${isHidden[0] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>
              {show && (<Alert variant='warning' className="alert alert-warning alert-dismissible fade show" role="alert" onClick={handleClose}>
                <strong>Holy guacamole!</strong> You should check in on some of those fields below.
                <Button variant='' type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"><i className="bi bi-x"></i></Button>
              </Alert>)}
            </Card.Body>
            <div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        {show && (<Alert variant='warning' className="alert alert-warning alert-dismissible fade show" role="alert" onClick={handleClose}>
                <strong>Holy guacamole!</strong> You should check in on some of those fields below.
                <Button variant='' type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"><i className="bi bi-x"></i></Button>
              </Alert>)}
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
                Live example
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(1)}>Show Code<i className={`${isHidden[1] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[1] ? 'd-none' : ''}`}>
              {alerts.map((alert) => (
                <Alert key={alert.id} variant="success" className="alert alert-warning alert-dismissible fade show" role="alert">
                  <strong>Holy guacamole!</strong> You should check in on some of those fields below.
                  <Button variant="" type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setAlerts((prevAlerts) => prevAlerts.filter((a) => a.id !== alert.id))}>
                    <i className="bi bi-x"></i>
                  </Button>
                </Alert>
              ))}
              <Button type="button" className='mt-2' onClick={handleShowAlert}> Show live alert </Button>
            </Card.Body>
            <div className={`${isHidden[1] ? '' : 'd-none'} card-footer border-top-0`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        {alerts.map((alert) => (
          <Alert key={alert.id} variant="success" className="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Holy guacamole!</strong> You should check in on some of those fields below.
            <Button variant="" type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setAlerts((prevAlerts) => prevAlerts.filter((a) => a.id !== alert.id))}>
              <i className="bi bi-x"></i>
            </Button>
          </Alert>
        ))}
        <Button type="button" className='mt-2' onClick={handleShowAlert}> Show live alert </Button>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={12}>
          <Row className="row-sm">
            {AlertCard.map((idx) => (
              <Col xxl={3} xl={6} lg={6} md={6} sm={6} key={idx.id}>
                {!closedAlerts.includes(idx.id) && (
                  <Card className="bg-white border-0">
                    <Alert className={`custom-alert1 alert-${idx.color}`}>
                      <button type="button" className="btn-close ms-auto" onClick={() => closeAlert(idx.id)} data-bs-dismiss="alert" aria-label="Close">
                        <i className="bi bi-x"></i>
                      </button>
                      <div className="text-center px-5 pb-0">
                        {idx.icon}
                        <h5>{idx.heading}</h5>
                        <p className="">
                          This alert is created to just show the {
                            idx.id === 1 ? 'related information.' :
                              idx.id === 2 ? 'confirmation message' :
                                idx.id === 3 ? 'warning message' :
                                  idx.id === 4 ? 'danger message' :
                                    ''
                          }
                        </p>
                        {idx.Element}
                      </div>
                    </Alert>
                  </Card>
                )}
              </Col>
            ))}
          </Row>
        </Col>
        <Col xl={12}>
          <Row className="row-sm">
            {ColoredAlert.map((idx) => (
              <Col xl={3} key={idx.id}>
                {!closedAlerts2.includes(idx.id) && (
                  <Card className="custom-card border-0">
                    <Alert variant={idx.color} className={`border border-${idx.color} mb-0 p-2`}>
                      <div className="d-flex align-items-start">
                        <div className="me-2">{idx.icon}</div>
                        <div className={`text-${idx.color} w-100`}>
                          <div className="fw-semibold d-flex justify-content-between">
                            {idx.heading}
                            <button
                              type="button"
                              onClick={() => closeAlert2(idx.id)}
                              className="btn-close p-0"
                              data-bs-dismiss="alert"
                              aria-label="Close"
                            >
                              <i className="bi bi-x"></i>
                            </button>
                          </div>
                          <div className="fs-12 op-8 mb-1">{idx.description}</div>
                          <div className="fs-12">
                            <Link to="#" className={`text-${idx.class} fw-semibold me-2 d-inline-block`}>
                              cancel
                            </Link>
                            <Link to="#" className={`text-${idx.color} fw-semibold`}>
                              open
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Alert>
                  </Card>
                )}
              </Col>
            ))}
          </Row>
        </Col>
        <Col xl={12}>
          <Row className="row-sm">
            {SolidAlert.map((i) => (
              <Col xl={3} key={Math.random()}>
                <Card className="border-0">
                  {!closedAlerts3.includes(i.id) && (
                    <div className={`alert alert-solid-${i.color} border border-${i.color} mb-0 p-2`}>
                      <div className="d-flex align-items-start">
                        <div className="me-2">
                          {i.icon}
                        </div>
                        <div className="text-fixed-white w-100">
                          <div className="fw-semibold d-flex justify-content-between">{i.heading}<button type="button" onClick={() => closeAlert3(i.id)} className="btn-close p-0" data-bs-dismiss="alert" aria-label="Close"><i className="bi bi-x"></i></button></div>
                          <div className="fs-12 op-8 mb-1">{i.description}</div>
                          {i.element}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Additional content
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(2)}>Show Code<i className={`${isHidden[2] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[2] ? 'd-none' : ''}`}>
              <Row className="gy-3">
                {AdditionalContent.map((idx) => (
                  <Col xl={6} key={Math.random()}>
                    {!closedAlerts4.includes(idx.id) && (
                      <div className={`alert alert-${idx.color} overflow-hidden p-0`} role="alert">
                        <div className={`p-3 bg-${idx.color} text-fixed-white d-flex justify-content-between`}>
                          <h6 className="aletr-heading mb-0">Thank you for reporting this.</h6>
                          <button type="button" className="btn-close p-0 text-fixed-white" onClick={() => closeAlert4(idx.id)} data-bs-dismiss="alert" aria-label="Close"><i className="bi bi-x"></i></button>
                        </div>
                        <hr className="my-0" />
                        <div className="p-3">
                          <p className="mb-0">We appreciate you to let us know the bug in the template and for warning us about future consequences <Link to="#" className="fw-semibold text-decoration-underline">Visit for support for queries ?</Link></p>
                        </div>
                      </div>
                    )}
                  </Col>
                ))}
              </Row>
            </Card.Body>
            <div className={`${isHidden[2] ? '' : 'd-none'} card-footer border-top-0`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Row className="gy-3">
                {AdditionalContent.map((idx) => (
                  <Col xl={6} key={Math.random()}>
                    {!closedAlerts4.includes(idx.id) && (
                      <div className={\`alert alert-\${idx.color} overflow-hidden p-0\`} role="alert">
                        <div className={\`p-3 bg-\${idx.color} text-fixed-white d-flex justify-content-between\`}>
                          <h6 className="aletr-heading mb-0">Thank you for reporting this.</h6>
                          <button type="button" className="btn-close p-0 text-fixed-white" onClick={() => \closeAlert4(idx.id)} data-bs-dismiss="alert" aria-label="Close"><i className="bi bi-x"></i></button>
                        </div>
                        <hr className="my-0" />
                        <div className="p-3">
                          <p className="mb-0">We appreciate you to let us know the bug in the template and for warning us about future consequences <Link to="#" className="fw-semibold text-decoration-underline">Visit for support for queries ?</Link></p>
                        </div>
                      </div>
                    )}
                  </Col>
                ))}
              </Row>
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
                Default alerts
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(3)}>Show Code<i className={`${isHidden[3] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[3] ? 'd-none' : ''}`}>
              {['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].map((idx) => (
                <Alert variant={idx} role="alert" key={Math.random()}>
                  A simple {idx} alert—check it out!
                </Alert>
              ))}
            </Card.Body>
            <div className={`${isHidden[3] ? '' : 'd-none'} card-footer border-top-0`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        {['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].map((idx) => (
          <Alert variant={idx} role="alert" key={Math.random()}>
            A simple {idx} alert—check it out!
          </Alert>
        ))}
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
                Links in alerts
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(4)}>Show Code<i className={`${isHidden[4] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[4] ? 'd-none' : ''}`}>
              {['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].map((idx) => (
                <Alert key={Math.random()} variant={idx} role="alert"> A simple {idx} alert with <Alert.Link>an example link</Alert.Link>.Give it a click if you like. </Alert>
              ))}
            </Card.Body>
            <div className={`${isHidden[4] ? '' : 'd-none'} card-footer border-top-0`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        
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
                Solid Colored Alerts
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(5)}>Show Code<i className={`${isHidden[5] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[5] ? 'd-none' : ''}`}>
              {['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].map((idx, index) => (
                visibleAlerts[index] && (
                  <Alert key={index} className={`alert-solid-${idx} alert-dismissible fade show ${idx === 'dark' ? 'text-white' : ''}`}>
                    A simple solid primary alert—check it out!
                    <button type="button" className={`btn-close ${idx === 'dark' ? 'text-white' : ''} ${idx === 'light' ? 'text-dark' : ''}`} onClick={() => { handleClose2(index); }} data-bs-dismiss="alert" aria-label="Close"><i className="bi bi-x"></i></button>
                  </Alert>
                )
              ))}
            </Card.Body>
            <div className={`${isHidden[5] ? '' : 'd-none'} card-footer border-top-0`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        {['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].map((idx, index) => (
          visibleAlerts[index] && (
            <Alert key={index} className={\`alert-solid-\${idx} alert-dismissible fade show \${idx === 'dark' ? 'text-white' : ''}\`}>
              A simple solid primary alert—check it out!
              <button type="button" className={\`btn-close \${idx === 'dark' ? 'text-white' : ''} \${idx === 'light' ? 'text-dark' : ''}\`} onClick={() => {handleClose2(index); }} data-bs-dismiss="alert" aria-label="Close"><i className="bi bi-x"></i></button>
            </Alert>
          )
        ))}
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
                Outline Alerts
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(6)}>Show Code<i className={`${isHidden[6] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[6] ? 'd-none' : ''}`}>
              {['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].map((idx, index) => (
                visibleAlerts1[index] ? (
                  <div key={index} className={`alert alert-outline-${idx} alert-dismissible fade show`}>
                    A simple outline {idx} alert—check it out!
                    <button type="button" className="btn-close" onClick={() => setVisibleAlerts1([...visibleAlerts1.slice(0, index), false, ...visibleAlerts1.slice(index + 1)])} data-bs-dismiss="alert" aria-label="Close"><i className="bi bi-x"></i></button>
                  </div>
                ) : null
              ))}
            </Card.Body>
            <div className={`${isHidden[6] ? '' : 'd-none'} card-footer border-top-0`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        {['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].map((idx, index) => (
          visibleAlerts1[index] ? (
            <div key={index} className={\`alert alert-outline-\${idx} alert-dismissible fade show\`}>
              A simple outline {idx} alert—check it out!
              <button type="button" className="btn-close" onClick={() => setVisibleAlerts1([...visibleAlerts1.slice(0, index), false, ...visibleAlerts1.slice(index + 1)])} data-bs-dismiss="alert" aria-label="Close"><i className="bi bi-x"></i></button>
            </div>
          ) : null
        ))}
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
                Solid Alerts With Different Shadows
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(7)}>Show Code<i className={`${isHidden[7] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[7] ? 'd-none' : ''}`}>
              {['primary', 'primary', 'primary', 'secondary', 'secondary', 'secondary'].map((idx, index) => (
                visibleAlerts2[index] ? (
                  <div key={index} className={`alert alert-solid-${idx} shadow-sm alert-dismissible fade show`}>
                    A simple solid {idx} alert with {index % 3 === 0 ? 'small' : index % 3 === 1 ? 'normal' : 'large'} shadow—check it out!
                    <button type="button" className="btn-close" onClick={() => setVisibleAlerts2([...visibleAlerts2.slice(0, index), false, ...visibleAlerts2.slice(index + 1)])} data-bs-dismiss="alert" aria-label="Close"><i className="bi bi-x"></i></button>
                  </div>
                ) : null
              ))}
            </Card.Body>
            <div className={`${isHidden[7] ? '' : 'd-none'} card-footer border-top-0`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        {['primary', 'primary', 'primary', 'secondary', 'secondary', 'secondary'].map((idx, index) => (
          visibleAlerts2[index] ? (
            <div key={index} className={\`alert alert-solid-\${idx} shadow-sm alert-dismissible fade show\`}>
              A simple solid {idx} alert with {index % 3 === 0 ? 'small' : index % 3 === 1 ? 'normal' : 'large'} shadow—check it out!
              <button type="button" className="btn-close" onClick={() => setVisibleAlerts2([...visibleAlerts2.slice(0, index), false, ...visibleAlerts2.slice(index + 1)])} data-bs-dismiss="alert" aria-label="Close"><i className="bi bi-x"></i></button>
            </div>
          ) : null
        ))}
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
                Default Alerts With Different Shadows
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(8)}>Show Code<i className={`${isHidden[8] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[8] ? 'd-none' : ''}`}>
              <Alert variant="primary" className="shadow-sm">A simple primary alert with small shadow—check it out!</Alert>
              <Alert variant="primary" className="shadow">A simple primary alert with normal shadow—check it out!</Alert>
              <Alert variant="primary" className="shadow-lg">A simple primary alert with large shadow—check it out!</Alert>
              <Alert variant="secondary" className="shadow-sm">A simple secondary alert with small shadow—check it out!</Alert>
              <Alert variant="secondary" className="shadow">A simple secondary alert with normal shadow—check it out!</Alert>
              <Alert variant="secondary" className="shadow-lg">A simple secondary alert with large shadow—check it out!</Alert>
            </Card.Body>
            <div className={`${isHidden[8] ? '' : 'd-none'} card-footer border-top-0`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Alert variant="primary" className="shadow-sm">A simple primary alert with small shadow—check it out!</Alert>
              <Alert variant="primary" className="shadow">A simple primary alert with normal shadow—check it out!</Alert>
              <Alert variant="primary" className="shadow-lg">A simple primary alert with large shadow—check it out!</Alert>
              <Alert variant="secondary" className="shadow-sm">A simple secondary alert with small shadow—check it out!</Alert>
              <Alert variant="secondary" className="shadow">A simple secondary alert with normal shadow—check it out!</Alert>
              <Alert variant="secondary" className="shadow-lg">A simple secondary alert with large shadow—check it out!</Alert>
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
                Rounded Solid Alerts
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(9)}>Show Code<i className={`${isHidden[9] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[9] ? 'd-none' : ''}`}>
              {['primary', 'secondary', 'warning', 'danger'].map((idx, index) => (
                visibleAlerts3[index] ? (
                  <div key={index} className={`alert alert-solid-${idx} rounded-pill alert-dismissible fade show`}>
                    A simple solid rounded {idx} alert—check it out!
                    <button type="button" className="btn-close" onClick={() => setVisibleAlerts3([...visibleAlerts3.slice(0, index), false, ...visibleAlerts3.slice(index + 1)])} data-bs-dismiss="alert" aria-label="Close"><i className="bi bi-x"></i></button>
                  </div>
                ) : null
              ))}
            </Card.Body>
            <div className={`${isHidden[9] ? '' : 'd-none'} card-footer border-top-0`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        {['primary', 'secondary', 'warning', 'danger'].map((idx, index) => (
          visibleAlerts3[index] ? (
            <div key={index} className={\`alert alert-solid-\${idx} rounded-pill alert-dismissible fade show\`}>
              A simple solid rounded {idx} alert—check it out!
              <button type="button" className="btn-close" onClick={() => setVisibleAlerts3([...visibleAlerts3.slice(0, index), false, ...visibleAlerts3.slice(index + 1)])} data-bs-dismiss="alert" aria-label="Close"><i className="bi bi-x"></i></button>
            </div>
          ) : null
        ))}
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
                Rounded Outline Alerts
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(10)}>Show Code<i className={`${isHidden[10] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[10] ? 'd-none' : ''}`}>
              {['primary', 'secondary', 'warning', 'danger'].map((idx, index) => (
                visibleAlerts4[index] ? (
                  <div key={index} className={`alert alert-outline-${idx} rounded-pill alert-dismissible fade show`}>
                    A simple outline rounded {idx} alert—check it out!
                    <button type="button" className="btn-close" onClick={() => setVisibleAlerts4([...visibleAlerts4.slice(0, index), false, ...visibleAlerts4.slice(index + 1)])} data-bs-dismiss="alert" aria-label="Close"><i className="bi bi-x"></i></button>
                  </div>
                ) : null
              ))}

            </Card.Body>
            <div className={`${isHidden[10] ? '' : 'd-none'} card-footer border-top-0`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        {['primary', 'secondary', 'warning', 'danger'].map((idx, index) => (
          visibleAlerts4[index] ? (
            <div key={index} className={\`alert alert-outline-\${idx} rounded-pill alert-dismissible fade show\`}>
              A simple outline rounded {idx} alert—check it out!
              <button type="button" className="btn-close" onClick={() => setVisibleAlerts4([...visibleAlerts4.slice(0, index), false, ...visibleAlerts4.slice(index + 1)])} data-bs-dismiss="alert" aria-label="Close"><i className="bi bi-x"></i></button>
            </div>
          ) : null
        ))}
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
                Rounded Default Alerts
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(11)}>Show Code<i className={`${isHidden[11] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[11] ? 'd-none' : ''}`}>
              {['primary', 'secondary', 'warning', 'danger'].map((idx, index) => (
                visibleAlerts5[index] ? (
                  <div key={index} className={`alert alert-${idx} rounded-pill alert-dismissible fade show`}>
                    A simple rounded {idx} alert—check it out!
                    <button type="button" className="btn-close" onClick={() => setVisibleAlerts5([...visibleAlerts5.slice(0, index), false, ...visibleAlerts5.slice(index + 1)])} data-bs-dismiss="alert" aria-label="Close"><i className="bi bi-x"></i></button>
                  </div>
                ) : null
              ))}
            </Card.Body>
            <div className={`${isHidden[11] ? '' : 'd-none'} card-footer border-top-0`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        {['primary', 'secondary', 'warning', 'danger'].map((idx, index) => (
          visibleAlerts5[index] ? (
            <div key={index} className={\`alert alert-\${idx} rounded-pill alert-dismissible fade show\`}>
              A simple rounded {idx} alert—check it out!
              <button type="button" className="btn-close" onClick={() => setVisibleAlerts5([...visibleAlerts5.slice(0, index), false, ...visibleAlerts5.slice(index + 1)])} data-bs-dismiss="alert" aria-label="Close"><i className="bi bi-x"></i></button>
            </div>
          ) : null
        ))}
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
                Rounded Alerts With Custom Close Button
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(12)}>Show Code<i className={`${isHidden[12] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[12] ? 'd-none' : ''} rounded-alert`}>
              {['primary', 'secondary', 'warning', 'danger'].map((idx, index) => (
                visibleAlerts6[index] ? (
                  <div key={index} className={`alert alert-${idx} rounded-pill alert-dismissible fade show`}>
                    A simple rounded {idx} alert—check it out!
                    <button type="button" className="btn-close custom-close" onClick={() => setVisibleAlerts6([...visibleAlerts6.slice(0, index), false, ...visibleAlerts6.slice(index + 1)])} data-bs-dismiss="alert" aria-label="Close"><i className="bi bi-x"></i></button>
                  </div>
                ) : null
              ))}
            </Card.Body>
            <div className={`${isHidden[12] ? '' : 'd-none'} card-footer border-top-0`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        {['primary', 'secondary', 'warning', 'danger'].map((idx, index) => (
          visibleAlerts6[index] ? (
            <div key={index} className={\`alert alert-\${idx} rounded-pill alert-dismissible fade show\`}>
              A simple rounded {idx} alert—check it out!
              <button type="button" className="btn-close custom-close" onClick={() => setVisibleAlerts6([...visibleAlerts6.slice(0, index), false, ...visibleAlerts6.slice(index + 1)])} data-bs-dismiss="alert" aria-label="Close"><i className="bi bi-x"></i></button>
            </div>
          ) : null
        ))}
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
                Alerts with icons
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(13)}>Show Code<i className={`${isHidden[13] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[13] ? 'd-none' : ''}`}>
              {AlertwithIcon.map((idx) => (
                <div key={Math.random()} className={`alert alert-${idx.color} d-flex align-items-center" role="alert`}>
                  {idx.icon}
                  <div> An example {idx.color} alert with an icon </div>
                </div>
              ))}
            </Card.Body>
            <div className={`${isHidden[13] ? '' : 'd-none'} card-footer border-top-0`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        {AlertwithIcon.map((idx) => (
          <div key={Math.random()} className={\`alert alert-\${idx.color} d-flex align-items-center" role="alert\`}>
            {idx.icon}
            <div> An example {idx.color} alert with an icon </div>
          </div>
        ))}
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
                Customized Alerts With SVG's
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(14)}>Show Code<i className={`${isHidden[14] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[14] ? 'd-none' : ''}`}>
              {CustomisedAlertwithIcon.map((idx) => (
                !closedAlerts5.includes(idx.id) && (
                  <div key={Math.random()} className={`alert alert-${idx.color} alert-dismissible fade show custom-alert-icon shadow-sm`} role="alert">
                    {idx.icon}
                    A customized primary alert with an icon
                    <button type="button" className="btn-close" data-bs-dismiss="alert" onClick={() => closeAlert5(idx.id)} aria-label="Close"><i className="bi bi-x"></i></button>
                  </div>
                )
              ))}
            </Card.Body>
            <div className={`${isHidden[14] ? '' : 'd-none'} card-footer border-top-0`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        {CustomisedAlertwithIcon.map((idx) => (
          !closedAlerts5.includes(idx.id) && (
            <div key={Math.random()} className={\`alert alert-\${idx.color} alert-dismissible fade show custom-alert-icon shadow-sm\`} role="alert">
              {idx.icon}
              A customized primary alert with an icon
              <button type="button" className="btn-close" data-bs-dismiss="alert" onClick={() => closeAlert5(idx.id)} aria-label="Close"><i className="bi bi-x"></i></button>
            </div>
          )
        ))}
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
                Alerts With Images
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(15)}>Show Code<i className={`${isHidden[15] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[15] ? 'd-none' : ''}`}>
              {AlertwithImage.map((idx) => (
                !closedAlerts6.includes(idx.id) && (
                  <div key={Math.random()} className={`alert alert-img alert-${idx.color} alert-dismissible fase show rounded-pill flex-wrap`} role="alert">
                    <div className="avatar avatar-sm me-3 avatar-rounded">
                      <img src={idx.image} alt="img" />
                    </div>
                    <div className="text-truncate">A simple {idx.color} alert with image—check it out!</div>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" onClick={() => closeAlert6(idx.id)} aria-label="Close"><i className="bi bi-x"></i></button>
                  </div>
                )
              ))}
            </Card.Body>
            <div className={`${isHidden[15] ? '' : 'd-none'} card-footer border-top-0`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        {AlertwithImage.map((idx) => (
          !closedAlerts6.includes(idx.id) && (
            <div key={Math.random()} className={\`alert alert-img alert-\${idx.color} alert-dismissible fase show rounded-pill flex-wrap\`} role="alert">
              <div className="avatar avatar-sm me-3 avatar-rounded">
                <img src={idx.image} alt="img" />
              </div>
              <div className="text-truncate">A simple {idx.color} alert with image—check it out!</div>
              <button type="button" className="btn-close" data-bs-dismiss="alert" onClick={() => closeAlert6(idx.id)} aria-label="Close"><i className="bi bi-x"></i></button>
            </div>
          )
        ))}
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
                Alerts With Different size Images
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(16)}>Show Code<i className={`${isHidden[16] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[16] ? 'd-none' : ''}`}>
              {AlertwithImagesize.map((idx) => (
                !closedAlerts7.includes(idx.id) && (
                  <div key={Math.random()} className={`alert alert-img alert-${idx.color} alert-dismissible fase show flex-wrap`} role="alert">
                    <div className={`avatar avatar-${idx.size} me-3`}>
                      <img src={idx.image} alt="img" />
                    </div>
                    <div>A simple {idx.color} alert with image—check it out!</div>
                    <button type="button" className="btn-close" onClick={() => closeAlert7(idx.id)} data-bs-dismiss="alert" aria-label="Close"><i className="bi bi-x"></i></button>
                  </div>
                )
              ))}
            </Card.Body>
            <div className={`${isHidden[16] ? '' : 'd-none'} card-footer border-top-0`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        {AlertwithImagesize.map((idx) => (
          !closedAlerts7.includes(idx.id) && (
            <div key={Math.random()} className={\`alert alert-img alert-\${idx.color} alert-dismissible fase show flex-wrap\`} role="alert">
              <div className={\`avatar avatar-\${idx.size} me-3\`}>
                <img src={idx.image} alt="img" />
              </div>
              <div>A simple {idx.color} alert with image—check it out!</div>
              <button type="button" className="btn-close" onClick={() => closeAlert7(idx.id)} data-bs-dismiss="alert" aria-label="Close"><i className="bi bi-x"></i></button>
            </div>
          )
        ))}
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

export default Alerts
