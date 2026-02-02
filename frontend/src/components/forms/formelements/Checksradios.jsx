import { Fragment, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import Pageheader from '../../../layouts/Pageheader';

const ChecksRadios = () => {
  const toggleNames = [
    'toggle1',
    'toggle2',
    'toggle3',
    'toggle4',
    'toggle5',
    'toggle6',
    'toggle7',
    'toggle8',
  ];

  const toggleColors = [
    'primary',
    'secondary',
    'warning',
    'info',
    'success',
    'danger',
    'light',
    'dark',
  ];

  const [toggles, setToggles] = useState(
    toggleNames.reduce((acc, toggle) => ({ ...acc, [toggle]: true }), {})
  );

  const handleToggleClick = (toggleName) => {
    setToggles((prevToggles) => ({
      ...prevToggles,
      [toggleName]: !prevToggles[toggleName],
    }));
  };


  const [toggleStates, setToggleStates] = useState({
    toggleSm: true,
    toggleDefault: true,
    toggleLg: true,
  });

  const handleToggleChange = (toggleName) => {
    setToggleStates((prevState) => ({
      ...prevState,
      [toggleName]: !prevState[toggleName],
    }));
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
      <Pageheader mainheading='Checks & Radios' parentfolder='Form Elements' activepage='Checks & Radios' />


      <Row className="row-sm">
        <Col xl={3} lg={6} md={6} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Checks
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(0)}>Show Code<i className={`${isHidden[0] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  Default checkbox
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked"
                  defaultChecked />
                <label className="form-check-label" htmlFor="flexCheckChecked">
                  Checked checkbox
                </label>
              </div>
            </Card.Body>
            <div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="form-check">
        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
        <label className="form-check-label" htmlFor="flexCheckDefault">
          Default checkbox
        </label>
      </div>
      <div className="form-check">
        <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked"
          defaultChecked />
        <label className="form-check-label" htmlFor="flexCheckChecked">
          Checked checkbox
        </label>
      </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={3} lg={6} md={6} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Disabled
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(1)}>Show Code<i className={`${isHidden[1] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[1] ? 'd-none' : ''}`}>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDisabled"
                  disabled />
                <label className="form-check-label" htmlFor="flexCheckDisabled">
                  Disabled checkbox
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value=""
                  id="flexCheckCheckedDisabled" defaultChecked disabled />
                <label className="form-check-label" htmlFor="flexCheckCheckedDisabled">
                  Disabled checked checkbox
                </label>
              </div>
            </Card.Body>
            <div className={`${isHidden[1] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="form-check">
        <input className="form-check-input" type="checkbox" value="" id="flexCheckDisabled"
          disabled />
        <label className="form-check-label" htmlFor="flexCheckDisabled">
          Disabled checkbox
        </label>
      </div>
      <div className="form-check">
        <input className="form-check-input" type="checkbox" value=""
          id="flexCheckCheckedDisabled" defaultChecked disabled />
        <label className="form-check-label" htmlFor="flexCheckCheckedDisabled">
          Disabled checked checkbox
        </label>
      </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={3} lg={6} md={6} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Radios
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(2)}>Show Code<i className={`${isHidden[2] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[2] ? 'd-none' : ''}`}>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault"
                  id="flexRadioDefault1" />
                <label className="form-check-label" htmlFor="flexRadioDefault1">
                  Default radio
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault"
                  id="flexRadioDefault2" defaultChecked />
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                  Default checked radio
                </label>
              </div>
            </Card.Body>
            <div className={`${isHidden[2] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="form-check">
        <input className="form-check-input" type="radio" name="flexRadioDefault"
          id="flexRadioDefault1" />
        <label className="form-check-label" htmlFor="flexRadioDefault1">
          Default radio
        </label>
      </div>
      <div className="form-check">
        <input className="form-check-input" type="radio" name="flexRadioDefault"
          id="flexRadioDefault2" defaultChecked />
        <label className="form-check-label" htmlFor="flexRadioDefault2">
          Default checked radio
        </label>
      </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={3} lg={6} md={6} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Disabled
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(3)}>Show Code<i className={`${isHidden[3] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[3] ? 'd-none' : ''}`}>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDisabled"
                  id="flexRadioDisabled" disabled />
                <label className="form-check-label" htmlFor="flexRadioDisabled">
                  Disabled radio
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDisabled"
                  id="flexRadioCheckedDisabled" defaultChecked disabled />
                <label className="form-check-label" htmlFor="flexRadioCheckedDisabled">
                  Disabled checked radio
                </label>
              </div>
            </Card.Body>
            <div className={`${isHidden[3] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="form-check">
        <input className="form-check-input" type="radio" name="flexRadioDisabled"
          id="flexRadioDisabled" disabled />
        <label className="form-check-label" htmlFor="flexRadioDisabled">
          Disabled radio
        </label>
      </div>
      <div className="form-check">
        <input className="form-check-input" type="radio" name="flexRadioDisabled"
          id="flexRadioCheckedDisabled" defaultChecked disabled />
        <label className="form-check-label" htmlFor="flexRadioCheckedDisabled">
          Disabled checked radio
        </label>
      </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <Col xl={6} lg={6} md={12} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Default (stacked)
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(4)}>Show Code<i className={`${isHidden[4] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[4] ? 'd-none' : ''}`}>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                <label className="form-check-label" htmlFor="defaultCheck1">
                  Default checkbox
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="defaultCheck2"
                  disabled />
                <label className="form-check-label" htmlFor="defaultCheck2">
                  Disabled checkbox
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="exampleRadios"
                  id="exampleRadios1" value="option1" defaultChecked />
                <label className="form-check-label" htmlFor="exampleRadios1">
                  Default radio
                </label>
              </div>
              <div className="form-check mb-0">
                <input className="form-check-input" type="radio" name="exampleRadios"
                  id="exampleRadios3" value="option3" disabled />
                <label className="form-check-label" htmlFor="exampleRadios3">
                  Disabled radio
                </label>
              </div>
            </Card.Body>
            <div className={`${isHidden[4] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                <label className="form-check-label" htmlFor="defaultCheck1">
                  Default checkbox
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="defaultCheck2"
                  disabled />
                <label className="form-check-label" htmlFor="defaultCheck2">
                  Disabled checkbox
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="exampleRadios"
                  id="exampleRadios1" value="option1" defaultChecked />
                <label className="form-check-label" htmlFor="exampleRadios1">
                  Default radio
                </label>
              </div>
              <div className="form-check mb-0">
                <input className="form-check-input" type="radio" name="exampleRadios"
                  id="exampleRadios3" value="option3" disabled />
                <label className="form-check-label" htmlFor="exampleRadios3">
                  Disabled radio
                </label>
              </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={6} lg={6} md={12} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Switches
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(5)}>Show Code<i className={`${isHidden[5] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[5] ? 'd-none' : ''}`}>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch"
                  id="flexSwitchCheckDefault" />
                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Default switch
                  checkbox input</label>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch"
                  id="flexSwitchCheckChecked" defaultChecked />
                <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Checked switch
                  checkbox input</label>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch"
                  id="flexSwitchCheckDisabled" disabled />
                <label className="form-check-label" htmlFor="flexSwitchCheckDisabled">Disabled
                  switch
                  checkbox input</label>
              </div>
              <div className="form-check form-switch mb-0">
                <input className="form-check-input" type="checkbox" role="switch"
                  id="flexSwitchCheckCheckedDisabled" defaultChecked disabled />
                <label className="form-check-label" htmlFor="flexSwitchCheckCheckedDisabled">Disabled
                  checked switch checkbox input</label>
              </div>
            </Card.Body>
            <div className={`${isHidden[5] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="form-check form-switch">
        <input className="form-check-input" type="checkbox" role="switch"
          id="flexSwitchCheckDefault" />
        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Default switch
          checkbox input</label>
      </div>
      <div className="form-check form-switch">
        <input className="form-check-input" type="checkbox" role="switch"
          id="flexSwitchCheckChecked" defaultChecked />
        <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Checked switch
          checkbox input</label>
      </div>
      <div className="form-check form-switch">
        <input className="form-check-input" type="checkbox" role="switch"
          id="flexSwitchCheckDisabled" disabled />
        <label className="form-check-label" htmlFor="flexSwitchCheckDisabled">Disabled
          switch
          checkbox input</label>
      </div>
      <div className="form-check form-switch mb-0">
        <input className="form-check-input" type="checkbox" role="switch"
          id="flexSwitchCheckCheckedDisabled" defaultChecked disabled />
        <label className="form-check-label" htmlFor="flexSwitchCheckCheckedDisabled">Disabled
          checked switch checkbox input</label>
      </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <Col xxl={4} xl={12} lg={12} md={12} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Checkbox Sizes
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(6)}>Show Code<i className={`${isHidden[6] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[6] ? 'd-none' : ''} d-sm-flex align-items-center justify-content-between`}>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="checkebox-sm" defaultChecked />
                <label className="form-check-label" htmlFor="checkebox-sm">
                  Default
                </label>
              </div>
              <div className="form-check form-check-md d-flex align-items-center">
                <input className="form-check-input" type="checkbox" value="" id="checkebox-md" defaultChecked />
                <label className="form-check-label" htmlFor="checkebox-md">
                  Medium
                </label>
              </div>
              <div className="form-check form-check-lg d-flex align-items-center">
                <input className="form-check-input" type="checkbox" value="" id="checkebox-lg" defaultChecked />
                <label className="form-check-label" htmlFor="checkebox-lg">
                  Large
                </label>
              </div>
            </Card.Body>
            <div className={`${isHidden[6] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="form-check">
        <input className="form-check-input" type="checkbox" value="" id="checkebox-sm" defaultChecked />
        <label className="form-check-label" htmlFor="checkebox-sm">
          Default
        </label>
      </div>
      <div className="form-check form-check-md d-flex align-items-center">
        <input className="form-check-input" type="checkbox" value="" id="checkebox-md" defaultChecked />
        <label className="form-check-label" htmlFor="checkebox-md">
          Medium
        </label>
      </div>
      <div className="form-check form-check-lg d-flex align-items-center">
        <input className="form-check-input" type="checkbox" value="" id="checkebox-lg" defaultChecked />
        <label className="form-check-label" htmlFor="checkebox-lg">
          Large
        </label>
      </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xxl={4} xl={12} lg={12} md={12} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Radio Sizes
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(7)}>Show Code<i className={`${isHidden[7] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[7] ? 'd-none' : ''} d-sm-flex align-items-center justify-content-between`}>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="Radio" id="Radio-sm" />
                <label className="form-check-label" htmlFor="Radio-sm">
                  default
                </label>
              </div>
              <div className="form-check form-check-md">
                <input className="form-check-input" type="radio" name="Radio" id="Radio-md" />
                <label className="form-check-label" htmlFor="Radio-md">
                  Medium
                </label>
              </div>
              <div className="form-check form-check-lg">
                <input className="form-check-input" type="radio" name="Radio" id="Radio-lg" defaultChecked />
                <label className="form-check-label" htmlFor="Radio-lg">
                  Large
                </label>
              </div>
            </Card.Body>
            <div className={`${isHidden[7] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="form-check">
                <input className="form-check-input" type="radio" name="Radio" id="Radio-sm" />
                <label className="form-check-label" htmlFor="Radio-sm">
                  default
                </label>
              </div>
              <div className="form-check form-check-md">
                <input className="form-check-input" type="radio" name="Radio" id="Radio-md" />
                <label className="form-check-label" htmlFor="Radio-md">
                  Medium
                </label>
              </div>
              <div className="form-check form-check-lg">
                <input className="form-check-input" type="radio" name="Radio" id="Radio-lg" defaultChecked />
                <label className="form-check-label" htmlFor="Radio-lg">
                  Large
                </label>
              </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xxl={4} xl={12} lg={12} md={12} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Switch Sizes
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(8)}>Show Code<i className={`${isHidden[8] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[8] ? 'd-none' : ''} d-sm-flex align-item-center justify-content-between`}>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch"
                  id="switch-sm" />
                <label className="form-check-label" htmlFor="switch-sm">Default</label>
              </div>
              <div className="form-check form-check-md form-switch">
                <input className="form-check-input" type="checkbox" role="switch"
                  id="switch-md" />
                <label className="form-check-label" htmlFor="switch-md">Medium</label>
              </div>
              <div className="form-check form-check-lg form-switch">
                <input className="form-check-input" type="checkbox" role="switch"
                  id="switch-lg" />
                <label className="form-check-label" htmlFor="switch-lg">Large</label>
              </div>
            </Card.Body>
            <div className={`${isHidden[8] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch"
                  id="switch-sm" />
                <label className="form-check-label" htmlFor="switch-sm">Default</label>
              </div>
              <div className="form-check form-check-md form-switch">
                <input className="form-check-input" type="checkbox" role="switch"
                  id="switch-md" />
                <label className="form-check-label" htmlFor="switch-md">Medium</label>
              </div>
              <div className="form-check form-check-lg form-switch">
                <input className="form-check-input" type="checkbox" role="switch"
                  id="switch-lg" />
                <label className="form-check-label" htmlFor="switch-lg">Large</label>
              </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <Col xl={6} lg={12} md={12} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Inline
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(9)}>Show Code<i className={`${isHidden[9] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[9] ? 'd-none' : ''}`}>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox" id="inlineCheckbox1"
                  value="option1" />
                <label className="form-check-label" htmlFor="inlineCheckbox1">1</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox" id="inlineCheckbox2"
                  value="option2" />
                <label className="form-check-label" htmlFor="inlineCheckbox2">2</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox" id="inlineCheckbox3"
                  value="option3" disabled />
                <label className="form-check-label" htmlFor="inlineCheckbox3">3 (disabled)</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="inlineRadioOptions"
                  id="inlineRadio1" value="option1" />
                <label className="form-check-label" htmlFor="inlineRadio1">1</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="inlineRadioOptions"
                  id="inlineRadio2" value="option2" />
                <label className="form-check-label" htmlFor="inlineRadio2">2</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="inlineRadioOptions"
                  id="inlineRadio3" value="option3" disabled />
                <label className="form-check-label" htmlFor="inlineRadio3">3 (disabled)</label>
              </div>
            </Card.Body>
            <div className={`${isHidden[9] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox" id="inlineCheckbox1"
                  value="option1" />
                <label className="form-check-label" htmlFor="inlineCheckbox1">1</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox" id="inlineCheckbox2"
                  value="option2" />
                <label className="form-check-label" htmlFor="inlineCheckbox2">2</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox" id="inlineCheckbox3"
                  value="option3" disabled />
                <label className="form-check-label" htmlFor="inlineCheckbox3">3 (disabled)</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="inlineRadioOptions"
                  id="inlineRadio1" value="option1" />
                <label className="form-check-label" htmlFor="inlineRadio1">1</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="inlineRadioOptions"
                  id="inlineRadio2" value="option2" />
                <label className="form-check-label" htmlFor="inlineRadio2">2</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="inlineRadioOptions"
                  id="inlineRadio3" value="option3" disabled />
                <label className="form-check-label" htmlFor="inlineRadio3">3 (disabled)</label>
              </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Without labels
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(10)}>Show Code<i className={`${isHidden[10] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[10] ? 'd-none' : ''}`}>
              <span className="me-3">
                <input className="form-check-input" type="checkbox" id="checkboxNoLabel" value=""
                  aria-label="..." />
              </span>
              <span>
                <input className="form-check-input" type="radio" name="radioNoLabel"
                  id="radioNoLabel1" value="" aria-label="..." />
              </span>
            </Card.Body>
            <div className={`${isHidden[10] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <span className="me-3">
                <input className="form-check-input" type="checkbox" id="checkboxNoLabel" value=""
                  aria-label="..." />
              </span>
              <span>
                <input className="form-check-input" type="radio" name="radioNoLabel"
                  id="radioNoLabel1" value="" aria-label="..." />
              </span>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={3} lg={12} md={12} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Reverse
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(11)}>Show Code<i className={`${isHidden[11] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[11] ? 'd-none' : ''}`}>
              <div className="form-check form-check-reverse mb-3">
                <input className="form-check-input" type="checkbox" value=""
                  id="reverseCheck1" />
                <label className="form-check-label" htmlFor="reverseCheck1">
                  Reverse checkbox
                </label>
              </div>
              <div className="form-check form-check-reverse mb-3">
                <input className="form-check-input" type="checkbox" value=""
                  id="reverseCheck2" disabled />
                <label className="form-check-label" htmlFor="reverseCheck2">
                  Disabled reverse checkbox
                </label>
              </div>

              <div className="form-check form-switch form-check-reverse">
                <input className="form-check-input" type="checkbox"
                  id="flexSwitchCheckReverse" />
                <label className="form-check-label" htmlFor="flexSwitchCheckReverse">Reverse
                  switch
                  checkbox input</label>
              </div>
            </Card.Body>
            <div className={`${isHidden[11] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="form-check form-check-reverse mb-3">
                <input className="form-check-input" type="checkbox" value=""
                  id="reverseCheck1" />
                <label className="form-check-label" htmlFor="reverseCheck1">
                  Reverse checkbox
                </label>
              </div>
              <div className="form-check form-check-reverse mb-3">
                <input className="form-check-input" type="checkbox" value=""
                  id="reverseCheck2" disabled />
                <label className="form-check-label" htmlFor="reverseCheck2">
                  Disabled reverse checkbox
                </label>
              </div>

              <div className="form-check form-switch form-check-reverse">
                <input className="form-check-input" type="checkbox"
                  id="flexSwitchCheckReverse" />
                <label className="form-check-label" htmlFor="flexSwitchCheckReverse">Reverse
                  switch
                  checkbox input</label>
              </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={3} lg={12} md={12} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Outlined styles
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(12)}>Show Code<i className={`${isHidden[12] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[12] ? 'd-none' : ''}`}>
              <input type="checkbox" className="btn-check" id="btn-check-outlined" />
              <label className="btn btn-outline-primary mb-3" htmlFor="btn-check-outlined">Single toggle</label><br />

              <input type="checkbox" className="btn-check" id="btn-check-2-outlined" defaultChecked />
              <label className="btn btn-outline-secondary mb-3"
                htmlFor="btn-check-2-outlined">Checked</label><br />

              <input type="radio" className="btn-check" name="options-outlined" id="success-outlined"
                defaultChecked />
              <label className="btn btn-outline-success m-1" htmlFor="success-outlined">Checked success
                radio</label>

              <input type="radio" className="btn-check" name="options-outlined" id="danger-outlined" />
              <label className="btn btn-outline-danger m-1" htmlFor="danger-outlined">Danger radio</label>
            </Card.Body>
            <div className={`${isHidden[12] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <input type="checkbox" className="btn-check" id="btn-check-outlined" />
              <label className="btn btn-outline-primary mb-3" htmlFor="btn-check-outlined">Single toggle</label><br />

              <input type="checkbox" className="btn-check" id="btn-check-2-outlined" defaultChecked />
              <label className="btn btn-outline-secondary mb-3"
                htmlFor="btn-check-2-outlined">Checked</label><br />

              <input type="radio" className="btn-check" name="options-outlined" id="success-outlined"
                defaultChecked />
              <label className="btn btn-outline-success m-1" htmlFor="success-outlined">Checked success
                radio</label>

              <input type="radio" className="btn-check" name="options-outlined" id="danger-outlined" />
              <label className="btn btn-outline-danger m-1" htmlFor="danger-outlined">Danger radio</label>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <Col xl={6} lg={12} md={12} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Radio toggle buttons
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(13)}>Show Code<i className={`${isHidden[13] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[13] ? 'd-none' : ''}`}>
              <input type="radio" className="btn-check" name="options" id="option1"
                defaultChecked />
              <label className="btn btn-primary m-1" htmlFor="option1">Checked</label>

              <input type="radio" className="btn-check" name="options" id="option2" />
              <label className="btn btn-primary m-1" htmlFor="option2">Radio</label>

              <input type="radio" className="btn-check" name="options" id="option3"
                disabled />
              <label className="btn btn-primary m-1" htmlFor="option3">Disabled</label>

              <input type="radio" className="btn-check" name="options" id="option4" />
              <label className="btn btn-primary m-1" htmlFor="option4">Radio</label>
            </Card.Body>
            <div className={`${isHidden[13] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <input type="radio" className="btn-check" name="options" id="option1"
        defaultChecked />
      <label className="btn btn-primary m-1" htmlFor="option1">Checked</label>

      <input type="radio" className="btn-check" name="options" id="option2" />
      <label className="btn btn-primary m-1" htmlFor="option2">Radio</label>

      <input type="radio" className="btn-check" name="options" id="option3"
        disabled />
      <label className="btn btn-primary m-1" htmlFor="option3">Disabled</label>

      <input type="radio" className="btn-check" name="options" id="option4" />
      <label className="btn btn-primary m-1" htmlFor="option4">Radio</label>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={6} lg={12} md={12} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Checkbox toggle buttons
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(14)}>Show Code<i className={`${isHidden[14] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[14] ? 'd-none' : ''}`}>
              <input type="checkbox" className="btn-check" id="btn-check" />
              <label className="btn btn-primary m-1" htmlFor="btn-check">Single toggle</label>
              <input type="checkbox" className="btn-check" id="btn-check-2" defaultChecked />
              <label className="btn btn-primary m-1" htmlFor="btn-check-2">Checked</label>
              <input type="checkbox" className="btn-check" id="btn-check-3"
                disabled />
              <label className="btn btn-primary m-1" htmlFor="btn-check-3">Disabled</label>
            </Card.Body>
            <div className={`${isHidden[14] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <input type="checkbox" className="btn-check" id="btn-check" />
              <label className="btn btn-primary m-1" htmlFor="btn-check">Single toggle</label>
              <input type="checkbox" className="btn-check" id="btn-check-2" defaultChecked />
              <label className="btn btn-primary m-1" htmlFor="btn-check-2">Checked</label>
              <input type="checkbox" className="btn-check" id="btn-check-3"
                disabled />
              <label className="btn btn-primary m-1" htmlFor="btn-check-3">Disabled</label>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="row-cols-12 row-sm">
        <div className="col">
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Colored Checkboxes
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(15)}>Show Code<i className={`${isHidden[15] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[15] ? 'd-none' : ''}`}>
              <div className="form-check mb-2">
                <input className="form-check-input" type="checkbox" value="" id="primaryChecked" defaultChecked />
                <label className="form-check-label" htmlFor="primaryChecked">
                  Primary
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-secondary" type="checkbox" value="" id="secondaryChecked" defaultChecked />
                <label className="form-check-label" htmlFor="secondaryChecked">
                  Secondary
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-warning" type="checkbox" value="" id="warningChecked" defaultChecked />
                <label className="form-check-label" htmlFor="warningChecked">
                  Warning
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-info" type="checkbox" value="" id="infoChecked" defaultChecked />
                <label className="form-check-label" htmlFor="infoChecked">
                  Info
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-success" type="checkbox" value="" id="successChecked" defaultChecked />
                <label className="form-check-label" htmlFor="successChecked">
                  Success
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-danger" type="checkbox" value="" id="dangerChecked" defaultChecked />
                <label className="form-check-label" htmlFor="dangerChecked">
                  Danger
                </label>
              </div>
              <div className="form-check mb-0">
                <input className="form-check-input form-checked-dark" type="checkbox" value="" id="darkChecked" defaultChecked />
                <label className="form-check-label" htmlFor="darkChecked">
                  Dark
                </label>
              </div>
            </Card.Body>
            <div className={`${isHidden[15] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="form-check mb-2">
                <input className="form-check-input" type="checkbox" value="" id="primaryChecked" defaultChecked />
                <label className="form-check-label" htmlFor="primaryChecked">
                  Primary
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-secondary" type="checkbox" value="" id="secondaryChecked" defaultChecked />
                <label className="form-check-label" htmlFor="secondaryChecked">
                  Secondary
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-warning" type="checkbox" value="" id="warningChecked" defaultChecked />
                <label className="form-check-label" htmlFor="warningChecked">
                  Warning
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-info" type="checkbox" value="" id="infoChecked" defaultChecked />
                <label className="form-check-label" htmlFor="infoChecked">
                  Info
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-success" type="checkbox" value="" id="successChecked" defaultChecked />
                <label className="form-check-label" htmlFor="successChecked">
                  Success
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-danger" type="checkbox" value="" id="dangerChecked" defaultChecked />
                <label className="form-check-label" htmlFor="dangerChecked">
                  Danger
                </label>
              </div>
              <div className="form-check mb-0">
                <input className="form-check-input form-checked-dark" type="checkbox" value="" id="darkChecked" defaultChecked />
                <label className="form-check-label" htmlFor="darkChecked">
                  Dark
                </label>
              </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </div>
        <div className="col">
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Outline Checkboxes
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(16)}>Show Code<i className={`${isHidden[16] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[16] ? 'd-none' : ''}`}>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-outline" type="checkbox" value="" id="primaryoutlineChecked" defaultChecked />
                <label className="form-check-label" htmlFor="primaryoutlineChecked">
                  Primary
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-outline form-checked-secondary" type="checkbox" value="" id="secondaryoutlineChecked" defaultChecked />
                <label className="form-check-label" htmlFor="secondaryoutlineChecked">
                  Secondary
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-outline form-checked-warning" type="checkbox" value="" id="warningoutlineChecked" defaultChecked />
                <label className="form-check-label" htmlFor="warningoutlineChecked">
                  Warning
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-outline form-checked-info" type="checkbox" value="" id="infooutlineChecked" defaultChecked />
                <label className="form-check-label" htmlFor="infooutlineChecked">
                  Info
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-outline form-checked-success" type="checkbox" value="" id="successoutlineChecked" defaultChecked />
                <label className="form-check-label" htmlFor="successoutlineChecked">
                  Success
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-outline form-checked-danger" type="checkbox" value="" id="dangeroutlineChecked" defaultChecked />
                <label className="form-check-label" htmlFor="dangeroutlineChecked">
                  Danger
                </label>
              </div>
              <div className="form-check mb-0">
                <input className="form-check-input form-checked-outline form-checked-dark" type="checkbox" value="" id="darkoutlineChecked" defaultChecked />
                <label className="form-check-label" htmlFor="darkoutlineChecked">
                  Dark
                </label>
              </div>
            </Card.Body>
            <div className={`${isHidden[16] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="form-check mb-2">
                <input className="form-check-input form-checked-outline" type="checkbox" value="" id="primaryoutlineChecked" defaultChecked />
                <label className="form-check-label" htmlFor="primaryoutlineChecked">
                  Primary
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-outline form-checked-secondary" type="checkbox" value="" id="secondaryoutlineChecked" defaultChecked />
                <label className="form-check-label" htmlFor="secondaryoutlineChecked">
                  Secondary
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-outline form-checked-warning" type="checkbox" value="" id="warningoutlineChecked" defaultChecked />
                <label className="form-check-label" htmlFor="warningoutlineChecked">
                  Warning
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-outline form-checked-info" type="checkbox" value="" id="infooutlineChecked" defaultChecked />
                <label className="form-check-label" htmlFor="infooutlineChecked">
                  Info
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-outline form-checked-success" type="checkbox" value="" id="successoutlineChecked" defaultChecked />
                <label className="form-check-label" htmlFor="successoutlineChecked">
                  Success
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-outline form-checked-danger" type="checkbox" value="" id="dangeroutlineChecked" defaultChecked />
                <label className="form-check-label" htmlFor="dangeroutlineChecked">
                  Danger
                </label>
              </div>
              <div className="form-check mb-0">
                <input className="form-check-input form-checked-outline form-checked-dark" type="checkbox" value="" id="darkoutlineChecked" defaultChecked />
                <label className="form-check-label" htmlFor="darkoutlineChecked">
                  Dark
                </label>
              </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </div>
        <div className="col">
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Colored Radios
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(17)}>Show Code<i className={`${isHidden[17] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[17] ? 'd-none' : ''}`}>
              <div className="form-check mb-2">
                <input className="form-check-input" type="radio" name="primaryRadio" id="primaryRadio" defaultChecked />
                <label className="form-check-label" htmlFor="primaryRadio">
                  Primary
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-secondary" type="radio" name="secondaryRadio" id="secondaryRadio" defaultChecked />
                <label className="form-check-label" htmlFor="secondaryRadio">
                  Secondary
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-warning" type="radio" name="warningRadio" id="warningRadio" defaultChecked />
                <label className="form-check-label" htmlFor="warningRadio">
                  Warning
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-info" type="radio" name="InfoRadio" id="InfoRadio" defaultChecked />
                <label className="form-check-label" htmlFor="InfoRadio">
                  Info
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-success" type="radio" name="successRadio" id="successRadio" defaultChecked />
                <label className="form-check-label" htmlFor="successRadio">
                  Success
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-danger" type="radio" name="dangerRadio" id="dangerRadio" defaultChecked />
                <label className="form-check-label" htmlFor="dangerRadio">
                  Danger
                </label>
              </div>
              <div className="form-check mb-0">
                <input className="form-check-input form-checked-dark" type="radio" name="darkRadio" id="darkRadio" defaultChecked />
                <label className="form-check-label" htmlFor="darkRadio">
                  Dark
                </label>
              </div>
            </Card.Body>
            <div className={`${isHidden[17] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="form-check mb-2">
                <input className="form-check-input" type="radio" name="primaryRadio" id="primaryRadio" defaultChecked />
                <label className="form-check-label" htmlFor="primaryRadio">
                  Primary
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-secondary" type="radio" name="secondaryRadio" id="secondaryRadio" defaultChecked />
                <label className="form-check-label" htmlFor="secondaryRadio">
                  Secondary
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-warning" type="radio" name="warningRadio" id="warningRadio" defaultChecked />
                <label className="form-check-label" htmlFor="warningRadio">
                  Warning
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-info" type="radio" name="InfoRadio" id="InfoRadio" defaultChecked />
                <label className="form-check-label" htmlFor="InfoRadio">
                  Info
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-success" type="radio" name="successRadio" id="successRadio" defaultChecked />
                <label className="form-check-label" htmlFor="successRadio">
                  Success
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-danger" type="radio" name="dangerRadio" id="dangerRadio" defaultChecked />
                <label className="form-check-label" htmlFor="dangerRadio">
                  Danger
                </label>
              </div>
              <div className="form-check mb-0">
                <input className="form-check-input form-checked-dark" type="radio" name="darkRadio" id="darkRadio" defaultChecked />
                <label className="form-check-label" htmlFor="darkRadio">
                  Dark
                </label>
              </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </div>
        <div className="col">
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Outline Radios
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(18)}>Show Code<i className={`${isHidden[18] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[18] ? 'd-none' : ''}`}>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-outline" type="radio" name="primaryoutlineRadio" id="primaryoutlineRadio" defaultChecked />
                <label className="form-check-label" htmlFor="primaryoutlineRadio">
                  Primary
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-outline form-checked-secondary" type="radio" name="secondaryoutlineRadio" id="secondaryoutlineRadio" defaultChecked />
                <label className="form-check-label" htmlFor="secondaryoutlineRadio">
                  Secondary
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-outline form-checked-warning" type="radio" name="warningoutlineRadio" id="warningoutlineRadio" defaultChecked />
                <label className="form-check-label" htmlFor="warningoutlineRadio">
                  Warning
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-outline form-checked-info" type="radio" name="InfooutlineRadio" id="InfooutlineRadio" defaultChecked />
                <label className="form-check-label" htmlFor="InfooutlineRadio">
                  Info
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-outline form-checked-success" type="radio" name="successoutlineRadio" id="successoutlineRadio" defaultChecked />
                <label className="form-check-label" htmlFor="successoutlineRadio">
                  Success
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input form-checked-outline form-checked-danger" type="radio" name="dangeroutlineRadio" id="dangeroutlineRadio" defaultChecked />
                <label className="form-check-label" htmlFor="dangeroutlineRadio">
                  Danger
                </label>
              </div>
              <div className="form-check mb-0">
                <input className="form-check-input form-checked-outline form-checked-dark" type="radio" name="darkoutlineRadio" id="darkoutlineRadio" defaultChecked />
                <label className="form-check-label" htmlFor="darkoutlineRadio">
                  Dark
                </label>
              </div>
            </Card.Body>
            <div className={`${isHidden[18] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="form-check mb-2">
        <input className="form-check-input form-checked-outline" type="radio" name="primaryoutlineRadio" id="primaryoutlineRadio" defaultChecked />
        <label className="form-check-label" htmlFor="primaryoutlineRadio">
          Primary
        </label>
      </div>
      <div className="form-check mb-2">
        <input className="form-check-input form-checked-outline form-checked-secondary" type="radio" name="secondaryoutlineRadio" id="secondaryoutlineRadio" defaultChecked />
        <label className="form-check-label" htmlFor="secondaryoutlineRadio">
          Secondary
        </label>
      </div>
      <div className="form-check mb-2">
        <input className="form-check-input form-checked-outline form-checked-warning" type="radio" name="warningoutlineRadio" id="warningoutlineRadio" defaultChecked />
        <label className="form-check-label" htmlFor="warningoutlineRadio">
          Warning
        </label>
      </div>
      <div className="form-check mb-2">
        <input className="form-check-input form-checked-outline form-checked-info" type="radio" name="InfooutlineRadio" id="InfooutlineRadio" defaultChecked />
        <label className="form-check-label" htmlFor="InfooutlineRadio">
          Info
        </label>
      </div>
      <div className="form-check mb-2">
        <input className="form-check-input form-checked-outline form-checked-success" type="radio" name="successoutlineRadio" id="successoutlineRadio" defaultChecked />
        <label className="form-check-label" htmlFor="successoutlineRadio">
          Success
        </label>
      </div>
      <div className="form-check mb-2">
        <input className="form-check-input form-checked-outline form-checked-danger" type="radio" name="dangeroutlineRadio" id="dangeroutlineRadio" defaultChecked />
        <label className="form-check-label" htmlFor="dangeroutlineRadio">
          Danger
        </label>
      </div>
      <div className="form-check mb-0">
        <input className="form-check-input form-checked-outline form-checked-dark" type="radio" name="darkoutlineRadio" id="darkoutlineRadio" defaultChecked />
        <label className="form-check-label" htmlFor="darkoutlineRadio">
          Dark
        </label>
      </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </div>
        <div className="col">
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Switches Colors
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(19)}>Show Code<i className={`${isHidden[19] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[19] ? 'd-none' : ''}`}>
              <div className="form-check form-switch mb-2">
                <input className="form-check-input" type="checkbox" role="switch"
                  id="switch-primary" defaultChecked />
                <label className="form-check-label" htmlFor="switch-primary">Primary</label>
              </div>
              <div className="form-check form-switch mb-2">
                <input className="form-check-input form-checked-secondary" type="checkbox" role="switch"
                  id="switch-secondary" defaultChecked />
                <label className="form-check-label" htmlFor="switch-secondary">Secondary</label>
              </div>
              <div className="form-check form-switch mb-2">
                <input className="form-check-input form-checked-warning" type="checkbox" role="switch"
                  id="switch-warning" defaultChecked />
                <label className="form-check-label" htmlFor="switch-warning">Warning</label>
              </div>
              <div className="form-check form-switch mb-2">
                <input className="form-check-input form-checked-info" type="checkbox" role="switch"
                  id="switch-info" defaultChecked />
                <label className="form-check-label" htmlFor="switch-info">Info</label>
              </div>
              <div className="form-check form-switch mb-2">
                <input className="form-check-input form-checked-success" type="checkbox" role="switch"
                  id="switch-success" defaultChecked />
                <label className="form-check-label" htmlFor="switch-success">Success</label>
              </div>
              <div className="form-check form-switch mb-2">
                <input className="form-check-input form-checked-danger" type="checkbox" role="switch"
                  id="switch-danger" defaultChecked />
                <label className="form-check-label" htmlFor="switch-danger">Danger</label>
              </div>
              <div className="form-check form-switch mb-0">
                <input className="form-check-input form-checked-dark" type="checkbox" role="switch"
                  id="switch-dark" defaultChecked />
                <label className="form-check-label" htmlFor="switch-dark">Dark</label>
              </div>
            </Card.Body>
            <div className={`${isHidden[19] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="form-check form-switch mb-2">
                <input className="form-check-input" type="checkbox" role="switch"
                  id="switch-primary" defaultChecked />
                <label className="form-check-label" htmlFor="switch-primary">Primary</label>
              </div>
              <div className="form-check form-switch mb-2">
                <input className="form-check-input form-checked-secondary" type="checkbox" role="switch"
                  id="switch-secondary" defaultChecked />
                <label className="form-check-label" htmlFor="switch-secondary">Secondary</label>
              </div>
              <div className="form-check form-switch mb-2">
                <input className="form-check-input form-checked-warning" type="checkbox" role="switch"
                  id="switch-warning" defaultChecked />
                <label className="form-check-label" htmlFor="switch-warning">Warning</label>
              </div>
              <div className="form-check form-switch mb-2">
                <input className="form-check-input form-checked-info" type="checkbox" role="switch"
                  id="switch-info" defaultChecked />
                <label className="form-check-label" htmlFor="switch-info">Info</label>
              </div>
              <div className="form-check form-switch mb-2">
                <input className="form-check-input form-checked-success" type="checkbox" role="switch"
                  id="switch-success" defaultChecked />
                <label className="form-check-label" htmlFor="switch-success">Success</label>
              </div>
              <div className="form-check form-switch mb-2">
                <input className="form-check-input form-checked-danger" type="checkbox" role="switch"
                  id="switch-danger" defaultChecked />
                <label className="form-check-label" htmlFor="switch-danger">Danger</label>
              </div>
              <div className="form-check form-switch mb-0">
                <input className="form-check-input form-checked-dark" type="checkbox" role="switch"
                  id="switch-dark" defaultChecked />
                <label className="form-check-label" htmlFor="switch-dark">Dark</label>
              </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </div>
      </Row>

      <Row className="row-sm">
        <Col xl={6} lg={6} md={6} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Toggle Switches Style-1
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(20)}>Show Code<i className={`${isHidden[20] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[20] ? 'd-none' : ''}`}>
              <Row className="gy-1">
                {toggleNames.map((toggleName, index) => (
                  <Col xl={4} key={index}>
                    <div
                      className={`toggle toggle-${toggleColors[index]} ${toggles[toggleName] ? 'on' : 'off'
                        } mb-3`}
                      onClick={() => handleToggleClick(toggleName)}
                    >
                      <span></span>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
            <div className={`${isHidden[20] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Row className="gy-1">
        {toggleNames.map((toggleName, index) => (
          <Col xl={4} key={index}>
            <div
              className={\`toggle toggle-\${toggleColors[index]} \${toggles[toggleName] ? 'on' : 'off'
                } mb-3\`}
              onClick={() => handleToggleClick(toggleName)}
            >
              <span></span>
            </div>
          </Col>
        ))}
      </Row>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={6} lg={6} md={6} sm={12} className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Toggle Switches Style-2
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(21)}>Show Code<i className={`${isHidden[21] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[21] ? 'd-none' : ''}`}>
              <Row className="gy-1">
                <Col xl={4}>
                  <div className="custom-toggle-switch d-flex align-items-center mb-4">
                    <input id="toggleswitchPrimary" name="toggleswitch001" type="checkbox" defaultChecked />
                    <label htmlFor="toggleswitchPrimary" className="label-primary"></label><span className="ms-3">Primary</span>
                  </div>
                </Col>
                <Col xl={4}>
                  <div className="custom-toggle-switch d-flex align-items-center mb-4">
                    <input id="toggleswitchSecondary" name="toggleswitch001" type="checkbox" defaultChecked />
                    <label htmlFor="toggleswitchSecondary" className="label-secondary"></label><span className="ms-3">Secondary</span>
                  </div>
                </Col>
                <Col xl={4}>
                  <div className="custom-toggle-switch d-flex align-items-center mb-4">
                    <input id="toggleswitchWarning" name="toggleswitch001" type="checkbox" defaultChecked />
                    <label htmlFor="toggleswitchWarning" className="label-warning"></label><span className="ms-3">Warning</span>
                  </div>
                </Col>
                <Col xl={4}>
                  <div className="custom-toggle-switch d-flex align-items-center mb-4">
                    <input id="toggleswitchInfo" name="toggleswitch001" type="checkbox" defaultChecked />
                    <label htmlFor="toggleswitchInfo" className="label-info"></label><span className="ms-3">Info</span>
                  </div>
                </Col>
                <Col xl={4}>
                  <div className="custom-toggle-switch d-flex align-items-center mb-4">
                    <input id="toggleswitchSuccess" name="toggleswitch001" type="checkbox" defaultChecked />
                    <label htmlFor="toggleswitchSuccess" className="label-success"></label><span className="ms-3">Success</span>
                  </div>
                </Col>
                <Col xl={4}>
                  <div className="custom-toggle-switch d-flex align-items-center mb-4">
                    <input id="toggleswitchDanger" name="toggleswitch001" type="checkbox" defaultChecked />
                    <label htmlFor="toggleswitchDanger" className="label-danger"></label><span className="ms-3">Danger</span>
                  </div>
                </Col>
                <Col xl={4}>
                  <div className="custom-toggle-switch d-flex align-items-center mb-4">
                    <input id="toggleswitchLight" name="toggleswitch001" type="checkbox" defaultChecked />
                    <label htmlFor="toggleswitchLight" className="label-light"></label><span className="ms-3">Light</span>
                  </div>
                </Col>
                <Col xl={4}>
                  <div className="custom-toggle-switch d-flex align-items-center mb-4">
                    <input id="toggleswitchDark" name="toggleswitch001" type="checkbox" defaultChecked />
                    <label htmlFor="toggleswitchDark" className="label-dark"></label><span className="ms-3">Dark</span>
                  </div>
                </Col>
              </Row>
            </Card.Body>
            <div className={`${isHidden[21] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Row className="gy-1">
                <Col xl={4}>
                  <div className="custom-toggle-switch d-flex align-items-center mb-4">
                    <input id="toggleswitchPrimary" name="toggleswitch001" type="checkbox" defaultChecked />
                    <label htmlFor="toggleswitchPrimary" className="label-primary"></label><span className="ms-3">Primary</span>
                  </div>
                </Col>
                <Col xl={4}>
                  <div className="custom-toggle-switch d-flex align-items-center mb-4">
                    <input id="toggleswitchSecondary" name="toggleswitch001" type="checkbox" defaultChecked />
                    <label htmlFor="toggleswitchSecondary" className="label-secondary"></label><span className="ms-3">Secondary</span>
                  </div>
                </Col>
                <Col xl={4}>
                  <div className="custom-toggle-switch d-flex align-items-center mb-4">
                    <input id="toggleswitchWarning" name="toggleswitch001" type="checkbox" defaultChecked />
                    <label htmlFor="toggleswitchWarning" className="label-warning"></label><span className="ms-3">Warning</span>
                  </div>
                </Col>
                <Col xl={4}>
                  <div className="custom-toggle-switch d-flex align-items-center mb-4">
                    <input id="toggleswitchInfo" name="toggleswitch001" type="checkbox" defaultChecked />
                    <label htmlFor="toggleswitchInfo" className="label-info"></label><span className="ms-3">Info</span>
                  </div>
                </Col>
                <Col xl={4}>
                  <div className="custom-toggle-switch d-flex align-items-center mb-4">
                    <input id="toggleswitchSuccess" name="toggleswitch001" type="checkbox" defaultChecked />
                    <label htmlFor="toggleswitchSuccess" className="label-success"></label><span className="ms-3">Success</span>
                  </div>
                </Col>
                <Col xl={4}>
                  <div className="custom-toggle-switch d-flex align-items-center mb-4">
                    <input id="toggleswitchDanger" name="toggleswitch001" type="checkbox" defaultChecked />
                    <label htmlFor="toggleswitchDanger" className="label-danger"></label><span className="ms-3">Danger</span>
                  </div>
                </Col>
                <Col xl={4}>
                  <div className="custom-toggle-switch d-flex align-items-center mb-4">
                    <input id="toggleswitchLight" name="toggleswitch001" type="checkbox" defaultChecked />
                    <label htmlFor="toggleswitchLight" className="label-light"></label><span className="ms-3">Light</span>
                  </div>
                </Col>
                <Col xl={4}>
                  <div className="custom-toggle-switch d-flex align-items-center mb-4">
                    <input id="toggleswitchDark" name="toggleswitch001" type="checkbox" defaultChecked />
                    <label htmlFor="toggleswitchDark" className="label-dark"></label><span className="ms-3">Dark</span>
                  </div>
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
        <Col xl={6} lg={12} md={12} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Toggle Switch-1 Sizes
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(22)}>Show Code<i className={`${isHidden[22] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[22] ? 'd-none' : ''}`}>
              {Object.entries(toggleStates).map(([toggleName, toggleState]) => (
                <div className="d-flex align-items-center flex-wrap mb-3" key={toggleName}>
                  <div className="">
                    <p className="text-muted m-0">
                      {toggleName === 'toggleSm' ? 'Small size' : (toggleName === 'toggleLg' ? 'Large size' : 'Default')} toggle switch <code>{toggleName === 'toggleSm' ? 'toggle-sm' : (toggleName === 'toggleLg' ? 'toggle-lg' : '')}</code>
                    </p>
                  </div>
                  <div
                    className={`toggle toggle-${toggleName === 'toggleSm' ? 'sm' : (toggleName === 'toggleLg' ? 'lg' : 'secondary')} ${toggleName === 'toggleLg' ? 'toggle-success' : ''} ${toggleState ? 'on' : ''} mb-0`}
                    onClick={() => handleToggleChange(toggleName)}
                  >
                    <span></span>
                  </div>
                </div>
              ))}
            </Card.Body>
            <div className={`${isHidden[22] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        {Object.entries(toggleStates).map(([toggleName, toggleState]) => (
          <div className="d-flex align-items-center flex-wrap mb-3" key={toggleName}>
            <div className="">
              <p className="text-muted m-0">
                {toggleName === 'toggleSm' ? 'Small size' : (toggleName === 'toggleLg' ? 'Large size' : 'Default')} toggle switch <code>{toggleName === 'toggleSm' ? 'toggle-sm' : (toggleName === 'toggleLg' ? 'toggle-lg' : '')}</code>
              </p>
            </div>
            <div
              className={\`toggle toggle-\${toggleName === 'toggleSm' ? 'sm' : (toggleName === 'toggleLg' ? 'lg' : 'secondary')} \${toggleName === 'toggleLg' ? 'toggle-success' : ''} \${toggleState ? 'on' : ''} mb-0\`}
              onClick={() => handleToggleChange(toggleName)}
            >
              <span></span>
            </div>
          </div>
        ))}
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={6} lg={12} md={12} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Toggle Switch-2 Sizes
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(23)}>Show Code<i className={`${isHidden[23] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[23] ? 'd-none' : ''}`}>
              <div className="d-flex align-items-center flex-wrap mb-4">
                <div className=""><p className="text-muted m-0">Small size toggle switch <code>toggle-sm</code></p></div>
                <div className="custom-toggle-switch toggle-sm ms-2">
                  <input id="size-sm" name="toggleswitchsize" type="checkbox" defaultChecked />
                  <label htmlFor="size-sm" className="label-primary"></label>
                </div>
              </div>
              <div className="d-flex align-items-center flex-wrap mb-4">
                <div className=""><p className="text-muted m-0">Default toggle switch</p></div>
                <div className="custom-toggle-switch ms-2">
                  <input id="size-default" name="toggleswitchsize" type="checkbox" defaultChecked />
                  <label htmlFor="size-default" className="label-secondary mb-1"></label>
                </div>
              </div>
              <div className="d-sm-flex d-block align-items-center flex-wrap">
                <div className="mb-sm-0 mb-2"><p className="text-muted m-0">Large size toggle switch <code>toggle-lg</code></p></div>
                <div className="custom-toggle-switch toggle-lg ms-sm-2 ms-0">
                  <input id="size-lg" name="toggleswitchsize" type="checkbox" defaultChecked />
                  <label htmlFor="size-lg" className="label-success mb-2"></label>
                </div>
              </div>
            </Card.Body>
            <div className={`${isHidden[23] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="d-flex align-items-center flex-wrap mb-4">
                <div className=""><p className="text-muted m-0">Small size toggle switch <code>toggle-sm</code></p></div>
                <div className="custom-toggle-switch toggle-sm ms-2">
                  <input id="size-sm" name="toggleswitchsize" type="checkbox" defaultChecked />
                  <label htmlFor="size-sm" className="label-primary"></label>
                </div>
              </div>
              <div className="d-flex align-items-center flex-wrap mb-4">
                <div className=""><p className="text-muted m-0">Default toggle switch</p></div>
                <div className="custom-toggle-switch ms-2">
                  <input id="size-default" name="toggleswitchsize" type="checkbox" defaultChecked />
                  <label htmlFor="size-default" className="label-secondary mb-1"></label>
                </div>
              </div>
              <div className="d-sm-flex d-block align-items-center flex-wrap">
                <div className="mb-sm-0 mb-2"><p className="text-muted m-0">Large size toggle switch <code>toggle-lg</code></p></div>
                <div className="custom-toggle-switch toggle-lg ms-sm-2 ms-0">
                  <input id="size-lg" name="toggleswitchsize" type="checkbox" defaultChecked />
                  <label htmlFor="size-lg" className="label-success mb-2"></label>
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

export default ChecksRadios;
