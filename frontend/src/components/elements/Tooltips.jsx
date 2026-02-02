import { Fragment, useState } from "react"
import { Button, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap"
import { tooltipdata } from "../../common/Comondata";
import { Link } from "react-router-dom"
import Pageheader from "../../layouts/Pageheader"
import ALLImages from "../../common/Imagedata"


const Tooltips = () => {

  //showcode

  const [isHidden, setIsHidden] = useState([false]);
  const toggleHidden = (index) => {
    const updatedHidden = [...isHidden];
    updatedHidden[index] = !updatedHidden[index];
    setIsHidden(updatedHidden);
  };


  return (
    <Fragment>
      <Pageheader mainheading='Tooltips' parentfolder='Elements' activepage='Tooltips' />

      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Tooltip Directions
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(0)}>Show Code<i className={`${isHidden[0] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[0] ? 'd-none' : ''} btn-list`}>
              {['top', 'right', 'bottom', 'left'].map((placement) => (
                <OverlayTrigger key={placement} placement={placement} overlay={<Tooltip id={`tooltip-${placement}`}>Tooltip on <strong>{placement}</strong>. </Tooltip>}>
                  <Button variant="primary" className="btn-wave me-2">Tooltip on {placement}</Button>
                </OverlayTrigger>
              ))}
            </Card.Body>
            <div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        {['top', 'right', 'bottom', 'left'].map((placement) => (
          <OverlayTrigger key={placement} placement={placement} overlay={<Tooltip id={\`tooltip-\${placement}\`}>Tooltip on <strong>{placement}</strong>. </Tooltip>}>
            <Button variant="primary" className="btn-wave me-2">Tooltip on {placement}</Button>
          </OverlayTrigger>
        ))}
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
                Colored Tooltips
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(1)}>Show Code<i className={`${isHidden[1] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[1] ? 'd-none' : ''}`}>
              <div className="btn-list">
                {tooltipdata.map((idx) => (
                  <OverlayTrigger key={idx.id} placement={idx.place} overlay={<Tooltip className={`tooltip-${idx.color}`} id={`tooltip-${idx.place}`}><strong>{idx.color}</strong> Tooltip</Tooltip>}>
                    <Button variant={idx.color} className="btn-wave me-2">{idx.color} Tooltip</Button>
                  </OverlayTrigger>
                ))}
              </div>
            </Card.Body>
            <div className={`${isHidden[1] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
        {tooltipdata.map((idx) => (
          <OverlayTrigger key={idx.id} placement={idx.place} overlay={<Tooltip className={\`tooltip-\${idx.color}\`} id={\`tooltip-\${idx.place}\`}><strong>{idx.color}</strong> Tooltip</Tooltip>}>
            <Button variant={idx.color} className="btn-wave me-2">{idx.color} Tooltip</Button>
          </OverlayTrigger>
        ))}
      </div>
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
              <div className="card-title">
                Tooltips on links
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(2)}>Show Code<i className={`${isHidden[2] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[2] ? 'd-none' : ''}`}>
              <p className="text-muted mb-0">
                Hover on the link to view the <OverlayTrigger overlay={<Tooltip className="tooltip-primary">Tooltip</Tooltip>}><Link to='#' className="">Tooltip</Link></OverlayTrigger>
              </p>
            </Card.Body>
            <div className={`${isHidden[2] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <p className="text-muted mb-0">
        Hover on the link to view the <OverlayTrigger overlay={<Tooltip className="tooltip-primary">Tooltip</Tooltip>}><Link to='#' className="">Tooltip</Link></OverlayTrigger>
      </p>
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
                With an SVG's
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(3)}>Show Code<i className={`${isHidden[3] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[3] ? 'd-none' : ''}`}>
              <OverlayTrigger overlay={<Tooltip className="tooltip-primary">Home</Tooltip>}>
                <Link to='#' className="me-3"><svg xmlns="http://www.w3.org/2000/svg" className="svg-primary" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" /></svg></Link>
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip className="tooltip-secondary">Message</Tooltip>}>
                <Link to='#' className="me-3"><svg xmlns="http://www.w3.org/2000/svg" className="svg-secondary" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" /></svg></Link>
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip className="tooltip-warning">Add User</Tooltip>}>
                <Link to='#' className="me-3"><svg xmlns="http://www.w3.org/2000/svg" className="svg-warning" enableBackground="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24" /></g><g><path d="M20,9V6h-2v3h-3v2h3v3h2v-3h3V9H20z M9,12c2.21,0,4-1.79,4-4c0-2.21-1.79-4-4-4S5,5.79,5,8C5,10.21,6.79,12,9,12z M9,6 c1.1,0,2,0.9,2,2c0,1.1-0.9,2-2,2S7,9.1,7,8C7,6.9,7.9,6,9,6z M15.39,14.56C13.71,13.7,11.53,13,9,13c-2.53,0-4.71,0.7-6.39,1.56 C1.61,15.07,1,16.1,1,17.22V20h16v-2.78C17,16.1,16.39,15.07,15.39,14.56z M15,18H3v-0.78c0-0.38,0.2-0.72,0.52-0.88 C4.71,15.73,6.63,15,9,15c2.37,0,4.29,0.73,5.48,1.34C14.8,16.5,15,16.84,15,17.22V18z" /></g></svg></Link>
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip className="tooltip-info">Send file</Tooltip>}>
                <Link to='#' className="me-3"><svg xmlns="http://www.w3.org/2000/svg" className="svg-info" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M4.01 6.03l7.51 3.22-7.52-1 .01-2.22m7.5 8.72L4 17.97v-2.22l7.51-1M2.01 3L2 10l15 2-15 2 .01 7L23 12 2.01 3z" /></svg></Link>
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip className="tooltip-success">Action</Tooltip>}>
                <Link to='#' className="me-3"><svg xmlns="http://www.w3.org/2000/svg" className="svg-success" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg></Link>
              </OverlayTrigger>
            </Card.Body>
            <div className={`${isHidden[3] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <OverlayTrigger overlay={<Tooltip className="tooltip-primary">Home</Tooltip>}>
                <Link to='#' className="me-3"><svg xmlns="http://www.w3.org/2000/svg" className="svg-primary" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" /></svg></Link>
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip className="tooltip-secondary">Message</Tooltip>}>
                <Link to='#' className="me-3"><svg xmlns="http://www.w3.org/2000/svg" className="svg-secondary" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" /></svg></Link>
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip className="tooltip-warning">Add User</Tooltip>}>
                <Link to='#' className="me-3"><svg xmlns="http://www.w3.org/2000/svg" className="svg-warning" enableBackground="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24" /></g><g><path d="M20,9V6h-2v3h-3v2h3v3h2v-3h3V9H20z M9,12c2.21,0,4-1.79,4-4c0-2.21-1.79-4-4-4S5,5.79,5,8C5,10.21,6.79,12,9,12z M9,6 c1.1,0,2,0.9,2,2c0,1.1-0.9,2-2,2S7,9.1,7,8C7,6.9,7.9,6,9,6z M15.39,14.56C13.71,13.7,11.53,13,9,13c-2.53,0-4.71,0.7-6.39,1.56 C1.61,15.07,1,16.1,1,17.22V20h16v-2.78C17,16.1,16.39,15.07,15.39,14.56z M15,18H3v-0.78c0-0.38,0.2-0.72,0.52-0.88 C4.71,15.73,6.63,15,9,15c2.37,0,4.29,0.73,5.48,1.34C14.8,16.5,15,16.84,15,17.22V18z" /></g></svg></Link>
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip className="tooltip-info">Send file</Tooltip>}>
                <Link to='#' className="me-3"><svg xmlns="http://www.w3.org/2000/svg" className="svg-info" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M4.01 6.03l7.51 3.22-7.52-1 .01-2.22m7.5 8.72L4 17.97v-2.22l7.51-1M2.01 3L2 10l15 2-15 2 .01 7L23 12 2.01 3z" /></svg></Link>
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip className="tooltip-success">Action</Tooltip>}>
                <Link to='#' className="me-3"><svg xmlns="http://www.w3.org/2000/svg" className="svg-success" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg></Link>
              </OverlayTrigger>
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
                Disabled elements
              </div>
              "if the button is disabled tooltip will get disabled"
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(4)}>Show Code<i className={`${isHidden[4] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[4] ? 'd-none' : ''}`}>
              <OverlayTrigger overlay={<Tooltip>Default tooltip</Tooltip>}><Button type="button" disabled>Disabled button</Button></OverlayTrigger>
            </Card.Body>
            <div className={`${isHidden[4] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <OverlayTrigger overlay={<Tooltip>Default tooltip</Tooltip>}><Button type="button" disabled>Disabled button</Button></OverlayTrigger>
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
              <div className="card-title">
                Tooltip For Images
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(0)}>Show Code<i className={`${isHidden[0] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>
              <OverlayTrigger overlay={<Tooltip className="tooltip-primary">Alex Carey</Tooltip>}>
                <Link to='#' className="avatar avatar-md me-2 online avatar-rounded"> <img src={ALLImages('face12')} alt="img" /></Link>
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip className="tooltip-primary">Marina Kai</Tooltip>}>
                <Link to='#' className="avatar avatar-lg me-2 online avatar-rounded"> <img src={ALLImages('face3')} alt="img" /></Link>
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip className="tooltip-primary">Tim Cook</Tooltip>}>
                <Link to='#' className="avatar avatar-xl me-2 offline avatar-rounded"> <img src={ALLImages('face15')} alt="img" /></Link>
              </OverlayTrigger>
            </Card.Body>
            <div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <img src={ALLImages("media25")} className="object-fit-contain border rounded" alt="..." />
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

export default Tooltips
