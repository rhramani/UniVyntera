import { Fragment, useState } from "react"
import { Card, Col, Row } from "react-bootstrap"
import { Link } from "react-router-dom"
import Pageheader from "../../layouts/Pageheader"
import ALLImages from "../../common/Imagedata"


const Placeholders = () => {

  //showcode

  const [isHidden, setisHidden] = useState([false]);
  const toggleHidden = (index) => {
    const updatedHidden = [...isHidden];
    updatedHidden[index] = !updatedHidden[index];
    setisHidden(updatedHidden);
  };


  return (
    <Fragment>
      <Pageheader mainheading='Placeholders' parentfolder='Advanced Ui' activepage='Placeholders' />

      <Row className="row-sm">
        <Col xl={6}>
          <Row>
            <Col xl={6} lg={6} md={6} sm={12}>
              <Card className="custom-card">
                <img className="card-img-top" src={ALLImages('media60')} alt="" />
                <Card.Body>
                  <h5 className="card-title">Card title</h5>
                  <p className="card-text">Some quick example text to build on the card title and make
                    up
                    the bulk of the card's content.</p>
                  <Link to="#" className="btn btn-primary">Go somewhere</Link>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={6} lg={6} md={6} sm={12}>
              <Card aria-hidden="true">
                <img className="card-img-top" src={ALLImages('media61')} alt="" />
                <Card.Body>
                  <div className="h5 card-title placeholder-glow">
                    <span className="placeholder col-6"></span>
                  </div>
                  <p className="card-text placeholder-glow">
                    <span className="placeholder col-7 me-1"></span>
                    <span className="placeholder col-4"></span>
                    <span className="placeholder col-4 me-1"></span>
                    <span className="placeholder col-6"></span>
                  </p>
                  <Link to="#" tabIndex={-1} className="btn btn-primary disabled placeholder col-6"></Link>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header className="justify-content-between">
                  <div className="card-title">
                    Animation
                  </div>
                  <div className="prism-toggle">
                    <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(0)}>Show Code<i className={`${isHidden[0] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                  </div>
                </Card.Header>
                <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>
                  <p className="placeholder-glow mb-0">
                    <span className="placeholder col-12"></span>
                  </p>
                  <p className="placeholder-wave mb-0">
                    <span className="placeholder col-12"></span>
                  </p>
                </Card.Body>
                <div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <p className="placeholder-glow mb-0">
                    <span className="placeholder col-12"></span>
                  </p>
                  <p className="placeholder-wave mb-0">
                    <span className="placeholder col-12"></span>
                  </p>
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
              <Row>
                <Col xl={12}>
                  <Card className="custom-card">
                    <Card.Header className="justify-content-between">
                      <div className="card-title">
                        Sizing
                      </div>
                      <div className="prism-toggle">
                        <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(1)}>Show Code<i className={`${isHidden[1] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                      </div>
                    </Card.Header>
                    <Card.Body className={`${isHidden[1] ? 'd-none' : ''}`}>
                      <span className="placeholder col-12 placeholder-xl mb-1"></span>
                      <span className="placeholder col-12 placeholder-lg"></span>
                      <span className="placeholder col-12"></span>
                      <span className="placeholder col-12 placeholder-sm"></span>
                      <span className="placeholder col-12 placeholder-xs"></span>
                    </Card.Body>
                    <div className={`${isHidden[1] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <span className="placeholder col-12 placeholder-xl mb-1"></span>
                      <span className="placeholder col-12 placeholder-lg"></span>
                      <span className="placeholder col-12"></span>
                      <span className="placeholder col-12 placeholder-sm"></span>
                      <span className="placeholder col-12 placeholder-xs"></span>
        </Card.Body>
                `}
              </code></pre>
            </div>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header className="justify-content-between">
                  <div className="card-title">
                    Colors
                  </div>
                  <div className="prism-toggle">
                    <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(2)}>Show Code<i className={`${isHidden[2] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                  </div>
                </Card.Header>
                <Card.Body className={`${isHidden[2] ? 'd-none' : ''}`}>
                  <span className="placeholder col-12"></span>
                  <span className="placeholder col-12 bg-primary"></span>
                  <span className="placeholder col-12 bg-secondary"></span>
                  <span className="placeholder col-12 bg-success"></span>
                  <span className="placeholder col-12 bg-danger"></span>
                  <span className="placeholder col-12 bg-warning"></span>
                  <span className="placeholder col-12 bg-info"></span>
                  <span className="placeholder col-12 bg-light"></span>
                  <span className="placeholder col-12 bg-dark"></span>
                </Card.Body>
                <div className={`${isHidden[2] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <span className="placeholder col-12"></span>
                  <span className="placeholder col-12 bg-primary"></span>
                  <span className="placeholder col-12 bg-secondary"></span>
                  <span className="placeholder col-12 bg-success"></span>
                  <span className="placeholder col-12 bg-danger"></span>
                  <span className="placeholder col-12 bg-warning"></span>
                  <span className="placeholder col-12 bg-info"></span>
                  <span className="placeholder col-12 bg-light"></span>
                  <span className="placeholder col-12 bg-dark"></span>
        </Card.Body>
                `}
              </code></pre>
            </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Width
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(3)}>Show Code<i className={`${isHidden[3] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[3] ? 'd-none' : ''}`}>
              <span className="placeholder bg-primary col-6"></span>
              <span className="placeholder bg-primary w-75 me-2"></span>
              <span className="placeholder bg-primary" style={{ width: "25%" }}></span>
            </Card.Body>
            <div className={`${isHidden[3] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <span className="placeholder bg-primary col-6"></span>
              <span className="placeholder bg-primary w-75 me-2"></span>
              <span className="placeholder bg-primary" style={{ width: "25%" }}></span>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>
    </Fragment >
  )
}

export default Placeholders;
