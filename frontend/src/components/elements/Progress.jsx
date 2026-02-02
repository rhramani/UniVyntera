import { Fragment, useState } from 'react'
import { Card, Col, ProgressBar, Row } from 'react-bootstrap'
import Pageheader from '../../layouts/Pageheader'

const Progress = () => {

  //showcode

  const [isHidden, setIsHidden] = useState([false]);
  const toggleHidden = (index) => {
    const updatedHidden = [...isHidden];
    updatedHidden[index] = !updatedHidden[index];
    setIsHidden(updatedHidden);
  };

  return (
    <Fragment>
      <Pageheader mainheading='Progress' parentfolder='Elements' activepage='Progress' />

      <Row className="row-sm">
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title"> Basic Progress </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(0)}>Show Code<i className={`${isHidden[0] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>
              <ProgressBar className='my-3' now={0} />
              <ProgressBar className='my-3' now={25} />
              <ProgressBar className='my-3' now={50} />
              <ProgressBar className='my-3' now={75} />
              <ProgressBar className='my-3' now={100} />
            </Card.Body>
            <div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ProgressBar className='my-3' now={0} />
        <ProgressBar className='my-3' now={25} />
        <ProgressBar className='my-3' now={50} />
        <ProgressBar className='my-3' now={75} />
        <ProgressBar className='my-3' now={100} />
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Different Colored Progress
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(1)}>Show Code<i className={`${isHidden[1] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[1] ? 'd-none' : ''}`}>
              <ProgressBar variant='secondary' className='my-3' now={20} />
              <ProgressBar variant='warning' className='my-3' now={40} />
              <ProgressBar variant='info' className='my-3' now={60} />
              <ProgressBar variant='success' className='my-3' now={80} />
              <ProgressBar variant='danger' className='my-3' now={100} />
            </Card.Body>
            <div className={`${isHidden[1] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ProgressBar variant='secondary' className='my-3' now={20} />
        <ProgressBar variant='warning' className='my-3' now={40} />
        <ProgressBar variant='info' className='my-3' now={60} />
        <ProgressBar variant='success' className='my-3' now={80} />
        <ProgressBar variant='danger' className='my-3' now={100} />
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
              <div className="card-title">
                Striped Progress
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(2)}>Show Code<i className={`${isHidden[2] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[2] ? 'd-none' : ''}`}>
              <ProgressBar striped variant='primary' className='my-3' now={10} />
              <ProgressBar striped variant='secondary' className='my-3' now={25} />
              <ProgressBar striped variant='success' className='my-3' now={50} />
              <ProgressBar striped variant='info' className='my-3' now={75} />
              <ProgressBar striped variant='warning' className='my-3' now={100} />
            </Card.Body>
            <div className={`${isHidden[2] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ProgressBar striped variant='primary' className='my-3' now={10} />
              <ProgressBar striped variant='secondary' className='my-3' now={25} />
              <ProgressBar striped variant='success' className='my-3' now={50} />
              <ProgressBar striped variant='info' className='my-3' now={75} />
              <ProgressBar striped variant='warning' className='my-3' now={100} />
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Progress Height
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(3)}>Show Code<i className={`${isHidden[3] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[3] ? 'd-none' : ''}`}>
              <ProgressBar className='progress-xs my-3' now={10} />
              <ProgressBar className='progress-sm my-3' now={25} />
              <ProgressBar className=' my-3' now={50} />
              <ProgressBar className='progress-lg my-3' now={75} />
              <ProgressBar className='progress-xl my-3' now={100} />
            </Card.Body>
            <div className={`${isHidden[3] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ProgressBar className='progress-xs my-3' now={10} />
        <ProgressBar className='progress-sm my-3' now={25} />
        <ProgressBar className=' my-3' now={50} />
        <ProgressBar className='progress-lg my-3' now={75} />
        <ProgressBar className='progress-xl my-3' now={100} />
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
              <div className="card-title">
                Progress With Labels
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(4)}>Show Code<i className={`${isHidden[4] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[4] ? 'd-none' : ''}`}>
              <ProgressBar variant='primary' className='my-3' now={10} label="10%" />
              <ProgressBar variant='secondary' className='my-3' now={25} label="25%" />
              <ProgressBar variant='success' className='my-3' now={50} label="50%" />
              <ProgressBar variant='info' className='my-3' now={75} label="75%" />
              <ProgressBar variant='warning' className='my-3' now={100} label="100%" />
            </Card.Body>
            <div className={`${isHidden[4] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ProgressBar variant='primary' className='my-3' now={10} label="10%" />
              <ProgressBar variant='secondary' className='my-3' now={25} label="25%" />
              <ProgressBar variant='success' className='my-3' now={50} label="50%" />
              <ProgressBar variant='info' className='my-3' now={75} label="75%" />
              <ProgressBar variant='warning' className='my-3' now={100} label="100%" />
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Multiple bars With Sizes
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(5)}>Show Code<i className={`${isHidden[5] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[5] ? 'd-none' : ''}`}>
              <ProgressBar className='progress-xs my-3'>
                <ProgressBar variant="primary" now={5} key={1} />
                <ProgressBar variant="secondary" now={20} key={10} />
                <ProgressBar variant="success" now={15} key={3} />
              </ProgressBar>
              <ProgressBar className='progress-sm my-3'>
                <ProgressBar variant="warning" now={10} key={1} />
                <ProgressBar variant="info" now={15} key={10} />
                <ProgressBar variant="danger" now={20} key={3} />
              </ProgressBar>
              <ProgressBar className='my-3'>
                <ProgressBar variant="info" now={15} key={1} />
                <ProgressBar variant="success" now={20} key={10} />
                <ProgressBar variant="primary" now={25} key={3} />
              </ProgressBar>
              <ProgressBar className='progress-lg my-3'>
                <ProgressBar variant="purple" now={20} key={1} />
                <ProgressBar variant="teal" now={25} key={10} />
                <ProgressBar variant="orange" now={30} key={3} />
              </ProgressBar>
              <ProgressBar className='progress-xl my-3'>
                <ProgressBar variant="success" now={25} key={1} />
                <ProgressBar variant="danger" now={30} key={10} />
                <ProgressBar variant="warning" now={35} key={3} />
              </ProgressBar>
            </Card.Body>
            <div className={`${isHidden[5] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ProgressBar className='progress-xs my-3'>
        <ProgressBar variant="primary" now={5} key={1} />
        <ProgressBar variant="secondary" now={20} key={10} />
        <ProgressBar variant="success" now={15} key={3} />
      </ProgressBar>
      <ProgressBar className='progress-sm my-3'>
        <ProgressBar variant="warning" now={10} key={1} />
        <ProgressBar variant="info" now={15} key={10} />
        <ProgressBar variant="danger" now={20} key={3} />
      </ProgressBar>
      <ProgressBar className='my-3'>
        <ProgressBar variant="info" now={15} key={1} />
        <ProgressBar variant="success" now={20} key={10} />
        <ProgressBar variant="primary" now={25} key={3} />
      </ProgressBar>
      <ProgressBar className='progress-lg my-3'>
        <ProgressBar variant="purple" now={20} key={1} />
        <ProgressBar variant="teal" now={25} key={10} />
        <ProgressBar variant="orange" now={30} key={3} />
      </ProgressBar>
      <ProgressBar className='progress-xl my-3'>
        <ProgressBar variant="success" now={25} key={1} />
        <ProgressBar variant="danger" now={30} key={10} />
        <ProgressBar variant="warning" now={35} key={3} />
      </ProgressBar>
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
              <div className="card-title">
                Animated Stripped Progress
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(6)}>Show Code<i className={`${isHidden[6] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[6] ? 'd-none' : ''}`}>
              <ProgressBar animated variant='primary' className='my-3' now={10} />
              <ProgressBar animated variant='secondary' className='my-3' now={20} />
              <ProgressBar animated variant='success' className='my-3' now={40} />
              <ProgressBar animated variant='info' className='my-3' now={65} />
              <ProgressBar animated variant='warning' className='my-3' now={80} />
            </Card.Body>
            <div className={`${isHidden[6] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ProgressBar animated variant='primary' className='my-3' now={10} />
        <ProgressBar animated variant='secondary' className='my-3' now={20} />
        <ProgressBar animated variant='success' className='my-3' now={40} />
        <ProgressBar animated variant='info' className='my-3' now={65} />
        <ProgressBar animated variant='warning' className='my-3' now={80} />
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Gradient Progress
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(7)}>Show Code<i className={`${isHidden[7] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[7] ? 'd-none' : ''}`}>
              <ProgressBar variant='primary-gradient' className='my-3' now={10} />
              <ProgressBar variant='secondary-gradient' className='my-3' now={20} />
              <ProgressBar variant='success-gradient' className='my-3' now={40} />
              <ProgressBar variant='info-gradient' className='my-3' now={60} />
              <ProgressBar variant='warning-gradient' className='my-3' now={80} />
            </Card.Body>
            <div className={`${isHidden[7] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ProgressBar variant='primary-gradient' className='my-3' now={10} />
        <ProgressBar variant='secondary-gradient' className='my-3' now={20} />
        <ProgressBar variant='success-gradient' className='my-3' now={40} />
        <ProgressBar variant='info-gradient' className='my-3' now={60} />
        <ProgressBar variant='warning-gradient' className='my-3' now={80} />
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
              <div className="card-title">
                Custom Animated Progress
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(8)}>Show Code<i className={`${isHidden[8] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[8] ? 'd-none' : ''}`}>
              <ProgressBar variant='primary-gradient' className='progress-animate my-3' now={10} />
              <ProgressBar variant='secondary-gradient' className='progress-animate my-3' now={20} />
              <ProgressBar variant='success-gradient' className='progress-animate my-3' now={40} />
              <ProgressBar variant='info-gradient' className='progress-animate my-3' now={60} />
              <ProgressBar variant='warning-gradient' className='progress-animate my-3' now={80} />
            </Card.Body>
            <div className={`${isHidden[8] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ProgressBar variant='primary-gradient' className='progress-animate my-3' now={10} />
              <ProgressBar variant='secondary-gradient' className='progress-animate my-3' now={20} />
              <ProgressBar variant='success-gradient' className='progress-animate my-3' now={40} />
              <ProgressBar variant='info-gradient' className='progress-animate my-3' now={60} />
              <ProgressBar variant='warning-gradient' className='progress-animate my-3' now={80} />
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Custom Progress-1
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(10)}>Show Code<i className={`${isHidden[10] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[10] ? 'd-none' : ''}`}>
              <div className="progress progress-sm progress-custom mb-5 progress-animate" role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100}>
                <h6 className="progress-bar-title fs-10">Mobiles</h6>
                <div className="progress-bar" style={{ width: "50%" }}>
                  <div className="progress-bar-value">50%</div>
                </div>
              </div>
              <div className="progress progress-sm progress-custom mb-5 progress-animate" role="progressbar" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100}>
                <h6 className="progress-bar-title fs-10 bg-secondary">Watches</h6>
                <div className="progress-bar bg-secondary" style={{ width: "60%" }}>
                  <div className="progress-bar-value bg-secondary">60%</div>
                </div>
              </div>
              <div className="progress progress-sm progress-custom progress-animate" role="progressbar" aria-valuenow={70} aria-valuemin={0} aria-valuemax={100}>
                <h6 className="progress-bar-title fs-10 bg-success">Shirts</h6>
                <div className="progress-bar bg-success" style={{ width: "70%" }}>
                  <div className="progress-bar-value bg-success">70%</div>
                </div>
              </div>
            </Card.Body>
            <div className={`${isHidden[10] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="progress progress-sm progress-custom mb-5 progress-animate" role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100}>
                <h6 className="progress-bar-title fs-10">Mobiles</h6>
                <div className="progress-bar" style={{ width: "50%" }}>
                  <div className="progress-bar-value">50%</div>
                </div>
              </div>
              <div className="progress progress-sm progress-custom mb-5 progress-animate" role="progressbar" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100}>
                <h6 className="progress-bar-title fs-10 bg-secondary">Watches</h6>
                <div className="progress-bar bg-secondary" style={{ width: "60%" }}>
                  <div className="progress-bar-value bg-secondary">60%</div>
                </div>
              </div>
              <div className="progress progress-sm progress-custom progress-animate" role="progressbar" aria-valuenow={70} aria-valuemin={0} aria-valuemax={100}>
                <h6 className="progress-bar-title fs-10 bg-success">Shirts</h6>
                <div className="progress-bar bg-success" style={{ width: "70%" }}>
                  <div className="progress-bar-value bg-success">70%</div>
                </div>
              </div>
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
              <div className="card-title">
                Custom Progress-2
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(11)}>Show Code<i className={`${isHidden[11] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[11] ? 'd-none' : ''}`}>
              <div className="progress progress-sm mb-4" role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-item-1 bg-primary"></div><div className="progress-item-2"></div><div className="progress-item-3"></div>
                <div className="progress-bar" style={{ width: "50%" }}></div>
              </div>
              <div className="progress progress-sm mb-4" role="progressbar" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-item-1 bg-secondary"></div><div className="progress-item-2 bg-secondary"></div><div className="progress-item-3"></div>
                <div className="progress-bar bg-secondary" style={{ width: "60%" }}></div>
              </div>
              <div className="progress progress-sm mb-4" role="progressbar" aria-valuenow={70} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-item-1 bg-success"></div><div className="progress-item-2 bg-success"></div><div className="progress-item-3"></div>
                <div className="progress-bar bg-success" style={{ width: "70%" }}></div>
              </div>
              <div className="progress progress-sm mb-4" role="progressbar" aria-valuenow={80} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-item-1 bg-info"></div><div className="progress-item-2 bg-info"></div><div className="progress-item-3 bg-info"></div>
                <div className="progress-bar bg-info" style={{ width: "80%" }}></div>
              </div>
              <div className="progress progress-sm" role="progressbar" aria-valuenow={90} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-item-1 bg-warning"></div><div className="progress-item-2 bg-warning"></div><div className="progress-item-3 bg-warning"></div>
                <div className="progress-bar bg-warning" style={{ width: "90%" }}></div>
              </div>
            </Card.Body>
            <div className={`${isHidden[11] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="progress progress-sm mb-4" role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-item-1 bg-primary"></div><div className="progress-item-2"></div><div className="progress-item-3"></div>
                <div className="progress-bar" style={{ width: "50%" }}></div>
              </div>
              <div className="progress progress-sm mb-4" role="progressbar" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-item-1 bg-secondary"></div><div className="progress-item-2 bg-secondary"></div><div className="progress-item-3"></div>
                <div className="progress-bar bg-secondary" style={{ width: "60%" }}></div>
              </div>
              <div className="progress progress-sm mb-4" role="progressbar" aria-valuenow={70} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-item-1 bg-success"></div><div className="progress-item-2 bg-success"></div><div className="progress-item-3"></div>
                <div className="progress-bar bg-success" style={{ width: "70%" }}></div>
              </div>
              <div className="progress progress-sm mb-4" role="progressbar" aria-valuenow={80} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-item-1 bg-info"></div><div className="progress-item-2 bg-info"></div><div className="progress-item-3 bg-info"></div>
                <div className="progress-bar bg-info" style={{ width: "80%" }}></div>
              </div>
              <div className="progress progress-sm" role="progressbar" aria-valuenow={90} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-item-1 bg-warning"></div><div className="progress-item-2 bg-warning"></div><div className="progress-item-3 bg-warning"></div>
                <div className="progress-bar bg-warning" style={{ width: "90%" }}></div>
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
              <div className="card-title">
                Custom Progress-3
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(12)}>Show Code<i className={`${isHidden[12] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[12] ? 'd-none' : ''}`}>
              <div className="progress progress-lg mb-5 custom-progress-3 progress-animate" role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-bar" style={{ width: "50%" }}>
                  <div className="progress-bar-value">50%</div>
                </div>
              </div>
              <div className="progress progress-lg mb-5 custom-progress-3 progress-animate" role="progressbar" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-bar bg-secondary" style={{ width: "60%" }}>
                  <div className="progress-bar-value secondary">60%</div>
                </div>
              </div>
              <div className="progress progress-lg custom-progress-3 progress-animate" role="progressbar" aria-valuenow={70} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-bar bg-success" style={{ width: "70%" }}>
                  <div className="progress-bar-value success">70%</div>
                </div>
              </div>
            </Card.Body>
            <div className={`${isHidden[12] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="progress progress-lg mb-5 custom-progress-3 progress-animate" role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-bar" style={{ width: "50%" }}>
          <div className="progress-bar-value">50%</div>
        </div>
      </div>
      <div className="progress progress-lg mb-5 custom-progress-3 progress-animate" role="progressbar" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-bar bg-secondary" style={{ width: "60%" }}>
          <div className="progress-bar-value secondary">60%</div>
        </div>
      </div>
      <div className="progress progress-lg custom-progress-3 progress-animate" role="progressbar" aria-valuenow={70} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-bar bg-success" style={{ width: "70%" }}>
          <div className="progress-bar-value success">70%</div>
        </div>
      </div>
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
              <div className="card-title">
                Custom Progress-4
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(13)}>Show Code<i className={`${isHidden[13] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[13] ? 'd-none' : ''}`}>
              <div className="progress progress-xl mb-3 progress-animate custom-progress-4" role="progressbar" aria-valuenow={10} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-bar bg-primary-gradient" style={{ width: "10%" }}></div>
                <div className="progress-bar-label">10%</div>
              </div>
              <div className="progress progress-xl mb-3 progress-animate custom-progress-4 secondary" role="progressbar" aria-valuenow={20} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-bar bg-secondary-gradient" style={{ width: "20%" }}></div>
                <div className="progress-bar-label">20%</div>
              </div>
              <div className="progress progress-xl mb-3 progress-animate custom-progress-4 success" role="progressbar" aria-valuenow={40} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-bar bg-success-gradient" style={{ width: "40%" }}></div>
                <div className="progress-bar-label">40%</div>
              </div>
              <div className="progress progress-xl mb-3 progress-animate custom-progress-4 info" role="progressbar" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-bar bg-info-gradient" style={{ width: "60%" }}></div>
                <div className="progress-bar-label">60%</div>
              </div>
              <div className="progress progress-xl mb-3 progress-animate custom-progress-4 warning" role="progressbar" aria-valuenow={80} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-bar bg-warning-gradient" style={{ width: "80%" }}></div>
                <div className="progress-bar-label">80%</div>
              </div>
              <div className="progress progress-xl progress-animate custom-progress-4 danger" role="progressbar" aria-valuenow={90} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-bar bg-danger-gradient" style={{ width: "90%" }}></div>
                <div className="progress-bar-label">90%</div>
              </div>
            </Card.Body>
            <div className={`${isHidden[13] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="progress progress-xl mb-3 progress-animate custom-progress-4" role="progressbar" aria-valuenow={10} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-bar bg-primary-gradient" style={{ width: "10%" }}></div>
                <div className="progress-bar-label">10%</div>
              </div>
              <div className="progress progress-xl mb-3 progress-animate custom-progress-4 secondary" role="progressbar" aria-valuenow={20} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-bar bg-secondary-gradient" style={{ width: "20%" }}></div>
                <div className="progress-bar-label">20%</div>
              </div>
              <div className="progress progress-xl mb-3 progress-animate custom-progress-4 success" role="progressbar" aria-valuenow={40} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-bar bg-success-gradient" style={{ width: "40%" }}></div>
                <div className="progress-bar-label">40%</div>
              </div>
              <div className="progress progress-xl mb-3 progress-animate custom-progress-4 info" role="progressbar" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-bar bg-info-gradient" style={{ width: "60%" }}></div>
                <div className="progress-bar-label">60%</div>
              </div>
              <div className="progress progress-xl mb-3 progress-animate custom-progress-4 warning" role="progressbar" aria-valuenow={80} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-bar bg-warning-gradient" style={{ width: "80%" }}></div>
                <div className="progress-bar-label">80%</div>
              </div>
              <div className="progress progress-xl progress-animate custom-progress-4 danger" role="progressbar" aria-valuenow={90} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-bar bg-danger-gradient" style={{ width: "90%" }}></div>
                <div className="progress-bar-label">90%</div>
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
              <div className="card-title">
                Custom Progress-5
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(14)}>Show Code<i className={`${isHidden[14] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[14] ? 'd-none' : ''}`}>
              <h6 className="fw-semibold mb-2">Project Dependencies</h6>
              <div className="progress-stacked progress-xl mb-5">
                <div className="progress-bar" role="progressbar" style={{ width: "25%" }}
                  aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>25%</div>
                <div className="progress-bar bg-secondary" role="progressbar" style={{ width: "35%" }}
                  aria-valuenow={35} aria-valuemin={0} aria-valuemax={100}>35%</div>
                <div className="progress-bar bg-danger" role="progressbar" style={{ width: "40%" }}
                  aria-valuenow={40} aria-valuemin={0} aria-valuemax={100}>40%</div>
              </div>
              <Row className="justify-content-center">
                <Col xl={5}>
                  <div className="border p-3">
                    <p className="fs-12 fw-semibold mb-0 text-muted">Html<span className="float-end fs-10 fw-normal">25%</span></p>
                    <div className="progress progress-xs mb-4 progress-animate" role="progressbar" aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>
                      <div className="progress-bar bg-primary" style={{ width: "25%" }}>
                      </div>
                    </div>
                    <p className="fs-12 fw-semibold mb-0 text-muted">Css<span className="float-end fs-10 fw-normal">35%</span></p>
                    <div className="progress progress-xs mb-4 progress-animate" role="progressbar" aria-valuenow={35} aria-valuemin={0} aria-valuemax={100}>
                      <div className="progress-bar bg-secondary" style={{ width: "35%" }}>
                      </div>
                    </div>
                    <p className="fs-12 fw-semibold mb-0 text-muted">Js<span className="float-end fs-10 fw-normal">40%</span></p>
                    <div className="progress progress-xs mb-0 progress-animate" role="progressbar" aria-valuenow={40} aria-valuemin={0} aria-valuemax={100}>
                      <div className="progress-bar bg-danger" style={{ width: "40%" }}>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
            <div className={`${isHidden[14] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <h6 className="fw-semibold mb-2">Project Dependencies</h6>
              <div className="progress-stacked progress-xl mb-5">
                <div className="progress-bar" role="progressbar" style={{ width: "25%" }}
                  aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>25%</div>
                <div className="progress-bar bg-secondary" role="progressbar" style={{ width: "35%" }}
                  aria-valuenow={35} aria-valuemin={0} aria-valuemax={100}>35%</div>
                <div className="progress-bar bg-danger" role="progressbar" style={{ width: "40%" }}
                  aria-valuenow={40} aria-valuemin={0} aria-valuemax={100}>40%</div>
              </div>
              <Row className="justify-content-center">
                <Col xl={5}>
                  <div className="border p-3">
                    <p className="fs-12 fw-semibold mb-0 text-muted">Html<span className="float-end fs-10 fw-normal">25%</span></p>
                    <div className="progress progress-xs mb-4 progress-animate" role="progressbar" aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>
                      <div className="progress-bar bg-primary" style={{ width: "25%" }}>
                      </div>
                    </div>
                    <p className="fs-12 fw-semibold mb-0 text-muted">Css<span className="float-end fs-10 fw-normal">35%</span></p>
                    <div className="progress progress-xs mb-4 progress-animate" role="progressbar" aria-valuenow={35} aria-valuemin={0} aria-valuemax={100}>
                      <div className="progress-bar bg-secondary" style={{ width: "35%" }}>
                      </div>
                    </div>
                    <p className="fs-12 fw-semibold mb-0 text-muted">Js<span className="float-end fs-10 fw-normal">40%</span></p>
                    <div className="progress progress-xs mb-0 progress-animate" role="progressbar" aria-valuenow={40} aria-valuemin={0} aria-valuemax={100}>
                      <div className="progress-bar bg-danger" style={{ width: "40%" }}>
                      </div>
                    </div>
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
    </Fragment>
  )
}

export default Progress;
