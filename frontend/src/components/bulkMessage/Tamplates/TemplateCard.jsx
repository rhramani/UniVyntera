import React from 'react';
import { FaRegTrashAlt, FaCheckCircle } from 'react-icons/fa';
import TemplatePicture from '../../../assets/images/template image/Picture.png';
import TemplateVideo from '../../../assets/images/template image/video.png';
import TemplateDocs from '../../../assets/images/template image/document.png';
import { Form } from 'react-bootstrap';

const TemplateCard = ({
  template,
  onDelete,
  showDelete = true,
  showRadio = true,
  radioValue,
  selectedValue,
  onRadioChange
}) => {
  const body = template.components.find(c => c.type === 'BODY');
  const header = template.components.find(c => c.type === 'HEADER');
  const footer = template.components.find(c => c.type === 'FOOTER');
  const buttons = template.components.find(c => c.type === 'BUTTONS')?.buttons || [];

  const hasCallNow = buttons.some(btn => btn.type === 'PHONE_NUMBER');
  const hasVisitWebsite = buttons.some(btn => btn.type === 'URL');

  const mediaUrl =
    header?.format === 'IMAGE'
      ? TemplatePicture
      : header?.format === 'VIDEO'
        ? TemplateVideo
        : header?.format === 'DOCUMENT'
          ? TemplateDocs
          : null;

  return (
    <div className="card h-100" style={{ minHeight: '555px', border: '1px solid #ccc', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      {(showRadio || showDelete) && (
        <div className="position-absolute top-0 end-0 p-2 d-flex align-items-center gap-2">
          {showRadio && (
            <Form.Check
              type="radio"
              className="custom-radio-border"
              value={radioValue}
              checked={selectedValue === radioValue}
              onChange={onRadioChange}
              style={{ cursor: 'pointer' }}
            />
          )}
          {showDelete && (
            <FaRegTrashAlt
              color="#e53e3e"
              size={16}
              style={{ cursor: 'pointer' }}
              onClick={onDelete}
            />
          )}
        </div>
      )}
      <div className="card-body d-flex flex-column">
        <h6 className="card-title mb-2">
          Name: <span className="fw-normal">{template.name} ({template.language})</span>
        </h6>

        {template.status !== 'APPROVED' && (
          <div className="d-flex align-items-center mb-2 text-warning">
            <FaCheckCircle className="me-1" />
            <small>Template Status: {template.status}</small>
          </div>
        )}

        {header?.format === 'TEXT' && (
          <h6 className="card-title mb-2">{header.text}</h6>
        )}

        {mediaUrl && (
          <div className="d-flex justify-content-center my-4">
            <img src={mediaUrl} alt="Template media" className="rounded" style={{ width: '200px' }} />
          </div>
        )}

        {body && (
          <p className="card-text small mb-2" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
            {body.text}
          </p>
        )}

        {footer?.text && (
          <p className="card-text text-muted small mt-2 mb-auto">
            {footer.text}
          </p>
        )}

        {(hasCallNow || hasVisitWebsite) && (
          <div className="mt-auto pt-2 border-top d-flex gap-2 justify-content-between">
            <span
              className="text-center flex-fill"
              style={{ color: '#2F80ED', opacity: hasCallNow ? 1 : 0.4 }}
            >
              Call Now
            </span>
            <span
              className="text-center flex-fill"
              style={{ color: '#2F80ED', opacity: hasVisitWebsite ? 1 : 0.4 }}
            >
              Visit Website
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateCard;