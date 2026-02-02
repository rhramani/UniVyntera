import { Fragment, useState } from "react"
import { Card, Col, Row } from "react-bootstrap";
import Pageheader from "../../layouts/Pageheader";

const Spinners = () => {

  //showcode

  const [isHidden, setIsHidden] = useState([false]);
  const toggleHidden = (index) => {
    const updatedHidden = [...isHidden];
    updatedHidden[index] = !updatedHidden[index];
    setIsHidden(updatedHidden);
  };

  return (
    <Fragment>
      <Pageheader mainheading='Spinners' parentfolder='Elements' activepage='Spinners' />

      <Row className="row-sm">
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Border spinner
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(0)}>Show Code<i className={`${isHidden[0] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </Card.Body>
            <div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
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
                Colors
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(1)}>Show Code<i className={`${isHidden[1] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[1] ? 'd-none' : ''}`}>
              <div className="spinner-border me-2 text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-border me-2 text-secondary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-border me-2 text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-border me-2 text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-border me-2 text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-border me-2 text-info" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-border me-2 text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-border me-2 text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </Card.Body>
            <div className={`${isHidden[1] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="spinner-border me-2 text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-border me-2 text-secondary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-border me-2 text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-border me-2 text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-border me-2 text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-border me-2 text-info" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-border me-2 text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-border me-2 text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
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
                Growing spinner
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(2)}>Show Code<i className={`${isHidden[2] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[2] ? 'd-none' : ''}`}>
              <div className="spinner-grow" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </Card.Body>
            <div className={`${isHidden[2] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <img src={ALLImages("media25")} className="object-fit-contain border rounded" alt="..." />
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
                Growing spinner
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(3)}>Show Code<i className={`${isHidden[3] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[3] ? 'd-none' : ''}`}>
              <div className="spinner-grow me-1 text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-grow me-1 text-secondary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-grow me-1 text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-grow me-1 text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-grow me-1 text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-grow me-1 text-info" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-grow me-1 text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-grow me-1 text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </Card.Body>
            <div className={`${isHidden[3] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="spinner-grow me-1 text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-grow me-1 text-secondary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-grow me-1 text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-grow me-1 text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-grow me-1 text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-grow me-1 text-info" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-grow me-1 text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-grow me-1 text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
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
                Alignment Flex
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(4)}>Show Code<i className={`${isHidden[4] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[4] ? 'd-none' : ''}`}>
              <div className="d-flex justify-content-center mb-4">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <strong>Loading...</strong>
                <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
              </div>
            </Card.Body>
            <div className={`${isHidden[4] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="d-flex justify-content-center mb-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
      <div className="d-flex align-items-center">
        <strong>Loading...</strong>
        <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
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
                Alignment Float
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(5)}>Show Code<i className={`${isHidden[5] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[5] ? 'd-none' : ''}`}>
              <div className="clearfix mb-4">
                <div className="spinner-border float-end" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
              <div className="clearfix">
                <div className="spinner-border float-start" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </Card.Body>
            <div className={`${isHidden[5] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="clearfix mb-4">
        <div className="spinner-border float-end" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
      <div className="clearfix">
        <div className="spinner-border float-start" role="status">
          <span className="visually-hidden">Loading...</span>
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
                Alignment Text center
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(6)}>Show Code<i className={`${isHidden[6] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[6] ? 'd-none' : ''}`}>
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </Card.Body>
            <div className={`${isHidden[6] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Spinner Sizes
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(7)}>Show Code<i className={`${isHidden[7] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[7] ? 'd-none' : ''} d-flex align-items-center`}>
              <div className="spinner-border spinner-border-sm me-4" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-grow spinner-grow-sm me-4" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-border me-4" style={{ width: "3rem", height: "3rem" }}
                role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-grow" style={{ width: "3rem", height: "3rem" }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </Card.Body>
            <div className={`${isHidden[7] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="spinner-border spinner-border-sm me-4" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="spinner-grow spinner-grow-sm me-4" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="spinner-border me-4" style={{ width: "3rem", height: "3rem" }}
        role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="spinner-grow" style={{ width: "3rem", height: "3rem" }} role="status">
        <span className="visually-hidden">Loading...</span>
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
                Alignment Margin
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(8)}>Show Code<i className={`${isHidden[8] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[8] ? 'd-none' : ''}`}>
              <div className="spinner-border m-5" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </Card.Body>
            <div className={`${isHidden[8] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="spinner-border m-5" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <div className="col-xl-12">
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">Buttons</div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(9)}>Show Code<i className={`${isHidden[9] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[9] ? 'd-none' : ''}`}>
              <div className="btn-list">
                <button className="btn btn-primary-light" type="button" disabled>
                  <span className="spinner-border spinner-border-sm align-middle" role="status"
                    aria-hidden="true"></span> <span className="visually-hidden">Loading...</span>
                </button>
                <button className="btn btn-primary-light" type="button" disabled>
                  <span className="spinner-border spinner-border-sm align-middle" role="status"
                    aria-hidden="true"></span> Loading...
                </button>
                <button className="btn btn-primary-light" type="button" disabled>
                  <span className="spinner-grow spinner-grow-sm align-middle" role="status"
                    aria-hidden="true"></span>
                  <span className="visually-hidden"> Loading...</span>
                </button>
                <button className="btn btn-primary-light" type="button" disabled>
                  <span className="spinner-grow spinner-grow-sm align-middle" role="status"
                    aria-hidden="true"></span> Loading...
                </button>
                <button className="btn btn-secondary-light" type="button" disabled>
                  <span className="spinner-grow spinner-grow-sm align-middle" role="status"
                    aria-hidden="true"></span> Loading...
                </button>
                <button className="btn btn-success-light" type="button" disabled>
                  <span className="spinner-grow spinner-grow-sm align-middle" role="status"
                    aria-hidden="true"></span> Loading...
                </button>
                <button className="btn btn-info-light" type="button" disabled>
                  <span className="spinner-grow spinner-grow-sm align-middle" role="status"
                    aria-hidden="true"></span> Loading...
                </button>
                <button className="btn btn-warning-light" type="button" disabled>
                  <span className="spinner-grow spinner-grow-sm align-middle" role="status"
                    aria-hidden="true"></span> Loading...
                </button>
                <button className="btn btn-danger-light" type="button" disabled>
                  <span className="spinner-grow spinner-grow-sm align-middle" role="status"
                    aria-hidden="true"></span> Loading...
                </button>
                <button className="btn btn-light" type="button" disabled>
                  <span className="spinner-grow spinner-grow-sm align-middle" role="status"
                    aria-hidden="true"></span> Loading...
                </button>
                <button className="btn btn-dark text-fixed-white" type="button" disabled>
                  <span className="spinner-grow spinner-grow-sm align-middle" role="status"
                    aria-hidden="true"></span> Loading...
                </button>
              </div>
            </Card.Body>
            <div className={`${isHidden[9] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="btn-list">
        <button className="btn btn-primary-light" type="button" disabled>
          <span className="spinner-border spinner-border-sm align-middle" role="status"
            aria-hidden="true"></span> <span className="visually-hidden">Loading...</span>
        </button>
        <button className="btn btn-primary-light" type="button" disabled>
          <span className="spinner-border spinner-border-sm align-middle" role="status"
            aria-hidden="true"></span> Loading...
        </button>
        <button className="btn btn-primary-light" type="button" disabled>
          <span className="spinner-grow spinner-grow-sm align-middle" role="status"
            aria-hidden="true"></span>
          <span className="visually-hidden"> Loading...</span>
        </button>
        <button className="btn btn-primary-light" type="button" disabled>
          <span className="spinner-grow spinner-grow-sm align-middle" role="status"
            aria-hidden="true"></span> Loading...
        </button>
        <button className="btn btn-secondary-light" type="button" disabled>
          <span className="spinner-grow spinner-grow-sm align-middle" role="status"
            aria-hidden="true"></span> Loading...
        </button>
        <button className="btn btn-success-light" type="button" disabled>
          <span className="spinner-grow spinner-grow-sm align-middle" role="status"
            aria-hidden="true"></span> Loading...
        </button>
        <button className="btn btn-info-light" type="button" disabled>
          <span className="spinner-grow spinner-grow-sm align-middle" role="status"
            aria-hidden="true"></span> Loading...
        </button>
        <button className="btn btn-warning-light" type="button" disabled>
          <span className="spinner-grow spinner-grow-sm align-middle" role="status"
            aria-hidden="true"></span> Loading...
        </button>
        <button className="btn btn-danger-light" type="button" disabled>
          <span className="spinner-grow spinner-grow-sm align-middle" role="status"
            aria-hidden="true"></span> Loading...
        </button>
        <button className="btn btn-light" type="button" disabled>
          <span className="spinner-grow spinner-grow-sm align-middle" role="status"
            aria-hidden="true"></span> Loading...
        </button>
        <button className="btn btn-dark text-fixed-white" type="button" disabled>
          <span className="spinner-grow spinner-grow-sm align-middle" role="status"
            aria-hidden="true"></span> Loading...
        </button>
      </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </div>
      </Row>

    </Fragment>
  )
}

export default Spinners;
