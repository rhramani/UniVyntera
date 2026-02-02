import { Fragment, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Pageheader from '../../layouts/Pageheader'

const Tags = () => {

    //showcode

    const [isHidden, setIsHidden] = useState([false]);
    const toggleHidden = (index) => {
      const updatedHidden = [...isHidden];
      updatedHidden[index] = !updatedHidden[index];
      setIsHidden(updatedHidden);
    };

  return (
    <Fragment>
      <Pageheader mainheading='Tags' parentfolder='Elements' activepage='Tags' />

      <Row className="row-sm">
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div>
                <div className="card-title">
                  Default Tags
                </div>
                <p className="text-muted mb-0 card-sub-title">Below is the pill tags example</p>
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(0)}>Show Code<i className={`${isHidden[0] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>
              <span className="tag tag-default mt-1 mb-1 me-1">Default</span>
              <span className="tag tag-dark mt-1 mb-1 me-1">Dark</span>
              <span className="tag tag-primary mt-1 mb-1 me-1">Primary</span>
              <span className="tag tag-success mt-1 mb-1 me-1">Success</span>
              <span className="tag tag-info mt-1 mb-1 me-1">Info</span>
              <span className="tag tag-warning mt-1 mb-1 me-1">Warning</span>
              <span className="tag tag-danger mt-1 mb-1 me-1">Danger</span>
            </Card.Body>
            <div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <span className="tag tag-default mt-1 mb-1 me-1">Default</span>
        <span className="tag tag-dark mt-1 mb-1 me-1">Dark</span>
        <span className="tag tag-primary mt-1 mb-1 me-1">Primary</span>
        <span className="tag tag-success mt-1 mb-1 me-1">Success</span>
        <span className="tag tag-info mt-1 mb-1 me-1">Info</span>
        <span className="tag tag-warning mt-1 mb-1 me-1">Warning</span>
        <span className="tag tag-danger mt-1 mb-1 me-1">Danger</span>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div>
                <div className="card-title"> Pill Tags</div>
                <p className="text-muted mb-0 card-sub-title">Below is the pill tags example</p>
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(1)}>Show Code<i className={`${isHidden[1] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[1] ? 'd-none' : ''}`}>
              <span className="tag tag-default tag-pill mt-1 mb-1 me-1">Default</span>
              <span className="tag tag-dark tag-pill mt-1 mb-1 me-1">Dark</span>
              <span className="tag tag-primary tag-pill mt-1 mb-1 me-1">Primary</span>
              <span className="tag tag-success tag-pill mt-1 mb-1 me-1">Success</span>
              <span className="tag tag-info tag-pill mt-1 mb-1 me-1">Info</span>
              <span className="tag tag-warning tag-pill mt-1 mb-1 me-1">Warning</span>
              <span className="tag tag-danger tag-pill mt-1 mb-1 me-1">Danger</span>
            </Card.Body>
            <div className={`${isHidden[1] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <span className="tag tag-default tag-pill mt-1 mb-1 me-1">Default</span>
        <span className="tag tag-dark tag-pill mt-1 mb-1 me-1">Dark</span>
        <span className="tag tag-primary tag-pill mt-1 mb-1 me-1">Primary</span>
        <span className="tag tag-success tag-pill mt-1 mb-1 me-1">Success</span>
        <span className="tag tag-info tag-pill mt-1 mb-1 me-1">Info</span>
        <span className="tag tag-warning tag-pill mt-1 mb-1 me-1">Warning</span>
        <span className="tag tag-danger tag-pill mt-1 mb-1 me-1">Danger</span>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div>
                <div className="card-title">Default Tags Addon</div>
                <p className="text-muted mb-0 card-sub-title">Below is the pill tags example</p>
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(2)}>Show Code<i className={`${isHidden[2] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[2] ? 'd-none' : ''}`}>
              <div className="tags">
                <span className="tag tag-default">
                  One
                  <Link to="#" className="tag-addon"><i className="fe fe-x"></i></Link>
                </span>
                <span className="tag tag-default">
                  Two
                  <Link to="#" className="tag-addon"><i className="fe fe-x"></i></Link>
                </span>
                <span className="tag tag-default">
                  Three
                  <Link to="#" className="tag-addon"><i className="fe fe-x"></i></Link>
                </span>
                <span className="tag tag-default">
                  Four
                  <Link to="#" className="tag-addon"><i className="fe fe-x"></i></Link>
                </span>
              </div>
            </Card.Body>
            <div className={`${isHidden[2] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="tags">
        <span className="tag tag-default">
          One
          <Link to="#" className="tag-addon"><i className="fe fe-x"></i></Link>
        </span>
        <span className="tag tag-default">
          Two
          <Link to="#" className="tag-addon"><i className="fe fe-x"></i></Link>
        </span>
        <span className="tag tag-default">
          Three
          <Link to="#" className="tag-addon"><i className="fe fe-x"></i></Link>
        </span>
        <span className="tag tag-default">
          Four
          <Link to="#" className="tag-addon"><i className="fe fe-x"></i></Link>
        </span>
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

export default Tags
