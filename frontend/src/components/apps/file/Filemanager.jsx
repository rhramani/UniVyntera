import { Fragment, useState } from "react";
import { Card, Col, Dropdown, Nav, Row, Button, Modal, Pagination, } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import Pageheader from "../../../layouts/Pageheader";
import ALLImages from "../../../common/Imagedata";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

const FileManager = () => {
  const [files, setFiles] = useState([])
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  return (

    <Fragment>
      <Pageheader mainheading='File-Manager' parentfolder='File-Manager' activepage='File-Manager' />

      <div className="row row-sm">
        <div className="col-lg-4 col-xxl-3">
          <Card className="custom-card">
            <div className="d-grid p-4 border-bottom">
              <Button className="btn ripple btn-primary btn-block" onClick={handleShow} > Add New File </Button>
            </div>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title as="h6">Add File</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <FilePond files={files} onupdatefiles={setFiles} allowMultiple={true} maxFiles={3} server="/api" name="files"
                  labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>' />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}> Add </Button>
                <Button variant="primary" onClick={handleClose}> Cancel </Button>
              </Modal.Footer>
            </Modal>
            <Card.Body className="tab-list-items py-3">
              <div className="main-content-left main-content-left-mail">
                <div className="main-mail-menu">
                  <Nav className="main-nav-column mg-b-20" defaultActiveKey="/" activeKey="/home" >
                    <Nav.Item>
                      <Nav.Link className="active"> <i className="fe fe-video"></i> Video <span>30 MB</span> </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link> <i className="fe fe-image"></i> Images{" "} <span>21 MB</span> </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link> <i className="fe fe-music"></i> Music <span>14 MB</span> </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link> <i className="fe fe-download"></i>Download <span>8 MB</span> </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link> <i className="fe fe-file-text"></i> Docs <span>16 MB</span> </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="me-2">
                      <Nav.Link> <i className="fe fe-grid"></i> More <span>19 MB</span> </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
               
              </div>
            </Card.Body>
            <Card.Body className=" py-3">
              <div className="">
                <div className="main-mail-menu">
                  <label className="main-content-label main-content-label-sm"> Label </label>
                  <Nav className="nav main-nav-column">
                    <Nav.Item>
                      <Nav.Link className="nav-link"> <i className="fe fe-folder fe fe-folder fs-10 bg-primary p-2 br-5"></i> Social </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link className="nav-link"> <i className="fe fe-folder fe fe-folder fs-10 bg-info p-2 br-5 text-fixed-white"></i> Promotions </Nav.Link>
                    </Nav.Item>

                    <Nav.Item>
                      <Nav.Link className="nav-link"> <i className="fe fe-folder fe fe-folder fs-10 bg-success p-2 br-5"></i> Updates </Nav.Link>
                    </Nav.Item>

                    <Nav.Item>
                      <Nav.Link className="nav-link"> <i className="fe fe-folder fe fe-folder fs-10 bg-danger p-2 br-5"></i> Settings</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link className="nav-link"> <i className="fe fe-folder fe fe-folder fs-10 bg-secondary p-2 br-5"></i> Google Drive </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <Col lg={8} xxl={9}>
          <div className="text-dark mb-2 ms-1 fs-20 fw-medium"> All Folders </div>

          <div className="text-muted mb-2 fs-16">Recent Files</div>
          <Row>
            <Col xl={4} xxl={3} lg={6} md={6}>
              <Card className="custom-card">
                <Card.Body>
                  <div className="d-flex">
                    <div className="media align-items-center position-relative">
                      <span className="fs-16 lh--7 my-auto"><i className="bg-primary-transparent p-2 rounded-50 fe fe-image fs-18 me-2"></i></span>
                      <div className="media-body ms-3">
                        Image
                        <p className="fs-11 mg-b-0 text-gray-5">Last Opened 32 mins ago</p>
                      </div>
                    </div>
                    <Dropdown className="float-end ms-auto position-absolute r-5 t-15 ">
                      <Dropdown.Toggle as='a' className="no-caret  option-dots" variant="" id="dropdown-basic"><i className="fe fe-more-vertical"></i></Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1"><i className="fe fe-edit me-2"></i>open</Dropdown.Item>
                        <Dropdown.Item href="#/action-2"><i className="fe fe-download me-2"></i> Download</Dropdown.Item>
                        <Dropdown.Item href="#/action-3"><i className="fe fe-share me-2"></i> Share</Dropdown.Item>
                        <Dropdown.Item href="#/action-3"><i className="fe fe-trash me-2"></i> Delete</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={4} xxl={3} lg={6} md={6}>
              <Card className="custom-card">
                <Card.Body>
                  <div className="d-flex">
                    <div className="media align-items-center position-relative">
                      <span className="fs-16 lh--7 my-auto"><i className="bg-primary-transparent p-2 rounded-50 fe fe fe-smartphone fs-18 me-2"></i></span>
                      <div className="media-body ms-3">
                        APK
                        <p className="fs-11 mg-b-0 text-gray-5">Last Opened 1 hrs ago</p>
                      </div>
                    </div>
                    <Dropdown className="float-end ms-auto position-absolute r-5 t-15 ">
                      <Dropdown.Toggle as='a' className="no-caret  option-dots" variant="" id="dropdown-basic"><i className="fe fe-more-vertical"></i></Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1"><i className="fe fe-edit me-2"></i>open</Dropdown.Item>
                        <Dropdown.Item href="#/action-2"><i className="fe fe-download me-2"></i> Download</Dropdown.Item>
                        <Dropdown.Item href="#/action-3"><i className="fe fe-share me-2"></i> Share</Dropdown.Item>
                        <Dropdown.Item href="#/action-3"><i className="fe fe-trash me-2"></i> Delete</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={4} xxl={3} lg={6} md={6}>
              <Card className="custom-card">
                <Card.Body>
                  <div className="d-flex">
                    <div className="media align-items-center position-relative">
                      <span className="fs-16 lh--7 my-auto"><i className="bg-primary-transparent p-2 rounded-50 fe fe-video fs-18 me-2"></i></span>
                      <div className="media-body ms-3">
                        Video
                        <p className="fs-11 mg-b-0 text-gray-5">Last Opened 28 min ago</p>
                      </div>
                    </div>
                    <Dropdown className="float-end ms-auto position-absolute r-5 t-15 ">
                      <Dropdown.Toggle as='a' className="no-caret  option-dots" variant="" id="dropdown-basic"><i className="fe fe-more-vertical"></i></Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1"><i className="fe fe-edit me-2"></i>open</Dropdown.Item>
                        <Dropdown.Item href="#/action-2"><i className="fe fe-download me-2"></i> Download</Dropdown.Item>
                        <Dropdown.Item href="#/action-3"><i className="fe fe-share me-2"></i> Share</Dropdown.Item>
                        <Dropdown.Item href="#/action-3"><i className="fe fe-trash me-2"></i> Delete</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={4} xxl={3} lg={6} md={6}>
              <Card className="custom-card">
                <Card.Body>
                  <div className="d-flex">
                    <div className="media align-items-center position-relative">
                      <span className="fs-16 lh--7 my-auto"><i className="bg-primary-transparent p-2 rounded-50 fe fe-file-text  fs-18 me-2"></i></span>
                      <div className="media-body ms-3">
                        Documents
                        <p className="fs-11 mg-b-0 text-gray-5">Last Opened 1 hrs ago</p>
                      </div>
                    </div>
                    <Dropdown className="float-end ms-auto position-absolute r-5 t-15 ">
                      <Dropdown.Toggle as='a' className="no-caret  option-dots" variant="" id="dropdown-basic"><i className="fe fe-more-vertical"></i></Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1"><i className="fe fe-edit me-2"></i>open</Dropdown.Item>
                        <Dropdown.Item href="#/action-2"><i className="fe fe-download me-2"></i> Download</Dropdown.Item>
                        <Dropdown.Item href="#/action-3"><i className="fe fe-share me-2"></i> Share</Dropdown.Item>
                        <Dropdown.Item href="#/action-3"><i className="fe fe-trash me-2"></i> Delete</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={4} xxl={3} lg={6} md={6}>
              <Card className="custom-card">
                <Card.Body>
                  <div className="d-flex">
                    <div className="media align-items-center position-relative">
                      <span className="fs-16 lh--7 my-auto"><i className="bg-primary-transparent p-2 rounded-50 fe fe-music  fs-18 me-2"></i></span>
                      <div className="media-body ms-3">
                        Music
                        <p className="fs-11 mg-b-0 text-gray-5">Last Opened 2 hrs ago</p>
                      </div>
                    </div>
                    <Dropdown className="float-end ms-auto position-absolute r-5 t-15 ">
                      <Dropdown.Toggle as='a' className="no-caret  option-dots" variant="" id="dropdown-basic"><i className="fe fe-more-vertical"></i></Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1"><i className="fe fe-edit me-2"></i>open</Dropdown.Item>
                        <Dropdown.Item href="#/action-2"><i className="fe fe-download me-2"></i> Download</Dropdown.Item>
                        <Dropdown.Item href="#/action-3"><i className="fe fe-share me-2"></i> Share</Dropdown.Item>
                        <Dropdown.Item href="#/action-3"><i className="fe fe-trash me-2"></i> Delete</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={4} xxl={3} lg={6} md={6}>
              <Card className="custom-card">
                <Card.Body>
                  <div className="d-flex">
                    <div className="media align-items-center position-relative">
                      <span className="fs-16 lh--7 my-auto"><i className="bg-primary-transparent p-2 rounded-50 fe fe-file-text  fs-18 me-2"></i></span>
                      <div className="media-body ms-3">
                        PDF
                        <p className="fs-11 mg-b-0 text-gray-5">Last Opened 1 hrs ago</p>
                      </div>
                    </div>
                    <Dropdown className="float-end ms-auto position-absolute r-5 t-15 ">
                      <Dropdown.Toggle as='a' className="no-caret  option-dots" variant="" id="dropdown-basic"><i className="fe fe-more-vertical"></i></Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1"><i className="fe fe-edit me-2"></i>open</Dropdown.Item>
                        <Dropdown.Item href="#/action-2"><i className="fe fe-download me-2"></i> Download</Dropdown.Item>
                        <Dropdown.Item href="#/action-3"><i className="fe fe-share me-2"></i> Share</Dropdown.Item>
                        <Dropdown.Item href="#/action-3"><i className="fe fe-trash me-2"></i> Delete</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={4} xxl={3} lg={6} md={6}>
              <Card className="custom-card">
                <Card.Body>
                  <div className="d-flex">
                    <div className="media align-items-center position-relative">
                      <span className="fs-16 lh--7 my-auto"><i className="bg-primary-transparent p-2 rounded-50 fe fe-image fs-18 me-2"></i></span>
                      <div className="media-body ms-3">
                        Image
                        <p className="fs-11 mg-b-0 text-gray-5">Last Opened 32 mins ago</p>
                      </div>
                    </div>
                    <Dropdown className="float-end ms-auto position-absolute r-5 t-15 ">
                      <Dropdown.Toggle as='a' className="no-caret  option-dots" variant="" id="dropdown-basic"><i className="fe fe-more-vertical"></i></Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1"><i className="fe fe-edit me-2"></i>open</Dropdown.Item>
                        <Dropdown.Item href="#/action-2"><i className="fe fe-download me-2"></i> Download</Dropdown.Item>
                        <Dropdown.Item href="#/action-3"><i className="fe fe-share me-2"></i> Share</Dropdown.Item>
                        <Dropdown.Item href="#/action-3"><i className="fe fe-trash me-2"></i> Delete</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={4} xxl={3} lg={6} md={6}>
              <Card className="custom-card">
                <Card.Body>
                  <div className="d-flex">
                    <div className="media align-items-center position-relative">
                      <span className="fs-16 lh--7 my-auto"><i className="bg-primary-transparent p-2 rounded-50 fe fe fe-smartphone fs-18 me-2"></i></span>
                      <div className="media-body ms-3">
                        APK
                        <p className="fs-11 mg-b-0 text-gray-5">Last Opened 1 hrs ago</p>
                      </div>
                    </div>
                    <Dropdown className="float-end ms-auto position-absolute r-5 t-15 ">
                      <Dropdown.Toggle as='a' className="no-caret  option-dots" variant="" id="dropdown-basic"><i className="fe fe-more-vertical"></i></Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1"><i className="fe fe-edit me-2"></i>open</Dropdown.Item>
                        <Dropdown.Item href="#/action-2"><i className="fe fe-download me-2"></i> Download</Dropdown.Item>
                        <Dropdown.Item href="#/action-3"><i className="fe fe-share me-2"></i> Share</Dropdown.Item>
                        <Dropdown.Item href="#/action-3"><i className="fe fe-trash me-2"></i> Delete</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="text-muted mb-2 fs-16">Folders and Files</div>
          <Row>
            <Col xl={3} md={4} sm={6}>
              <Card className="custom-card border p-0 shadow-none">
                <div className="d-flex align-items-center px-4 pt-2">
                  <label className="form-check">
                    <input className="form-check-input" type="checkbox" id="example-checkbox1" value="option1" />
                    <span className="custom-control-label"></span>
                  </label>
                  <Dropdown className="float-end ms-auto">
                    <Dropdown.Toggle as='a' className="no-caret  option-dots" variant="" id="dropdown-basic"><i className="fe fe-more-vertical"></i></Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-1"><i className="fe fe-edit me-2"></i> Edit</Dropdown.Item>
                      <Dropdown.Item href="#/action-2"><i className="fe fe-share me-2"></i> Share</Dropdown.Item>
                      <Dropdown.Item href="#/action-3"><i className="fe fe-download me-2"></i> Download</Dropdown.Item>
                      <Dropdown.Item href="#/action-3"><i className="fe fe-trash me-2"></i> Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <Card.Body className=" pt-0 text-center">
                  <Link to={`${import.meta.env.BASE_URL}apps/file/filemanagerlist/`} className="open-file">
                    <div className="file-manger-icon">
                      <img src={ALLImages('filepng4')} alt="img" className="br-7" />
                    </div>
                    <h6 className="mb-1 fw-medium mt-0">videos</h6>
                    <span className="text-muted">4.23gb</span>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} md={4} sm={6}>
              <Card className="custom-card border p-0 shadow-none">
                <div className="d-flex align-items-center px-4 pt-2">
                  <label className="custom-control custom-checkbox">
                    <input className="form-check-input" type="checkbox" id="example-checkbox9" value="option9" />
                    <span className="custom-control-label"></span>
                  </label>
                  <Dropdown className="float-end ms-auto">
                    <Dropdown.Toggle as='a' className="no-caret  option-dots" variant="" id="dropdown-basic"><i className="fe fe-more-vertical"></i></Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-1"><i className="fe fe-edit me-2"></i> Edit</Dropdown.Item>
                      <Dropdown.Item href="#/action-2"><i className="fe fe-share me-2"></i> Share</Dropdown.Item>
                      <Dropdown.Item href="#/action-3"><i className="fe fe-download me-2"></i> Download</Dropdown.Item>
                      <Dropdown.Item href="#/action-3"><i className="fe fe-trash me-2"></i> Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <Card.Body className=" pt-0 text-center">
                  <Link to="#" className="open-file">
                    <div className="file-manger-icon">
                      <img src={ALLImages('filepng6')} alt="img" className="br-7" />
                    </div>
                    <h6 className="mb-1 fw-medium mt-0">document.pdf</h6>
                    <span className="text-muted">23kb</span>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} md={4} sm={6}>
              <Card className="custom-card border p-0 shadow-none">
                <div className="d-flex align-items-center px-4 pt-2">
                  <label className="custom-control custom-checkbox">
                    <input className="form-check-input" type="checkbox" id="example-checkbox3" value="option3" />
                    <span className="custom-control-label"></span>
                  </label>
                  <Dropdown className="float-end ms-auto">
                    <Dropdown.Toggle as='a' className="no-caret  option-dots" variant="" id="dropdown-basic"><i className="fe fe-more-vertical"></i></Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-1"><i className="fe fe-edit me-2"></i> Edit</Dropdown.Item>
                      <Dropdown.Item href="#/action-2"><i className="fe fe-share me-2"></i> Share</Dropdown.Item>
                      <Dropdown.Item href="#/action-3"><i className="fe fe-download me-2"></i> Download</Dropdown.Item>
                      <Dropdown.Item href="#/action-3"><i className="fe fe-trash me-2"></i> Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <Card.Body className=" pt-0 text-center">
                  <Link to="#" className="open-file">
                    <div className="file-manger-icon">
                      <img src={ALLImages('filepng5')} alt="img" className="rounded-10" />
                    </div>
                    <h6 className="mb-1 fw-medium mt-1">Images</h6>
                    <span className="text-muted">23kb</span></Link>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} md={4} sm={6}>
              <Card className="custom-card border p-0 shadow-none">
                <div className="d-flex align-items-center px-4 pt-2">
                  <label className="custom-control custom-checkbox">
                    <input className="form-check-input" type="checkbox" id="example-checkbox4" value="option4" />
                    <span className="custom-control-label"></span>
                  </label>
                  <Dropdown className="float-end ms-auto">
                    <Dropdown.Toggle as='a' className="no-caret  option-dots" variant="" id="dropdown-basic"><i className="fe fe-more-vertical"></i></Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-1"><i className="fe fe-edit me-2"></i> Edit</Dropdown.Item>
                      <Dropdown.Item href="#/action-2"><i className="fe fe-share me-2"></i> Share</Dropdown.Item>
                      <Dropdown.Item href="#/action-3"><i className="fe fe-download me-2"></i> Download</Dropdown.Item>
                      <Dropdown.Item href="#/action-3"><i className="fe fe-trash me-2"></i> Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <Card.Body className=" pt-0 text-center">
                  <Link to={`${import.meta.env.BASE_URL}apps/file/filemanagerlist/`} className="open-file">
                    <div className="file-manger-icon">
                      <img src={ALLImages('filepng4')} alt="img" className="br-7" />
                    </div>
                    <h6 className="mb-1 fw-medium mt-0">Images</h6>
                    <span className="text-muted">1.23gb</span></Link>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} md={4} sm={6}>
              <Card className="custom-card border p-0 shadow-none">
                <div className="d-flex align-items-center px-4 pt-2">
                  <label className="custom-control custom-checkbox">
                    <input className="form-check-input" type="checkbox" id="example-checkbox5" value="option5" />
                    <span className="custom-control-label"></span>
                  </label>
                  <Dropdown className="float-end ms-auto">
                    <Dropdown.Toggle as='a' className="no-caret  option-dots" variant="" id="dropdown-basic"><i className="fe fe-more-vertical"></i></Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-1"><i className="fe fe-edit me-2"></i> Edit</Dropdown.Item>
                      <Dropdown.Item href="#/action-2"><i className="fe fe-share me-2"></i> Share</Dropdown.Item>
                      <Dropdown.Item href="#/action-3"><i className="fe fe-download me-2"></i> Download</Dropdown.Item>
                      <Dropdown.Item href="#/action-3"><i className="fe fe-trash me-2"></i> Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <Card.Body className=" pt-0 text-center">
                  <Link to="#" className="open-file">
                    <div className="file-manger-icon">
                      <img src={ALLImages('filepng5')} alt="img" className="rounded-10" />
                    </div>
                    <h6 className="mb-1 fw-medium mt-1">Images</h6>
                    <span className="text-muted">23kb</span></Link>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} md={4} sm={6}>
              <Card className="custom-card border p-0 shadow-none">
                <div className="d-flex align-items-center px-4 pt-2">
                  <label className="custom-control custom-checkbox">
                    <input className="form-check-input" type="checkbox" id="example-checkbox6" value="option6" />
                    <span className="custom-control-label"></span>
                  </label>
                  <Dropdown className="float-end ms-auto">
                    <Dropdown.Toggle as='a' className="no-caret  option-dots" variant="" id="dropdown-basic"><i className="fe fe-more-vertical"></i></Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-1"><i className="fe fe-edit me-2"></i> Edit</Dropdown.Item>
                      <Dropdown.Item href="#/action-2"><i className="fe fe-share me-2"></i> Share</Dropdown.Item>
                      <Dropdown.Item href="#/action-3"><i className="fe fe-download me-2"></i> Download</Dropdown.Item>
                      <Dropdown.Item href="#/action-3"><i className="fe fe-trash me-2"></i> Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <Card.Body className=" pt-0 text-center">
                  <Link to="#" className="open-file">
                    <div className="file-manger-icon">
                      <img src={ALLImages('filepng2')} alt="img" className="br-7" />
                    </div>
                    <h6 className="mb-1 fw-medium mt-0">document.pdf</h6>
                    <span className="text-muted">23kb</span></Link>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} md={4} sm={6}>
              <Card className="custom-card border p-0 shadow-none">
                <div className="d-flex align-items-center px-4 pt-2">
                  <label className="custom-control custom-checkbox">
                    <input className="form-check-input" type="checkbox" id="example-checkbox7" value="option7" />
                    <span className="custom-control-label"></span>
                  </label>
                  <Dropdown className="float-end ms-auto">
                    <Dropdown.Toggle as='a' className="no-caret  option-dots" variant="" id="dropdown-basic"><i className="fe fe-more-vertical"></i></Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-1"><i className="fe fe-edit me-2"></i> Edit</Dropdown.Item>
                      <Dropdown.Item href="#/action-2"><i className="fe fe-share me-2"></i> Share</Dropdown.Item>
                      <Dropdown.Item href="#/action-3"><i className="fe fe-download me-2"></i> Download</Dropdown.Item>
                      <Dropdown.Item href="#/action-3"><i className="fe fe-trash me-2"></i> Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <Card.Body className=" pt-0 text-center">
                  <Link to={`${import.meta.env.BASE_URL}apps/file/filemanagerlist/`} className="open-file">
                    <div className="file-manger-icon">
                      <img src={ALLImages('filepng4')} alt="img" className="br-7" />
                    </div>
                    <h6 className="mb-1 fw-medium mt-0">Downloads</h6>
                    <span className="text-muted">453kb</span></Link>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={3} md={4} sm={6}>
              <Card className="custom-card border p-0 shadow-none">
                <div className="d-flex align-items-center px-4 pt-2">
                  <label className="custom-control custom-checkbox">
                    <input className="form-check-input" type="checkbox" id="example-checkbox8" value="option8" />
                    <span className="custom-control-label"></span>
                  </label>
                  <Dropdown className="float-end ms-auto">
                    <Dropdown.Toggle as='a' className="no-caret  option-dots" variant="" id="dropdown-basic"><i className="fe fe-more-vertical"></i></Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-1"><i className="fe fe-edit me-2"></i> Edit</Dropdown.Item>
                      <Dropdown.Item href="#/action-2"><i className="fe fe-share me-2"></i> Share</Dropdown.Item>
                      <Dropdown.Item href="#/action-3"><i className="fe fe-download me-2"></i> Download</Dropdown.Item>
                      <Dropdown.Item href="#/action-3"><i className="fe fe-trash me-2"></i> Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <Card.Body className=" pt-0 text-center">
                  <Link to="#" className="open-file">
                    <div className="file-manger-icon">
                      <img src={ALLImages('filepng6')} alt="img" className="br-7" />
                    </div>
                    <h6 className="mb-1 fw-medium mt-0">Word document</h6>
                    <span className="text-muted">23kb</span></Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Pagination className="justify-content-end">
            <Pagination.Item disabled>Prev</Pagination.Item>
            <Pagination.Item active>{1}</Pagination.Item>
            <Pagination.Item>{2}</Pagination.Item>
            <Pagination.Item>{3}</Pagination.Item>
            <Pagination.Item>{4}</Pagination.Item>
            <Pagination.Item>{5}</Pagination.Item>
            <Pagination.Item>Next</Pagination.Item>
          </Pagination>
        </Col>
      </div>
    </Fragment>
  );
};

export default FileManager;
