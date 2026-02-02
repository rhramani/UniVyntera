import { Fragment, useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Pageheader from '../../layouts/Pageheader'

const Buttons = () => {

  //showcode

  const [isHidden, setIsHidden] = useState([false]);
  const toggleHidden = (index) => {
    const updatedHidden = [...isHidden];
    updatedHidden[index] = !updatedHidden[index];
    setIsHidden(updatedHidden);
  };

  return (
    <Fragment>
      <Pageheader mainheading='Buttons' parentfolder='Elements' activepage='Buttons' />

      <Row className="row-sm">
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Default Buttons
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(0)}>Show Code<i className={`${isHidden[0] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>
              <div className="btn-list">
                <Button variant='primary' className="btn-wave">Primary</Button>
                <Button variant='secondary' className="btn-wave">Secondary</Button>
                <Button variant='success' className="btn-wave">Success</Button>
                <Button variant='danger' className="btn-wave">Danger</Button>
                <Button variant='warning' className="btn-wave">Warning</Button>
                <Button variant='info' className="btn-wave">Info</Button>
                <Button variant='light' className="btn-wave">Light</Button>
                <Button variant='dark' className="btn-wave text-white">Dark</Button>
                <Button variant='link' className="btn-wave">Link</Button>
              </div>
            </Card.Body>
            <div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
                <Button variant='primary' className="btn-wave">Primary</Button>
                <Button variant='secondary' className="btn-wave">Secondary</Button>
                <Button variant='success' className="btn-wave">Success</Button>
                <Button variant='danger' className="btn-wave">Danger</Button>
                <Button variant='warning' className="btn-wave">Warning</Button>
                <Button variant='info' className="btn-wave">Info</Button>
                <Button variant='light' className="btn-wave">Light</Button>
                <Button variant='dark' className="btn-wave text-white">Dark</Button>
                <Button variant='link' className="btn-wave">Link</Button>
              </div>
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
                  <div className="card-title">
                    Sizes
                  </div>
                  <div className="prism-toggle">
                    <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(1)}>Show Code<i className={`${isHidden[1] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                  </div>
                </Card.Header>
                <Card.Body className={`${isHidden[1] ? 'd-none' : ''}`}>
                  <div className="btn-list">
                    <Button size='sm' variant='primary' className="btn-wave">Small button</Button>
                    <Button variant='secondary' className="btn-wave">Default button</Button>
                    <Button size='lg' variant='success' className="btn-wave">Large button</Button>
                  </div>
                </Card.Body>
                <div className={`${isHidden[1] ? '' : 'd-none'} card-footer border-top-0 `}>
                  <pre><code className='language-javascript'>
                    {`
        <Card.Body>
        <div className="btn-list">
                    <Button size='sm' variant='primary' className="btn-wave">Small button</Button>
                    <Button variant='secondary' className="btn-wave">Default button</Button>
                    <Button size='lg' variant='success' className="btn-wave">Large button</Button>
                  </div>
        </Card.Body>
                `}
                  </code></pre>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xl={6}>
          <Row className="row-sm">
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header className="justify-content-between">
                  <div className="card-title">
                    Button Widths
                  </div>
                  <div className="prism-toggle">
                    <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(2)}>Show Code<i className={`${isHidden[2] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                  </div>
                </Card.Header>
                <Card.Body className={`${isHidden[2] ? 'd-none' : ''}`}>
                  <div className="btn-list">
                    <Button variant='primary' className="btn-w-xs btn-wave">XS</Button>
                    <Button variant='secondary' className="btn-w-sm btn-wave">SM</Button>
                    <Button variant='warning' className="btn-w-md btn-wave">MD</Button>
                    <Button variant='info' className="btn-w-lg btn-wave">LG</Button>
                  </div>
                </Card.Body>
                <div className={`${isHidden[2] ? '' : 'd-none'} card-footer border-top-0 `}>
                  <pre><code className='language-javascript'>
                    {`
        <Card.Body>
        <div className="btn-list">
                    <Button variant='primary' className="btn-w-xs btn-wave">XS</Button>
                    <Button variant='secondary' className="btn-w-sm btn-wave">SM</Button>
                    <Button variant='warning' className="btn-w-md btn-wave">MD</Button>
                    <Button variant='info' className="btn-w-lg btn-wave">LG</Button>
                  </div>
        </Card.Body>
                `}
                  </code></pre>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Buttons With Different Shadows
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(3)}>Show Code<i className={`${isHidden[3] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[3] ? 'd-none' : ''}`}>
              <div className="btn-list d-flex">
                <div className="me-5">
                  <Button variant='primary' className="shadow-sm btn-wave">Button</Button>
                  <Button variant='primary' className="shadow btn-wave">Button</Button>
                  <Button variant='primary' className="shadow-lg btn-wave">Button</Button>
                </div>
                <div>
                  <Button size='sm' variant='secondary' className="shadow-sm btn-wave">Button</Button>
                  <Button variant='info' className="shadow btn-wave">Button</Button>
                  <Button size='lg' variant='success' className="shadow-lg btn-wave">Button</Button>
                </div>
              </div>
            </Card.Body>
            <div className={`${isHidden[3] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list d-flex">
                <div className="me-5">
                  <Button variant='primary' className="shadow-sm btn-wave">Button</Button>
                  <Button variant='primary' className="shadow btn-wave">Button</Button>
                  <Button variant='primary' className="shadow-lg btn-wave">Button</Button>
                </div>
                <div>
                  <Button size='sm' variant='secondary' className="shadow-sm btn-wave">Button</Button>
                  <Button variant='info' className="shadow btn-wave">Button</Button>
                  <Button size='lg' variant='success' className="shadow-lg btn-wave">Button</Button>
                </div>
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
                Different Colored Buttons With Shadows
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(4)}>Show Code<i className={`${isHidden[4] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[4] ? 'd-none' : ''}`}>
              <div className="btn-list">
                <Button className="shadow-primary btn-wave">Button</Button>
                <Button variant='secondary' className="shadow-secondary btn-wave">Button</Button>
                <Button variant='success' className="shadow-success btn-wave">Button</Button>
                <Button variant='info' className="shadow-info btn-wave">Button</Button>
                <Button variant='warning' className="shadow-warning btn-wave">Button</Button>
                <Button variant='danger' className="shadow-danger btn-wave">Button</Button>
                <Button variant='purple' className="shadow-purple btn-wave">Button</Button>
                <Button variant='orange' className="shadow-orange btn-wave">Button</Button>
              </div>
            </Card.Body>
            <div className={`${isHidden[4] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
        <Button className="shadow-primary btn-wave">Button</Button>
        <Button variant='secondary' className="shadow-secondary btn-wave">Button</Button>
        <Button variant='success' className="shadow-success btn-wave">Button</Button>
        <Button variant='info' className="shadow-info btn-wave">Button</Button>
        <Button variant='warning' className="shadow-warning btn-wave">Button</Button>
        <Button variant='danger' className="shadow-danger btn-wave">Button</Button>
        <Button variant='purple' className="shadow-purple btn-wave">Button</Button>
        <Button variant='orange' className="shadow-orange btn-wave">Button</Button>
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
                Raised Buttons
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(5)}>Show Code<i className={`${isHidden[5] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[5] ? 'd-none' : ''}`}>
              <div className="btn-list">
                <Button variant='primary' className="btn-raised-shadow btn-wave">Button</Button>
                <Button variant='secondary' className="btn-raised-shadow btn-wave">Button</Button>
                <Button variant='success' className="btn-raised-shadow btn-wave">Button</Button>
                <Button variant='info' className="btn-raised-shadow btn-wave">Button</Button>
                <Button variant='warning' className="btn-raised-shadow btn-wave">Button</Button>
                <Button variant='danger' className="btn-raised-shadow btn-wave">Button</Button>
                <Button variant='purple' className="btn-raised-shadow btn-wave">Button</Button>
                <Button variant='orange' className="btn-raised-shadow btn-wave">Button</Button>
              </div>
            </Card.Body>
            <div className={`${isHidden[5] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
                <Button variant='primary' className="btn-raised-shadow btn-wave">Button</Button>
                <Button variant='secondary' className="btn-raised-shadow btn-wave">Button</Button>
                <Button variant='success' className="btn-raised-shadow btn-wave">Button</Button>
                <Button variant='info' className="btn-raised-shadow btn-wave">Button</Button>
                <Button variant='warning' className="btn-raised-shadow btn-wave">Button</Button>
                <Button variant='danger' className="btn-raised-shadow btn-wave">Button</Button>
                <Button variant='purple' className="btn-raised-shadow btn-wave">Button</Button>
                <Button variant='orange' className="btn-raised-shadow btn-wave">Button</Button>
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
                Label Buttons
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(6)}>Show Code<i className={`${isHidden[6] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[6] ? 'd-none' : ''}`}>
              <div className="btn-list">
                <Button variant='primary' className="label-btn label-start"> <i className="ri-chat-smile-line label-btn-icon me-2"></i> Primary </Button>
                <Button variant='secondary' className="label-btn label-start"> <i className="ri-settings-4-line label-btn-icon me-2"></i> Secondary </Button>
                <Button variant='warning' className="label-btn label-start rounded-pill"> <i className="ri-spam-2-line label-btn-icon me-2 rounded-pill"></i> Warning </Button>
                <Button variant='info' className="label-btn label-start rounded-pill"><i className="ri-phone-line label-btn-icon me-2 rounded-pill"></i> Info </Button>
                <Button variant='success' className="label-btn label-end"> <i className="ri-thumb-up-line label-btn-icon ms-2"></i> Success </Button>
                <Button variant='danger' className="label-btn label-end rounded-pill"> Cancel <i className="ri-close-line label-btn-icon ms-2 rounded-pill"></i></Button>
              </div>
            </Card.Body>
            <div className={`${isHidden[6] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
        <Button variant='primary' className="label-btn label-start"> <i className="ri-chat-smile-line label-btn-icon me-2"></i> Primary </Button>
        <Button variant='secondary' className="label-btn label-start"> <i className="ri-settings-4-line label-btn-icon me-2"></i> Secondary </Button>
        <Button variant='warning' className="label-btn label-start rounded-pill"> <i className="ri-spam-2-line label-btn-icon me-2 rounded-pill"></i> Warning </Button>
        <Button variant='info' className="label-btn label-start rounded-pill"><i className="ri-phone-line label-btn-icon me-2 rounded-pill"></i> Info </Button>
        <Button variant='success' className="label-btn label-end"> <i className="ri-thumb-up-line label-btn-icon ms-2"></i> Success </Button>
        <Button variant='danger' className="label-btn label-end rounded-pill"> Cancel <i className="ri-close-line label-btn-icon ms-2 rounded-pill"></i></Button>
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
                Rounded Buttons
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(7)}>Show Code<i className={`${isHidden[7] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[7] ? 'd-none' : ''}`}>
              <div className="btn-list">
                <Button variant='primary' className="rounded-pill btn-wave">Primary</Button>
                <Button variant='secondary' className="rounded-pill btn-wave">Secondary</Button>
                <Button variant='success' className="rounded-pill btn-wave">Success</Button>
                <Button variant='danger' className="rounded-pill btn-wave">Danger</Button>
                <Button variant='warning' className="rounded-pill btn-wave">Warning</Button>
                <Button variant='info' className="rounded-pill btn-wave">Info</Button>
                <Button variant='light' className="rounded-pill btn-wave">Light</Button>
                <Button variant='dark' className="rounded-pill btn-wave text-white">Dark</Button>
                <Button variant='link' className="rounded-pill btn-wave">Link</Button>
              </div>
            </Card.Body>
            <div className={`${isHidden[7] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
                <Button variant='primary' className="rounded-pill btn-wave">Primary</Button>
                <Button variant='secondary' className="rounded-pill btn-wave">Secondary</Button>
                <Button variant='success' className="rounded-pill btn-wave">Success</Button>
                <Button variant='danger' className="rounded-pill btn-wave">Danger</Button>
                <Button variant='warning' className="rounded-pill btn-wave">Warning</Button>
                <Button variant='info' className="rounded-pill btn-wave">Info</Button>
                <Button variant='light' className="rounded-pill btn-wave">Light</Button>
                <Button variant='dark' className="rounded-pill btn-wave text-white">Dark</Button>
                <Button variant='link' className="rounded-pill btn-wave">Link</Button>
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
                Light Buttons
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(8)}>Show Code<i className={`${isHidden[8] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[8] ? 'd-none' : ''}`}>
              <div className="btn-list">
                <Button variant='primary-light' className="btn-wave">Primary</Button>
                <Button variant='secondary-light' className="btn-wave">Secondary</Button>
                <Button variant='success-light' className="btn-wave">Success</Button>
                <Button variant='danger-light' className="btn-wave">Danger</Button>
                <Button variant='warning-light' className="btn-wave">Warning</Button>
                <Button variant='info-light' className="btn-wave">Info</Button>
                <Button variant='purple-light' className="btn-wave">purple</Button>
                <Button variant='teal-light' className="btn-wave">teal</Button>
                <Button variant='orange-light' className="btn-wave">orange</Button>
              </div>
            </Card.Body>
            <div className={`${isHidden[8] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
                <Button variant='primary-light' className="btn-wave">Primary</Button>
                <Button variant='secondary-light' className="btn-wave">Secondary</Button>
                <Button variant='success-light' className="btn-wave">Success</Button>
                <Button variant='danger-light' className="btn-wave">Danger</Button>
                <Button variant='warning-light' className="btn-wave">Warning</Button>
                <Button variant='info-light' className="btn-wave">Info</Button>
                <Button variant='purple-light' className="btn-wave">purple</Button>
                <Button variant='teal-light' className="btn-wave">teal</Button>
                <Button variant='orange-light' className="btn-wave">orange</Button>
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
                Light Rounded Buttons
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(9)}>Show Code<i className={`${isHidden[9] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[9] ? 'd-none' : ''}`}>
              <div className="btn-list">
                <Button variant='primary-light' className="rounded-pill btn-wave">Primary</Button>
                <Button variant='secondary-light' className="rounded-pill btn-wave">Secondary</Button>
                <Button variant='success-light' className="rounded-pill btn-wave">Success</Button>
                <Button variant='danger-light' className="rounded-pill btn-wave">Danger</Button>
                <Button variant='warning-light' className="rounded-pill btn-wave">Warning</Button>
                <Button variant='info-light' className="rounded-pill btn-wave">Info</Button>
                <Button variant='purple-light' className="rounded-pill btn-wave">purple</Button>
                <Button variant='teal-light' className="rounded-pill btn-wave">teal</Button>
                <Button variant='orange-light' className="rounded-pill btn-wave">orange</Button>
              </div>
            </Card.Body>
            <div className={`${isHidden[9] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
                <Button variant='primary-light' className="rounded-pill btn-wave">Primary</Button>
                <Button variant='secondary-light' className="rounded-pill btn-wave">Secondary</Button>
                <Button variant='success-light' className="rounded-pill btn-wave">Success</Button>
                <Button variant='danger-light' className="rounded-pill btn-wave">Danger</Button>
                <Button variant='warning-light' className="rounded-pill btn-wave">Warning</Button>
                <Button variant='info-light' className="rounded-pill btn-wave">Info</Button>
                <Button variant='purple-light' className="rounded-pill btn-wave">purple</Button>
                <Button variant='teal-light' className="rounded-pill btn-wave">teal</Button>
                <Button variant='orange-light' className="rounded-pill btn-wave">orange</Button>
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
                Outline Buttons
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(10)}>Show Code<i className={`${isHidden[10] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[10] ? 'd-none' : ''}`}>
              <div className="btn-list">
                <Button variant='outline-primary' className="btn-wave">Primary</Button>
                <Button variant='outline-secondary' className="btn-wave">Secondary</Button>
                <Button variant='outline-success' className="btn-wave">Success</Button>
                <Button variant='outline-danger' className="btn-wave">Danger</Button>
                <Button variant='outline-warning' className="btn-wave">Warning</Button>
                <Button variant='outline-info' className="btn-wave">Info</Button>
                <Button variant='outline-light' className="btn-wave">Light</Button>
                <Button variant='outline-dark' className="btn-wave">Dark</Button>
              </div>
            </Card.Body>
            <div className={`${isHidden[10] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
        <Button variant='outline-primary' className="btn-wave">Primary</Button>
        <Button variant='outline-secondary' className="btn-wave">Secondary</Button>
        <Button variant='outline-success' className="btn-wave">Success</Button>
        <Button variant='outline-danger' className="btn-wave">Danger</Button>
        <Button variant='outline-warning' className="btn-wave">Warning</Button>
        <Button variant='outline-info' className="btn-wave">Info</Button>
        <Button variant='outline-light' className="btn-wave">Light</Button>
        <Button variant='outline-dark' className="btn-wave">Dark</Button>
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
                Rounded Outline Buttons
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(11)}>Show Code<i className={`${isHidden[11] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[11] ? 'd-none' : ''}`}>
              <div className="btn-list">
                <Button variant='outline-primary' className="rounded-pill btn-wave">Primary</Button>
                <Button variant='outline-secondary' className="rounded-pill btn-wave">Secondary</Button>
                <Button variant='outline-success' className="rounded-pill btn-wave">Success</Button>
                <Button variant='outline-danger' className="rounded-pill btn-wave">Danger</Button>
                <Button variant='outline-warning' className="rounded-pill btn-wave">Warning</Button>
                <Button variant='outline-info' className="rounded-pill btn-wave">Info</Button>
                <Button variant='outline-light' className="rounded-pill btn-wave">Light</Button>
                <Button variant='outline-dark' className="rounded-pill btn-wave">Dark</Button>
              </div>
            </Card.Body>
            <div className={`${isHidden[11] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
                <Button variant='outline-primary' className="rounded-pill btn-wave">Primary</Button>
                <Button variant='outline-secondary' className="rounded-pill btn-wave">Secondary</Button>
                <Button variant='outline-success' className="rounded-pill btn-wave">Success</Button>
                <Button variant='outline-danger' className="rounded-pill btn-wave">Danger</Button>
                <Button variant='outline-warning' className="rounded-pill btn-wave">Warning</Button>
                <Button variant='outline-info' className="rounded-pill btn-wave">Info</Button>
                <Button variant='outline-light' className="rounded-pill btn-wave">Light</Button>
                <Button variant='outline-dark' className="rounded-pill btn-wave">Dark</Button>
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
                Gradient Buttons
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(12)}>Show Code<i className={`${isHidden[12] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[12] ? 'd-none' : ''}`}>
              <div className="btn-list">
                <Button variant='primary-gradient' className="btn-wave">Primary</Button>
                <Button variant='secondary-gradient' className="btn-wave">Secondary</Button>
                <Button variant='success-gradient' className="btn-wave">Success</Button>
                <Button variant='danger-gradient' className="btn-wave">Danger</Button>
                <Button variant='warning-gradient' className="btn-wave">Warning</Button>
                <Button variant='info-gradient' className="btn-wave">Info</Button>
                <Button variant='orange-gradient' className="btn-wave">Orange</Button>
                <Button variant='purple-gradient' className="bbtn-wave">Purple</Button>
                <Button variant='teal-gradient' className="btn-wave">Teal</Button>
              </div>
            </Card.Body>
            <div className={`${isHidden[12] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
                <Button variant='primary-gradient' className="btn-wave">Primary</Button>
                <Button variant='secondary-gradient' className="btn-wave">Secondary</Button>
                <Button variant='success-gradient' className="btn-wave">Success</Button>
                <Button variant='danger-gradient' className="btn-wave">Danger</Button>
                <Button variant='warning-gradient' className="btn-wave">Warning</Button>
                <Button variant='info-gradient' className="btn-wave">Info</Button>
                <Button variant='orange-gradient' className="btn-wave">Orange</Button>
                <Button variant='purple-gradient' className="bbtn-wave">Purple</Button>
                <Button variant='teal-gradient' className="btn-wave">Teal</Button>
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
                Rounded Gradient Buttons
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(13)}>Show Code<i className={`${isHidden[13] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[13] ? 'd-none' : ''}`}>
              <div className="btn-list">
                <Button variant='primary-gradient' className="rounded-pill btn-wave">Primary</Button>
                <Button variant='secondary-gradient' className="rounded-pill btn-wave">Secondary</Button>
                <Button variant='success-gradient' className="rounded-pill btn-wave">Success</Button>
                <Button variant='danger-gradient' className="rounded-pill btn-wave">Danger</Button>
                <Button variant='warning-gradient' className="rounded-pill btn-wave">Warning</Button>
                <Button variant='info-gradient' className="rounded-pill btn-wave">Info</Button>
                <Button variant='orange-gradient' className="rounded-pill btn-wave">Orange</Button>
                <Button variant='purple-gradient' className="rounded-pill btn-wave">Purple</Button>
                <Button variant='teal-gradient' className="rounded-pill btn-wave">Teal</Button>
              </div>
            </Card.Body>
            <div className={`${isHidden[13] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
                <Button variant='primary-gradient' className="rounded-pill btn-wave">Primary</Button>
                <Button variant='secondary-gradient' className="rounded-pill btn-wave">Secondary</Button>
                <Button variant='success-gradient' className="rounded-pill btn-wave">Success</Button>
                <Button variant='danger-gradient' className="rounded-pill btn-wave">Danger</Button>
                <Button variant='warning-gradient' className="rounded-pill btn-wave">Warning</Button>
                <Button variant='info-gradient' className="rounded-pill btn-wave">Info</Button>
                <Button variant='orange-gradient' className="rounded-pill btn-wave">Orange</Button>
                <Button variant='purple-gradient' className="rounded-pill btn-wave">Purple</Button>
                <Button variant='teal-gradient' className="rounded-pill btn-wave">Teal</Button>
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
                Ghost Buttons
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(14)}>Show Code<i className={`${isHidden[14] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[14] ? 'd-none' : ''}`}>
              <div className="btn-list">
                <Button variant='primary-ghost' className="btn-wave">Primary</Button>
                <Button variant='secondary-ghost' className="btn-wave">Secondary</Button>
                <Button variant='success-ghost' className="btn-wave">Success</Button>
                <Button variant='danger-ghost' className="btn-wave">Danger</Button>
                <Button variant='warning-ghost' className="btn-wave">Warning</Button>
                <Button variant='info-ghost' className="btn-wave">Info</Button>
                <Button variant='orange-ghost' className="btn-wave">Orange</Button>
                <Button variant='purple-ghost' className="btn-wave">Purple</Button>
                <Button variant='teal-ghost' className="btn-wave">Teal</Button>
              </div>
            </Card.Body>
            <div className={`${isHidden[14] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
                <Button variant='primary-ghost' className="btn-wave">Primary</Button>
                <Button variant='secondary-ghost' className="btn-wave">Secondary</Button>
                <Button variant='success-ghost' className="btn-wave">Success</Button>
                <Button variant='danger-ghost' className="btn-wave">Danger</Button>
                <Button variant='warning-ghost' className="btn-wave">Warning</Button>
                <Button variant='info-ghost' className="btn-wave">Info</Button>
                <Button variant='orange-ghost' className="btn-wave">Orange</Button>
                <Button variant='purple-ghost' className="btn-wave">Purple</Button>
                <Button variant='teal-ghost' className="btn-wave">Teal</Button>
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
                Button tags
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(15)}>Show Code<i className={`${isHidden[15] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[15] ? 'd-none' : ''}`}>
              <div className="btn-list">
                <Link to="#" className="btn btn-primary btn-wave" role="button">Link</Link>
                <Button variant='' className="btn-secondary btn-wave" type="submit">Button</Button>
                <input className="btn btn-info" type="button" defaultValue="Input" />
                <input className="btn btn-warning" type="submit" defaultValue="Submit" />
                <input className="btn btn-success" type="reset" defaultValue="Reset" />
              </div>
            </Card.Body>
            <div className={`${isHidden[15] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
                <Link to="#" className="btn btn-primary btn-wave" role="button">Link</Link>
                <Button variant='' className="btn-secondary btn-wave" type="submit">Button</Button>
                <input className="btn btn-info" type="button" defaultValue="Input" />
                <input className="btn btn-warning" type="submit" defaultValue="Submit" />
                <input className="btn btn-success" type="reset" defaultValue="Reset" />
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
                disabled state with anchor tags
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(16)}>Show Code<i className={`${isHidden[16] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[16] ? 'd-none' : ''}`}>
              <div className="btn-list">
                <div className="mb-4">
                  <Link to='#' className='btn btn-primary disabled' >Primary button</Link>
                  <Link to="#" className='btn btn-secondary disabled' >Button</Link>
                  <Link to="#" className='btn btn-outline-primary disabled'>Primary button</Link>
                  <Link to="#" className='btn btn-outline-secondary disabled'>Button</Link>
                </div>

                <div>
                  <Link to="#" className="btn btn-primary disabled" role="button" aria-disabled="true">Primary link</Link>
                  <Link to="#" className="btn btn-secondary disabled" role="button" aria-disabled="true">Link</Link>
                </div>
              </div>
            </Card.Body>
            <div className={`${isHidden[16] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
                <div className="mb-4">
                  <Link to='#' className='btn btn-primary disabled' >Primary button</Link>
                  <Link to="#" className='btn btn-secondary disabled' >Button</Link>
                  <Link to="#" className='btn btn-outline-primary disabled'>Primary button</Link>
                  <Link to="#" className='btn btn-outline-secondary disabled'>Button</Link>
                </div>

                <div>
                  <Link to="#" className="btn btn-primary disabled" role="button" aria-disabled="true">Primary link</Link>
                  <Link to="#" className="btn btn-secondary disabled" role="button" aria-disabled="true">Link</Link>
                </div>
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
                button plugin toggle states
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(17)}>Show Code<i className={`${isHidden[17] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[17] ? 'd-none' : ''}`}>
              <div className="btn-list">
                <div className="mb-4">
                  <Button variant='primary' className="btn-wave" data-bs-toggle="button" >Toggle button</Button>
                  <Button variant='secondary' className="btn-wave" active data-bs-toggle="button" aria-pressed="true">Active toggle button</Button>
                  <Button variant='teal' className="btn-wave" disabled data-bs-toggle="button" >Disabled toggle button</Button>
                </div>
                <div>
                  <Link to="#" className="btn btn-primary btn-wave" role="button" data-bs-toggle="button">Toggle link</Link>
                  <Link to="#" className="btn btn-secondary active btn-wave" role="button" data-bs-toggle="button" aria-pressed="true">Active toggle link</Link>
                  <Link to='#' className="btn btn-teal disabled btn-wave" aria-disabled="true" role="button" data-bs-toggle="button">Disabled toggle link</Link>
                </div>
              </div>
            </Card.Body>
            <div className={`${isHidden[17] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
        <div className="mb-4">
          <Button variant='primary' className="btn-wave" data-bs-toggle="button" >Toggle button</Button>
          <Button variant='secondary' className="btn-wave" active data-bs-toggle="button" aria-pressed="true">Active toggle button</Button>
          <Button variant='teal' className="btn-wave" disabled data-bs-toggle="button" >Disabled toggle button</Button>
        </div>
        <div>
          <Link to="#" className="btn btn-primary btn-wave" role="button" data-bs-toggle="button">Toggle link</Link>
          <Link to="#" className="btn btn-secondary active btn-wave" role="button" data-bs-toggle="button" aria-pressed="true">Active toggle link</Link>
          <Link to='#' className="btn btn-teal disabled btn-wave" aria-disabled="true" role="button" data-bs-toggle="button">Disabled toggle link</Link>
        </div>
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
                Link functionally caveat
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(18)}>Show Code<i className={`${isHidden[18] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[18] ? 'd-none' : ''}`}>
              <div className="btn-list">
                <Link to='#' className="btn btn-primary disabled" tabIndex={-1} role="button" aria-disabled="true">Primary link</Link>
                <Link to="#" className="btn btn-secondary disabled" tabIndex={-1} role="button" aria-disabled="true">Link</Link>
              </div>
            </Card.Body>
            <div className={`${isHidden[18] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
                <Link to='#' className="btn btn-primary disabled" tabIndex={-1} role="button" aria-disabled="true">Primary link</Link>
                <Link to="#" className="btn btn-secondary disabled" tabIndex={-1} role="button" aria-disabled="true">Link</Link>
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
                Loading Buttons
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(19)}>Show Code<i className={`${isHidden[19] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[19] ? 'd-none' : ''}`}>
              <div className="btn-list d-md-flex flex-wrap">
                <Button variant='primary' className="btn-loader">
                  <span className="me-2">Loading</span>
                  <span className="loading"><i className="ri-loader-2-fill fs-16"></i></span>
                </Button>
                <Button variant='outline-secondary' className="btn-loader">
                  <span className="me-2">Loading</span>
                  <span className="loading"><i className="ri-loader-2-fill fs-16"></i></span>
                </Button>
                <Button variant='info-transparent' className="btn-loader">
                  <span className="me-2">Loading</span>
                  <span className="loading"><i className="ri-loader-4-line fs-16"></i></span>
                </Button>
                <Button variant='warning-transparent' className="btn-loader">
                  <span className="me-2">Loading</span>
                  <span className="loading"><i className="ri-loader-5-line fs-16"></i></span>
                </Button>
                <Button variant='success' className="btn-loader " disabled>
                  <span className="me-2">Disabled</span>
                  <span className="loading"><i className="ri-refresh-line fs-16"></i></span>
                </Button>
              </div>
            </Card.Body>
            <div className={`${isHidden[19] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list d-md-flex flex-wrap">
                <Button variant='primary' className="btn-loader">
                  <span className="me-2">Loading</span>
                  <span className="loading"><i className="ri-loader-2-fill fs-16"></i></span>
                </Button>
                <Button variant='outline-secondary' className="btn-loader">
                  <span className="me-2">Loading</span>
                  <span className="loading"><i className="ri-loader-2-fill fs-16"></i></span>
                </Button>
                <Button variant='info-transparent' className="btn-loader">
                  <span className="me-2">Loading</span>
                  <span className="loading"><i className="ri-loader-4-line fs-16"></i></span>
                </Button>
                <Button variant='warning-transparent' className="btn-loader">
                  <span className="me-2">Loading</span>
                  <span className="loading"><i className="ri-loader-5-line fs-16"></i></span>
                </Button>
                <Button variant='success' className="btn-loader " disabled>
                  <span className="me-2">Disabled</span>
                  <span className="loading"><i className="ri-refresh-line fs-16"></i></span>
                </Button>
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
              <div className="card-title">Icon Buttons</div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(20)}>Show Code<i className={`${isHidden[20] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[20] ? 'd-none' : ''}`}>
              <div className="btn-list d-md-flex d-block">
                <div className="mb-md-0 mb-2">
                  <Button variant='primary' className="btn-icon btn-wave">
                    <i className="ri-bank-fill"></i>
                  </Button>
                  <Button variant='info' className="btn-icon btn-wave">
                    <i className="ri-medal-line"></i>
                  </Button>
                  <Button variant='danger' className="btn-icon btn-wave">
                    <i className="ri-archive-line"></i>
                  </Button>
                  <Button variant='warning' className="btn-icon btn-wave me-5">
                    <i className="ri-calendar-2-line"></i>
                  </Button>
                </div>
                <div className="mb-md-0 mb-2">
                  <Button variant='primary-transparent' className="btn-icon rounded-pill btn-wave"><i className="ri-home-smile-line"></i></Button>
                  <Button variant='secondary-transparent' className="btn-icon rounded-pill btn-wave"> <i className="ri-delete-bin-line"></i></Button>
                  <Button variant='success-transparent' className="btn-icon rounded-pill btn-wave"><i className="ri-notification-3-line"></i></Button>
                  <Button variant='danger-transparent' className="btn-icon rounded-pill btn-wave me-5"><i className="ri-chat-settings-line"></i></Button>
                </div>
                <div className="">
                  <Button variant='outline-primary' className="btn-icon rounded-pill btn-wave"> <i className="ri-phone-line"></i> </Button>
                  <Button variant='outline-teal' className="btn-icon rounded-pill btn-wave"> <i className="ri-customer-service-2-line"></i> </Button>
                  <Button variant='outline-success' className="btn-icon rounded-pill btn-wave"> <i className="ri-live-line"></i> </Button>
                  <Button variant='outline-secondary' className="btn-icon rounded-pill btn-wave"> <i className="ri-save-line"></i> </Button>
                </div>
              </div>
            </Card.Body>
            <div className={`${isHidden[20] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list d-md-flex d-block">
                <div className="mb-md-0 mb-2">
                  <Button variant='primary' className="btn-icon btn-wave">
                    <i className="ri-bank-fill"></i>
                  </Button>
                  <Button variant='info' className="btn-icon btn-wave">
                    <i className="ri-medal-line"></i>
                  </Button>
                  <Button variant='danger' className="btn-icon btn-wave">
                    <i className="ri-archive-line"></i>
                  </Button>
                  <Button variant='warning' className="btn-icon btn-wave me-5">
                    <i className="ri-calendar-2-line"></i>
                  </Button>
                </div>
                <div className="mb-md-0 mb-2">
                  <Button variant='primary-transparent' className="btn-icon rounded-pill btn-wave"><i className="ri-home-smile-line"></i></Button>
                  <Button variant='secondary-transparent' className="btn-icon rounded-pill btn-wave"> <i className="ri-delete-bin-line"></i></Button>
                  <Button variant='success-transparent' className="btn-icon rounded-pill btn-wave"><i className="ri-notification-3-line"></i></Button>
                  <Button variant='danger-transparent' className="btn-icon rounded-pill btn-wave me-5"><i className="ri-chat-settings-line"></i></Button>
                </div>
                <div className="">
                  <Button variant='outline-primary' className="btn-icon rounded-pill btn-wave"> <i className="ri-phone-line"></i> </Button>
                  <Button variant='outline-teal' className="btn-icon rounded-pill btn-wave"> <i className="ri-customer-service-2-line"></i> </Button>
                  <Button variant='outline-success' className="btn-icon rounded-pill btn-wave"> <i className="ri-live-line"></i> </Button>
                  <Button variant='outline-secondary' className="btn-icon rounded-pill btn-wave"> <i className="ri-save-line"></i> </Button>
                </div>
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
                Social Buttons
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(21)}>Show Code<i className={`${isHidden[21] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[21] ? 'd-none' : ''}`}>
              <div className="btn-list">
                <Button variant='facebook' className="btn-icon btn-wave"> <i className="ri-facebook-line"></i> </Button>
                <Button variant='twitter' className="btn-icon btn-wave"> <i className="ri-twitter-x-fill"></i> </Button>
                <Button variant='instagram' className="btn-icon btn-wave"> <i className="ri-instagram-line"></i> </Button>
                <Button variant='github' className="btn-icon btn-wave"> <i className="ri-github-line"></i> </Button>
                <Button variant='youtube' className="btn-icon btn-wave"> <i className="ri-youtube-line"></i> </Button>
                <Button variant='google' className="btn-icon btn-wave"> <i className="ri-google-line"></i> </Button>
              </div>
            </Card.Body>
            <div className={`${isHidden[21] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
                <Button variant='facebook' className="btn-icon btn-wave"> <i className="ri-facebook-line"></i> </Button>
                <Button variant='twitter' className="btn-icon btn-wave"> <i className="ri-twitter-x-fill"></i> </Button>
                <Button variant='instagram' className="btn-icon btn-wave"> <i className="ri-instagram-line"></i> </Button>
                <Button variant='github' className="btn-icon btn-wave"> <i className="ri-github-line"></i> </Button>
                <Button variant='youtube' className="btn-icon btn-wave"> <i className="ri-youtube-line"></i> </Button>
                <Button variant='google' className="btn-icon btn-wave"> <i className="ri-google-line"></i> </Button>
              </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Custom Buttons
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(22)}>Show Code<i className={`${isHidden[22] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[22] ? 'd-none' : ''}`}>
              <div className="btn-list">
                <Button variant='info' className="custom-button rounded-pill"> <span className="custom-btn-icons"><i className="ri-twitter-x-fill text-info"></i></span> Twitter </Button>
                <Button variant='teal-light' className="btn-border-down">Border</Button>
                <Button variant='secondary-light' className="btn-border-start">Border</Button>
                <Button variant='purple-light' className="btn-border-end">Border</Button>
                <Button variant='warning-light' className="btn-border-top">Border</Button>
                <Button variant='secondary' className="btn-glare"><span>Glare Button</span></Button>
                <Button variant='danger' className="btn-hover btn-hover-animate">Like</Button>
                <Button variant='success' className="btn-darken-hover">Hover</Button>
                <Button variant='orange' className="btn-custom-border">Hover</Button>
              </div>
            </Card.Body>
            <div className={`${isHidden[22] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
                <Button variant='info' className="custom-button rounded-pill"> <span className="custom-btn-icons"><i className="ri-twitter-x-fill text-info"></i></span> Twitter </Button>
                <Button variant='teal-light' className="btn-border-down">Border</Button>
                <Button variant='secondary-light' className="btn-border-start">Border</Button>
                <Button variant='purple-light' className="btn-border-end">Border</Button>
                <Button variant='warning-light' className="btn-border-top">Border</Button>
                <Button variant='secondary' className="btn-glare"><span>Glare Button</span></Button>
                <Button variant='danger' className="btn-hover btn-hover-animate">Like</Button>
                <Button variant='success' className="btn-darken-hover">Hover</Button>
                <Button variant='orange' className="btn-custom-border">Hover</Button>
              </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Block buttons
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(23)}>Show Code<i className={`${isHidden[23] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[23] ? 'd-none' : ''}`}>
              <div className="btn-list">
                <div className="d-grid gap-2 mb-4">
                  <Button variant='primary' className="btn-wave">Button</Button>
                  <Button variant='secondary' className="btn-wave">Button</Button>
                </div>
                <div className="d-grid gap-2 d-md-block">
                  <Button variant='info' className="btn-wave">Button</Button>
                  <Button variant='success' className="btn-wave">Button</Button>
                </div>
                <div className="d-grid gap-2 col-6 mx-auto">
                  <Button variant='danger' className="btn-wave">Button</Button>
                  <Button variant='warning' className="btn-wave">Button</Button>
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Button variant='teal' className="me-md-2 btn-wave">Button</Button>
                  <Button variant='purple' className="btn-wave">Button</Button>
                </div>
              </div>
            </Card.Body>
            <div className={`${isHidden[23] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
                <div className="d-grid gap-2 mb-4">
                  <Button variant='primary' className="btn-wave">Button</Button>
                  <Button variant='secondary' className="btn-wave">Button</Button>
                </div>
                <div className="d-grid gap-2 d-md-block">
                  <Button variant='info' className="btn-wave">Button</Button>
                  <Button variant='success' className="btn-wave">Button</Button>
                </div>
                <div className="d-grid gap-2 col-6 mx-auto">
                  <Button variant='danger' className="btn-wave">Button</Button>
                  <Button variant='warning' className="btn-wave">Button</Button>
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Button variant='teal' className="me-md-2 btn-wave">Button</Button>
                  <Button variant='purple' className="btn-wave">Button</Button>
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

export default Buttons
