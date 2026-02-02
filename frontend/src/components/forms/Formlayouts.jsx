import { Fragment, useState } from "react";
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import Select from 'react-select';
import { Countrypreference, Preference, Statepreference } from "../../common/Select2data";
import Pageheader from "../../layouts/Pageheader";

const FormLayouts = () => {

  const [isMarriedChecked, setMarriedChecked] = useState(true);

  const handleMaritalStatusChange = (status) => {
    setMarriedChecked(status === 'married');
  };

  //showcode

  const [isHidden, setisHidden] = useState([false]);
  const toggleHidden = (index) => {
    const updatedHidden = [...isHidden];
    updatedHidden[index] = !updatedHidden[index];
    setisHidden(updatedHidden);
  };

  return (
    <Fragment>
      <Pageheader mainheading='Layout' parentfolder='Forms' activepage='Layout' />

      <Row className="row-sm">
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'> Vertical Forms </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(0)}>Show Code<i className={`${isHidden[0] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>
              <div className="mb-3">
                <Form.Label htmlFor="form-text" className="fs-14 text-dark">Enter name</Form.Label>
                <Form.Control type="text" id="form-text" placeholder="" />
              </div>
              <div className="mb-3">
                <Form.Label htmlFor="form-password" className="fs-14 text-dark">Enter Password</Form.Label>
                <Form.Control type="password" id="form-password" placeholder="" />
              </div>
              <Form.Check type="checkbox" aria-label="radio 1" label='Accept Policy' />
              <Button className='my-2' type="submit">Submit</Button>
            </Card.Body>
            <div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="mb-3">
                <Form.Label htmlFor="form-text" className="fs-14 text-dark">Enter name</Form.Label>
                <Form.Control type="text" id="form-text" placeholder="" />
              </div>
              <div className="mb-3">
                <Form.Label htmlFor="form-password" className="fs-14 text-dark">Enter Password</Form.Label>
                <Form.Control type="password" id="form-password" placeholder="" />
              </div>
              <Form.Check type="checkbox" aria-label="radio 1" label='Accept Policy' />
              <Button className='my-2' type="submit">Submit</Button>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'> Horizontal form </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(1)}>Show Code<i className={`${isHidden[1] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[1] ? 'd-none' : ''}`}>
              <form>
                <Row className="mb-3">
                  <Form.Label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</Form.Label>
                  <Col sm={10}>
                    <Form.Control type="email" id="inputEmail3" />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Form.Label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</Form.Label>
                  <Col sm={10}>
                    <Form.Control type="password" id="inputPassword3" />
                  </Col>
                </Row>
                <fieldset className="row mb-3">
                  <legend className="col-form-label col-sm-2 pt-0">Qualified</legend>
                  <Col sm={10}>
                    <Form.Check type="radio" aria-label="radio 1" label='Prelims' defaultChecked />
                    <Form.Check type="radio" aria-label="radio 1" label='Mains' disabled />
                    <Form.Check type="checkbox" aria-label="radio 1" label='Certified' />
                  </Col>
                </fieldset>
                <Button type="submit" className="">Sign in</Button>
              </form>
            </Card.Body>
            <div className={`${isHidden[1] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <form>
                <Row className="mb-3">
                  <Form.Label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</Form.Label>
                  <Col sm={10}>
                    <Form.Control type="email" id="inputEmail3" />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Form.Label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</Form.Label>
                  <Col sm={10}>
                    <Form.Control type="password" id="inputPassword3" />
                  </Col>
                </Row>
                <fieldset className="row mb-3">
                  <legend className="col-form-label col-sm-2 pt-0">Qualified</legend>
                  <Col sm={10}>
                    <Form.Check type="radio" aria-label="radio 1" label='Prelims' defaultChecked />
                    <Form.Check type="radio" aria-label="radio 1" label='Mains' disabled />
                    <Form.Check type="checkbox" aria-label="radio 1" label='Certified' />
                  </Col>
                </fieldset>
                <Button type="submit" className="">Sign in</Button>
              </form>
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
              <div className='card-title'> Vertical Forms with icon </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(2)}>Show Code<i className={`${isHidden[2] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[2] ? 'd-none' : ''}`}>
              <div className="mb-3">
                <Form.Label htmlFor="form-text1" className="fs-14 text-dark">Enter name</Form.Label>
                <InputGroup className="">
                  <InputGroup.Text id="basic-addon1"><i className="ri-user-line"></i></InputGroup.Text>
                  <Form.Control placeholder="" aria-label="Username" aria-describedby="basic-addon1" />
                </InputGroup>
              </div>
              <div className="mb-3">
                <Form.Label htmlFor="form-password1" className="fs-14 text-dark">Enter Password</Form.Label>
                <InputGroup className="">
                  <InputGroup.Text id="basic-addon1"><i className="ri-lock-line"></i></InputGroup.Text>
                  <Form.Control type="password" placeholder="" aria-label="password" aria-describedby="basic-addon1" />
                </InputGroup>
              </div>

              <Form.Check type="checkbox" aria-label="radio 1" label='Accept Policy' />

              <Button className="my-2" type="submit">Submit</Button>
            </Card.Body>
            <div className={`${isHidden[2] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="mb-3">
        <Form.Label htmlFor="form-text1" className="fs-14 text-dark">Enter name</Form.Label>
        <InputGroup className="">
          <InputGroup.Text id="basic-addon1"><i className="ri-user-line"></i></InputGroup.Text>
          <Form.Control placeholder="" aria-label="Username" aria-describedby="basic-addon1" />
        </InputGroup>
      </div>
      <div className="mb-3">
        <Form.Label htmlFor="form-password1" className="fs-14 text-dark">Enter Password</Form.Label>
        <InputGroup className="">
          <InputGroup.Text id="basic-addon1"><i className="ri-lock-line"></i></InputGroup.Text>
          <Form.Control type="password" placeholder="" aria-label="password" aria-describedby="basic-addon1" />
        </InputGroup>
      </div>

      <Form.Check type="checkbox" aria-label="radio 1" label='Accept Policy' />

      <Button className="my-2" type="submit">Submit</Button>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'> Horizontal form With Icons </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(3)}>Show Code<i className={`${isHidden[3] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[3] ? 'd-none' : ''}`}>
              <form>
                <Row className="mb-3">
                  <Form.Label htmlFor="inputEmail1"
                    className="col-sm-2 col-form-label">Email</Form.Label>
                  <Col sm={10}>
                    <InputGroup className="">
                      <Form.Control type="email" placeholder="" aria-label="Username" aria-describedby="basic-addon1" />
                      <InputGroup.Text id="basic-addon1"><i className="ri-mail-line"></i></InputGroup.Text>
                    </InputGroup>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Form.Label htmlFor="inputPassword1" className="col-sm-2 col-form-label">Password</Form.Label>
                  <Col sm={10}>
                    <InputGroup className="">
                      <Form.Control type="password" placeholder="" aria-label="Username" aria-describedby="basic-addon1" />
                      <InputGroup.Text id="basic-addon1"><i className="ri-lock-line"></i></InputGroup.Text>
                    </InputGroup>
                  </Col>
                </Row>
                <fieldset className="row mb-3">
                  <legend className="col-form-label col-sm-2 pt-0">Qualified</legend>
                  <Col sm={10}>
                    <Form.Check type="radio" aria-label="radio 1" label='Prelims' defaultChecked />
                    <Form.Check type="radio" aria-label="radio 1" label='Mains' disabled />
                    <Form.Check type="checkbox" aria-label="radio 1" label='Certified' />
                  </Col>
                </fieldset>
                <Button type="submit" className="my-2">Sign in</Button>
              </form>
            </Card.Body>
            <div className={`${isHidden[3] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <form>
        <Row className="mb-3">
          <Form.Label htmlFor="inputEmail1"
            className="col-sm-2 col-form-label">Email</Form.Label>
          <Col sm={10}>
            <InputGroup className="">
              <Form.Control type="email" placeholder="" aria-label="Username" aria-describedby="basic-addon1" />
              <InputGroup.Text id="basic-addon1"><i className="ri-mail-line"></i></InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>
        <Row className="mb-3">
          <Form.Label htmlFor="inputPassword1" className="col-sm-2 col-form-label">Password</Form.Label>
          <Col sm={10}>
            <InputGroup className="">
              <Form.Control type="password" placeholder="" aria-label="Username" aria-describedby="basic-addon1" />
              <InputGroup.Text id="basic-addon1"><i className="ri-lock-line"></i></InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>
        <fieldset className="row mb-3">
          <legend className="col-form-label col-sm-2 pt-0">Qualified</legend>
          <Col sm={10}>
            <Form.Check type="radio" aria-label="radio 1" label='Prelims' defaultChecked />
            <Form.Check type="radio" aria-label="radio 1" label='Mains' disabled />
            <Form.Check type="checkbox" aria-label="radio 1" label='Certified' />
          </Col>
        </fieldset>
        <Button type="submit" className="my-2">Sign in</Button>
      </form>
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
              <div className='card-title'> Inline forms </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(4)}>Show Code<i className={`${isHidden[4] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[4] ? 'd-none' : ''}`}>
              <Form className="row row-cols-lg-auto g-3 align-items-center">
                <div className="col-12">
                  <Form.Label className="visually-hidden" htmlFor="inlineFormInputGroupUsername">Username</Form.Label>
                  <InputGroup className="">
                    <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                    <Form.Control type="text" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
                  </InputGroup>
                </div>
                <div className="col-12">
                  <Form.Label className="visually-hidden" htmlFor="inlineFormSelectPref">Preference</Form.Label>
                  <Select options={Preference} placeholder="Choose one" classNamePrefix="Select2" className='search-panel' />
                </div>
                <div className="col-12">
                  <Form.Check type="checkbox" aria-label="radio 1" label='Remember me' />
                </div>
                <div className="col-12">
                  <Button type="submit" className="my-2">Submit</Button>
                </div>
              </Form>
            </Card.Body>
            <div className={`${isHidden[4] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Form className="row row-cols-lg-auto g-3 align-items-center">
                <div className="col-12">
                  <Form.Label className="visually-hidden" htmlFor="inlineFormInputGroupUsername">Username</Form.Label>
                  <InputGroup className="">
                    <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                    <Form.Control type="text" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
                  </InputGroup>
                </div>
                <div className="col-12">
                  <Form.Label className="visually-hidden" htmlFor="inlineFormSelectPref">Preference</Form.Label>
                  <Select options={Preference} placeholder="Choose one" classNamePrefix="Select2" className='search-panel' />
                </div>
                <div className="col-12">
                  <Form.Check type="checkbox" aria-label="radio 1" label='Remember me' />
                </div>
                <div className="col-12">
                  <Button type="submit" className="my-2">Submit</Button>
                </div>
              </Form>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'> Column sizing </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(5)}>Show Code<i className={`${isHidden[5] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[5] ? 'd-none' : ''}`}>
              <Row className="g-3">
                <div className="col-sm-7">
                  <Form.Control type="text" placeholder="City" aria-label="City" />
                </div>
                <div className="col-sm">
                  <Form.Control type="text" placeholder="State" aria-label="State" />
                </div>
                <div className="col-sm">
                  <Form.Control type="text" placeholder="Zip" aria-label="Zip" />
                </div>
              </Row>
            </Card.Body>
            <div className={`${isHidden[5] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Row className="g-3">
        <div className="col-sm-7">
          <Form.Control type="text" placeholder="City" aria-label="City" />
        </div>
        <div className="col-sm">
          <Form.Control type="text" placeholder="State" aria-label="State" />
        </div>
        <div className="col-sm">
          <Form.Control type="text" placeholder="Zip" aria-label="Zip" />
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
              <div className='card-title'> Utilities </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(6)}>Show Code<i className={`${isHidden[6] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[6] ? 'd-none' : ''}`}>
              <div className="mb-3">
                <Form.Label htmlFor="formGroupExampleInput">Example label</Form.Label>
                <Form.Control type="text" id="formGroupExampleInput" placeholder="Example input placeholder" />
              </div>
              <div className="mb-1">
                <Form.Label htmlFor="formGroupExampleInput2">Another label</Form.Label>
                <Form.Control type="text" id="formGroupExampleInput2" placeholder="Another input placeholder" />
              </div>
            </Card.Body>
            <div className={`${isHidden[6] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="mb-3">
        <Form.Label htmlFor="formGroupExampleInput">Example label</Form.Label>
        <Form.Control type="text" id="formGroupExampleInput" placeholder="Example input placeholder" />
      </div>
      <div className="mb-1">
        <Form.Label htmlFor="formGroupExampleInput2">Another label</Form.Label>
        <Form.Control type="text" id="formGroupExampleInput2" placeholder="Another input placeholder" />
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
              <div className='card-title'> Horizontal form label sizing </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(7)}>Show Code<i className={`${isHidden[7] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[7] ? 'd-none' : ''}`}>
              <Row className="mb-3">
                <Form.Label htmlFor="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Email</Form.Label>
                <Col sm={10}>
                  <Form.Control type="email" className="form-control form-control-sm" id="colFormLabelSm" placeholder="col-form-label-sm" />
                </Col>
              </Row>
              <Row className="mb-3">
                <Form.Label htmlFor="colFormLabel" className="col-sm-2 col-form-label">Email</Form.Label>
                <Col sm={10}>
                  <Form.Control type="email" id="colFormLabel" placeholder="col-form-label" />
                </Col>
              </Row>
              <Row>
                <Form.Label htmlFor="colFormLabelLg"
                  className="col-sm-2 col-form-label col-form-label-lg">Email</Form.Label>
                <Col sm={10}>
                  <Form.Control type="email" className="form-control form-control-lg" id="colFormLabelLg" placeholder="col-form-label-lg" />
                </Col>
              </Row>
            </Card.Body>
            <div className={`${isHidden[7] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Row className="mb-3">
                <Form.Label htmlFor="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Email</Form.Label>
                <Col sm={10}>
                  <Form.Control type="email" className="form-control form-control-sm" id="colFormLabelSm" placeholder="col-form-label-sm" />
                </Col>
              </Row>
              <Row className="mb-3">
                <Form.Label htmlFor="colFormLabel" className="col-sm-2 col-form-label">Email</Form.Label>
                <Col sm={10}>
                  <Form.Control type="email" id="colFormLabel" placeholder="col-form-label" />
                </Col>
              </Row>
              <Row>
                <Form.Label htmlFor="colFormLabelLg"
                  className="col-sm-2 col-form-label col-form-label-lg">Email</Form.Label>
                <Col sm={10}>
                  <Form.Control type="email" className="form-control form-control-lg" id="colFormLabelLg" placeholder="col-form-label-lg" />
                </Col>
              </Row>
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
              <div className='card-title'> Auto sizing </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(8)}>Show Code<i className={`${isHidden[8] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[8] ? 'd-none' : ''}`}>
              <form className="row gy-2 gx-3 align-items-center mb-4">
                <div className="col-auto">
                  <Form.Label className="visually-hidden" htmlFor="autoSizingInput">Name</Form.Label>
                  <Form.Control type="text" id="autoSizingInput" placeholder="Jane Doe" />
                </div>
                <div className="col-auto">
                  <Form.Label className="visually-hidden" htmlFor="autoSizingInputGroup">Username</Form.Label>
                  <InputGroup className="">
                    <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                    <Form.Control placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
                  </InputGroup>
                </div>
                <div className="col-auto">
                  <Form.Label className="visually-hidden" htmlFor="autoSizingSelect">Preference</Form.Label>
                  <Select options={Preference} placeholder="Choose one" classNamePrefix="Select2" className='search-panel' />
                </div>
                <div className="col-auto">
                  <Form.Check type="checkbox" aria-label="radio 1" label='Remember me' />
                </div>
                <div className="col-auto">
                  <Button type="submit" className="my-2">Submit</Button>
                </div>
              </form>
              <span className="fw-normal mb-1 text-muted">You can then remix that once again with size-specific column classes.</span>
              <form className="row gx-3 gy-2 align-items-center mt-0">
                <Col sm={3}>
                  <Form.Label className="visually-hidden" htmlFor="specificSizeInputName">Name</Form.Label>
                  <Form.Control type="text" id="specificSizeInputName" placeholder="Jane Doe" />
                </Col>
                <Col sm={3}>
                  <Form.Label className="visually-hidden" htmlFor="specificSizeInputGroupUsername">Username</Form.Label>
                  <InputGroup className="">
                    <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                    <Form.Control placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
                  </InputGroup>
                </Col>
                <Col sm={3}>
                  <Form.Label className="visually-hidden" htmlFor="specificSizeSelect">Preference</Form.Label>
                  <Select options={Preference} placeholder="Choose one" classNamePrefix="Select2" className='search-panel' />
                </Col>
                <div className="col-auto">
                  <Form.Check type="checkbox" aria-label="radio 1" label='Remember me' />
                </div>
                <div className="col-auto">
                  <Button type="submit" className="my-2">Submit</Button>
                </div>
              </form>
            </Card.Body>
            <div className={`${isHidden[8] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <form className="row gy-2 gx-3 align-items-center mb-4">
                <div className="col-auto">
                  <Form.Label className="visually-hidden" htmlFor="autoSizingInput">Name</Form.Label>
                  <Form.Control type="text" id="autoSizingInput" placeholder="Jane Doe" />
                </div>
                <div className="col-auto">
                  <Form.Label className="visually-hidden" htmlFor="autoSizingInputGroup">Username</Form.Label>
                  <InputGroup className="">
                    <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                    <Form.Control placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
                  </InputGroup>
                </div>
                <div className="col-auto">
                  <Form.Label className="visually-hidden" htmlFor="autoSizingSelect">Preference</Form.Label>
                  <Select options={Preference} placeholder="Choose one" classNamePrefix="Select2" className='search-panel' />
                </div>
                <div className="col-auto">
                  <Form.Check type="checkbox" aria-label="radio 1" label='Remember me' />
                </div>
                <div className="col-auto">
                  <Button type="submit" className="my-2">Submit</Button>
                </div>
              </form>
              <span className="fw-normal mb-1 text-muted">You can then remix that once again with size-specific column classes.</span>
              <form className="row gx-3 gy-2 align-items-center mt-0">
                <Col sm={3}>
                  <Form.Label className="visually-hidden" htmlFor="specificSizeInputName">Name</Form.Label>
                  <Form.Control type="text" id="specificSizeInputName" placeholder="Jane Doe" />
                </Col>
                <Col sm={3}>
                  <Form.Label className="visually-hidden" htmlFor="specificSizeInputGroupUsername">Username</Form.Label>
                  <InputGroup className="">
                    <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                    <Form.Control placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
                  </InputGroup>
                </Col>
                <Col sm={3}>
                  <Form.Label className="visually-hidden" htmlFor="specificSizeSelect">Preference</Form.Label>
                  <Select options={Preference} placeholder="Choose one" classNamePrefix="Select2" className='search-panel' />
                </Col>
                <div className="col-auto">
                  <Form.Check type="checkbox" aria-label="radio 1" label='Remember me' />
                </div>
                <div className="col-auto">
                  <Button type="submit" className="my-2">Submit</Button>
                </div>
              </form>
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
              <div className='card-title'> Form grid </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(9)}>Show Code<i className={`${isHidden[9] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[9] ? 'd-none' : ''}`}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" placeholder="First name" aria-label="First name" />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" placeholder="Last name" aria-label="Last name" />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Row>
                    <Col xl={12} className="mb-3">
                      <Form.Control type="text" placeholder="Street" aria-label="Street" />
                    </Col>
                    <Col xl={12} className="mb-3">
                      <Form.Control type="text" placeholder="Landmark" aria-label="Landmark" />
                    </Col>
                    <Col xxl={6} xl={12} className="mb-3">
                      <Form.Control type="text" placeholder="City" aria-label="City" />
                    </Col>
                    <Col xxl={6} xl={12} className="mb-3">

                      <Select options={Statepreference} placeholder="Choose one" classNamePrefix="Select2" className='search-panel' />
                    </Col>
                    <Col xxl={6} xl={12} className="mb-3">
                      <Form.Control type="text" placeholder="Postal/Zip code" aria-label="Postal/Zip code" />
                    </Col>
                    <Col xxl={6} xl={12} className="mb-3">
                      <Select options={Countrypreference} placeholder="Choose one" classNamePrefix="Select2" className='search-panel' />
                    </Col>
                  </Row>
                </Col>
                <Col md={6} className="mb-3">
                  <Row>
                    <Col xl={12} className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" placeholder="Email" aria-label="email" />
                    </Col>
                    <Col xl={12} className="mb-3">
                      <Form.Label>D.O.B</Form.Label>
                      <Form.Control type="date" aria-label="dateofbirth" />
                    </Col>
                    <Col xl={12} className="mt-3">
                      <Row>
                        <Form.Label className="mb-1">Maritial Status</Form.Label>
                        <Col xl={6}>
                          <Form.Check type="radio" aria-label="radio 1" label='Married' defaultChecked={isMarriedChecked} onClick={() => handleMaritalStatusChange('married')} />
                        </Col>
                        <Col xl={6}>
                          <Form.Check type="radio" aria-label="radio 1" label='Single' defaultChecked={!isMarriedChecked} onClick={() => handleMaritalStatusChange('single')} />
                        </Col>
                      </Row>
                    </Col>
                    <Col xl={12}> </Col>
                  </Row>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control type="number" placeholder="Phone number" aria-label="Phone number" />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Alternative Contact</Form.Label>
                  <Form.Control type="number" placeholder="Phone number" aria-label="Phone number" />
                </Col>
                <Col md={12}>
                  <Form.Check type="checkbox" aria-label="radio 1" label='Check me out' />
                </Col>
                <Col md={12}>
                  <Button type="submit" className="my-2">Sign in</Button>
                </Col>
              </Row>
            </Card.Body>
            <div className={`${isHidden[9] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" placeholder="First name" aria-label="First name" />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" placeholder="Last name" aria-label="Last name" />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Row>
                    <Col xl={12} className="mb-3">
                      <Form.Control type="text" placeholder="Street" aria-label="Street" />
                    </Col>
                    <Col xl={12} className="mb-3">
                      <Form.Control type="text" placeholder="Landmark" aria-label="Landmark" />
                    </Col>
                    <Col xxl={6} xl={12} className="mb-3">
                      <Form.Control type="text" placeholder="City" aria-label="City" />
                    </Col>
                    <Col xxl={6} xl={12} className="mb-3">

                      <Select options={Statepreference} placeholder="Choose one" classNamePrefix="Select2" className='search-panel' />
                    </Col>
                    <Col xxl={6} xl={12} className="mb-3">
                      <Form.Control type="text" placeholder="Postal/Zip code" aria-label="Postal/Zip code" />
                    </Col>
                    <Col xxl={6} xl={12} className="mb-3">
                      <Select options={Countrypreference} placeholder="Choose one" classNamePrefix="Select2" className='search-panel' />
                    </Col>
                  </Row>
                </Col>
                <Col md={6} className="mb-3">
                  <Row>
                    <Col xl={12} className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" placeholder="Email" aria-label="email" />
                    </Col>
                    <Col xl={12} className="mb-3">
                      <Form.Label>D.O.B</Form.Label>
                      <Form.Control type="date" aria-label="dateofbirth" />
                    </Col>
                    <Col xl={12} className="mt-3">
                      <Row>
                        <Form.Label className="mb-1">Maritial Status</Form.Label>
                        <Col xl={6}>
                          <Form.Check type="radio" aria-label="radio 1" label='Married' defaultChecked={isMarriedChecked} onClick={() => handleMaritalStatusChange('married')} />
                        </Col>
                        <Col xl={6}>
                          <Form.Check type="radio" aria-label="radio 1" label='Single' defaultChecked={!isMarriedChecked} onClick={() => handleMaritalStatusChange('single')} />
                        </Col>
                      </Row>
                    </Col>
                    <Col xl={12}> </Col>
                  </Row>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control type="number" placeholder="Phone number" aria-label="Phone number" />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Alternative Contact</Form.Label>
                  <Form.Control type="number" placeholder="Phone number" aria-label="Phone number" />
                </Col>
                <Col md={12}>
                  <Form.Check type="checkbox" aria-label="radio 1" label='Check me out' />
                </Col>
                <Col md={12}>
                  <Button type="submit" className="my-2">Sign in</Button>
                </Col>
              </Row>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'> Gutters </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(10)}>Show Code<i className={`${isHidden[10] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[10] ? 'd-none' : ''}`}>
              <form className="row g-3 mt-0">
                <Col md={6}>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" placeholder="First name" aria-label="First name" />
                </Col>
                <Col md={6}>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" placeholder="Last name" aria-label="Last name" />
                </Col>
                <Col md={6}>
                  <Form.Label htmlFor="inputEmail4">Email</Form.Label>
                  <Form.Control type="email" id="inputEmail4" />
                </Col>
                <Col md={6}>
                  <Form.Label htmlFor="inputPassword4">Password</Form.Label>
                  <Form.Control type="password" id="inputPassword4" />
                </Col>
                <div className="col-12">
                  <Form.Label htmlFor="inputAddress">Address</Form.Label>
                  <Form.Control type="text" id="inputAddress" placeholder="1234 Main St" />
                </div>
                <div className="col-12">
                  <Form.Label htmlFor="inputAddress2">Address 2</Form.Label>
                  <Form.Control type="text" id="inputAddress2" placeholder="Apartment, studio, or floor" />
                </div>
                <Col md={6}>
                  <Form.Label htmlFor="inputCity">City</Form.Label>
                  <Form.Control type="text" id="inputCity" />
                </Col>
                <Col md={4}>
                  <Form.Label htmlFor="inputState">State</Form.Label>
                  <Select options={Statepreference} placeholder="Choose ...." classNamePrefix="Select2" className='search-panel' />

                </Col>
                <Col md={2}>
                  <Form.Label htmlFor="inputZip">Zip</Form.Label>
                  <Form.Control type="text" id="inputZip" />
                </Col>
                <div className="col-12">
                  <Form.Check type="checkbox" aria-label="radio 1" label='Check me out' />
                </div>
                <div className="col-12">
                  <Button type="submit" className="">Sign in</Button>
                </div>
              </form>
            </Card.Body>
            <div className={`${isHidden[10] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <form className="row g-3 mt-0">
                <Col md={6}>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" placeholder="First name" aria-label="First name" />
                </Col>
                <Col md={6}>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" placeholder="Last name" aria-label="Last name" />
                </Col>
                <Col md={6}>
                  <Form.Label htmlFor="inputEmail4">Email</Form.Label>
                  <Form.Control type="email" id="inputEmail4" />
                </Col>
                <Col md={6}>
                  <Form.Label htmlFor="inputPassword4">Password</Form.Label>
                  <Form.Control type="password" id="inputPassword4" />
                </Col>
                <div className="col-12">
                  <Form.Label htmlFor="inputAddress">Address</Form.Label>
                  <Form.Control type="text" id="inputAddress" placeholder="1234 Main St" />
                </div>
                <div className="col-12">
                  <Form.Label htmlFor="inputAddress2">Address 2</Form.Label>
                  <Form.Control type="text" id="inputAddress2" placeholder="Apartment, studio, or floor" />
                </div>
                <Col md={6}>
                  <Form.Label htmlFor="inputCity">City</Form.Label>
                  <Form.Control type="text" id="inputCity" />
                </Col>
                <Col md={4}>
                  <Form.Label htmlFor="inputState">State</Form.Label>
                  <Select options={Statepreference} placeholder="Choose ...." classNamePrefix="Select2" className='search-panel' />

                </Col>
                <Col md={2}>
                  <Form.Label htmlFor="inputZip">Zip</Form.Label>
                  <Form.Control type="text" id="inputZip" />
                </Col>
                <div className="col-12">
                  <Form.Check type="checkbox" aria-label="radio 1" label='Check me out' />
                </div>
                <div className="col-12">
                  <Button type="submit" className="">Sign in</Button>
                </div>
              </form>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

    </Fragment>
  );
};

export default FormLayouts;
