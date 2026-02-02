import { Fragment, useState } from 'react'
import { Button, ButtonGroup, ButtonToolbar, Card, Col, Dropdown, DropdownButton, Form, InputGroup, Row, ToggleButton } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Radio, Radiovertical } from '../../common/Comondata';
import Pageheader from '../../layouts/Pageheader'

const Buttongroup = () => {
  const [radioValue, setRadioValue] = useState('1');
  const [verticalradioValue, setVerticalRadioValue] = useState('1');

  //showcode

  const [isHidden, setIsHidden] = useState([false]);
  const toggleHidden = (index) => {
    const updatedHidden = [...isHidden];
    updatedHidden[index] = !updatedHidden[index];
    setIsHidden(updatedHidden);
  };

  return (
    <Fragment>
      <Pageheader mainheading='Button groups' parentfolder='Elements' activepage='Button groups' />

      <Row className="row-sm">
        <Col xl={3}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Basic example
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(0)}>Show Code<i className={`${isHidden[0] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>
              <ButtonGroup role="group" aria-label="Basic example">
                <Button variant='info' className="btn-wave"><i className="bi bi-skip-backward"></i></Button>
                <Button variant='info' className="btn-wave"><i className="bi bi-pause"></i></Button>
                <Button variant='info' className="btn-wave"><i className="bi bi-skip-forward"></i></Button>
              </ButtonGroup>
            </Card.Body>
            <div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ButtonGroup role="group" aria-label="Basic example">
                <Button variant='info' className="btn-wave"><i className="bi bi-skip-backward"></i></Button>
                <Button variant='info' className="btn-wave"><i className="bi bi-pause"></i></Button>
                <Button variant='info' className="btn-wave"><i className="bi bi-skip-forward"></i></Button>
              </ButtonGroup>
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
                Navigation
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(1)}>Show Code<i className={`${isHidden[1] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[1] ? 'd-none' : ''}`}>
              <ButtonGroup >
                <Link to="#" className="btn btn-primary active btn-wave" aria-current="page">Active link</Link>
                <Link to="#" className="btn btn-primary">Link</Link>
                <Link to="#" className="btn btn-primary">Link</Link>
              </ButtonGroup>
            </Card.Body>
            <div className={`${isHidden[1] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ButtonGroup >
                <Link to="#" className="btn btn-primary active btn-wave" aria-current="page">Active link</Link>
                <Link to="#" className="btn btn-primary">Link</Link>
                <Link to="#" className="btn btn-primary">Link</Link>
              </ButtonGroup>
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
                Mixed style
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(2)}>Show Code<i className={`${isHidden[2] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[2] ? 'd-none' : ''}`}>
              <ButtonGroup role="group" aria-label="Basic mixed styles example">
                <Button variant='danger' className="btn-wave">Left</Button>
                <Button variant='warning' className="btn-wave">Middle</Button>
                <Button variant='success' className="btn-wave">Right</Button>
              </ButtonGroup>
            </Card.Body>
            <div className={`${isHidden[2] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ButtonGroup role="group" aria-label="Basic mixed styles example">
        <Button variant='danger' className="btn-wave">Left</Button>
        <Button variant='warning' className="btn-wave">Middle</Button>
        <Button variant='success' className="btn-wave">Right</Button>
      </ButtonGroup>
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
                Outline styled
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(3)}>Show Code<i className={`${isHidden[3] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[3] ? 'd-none' : ''}`}>
              <ButtonGroup role="group" aria-label="Basic outlined example">
                <Button variant='outline-primary' className="btn-wave">Left</Button>
                <Button variant='outline-primary' className="btn-wave">Middle</Button>
                <Button variant='outline-primary' className="btn-wave">Right</Button>
              </ButtonGroup>
            </Card.Body>
            <div className={`${isHidden[3] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ButtonGroup role="group" aria-label="Basic outlined example">
        <Button variant='outline-primary' className="btn-wave">Left</Button>
        <Button variant='outline-primary' className="btn-wave">Middle</Button>
        <Button variant='outline-primary' className="btn-wave">Right</Button>
      </ButtonGroup>
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
                Checkbox button groups
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(4)}>Show Code<i className={`${isHidden[4] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[4] ? 'd-none' : ''} checkbox-button-group`}>
              <div className="btn-group" role="group" aria-label="Basic checkbox toggle button group">
                <input type="checkbox" className="btn-check" id="btncheck1" />
                <label className="btn btn-outline-primary" htmlFor="btncheck1">Checkbox 1</label>
                <input type="checkbox" className="btn-check" id="btncheck2" />
                <label className="btn btn-outline-primary" htmlFor="btncheck2">Checkbox 2</label>
                <input type="checkbox" className="btn-check" id="btncheck3" />
                <label className="btn btn-outline-primary" htmlFor="btncheck3">Checkbox 3</label>
              </div>
            </Card.Body>
            <div className={`${isHidden[4] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-group" role="group" aria-label="Basic checkbox toggle button group">
                <input type="checkbox" className="btn-check" id="btncheck1" />
                <label className="btn btn-outline-primary" htmlFor="btncheck1">Checkbox 1</label>
                <input type="checkbox" className="btn-check" id="btncheck2" />
                <label className="btn btn-outline-primary" htmlFor="btncheck2">Checkbox 2</label>
                <input type="checkbox" className="btn-check" id="btncheck3" />
                <label className="btn btn-outline-primary" htmlFor="btncheck3">Checkbox 3</label>
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
                Radio button groups
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(5)}>Show Code<i className={`${isHidden[5] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[5] ? 'd-none' : ''} radio-button-group`}>
              <ButtonGroup role="group" aria-label="Basic radio toggle button group">
                {Radio.map((radio, idx) => (
                  <ToggleButton
                    key={idx}
                    id={`radio-${idx}`}
                    type="radio"
                    variant="outline-primary"
                    name="radio"
                    value={radio.value}
                    checked={radioValue === radio.value}
                    onChange={(e) => setRadioValue(e.currentTarget.value)}
                  >
                    {radio.name}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            </Card.Body>
            <div className={`${isHidden[5] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ButtonGroup role="group" aria-label="Basic radio toggle button group">
        {Radio.map((radio, idx) => (
          <ToggleButton
            key={idx}
            id={\`radio-\${idx}\`}
            type="radio"
            variant="outline-primary"
            name="radio"
            value={radio.value}
            checked={radioValue === radio.value}
            onChange={(e) => setRadioValue(e.currentTarget.value)}
          >
            {radio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
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
                    Sizing
                  </div>
                  <div className="prism-toggle">
                    <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(6)}>Show Code<i className={`${isHidden[6] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                  </div>
                </Card.Header>
                <Card.Body className={`${isHidden[6] ? 'd-none' : ''} d-flex flex-wrap`}>
                  <ButtonGroup size='lg' role="group" className="my-1 me-2">
                    <Button variant='outline-success'>Left</Button>
                    <Button variant='outline-success'>Middle</Button>
                    <Button variant='outline-success'>Right</Button>
                  </ButtonGroup>

                  <ButtonGroup role="group" className="my-1 me-2">
                    <Button variant='outline-success'>Left</Button>
                    <Button variant='outline-success'>Middle</Button>
                    <Button variant='outline-success'>Right</Button>
                  </ButtonGroup>

                  <ButtonGroup size='sm' role="group" className='my-1 me-2'>
                    <Button variant='outline-success'>Left</Button>
                    <Button variant='outline-success'>Middle</Button>
                    <Button variant='outline-success'>Right</Button>
                  </ButtonGroup>
                </Card.Body>
                <div className={`${isHidden[6] ? '' : 'd-none'} card-footer border-top-0 `}>
                  <pre><code className='language-javascript'>
                    {`
        <Card.Body>
        <ButtonGroup size='lg' role="group" className="my-1 me-2">
                    <Button variant='outline-success'>Left</Button>
                    <Button variant='outline-success'>Middle</Button>
                    <Button variant='outline-success'>Right</Button>
                  </ButtonGroup>

                  <ButtonGroup role="group" className="my-1 me-2">
                    <Button variant='outline-success'>Left</Button>
                    <Button variant='outline-success'>Middle</Button>
                    <Button variant='outline-success'>Right</Button>
                  </ButtonGroup>

                  <ButtonGroup size='sm' role="group" className='my-1 me-2'>
                    <Button variant='outline-success'>Left</Button>
                    <Button variant='outline-success'>Middle</Button>
                    <Button variant='outline-success'>Right</Button>
                  </ButtonGroup>
        </Card.Body>
                `}
                  </code></pre>
                </div>
              </Card>
            </Col> <Col xl={12}>
              <Card className="custom-card">
                <Card.Header className="justify-content-between">
                  <div className="card-title">
                    Button toolbar
                  </div>
                  <div className="prism-toggle">
                    <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(7)}>Show Code<i className={`${isHidden[7] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                  </div>
                </Card.Header>
                <Card.Body className={`${isHidden[7] ? 'd-none' : ''}`}>
                  <ButtonToolbar aria-label="Toolbar with button groups">
                    <ButtonGroup className="my-2 me-2" aria-label="First group">
                      <Button>1</Button> <Button>2</Button> <Button>3</Button>{' '}
                      <Button>4</Button>
                    </ButtonGroup>
                    <ButtonGroup className="my-2 me-2" aria-label="Second group">
                      <Button variant='secondary'>5</Button> <Button variant='secondary'>6</Button> <Button variant='secondary'>7</Button>
                    </ButtonGroup>
                    <ButtonGroup className="my-2 me-2" aria-label="Third group">
                      <Button variant='info'>8</Button>
                    </ButtonGroup>
                  </ButtonToolbar>

                  <ButtonToolbar className="my-3 gap-2" aria-label="Toolbar with Button groups">
                    <ButtonGroup className="me-2" aria-label="First group">
                      <Button variant='outline-secondary'>1</Button>{' '}
                      <Button variant='outline-secondary'>2</Button>{' '}
                      <Button variant='outline-secondary'>3</Button>{' '}
                      <Button variant='outline-secondary'>4</Button>
                    </ButtonGroup>
                    <InputGroup>
                      <InputGroup.Text id="btnGroupAddon">@</InputGroup.Text>
                      <Form.Control type="text" placeholder="Input group example" aria-label="Input group example" aria-describedby="btnGroupAddon" />
                    </InputGroup>
                  </ButtonToolbar>
                  <ButtonToolbar className="justify-content-between gap-2" aria-label="Toolbar with Button groups" >
                    <ButtonGroup aria-label="First group">
                      <Button variant='outline-secondary'>1</Button>{' '}
                      <Button variant='outline-secondary'>2</Button>{' '}
                      <Button variant='outline-secondary'>3</Button>{' '}
                      <Button variant='outline-secondary'>4</Button>
                    </ButtonGroup>
                    <InputGroup>
                      <InputGroup.Text id="btnGroupAddon2">@</InputGroup.Text>
                      <Form.Control type="text" placeholder="Input group example" aria-label="Input group example" aria-describedby="btnGroupAddon2" />
                    </InputGroup>
                  </ButtonToolbar>
                </Card.Body>
                <div className={`${isHidden[7] ? '' : 'd-none'} card-footer border-top-0 `}>
                  <pre><code className='language-javascript'>
                    {`
        <Card.Body>
        <ButtonToolbar aria-label="Toolbar with button groups">
                    <ButtonGroup className="my-2 me-2" aria-label="First group">
                      <Button>1</Button> <Button>2</Button> <Button>3</Button>{' '}
                      <Button>4</Button>
                    </ButtonGroup>
                    <ButtonGroup className="my-2 me-2" aria-label="Second group">
                      <Button variant='secondary'>5</Button> <Button variant='secondary'>6</Button> <Button variant='secondary'>7</Button>
                    </ButtonGroup>
                    <ButtonGroup className="my-2 me-2" aria-label="Third group">
                      <Button variant='info'>8</Button>
                    </ButtonGroup>
                  </ButtonToolbar>

                  <ButtonToolbar className="my-3 gap-2" aria-label="Toolbar with Button groups">
                    <ButtonGroup className="me-2" aria-label="First group">
                      <Button variant='outline-secondary'>1</Button>{' '}
                      <Button variant='outline-secondary'>2</Button>{' '}
                      <Button variant='outline-secondary'>3</Button>{' '}
                      <Button variant='outline-secondary'>4</Button>
                    </ButtonGroup>
                    <InputGroup>
                      <InputGroup.Text id="btnGroupAddon">@</InputGroup.Text>
                      <Form.Control type="text" placeholder="Input group example" aria-label="Input group example" aria-describedby="btnGroupAddon" />
                    </InputGroup>
                  </ButtonToolbar>
                  <ButtonToolbar className="justify-content-between gap-2" aria-label="Toolbar with Button groups" >
                    <ButtonGroup aria-label="First group">
                      <Button variant='outline-secondary'>1</Button>{' '}
                      <Button variant='outline-secondary'>2</Button>{' '}
                      <Button variant='outline-secondary'>3</Button>{' '}
                      <Button variant='outline-secondary'>4</Button>
                    </ButtonGroup>
                    <InputGroup>
                      <InputGroup.Text id="btnGroupAddon2">@</InputGroup.Text>
                      <Form.Control type="text" placeholder="Input group example" aria-label="Input group example" aria-describedby="btnGroupAddon2" />
                    </InputGroup>
                  </ButtonToolbar>
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
                    Nesting
                  </div>
                  <div className="prism-toggle">
                    <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(8)}>Show Code<i className={`${isHidden[8] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                  </div>
                </Card.Header>
                <Card.Body className={`${isHidden[8] ? 'd-none' : ''}`}>
                  <ButtonGroup>
                    <Button>1</Button>
                    <Button>2</Button>

                    <DropdownButton as={ButtonGroup} title=" Dropdown " id="bg-nested-dropdown">
                      <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
                      <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
                    </DropdownButton>
                  </ButtonGroup>
                </Card.Body>
                <div className={`${isHidden[8] ? '' : 'd-none'} card-footer border-top-0 `}>
                  <pre><code className='language-javascript'>
                    {`
        <Card.Body>
        <ButtonGroup>
        <Button>1</Button>
        <Button>2</Button>

        <DropdownButton as={ButtonGroup} title=" Dropdown " id="bg-nested-dropdown">
          <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
          <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
        </DropdownButton>
      </ButtonGroup>
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
                    Vertical variation
                  </div>
                  <div className="prism-toggle">
                    <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(9)}>Show Code<i className={`${isHidden[9] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                  </div>
                </Card.Header>
                <Card.Body className={`${isHidden[9] ? 'd-none' : ''}`}>
                  <Row className="gap-2">
                    <Col sm={3}>
                      <ButtonGroup vertical>
                        <Button>Button</Button>
                        <Button>Button</Button>

                        <DropdownButton
                          as={ButtonGroup}
                          title=" Dropdown "
                          id="bg-vertical-dropdown-1"
                        >
                          <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
                          <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
                        </DropdownButton>

                        <Button>Button</Button>
                        <Button>Button</Button>

                        <DropdownButton
                          as={ButtonGroup}
                          title=" Dropdown "
                          id="bg-vertical-dropdown-2"
                        >
                          <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
                          <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
                        </DropdownButton>

                        <DropdownButton
                          as={ButtonGroup}
                          title=" Dropdown "
                          id="bg-vertical-dropdown-3"
                        >
                          <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
                          <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
                        </DropdownButton>
                      </ButtonGroup>
                    </Col>
                    <Col sm={3}>
                      <ButtonGroup vertical>
                        <Button variant="info">Button</Button>
                        <Button variant="info">Button</Button>
                        <Button variant="info">Button</Button>
                        <Button variant="info">Button</Button>
                        <Button variant="info">Button</Button>
                        <Button variant="info">Button</Button>
                      </ButtonGroup>
                    </Col>
                    <Col sm={3}>
                      <ButtonGroup vertical role="group" aria-label="Basic radio toggle button group">
                        {Radiovertical.map((radio, idx) => (
                          <ToggleButton
                            key={idx}
                            id={`radio-vertical-${idx}`}
                            type="radio"
                            variant="outline-danger"
                            name="radio-vertical"
                            value={radio.value}
                            checked={verticalradioValue === radio.value}
                            onChange={(e) => setVerticalRadioValue(e.currentTarget.value)}
                          >
                            {radio.name}
                          </ToggleButton>
                        ))}
                      </ButtonGroup>
                    </Col>
                  </Row>
                </Card.Body>
                <div className={`${isHidden[9] ? '' : 'd-none'} card-footer border-top-0 `}>
                  <pre><code className='language-javascript'>
                    {`
        <Card.Body>
        <Row className="gap-2">
                    <Col sm={3}>
                      <ButtonGroup vertical>
                        <Button>Button</Button>
                        <Button>Button</Button>

                        <DropdownButton
                          as={ButtonGroup}
                          title=" Dropdown "
                          id="bg-vertical-dropdown-1"
                        >
                          <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
                          <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
                        </DropdownButton>

                        <Button>Button</Button>
                        <Button>Button</Button>

                        <DropdownButton
                          as={ButtonGroup}
                          title=" Dropdown "
                          id="bg-vertical-dropdown-2"
                        >
                          <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
                          <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
                        </DropdownButton>

                        <DropdownButton
                          as={ButtonGroup}
                          title=" Dropdown "
                          id="bg-vertical-dropdown-3"
                        >
                          <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
                          <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
                        </DropdownButton>
                      </ButtonGroup>
                    </Col>
                    <Col sm={3}>
                      <ButtonGroup vertical>
                        <Button variant="info">Button</Button>
                        <Button variant="info">Button</Button>
                        <Button variant="info">Button</Button>
                        <Button variant="info">Button</Button>
                        <Button variant="info">Button</Button>
                        <Button variant="info">Button</Button>
                      </ButtonGroup>
                    </Col>
                    <Col sm={3}>
                      <ButtonGroup vertical role="group" aria-label="Basic radio toggle button group">
                        {Radiovertical.map((radio, idx) => (
                          <ToggleButton
                            key={idx}
                            id={\`radio-vertical-\${idx}\`}
                            type="radio"
                            variant="outline-danger"
                            name="radio-vertical"
                            value={radio.value}
                            checked={\verticalradioValue === radio.value}
                            onChange={(e) => setVerticalRadioValue(e.currentTarget.value)}
                          >
                            {radio.name}
                          </ToggleButton>
                        ))}
                      </ButtonGroup>
                    </Col>
                  </Row>
        </Card.Body>
                `}
                  </code></pre>
                </div>
              </Card>
            </Col>
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header className="justify-content-between">
                  <div className="card-title">Social Group Buttons</div>
                  <div className="prism-toggle">
                    <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(10)}>Show Code<i className={`${isHidden[10] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                  </div>
                </Card.Header>
                <Card.Body className={`${isHidden[10] ? 'd-none' : ''}`}>
                  <ButtonGroup role="group" aria-label="Basic example">
                    <Button variant='facebook' className="btn-wave"><i className="ri-facebook-line"></i></Button>
                    <Button variant='twitter' className="btn-wave"><i className="ri-twitter-x-fill"></i></Button>
                    <Button variant='instagram' className="btn-wave"><i className="ri-instagram-line"></i></Button>
                    <Button variant='github' className="btn-wave"><i className="ri-github-line"></i></Button>
                    <Button variant='youtube' className="btn-wave"><i className="ri-youtube-line"></i></Button>
                    <Button variant='google' className="btn-wave"><i className="ri-google-line"></i></Button>
                  </ButtonGroup>
                </Card.Body>
                <div className={`${isHidden[10] ? '' : 'd-none'} card-footer border-top-0 `}>
                  <pre><code className='language-javascript'>
                    {`
        <Card.Body>
        <ButtonGroup role="group" aria-label="Basic example">
                    <Button variant='facebook' className="btn-wave"><i className="ri-facebook-line"></i></Button>
                    <Button variant='twitter' className="btn-wave"><i className="ri-twitter-x-fill"></i></Button>
                    <Button variant='instagram' className="btn-wave"><i className="ri-instagram-line"></i></Button>
                    <Button variant='github' className="btn-wave"><i className="ri-github-line"></i></Button>
                    <Button variant='youtube' className="btn-wave"><i className="ri-youtube-line"></i></Button>
                    <Button variant='google' className="btn-wave"><i className="ri-google-line"></i></Button>
                  </ButtonGroup>
        </Card.Body>
                `}
                  </code></pre>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

    </Fragment >
  )
}

export default Buttongroup;
