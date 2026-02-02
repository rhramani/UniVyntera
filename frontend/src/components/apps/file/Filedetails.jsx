import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Col, Row, Table } from "react-bootstrap";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Pageheader from "../../../layouts/Pageheader";
import ALLImages from "../../../common/Imagedata";

const Filedetails = () => {

  const [isRTL, _setIsRTL] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <Pageheader mainheading='File-Details' parentfolder='File-Manger' activepage='File-Details' />

      {/* <!-- Row --> */}
      <Row className=" row-sm">
        <Col xl={8} lg={12} md={12}>
          <Card className=" custom-card overflow-hidden">
            <Card.Body className=" px-4 pt-4">
              <Link to="#">
                <img src={ALLImages("blog15")} alt="img" className="rounded-3 w-100" />
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} lg={12} md={12}>
          <Card className=" custom-card">
            <Card.Body className=" card-body ">
              <h5 className="mb-3">File details :</h5>
              <div className="table">
                <Row>
                  <Col xl={12}>
                    <div className="table-responsive">
                      <Table className="table mb-0 border-top table-bordered text-nowrap">
                        <tbody>
                          <tr>
                            <th scope="row">File-name</th>
                            <td>image.jpg</td>
                          </tr>
                          <tr>
                            <th scope="row">File-size</th>
                            <td>12.45mb</td>
                          </tr>
                          <tr>
                            <th scope="row">uploaded-date</th>
                            <td>01-12-2020</td>
                          </tr>
                          <tr>
                            <th scope="row">uploaded-by</th>
                            <td>prityy abodh</td>
                          </tr>
                          <tr>
                            <th scope="row">image-width</th>
                            <td>1000</td>
                          </tr>
                          <tr>
                            <th scope="row">image-height</th>
                            <td>600</td>
                          </tr>
                          <tr>
                            <th scope="row">File-formate</th>
                            <td>jpg</td>
                          </tr>
                          <tr>
                            <th scope="row">File-location</th>
                            <td>storage/photos/image.jpg</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={8} lg={12} md={12}>
          <div className="multiside filedetails-slide mb-4">
            <Swiper navigation={true} dir={isRTL ? 'rtl' : 'ltr'} modules={[Autoplay, Navigation]} autoplay={{ delay: 2500, disableOnInteraction: false, }} breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 10 },
              480: { slidesPerView: 2, spaceBetween: 10 },
              640: { slidesPerView: 3, spaceBetween: 10 },
              768: { slidesPerView: 3, spaceBetween: 10 },
              1024: { slidesPerView: 4, spaceBetween: 10 },
            }} >
              <SwiperSlide>
                <Card className="custom-card overflow-hidden mb-0 ">
                  <Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`}><img src={ALLImages('filejpg6')} alt="img" /></Link>
                  <Card.Footer className="bd-t-0 py-3">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="mb-0">221.jpg</h6>
                      </div>
                      <div>
                        <h6 className="text-muted mb-0">120 KB</h6>
                      </div>
                    </div>
                  </Card.Footer>
                </Card>
              </SwiperSlide>
              <SwiperSlide>
                <Card className="custom-card overflow-hidden mb-0 ">
                  <Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`}><img src={ALLImages('filejpg5')} alt="img" /></Link>
                  <Card.Footer className="bd-t-0 py-3">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="mb-0">221.jpg</h6>
                      </div>
                      <div>
                        <h6 className="text-muted mb-0">120 KB</h6>
                      </div>
                    </div>
                  </Card.Footer>
                </Card>
              </SwiperSlide>
              <SwiperSlide>
                <Card className="custom-card overflow-hidden mb-0 ">
                  <Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`}><img src={ALLImages('filejpg4')} alt="img" /></Link>
                  <Card.Footer className="bd-t-0 py-3">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="mb-0">221.jpg</h6>
                      </div>
                      <div>
                        <h6 className="text-muted mb-0">120 KB</h6>
                      </div>
                    </div>
                  </Card.Footer>
                </Card>
              </SwiperSlide>
              <SwiperSlide>
                <Card className="custom-card overflow-hidden mb-0 ">
                  <Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`}><img src={ALLImages('filejpg2')} alt="img" /></Link>
                  <Card.Footer className="bd-t-0 py-3">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="mb-0">221.jpg</h6>
                      </div>
                      <div>
                        <h6 className="text-muted mb-0">120 KB</h6>
                      </div>
                    </div>
                  </Card.Footer>
                </Card>
              </SwiperSlide>
              <SwiperSlide>
                <Card className="custom-card overflow-hidden mb-0 ">
                  <Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`}><img src={ALLImages('filejpg1')} alt="img" /></Link>
                  <Card.Footer className="bd-t-0 py-3">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="mb-0">221.jpg</h6>
                      </div>
                      <div>
                        <h6 className="text-muted mb-0">120 KB</h6>
                      </div>
                    </div>
                  </Card.Footer>
                </Card>
              </SwiperSlide>
              <SwiperSlide>
                <Card className="custom-card overflow-hidden mb-0 ">
                  <Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`}><img src={ALLImages('filejpg3')} alt="img" /></Link>
                  <Card.Footer className="bd-t-0 py-3">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="mb-0">221.jpg</h6>
                      </div>
                      <div>
                        <h6 className="text-muted mb-0">120 KB</h6>
                      </div>
                    </div>
                  </Card.Footer>
                </Card>
              </SwiperSlide>
              <SwiperSlide>
                <Card className="custom-card overflow-hidden mb-0 ">
                  <Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`}><img src={ALLImages('filejpg9')} alt="img" /></Link>
                  <Card.Footer className="bd-t-0 py-3">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="mb-0">221.jpg</h6>
                      </div>
                      <div>
                        <h6 className="text-muted mb-0">120 KB</h6>
                      </div>
                    </div>
                  </Card.Footer>
                </Card>
              </SwiperSlide>
              <SwiperSlide>
                <Card className="custom-card overflow-hidden mb-0 ">
                  <Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`}><img src={ALLImages('filejpg8')} alt="img" /></Link>
                  <Card.Footer className="bd-t-0 py-3">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="mb-0">221.jpg</h6>
                      </div>
                      <div>
                        <h6 className="text-muted mb-0">120 KB</h6>
                      </div>
                    </div>
                  </Card.Footer>
                </Card>
              </SwiperSlide>
              <SwiperSlide>
                <Card className="custom-card overflow-hidden mb-0 ">
                  <Link to={`${import.meta.env.BASE_URL}apps/file/filedetails/`}><img src={ALLImages('filejpg7')} alt="img" /></Link>
                  <Card.Footer className="bd-t-0 py-3">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="mb-0">221.jpg</h6>
                      </div>
                      <div>
                        <h6 className="text-muted mb-0">120 KB</h6>
                      </div>
                    </div>
                  </Card.Footer>
                </Card>
              </SwiperSlide>
            </Swiper>
          </div>
        </Col>
        <Col xl={4} lg={12} md={12}>
          <Card className="custom-card recent-files">
            <Card.Body>
              <h5 className="mb-3">Recent Files</h5>
              <Row className="row row-sm">
                <Col lg={3} md={3} sm={6} className="col-12">
                  <Card className="glightbox">
                    <img src={ALLImages("filejpg8")} alt="img" height="100%" width="100%" onClick={() => setOpen(true)}/>
                  </Card>
                </Col>
                <Col lg={3} md={3} sm={6} className="col-12">
                  <Card className="glightbox">
                    <img src={ALLImages("filejpg6")} alt="img" height="100%" width="100%" onClick={() => setOpen(true)}/>
                  </Card>
                </Col>
                <Col lg={3} md={3} sm={6} className="col-12">
                  <Card className="glightbox">
                    <img src={ALLImages("filejpg7")} alt="img" height="100%" width="100%" onClick={() => setOpen(true)}/>
                  </Card>
                </Col>
                <Col lg={3} md={3} sm={6} className="col-12">
                  <Card className="glightbox">
                    <img src={ALLImages("filejpg2")} alt="img" height="100%" width="100%" onClick={() => setOpen(true)}/>
                  </Card>
                </Col>
                <Col lg={3} md={3} sm={6} className="col-12">
                  <Card className="glightbox">
                    <img src={ALLImages("filejpg5")} alt="img" height="100%" width="100%" onClick={() => setOpen(true)}/>
                  </Card>
                </Col>
                <Col lg={3} md={3} sm={6} className="col-12">
                  <Card className="glightbox">
                    <img src={ALLImages("filejpg4")} alt="img" height="100%" width="100%" onClick={() => setOpen(true)}/>
                  </Card>
                </Col>
                <Col lg={3} md={3} sm={6} className="col-12">
                  <Card className="glightbox">
                    <img src={ALLImages("filejpg3")} alt="img" height="100%" width="100%" onClick={() => setOpen(true)}/>
                  </Card>
                </Col>
                <Col lg={3} md={3} sm={6} className="col-12">
                  <Card className="glightbox">
                    <img src={ALLImages("filejpg9")} alt="img" height="100%" width="100%" onClick={() => setOpen(true)}/>
                  </Card>
                </Col>
                <Lightbox open={open} close={() => setOpen(false)} plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]} zoom={{
                maxZoomPixelRatio: 10,
                scrollToZoom: true
            }}
                slides={[{ src: ALLImages("filejpg8") }, { src: ALLImages("filejpg6") }, { src: ALLImages("filejpg7") }, { src: ALLImages("filejpg2") }, { src: ALLImages("filejpg5") }, { src: ALLImages("filejpg4") }, { src: ALLImages("filejpg3") }, { src: ALLImages("filejpg9") }]} />
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <!-- End Row --> */}
    </Fragment>
  )
};

export default Filedetails;
