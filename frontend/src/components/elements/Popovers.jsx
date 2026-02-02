import { Fragment, useState } from "react"
import { Button, Card, Col, OverlayTrigger, Popover, Row } from "react-bootstrap"
import { ColoredpopoverData, DismispopoverData, popoverData } from "../../common/Comondata"
import Pageheader from "../../layouts/Pageheader"


const Popovers = () => {

  //showcode

  const [isHidden, setIsHidden] = useState([false]);
  const toggleHidden = (index) => {
    const updatedHidden = [...isHidden];
    updatedHidden[index] = !updatedHidden[index];
    setIsHidden(updatedHidden);
  };

  return (
    <Fragment>
      <Pageheader mainheading='Popover' parentfolder='Elements' activepage='Popover' />

      <Row className="row-sm">
        <Col xl={5}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Default Popovers
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(0)}>Show Code<i className={`${isHidden[0] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>
              {['top', 'right', 'bottom', 'left'].map((placement) => (
                <OverlayTrigger trigger="click" key={placement} placement={placement}
                  overlay={
                    <Popover id={`popover-positioned-${placement}`}>
                      <Popover.Header as="h3">{`Popover ${placement}`}</Popover.Header>
                      <Popover.Body>
                        <strong>Holy guacamole!</strong> Check this info.
                      </Popover.Body>
                    </Popover>
                  }>
                  <Button variant="" className="me-2 my-2 btn-outline-primary">Popover {placement}</Button>
                </OverlayTrigger>
              ))}
            </Card.Body>
            <div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        {['top', 'right', 'bottom', 'left'].map((placement) => (
          <OverlayTrigger trigger="click" key={placement} placement={placement}
            overlay={
              <Popover id={\`popover-positioned-\${placement}\`}>
                <Popover.Header as="h3">{\`Popover \${placement}\`}</Popover.Header>
                <Popover.Body>
                  <strong>Holy guacamole!</strong> Check this info.
                </Popover.Body>
              </Popover>
            }>
            <Button variant="" className="me-2 my-2 btn-outline-primary">Popover {placement}</Button>
          </OverlayTrigger>
        ))}
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={7}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Colored Headers
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(1)}>Show Code<i className={`${isHidden[1] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[1] ? 'd-none' : ''}`}>
              {popoverData.map((idx) => (
                <OverlayTrigger trigger="click" key={idx.id} placement={idx.place} overlay={
                  <Popover id={`popover-positioned-${idx.place}`} className={`${idx.id === 3 ? 'header-info bs-popover-auto' : ''}`}>
                    <Popover.Header className={`bg-${idx.color}`} as="h3">{`${idx.place} Popover`}</Popover.Header>
                    <Popover.Body>
                      <strong>Holy guacamole!</strong> Check this info.
                    </Popover.Body>
                  </Popover>
                }>
                  <Button variant={`outline-${idx.color}`} className="me-2 my-2">Popover {idx.color}</Button>
                </OverlayTrigger>
              ))}
            </Card.Body>
            <div className={`${isHidden[1] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        {popoverData.map((idx) => (
          <OverlayTrigger trigger="click" key={idx.id} placement={idx.place} overlay={
              <Popover id={\`popover-positioned-\${idx.place}\`} className={\`\${idx.id === 3 ? 'header-info bs-popover-auto' : ''}\`}>
                <Popover.Header className={\`bg-\${idx.color}\`} as="h3">{\`\${idx.place} Popover\`}</Popover.Header>
                <Popover.Body>
                  <strong>Holy guacamole!</strong> Check this info.
                </Popover.Body>
              </Popover>
            }>
            <Button variant={\`outline-\${idx.color}\`} className="me-2 my-2">Popover {idx.color}</Button>
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
                Colored Popovers
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(1)}>Show Code<i className={`${isHidden[1] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[1] ? 'd-none' : ''}`}>
              {ColoredpopoverData.map((idx) => (
                <OverlayTrigger trigger="click" key={idx.id} placement={idx.place}
                  overlay={
                    <Popover className={`popover-${idx.color}`} id={`popover-positioned-${idx.place}`}>
                      <Popover.Header as="h3">{`${idx.place} Popover`}</Popover.Header>
                      <Popover.Body >
                        <strong>Holy guacamole!</strong> Check this info.
                      </Popover.Body>
                    </Popover>
                  }>
                  <Button variant={idx.color} className="me-2 my-2">{idx.color}</Button>
                </OverlayTrigger>
              ))}
            </Card.Body>
            <div className={`${isHidden[1] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        {ColoredpopoverData.map((idx) => (
          <OverlayTrigger trigger="click" key={idx.id} placement={idx.place}
            overlay={
              <Popover className={\`popover-\${idx.color}\`} id={\`popover-positioned-\${idx.place}\`}>
                <Popover.Header as="h3">{\`\${idx.place} Popover\`}</Popover.Header>
                <Popover.Body >
                  <strong>Holy guacamole!</strong> Check this info.
                </Popover.Body>
              </Popover>
            }>
            <Button variant={idx.color} className="me-2 my-2">{idx.color}</Button>
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
                Light Popovers
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(2)}>Show Code<i className={`${isHidden[2] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[2] ? 'd-none' : ''}`}>
              {ColoredpopoverData.map((idx) => (
                <OverlayTrigger trigger="click" key={idx.id} placement={idx.place}
                  overlay={
                    <Popover className={`popover-${idx.color}-light`} id={`popover-positioned-${idx.place}`}>
                      <Popover.Header as="h3">{`${idx.place} Popover`}</Popover.Header>
                      <Popover.Body >
                        <strong>Holy guacamole!</strong> Check this info.
                      </Popover.Body>
                    </Popover>
                  }>
                  <Button variant={`${idx.color}-light`} className="me-2 my-2">{idx.color}</Button>
                </OverlayTrigger>
              ))}
            </Card.Body>
            <div className={`${isHidden[2] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        {ColoredpopoverData.map((idx) => (
          <OverlayTrigger trigger="click" key={idx.id} placement={idx.place}
            overlay={
              <Popover className={\`popover-\${idx.color}-light\`} id={\`popover-positioned-\${idx.place}\`}>
                <Popover.Header as="h3">{\`\${idx.place} Popover\`}</Popover.Header>
                <Popover.Body >
                  <strong>Holy guacamole!</strong> Check this info.
                </Popover.Body>
              </Popover>
            }>
            <Button variant={\`\${idx.color}-light\`} className="me-2 my-2">{idx.color}</Button>
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
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Dismissible Popovers
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(3)}>Show Code<i className={`${isHidden[3] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[3] ? 'd-none' : ''} d-flex flex-wrap justify-content-between`}>
              {DismispopoverData.map((idx) => (
                <OverlayTrigger trigger="click" key={idx.id} placement={idx.place}
                  overlay={
                    <Popover id={`popover-positioned-${idx.place}`}>
                      <Popover.Header as="h3">Popover Dismiss</Popover.Header>
                      <Popover.Body> And here's some amazing content. It's very engaging. Right? </Popover.Body>
                    </Popover>
                  }>
                  <Button variant={idx.color} className="me-2 my-2">Popover Dismiss</Button>
                </OverlayTrigger>
              ))}
            </Card.Body>
            <div className={`${isHidden[3] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        {DismispopoverData.map((idx) => (
          <OverlayTrigger trigger="click" key={idx.id} placement={idx.place}
            overlay={
              <Popover id={\`popover-positioned-\${idx.place}\`}>
                <Popover.Header as="h3">Popover Dismiss</Popover.Header>
                <Popover.Body> And here's some amazing content. It's very engaging. Right? </Popover.Body>
              </Popover>
            }>
            <Button variant={idx.color} className="me-2 my-2">Popover Dismiss</Button>
          </OverlayTrigger>
        ))}
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={3}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Disabled Popover
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(4)}>Show Code<i className={`${isHidden[4] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[4] ? 'd-none' : ''}`}>
              <OverlayTrigger placement='right' overlay={<Popover id="popover-basic"><Popover.Body>Disabled popover</Popover.Body></Popover>}>
                <span className="d-inline-block">
                  <Button disabled style={{ pointerEvents: 'none' }}>
                    Disabled button
                  </Button>
                </span>
              </OverlayTrigger>
            </Card.Body>
            <div className={`${isHidden[4] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <OverlayTrigger placement='right' overlay={<Popover id="popover-basic"><Popover.Body>Disabled popover</Popover.Body></Popover>}>
                <span className="d-inline-block">
                  <Button disabled style={{ pointerEvents: 'none' }}>
                    Disabled button
                  </Button>
                </span>
              </OverlayTrigger>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={3}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Icon Popovers
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(5)}>Show Code<i className={`${isHidden[5] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[5] ? 'd-none' : ''}`}>
              <OverlayTrigger trigger="click" placement="top" overlay={<Popover className="popover-primary only-body" id="popover-basic">
                <Popover.Body> And here's some <strong>amazing</strong> content. It's very engaging. right? </Popover.Body>
              </Popover>}>
                <svg xmlns="http://www.w3.org/2000/svg" className="svg-primary me-4" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" /></svg>
              </OverlayTrigger>
              <OverlayTrigger trigger="click" placement="left" overlay={<Popover className="popover-secondary only-body" id="popover-basic">
                <Popover.Body> And here's some <strong>amazing</strong> content. It's very engaging. right? </Popover.Body>
              </Popover>}>
                <svg xmlns="http://www.w3.org/2000/svg" className="svg-secondary me-4" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
              </OverlayTrigger>
            </Card.Body>
            <div className={`${isHidden[5] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <OverlayTrigger trigger="click" placement="top" overlay={<Popover className="popover-primary only-body" id="popover-basic">
        <Popover.Body> And here's some <strong>amazing</strong> content. It's very engaging. right? </Popover.Body>
      </Popover>}>
        <svg xmlns="http://www.w3.org/2000/svg" className="svg-primary me-4" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" /></svg>
      </OverlayTrigger>
      <OverlayTrigger trigger="click" placement="left" overlay={<Popover className="popover-secondary only-body" id="popover-basic">
        <Popover.Body> And here's some <strong>amazing</strong> content. It's very engaging. right? </Popover.Body>
      </Popover>}>
        <svg xmlns="http://www.w3.org/2000/svg" className="svg-secondary me-4" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
      </OverlayTrigger>
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

export default Popovers;
