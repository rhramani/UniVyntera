import { Fragment, useState } from "react";
import { Row, Col, Card, Form, InputGroup, Button } from "react-bootstrap";
import * as formik from 'formik';
import * as yup from 'yup';
import Pageheader from "../../layouts/Pageheader";

const FormValidation = () => {

  const { Formik } = formik;

  //Custom Validation

  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  //SSR Validation



  const schema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    username: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    zip: yup.string().required(),
    terms: yup.bool().required().oneOf([true], 'Terms must be accepted'),
  });

  //Tooltip Validation

  const schema1 = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    username: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    zip: yup.string().required(),
    file: yup.mixed().required(),
    terms: yup.bool().required().oneOf([true], 'terms must be accepted'),
  });


  const [selectedOption, setSelectedOption] = useState('');

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
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
      <Pageheader mainheading='Validation' parentfolder='Forms' activepage='Validation' />


      <Row className="row-sm">
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <Card.Title as="h6"> Custom Validation </Card.Title>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(0)}>Show Code<i className={`${isHidden[0] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>First name</Form.Label>
                    <Form.Control required type="text" placeholder="First name" defaultValue="Mark" />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control required type="text" placeholder="Last name" defaultValue="Otto" />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustomUsername">
                    <Form.Label>Username</Form.Label>
                    <InputGroup hasValidation>
                      <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                      <Form.Control type="text" placeholder="Username" aria-describedby="inputGroupPrepend" required />
                      <Form.Control.Feedback type="invalid"> Please choose a username. </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="validationCustom03">
                    <Form.Label>City</Form.Label>
                    <Form.Control type="text" placeholder="City" required />
                    <Form.Control.Feedback type="invalid"> Please provide a valid city. </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId="validationCustom04">
                    <Form.Label>State</Form.Label>
                    <Form.Control type="text" placeholder="State" required />
                    <Form.Control.Feedback type="invalid"> Please provide a valid state. </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId="validationCustom05">
                    <Form.Label>Zip</Form.Label>
                    <Form.Control type="text" placeholder="Zip" required />
                    <Form.Control.Feedback type="invalid"> Please provide a valid zip. </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Check required label="Agree to terms and conditions" feedback="You must agree before submitting." feedbackType="invalid" />
                </Form.Group>
                <Button type="submit">Submit form</Button>
              </Form>
            </Card.Body>
            <div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>First name</Form.Label>
                    <Form.Control required type="text" placeholder="First name" defaultValue="Mark" />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control required type="text" placeholder="Last name" defaultValue="Otto" />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustomUsername">
                    <Form.Label>Username</Form.Label>
                    <InputGroup hasValidation>
                      <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                      <Form.Control type="text" placeholder="Username" aria-describedby="inputGroupPrepend" required />
                      <Form.Control.Feedback type="invalid"> Please choose a username. </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="validationCustom03">
                    <Form.Label>City</Form.Label>
                    <Form.Control type="text" placeholder="City" required />
                    <Form.Control.Feedback type="invalid"> Please provide a valid city. </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId="validationCustom04">
                    <Form.Label>State</Form.Label>
                    <Form.Control type="text" placeholder="State" required />
                    <Form.Control.Feedback type="invalid"> Please provide a valid state. </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId="validationCustom05">
                    <Form.Label>Zip</Form.Label>
                    <Form.Control type="text" placeholder="Zip" required />
                    <Form.Control.Feedback type="invalid"> Please provide a valid zip. </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Check required label="Agree to terms and conditions" feedback="You must agree before submitting." feedbackType="invalid" />
                </Form.Group>
                <Button type="submit">Submit form</Button>
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
              <Card.Title as="h6"> Browser deafult Validation </Card.Title>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(1)}>Show Code<i className={`${isHidden[1] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[1] ? 'd-none' : ''}`}>
              <Form validated>
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>First name</Form.Label>
                    <Form.Control required type="text" placeholder="First name" defaultValue="Mark" />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control required type="text" placeholder="Last name" defaultValue="Otto" />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustomUsername">
                    <Form.Label>Username</Form.Label>
                    <InputGroup hasValidation>
                      <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                      <Form.Control type="text" placeholder="Username" aria-describedby="inputGroupPrepend" required />
                      <Form.Control.Feedback type="invalid"> Please choose a username. </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="validationCustom03">
                    <Form.Label>City</Form.Label>
                    <Form.Control type="text" placeholder="City" required />
                    <Form.Control.Feedback type="invalid"> Please provide a valid city. </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId="validationCustom04">
                    <Form.Label>State</Form.Label>
                    <Form.Control type="text" placeholder="State" required />
                    <Form.Control.Feedback type="invalid"> Please provide a valid state. </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId="validationCustom05">
                    <Form.Label>Zip</Form.Label>
                    <Form.Control type="text" placeholder="Zip" required />
                    <Form.Control.Feedback type="invalid"> Please provide a valid zip. </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Check required label="Agree to terms and conditions" feedback="You must agree before submitting." feedbackType="invalid" />
                </Form.Group>
                <Button type="submit">Submit form</Button>
              </Form>
            </Card.Body>
            <div className={`${isHidden[1] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Form validated>
        <Row className="mb-3">
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Label>First name</Form.Label>
            <Form.Control required type="text" placeholder="First name" defaultValue="Mark" />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustom02">
            <Form.Label>Last name</Form.Label>
            <Form.Control required type="text" placeholder="Last name" defaultValue="Otto" />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustomUsername">
            <Form.Label>Username</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
              <Form.Control type="text" placeholder="Username" aria-describedby="inputGroupPrepend" required />
              <Form.Control.Feedback type="invalid"> Please choose a username. </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="6" controlId="validationCustom03">
            <Form.Label>City</Form.Label>
            <Form.Control type="text" placeholder="City" required />
            <Form.Control.Feedback type="invalid"> Please provide a valid city. </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="3" controlId="validationCustom04">
            <Form.Label>State</Form.Label>
            <Form.Control type="text" placeholder="State" required />
            <Form.Control.Feedback type="invalid"> Please provide a valid state. </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="3" controlId="validationCustom05">
            <Form.Label>Zip</Form.Label>
            <Form.Control type="text" placeholder="Zip" required />
            <Form.Control.Feedback type="invalid"> Please provide a valid zip. </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Form.Group className="mb-3">
          <Form.Check required label="Agree to terms and conditions" feedback="You must agree before submitting." feedbackType="invalid" />
        </Form.Group>
        <Button type="submit">Submit form</Button>
      </Form>
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
                  <Card.Title as="h6"> Server side Validation </Card.Title>
                  <div className="prism-toggle">
                    <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(2)}>Show Code<i className={`${isHidden[2] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                  </div>
                </Card.Header>
                <Card.Body className={`${isHidden[2] ? 'd-none' : ''}`}>
                  <Formik
                    validationSchema={schema}
                    onSubmit={console.log}
                    initialValues={{
                      firstName: 'Mark',
                      lastName: 'Otto',
                      username: '',
                      city: '',
                      state: '',
                      zip: '',
                      terms: false,
                    }}
                  >
                    {({ handleSubmit, handleChange, values, touched, errors }) => (
                      <Form noValidate onSubmit={handleSubmit}>
                        <Row className="mb-3">
                          <Form.Group as={Col} md="4" controlId="validationFormik01">
                            <Form.Label>First name</Form.Label>
                            <Form.Control
                              type="text"
                              name="firstName"
                              value={values.firstName}
                              onChange={handleChange}
                              isValid={touched.firstName && !errors.firstName}
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group as={Col} md="4" controlId="validationFormik02">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control
                              type="text"
                              name="lastName"
                              value={values.lastName}
                              onChange={handleChange}
                              isValid={touched.lastName && !errors.lastName}
                            />

                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group as={Col} md="4" controlId="validationFormikUsername">
                            <Form.Label>Username</Form.Label>
                            <InputGroup hasValidation>
                              <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                              <Form.Control
                                type="text"
                                placeholder="Username"
                                aria-describedby="inputGroupPrepend"
                                name="username"
                                value={values.username}
                                onChange={handleChange}
                                isInvalid={!!errors.username}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.username}
                              </Form.Control.Feedback>
                            </InputGroup>
                          </Form.Group>
                        </Row>
                        <Row className="mb-3">
                          <Form.Group as={Col} md="6" controlId="validationFormik03">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="City"
                              name="city"
                              value={values.city}
                              onChange={handleChange}
                              isInvalid={!!errors.city}
                            />

                            <Form.Control.Feedback type="invalid">
                              {errors.city}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group as={Col} md="3" controlId="validationFormik04">
                            <Form.Label>State</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="State"
                              name="state"
                              value={values.state}
                              onChange={handleChange}
                              isInvalid={!!errors.state}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.state}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group as={Col} md="3" controlId="validationFormik05">
                            <Form.Label>Zip</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Zip"
                              name="zip"
                              value={values.zip}
                              onChange={handleChange}
                              isInvalid={!!errors.zip}
                            />

                            <Form.Control.Feedback type="invalid">
                              {errors.zip}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Row>
                        <Form.Group className="mb-3">
                          <Form.Check
                            required
                            name="terms"
                            label="Agree to terms and conditions"
                            onChange={handleChange}
                            isInvalid={!!errors.terms}
                            feedback={errors.terms}
                            feedbackType="invalid"
                            id="validationFormik0"
                          />
                        </Form.Group>
                        <Button type="submit">Submit form</Button>
                      </Form>
                    )}
                  </Formik>
                </Card.Body>
                <div className={`${isHidden[2] ? '' : 'd-none'} card-footer border-top-0 `}>
                  <pre><code className='language-javascript'>
                    {`
        <Card.Body>
        <Formik
                    validationSchema={schema}
                    onSubmit={console.log}
                    initialValues={{
                      firstName: 'Mark',
                      lastName: 'Otto',
                      username: '',
                      city: '',
                      state: '',
                      zip: '',
                      terms: false,
                    }}
                  >
                    {({ handleSubmit, handleChange, values, touched, errors }) => (
                      <Form noValidate onSubmit={handleSubmit}>
                        <Row className="mb-3">
                          <Form.Group as={Col} md="4" controlId="validationFormik01">
                            <Form.Label>First name</Form.Label>
                            <Form.Control
                              type="text"
                              name="firstName"
                              value={values.firstName}
                              onChange={handleChange}
                              isValid={touched.firstName && !errors.firstName}
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group as={Col} md="4" controlId="validationFormik02">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control
                              type="text"
                              name="lastName"
                              value={values.lastName}
                              onChange={handleChange}
                              isValid={touched.lastName && !errors.lastName}
                            />

                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group as={Col} md="4" controlId="validationFormikUsername">
                            <Form.Label>Username</Form.Label>
                            <InputGroup hasValidation>
                              <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                              <Form.Control
                                type="text"
                                placeholder="Username"
                                aria-describedby="inputGroupPrepend"
                                name="username"
                                value={values.username}
                                onChange={handleChange}
                                isInvalid={!!errors.username}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.username}
                              </Form.Control.Feedback>
                            </InputGroup>
                          </Form.Group>
                        </Row>
                        <Row className="mb-3">
                          <Form.Group as={Col} md="6" controlId="validationFormik03">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="City"
                              name="city"
                              value={values.city}
                              onChange={handleChange}
                              isInvalid={!!errors.city}
                            />

                            <Form.Control.Feedback type="invalid">
                              {errors.city}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group as={Col} md="3" controlId="validationFormik04">
                            <Form.Label>State</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="State"
                              name="state"
                              value={values.state}
                              onChange={handleChange}
                              isInvalid={!!errors.state}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.state}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group as={Col} md="3" controlId="validationFormik05">
                            <Form.Label>Zip</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Zip"
                              name="zip"
                              value={values.zip}
                              onChange={handleChange}
                              isInvalid={!!errors.zip}
                            />

                            <Form.Control.Feedback type="invalid">
                              {errors.zip}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Row>
                        <Form.Group className="mb-3">
                          <Form.Check
                            required
                            name="terms"
                            label="Agree to terms and conditions"
                            onChange={handleChange}
                            isInvalid={!!errors.terms}
                            feedback={errors.terms}
                            feedbackType="invalid"
                            id="validationFormik0"
                          />
                        </Form.Group>
                        <Button type="submit">Submit form</Button>
                      </Form>
                    )}
                  </Formik>
        </Card.Body>
                `}
                  </code></pre>
                </div>
              </Card>
            </Col>
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header className="justify-content-between">
                  <Card.Title as="h6">
                    Tooltips
                  </Card.Title>
                  <div className="prism-toggle">
                    <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(3)}>Show Code<i className={`${isHidden[3] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                  </div>
                </Card.Header>
                <Card.Body className={`${isHidden[3] ? 'd-none' : ''}`}>
                  <Formik validationSchema={schema1} onSubmit={console.log} initialValues={{ firstName: 'Mark', lastName: 'Otto', username: '', city: '', state: '', zip: '', file: null, terms: false, }}>
                    {({ handleSubmit, handleChange, values, touched, errors }) => (
                      <Form noValidate onSubmit={handleSubmit}>
                        <Row className="mb-3">
                          <Form.Group as={Col} md="4" controlId="validationFormik101" className="position-relative" >
                            <Form.Label>First name</Form.Label>
                            <Form.Control type="text" name="firstName" value={values.firstName} onChange={handleChange} isValid={touched.firstName && !errors.firstName} />
                            <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group as={Col} md="4" controlId="validationFormik102" className="position-relative" >
                            <Form.Label>Last name</Form.Label>
                            <Form.Control type="text" name="lastName" value={values.lastName} onChange={handleChange} isValid={touched.lastName && !errors.lastName} />

                            <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group as={Col} md="4" controlId="validationFormikUsername2">
                            <Form.Label>Username</Form.Label>
                            <InputGroup hasValidation>
                              <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                              <Form.Control type="text" placeholder="Username" aria-describedby="inputGroupPrepend" name="username" value={values.username} onChange={handleChange} isInvalid={!!errors.username} />
                              <Form.Control.Feedback type="invalid" tooltip>
                                {errors.username}
                              </Form.Control.Feedback>
                            </InputGroup>
                          </Form.Group>
                        </Row>
                        <Row className="mb-3">
                          <Form.Group as={Col} md="6" controlId="validationFormik103" className="position-relative" >
                            <Form.Label>City</Form.Label>
                            <Form.Control type="text" placeholder="City" name="city" value={values.city} onChange={handleChange} isInvalid={!!errors.city} />
                            <Form.Control.Feedback type="invalid" tooltip>
                              {errors.city}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group as={Col} md="3" controlId="validationFormik104" className="position-relative" >
                            <Form.Label>State</Form.Label>
                            <Form.Control type="text" placeholder="State" name="state" value={values.state} onChange={handleChange} isInvalid={!!errors.state} />
                            <Form.Control.Feedback type="invalid" tooltip>
                              {errors.state}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group as={Col} md="3" controlId="validationFormik105" className="position-relative" >
                            <Form.Label>Zip</Form.Label>
                            <Form.Control type="text" placeholder="Zip" name="zip" value={values.zip} onChange={handleChange} isInvalid={!!errors.zip} />
                            <Form.Control.Feedback type="invalid" tooltip>
                              {errors.zip}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Row>
                        <Form.Group className="position-relative mb-3">
                          <Form.Label>File</Form.Label>
                          <Form.Control type="file" required name="file" onChange={handleChange} isInvalid={!!errors.file} />
                          <Form.Control.Feedback type="invalid" tooltip>
                            {errors.file}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="position-relative mb-3">
                          <Form.Check required name="terms" label="Agree to terms and conditions" onChange={handleChange} isInvalid={!!errors.terms} feedback={errors.terms} feedbackType="invalid" id="validationFormik106" feedbackTooltip />
                        </Form.Group>
                        <Button type="submit">Submit form</Button>
                      </Form>
                    )}
                  </Formik>
                </Card.Body>
                <div className={`${isHidden[3] ? '' : 'd-none'} card-footer border-top-0 `}>
                  <pre><code className='language-javascript'>
                    {`
        <Card.Body>
        <Formik validationSchema={schema1} onSubmit={console.log} initialValues={{ firstName: 'Mark', lastName: 'Otto', username: '', city: '', state: '', zip: '', file: null, terms: false, }}>
        {({ handleSubmit, handleChange, values, touched, errors }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="validationFormik101" className="position-relative" >
                <Form.Label>First name</Form.Label>
                <Form.Control type="text" name="firstName" value={values.firstName} onChange={handleChange} isValid={touched.firstName && !errors.firstName} />
                <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationFormik102" className="position-relative" >
                <Form.Label>Last name</Form.Label>
                <Form.Control type="text" name="lastName" value={values.lastName} onChange={handleChange} isValid={touched.lastName && !errors.lastName} />

                <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationFormikUsername2">
                <Form.Label>Username</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                  <Form.Control type="text" placeholder="Username" aria-describedby="inputGroupPrepend" name="username" value={values.username} onChange={handleChange} isInvalid={!!errors.username} />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {errors.username}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="validationFormik103" className="position-relative" >
                <Form.Label>City</Form.Label>
                <Form.Control type="text" placeholder="City" name="city" value={values.city} onChange={handleChange} isInvalid={!!errors.city} />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.city}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="validationFormik104" className="position-relative" >
                <Form.Label>State</Form.Label>
                <Form.Control type="text" placeholder="State" name="state" value={values.state} onChange={handleChange} isInvalid={!!errors.state} />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.state}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="validationFormik105" className="position-relative" >
                <Form.Label>Zip</Form.Label>
                <Form.Control type="text" placeholder="Zip" name="zip" value={values.zip} onChange={handleChange} isInvalid={!!errors.zip} />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.zip}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Form.Group className="position-relative mb-3">
              <Form.Label>File</Form.Label>
              <Form.Control type="file" required name="file" onChange={handleChange} isInvalid={!!errors.file} />
              <Form.Control.Feedback type="invalid" tooltip>
                {errors.file}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="position-relative mb-3">
              <Form.Check required name="terms" label="Agree to terms and conditions" onChange={handleChange} isInvalid={!!errors.terms} feedback={errors.terms} feedbackType="invalid" id="validationFormik106" feedbackTooltip />
            </Form.Group>
            <Button type="submit">Submit form</Button>
          </Form>
        )}
      </Formik>
        </Card.Body>
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
              <Card.Title as="h6"> Supported elements </Card.Title>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(4)}>Show Code<i className={`${isHidden[4] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[4] ? 'd-none' : ''}`}>
              <Form validated>
                <div className="mb-3">
                  <Form.Label htmlFor="validationTextarea">Textarea</Form.Label>
                  <Form.Control as='textarea' isInvalid id="validationTextarea"
                    placeholder="Required example textarea" required></Form.Control>
                  <Form.Control.Feedback type="invalid"> Please enter a message in the textarea. </Form.Control.Feedback>
                </div>
                <Form.Check required type="checkbox" label="Check this checkbox" feedback="Example invalid feedback text" feedbackType="invalid" />

                <Form.Check
                  required
                  type="radio"
                  label="Toggle this radio"
                  name="radioGroup"
                  value="option1"
                  defaultChecked={selectedOption === 'option1'}
                  onChange={handleRadioChange}
                  isInvalid={!selectedOption}
                  feedback="Please select an option"
                />
                <Form.Check
                  required
                  type="radio"
                  label="Or toggle this other radio"
                  name="radioGroup"
                  value="option2"
                  defaultChecked={selectedOption === 'option2'}
                  onChange={handleRadioChange}
                  isInvalid={!selectedOption}
                  feedback="Please select an option"
                />

                <div className="mb-3">
                  <Form.Select required aria-label="select example">
                    <option value="">Open this select menu</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid"> Example invalid select feedback </Form.Control.Feedback>
                </div>

                <div className="mb-3">
                  <Form.Control type="file" aria-label="file example" required />
                  <Form.Control.Feedback type="invalid">Example invalid form file feedback </Form.Control.Feedback>
                </div>
                <div className="mb-3">
                  <Button type="submit" disabled>Submit form</Button>
                </div>
              </Form>
            </Card.Body>
            <div className={`${isHidden[4] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Form validated>
                <div className="mb-3">
                  <Form.Label htmlFor="validationTextarea">Textarea</Form.Label>
                  <Form.Control as='textarea' isInvalid id="validationTextarea"
                    placeholder="Required example textarea" required></Form.Control>
                  <Form.Control.Feedback type="invalid"> Please enter a message in the textarea. </Form.Control.Feedback>
                </div>
                <Form.Check required type="checkbox" label="Check this checkbox" feedback="Example invalid feedback text" feedbackType="invalid" />

                <Form.Check
                  required
                  type="radio"
                  label="Toggle this radio"
                  name="radioGroup"
                  value="option1"
                  defaultChecked={selectedOption === 'option1'}
                  onChange={handleRadioChange}
                  isInvalid={!selectedOption}
                  feedback="Please select an option"
                />
                <Form.Check
                  required
                  type="radio"
                  label="Or toggle this other radio"
                  name="radioGroup"
                  value="option2"
                  defaultChecked={selectedOption === 'option2'}
                  onChange={handleRadioChange}
                  isInvalid={!selectedOption}
                  feedback="Please select an option"
                />

                <div className="mb-3">
                  <Form.Select required aria-label="select example">
                    <option value="">Open this select menu</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid"> Example invalid select feedback </Form.Control.Feedback>
                </div>

                <div className="mb-3">
                  <Form.Control type="file" aria-label="file example" required />
                  <Form.Control.Feedback type="invalid">Example invalid form file feedback </Form.Control.Feedback>
                </div>
                <div className="mb-3">
                  <Button type="submit" disabled>Submit form</Button>
                </div>
              </Form>
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

export default FormValidation;
