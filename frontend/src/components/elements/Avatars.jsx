import { Fragment, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Pageheader from '../../layouts/Pageheader'
import ALLImages from '../../common/Imagedata'

const Avatars = () => {

  //showcode

  const [isHidden, setIsHidden] = useState([false]);
  const toggleHidden = (index) => {
    const updatedHidden = [...isHidden];
    updatedHidden[index] = !updatedHidden[index];
    setIsHidden(updatedHidden);
  };
  return (
    <Fragment>
      <Pageheader mainheading='Avatars' parentfolder='Elements' activepage='Avatars' />

      <Row className="row-sm">
        <Col xl={4} lg={12} md={12} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Stacked Avatars
                <p className="subtitle text-muted fs-12 fw-normal">
                  Group of avatars stacked together.
                </p>
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(0)}>Show Code<i className={`${isHidden[0] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>
              <div className="avatar-list-stacked">
                <span className="avatar">
                  <img src={ALLImages("face2")} alt="img" />
                </span>
                <span className="avatar">
                  <img src={ALLImages("face8")} alt="img" />
                </span>
                <span className="avatar">
                  <img src={ALLImages("face2")} alt="img" />
                </span>
                <span className="avatar">
                  <img src={ALLImages("face10")} alt="img" />
                </span>
                <span className="avatar">
                  <img src={ALLImages("face4")} alt="img" />
                </span>
                <span className="avatar">
                  <img src={ALLImages("face13")} alt="img" />
                </span>
                <Link className="avatar bg-primary text-fixed-white" to="#">
                  +8
                </Link>
              </div>
            </Card.Body>
            <div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="avatar-list-stacked">
                <span className="avatar">
                  <img src={ALLImages("face2")} alt="img" />
                </span>
                <span className="avatar">
                  <img src={ALLImages("face8")} alt="img" />
                </span>
                <span className="avatar">
                  <img src={ALLImages("face2")} alt="img" />
                </span>
                <span className="avatar">
                  <img src={ALLImages("face10")} alt="img" />
                </span>
                <span className="avatar">
                  <img src={ALLImages("face4")} alt="img" />
                </span>
                <span className="avatar">
                  <img src={ALLImages("face13")} alt="img" />
                </span>
                <Link className="avatar bg-primary text-fixed-white" to="#">
                  +8
                </Link>
              </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={4} lg={12} md={12} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Rounded Stacked Avatars
                <p className="subtitle text-muted fs-12 fw-normal">
                  Group of avatars stacked together.
                </p>
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(1)}>Show Code<i className={`${isHidden[1] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[1] ? 'd-none' : ''}`}>
              <div className="avatar-list-stacked">
                <span className="avatar avatar-rounded">
                  <img src={ALLImages("face2")} alt="img" />
                </span>
                <span className="avatar avatar-rounded">
                  <img src={ALLImages("face8")} alt="img" />
                </span>
                <span className="avatar avatar-rounded">
                  <img src={ALLImages("face2")} alt="img" />
                </span>
                <span className="avatar avatar-rounded">
                  <img src={ALLImages("face10")} alt="img" />
                </span>
                <span className="avatar avatar-rounded">
                  <img src={ALLImages("face4")} alt="img" />
                </span>
                <span className="avatar avatar-rounded">
                  <img src={ALLImages("face13")} alt="img" />
                </span>
                <Link className="avatar bg-primary avatar-rounded text-fixed-white" to="#">
                  +8
                </Link>
              </div>
            </Card.Body>
            <div className={`${isHidden[1] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="avatar-list-stacked">
                <span className="avatar avatar-rounded">
                  <img src={ALLImages("face2")} alt="img" />
                </span>
                <span className="avatar avatar-rounded">
                  <img src={ALLImages("face8")} alt="img" />
                </span>
                <span className="avatar avatar-rounded">
                  <img src={ALLImages("face2")} alt="img" />
                </span>
                <span className="avatar avatar-rounded">
                  <img src={ALLImages("face10")} alt="img" />
                </span>
                <span className="avatar avatar-rounded">
                  <img src={ALLImages("face4")} alt="img" />
                </span>
                <span className="avatar avatar-rounded">
                  <img src={ALLImages("face13")} alt="img" />
                </span>
                <Link className="avatar bg-primary avatar-rounded text-fixed-white" to="#">
                  +8
                </Link>
              </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={4} lg={12} md={12} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Avatars
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(2)}>Show Code<i className={`${isHidden[2] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[2] ? 'd-none' : ''} py-4`}>
              <span className="avatar me-2 avatar-radius-0">
                <img src={ALLImages("face1")} alt="img" />
              </span>
              <span className="avatar me-2">
                <img src={ALLImages("face2")} alt="img" />
              </span>
              <span className="avatar me-2 avatar-rounded">
                <img src={ALLImages("face3")} alt="img" />
              </span>
            </Card.Body>
            <div className={`${isHidden[2] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <span className="avatar me-2 avatar-radius-0">
        <img src={ALLImages("face1")} alt="img" />
      </span>
      <span className="avatar me-2">
        <img src={ALLImages("face2")} alt="img" />
      </span>
      <span className="avatar me-2 avatar-rounded">
        <img src={ALLImages("face3")} alt="img" />
      </span>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <Col xl={4} lg={6} md={12} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Avatar Sizes
                <p className="subtitle text-muted fs-12 fw-normal">
                  Avatars of different sizes
                </p>
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(3)}>Show Code<i className={`${isHidden[3] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[3] ? 'd-none' : ''}`}>
              <span className="avatar avatar-xs me-2">
                <img src={ALLImages("face4")} alt="img" />
              </span>
              <span className="avatar avatar-sm me-2">
                <img src={ALLImages("face5")} alt="img" />
              </span>
              <span className="avatar avatar-md me-2">
                <img src={ALLImages("face6")} alt="img" />
              </span>
              <span className="avatar avatar-lg me-2">
                <img src={ALLImages("face7")} alt="img" />
              </span>
              <span className="avatar avatar-xl me-2">
                <img src={ALLImages("face8")} alt="img" />
              </span>
              <span className="avatar avatar-xxl me-2">
                <img src={ALLImages("face9")} alt="img" />
              </span>
            </Card.Body>
            <div className={`${isHidden[3] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <span className="avatar avatar-xs me-2">
                <img src={ALLImages("face4")} alt="img" />
              </span>
              <span className="avatar avatar-sm me-2">
                <img src={ALLImages("face5")} alt="img" />
              </span>
              <span className="avatar avatar-md me-2">
                <img src={ALLImages("face6")} alt="img" />
              </span>
              <span className="avatar avatar-lg me-2">
                <img src={ALLImages("face7")} alt="img" />
              </span>
              <span className="avatar avatar-xl me-2">
                <img src={ALLImages("face8")} alt="img" />
              </span>
              <span className="avatar avatar-xxl me-2">
                <img src={ALLImages("face9")} alt="img" />
              </span>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={4} lg={6} md={12} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Avatar With Icons
                <p className="subtitle text-muted fs-12 fw-normal">
                  Avatar contains icons to perform respective action.
                </p>
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(4)}>Show Code<i className={`${isHidden[4] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[4] ? 'd-none' : ''}`}>
              <span className="avatar avatar-xs me-2 avatar-rounded">
                <img src={ALLImages("face2")} alt="img" />
                <Link to="#" className="badge bg-success rounded-pill avatar-badge"><i className="fs-10 fe fe-camera"></i></Link>
              </span>
              <span className="avatar avatar-sm me-2 avatar-rounded">
                <img src={ALLImages("face3")} alt="img" />
                <Link to="#" className="badge rounded-pill bg-secondary avatar-badge"><i className="fs-10 fe fe-edit"></i></Link>
              </span>
              <span className="avatar avatar-md me-2 avatar-rounded">
                <img src={ALLImages("face14")} alt="img" />
                <Link to="#" className="badge rounded-pill bg-warning avatar-badge"><i className="fs-10 fe fe-plus"></i></Link>
              </span>
              <span className="avatar avatar-lg me-2 avatar-rounded">
                <img src={ALLImages("face13")} alt="img" />
                <Link to="#" className="badge rounded-pill bg-info avatar-badge"><i className="fs-10 fe fe-edit"></i></Link>
              </span>
              <span className="avatar avatar-xl me-2 avatar-rounded">
                <img src={ALLImages("face15")} alt="img" />
                <Link to="#" className="badge rounded-pill bg-success avatar-badge"><i className="fs-10 fe fe-camera"></i></Link>
              </span>
              <span className="avatar avatar-xxl me-2 avatar-rounded">
                <img src={ALLImages("face9")} alt="img" />
                <Link to="#" className="badge rounded-pill bg-danger avatar-badge"><i className="fs-10 fe fe-plus"></i></Link>
              </span>
            </Card.Body>
            <div className={`${isHidden[4] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <span className="avatar avatar-xs me-2 avatar-rounded">
                <img src={ALLImages("face2")} alt="img" />
                <Link to="#" className="badge bg-success rounded-pill avatar-badge"><i className="fs-10 fe fe-camera"></i></Link>
              </span>
              <span className="avatar avatar-sm me-2 avatar-rounded">
                <img src={ALLImages("face3")} alt="img" />
                <Link to="#" className="badge rounded-pill bg-secondary avatar-badge"><i className="fs-10 fe fe-edit"></i></Link>
              </span>
              <span className="avatar avatar-md me-2 avatar-rounded">
                <img src={ALLImages("face14")} alt="img" />
                <Link to="#" className="badge rounded-pill bg-warning avatar-badge"><i className="fs-10 fe fe-plus"></i></Link>
              </span>
              <span className="avatar avatar-lg me-2 avatar-rounded">
                <img src={ALLImages("face13")} alt="img" />
                <Link to="#" className="badge rounded-pill bg-info avatar-badge"><i className="fs-10 fe fe-edit"></i></Link>
              </span>
              <span className="avatar avatar-xl me-2 avatar-rounded">
                <img src={ALLImages("face15")} alt="img" />
                <Link to="#" className="badge rounded-pill bg-success avatar-badge"><i className="fs-10 fe fe-camera"></i></Link>
              </span>
              <span className="avatar avatar-xxl me-2 avatar-rounded">
                <img src={ALLImages("face9")} alt="img" />
                <Link to="#" className="badge rounded-pill bg-danger avatar-badge"><i className="fs-10 fe fe-plus"></i></Link>
              </span>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={4} lg={6} md={12} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Avatar With Online Status Indicators
                <p className="subtitle text-muted fs-12 fw-normal">
                  avatars having online status indicator.
                </p>
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(5)}>Show Code<i className={`${isHidden[5] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[5] ? 'd-none' : ''}`}>
              <span className="avatar avatar-xs me-2 online avatar-rounded">
                <img src={ALLImages("face8")} alt="img" />
              </span>
              <span className="avatar avatar-sm online me-2 avatar-rounded">
                <img src={ALLImages("face10")} alt="img" />
              </span>
              <span className="avatar avatar-md me-2 online avatar-rounded">
                <img src={ALLImages("face12")} alt="img" />
              </span>
              <span className="avatar avatar-lg me-2 online avatar-rounded">
                <img src={ALLImages("face13")} alt="img" />
              </span>
              <span className="avatar avatar-xl me-2 online avatar-rounded">
                <img src={ALLImages("face14")} alt="img" />
              </span>
              <span className="avatar avatar-xxl me-2 online avatar-rounded">
                <img src={ALLImages("face15")} alt="img" />
              </span>
            </Card.Body>
            <div className={`${isHidden[5] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <span className="avatar avatar-xs me-2 online avatar-rounded">
        <img src={ALLImages("face8")} alt="img" />
      </span>
      <span className="avatar avatar-sm online me-2 avatar-rounded">
        <img src={ALLImages("face10")} alt="img" />
      </span>
      <span className="avatar avatar-md me-2 online avatar-rounded">
        <img src={ALLImages("face12")} alt="img" />
      </span>
      <span className="avatar avatar-lg me-2 online avatar-rounded">
        <img src={ALLImages("face13")} alt="img" />
      </span>
      <span className="avatar avatar-xl me-2 online avatar-rounded">
        <img src={ALLImages("face14")} alt="img" />
      </span>
      <span className="avatar avatar-xxl me-2 online avatar-rounded">
        <img src={ALLImages("face15")} alt="img" />
      </span>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={4} lg={6} md={12} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Avatar With Ofline Status Indicators
                <p className="subtitle text-muted fs-12 fw-normal">
                  avatars having a offline status indicator.
                </p>
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(6)}>Show Code<i className={`${isHidden[6] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[6] ? 'd-none' : ''}`}>
              <span className="avatar avatar-xs me-2 offline avatar-rounded">
                <img src={ALLImages("face2")} alt="img" />
              </span>
              <span className="avatar avatar-sm offline me-2 avatar-rounded">
                <img src={ALLImages("face3")} alt="img" />
              </span>
              <span className="avatar avatar-md me-2 offline avatar-rounded">
                <img src={ALLImages("face4")} alt="img" />
              </span>
              <span className="avatar avatar-lg me-2 offline avatar-rounded">
                <img src={ALLImages("face5")} alt="img" />
              </span>
              <span className="avatar avatar-xl me-2 offline avatar-rounded">
                <img src={ALLImages("face6")} alt="img" />
              </span>
              <span className="avatar avatar-xxl me-2 offline avatar-rounded">
                <img src={ALLImages("face7")} alt="img" />
              </span>
            </Card.Body>
            <div className={`${isHidden[6] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <span className="avatar avatar-xs me-2 offline avatar-rounded">
        <img src={ALLImages("face2")} alt="img" />
      </span>
      <span className="avatar avatar-sm offline me-2 avatar-rounded">
        <img src={ALLImages("face3")} alt="img" />
      </span>
      <span className="avatar avatar-md me-2 offline avatar-rounded">
        <img src={ALLImages("face4")} alt="img" />
      </span>
      <span className="avatar avatar-lg me-2 offline avatar-rounded">
        <img src={ALLImages("face5")} alt="img" />
      </span>
      <span className="avatar avatar-xl me-2 offline avatar-rounded">
        <img src={ALLImages("face6")} alt="img" />
      </span>
      <span className="avatar avatar-xxl me-2 offline avatar-rounded">
        <img src={ALLImages("face7")} alt="img" />
      </span>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={4} lg={6} md={12} sm={12} >
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Avatars With Number Badges
                <p className="subtitle text-muted fs-12 fw-normal">
                  Avatar numbers indicates the no. of unread notififactions/messages.
                </p>
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(7)}>Show Code<i className={`${isHidden[7] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[7] ? 'd-none' : ''}`}>
              <span className="avatar avatar-xs me-2 avatar-rounded">
                <img src={ALLImages("face2")} alt="img" />
                <span className="badge rounded-pill bg-primary avatar-badge">2</span>
              </span>
              <span className="avatar avatar-sm me-2 avatar-rounded">
                <img src={ALLImages("face3")} alt="img" />
                <span className="badge rounded-pill bg-secondary avatar-badge">5</span>
              </span>
              <span className="avatar avatar-md me-2 avatar-rounded">
                <img src={ALLImages("face14")} alt="img" />
                <span className="badge rounded-pill bg-warning avatar-badge">1</span>
              </span>
              <span className="avatar avatar-lg me-2 avatar-rounded">
                <img src={ALLImages("face13")} alt="img" />
                <span className="badge rounded-pill bg-info avatar-badge">7</span>
              </span>
              <span className="avatar avatar-xl me-2 avatar-rounded">
                <img src={ALLImages("face15")} alt="img" />
                <span className="badge rounded-pill bg-success avatar-badge">3</span>
              </span>
              <span className="avatar avatar-xxl me-2 avatar-rounded">
                <img src={ALLImages("face9")} alt="img" />
                <span className="badge rounded-pill bg-danger avatar-badge">9</span>
              </span>
            </Card.Body>
            <div className={`${isHidden[7] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <span className="avatar avatar-xs me-2 avatar-rounded">
        <img src={ALLImages("face2")} alt="img" />
        <span className="badge rounded-pill bg-primary avatar-badge">2</span>
      </span>
      <span className="avatar avatar-sm me-2 avatar-rounded">
        <img src={ALLImages("face3")} alt="img" />
        <span className="badge rounded-pill bg-secondary avatar-badge">5</span>
      </span>
      <span className="avatar avatar-md me-2 avatar-rounded">
        <img src={ALLImages("face14")} alt="img" />
        <span className="badge rounded-pill bg-warning avatar-badge">1</span>
      </span>
      <span className="avatar avatar-lg me-2 avatar-rounded">
        <img src={ALLImages("face13")} alt="img" />
        <span className="badge rounded-pill bg-info avatar-badge">7</span>
      </span>
      <span className="avatar avatar-xl me-2 avatar-rounded">
        <img src={ALLImages("face15")} alt="img" />
        <span className="badge rounded-pill bg-success avatar-badge">3</span>
      </span>
      <span className="avatar avatar-xxl me-2 avatar-rounded">
        <img src={ALLImages("face9")} alt="img" />
        <span className="badge rounded-pill bg-danger avatar-badge">9</span>
      </span>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={4} lg={6} md={12} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Avatar With Initials
                <p className="subtitle text-muted fs-12 fw-normal">
                  Avatar contains intials when user profile doesn't exist.
                </p>
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(8)}>Show Code<i className={`${isHidden[8] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[8] ? 'd-none' : ''}`}>
              <span className="avatar avatar-xs m-2 bg-primary">
                xs
              </span>
              <span className="avatar avatar-sm m-2 bg-secondary">
                SM
              </span>
              <span className="avatar avatar-md m-2 bg-warning">
                MD
              </span>
              <span className="avatar avatar-lg m-2 bg-danger">
                LG
              </span>
              <span className="avatar avatar-xl m-2 bg-success">
                XL
              </span>
              <span className="avatar avatar-xxl m-2 bg-info">
                XXL
              </span>
            </Card.Body>
            <div className={`${isHidden[8] ? '' : 'd-none'} card-footer border-top-0 showcode_over`}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <span className="avatar avatar-xs m-2 bg-primary">
        xs
      </span>
      <span className="avatar avatar-sm m-2 bg-secondary">
        SM
      </span>
      <span className="avatar avatar-md m-2 bg-warning">
        MD
      </span>
      <span className="avatar avatar-lg m-2 bg-danger">
        LG
      </span>
      <span className="avatar avatar-xl m-2 bg-success">
        XL
      </span>
      <span className="avatar avatar-xxl m-2 bg-info">
        XXL
      </span>
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

export default Avatars
