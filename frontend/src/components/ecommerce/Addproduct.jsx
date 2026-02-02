import { Fragment, useState } from "react";
import { Card, Col, FormGroup, Row, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Select from 'react-select'
import SunEditor from 'suneditor-react';
import { ProductCategory } from "../../common/Select2data";

import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import Pageheader from "../../layouts/Pageheader";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

const AddProduct = () => {
  const [files, setFiles] = useState([])
  return (

    <Fragment>
      <Pageheader mainheading='Add-Product' parentfolder='ECommerce' activepage='Add-Product' />

      <Row className="row-sm">
        <Col lg={12} md={12}>
          <Card className="custom-card">
            <Card.Body>
              <FormGroup className="form-group">
                <Form.Label className="tx-medium">Product Name</Form.Label>
                <input type="text" className="form-control" placeholder="Name" />
              </FormGroup>
              <FormGroup className="form-group">
                <Form.Label className="tx-medium">Category</Form.Label>
                <Select options={ProductCategory} classNamePrefix="Select2" placeholder="Any" />
              </FormGroup>
              <FormGroup className="form-group">
                <Form.Label className="tx-medium">Price</Form.Label>
                <input type="text" className="form-control" placeholder="Price" />
              </FormGroup>
              <div className="ql-wrapper ql-wrapper-demo mb-3">
                <Form.Label className="tx-medium">Product Description</Form.Label>
                <div id="quillEditor">
                <SunEditor/>
                </div>
              </div>
              <Form.Label className="tx-medium">Upload Product</Form.Label>
              <div className="p-4 border rounded-6 mb-0 form-group">
                <FilePond files={files} onupdatefiles={setFiles} allowMultiple={true} maxFiles={3} server="/api" name="files"
                          labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>' />
               
              </div>
            </Card.Body>
            <div className="card-footer">
              <Link to="#" className="btn btn-primary  me-1">
                Add Product
              </Link>
              <Link to="#" className="btn btn-danger">
                Cancel
              </Link>
            </div>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default AddProduct;
