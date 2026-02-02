import { Fragment, useState } from 'react'
import { Breadcrumb, Card, Col, Row } from 'react-bootstrap'
import Pageheader from '../../layouts/Pageheader'

const Breadcrumbs = () => {

  const breadcrumbStyle = {
    "--bs-breadcrumb-divider": "'~'"
  };

  const breadcrumbStyle1 = {
    "--bs-breadcrumb-divider": `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='currentColor'/%3E%3C/svg%3E")`
  }

  //showcode

  const [isHidden, setIsHidden] = useState([false]);
  const toggleHidden = (index) => {
    const updatedHidden = [...isHidden];
    updatedHidden[index] = !updatedHidden[index];
    setIsHidden(updatedHidden);
  };
  return (
    <Fragment>
      <Pageheader mainheading='Breadcrumb' parentfolder='Elements' activepage='Breadcrumb' />

      <Row className="row-sm">
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Example
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(0)}>Show Code<i className={`${isHidden[0] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>
              <Breadcrumb>
                <Breadcrumb.Item active>Home</Breadcrumb.Item>
              </Breadcrumb>
              <Breadcrumb>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Library</Breadcrumb.Item>
              </Breadcrumb>
              <Breadcrumb>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Library</Breadcrumb.Item>
                <Breadcrumb.Item active>Data</Breadcrumb.Item>
              </Breadcrumb>
            </Card.Body>
            <div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Breadcrumb>
                <Breadcrumb.Item active>Home</Breadcrumb.Item>
              </Breadcrumb>
              <Breadcrumb>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Library</Breadcrumb.Item>
              </Breadcrumb>
              <Breadcrumb>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Library</Breadcrumb.Item>
                <Breadcrumb.Item active>Data</Breadcrumb.Item>
              </Breadcrumb>
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
                Example1
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(1)}>Show Code<i className={`${isHidden[1] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[1] ? 'd-none' : ''}`}>

              <Breadcrumb className='breadcrumb-example1'>
                <Breadcrumb.Item active>Home</Breadcrumb.Item>
              </Breadcrumb>
              <Breadcrumb className='breadcrumb-example1'>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Library</Breadcrumb.Item>
              </Breadcrumb>
              <Breadcrumb className='breadcrumb-example1 mb-0'>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Library</Breadcrumb.Item>
                <Breadcrumb.Item active>Data</Breadcrumb.Item>
              </Breadcrumb>
            </Card.Body>
            <div className={`${isHidden[1] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Breadcrumb className='breadcrumb-example1'>
        <Breadcrumb.Item active>Home</Breadcrumb.Item>
      </Breadcrumb>
      <Breadcrumb className='breadcrumb-example1'>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Library</Breadcrumb.Item>
      </Breadcrumb>
      <Breadcrumb className='breadcrumb-example1 mb-0'>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Library</Breadcrumb.Item>
        <Breadcrumb.Item active>Data</Breadcrumb.Item>
      </Breadcrumb>
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
                Dividers
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(2)}>Show Code<i className={`${isHidden[2] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[2] ? 'd-none' : ''}`}>
              <Breadcrumb style={breadcrumbStyle} className='mb-0'>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item className='embedded-breadcrumb' active>Library</Breadcrumb.Item>
              </Breadcrumb>
            </Card.Body>
            <div className={`${isHidden[2] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Breadcrumb style={breadcrumbStyle} className='mb-0'>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item className='embedded-breadcrumb' active>Library</Breadcrumb.Item>
              </Breadcrumb>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card embedded-svg">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Embedded SVG icon
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(3)}>Show Code<i className={`${isHidden[3] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[3] ? 'd-none' : ''} Embedded_SVG`}>
              <Breadcrumb style={breadcrumbStyle1} className='mb-0'>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Library</Breadcrumb.Item>
              </Breadcrumb>
            </Card.Body>
            <div className={`${isHidden[3] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Breadcrumb style={breadcrumbStyle1} className='mb-0'>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Library</Breadcrumb.Item>
              </Breadcrumb>
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
                Breadcrumb Style-1
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(4)}>Show Code<i className={`${isHidden[4] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[4] ? 'd-none' : ''}`}>
              <Breadcrumb className='breadcrumb-style1 mb-0'>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Library</Breadcrumb.Item>
                <Breadcrumb.Item active>Data</Breadcrumb.Item>
              </Breadcrumb>
            </Card.Body>
            <div className={`${isHidden[4] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Breadcrumb className='breadcrumb-style1 mb-0'>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Library</Breadcrumb.Item>
                <Breadcrumb.Item active>Data</Breadcrumb.Item>
              </Breadcrumb>
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
                Breadcrumb Style-2
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(5)}>Show Code<i className={`${isHidden[5] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[5] ? 'd-none' : ''}`}>
              <Breadcrumb className='breadcrumb-style2 mb-0'>
                <Breadcrumb.Item><i className="ti ti-home-2 me-1 fs-15 d-inline-block"></i>Home</Breadcrumb.Item>
                <Breadcrumb.Item><i className="ti ti-apps me-1 fs-15 d-inline-block"></i>About</Breadcrumb.Item>
                <Breadcrumb.Item active>Services</Breadcrumb.Item>
              </Breadcrumb>
            </Card.Body>
            <div className={`${isHidden[5] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Breadcrumb className='breadcrumb-style2 mb-0'>
                <Breadcrumb.Item><i className="ti ti-home-2 me-1 fs-15 d-inline-block"></i>Home</Breadcrumb.Item>
                <Breadcrumb.Item><i className="ti ti-apps me-1 fs-15 d-inline-block"></i>About</Breadcrumb.Item>
                <Breadcrumb.Item active>Services</Breadcrumb.Item>
              </Breadcrumb>
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
                Background colors
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(6)}>Show Code<i className={`${isHidden[6] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[6] ? 'd-none' : ''}`}>
              <Breadcrumb className="bg-light p-2 br-3" bsPrefix='breadcrumb mb-0'>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item className='backgroundcolor-breadcrumb' active>About</Breadcrumb.Item>
              </Breadcrumb>
            </Card.Body>
            <div className={`${isHidden[6] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Breadcrumb className="bg-light p-2 br-3" bsPrefix='breadcrumb mb-0'>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item className='backgroundcolor-breadcrumb' active>About</Breadcrumb.Item>
              </Breadcrumb>
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

export default Breadcrumbs
