import { Fragment, useState } from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { Uploader } from "uploader";
import { UploadButton } from "react-uploader";
import Pageheader from '../../../layouts/Pageheader';

registerPlugin(FilePondPluginImagePreview, FilePondPluginImageExifOrientation );

const FileUploads = () => {

  const [files, setFiles] = useState([]);


  const uploader = Uploader({
     // Get production API keys from Upload.io
     apiKey: "free"
   });

     //showcode

  const [isHidden, setisHidden] = useState([false]);
  const toggleHidden = (index) => {
    const updatedHidden = [...isHidden];
    updatedHidden[index] = !updatedHidden[index];
    setisHidden(updatedHidden);
  };

  return (
    <Fragment>
      <Pageheader mainheading='File Uploads' parentfolder='Form Elements' activepage='File Uploads' />

      {/* <!-- Start:: row-1 --> */}
      <Row className="row-sm">
        <Col xl={6}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'> Bootstrap File Input </div>
              <div className="prism-toggle">
                    <button className="btn btn-sm btn-primary-light" onClick={() => toggleHidden(0)}>Show Code<i className={`${isHidden[0] ? 'ri-eye-off-line' : 'ri-eye-line'} ms-2 d-inline-block align-middle fs-14 `}></i></button>
                  </div>
            </Card.Header>
            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>
              <div className="mb-3">
                <Form.Label htmlFor="formFile">Default file input example</Form.Label>
                <Form.Control type="file" id="formFile" />
              </div>
              <div className="mb-3">
                <Form.Label htmlFor="formFileMultiple">Multiple files input example</Form.Label>
                <Form.Control type="file" id="formFileMultiple" />
              </div>
              <div className="mb-3">
                <Form.Label htmlFor="formFileDisabled">Disabled file input example</Form.Label>
                <Form.Control type="file" id="formFileDisabled" disabled />
              </div>
              <div className="mb-3">
                <Form.Label htmlFor="formFileSm">Small file input example</Form.Label>
                <Form.Control className="form-control-sm" id="formFileSm" type="file" />
              </div>
              <div>
                <Form.Label htmlFor="formFileLg">Large file input example</Form.Label>
                <Form.Control className="form-control-lg" id="formFileLg" type="file" />
              </div>
            </Card.Body>
            <div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0 `}>
              <pre><code className='language-javascript'>
                {`
        <Card.Body>
        <div className="mb-3">
        <Form.Label htmlFor="formFile">Default file input example</Form.Label>
        <Form.Control type="file" id="formFile" />
      </div>
      <div className="mb-3">
        <Form.Label htmlFor="formFileMultiple">Multiple files input example</Form.Label>
        <Form.Control type="file" id="formFileMultiple" />
      </div>
      <div className="mb-3">
        <Form.Label htmlFor="formFileDisabled">Disabled file input example</Form.Label>
        <Form.Control type="file" id="formFileDisabled" disabled />
      </div>
      <div className="mb-3">
        <Form.Label htmlFor="formFileSm">Small file input example</Form.Label>
        <Form.Control className="form-control-sm" id="formFileSm" type="file" />
      </div>
      <div>
        <Form.Label htmlFor="formFileLg">Large file input example</Form.Label>
        <Form.Control className="form-control-lg" id="formFileLg" type="file" />
      </div>
        </Card.Body>
                `}
              </code></pre>
            </div>
          </Card>
        </Col>
        <Col xl={6}>
          <h6 className="mb-3">Filepond:</h6>
          <Row>
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header>
                  <div className='card-title'> Multiple Upload </div>
                </Card.Header>
                <Card.Body>
                <FilePond className = "multiple-filepond" accepted-file-types={["application/pdf","image/png", "image/jpeg", "image/gif"]}
                server="/api" allowReorder={true} files={files} onupdatefiles={setFiles} allowMultiple={true} allowImagePreview={true} maxFiles={10} name="filepond"  
                labelIdle='Drag & Drop your files or <span className="filepond--label-action">Browse</span>'/>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header>
                  <div className='card-title'> circular File Upload </div>
                </Card.Header>
                <Card.Body>
                <FilePond className = "filepond single-fileupload " labelIdle='Drag & Drop your files'
                 stylePanelLayout= 'compact circle' styleLoadIndicatorPosition= 'center bottom'  styleButtonRemoveItemPosition= 'center bottom'/>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      {/* <!-- End:: row-1 --> */}

      {/* <!-- Start:: row-2 --> */}
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header>
              <div className='card-title'> React - Uploader </div>
            </Card.Header>
            <Card.Body>
            <UploadButton uploader={uploader}
                                  options={{ multi: true }}
                                  onComplete={files => console.log(files)}>
                                  {({ onClick }) =>
                                     <input className='file_input text-center react-input-uploader' onClick={onClick} placeholder='click here and upload attachment' />
                                   }
                                </UploadButton>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* <!-- End:: row-2 --> */}
    </Fragment>
  )
}

export default FileUploads
