import { Fragment, useState } from "react";
import { Accordion, Button, Card, Col, Collapse, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Pageheader from './../../layouts/Pageheader';

const Accordions = () => {

  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

  const [isFirstCollapsed, setFirstCollapsed] = useState(false);
  const [isSecondCollapsed, setSecondCollapsed] = useState(false);

  const toggleFirst = () => setFirstCollapsed((prev) => !prev);
  const toggleSecond = () => setSecondCollapsed((prev) => !prev);
  const toggleBoth = () => { toggleFirst(); toggleSecond(); };

  //showcode

  const [isHidden, setIsHidden] = useState([false]);
  const toggleHidden = (index) => {
    const updatedHidden = [...isHidden];
    updatedHidden[index] = !updatedHidden[index];
    setIsHidden(updatedHidden);
  };

  return (
    <Fragment>
      <Pageheader mainheading='Accordions' parentfolder='Elements' activepage='Accordions' />

      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title"> Basic Accordion </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(0)}>Show Code<i className={`${isHidden[0] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>
              <Accordion defaultActiveKey={['0']}>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Accordion Item #1</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the first item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance, as
                    well as the showing and hiding via CSS transitions. You can modify any of this
                    with custom CSS or overriding our default variables. It's also worth noting that
                    just about any HTML can go within the <code>.accordion-body</code>, though the
                    transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Accordion Item #2</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the second item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance, as
                    well as the showing and hiding via CSS transitions. You can modify any of this
                    with custom CSS or overriding our default variables. It's also worth noting that
                    just about any HTML can go within the <code>.accordion-body</code>, though the
                    transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Accordion Item #3</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the third item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance, as
                    well as the showing and hiding via CSS transitions. You can modify any of this
                    with custom CSS or overriding our default variables. It's also worth noting that
                    just about any HTML can go within the <code>.accordion-body</code>, though the
                    transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
            <div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Accordion defaultActiveKey={['0']}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Accordion Item #1</Accordion.Header>
          <Accordion.Body>
            <strong>This is the first item's accordion body.</strong> It is shown by
            default, until the collapse plugin adds the appropriate classes that we
            use to style each element. These classes control the overall appearance, as
            well as the showing and hiding via CSS transitions. You can modify any of this
            with custom CSS or overriding our default variables. It's also worth noting that
            just about any HTML can go within the <code>.accordion-body</code>, though the
            transition does limit overflow.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Accordion Item #2</Accordion.Header>
          <Accordion.Body>
            <strong>This is the second item's accordion body.</strong> It is shown by
            default, until the collapse plugin adds the appropriate classes that we
            use to style each element. These classes control the overall appearance, as
            well as the showing and hiding via CSS transitions. You can modify any of this
            with custom CSS or overriding our default variables. It's also worth noting that
            just about any HTML can go within the <code>.accordion-body</code>, though the
            transition does limit overflow.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Accordion Item #3</Accordion.Header>
          <Accordion.Body>
            <strong>This is the third item's accordion body.</strong> It is shown by
            default, until the collapse plugin adds the appropriate classes that we
            use to style each element. These classes control the overall appearance, as
            well as the showing and hiding via CSS transitions. You can modify any of this
            with custom CSS or overriding our default variables. It's also worth noting that
            just about any HTML can go within the <code>.accordion-body</code>, though the
            transition does limit overflow.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
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
                Always Open Accordion
                <p className="text-muted subtitle fs-12 fw-normal">put the <code> defaultActiveKey </code>
                  which accodion-item you want to make put the eventkey in <code> defaultActiveKey </code> to make accordion items stay open when another item is opened.
                </p>
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(1)}>Show Code<i className={`${isHidden[1] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[1] ? 'd-none' : ''}`}>
              <Accordion defaultActiveKey={['0']} alwaysOpen>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Accordion Item #1</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the first item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance, as
                    well as the showing and hiding via CSS transitions. You can modify any of this
                    with custom CSS or overriding our default variables. It's also worth noting that
                    just about any HTML can go within the <code>.accordion-body</code>, though the
                    transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Accordion Item #2</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the second item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance, as
                    well as the showing and hiding via CSS transitions. You can modify any of this
                    with custom CSS or overriding our default variables. It's also worth noting that
                    just about any HTML can go within the <code>.accordion-body</code>, though the
                    transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Accordion Item #3</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the third item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance, as
                    well as the showing and hiding via CSS transitions. You can modify any of this
                    with custom CSS or overriding our default variables. It's also worth noting that
                    just about any HTML can go within the <code>.accordion-body</code>, though the
                    transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
            <div className={`${isHidden[1] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        <Accordion defaultActiveKey={['0']} alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Accordion Item #1</Accordion.Header>
          <Accordion.Body>
            <strong>This is the first item's accordion body.</strong> It is shown by
            default, until the collapse plugin adds the appropriate classes that we
            use to style each element. These classes control the overall appearance, as
            well as the showing and hiding via CSS transitions. You can modify any of this
            with custom CSS or overriding our default variables. It's also worth noting that
            just about any HTML can go within the <code>.accordion-body</code>, though the
            transition does limit overflow.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Accordion Item #2</Accordion.Header>
          <Accordion.Body>
            <strong>This is the second item's accordion body.</strong> It is shown by
            default, until the collapse plugin adds the appropriate classes that we
            use to style each element. These classes control the overall appearance, as
            well as the showing and hiding via CSS transitions. You can modify any of this
            with custom CSS or overriding our default variables. It's also worth noting that
            just about any HTML can go within the <code>.accordion-body</code>, though the
            transition does limit overflow.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Accordion Item #3</Accordion.Header>
          <Accordion.Body>
            <strong>This is the third item's accordion body.</strong> It is shown by
            default, until the collapse plugin adds the appropriate classes that we
            use to style each element. These classes control the overall appearance, as
            well as the showing and hiding via CSS transitions. You can modify any of this
            with custom CSS or overriding our default variables. It's also worth noting that
            just about any HTML can go within the <code>.accordion-body</code>, though the
            transition does limit overflow.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card overflow-hidden">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Flush Accordion
                <p className="subtitle text-muted fs-12 fw-normal">
                  Add <code>.accordion-flush </code> to remove the default
                  <code> background-color </code>,
                  some borders, and some rounded corners to render accordions edge-to-edge with
                  their
                  parent container.
                </p>
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(2)}>Show Code<i className={`${isHidden[2] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[2] ? 'd-none' : ''} p-0`}>
              <Accordion defaultActiveKey="0" flush>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Accordion Item #1</Accordion.Header>
                  <Accordion.Body>
                    Placeholder content for this accordion, which is intended to demonstrate the <code>flush</code> attribute. This is the first item's accordion body.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Accordion Item #2</Accordion.Header>
                  <Accordion.Body>
                    Placeholder content for this accordion, which is intended to demonstrate the <code>flush</code> attribute. This is the second item's accordion body.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Accordion Item #3</Accordion.Header>
                  <Accordion.Body>
                    Placeholder content for this accordion, which is intended to demonstrate the <code>flush</code> attribute. This is the third item's accordion body.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
            <div className={`${isHidden[2] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Accordion defaultActiveKey="0" flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Accordion Item #1</Accordion.Header>
          <Accordion.Body>
            Placeholder content for this accordion, which is intended to demonstrate the <code>flush</code> attribute. This is the first item's accordion body.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Accordion Item #2</Accordion.Header>
          <Accordion.Body>
            Placeholder content for this accordion, which is intended to demonstrate the <code>flush</code> attribute. This is the second item's accordion body.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Accordion Item #3</Accordion.Header>
          <Accordion.Body>
            Placeholder content for this accordion, which is intended to demonstrate the <code>flush</code> attribute. This is the third item's accordion body.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <h6 className="mb-3">Light Colors:</h6>
      <Row className="row-sm">
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Primary
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(3)}>Show Code<i className={`${isHidden[3] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[3] ? 'd-none' : ''}`}>
              <Accordion className="accordion-primary" defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Accordion Item #1</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the first item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Accordion Item #2</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the second item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Accordion Item #3</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the third item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
            <div className={`${isHidden[3] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Accordion className="accordion-primary" defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Accordion Item #1</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the first item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Accordion Item #2</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the second item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Accordion Item #3</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the third item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
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
                Secondary
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(4)}>Show Code<i className={`${isHidden[4] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[4] ? 'd-none' : ''}`}>
              <Accordion className="accordion-secondary" defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Accordion Item #1</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the first item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Accordion Item #2</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the second item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Accordion Item #3</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the third item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
            <div className={`${isHidden[4] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Accordion className="accordion-secondary" defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Accordion Item #1</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the first item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Accordion Item #2</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the second item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Accordion Item #3</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the third item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <h6 className="mb-3">Solid Colors:</h6>
      <Row className="row-sm">
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Primary
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(5)}>Show Code<i className={`${isHidden[5] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[5] ? 'd-none' : ''}`}>
              <Accordion className="accordion-solid-primary" defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Accordion Item #1</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the first item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Accordion Item #2</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the second item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Accordion Item #3</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the third item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
            <div className={`${isHidden[5] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Accordion className="accordion-solid-primary" defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Accordion Item #1</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the first item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Accordion Item #2</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the second item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Accordion Item #3</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the third item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
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
                Secondary
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(6)}>Show Code<i className={`${isHidden[6] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[6] ? 'd-none' : ''}`}>
              <Accordion className="accordion-solid-secondary" defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Accordion Item #1</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the first item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Accordion Item #2</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the second item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Accordion Item #3</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the third item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
            <div className={`${isHidden[6] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Accordion className="accordion-solid-secondary" defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Accordion Item #1</Accordion.Header>
          <Accordion.Body>
            <strong>This is the first item's accordion body.</strong> It is shown by
            default, until the collapse plugin adds the appropriate classes that we
            use to style each element. These classes control the overall appearance,
            as well as the showing and hiding via CSS transitions. You can modify
            any of this with custom CSS or overriding our default variables. It's
            also worth noting that just about any HTML can go within the
            <code>.accordion-body</code>, though the transition does limit overflow.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Accordion Item #2</Accordion.Header>
          <Accordion.Body>
            <strong>This is the second item's accordion body.</strong> It is shown by
            default, until the collapse plugin adds the appropriate classes that we
            use to style each element. These classes control the overall appearance,
            as well as the showing and hiding via CSS transitions. You can modify
            any of this with custom CSS or overriding our default variables. It's
            also worth noting that just about any HTML can go within the
            <code>.accordion-body</code>, though the transition does limit overflow.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Accordion Item #3</Accordion.Header>
          <Accordion.Body>
            <strong>This is the third item's accordion body.</strong> It is shown by
            default, until the collapse plugin adds the appropriate classes that we
            use to style each element. These classes control the overall appearance,
            as well as the showing and hiding via CSS transitions. You can modify
            any of this with custom CSS or overriding our default variables. It's
            also worth noting that just about any HTML can go within the
            <code>.accordion-body</code>, though the transition does limit overflow.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <h6 className="mb-3">Colored Borders:</h6>
      <Row className="row-sm">
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Primary
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(7)}>Show Code<i className={`${isHidden[7] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[7] ? 'd-none' : ''}`}>
              <Accordion className="accordion-border-primary accordions-items-seperate" defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Accordion Item #1</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the first item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Accordion Item #2</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the second item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Accordion Item #3</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the third item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
            <div className={`${isHidden[7] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Accordion className="accordion-border-primary accordions-items-seperate" defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Accordion Item #1</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the first item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Accordion Item #2</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the second item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Accordion Item #3</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the third item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
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
                Success
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(8)}>Show Code<i className={`${isHidden[8] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[8] ? 'd-none' : ''}`}>
              <Accordion className="accordion-border-success accordions-items-seperate" defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Accordion Item #1</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the first item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Accordion Item #2</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the second item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Accordion Item #3</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the third item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
            <div className={`${isHidden[8] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Accordion className="accordion-border-success accordions-items-seperate" defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Accordion Item #1</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the first item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Accordion Item #2</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the second item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Accordion Item #3</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the third item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
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
                Left Aligned Icons
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(9)}>Show Code<i className={`${isHidden[9] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[9] ? 'd-none' : ''}`}>
              <Accordion className="accordionicon-left accordions-items-seperate" defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Accordion Item #1</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the first item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Accordion Item #2</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the second item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Accordion Item #3</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the third item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
            <div className={`${isHidden[9] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Accordion className="accordionicon-left accordions-items-seperate" defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Accordion Item #1</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the first item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Accordion Item #2</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the second item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Accordion Item #3</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the third item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
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
                Without Icon
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(10)}>Show Code<i className={`${isHidden[10] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[10] ? 'd-none' : ''}`}>
              <Accordion className="accordionicon-none accordions-items-seperate" defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Accordion Item #1</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the first item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Accordion Item #2</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the second item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Accordion Item #3</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the third item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
            <div className={`${isHidden[10] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Accordion className="accordionicon-none accordions-items-seperate" defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Accordion Item #1</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the first item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Accordion Item #2</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the second item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Accordion Item #3</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the third item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
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
                Custom Icon Accordion
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(11)}>Show Code<i className={`${isHidden[11] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[11] ? 'd-none' : ''}`}>
              <Accordion className="accordion-customicon1 accordions-items-seperate" defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Accordion Item #1</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the first item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Accordion Item #2</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the second item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Accordion Item #3</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the third item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
            <div className={`${isHidden[11] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Accordion className="accordion-customicon1 accordions-items-seperate" defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Accordion Item #1</Accordion.Header>
          <Accordion.Body>
            <strong>This is the first item's accordion body.</strong> It is shown by
            default, until the collapse plugin adds the appropriate classes that we
            use to style each element. These classes control the overall appearance,
            as well as the showing and hiding via CSS transitions. You can modify
            any of this with custom CSS or overriding our default variables. It's
            also worth noting that just about any HTML can go within the
            <code>.accordion-body</code>, though the transition does limit overflow.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Accordion Item #2</Accordion.Header>
          <Accordion.Body>
            <strong>This is the second item's accordion body.</strong> It is shown by
            default, until the collapse plugin adds the appropriate classes that we
            use to style each element. These classes control the overall appearance,
            as well as the showing and hiding via CSS transitions. You can modify
            any of this with custom CSS or overriding our default variables. It's
            also worth noting that just about any HTML can go within the
            <code>.accordion-body</code>, though the transition does limit overflow.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Accordion Item #3</Accordion.Header>
          <Accordion.Body>
            <strong>This is the third item's accordion body.</strong> It is shown by
            default, until the collapse plugin adds the appropriate classes that we
            use to style each element. These classes control the overall appearance,
            as well as the showing and hiding via CSS transitions. You can modify
            any of this with custom CSS or overriding our default variables. It's
            also worth noting that just about any HTML can go within the
            <code>.accordion-body</code>, though the transition does limit overflow.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
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
                Custom Accordion
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(12)}>Show Code<i className={`${isHidden[12] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[12] ? 'd-none' : ''}`}>
              <Accordion className="customized-accordion accordions-items-seperate" defaultActiveKey="0">
                <Accordion.Item className="custom-accordion-primary" eventKey="0">
                  <Accordion.Header>Accordion Item #1</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the first item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item className="custom-accordion-secondary" eventKey="1">
                  <Accordion.Header>Accordion Item #2</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the second item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item className="custom-accordion-danger" eventKey="2">
                  <Accordion.Header>Accordion Item #3</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the third item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
            <div className={`${isHidden[12] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Accordion className="customized-accordion accordions-items-seperate" defaultActiveKey="0">
                <Accordion.Item className="custom-accordion-primary" eventKey="0">
                  <Accordion.Header>Accordion Item #1</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the first item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item className="custom-accordion-secondary" eventKey="1">
                  <Accordion.Header>Accordion Item #2</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the second item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item className="custom-accordion-danger" eventKey="2">
                  <Accordion.Header>Accordion Item #3</Accordion.Header>
                  <Accordion.Body>
                    <strong>This is the third item's accordion body.</strong> It is shown by
                    default, until the collapse plugin adds the appropriate classes that we
                    use to style each element. These classes control the overall appearance,
                    as well as the showing and hiding via CSS transitions. You can modify
                    any of this with custom CSS or overriding our default variables. It's
                    also worth noting that just about any HTML can go within the
                    <code>.accordion-body</code>, though the transition does limit overflow.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
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
                Example
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(13)}>Show Code<i className={`${isHidden[13] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[13] ? 'd-none' : ''}`}>
              <p className="mb-0">
                <Link className="btn btn-primary collapsed mb-2 me-2" to='#' onClick={() => setOpen(!open)}> Link with href </Link>
                <Button variant='secondary' className="collapsed mb-2" type="button" onClick={() => setOpen(!open)}> Button with data-bs-target </Button>
              </p>
              <Collapse in={open}>
                <div className="card card-body mb-0">
                  Some placeholder content for the collapse component. This panel
                  is
                  hidden by default but revealed when the user activates the
                  relevant
                  trigger.
                </div>
              </Collapse>
            </Card.Body>
            <div className={`${isHidden[13] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <p className="mb-0">
        <Link className="btn btn-primary collapsed mb-2 me-2" to='#' onClick={() => setOpen(!open)}> Link with href </Link>
        <Button variant='secondary' className="collapsed mb-2" type="button" onClick={() => setOpen(!open)}> Button with data-bs-target </Button>
      </p>
      <Collapse in={open}>
        <div className="card card-body mb-0">
          Some placeholder content for the collapse component. This panel
          is
          hidden by default but revealed when the user activates the
          relevant
          trigger.
        </div>
      </Collapse>
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
                Targets Collapse
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(14)}>Show Code<i className={`${isHidden[14] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[14] ? 'd-none' : ''}`}>
              <p className="mb-0">
                <Link className="btn btn-primary mb-2 me-2" to="#" role="button" onClick={toggleFirst}>
                  Toggle first element
                </Link>
                <Button variant="success" className="mb-2 me-2" type="button" onClick={toggleSecond}>
                  Toggle second element
                </Button>
                <Button variant="danger" className="mb-2" type="button" onClick={toggleBoth}>
                  Toggle both elements
                </Button>
              </p>
              <Row>
                <Col sm={6} className="col-12 my-1">
                  <Collapse in={isFirstCollapsed}>
                    <div className="multi-collapse">
                      <Card className="card-body mb-0">
                        Some placeholder content for the first collapse
                        component of this multi-collapse example. This panel is hidden by
                        default but revealed when the user activates the relevant trigger.
                      </Card>
                    </div>
                  </Collapse>
                </Col>
                <div className="col-12 col-sm-6 my-1">
                  <Collapse in={isSecondCollapsed}>
                    <div className="multi-collapse">
                      <Card className="card-body mb-0">
                        Some placeholder content for the second collapse
                        component of this multi-collapse example. This panel is hidden by
                        default but revealed when the user activates the relevant trigger.
                      </Card>
                    </div>
                  </Collapse>
                </div>
              </Row>
            </Card.Body>
            <div className={`${isHidden[14] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <p className="mb-0">
        <Link className="btn btn-primary mb-2 me-2" to="#" role="button" onClick={toggleFirst}>
          Toggle first element
        </Link>
        <Button variant="success" className="mb-2 me-2" type="button" onClick={toggleSecond}>
          Toggle second element
        </Button>
        <Button variant="danger" className="mb-2" type="button" onClick={toggleBoth}>
          Toggle both elements
        </Button>
      </p>
      <Row>
        <div className="col-12 col-sm-6 my-1">
          <Collapse in={isFirstCollapsed}>
            <div className="multi-collapse">
              <Card className="card-body mb-0">
                Some placeholder content for the first collapse
                component of this multi-collapse example. This panel is hidden by
                default but revealed when the user activates the relevant trigger.
              </Card>
            </div>
          </Collapse>
        </div>
        <div className="col-12 col-sm-6 my-1">
          <Collapse in={isSecondCollapsed}>
            <div className="multi-collapse">
              <Card className="card-body mb-0">
                Some placeholder content for the second collapse
                component of this multi-collapse example. This panel is hidden by
                default but revealed when the user activates the relevant trigger.
              </Card>
            </div>
          </Collapse>
        </div>
      </Row>
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
              <div className="card-title">Horizontal Collapse</div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(15)}>Show Code<i className={`${isHidden[15] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[15] ? 'd-none' : ''}`}>
              <Button onClick={() => setOpen1(!open1)} aria-controls="example-collapse-text" className="my-2" aria-expanded={open1}> Toggle width collapse </Button>
              <div style={{ minHeight: '50px' }}>
                <Collapse in={open1} dimension="width" className="collapse-horizontal">
                  <div id="example-collapse-text">
                    <Card body style={{ width: '230px' }}>
                      This is some placeholder content for a horizontal collapse. It's hidden by default and shown when triggered.
                    </Card>
                  </div>
                </Collapse>
              </div>
            </Card.Body>
            <div className={`${isHidden[15] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Button onClick={() => setOpen1(!open1)} aria-controls="example-collapse-text" className="my-2" aria-expanded={open1}> Toggle width collapse </Button>
              <div style={{ minHeight: '50px' }}>
                <Collapse in={open1} dimension="width" className="collapse-horizontal">
                  <div id="example-collapse-text">
                    <Card body style={{ width: '230px' }}>
                      This is some placeholder content for a horizontal collapse. It's hidden by default and shown when triggered.
                    </Card>
                  </div>
                </Collapse>
              </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>
    </Fragment >
  );
};

export default Accordions;
