import { Fragment, useState } from "react"
import { Card, Carousel, Col, Row } from "react-bootstrap"
import Pageheader from "../../layouts/Pageheader"
import ALLImages from "../../common/Imagedata"


const Carousels = () => {

  //showcode

  const [isHidden, setIsHidden] = useState([false]);
  const toggleHidden = (index) => {
    const updatedHidden = [...isHidden];
    updatedHidden[index] = !updatedHidden[index];
    setIsHidden(updatedHidden);
  };

  return (
    <Fragment>
      <Pageheader mainheading='Carousel' parentfolder='Advanced UI' activepage='Carousel' />

      <Row className="row-sm">
        <Col xl={4} lg={6} md={6} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">Basic Carousel</div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(0)}>Show Code<i className={`${isHidden[0] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>
              <Carousel indicators={false} controls={false}>
                <Carousel.Item>
                  <img src={ALLImages('media26')} className="d-block w-100" alt="..." />
                </Carousel.Item>
                <Carousel.Item>
                  <img src={ALLImages('media27')} className="d-block w-100" alt="..." />
                </Carousel.Item>
                <Carousel.Item>
                  <img src={ALLImages('media33')} className="d-block w-100" alt="..." />
                </Carousel.Item>
              </Carousel>
            </Card.Body>
            <div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Carousel indicators={false} controls={false}>
                <Carousel.Item>
                  <img src={ALLImages('media26')} className="d-block w-100" alt="..." />
                </Carousel.Item>
                <Carousel.Item>
                  <img src={ALLImages('media27')} className="d-block w-100" alt="..." />
                </Carousel.Item>
                <Carousel.Item>
                  <img src={ALLImages('media33')} className="d-block w-100" alt="..." />
                </Carousel.Item>
              </Carousel>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={4} lg={6} md={6} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">With controls</div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(1)}>Show Code<i className={`${isHidden[1] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[1] ? 'd-none' : ''}`}>
              <Carousel indicators={false} controls={true}>
                <Carousel.Item>
                  <img src={ALLImages('media28')} className="d-block w-100" alt="..." />
                </Carousel.Item>
                <Carousel.Item>
                  <img src={ALLImages('media31')} className="d-block w-100" alt="..." />
                </Carousel.Item>
                <Carousel.Item>
                  <img src={ALLImages('media32')} className="d-block w-100" alt="..." />
                </Carousel.Item>
              </Carousel>
            </Card.Body>
            <div className={`${isHidden[1] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Carousel indicators={false} controls={true}>
                <Carousel.Item>
                  <img src={ALLImages('media28')} className="d-block w-100" alt="..." />
                </Carousel.Item>
                <Carousel.Item>
                  <img src={ALLImages('media31')} className="d-block w-100" alt="..." />
                </Carousel.Item>
                <Carousel.Item>
                  <img src={ALLImages('media32')} className="d-block w-100" alt="..." />
                </Carousel.Item>
              </Carousel>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={4} lg={6} md={6} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">With indicators</div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(2)}>Show Code<i className={`${isHidden[2] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[2] ? 'd-none' : ''}`}>
              <Carousel indicators={true} controls={false}>
                <Carousel.Item >
                  <img src={ALLImages('media25')} className="d-block w-100" alt="..." />
                </Carousel.Item>
                <Carousel.Item>
                  <img src={ALLImages('media29')} className="d-block w-100" alt="..." />
                </Carousel.Item>
                <Carousel.Item>
                  <img src={ALLImages('media30')} className="d-block w-100" alt="..." />
                </Carousel.Item>
              </Carousel>
            </Card.Body>
            <div className={`${isHidden[2] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Carousel indicators={true} controls={false}>
        <Carousel.Item >
          <img src={ALLImages('media25')} className="d-block w-100" alt="..." />
        </Carousel.Item>
        <Carousel.Item>
          <img src={ALLImages('media29')} className="d-block w-100" alt="..." />
        </Carousel.Item>
        <Carousel.Item>
          <img src={ALLImages('media30')} className="d-block w-100" alt="..." />
        </Carousel.Item>
      </Carousel>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={4} lg={6} md={6} sm={12}>
          <Card className="custom-card carousel-with-caption">
            <Card.Header className="justify-content-between">
              <div className="card-title">With captions</div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(3)}>Show Code<i className={`${isHidden[3] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[3] ? 'd-none' : ''}`}>
              <Carousel>
                <Carousel.Item>
                  <img src={ALLImages('media59')} className="d-block w-100" alt="..." />
                  <Carousel.Caption>
                    <h5>First slide label</h5>
                    <p>Some representative placeholder content for the first slide.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img src={ALLImages('media60')} className="d-block w-100" alt="..." />
                  <Carousel.Caption>
                    <h5>Second slide label</h5>
                    <p>Some representative placeholder content for the second slide.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img src={ALLImages('media61')} className="d-block w-100" alt="..." />
                  <Carousel.Caption>
                    <h5>Third slide label</h5>
                    <p>Some representative placeholder content for the third slide.</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </Card.Body>
            <div className={`${isHidden[3] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Carousel>
                <Carousel.Item>
                  <img src={ALLImages('media59')} className="d-block w-100" alt="..." />
                  <Carousel.Caption>
                    <h5>First slide label</h5>
                    <p>Some representative placeholder content for the first slide.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img src={ALLImages('media60')} className="d-block w-100" alt="..." />
                  <Carousel.Caption>
                    <h5>Second slide label</h5>
                    <p>Some representative placeholder content for the second slide.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img src={ALLImages('media61')} className="d-block w-100" alt="..." />
                  <Carousel.Caption>
                    <h5>Third slide label</h5>
                    <p>Some representative placeholder content for the third slide.</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={4} lg={6} md={6} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">Crossfade</div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(4)}>Show Code<i className={`${isHidden[4] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[4] ? 'd-none' : ''}`}>
              <Carousel indicators={false} controls={true} fade>
                <Carousel.Item>
                  <img src={ALLImages('media43')} className="d-block w-100" alt="..." />
                </Carousel.Item>
                <Carousel.Item>
                  <img src={ALLImages('media44')} className="d-block w-100" alt="..." />
                </Carousel.Item>
                <Carousel.Item>
                  <img src={ALLImages('media45')} className="d-block w-100" alt="..." />
                </Carousel.Item>
              </Carousel>
            </Card.Body>
            <div className={`${isHidden[4] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Carousel indicators={false} controls={true} fade>
                <Carousel.Item>
                  <img src={ALLImages('media43')} className="d-block w-100" alt="..." />
                </Carousel.Item>
                <Carousel.Item>
                  <img src={ALLImages('media44')} className="d-block w-100" alt="..." />
                </Carousel.Item>
                <Carousel.Item>
                  <img src={ALLImages('media45')} className="d-block w-100" alt="..." />
                </Carousel.Item>
              </Carousel>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={4} lg={6} md={6} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">Individual .carousel-item interval</div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(5)}>Show Code<i className={`${isHidden[5] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[5] ? 'd-none' : ''}`}>
              <Carousel indicators={false} controls={false}>
                <Carousel.Item interval={10000}>
                  <img src={ALLImages('media40')} className="d-block w-100" alt="..." />
                </Carousel.Item>
                <Carousel.Item interval={2000}>
                  <img src={ALLImages("media41")} className="d-block w-100" alt="..." />
                </Carousel.Item>
                <Carousel.Item interval={200}>
                  <img src={ALLImages('media42')} className="d-block w-100" alt="..." />
                </Carousel.Item>
              </Carousel>
            </Card.Body>
            <div className={`${isHidden[5] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Carousel indicators={false} controls={false}>
        <Carousel.Item interval={10000}>
          <img src={ALLImages('media40')} className="d-block w-100" alt="..." />
        </Carousel.Item>
        <Carousel.Item interval={2000}>
          <img src={ALLImages("media41")} className="d-block w-100" alt="..." />
        </Carousel.Item>
        <Carousel.Item interval={200}>
          <img src={ALLImages('media42')} className="d-block w-100" alt="..." />
        </Carousel.Item>
      </Carousel>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <Col xl={4} lg={6} md={6} sm={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">Disable touch swiping</div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(6)}>Show Code<i className={`${isHidden[6] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[6] ? 'd-none' : ''}`}>
              <Carousel touch={false} wrap={false} indicators={false} controls={true}>
                <Carousel.Item>
                  <img src={ALLImages('media13')} className="d-block w-100" alt="..." />
                </Carousel.Item>
                <Carousel.Item>
                  <img src={ALLImages("media14")} className="d-block w-100" alt="..." />
                </Carousel.Item>
                <Carousel.Item>
                  <img src={ALLImages('media18')} className="d-block w-100" alt="..." />
                </Carousel.Item>
              </Carousel>
            </Card.Body>
            <div className={`${isHidden[6] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Carousel touch={false} wrap={false} indicators={false} controls={true}>
                <Carousel.Item>
                  <img src={ALLImages('media13')} className="d-block w-100" alt="..." />
                </Carousel.Item>
                <Carousel.Item>
                  <img src={ALLImages("media14")} className="d-block w-100" alt="..." />
                </Carousel.Item>
                <Carousel.Item>
                  <img src={ALLImages('media18')} className="d-block w-100" alt="..." />
                </Carousel.Item>
              </Carousel>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={4} lg={6} md={6} sm={12}>
          <Card className="custom-card dark-variant-carousel">
            <Card.Header className="justify-content-between">
              <div className="card-title">Dark variant</div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(7)}>Show Code<i className={`${isHidden[7] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[7] ? 'd-none' : ''}`}>
              <Carousel data-bs-theme='dark'>
                <Carousel.Item interval={10000}>
                  <img src={ALLImages('media63')} className="d-block w-100" alt="..." />
                  <Carousel.Caption>
                    <h5>First slide label</h5>
                    <p>Some representative placeholder content for the first slide.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item interval={2000}>
                  <img src={ALLImages("media64")} className="d-block w-100" alt="..." />
                  <Carousel.Caption>
                    <h5>Second slide label</h5>
                    <p>Some representative placeholder content for the second slide.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item interval={200}>
                  <img src={ALLImages('media62')} className="d-block w-100" alt="..." />
                  <Carousel.Caption>
                    <h5>Third slide label</h5>
                    <p>Some representative placeholder content for the third slide.</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </Card.Body>
            <div className={`${isHidden[7] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <Carousel data-bs-theme='dark'>
                <Carousel.Item interval={10000}>
                  <img src={ALLImages('media63')} className="d-block w-100" alt="..." />
                  <Carousel.Caption>
                    <h5>First slide label</h5>
                    <p>Some representative placeholder content for the first slide.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item interval={2000}>
                  <img src={ALLImages("media64")} className="d-block w-100" alt="..." />
                  <Carousel.Caption>
                    <h5>Second slide label</h5>
                    <p>Some representative placeholder content for the second slide.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item interval={200}>
                  <img src={ALLImages('media62')} className="d-block w-100" alt="..." />
                  <Carousel.Caption>
                    <h5>Third slide label</h5>
                    <p>Some representative placeholder content for the third slide.</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
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

export default Carousels;
