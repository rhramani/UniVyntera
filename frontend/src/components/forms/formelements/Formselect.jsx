import { Fragment } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { DefaultData, GroupData, OptionData, Preference } from '../../../common/Select2data'
import Select from 'react-select';
import Dropdown from "react-dropdown-select";
import { connect } from 'react-redux';
import Pageheader from '../../../layouts/Pageheader';

const FormSelect = () => {

  return (
    <Fragment>
      <Pageheader mainheading='Form Select' parentfolder='Form Elements' activepage='Form Select' />

      {/* <!-- Start:: row-4 --> */}
      <h6 className="fw-semibold mb-2">Choices:</h6>
      <Row className="row-sm">
        <Col xl={6}>
          <Row>
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header className="d-flex align-items-center justify-content-between">
                  <div className='card-title'>Multiple Select</div>
                </Card.Header>
                <Card.Body>
                  <p className="fw-semibold my-2">Default</p>
                  <Dropdown options={DefaultData} values={[]} placeholder="Choice 1" keepSelectedInList={false} searchable={false} dropdownHandle={false} multi={true} onChange={(values) => { console.log('Selected values:', values); }} />

                  <p className="fw-semibold my-2">With a dropdown handle</p>
                  <Dropdown options={DefaultData} values={[]} placeholder="Choice 1" searchable={false} multi={true} dropdownHandle={true} onChange={(values) => { console.log('Selected values:', values); }} />

                  <p className="fw-semibold my-2">Multiple Group with Search option</p>
                  <Dropdown options={GroupData.flatMap((group) => (group.disabled ? [] : group.options))} keepSelectedInList={false} multi={true} values={[]} placeholder="Chooes the City" onChange={(values) => { console.log('Selected values:', values); }} />

                </Card.Body>
              </Card>
            </Col>
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header>
                  <div className='card-title'> Passing Through Options </div>
                </Card.Header>
                <Card.Body>
                  <Dropdown options={[]} values={[]} create={true} placeholder="Choice 1" searchable={true} dropdownHandle={false} multi={true} onChange={(values) => { console.log('Selected values:', values); }} />
                </Card.Body>
              </Card>
            </Col>
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header>
                  <div className='card-title'> Options added via config with search and Cleared option</div>
                </Card.Header>
                <Card.Body>
                  <Dropdown options={DefaultData} values={[]} create={true} keepSelectedInList={true} placeholder="Choice 1" clearable={true} searchable={true} dropdownHandle={true} multi={true} onChange={(values) => { console.log('Selected values:', values); }} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xl={6}>
          <Row>
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header className="d-flex align-items-center justify-content-between">
                  <div className='card-title'>Single Select</div>
                </Card.Header>
                <Card.Body>
                  <p className="fw-semibold my-2">Default</p>
                  <Dropdown options={DefaultData} values={[]} placeholder="Choice 1" searchable={false} dropdownHandle={false} multi={false} onChange={(values) => { console.log('Selected values:', values); }} />

                  <p className="fw-semibold my-2">Multiple group option with single Select and Search option</p>
                  <Dropdown options={GroupData.flatMap((group) => (group.disabled ? [] : group.options))} multi={false} values={[]} placeholder="Chooes the City" onChange={(values) => { console.log('Selected values:', values); }} />
                </Card.Body>
              </Card>
            </Col>
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header>
                  <div className='card-title'> Disabled Select </div>
                </Card.Header>
                <Card.Body>
                <Dropdown options={DefaultData} disabled values={[]} keepSelectedInList={false} placeholder="Disabled Select" searchable={false} dropdownHandle={false} multi={true} onChange={(values) => { console.log('Selected values:', values); }} />
                </Card.Body>
              </Card>
            </Col>
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header>
                  <div className='card-title'> Passing Unique Values </div>
                </Card.Header>
                <Card.Body>
                <Dropdown create={true} options={OptionData} placeholder="Choice 1" clearable={true} searchable={true} dropdownHandle={true} multi={true} onChange={(values) => { console.log('Selected values:', values); }} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      {/* <!-- End:: row-4 --> */}

      {/* <!-- Start::row-1 --> */}
      <Row className="row-sm">
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'> Default Select </div>
            </Card.Header>
            <Card.Body>
              <Select options={Preference} placeholder="Open this select menu" aria-label="Default select example" classNamePrefix="Select2" className='search-panel' />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Disabled Select
              </div>

            </Card.Header>
            <Card.Body>
              <Select options={Preference} placeholder="Open this select menu" aria-label="Disabled select example" classNamePrefix="Select2" className='search-panel' isDisabled={true}/>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Rounded Select
              </div>

            </Card.Header>
            <Card.Body>
              <Select options={Preference} placeholder="Open this select menu" aria-label="Default select example" classNamePrefix="Select2" className='rounded-pill search-panel' />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <!--End::row-1 --> */}

      {/* <!-- Start:: row-2 --> */}
      <Row className="row-sm">
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Multiple Attribute Select
              </div>

            </Card.Header>
            <Card.Body>
              <select className="form-select" size={4} aria-label="size 3 select example" multiple>
                <option >Open this select menu</option>
                <option>One</option>
                <option>Two</option>
                <option>Three</option>
                <option>Four</option>
                <option>Five</option>
              </select>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Using Size Attribute
              </div>

            </Card.Header>
            <Card.Body>
              <select className="form-select" size={4} aria-label="size 3 select example">
                <option>Open this select menu</option>
                <option>One</option>
                <option>Two</option>
                <option>Three</option>
                <option>Four</option>
                <option>Five</option>
              </select>

            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <!-- End:: row-2 --> */}

      {/* <!-- Start:: row-3 --> */}
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>
                Select Sizes
              </div>
            </Card.Header>
            <Card.Body>
              <select className="form-select form-select-sm mb-3" aria-label=".form-select-sm example">
                <option >Open this select menu</option>
                <option>One</option>
                <option>Two</option>
                <option>Three</option>
              </select>
              <select className="form-select mb-3" aria-label="Default select">
                <option>Open this select menu
                </option>
                <option>One</option>
                <option>Two</option>
                <option>Three</option>
              </select>
              <select className="form-select form-select-lg" aria-label=".form-select-lg example">
                <option >Open this select menu</option>
                <option>One</option>
                <option>Two</option>
                <option>Three</option>
              </select>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <!-- End:: row-3 --> */}
    </Fragment>
  )
}

const mapStateToProps = (state) => ({
	local_varaiable: state
  })

export default connect(mapStateToProps,{})(FormSelect);
