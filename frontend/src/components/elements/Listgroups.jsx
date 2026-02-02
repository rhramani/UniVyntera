import { Fragment, useState } from "react"
import { Badge, Card, Col, Form, ListGroup, Row } from "react-bootstrap"
import Pageheader from "../../layouts/Pageheader";
import ALLImages from "../../common/Imagedata";


const ListGroups = () => {

  const items = [
    'Accurate information at any given point.',
    'Hearing the information and responding.',
    'Setting up and customizing your own sales.',
    'New Admin Launched.',
    'To maximize profits and improve productivity.',
    'To have a complete 360° overview of sales information.'
  ];

  //showcode

  const [isHidden, setIsHidden] = useState([false]);
  const toggleHidden = (index) => {
    const updatedHidden = [...isHidden];
    updatedHidden[index] = !updatedHidden[index];
    setIsHidden(updatedHidden);
  };

  return (
    <Fragment>
      <Pageheader mainheading='List Groups' parentfolder='Elements' activepage='List Groups' />

      <Row className="row-sm">
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Basic List
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(0)}>Show Code<i className={`${isHidden[0] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>
              <ListGroup>
                <ListGroup.Item>
                  <div className="d-flex align-items-center">
                    <span className="avatar avatar-sm">
                      <img src={ALLImages("face1")} alt="img" />
                    </span>
                    <div className="ms-2 fw-semibold">
                      Alicia Sierra
                    </div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex align-items-center">
                    <span className="avatar avatar-sm">
                      <img src={ALLImages("face3")} alt="img" />
                    </span>
                    <div className="ms-2 fw-semibold">
                      Samantha Mery
                    </div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex align-items-center">
                    <span className="avatar avatar-sm">
                      <img src={ALLImages("face6")} alt="img" />
                    </span>
                    <div className="ms-2 fw-semibold">
                      Juliana Pena
                    </div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex align-items-center">
                    <span className="avatar avatar-sm">
                      <img src={ALLImages("face15")} alt="img" />
                    </span>
                    <div className="ms-2 fw-semibold">
                      Adam Smith
                    </div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex align-items-center">
                    <span className="avatar avatar-sm">
                      <img src={ALLImages("face13")} alt="img" />
                    </span>
                    <div className="ms-2 fw-semibold">
                      Farhaan Amhed
                    </div>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ListGroup>
        <ListGroup.Item>
          <div className="d-flex align-items-center">
            <span className="avatar avatar-sm">
              <img src={ALLImages("face1")} alt="img" />
            </span>
            <div className="ms-2 fw-semibold">
              Alicia Sierra
            </div>
          </div>
        </ListGroup.Item>
        <ListGroup.Item>
          <div className="d-flex align-items-center">
            <span className="avatar avatar-sm">
              <img src={ALLImages("face3")} alt="img" />
            </span>
            <div className="ms-2 fw-semibold">
              Samantha Mery
            </div>
          </div>
        </ListGroup.Item>
        <ListGroup.Item>
          <div className="d-flex align-items-center">
            <span className="avatar avatar-sm">
              <img src={ALLImages("face6")} alt="img" />
            </span>
            <div className="ms-2 fw-semibold">
              Juliana Pena
            </div>
          </div>
        </ListGroup.Item>
        <ListGroup.Item>
          <div className="d-flex align-items-center">
            <span className="avatar avatar-sm">
              <img src={ALLImages("face15")} alt="img" />
            </span>
            <div className="ms-2 fw-semibold">
              Adam Smith
            </div>
          </div>
        </ListGroup.Item>
        <ListGroup.Item>
          <div className="d-flex align-items-center">
            <span className="avatar avatar-sm">
              <img src={ALLImages("face13")} alt="img" />
            </span>
            <div className="ms-2 fw-semibold">
              Farhaan Amhed
            </div>
          </div>
        </ListGroup.Item>
      </ListGroup>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Active items
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(1)}>Show Code<i className={`${isHidden[1] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[1] ? 'd-none' : ''}`}>
              <ListGroup>
                <ListGroup.Item active>
                  <div className="d-flex align-items-center">
                    <div>
                      <span className="fs-15">
                        <i className="bi bi-house-door"></i>
                      </span>
                    </div>
                    <div className="ms-2">
                      Home
                    </div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex align-items-center">
                    <div>
                      <span className="fs-15">
                        <i className="bi bi-bell"></i>
                      </span>
                    </div>
                    <div className="ms-2">
                      Notifications
                    </div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex align-items-center">
                    <div>
                      <span className="fs-15">
                        <i className="bi bi-gift"></i>
                      </span>
                    </div>
                    <div className="ms-2">
                      Sent Messages
                    </div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex align-items-center">
                    <div>
                      <span className="fs-15">
                        <i className="bi bi-person"></i>
                      </span>
                    </div>
                    <div className="ms-2">
                      New Requests
                    </div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex align-items-center">
                    <div>
                      <span className="fs-15">
                        <i className="bi bi-trash3"></i>
                      </span>
                    </div>
                    <div className="ms-2">
                      Deleted Messages
                    </div>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <div className={`${isHidden[1] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ListGroup>
                <ListGroup.Item active>
                  <div className="d-flex align-items-center">
                    <div>
                      <span className="fs-15">
                        <i className="bi bi-house-door"></i>
                      </span>
                    </div>
                    <div className="ms-2">
                      Home
                    </div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex align-items-center">
                    <div>
                      <span className="fs-15">
                        <i className="bi bi-bell"></i>
                      </span>
                    </div>
                    <div className="ms-2">
                      Notifications
                    </div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex align-items-center">
                    <div>
                      <span className="fs-15">
                        <i className="bi bi-gift"></i>
                      </span>
                    </div>
                    <div className="ms-2">
                      Sent Messages
                    </div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex align-items-center">
                    <div>
                      <span className="fs-15">
                        <i className="bi bi-person"></i>
                      </span>
                    </div>
                    <div className="ms-2">
                      New Requests
                    </div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex align-items-center">
                    <div>
                      <span className="fs-15">
                        <i className="bi bi-trash3"></i>
                      </span>
                    </div>
                    <div className="ms-2">
                      Deleted Messages
                    </div>
                  </div>
                </ListGroup.Item>
              </ListGroup>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Disabled items
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(2)}>Show Code<i className={`${isHidden[2] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[2] ? 'd-none' : ''}`}>
              <ListGroup>
                <ListGroup.Item disabled>A disabled item meant to be disabled</ListGroup.Item>
                <ListGroup.Item>Simply dummy text of the printing</ListGroup.Item>
                <ListGroup.Item>There are many variations of passages</ListGroup.Item>
                <ListGroup.Item>All the Lorem Ipsum generators</ListGroup.Item>
                <ListGroup.Item>Written in 45 BC. This book is a treatise on the theory</ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <div className={`${isHidden[2] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ListGroup>
                <ListGroup.Item disabled>A disabled item meant to be disabled</ListGroup.Item>
                <ListGroup.Item>Simply dummy text of the printing</ListGroup.Item>
                <ListGroup.Item>There are many variations of passages</ListGroup.Item>
                <ListGroup.Item>All the Lorem Ipsum generators</ListGroup.Item>
                <ListGroup.Item>Written in 45 BC. This book is a treatise on the theory</ListGroup.Item>
              </ListGroup>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Flush
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(3)}>Show Code<i className={`${isHidden[3] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[3] ? 'd-none' : ''}`}>
              <ListGroup variant="flush">
                <ListGroup.Item className="fw-semibold"><i className="bi bi-envelope align-middle me-2 text-muted"></i>Asish Trivedhi<span className="ms-1 text-muted fw-normal d-inline-block">(+1023-84534)</span></ListGroup.Item>
                <ListGroup.Item className="fw-semibold"><i className="bi bi-tiktok align-middle me-2 text-muted"></i>Alezander Russo<span className="ms-1 text-muted fw-normal d-inline-block">(+7546-12342)</span></ListGroup.Item>
                <ListGroup.Item className="fw-semibold"><i className="bi bi-whatsapp align-middle me-2 text-muted"></i>Karem Smith<span className="ms-1 text-muted fw-normal d-inline-block">(+9944-56632)</span></ListGroup.Item>
                <ListGroup.Item className="fw-semibold"><i className="bi bi-facebook align-middle me-2 text-muted"></i>Melissa Brien<span className="ms-1 text-muted fw-normal d-inline-block">(+1023-34323)</span></ListGroup.Item>
                <ListGroup.Item className="fw-semibold"><i className="bi bi-instagram align-middle me-2 text-muted"></i>Kamala Harris<span className="ms-1 text-muted fw-normal d-inline-block">(+91-63421)</span></ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <div className={`${isHidden[3] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ListGroup variant="flush">
        <ListGroup.Item className="fw-semibold"><i className="bi bi-envelope align-middle me-2 text-muted"></i>Asish Trivedhi<span className="ms-1 text-muted fw-normal d-inline-block">(+1023-84534)</span></ListGroup.Item>
        <ListGroup.Item className="fw-semibold"><i className="bi bi-tiktok align-middle me-2 text-muted"></i>Alezander Russo<span className="ms-1 text-muted fw-normal d-inline-block">(+7546-12342)</span></ListGroup.Item>
        <ListGroup.Item className="fw-semibold"><i className="bi bi-whatsapp align-middle me-2 text-muted"></i>Karem Smith<span className="ms-1 text-muted fw-normal d-inline-block">(+9944-56632)</span></ListGroup.Item>
        <ListGroup.Item className="fw-semibold"><i className="bi bi-facebook align-middle me-2 text-muted"></i>Melissa Brien<span className="ms-1 text-muted fw-normal d-inline-block">(+1023-34323)</span></ListGroup.Item>
        <ListGroup.Item className="fw-semibold"><i className="bi bi-instagram align-middle me-2 text-muted"></i>Kamala Harris<span className="ms-1 text-muted fw-normal d-inline-block">(+91-63421)</span></ListGroup.Item>
      </ListGroup>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Links
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(4)}>Show Code<i className={`${isHidden[4] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[4] ? 'd-none' : ''}`}>
              <ListGroup defaultActiveKey="first">
                <ListGroup.Item action href="#first" active>
                  <div className="d-flex align-items-center">
                    <div>
                      <span className="avatar avatar-xs bg-white text-default avatar-rounded">
                        C
                      </span>
                    </div>
                    <div className="ms-2">California</div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item action href="#second">
                  <div className="d-flex align-items-center">
                    <div>
                      <span className="avatar avatar-xs bg-secondary avatar-rounded">
                        N
                      </span>
                    </div>
                    <div className="ms-2">New Jersey</div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item action href="#third">
                  <div className="d-flex align-items-center">
                    <div>
                      <span className="avatar avatar-xs bg-info avatar-rounded">
                        L
                      </span>
                    </div>
                    <div className="ms-2">Los Angeles</div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item action href="#fourth">
                  <div className="d-flex align-items-center">
                    <div>
                      <span className="avatar avatar-xs bg-warning avatar-rounded">
                        M
                      </span>
                    </div>
                    <div className="ms-2">Miami Florida</div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item action href="#fifth" disabled>
                  <div className="d-flex align-items-center">
                    <div>
                      <span className="avatar avatar-xs bg-success avatar-rounded">
                        W
                      </span>
                    </div>
                    <div className="ms-2">Washington D.C</div>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <div className={`${isHidden[4] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ListGroup defaultActiveKey="first">
                <ListGroup.Item action href="#first" active>
                  <div className="d-flex align-items-center">
                    <div>
                      <span className="avatar avatar-xs bg-white text-default avatar-rounded">
                        C
                      </span>
                    </div>
                    <div className="ms-2">California</div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item action href="#second">
                  <div className="d-flex align-items-center">
                    <div>
                      <span className="avatar avatar-xs bg-secondary avatar-rounded">
                        N
                      </span>
                    </div>
                    <div className="ms-2">New Jersey</div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item action href="#third">
                  <div className="d-flex align-items-center">
                    <div>
                      <span className="avatar avatar-xs bg-info avatar-rounded">
                        L
                      </span>
                    </div>
                    <div className="ms-2">Los Angeles</div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item action href="#fourth">
                  <div className="d-flex align-items-center">
                    <div>
                      <span className="avatar avatar-xs bg-warning avatar-rounded">
                        M
                      </span>
                    </div>
                    <div className="ms-2">Miami Florida</div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item action href="#fifth" disabled>
                  <div className="d-flex align-items-center">
                    <div>
                      <span className="avatar avatar-xs bg-success avatar-rounded">
                        W
                      </span>
                    </div>
                    <div className="ms-2">Washington D.C</div>
                  </div>
                </ListGroup.Item>
              </ListGroup>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                buttons
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(5)}>Show Code<i className={`${isHidden[5] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[5] ? 'd-none' : ''}`}>
              <ListGroup defaultActiveKey='first'>
                <ListGroup.Item active action href="#first" type='button'>Simply dummy text of the printing<Badge bg='primary' className="float-end">243</Badge></ListGroup.Item>
                <ListGroup.Item action href="#second" type='button'>There are many variations of passages<Badge bg='secondary-transparent' className="float-end">35</Badge></ListGroup.Item>
                <ListGroup.Item action href="#third" type='button'>All the Lorem Ipsum generators<Badge bg='info-transparent' className="float-end">132</Badge></ListGroup.Item>
                <ListGroup.Item action href="#fourth" type='button'>All the Lorem Ipsum generators<Badge bg='success-transparent' className="float-end">2525</Badge></ListGroup.Item>
                <ListGroup.Item disabled action href="#fifth" type='button'>A disabled item meant to be disabled<Badge bg='danger-transparent' className="float-end">21</Badge></ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <div className={`${isHidden[5] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ListGroup defaultActiveKey='first'>
        <ListGroup.Item active action href="#first" type='button'>Simply dummy text of the printing<Badge bg='primary' className="float-end">243</Badge></ListGroup.Item>
        <ListGroup.Item action href="#second" type='button'>There are many variations of passages<Badge bg='secondary-transparent' className="float-end">35</Badge></ListGroup.Item>
        <ListGroup.Item action href="#third" type='button'>All the Lorem Ipsum generators<Badge bg='info-transparent' className="float-end">132</Badge></ListGroup.Item>
        <ListGroup.Item action href="#fourth" type='button'>All the Lorem Ipsum generators<Badge bg='success-transparent' className="float-end">2525</Badge></ListGroup.Item>
        <ListGroup.Item disabled action href="#fifth" type='button'>A disabled item meant to be disabled<Badge bg='danger-transparent' className="float-end">21</Badge></ListGroup.Item>
      </ListGroup>
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
                Contextual classes
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(6)}>Show Code<i className={`${isHidden[6] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[6] ? 'd-none' : ''}`}>
              <ListGroup>
                <ListGroup.Item>A simple default list group item</ListGroup.Item>
                <ListGroup.Item variant="primary">A simple primary list group item</ListGroup.Item>
                <ListGroup.Item variant="secondary">A simple secondary list group item</ListGroup.Item>
                <ListGroup.Item variant="success">A simple success list group item</ListGroup.Item>
                <ListGroup.Item variant="danger">A simple danger list group item</ListGroup.Item>
                <ListGroup.Item variant="warning">A simple warning list group item</ListGroup.Item>
                <ListGroup.Item variant="info">A simple info list group item</ListGroup.Item>
                <ListGroup.Item variant="light">A simple light list group item</ListGroup.Item>
                <ListGroup.Item variant="dark">A simple dark list group item</ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <div className={`${isHidden[6] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ListGroup>
                <ListGroup.Item>A simple default list group item</ListGroup.Item>
                <ListGroup.Item variant="primary">A simple primary list group item</ListGroup.Item>
                <ListGroup.Item variant="secondary">A simple secondary list group item</ListGroup.Item>
                <ListGroup.Item variant="success">A simple success list group item</ListGroup.Item>
                <ListGroup.Item variant="danger">A simple danger list group item</ListGroup.Item>
                <ListGroup.Item variant="warning">A simple warning list group item</ListGroup.Item>
                <ListGroup.Item variant="info">A simple info list group item</ListGroup.Item>
                <ListGroup.Item variant="light">A simple light list group item</ListGroup.Item>
                <ListGroup.Item variant="dark">A simple dark list group item</ListGroup.Item>
              </ListGroup>
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
                Contextual classes with hover styles
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(7)}>Show Code<i className={`${isHidden[7] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[7] ? 'd-none' : ''}`}>
              <ListGroup defaultActiveKey='first'>
                <ListGroup.Item action href='#first'>A simple default list group item</ListGroup.Item>
                <ListGroup.Item action href='#second' variant="primary">A simple primary list group item</ListGroup.Item>
                <ListGroup.Item action href='#third' variant="secondary">A simple secondary list group item</ListGroup.Item>
                <ListGroup.Item action href='#fourth' variant="success">A simple success list group item</ListGroup.Item>
                <ListGroup.Item action href='#fifth' variant="danger">A simple danger list group item</ListGroup.Item>
                <ListGroup.Item action href='#sixth' variant="warning">A simple warning list group item</ListGroup.Item>
                <ListGroup.Item action href='#seventh' variant="info">A simple info list group item</ListGroup.Item>
                <ListGroup.Item action href='#eighth' variant="light">A simple light list group item</ListGroup.Item>
                <ListGroup.Item action href='#ninth' variant="dark">A simple dark list group item</ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <div className={`${isHidden[7] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ListGroup defaultActiveKey='first'>
                <ListGroup.Item action href='#first'>A simple default list group item</ListGroup.Item>
                <ListGroup.Item action href='#second' variant="primary">A simple primary list group item</ListGroup.Item>
                <ListGroup.Item action href='#third' variant="secondary">A simple secondary list group item</ListGroup.Item>
                <ListGroup.Item action href='#fourth' variant="success">A simple success list group item</ListGroup.Item>
                <ListGroup.Item action href='#fifth' variant="danger">A simple danger list group item</ListGroup.Item>
                <ListGroup.Item action href='#sixth' variant="warning">A simple warning list group item</ListGroup.Item>
                <ListGroup.Item action href='#seventh' variant="info">A simple info list group item</ListGroup.Item>
                <ListGroup.Item action href='#eighth' variant="light">A simple light list group item</ListGroup.Item>
                <ListGroup.Item action href='#ninth' variant="dark">A simple dark list group item</ListGroup.Item>
              </ListGroup>
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
                Solid Colored Lists
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(8)}>Show Code<i className={`${isHidden[8] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[8] ? 'd-none' : ''}`}>
              <ListGroup>
                <ListGroup.Item>A simple default list group item</ListGroup.Item>
                <ListGroup.Item className="list-item-solid-primary">A simple primary list group item</ListGroup.Item>
                <ListGroup.Item className="list-item-solid-secondary">A simple secondary list group item</ListGroup.Item>
                <ListGroup.Item className="list-item-solid-success">A simple success list group item</ListGroup.Item>
                <ListGroup.Item className="list-item-solid-danger">A simple danger list group item</ListGroup.Item>
                <ListGroup.Item className="list-item-solid-warning">A simple warning list group item</ListGroup.Item>
                <ListGroup.Item className="list-item-solid-info">A simple info list group item</ListGroup.Item>
                <ListGroup.Item className="list-item-solid-light">A simple light list group item</ListGroup.Item>
                <ListGroup.Item className="list-item-solid-dark text-white">A simple dark list group item</ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <div className={`${isHidden[8] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ListGroup>
                <ListGroup.Item>A simple default list group item</ListGroup.Item>
                <ListGroup.Item className="list-item-solid-primary">A simple primary list group item</ListGroup.Item>
                <ListGroup.Item className="list-item-solid-secondary">A simple secondary list group item</ListGroup.Item>
                <ListGroup.Item className="list-item-solid-success">A simple success list group item</ListGroup.Item>
                <ListGroup.Item className="list-item-solid-danger">A simple danger list group item</ListGroup.Item>
                <ListGroup.Item className="list-item-solid-warning">A simple warning list group item</ListGroup.Item>
                <ListGroup.Item className="list-item-solid-info">A simple info list group item</ListGroup.Item>
                <ListGroup.Item className="list-item-solid-light">A simple light list group item</ListGroup.Item>
                <ListGroup.Item className="list-item-solid-dark text-white">A simple dark list group item</ListGroup.Item>
              </ListGroup>
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
                Custom content
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(9)}>Show Code<i className={`${isHidden[9] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[9] ? 'd-none' : ''}`}>
              <ListGroup defaultActiveKey='first'>
                <ListGroup.Item action href='#first' active>
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1 fw-semibold">Web page editors now use Lorem Ipsum?</h6>
                    <small>3 days ago</small>
                  </div>
                  <p className="mb-1">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.</p>
                  <small>24,Nov 2022.</small>
                </ListGroup.Item>
                <ListGroup.Item action href='#second'>
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1 fw-semibold">Richard McClintock, a Latin professor?</h6>
                    <small className="text-muted">4 hrs ago</small>
                  </div>
                  <p className="mb-1">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature.</p>
                  <small className="text-muted">30,Nov 2022.</small>
                </ListGroup.Item>
                <ListGroup.Item action href='#third'>
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1 fw-semibold">It uses a dictionary of over 200 Latin words?</h6>
                    <small className="text-muted">15 hrs ago</small>
                  </div>
                  <p className="mb-1">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
                  <small className="text-muted">4,Nov 2022.</small>
                </ListGroup.Item>
                <ListGroup.Item action href='#fourth'>
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1 fw-semibold">The standard Lorem Ipsum used since the 1500s?</h6>
                    <small className="text-muted">45 mins ago</small>
                  </div>
                  <p className="mb-1">All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.</p>
                  <small className="text-muted">28,Oct 2022.</small>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <div className={`${isHidden[9] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ListGroup defaultActiveKey='first'>
        <ListGroup.Item action href='#first' active>
          <div className="d-flex w-100 justify-content-between">
            <h6 className="mb-1 fw-semibold">Web page editors now use Lorem Ipsum?</h6>
            <small>3 days ago</small>
          </div>
          <p className="mb-1">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.</p>
          <small>24,Nov 2022.</small>
        </ListGroup.Item>
        <ListGroup.Item action href='#second'>
          <div className="d-flex w-100 justify-content-between">
            <h6 className="mb-1 fw-semibold">Richard McClintock, a Latin professor?</h6>
            <small className="text-muted">4 hrs ago</small>
          </div>
          <p className="mb-1">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature.</p>
          <small className="text-muted">30,Nov 2022.</small>
        </ListGroup.Item>
        <ListGroup.Item action href='#third'>
          <div className="d-flex w-100 justify-content-between">
            <h6 className="mb-1 fw-semibold">It uses a dictionary of over 200 Latin words?</h6>
            <small className="text-muted">15 hrs ago</small>
          </div>
          <p className="mb-1">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
          <small className="text-muted">4,Nov 2022.</small>
        </ListGroup.Item>
        <ListGroup.Item action href='#fourth'>
          <div className="d-flex w-100 justify-content-between">
            <h6 className="mb-1 fw-semibold">The standard Lorem Ipsum used since the 1500s?</h6>
            <small className="text-muted">45 mins ago</small>
          </div>
          <p className="mb-1">All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.</p>
          <small className="text-muted">28,Oct 2022.</small>
        </ListGroup.Item>
      </ListGroup>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="row-sm">
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Sub headings
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(10)}>Show Code<i className={`${isHidden[10] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[10] ? 'd-none' : ''}`}>
              <ListGroup as='ol' className="list-group-numbered">
                <ListGroup.Item as='li' className="d-flex justify-content-between align-items-start">
                  <div className="ms-2 me-auto text-muted">
                    <div className="fw-semibold fs-14 text-default">What Happened?</div>
                    Many experts have recently suggested may exist.
                  </div>
                  <Badge bg='primary-transparent'>32 Views</Badge>
                </ListGroup.Item>
                <ListGroup.Item as='li' className="d-flex justify-content-between align-items-start">
                  <div className="ms-2 me-auto text-muted">
                    <div className="fw-semibold fs-14 text-default">It Was Amazing!</div>
                    His idea involved taking red.
                  </div>
                  <Badge bg='secondary-transparent'>52 Views</Badge>
                </ListGroup.Item>
                <ListGroup.Item as='li' className="d-flex justify-content-between align-items-start">
                  <div className="ms-2 me-auto text-muted">
                    <div className="fw-semibold fs-14 text-default">News Is A Great Weapon.</div>
                    News can influence in many ways.
                  </div>
                  <Badge bg='success-transparent'>1,204 Views</Badge>
                </ListGroup.Item>
                <ListGroup.Item as='li' className="d-flex justify-content-between align-items-start">
                  <div className="ms-2 me-auto text-muted">
                    <div className="fw-semibold fs-14 text-default">majority have suffered.</div>
                    If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything.
                  </div>
                  <Badge bg='danger-transparent'>14 Views</Badge>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <div className={`${isHidden[10] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ListGroup as='ol' className="list-group-numbered">
        <ListGroup.Item as='li' className="d-flex justify-content-between align-items-start">
          <div className="ms-2 me-auto text-muted">
            <div className="fw-semibold fs-14 text-default">What Happened?</div>
            Many experts have recently suggested may exist.
          </div>
          <Badge bg='primary-transparent'>32 Views</Badge>
        </ListGroup.Item>
        <ListGroup.Item as='li' className="d-flex justify-content-between align-items-start">
          <div className="ms-2 me-auto text-muted">
            <div className="fw-semibold fs-14 text-default">It Was Amazing!</div>
            His idea involved taking red.
          </div>
          <Badge bg='secondary-transparent'>52 Views</Badge>
        </ListGroup.Item>
        <ListGroup.Item as='li' className="d-flex justify-content-between align-items-start">
          <div className="ms-2 me-auto text-muted">
            <div className="fw-semibold fs-14 text-default">News Is A Great Weapon.</div>
            News can influence in many ways.
          </div>
          <Badge bg='success-transparent'>1,204 Views</Badge>
        </ListGroup.Item>
        <ListGroup.Item as='li' className="d-flex justify-content-between align-items-start">
          <div className="ms-2 me-auto text-muted">
            <div className="fw-semibold fs-14 text-default">majority have suffered.</div>
            If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything.
          </div>
          <Badge bg='danger-transparent'>14 Views</Badge>
        </ListGroup.Item>
      </ListGroup>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Numbered Lists
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(11)}>Show Code<i className={`${isHidden[11] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[11] ? 'd-none' : ''}`}>
              <ListGroup as='ol' className="list-group-numbered">
                <ListGroup.Item as='li'>Simply dummy text of the printing.</ListGroup.Item>
                <ListGroup.Item as='li'>There are many variations of passages.</ListGroup.Item>
                <ListGroup.Item as='li'>All the Lorem Ipsum generators.</ListGroup.Item>
                <ListGroup.Item as='li'>Written in 45 BC. This book is a treatise on the theory.</ListGroup.Item>
                <ListGroup.Item as='li'>Randomised words which don't look.</ListGroup.Item>
                <ListGroup.Item as='li'>Always free from repetition, injected humour.</ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <div className={`${isHidden[11] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ListGroup as='ol' className="list-group-numbered">
                <ListGroup.Item as='li'>Simply dummy text of the printing.</ListGroup.Item>
                <ListGroup.Item as='li'>There are many variations of passages.</ListGroup.Item>
                <ListGroup.Item as='li'>All the Lorem Ipsum generators.</ListGroup.Item>
                <ListGroup.Item as='li'>Written in 45 BC. This book is a treatise on the theory.</ListGroup.Item>
                <ListGroup.Item as='li'>Randomised words which don't look.</ListGroup.Item>
                <ListGroup.Item as='li'>Always free from repetition, injected humour.</ListGroup.Item>
              </ListGroup>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                List With Checkboxes
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(12)}>Show Code<i className={`${isHidden[12] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[12] ? 'd-none' : ''}`}>
              <ListGroup>
                <ListGroup.Item className="d-flex"> <Form.Check type="checkbox" id="custom-switch" className="me-2 fw-semibold" defaultChecked /> Accurate information at any given point. </ListGroup.Item>
                <ListGroup.Item className="d-flex"> <Form.Check type="checkbox" id="custom-switch" className="me-2 fw-semibold" /> Hearing the information and responding. </ListGroup.Item>
                <ListGroup.Item className="d-flex"> <Form.Check type="checkbox" id="custom-switch" className="me-2 fw-semibold" defaultChecked /> Setting up and customizing your own sales. </ListGroup.Item>
                <ListGroup.Item className="d-flex"> <Form.Check type="checkbox" id="custom-switch" className="me-2 fw-semibold" defaultChecked /> New Admin Launched. </ListGroup.Item>
                <ListGroup.Item className="d-flex"> <Form.Check type="checkbox" id="custom-switch" className="me-2 fw-semibold" /> To maximize profits and improve productivity. </ListGroup.Item>
                <ListGroup.Item className="d-flex"> <Form.Check type="checkbox" id="custom-switch" className="me-2 fw-semibold" /> To have a complete 360° overview of sales information, having. </ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <div className={`${isHidden[13] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ListGroup>
                <ListGroup.Item className="d-flex"> <Form.Check type="checkbox" id="custom-switch" className="me-2 fw-semibold" defaultChecked /> Accurate information at any given point. </ListGroup.Item>
                <ListGroup.Item className="d-flex"> <Form.Check type="checkbox" id="custom-switch" className="me-2 fw-semibold" /> Hearing the information and responding. </ListGroup.Item>
                <ListGroup.Item className="d-flex"> <Form.Check type="checkbox" id="custom-switch" className="me-2 fw-semibold" defaultChecked /> Setting up and customizing your own sales. </ListGroup.Item>
                <ListGroup.Item className="d-flex"> <Form.Check type="checkbox" id="custom-switch" className="me-2 fw-semibold" defaultChecked /> New Admin Launched. </ListGroup.Item>
                <ListGroup.Item className="d-flex"> <Form.Check type="checkbox" id="custom-switch" className="me-2 fw-semibold" /> To maximize profits and improve productivity. </ListGroup.Item>
                <ListGroup.Item className="d-flex"> <Form.Check type="checkbox" id="custom-switch" className="me-2 fw-semibold" /> To have a complete 360° overview of sales information, having. </ListGroup.Item>
              </ListGroup>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                List With Radios
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(14)}>Show Code<i className={`${isHidden[14] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[14] ? 'd-none' : ''}`}>
              <ListGroup>
                {items.map((item, index) => (
                  <ListGroup.Item className="d-flex" key={index}>
                    <Form.Check
                      type="radio"
                      id={`custom-switch${index + 1}`}
                      name="radioGroup"
                      className="me-2 fw-semibold"
                      defaultChecked={index === 2}
                    />
                    {item}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
            <div className={`${isHidden[14] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ListGroup>
        {items.map((item, index) => (
          <ListGroup.Item className="d-flex" key={index}>
            <Form.Check
              type="radio"
              id={\`custom-switch\${index + 1}\`}
              name="radioGroup"
              className="me-2 fw-semibold"
              defaultChecked={index === 2}
            />
            {item}
          </ListGroup.Item>
        ))}
      </ListGroup>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                List With badges
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(15)}>Show Code<i className={`${isHidden[15] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[15] ? 'd-none' : ''}`}>
              <ListGroup>
                <ListGroup.Item className="d-flex justify-content-between align-items-center fw-semibold">Grocies <Badge bg="primary">Available</Badge></ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center fw-semibold">Furniture <Badge bg="secondary">Buy</Badge></ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center fw-semibold">Beauty <Badge bg="danger" className="rounded-pill">32</Badge></ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center fw-semibold">Books <Badge bg="light" className="text-default">New</Badge></ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center fw-semibold">Toys <Badge bg="info-gradient">Hot</Badge></ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center fw-semibold">Mobiles <Badge bg="warning">Sold Out</Badge></ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <div className={`${isHidden[15] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ListGroup>
        <ListGroup.Item className="d-flex justify-content-between align-items-center fw-semibold">Grocies <Badge bg="primary">Available</Badge></ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between align-items-center fw-semibold">Furniture <Badge bg="secondary">Buy</Badge></ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between align-items-center fw-semibold">Beauty <Badge bg="danger" className="rounded-pill">32</Badge></ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between align-items-center fw-semibold">Books <Badge bg="light" className="text-default">New</Badge></ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between align-items-center fw-semibold">Toys <Badge bg="info-gradient">Hot</Badge></ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between align-items-center fw-semibold">Mobiles <Badge bg="warning">Sold Out</Badge></ListGroup.Item>
      </ListGroup>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className="card-title">
                Horizontal
              </div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(16)}>Show Code<i className={`${isHidden[16] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[16] ? 'd-none' : ''}`}>
              <ListGroup className="my-2" horizontal>
                <ListGroup.Item>An item</ListGroup.Item>
                <ListGroup.Item>A second item</ListGroup.Item>
                <ListGroup.Item>A third item</ListGroup.Item>
              </ListGroup>
              <ListGroup className="my-2 list-group-horizontal-sm">
                <ListGroup.Item>An item</ListGroup.Item>
                <ListGroup.Item>A second item</ListGroup.Item>
                <ListGroup.Item>A third item</ListGroup.Item>
              </ListGroup>
              <ListGroup className="my-2 list-group-horizontal-md">
                <ListGroup.Item>An item</ListGroup.Item>
                <ListGroup.Item>A second item</ListGroup.Item>
                <ListGroup.Item>A third item</ListGroup.Item>
              </ListGroup>
              <ListGroup className="my-2 list-group-horizontal-lg">
                <ListGroup.Item>An item</ListGroup.Item>
                <ListGroup.Item>A second item</ListGroup.Item>
                <ListGroup.Item>A third item</ListGroup.Item>
              </ListGroup>
              <ListGroup className="my-2 list-group-horizontal-xl">
                <ListGroup.Item>An item</ListGroup.Item>
                <ListGroup.Item>A second item</ListGroup.Item>
                <ListGroup.Item>A third item</ListGroup.Item>
              </ListGroup>
              <ListGroup className="my-2 list-group-horizontal-xxl">
                <ListGroup.Item>An item</ListGroup.Item>
                <ListGroup.Item>A second item</ListGroup.Item>
                <ListGroup.Item>A third item</ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <div className={`${isHidden[16] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <ListGroup className="my-2" horizontal>
        <ListGroup.Item>An item</ListGroup.Item>
        <ListGroup.Item>A second item</ListGroup.Item>
        <ListGroup.Item>A third item</ListGroup.Item>
      </ListGroup>
      <ListGroup className="my-2 list-group-horizontal-sm">
        <ListGroup.Item>An item</ListGroup.Item>
        <ListGroup.Item>A second item</ListGroup.Item>
        <ListGroup.Item>A third item</ListGroup.Item>
      </ListGroup>
      <ListGroup className="my-2 list-group-horizontal-md">
        <ListGroup.Item>An item</ListGroup.Item>
        <ListGroup.Item>A second item</ListGroup.Item>
        <ListGroup.Item>A third item</ListGroup.Item>
      </ListGroup>
      <ListGroup className="my-2 list-group-horizontal-lg">
        <ListGroup.Item>An item</ListGroup.Item>
        <ListGroup.Item>A second item</ListGroup.Item>
        <ListGroup.Item>A third item</ListGroup.Item>
      </ListGroup>
      <ListGroup className="my-2 list-group-horizontal-xl">
        <ListGroup.Item>An item</ListGroup.Item>
        <ListGroup.Item>A second item</ListGroup.Item>
        <ListGroup.Item>A third item</ListGroup.Item>
      </ListGroup>
      <ListGroup className="my-2 list-group-horizontal-xxl">
        <ListGroup.Item>An item</ListGroup.Item>
        <ListGroup.Item>A second item</ListGroup.Item>
        <ListGroup.Item>A third item</ListGroup.Item>
      </ListGroup>
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

export default ListGroups;
