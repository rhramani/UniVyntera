import { Fragment } from "react";
import { Breadcrumb } from "react-bootstrap";

const Pageheader = (props) => {
  return (
    <Fragment>
      <div className="d-md-flex d-block align-items-center justify-content-between page-header-breadcrumb">
        <div>
          <h2 className="main-content-title fs-24 mb-1 text-dark">
            {props.mainheading}
          </h2>
          <Breadcrumb className="my-0" bsPrefix="breadcrumb mb-0">
            <Breadcrumb.Item>{props.parentfolder}</Breadcrumb.Item>
            <Breadcrumb.Item active>{props.activepage}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="d-flex">
          <div className="justify-content-center">
            {/* <button
              type="button"
              className="btn btn-white btn-icon-text my-2 me-3 d-inline-flex align-items-center"
            >
              <i className="fe fe-download me-2 fs-14"></i> Import
            </button>
            <button
              type="button"
              className="btn btn-white btn-icon-text my-2 me-3 d-inline-flex align-items-center"
            >
              <i className="fe fe-filter me-2 fs-14"></i> Filter
            </button> */}
            {/* <button
              type="button"
              className="custom-select-height btn btn-primary my-2 btn-icon-text d-inline-flex align-items-center"
            >
              <i className="fe fe-download-cloud me-2 fs-14"></i> Download
              Report
            </button> */}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Pageheader;
