import React, { Fragment } from 'react'
import { Form, OverlayTrigger, ProgressBar, Tooltip } from 'react-bootstrap'

const Rightside = () => {
  return (
    <Fragment>
      <div className="d-flex p-3">
        <div>
          <Form.Check defaultChecked type="checkbox" label="Hangout With friends" />
        </div>
        <span className="ms-auto">
          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Edit</Tooltip>}><i className="fe fe-edit-2 text-primary me-2"></i></OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Delete</Tooltip>}><i className="fe fe-trash-2 text-danger me-2"></i></OverlayTrigger>
        </span>
      </div>
      <div className="d-flex p-3 border-top">
        <div>
          <Form.Check type="checkbox" label="Prepare for presentation" />
        </div>
        <span className="ms-auto">
          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Edit</Tooltip>}><i className="fe fe-edit-2 text-primary me-2"></i></OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Delete</Tooltip>}><i className="fe fe-trash-2 text-danger me-2"></i></OverlayTrigger>
        </span>
      </div>
      <div className="d-flex p-3 border-top">
        <div>
          <Form.Check type="checkbox" label="Prepare for presentation" />
        </div>
        <span className="ms-auto">
          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Edit</Tooltip>}><i className="fe fe-edit-2 text-primary me-2"></i></OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Delete</Tooltip>}><i className="fe fe-trash-2 text-danger me-2"></i></OverlayTrigger>
        </span>
      </div>
      <div className="d-flex p-3 border-top">
        <div>
          <Form.Check defaultChecked type="checkbox" label="System Updated" />
        </div>
        <span className="ms-auto">
          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Edit</Tooltip>}><i className="fe fe-edit-2 text-primary me-2"></i></OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Delete</Tooltip>}><i className="fe fe-trash-2 text-danger me-2"></i></OverlayTrigger>
        </span>
      </div>
      <div className="d-flex p-3 border-top">
        <div>
          <Form.Check type="checkbox" label="Do something more" />
        </div>
        <span className="ms-auto">
          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Edit</Tooltip>}><i className="fe fe-edit-2 text-primary me-2"></i></OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Delete</Tooltip>}><i className="fe fe-trash-2 text-danger me-2"></i></OverlayTrigger>
        </span>
      </div>
      <div className="d-flex p-3 border-top">
        <div>
          <Form.Check type="checkbox" label="System Updated" />
        </div>
        <span className="ms-auto">
          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Edit</Tooltip>}><i className="fe fe-edit-2 text-primary me-2"></i></OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Delete</Tooltip>}><i className="fe fe-trash-2 text-danger me-2"></i></OverlayTrigger>
        </span>
      </div>
      <div className="d-flex p-3 border-top">
        <div>
          <Form.Check type="checkbox" label="Find an Idea" defaultChecked/>
        </div>
        <span className="ms-auto">
          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Edit</Tooltip>}><i className="fe fe-edit-2 text-primary me-2"></i></OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Delete</Tooltip>}><i className="fe fe-trash-2 text-danger me-2"></i></OverlayTrigger>
        </span>
      </div>
      <div className="d-flex p-3 border-top mb-0">
        <div>
          <Form.Check type="checkbox" label="Project review" defaultChecked/>
        </div>
        <span className="ms-auto">
          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Edit</Tooltip>}><i className="fe fe-edit-2 text-primary me-2"></i></OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Delete</Tooltip>}><i className="fe fe-trash-2 text-danger me-2"></i></OverlayTrigger>
        </span>
      </div>
      <h5 className="px-4 Overviews">Overview</h5>
      <div className="p-4">
        <div className="main-traffic-detail-item">
          <div>
            <span>Founder &amp; CEO</span> <span>24</span>
          </div>

          <ProgressBar variant="" className="mb-3 progress-sm progress-animate" max={100} min={0} now={30} />

        </div>
        <div className="main-traffic-detail-item">
          <div>
            <span>UX Designer</span> <span>1</span>
          </div>

          <ProgressBar variant="secondary" className="mb-3 progress-sm progress-animate" max={100} min={0} now={15} />
        </div>
        <div className="main-traffic-detail-item">
          <div>
            <span>Recruitment</span> <span>87</span>
          </div>

          <ProgressBar variant="success" className="mb-3 progress-sm progress-animate" max={100} min={0} now={45} />
          {/* <!-- progress --> */}
        </div>
        <div className="main-traffic-detail-item">
          <div>
            <span>Software Engineer</span> <span>32</span>
          </div>

          <ProgressBar variant="info" className="mb-3 progress-sm progress-animate" max={100} min={0} now={25} />
          {/* <!-- progress --> */}
        </div>
        <div className="main-traffic-detail-item">
          <div>
            <span>Project Manager</span> <span>32</span>
          </div>

          <ProgressBar variant="danger" className="mb-3 progress-sm progress-animate" max={100} min={0} now={25} />
          {/* <!-- progress --> */}
        </div>
      </div>
    </Fragment>
  )
}

export default Rightside
