import { Fragment, useState } from "react"
import { Button, ButtonGroup, Card, Col, Dropdown, DropdownButton, DropdownDivider, Form, Row, SplitButton } from "react-bootstrap"
import { DropData } from "../../common/Comondata"
import { Link } from "react-router-dom"
import Pageheader from "../../layouts/Pageheader"

const DropDowns = () => {

  //showcode

  const [isHidden, setIsHidden] = useState([false]);
  const toggleHidden = (index) => {
    const updatedHidden = [...isHidden];
    updatedHidden[index] = !updatedHidden[index];
    setIsHidden(updatedHidden);
  };

  return (
    <Fragment>
      <Pageheader mainheading='Dropdowns' parentfolder='Elements' activepage='Dropdowns' />

      <Row className="row-sm">
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">Split buttons</div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(0)}>Show Code<i className={`${isHidden[0] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>
              {['primary', 'secondary', 'info', 'success', 'warning', 'danger'].map((variant, index) => (
                <Dropdown key={index} as={ButtonGroup} className="my-1 me-2">
                  <Button variant={variant}>Action</Button>
                  <Dropdown.Toggle split variant={variant} id={`dropdown-split-${variant}`} />
                  <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Something else here</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ))}
            </Card.Body>
            <div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        {['primary', 'secondary', 'info', 'success', 'warning', 'danger'].map((variant, index) => (
          <Dropdown key={index} as={ButtonGroup} className="my-1 me-2">
            <Button variant={variant}>Action</Button>
            <Dropdown.Toggle split variant={variant} id={\`dropdown-split-\${variant}\`} />
            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Something else here</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
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
                Dropdown Sizing
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(1)}>Show Code<i className={`${isHidden[1] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[1] ? 'd-none' : ''}`}>
              {[DropdownButton, SplitButton].map((DropdownType, idx) => (
                <DropdownType
                  as={ButtonGroup}
                  key={idx}
                  id={`dropdown-button-drop-${idx}`}
                  size="lg"
                  className="me-2 my-2"
                  variant={DropdownType === DropdownButton ? 'primary' : 'light'}
                  title={DropdownType === DropdownButton ? 'Large Button' : 'Large Split Button'}
                >
                  <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                  <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                  <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                </DropdownType>
              ))}

              {[DropdownButton, SplitButton].map((DropdownType, idx) => (
                <DropdownType
                  as={ButtonGroup}
                  key={idx}
                  id={`dropdown-button-drop-${idx}`}
                  size="sm"
                  className="me-2 my-2"
                  variant={DropdownType === DropdownButton ? 'primary' : 'light'}
                  title={DropdownType === DropdownButton ? 'Small Button' : 'Small Split Button'}
                >
                  <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                  <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                  <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                </DropdownType>
              ))}
            </Card.Body>
            <div className={`${isHidden[1] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        {[DropdownButton, SplitButton].map((DropdownType, idx) => (
          <DropdownType
            as={ButtonGroup}
            key={idx}
            id={\`dropdown-button-drop-\${idx}\`}
            size="lg"
            className="me-2 my-2"
            variant={DropdownType === DropdownButton ? 'primary' : 'light'}
            title={DropdownType === DropdownButton ? 'Large Button' : 'Large Split Button'}
          >
            <Dropdown.Item eventKey="1">Action</Dropdown.Item>
            <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
            <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
          </DropdownType>
        ))}

        {[DropdownButton, SplitButton].map((DropdownType, idx) => (
          <DropdownType
            as={ButtonGroup}
            key={idx}
            id={\`dropdown-button-drop-\${idx}\`}
            size="sm"
            className="me-2 my-2"
            variant={DropdownType === DropdownButton ? 'primary' : 'light'}
            title={DropdownType === DropdownButton ? 'Small Button' : 'Small Split Button'}
          >
            <Dropdown.Item eventKey="1">Action</Dropdown.Item>
            <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
            <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
          </DropdownType>
        ))}
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <Col xl={3}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Dropup
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(2)}>Show Code<i className={`${isHidden[2] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[2] ? 'd-none' : ''}`}>
              {['up'].map(
                (direction) => (
                  <Fragment key={`dropdown-button-drop-${direction}`}>
                    <DropdownButton className="me-2 my-1" as={ButtonGroup} id={`dropdown-button-drop-${direction}`} drop={direction} variant="primary" title={` Drop ${direction} `}  >
                      <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                      <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                      <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                    </DropdownButton>

                    <SplitButton className="my-1" key={`split-button-drop-${direction}`} id={`split-button-drop-${direction}`} drop={direction} variant="info" title={`Split Drop ${direction}`} >
                      <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                      <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                      <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                    </SplitButton>
                  </Fragment>
                ),
              )}
            </Card.Body>
            <div className={`${isHidden[2] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        {['up'].map(
          (direction) => (
            <Fragment key={\`dropdown-button-drop-\${direction}\`}>
              <DropdownButton className="me-2 my-1" as={ButtonGroup} id={\`dropdown-button-drop-\${direction}\`} drop={direction} variant="primary" title={\` Drop \${direction} \`}  >
                <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
              </DropdownButton>

              <SplitButton className="my-1" key={\`split-button-drop-\${direction}\`} id={\`split-button-drop-\${direction}\`} drop={direction} variant="info" title={\`Split Drop \${direction}\`} >
                <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
              </SplitButton>
            </Fragment>
          ),
        )}
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
                Dropup right
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(3)}>Show Code<i className={`${isHidden[3] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[3] ? 'd-none' : ''}`}>
              {['end'].map(
                (direction) => (
                  <Fragment key={direction} >
                    <DropdownButton className="me-2 my-1" id={`dropdown-button-drop-${direction}`} as={ButtonGroup} drop={direction} variant="primary" title={` Drop ${direction} `} >
                      <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                      <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                      <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                    </DropdownButton>
                    <SplitButton className="my-1" key={direction} id={`dropdown-button-drop-${direction}`} drop={direction} variant="info" title={`Split Drop ${direction}`} >
                      <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                      <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                      <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                    </SplitButton>
                  </Fragment>
                ),
              )}
            </Card.Body>
            <div className={`${isHidden[3] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        {['end'].map(
          (direction) => (
            <Fragment key={direction} >
              <DropdownButton className="me-2 my-1" id={\`dropdown-button-drop-\${direction}\`} as={ButtonGroup} drop={direction} variant="primary" title={\` Drop \${direction} \`} >
                <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
              </DropdownButton>
              <SplitButton className="my-1" key={direction} id={\`dropdown-button-drop-\${direction}\`} drop={direction} variant="info" title={\`Split Drop \${direction}\`} >
                <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
              </SplitButton>
            </Fragment>
          ),
        )}
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
                Dropup left
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(4)}>Show Code<i className={`${isHidden[4] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[4] ? 'd-none' : ''}`}>
              {['start'].map(
                (direction) => (
                  <Fragment key={direction}>
                    <DropdownButton className="me-2 my-1" as={ButtonGroup} id={`dropdown-button-drop-${direction}`} drop={direction} variant="primary" title={` Drop ${direction} `} >
                      <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                      <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                      <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                    </DropdownButton>
                    <SplitButton className="my-1" key={direction} id={`dropdown-button-drop-${direction}`} drop={direction} variant="info" title={`Split Drop ${direction}`} >
                      <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                      <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                      <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                    </SplitButton>
                  </Fragment>
                ),
              )}
            </Card.Body>
            <div className={`${isHidden[4] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        {['start'].map(
          (direction) => (
            <Fragment key={direction}>
              <DropdownButton className="me-2 my-1" as={ButtonGroup} id={\`dropdown-button-drop-\${direction}\`} drop={direction} variant="primary" title={\` Drop \${direction} \`} >
                <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
              </DropdownButton>
              <SplitButton className="my-1" key={direction} id={\`dropdown-button-drop-\${direction}\`} drop={direction} variant="info" title={\`Split Drop \${direction}\`} >
                <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
              </SplitButton>
            </Fragment>
          ),
        )}
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
                Active
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(5)}>Show Code<i className={`${isHidden[5] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[5] ? 'd-none' : ''}`}>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  Drop start
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Regular Link</Dropdown.Item>
                  <Dropdown.Item href="#/action-2" active>Active Link</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Another Link</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Card.Body>
            <div className={`${isHidden[5] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          Drop start
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">Regular Link</Dropdown.Item>
          <Dropdown.Item href="#/action-2" active>Active Link</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Another Link</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
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
              <div className="card-title">Outline Button Dropdowns</div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(6)}>Show Code<i className={`${isHidden[6] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[6] ? 'd-none' : ''}`}>
              <div className="btn-list">
                {['Primary', 'Secondary', 'Success', 'Info', 'Warning', 'Danger'].map(
                  (variant) => (
                    <DropdownButton as={ButtonGroup} key={variant} id={`dropdown-variants-${variant}`} variant={`outline-${variant.toLowerCase()}`} title={variant} >
                      <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                      <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                      <Dropdown.Item eventKey="2">Something else here</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                    </DropdownButton>
                  ),
                )}
              </div>
            </Card.Body>
            <div className={`${isHidden[6] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
                {['Primary', 'Secondary', 'Success', 'Info', 'Warning', 'Danger'].map(
                  (variant) => (
                    <DropdownButton as={ButtonGroup} key={variant} id={\`dropdown-variants-\${variant}\`} variant={\`outline-\${variant.toLowerCase()}\`} title={variant} >
                      <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                      <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                      <Dropdown.Item eventKey="2">Something else here</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                    </DropdownButton>
                  ),
                )}
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
              <div className="card-title">Rounded Outline Dropdowns</div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(7)}>Show Code<i className={`${isHidden[7] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[7] ? 'd-none' : ''}`}>
              <div className="btn-list">
                {['Primary', 'Secondary', 'Success', 'Info', 'Warning', 'Danger'].map(
                  (variant) => (
                    <Dropdown key={variant} className="btn-group">
                      <Dropdown.Toggle variant={`outline-${variant.toLowerCase()}`} className="rounded-pill" id={`dropdown-variants-${variant}`}> {variant} </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">Something else here</Dropdown.Item>
                        <DropdownDivider />
                        <Dropdown.Item href="#/action-4">Separated link</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )
                )}
              </div>
            </Card.Body>
            <div className={`${isHidden[7] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
                {['Primary', 'Secondary', 'Success', 'Info', 'Warning', 'Danger'].map(
                  (variant) => (
                    <Dropdown key={variant} className="btn-group">
                      <Dropdown.Toggle variant={\`outline-\${variant.toLowerCase()}\`} className="rounded-pill" id={\`dropdown-variants-\${variant}\`}> {variant} </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">Something else here</Dropdown.Item>
                        <DropdownDivider />
                        <Dropdown.Item href="#/action-4">Separated link</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )
                )}
              </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <div className="col-xl-12">
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Dropdowns
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(8)}>Show Code<i className={`${isHidden[8] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[8] ? 'd-none' : ''}`}>
              <div className="btn-list d-flex align-items-center flex-wrap">
                {DropData.map((dropdown, index) => (
                  <DropdownButton variant={dropdown.color} key={index} id={dropdown.id} title={dropdown.title}>
                    {dropdown.items.map((item, itemIndex) => (
                      <Dropdown.Item key={itemIndex} href={item.href}>
                        {item.text}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                ))}
              </div>
            </Card.Body>
            <div className={`${isHidden[8] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list d-flex align-items-center flex-wrap">
                {DropData.map((dropdown, index) => (
                  <DropdownButton variant={dropdown.color} key={index} id={dropdown.id} title={dropdown.title}>
                    {dropdown.items.map((item, itemIndex) => (
                      <Dropdown.Item key={itemIndex} href={item.href}>
                        {item.text}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                ))}
              </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </div>
      </Row>

      <Row className="row-sm">
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">Single dropdown buttons</div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(9)}>Show Code<i className={`${isHidden[9] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[9] ? 'd-none' : ''}`}>
              <div className="btn-list">
                {['Primary', 'Secondary', 'Success', 'Info', 'Warning', 'Danger'].map((idx, index) => (
                  <DropdownButton className="btn-group" variant={idx.toLowerCase()} id="dropdown-basic-button" title={idx} key={index}>
                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href="#/action-3">Separated Link</Dropdown.Item>
                  </DropdownButton>
                ))}
              </div>
            </Card.Body>
            <div className={`${isHidden[9] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
        {['Primary', 'Secondary', 'Success', 'Info', 'Warning', 'Danger'].map((idx, index) => (
          <DropdownButton className="btn-group" variant={idx.toLowerCase()} id="dropdown-basic-button" title={idx} key={index}>
            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="#/action-3">Separated Link</Dropdown.Item>
          </DropdownButton>
        ))}
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
              <div className="card-title">Rounded Button Dropdowns</div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(10)}>Show Code<i className={`${isHidden[10] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[10] ? 'd-none' : ''}`}>
              <div className="btn-list">
                {['Primary', 'Secondary', 'Success', 'Info', 'Warning', 'Danger'].map((idx, index) => (
                  <Dropdown className="btn-group" key={index}>
                    <Dropdown.Toggle className="rounded-pill" variant={idx.toLowerCase()} id="dropdown-basic"> {idx} </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                      <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                      <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                ))}
              </div>
            </Card.Body>
            <div className={`${isHidden[10] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
                {['Primary', 'Secondary', 'Success', 'Info', 'Warning', 'Danger'].map((idx, index) => (
                  <Dropdown className="btn-group" key={index}>
                    <Dropdown.Toggle className="rounded-pill" variant={idx.toLowerCase()} id="dropdown-basic"> {idx} </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                      <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                      <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
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
        <Col xl={3}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Disabled
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(11)}>Show Code<i className={`${isHidden[11] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[11] ? 'd-none' : ''}`}>
              <DropdownButton as={ButtonGroup} id="dropdown-button-drop-up" variant="primary" title="Dropstart" >
                <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                <Dropdown.Item eventKey="2" disabled>Another action</Dropdown.Item>
                <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
              </DropdownButton>
            </Card.Body>
            <div className={`${isHidden[11] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <DropdownButton as={ButtonGroup} id="dropdown-button-drop-up" variant="primary" title="Dropstart" >
                <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                <Dropdown.Item eventKey="2" disabled>Another action</Dropdown.Item>
                <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
              </DropdownButton>
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
                Auto close behavior
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(12)}>Show Code<i className={`${isHidden[12] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[12] ? 'd-none' : ''}`}>
              <div className="btn-list">
                <Dropdown className="d-inline mx-2">
                  <Dropdown.Toggle id="dropdown-autoclose-true">
                    Default Dropdown
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>Menu Item</Dropdown.Item>
                    <Dropdown.Item>Menu Item</Dropdown.Item>
                    <Dropdown.Item>Menu Item</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown className="d-inline mx-2" autoClose="inside">
                  <Dropdown.Toggle variant="secondary" id="dropdown-autoclose-inside">
                    Clickable Outside
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>Menu Item</Dropdown.Item>
                    <Dropdown.Item>Menu Item</Dropdown.Item>
                    <Dropdown.Item>Menu Item</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown className="d-inline mx-2" autoClose="outside">
                  <Dropdown.Toggle variant="info" id="dropdown-autoclose-outside">
                    Clickable Inside
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>Menu Item</Dropdown.Item>
                    <Dropdown.Item>Menu Item</Dropdown.Item>
                    <Dropdown.Item>Menu Item</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown className="d-inline mx-2" autoClose={false}>
                  <Dropdown.Toggle variant="warning" id="dropdown-autoclose-false">
                    Manual Close
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>Menu Item</Dropdown.Item>
                    <Dropdown.Item>Menu Item</Dropdown.Item>
                    <Dropdown.Item>Menu Item</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Card.Body>
            <div className={`${isHidden[12] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
                <Dropdown className="d-inline mx-2">
                  <Dropdown.Toggle id="dropdown-autoclose-true">
                    Default Dropdown
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>Menu Item</Dropdown.Item>
                    <Dropdown.Item>Menu Item</Dropdown.Item>
                    <Dropdown.Item>Menu Item</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown className="d-inline mx-2" autoClose="inside">
                  <Dropdown.Toggle variant="secondary" id="dropdown-autoclose-inside">
                    Clickable Outside
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>Menu Item</Dropdown.Item>
                    <Dropdown.Item>Menu Item</Dropdown.Item>
                    <Dropdown.Item>Menu Item</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown className="d-inline mx-2" autoClose="outside">
                  <Dropdown.Toggle variant="info" id="dropdown-autoclose-outside">
                    Clickable Inside
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>Menu Item</Dropdown.Item>
                    <Dropdown.Item>Menu Item</Dropdown.Item>
                    <Dropdown.Item>Menu Item</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown className="d-inline mx-2" autoClose={false}>
                  <Dropdown.Toggle variant="warning" id="dropdown-autoclose-false">
                    Manual Close
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>Menu Item</Dropdown.Item>
                    <Dropdown.Item>Menu Item</Dropdown.Item>
                    <Dropdown.Item>Menu Item</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
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
                dropdowns with Forms
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(13)}>Show Code<i className={`${isHidden[13] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[13] ? 'd-none' : ''}`}>
              <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  Dropdown Button
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Form className="px-4 py-3">
                    <div className="mb-3">
                      <Form.Label htmlFor="exampleDropdownFormEmail1">Email address</Form.Label>
                      <Form.Control type="email" id="exampleDropdownFormEmail1" placeholder="email@example.com" />
                    </div>
                    <div className="mb-3">
                      <Form.Label htmlFor="exampleDropdownFormPassword1">Password</Form.Label>
                      <Form.Control type="password" id="exampleDropdownFormPassword1" placeholder="Password" />
                    </div>
                    <div className="mb-3">
                      <Form.Check type="checkbox" id="custom-switch" label="Remember me" />
                    </div>
                    <Button type="submit">Sign in</Button>
                  </Form>
                  <Dropdown.Divider />
                  <Dropdown.Item eventKey="4">New around here? Sign up</Dropdown.Item>
                  <Dropdown.Item eventKey="4">Forgot password?</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Card.Body>
            <div className={`${isHidden[13] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  Dropdown Button
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Form className="px-4 py-3">
                    <div className="mb-3">
                      <Form.Label htmlFor="exampleDropdownFormEmail1">Email address</Form.Label>
                      <Form.Control type="email" id="exampleDropdownFormEmail1" placeholder="email@example.com" />
                    </div>
                    <div className="mb-3">
                      <Form.Label htmlFor="exampleDropdownFormPassword1">Password</Form.Label>
                      <Form.Control type="password" id="exampleDropdownFormPassword1" placeholder="Password" />
                    </div>
                    <div className="mb-3">
                      <Form.Check type="checkbox" id="custom-switch" label="Remember me" />
                    </div>
                    <Button type="submit">Sign in</Button>
                  </Form>
                  <Dropdown.Divider />
                  <Dropdown.Item eventKey="4">New around here? Sign up</Dropdown.Item>
                  <Dropdown.Item eventKey="4">Forgot password?</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <Col xl={3}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Dropdown menu centered
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(14)}>Show Code<i className={`${isHidden[14] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[14] ? 'd-none' : ''}`}>
              <p className="card-title mb-3">Use <code>"down-centered"</code> on the parent element.</p>
              <DropdownButton as={ButtonGroup} id="dropdown-button-drop-down-centered" drop="down-centered" variant="secondary" title="Centered dropdown">
                <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
              </DropdownButton>
            </Card.Body>
            <div className={`${isHidden[14] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <DropdownButton as={ButtonGroup} id="dropdown-button-drop-down-centered" drop="down-centered" variant="secondary" title="Centered dropdown">
                <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
              </DropdownButton>
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
                Dropup centered
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(15)}>Show Code<i className={`${isHidden[15] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[15] ? 'd-none' : ''}`}>
              <p className="card-title mb-3">Use <code>"up-centered"</code> on the parent element.</p>
              <DropdownButton as={ButtonGroup} id="dropdown-button-drop-down-centered" drop="up-centered" variant="secondary" title="Centered dropup">
                <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
              </DropdownButton>
            </Card.Body>
            <div className={`${isHidden[15] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <p className="card-title mb-3">Use <code>"up-centered"</code> on the parent element.</p>
              <DropdownButton as={ButtonGroup} id="dropdown-button-drop-down-centered" drop="up-centered" variant="secondary" title="Centered dropup">
                <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
              </DropdownButton>
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
                Menu items
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(16)}>Show Code<i className={`${isHidden[16] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[16] ? 'd-none' : ''}`}>
              <p className="card-title mb-3">You can use <code>&lt;a&gt;</code> or <code>&lt;button&gt;</code> as dropdown items.</p>
              <Dropdown>
                <Dropdown.Toggle variant="info" id="dropdown-basic">Dropdown </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Card.Body>
            <div className={`${isHidden[16] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <p className="card-title mb-3">You can use <code>&lt;a&gt;</code> or <code>&lt;button&gt;</code> as dropdown items.</p>
              <Dropdown>
                <Dropdown.Toggle variant="info" id="dropdown-basic">Dropdown </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
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
                Dropdowns options
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(17)}>Show Code<i className={`${isHidden[17] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[17] ? 'd-none' : ''}`}>
              <p className="card-title mb-3">Use <code>data-bs-offset</code> or <code>data-bs-reference</code> to change
                the location of the dropdown.</p>
              <div className="d-flex align-items-center flex-wrap gap-2">
                <Dropdown className="me-1">
                  <Dropdown.Toggle variant="primary" id="dropdownMenuOffset">Offset</Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown as={ButtonGroup}>
                  <Button variant="info">Reference</Button>
                  <Dropdown.Toggle split variant="info" id="dropdown-split-basic" />
                  <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Card.Body>
            <div className={`${isHidden[17] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <p className="card-title mb-3">Use <code>data-bs-offset</code> or <code>data-bs-reference</code> to change
        the location of the dropdown.</p>
      <div className="d-flex align-items-center flex-wrap gap-2">
        <Dropdown className="me-1">
          <Dropdown.Toggle variant="primary" id="dropdownMenuOffset">Offset</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown as={ButtonGroup}>
          <Button variant="info">Reference</Button>
          <Dropdown.Toggle split variant="info" id="dropdown-split-basic" />
          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <div className="col-xl-9">
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Alignment options
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(18)}>Show Code<i className={`${isHidden[18] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[18] ? 'd-none' : ''}`}>
              <div className="btn-list">
                <Dropdown as={ButtonGroup}>
                  <Dropdown.Toggle variant="primary" id="dropdown-basic"> Dropdown Button </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Menu item</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Menu item</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Menu item</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <DropdownButton as={ButtonGroup} variant="secondary" align="end" title="Right Alligned Menu" id="dropdown-menu-align-end" >
                  <Dropdown.Item eventKey="1">Menu item</Dropdown.Item>
                  <Dropdown.Item eventKey="2">Menu item</Dropdown.Item>
                  <Dropdown.Item eventKey="3">Menu item</Dropdown.Item>
                </DropdownButton>


                {[{ color: "success", dir: 'Start' }, { color: "danger", dir: 'End' }, { color: "teal", dir: 'Up' }].map((item, index) => (
                  <DropdownButton as={ButtonGroup} key={index} drop={item.dir.toLowerCase()} variant={item.color} title={` Drop ${item.dir} `} >
                    <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                    <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                    <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                  </DropdownButton>
                ))}
              </div>
            </Card.Body>
            <div className={`${isHidden[18] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
        <Dropdown as={ButtonGroup}>
          <Dropdown.Toggle variant="primary" id="dropdown-basic"> Dropdown Button </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Menu item</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Menu item</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Menu item</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <DropdownButton as={ButtonGroup} variant="secondary" align="end" title="Right Alligned Menu" id="dropdown-menu-align-end" >
          <Dropdown.Item eventKey="1">Menu item</Dropdown.Item>
          <Dropdown.Item eventKey="2">Menu item</Dropdown.Item>
          <Dropdown.Item eventKey="3">Menu item</Dropdown.Item>
        </DropdownButton>


        {[{ color: "success", dir: 'Start' }, { color: "danger", dir: 'End' }, { color: "teal", dir: 'Up' }].map((item, index) => (
          <DropdownButton as={ButtonGroup} key={index} drop={item.dir.toLowerCase()} variant={item.color} title={\` Drop \${item.dir} \`} >
            <Dropdown.Item eventKey="1">Action</Dropdown.Item>
            <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
            <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
          </DropdownButton>
        ))}
      </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </div>
        <Col xl={3}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Dark Dropdowns
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(19)}>Show Code<i className={`${isHidden[19] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[19] ? 'd-none' : ''}`}>
              <Dropdown>
                <Dropdown.Toggle variant="dark" id="dropdown-basic"> Dropdown Button </Dropdown.Toggle>
                <Dropdown.Menu variant="dark">
                  <Dropdown.Item className="text-white" href="#/action-1">Action</Dropdown.Item>
                  <Dropdown.Item className="text-white" href="#/action-2">Another action</Dropdown.Item>
                  <Dropdown.Item className="text-white" href="#/action-3">Something else</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Card.Body>
            <div className={`${isHidden[19] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Dropdown>
        <Dropdown.Toggle variant="dark" id="dropdown-basic"> Dropdown Button </Dropdown.Toggle>
        <Dropdown.Menu variant="dark">
          <Dropdown.Item className="text-white" href="#/action-1">Action</Dropdown.Item>
          <Dropdown.Item className="text-white" href="#/action-2">Another action</Dropdown.Item>
          <Dropdown.Item className="text-white" href="#/action-3">Something else</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <div className="col-xl-4">
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Menu alignment
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(20)}>Show Code<i className={`${isHidden[20] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[20] ? 'd-none' : ''}`}>
              <DropdownButton align="end" title="Right-aligned menu example" id="dropdown-menu-align-end" >
                <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
              </DropdownButton>
            </Card.Body>
            <div className={`${isHidden[20] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <DropdownButton align="end" title="Right-aligned menu example" id="dropdown-menu-align-end" >
        <Dropdown.Item eventKey="1">Action</Dropdown.Item>
        <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
        <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
      </DropdownButton>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </div>
        <div className="col-xl-4">
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Responsive alignment end
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(21)}>Show Code<i className={`${isHidden[21] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[21] ? 'd-none' : ''} responsive-dropdown`}>
              <DropdownButton variant="secondary" as={ButtonGroup} align={{ lg: 'end' }} title="Left-aligned but right aligned when large screen" id="dropdown-menu-align-responsive-1" >
                <Dropdown.Item eventKey="1">Menu item</Dropdown.Item>
                <Dropdown.Item eventKey="2">Menu item</Dropdown.Item>
                <Dropdown.Item eventKey="2">Menu item</Dropdown.Item>
              </DropdownButton>
            </Card.Body>
            <div className={`${isHidden[21] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <DropdownButton variant="secondary" as={ButtonGroup} align={{ lg: 'end' }} title="Left-aligned but right aligned when large screen" id="dropdown-menu-align-responsive-1" >
        <Dropdown.Item eventKey="1">Menu item</Dropdown.Item>
        <Dropdown.Item eventKey="2">Menu item</Dropdown.Item>
        <Dropdown.Item eventKey="2">Menu item</Dropdown.Item>
      </DropdownButton>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </div>
        <div className="col-xl-4">
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Responsive alignment left
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(22)}>Show Code<i className={`${isHidden[22] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[22] ? 'd-none' : ''} responsive-dropdown`}>
              <DropdownButton variant="info" as={ButtonGroup} align={{ lg: 'start' }} title="Right-aligned but left aligned when large screen" id="dropdown-menu-align-responsive-1" >
                <Dropdown.Item eventKey="1">Menu item</Dropdown.Item>
                <Dropdown.Item eventKey="2">Menu item</Dropdown.Item>
                <Dropdown.Item eventKey="2">Menu item</Dropdown.Item>
              </DropdownButton>
            </Card.Body>
            <div className={`${isHidden[22] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <DropdownButton variant="info" as={ButtonGroup} align={{ lg: 'start' }} title="Right-aligned but left aligned when large screen" id="dropdown-menu-align-responsive-1" >
                <Dropdown.Item eventKey="1">Menu item</Dropdown.Item>
                <Dropdown.Item eventKey="2">Menu item</Dropdown.Item>
                <Dropdown.Item eventKey="2">Menu item</Dropdown.Item>
              </DropdownButton>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </div>
      </Row>

      <Row className="row-sm">
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Custom Dropdown Menu's
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(23)}>Show Code<i className={`${isHidden[23] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[23] ? 'd-none' : ''}`}>
              <div className="btn-list">
                <Dropdown className="btn-group">
                  <Dropdown.Toggle variant="primary" id="dropdown-basic">Primary</Dropdown.Toggle>
                  <Dropdown.Menu variant='primary'>
                    <Dropdown.Item className="text-fixed-white" href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item className="text-fixed-white" href="#/action-2">Another action</Dropdown.Item>
                    <Dropdown.Item className="text-fixed-white" href="#/action-3">Something else</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown className="btn-group">
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">Secondary</Dropdown.Toggle>
                  <Dropdown.Menu className='dropdown-menu-secondary'>
                    <Dropdown.Item className="text-fixed-white" href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item className="text-fixed-white" href="#/action-2">Another action</Dropdown.Item>
                    <Dropdown.Item className="text-fixed-white" href="#/action-3">Something else</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown className="btn-group">
                  <Dropdown.Toggle variant="warning" id="dropdown-basic">Warning</Dropdown.Toggle>
                  <Dropdown.Menu className="dropmenu-item-warning">
                    <Dropdown.Item active href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown className="btn-group">
                  <Dropdown.Toggle variant="info" id="dropdown-basic">Info</Dropdown.Toggle>
                  <Dropdown.Menu className="dropmenu-item-info">
                    <Dropdown.Item active href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown className="btn-group">
                  <Dropdown.Toggle variant="success" id="dropdown-basic">Success</Dropdown.Toggle>
                  <Dropdown.Menu className="dropmenu-light-success">
                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item active href="#/action-2">Another action</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown className="btn-group">
                  <Dropdown.Toggle variant="danger" id="dropdown-basic">Danger</Dropdown.Toggle>
                  <Dropdown.Menu className="dropmenu-light-danger">
                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item active href="#/action-2">Another action</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Card.Body>
            <div className={`${isHidden[23] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
        <Dropdown className="btn-group">
          <Dropdown.Toggle variant="primary" id="dropdown-basic">Primary</Dropdown.Toggle>
          <Dropdown.Menu variant='primary'>
            <Dropdown.Item className="text-fixed-white" href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item className="text-fixed-white" href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item className="text-fixed-white" href="#/action-3">Something else</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown className="btn-group">
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">Secondary</Dropdown.Toggle>
          <Dropdown.Menu className='dropdown-menu-secondary'>
            <Dropdown.Item className="text-fixed-white" href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item className="text-fixed-white" href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item className="text-fixed-white" href="#/action-3">Something else</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown className="btn-group">
          <Dropdown.Toggle variant="warning" id="dropdown-basic">Warning</Dropdown.Toggle>
          <Dropdown.Menu className="dropmenu-item-warning">
            <Dropdown.Item active href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown className="btn-group">
          <Dropdown.Toggle variant="info" id="dropdown-basic">Info</Dropdown.Toggle>
          <Dropdown.Menu className="dropmenu-item-info">
            <Dropdown.Item active href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown className="btn-group">
          <Dropdown.Toggle variant="success" id="dropdown-basic">Success</Dropdown.Toggle>
          <Dropdown.Menu className="dropmenu-light-success">
            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item active href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown className="btn-group">
          <Dropdown.Toggle variant="danger" id="dropdown-basic">Danger</Dropdown.Toggle>
          <Dropdown.Menu className="dropmenu-light-danger">
            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item active href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
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
                Ghost Button Dropdowns
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(24)}>Show Code<i className={`${isHidden[24] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[24] ? 'd-none' : ''}`}>
              <div className="btn-list">
                {['primary-ghost', 'secondary-ghost', 'success-ghost', 'info-ghost', 'warning-ghost', 'danger-ghost'].map((idx, index) => (
                  <Dropdown key={index} className="btn-group">
                    <Dropdown.Toggle variant={idx} id="dropdown-basic">{idx.replace('-ghost', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                      <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                      <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                ))}
              </div>
            </Card.Body>
            <div className={`${isHidden[24] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
                {['primary-ghost', 'secondary-ghost', 'success-ghost', 'info-ghost', 'warning-ghost', 'danger-ghost'].map((idx, index) => (
                  <Dropdown key={index} className="btn-group">
                    <Dropdown.Toggle variant={idx} id="dropdown-basic">{idx.replace('-ghost', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                      <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                      <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
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
        <Col xl={3}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                non-interactive dropdown items
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(25)}>Show Code<i className={`${isHidden[25] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[25] ? 'd-none' : ''}`}>
              <p className="card-title mb-3">Use <code>.dropdown-item-text.</code> to create non-interactive dropdown items.</p>
              <div className="bd-example">
                <ul className="dropdown-menu">
                  <li><span className="dropdown-item-text">Dropdown item text</span>
                  </li>
                  <li><a className="dropdown-item">Action</a></li>
                  <li><a className="dropdown-item">Another action</a></li>
                  <li><a className="dropdown-item">Something else here</a>
                  </li>
                </ul>
              </div>
            </Card.Body>
            <div className={`${isHidden[25] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <p className="card-title mb-3">Use <code>.dropdown-item-text.</code> to create non-interactive dropdown items.</p>
        <div className="bd-example">
          <ul className="dropdown-menu">
            <li><span className="dropdown-item-text">Dropdown item text</span>
            </li>
            <li><a className="dropdown-item">Action</a></li>
            <li><a className="dropdown-item">Another action</a></li>
            <li><a className="dropdown-item">Something else here</a>
            </li>
          </ul>
        </div>
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
                Dropdown Headers
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(26)}>Show Code<i className={`${isHidden[26] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[26] ? 'd-none' : ''}`}>
              <p className="card-titlte mb-3">Add a <code>.dropdown-header</code> to label sections of actions in any dropdown menu.</p>
              <div className="bd-example">
                <ul className="dropdown-menu">
                  <li>
                    <h6 className="dropdown-header">Dropdown header</h6>
                  </li>
                  <li><a className="dropdown-item">Action</a></li>
                  <li><a className="dropdown-item">Another action</a></li>
                  <li><a className="dropdown-item">Something else here</a></li>
                </ul>
              </div>
            </Card.Body>
            <div className={`${isHidden[26] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <p className="card-titlte mb-3">Add a <code>.dropdown-header</code> to label sections of actions in any dropdown menu.</p>
              <div className="bd-example">
                <ul className="dropdown-menu">
                  <li>
                    <h6 className="dropdown-header">Dropdown header</h6>
                  </li>
                  <li><a className="dropdown-item">Action</a></li>
                  <li><a className="dropdown-item">Another action</a></li>
                  <li><a className="dropdown-item">Something else here</a></li>
                </ul>
              </div>
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
                Dropdown Dividers
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(27)}>Show Code<i className={`${isHidden[27] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[27] ? 'd-none' : ''}`}>
              <div className="bd-example">
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-header" to="#">Heading</Link></li>
                  <li><Link className="dropdown-item" to="#">Action</Link></li>
                  <li><Link className="dropdown-item" to="#">Another action</Link></li>
                  <li><Link className="dropdown-item" to="#">Something else here</Link></li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li><Link className="dropdown-item" to="#">Separated link</Link></li>
                </ul>
              </div>
            </Card.Body>
            <div className={`${isHidden[27] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="bd-example">
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-header" to="#">Heading</Link></li>
                  <li><Link className="dropdown-item" to="#">Action</Link></li>
                  <li><Link className="dropdown-item" to="#">Another action</Link></li>
                  <li><Link className="dropdown-item" to="#">Something else here</Link></li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li><Link className="dropdown-item" to="#">Separated link</Link></li>
                </ul>
              </div>
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
                Dropdown Menu Text
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(28)}>Show Code<i className={`${isHidden[28] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[28] ? 'd-none' : ''}`}>
              <div className="bd-example">
                <div className="dropdown-menu p-4 text-muted" style={{ maxWidth: "200px" }}>
                  <p>
                    Some example text that's free-flowing within the dropdown menu.
                  </p>
                  <p className="mb-0">
                    And this is more example text.
                  </p>
                </div>
              </div>
            </Card.Body>
            <div className={`${isHidden[28] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="bd-example">
                <div className="dropdown-menu p-4 text-muted" style={{ maxWidth: "200px" }}>
                  <p>
                    Some example text that's free-flowing within the dropdown menu.
                  </p>
                  <p className="mb-0">
                    And this is more example text.
                  </p>
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

export default DropDowns;
