import { Fragment, useState } from 'react'
import { Button, Card, Col, Dropdown, DropdownButton, Form, InputGroup, Row, SplitButton } from 'react-bootstrap'
import Pageheader from '../../../layouts/Pageheader'

const InputGroups = () => {

  //showcode

  const [isHidden, setisHidden] = useState([false]);
  const toggleHidden = (index) => {
    const updatedHidden = [...isHidden];
    updatedHidden[index] = !updatedHidden[index];
    setisHidden(updatedHidden);
  };

  return (
    <Fragment>
      <Pageheader mainheading='Input Group' parentfolder='Form Elements' activepage='Input Group' />

      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'> Input Groups </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(0)}>Show Code<i className={`${isHidden[0] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                <Form.Control placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
              </InputGroup>

              <InputGroup className="mb-3">
                <Form.Control placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                <InputGroup.Text id="basic-addon2">@example.com</InputGroup.Text>
              </InputGroup>

              <Form.Label htmlFor="basic-url">Your vanity URL</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon3"> https://example.com/users/ </InputGroup.Text>
                <Form.Control id="basic-url" aria-describedby="basic-addon3" />
              </InputGroup>

              <InputGroup className="mb-3">
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control aria-label="Amount (to the nearest dollar)" />
                <InputGroup.Text>.00</InputGroup.Text>
              </InputGroup>

              <InputGroup className="mb-3">
                <Form.Control type="text" placeholder='Username' aria-label="Username" />
                <InputGroup.Text>@</InputGroup.Text>
                <Form.Control type="text" placeholder="Server" aria-label="Server" />
              </InputGroup>

              <InputGroup>
                <InputGroup.Text>With textarea</InputGroup.Text>
                <Form.Control as="textarea" aria-label="With textarea" />
              </InputGroup>

            </Card.Body>
            <div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
        <Form.Control placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
      </InputGroup>

      <InputGroup className="mb-3">
        <Form.Control placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2" />
        <InputGroup.Text id="basic-addon2">@example.com</InputGroup.Text>
      </InputGroup>

      <Form.Label htmlFor="basic-url">Your vanity URL</Form.Label>
      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon3"> https://example.com/users/ </InputGroup.Text>
        <Form.Control id="basic-url" aria-describedby="basic-addon3" />
      </InputGroup>

      <InputGroup className="mb-3">
        <InputGroup.Text>$</InputGroup.Text>
        <Form.Control aria-label="Amount (to the nearest dollar)" />
        <InputGroup.Text>.00</InputGroup.Text>
      </InputGroup>

      <InputGroup className="mb-3">
        <Form.Control type="text" placeholder='Username' aria-label="Username" />
        <InputGroup.Text>@</InputGroup.Text>
        <Form.Control type="text" placeholder="Server" aria-label="Server" />
      </InputGroup>

      <InputGroup>
        <InputGroup.Text>With textarea</InputGroup.Text>
        <Form.Control as="textarea" aria-label="With textarea" />
      </InputGroup>
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
              <div className='card-title'> Warpping </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(1)}>Show Code<i className={`${isHidden[1] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[1] ? 'd-none' : ''}`}>
              <InputGroup className="flex-nowrap">
                <InputGroup.Text id="addon-wrapping">@</InputGroup.Text>
                <Form.Control type="text" placeholder="Username" aria-label="Username" aria-describedby="addon-wrapping" />
              </InputGroup>
            </Card.Body>
            <div className={`${isHidden[1] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <InputGroup className="flex-nowrap">
                <InputGroup.Text id="addon-wrapping">@</InputGroup.Text>
                <Form.Control type="text" placeholder="Username" aria-label="Username" aria-describedby="addon-wrapping" />
              </InputGroup>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <Col xl={6}>
          <Row>
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header className="justify-content-between">
                  <div className='card-title'> Sizing </div>
                  <div className="prism-toggle">
                    <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(2)}>Show Code<i className={`${isHidden[2] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                  </div>
                </Card.Header>
                <Card.Body className={`${isHidden[2] ? 'd-none' : ''}`}>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-sm">Small</InputGroup.Text>
                    <Form.Control aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-default"> Default </InputGroup.Text>
                    <Form.Control aria-label="Default" aria-describedby="inputGroup-sizing-default" />
                  </InputGroup>

                  <InputGroup size="lg">
                    <InputGroup.Text id="inputGroup-sizing-lg">Large</InputGroup.Text>
                    <Form.Control aria-label="Large" aria-describedby="inputGroup-sizing-sm" />
                  </InputGroup>
                </Card.Body>
                <div className={`${isHidden[2] ? '' : 'd-none'} card-footer border-top-0 `}>
                  <pre><code className='language-javascript'>
                    {`
        <Card.Body>
        <InputGroup size="sm" className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-sm">Small</InputGroup.Text>
                    <Form.Control aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-default"> Default </InputGroup.Text>
                    <Form.Control aria-label="Default" aria-describedby="inputGroup-sizing-default" />
                  </InputGroup>

                  <InputGroup size="lg">
                    <InputGroup.Text id="inputGroup-sizing-lg">Large</InputGroup.Text>
                    <Form.Control aria-label="Large" aria-describedby="inputGroup-sizing-sm" />
                  </InputGroup>
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
                  <div className='card-title'> Buttons addons </div>
                  <div className="prism-toggle">
                    <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(3)}>Show Code<i className={`${isHidden[3] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                  </div>
                </Card.Header>
                <Card.Body className={`${isHidden[3] ? 'd-none' : ''}`}>
                  <InputGroup className="mb-3">
                    <Button variant="primary" id="button-addon1"> Button </Button>
                    <Form.Control aria-label="Example text with button addon" aria-describedby="basic-addon1" />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <Form.Control placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                    <Button variant="primary" id="button-addon2"> Button </Button>
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <Button variant="primary">Button</Button>
                    <Button variant="primary">Button</Button>
                    <Form.Control aria-label="Example text with two button addons" />
                  </InputGroup>

                  <InputGroup>
                    <Form.Control placeholder="Recipient's username" aria-label="Recipient's username with two button addons" />
                    <Button variant="primary">Button</Button>
                    <Button variant="primary">Button</Button>
                  </InputGroup>
                </Card.Body>
                <div className={`${isHidden[3] ? '' : 'd-none'} card-footer border-top-0 `}>
                  <pre><code className='language-javascript'>
                    {`
        <Card.Body>
        <InputGroup className="mb-3">
        <Button variant="primary" id="button-addon1"> Button </Button>
        <Form.Control aria-label="Example text with button addon" aria-describedby="basic-addon1" />
      </InputGroup>

      <InputGroup className="mb-3">
        <Form.Control placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2" />
        <Button variant="primary" id="button-addon2"> Button </Button>
      </InputGroup>

      <InputGroup className="mb-3">
        <Button variant="primary">Button</Button>
        <Button variant="primary">Button</Button>
        <Form.Control aria-label="Example text with two button addons" />
      </InputGroup>

      <InputGroup>
        <Form.Control placeholder="Recipient's username" aria-label="Recipient's username with two button addons" />
        <Button variant="primary">Button</Button>
        <Button variant="primary">Button</Button>
      </InputGroup>
        </Card.Body>
                `}
                  </code></pre>
                </div>
              </Card>
            </Col>
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header className="justify-content-between">
                  <div className='card-title'> Buttons with dropdowns </div>
                  <div className="prism-toggle">
                    <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(4)}>Show Code<i className={`${isHidden[4] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                  </div>
                </Card.Header>
                <Card.Body className={`${isHidden[4] ? 'd-none' : ''}`}>
                  <InputGroup className="mb-3">
                    <DropdownButton variant="primary" title="Dropdown" id="input-group-dropdown-1" >
                      <Dropdown.Item>Action</Dropdown.Item>
                      <Dropdown.Item>Another action</Dropdown.Item>
                      <Dropdown.Item>Something else here</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item>Separated link</Dropdown.Item>
                    </DropdownButton>
                    <Form.Control aria-label="Text input with dropdown button" />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <Form.Control aria-label="Text input with dropdown button" />
                    <DropdownButton variant="outline-primary" title="Dropdown" id="input-group-dropdown-2" align="end" >
                      <Dropdown.Item>Action</Dropdown.Item>
                      <Dropdown.Item>Another action</Dropdown.Item>
                      <Dropdown.Item>Something else here</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item>Separated link</Dropdown.Item>
                    </DropdownButton>
                  </InputGroup>

                  <InputGroup>
                    <DropdownButton variant="primary-transparent" title="Dropdown" id="input-group-dropdown-3" >
                      <Dropdown.Item>Action</Dropdown.Item>
                      <Dropdown.Item>Another action</Dropdown.Item>
                      <Dropdown.Item>Something else here</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item>Separated link</Dropdown.Item>
                    </DropdownButton>
                    <Form.Control aria-label="Text input with 2 dropdown buttons" />
                    <DropdownButton variant="primary-transparent" title="Dropdown" id="input-group-dropdown-4" align="end" >
                      <Dropdown.Item>Action</Dropdown.Item>
                      <Dropdown.Item>Another action</Dropdown.Item>
                      <Dropdown.Item>Something else here</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item>Separated link</Dropdown.Item>
                    </DropdownButton>
                  </InputGroup>
                </Card.Body>
                <div className={`${isHidden[4] ? '' : 'd-none'} card-footer border-top-0 `}>
                  <pre><code className='language-javascript'>
                    {`
        <Card.Body>
        <InputGroup className="mb-3">
        <DropdownButton variant="primary" title="Dropdown" id="input-group-dropdown-1" >
          <Dropdown.Item>Action</Dropdown.Item>
          <Dropdown.Item>Another action</Dropdown.Item>
          <Dropdown.Item>Something else here</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Separated link</Dropdown.Item>
        </DropdownButton>
        <Form.Control aria-label="Text input with dropdown button" />
      </InputGroup>

      <InputGroup className="mb-3">
        <Form.Control aria-label="Text input with dropdown button" />
        <DropdownButton variant="outline-primary" title="Dropdown" id="input-group-dropdown-2" align="end" >
          <Dropdown.Item>Action</Dropdown.Item>
          <Dropdown.Item>Another action</Dropdown.Item>
          <Dropdown.Item>Something else here</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Separated link</Dropdown.Item>
        </DropdownButton>
      </InputGroup>

      <InputGroup>
        <DropdownButton variant="primary-transparent" title="Dropdown" id="input-group-dropdown-3" >
          <Dropdown.Item>Action</Dropdown.Item>
          <Dropdown.Item>Another action</Dropdown.Item>
          <Dropdown.Item>Something else here</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Separated link</Dropdown.Item>
        </DropdownButton>
        <Form.Control aria-label="Text input with 2 dropdown buttons" />
        <DropdownButton variant="primary-transparent" title="Dropdown" id="input-group-dropdown-4" align="end" >
          <Dropdown.Item>Action</Dropdown.Item>
          <Dropdown.Item>Another action</Dropdown.Item>
          <Dropdown.Item>Something else here</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Separated link</Dropdown.Item>
        </DropdownButton>
      </InputGroup>
        </Card.Body>
                `}
                  </code></pre>
                </div>
              </Card>
            </Col>
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header className="justify-content-between">
                  <div className='card-title'>
                    Custom file input
                  </div>

                  <div className="prism-toggle">
                    <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(5)}>Show Code<i className={`${isHidden[5] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                  </div>
                </Card.Header>
                <Card.Body className={`${isHidden[5] ? 'd-none' : ''}`}>
                  <div className="input-group mb-3">
                    <label className="input-group-text" htmlFor="inputGroupFile01">Upload</label>
                    <input type="file" className="form-control" id="inputGroupFile01" />
                  </div>

                  <div className="input-group mb-3">
                    <input type="file" className="form-control" id="inputGroupFile02" />
                    <label className="input-group-text" htmlFor="inputGroupFile02">Upload</label>
                  </div>

                  <div className="input-group mb-3">
                    <button className="btn btn-primary" type="button"
                      id="inputGroupFileAddon03">Button</button>
                    <input type="file" className="form-control" id="inputGroupFile03"
                      aria-describedby="inputGroupFileAddon03" aria-label="Upload" />
                  </div>

                  <div className="input-group">
                    <input type="file" className="form-control" id="inputGroupFile04"
                      aria-describedby="inputGroupFileAddon04" aria-label="Upload" />
                    <button className="btn btn-primary" type="button"
                      id="inputGroupFileAddon04">Button</button>
                  </div>
                </Card.Body>
                <div className={`${isHidden[5] ? '' : 'd-none'} card-footer border-top-0 `}>
                  <pre><code className='language-javascript'>
                    {`
        <Card.Body>
        <div className="input-group mb-3">
                    <label className="input-group-text" htmlFor="inputGroupFile01">Upload</label>
                    <input type="file" className="form-control" id="inputGroupFile01" />
                  </div>

                  <div className="input-group mb-3">
                    <input type="file" className="form-control" id="inputGroupFile02" />
                    <label className="input-group-text" htmlFor="inputGroupFile02">Upload</label>
                  </div>

                  <div className="input-group mb-3">
                    <button className="btn btn-primary" type="button"
                      id="inputGroupFileAddon03">Button</button>
                    <input type="file" className="form-control" id="inputGroupFile03"
                      aria-describedby="inputGroupFileAddon03" aria-label="Upload" />
                  </div>

                  <div className="input-group">
                    <input type="file" className="form-control" id="inputGroupFile04"
                      aria-describedby="inputGroupFileAddon04" aria-label="Upload" />
                    <button className="btn btn-primary" type="button"
                      id="inputGroupFileAddon04">Button</button>
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
          <Row>
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header className="justify-content-between">
                  <div className='card-title'>
                    Multiple inputs
                  </div>

                  <div className="prism-toggle">
                    <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(6)}>Show Code<i className={`${isHidden[6] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                  </div>
                </Card.Header>
                <Card.Body className={`${isHidden[6] ? 'd-none' : ''}`}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>First and last name</InputGroup.Text>
                    <Form.Control aria-label="First name" />
                    <Form.Control aria-label="Last name" />
                  </InputGroup>
                </Card.Body>
                <div className={`${isHidden[6] ? '' : 'd-none'} card-footer border-top-0 `}>
                  <pre><code className='language-javascript'>
                    {`
        <Card.Body>
        <InputGroup className="mb-3">
        <InputGroup.Text>First and last name</InputGroup.Text>
        <Form.Control aria-label="First name" />
        <Form.Control aria-label="Last name" />
      </InputGroup>
        </Card.Body>
                `}
                  </code></pre>
                </div>
              </Card>
            </Col>
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header className="justify-content-between">
                  <div className='card-title'> Checkboxes and radios </div>
                  <div className="prism-toggle">
                    <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(7)}>Show Code<i className={`${isHidden[7] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                  </div>
                </Card.Header>
                <Card.Body className={`${isHidden[7] ? 'd-none' : ''}`}>
                  <InputGroup className="mb-3">
                    <InputGroup.Checkbox aria-label="Checkbox for following text input" />
                    <Form.Control aria-label="Text input with checkbox" />
                  </InputGroup>
                  <InputGroup>
                    <InputGroup.Radio aria-label="Radio button for following text input" />
                    <Form.Control aria-label="Text input with radio button" />
                  </InputGroup>
                </Card.Body>
                <div className={`${isHidden[7] ? '' : 'd-none'} card-footer border-top-0 `}>
                  <pre><code className='language-javascript'>
                    {`
        <Card.Body>
        <InputGroup className="mb-3">
        <InputGroup.Checkbox aria-label="Checkbox for following text input" />
        <Form.Control aria-label="Text input with checkbox" />
      </InputGroup>
      <InputGroup>
        <InputGroup.Radio aria-label="Radio button for following text input" />
        <Form.Control aria-label="Text input with radio button" />
      </InputGroup>
        </Card.Body>
                `}
                  </code></pre>
                </div>
              </Card>
            </Col>
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header className="justify-content-between">
                  <div className='card-title'> Multiple addons </div>
                  <div className="prism-toggle">
                    <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(8)}>Show Code<i className={`${isHidden[8] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                  </div>
                </Card.Header>
                <Card.Body className={`${isHidden[8] ? 'd-none' : ''}`}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>$</InputGroup.Text>
                    <InputGroup.Text>0.00</InputGroup.Text>
                    <Form.Control aria-label="Dollar amount (with dot and two decimal places)" />
                  </InputGroup>
                  <InputGroup>
                    <Form.Control aria-label="Dollar amount (with dot and two decimal places)" />
                    <InputGroup.Text>$</InputGroup.Text>
                    <InputGroup.Text>0.00</InputGroup.Text>
                  </InputGroup>
                </Card.Body>
                <div className={`${isHidden[8] ? '' : 'd-none'} card-footer border-top-0 `}>
                  <pre><code className='language-javascript'>
                    {`
        <Card.Body>
        <InputGroup className="mb-3">
        <InputGroup.Text>$</InputGroup.Text>
        <InputGroup.Text>0.00</InputGroup.Text>
        <Form.Control aria-label="Dollar amount (with dot and two decimal places)" />
      </InputGroup>
      <InputGroup>
        <Form.Control aria-label="Dollar amount (with dot and two decimal places)" />
        <InputGroup.Text>$</InputGroup.Text>
        <InputGroup.Text>0.00</InputGroup.Text>
      </InputGroup>
        </Card.Body>
                `}
                  </code></pre>
                </div>
              </Card>
            </Col>
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header className="justify-content-between">
                  <div className='card-title'> Segmented buttons </div>

                  <div className="prism-toggle">
                    <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(9)}>Show Code<i className={`${isHidden[9] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                  </div>
                </Card.Header>
                <Card.Body className={`${isHidden[9] ? 'd-none' : ''}`}>
                  <InputGroup className="mb-3">
                    <SplitButton
                      variant="primary"
                      title="Action"
                      id="segmented-button-dropdown-1"
                    >
                      <Dropdown.Item>Action</Dropdown.Item>
                      <Dropdown.Item>Another action</Dropdown.Item>
                      <Dropdown.Item>Something else here</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item>Separated link</Dropdown.Item>
                    </SplitButton>
                    <Form.Control aria-label="Text input with dropdown button" />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <Form.Control aria-label="Text input with dropdown button" />
                    <SplitButton variant="primary" title="Action" id="segmented-button-dropdown-1" >
                      <Dropdown.Item>Action</Dropdown.Item>
                      <Dropdown.Item>Another action</Dropdown.Item>
                      <Dropdown.Item>Something else here</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item>Separated link</Dropdown.Item>
                    </SplitButton>
                  </InputGroup>
                </Card.Body>
                <div className={`${isHidden[9] ? '' : 'd-none'} card-footer border-top-0 `}>
                  <pre><code className='language-javascript'>
                    {`
        <Card.Body>
        <InputGroup className="mb-3">
        <SplitButton
          variant="primary"
          title="Action"
          id="segmented-button-dropdown-1"
        >
          <Dropdown.Item>Action</Dropdown.Item>
          <Dropdown.Item>Another action</Dropdown.Item>
          <Dropdown.Item>Something else here</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Separated link</Dropdown.Item>
        </SplitButton>
        <Form.Control aria-label="Text input with dropdown button" />
      </InputGroup>

      <InputGroup className="mb-3">
        <Form.Control aria-label="Text input with dropdown button" />
        <SplitButton variant="primary" title="Action" id="segmented-button-dropdown-1" >
          <Dropdown.Item>Action</Dropdown.Item>
          <Dropdown.Item>Another action</Dropdown.Item>
          <Dropdown.Item>Something else here</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Separated link</Dropdown.Item>
        </SplitButton>
      </InputGroup>
        </Card.Body>
                `}
                  </code></pre>
                </div>
              </Card>
            </Col>
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header className="justify-content-between">
                  <div className='card-title'> Custom select </div>

                  <div className="prism-toggle">
                    <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(10)}>Show Code<i className={`${isHidden[10] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                  </div>
                </Card.Header>
                <Card.Body className={`${isHidden[10] ? 'd-none' : ''}`}>
                  <div className="input-group mb-3">
                    <label className="input-group-text" htmlFor="inputGroupSelect01">Options</label>
                    <select className="form-select" id="inputGroupSelect01">
                      <option>Choose...</option>
                      <option>One</option>
                      <option>Two</option>
                      <option>Three</option>
                    </select>
                  </div>
                  <div className="input-group mb-3">
                    <select className="form-select" id="inputGroupSelect02">
                      <option >Choose...</option>
                      <option>One</option>
                      <option>Two</option>
                      <option>Three</option>
                    </select>
                    <label className="input-group-text" htmlFor="inputGroupSelect02">Options</label>
                  </div>
                  <div className="input-group mb-3">
                    <button className="btn btn-primary" type="button">Button</button>
                    <select className="form-select" id="inputGroupSelect03" aria-label="Example select with button addon">
                      <option >Choose...</option>
                      <option>One</option>
                      <option>Two</option>
                      <option>Three</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <select className="form-select" id="inputGroupSelect04" aria-label="Example select with button addon">
                      <option >Choose...</option>
                      <option>One</option>
                      <option>Two</option>
                      <option>Three</option>
                    </select>
                    <button className="btn btn-primary" type="button">Button</button>
                  </div>
                </Card.Body>
                <div className={`${isHidden[10] ? '' : 'd-none'} card-footer border-top-0 `}>
                  <pre><code className='language-javascript'>
                    {`
        <Card.Body>
        <div className="input-group mb-3">
                    <label className="input-group-text" htmlFor="inputGroupSelect01">Options</label>
                    <select className="form-select" id="inputGroupSelect01">
                      <option>Choose...</option>
                      <option>One</option>
                      <option>Two</option>
                      <option>Three</option>
                    </select>
                  </div>
                  <div className="input-group mb-3">
                    <select className="form-select" id="inputGroupSelect02">
                      <option >Choose...</option>
                      <option>One</option>
                      <option>Two</option>
                      <option>Three</option>
                    </select>
                    <label className="input-group-text" htmlFor="inputGroupSelect02">Options</label>
                  </div>
                  <div className="input-group mb-3">
                    <button className="btn btn-primary" type="button">Button</button>
                    <select className="form-select" id="inputGroupSelect03" aria-label="Example select with button addon">
                      <option >Choose...</option>
                      <option>One</option>
                      <option>Two</option>
                      <option>Three</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <select className="form-select" id="inputGroupSelect04" aria-label="Example select with button addon">
                      <option >Choose...</option>
                      <option>One</option>
                      <option>Two</option>
                      <option>Three</option>
                    </select>
                    <button className="btn btn-primary" type="button">Button</button>
                  </div>
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

export default InputGroups;
