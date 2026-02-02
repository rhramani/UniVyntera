import { Fragment, useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import Pageheader from '../../../layouts/Pageheader';

const Inputs = () => {

  const [isHidden, setIsHidden] = useState(false);
  const toggleHidden = () => { setIsHidden(!isHidden) };

  const [isHidden1, setIsHidden1] = useState(false);
  const toggleHidden1 = () => { setIsHidden1(!isHidden1) };

  const [isHidden2, setIsHidden2] = useState(false);
  const toggleHidden2 = () => { setIsHidden2(!isHidden2) };

  const [isHidden3, setIsHidden3] = useState(false);
  const toggleHidden3 = () => { setIsHidden3(!isHidden3) };

  const [isHidden4, setIsHidden4] = useState(false);
  const toggleHidden4 = () => { setIsHidden4(!isHidden4) };

  const [isHidden5, setIsHidden5] = useState(false);
  const toggleHidden5 = () => { setIsHidden5(!isHidden5) };

  const [isHidden6, setIsHidden6] = useState(false);
  const toggleHidden6 = () => { setIsHidden6(!isHidden6) };

  const [isHidden7, setIsHidden7] = useState(false);
  const toggleHidden7 = () => { setIsHidden7(!isHidden7) };


  return (
    <Fragment>

      <Pageheader mainheading='Inputs' parentfolder='Form Elements' activepage='Inputs' />

      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'> Input Types </div>
              <div className="prism-toggle">
                <Button variant='primary-light' size='sm' onClick={toggleHidden}>Show Code<i className={`${isHidden ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></Button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden ? 'd-none' : ''}`}>
              <Row className="gy-4">
                <Col xl={4} lg={6} md={6} sm={12}>
                  <p className="mb-2 fw-medium">Basic Input:</p>
                  <Form.Control type="text" id="input" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-label">Form Input With Label</Form.Label>
                  <Form.Control type="text" id="input-label" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-placeholder">Form Input With Placeholder</Form.Label>
                  <Form.Control type="text" id="input-placeholder" placeholder="Placeholder" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-text">Type Text</Form.Label>
                  <Form.Control type="text" id="input-text" placeholder="Text" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-number">Type Number</Form.Label>
                  <Form.Control type="number" id="input-number" placeholder="Number" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-password">Type Password</Form.Label>
                  <Form.Control type="password" id="input-password" placeholder="Password" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-email">Type Email</Form.Label>
                  <Form.Control type="email" id="input-email" placeholder="Email@xyz.com" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-tel">Type Tel</Form.Label>
                  <Form.Control type="tel" id="input-tel" placeholder="+1100-2031-1233" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-date">Type Date</Form.Label>
                  <Form.Control type="date" id="input-date" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-week">Type Week</Form.Label>
                  <Form.Control type="week" id="input-week" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-month">Type Month</Form.Label>
                  <Form.Control type="month" id="input-month" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-time">Type Time</Form.Label>
                  <Form.Control type="time" id="input-time" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-datetime-local">Type datetime-local</Form.Label>
                  <Form.Control type="datetime-local" id="input-datetime-local" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-search">Type Search</Form.Label>
                  <Form.Control type="search" id="input-search" placeholder="Search" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-submit">Type Submit</Form.Label>
                  <Form.Control type="submit" id="input-submit" value="Submit" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-reset">Type Reset</Form.Label>
                  <Form.Control type="reset" id="input-reset" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-button">Type Button</Form.Label>
                  <Form.Control type="button" className="btn btn-primary" id="input-button" value="Button" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Row>
                    <Col xl={3}>
                      <Form.Label>Type Color</Form.Label>
                      <Form.Control type="color" defaultValue="#136bd0" />
                    </Col>
                    <Col xl={5}>
                      <div className="ps-0">
                          <p className="mb-3 px-0 text-muted">Type Checkbox</p>
                          <Form.Check className="ms-2" type="checkbox"
                              defaultValue="" defaultChecked />
                      </div>
                    </Col>
                    <Col xl={4}>
                      <div className="ps-0">
                          <p className="mb-3 px-0 text-muted">Type Radio</p>
                          <Form.Check
                              className="ms-2" type="radio" defaultChecked />
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-file">Type File</Form.Label>
                  <Form.Control type="file" id="input-file" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label>Type Url</Form.Label>
                  <Form.Control type="url" name="website" placeholder="http://example.com" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-disabled">Type Disabled</Form.Label>
                  <Form.Control type="text" id="input-disabled" placeholder="Disabled input" disabled />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <label htmlFor="input-readonlytext" className="form-label">Input Readonly Text</label>
                  <input className='form-control-plaintext' type="text" readOnly={true} id="input-readOnly text" value="email@example.com" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="disabled-readOnly text">Disabled readonly Input</Form.Label>
                  <Form.Control type="text" value="Disabled readonly input" id="disabled-readOnly text" aria-label="Disabled input example" disabled readOnly={true} />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label>Type readonly Input</Form.Label>
                  <Form.Control type="text" value="readOnly input here..." aria-label="readOnly input example" readOnly={true} />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="text-area">Textarea</Form.Label>
                  <Form.Control as='textarea' id="text-area" rows={1} />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-DataList">Datalist example</Form.Label>
                  <Form.Control list="datalistOptions" id="input-DataList" placeholder="Type to search..." />
                  <datalist id="datalistOptions">
                    <option value="San Francisco"> </option>
                    <option value="New York"> </option>
                    <option value="Seattle"> </option>
                    <option value="Los Angeles"> </option>
                    <option value="Chicago"> </option>
                  </datalist>
                </Col>
              </Row>
            </Card.Body>

            <div className={`card-footer ${isHidden ? '' : 'd-none'} border-top-0`}>
              <pre><code className='language-javascript'>
                {`<Row className="gy-4 language-html">
                <Col xl={4} lg={6} md={6} sm={12}>
                  <p className="mb-2 fw-medium">Basic Input:</p>
                  <Form.Control type="text" id="input" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-label">Form Input With Label</Form.Label>
                  <Form.Control type="text" id="input-label" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-placeholder">Form Input With Placeholder</Form.Label>
                  <Form.Control type="text" id="input-placeholder" placeholder="Placeholder" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-text">Type Text</Form.Label>
                  <Form.Control type="text" id="input-text" placeholder="Text" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-number">Type Number</Form.Label>
                  <Form.Control type="number" id="input-number" placeholder="Number" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-password">Type Password</Form.Label>
                  <Form.Control type="password" id="input-password" placeholder="Password" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-email">Type Email</Form.Label>
                  <Form.Control type="email" id="input-email" placeholder="Email@xyz.com" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-tel">Type Tel</Form.Label>
                  <Form.Control type="tel" id="input-tel" placeholder="+1100-2031-1233" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-date">Type Date</Form.Label>
                  <Form.Control type="date" id="input-date" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-week">Type Week</Form.Label>
                  <Form.Control type="week" id="input-week" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-month">Type Month</Form.Label>
                  <Form.Control type="month" id="input-month" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-time">Type Time</Form.Label>
                  <Form.Control type="time" id="input-time" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-datetime-local">Type datetime-local</Form.Label>
                  <Form.Control type="datetime-local" id="input-datetime-local" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-search">Type Search</Form.Label>
                  <Form.Control type="search" id="input-search" placeholder="Search" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-submit">Type Submit</Form.Label>
                  <Form.Control type="submit" id="input-submit" value="Submit" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-reset">Type Reset</Form.Label>
                  <Form.Control type="reset" id="input-reset" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-button">Type Button</Form.Label>
                  <Form.Control type="button" className="btn btn-primary" id="input-button" value="Button" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Row>
                    <Col xl={3}>
                      <Form.Label>Type Color</Form.Label>
                      <Form.Control className="form-input-color" type="color" value="#136bd0" />
                    </Col>
                    <Col xl={5}>
                      <div className="form-check">
                        <p className="mb-3 px-0 text-muted">Type Checkbox</p>
                        <Form.Check className="ms-5" type="checkbox" id="custom-switch" defaultChecked />
                      </div>
                    </Col>
                    <Col xl={4}>
                      <div className="form-check">
                        <p className="mb-3 px-0 text-muted">Type Radio</p>
                        <Form.Check className="ms-5" type="radio" id="custom-switch" defaultChecked />
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-file">Type File</Form.Label>
                  <Form.Control type="file" id="input-file" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label>Type Url</Form.Label>
                  <Form.Control type="url" name="website" placeholder="http://example.com" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-disabled">Type Disabled</Form.Label>
                  <Form.Control type="text" id="input-disabled" placeholder="Disabled input" disabled />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-readOnly text">Input readonly Text</Form.Label>
                  <Form.Control type="text" readOnly={true} className="form-control-plaintext" id="input-readOnly text" value="email@example.com" />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="disabled-readOnly text">Disabled readonly Input</Form.Label>
                  <Form.Control type="text" value="Disabled readonly input" id="disabled-readOnly text" aria-label="Disabled input example" disabled readOnly={true} />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label>Type readonly Input</Form.Label>
                  <Form.Control type="text" value="readOnly input here..." aria-label="readOnly input example" readOnly={true} />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="text-area">Textarea</Form.Label>
                  <Form.Control as='textarea' id="text-area" rows={1} />
                </Col>
                <Col xl={4} lg={6} md={6} sm={12}>
                  <Form.Label htmlFor="input-DataList">Datalist example</Form.Label>
                  <Form.Control list="datalistOptions" id="input-DataList" placeholder="Type to search..." />
                  <datalist id="datalistOptions">
                    <option value="San Francisco"> </option>
                    <option value="New York"> </option>
                    <option value="Seattle"> </option>
                    <option value="Los Angeles"> </option>
                    <option value="Chicago"> </option>
                  </datalist>
                </Col>
              </Row>`}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Input shapes
              </div>
              <div className="prism-toggle">
                <Button variant='primary-light' size='sm' onClick={toggleHidden1}>Show Code<i className={`${isHidden1 ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></Button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden1 ? 'd-none' : ''}`}>
              <Row className="gy-3">
                <Col xl={12}>
                  <Form.Label htmlFor="input-noradius">Input With No Radius</Form.Label>
                  <Form.Control type="text" className="rounded-0" id="input-noradius" placeholder="No Radius" />
                </Col>
                <Col xl={12}>
                  <Form.Label htmlFor="input-rounded">Input With Radius</Form.Label>
                  <Form.Control type="text" id="input-rounded" placeholder="Default Radius" />
                </Col>
                <Col xl={12}>
                  <Form.Label htmlFor="input-rounded-pill">Rounded Input</Form.Label>
                  <Form.Control type="text" className="rounded-pill" id="input-rounded-pill" placeholder="Rounded" />
                </Col>
              </Row>
            </Card.Body>

            <div className={`${isHidden1 ? '' : 'd-none'} card-footer border-top-0`}>
              {/* <!-- Prism Code --> */}

              <pre><code className='language-javascript'>
                {`
                <Row className="gy-3">
                <Col xl={12}>
                  <Form.Label htmlFor="input-noradius">Input With No Radius</Form.Label>
                  <Form.Control type="text" className="rounded-0" id="input-noradius" placeholder="No Radius" />
                </Col>
                <Col xl={12}>
                  <Form.Label htmlFor="input-rounded">Input With Radius</Form.Label>
                  <Form.Control type="text" id="input-rounded" placeholder="Default Radius" />
                </Col>
                <Col xl={12}>
                  <Form.Label htmlFor="input-rounded-pill">Rounded Input</Form.Label>
                  <Form.Control type="text" className="rounded-pill" id="input-rounded-pill" placeholder="Rounded" />
                </Col>
              </Row>
                `}
              </code></pre>

              {/* <!-- Prism Code --> */}
            </div>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Input border Styles
              </div>
              <div className="prism-toggle">
                <Button variant='primary-light' size='sm' onClick={toggleHidden2}>Show Code<i className={`${isHidden2 ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></Button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden2 ? 'd-none' : ''}`}>
              <Row className="gy-3">
                <Col xl={12}>
                  <Form.Label htmlFor="input-rounded1">Default</Form.Label>
                  <Form.Control type="text" id="input-rounded1" placeholder="Default" />
                </Col>
                <Col xl={12}>
                  <Form.Label htmlFor="input-rounded2">Dotted Input</Form.Label>
                  <Form.Control type="text" className="border-dotted" id="input-rounded2" placeholder="Dotted" />
                </Col>
                <Col xl={12}>
                  <Form.Label htmlFor="input-rounded3">Dashed Input</Form.Label>
                  <Form.Control type="text" className="border-dashed" id="input-rounded3" placeholder="Dashed" />
                </Col>
              </Row>
            </Card.Body>
            <div className={`card-footer border-top-0 ${isHidden2 ? '' : 'd-none'}`}>
              <pre><code className='language-javascript'>
                {`
                <Row className="gy-3">
                <Col xl={12}>
                  <Form.Label htmlFor="input-rounded1">Default</Form.Label>
                  <Form.Control type="text" id="input-rounded1" placeholder="Default" />
                </Col>
                <Col xl={12}>
                  <Form.Label htmlFor="input-rounded2">Dotted Input</Form.Label>
                  <Form.Control type="text" className="border-dotted" id="input-rounded2" placeholder="Dotted" />
                </Col>
                <Col xl={12}>
                  <Form.Label htmlFor="input-rounded3">Dashed Input</Form.Label>
                  <Form.Control type="text" className="border-dashed" id="input-rounded3" placeholder="Dashed" />
                </Col>
              </Row>
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
              <div className='card-title'>
                Input Sizing
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={toggleHidden3}>Show Code<i className={`${isHidden3 ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden3 ? 'd-none' : ''}`}>
              <Form.Control className="form-control-sm mb-3" type="text"
                placeholder=".form-control-sm" aria-label=".form-control-sm example" />
              <Form.Control className="mb-3" type="text" placeholder="Default input"
                aria-label="default input example" />
              <Form.Control className="form-control-lg" type="text"
                placeholder=".form-control-lg" aria-label=".form-control-lg example" />
            </Card.Body>
            <div className={`card-footer border-top-0 ${isHidden3 ? '' : 'd-none'}`}>
              <pre><code className='language-javascript'>
                {`
                 <Form.Control className="form-control-sm mb-3" type="text"
                 placeholder=".form-control-sm" aria-label=".form-control-sm example" />
               <Form.Control className="mb-3" type="text" placeholder="Default input"
                 aria-label="default input example" />
               <Form.Control className="form-control-lg" type="text"
                 placeholder=".form-control-lg" aria-label=".form-control-lg example" />
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
              <div className='card-title'>
                Overview
              </div>
              <div className="prism-toggle">
                <Button size='sm' variant='primary-light' onClick={toggleHidden4}>Show Code<i className={`${isHidden4 ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></Button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden4 ? 'd-none' : ''}`}>
              <form>
                <div className="mb-3">
                  <Form.Label htmlFor="exampleInputEmail1">Email
                    address</Form.Label>
                  <Form.Control type="email" id="exampleInputEmail1/"
                    aria-describedby="emailHelp" />
                  <div id="emailHelp" className="form-text">We'll
                    never share your email
                    with
                    anyone else.</div>
                </div>
                <div className="mb-3">
                  <Form.Label htmlFor="exampleInputPassword1">Password</Form.Label>
                  <Form.Control type="password" id="exampleInputPassword1" />
                </div>
                <Form.Check label="Check me out" name="group1" type='checkbox' className='mb-3' />
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
            </Card.Body>
            <div className={`card-footer border-top-0 ${isHidden4 ? '' : 'd-none'}`}>
              <pre><code className='language-javascript'>
                {`
               <form>
               <div className="mb-3">
                 <Form.Label htmlFor="exampleInputEmail1">Email
                   address</Form.Label>
                 <Form.Control type="email" id="exampleInputEmail1/"
                   aria-describedby="emailHelp" />
                 <div id="emailHelp" className="form-text">We'll
                   never share your email
                   with
                   anyone else.</div>
               </div>
               <div className="mb-3">
                 <Form.Label htmlFor="exampleInputPassword1">Password</Form.Label>
                 <Form.Control type="password" id="exampleInputPassword1" />
               </div>
                <Form.Check label="Check me out" name="group1" type='radio'/>
               <button type="submit" className="btn btn-primary">Submit</button>
             </form>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={6}>
          <Row>
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header className="justify-content-between">
                  <div className='card-title'>
                    Form text
                  </div>
                  <div className="prism-toggle">
                    <Button size='sm' variant='primary-light' onClick={toggleHidden5}>Show Code<i className={`${isHidden5 ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></Button>
                  </div>
                </Card.Header>
                <Card.Body className={`${isHidden5 ? 'd-none' : ''}`}>
                  <Form.Label htmlFor="inputPassword5">Password</Form.Label>
                  <Form.Control type="password" id="inputPassword5"
                    aria-describedby="passwordHelpBlock" />
                  <div id="passwordHelpBlock" className="form-text">
                    Your password must be 8-20 characters long, contain letters and
                    numbers,
                    and
                    must not contain spaces, special characters, or emoji.
                  </div>
                </Card.Body>
                <div className={`${isHidden5 ? '' : 'd-none'} card-footer border-top-0`}>
                  <pre><code className='language-javascript'>
                    {`
               <Form.Label htmlFor="inputPassword5">Password</Form.Label>
               <Form.Control type="password" id="inputPassword5"
                 aria-describedby="passwordHelpBlock" />
               <div id="passwordHelpBlock" className="form-text">
                 Your password must be 8-20 characters long, contain letters and
                 numbers,
                 and
                 must not contain spaces, special characters, or emoji.
               </div>
                `}
                  </code></pre>
                </div>
              </Card>
            </Col>
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header className="justify-content-between">
                  <div className='card-title'>
                    Inline text can use any typical inline HTML element with nothing more
                    than
                    the <span className="text-danger">.form-text</span> class.
                  </div>
                  <div className="prism-toggle">
                    <Button size='sm' variant='primary-light' onClick={toggleHidden6}>Show Code<i className={`${isHidden6 ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></Button>
                  </div>
                </Card.Header>
                <Card.Body className={`${isHidden6 ? 'd-none' : ''}`}>
                  <Row className="g-3 align-items-center">
                    <div className="col-auto">
                      <Form.Label htmlFor="inputPassword6" className="col-form-label">Password</Form.Label>
                    </div>
                    <div className="col-auto">
                      <Form.Control type="password" id="inputPassword6"
                        aria-describedby="passwordHelpInline" />
                    </div>
                    <div className="col-auto">
                      <span id="passwordHelpInline" className="form-text">
                        Must be 8-20 characters long.
                      </span>
                    </div>
                  </Row>
                </Card.Body>
                <div className={`card-footer border-top-0 ${isHidden6 ? '' : 'd-none'}`}>
                  <pre><code className='language-javascript'>
                    {`
                <Row className="g-3 align-items-center">
                <div className="col-auto">
                  <Form.Label htmlFor="inputPassword6" className="col-form-label">Password</Form.Label>
                </div>
                <div className="col-auto">
                  <Form.Control type="password" id="inputPassword6"
                    aria-describedby="passwordHelpInline" />
                </div>
                <div className="col-auto">
                  <span id="passwordHelpInline" className="form-text">
                    Must be 8-20 characters long.
                  </span>
                </div>
              </Row>
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
              <div className='card-title'>
                Disabled forms
              </div>
              <div className="prism-toggle">
                <Button size='sm' variant='primary-light' onClick={toggleHidden7}>Show Code<i className={`${isHidden7 ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></Button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden7 ? 'd-none' : ''}`}>
              <form>
                <fieldset disabled>
                  <legend>Disabled fieldset example</legend>
                  <div className="mb-3">
                    <Form.Label htmlFor="disabledTextInput">Disabled
                      input</Form.Label>
                    <Form.Control type="text" id="disabledTextInput"
                      placeholder="Disabled input" />
                  </div>
                  <div className="mb-3">
                    <Form.Label htmlFor="disabledSelect">Disabled select
                      menu</Form.Label>
                    <select id="disabledSelect" className="form-select">
                      <option>Disabled select</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <Form.Check label="Can't check this" name="group1" type='checkbox' disabled />
                  </div>
                  <button type="submit" className="btn btn-primary">Submit</button>
                </fieldset>
              </form>
            </Card.Body>

            <div className={`card-footer border-top-0 ${isHidden7 ? '' : 'd-none'}`}>
              <pre><code className='language-javascript'>
                {`
                <form>
                <fieldset disabled>
                  <legend>Disabled fieldset example</legend>
                  <div className="mb-3">
                    <Form.Label htmlFor="disabledTextInput">Disabled
                      input</Form.Label>
                    <Form.Control type="text" id="disabledTextInput"
                      placeholder="Disabled input" />
                  </div>
                  <div className="mb-3">
                    <Form.Label htmlFor="disabledSelect">Disabled select
                      menu</Form.Label>
                    <select id="disabledSelect" className="form-select">
                      <option>Disabled select</option>
                    </select>
                  </div>
                  <div className="mb-3">
                  <Form.Check label="Can't check this" name="group1" type='checkbox' disabled/>
                  </div>
                  <button type="submit" className="btn btn-primary">Submit</button>
                </fieldset>
              </form>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>
     
    </Fragment >
  )
}

export default Inputs;
