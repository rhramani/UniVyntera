import { Fragment, useState } from "react";
import { Col, Row, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import ALLImages from "../../common/Imagedata";
import Pageheader from "../../layouts/Pageheader";

const Gallery = () => {
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <Pageheader mainheading='Gallery' parentfolder='Pages' activepage='Gallery' />

      <Row className="row-sm">
        <Col lg={12} md={12}>
          <Card className=" custom-card">
            <Card.Body>
              <div>
                <h6 className="main-content-label mb-1">Light Gallery</h6>
                <p className="text-muted card-sub-title">A customizable, modular, responsive, lightbox gallery plugin for jQuery.</p>
              </div>
              <Row>
                <Col lg={3} md={3} sm={6} className="col-12">
                  <Link to="#" onClick={() => setOpen(true)} className="glightbox card" data-gallery="gallery1">
                    <img src={ALLImages('media40')} alt="image"/>
                  </Link>
                </Col>
                <Col lg={3} md={3} sm={6} className="col-12">
                  <Link to="#" onClick={() => setOpen(true)} className="glightbox card" data-gallery="gallery1">
                    <img src={ALLImages('media41')} alt="image"/>
                  </Link>
                </Col>
                <Col lg={3} md={3} sm={6} className="col-12">
                  <Link to="#" onClick={() => setOpen(true)} className="glightbox card" data-gallery="gallery1">
                    <img src={ALLImages('media42')} alt="image"/>
                  </Link>
                </Col>
                <Col lg={3} md={3} sm={6} className="col-12">
                  <Link to="#" onClick={() => setOpen(true)} className="glightbox card border-0" data-gallery="gallery1">
                    <img src={ALLImages('media43')} alt="image"/>
                  </Link>
                </Col>
                <Col lg={3} md={3} sm={6} className="col-12">
                  <Link to="#" onClick={() => setOpen(true)} className="glightbox card" data-gallery="gallery1">
                    <img src={ALLImages('media44')} alt="image"/>
                  </Link>
                </Col>
                <Col lg={3} md={3} sm={6} className="col-12">
                  <Link to="#" onClick={() => setOpen(true)} className="glightbox card" data-gallery="gallery1">
                    <img src={ALLImages('media45')} alt="image"/>
                  </Link>
                </Col>
                <Col lg={3} md={3} sm={6} className="col-12">
                  <Link to="#" onClick={() => setOpen(true)} className="glightbox card" data-gallery="gallery1">
                    <img src={ALLImages('media46')} alt="image"/>
                  </Link>
                </Col>
                <Col lg={3} md={3} sm={6} className="col-12">
                  <Link to="#" onClick={() => setOpen(true)} className="glightbox card" data-gallery="gallery1">
                    <img src={ALLImages('media60')} alt="image"/>
                  </Link>
                </Col>
                <Lightbox open={open} close={() => setOpen(false)} plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]} zoom={{
                maxZoomPixelRatio: 10,
                scrollToZoom: true
            }}
                slides={[{ src: ALLImages("media40") }, { src: ALLImages("media41") }, { src: ALLImages("media42") }, { src: ALLImages("media43") }, { src: ALLImages("media44") }, { src: ALLImages("media45") }, { src: ALLImages("media46") }, { src: ALLImages("media60") }]} />
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
};

export default Gallery;
