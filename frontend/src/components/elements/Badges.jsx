import { Fragment, useState } from "react"
import { Badge, Button, Card, Col, Row } from "react-bootstrap"
import Pageheader from "../../layouts/Pageheader"
import ALLImages from "../../common/Imagedata"


const Badges = () => {

  //showcode

  const [isHidden, setIsHidden] = useState([false]);
  const toggleHidden = (index) => {
    const updatedHidden = [...isHidden];
    updatedHidden[index] = !updatedHidden[index];
    setIsHidden(updatedHidden);
  };

  return (
    <Fragment>
      <Pageheader mainheading='Badges' parentfolder='Elements' activepage='Badges' />

      <Row className="row-sm">
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Outline Badges
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(0)}>Show Code<i className={`${isHidden[0] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[0] ? 'd-none' : ''} d-flex flex-wrap gap-2`}>
              <Badge bg='outline-primary' >Primary</Badge>
              <Badge bg='outline-secondary'>Secondary</Badge>
              <Badge bg='outline-success'>Success</Badge>
              <Badge bg='outline-danger'>Danger</Badge>
              <Badge bg='outline-warning'>Warning</Badge>
              <Badge bg='outline-info'>Info</Badge>
              <Badge bg='outline-light'>Light</Badge>
              <Badge bg='outline-dark'>Dark</Badge>
            </Card.Body>
            <div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Badge bg='outline-primary' >Primary</Badge>
              <Badge bg='outline-secondary'>Secondary</Badge>
              <Badge bg='outline-success'>Success</Badge>
              <Badge bg='outline-danger'>Danger</Badge>
              <Badge bg='outline-warning'>Warning</Badge>
              <Badge bg='outline-info'>Info</Badge>
              <Badge bg='outline-light'>Light</Badge>
              <Badge bg='outline-dark'>Dark</Badge>
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
                Outline Pill Badges
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(1)}>Show Code<i className={`${isHidden[1] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[1] ? 'd-none' : ''} d-flex flex-wrap gap-2`}>
              <Badge bg='outline-primary' className="rounded-pill">Primary</Badge>
              <Badge bg='outline-secondary' className="rounded-pill">Secondary</Badge>
              <Badge bg='outline-success' className="rounded-pill">Success</Badge>
              <Badge bg='outline-danger' className="rounded-pill">Danger</Badge>
              <Badge bg='outline-warning' className="rounded-pill">Warning</Badge>
              <Badge bg='outline-info' className="rounded-pill">Info</Badge>
              <Badge bg='outline-light' className="rounded-pill text-dark">Light</Badge>
              <Badge bg='outline-dark' className="rounded-pill">Dark</Badge>
            </Card.Body>
            <div className={`${isHidden[1] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Badge bg='outline-primary' className="rounded-pill">Primary</Badge>
        <Badge bg='outline-secondary' className="rounded-pill">Secondary</Badge>
        <Badge bg='outline-success' className="rounded-pill">Success</Badge>
        <Badge bg='outline-danger' className="rounded-pill">Danger</Badge>
        <Badge bg='outline-warning' className="rounded-pill">Warning</Badge>
        <Badge bg='outline-info' className="rounded-pill">Info</Badge>
        <Badge bg='outline-light' className="rounded-pill text-dark">Light</Badge>
        <Badge bg='outline-dark' className="rounded-pill">Dark</Badge>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Light Badges
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(2)}>Show Code<i className={`${isHidden[2] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[2] ? 'd-none' : ''} d-flex flex-wrap gap-2`}>
              <Badge bg="primary-transparent">Primary</Badge>
              <Badge bg="secondary-transparent">Secondary</Badge>
              <Badge bg="success-transparent">Success</Badge>
              <Badge bg="danger-transparent">Danger</Badge>
              <Badge bg="warning-transparent">Warning</Badge>
              <Badge bg="info-transparent">Info</Badge>
              <Badge bg="light-transparent text-dark">Light</Badge>
              <Badge bg="dark-transparent">Dark</Badge>
            </Card.Body>
            <div className={`${isHidden[2] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Badge bg="primary-transparent">Primary</Badge>
              <Badge bg="secondary-transparent">Secondary</Badge>
              <Badge bg="success-transparent">Success</Badge>
              <Badge bg="danger-transparent">Danger</Badge>
              <Badge bg="warning-transparent">Warning</Badge>
              <Badge bg="info-transparent">Info</Badge>
              <Badge bg="light-transparent text-dark">Light</Badge>
              <Badge bg="dark-transparent">Dark</Badge>
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
                Light Pill Badges
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(3)}>Show Code<i className={`${isHidden[3] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[3] ? 'd-none' : ''} d-flex flex-wrap gap-2`}>
              <Badge bg='primary-transparent' className="rounded-pill">Primary</Badge>
              <Badge bg='secondary-transparent' className="rounded-pill">Secondary</Badge>
              <Badge bg='success-transparent' className="rounded-pill">Success</Badge>
              <Badge bg='danger-transparent' className="rounded-pill">Danger</Badge>
              <Badge bg='warning-transparent' className="rounded-pill">Warning</Badge>
              <Badge bg='info-transparent' className="rounded-pill">Info</Badge>
              <Badge bg='light-transparent' className="rounded-pill text-dark">Light</Badge>
              <Badge bg='dark-transparent' className="rounded-pill">Dark</Badge>
            </Card.Body>
            <div className={`${isHidden[3] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Badge bg='primary-transparent' className="rounded-pill">Primary</Badge>
              <Badge bg='secondary-transparent' className="rounded-pill">Secondary</Badge>
              <Badge bg='success-transparent' className="rounded-pill">Success</Badge>
              <Badge bg='danger-transparent' className="rounded-pill">Danger</Badge>
              <Badge bg='warning-transparent' className="rounded-pill">Warning</Badge>
              <Badge bg='info-transparent' className="rounded-pill">Info</Badge>
              <Badge bg='light-transparent' className="rounded-pill text-dark">Light</Badge>
              <Badge bg='dark-transparent' className="rounded-pill">Dark</Badge>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Gradient Badges
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(4)}>Show Code<i className={`${isHidden[4] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[4] ? 'd-none' : ''} d-flex flex-wrap gap-2`}>
              <Badge bg="primary-gradient">Primary</Badge>
              <Badge bg="secondary-gradient">Secondary</Badge>
              <Badge bg="success-gradient">Success</Badge>
              <Badge bg="danger-gradient">Danger</Badge>
              <Badge bg="warning-gradient">Warning</Badge>
              <Badge bg="info-gradient">Info</Badge>
              <Badge bg="orange-gradient">orange</Badge>
              <Badge bg="purple-gradient">purple</Badge>
            </Card.Body>
            <div className={`${isHidden[4] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        Badge bg="primary-gradient">Primary</Badge>
        <Badge bg="secondary-gradient">Secondary</Badge>
        <Badge bg="success-gradient">Success</Badge>
        <Badge bg="danger-gradient">Danger</Badge>
        <Badge bg="warning-gradient">Warning</Badge>
        <Badge bg="info-gradient">Info</Badge>
        <Badge bg="orange-gradient">orange</Badge>
        <Badge bg="purple-gradient">purple</Badge>
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
                Gradient Pill Badges
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(5)}>Show Code<i className={`${isHidden[5] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[5] ? 'd-none' : ''} d-flex flex-wrap gap-2`}>
              <Badge bg='primary-gradient' className="rounded-pill">Primary</Badge>
              <Badge bg='secondary-gradient' className="rounded-pill">Secondary</Badge>
              <Badge bg='success-gradient' className="rounded-pill">Success</Badge>
              <Badge bg='danger-gradient' className="rounded-pill">Danger</Badge>
              <Badge bg='warning-gradient' className="rounded-pill">Warning</Badge>
              <Badge bg='info-gradient' className="rounded-pill">Info</Badge>
              <Badge bg='orange-gradient' className="rounded-pill">orange</Badge>
              <Badge bg='purple-gradient' className="rounded-pill">purple</Badge>
            </Card.Body>
            <div className={`${isHidden[5] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Badge bg='primary-gradient' className="rounded-pill">Primary</Badge>
              <Badge bg='secondary-gradient' className="rounded-pill">Secondary</Badge>
              <Badge bg='success-gradient' className="rounded-pill">Success</Badge>
              <Badge bg='danger-gradient' className="rounded-pill">Danger</Badge>
              <Badge bg='warning-gradient' className="rounded-pill">Warning</Badge>
              <Badge bg='info-gradient' className="rounded-pill">Info</Badge>
              <Badge bg='orange-gradient' className="rounded-pill">orange</Badge>
              <Badge bg='purple-gradient' className="rounded-pill">purple</Badge>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>


      <Row className="row-sm">
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Badges
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(6)}>Show Code<i className={`${isHidden[6] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[6] ? 'd-none' : ''} d-flex flex-wrap gap-2`}>
              <Badge bg="primary">Primary</Badge>
              <Badge bg="secondary">Secondary</Badge>
              <Badge bg="success">Success</Badge>
              <Badge bg="danger">Danger</Badge>
              <Badge bg="warning">Warning</Badge>
              <Badge bg="info">Info</Badge>
              <Badge bg="light text-dark">Light</Badge>
              <Badge bg="dark text-white">Dark</Badge>
            </Card.Body>
            <div className={`${isHidden[6] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Badge bg="primary">Primary</Badge>
        <Badge bg="secondary">Secondary</Badge>
        <Badge bg="success">Success</Badge>
        <Badge bg="danger">Danger</Badge>
        <Badge bg="warning">Warning</Badge>
        <Badge bg="info">Info</Badge>
        <Badge bg="light text-dark">Light</Badge>
        <Badge bg="dark text-white">Dark</Badge>
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
                Pill badges
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(6)}>Show Code<i className={`${isHidden[6] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[6] ? 'd-none' : ''} d-flex flex-wrap gap-2`}>
              <Badge bg='primary' className="rounded-pill">Primary</Badge>
              <Badge bg='secondary' className="rounded-pill">Secondary</Badge>
              <Badge bg='success' className="rounded-pill">Success</Badge>
              <Badge bg='danger' className="rounded-pill">Danger</Badge>
              <Badge bg='warning' className="rounded-pill">Warning</Badge>
              <Badge bg='info' className="rounded-pill">Info</Badge>
              <Badge bg='light' className="rounded-pill text-dark">Light</Badge>
              <Badge bg='dark ' className="rounded-pill text-white">Dark</Badge>
            </Card.Body>
            <div className={`${isHidden[6] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Badge bg='primary' className="rounded-pill">Primary</Badge>
              <Badge bg='secondary' className="rounded-pill">Secondary</Badge>
              <Badge bg='success' className="rounded-pill">Success</Badge>
              <Badge bg='danger' className="rounded-pill">Danger</Badge>
              <Badge bg='warning' className="rounded-pill">Warning</Badge>
              <Badge bg='info' className="rounded-pill">Info</Badge>
              <Badge bg='light' className="rounded-pill text-dark">Light</Badge>
              <Badge bg='dark ' className="rounded-pill text-white">Dark</Badge>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Buttons With Badges
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(7)}>Show Code<i className={`${isHidden[7] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[7] ? 'd-none' : ''} d-flex flex-wrap gap-2`}>
              <Button className="my-1 me-2">
                Notifications <Badge bg='secondary' className="ms-2">4</Badge>
              </Button>
              <Button variant="secondary" className="my-1 me-2">
                Notifications <Badge bg='primary' className="ms-2">7</Badge>
              </Button>
              <Button variant="success" className="my-1 me-2">
                Notifications <Badge bg='danger' className="ms-2">12</Badge>
              </Button>
              <Button variant="info" className="my-1 me-2">
                Notifications <Badge bg='warning' className="ms-2">32</Badge>
              </Button>
            </Card.Body>
            <div className={`${isHidden[7] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Button className="my-1 me-2">
                Notifications <Badge bg='secondary' className="ms-2">4</Badge>
              </Button>
              <Button variant="secondary" className="my-1 me-2">
                Notifications <Badge bg='primary' className="ms-2">7</Badge>
              </Button>
              <Button variant="success" className="my-1 me-2">
                Notifications <Badge bg='danger' className="ms-2">12</Badge>
              </Button>
              <Button variant="info" className="my-1 me-2">
                Notifications <Badge bg='warning' className="ms-2">32</Badge>
              </Button>
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
                Outline Button Badges
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(8)}>Show Code<i className={`${isHidden[8] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[8] ? 'd-none' : ''} d-flex flex-wrap gap-2`}>
              <Button variant="outline-primary" className="my-1 me-2">
                Notifications <Badge bg='primary' className="ms-2">4</Badge>
              </Button>
              <Button variant="outline-secondary" className="my-1 me-2">
                Notifications <Badge bg='secondary' className="ms-2">7</Badge>
              </Button>
              <Button variant="outline-success" className="my-1 me-2">
                Notifications <Badge bg='success' className="ms-2">12</Badge>
              </Button>
              <Button variant="outline-info" className="my-1 me-2">
                Notifications <Badge bg='info' className="ms-2">32</Badge>
              </Button>
            </Card.Body>
            <div className={`${isHidden[8] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Button variant="outline-primary" className="my-1 me-2">
        Notifications <Badge bg='primary' className="ms-2">4</Badge>
      </Button>
      <Button variant="outline-secondary" className="my-1 me-2">
        Notifications <Badge bg='secondary' className="ms-2">7</Badge>
      </Button>
      <Button variant="outline-success" className="my-1 me-2">
        Notifications <Badge bg='success' className="ms-2">12</Badge>
      </Button>
      <Button variant="outline-info" className="my-1 me-2">
        Notifications <Badge bg='info' className="ms-2">32</Badge>
      </Button>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Headings
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(9)}>Show Code<i className={`${isHidden[9] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[9] ? 'd-none' : ''}`}>
              <h1>Example heading <Badge bg="primary">New</Badge></h1>
              <h2>Example heading <Badge bg="primary">New</Badge></h2>
              <h3>Example heading <Badge bg="primary">New</Badge></h3>
              <h4>Example heading <Badge bg="primary">New</Badge></h4>
              <h5>Example heading <Badge bg="primary">New</Badge></h5>
              <h6>Example heading <Badge bg="primary">New</Badge></h6>
            </Card.Body>
            <div className={`${isHidden[9] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <h1>Example heading <Badge bg="primary">New</Badge></h1>
        <h2>Example heading <Badge bg="primary">New</Badge></h2>
        <h3>Example heading <Badge bg="primary">New</Badge></h3>
        <h4>Example heading <Badge bg="primary">New</Badge></h4>
        <h5>Example heading <Badge bg="primary">New</Badge></h5>
        <h6>Example heading <Badge bg="primary">New</Badge></h6>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={6}>
          <Row className="row-sm">
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header className="justify-content-between">
                  <div className="card-title">Positioned Badges</div>
                  <div className="prism-toggle">
                    <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(10)}>Show Code<i className={`${isHidden[10] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                  </div>
                </Card.Header>
                <Card.Body className={`${isHidden[10] ? 'd-none' : ''} d-flex flex-wrap gap-4`}>
                  <Button className="position-relative">
                    Inbox
                    <Badge bg='danger'
                      className="position-absolute top-0 start-100 translate-middle rounded-pill">
                      99+
                      <span className="visually-hidden">unread messages</span>
                    </Badge>
                  </Button>
                  <Button className="btn btn-secondary position-relative">
                    Profile
                    <span
                      className="position-absolute top-0 start-100 translate-middle p-2 bg-success border border-light rounded-circle">
                      <span className="visually-hidden">New alerts</span>
                    </span>
                  </Button>
                  <span className="avatar">
                    <img src={ALLImages('face2')} alt="img" />
                    <span
                      className="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle">
                      <span className="visually-hidden">New alerts</span>
                    </span>
                  </span>
                  <span className="avatar avatar-rounded">
                    <img src={ALLImages('face15')} alt="img" />
                    <span className="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle">
                      <span className="visually-hidden">New alerts</span>
                    </span>
                  </span>
                  <span className="avatar avatar-rounded">
                    <img src={ALLImages('face10')} alt="img" />
                    <span className="position-absolute top-0 start-100 translate-middle badge bg-secondary rounded-pill shadow-lg">1000+
                      <span className="visually-hidden">New alerts</span>
                    </span>
                  </span>
                </Card.Body>
                <div className={`${isHidden[10] ? '' : 'd-none'} card-footer border-top-0 `}>
                  <pre><code className='language-javascript'>
                    {`
        <Card.Body>
        <Button className="position-relative">
                    Inbox
                    <Badge bg='danger'
                      className="position-absolute top-0 start-100 translate-middle rounded-pill">
                      99+
                      <span className="visually-hidden">unread messages</span>
                    </Badge>
                  </Button>
                  <Button className="btn btn-secondary position-relative">
                    Profile
                    <span
                      className="position-absolute top-0 start-100 translate-middle p-2 bg-success border border-light rounded-circle">
                      <span className="visually-hidden">New alerts</span>
                    </span>
                  </Button>
                  <span className="avatar">
                    <img src={ALLImages('face2')} alt="img" />
                    <span
                      className="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle">
                      <span className="visually-hidden">New alerts</span>
                    </span>
                  </span>
                  <span className="avatar avatar-rounded">
                    <img src={ALLImages('face15')} alt="img" />
                    <span className="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle">
                      <span className="visually-hidden">New alerts</span>
                    </span>
                  </span>
                  <span className="avatar avatar-rounded">
                    <img src={ALLImages('face10')} alt="img" />
                    <span className="position-absolute top-0 start-100 translate-middle badge bg-secondary rounded-pill shadow-lg">1000+
                      <span className="visually-hidden">New alerts</span>
                    </span>
                  </span>
        </Card.Body>
                `}
                  </code></pre>
                </div>
              </Card>
            </Col>
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header className="justify-content-between">
                  <div className="card-title">Custom Badges</div>
                  <div className="prism-toggle">
                    <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(11)}>Show Code<i className={`${isHidden[11] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                  </div>
                </Card.Header>
                <Card.Body className={`${isHidden[11] ? 'd-none' : ''}`}>
                  <Badge bg='outline-secondary' className="custom-badge fs-15 me-5 m-2"><i className="ti ti-flame me-1"></i>Hot</Badge>
                  <span className="icon-badge me-5 m-2">
                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" /></svg>
                    <Badge bg='success' className="rounded-pill">14</Badge>
                  </span>
                  <Badge bg='light' className="border text-default custom-badge me-5 m-2"><i className="fe fe-eye me-1 d-inline-block"></i>13.2k</Badge>
                  <span className="text-badge me-5 m-2">
                    <span className="text fs-18">Inbox</span>
                    <Badge bg='success' className="rounded-pill">32</Badge>
                  </span>
                </Card.Body>
                <div className={`${isHidden[11] ? '' : 'd-none'} card-footer border-top-0 `}>
                  <pre><code className='language-javascript'>
                    {`
        <Card.Body>
        <Badge bg='outline-secondary' className="custom-badge fs-15 me-5 m-2"><i className="ti ti-flame me-1"></i>Hot</Badge>
        <span className="icon-badge me-5 m-2">
          <svg className="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" /></svg>
          <Badge bg='success' className="rounded-pill">14</Badge>
        </span>
        <Badge bg='light' className="border text-default custom-badge me-5 m-2"><i className="fe fe-eye me-1 d-inline-block"></i>13.2k</Badge>
        <span className="text-badge me-5 m-2">
          <span className="text fs-18">Inbox</span>
          <Badge bg='success' className="rounded-pill">32</Badge>
        </span>
        </Card.Body>
                `}
                  </code></pre>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

    </Fragment>
  )
}

export default Badges;
