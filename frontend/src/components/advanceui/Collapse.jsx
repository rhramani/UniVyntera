import { Fragment, useState } from "react";
import { Card, useAccordionButton, Accordion, Button, Col, Row } from 'react-bootstrap';
import Pageheader from "../../layouts/Pageheader";

const Collapses = () => {
  function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
      console.log('totally custom!'),
    );
    return (
      <Button
        variant="primary"
        type="button"
        onClick={decoratedOnClick}
      >
        {children}
      </Button>
    );
  }
  let [isFirstCollapsed, setisFirstCollapsed] = useState(false);
  let [isSecondCollapsed, setisSecondCollapsed] = useState(false);

  let first = () => {
    if (isFirstCollapsed === false) {
      setisFirstCollapsed(true)
    }
    else if (isFirstCollapsed === true) {
      setisFirstCollapsed(false)
    }
  }
  let second = () => {

    if (isSecondCollapsed === true) {
      setisSecondCollapsed(false)
    }
    else if (isSecondCollapsed === false) {
      setisSecondCollapsed(true)
    }
  }
  let both = () => {
    if (isSecondCollapsed === true) {
      setisSecondCollapsed(false)
    }
    else if (isSecondCollapsed === false) {
      setisSecondCollapsed(true)
    }
    if (isFirstCollapsed === true) {
      setisFirstCollapsed(false)
    }
    else if (isFirstCollapsed === false) {
      setisFirstCollapsed(true)
    }
  }

  return (
    <Fragment>
<Pageheader mainheading='Accordions' parentfolder='Elements' activepage='Accordions' />


      {/* <!-- Row --> */}
      <div className="sidemenu-height">
        <Row className=" row-sm">
          <Col lg={12} md={12}>
            <Card className="custom-card">
              <Card.Body>
                <div>
                  <h6 className="main-content-label mb-1">Basic Example</h6>
                  <p className="text-muted card-sub-title">
                    Click the buttons below to show and hide another element via
                    className changes
                  </p>
                </div>

                <Accordion>
                  <Card>
                    <Card.Header>
                      <CustomToggle eventKey="1" className="btn ripple btn-primary me-2">Click me!</CustomToggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="1" className="card">
                      <Card.Body className="card card-body border mt-1"> Anim pariatur cliche reprehenderit, enim eiusmod high life
                        accusamus terry richardson ad squid. Nihil anim keffiyeh
                        helvetica, craft beer labore wes anderson cred nesciunt
                        sapiente ea proident.</Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={12} md={12}>
            <Card className="custom-card">
              <Card.Body>
                <div>
                  <h6 className="main-content-label mb-1">Multiple Targets</h6>
                  <p className="text-muted card-sub-title">
                    A button or link can show and hide multiple elements by
                    referencing them with a jquery selector in its href or
                    data-bs-target attribute.
                  </p>
                </div>
                <div>
                  <div className="btn-list">
                    <Button
                      variant="default" className="btn ripple btn-primary me-2" onClick={() => { first() }}>Toggle First Content</Button>
                    <Button
                      variant="default" className="btn ripple btn-secondary me-2" onClick={() => { second() }}>Toggle Second Content</Button>
                    <Button
                      variant="default" className="btn ripple btn-success me-2" onClick={() => { both() }}>Toggle Both Contents</Button>
                  </div>
                  <Row className=" row-sm" >

                    <div className="col-sm-6">
                      <div className=" mt-2">
                        {isFirstCollapsed ? (
                          <Card className="card card-body">
                            Anim pariatur cliche reprehenderit, enim eiusmod high
                            life accusamus terry richardson ad squid. Nihil anim
                            keffiyeh helvetica, craft beer labore wes anderson cred
                            nesciunt sapiente ea proident 1.
                          </Card>
                        ) : null
                        }
                      </div>
                    </div>


                    <div className="col-sm-6">
                      <div className=" mt-2">
                        {isSecondCollapsed ? (
                          <Card className="card card-body">
                            Anim pariatur cliche reprehenderit, enim eiusmod high
                            life accusamus terry richardson ad squid. Nihil anim
                            keffiyeh helvetica, craft beer labore wes anderson cred
                            nesciunt sapiente ea proident 2.
                          </Card>
                        ) : null}
                      </div>
                    </div>

                  </Row>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      {/* <!-- End Row --> */}
    </Fragment>
  )
};

export default Collapses;
